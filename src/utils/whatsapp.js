import { extras } from '../data/vehicles';
import { SITE } from '../config/site';

export function generateWhatsAppMessage(vehicle, booking, total) {
  const extrasList = booking.selectedExtras
    .map(id => {
      const extra = extras.find(e => e.id === id);
      return extra ? `- ${extra.name} (+$${extra.price}/día)` : null;
    })
    .filter(Boolean)
    .join('\n');

  const sep = '──────────────────────────────────';

  const lines = [
    'RUEDA LIBRE',
    'Solicitud de Reserva',
    sep,
    '',
    `Cliente: ${booking.clientType === 'particular' ? 'Particular' : 'Empresa'}`,
    `Nombre: ${booking.name || '—'}`,
    `Documento: ${booking.document || '—'}`,
    `Teléfono: ${booking.phone || '—'}`,
  ];

  if (booking.email) {
    lines.push(`Correo: ${booking.email}`);
  }

  lines.push(
    '',
    `Vehículo: ${vehicle.name} (${vehicle.type})`,
    `Recogida: ${booking.pickupDate}`,
    `Devolución: ${booking.returnDate}`,
    `Días: ${booking.days}`,
    `Ubicación: ${booking.location || '—'}`,
    ''
  );

  if (extrasList) {
    lines.push('Servicios Adicionales:', extrasList, '');
  }

  lines.push(sep, `TOTAL ESTIMADO: $${total}`, '');
  lines.push(
    'Entrega de vehículos: 7:00 am a 6:00 pm. Fuera de este horario tiene costo adicional.',
    '',
    `Por favor, confirma la disponibilidad y coordina la entrega en ${SITE.deliveryCity}. ¡Gracias!`
  );

  return lines.join('\n');
}

export function getWhatsAppUrl(message) {
  const base = `https://api.whatsapp.com/send?phone=${SITE.whatsappNumber}`;
  if (!message) {
    return base;
  }
  return `${base}&text=${encodeURIComponent(message)}`;
}