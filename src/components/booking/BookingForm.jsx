import { useState } from 'react';
import { extras } from '../../data/vehicles';
import { compressImage } from '../../utils/image';

const inputClass = "w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-4 pr-5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

const fileInputClass = "block w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary file:cursor-pointer hover:file:bg-primary/20 cursor-pointer bg-surface/50 border border-white/10 rounded-xl transition-all";

const UPLOAD_LABELS = {
  comprobante: { label: 'Comprobante de Pago', hint: 'Captura o foto del pago realizado', required: true },
  licencia: { label: 'Licencia de Conducir', hint: 'Frente de la licencia vigente', required: true },
  cedula: { label: 'Cédula o RIF', hint: 'Foto del documento de identidad', required: true },
};

const MAX_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function BookingForm({ booking, onChange, paymentMethods }) {
  const [uploadError, setUploadError] = useState('');

  const handleChange = (field, value) => {
    onChange({ ...booking, [field]: value });
  };

  const handleExtraToggle = (extraId) => {
    const selected = booking.selectedExtras.includes(extraId)
      ? booking.selectedExtras.filter(id => id !== extraId)
      : [...booking.selectedExtras, extraId];
    handleChange('selectedExtras', selected);
  };

  const selectFormaPago = (formaPago) => {
    const next = { ...booking, formaPago };
    if (formaPago === 'comprobante' && !next.pagoMetodoId && paymentMethods.length > 0) {
      next.pagoMetodoId = paymentMethods[0].id;
    }
    handleChange('formaPago', next.formaPago);
    handleChange('pagoMetodoId', next.pagoMetodoId);
  };

  const handleFile = async (key, file) => {
    if (!file) {
      handleChange('files', { ...booking.files, [key]: null });
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setUploadError(`${UPLOAD_LABELS[key].label}: formato no permitido. Usa JPG, PNG o WEBP.`);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`${UPLOAD_LABELS[key].label}: el archivo supera los ${MAX_MB} MB.`);
      return;
    }
    try {
      const compressed = await compressImage(file);
      if (compressed.bytes > 1.5 * 1024 * 1024) {
        setUploadError(`${UPLOAD_LABELS[key].label}: la imagen no se pudo comprimir lo suficiente. Usa una foto más ligera.`);
        return;
      }
      setUploadError('');
      handleChange('files', { ...booking.files, [key]: compressed });
    } catch (e) {
      setUploadError(`${UPLOAD_LABELS[key].label}: no se pudo procesar la imagen. Intenta con otra foto.`);
    }
  };

  const selectedMethod = paymentMethods.find((m) => m.id === booking.pagoMetodoId);

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
              onChange={(e) => handleChange('pickupDate', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Fecha Devolución</label>
            <input
              type="date"
              value={booking.returnDate}
              onChange={(e) => handleChange('returnDate', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <p className="text-sm text-on-surface-variant/60 -mt-2">
          La duración y el total se calculan automáticamente según las fechas.
        </p>

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
          <label className="block text-on-surface-variant mb-3 font-label-bold text-label-bold tracking-widest text-xs">Forma de Pago</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => selectFormaPago('comprobante')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                booking.formaPago === 'comprobante'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/5 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${booking.formaPago === 'comprobante' ? 'text-primary' : 'text-on-surface-variant'}`}>receipt_long</span>
                <div>
                  <p className="text-white font-bold text-sm">Comprobante de pago</p>
                  <p className="text-on-surface-variant text-xs">Zelle · USDT · Pago Móvil · Transferencia</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => selectFormaPago('sitio')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                booking.formaPago === 'sitio'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/5 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${booking.formaPago === 'sitio' ? 'text-primary' : 'text-on-surface-variant'}`}>payments</span>
                <div>
                  <p className="text-white font-bold text-sm">Pagar en el sitio</p>
                  <p className="text-on-surface-variant text-xs">Efectivo al retirar el vehículo</p>
                </div>
              </div>
            </button>
          </div>

          {booking.formaPago === 'comprobante' && (
            <div className="mt-5 space-y-5">
              {paymentMethods.length > 0 && (
                <div>
                  <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Elige el método de pago</label>
                  <div className="space-y-2">
                    {paymentMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          booking.pagoMetodoId === m.id
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 bg-surface/50 hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pagoMetodo"
                          checked={booking.pagoMetodoId === m.id}
                          onChange={() => handleChange('pagoMetodoId', m.id)}
                          className="mt-1 accent-primary"
                        />
                        <div className="flex-1">
                          <p className="text-white font-bold">{m.metodo_pago}</p>
                          {m.descripcion && <p className="text-on-surface-variant text-sm">{m.descripcion}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedMethod && selectedMethod.descripcion && (
                    <p className="mt-3 text-sm text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">info</span>
                      {selectedMethod.descripcion}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-5">
                {Object.keys(UPLOAD_LABELS).map((key) => (
                  <div key={key}>
                    <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">
                      {UPLOAD_LABELS[key].label} {UPLOAD_LABELS[key].required && <span className="text-primary">*</span>}
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFile(key, e.target.files[0])}
                      className={fileInputClass}
                    />
                    {booking.files[key] ? (
                      <p className="mt-2 text-xs text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {booking.files[key].name}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-on-surface-variant/60">{UPLOAD_LABELS[key].hint}. Máx. {MAX_MB} MB.</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-on-surface-variant/70 bg-surface/50 border border-white/10 rounded-xl p-4">
                Realiza el pago por el método elegido y adjunta el comprobante junto con tu licencia y cédula.
                Nuestro equipo verificará los datos y confirmará tu reserva por WhatsApp.
              </p>
            </div>
          )}

          {booking.formaPago === 'sitio' && (
            <div className="mt-5 p-4 bg-surface/50 border border-white/10 rounded-xl text-sm text-on-surface-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">timer</span>
                <p>
                  Apartamos el vehículo por <span className="text-white font-semibold">5 horas</span> para que completes
                  el pago en el sitio. Si no se confirma a tiempo, la reserva se libera automáticamente.
                </p>
              </div>
            </div>
          )}

          {uploadError && (
            <p className="mt-3 text-sm text-error flex items-center gap-2">
              <span className="material-symbols-outlined text-base">warning</span>
              {uploadError}
            </p>
          )}
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