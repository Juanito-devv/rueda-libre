import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);

  const sb = supabaseAdmin();

  if (req.method === 'GET') {
    const estado = typeof req.query.estado === 'string' ? req.query.estado : 'pendiente';
    const { data: rows, error: e1 } = await sb
      .from('reservas')
      .select('*')
      .eq('estado', estado)
      .order('creado_en', { ascending: true })
      .limit(200);
    if (e1) return res.status(500).json({ error: e1.message });

    const { data: vehicles } = await sb
      .from('vehiculos')
      .select('id_vehiculo, marca, modelo, precio_dia');
    const vehMap = {};
    (vehicles || []).forEach((v) => {
      vehMap[v.id_vehiculo] = v;
    });

    const list = (rows || []).map((r) => ({
      ...r,
      vehiculo_nombre: vehMap[r.vehiculo] ? `${vehMap[r.vehiculo].marca} ${vehMap[r.vehiculo].modelo}` : null,
    }));

    return res.status(200).json({ reservations: list, rol });
  }

  if (req.method === 'POST') {
    const { id, action } = req.body || {};
    if (!id || !action) return res.status(400).json({ error: 'Faltan id o acción.' });

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
        const { error: e } = await sb.rpc('archivar_reserva', { p_id: id, p_motivo: 'finalizada' });
        if (e) throw e;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: `Acción desconocida: ${action}` });
    } catch (err) {
      console.error('admin.reservas.action', err);
      return res.status(500).json({ error: err.message || 'Error al procesar la acción' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}