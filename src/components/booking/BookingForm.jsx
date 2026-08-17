import { extras } from '../../data/vehicles';

const inputClass = "w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-4 pr-5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

export default function BookingForm({ booking, onChange, vehicle }) {
  const handleChange = (field, value) => {
    onChange({ ...booking, [field]: value });
  };

  const handleExtraToggle = (extraId) => {
    const selected = booking.selectedExtras.includes(extraId)
      ? booking.selectedExtras.filter(id => id !== extraId)
      : [...booking.selectedExtras, extraId];
    handleChange('selectedExtras', selected);
  };

  const calculateDays = () => {
    if (booking.pickupDate && booking.returnDate) {
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      handleChange('days', diff > 0 ? diff : 1);
    }
  };

  return (
    <div className="glass-panel-luxury rounded-3xl p-8 md:p-10 border border-primary/20 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>

      <h2 className="font-headline-md text-headline-md text-white font-black mb-8">Datos de la Reserva</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Tipo de Cliente</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange('clientType', 'particular')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                booking.clientType === 'particular'
                  ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                  : 'bg-white/10 text-on-surface-variant hover:text-white'
              }`}
            >
              Particular
            </button>
            <button
              type="button"
              onClick={() => handleChange('clientType', 'empresa')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                booking.clientType === 'empresa'
                  ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                  : 'bg-white/10 text-on-surface-variant hover:text-white'
              }`}
            >
              Empresa
            </button>
          </div>
        </div>

        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Nombre Completo</label>
          <input
            type="text"
            value={booking.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">
            {booking.clientType === 'empresa' ? 'RIF' : 'Cédula'}
          </label>
          <input
            type="text"
            value={booking.document}
            onChange={(e) => handleChange('document', e.target.value)}
            className={inputClass}
            placeholder={booking.clientType === 'empresa' ? 'J-12345678-9' : 'V-12345678'}
          />
        </div>

        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Teléfono</label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass}
            placeholder="+58 412-1234567"
          />
        </div>

        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Correo Electrónico</label>
          <input
            type="email"
            value={booking.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Fecha Recogida</label>
            <input
              type="date"
              value={booking.pickupDate}
              onChange={(e) => {
                handleChange('pickupDate', e.target.value);
                setTimeout(calculateDays, 100);
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Fecha Devolución</label>
            <input
              type="date"
              value={booking.returnDate}
              onChange={(e) => {
                handleChange('returnDate', e.target.value);
                setTimeout(calculateDays, 100);
              }}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Ubicación de Entrega</label>
          <input
            type="text"
            value={booking.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={inputClass}
            placeholder="Dirección o punto de referencia"
          />
        </div>

        <div>
          <label className="block text-on-surface-variant mb-3 font-label-bold text-label-bold tracking-widest text-xs">Servicios Adicionales</label>
          <div className="space-y-3">
            {extras.map(extra => (
              <label key={extra.id} className="flex items-center gap-3 cursor-pointer p-4 bg-surface/50 border border-white/10 rounded-xl hover:border-primary/40 transition-colors">
                <input
                  type="checkbox"
                  checked={booking.selectedExtras.includes(extra.id)}
                  onChange={() => handleExtraToggle(extra.id)}
                  className="w-5 h-5 accent-primary"
                />
                <div className="flex-1">
                  <span className="text-white font-medium">{extra.name}</span>
                  <p className="text-on-surface-variant text-sm">{extra.description}</p>
                </div>
                <span className="text-primary font-bold">+${extra.price}/día</span>
              </label>
            ))}
          </div>

          <div className="mt-5">
            <label className="block text-on-surface-variant mb-3 font-label-bold text-label-bold tracking-widest text-xs">Garantías según edad</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-4 bg-surface/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <span className="text-white font-medium">Mayor de 30 años</span>
                </div>
                <span className="text-primary font-bold">$500</span>
              </div>
              <div className="flex items-center justify-between gap-3 p-4 bg-surface/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent-orange">person_off</span>
                  <span className="text-white font-medium">Menor de 30 años</span>
                </div>
                <span className="text-accent-orange font-bold">$1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}