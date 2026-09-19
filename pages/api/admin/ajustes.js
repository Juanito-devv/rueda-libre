import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);

  const sb = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error: e } = await sb.from('ajustes').select('*').order('creado_en', { ascending: true });
    if (e) return res.status(500).json({ error: e.message });
    return res.status(200).json({ ajustes: data || [] });
  }

  if (req.method === 'PATCH') {
    if (rol !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede editar los datos de pago' });
    const { id, ...changes } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Falta el id' });
    const update = {};
    if (changes.metodo_pago !== undefined) update.metodo_pago = String(changes.metodo_pago).trim();
    if (changes.descripcion !== undefined) update.descripcion = String(changes.descripcion).trim();
    if (changes.activo !== undefined) update.activo = Boolean(changes.activo);
    const { data, error: e } = await sb.from('ajustes').update(update).eq('id', id).select().single();
    if (e) return res.status(500).json({ error: e.message });
    return res.status(200).json({ ajuste: data });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}