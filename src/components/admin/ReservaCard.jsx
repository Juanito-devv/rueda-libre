import { useState } from 'react';
import Foto from './Foto';

export default function ReservaCard({ r, token, onAction }) {
  const [busy, setBusy] = useState('');

  const doAction = async (action) => {
    setBusy(action);
    const res = await fetch('/api/admin/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: r.id, action }),
    });
    const data = await res.json();
    setBusy('');
    if (res.ok) onAction(data);
    else alert(data.error || 'Error al procesar la acción');
  };

  const fotos = [
    { label: 'Comprobante', path: r.comprobante_url },
    { label: 'Licencia', path: r.licencia_url },
    { label: 'Cédula/RIF', path: r.cedula_foto_url },
  ].filter((f) => f.path);

  return (
    <div className="glass-panel-luxury rounded-2xl p-6 border border-white/10">
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
        {r.extras && r.extras.length > 0 && <p>Extras: {r.extras.join(', ')}</p>}
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

      <div className="flex flex-wrap gap-3">
        {r.estado === 'pendiente' && (
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
        {r.estado === 'confirmada' && (
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
        {r.estado === 'en_curso' && (
          <button
            onClick={() => doAction('finish')}
            disabled={!!busy}
            className="gold-btn px-5 py-2.5 rounded-xl font-label-bold text-label-bold text-sm tracking-widest font-black disabled:opacity-50"
          >
            {busy === 'finish' ? '…' : 'Finalizar'}
          </button>
        )}
      </div>
    </div>
  );
}