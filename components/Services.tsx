import type { Dict } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Services({ t }: { t: Dict }) {
  return (
    <div className="services-grid">
      {t.services.items.map((s, i) => (
        <Reveal key={s.num} className="service" delay={(i % 2) * 0.1}>
          <span className="service__num">{s.num}</span>
          <h3 className="display h3">{s.title}</h3>
          <p className="muted">{s.desc}</p>
          <ul>
            {s.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
