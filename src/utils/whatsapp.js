export function generateWhatsAppMessage(vehicle, booking, total) {
  const extrasList = booking.selectedExtras
    .map(id => {
      const extra = {
        driver: 'Chofer Corporativo',
        delivery: 'Entrega a Domicilio',
        insurance: 'Seguro Extendido'
      }[id];
      return `- ${extra}`;
    })
    .join('\n');

  return `🚗 *NUEVA RESERVA - RUEDA LIBRE*\n\n` +
    `👤 *Cliente:* ${booking.clientType === 'particular' ? 'Particular' : 'Empresa'}\n` +
    `📝 *Nombre:* ${booking.name}\n` +
    `📄 *Documento:* ${booking.document}\n` +
    `📱 *Teléfono:* ${booking.phone}\n` +
    `📧 *Correo:* ${booking.email}\n\n` +
    `🚙 *Vehículo:* ${vehicle.name} (${vehicle.type})\n` +
    `📅 *Recogida:* ${booking.pickupDate}\n` +
    `📅 *Devolución:* ${booking.returnDate}\n` +
    `⏱ *Días:* ${booking.days}\n` +
    `📍 *Ubicación:* ${booking.location}\n\n` +
    `${extrasList ? '✨ *Extras:*\n' + extrasList + '\n\n' : ''}` +
    `💰 *TOTAL ESTIMADO:* $${total}\n\n` +
    `Por favor, confirma la disponibilidad y coordina la entrega en Caracas, La California. ¡Gracias!`;
}