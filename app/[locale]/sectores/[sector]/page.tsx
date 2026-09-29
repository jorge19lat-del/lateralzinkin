import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { es } from "@/content/es";
import { getDict, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths, sectorHref } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import CaseCard from "@/components/CaseCard";
import SectorList from "@/components/SectorList";
import FinalCta from "@/components/FinalCta";
import QuizTeaser from "@/components/QuizTeaser";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return locales.flatMap((locale) => es.sectors.items.map((s) => ({ locale, sector: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/sectores/[sector]">): Promise<Metadata> {
  const { locale, sector } = await params;
  const seo = getDict(locale).seo.sectors[sector];
  if (!seo) return {};
  return pageMetadata(locale, `${paths.sectors}/${sector}`, seo);
}

export default async function SectorPage({ params }: PageProps<"/[locale]/sectores/[sector]">) {
  const { locale, sector } = await params;
  const t = getDict(locale);
  const s = t.sectors.items.find((i) => i.slug === sector);
  if (!s) notFound();
  const cases = t.cases.items.filter((c) => c.sector === s.slug);
  const testimonials = t.testimonials.items.filter((q) => s.clients.some((c) => q.company.includes(c.split(" ")[0])));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <PageHero
        kicker={`${s.num} · ${s.title}`}
        title={s.heroTitle}
        sub={s.heroSub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: s.title, href: sectorHref(locale, s.slug) }]}
      >
        <Reveal delay={0.25} className="gap-row mt-m">
          <Link href={href(locale, paths.contact)} className="btn">
            {t.common.bookCta} <span className="arrow">→</span>
          </Link>
          <Link href={href(locale, paths.test)} className="btn btn--ghost">
            {t.common.testCta}
          </Link>
        </Reveal>
      </PageHero>

      <section className="section dark">
        <div className="wrap two-col">
          <Reveal>
            <p className="kicker">01</p>
            <ul className="pain-list">
              {s.pains.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker">02</p>
            <h2 className="display h3">{t.services.title}</h2>
            <div className="chip-list mt-m">
              {s.services.map((x) => (
                <span className="chip" key={x}>
                  {x}
                </span>
              ))}
            </div>
            <p className="kicker mt-l">{t.hero.trust}</p>
            <div className="chip-list">
              {s.clients.map((c) => (
                <span className="chip" key={c} style={{ background: "var(--yellow)", color: "var(--ink)", borderColor: "var(--yellow)" }}>
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {cases.length > 0 && (
        <section className="section" style={{ background: "var(--paper-2)" }}>
          <div className="wrap">
            <div className="section-head">
              <Reveal>
                <p className="kicker">{t.cases.kicker}</p>
                <h2 className="display h2">{t.cases.title}</h2>
              </Reveal>
            </div>
            <div className="cases-grid">
              {cases.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.1}>
                  <CaseCard c={c} t={t} featured={c.anonymous} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section">
          <div className="wrap">
            <p className="kicker">{t.testimonials.kicker}</p>
            <div className="cases-grid">
              {testimonials.map((q) => (
                <Reveal key={q.name}>
                  <figure>
                    <blockquote className="quote" style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}>
                      {q.quote}
                    </blockquote>
                    <figcaption className="quote-author">
                      <span className="quote-author__avatar" aria-hidden="true">
                        {q.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                      <span>
                        <strong>{q.name}</strong>
                        <span>
                          {q.role} · {q.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            {t.testimonials.translated && <p className="translated-note">{t.testimonials.translated}</p>}
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap two-col">
          <Reveal>
            <p className="kicker">FAQ</p>
            <h2 className="display h2">{s.title}</h2>
          </Reveal>
          <div className="faq">
            {s.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <QuizTeaser locale={locale} t={t} />

      <section className="section--tight">
        <div className="wrap">
          <SectorList locale={locale} t={t} exclude={s.slug} />
        </div>
      </section>

      <FinalCta locale={locale} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
