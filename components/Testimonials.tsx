"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

export default function Testimonials({ t, dark = true }: { t: Dict; dark?: boolean }) {
  const items = t.testimonials.items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 8000);
    return () => clearInterval(id);
  }, [paused, reduce, items.length]);

  const item = items[i];
  const initials = item.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <section className={`section testimonials ${dark ? "dark" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap">
        <p className="kicker">{t.testimonials.kicker}</p>
        <div className="quote-stage" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="quote">{item.quote}</blockquote>
              <figcaption className="quote-author">
                <span className="quote-author__avatar" aria-hidden="true">{initials}</span>
                <span>
                  <strong>{item.name}</strong>
                  <span>
                    {item.role} · {item.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="quote-nav">
          <button className="arrow-btn" aria-label="←" onClick={() => go(-1)}>←</button>
          <button className="arrow-btn" aria-label="→" onClick={() => go(1)}>→</button>
          <div className="quote-dots">
            {items.map((it, k) => (
              <button key={it.name} aria-label={it.name} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)} />
            ))}
          </div>
        </div>
        {t.testimonials.translated && <p className="translated-note">{t.testimonials.translated}</p>}
      </div>
    </section>
  );
}
