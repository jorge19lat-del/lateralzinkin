import type { Dict } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Method({ t }: { t: Dict }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <p className="kicker">{t.method.kicker}</p>
            <h2 className="display h2">{t.method.title}</h2>
          </Reveal>
        </div>
        <div className="steps">
          {t.method.steps.map((s, i) => (
            <Reveal key={s.title} className="step" delay={i * 0.08}>
              <span className="step__n">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
