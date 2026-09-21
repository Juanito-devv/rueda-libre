import { useState, useEffect, useCallback } from 'react';

const DOW = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const ESTADO_COLOR = {
  pendiente: 'bg-primary/20 text-primary border-primary/40',
  confirmada: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40',
  en_curso: 'bg-sky-500/20 text-sky-400 border-sky-400/40',
  revision: 'bg-accent-orange/20 text-accent-orange border-accent-orange/40',
  archivada: 'bg-white/5 text-on-surface-variant border-white/15',
};

const ESTADO_LABEL = {
  pendiente: 'Por confirmar',
  confirmada: 'Confirmada',
  en_curso: 'En curso',
  revision: 'Revisión',
  archivada: 'Archivada',
};

function p(n) { return String(n).padStart(2, '0'); }

function isoLocal(v) {
  if (!v) return '';
  try {
    return new Date(v).toLocaleDateString('es-VE');
  } catch (e) {
    return String(v);
  }
}

function downloadCsv(rows, filename) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['Número', 'Estado', 'Vehículo', 'Cliente', 'Recogida', 'Devolución', 'Días', 'Total ($)', 'Forma de pago'];
  const lines = rows.map((r) =>
    [
      esc(r.numero),
      esc(r.archivo ? `Archivada (${r.motivo || ''})` : r.estado),
      esc(r.vehiculo_nombre || ''),
      esc(r.nombre_cliente),
      esc(r.pickup_date),
      esc(r.return_date),
      esc(r.dias),
      r.total,
      esc(r.forma_pago === 'comprobante' ? 'Comprobante' : 'Sitio'),
    ].join(',')
  );
  const blob = new Blob([`\uFEFF${head.join(',')}\n${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const monthName = (d) =>
  d.toLocaleDateString('es-VE', { month: 'long', year: 'numeric' });

export default function CalendarioTab({ token, onRole }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [rows, setRows] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const desde = `${month.getFullYear()}-${p(month.getMonth() + 1)}-01`;
  const hastaDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const hasta = `${hastaDate.getFullYear()}-${p(hastaDate.getMonth() + 1)}-${p(hastaDate.getDate())}`;

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/calendario?desde=${desde}&hasta=${hasta}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.rol) onRole(d.rol);
        setRows(Array.isArray(d.reservas) ? d.reservas : []);
        setHistorial(Array.isArray(d.historial) ? d.historial : []);
        if (Array.isArray(d.reservas)) {
          const vnames = d.reservas.concat(d.historial || []).reduce((acc, r) => {
            if (r.vehiculo && r.vehiculo_nombre) acc[r.vehiculo] = r.vehiculo_nombre;
            return acc;
          }, {});
          setVehiculos(vnames);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [desde, hasta, token, onRole]);

  useEffect(() => { load(); }, [load]);

  const allRows = rows.concat(historial);

  const byDay = {};
  allRows.forEach((r) => {
    const start = new Date(`${r.pickup_date}T00:00:00`);
    const end = new Date(`${r.return_date}T00:00:00`);
    const total = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    for (let i = 0; i < total; i += 1) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      if (d.getFullYear() !== month.getFullYear() || d.getMonth() !== month.getMonth()) continue;
      const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(r);
    }
  });

  const firstDow = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  const contar = (estado) => allRows.filter((r) => r.estado === estado || (r.archivo && estado === 'archivada')).length;

  const prev = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const next = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-white/20 text-on-surface-variant hover:text-white hover:border-white/40 transition-colors">
            ←
          </button>
          <h2 className="text-white font-black text-xl capitalize">{monthName(month)}</h2>
          <button onClick={next} className="w-10 h-10 rounded-full border border-white/20 text-on-surface-variant hover:text-white hover:border-white/40 transition-colors">
            →
          </button>
          <button
            onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            className="ml-2 px-4 py-2 rounded-full border border-primary/40 text-primary text-xs font-bold tracking-widest hover:bg-primary/10 transition-colors"
          >
            HOY
          </button>
        </div>
        <button
          onClick={() => downloadCsv(allRows, `calendario-${desde}-a-${hasta}.csv`)}
          disabled={allRows.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-bold tracking-widest hover:bg-primary/10 disabled:opacity-40 transition-colors"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Descargar mes
        </button>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-12">Cargando…</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-on-surface-variant">
            <span><span className="font-bold text-white">{allRows.length}</span> reserva(s) en el mes</span>
            <span>· <span className="font-bold text-primary">{contar('pendiente')}</span> pendientes</span>
            <span>· <span className="font-bold text-emerald-400">{contar('confirmada')}</span> confirmadas</span>
            <span>· <span className="font-bold text-sky-400">{contar('en_curso')}</span> en curso</span>
            <span>· <span className="font-bold text-accent-orange">{contar('revision')}</span> en revisión</span>
            <span>· <span className="font-bold text-on-surface-variant">{contar('archivada')}</span> archivadas</span>
          </div>

          <div className="grid grid-cols-7 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {DOW.map((d) => (
              <div key={d} className="bg-background py-2 text-center text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                {d}
              </div>
            ))}
            {cells.map((day, i) =>
              day === null ? (
                <div key={`e${i}`} className="min-h-24 bg-surface/20 p-1"></div>
              ) : (
                <div key={day} className="min-h-24 bg-surface/40 p-1.5 flex flex-col gap-1 overflow-hidden">
                  <span className={`text-xs font-bold ${byDay[`${month.getFullYear()}-${p(month.getMonth() + 1)}-${p(day)}`] ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {day}
                  </span>
                  {(byDay[`${month.getFullYear()}-${p(month.getMonth() + 1)}-${p(day)}`] || []).slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className={`text-[9px] leading-tight px-1.5 py-0.5 rounded border truncate ${ESTADO_COLOR[r.archivo ? 'archivada' : r.estado] || ESTADO_COLOR.archivada}`}
                      title={`${r.numero} · ${r.vehiculo_nombre || ''} · ${r.nombre_cliente}`}
                    >
                      {r.numero}
                    </div>
                  ))}
                  {(byDay[`${month.getFullYear()}-${p(month.getMonth() + 1)}-${p(day)}`] || []).length > 3 && (
                    <span className="text-[9px] text-on-surface-variant">+{(byDay[`${month.getFullYear()}-${p(month.getMonth() + 1)}-${p(day)}`] || []).length - 3} más</span>
                  )}
                </div>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-6 text-xs text-on-surface-variant">
            {Object.keys(ESTADO_COLOR).map((k) => (
              <span key={k} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full border ${ESTADO_COLOR[k].split(' ').slice(0, 2).join(' ')}`}></span>
                {ESTADO_LABEL[k]}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            {allRows.length === 0 && <p className="text-on-surface-variant text-center py-8">Sin reservas en este mes.</p>}
            {allRows.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 text-sm bg-surface/40 border border-white/10 rounded-xl px-4 py-3">
                <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-full border ${ESTADO_COLOR[r.archivo ? 'archivada' : r.estado] || ESTADO_COLOR.archivada}`}>
                  {r.archivo ? `Archivada·${r.motivo || ''}` : r.estado}
                </span>
                <span className="text-white font-bold">{r.numero}</span>
                <span className="text-on-surface-variant">{r.vehiculo_nombre || ''}</span>
                <span className="text-on-surface-variant ml-auto">
                  {isoLocal(r.pickup_date)} → {isoLocal(r.return_date)} · ${r.total}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}