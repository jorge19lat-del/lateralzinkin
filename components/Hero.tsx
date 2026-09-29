"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { Dict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ locale, t }: { locale: string; t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // La exclamación "cae de lado" al hacer scroll: el ángulo lateral
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 38]), { stiffness: 80, damping: 20 });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);

  const lines = [
    <>{t.hero.titleA}</>,
    <>{t.hero.titleB}</>,
    <>
      {t.hero.titleC}{" "}
      <span className="hero__angle em">{t.hero.titleEm}</span>
    </>,
    <>{t.hero.titleD}</>,
  ];

  return (
    <section ref={ref} className="hero">
      <motion.div
        className="bang"
        aria-hidden="true"
        initial={reduce ? false : { y: "-140%", rotate: -20 }}
        animate={{ y: "-50%", rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
      >
        <motion.div className="bang__bar" style={{ rotate }} />
        <div className="bang__dot" />
      </motion.div>

      {/* El texto se pinta en el HTML desde el primer momento (bueno para el LCP y sin depender de JS);
          la entrada es una animación CSS suave que nunca lo oculta. */}
      <div className="wrap">
        <p className="hero__eyebrow hero-in" style={{ animationDelay: "0ms" }}>
          <span className="hero__dot" />
          {t.hero.eyebrow}
        </p>
        <motion.h1 className="display h1 hero__title" style={{ y: titleY }}>
          {lines.map((line, i) => (
            <span className="line" key={i}>
              <span className="hero-in" style={{ animationDelay: `${60 + i * 70}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </motion.h1>
      </div>

      <div className="wrap hero__bottom">
        <p className="lead hero-in" style={{ animationDelay: "380ms" }}>
          {t.hero.sub}
        </p>
        <div className="hero-in" style={{ animationDelay: "460ms" }}>
          <div className="hero__actions">
            <Link href={href(locale, paths.contact)} className="btn">
              {t.hero.primary} <span className="arrow">→</span>
            </Link>
            <Link href={href(locale, paths.test)} className="btn btn--ghost">
              {t.hero.secondary}
            </Link>
          </div>
          <p className="hero__note">{t.common.free}</p>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        {t.hero.scroll}
        <i />
      </div>
    </section>
  );
}
