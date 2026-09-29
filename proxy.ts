import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") || "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) {
    if ((locales as readonly string[]).includes(lang)) return lang as Locale;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Todo excepto internos de Next, la API y archivos estáticos
  matcher: ["/((?!_next|api|img|favicon|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)"],
};
