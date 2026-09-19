import { supabaseAdmin } from './supabaseAdmin';

export async function getUserFromToken(token) {
  if (!token) return null;
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function getUserRol(userId) {
  const { data } = await supabaseAdmin()
    .from('perfiles')
    .select('rol, usuario')
    .eq('id', userId)
    .maybeSingle();
  if (!data) return null;
  return data.rol || data.usuario || null;
}

export async function requireAdmin(req) {
  const token = String(req.headers.authorization || '')
    .replace(/^Bearer\s+/i, '')
    .trim();
  const user = await getUserFromToken(token);
  if (!user) return { error: 401, payload: { error: 'No autorizado' } };
  const rol = await getUserRol(user.id);
  if (!rol) return { error: 403, payload: { error: 'Usuario sin rol asignado' } };
  return { user, rol };
}