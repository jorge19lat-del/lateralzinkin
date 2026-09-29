import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";
import Reveal from "./Reveal";

const widths = ["72%", "38%", "54%", "26%"];

export default function QuizTeaser({ locale, t }: { locale: string; t: Dict }) {
  return (
    <section className="section--tight">
      <div className="wrap">
        <Reveal className="quiz-teaser yellow">
          <div>
            <p className="kicker">{t.quizTeaser.kicker}</p>
            <h2 className="display h2">{t.quizTeaser.title}</h2>
            <p className="lead mt-m">{t.quizTeaser.sub}</p>
            <Link href={href(locale, paths.test)} className="btn mt-m">
              {t.quizTeaser.cta} <span className="arrow">→</span>
            </Link>
          </div>
          <div className="quiz-dials" aria-hidden="true">
            {t.quizTeaser.bullets.map((b, i) => (
              <div className="quiz-dial" key={b}>
                <span>{b}</span>
                <strong>?</strong>
                <i style={{ ["--w" as string]: widths[i] }} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
