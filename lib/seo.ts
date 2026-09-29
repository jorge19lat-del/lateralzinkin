import type { Metadata } from "next";
import { defaultLocale, getDict, hasLocale, localeTags, locales, type Locale } from "./i18n";
import { site } from "./site";

export const BRAND = ` — ${site.name}`;

// Metadatos completos de una página: título, descripción, canonical, hreflang (+ x-default) y Open Graph propios.
// `alternates` permite rutas distintas por idioma (p. ej. artículos con slug traducido) y omitir idiomas sin versión.
export function pageMetadata(
  locale: string,
  path: string,
  seo: { title: string; description: string },
  home = false,
  alternates?: Partial<Record<Locale, string>>,
): Metadata {
  const lang = hasLocale(locale) ? locale : defaultLocale;
  const url = `/${lang}${path}`;
  const paths: Partial<Record<Locale, string>> = alternates ?? Object.fromEntries(locales.map((l) => [l, path]));
  const languages: Record<string, string> = {};
  for (const l of locales) if (paths[l] !== undefined) languages[localeTags[l]] = `/${l}${paths[l]}`;
  languages["x-default"] = paths[defaultLocale] !== undefined ? `/${defaultLocale}${paths[defaultLocale]}` : url;
  const fullTitle = `${seo.title}${BRAND}`;
  return {
    title: home ? { absolute: fullTitle } : seo.title,
    description: seo.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description: seo.description,
      url,
      locale: localeTags[lang].replace("-", "_"),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: seo.description },
  };
}

export const seoFor = (locale: string) => getDict(locale).seo;
