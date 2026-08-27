import { Html, Head, Main, NextScript } from 'next/document'
import { SITE } from '../src/config/site'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function Document() {
  const ogImage = `${SITE.baseUrl}${basePath}/images/vehicles/toyota-corolla.jpg`

  return (
    <Html lang="es" className="dark scroll-smooth">
      <Head>
        <title>Rueda Libre - Muévete con Confianza</title>
        <meta name="description" content={SITE.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0c0d" />
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={`${SITE.name} - ${SITE.tagline}`} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:locale" content="es_VE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE.name} - ${SITE.tagline}`} />
        <meta name="twitter:description" content={SITE.description} />
        <meta name="twitter:image" content={ogImage} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}