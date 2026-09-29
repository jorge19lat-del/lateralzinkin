import type { MetadataRoute } from "next";
import { es } from "@/content/es";
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
  return routes.flatMap((r) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${r}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${r}`])) },
    })),
  );
}
