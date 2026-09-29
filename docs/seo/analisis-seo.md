# Análisis SEO de la web · septiembre 2026

Auditoría del código y del HTML generado (`next build` + `next start`) de la web en Next.js. Prioridad: 🔴 alta · 🟠 media · 🟢 baja · ✅ resuelto.

> **Actualización:** resueltos T1, T2, C1, C3 y C4. Cada página tiene ya título, descripción, hreflang (con `x-default`) y Open Graph propios, definidos en el bloque `seo` de `content/*.ts` y aplicados con `lib/seo.ts`. Se han retirado los casos anónimos y la estadística «9/10» porque no eran verificables. `npm run seo:check` termina sin errores ni avisos.

## Resumen

La base técnica es buena (HTML estático, un idioma por URL, sitemap con hreflang, datos estructurados, textos propios y testimonios reales). Los problemas están en tres sitios:

1. **Metadatos de las páginas interiores** incompletos (hreflang, Open Graph y títulos sin intención de búsqueda).
2. **No hay dónde publicar contenido.** No existe blog ni sección de ideas, y la newsletter va a Substack, que posiciona el dominio de Substack, no el vuestro.
3. **Señales de confianza (E-E-A-T)** mejorables: cifras marcadas como `EJEMPLO`, sin autoría ni fechas en el contenido y sin la ficha de Google Business Profile enlazada.

## 1. Técnico

| # | Prioridad | Hallazgo | Dónde | Solución |
|---|---|---|---|---|
| T1 | ✅ | Las páginas interiores **no tienen hreflang**: el `alternates` de cada página sustituye al del layout y solo la portada lo conserva. Tampoco hay `x-default`. | `app/[locale]/*/page.tsx` | Crear un helper `pageMetadata(locale, path)` que devuelva `canonical` + `languages` (es, en, ca, x-default) para cada ruta. |
| T2 | ✅ | **Open Graph duplicado**: todas las páginas comparten el `og:title` y `og:description` de la portada, así que al compartir un sector o un caso se ve el texto de la home. | layout + páginas | El helper anterior debe rellenar también `openGraph.title/description/url`. |
| T3 | 🟠 | **El H1 de la portada se renderiza oculto** (`translateY(110%)`) hasta que carga JavaScript. Retrasa el LCP y deja el titular invisible si falla el JS. | `components/Hero.tsx` | Animar solo con CSS a partir del HTML visible, o no aplicar `initial` en el primer render. |
| T4 | 🟠 | La imagen OG es la misma, en español, para los tres idiomas y todas las páginas. | `app/opengraph-image.tsx` | Moverla a `app/[locale]/opengraph-image.tsx` y generarla con el título de cada página. |
| T5 | 🟠 | El `lastmod` del sitemap es la fecha del build, no la del último cambio real. Google deja de fiarse de esa señal. | `app/sitemap.ts` | Usar la fecha `updated` de cada contenido. |
| T6 | 🟢 | La página 404 está solo en español. | `app/[locale]/not-found.tsx` | Traducirla. |
| T7 | 🟢 | Formato de idioma distinto en sitemap (`es`) y HTML (`es-ES`). Ambos son válidos, pero conviene unificarlo. | `sitemap.ts` / `layout.tsx` | Usar `localeTags` en los dos. |
| T8 | 🟢 | `FAQPage` en sectores: Google ya casi no muestra ese resultado enriquecido, pero sí ayuda a que la IA entienda las preguntas. | sectores | Mantener. No añadir estrellas de reseñas con testimonios propios: Google no las admite y es spam. |
| T9 | 🔴 (al lanzar) | **Dominio**: la web vive en `lateralzinkin.vercel.app` (protegida por Vercel) y el WordPress antiguo sigue en `lateralzinkin.com`. Hasta conectar el dominio, Google no indexa nada nuevo. | Vercel / DNS | Conectar el dominio, poner `NEXT_PUBLIC_SITE_URL=https://lateralzinkin.com`, redirigir con 301 las URLs antiguas (PDF legales incluidos) y enviar el sitemap en Search Console. |

## 2. Contenido y búsqueda

| # | Prioridad | Hallazgo | Solución |
|---|---|---|---|
| C1 | ✅ | **Títulos sin palabras que la gente busca**: «Servicios — Lateral Zinkin», «Cultura y editorial — Lateral Zinkin». Nadie busca «cultura y editorial». | Aplicar el mapa de palabras clave de [normas-contenido.md](./normas-contenido.md#5-mapa-de-palabras-clave) (p. ej. «Marketing editorial y cultural en Madrid»). |
| C2 | 🔴 | **Sin sección de contenido propio.** Todo el contenido que se escribe (newsletter) acaba en substack.com. | Crear `/ideas` (blog) en la web y publicar ahí primero; Substack reenvía el artículo con enlace canónico a la web. |
| C3 | ✅ | Descripciones demasiado largas o poco comerciales: la home tiene 181 caracteres (se corta a ~155) y la de servicios no dice qué servicio ni dónde. | Seguir los límites de las normas; `npm run seo:check` lo comprueba. |
| C4 | ✅ | **Cifras `EJEMPLO`** en casos anónimos y en «9/10 clientes repiten». Para Google (y para un cliente) una cifra no verificable resta confianza. | Sustituirlas por datos reales antes de conectar el dominio o quitarlas. |
| C5 | 🟠 | No hay página de caso individual: los casos viven en tarjetas y no pueden posicionar por sí solos («caso de éxito marketing despacho abogados»). | Página por caso con reto, ángulo, proceso y resultado. |
| C6 | 🟠 | Falta contenido local: Madrid solo aparece en el pie y en los datos estructurados. | Mencionar Madrid de forma natural en portada, sectores y Nacho; enlazar la ficha de Google Business Profile. |
| C7 | 🟢 | Pocos enlaces internos contextuales (casi todos son botones). | Enlazar desde el texto: sector → caso → servicio → contacto. |

## 3. Confianza (E-E-A-T)

- ✅ Testimonios reales con nombre, cargo y empresa, y clientes reales.
- ✅ Fundador con trayectoria verificable (ICADE, IMF, 2007).
- ❌ El contenido no tiene autoría ni fechas visibles.
- ❌ No se enlazan perfiles externos que confirmen la autoridad de Nacho (IMF, ponencias, prensa).
- ❌ No hay fotos reales de Nacho ni del trabajo (la foto es un marcador «NL!»).

## 4. Búsqueda con IA (AI Overviews, AI Mode, ChatGPT, Perplexity)

Las respuestas de IA citan páginas que responden de forma directa, están bien estructuradas y aportan algo propio (datos, casos, opinión experta con firma). Hoy la web no tiene páginas de ese tipo más allá de las FAQ de sectores. La sección `/ideas` y las normas cubren este hueco.

## Próximos pasos recomendados

1. ~~Corregir T1, T2 y C1~~ ✅
2. Crear `/ideas` con el formato de las normas y publicar 1 o 2 piezas al mes.
3. Conectar el dominio con redirecciones 301 y Search Console (T9).
4. Añadir casos con cifras reales (retirados los inventados) y la foto de Nacho.
