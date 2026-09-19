import { supabaseAdmin } from '../../src/lib/supabaseAdmin';
import { getBookingDays } from '../../src/utils/booking';
import { extras } from '../../src/data/vehicles';
import { rowToVehicle } from '../../src/lib/vehicles';
import { sendOwnerNotification, buildOwnerReservationMessage } from '../../src/utils/notify';

export const config = {
  api: { bodyParser: { sizeLimit: '30mb' } },
};

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const VALID_FORMAS = ['comprobante', 'sitio'];
const FILES_NEEDED = {
  comprobante: 'comprobante de pago',
  licencia: 'licencia de conducir',
  cedula: 'cédula o RIF',
};

function uid() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function makeNumero() {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    const numero = `RL-${year}-${uid()}`;
    const { data } = await supabaseAdmin()
      .from('reservas')
      .select('id')
      .eq('numero', numero)
      .maybeSingle();
    if (!data) return numero;
  }
  return `RL-${year}-${Date.now().toString(36).toUpperCase()}`;
}

async function uploadReservationFile(folder, filename, base64, contentType) {
  const buf = Buffer.from(String(base64 || '').trim().replace(/^data:.*?;base64,/, ''), 'base64');
  if (!buf.length) return { error: 'El archivo está vacío.' };
  if (buf.length > MAX_FILE_BYTES) return { error: 'El archivo supera los 5 MB.' };
  const path = `${folder}/${filename}`;
  const { error } = await supabaseAdmin()
    .storage.from('reservas')
    .upload(path, buf, { contentType: contentType || 'image/jpeg', upsert: false });
  if (error) return { error: error.message };
  return { path };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const sb = supabaseAdmin();

  try {
    const b = req.body || {};
    const {
      vehicle_id,
      name,
      document,
      phone,
      email,
      clientType,
      pickupDate,
      returnDate,
      location,
      selectedExtras,
      formaPago,
      pagoMetodoId,
      files,
    } = b;

    if (!vehicle_id || !name || !phone || !pickupDate || !returnDate) {
      return res.status(400).json({ error: 'Faltan datos obligatorios de la reserva.' });
    }
    if (!VALID_FORMAS.includes(formaPago)) {
      return res.status(400).json({ error: 'Forma de pago inválida.' });
    }

    const days = getBookingDays(pickupDate, returnDate);
    if (!days) return res.status(400).json({ error: 'Las fechas de la reserva son inválidas.' });

    const { data: vehiculo, error: errV } = await sb
      .from('vehiculos')
      .select('*')
      .eq('id_vehiculo', vehicle_id)
      .maybeSingle();
    if (errV) throw errV;
    if (!vehiculo || !vehiculo.activo || vehiculo.bloqueado) {
      return res.status(404).json({ error: 'El vehículo no está disponible en este momento.' });
    }

    const extraIds = Array.isArray(selectedExtras) ? selectedExtras : [];
    const extrasTotal = extraIds.reduce((t, id) => {
      const extra = extras.find((e) => e.id === id);
      return t + (extra ? extra.price * days : 0);
    }, 0);
    const total = Math.round(((Number(vehiculo.precio_dia) || 0) * days + extrasTotal) * 100) / 100;

    let pagoMetodo = null;
    if (formaPago === 'comprobante') {
      if (!pagoMetodoId) {
        return res.status(400).json({ error: 'Selecciona un método de pago.' });
      }
      const { data: metodo } = await sb.from('ajustes').select('*').eq('id', pagoMetodoId).maybeSingle();
      if (!metodo || !metodo.activo) {
        return res.status(400).json({ error: 'El método de pago seleccionado no es válido.' });
      }
      pagoMetodo = metodo.metodo_pago;
    }

    const numero = await makeNumero();
    const folder = numero;

    let comprobanteUrl = null;
    let licenciaUrl = null;
    let cedulaFotoUrl = null;
    if (formaPago === 'comprobante') {
      for (const key of Object.keys(FILES_NEEDED)) {
        const f = files && files[key];
        if (!f || !f.data) {
          return res.status(400).json({ error: `Debes adjuntar el archivo de ${FILES_NEEDED[key]}.` });
        }
      }
      const upA = await uploadReservationFile(folder, `comprobante-${Date.now()}`, files.comprobante.data, files.comprobante.type);
      if (upA.error) return res.status(400).json({ error: `Comprobante: ${upA.error}` });
      comprobanteUrl = upA.path;
      const upB = await uploadReservationFile(folder, `licencia-${Date.now()}`, files.licencia.data, files.licencia.type);
      if (upB.error) {
        await supabaseAdmin().storage.from('reservas').remove([comprobanteUrl]).catch(() => {});
        return res.status(400).json({ error: `Licencia: ${upB.error}` });
      }
      licenciaUrl = upB.path;
      const upC = await uploadReservationFile(folder, `cedula-${Date.now()}`, files.cedula.data, files.cedula.type);
      if (upC.error) {
        await supabaseAdmin().storage.from('reservas').remove([comprobanteUrl, licenciaUrl]).catch(() => {});
        return res.status(400).json({ error: `Cédula/RIF: ${upC.error}` });
      }
      cedulaFotoUrl = upC.path;
    }

    const row = {
      numero,
      vehiculo: vehiculo.id_vehiculo,
      nombre_cliente: name,
      cedula: document || '',
      telefono: phone,
      email: email || null,
      tipo_cliente: clientType || 'particular',
      pickup_date: pickupDate,
      return_date: returnDate,
      dias: days,
      extras: extraIds,
      total,
      forma_pago: formaPago,
      estado: 'pendiente',
      comprobante_url: comprobanteUrl,
      licencia_url: licenciaUrl,
      cedula_foto_url: cedulaFotoUrl,
      expira_en:
        formaPago === 'sitio' ? new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() : null,
      metodo_pago: pagoMetodo,
    };

    const insert = () => sb.from('reservas').insert(row).select().single();
    let { data, error } = await insert();
    if (
      error &&
      (error.code === '42703' ||
        error.code === 'PGRST204' ||
        String(error.message || '').includes('metodo_pago'))
    ) {
      const { metodo_pago: _omit, ...rowSinMetodo } = row;
      ({ data, error } = await sb.from('reservas').insert(rowSinMetodo).select().single());
    }
    if (error) {
      if (error.code === '23P01' || String(error.message || '').includes('reservas_no_doble')) {
        return res.status(409).json({
          error: 'Ese vehículo ya tiene una reserva que se superpone con las fechas seleccionadas.',
        });
      }
      console.error('reservas.insert', error);
      return res.status(500).json({ error: 'No se pudo crear la reserva. Inténtalo de nuevo.' });
    }

    const reservation = { ...data, metodo_pago: pagoMetodo };

    const vehicleView = rowToVehicle(vehiculo);
    const ownerMsg = buildOwnerReservationMessage({ reservation, vehicle: vehicleView });
    sendOwnerNotification(ownerMsg).catch(() => {});

    return res.status(201).json({ reservation });
  } catch (e) {
    console.error('reservas.handler', e);
    return res.status(500).json({ error: 'No se pudo crear la reserva. Inténtalo de nuevo.' });
  }
}