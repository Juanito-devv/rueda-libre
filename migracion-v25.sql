-- ============================================================
-- GUZFALC.A · Migración V2.5
-- Abrir Supabase -> SQL Editor -> pegar y ejecutar.
-- ============================================================

-- 1) Flota: tipo de combustible y capacidad de carga
ALTER TABLE public.vehiculos
  ADD COLUMN IF NOT EXISTS combustible text DEFAULT 'Gasolina';
ALTER TABLE public.vehiculos
  ADD COLUMN IF NOT EXISTS cargo_kg integer DEFAULT 400;

-- 2) Reservas: campos de revisión post entrega
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS revision_ok boolean DEFAULT null;
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS revision_notas text DEFAULT null;
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS revision_por text DEFAULT null;
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS revision_en timestamptz DEFAULT null;

-- 3) Reservas historial: también registrar la revisión de la devolución
ALTER TABLE public.reservas_historial
  ADD COLUMN IF NOT EXISTS revision_ok boolean DEFAULT null;
ALTER TABLE public.reservas_historial
  ADD COLUMN IF NOT EXISTS revision_notas text DEFAULT null;