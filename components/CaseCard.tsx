import type { Dict } from "@/lib/i18n";

type Case = Dict["cases"]["items"][number];

export default function CaseCard({ c, t, featured = false }: { c: Case; t: Dict; featured?: boolean }) {
  const sector = t.sectors.items.find((s) => s.slug === c.sector);
  return (
    <article className={`case ${featured ? "case--featured" : ""}`}>
      <div className="case__top">
        <span className="case__tag">{sector?.title}</span>
        <span className="case__client">{c.anonymous ? `${t.cases.confidential} · ${c.client}` : c.client}</span>
      </div>
      <h3>{c.title}</h3>
      <dl>
        <div>
          <dt>{t.cases.challenge}</dt>
          <dd>{c.challenge}</dd>
        </div>
        <div>
          <dt>{t.cases.angle}</dt>
          <dd>{c.angle}</dd>
        </div>
        <div>
          <dt>{t.cases.result}</dt>
          <dd>{c.result}</dd>
        </div>
      </dl>
      {c.metrics.length > 0 && (
        <div className="case__metrics">
          {c.metrics.map((m) => (
            <div className="case__metric" key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
