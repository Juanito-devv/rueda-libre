import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import BookingForm from '../src/components/booking/BookingForm';
import BookingSummary from '../src/components/booking/BookingSummary';
import { vehicles, extras } from '../src/data/vehicles';
import { generateWhatsAppMessage } from '../src/utils/whatsapp';

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;
  
  const [vehicle, setVehicle] = useState(null);
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
    days: 1
  });
  
  useEffect(() => {
    if (id) {
      const found = vehicles.find(v => v.id === parseInt(id));
      setVehicle(found);
    }
  }, [id]);
  
  const calculateTotal = () => {
    if (!vehicle) return 0;
    
    const basePrice = vehicle.dailyRate * booking.days;
    const extrasPrice = booking.selectedExtras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return total + (extra ? extra.price * booking.days : 0);
    }, 0);
    
    return basePrice + extrasPrice;
  };
  
  const handleConfirmBooking = () => {
    const message = generateWhatsAppMessage(vehicle, booking, calculateTotal());
    const phoneNumber = '584129706050'; // Tu número de WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            Reservar: <span className="text-brand-red">{vehicle.name}</span>
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BookingForm 
              booking={booking}
              onChange={setBooking}
              vehicle={vehicle}
            />
            
            <BookingSummary 
              vehicle={vehicle}
              booking={booking}
              total={calculateTotal()}
              onConfirm={handleConfirmBooking}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}