import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import CaseCard from "@/components/CaseCard";
import Marquee from "@/components/Marquee";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/casos">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, paths.cases, getDict(locale).seo.cases);
}

export default async function CasesPage({ params }: PageProps<"/[locale]/casos">) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <>
      <PageHero
        kicker={t.cases.kicker}
        title={t.cases.title}
        sub={t.cases.sub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.pages.cases.title, href: href(locale, paths.cases) }]}
      />
      <Marquee label={t.hero.trust} />
      {t.sectors.items.map((s) => {
        const cases = t.cases.items.filter((c) => c.sector === s.slug);
        return (
          <section className="section--tight" key={s.slug}>
            <div className="wrap">
              <Reveal>
                <p className="kicker">
                  {s.num} · {s.title}
                </p>
              </Reveal>
              <div className="cases-grid">
                {cases.map((c, i) => (
                  <Reveal key={c.title} delay={i * 0.1}>
                    <CaseCard c={c} t={t} featured={c.anonymous} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <Testimonials t={t} />
      <FinalCta locale={locale} t={t} />
    </>
  );
}
