import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import BookingForm from '../src/components/booking/BookingForm';
import BookingSummary from '../src/components/booking/BookingSummary';
import { generateWhatsAppMessage, getWhatsAppUrl } from '../src/utils/whatsapp';
import { generateReservationSummaryPdf } from '../src/utils/invoice';
import { getBookingDays, calculateBookingTotal } from '../src/utils/booking';
import { fileToBase64 } from '../src/utils/image';
import { isRangeFree, occupiedByVehicle } from '../src/utils/disponibilidad';
import {
  fetchVehicleById,
  fetchVehicles,
  fetchPaymentMethods,
  fetchActiveReservationRanges,
} from '../src/lib/vehicles';

const STEPS = [
  { n: 1, label: 'Flota' },
  { n: 2, label: 'Tus datos' },
  { n: 3, label: 'Extras' },
  { n: 4, label: 'Pago y documentos' },
  { n: 5, label: 'Confirmación' },
];

const inputClass =
  "w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-4 pr-5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

function parseDate(yyyymmdd) {
  if (!yyyymmdd) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(yyyymmdd));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12) : null;
}

function formatOccupied(r) {
  const a = parseDate(r.pickup_date);
  const b = parseDate(r.return_date);
  if (!a || !b) return '';
  const fmt = (d) => d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
  return `${fmt(a)} → ${fmt(b)} (+24h)`;
}

export async function getServerSideProps(ctx) {
  const { id, desde, hasta } = ctx.query;
  const validDate = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);
  const [{ vehicle }, { vehicles }, paymentMethods, occupiedRanges] = await Promise.all([
    fetchVehicleById(id),
    fetchVehicles(),
    fetchPaymentMethods(),
    fetchActiveReservationRanges(),
  ]);
  if (!vehicle) return { props: { vehicle: null, vehicles: [], paymentMethods: [], occupiedRanges: [], desde: '', hasta: '' } };
  return {
    props: {
      vehicle,
      vehicles,
      paymentMethods,
      occupiedRanges,
      desde: validDate(desde) ? desde : '',
      hasta: validDate(hasta) ? hasta : '',
    },
  };
}

export default function Booking({ vehicle: initialVehicle, vehicles, paymentMethods, occupiedRanges, desde, hasta }) {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState(initialVehicle);
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
  const [popup, setPopup] = useState(null);

  const handleChange = (field, value) => setBooking((b) => ({ ...b, [field]: value }));

  const days = getBookingDays(booking.pickupDate, booking.returnDate);
  const datesValid = days > 0;
  const total = vehicle ? calculateBookingTotal(vehicle, booking, days) : 0;

  const occupied = useMemo(() => occupiedByVehicle(occupiedRanges), [occupiedRanges]);
  const occupiedFor = (v) => (v ? occupied[v.id] || [] : []);

  const rangeFreeFor = (v) => isRangeFree(booking.pickupDate, booking.returnDate, occupiedFor(v));
  const rangeComplete = Boolean(booking.pickupDate && booking.returnDate && datesValid);

  const changeDate = (field, value) => {
    const next = { ...booking, [field]: value };
    if (next.pickupDate && next.returnDate && getBookingDays(next.pickupDate, next.returnDate) > 0 && vehicle) {
      if (!isRangeFree(next.pickupDate, next.returnDate, occupiedFor(vehicle))) {
        setPopup({
          title: 'Vehículo ya reservado',
          message: `El ${vehicle.name} no está disponible en el rango ${next.pickupDate} → ${next.returnDate}. El vehículo permanece apartado 24 horas después de la devolución. Elige otras fechas o consulta disponibilidad.`,
        });
        return;
      }
    }
    handleChange(field, value);
  };

  const pickVehicle = (v) => {
    if (rangeComplete && !isRangeFree(booking.pickupDate, booking.returnDate, occupiedFor(v))) {
      setPopup({
        title: 'Vehículo ya reservado',
        message: `El ${v.name} no está disponible en el rango ${booking.pickupDate} → ${booking.returnDate}. Elige otro vehículo o cambia las fechas.`,
      });
      return;
    }
    setVehicle(v);
  };

  const emailFilled = booking.email.trim().length > 0;
  const emailValid = !emailFilled || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim());
  const documentOk = booking.clientType === 'empresa' ? booking.document.trim().length > 0 : true;
  const paymentLabel = paymentMethods.find((m) => m.id === booking.pagoMetodoId)?.metodo_pago || '';
  const extraValid =
    booking.formaPago === 'comprobante'
      ? Boolean(booking.pagoMetodoId && booking.files.comprobante && booking.files.licencia && booking.files.cedula)
      : true;

  const stepValid = (s) => {
    switch (s) {
      case 1:
        return Boolean(vehicle && rangeComplete && rangeFreeFor(vehicle));
      case 2:
        return Boolean(booking.name.trim() && booking.phone.trim() && emailValid && documentOk);
      case 3:
        return true;
      case 4:
        return extraValid;
      case 5:
        return Boolean(vehicle && rangeComplete && rangeFreeFor(vehicle) && booking.name.trim() && booking.phone.trim() && emailValid && documentOk && extraValid);
      default:
        return false;
    }
  };

  const canProceed = stepValid(step);
  const canGoBack = step > 1;
  const isLast = step === STEPS.length;

  const missingHint = (() => {
    if (!rangeComplete || !rangeFreeFor(vehicle)) return 'Revisa la disponibilidad: elige fechas válidas y libres';
    if (!vehicle) return 'Selecciona un vehículo';
    if (!booking.name.trim()) return 'Completa el nombre para confirmar';
    if (!booking.phone.trim()) return 'Completa el teléfono para confirmar';
    if (!emailValid) return emailFilled ? 'Revisa el correo electrónico: no parece válido' : 'Completa el correo electrónico';
    if (booking.clientType === 'empresa' && !documentOk) return 'Indica el RIF de la empresa para confirmar';
    if (!extraValid) return 'Adjunta el comprobante, la licencia y la cédula para confirmar';
    return '';
  })();

  const goNext = () => {
    if (!canProceed) {
      if (step === 1 && (!rangeComplete || !rangeFreeFor(vehicle))) {
        if (rangeComplete && !rangeFreeFor(vehicle)) {
          setPopup({
            title: 'Vehículo ya reservado',
            message: `El ${vehicle?.name || 'vehículo'} no está disponible en el rango elegido. Consulta las fechas bloqueadas o cambia el vehículo.`,
          });
        }
      }
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

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
        payload.files[key] = {
          name: f.name,
          type: f.type,
          data: f.data || (await fileToBase64(f)),
        };
      }
    }
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let body = null;
      try {
        body = JSON.parse(raw);
      } catch (e) {
        body = null;
      }
      if (!res.ok) {
        const message =
          body?.error ||
          (res.status === 413
            ? 'Las fotos pesan demasiado para el servidor. Toma fotos con mejor luz y vuelve a intentar.'
            : 'No se pudo crear la reserva. Inténtalo de nuevo.');
        if (res.status === 409 || /reserv|disponib|ocupa|fecha/i.test(message)) {
          setPopup({ title: 'Vehículo ya reservado', message });
        } else {
          setSubmitError(message);
        }
        setSubmitting(false);
        return;
      }
      setCreated(body.reservation);
    } catch (e) {
      setSubmitError('Error de conexión. Inténtalo de nuevo.');
    }
    setSubmitting(false);
  };

  const handleDownloadSummary = () => {
    generateReservationSummaryPdf({
      vehicle,
      booking: { ...booking, days },
      total,
      days,
      numero: created?.numero || booking?.numero,
      estado: created?.estado || 'Pendiente',
    });
  };

  const closePopup = () => setPopup(null);

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
              <p className="text-on-surface-variant mb-2">Código de reserva</p>
              <p className="gradient-text font-display-lg text-4xl font-black mb-2">{created.numero}</p>
              <p className="text-on-surface-variant text-sm mb-8">
                Descarga el resumen con tu código y muéstralo al momento de la entrega.
              </p>

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

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownloadSummary}
                  className="gold-btn font-label-bold text-label-bold px-8 py-4 rounded-full tracking-widest text-sm font-black"
                >
                  Descargar resumen de reserva
                </button>
                <a
                  href={getWhatsAppUrl(whatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full border border-primary/40 text-primary font-label-bold text-label-bold tracking-widest hover:bg-primary/10 transition-colors"
                >
                  Confirmar por WhatsApp
                </a>
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
          <div className="text-center mb-10">
            <h1 className="font-headline-xl text-headline-xl mb-6">
              Reservar <span className="gradient-text">tu vehículo</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 sm:gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    step > s.n
                      ? 'bg-primary text-surface border-primary'
                      : step === s.n
                        ? 'gold-btn text-surface border-primary'
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                  }`}
                >
                  {step > s.n ? '✓' : s.n}
                </div>
                <span
                  className={`hidden sm:block text-xs tracking-widest uppercase font-bold ${
                    step >= s.n ? 'text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="w-4 sm:w-8 h-px bg-white/15"></div>}
              </div>
            ))}
          </div>

          {submitError && (
            <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl border border-error/40 bg-error/10 text-error text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{submitError}</span>
            </div>
          )}

          {step < 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className={`${step === 1 ? 'lg:col-span-3 lg:order-1' : 'lg:col-span-3 lg:order-1'}`}>
                {step === 1 ? (
                  <div className="glass-panel-luxury rounded-3xl p-8 md:p-10 border border-primary/20 relative overflow-hidden space-y-6">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>
                    <h2 className="font-headline-md text-headline-md text-white font-black">Elige tu vehículo y fechas</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Fecha Recogida</label>
                        <input
                          type="date"
                          value={booking.pickupDate}
                          onChange={(e) => changeDate('pickupDate', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-on-surface-variant mb-2 font-label-bold text-label-bold tracking-widest text-xs">Fecha Devolución</label>
                        <input
                          type="date"
                          value={booking.returnDate}
                          onChange={(e) => changeDate('returnDate', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {!datesValid && booking.pickupDate && booking.returnDate && (
                      <p className="text-sm text-error">La fecha de devolución debe ser posterior a la de recogida.</p>
                    )}

                    {rangeComplete && occupiedFor(vehicle).length > 0 && (
                      <div className="p-4 bg-surface/50 border border-white/10 rounded-xl text-sm text-on-surface-variant">
                        <p className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-accent-orange text-base">event_busy</span>
                          <span className="font-bold text-white">Fechas bloqueadas de {vehicle.name}:</span>
                        </p>
                        <ul className="space-y-1 pl-6 list-disc">
                          {occupiedFor(vehicle).map((r, i) => (
                            <li key={i}>{formatOccupied(r)}</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-xs text-on-surface-variant/60">
                          Cada vehículo queda bloqueado 24 horas después de su devolución para revisión.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vehicles.map((v) => {
                        const free = !rangeComplete || isRangeFree(booking.pickupDate, booking.returnDate, occupiedFor(v));
                        const active = vehicle?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={!free}
                            onClick={() => pickVehicle(v)}
                            className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                              active
                                ? 'border-primary bg-primary/10'
                                : !free
                                  ? 'border-white/5 bg-surface/30 opacity-60 cursor-not-allowed'
                                  : 'border-white/10 bg-surface/50 hover:border-primary/40'
                            }`}
                          >
                            {!free && (
                              <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-black text-accent-orange bg-black/50 rounded-full px-2 py-1">
                                Reservado
                              </span>
                            )}
                            <div className="flex items-center gap-3">
                              {v.image ? (
                                <img src={v.image} alt="" className="w-20 h-14 object-cover rounded-lg border border-white/10" />
                              ) : (
                                <div className="w-20 h-14 rounded-lg bg-white/5 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white/40">directions_car</span>
                                </div>
                              )}
                              <div>
                                <p className="text-white font-bold">{v.name}</p>
                                <p className="text-on-surface-variant text-sm">{v.type} · {v.transmission}</p>
                                <p className="text-primary font-bold">${v.dailyRate}/día</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <BookingForm booking={booking} onChange={handleChange} paymentMethods={paymentMethods} stepSection={step} />
                )}
              </div>

              <div className="lg:col-span-2">
                <BookingSummary
                  vehicle={vehicle}
                  booking={booking}
                  days={days}
                  datesValid={datesValid}
                  total={total}
                  onConfirm={handleConfirm}
                  extraValid={extraValid}
                  submitting={submitting}
                  paymentLabel={paymentLabel}
                  ready={stepValid(5)}
                  missingHint={missingHint}
                  onDownloadSummary={handleDownloadSummary}
                />
              </div>

              <div className="lg:col-span-3 flex items-center justify-between gap-4">
                {canGoBack && (
                  <button
                    onClick={() => setStep((s) => Math.max(s - 1, 1))}
                    className="px-6 py-3 rounded-full border border-white/20 text-on-surface-variant text-sm font-bold tracking-widest hover:text-white transition-colors"
                  >
                    ← Volver
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={!canProceed}
                  className="gold-btn px-10 py-4 rounded-full text-sm font-black tracking-widest disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="max-w-3xl mx-auto">
              <BookingSummary
                vehicle={vehicle}
                booking={booking}
                days={days}
                datesValid={datesValid}
                total={total}
                onConfirm={handleConfirm}
                extraValid={extraValid}
                submitting={submitting}
                paymentLabel={paymentLabel}
                ready={stepValid(5)}
                missingHint={missingHint}
                onDownloadSummary={handleDownloadSummary}
              />
              <div className="flex items-center justify-between gap-4 mt-6 max-w-md mx-auto">
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-full border border-white/20 text-on-surface-variant text-sm font-bold tracking-widest hover:text-white transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {popup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div
            className="glass-panel-luxury rounded-3xl p-8 md:p-10 max-w-md w-full text-center border border-primary/30 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>
            <span className="material-symbols-outlined text-5xl text-accent-orange mb-4 block">event_busy</span>
            <h3 className="font-headline-md text-headline-md text-white font-black mb-3">{popup.title}</h3>
            <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">{popup.message}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={closePopup}
                className="gold-btn w-full px-6 py-3.5 rounded-xl text-sm font-black tracking-widest"
              >
                ENTENDIDO
              </button>
              <Link
                href="/catalog"
                onClick={closePopup}
                className="text-primary hover:text-white text-xs tracking-widest uppercase font-bold"
              >
                Ver disponibilidad en el catálogo →
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}