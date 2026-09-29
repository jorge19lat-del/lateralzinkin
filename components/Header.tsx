"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { locales, type Dict } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";

export default function Header({ locale, t }: { locale: string; t: Dict }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { label: t.nav.services, path: paths.services },
    { label: t.nav.sectors, path: `${paths.sectors}/cultura-editorial`, match: paths.sectors },
    { label: t.nav.cases, path: paths.cases },
    { label: t.nav.ideas, path: paths.ideas },
    { label: t.nav.about, path: paths.about },
    { label: t.nav.test, path: paths.test },
  ];

  const rest = pathname.replace(/^\/(es|en|ca)(?=\/|$)/, "");
  const isActive = (p: string) => pathname.startsWith(href(locale, p));

  const LangSwitch = () => (
    <nav className="lang" aria-label={t.nav.language}>
      {locales.map((l) => (
        <Link key={l} href={`/${l}${rest}`} aria-current={l === locale ? "true" : undefined} hrefLang={l} lang={l}>
          {l}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <header className={`header ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
        <div className="wrap header__inner">
          <Link href={href(locale)} aria-label="Lateral Zinkin">
            <Logo />
          </Link>
          <nav className="nav" aria-label="Principal">
            {links.map((l) => (
              <Link key={l.path} href={href(locale, l.path)} aria-current={isActive(l.match || l.path) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header__actions">
            <LangSwitch />
            <Link href={href(locale, paths.contact)} className="btn btn--yellow header__cta">
              {t.nav.cta} <span className="arrow">→</span>
            </Link>
            <button className="burger" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(true)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__top">
              <Logo />
              <button className="mobile-menu__close" aria-label={t.nav.close} onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <nav>
              {[...links, { label: t.nav.contact, path: paths.contact }].map((l, i) => (
                <motion.div key={l.path} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }}>
                  <Link href={href(locale, l.path)}>
                    <small>0{i + 1}</small>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mobile-menu__foot">
              <Link href={href(locale, paths.contact)} className="btn btn--yellow btn--block">
                {t.common.bookCta} <span className="arrow">→</span>
              </Link>
              <LangSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
