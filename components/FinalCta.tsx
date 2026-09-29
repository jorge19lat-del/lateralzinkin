import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function FinalCta({ locale, t }: { locale: string; t: Dict }) {
  return (
    <section className="final-cta">
      <div className="final-cta__bang" aria-hidden="true" />
      <div className="wrap">
        <Reveal>
          <h2 className="display">{t.finalCta.title}</h2>
        </Reveal>
        <div className="final-cta__row">
          <Reveal delay={0.1}>
            <p className="lead">{t.finalCta.sub}</p>
          </Reveal>
          <Reveal delay={0.2} className="gap-row">
            <Link href={href(locale, paths.contact)} className="btn">
              {t.finalCta.primary} <span className="arrow">→</span>
            </Link>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-u">
              {t.finalCta.secondary}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
