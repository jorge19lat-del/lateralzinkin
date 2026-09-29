import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "80vh" }}>
      <div className="wrap">
        <p className="kicker">404</p>
        <h1 className="display h1">
          Esta página ha saltado <span className="mark">de espaldas</span>.
        </h1>
        <Link href="/" className="btn mt-l">
          Volver al inicio <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
