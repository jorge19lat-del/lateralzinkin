import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import Method from "@/components/Method";
import SectorList from "@/components/SectorList";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, paths.services, getDict(locale).seo.services);
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/servicios">) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <>
      <PageHero
        kicker={t.services.kicker}
        title={t.services.title}
        sub={t.services.sub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.pages.services.title, href: href(locale, paths.services) }]}
      />
      <section className="section dark">
        <div className="wrap">
          <Services t={t} />
        </div>
      </section>
      <Method t={t} />
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <Reveal>
              <p className="kicker">{t.sectors.kicker}</p>
              <h2 className="display h2">{t.sectors.title}</h2>
            </Reveal>
          </div>
          <SectorList locale={locale} t={t} />
        </div>
      </section>
      <Testimonials t={t} />
      <FinalCta locale={locale} t={t} />
    </>
  );
}
