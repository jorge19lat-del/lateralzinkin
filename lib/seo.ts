import type { Metadata } from "next";
import { defaultLocale, getDict, hasLocale, localeTags, locales } from "./i18n";
import { site } from "./site";

export const BRAND = ` — ${site.name}`;

// Metadatos completos de una página: título, descripción, canonical, hreflang (+ x-default) y Open Graph propios.
export function pageMetadata(locale: string, path: string, seo: { title: string; description: string }, home = false): Metadata {
  const lang = hasLocale(locale) ? locale : defaultLocale;
  const url = `/${lang}${path}`;
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}${path}`]));
  languages["x-default"] = `/${defaultLocale}${path}`;
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
