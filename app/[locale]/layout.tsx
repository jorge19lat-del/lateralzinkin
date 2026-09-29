import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, Instrument_Serif, Inter_Tight, Zilla_Slab } from "next/font/google";
import "../globals.css";
import { getDict, hasLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const display = Zilla_Slab({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#ffd900",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  const base = pageMetadata(locale, "", t.seo.home, true);
  return {
    ...base,
    metadataBase: new URL(site.url),
    title: { default: `${t.seo.home.title} — ${site.name}`, template: `%s — ${site.name}` },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDict(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    legalName: site.legalName,
    description: t.seo.home.description,
    url: `${site.url}/${locale}`,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Manuel Cortina, 11",
      postalCode: "28010",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    founder: { "@type": "Person", name: "Nacho Latorre Tambo", jobTitle: t.founder.role },
    sameAs: [site.instagram, site.linkedin],
    areaServed: "ES",
    knowsAbout: t.sectors.items.map((s) => s.title),
  };

  return (
    <html lang={locale} className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          {t.common.skip}
        </a>
        <Header locale={locale} t={t} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t} />
        <WhatsAppFloat label={t.contact.details.whatsappText} />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
