import { supabaseAdmin } from '../../src/lib/supabaseAdmin';
import { isRangeFree } from '../../src/utils/disponibilidad';

const ACTIVE_STATES = ['pendiente', 'confirmada', 'en_curso', 'revision'];

function validDate(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v || ''));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { vehiculo, desde, hasta } = req.query;
  try {
    let query = supabaseAdmin()
      .from('reservas')
      .select('id, vehiculo, pickup_date, return_date, estado')
      .in('estado', ACTIVE_STATES);

    if (vehiculo && String(vehiculo).trim()) {
      query = query.eq('vehiculo', String(vehiculo).trim());
    }

    const { data, error } = await query;
    if (error) throw error;

    let ranges = (data || []).map((r) => ({
      vehiculo: r.vehiculo,
      pickup_date: r.pickup_date.split('T')[0],
      return_date: r.return_date.split('T')[0],
      estado: r.estado,
    }));

    if (validDate(desde) && validDate(hasta)) {
      ranges = ranges.filter((r) => !isRangeFree(desde, hasta, [r]));
    }

    return res.status(200).json({ ranges });
  } catch (e) {
    console.error('[disponibilidad]', e.message);
    return res.status(500).json({ error: 'No se pudo consultar la disponibilidad', ranges: [] });
  }
}