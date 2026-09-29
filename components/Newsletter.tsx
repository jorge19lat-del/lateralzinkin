import type { Dict } from "@/lib/i18n";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Newsletter({ t }: { t: Dict }) {
  return (
    <section className="section--tight">
      <div className="wrap">
        <Reveal className="newsletter">
          <div>
            <p className="kicker">{t.newsletter.kicker}</p>
            <h2 className="display h3">{t.newsletter.title}</h2>
          </div>
          <p className="muted">{t.newsletter.sub}</p>
          <a href={site.substackUrl} target="_blank" rel="noopener noreferrer" className="btn btn--yellow">
            {t.newsletter.cta} <span className="arrow">↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
