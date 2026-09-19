import { useState, useEffect, useCallback } from 'react';

const inputClass = "w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

const emptyForm = {
  marca: '',
  modelo: '',
  categoria: 'sedan',
  precio_dia: '',
  capacidad: 5,
  transmision: 'Automática',
  imagen: '',
  activo: true,
};

export default function VehiculosTab({ token, isAdmin }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(() => {
    fetch('/api/admin/vehiculos', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setRows(Array.isArray(d.vehicles) ? d.vehicles : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowAdd(true);
  };

  const startEdit = (v) => {
    setForm({ ...v });
    setEditingId(v.id_vehiculo);
    setShowAdd(false);
  };

  const save = async () => {
    if (!form.marca || !form.modelo || !form.precio_dia) {
      alert('Completa marca, modelo y precio');
      return;
    }
    const body = { ...form, precio_dia: Number(form.precio_dia) };
    if (editingId) body.id = editingId;
    const res = await fetch('/api/admin/vehiculos', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setShowAdd(false);
      setEditingId(null);
      load();
    } else {
      alert(data.error || 'Error al guardar');
    }
  };

  const toggle = async (v, field, value) => {
    const res = await fetch('/api/admin/vehiculos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: v.id_vehiculo, [field]: value }),
    });
    if (res.ok) load();
    else alert((await res.json()).error || 'Error');
  };

  const remove = async (v) => {
    if (!window.confirm(`¿Eliminar ${v.marca} ${v.modelo}?`)) return;
    const res = await fetch('/api/admin/vehiculos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: v.id_vehiculo }),
    });
    if (res.ok) load();
    else alert((await res.json()).error || 'Error');
  };

  const formJ = (
    <div className="glass-panel-luxury rounded-2xl p-5 border border-primary/30 mb-5 space-y-3">
      <p className="text-white font-bold text-sm">{editingId ? 'Editar vehículo' : 'Agregar vehículo al catálogo'}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input className={inputClass} value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} placeholder="Marca" />
        <input className={inputClass} value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} placeholder="Modelo" />
        <select className={inputClass} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
          <option value="sedan">Sedán</option>
          <option value="suv">SUV</option>
          <option value="camioneta">Camioneta</option>
          <option value="van">Van</option>
        </select>
        <input className={inputClass} type="number" value={form.precio_dia} onChange={(e) => setForm({ ...form, precio_dia: e.target.value })} placeholder="Precio USD/día" />
        <input className={inputClass} type="number" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} placeholder="Capacidad" />
        <input className={inputClass} value={form.transmision} onChange={(e) => setForm({ ...form, transmision: e.target.value })} placeholder="Transmisión" />
        <input className={`${inputClass} col-span-2`} value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="Imagen (ruta, ej. /images/vehicles/kia-rio.jpg)" />
      </div>
      <div className="flex gap-3">
        <button onClick={save} className="gold-btn px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest">Guardar</button>
        <button onClick={() => { setShowAdd(false); setEditingId(null); }} className="px-5 py-2.5 rounded-xl border border-white/20 text-on-surface-variant text-sm">Cancelar</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-on-surface-variant">{loading ? 'Cargando…' : `${rows.length} vehículo(s)`}</p>
        {isAdmin && (
          <button onClick={startAdd} className="gold-btn px-6 py-2.5 rounded-full text-sm font-bold tracking-widest">
            + Agregar vehículo
          </button>
        )}
      </div>

      {isAdmin && showAdd && formJ}

      {!loading &&
        rows.map((v) => {
          if (isAdmin && editingId === v.id_vehiculo) {
            return <div key={v.id_vehiculo}>{formJ}</div>;
          }
          return (
            <div key={v.id_vehiculo} className="glass-panel-luxury rounded-2xl p-5 border border-white/10 flex flex-wrap items-center gap-4 mb-3">
              <img src={v.imagen} alt="" className="w-16 h-12 object-cover rounded-lg border border-white/10" />
              <div className="flex-1 min-w-[180px]">
                <p className="text-white font-bold">
                  {v.marca} {v.modelo}
                  {v.bloqueado && <span className="text-accent-orange text-xs ml-1">· BLOQUEADO</span>}
                </p>
                <p className="text-on-surface-variant text-sm">${v.precio_dia}/día · {v.capacidad} pasajeros · {v.transmision}</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <input type="checkbox" className="accent-primary" checked={!!v.activo} onChange={(e) => toggle(v, 'activo', e.target.checked)} disabled={!isAdmin} />
                  Activo
                </label>
                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <input type="checkbox" className="accent-accent-orange" checked={!!v.bloqueado} onChange={(e) => toggle(v, 'bloqueado', e.target.checked)} disabled={!isAdmin} />
                  Bloqueado
                </label>
                {isAdmin && (
                  <>
                    <button onClick={() => startEdit(v)} className="px-4 py-2 rounded-xl border border-primary/40 text-primary text-sm hover:bg-primary/10">Editar</button>
                    <button onClick={() => remove(v)} className="px-4 py-2 rounded-xl border border-error/40 text-error text-sm hover:bg-error/10">Eliminar</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}