# Rueda Libre — Alquiler de Vehículos

Sitio web comercial de **Rueda Libre**, una empresa de alquiler de vehículos por día en Caracas, Venezuela. El sitio está dirigido a **particulares y empresas** e integra reservas que se coordinan por WhatsApp.

**Demo:** https://rueda-libre1.vercel.app/

---

## Características

- **Landing page** completa: propuesta de valor, flota destacada, beneficios, sección Starlink, segmentos (particular/empresa), cómo funciona, condiciones y garantías, y CTA final.
- **Catálogo** con filtros por categoría (Sedanes, SUVs, Camionetas, Vans) y por segmento (Particulares / Empresas). Acepta búsqueda del hero (`?tipo=`, `?desde=`, `?hasta=`).
- **Reservas** por vehículo (`/booking?id=<id>`): formulario con validación, cálculo automático de días y total (incluye extras), y envío de la reserva a WhatsApp con mensaje formateado.
- **Extras** configurables (Chofer Corporativo, Entrega a Domicilio, Seguro Extendido, Starlink Premium).
- **404 personalizado** en español.
- Export **100% estático** (`output: 'export'`): funciona en cualquier hosting estático.

## Stack

- [Next.js 14](https://nextjs.org/) (pages router) + React 18
- [Tailwind CSS 3](https://tailwindcss.com/)
- Iconos: Material Symbols Outlined
- Tipografías: Inter y Montserrat (Google Fonts)

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Personalización

### 1. Datos de contacto y empresa (importante)

Edita **`src/config/site.js`**: es la fuente única de número de WhatsApp, correo, ciudad de entrega y URL del sitio. Todos los botones y el footer leen de aquí.

```js
export const SITE = {
  name: 'Rueda Libre',
  whatsappNumber: '584129706050',          // número con código de país, sin '+'
  whatsappDisplay: '+58 412-9706050',
  email: 'info@ruedalibre.com',
  location: 'Caracas, Venezuela',
  deliveryCity: 'Caracas, La California',  // se muestra en el mensaje de WhatsApp
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rueda-libre1.vercel.app',
};
```

> `NEXT_PUBLIC_SITE_URL` se usa para las etiquetas Open Graph (`og:image`). Si cambias de dominio, define esta variable en el hosting.

### 2. Flota, precios y extras

Edita **`src/data/vehicles.js`**:

- `vehicles[]`: nombre, categoría, tipo, año, transmisión, combustible, capacidad, carga, tarifa diaria (`dailyRate`), imagen (relativa a `public/images/vehicles/`), características, segmentos y descripción.
- `extras[]`: servicios adicionales con su precio por día.

### 3. Garantías y tarifas de ejemplo

- En **`src/components/landing/ConditionsSection.jsx`** se muestran las garantías por edad y tarifas de ejemplo. **Mantén las tarifas consistentes con `dailyRate` del catálogo.**
- El mismo bloque de garantías se repite en el formulario de reserva (**`src/components/booking/BookingForm.jsx`**).

### 4. Mensaje de WhatsApp

Edita **`src/utils/whatsapp.js`**: formato del mensaje (`generateWhatsAppMessage`) y construcción del enlace `wa.me` (`getWhatsAppUrl`). Los extras se resuelven automáticamente desde `extras[]` (no repetir nombres a mano).

## Build y despliegue

El proyecto genera una salida estática.

```bash
npm run build
```

La salida queda en `out/` (y también `.next/`). Este proyecto está pensado para **Vercel en la raíz** (dominio propio), que es como está publicado el demo:

1. Importa el repositorio en [Vercel](https://vercel.com).
2. Framework preset: **Next.js**. El comando de build (`next build`) y la salida se detectan automáticamente.
3. Opcional: define `NEXT_PUBLIC_SITE_URL` con tu dominio de producción.

### Despliegue en GitHub Pages (subruta)

Si prefieres GitHub Pages en `/rueda-libre`:

```bash
NEXT_PUBLIC_BASE_PATH=/rueda-libre npm run build
```

Copia el contenido de `out/` a la rama de publicación (o al repo de páginas) y añade un archivo `.nojekyll`.

## Estructura

```
pages/
  index.js        → landing page
  catalog.js      → catálogo con filtros
  booking.js      → reserva por vehículo (?id=)
  404.js          → página no encontrada
src/
  config/site.js      → datos de contacto y empresa
  data/vehicles.js    → flota y extras
  utils/whatsapp.js   → mensaje y enlace de WhatsApp
  components/
    layout/           → Header, Footer, WhatsAppButton
    landing/          → secciones de la portada
    booking/          → BookingForm, BookingSummary
  styles/globals.css  → estilos globales y utilidades
public/
  images/vehicles/    → fotos de los vehículos
  favicon.svg
```

## Notas técnicas

- Las rutas de las imágenes son relativas (`images/vehicles/...`) para funcionar tanto en la raíz como en subrutas con `NEXT_PUBLIC_BASE_PATH`.
- `next.config.js` ignora ESLint en builds (`eslint.ignoreDuringBuilds`) y usa `output: 'export'` con imágenes sin optimizar (export estático).
- La reserva no almacena datos en servidor: genera el mensaje y abre WhatsApp. Así no se requiere backend.