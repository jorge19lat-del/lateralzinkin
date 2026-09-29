import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "./i18n";

// Artículos de /ideas: un Markdown por artículo e idioma en content/ideas/ (formato en docs/seo/normas-contenido.md).
export type Idea = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  keyword: string;
  author: string;
  published: string;
  updated: string;
  experience: string;
  sources: string[];
  translationOf: string | null;
  aiAssisted: boolean;
  draft: boolean;
  html: string;
  toc: { id: string; text: string }[];
  minutes: number;
};

const DIR = join(process.cwd(), "content/ideas");
// Los borradores se ven en local y en las previsualizaciones, nunca en producción
const showDrafts = process.env.VERCEL_ENV !== "production";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Añade un id a cada H2 y devuelve el índice del artículo
function withToc(html: string) {
  const toc: { id: string; text: string }[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const id = slugify(text);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));

let cache: Idea[] | null = null;

export function allIdeas(): Idea[] {
  if (cache) return cache;
  if (!existsSync(DIR)) return (cache = []);
  cache = readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(DIR, file), "utf8"));
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug: String(data.slug),
        locale: data.locale as Locale,
        title: String(data.title),
        description: String(data.description),
        keyword: String(data.keyword ?? ""),
        author: String(data.author ?? "Nacho Latorre Tambo"),
        published: iso(data.published),
        updated: iso(data.updated ?? data.published),
        experience: String(data.experience ?? ""),
        sources: Array.isArray(data.sources) ? data.sources.map(String) : [],
        translationOf: data.translationOf ? String(data.translationOf) : null,
        aiAssisted: Boolean(data.aiAssisted),
        draft: Boolean(data.draft),
        ...withToc(marked.parse(content, { async: false }) as string),
        minutes: Math.max(1, Math.round(words / 220)),
      };
    })
    .filter((i) => showDrafts || !i.draft)
    .sort((a, b) => b.published.localeCompare(a.published));
  return cache;
}

export const ideasFor = (locale: string) => allIdeas().filter((i) => i.locale === locale);

export const getIdea = (locale: string, slug: string) => allIdeas().find((i) => i.locale === locale && i.slug === slug);

// Versiones del mismo artículo en otros idiomas: { es: "slug-es", en: "slug-en" }
export function translationsOf(idea: Idea): Partial<Record<Locale, string>> {
  const group = idea.translationOf ?? idea.slug;
  const out: Partial<Record<Locale, string>> = {};
  for (const i of allIdeas()) if ((i.translationOf ?? i.slug) === group) out[i.locale] = i.slug;
  return out;
}

export function formatDate(date: string, locale: string) {
  const tag = locale === "en" ? "en-GB" : locale === "ca" ? "ca-ES" : "es-ES";
  return new Date(`${date}T12:00:00`).toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" });
}
