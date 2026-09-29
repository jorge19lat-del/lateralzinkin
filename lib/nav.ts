import type { Locale } from "./i18n";

export const paths = {
  home: "",
  services: "/servicios",
  sectors: "/sectores",
  cases: "/casos",
  about: "/nacho",
  test: "/test",
  contact: "/contacto",
  legal: "/legal",
} as const;

export function href(locale: Locale | string, path: string = "") {
  return `/${locale}${path}`;
}

export function sectorHref(locale: Locale | string, slug: string) {
  return `/${locale}${paths.sectors}/${slug}`;
}
