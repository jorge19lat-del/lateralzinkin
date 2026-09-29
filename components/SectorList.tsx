import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { sectorHref } from "@/lib/nav";
import Reveal from "./Reveal";

export default function SectorList({ locale, t, exclude }: { locale: string; t: Dict; exclude?: string }) {
  const items = t.sectors.items.filter((s) => s.slug !== exclude);
  return (
    <div className="sector-list">
      {items.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.08}>
          <Link href={sectorHref(locale, s.slug)} className="sector-row" aria-label={`${t.sectors.cta} ${s.title}`}>
            <span className="sector-row__num">{s.num}</span>
            <span className="sector-row__title">{s.title}</span>
            <span className="sector-row__desc">{s.short}</span>
            <span className="sector-row__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
