// Verificador de las normas de contenido y SEO (docs/seo/normas-contenido.md).
// Uso: npm run seo:check
// Errores (salida 1): expresiones de IA prohibidas, títulos duplicados, cabeceras de artículos incompletas.
// Avisos: longitudes de title/description y cifras marcadas como EJEMPLO pendientes de validar.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { es } from "../content/es.ts";
import { en } from "../content/en.ts";
import { ca } from "../content/ca.ts";

type Dict = typeof es;
const dicts: Record<string, Dict> = { es, en, ca };
const BRAND = " — Lateral Zinkin";
const LIMITS = { title: [30, 60], description: [120, 155] } as const;

const banned: Record<string, string[]> = {
  es: [
    "en el mundo actual", "en la era digital", "en el panorama actual", "sin lugar a dudas", "cabe destacar",
    "es importante destacar", "es crucial", "en conclusión", "en resumen", "en definitiva", "sumérgete",
    "adentrémonos", "descubre cómo", "desbloquea", "al siguiente nivel", "navegar por", "paradigma",
    "sinergia", "holístic", "disruptiv", "revolucionari", "soluciones integrales", "alguna vez te has preguntado",
  ],
  en: [
    "delve", "in today's fast-paced world", "in the digital age", "ever-evolving", "unlock", "elevate",
    "game-changer", "game changer", "tapestry", "landscape", "seamless", "leverage", "navigate the complexities",
    "it's important to note", "in conclusion", "embark", "realm", "cutting-edge", "look no further",
  ],
  ca: [
    "en el món actual", "en l'era digital", "sens dubte", "cal destacar", "és crucial", "en conclusió",
    "en resum", "submergeix-te", "descobreix com", "desbloqueja", "al següent nivell", "solucions integrals",
  ],
};

const errors: string[] = [];
const warnings: string[] = [];

function checkLength(kind: keyof typeof LIMITS, where: string, text: string, full = text) {
  const [min, max] = LIMITS[kind];
  const n = full.length;
  if (n < min || n > max) warnings.push(`${where}: ${kind} de ${n} caracteres (norma ${min}–${max}) → "${full}"`);
}

// Recorre todas las cadenas de un objeto con su ruta
function* strings(value: unknown, path: string): Generator<[string, string]> {
  if (typeof value === "string") yield [path, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${path}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

function checkBanned(lang: string, where: string, text: string) {
  const lower = text.toLowerCase();
  for (const phrase of banned[lang] ?? []) {
    const re = new RegExp(`(^|[^\\p{L}])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "u");
    if (re.test(lower)) errors.push(`${where}: expresión prohibida «${phrase}» (normas §8)`);
  }
}

// 1. Diccionarios de la web
for (const [lang, t] of Object.entries(dicts)) {
  const { sectors, ...pagesSeo } = t.seo;
  const pages: [string, string, string][] = [
    ...Object.entries(pagesSeo).map(([k, v]) => [k, v.title + BRAND, v.description] as [string, string, string]),
    ...t.sectors.items.map((s) => {
      const v = sectors[s.slug];
      if (!v) errors.push(`[${lang}] falta seo.sectors["${s.slug}"]`);
      return [`sector ${s.slug}`, (v?.title ?? "") + BRAND, v?.description ?? ""] as [string, string, string];
    }),
  ];
  const seen = new Map<string, string>();
  for (const [page, title, description] of pages) {
    checkLength("title", `[${lang}] ${page}`, title);
    checkLength("description", `[${lang}] ${page}`, description);
    if (seen.has(title)) errors.push(`[${lang}] título duplicado en «${page}» y «${seen.get(title)}»: "${title}"`);
    seen.set(title, page);
  }
  for (const [path, text] of strings(t, "")) checkBanned(lang, `[${lang}] content/${lang}.ts → ${path}`, text);
}

// 2. Cifras de ejemplo pendientes
for (const lang of Object.keys(dicts)) {
  const src = readFileSync(`content/${lang}.ts`, "utf8");
  const n = (src.match(/EJEMPLO/g) || []).length;
  if (n) warnings.push(`content/${lang}.ts: ${n} bloque(s) marcados como EJEMPLO; validar o eliminar antes de publicar (normas §7)`);
}

// 3. Artículos de /ideas (cuando existan)
const ideasDir = "content/ideas";
if (existsSync(ideasDir)) {
  const required = ["title", "description", "slug", "locale", "keyword", "author", "published", "updated", "experience", "sources"];
  const keywords = new Map<string, string>();
  for (const file of readdirSync(ideasDir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(ideasDir, file), "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) {
      errors.push(`${file}: falta la cabecera (frontmatter)`);
      continue;
    }
    const meta: Record<string, string> = {};
    for (const line of fm[1].split("\n")) {
      const m = line.match(/^(\w+):\s*(.*?)\s*(#.*)?$/);
      if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, "") === "null" ? "" : m[2].replace(/^["']|["']$/g, "");
    }
    for (const key of required) if (!(key in meta) || (meta[key] === "" && key !== "sources")) errors.push(`${file}: falta «${key}» en la cabecera`);
    if (/\[PENDIENTE/.test(raw)) (meta.draft === "true" ? warnings : errors).push(`${file}: tiene huecos [PENDIENTE] por completar${meta.draft === "true" ? " (borrador)" : " y no es borrador"}`);
    if (meta.sources === "" && !/sources:\s*\n\s*-/.test(fm[1])) errors.push(`${file}: añade al menos una fuente en «sources»`);
    if (meta.title) checkLength("title", file, meta.title + BRAND);
    if (meta.description) checkLength("description", file, meta.description);
    if (meta.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(meta.slug)) errors.push(`${file}: slug inválido "${meta.slug}" (minúsculas, sin tildes, guiones)`);
    const k = `${meta.locale}:${(meta.keyword || "").toLowerCase()}`;
    if (meta.keyword && !meta.translationOf) {
      if (keywords.has(k)) errors.push(`${file}: la palabra clave «${meta.keyword}» ya la usa ${keywords.get(k)} (canibalización)`);
      keywords.set(k, file);
    }
    const body = raw.slice(fm[0].length);
    checkBanned(meta.locale || "es", file, body);
    const internal = (body.match(/\]\(\/(es|en|ca)\//g) || []).length;
    if (internal < 3) warnings.push(`${file}: ${internal} enlaces internos (mínimo 3, normas §4)`);
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words < 600) warnings.push(`${file}: solo ${words} palabras; ¿responde de verdad a la búsqueda?`);
  }
}

// Informe
const print = (label: string, list: string[]) => list.length && console.log(`\n${label} (${list.length})\n` + list.map((l) => `  • ${l}`).join("\n"));
print("✖ Errores", errors);
print("⚠ Avisos", warnings);
console.log(errors.length ? `\n${errors.length} error(es). Revisa docs/seo/normas-contenido.md` : "\n✔ Sin errores.");
process.exit(errors.length ? 1 : 0);
