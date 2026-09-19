import { useState, useEffect } from 'react';
import ReservaCard from './ReservaCard';

const ESTADOS = [
  { id: 'pendiente', name: 'Por confirmar' },
  { id: 'confirmada', name: 'Confirmadas' },
  { id: 'en_curso', name: 'En curso' },
];

export default function ReservasTab({ token, onRole }) {
  const [estado, setEstado] = useState('pendiente');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let on = true;
    setLoading(true);
    fetch(`/api/admin/reservas?estado=${estado}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!on) return;
        if (d.rol) onRole(d.rol);
        setRows(Array.isArray(d.reservations) ? d.reservations : []);
        setLoading(false);
      })
      .catch(() => { if (on) setLoading(false); });
    return () => { on = false; };
  }, [estado, token, refresh, onRole]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        {ESTADOS.map((e) => (
          <button
            key={e.id}
            onClick={() => setEstado(e.id)}
            className={`px-6 py-2.5 rounded-full font-label-bold text-label-bold text-sm tracking-widest transition-all ${
              estado === e.id
                ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white'
            }`}
          >
            {e.name}
          </button>
        ))}
        <span className="self-center text-on-surface-variant text-sm">
          {estado === 'pendiente'
            ? 'Ordenadas por fecha de creación (las más antiguas primero). Confirmáis la reserva cuando valides el pago o comprobante.'
            : `Mostrando reservas en estado «${estado}».`}
        </span>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-12">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="text-on-surface-variant text-center py-16">
          Sin reservas {estado === 'pendiente' ? 'por confirmar' : estado} por ahora.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <ReservaCard key={r.id} r={r} token={token} onAction={() => setRefresh((x) => x + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}