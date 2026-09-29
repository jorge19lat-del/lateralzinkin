"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  // Los años (4 cifras) no se animan: contar desde 0 no tiene sentido
  const match = /^\d{4}$/.test(value) ? null : value.match(/^(\D*)(\d+)(.*)$/);
  const [display, setDisplay] = useState(match && !reduce ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match || reduce) return;
    const [, pre, num, post] = match;
    const target = Number(num);
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${pre}${Math.round(v)}${post}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref}>{display}</span>;
}

export default function Stats({ t }: { t: Dict }) {
  return (
    <div className="stats">
      {t.stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="stat__value">
            <Counter value={s.value} />
          </div>
          <p className="stat__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
