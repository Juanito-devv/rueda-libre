import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { sendOwnerNotification, buildExpiryOwnerMessage } from '../../../src/utils/notify';

function authorized(req) {
  const sec = process.env.CRON_SECRET;
  if (!sec) return false;
  if (req.headers['x-cron-secret'] === sec) return true;
  if ((req.headers.authorization || '').replace(/^Bearer\s+/i, '') === sec) return true;
  if (typeof req.query.secret === 'string' && req.query.secret === sec) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  if (!authorized(req)) return res.status(401).json({ error: 'No autorizado' });

  const sb = supabaseAdmin();

  try {
    const { data: vencidas, error: e1 } = await sb
      .from('reservas')
      .select('*')
      .eq('estado', 'pendiente')
      .eq('forma_pago', 'sitio')
      .lt('expira_en', new Date().toISOString())
      .limit(100);
    if (e1) throw e1;

    let vehiculoMap = {};
    const { data: vehiculos } = await sb.from('vehiculos').select('id_vehiculo, marca, modelo');
    (vehiculos || []).forEach((v) => {
      vehiculoMap[v.id_vehiculo] = v;
    });

    const archivadas = [];
    const avisos = [];

    for (const r of vencidas || []) {
      const { error: e2 } = await sb.rpc('archivar_reserva', { p_id: r.id, p_motivo: 'vencida' });
      if (e2) {
        console.error('cron.vencidas.archivar', r.id, e2.message);
        continue;
      }
      archivadas.push(r.numero);
      const vehicle = vehiculoMap[r.vehiculo];
      const res = await sendOwnerNotification(
        buildExpiryOwnerMessage({
          reservation: r,
          vehicle: vehicle
            ? { id: vehicle.id_vehiculo, name: `${vehicle.marca} ${vehicle.modelo}` }
            : null,
        })
      );
      avisos.push({ numero: r.numero, notify: res.ok ? 'enviado' : res.skipped ? 'omitido' : `error: ${res.reason || 'desconocido'}` });
    }

    return res.status(200).json({ archivadas, avisos, total: archivadas.length });
  } catch (e) {
    console.error('cron.vencidas', e);
    return res.status(500).json({ error: e.message });
  }
}