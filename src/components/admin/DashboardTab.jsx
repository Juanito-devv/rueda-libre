import { useState, useEffect, useCallback } from 'react';

const RANGOS = [
  { id: 'semana', name: '7 días' },
  { id: 'mes', name: 'Este mes' },
  { id: 'semestre', name: '6 meses' },
];

const money = (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATE_EMPTY = {
  ingresos: 0,
  alquileres: 0,
  canceladas: 0,
  promedio_dia: 0,
  autos: [],
  extras: [],
};

export default function DashboardTab({ token, onRole }) {
  const [rango, setRango] = useState('mes');
  const [data, setData] = useState(STATE_EMPTY);
  const [label, setLabel] = useState('Este mes');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/dashboard?rango=${rango}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.rol) onRole(d.rol);
        if (d.stats) setData(d.stats);
        if (d.label) setLabel(d.label);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [rango, token, onRole]);

  useEffect(() => { load(); }, [load]);

  const maxAuto = Math.max(1, ...(data.autos || []).map((a) => a.conteo));
  const maxExtra = Math.max(1, ...(data.extras || []).map((e) => e.conteo));

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-8">
        {RANGOS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRango(r.id)}
            className={`px-6 py-2.5 rounded-full font-label-bold text-label-bold text-sm tracking-widest transition-all ${
              rango === r.id
                ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white'
            }`}
          >
            {r.name}
          </button>
        ))}
        <span className="self-center text-on-surface-variant text-sm">{label}</span>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-12">Calculando…</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel-luxury rounded-2xl p-6 border border-primary/30">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Ingresos generados</p>
              <p className="text-3xl font-black gradient-text">{money(data.ingresos)}</p>
            </div>
            <div className="glass-panel-luxury rounded-2xl p-6 border border-primary/30">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Alquileres</p>
              <p className="text-3xl font-black text-white">{data.alquileres}</p>
            </div>
            <div className="glass-panel-luxury rounded-2xl p-6 border border-error/40">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Cancelados</p>
              <p className="text-3xl font-black text-error">{data.canceladas}</p>
            </div>
            <div className="glass-panel-luxury rounded-2xl p-6 border border-primary/30">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Promedio / día</p>
              <p className="text-3xl font-black text-white">{money(data.promedio_dia)}</p>
            </div>
          </div>

          <div className="glass-panel-luxury rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-black text-lg mb-6">Autos más alquilados</h3>
            {data.autos.length === 0 ? (
              <p className="text-on-surface-variant text-sm">Sin datos en este periodo.</p>
            ) : (
              <div className="space-y-5">
                {data.autos.map((a, i) => (
                  <div key={a.vehiculo}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-bold">
                        <span className="text-primary font-black mr-2">#{i + 1}</span>
                        {a.nombre}
                      </span>
                      <span className="text-on-surface-variant">
                        {a.conteo} × <span className="text-primary font-bold">{money(a.ingresos)}</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent-orange"
                        style={{ width: `${Math.round((a.conteo / maxAuto) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel-luxury rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-black text-lg mb-6">Servicios (extras) más usados</h3>
            {data.extras.length === 0 ? (
              <p className="text-on-surface-variant text-sm">Sin datos en este periodo.</p>
            ) : (
              <div className="space-y-5">
                {data.extras.map((e, i) => (
                  <div key={e.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-bold">
                        <span className="text-accent-orange font-black mr-2">#{i + 1}</span>
                        {e.name}
                      </span>
                      <span className="text-on-surface-variant">{e.conteo} vez(ces)</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full bg-accent-orange"
                        style={{ width: `${Math.round((e.conteo / maxExtra) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}