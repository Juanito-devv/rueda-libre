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

  const lines = [
    '🚗 *NUEVA RESERVA - RUEDA LIBRE*',
    '',
    `👤 *Cliente:* ${booking.clientType === 'particular' ? 'Particular' : 'Empresa'}`,
    `📝 *Nombre:* ${booking.name || '—'}`,
    `📄 *Documento:* ${booking.document || '—'}`,
    `📱 *Teléfono:* ${booking.phone || '—'}`,
  ];

  if (booking.email) {
    lines.push(`📧 *Correo:* ${booking.email}`);
  }

  lines.push(
    '',
    `🚙 *Vehículo:* ${vehicle.name} (${vehicle.type})`,
    `📅 *Recogida:* ${booking.pickupDate}`,
    `📅 *Devolución:* ${booking.returnDate}`,
    `⏱ *Días:* ${booking.days}`,
    `📍 *Ubicación:* ${booking.location || '—'}`,
    ''
  );

  if (extrasList) {
    lines.push('✨ *Extras:*', extrasList, '');
  }

  lines.push(`💰 *TOTAL ESTIMADO:* $${total}`, '');
  lines.push(
    `Por favor, confirma la disponibilidad y coordina la entrega en ${SITE.deliveryCity}. ¡Gracias!`
  );

  return lines.join('\n');
}

export function getWhatsAppUrl(message) {
  if (!message) {
    return `https://wa.me/${SITE.whatsappNumber}`;
  }
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}