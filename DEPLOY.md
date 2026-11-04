# Despliegue a guzfalca.com

Guía del lanzamiento. **Comprar el dominio no modifica el código ni la base de datos.**

## Arquitectura (quién hace qué)

| Pieza | Servicio | Costo |
|---|---|---|
| Dominio + DNS | **Spaceship** | Anual (solo el dominio) |
| Hosting de la web | **Vercel** (Hobby) | $0/mes |
| Base de datos, auth y fotos | **Supabase** (Free) | $0/mes |
| Anti-pausa de Supabase | GitHub Actions | $0 |

> Spaceship **no es el hosting**. Es el registrador y el DNS. La web sigue viviendo en Vercel; el dominio solo apunta hacia allá. No hay que subir el proyecto a Spaceship.

El sitio actual (`https://rueda-libre1.vercel.app`) sigue funcionando siempre. El dominio propio se agrega como alias.

## ¿Puedo comprar el dominio antes de tener la data?

Sí. Comprar el dominio **no publica ni cambia la web**. Hay dos caminos válidos:

- **Comprarlo y dejar el DNS quieto:** el nombre queda asegurado y la web sigue en `rueda-libre1.vercel.app`.
- **Comprarlo y apuntarlo a Vercel el mismo día:** la web pasa a verse en `guzfalca.com` con el contenido actual; los datos se actualizan después con `git push`.

No se "sube" nada a Spaceship. El código ya está en Vercel y se actualiza con cada push. Spaceship solo guarda el dominio y el DNS.

Cosas que **no** hacen falta al comprar: hosting, email, website builder ni transferir el dominio a Vercel. Si Spaceship los ofrece como extra, se pueden omitir.

Recomendaciones al comprar: activar renovación automática, bloqueo de transferencia y verificación en dos pasos.

## Antes del día del lanzamiento

- [ ] Variables de entorno en Vercel (Production y Preview):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CRON_SECRET`
  - Opcionales: `WHATSAPP_PHONE_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_TO`
  - `NEXT_PUBLIC_SITE_URL` **ya no se usa**: el dominio vive en `src/config/site.js` (`baseUrl`). Si existe en Vercel, se puede borrar.
- [ ] Ejecutar `migracion-v25.sql` en Supabase → SQL Editor.
- [ ] Crear el usuario admin en Supabase Auth y su fila en `perfiles` con rol.
- [ ] Probar en `rueda-libre1.vercel.app`: landing, `/catalog`, `/booking`, `/admin`, PDF y WhatsApp.
- [ ] Confirmar que el workflow `.github/workflows/anti-pausa.yml` está activo (Actions).

## Día del lanzamiento (30–60 min)

1. **Comprar** `guzfalca.com` en Spaceship. No tocar nada del proyecto.
2. En Vercel: proyecto → **Settings → Domains → Add**.
   Agregar `guzfalca.com` y `www.guzfalca.com`.
3. Vercel muestra los registros DNS. Elegir **una** opción:

   **Opción A — nameservers (recomendada, Vercel gestiona todo):**
   - Spaceship → dominio → Nameservers → personalizados.
   - Usar los que muestre Vercel (normalmente `ns1.vercel-dns.com` y `ns2.vercel-dns.com`).

   **Opción B — mantener el DNS de Spaceship:**
   - Crear `A` para `@` con la IP que muestre Vercel.
   - Crear `CNAME` para `www` apuntando a `cname.vercel-dns.com`.
   - Usar siempre los valores exactos de la pantalla de Vercel.

4. Esperar propagación (normalmente menos de 1 hora; hasta 48 h).
5. Verificar: candado HTTPS, `www` redirige al dominio principal, y cargar `/`, `/catalog`, `/booking`, `/admin` recargando directo.
6. Verificar que el HTML servido tenga `og:image` con `https://www.guzfalca.com`
   (el dominio se define en `src/config/site.js` → `baseUrl`).

## Rollback (si algo sale mal)

- La web nunca deja de estar en `https://rueda-libre1.vercel.app`.
- Quitar el dominio en Vercel y restaurar nameservers/DNS en Spaceship.
- No se borra código, ni reservas, ni fotos. El cambio de DNS es reversible.

## Por qué no se daña nada

- Comprar el dominio no toca el repositorio ni Supabase.
- El DNS solo decide a dónde apunta el nombre; se puede revertir.
- `SITE.baseUrl` solo afecta metadatos (OG/canonical) y el pie de las facturas, no la lógica.
- Las reservas viven en Supabase; el dominio no interviene.

## Después del lanzamiento

- Alta en Google Search Console con `https://guzfalca.com`.
- Actualizar Instagram, Google Business y tarjetas con el dominio nuevo.
- Mantener el alias de Vercel como respaldo.
- Revisar el uso de Supabase (DB < 500 MB, Storage < 1 GB) una vez al mes.

## Si más adelante se quiere salir de Vercel

Vercel Hobby es para uso no comercial. Si eso se vuelve un problema, las alternativas gratuitas que permiten uso comercial son Cloudflare Pages y Netlify Free; implican adaptar las API routes. No es necesario para el lanzamiento.
