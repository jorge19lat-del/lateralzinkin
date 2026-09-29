import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  kicker?: string;
  title: ReactNode;
  sub?: ReactNode;
  crumbs?: { label: string; href: string }[];
  dark?: boolean;
  children?: ReactNode;
};

export default function PageHero({ kicker, title, sub, crumbs, dark, children }: Props) {
  return (
    <section className={`page-hero ${dark ? "dark" : ""}`}>
      <div className="wrap">
        {crumbs && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.href} style={{ display: "contents" }}>
                {i > 0 && <span aria-hidden="true">/</span>}
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </nav>
        )}
        {kicker && (
          <Reveal>
            <p className="kicker">{kicker}</p>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="display h1">{title}</h1>
        </Reveal>
        {sub && (
          <Reveal delay={0.15}>
            <p className="lead">{sub}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
