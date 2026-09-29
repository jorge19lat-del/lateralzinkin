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

      <div className="wrap">
        <motion.p className="hero__eyebrow" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <span className="hero__dot" />
          {t.hero.eyebrow}
        </motion.p>
        <motion.h1 className="display h1 hero__title" style={{ y: titleY }}>
          {lines.map((line, i) => (
            <span className="line" key={i}>
              <motion.span
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>

      <div className="wrap hero__bottom">
        <motion.p className="lead" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6, ease }}>
          {t.hero.sub}
        </motion.p>
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease }}>
          <div className="hero__actions">
            <Link href={href(locale, paths.contact)} className="btn">
              {t.hero.primary} <span className="arrow">→</span>
            </Link>
            <Link href={href(locale, paths.test)} className="btn btn--ghost">
              {t.hero.secondary}
            </Link>
          </div>
          <p className="hero__note">{t.common.free}</p>
        </motion.div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        {t.hero.scroll}
        <i />
      </div>
    </section>
  );
}
