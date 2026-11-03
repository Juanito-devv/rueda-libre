# GuzfalC.A — Alquiler de Vehículos

Sitio web comercial de **GuzfalC.A**, alquiler de vehículos por día en Punto Fijo, Venezuela. Dirigido a particulares y empresas, con reservas, panel administrativo y cierre de coordinación por WhatsApp.

**Sitio:** https://rueda-libre1.vercel.app/

---

## Características

- **Landing page** completa: propuesta de valor, flota, beneficios, Starlink, segmentos, cómo funciona, condiciones, garantías y CTA.
- **Catálogo** con filtros por categoría y segmento; acepta búsqueda desde el hero (`?tipo=`, `?desde=`, `?hasta=`).
- **Reservas** por vehículo (`/booking?id=<id>`): validación, cálculo de días/total, extras, garantías por edad, factura PDF y envío a WhatsApp.
- **Disponibilidad** con bloqueo de fechas y margen de 24 h.
- **Panel admin** (`/admin`): dashboard, reservas en etapas, calendario, vehículos, fotos y pagos.
- **Reservas en Supabase**, con número de reserva, vencimiento automático y notificaciones opcionales por WhatsApp (API de Meta).

## Stack

- [Next.js 14](https://nextjs.org/) (Pages Router) + React 18
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (base de datos y autenticación del admin)
- jsPDF (facturas)
- Material Symbols Outlined · Inter y Montserrat

## Empezar

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Crea un `.env.local` (ignorado por git) con las variables de la siguiente sección. Sin las variables de Supabase, las páginas que consultan datos fallarán.

## Variables de entorno

| Variable | Requerida | Uso |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Clave pública (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí (servidor) | API admin y cron. **Nunca** exponerla en el cliente |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL canónica y Open Graph |
| `CRON_SECRET` | Para cron | Autoriza `POST /api/cron/vencidas` |
| `WHATSAPP_PHONE_ID` | Opcional | Notificaciones vía API de Meta |
| `WHATSAPP_TOKEN` | Opcional | Token de la API de Meta |
| `WHATSAPP_TO` | Opcional | Número que recibe avisos |
| `NEXT_PUBLIC_BASE_PATH` | No | Solo builds legacy en subcarpeta; no usar en producción |

## Personalización

### 1. Datos de contacto y empresa

Edita **`src/config/site.js`**: fuente única de nombre, WhatsApp, correo, ubicación, ciudad de entrega, Instagram y URL base. Header, footer, CTAs y mensajes leen de aquí.

### 2. Flota, precios y extras

Edita **`src/data/vehicles.js`**:

- `vehicles[]`: nombre, categoría, tipo, año, transmisión, combustible, capacidad, carga, tarifa diaria (`dailyRate`), imagen, características, segmentos y descripción.
- `extras[]`: servicios adicionales con su precio por día.

### 3. Garantías, kilometraje y tarifas de ejemplo

Todo vive en **`src/config/site.js`**:

- `guarantees`: montos de garantía para mayor y menor de 30 años.
- `mileage`: kilómetros incluidos y precio del km adicional (`null` = "se cobra por separado").
- `exampleTariffs`: tarifas de ejemplo de la landing. Deben coincidir con `dailyRate` de `src/data/vehicles.js`.

Se muestran en `ConditionsSection.jsx` y `BookingForm.jsx`, que leen de `SITE`.

### 4. Mensaje de WhatsApp

**`src/utils/whatsapp.js`**: formato del mensaje y enlace `wa.me`. Los extras se resuelven desde `extras[]`.

### 5. Base de datos

El esquema y las funciones de Supabase están en **`migracion-v25.sql`**. Ejecútalo en el SQL Editor del proyecto antes de usar reservas, calendario o admin.

## Build y despliegue

```bash
npm run build
npm start
```

El proyecto **no** es export estático: incluye API routes (`/api/...`) para Supabase, admin y cron. Debe desplegarse en un hosting con Node (Vercel).

1. Importa el repositorio en [Vercel](https://vercel.com).
2. Framework preset: **Next.js**.
3. Define las variables de entorno del apartado anterior (Preview y Production).
4. Conecta el dominio propio y actualiza `NEXT_PUBLIC_SITE_URL`.

`vercel.json` está vacío a propósito. GitHub Pages ya no se usa: no se comitean artefactos de build (`_next/`, `*.html` de la raíz, `images/`, `.nojekyll`).

## Estructura

```
pages/
  index.js / catalog.js / booking.js / 404.js / admin.js
  api/                  reservas, disponibilidad, admin/*, cron/*
src/
  config/site.js        datos de contacto y empresa
  data/vehicles.js      flota y extras
  lib/                  Supabase, sesión admin, vehículos
  utils/                whatsapp, invoice, currency, disponibilidad, notify
  components/
    layout/             Header, Footer, WhatsAppButton
    landing/            secciones de la portada
    booking/            BookingForm, BookingSummary
    admin/              Dashboard, Reservas, Calendario, Vehículos, Pagos
  styles/globals.css
public/
  images/vehicles/      fotos de los vehículos
  favicon.svg
```

## Notas técnicas

- Las rutas de imágenes son relativas (`images/vehicles/...`) para funcionar en la raíz o en subrutas.
- `next.config.js` ignora ESLint en builds (`eslint.ignoreDuringBuilds`) y desactiva la optimización de imágenes.
- Las reservas sí se guardan en Supabase; WhatsApp se usa para coordinar la entrega.
