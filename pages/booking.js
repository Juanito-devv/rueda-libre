import { useState } from 'react';
import Link from 'next/link';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import BookingForm from '../src/components/booking/BookingForm';
import BookingSummary from '../src/components/booking/BookingSummary';
import { generateWhatsAppMessage, getWhatsAppUrl } from '../src/utils/whatsapp';
import { generateInvoicePdf } from '../src/utils/invoice';
import { getBookingDays, calculateBookingTotal } from '../src/utils/booking';
import { fetchVehicleById, fetchPaymentMethods } from '../src/lib/vehicles';

export async function getServerSideProps(ctx) {
  const { id, desde, hasta } = ctx.query;
  const { vehicle } = await fetchVehicleById(id);
  if (!vehicle) return { props: { vehicle: null, paymentMethods: [], desde: '', hasta: '' } };
  const paymentMethods = await fetchPaymentMethods();
  const validDate = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);
  return {
    props: {
      vehicle,
      paymentMethods,
      desde: validDate(desde) ? desde : '',
      hasta: validDate(hasta) ? hasta : '',
    },
  };
}

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Booking({ vehicle, paymentMethods, desde, hasta }) {
  const [booking, setBooking] = useState({
    clientType: 'particular',
    name: '',
    document: '',
    phone: '',
    email: '',
    pickupDate: desde,
    returnDate: hasta,
    location: '',
    selectedExtras: [],
    formaPago: 'comprobante',
    pagoMetodoId: paymentMethods?.[0]?.id || '',
    files: { comprobante: null, licencia: null, cedula: null },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [created, setCreated] = useState(null);

  const days = getBookingDays(booking.pickupDate, booking.returnDate);
  const datesValid = days > 0;
  const total = calculateBookingTotal(vehicle, booking, days);

  const paymentLabel = paymentMethods.find((m) => m.id === booking.pagoMetodoId)?.metodo_pago || '';
  const extraValid =
    booking.formaPago === 'comprobante'
      ? Boolean(booking.pagoMetodoId && booking.files.comprobante && booking.files.licencia && booking.files.cedula)
      : true;

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError('');
    const payload = {
      vehicle_id: vehicle.id,
      name: booking.name,
      document: booking.document,
      phone: booking.phone,
      email: booking.email,
      clientType: booking.clientType,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      location: booking.location,
      selectedExtras: booking.selectedExtras,
      total,
      formaPago: booking.formaPago,
      pagoMetodoId: booking.formaPago === 'comprobante' ? booking.pagoMetodoId : null,
      files: {},
    };
    if (booking.formaPago === 'comprobante') {
      for (const key of ['comprobante', 'licencia', 'cedula']) {
        const f = booking.files[key];
        if (!f) {
          setSubmitError('Debes adjuntar el comprobante, la licencia y la cédula.');
          setSubmitting(false);
          return;
        }
        payload.files[key] = { name: f.name, type: f.type, data: await fileToBase64(f) };
      }
    }
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error || 'No se pudo crear la reserva. Inténtalo de nuevo.');
        setSubmitting(false);
        return;
      }
      setCreated(body.reservation);
    } catch (e) {
      setSubmitError('Error de conexión. Inténtalo de nuevo.');
    }
    setSubmitting(false);
  };

  const handleDownloadInvoice = () => {
    generateInvoicePdf({ vehicle, booking: { ...booking, days }, total, days });
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap">
          <div className="glass-panel-luxury rounded-3xl p-10 md:p-14 text-center max-w-lg border border-primary/20">
            <span className="material-symbols-outlined text-6xl text-primary mb-6 block">directions_car</span>
            <h1 className="font-headline-xl text-headline-xl mb-4">
              Vehículo <span className="gradient-text">no encontrado</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Selecciona un vehículo de nuestro catálogo para comenzar tu reserva.
            </p>
            <Link
              href="/catalog"
              className="inline-block gold-btn font-label-bold text-label-bold px-10 py-5 rounded-full tracking-widest text-sm font-black"
            >
              VER CATÁLOGO
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (created) {
    const whatsAppMessage = generateWhatsAppMessage(
      vehicle,
      { ...booking, days, numero: created.numero },
      total
    );
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <Header />
        <main className="py-section-gap">
          <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="glass-panel-luxury rounded-3xl p-10 md:p-14 border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>
              <span className="material-symbols-outlined text-6xl text-primary mb-6 block">check_circle</span>
              <h1 className="font-headline-xl text-headline-xl mb-4">
                ¡Reserva <span className="gradient-text">registrada</span>!
              </h1>
              <p className="text-on-surface-variant mb-2">Número de reserva</p>
              <p className="gradient-text font-display-lg text-4xl font-black mb-8">{created.numero}</p>

              <div className="text-left space-y-3 mb-8 bg-surface/50 border border-white/10 rounded-2xl p-6 text-on-surface-variant">
                <div className="flex justify-between"><span>Vehículo</span><span className="text-white font-bold">{vehicle.name}</span></div>
                <div className="flex justify-between"><span>Recogida</span><span className="text-white font-bold">{created.pickup_date}</span></div>
                <div className="flex justify-between"><span>Devolución</span><span className="text-white font-bold">{created.return_date}</span></div>
                <div className="flex justify-between"><span>Días</span><span className="text-white font-bold">{created.dias}</span></div>
                <div className="flex justify-between"><span>Total</span><span className="text-white font-bold">${created.total}</span></div>
                <div className="flex justify-between">
                  <span>Pago</span>
                  <span className="text-white font-bold">
                    {booking.formaPago === 'comprobante' ? `Comprobante · ${paymentLabel}` : 'En el sitio (efectivo)'}
                  </span>
                </div>
              </div>

              {booking.formaPago === 'comprobante' ? (
                <div className="text-left mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-on-surface-variant">
                  Envía el pago por <span className="text-primary font-bold">{paymentLabel}</span> si aún no lo has hecho.
                  Adjuntamos tu comprobante, licencia y cédula para validación. Te confirmaremos la reserva por WhatsApp.
                </div>
              ) : (
                <div className="text-left mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-on-surface-variant">
                  Tu vehículo queda apartado por <span className="text-white font-bold">5 horas</span>. Realiza el pago en el
                  sitio antes de que venza para confirmar la reserva.
                </div>
              )}

              {submitError && (
                <p className="text-error text-sm mb-4">{submitError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getWhatsAppUrl(whatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-btn font-label-bold text-label-bold px-8 py-4 rounded-full tracking-widest text-sm font-black"
                >
                  Confirmar por WhatsApp
                </a>
                <button
                  onClick={handleDownloadInvoice}
                  className="px-8 py-4 rounded-full border border-primary/40 text-primary font-label-bold text-label-bold tracking-widest hover:bg-primary/10 transition-colors"
                >
                  Descargar Factura PDF
                </button>
              </div>
              <div className="mt-6">
                <Link href="/catalog" className="text-primary hover:text-white text-sm tracking-widest uppercase font-bold">
                  Volver al catálogo →
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      <main className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h1 className="font-headline-xl text-headline-xl mb-6">
              Reservar: <span className="gradient-text">{vehicle.name}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-lg uppercase tracking-widest">
              Completa tus datos y elige cómo quieres pagar
            </p>
          </div>

          {submitError && (
            <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl border border-error/40 bg-error/10 text-error text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <BookingForm booking={booking} onChange={setBooking} paymentMethods={paymentMethods} />

            <BookingSummary
              vehicle={vehicle}
              booking={booking}
              days={days}
              datesValid={datesValid}
              total={total}
              onConfirm={handleConfirm}
              onDownloadInvoice={handleDownloadInvoice}
              extraValid={extraValid}
              submitting={submitting}
              paymentLabel={paymentLabel}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}