import { useState, useEffect, useCallback } from 'react';

const inputClass = "w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

export default function PagosTab({ token, isAdmin }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch('/api/admin/ajustes', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d.ajustes) ? d.ajustes : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const update = (id, key, value) => {
    setRows((xs) => xs.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  };

  const save = async (a) => {
    setBusy(true);
    const res = await fetch('/api/admin/ajustes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: a.id, metodo_pago: a.metodo_pago, descripcion: a.descripcion, activo: a.activo }),
    });
    setBusy(false);
    if (res.ok) load();
    else alert((await res.json()).error || 'Error al guardar');
  };

  return (
    <div className="space-y-4">
      <p className="text-on-surface-variant text-sm">
        Estos métodos de pago y sus instrucciones se le muestran al cliente cuando elige «Comprobante de pago».
        Activa solo los que uses.
      </p>
      {rows.map((a) => (
        <div key={a.id} className="glass-panel-luxury rounded-2xl p-5 border border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <input
              className={`${inputClass} md:max-w-xs`}
              value={a.metodo_pago}
              onChange={(e) => update(a.id, 'metodo_pago', e.target.value)}
              disabled={!isAdmin}
            />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" className="accent-primary" checked={!!a.activo} onChange={(e) => update(a.id, 'activo', e.target.checked)} disabled={!isAdmin} />
              Activo
            </label>
          </div>
          <textarea
            className={inputClass}
            value={a.descripcion}
            rows={2}
            onChange={(e) => update(a.id, 'descripcion', e.target.value)}
            disabled={!isAdmin}
          />
          {isAdmin && (
            <button
              onClick={() => save(a)}
              disabled={busy}
              className="mt-3 gold-btn px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest disabled:opacity-50"
            >
              Guardar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}