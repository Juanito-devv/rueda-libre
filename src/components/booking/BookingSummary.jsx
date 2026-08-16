import { extras } from '../../data/vehicles';

export default function BookingSummary({ vehicle, booking, total, onConfirm }) {
  const required = booking.name && booking.phone && booking.pickupDate && booking.returnDate;

  return (
    <div className="glass-panel-luxury rounded-3xl p-8 md:p-10 border border-primary/20 sticky top-28 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>

      <h2 className="font-headline-md text-headline-md text-white font-black mb-8">Resumen de Reserva</h2>

      <div className="flex items-center gap-4 mb-6 p-4 bg-surface/50 border border-white/10 rounded-2xl overflow-hidden relative">
        <img src={vehicle.image} alt={vehicle.name} className="w-24 h-20 object-cover rounded-xl" />
        <div>
          <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
          <p className="text-on-surface-variant">{vehicle.type}</p>
          <p className="text-primary font-bold text-lg">${vehicle.dailyRate}/día</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {booking.pickupDate && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <span>Desde: {booking.pickupDate}</span>
          </div>
        )}
        {booking.returnDate && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <span>Hasta: {booking.returnDate}</span>
          </div>
        )}
        {booking.days > 0 && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <span>{booking.days} día(s)</span>
          </div>
        )}
        {booking.location && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span>{booking.location}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-on-surface-variant">
          <span>Vehículo ({booking.days} días)</span>
          <span>${vehicle.dailyRate * booking.days}</span>
        </div>

        {booking.selectedExtras.map(extraId => {
          const extra = extras.find(e => e.id === extraId);
          return extra ? (
            <div key={extra.id} className="flex justify-between text-on-surface-variant">
              <span>{extra.name} ({booking.days} días)</span>
              <span>+${extra.price * booking.days}</span>
            </div>
          ) : null;
        })}
      </div>

      <div className="border-t border-white/10 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-white">TOTAL</span>
          <span className="text-3xl font-bold gradient-text">${total}</span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={!required}
        className="w-full mt-6 font-label-bold text-label-bold gold-btn px-6 py-4 rounded-xl text-lg tracking-widest font-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar y Enviar a WhatsApp
      </button>

      {!required && (
        <p className="text-yellow-400 text-sm mt-2 text-center">
          Completa todos los campos obligatorios para confirmar
        </p>
      )}
    </div>
  );
}