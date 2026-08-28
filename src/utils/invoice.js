import { SITE } from '../config/site';
import { extras } from '../data/vehicles';
import { fetchBcvRate, formatVes } from './currency';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function today() {
  return new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function clientTypeLabel(type) {
  return type === 'empresa' ? 'Empresa' : 'Particular';
}

export async function generateInvoicePdf({ vehicle, booking, total, days }) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const bcvRate = await fetchBcvRate();

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  const invoiceNumber = `RL-${String(vehicle.id).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

  doc.setFillColor(242, 202, 80);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setFillColor(20, 23, 25);
  doc.rect(0, 38, pageW, 1.5, 'F');

  doc.setTextColor(20, 23, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(SITE.name.toUpperCase(), margin, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(SITE.tagline, margin, 25);
  doc.setFontSize(8.5);
  doc.setTextColor(64, 50, 0);
  doc.text(`${SITE.location} · ${SITE.whatsappDisplay}`, margin, 32);

  doc.setTextColor(20, 23, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FACTURA / ORDEN DE RESERVA', pageW - margin, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`No. ${invoiceNumber}`, pageW - margin, 23, { align: 'right' });
  doc.text(`Fecha de emisión: ${today()}`, pageW - margin, 28.5, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(SITE.email, pageW - margin, 34, { align: 'right' });

  let y = 52;

  doc.setFillColor(20, 23, 25);
  doc.rect(margin, y - 5, pageW - margin * 2, 8, 'F');
  doc.setTextColor(242, 202, 80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('FACTURAR A', margin + 3, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.name || '—', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`${clientTypeLabel(booking.clientType)}`, pageW - margin, y, { align: 'right' });
  y += 6;
  doc.text(`Documento: ${booking.document || '—'}`, margin + 2, y);
  doc.text(`${booking.phone || '—'}`, pageW - margin, y, { align: 'right' });
  y += 6;
  doc.text(`${booking.email || '—'}`, margin + 2, y);
  y += 6;
  doc.text(`Ubicación de entrega: ${booking.location || '—'}`, margin + 2, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.text(
    `Período: ${formatDate(booking.pickupDate)}  →  ${formatDate(booking.returnDate)}  (${days} día${days === 1 ? '' : 's'})`,
    margin,
    y
  );
  y += 8;

  const extraRows = booking.selectedExtras
    .map((extraId) => {
      const extra = extras.find((e) => e.id === extraId);
      return extra
        ? [extra.name, 'Servicio adicional', money(extra.price), String(days), money(extra.price * days)]
        : null;
    })
    .filter(Boolean);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Concepto', 'Detalle', 'Tarifa diaria ($)', 'Días', 'Importe ($)']],
    body: [
      [vehicle.name, vehicle.type, money(vehicle.dailyRate), String(days), money(vehicle.dailyRate * days)],
      ...extraRows,
    ],
    foot: [['', '', '', 'TOTAL', money(total)]],
    theme: 'striped',
    headStyles: {
      fillColor: [20, 23, 25],
      textColor: [242, 202, 80],
      fontStyle: 'bold',
      fontSize: 9,
    },
    footStyles: {
      fillColor: [242, 202, 80],
      textColor: [20, 23, 25],
      fontStyle: 'bold',
      fontSize: 11,
    },
    bodyStyles: { fontSize: 9.5, textColor: [30, 30, 30] },
    columnStyles: {
      0: { cellWidth: 62 },
      1: { cellWidth: 54 },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  const tableEnd = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 10;
  let ny = tableEnd;

  if (bcvRate) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 23, 25);
    doc.text(`Equivalente en bolívares: ${formatVes(bcvRate * total)}`, margin, ny);
    ny += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `Tasa BCV del día (oficial): 1 USD = Bs. ${bcvRate.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      margin,
      ny
    );
    ny += 8;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(
    'Entrega y devolución de vehículos de 7:00 am a 6:00 pm. Fuera de este horario tiene costo adicional.',
    margin,
    ny
  );
  ny += 5;
  doc.text(
    'Esta factura/orden de reserva es estimada y está sujeta a la confirmación de disponibilidad del vehículo.',
    margin,
    ny
  );
  ny += 5;
  doc.text(
    'El pago se realiza contra entrega y la entrega se coordina por WhatsApp al confirmar la reserva.',
    margin,
    ny
  );
  ny += 5;
  doc.text(`Contacto: ${SITE.whatsappDisplay} · ${SITE.email}`, margin, ny);

  doc.setFontSize(8.5);
  doc.setTextColor(150, 150, 150);
  doc.text(`${SITE.name} · ${SITE.location}`, pageW - margin, pageH - 12, { align: 'right' });
  doc.text('Documento generado automáticamente por ruedalibre.com', pageW - margin, pageH - 8, { align: 'right' });

  doc.save(`Factura-${invoiceNumber}.pdf`);
}