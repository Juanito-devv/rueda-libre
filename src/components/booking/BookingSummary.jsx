import { Calendar, MapPin, Clock } from 'lucide-react';
import { extras } from '../../data/vehicles';

export default function BookingSummary({ vehicle, booking, total, onConfirm }) {
  const vehicleEmojis = {
    'camioneta': '🛻',
    'sedan': '🚗',
    'suv': '🚙',
    'van': '🚐',
  };

  return (
    <div className="card p-8 sticky top-24">
      <h2 className="text-2xl font-bold text-white mb-6">Resumen de Reserva</h2>
      
      {/* Vehicle Info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
        <div className="text-5xl">
          {vehicleEmojis[vehicle.category] || '🚗'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
          <p className="text-gray-400">{vehicle.type}</p>
          <p className="text-brand-red font-bold text-lg">${vehicle.dailyRate}/día</p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-4 mb-6">
        {booking.pickupDate && (
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="h-5 w-5 text-brand-red" />
            <span>Desde: {booking.pickupDate}</span>
          </div>
        )}
        {booking.returnDate && (
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="h-5 w-5 text-brand-red" />
            <span>Hasta: {booking.returnDate}</span>
          </div>
        )}
        {booking.days > 0 && (
          <div className="flex items-center gap-3 text-gray-300">
            <Clock className="h-5 w-5 text-brand-red" />
            <span>{booking.days} día(s)</span>
          </div>
        )}
        {booking.location && (
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="h-5 w-5 text-brand-red" />
            <span>{booking.location}</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-gray-300">
          <span>Vehículo ({booking.days} días)</span>
          <span>${vehicle.dailyRate * booking.days}</span>
        </div>
        
        {booking.selectedExtras.map(extraId => {
          const extra = extras.find(e => e.id === extraId);
          return extra ? (
            <div key={extra.id} className="flex justify-between text-gray-300">
              <span>{extra.name} ({booking.days} días)</span>
              <span>+${extra.price * booking.days}</span>
            </div>
          ) : null;
        })}
      </div>

      {/* Total */}
      <div className="border-t border-white/10 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-white">TOTAL</span>
          <span className="text-3xl font-bold text-brand-red">${total}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={!booking.name || !booking.phone || !booking.pickupDate || !booking.returnDate}
        className="w-full mt-6 bg-brand-red text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-brand-darkred transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar y Enviar a WhatsApp
      </button>

      {(!booking.name || !booking.phone || !booking.pickupDate || !booking.returnDate) && (
        <p className="text-yellow-400 text-sm mt-2 text-center">
          Completa todos los campos obligatorios para confirmar
        </p>
      )}
    </div>
  );
}