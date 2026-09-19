import { supabaseAdmin } from './supabaseAdmin';
import { vehicles as fallbackVehicles } from '../data/vehicles';
import { SITE } from '../config/site';

const TYPE_LABEL = { sedan: 'Sedán', suv: 'SUV', camioneta: 'Camioneta', van: 'Van' };
const FUEL_BY_CATEGORY = { sedan: 'Gasolina', suv: 'Gasolina', camioneta: 'Diésel', van: 'Diésel' };
const CARGO_BY_CATEGORY = { sedan: '400 kg', suv: '600 kg', camioneta: '1,000 kg', van: '2,500 kg' };

export function rowToVehicle(row) {
  return {
    id: row.id_vehiculo,
    name: `${row.marca} ${row.modelo}`.trim(),
    category: row.categoria,
    type: TYPE_LABEL[row.categoria] || row.categoria || 'Vehículo',
    transmission: row.transmision,
    fuel: FUEL_BY_CATEGORY[row.categoria] || 'Gasolina',
    capacity: row.capacidad,
    cargo: CARGO_BY_CATEGORY[row.categoria] || '—',
    dailyRate: Number(row.precio_dia) || 0,
    image: (() => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      if (!row.imagen) return '';
      return row.imagen.startsWith('/') ? `${basePath}${row.imagen}` : row.imagen;
    })(),
    segment: Array.isArray(row.segmentos) ? row.segmentos : ['particular', 'empresa'],
    available: !!row.activo,
    blocked: !!row.bloqueado,
    features: [],
    description: `${row.marca} ${row.modelo} disponible para alquiler en ${SITE.deliveryCity}.`,
  };
}

export async function fetchVehicles() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('vehiculos')
      .select('*')
      .eq('activo', true)
      .order('precio_dia', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return { vehicles: fallbackVehicles, fromDb: false };
    return { vehicles: data.map(rowToVehicle), fromDb: true };
  } catch (e) {
    console.error('[vehiculos] DB no disponible, usando datos locales:', e.message);
    return { vehicles: fallbackVehicles, fromDb: false };
  }
}

export async function fetchVehicleById(id) {
  if (!id) return { vehicle: null, fromDb: false };
  try {
    const { data, error } = await supabaseAdmin()
      .from('vehiculos')
      .select('*')
      .eq('id_vehiculo', id)
      .maybeSingle();
    if (error) throw error;
    return { vehicle: data ? rowToVehicle(data) : null, fromDb: true };
  } catch (e) {
    console.error('[vehiculo] DB no disponible, usando datos locales:', e.message);
    const local = fallbackVehicles.find((v) => v.id === Number(id)) || null;
    return { vehicle: local, fromDb: false };
  }
}

export async function fetchAllVehicleRows() {
  const { data, error } = await supabaseAdmin()
    .from('vehiculos')
    .select('*')
    .order('precio_dia', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchPaymentMethods() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('ajustes')
      .select('*')
      .eq('activo', true)
      .order('creado_en', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('[ajustes] DB no disponible:', e.message);
    return [];
  }
}