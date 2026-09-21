import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

const RANGES = {
  semana: { days: 7, label: 'Últimos 7 días' },
  mes: { days: 30, label: 'Últimos 30 días' },
  semestre: { days: 180, label: 'Últimos 6 meses' },
};

function sinceDate(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString();
}

function extraName(x) {
  if (!x) return null;
  if (typeof x === 'string') return x;
  return x.name || x.id || null;
}

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  const rango = typeof req.query.rango === 'string' && RANGES[req.query.rango] ? req.query.rango : 'mes';
  const { days, label } = RANGES[rango];
  const since = sinceDate(days);
  const sb = supabaseAdmin();

  try {
    const [resActivas, resHistorial, veh] = await Promise.all([
      sb.from('reservas').select('*').in('estado', ['confirmada', 'en_curso', 'revision']).gte('creado_en', since).limit(500),
      sb.from('reservas_historial').select('*').gte('archivado_en', since).limit(500),
      sb.from('vehiculos').select('id_vehiculo, marca, modelo'),
    ]);
    if (resActivas.error) throw resActivas.error;

    const historial =
      resHistorial.error && /does not exist/i.test(resHistorial.error.message) ? [] : resHistorial.data || [];

    const vehMap = {};
    (veh.data || []).forEach((v) => { vehMap[v.id_vehiculo] = v; });
    const vname = (id) => (vehMap[id] ? `${vehMap[id].marca} ${vehMap[id].modelo}` : '—');

    const confirmadas = resActivas.data || [];
    const completadas = (historial || []).filter((r) => r.motivo === 'finalizada');
    const canceladas = (historial || []).filter((r) => ['cancelada', 'rechazada', 'vencida'].includes(r.motivo));

    const ingresos = [...confirmadas, ...completadas].reduce((s, r) => s + (Number(r.total) || 0), 0);
    const alquileres = confirmadas.length + completadas.length;
    const promedio_dia = alquileres > 0 ? ingresos / days : 0;

    const porAuto = new Map();
    [...confirmadas, ...completadas].forEach((r) => {
      const id = r.vehiculo || '—';
      const cur = porAuto.get(id) || { vehiculo: id, conteo: 0, ingresos: 0 };
      cur.conteo += 1;
      cur.ingresos += Number(r.total) || 0;
      porAuto.set(id, cur);
    });
    const autos = [...porAuto.values()]
      .map((a) => ({ ...a, nombre: vname(a.vehiculo) }))
      .sort((a, b) => b.conteo - a.conteo || b.ingresos - a.ingresos)
      .slice(0, 5);

    const porExtra = new Map();
    [...confirmadas, ...completadas].forEach((r) => {
      (r.extras || []).forEach((x) => {
        const name = extraName(x);
        if (!name) return;
        porExtra.set(name, (porExtra.get(name) || 0) + 1);
      });
    });
    const extras = [...porExtra.entries()]
      .map(([name, conteo]) => ({ name, conteo }))
      .sort((a, b) => b.conteo - a.conteo)
      .slice(0, 5);

    return res.status(200).json({
      rol,
      rango,
      label,
      desde: since.split('T')[0],
      stats: { ingresos, alquileres, canceladas: canceladas.length, promedio_dia, autos, extras },
    });
  } catch (e) {
    console.error('admin.dashboard', e);
    return res.status(500).json({ error: e.message });
  }
}