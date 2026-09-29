import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { Portrait } from "@/components/FounderBlock";
import Stats from "@/components/Stats";
import Lateral from "@/components/Lateral";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/nacho">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, paths.about, getDict(locale).seo.about);
}

export default async function AboutPage({ params }: PageProps<"/[locale]/nacho">) {
  const { locale } = await params;
  const t = getDict(locale);
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t.founder.name,
    jobTitle: t.founder.role,
    worksFor: { "@type": "Organization", name: site.name },
    alumniOf: "ICADE",
    sameAs: [site.linkedin],
  };
  return (
    <>
      <PageHero
        kicker={t.founder.kicker}
        title={t.founder.name}
        sub={t.founder.role}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.nav.about, href: href(locale, paths.about) }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap founder">
          <Reveal>
            <Portrait t={t} />
          </Reveal>
          <div>
            {t.founder.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "lead" : "mt-m"}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <blockquote className="pull">“{t.founder.quote}”</blockquote>
              <ul className="creds">
                {t.founder.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="gap-row mt-m">
                <Link href={href(locale, paths.contact)} className="btn">
                  {t.common.bookCta} <span className="arrow">→</span>
                </Link>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-u">
                  LinkedIn ↗
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section--tight">
        <div className="wrap two-col">
          <Reveal>
            <h2 className="display h2">{t.founder.team}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">{t.founder.teamDesc}</p>
          </Reveal>
        </div>
        <div className="wrap mt-l">
          <Stats t={t} />
        </div>
      </section>
      <Lateral t={t} />
      <FinalCta locale={locale} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </>
  );
}
