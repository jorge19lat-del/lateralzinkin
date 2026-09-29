import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Booking from "@/components/Booking";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  return { title: t.pages.contact.title, description: t.contact.sub, alternates: { canonical: href(locale, paths.contact) } };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  const t = getDict(locale);
  const d = t.contact.details;
  return (
    <>
      <PageHero
        kicker={t.contact.kicker}
        title={t.contact.title}
        sub={t.contact.sub}
        crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: t.pages.contact.title, href: href(locale, paths.contact) }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap two-col" style={{ alignItems: "start" }}>
          <Reveal className="panel panel--dark">
            <p className="kicker">{t.common.free}</p>
            <h2 className="display h3">{t.contact.bookingTitle}</h2>
            <p className="muted mt-s">{t.contact.bookingSub}</p>
            <div className="mt-m">
              <Booking t={t} />
            </div>
            <ul className="contact-list mt-l">
              <li>
                <small>{d.whatsappLabel}</small>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-u">
                  {d.whatsappText} ↗
                </a>
              </li>
              <li>
                <small>{d.phoneLabel}</small>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <small>{d.emailLabel}</small>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <small>{d.addressLabel}</small>
                <span>{site.address}</span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="panel">
            <h2 className="display h3">{t.contact.formTitle}</h2>
            <div className="mt-m">
              <ContactForm locale={locale} t={t} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
