import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

function validDate(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v || ''));
}

function dayKey(d) {
  return String(d).split('T')[0];
}

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  const { desde, hasta } = req.query;
  if (!validDate(desde) || !validDate(hasta)) {
    return res.status(400).json({ error: 'Faltan desde/hasta (YYYY-MM-DD).' });
  }

  const sb = supabaseAdmin();

  try {
    const [resActivas, resHistorial, veh] = await Promise.all([
      sb.from('reservas').select('*').order('pickup_date', { ascending: true }).limit(500),
      sb.from('reservas_historial').select('*').order('pickup_date', { ascending: true }).limit(500),
      sb.from('vehiculos').select('id_vehiculo, marca, modelo'),
    ]);

    if (resActivas.error) throw resActivas.error;
    if (resHistorial.error && !/does not exist/i.test(resHistorial.error.message)) throw resHistorial.error;

    const vehMap = {};
    (veh.data || []).forEach((v) => { vehMap[v.id_vehiculo] = v; });

    const inRange = (r) => {
      const pk = dayKey(r.pickup_date);
      const rt = dayKey(r.return_date);
      const solapado = (pk && pk <= hasta && rt && rt >= desde) || (rt && rt <= hasta && rt >= desde) || (pk && pk <= hasta && pk >= desde);
      return solapado;
    };

    const mapRow = (r, archivo) => ({
      ...r,
      pickup_d: dayKey(r.pickup_date),
      return_d: dayKey(r.return_date),
      archivo,
      vehiculo_nombre: vehMap[r.vehiculo] ? `${vehMap[r.vehiculo].marca} ${vehMap[r.vehiculo].modelo}` : null,
    });

    const reservas = (resActivas.data || []).filter(inRange).map((r) => mapRow(r, false));
    const historial = (resHistorial.data || []).filter(inRange).map((r) => mapRow(r, true));

    return res.status(200).json({ reservas, historial, rol });
  } catch (e) {
    console.error('admin.calendario', e);
    return res.status(500).json({ error: e.message });
  }
}