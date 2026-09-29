import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, localeNames, type Locale } from "@/lib/i18n";
import { allIdeas, formatDate, getIdea, translationsOf } from "@/lib/ideas";
import { href, paths } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import FinalCta from "@/components/FinalCta";
import Newsletter from "@/components/Newsletter";

export const dynamicParams = false;

export function generateStaticParams() {
  return allIdeas().map((i) => ({ locale: i.locale, slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ideas/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const idea = getIdea(locale, slug);
  if (!idea) return {};
  const alternates = Object.fromEntries(Object.entries(translationsOf(idea)).map(([l, s]) => [l, `${paths.ideas}/${s}`]));
  const meta = pageMetadata(locale, `${paths.ideas}/${slug}`, idea, false, alternates);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: idea.published, modifiedTime: idea.updated, authors: [idea.author] },
    ...(idea.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function IdeaPage({ params }: PageProps<"/[locale]/ideas/[slug]">) {
  const { locale, slug } = await params;
  const idea = getIdea(locale, slug);
  if (!idea) notFound();
  const t = getDict(locale);
  const url = `${site.url}${href(locale, `${paths.ideas}/${slug}`)}`;
  const versions = Object.entries(translationsOf(idea)).filter(([l]) => l !== locale) as [Locale, string][];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: idea.title,
      description: idea.description,
      inLanguage: locale,
      datePublished: idea.published,
      dateModified: idea.updated,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: idea.author, url: `${site.url}${href(locale, paths.about)}` },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      citation: idea.sources,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}${href(locale)}` },
        { "@type": "ListItem", position: 2, name: t.nav.ideas, item: `${site.url}${href(locale, paths.ideas)}` },
        { "@type": "ListItem", position: 3, name: idea.title, item: url },
      ],
    },
  ];

  return (
    <>
      <article className="article">
        <header className="page-hero article__head">
          <div className="wrap wrap--text">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href={href(locale)}>Lateral Zinkin</Link>
              <span aria-hidden="true">/</span>
              <Link href={href(locale, paths.ideas)}>{t.nav.ideas}</Link>
            </nav>
            {idea.draft && <p className="form-msg form-msg--err">{t.ideas.draft}</p>}
            <h1 className="display h2">{idea.title}</h1>
            <p className="lead mt-m">{idea.description}</p>
            <p className="article__meta">
              {t.ideas.by} <Link href={href(locale, paths.about)}>{idea.author}</Link>
              <span aria-hidden="true"> · </span>
              {t.ideas.published} <time dateTime={idea.published}>{formatDate(idea.published, locale)}</time>
              {idea.updated !== idea.published && (
                <>
                  <span aria-hidden="true"> · </span>
                  {t.ideas.updated} <time dateTime={idea.updated}>{formatDate(idea.updated, locale)}</time>
                </>
              )}
              <span aria-hidden="true"> · </span>
              {idea.minutes} {t.ideas.minutes}
            </p>
            {versions.length > 0 && (
              <p className="article__meta">
                {t.ideas.otherLanguages}{" "}
                {versions.map(([l, s], i) => (
                  <span key={l}>
                    {i > 0 && ", "}
                    <Link href={href(l, `${paths.ideas}/${s}`)} hrefLang={l} lang={l}>
                      {localeNames[l]}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </header>

        <div className="wrap wrap--text">
          <div className="prose article__body" dangerouslySetInnerHTML={{ __html: idea.html }} />

          {idea.sources.length > 0 && (
            <aside className="article__sources">
              <h2>{t.ideas.sources}</h2>
              <ol>
                {idea.sources.map((s) => (
                  <li key={s}>
                    {/^https?:\/\//.test(s) ? (
                      <a href={s} target="_blank" rel="noopener noreferrer">
                        {s.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      s
                    )}
                  </li>
                ))}
              </ol>
            </aside>
          )}
          {idea.aiAssisted && <p className="article__ai">{t.ideas.aiNote}</p>}

          <aside className="author-box">
            <span className="author-box__avatar" aria-hidden="true">
              NL!
            </span>
            <div>
              <p className="kicker">{t.ideas.aboutAuthor}</p>
              <p>
                <strong>{t.founder.name}</strong> · {t.founder.role}
              </p>
              <p className="muted mt-s">{t.founder.teaser}</p>
              <Link href={href(locale, paths.about)} className="link-u mt-s" style={{ display: "inline-block" }}>
                {t.founder.cta} →
              </Link>
            </div>
          </aside>

          <p className="mt-l">
            <Link href={href(locale, paths.ideas)} className="link-u">
              ← {t.ideas.back}
            </Link>
          </p>
        </div>
      </article>
      <Newsletter t={t} />
      <FinalCta locale={locale} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
