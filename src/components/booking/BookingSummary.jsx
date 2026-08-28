import { useState, useEffect } from 'react';
import { extras } from '../../data/vehicles';
import { fetchBcvRate, formatVes } from '../../utils/currency';

export default function BookingSummary({ vehicle, booking, days, datesValid, total, onConfirm, onDownloadInvoice }) {
  const emailFilled = booking.email.trim().length > 0;
  const emailValid = !emailFilled || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim());
  const documentOk = booking.clientType === 'empresa' ? booking.document.trim().length > 0 : true;
  const required =
    booking.name.trim() &&
    booking.phone.trim() &&
    booking.pickupDate &&
    booking.returnDate &&
    datesValid &&
    emailValid &&
    documentOk;

  const [vesRate, setVesRate] = useState(null);

  useEffect(() => {
    if (!days) return;
    let mounted = true;
    fetchBcvRate().then((rate) => {
      if (mounted && rate && rate > 0) setVesRate(rate);
    });
    return () => {
      mounted = false;
    };
  }, [total, days]);

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
        {!datesValid && booking.pickupDate && booking.returnDate && (
          <div className="flex items-center gap-3 text-error">
            <span className="material-symbols-outlined">error</span>
            <span>La fecha de devolución debe ser posterior a la de recogida.</span>
          </div>
        )}
        {days > 0 && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <span>{days} día(s)</span>
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
          <span>Vehículo {days > 0 ? `(${days} día(s))` : '(tarifa diaria)'}</span>
          <span>{days > 0 ? `$${vehicle.dailyRate * days}` : `$${vehicle.dailyRate}/día`}</span>
        </div>

        {booking.selectedExtras.map(extraId => {
          const extra = extras.find(e => e.id === extraId);
          return extra ? (
            <div key={extra.id} className="flex justify-between text-on-surface-variant">
              <span>{extra.name} {days > 0 ? `(${days} día(s))` : '(tarifa diaria)'}</span>
              <span>{days > 0 ? `+$${extra.price * days}` : `+$${extra.price}/día`}</span>
            </div>
          ) : null;
        })}
      </div>

      <div className="border-t border-white/10 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-white">TOTAL</span>
          <div className="text-right">
            <span className="text-3xl font-bold gradient-text block">{days > 0 ? `$${total}` : '—'}</span>
            {days > 0 && vesRate && (
              <span className="text-sm text-on-surface-variant">≈ {formatVes(total * vesRate)}</span>
            )}
          </div>
        </div>
        {days > 0 && vesRate && (
          <p className="text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">info</span>
            Tasa BCV del día (oficial)
          </p>
        )}
      </div>

      <div className="mt-5 p-4 bg-surface/50 border border-white/10 rounded-xl flex items-start gap-3 text-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-primary">schedule</span>
        <p>
          Entrega y devolución de vehículos de{' '}
          <span className="text-white font-semibold">7:00 am a 6:00 pm</span>. Salir de este horario
          tiene un <span className="text-white font-semibold">costo adicional</span>.
        </p>
      </div>

      <button
        onClick={onConfirm}
        disabled={!required}
        className="w-full mt-6 font-label-bold text-label-bold gold-btn px-6 py-4 rounded-xl text-lg tracking-widest font-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar y Enviar a WhatsApp
      </button>

      <button
        onClick={onDownloadInvoice}
        disabled={!required}
        className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary/40 text-primary font-label-bold text-label-bold tracking-widest hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-lg">download</span>
        Descargar Factura PDF
      </button>

      {!required && (
        <div className="text-yellow-400 text-sm mt-2 text-center">
          {booking.clientType === 'empresa' && !documentOk
            ? 'Indica el RIF de la empresa para confirmar'
            : emailFilled && !emailValid
              ? 'Revisa el correo electrónico: no parece válido'
              : !datesValid
                ? 'Revisa las fechas: la devolución debe ser posterior a la recogida'
                : 'Completa nombre, teléfono y fechas para confirmar'}
        </div>
      )}
    </div>
  );
}