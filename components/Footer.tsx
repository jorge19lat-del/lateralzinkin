import Link from "next/link";
import Logo from "./Logo";
import type { Dict } from "@/lib/i18n";
import { href, paths, sectorHref } from "@/lib/nav";
import { site } from "@/lib/site";

export default function Footer({ locale, t }: { locale: string; t: Dict }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <Logo />
            <p className="footer__claim">{t.footer.claim}</p>
          </div>
          <div>
            <h4>{t.footer.explore}</h4>
            <ul>
              <li><Link href={href(locale, paths.services)}>{t.nav.services}</Link></li>
              {t.sectors.items.map((s) => (
                <li key={s.slug}><Link href={sectorHref(locale, s.slug)}>{s.title}</Link></li>
              ))}
              <li><Link href={href(locale, paths.cases)}>{t.nav.cases}</Link></li>
              <li><Link href={href(locale, paths.ideas)}>{t.nav.ideas}</Link></li>
              <li><Link href={href(locale, paths.about)}>{t.founder.name}</Link></li>
              <li><Link href={href(locale, paths.test)}>{t.quiz.title}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.contact}</h4>
            <ul>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href={site.phoneHref}>{site.phone}</a></li>
              <li><a href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li>{site.address}</li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.follow}</h4>
            <ul>
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href={site.substackUrl} target="_blank" rel="noopener noreferrer">Substack</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__giant" aria-hidden="true">lateral!</div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.legalName} {t.footer.rights}</span>
          <nav aria-label="Legal">
            <Link href={href(locale, `${paths.legal}/aviso-legal`)}>{t.footer.legal.aviso}</Link>
            <Link href={href(locale, `${paths.legal}/privacidad`)}>{t.footer.legal.privacidad}</Link>
            <Link href={href(locale, `${paths.legal}/cookies`)}>{t.footer.legal.cookies}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
