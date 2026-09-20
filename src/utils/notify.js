const UNCONFIGURED = new Set(['0', 'none', 'no', 'pendiente', 'no-configurado', 'undefined']);

function isConfigured(value) {
  return typeof value === 'string' && value.trim() !== '' && !UNCONFIGURED.has(value.trim().toLowerCase());
}

export async function sendOwnerNotification(message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = process.env.WHATSAPP_TO;
  if (!isConfigured(token) || !isConfigured(phoneId) || !isConfigured(to)) {
    return { ok: false, skipped: true, reason: 'WhatsApp Cloud API no configurada' };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, reason: `WA ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

const sep = '──────────────────────';

export function buildOwnerReservationMessage({ reservation, vehicle }) {
  const extrasList = (reservation.extras || [])
    .map((id) => `  - ${id}`)
    .join('\n');
  const lines = [
    'GuzfalC.A · NUEVA RESERVA',
    sep,
    `N° ${reservation.numero}`,
    `Vehículo: ${vehicle ? vehicle.name : reservation.vehiculo}`,
    `Cliente: ${reservation.nombre_cliente} (${reservation.tipo_cliente})`,
    `Cédula/RIF: ${reservation.cedula || '—'}`,
    `Teléfono: ${reservation.telefono}`,
    reservation.email ? `Correo: ${reservation.email}` : '',
    '',
    `Recogida: ${reservation.pickup_date}`,
    `Devolución: ${reservation.return_date}`,
    `Días: ${reservation.dias}`,
    `Total: $${reservation.total}`,
    extrasList ? `Extras:\n${extrasList}` : '',
    '',
    `Pago: ${reservation.forma_pago === 'comprobante' ? 'COMPROBANTE DE PAGO' : 'EN EL SITIO'}`,
    reservation.forma_pago === 'comprobante'
      ? `Método: ${reservation.metodo_pago || '—'}`
      : `Vence: ${new Date(reservation.expira_en).toLocaleString()}`,
    '',
    'Revisa el panel:pendiente de confirmación.',
  ].filter(Boolean);
  return lines.join('\n');
}

export function buildExpiryOwnerMessage({ reservation, vehicle }) {
  const lines = [
    'GuzfalC.A · RESERVA VENCIDA',
    sep,
    `N° ${reservation.numero}`,
    `Vehículo: ${vehicle ? vehicle.name : reservation.vehiculo}`,
    `Cliente: ${reservation.nombre_cliente}`,
    `Teléfono: ${reservation.telefono}`,
    `Total: $${reservation.total}`,
    '',
    'No se confirmó el pago dentro de las 5 horas.',
    'El vehículo quedó LIBERADO y la reserva fue archivada.',
  ].filter(Boolean);
  return lines.join('\n');
}