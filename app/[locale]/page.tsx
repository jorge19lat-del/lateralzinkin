import Link from "next/link";
import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths } from "@/lib/nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import Lateral from "@/components/Lateral";
import SectorList from "@/components/SectorList";
import CaseCard from "@/components/CaseCard";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import Method from "@/components/Method";
import QuizTeaser from "@/components/QuizTeaser";
import FounderBlock from "@/components/FounderBlock";
import Newsletter from "@/components/Newsletter";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "", getDict(locale).seo.home, true);
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = getDict(locale);

  return (
    <>
      <Hero locale={locale} t={t} />
      <Marquee label={t.hero.trust} />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="display h2" style={{ maxWidth: "20ch" }}>
              {t.sectors.sub}
            </p>
          </Reveal>
          <div className="mt-l">
            <Stats t={t} />
          </div>
        </div>
      </section>

      <Lateral t={t} />

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

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal>
              <p className="kicker">{t.cases.kicker}</p>
              <h2 className="display h2">{t.cases.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="muted">{t.cases.sub}</p>
              <Link href={href(locale, paths.cases)} className="btn btn--ghost mt-m">
                {t.common.seeAll} <span className="arrow">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="cases-grid">
            {t.cases.items.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 0.1}>
                <CaseCard c={c} t={t} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials t={t} />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <Reveal>
              <p className="kicker">{t.services.kicker}</p>
              <h2 className="display h2">{t.services.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead">{t.services.sub}</p>
            </Reveal>
          </div>
          <Services t={t} />
        </div>
      </section>

      <Method t={t} />
      <QuizTeaser locale={locale} t={t} />
      <FounderBlock locale={locale} t={t} />
      <Newsletter t={t} />
      <FinalCta locale={locale} t={t} />
    </>
  );
}
