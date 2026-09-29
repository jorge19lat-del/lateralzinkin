"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Dict } from "@/lib/i18n";
import Reveal from "./Reveal";

type Chapter = Dict["lateral"]["chapters"][number];

function ChapterBlock({ c, i }: { c: Chapter; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  // Cada imagen se inclina: lo mismo, visto desde otro ángulo
  const tilt = useTransform(scrollYProgress, [0.2, 0.6], reduce ? [0, 0] : [i % 2 ? 4 : -4, 0]);

  return (
    <div ref={ref} className="chapter">
      <motion.div className="chapter__media" style={{ rotate: tilt }}>
        <span className="chapter__num">0{i + 1} / 03</span>
        <motion.div className="chapter__img" style={{ y: imgY }}>
          <Image src={c.img} alt={c.name} fill sizes="(min-width: 960px) 45vw, 100vw" style={{ objectFit: "cover" }} />
        </motion.div>
      </motion.div>
      <div>
        <p className="chapter__meta">
          {c.name} · {c.year}
        </p>
        <p className="chapter__before">
          {c.before}
          <motion.span
            className="chapter__strike"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </p>
        <motion.span
          className="chapter__after"
          initial={reduce ? false : { opacity: 0, x: -40, rotate: -3 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {c.after}
        </motion.span>
        <Reveal delay={0.7}>
          <p className="chapter__lesson">{c.lesson}</p>
        </Reveal>
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
