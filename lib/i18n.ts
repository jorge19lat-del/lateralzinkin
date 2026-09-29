import { es, type Dict } from "@/content/es";
import { en } from "@/content/en";
import { ca } from "@/content/ca";

export const locales = ["es", "en", "ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const localeNames: Record<Locale, string> = { es: "Español", en: "English", ca: "Català" };
export const localeTags: Record<Locale, string> = { es: "es-ES", en: "en-GB", ca: "ca-ES" };

const dictionaries: Record<Locale, Dict> = { es, en, ca };

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export function getDict(locale: string): Dict {
  return dictionaries[hasLocale(locale) ? locale : defaultLocale];
}

export type { Dict };
