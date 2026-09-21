import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

async function attachVehicleNames(rows) {
  if (!rows || rows.length === 0) return [];
  const ids = [...new Set(rows.map((r) => r.vehiculo).filter(Boolean))];
  const { data: vehicles } = await supabaseAdmin()
    .from('vehiculos')
    .select('id_vehiculo, marca, modelo')
    .in('id_vehiculo', ids);
  const vehMap = {};
  (vehicles || []).forEach((v) => {
    vehMap[v.id_vehiculo] = v;
  });
  return rows.map((r) => ({
    ...r,
    vehiculo_nombre: vehMap[r.vehiculo] ? `${vehMap[r.vehiculo].marca} ${vehMap[r.vehiculo].modelo}` : null,
  }));
}

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);

  const sb = supabaseAdmin();

  if (req.method === 'GET') {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const vehiculo = typeof req.query.vehiculo === 'string' ? req.query.vehiculo.trim() : '';

    const { data: vehList, error: ve } = await sb.from('vehiculos').select('id_vehiculo, marca, modelo');
    if (ve) return res.status(500).json({ error: ve.message });
    const vehicles = (vehList || []).map((v) => ({
      id: v.id_vehiculo,
      nombre: `${v.marca} ${v.modelo}`,
    }));

    if (q) {
      const pattern = `%${q}%`;
      const eqs = (query) =>
        query.or(`numero.ilike.${pattern},nombre_cliente.ilike.${pattern},cedula.ilike.${pattern},telefono.ilike.${pattern}`);

      let aq = sb.from('reservas').select('*');
      let hq = sb.from('reservas_historial').select('*');
      if (vehiculo) {
        aq = aq.eq('vehiculo', vehiculo);
        hq = hq.eq('vehiculo', vehiculo);
      }
      const { data: activas, error: e1 } = await eqs(aq).order('creado_en', { ascending: false }).limit(100);
      const { data: archivadas, error: e2 } = await eqs(hq).order('archivado_en', { ascending: false }).limit(100);
      if (e1 || e2) return res.status(500).json({ error: e1?.message || e2?.message });

      const activasNombre = await attachVehicleNames(activas || []);
      const archivadasNombre = await attachVehicleNames(archivadas || []);
      const reservations = [
        ...activasNombre.map((r) => ({ ...r, archivo: false })),
        ...archivadasNombre.map((r) => ({ ...r, archivo: true })),
      ];
      return res.status(200).json({ reservations, vehicles, rol, buscando: true });
    }

    const estado = typeof req.query.estado === 'string' ? req.query.estado : 'pendiente';
    let query = sb
      .from('reservas')
      .select('*')
      .eq('estado', estado);
    if (vehiculo) query = query.eq('vehiculo', vehiculo);
    const { data: rows, error: e1 } = await query
      .order('creado_en', { ascending: true })
      .limit(200);
    if (e1) return res.status(500).json({ error: e1.message });

    const list = await attachVehicleNames(rows || []);
    return res.status(200).json({ reservations: list, vehicles, rol });
  }

  if (req.method === 'POST') {
    const { id, action, notes } = req.body || {};
    if (!id || !action) return res.status(400).json({ error: 'Faltan id o acción.' });

    const reviewer = user?.email || user?.id || 'personal';

    try {
      if (action === 'confirm') {
        const { data, error: e } = await sb
          .from('reservas')
          .update({ estado: 'confirmada' })
          .eq('id', id)
          .select()
          .single();
        if (e) throw e;
        return res.status(200).json({ reservation: data });
      }

      if (action === 'reject') {
        const { error: e } = await sb.rpc('archivar_reserva', { p_id: id, p_motivo: 'rechazada' });
        if (e) throw e;
        return res.status(200).json({ ok: true });
      }

      if (action === 'cancel') {
        const { error: e } = await sb.rpc('archivar_reserva', { p_id: id, p_motivo: 'cancelada' });
        if (e) throw e;
        return res.status(200).json({ ok: true });
      }

      if (action === 'start') {
        const { data, error: e } = await sb
          .from('reservas')
          .update({ estado: 'en_curso' })
          .eq('id', id)
          .select()
          .single();
        if (e) throw e;
        return res.status(200).json({ reservation: data });
      }

      if (action === 'finish') {
        const { data, error: e } = await sb
          .from('reservas')
          .update({
            estado: 'revision',
            revision_ok: null,
            revision_en: null,
            revision_por: null,
          })
          .eq('id', id)
          .select()
          .single();
        if (e && /column .* does not exist/i.test(e.message)) {
          const retry = await sb
            .from('reservas')
            .update({ estado: 'revision' })
            .eq('id', id)
            .select()
            .single();
          if (retry.error) throw retry.error;
          return res.status(200).json({ reservation: retry.data });
        }
        if (e) throw e;
        return res.status(200).json({ reservation: data });
      }

      if (action === 'approve_revision') {
        const revisionFields = {
          estado: 'revision',
          revision_ok: true,
          revision_notas: typeof notes === 'string' ? notes.trim().slice(0, 500) : null,
          revision_por: reviewer,
          revision_en: new Date().toISOString(),
        };
        const { data, error: e } = await sb.from('reservas').update(revisionFields).eq('id', id).select().single();
        if (e && /column .* does not exist/i.test(e.message)) {
          const { error: rpcErr } = await sb.rpc('archivar_reserva', { p_id: id, p_motivo: 'finalizada' });
          if (rpcErr) throw rpcErr;
          return res.status(200).json({ ok: true });
        }
        if (e) throw e;
        const { error: rpcErr } = await sb.rpc('archivar_reserva', { p_id: id, p_motivo: 'finalizada' });
        if (rpcErr) throw rpcErr;
        return res.status(200).json({ ok: true, reservation: data });
      }

      if (action === 'revision_reject') {
        const { data, error: e } = await sb
          .from('reservas')
          .update({
            estado: 'en_curso',
            revision_ok: false,
            revision_notas: typeof notes === 'string' ? notes.trim().slice(0, 500) : null,
            revision_por: reviewer,
            revision_en: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        if (e && /column .* does not exist/i.test(e.message)) {
          const retry = await sb.from('reservas').update({ estado: 'en_curso' }).eq('id', id).select().single();
          if (retry.error) throw retry.error;
          return res.status(200).json({ reservation: retry.data });
        }
        if (e) throw e;
        return res.status(200).json({ reservation: data });
      }

      return res.status(400).json({ error: `Acción desconocida: ${action}` });
    } catch (err) {
      console.error('admin.reservas.action', err);
      return res.status(500).json({ error: err.message || 'Error al procesar la acción' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}