import { extras } from '../../data/vehicles';

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
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Datos de la Reserva</h2>
      
      <div className="space-y-6">
        {/* Tipo de Cliente */}
        <div>
          <label className="block text-white mb-2">Tipo de Cliente</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange('clientType', 'particular')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                booking.clientType === 'particular'
                  ? 'bg-brand-red text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Particular
            </button>
            <button
              type="button"
              onClick={() => handleChange('clientType', 'empresa')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                booking.clientType === 'empresa'
                  ? 'bg-brand-red text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Empresa
            </button>
          </div>
        </div>

        {/* Datos Personales */}
        <div>
          <label className="block text-white mb-2">Nombre Completo</label>
          <input
            type="text"
            value={booking.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-white mb-2">
            {booking.clientType === 'empresa' ? 'RIF' : 'Cédula'}
          </label>
          <input
            type="text"
            value={booking.document}
            onChange={(e) => handleChange('document', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            placeholder={booking.clientType === 'empresa' ? 'J-12345678-9' : 'V-12345678'}
          />
        </div>

        <div>
          <label className="block text-white mb-2">Teléfono</label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            placeholder="+58 412-1234567"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Correo Electrónico</label>
          <input
            type="email"
            value={booking.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            placeholder="correo@ejemplo.com"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Fecha Recogida</label>
            <input
              type="date"
              value={booking.pickupDate}
              onChange={(e) => {
                handleChange('pickupDate', e.target.value);
                setTimeout(calculateDays, 100);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Fecha Devolución</label>
            <input
              type="date"
              value={booking.returnDate}
              onChange={(e) => {
                handleChange('returnDate', e.target.value);
                setTimeout(calculateDays, 100);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div>
          <label className="block text-white mb-2">Ubicación de Entrega</label>
          <input
            type="text"
            value={booking.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-red"
            placeholder="Dirección o punto de referencia"
          />
        </div>

        {/* Extras */}
        <div>
          <label className="block text-white mb-3">Servicios Adicionales</label>
          <div className="space-y-3">
            {extras.map(extra => (
              <label key={extra.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={booking.selectedExtras.includes(extra.id)}
                  onChange={() => handleExtraToggle(extra.id)}
                  className="w-5 h-5 accent-brand-red"
                />
                <div>
                  <span className="text-white">{extra.name}</span>
                  <span className="text-brand-red ml-2">+${extra.price}/día</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}