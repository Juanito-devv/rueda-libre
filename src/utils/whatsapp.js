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
  
  return `🚗 *NUEVA RESERVA - RUEDA LIBRE*

👤 *Cliente:* ${booking.clientType === 'particular' ? 'Particular' : 'Empresa'}
📝 *Nombre:* ${booking.name}
📄 *Documento:* ${booking.document}
📱 *Teléfono:* ${booking.phone}
📧 *Correo:* ${booking.email}

🚙 *Vehículo:* ${vehicle.name} (${vehicle.type})
📅 *Recogida:* ${booking.pickupDate}
📅 *Devolución:* ${booking.returnDate}
⏱ *Días:* ${booking.days}
📍 *Ubicación:* ${booking.location}

${extrasList ? '✨ *Extras:*\n' + extrasList + '\n' : ''}
💰 *TOTAL ESTIMADO:* $${total}

Por favor, confirma la disponibilidad y coordina la entrega. ¡Gracias!`;
}