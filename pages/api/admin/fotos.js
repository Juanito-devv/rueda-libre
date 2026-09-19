import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

export default async function handler(req, res) {
  const { error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  const path = typeof req.query.path === 'string' ? req.query.path : '';
  if (!path) return res.status(400).json({ error: 'Falta el parámetro path' });

  const { data, error: e } = await supabaseAdmin()
    .storage.from('reservas')
    .createSignedUrl(path, 3600);
  if (e || !data?.signedUrl) {
    return res.status(500).json({ error: e?.message || 'No se pudo generar la URL' });
  }
  return res.status(200).json({ url: data.signedUrl });
}