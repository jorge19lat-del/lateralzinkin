# Lateral Zinkin · instrucciones para asistentes de IA

Web en Next.js (App Router) con contenido en español, inglés y catalán. Todo el texto está en `content/{es,en,ca}.ts`.

## Antes de escribir o editar cualquier contenido

Lee y aplica, en este orden:

1. `docs/seo/voz-de-marca.md`: cómo suena la marca (tuteo, frases cortas, criterio, sin hype).
2. `docs/seo/normas-contenido.md`: normas SEO y de contenido con IA. Obligatorias.
3. `docs/seo/analisis-seo.md`: problemas conocidos y prioridades.

Reglas que no se pueden saltar:

- **No inventes** cifras, casos, testimonios, clientes ni fuentes. Si falta un dato real, deja un hueco marcado como `[PENDIENTE: …]` y avisa.
- Cada pieza necesita **ganancia de información** (normas §1): experiencia real de Nacho o del equipo, datos propios u opinión con firma. Si no te la han dado, **pídela** antes de redactar; no la sustituyas por generalidades.
- No generes contenido en serie ni páginas casi iguales (normas §2).
- Mantén las tres versiones de idioma sincronizadas: mismo significado y palabras clave adaptadas a cada idioma, nunca una traducción literal.
- Respeta los límites de `title` (30–60) y `description` (120–155) y el mapa de palabras clave (normas §5).

## Comprobaciones

```bash
npm run seo:check   # normas de contenido (debe terminar sin errores)
npm run build       # compilación
```

## Ramas

La rama principal es `main`. Crea ramas con nombres que describan el cambio (p. ej. `articulo-marketing-juridico`).
