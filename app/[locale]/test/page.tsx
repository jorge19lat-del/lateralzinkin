import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href, paths } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import Quiz from "@/components/Quiz";

export async function generateMetadata({ params }: PageProps<"/[locale]/test">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, paths.test, getDict(locale).seo.test);
}

export default async function TestPage({ params }: PageProps<"/[locale]/test">) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <>
      <PageHero
        kicker={t.quizTeaser.kicker}
        title={t.quizTeaser.title}
        sub={t.pages.test.sub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.nav.test, href: href(locale, paths.test) }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Quiz locale={locale} t={t} />
        </div>
      </section>
    </>
  );
}
