"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n";
import { sendLead } from "@/lib/lead";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";

type DimKey = keyof Dict["quiz"]["dims"];
const DIMS: DimKey[] = ["clarity", "difference", "visibility", "conversion"];
const LETTERS = ["A", "B", "C", "D"];

function score(answers: number[], t: Dict) {
  const dims = Object.fromEntries(DIMS.map((d) => [d, { got: 0, max: 0 }])) as Record<DimKey, { got: number; max: number }>;
  t.quiz.questions.forEach((q, i) => {
    const d = q.dim as DimKey;
    dims[d].got += answers[i] ?? 0;
    dims[d].max += 3;
  });
  const pct = Object.fromEntries(DIMS.map((d) => [d, Math.round((dims[d].got / dims[d].max) * 100)])) as Record<DimKey, number>;
  const total = Math.round((answers.reduce((a, b) => a + b, 0) / (t.quiz.questions.length * 3)) * 100);
  const tier = [...t.quiz.results.tiers].reverse().find((tr) => total >= tr.min) ?? t.quiz.results.tiers[0];
  return { pct, total, tier };
}

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="score-ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--paper-2)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--yellow)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <strong>
        {value}
        <small>/100</small>
      </strong>
    </div>
  );
}

export default function Quiz({ locale, t }: { locale: string; t: Dict }) {
  const q = t.quiz;
  const total = q.questions.length;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 preguntas, n = gate, n+1 resultados
  const [answers, setAnswers] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const result = useMemo(() => score(answers, t), [answers, t]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Si el inicio del test queda fuera de la vista al cambiar de paso, lo recolocamos
  useEffect(() => {
    const el = rootRef.current;
    if (step < 0 || !el) return;
    if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [step, reduce]);

  const choose = (v: number) => {
    const next = [...answers];
    next[step] = v;
    setAnswers(next);
    setTimeout(() => setStep((s) => s + 1), reduce ? 0 : 260);
  };

  async function unlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setSending(true);
    // Mostramos el resultado aunque falle el envío: el usuario no debe quedarse bloqueado
    await sendLead({
      type: "quiz",
      locale,
      name: data.name,
      email: data.email,
      sector: data.sector,
      score: result.total,
      tier: result.tier.title,
      dims: result.pct,
      answers: q.questions.map((qq, i) => `${i + 1}. ${qq.q} → ${qq.options[answers[i]]}`),
      website: data.website,
    });
    setSending(false);
    setStep(total + 1);
  }

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  const anim = {
    initial: reduce ? false : { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? undefined : { opacity: 0, x: -40 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  };

  const weak = DIMS.filter((d) => result.pct[d] < 67);

  return (
    <div className="quiz" ref={rootRef} style={{ scrollMarginTop: 100 }}>
      {step >= 0 && step < total && (
        <div className="quiz__progress" aria-hidden="true">
          <i style={{ width: `${(step / total) * 100}%` }} />
        </div>
      )}
      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div key="intro" {...anim}>
            <p className="lead">{q.intro}</p>
            <div className="chip-list mt-m">
              {DIMS.map((d) => (
                <span className="chip" key={d}>
                  {q.dims[d]}
                </span>
              ))}
            </div>
            <button className="btn mt-l" onClick={() => setStep(0)}>
              {q.start} <span className="arrow">→</span>
            </button>
          </motion.div>
        )}

        {step >= 0 && step < total && (
          <motion.div key={`q${step}`} {...anim}>
            <div className="quiz__meta">
              <span>
                {q.step} {step + 1} {q.of} {total}
              </span>
              <span>{q.dims[q.questions[step].dim as DimKey]}</span>
            </div>
            <h2 className="quiz__q">{q.questions[step].q}</h2>
            <div className="quiz__options" role="group" aria-label={q.questions[step].q}>
              {q.questions[step].options.map((o, v) => (
                <button key={o} className="quiz__option" aria-pressed={answers[step] === v} onClick={() => choose(v)}>
                  <span className="quiz__letter">{LETTERS[v]}</span>
                  {o}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button className="quiz__back link-u" onClick={() => setStep((s) => s - 1)}>
                ← {q.back}
              </button>
            )}
          </motion.div>
        )}

        {step === total && (
          <motion.div key="gate" {...anim} className="two-col" style={{ alignItems: "center" }}>
            <div>
              <p className="kicker">{q.gate.preview}</p>
              <div className="blur" aria-hidden="true">
                <Ring value={result.total} />
              </div>
            </div>
            <div className="panel">
              <h2 className="display h3">{q.gate.title}</h2>
              <p className="muted mt-s">{q.gate.sub}</p>
              <form className="form mt-m" onSubmit={unlock} noValidate>
                <div className="field">
                  <label htmlFor="qz-name">{q.gate.name} *</label>
                  <input id="qz-name" name="name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="qz-email">{q.gate.email} *</label>
                  <input id="qz-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="qz-sector">{q.gate.sector}</label>
                  <select id="qz-sector" name="sector">
                    {t.contact.form.sectorOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="hp" aria-hidden="true">
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <label className="check">
                  <input type="checkbox" name="consent" required />
                  <span>
                    <Link href={href(locale, `${paths.legal}/privacidad`)}>{q.gate.consent}</Link> *
                  </span>
                </label>
                <button className="btn btn--block" type="submit" disabled={sending}>
                  {sending ? t.contact.form.sending : q.gate.submit} <span className="arrow">→</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === total + 1 && (
          <motion.div key="result" {...anim}>
            <div className="two-col" style={{ alignItems: "center" }}>
              <div>
                <p className="kicker">{q.results.overall}</p>
                <Ring value={result.total} />
              </div>
              <div>
                <h2 className="display h2">{result.tier.title}</h2>
                <p className="lead mt-s">{result.tier.desc}</p>
              </div>
            </div>
            <div className="two-col mt-l">
              <div className="dim-bars">
                {DIMS.map((d, i) => (
                  <div key={d}>
                    <div className="dim-bar__head">
                      <span>{q.dims[d]}</span>
                      <span>{result.pct[d]}%</span>
                    </div>
                    <div className="dim-bar__track">
                      <motion.i initial={{ width: 0 }} animate={{ width: `${result.pct[d]}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="display h3">{q.results.recsTitle}</h3>
                <ul className="pain-list mt-m">
                  {weak.length === 0 ? <li>{q.results.allGood}</li> : weak.map((d) => <li key={d}>{q.results.recs[d]}</li>)}
                </ul>
              </div>
            </div>
            <div className="panel panel--dark mt-l">
              <h3 className="display h3">{q.results.nextTitle}</h3>
              <p className="mt-s muted">{q.results.nextSub}</p>
              <div className="gap-row mt-m">
                <Link href={href(locale, paths.contact)} className="btn btn--yellow">
                  {q.results.bookCta} <span className="arrow">→</span>
                </Link>
                <a href={site.substackUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  {q.results.newsletterCta} ↗
                </a>
                <button className="link-u" onClick={restart}>
                  {q.results.retake}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
