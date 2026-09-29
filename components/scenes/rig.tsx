// Esqueleto articulado para las siluetas animadas con el scroll.
// Ángulos en grados. 0° apunta hacia abajo y los valores positivos giran hacia +x (hacia delante).

export type Vec = [number, number];

export type Pose = {
  x: number; // posición de la cadera en el SVG
  y: number;
  rot: number; // inclinación del torso (positivo = hacia delante)
  neck: number; // inclinación de la cabeza respecto al torso
  sL: number; // hombro/codo del brazo lejano
  eL: number;
  sR: number; // hombro/codo del brazo cercano
  eR: number;
  hL: number; // cadera/rodilla de la pierna lejana
  kL: number;
  hR: number; // cadera/rodilla de la pierna cercana
  kR: number;
  flip?: boolean; // mira hacia -x
};

export const LIMB = { torso: 58, neck: 9, head: 14.5, upper: 31, fore: 29, thigh: 40, shin: 42, foot: 13 };

const rad = (d: number) => (d * Math.PI) / 180;
export const dir = (a: number): Vec => [Math.sin(rad(a)), Math.cos(rad(a))];
export const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
export const mul = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k];

// Utilidades de interpolación
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const KEYS = ["x", "y", "rot", "neck", "sL", "eL", "sR", "eR", "hL", "kL", "hR", "kR"] as const;

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const out = { flip: t < 0.5 ? a.flip : b.flip } as Pose;
  for (const k of KEYS) out[k] = mix(a[k], b[k], t);
  return out;
}

// Interpola una secuencia de poses clave [p, pose] con suavizado entre cada par
export function timeline(p: number, keys: [number, Pose][]): Pose {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, a] = keys[i];
    const [p1, b] = keys[i + 1];
    if (p <= p1) return mixPose(a, b, ease(seg(p, p0, p1)));
  }
  return keys[keys.length - 1][1];
}

// Cinemática directa en coordenadas locales (cadera en 0,0; mirando a +x)
export function fk(p: Pose) {
  const up = 180 - p.rot;
  const down = -p.rot;
  const hip: Vec = [0, 0];
  const shoulder = add(hip, mul(dir(up), LIMB.torso));
  const head = add(shoulder, mul(dir(up - p.neck), LIMB.neck + LIMB.head));
  const arm = (s: number, e: number) => {
    const elbow = add(shoulder, mul(dir(down + s), LIMB.upper));
    const hand = add(elbow, mul(dir(down + s + e), LIMB.fore));
    return [shoulder, elbow, hand] as Vec[];
  };
  const leg = (h: number, k: number) => {
    const knee = add(hip, mul(dir(down + h), LIMB.thigh));
    const foot = add(knee, mul(dir(down + h + k), LIMB.shin));
    const toe = add(foot, mul(dir(down + h + k + 90), LIMB.foot));
    return [hip, knee, foot, toe] as Vec[];
  };
  return {
    hip,
    shoulder,
    head,
    up,
    armL: arm(p.sL, p.eL),
    armR: arm(p.sR, p.eR),
    legL: leg(p.hL, p.kL),
    legR: leg(p.hR, p.kR),
  };
}

// IK de dos segmentos: devuelve el codo/rodilla para que el extremo alcance el objetivo
export function ik(from: Vec, target: Vec, a: number, b: number, bend: 1 | -1): Vec {
  const dx = target[0] - from[0];
  const dy = target[1] - from[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.01);
  const base = Math.atan2(dy, dx);
  const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const ang = base + bend * Math.acos(cosA);
  return [from[0] + Math.cos(ang) * a, from[1] + Math.sin(ang) * a];
}

export const pts = (list: Vec[]) => list.map((v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" ");

type FigureProps = {
  pose: Pose;
  scale?: number;
  color?: string;
  far?: string; // color de las extremidades lejanas
  hideArms?: boolean;
  headExtra?: React.ReactNode; // pelo, cinta…
  torsoLabel?: string; // dorsal
  children?: React.ReactNode; // elementos en coordenadas locales (encima)
};

const W = { torso: 29, limb: 16.5 };

export function Figure({ pose, scale = 1.5, color = "var(--ink)", far, hideArms, headExtra, torsoLabel, children }: FigureProps) {
  const j = fk(pose);
  const farColor = far ?? color;
  const line = (list: Vec[], c: string, w = W.limb) => (
    <polyline points={pts(list)} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const mid = mul(add(j.hip, j.shoulder), 0.5);
  return (
    <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.flip ? -scale : scale} ${scale})`}>
      <g opacity={far ? 1 : 0.55}>
        {line(j.legL, farColor)}
        {!hideArms && line(j.armL, farColor)}
      </g>
      {line([j.hip, j.shoulder], color, W.torso)}
      {torsoLabel && (
        <text
          x={mid[0]}
          y={mid[1]}
          transform={`rotate(${pose.rot}) scale(${pose.flip ? -1 : 1} 1)`}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--f-display)"
          fill="var(--yellow)"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {torsoLabel}
        </text>
      )}
      {headExtra && <g transform={`translate(${j.head[0]} ${j.head[1]}) rotate(${pose.rot + pose.neck})`}>{headExtra}</g>}
      <circle cx={j.head[0]} cy={j.head[1]} r={LIMB.head} fill={color} />
      {line(j.legR, color)}
      {!hideArms && line(j.armR, color)}
      {children}
    </g>
  );
}

// Ciclo de carrera paramétrico (fase en radianes)
export function runPose(phase: number, base: Partial<Pose> = {}): Pose {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  return {
    x: 0,
    y: -6 * Math.abs(c),
    rot: 14,
    neck: 6,
    hL: 42 * s,
    kL: -18 - 70 * Math.max(0, -Math.sin(phase + 0.6)),
    hR: -42 * s,
    kR: -18 - 70 * Math.max(0, Math.sin(phase + 0.6)),
    sL: -48 * s,
    eL: 85,
    sR: 48 * s,
    eR: 85,
    ...base,
  };
}
