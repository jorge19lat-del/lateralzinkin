import { clients } from "@/lib/site";

export default function Marquee({ label }: { label: string }) {
  const items = [...clients, ...clients];
  return (
    <section className="marquee" aria-label={label}>
      <div className="wrap marquee__label">{label}</div>
      <div className="marquee__track">
        {items.map((c, i) => (
          <span className="marquee__item" key={i} aria-hidden={i >= clients.length ? "true" : undefined}>
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
