# Normas de contenido y SEO · Lateral Zinkin

Normas obligatorias para todo lo que se publique en la web (páginas, casos, artículos en `/ideas`, textos de `content/*.ts`), lo escriba una persona o una IA. Se complementan con la [guía de voz de marca](./voz-de-marca.md) y se comprueban con `npm run seo:check`.

---

## 0. Qué dice Google de verdad sobre el contenido con IA

- **Google no penaliza que un texto esté hecho con IA.** Penaliza el contenido **poco útil y hecho en serie** para posicionar («scaled content abuse»), lo haya escrito una IA o una persona.
- Desde 2024 el sistema de «contenido útil» forma parte del algoritmo principal. Premia el contenido **hecho para personas**, con **experiencia, conocimiento, autoridad y confiabilidad** (E-E-A-T), y pide que quede claro **quién** lo ha hecho, **cómo** y **por qué**.
- El texto de IA posiciona mal porque es **intercambiable**: repite lo que ya está en los diez primeros resultados, sin experiencia ni datos propios. Por eso no aporta información nueva.

**Por tanto, «romper» esa barrera no consiste en disimular que se usa IA**, lo que además no funciona: no hay detector fiable y Google no evalúa eso. Consiste en **meter en cada pieza lo que una IA no puede inventar**: la experiencia de Nacho, casos reales, datos propios y opiniones con firma. Estas normas obligan a hacerlo.

---

## 1. Regla de oro: ganancia de información

Ninguna pieza se publica si no incluye **al menos dos** de estos elementos, y uno de ellos tiene que ser de los tres primeros:

1. **Experiencia de primera mano**: un caso o una anécdota real con detalles concretos (quién, cuándo, qué salió mal, qué se cambió).
2. **Datos propios**: cifras de proyectos, del test de visibilidad o de encuestas a clientes, con su fuente.
3. **Opinión con firma** que tome partido, sobre todo si contradice lo que dice todo el mundo, y explique por qué.
4. **Método o marco propio** (p. ej. el test de visibilidad, el «ángulo lateral»).
5. **Material original**: fotos del trabajo, capturas, plantillas, ejemplos antes y después.
6. **Cita de un cliente o experto** real, con nombre y permiso.

> Prueba rápida: si otra agencia pudiera firmar el texto cambiando el logo, no está listo.

---

## 2. Cómo se usa la IA (permitido y prohibido)

**Permitido** (la IA como ayudante):
- Investigar el tema y ver qué dicen los primeros resultados, para **no repetirlo**.
- Proponer esquemas, títulos alternativos o preguntas frecuentes.
- Hacer un primer borrador **a partir de las notas, audios o ideas de Nacho**.
- Revisar gramática y claridad, y proponer la traducción de partida.

**Obligatorio:**
- Que una persona del equipo **aporte la experiencia** (sección 1), **edite a fondo**, compruebe cada dato y firme.
- Que la versión en catalán y en inglés **la revise un hablante nativo** antes de publicar.

**Prohibido:**
- Publicar un texto de IA sin revisión humana.
- Generar piezas **en lote** o páginas casi iguales cambiando una palabra (por ciudad, por sector, por servicio).
- Reescribir artículos de otros («spinning») o resumirlos sin aportar nada.
- Inventar cifras, casos, testimonios o fuentes. Todo dato debe poder enlazarse o documentarse.
- Publicar la traducción automática sin revisar.

**Ritmo:** calidad antes que volumen. **Máximo 4 piezas al mes** y nunca varias el mismo día. Es mejor una pieza excelente al mes que diez mediocres.

---

## 3. Tipos de contenido

| Tipo | Dónde | Objetivo | Extensión orientativa |
|---|---|---|---|
| Página de sector | `/sectores/*` | Captar búsquedas comerciales («marketing para abogados Madrid») | 900–1.500 palabras |
| Caso | `/casos/*` | Demostrar resultados y posicionar búsquedas de caso | 700–1.200 |
| Artículo de ideas | `/ideas/*` | Autoridad, búsquedas informativas, citas en IA | 1.000–2.000 |
| Preguntas frecuentes | dentro de cada página | Responder dudas reales de clientes | 40–80 palabras por respuesta |

La extensión la marca la intención de búsqueda, no un objetivo de palabras. No se rellena.

**Estructura de un artículo de ideas:**
1. **Titular** con la palabra clave y una promesa concreta.
2. **Entradilla (40–60 palabras)** que responde directamente a la pregunta del titular. Es la frase que citarán Google y las IA.
3. **El ángulo lateral**: qué hace todo el mundo y por qué nosotros lo vemos distinto.
4. **Desarrollo** con subtítulos (H2) en forma de pregunta real, cada uno con un caso, un dato o un ejemplo.
5. **Qué harías tú mañana**: pasos accionables.
6. **Autoría**: firma, fecha y bio breve con enlace a `/nacho`.
7. **Llamada a la acción** coherente con el tema: el test de visibilidad o una sesión estratégica.

**Estructura de un caso:** Cliente y sector → El reto (con contexto real) → El ángulo (la decisión no obvia) → Qué hicimos (proceso) → Resultado (cifras verificables o testimonio) → Qué aprendimos.

---

## 4. SEO en la página (checklist técnica)

| Elemento | Norma |
|---|---|
| `title` | **30–60 caracteres**. Palabra clave al principio. La marca la añade la plantilla («— Lateral Zinkin»). Único en toda la web. |
| `description` | **120–155 caracteres**. Qué ofrece la página, para quién y dónde, con un motivo para hacer clic. Única. |
| H1 | Uno por página, con la palabra clave o una variante natural. Puede ser más creativo que el `title`. |
| H2/H3 | Jerárquicos. Si responden a una búsqueda, formularlos como pregunta («¿Cuánto cuesta el marketing para un despacho?»). |
| Primer párrafo | Responde directamente en las primeras 60 palabras. |
| URL (slug) | Corta, en minúsculas, sin tildes, con la palabra clave: `/ideas/marketing-para-despachos-de-abogados`. No se cambia una vez publicada; si hace falta, redirección 301. |
| Enlaces internos | Mínimo **3** contextuales (a un sector, un caso y el test o contacto) con texto descriptivo, nunca «haz clic aquí». |
| Enlaces externos | A fuentes originales de cada dato (estudios, organismos, medios). |
| Imágenes | Nombre de archivo descriptivo, `alt` que describa la imagen (no una lista de palabras clave), formato WebP/AVIF vía `next/image`. |
| Idiomas | Cada versión con su `canonical` propio y `hreflang` a las otras dos y a `x-default` (ver [análisis](./analisis-seo.md), T1). |
| Datos estructurados | Artículos: `Article` con `author` (`Person`: Nacho, `url` a `/nacho`), `datePublished` y `dateModified`. Casos: `Article`. Nada de reseñas con estrellas a partir de testimonios propios. |
| Fechas | Fecha de publicación y de actualización visibles en la página. Solo se cambia la de actualización cuando el cambio es sustancial. |

---

## 5. Mapa de palabras clave

Una palabra clave principal por página, para evitar que dos páginas compitan entre sí. Son **propuestas iniciales**: hay que validar el volumen en Google Search Console y en el Planificador de palabras clave cuando el dominio esté conectado.

| Página | Español | English | Català | `title` propuesto (ES) |
|---|---|---|---|---|
| Inicio | consultora de marketing en Madrid | marketing consultancy Madrid | consultora de màrqueting Madrid | Consultora de marketing boutique en Madrid |
| Servicios | consultoría de marketing estratégico | strategic marketing consultancy | consultoria de màrqueting estratègic | Consultoría de marketing, marca y comunicación |
| Cultura y editorial | marketing editorial | publishing marketing agency | màrqueting editorial | Marketing editorial y cultural en Madrid |
| Despachos | marketing jurídico / para abogados | law firm marketing Spain | màrqueting jurídic | Marketing jurídico para despachos de abogados |
| Turismo | marketing para agencias de viajes | travel agency marketing | màrqueting per a agències de viatges | Marketing para agencias de viajes y turismo |
| Casos | casos de éxito de marketing | marketing case studies | casos d'èxit de màrqueting | Casos de éxito en marketing y comunicación |
| Nacho | Nacho Latorre Tambo | Nacho Latorre Tambo | Nacho Latorre Tambo | Nacho Latorre Tambo, consultor de marketing |
| Test | test de visibilidad de marca | brand visibility test | test de visibilitat de marca | Test gratuito de visibilidad de marca |

**Temas para `/ideas`** (búsquedas informativas conectadas con los sectores):
- Cómo lanzar un libro: plan de marketing de 3 a 6 meses antes.
- Marca personal para escritores: qué funciona y qué no.
- Marketing jurídico: qué puede y qué no puede comunicar un abogado (deontología).
- Cómo consigue clientes un despacho pequeño sin depender del boca a boca.
- Agencias de viajes frente a los grandes portales: canales propios.
- Newsletter para marcas culturales: cómo construir comunidad.

---

## 6. Optimización para respuestas de IA (AI Overviews, AI Mode, ChatGPT, Perplexity)

1. **Respuesta directa primero**: definición o respuesta en 1–2 frases bajo cada H2 y después el desarrollo.
2. **Afirmaciones citables**: frases autosuficientes con dato y fuente («El 90 % de los clientes del despacho llegaban por recomendación (datos internos, 2025)»).
3. **Entidades claras**: nombrar a Lateral Zinkin, a Nacho Latorre Tambo, Madrid y los sectores de forma consistente, siempre igual.
4. **Listas y tablas** cuando se comparan opciones o se dan pasos.
5. **Fecha de actualización visible** en temas que cambian.
6. **Coherencia fuera de la web**: los mismos datos de nombre, dirección y teléfono en Google Business Profile, LinkedIn e Instagram.

---

## 7. Confianza (E-E-A-T)

- Toda pieza lleva **autor real** con enlace a su bio. Por defecto, Nacho Latorre Tambo.
- La bio de `/nacho` enlaza pruebas externas: IMF, LinkedIn, ponencias y prensa.
- **Transparencia**: si la IA se ha usado de forma relevante, se puede añadir al final una línea como «Escrito por Nacho Latorre con ayuda de herramientas de IA para la documentación. Revisado y verificado por el autor.». Google lo recomienda cuando el lector esperaría saberlo.
- **Nada inventado**: ni cifras marcadas como `EJEMPLO`, ni testimonios, ni logos de clientes sin permiso.

---

## 8. Marcas de texto de IA que están prohibidas

`npm run seo:check` busca estas expresiones en `content/` y avisa. Son las muletillas típicas de un texto generado sin editar.

**Español:** en el mundo actual · en la era digital · en el panorama actual · sin lugar a dudas · cabe destacar · es importante destacar · es crucial · en conclusión · en resumen · en definitiva · sumérgete · adentrémonos · descubre cómo · desbloquea · al siguiente nivel · un viaje (en sentido figurado) · navegar por · paradigma · sinergia · holístico · disruptivo · revolucionario · soluciones integrales · ¿alguna vez te has preguntado?

**English:** delve · in today's fast-paced world · in the digital age · ever-evolving · unlock · elevate · game-changer · tapestry · landscape · seamless · leverage · navigate the complexities · it's important to note · in conclusion · embark · realm · cutting-edge · look no further

**Català:** en el món actual · en l'era digital · sens dubte · cal destacar · és crucial · en conclusió · en resum · submergeix-te · descobreix com · desbloqueja · al següent nivell · solucions integrals

**Patrones estructurales que también delatan un texto de IA** (se revisan a mano):
- Todos los párrafos con la misma longitud y la misma estructura.
- Listas de tres adjetivos o tres ideas en cada párrafo.
- Una introducción que anuncia lo que se va a contar y una conclusión que lo repite.
- Abuso de la raya (—) y de los dos puntos para dramatizar.
- Preguntas retóricas encadenadas.
- Negritas en cada frase.

---

## 9. Idiomas

- El español es la versión original. El catalán y el inglés se **adaptan**: palabras clave propias de cada idioma, ejemplos revisados y tono nativo.
- Si una pieza no merece la pena en un idioma (p. ej. un tema muy local), no se traduce. Mejor que una traducción floja.
- Los testimonios traducidos llevan la nota «traducido del original».

---

## 10. Newsletter y Substack

1. Se publica **primero en la web** (`/ideas/...`).
2. Se envía por Substack con un extracto y un enlace «Léelo completo en lateralzinkin.com», o con el texto completo y un aviso «Publicado originalmente en…» enlazado a la web.
3. Nunca se publica en Substack contenido que no esté en la web: posicionaría el dominio de Substack, no el nuestro.

---

## 11. Mantenimiento

- Cada 6 meses se revisan las piezas con más tráfico: datos, enlaces rotos y fecha de actualización.
- Las piezas que no reciben visitas ni aportan se fusionan con otra (con redirección 301) o se mejoran, pero no se dejan morir.
- Cada trimestre se revisa en Search Console qué búsquedas traen impresiones sin clics y se ajustan `title` y `description`.

---

## 12. Checklist antes de publicar

- [ ] Tiene al menos 2 elementos de ganancia de información (sección 1), uno de ellos de experiencia, datos u opinión.
- [ ] Una persona la ha editado, ha verificado cada dato y la firma.
- [ ] Suena a Lateral Zinkin ([voz de marca](./voz-de-marca.md)): tuteo, frases cortas, sin hype, con ejemplos.
- [ ] `title` de 30–60 caracteres y `description` de 120–155, únicos.
- [ ] Palabra clave principal asignada y que no compite con otra página (sección 5).
- [ ] Entradilla que responde en menos de 60 palabras.
- [ ] H2 útiles, formulados como pregunta cuando responden a una búsqueda.
- [ ] 3 enlaces internos o más y fuentes externas para cada dato.
- [ ] Imágenes con `alt` descriptivo.
- [ ] Autor, fecha de publicación y datos estructurados `Article`.
- [ ] Versiones en catalán e inglés revisadas por un nativo (o decidido no traducir).
- [ ] `npm run seo:check` sin errores.

---

## Anexo: formato de un artículo en `content/ideas/`

Cuando exista la sección `/ideas`, cada artículo será un Markdown con esta cabecera (el verificador ya la comprueba si la carpeta existe):

```md
---
title: "Marketing jurídico: qué puede comunicar un abogado"   # 30–60 caracteres
description: "Qué permite la deontología, qué funciona y tres ejemplos reales de despachos que captan clientes sin perder prestigio."  # 120–155
slug: marketing-juridico-que-puede-comunicar-un-abogado
locale: es
translationOf: null            # slug del original si es traducción
keyword: marketing jurídico
author: Nacho Latorre Tambo
published: 2026-10-06
updated: 2026-10-06
experience: "Despacho X (2025): qué hicimos y qué cambió, con datos verificables"  # prueba de ganancia de información (obligatorio)
sources:
  - https://www.abogacia.es/...
aiAssisted: true               # si se usó IA de forma relevante
---
```
