import Image from "next/image";
import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export function Portrait({ t }: { t: Dict }) {
  return (
    <div style={{ position: "relative" }}>
      <div className="sticker" aria-hidden="true">
        <span>
          <b>{new Date().getFullYear() - site.founded}</b>
          {t.founder.yearsLabel}
        </span>
      </div>
      <div className="portrait">
        {site.founderPhoto ? (
          <Image src={site.founderPhoto} alt={t.founder.photoAlt} fill sizes="(min-width: 960px) 40vw, 100vw" />
        ) : (
          <span className="portrait__placeholder" role="img" aria-label={t.founder.photoAlt}>
            NL!
          </span>
        )}
        <div className="portrait__tag">
          <span>{t.founder.name}</span>
          <span>Madrid</span>
        </div>
      </div>
    </div>
  );
}

export default function FounderBlock({ locale, t }: { locale: string; t: Dict }) {
  return (
    <section className="section">
      <div className="wrap founder">
        <Reveal>
          <Portrait t={t} />
        </Reveal>
        <div>
          <Reveal>
            <p className="kicker">{t.founder.kicker}</p>
            <h2 className="display h2">{t.founder.name}</h2>
            <p className="muted mt-s">{t.founder.role}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead mt-m">{t.founder.teaser}</p>
            <blockquote className="pull">“{t.founder.quote}”</blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href={href(locale, paths.about)} className="btn">
              {t.founder.cta} <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
