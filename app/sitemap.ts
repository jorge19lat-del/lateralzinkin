import type { MetadataRoute } from "next";
import { es } from "@/content/es";
import { allIdeas, ideasFor, translationsOf } from "@/lib/ideas";
import { locales } from "@/lib/i18n";
import { paths } from "@/lib/nav";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    paths.home,
    paths.services,
    paths.cases,
    paths.about,
    paths.test,
    paths.contact,
    ...es.sectors.items.map((s) => `${paths.sectors}/${s.slug}`),
  ];
  const pages = routes.flatMap((r) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${r}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${r}`])) },
    })),
  );
  // Índice de ideas solo en los idiomas con artículos, y cada artículo con sus traducciones
  const ideasIndex = locales
    .filter((l) => ideasFor(l).length)
    .map((l) => ({ url: `${site.url}/${l}${paths.ideas}`, lastModified: new Date(ideasFor(l)[0].updated), changeFrequency: "weekly" as const, priority: 0.7 }));
  const articles = allIdeas()
    .filter((i) => !i.draft)
    .map((i) => ({
      url: `${site.url}/${i.locale}${paths.ideas}/${i.slug}`,
      lastModified: new Date(i.updated),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(Object.entries(translationsOf(i)).map(([l, s]) => [l, `${site.url}/${l}${paths.ideas}/${s}`])),
      },
    }));
  return [...pages, ...ideasIndex, ...articles];
}
