import { Figure, ease, easeOut, mix, runPose, seg, timeline, type Pose, type Vec } from "./rig";

// Ámsterdam: amago de centro, el balón pasa por detrás de la pierna de apoyo y el defensa se va al suelo.
const GROUND = 480;
const STAND = 342;
const BALL_R = 13;
const S = 1.68;

const TURN: [number, Pose][] = [
  [0.3, { ...runPose(Math.PI * 7, { rot: 10 }), x: 330, y: STAND }],
  // Prepara el centro: pierna atrás, brazos abiertos
  [0.4, { x: 345, y: 339, rot: -12, neck: 0, hL: 8, kL: -6, hR: -55, kR: -75, sL: 70, eL: 30, sR: -50, eR: 40 }],
  // …pero en lugar de golpear, pasa el pie por encima
  [0.48, { x: 350, y: 342, rot: 0, neck: 14, hL: 5, kL: -8, hR: 28, kR: -12, sL: 70, eL: 20, sR: -45, eR: 30 }],
  [0.53, { x: 350, y: 342, rot: 0, neck: 10, hL: 0, kL: -5, hR: -30, kR: -30, sL: 80, eL: 10, sR: -70, eR: 10 }],
  [0.56, { x: 350, y: 342, rot: 0, neck: 0, hL: 0, kL: 0, hR: 0, kR: 0, sL: 80, eL: 10, sR: -80, eR: 10 }],
];

function cruyffAt(p: number): Pose {
  if (p < 0.3) {
    const t = seg(p, 0, 0.3);
    const r = runPose(t * Math.PI * 7, { rot: 10 });
    return { ...r, x: mix(50, 330, t), y: STAND + r.y };
  }
  if (p < 0.56) return timeline(p, TURN);
  // Girado: ahora corre hacia -x
  const t = seg(p, 0.56, 1);
  const turned: Pose = { x: 350, y: 342, rot: 0, neck: 0, hL: 0, kL: 0, hR: 0, kR: 0, sL: -80, eL: 10, sR: 80, eR: 10, flip: true };
  const r = { ...runPose(t * Math.PI * 7, { rot: 16 }), flip: true };
  const blend = ease(seg(p, 0.56, 0.62));
  const x = mix(350, 90, easeOut(t) * 0.35 + t * 0.65);
  return {
    ...r,
    rot: mix(turned.rot, r.rot, blend),
    sL: mix(turned.sL, r.sL, blend),
    sR: mix(turned.sR, r.sR, blend),
    hL: mix(0, r.hL, blend),
    hR: mix(0, r.hR, blend),
    kL: mix(0, r.kL, blend),
    kR: mix(0, r.kR, blend),
    x,
    y: STAND + r.y * blend,
  };
}

function ballAt(p: number, pose: Pose): Vec {
  const y = GROUND - BALL_R;
  if (p < 0.3) return [pose.x + 50 + 8 * Math.sin(p * 90), y];
  if (p < 0.44) return [mix(pose.x + 50, 400, seg(p, 0.3, 0.36)), y];
  if (p < 0.56) {
    const t = ease(seg(p, 0.44, 0.56));
    return [mix(400, 300, t), y];
  }
  const run = cruyffAt(p);
  return [Math.min(300, run.x - 52 - 6 * Math.sin(p * 80)), y];
}

const DEF: [number, Pose][] = [
  [0.3, { ...runPose(Math.PI * 3, { rot: 6 }), x: 600, y: STAND, flip: true }],
  // Se lanza a tapar el centro que nunca llega
  [0.44, { x: 520, y: 372, rot: 30, neck: 10, hL: -10, kL: 0, hR: 95, kR: -80, sL: 60, eL: 20, sR: -50, eR: 20, flip: true }],
  [0.58, { x: 470, y: 425, rot: 78, neck: -10, hL: 0, kL: -10, hR: 12, kR: -20, sL: 165, eL: 5, sR: 150, eR: 10, flip: true }],
  [0.72, { x: 455, y: 452, rot: 90, neck: -5, hL: 0, kL: -25, hR: 6, kR: -15, sL: 172, eL: 0, sR: 160, eR: 5, flip: true }],
];

function defenderAt(p: number): Pose {
  if (p < 0.3) {
    const t = seg(p, 0, 0.3);
    const r = runPose(t * Math.PI * 3, { rot: 6 });
    return { ...r, x: mix(660, 600, t), y: STAND + r.y * 0.6, flip: true };
  }
  return timeline(p, DEF);
}

export const pivot = 0.44;
export const keyFrame = 0.5;

export default function Cruyff({ p }: { p: number }) {
  const pose = cruyffAt(p);
  const def = defenderAt(p);
  const ball = ballAt(p, pose);
  const trail: Vec[] = [];
  for (let q = 0.3; q <= p; q += 0.008) trail.push(ballAt(q, cruyffAt(q)));
  const spin = ball[0] * 3;

  return (
    <svg viewBox="0 0 800 560" className="scene-svg" role="img" aria-label="Johan Cruyff haciendo el giro Cruyff ante un defensa">
      {/* Líneas del campo */}
      <path d="M 560 480 Q 640 400 800 392" fill="none" stroke="var(--paper)" strokeWidth="4" strokeDasharray="14 10" opacity="0.8" />
      <line x1="0" y1={GROUND} x2="800" y2={GROUND} stroke="var(--ink)" strokeWidth="3" />
      {/* El centro que el defensa esperaba */}
      <path
        d="M 400 468 Q 520 260 700 300"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeDasharray="6 10"
        opacity={0.45 * seg(p, 0.34, 0.42) * (1 - seg(p, 0.5, 0.6))}
      />
      {/* Estela del balón */}
      {trail.length > 1 && (
        <polyline points={trail.map((v) => v.join(",")).join(" ")} fill="none" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      )}
      {/* Defensa */}
      <g opacity="0.5">
        <Figure pose={def} scale={S} />
      </g>
      <text x={def.x - 10} y={def.y - 70} className="scene-caption" fontSize="54" opacity={easeOut(seg(p, 0.74, 0.84))}>
        ?
      </text>
      {/* Estela de siluetas en el giro */}
      {p > 0.44 && p < 0.66 &&
        [0.05, 0.025].map((d, i) => (
          <g key={d} opacity={0.3 + i * 0.15}>
            <Figure pose={cruyffAt(p - d)} scale={S} color="var(--paper)" far="var(--paper)" />
          </g>
        ))}
      <Figure pose={pose} scale={S} torsoLabel="14" />
      {/* Balón */}
      <g transform={`translate(${ball[0]} ${ball[1]}) rotate(${spin})`}>
        <circle r={BALL_R} fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
        <polygon points="0,-5 4.8,-1.5 3,4 -3,4 -4.8,-1.5" fill="var(--ink)" />
      </g>
    </svg>
  );
}
