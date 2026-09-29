# Lateral Zinkin — web

Web de [Lateral Zinkin](https://lateralzinkin.com) en Next.js (App Router), desplegada en Vercel.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
```

## Contenido y SEO

Antes de publicar cualquier texto, sigue las normas de `docs/seo/`:

- [Normas de contenido y SEO](docs/seo/normas-contenido.md), incluido el uso de IA.
- [Voz de marca](docs/seo/voz-de-marca.md).
- [Análisis SEO](docs/seo/analisis-seo.md) con los problemas pendientes.

`npm run seo:check` comprueba títulos, descripciones, expresiones típicas de texto de IA y la cabecera de los artículos.

## Estructura

- `content/es.ts`, `en.ts`, `ca.ts` — **todo el texto de la web** por idioma. Las cifras marcadas con `EJEMPLO` son ilustrativas y deben validarse.
- `lib/site.ts` — datos de contacto, lista de clientes, URLs de reservas/Substack y foto del fundador.
- `app/[locale]/…` — páginas (`/es`, `/en`, `/ca`). `proxy.ts` redirige `/` al idioma del navegador.
- `app/api/lead` — recibe el formulario de contacto y los resultados del test.

## Variables de entorno (Vercel → Settings → Environment Variables)

Ver `.env.example`.

| Variable | Para qué |
| --- | --- |
| `RESEND_API_KEY` | Envío por email de contactos y resultados del test. Sin ella, los leads quedan en los logs de Vercel. |
| `LEAD_FROM_EMAIL` / `LEAD_TO_EMAIL` | Remitente verificado y destino (por defecto `lateral@lateralzinkin.com`). |
| `NEXT_PUBLIC_BOOKING_URL` | URL de Cal.com/Calendly para incrustar el calendario en `/contacto`. |
| `NEXT_PUBLIC_SUBSTACK_URL` | URL de la newsletter. |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico (SEO, sitemap). |

## Pendientes

- Foto de Nacho: subir a `public/img/nacho.jpg` y poner la ruta en `lib/site.ts` (`founderPhoto`).
- NIF en el aviso legal (`app/[locale]/legal/[doc]/page.tsx`) y revisión legal de los textos.
- Validar las cifras `EJEMPLO` de `content/*.ts`.
