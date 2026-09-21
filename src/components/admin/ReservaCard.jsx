import { useState } from 'react';
import Foto from './Foto';
import { generateReservationSummaryPdf } from '../../utils/invoice';

const REVISION_ITEMS = [
  'Interior limpio, sin olores ni daños nuevos',
  'Carrocería sin rayones ni golpes nuevos',
  'Nivel de combustible y kilometraje registrados',
  'Documentos, llaves y accesorios devueltos',
];

export default function ReservaCard({ r, token, onAction }) {
  const [busy, setBusy] = useState('');
  const revision = r.estado === 'revision';
  const [checks, setChecks] = useState(() => REVISION_ITEMS.map(() => false));
  const [notes, setNotes] = useState(r.revision_notas || '');
  const allChecked = checks.every(Boolean);

  const doAction = async (action, extra = {}) => {
    setBusy(action);
    const res = await fetch('/api/admin/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: r.id, action, ...extra }),
    });
    const data = await res.json();
    setBusy('');
    if (res.ok) onAction(data);
    else alert(data.error || 'Error al procesar la acción');
  };

  const downloadSummary = () => {
    const dias = Number(r.dias) || 1;
    generateReservationSummaryPdf({
      vehicle: {
        name: r.vehiculo_nombre || 'Vehículo',
        type: '',
        dailyRate: Number(r.total) / dias,
      },
      booking: {
        clientType: r.tipo_cliente,
        name: r.nombre_cliente,
        document: r.cedula,
        phone: r.telefono,
        email: r.email || '',
        pickupDate: r.pickup_date,
        returnDate: r.return_date,
        location: '',
        selectedExtras: [],
        formaPago: r.forma_pago,
      },
      total: Number(r.total),
      days: dias,
      numero: r.numero,
      estado: r.estado,
    });
  };

  const fotos = [
    { label: 'Comprobante', path: r.comprobante_url },
    { label: 'Licencia', path: r.licencia_url },
    { label: 'Cédula/RIF', path: r.cedula_foto_url },
  ].filter((f) => f.path);

  return (
    <div className={`glass-panel-luxury rounded-2xl p-6 border ${revision ? 'border-accent-orange/50' : 'border-white/10'}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white font-black text-lg">{r.numero}</span>
            {r.forma_pago === 'comprobante' && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold uppercase">
                Comprobante{r.metodo_pago ? ` · ${r.metodo_pago}` : ''}
              </span>
            )}
            {r.forma_pago === 'sitio' && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-on-surface-variant border border-white/20 font-bold uppercase">
                En el sitio
              </span>
            )}
            {revision && (
              <span className="text-xs px-2 py-1 rounded-full bg-accent-orange/15 text-accent-orange border border-accent-orange/40 font-bold uppercase">
                Revisión post entrega
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-sm mt-1">
            Creado: {new Date(r.creado_en).toLocaleString()}
          </p>
        </div>
        {r.expira_en && r.forma_pago === 'sitio' && r.estado === 'pendiente' && (
          <span className="text-xs px-2 py-1 rounded-full bg-accent-orange/15 text-accent-orange border border-accent-orange/30 font-bold">
            Vence: {new Date(r.expira_en).toLocaleString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-on-surface-variant mb-4">
        <p><span className="text-white font-bold">{r.vehiculo_nombre || 'Vehículo'}</span></p>
        <p>Total: <span className="text-white font-bold">${r.total}</span> · {r.dias} día(s)</p>
        <p>Cliente: {r.nombre_cliente} ({r.tipo_cliente})</p>
        <p>Cédula/RIF: {r.cedula}</p>
        <p>Teléfono: {r.telefono}</p>
        {r.email && <p>Correo: {r.email}</p>}
        <p>Recogida: {r.pickup_date} → Devolución: {r.return_date}</p>
        {r.extras && r.extras.length > 0 && <p>Extras: {r.extras.map((x) => (typeof x === 'string' ? x : x?.name)).join(', ')}</p>}
      </div>

      {fotos.length > 0 && (
        <div className="flex gap-4 mb-4 flex-wrap">
          {fotos.map((f) => (
            <div key={f.label}>
              <p className="text-xs text-on-surface-variant mb-1">{f.label}</p>
              <Foto path={f.path} token={token} />
            </div>
          ))}
        </div>
      )}

      {revision && (
        <div className="mb-4 p-4 bg-accent-orange/8 border border-accent-orange/30 rounded-xl">
          <p className="text-white font-bold text-sm mb-3">
            Revisión del vehículo tras la devolución
            <span className="text-on-surface-variant font-normal ml-2">(obligatoria para finalizar)</span>
          </p>
          <div className="space-y-2">
            {REVISION_ITEMS.map((item, i) => (
              <label key={item} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() =>
                    setChecks((c) => {
                      const next = [...c];
                      next[i] = !next[i];
                      return next;
                    })
                  }
                  className="mt-0.5 accent-primary"
                />
                <span className={`text-sm ${checks[i] ? 'text-white' : 'text-on-surface-variant'}`}>{item}</span>
              </label>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas de la revisión (daños, observaciones, combustible entregado…)"
            rows={2}
            className="mt-3 w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-on-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => doAction('approve_revision', { notes })}
              disabled={!allChecked || !!busy}
              className="gold-btn px-5 py-2.5 rounded-xl font-label-bold text-label-bold text-sm tracking-widest font-black disabled:opacity-50"
            >
              {busy === 'approve_revision' ? '…' : 'Aprobar y finalizar'}
            </button>
            <button
              onClick={() => doAction('revision_reject', { notes })}
              disabled={!!busy}
              className="px-5 py-2.5 rounded-xl border border-accent-orange/50 text-accent-orange font-label-bold text-label-bold text-sm tracking-widest hover:bg-accent-orange/10 disabled:opacity-50"
            >
              {busy === 'revision_reject' ? '…' : 'Rechazar (volver a en curso)'}
            </button>
          </div>
          {!allChecked && (
            <p className="text-yellow-400 text-xs mt-3">
              Marca todos los puntos de la revisión para poder aprobar y finalizar.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadSummary}
          disabled={!!busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/40 text-primary font-label-bold text-label-bold text-sm tracking-widest hover:bg-primary/10 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Descargar resumen
        </button>

        {!revision && r.estado === 'pendiente' && (
          <>
            <button
              onClick={() => doAction('confirm')}
              disabled={!!busy}
              className="gold-btn px-5 py-2.5 rounded-xl font-label-bold text-label-bold text-sm tracking-widest font-black disabled:opacity-50"
            >
              {busy === 'confirm' ? '…' : 'Confirmar'}
            </button>
            <button
              onClick={() => doAction('reject')}
              disabled={!!busy}
              className="px-5 py-2.5 rounded-xl border border-error/50 text-error font-label-bold text-label-bold text-sm tracking-widest hover:bg-error/10 disabled:opacity-50"
            >
              {busy === 'reject' ? '…' : 'Rechazar'}
            </button>
          </>
        )}
        {!revision && r.estado === 'confirmada' && (
          <>
            <button
              onClick={() => doAction('start')}
              disabled={!!busy}
              className="gold-btn px-5 py-2.5 rounded-xl font-label-bold text-label-bold text-sm tracking-widest font-black disabled:opacity-50"
            >
              {busy === 'start' ? '…' : 'Iniciar entrega'}
            </button>
            <button
              onClick={() => doAction('cancel')}
              disabled={!!busy}
              className="px-5 py-2.5 rounded-xl border border-error/50 text-error font-label-bold text-label-bold text-sm tracking-widest hover:bg-error/10 disabled:opacity-50"
            >
              {busy === 'cancel' ? '…' : 'Cancelar'}
            </button>
          </>
        )}
        {!revision && r.estado === 'en_curso' && (
          <button
            onClick={() => doAction('finish')}
            disabled={!!busy}
            className="gold-btn px-5 py-2.5 rounded-xl font-label-bold text-label-bold text-sm tracking-widest font-black disabled:opacity-50"
          >
            {busy === 'finish' ? '…' : 'Registrar devolución'}
          </button>
        )}
      </div>
    </div>
  );
}