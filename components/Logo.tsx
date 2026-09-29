export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`} aria-label="Lateral Zinkin">
      <span className="logo__a" aria-hidden="true">lateral</span>
      <span className="logo__b" aria-hidden="true">
        Zinkin<span className="logo__bang" />
      </span>
    </span>
  );
}
