import { useState, useEffect } from 'react';
import ReservaCard from './ReservaCard';

const ESTADOS = [
  { id: 'pendiente', name: 'Por confirmar' },
  { id: 'confirmada', name: 'Confirmadas' },
  { id: 'en_curso', name: 'En curso' },
  { id: 'revision', name: 'Revisión' },
];

function downloadCsv(rows, filename) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = [
    'Número',
    'Estado',
    'Vehículo',
    'Cliente',
    'Cédula/RIF',
    'Teléfono',
    'Correo',
    'Recogida',
    'Devolución',
    'Días',
    'Total ($)',
    'Forma de pago',
    'Método',
    'Creado',
  ];
  const lines = rows.map((r) =>
    [
      esc(r.numero),
      esc(r.estado || (r.archivo ? 'archivada' : '')),
      esc(r.vehiculo_nombre || ''),
      esc(r.nombre_cliente),
      esc(r.cedula),
      esc(r.telefono),
      esc(r.email),
      esc(r.pickup_date),
      esc(r.return_date),
      r.dias,
      r.total,
      esc(r.forma_pago === 'comprobante' ? 'Comprobante' : 'Sitio (efectivo)'),
      esc(r.metodo_pago),
      countCsvDate(r.archivo ? r.archivado_en : r.creado_en),
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

function isoToLocal(v) {
  if (!v) return '';
  try {
    return new Date(v).toLocaleDateString('es-VE');
  } catch (e) {
    return String(v);
  }
}

function countCsvDate(v) {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function ReservasTab({ token, onRole, initialEstado = 'pendiente' }) {
  const [estado, setEstado] = useState(initialEstado);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    let on = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (buscando && q.trim()) params.set('q', q.trim());
    else params.set('estado', estado);
    if (vehiculo) params.set('vehiculo', vehiculo);
    fetch(`/api/admin/reservas?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!on) return;
        if (d.rol) onRole(d.rol);
        setRows(Array.isArray(d.reservations) ? d.reservations : []);
        if (Array.isArray(d.vehicles)) setVehicles(d.vehicles);
        setLoading(false);
      })
      .catch(() => { if (on) setLoading(false); });
    return () => { on = false; };
  }, [estado, q, buscando, vehiculo, token, refresh, onRole]);

  const selectVehiculo = (id) => {
    setVehiculo(id);
    setBuscando(false);
    setQ('');
    setSearchInput('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQ(searchInput.trim());
    setBuscando(true);
  };

  const clearSearch = () => {
    setQ('');
    setSearchInput('');
    setBuscando(false);
    setEstado(initialEstado);
  };

  const name = buscando ? `Resultados para «${q}»` : estado === 'revision' ? 'Revisión post entrega' : estado;
  const vehiculoNombre = vehicles.find((v) => v.id === vehiculo)?.nombre || '';

  return (
    <div>
      <p className="text-on-surface-variant text-sm mb-4">
        {buscando
          ? `Busqueda en reservas activas y archivadas. ${rows.length} resultado(s).`
          : estado === 'pendiente'
            ? 'Pendientes ordenadas por fecha de creación (las más antiguas primero). Confirma la reserva cuando valides el pago o comprobante.'
            : `Mostrando reservas en estado «${name}».`}
        {vehiculoNombre && ` Vehículo: ${vehiculoNombre}.`}
        {buscando && (
          <button onClick={clearSearch} className="text-primary hover:text-white ml-3 uppercase tracking-widest text-xs font-bold">
            Limpiar búsqueda
          </button>
        )}
      </p>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {!buscando &&
          ESTADOS.map((e) => (
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
        <select
          value={vehiculo}
          onChange={(e) => selectVehiculo(e.target.value)}
          className="bg-surface/50 border border-white/10 rounded-full py-2.5 px-4 text-on-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">Todos los vehículos</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.nombre}</option>
          ))}
        </select>
        {vehiculo && !buscando && (
          <button
            onClick={() => selectVehiculo('')}
            className="px-4 py-2.5 rounded-full border border-white/20 text-on-surface-variant text-xs font-bold tracking-widest hover:text-white transition-colors"
          >
            Quitar filtro
          </button>
        )}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 ml-auto">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por N° comprobante (GZ-…)"
            className="bg-surface/50 border border-white/10 rounded-full py-2.5 px-4 text-on-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-on-surface-variant/50 w-64"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-bold tracking-widest hover:bg-primary/10 transition-colors"
          >
            Buscar
          </button>
        </form>
        <button
          onClick={() => rows.length > 0 && downloadCsv(rows, `resumen-${buscando ? 'busqueda' : estado}-${countCsvDate(new Date().toISOString())}.csv`)}
          disabled={rows.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-bold tracking-widest hover:bg-primary/10 disabled:opacity-40 transition-colors"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Descargar resumen
        </button>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-12">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="text-on-surface-variant text-center py-16">
          {buscando ? `Sin resultados para «${q}».` : `Sin reservas en ${name} por ahora.`}
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