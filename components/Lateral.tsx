"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { Dict } from "@/lib/i18n";
import { scenes, type SceneName } from "./scenes";
import { seg } from "./scenes/rig";
import Reveal from "./Reveal";

type Chapter = Dict["lateral"]["chapters"][number];

function ChapterBlock({ c, i }: { c: Chapter; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  const { Scene, pivot, keyFrame } = scenes[c.scene as SceneName];
  const p = reduce ? keyFrame : progress;
  // El texto acompaña a la animación: se tacha la norma justo cuando el personaje la rompe
  const strike = reduce ? 1 : seg(p, pivot, pivot + 0.06);
  const after = reduce ? 1 : seg(p, pivot + 0.05, pivot + 0.13);
  const lesson = reduce ? 1 : seg(p, pivot + 0.2, pivot + 0.3);

  return (
    <div ref={ref} className={`chapter-scroll ${reduce ? "is-static" : ""}`}>
      <div className={`chapter-sticky ${i % 2 ? "is-reversed" : ""}`}>
        <div className="chapter__stage">
          <span className="chapter__num">0{i + 1} / 03</span>
          <Scene p={p} />
        </div>
        <div className="chapter__copy">
          <p className="chapter__meta">
            {c.name} · {c.year}
          </p>
          <p className="chapter__before">
            <span style={{ backgroundSize: `${strike * 100}% 0.09em` }}>{c.before}</span>
          </p>
          <span className="chapter__after" style={{ opacity: after, transform: `translateX(${(1 - after) * -40}px) rotate(${(1 - after) * -3}deg)` }}>
            {c.after}
          </span>
          <p className="chapter__lesson" style={{ opacity: lesson, transform: `translateY(${(1 - lesson) * 20}px)` }}>
            {c.lesson}
          </p>
        </div>
        {!reduce && (
          <div className="chapter__progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${p})` }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Lateral({ t }: { t: Dict }) {
  return (
    <section className="lateral" id="metodo">
      <div className="wrap">
        <div className="lateral__intro">
          <Reveal>
            <p className="kicker">{t.lateral.kicker}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display h2">{t.lateral.title}</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead">{t.lateral.intro}</p>
          </Reveal>
        </div>
        {t.lateral.chapters.map((c, i) => (
          <ChapterBlock key={c.name} c={c} i={i} />
        ))}
        <div className="lateral__closing">
          <Reveal>
            <p>{t.lateral.closingA}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="display">{t.lateral.closingB}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
