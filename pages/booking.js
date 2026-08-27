import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import BookingForm from '../src/components/booking/BookingForm';
import BookingSummary from '../src/components/booking/BookingSummary';
import { vehicles, extras } from '../src/data/vehicles';
import { generateWhatsAppMessage, getWhatsAppUrl } from '../src/utils/whatsapp';
import { generateInvoicePdf } from '../src/utils/invoice';

export function getBookingDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 0;
  return diff === 0 ? 1 : diff;
}

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;

  const [vehicle, setVehicle] = useState(null);
  const [status, setStatus] = useState('loading');
  const [booking, setBooking] = useState({
    clientType: 'particular',
    name: '',
    document: '',
    phone: '',
    email: '',
    pickupDate: '',
    returnDate: '',
    location: '',
    selectedExtras: [],
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      setVehicle(null);
      setStatus('notfound');
      return;
    }
    const found = vehicles.find(v => v.id === Number(id));
    if (found) {
      setVehicle(found);
      setStatus('ready');
    } else {
      setVehicle(null);
      setStatus('notfound');
    }
  }, [router.isReady, id]);

  const days = getBookingDays(booking.pickupDate, booking.returnDate);
  const datesValid = days > 0;

  const calculateTotal = () => {
    if (!vehicle) return 0;

    const basePrice = vehicle.dailyRate * days;
    const extrasPrice = booking.selectedExtras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return total + (extra ? extra.price * days : 0);
    }, 0);

    return basePrice + extrasPrice;
  };

  const handleDownloadInvoice = () => {
    generateInvoicePdf({ vehicle, booking: { ...booking, days }, total: calculateTotal(), days });
  };

  const handleConfirmBooking = () => {
    const message = generateWhatsAppMessage(vehicle, { ...booking, days }, calculateTotal());
    window.open(getWhatsAppUrl(message), '_blank');
    handleDownloadInvoice();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-on-surface text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === 'notfound' || !vehicle) {
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
              Completa tus datos y coordina la entrega por WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <BookingForm booking={booking} onChange={setBooking} />

            <BookingSummary
              vehicle={vehicle}
              booking={booking}
              days={days}
              datesValid={datesValid}
              total={calculateTotal()}
              onConfirm={handleConfirmBooking}
              onDownloadInvoice={handleDownloadInvoice}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}