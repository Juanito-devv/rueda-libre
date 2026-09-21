import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { requireAdmin } from '../../../src/lib/adminSession';

const CATEGORIES = ['sedan', 'suv', 'camioneta', 'van'];
const FUELS = ['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido'];

function validateInput(b) {
  const errors = [];
  if (b.marca === undefined && b.modelo === undefined && b.categoria === undefined && b.precio_dia === undefined) {
    errors.push('Envía al menos marca, modelo, categoría o precio');
  }
  if (b.precio_dia !== undefined && (!Number.isFinite(Number(b.precio_dia)) || Number(b.precio_dia) <= 0)) {
    errors.push('Precio diario inválido');
  }
  if (b.categoria !== undefined && !CATEGORIES.includes(b.categoria)) {
    errors.push('Categoría inválida (sedan, suv, camioneta, van)');
  }
  if (b.combustible !== undefined && !FUELS.includes(b.combustible)) {
    errors.push('Combustible inválido (Gasolina, Diésel, Eléctrico, Híbrido)');
  }
  if (b.cargo_kg !== undefined && (!Number.isFinite(Number(b.cargo_kg)) || Number(b.cargo_kg) <= 0)) {
    errors.push('Capacidad de carga inválida');
  }
  const bools = ['activo', 'bloqueado'];
  for (const k of bools) {
    if (b[k] !== undefined && typeof b[k] !== 'boolean') errors.push(`El campo ${k} debe ser booleano`);
  }
  if (b.segmentos !== undefined && !Array.isArray(b.segmentos)) errors.push('segmentos debe ser un arreglo');
  return errors;
}

async function insertVehicle(sb, row) {
  const { data, error } = await sb.from('vehiculos').insert(row).select().single();
  if (error && /column .* does not exist/i.test(error.message)) {
    const { combustible, cargo_kg, ...base } = row;
    const retry = await sb.from('vehiculos').insert(base).select().single();
    return retry;
  }
  return { data, error };
}

async function updateVehicle(sb, update, id) {
  const { data, error } = await sb.from('vehiculos').update(update).eq('id_vehiculo', id).select().single();
  if (error && /column .* does not exist/i.test(error.message)) {
    const { combustible, cargo_kg, ...base } = update;
    const retry = await sb.from('vehiculos').update(base).eq('id_vehiculo', id).select().single();
    return retry;
  }
  return { data, error };
}

export default async function handler(req, res) {
  const { user, rol, error, payload } = await requireAdmin(req);
  if (error) return res.status(error).json(payload);
  if (rol !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede gestionar la flota' });

  const sb = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error: e } = await sb.from('vehiculos').select('*').order('precio_dia', { ascending: true });
    if (e) return res.status(500).json({ error: e.message });
    return res.status(200).json({ vehicles: data || [] });
  }

  if (req.method === 'POST') {
    const b = req.body || {};
    const errs = validateInput(b);
    if (b.marca === undefined || b.modelo === undefined || b.categoria === undefined || b.precio_dia === undefined) {
      errs.push('Faltan marca, modelo, categoría o precio');
    }
    if (errs.length) return res.status(400).json({ error: errs.join('. ') });
    const row = {
      marca: b.marca.trim(),
      modelo: b.modelo.trim(),
      categoria: b.categoria,
      precio_dia: Number(b.precio_dia),
      capacidad: b.capacidad ?? 5,
      transmision: b.transmision || 'Automática',
      imagen: b.imagen || '',
      activo: b.activo ?? true,
      bloqueado: b.bloqueado ?? false,
      segmentos: b.segmentos || ['particular', 'empresa'],
      combustible: b.combustible || 'Gasolina',
      cargo_kg: Number(b.cargo_kg) || 400,
    };
    const { data, error: e } = await insertVehicle(sb, row);
    if (e) return res.status(500).json({ error: e.message });
    return res.status(201).json({ vehicle: data });
  }

  if (req.method === 'PATCH') {
    const { id, ...changes } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Falta el id' });
    const errs = validateInput(changes);
    if (errs.length) return res.status(400).json({ error: errs.join('. ') });
    const update = {};
    if (changes.marca !== undefined) update.marca = String(changes.marca).trim();
    if (changes.modelo !== undefined) update.modelo = String(changes.modelo).trim();
    if (changes.categoria !== undefined) update.categoria = changes.categoria;
    if (changes.precio_dia !== undefined) update.precio_dia = Number(changes.precio_dia);
    if (changes.capacidad !== undefined) update.capacidad = Number(changes.capacidad) || 5;
    if (changes.transmision !== undefined) update.transmision = String(changes.transmision);
    if (changes.imagen !== undefined) update.imagen = String(changes.imagen);
    if (changes.activo !== undefined) update.activo = Boolean(changes.activo);
    if (changes.bloqueado !== undefined) update.bloqueado = Boolean(changes.bloqueado);
    if (changes.segmentos !== undefined) update.segmentos = changes.segmentos;
    if (changes.combustible !== undefined) update.combustible = changes.combustible;
    if (changes.cargo_kg !== undefined) update.cargo_kg = Number(changes.cargo_kg);
    const { data, error: e } = await updateVehicle(sb, update, id);
    if (e) return res.status(500).json({ error: e.message });
    return res.status(200).json({ vehicle: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Falta el id' });
    const { error: e } = await sb.from('vehiculos').delete().eq('id_vehiculo', id);
    if (e) return res.status(500).json({ error: e.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}