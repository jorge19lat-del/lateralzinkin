import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { formatDate, ideasFor } from "@/lib/ideas";
import { href, paths } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Newsletter from "@/components/Newsletter";
import QuizTeaser from "@/components/QuizTeaser";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/ideas">): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata(locale, paths.ideas, getDict(locale).seo.ideas);
  // Sin artículos en este idioma la página no aporta: no se indexa hasta que los haya
  return ideasFor(locale).length ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function IdeasPage({ params }: PageProps<"/[locale]/ideas">) {
  const { locale } = await params;
  const t = getDict(locale);
  const ideas = ideasFor(locale);
  const others = ideas.length ? [] : ideasFor("es");

  return (
    <>
      <PageHero
        kicker={t.ideas.kicker}
        title={t.ideas.title}
        sub={t.ideas.sub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.nav.ideas, href: href(locale, paths.ideas) }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {ideas.length === 0 && <p className="lead">{t.ideas.empty}</p>}
          <div className="idea-list">
            {[...ideas, ...others].map((idea, i) => (
              <Reveal key={`${idea.locale}-${idea.slug}`} delay={Math.min(i, 3) * 0.06}>
                <Link href={href(idea.locale, `${paths.ideas}/${idea.slug}`)} className="idea-row" hrefLang={idea.locale}>
                  <span className="idea-row__meta">
                    {formatDate(idea.published, idea.locale)} · {idea.minutes} {t.ideas.minutes}
                    {idea.locale !== locale && ` · ${idea.locale.toUpperCase()}`}
                    {idea.draft && " · DRAFT"}
                  </span>
                  <span className="idea-row__title">{idea.title}</span>
                  <span className="idea-row__desc">{idea.description}</span>
                  <span className="idea-row__cta">
                    {t.ideas.read} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <QuizTeaser locale={locale} t={t} />
      <Newsletter t={t} />
    </>
  );
}
