import { Figure, clamp, mix, runPose, seg, timeline, easeOut, type Pose, type Vec } from "./rig";

// México 1968: carrera, batida, giro de espaldas y arco sobre el listón.
const GROUND = 480;
const STAND = 355;

const TAKEOFF: [number, Pose][] = [
  [0.32, { ...runPose(Math.PI * 9), x: 400, y: STAND }],
  [0.36, { x: 425, y: 345, rot: -8, neck: -5, hL: 8, kL: -5, hR: 85, kR: -95, sL: 150, eL: 20, sR: 165, eR: 10 }],
  // Brazos arriba y cuerpo vertical: pose simétrica para que el giro no se note
  [0.4, { x: 430, y: 342, rot: 0, neck: 0, hL: 0, kL: 0, hR: 20, kR: -30, sL: 172, eL: 0, sR: 176, eR: 0 }],
];

// A partir de aquí la figura está girada (mira a -x): los ángulos son locales
const FLIGHT: [number, Pose][] = [
  [0.4, { x: 0, y: 0, rot: 0, neck: 0, hL: 0, kL: 0, hR: -20, kR: 30, sL: -172, eL: 0, sR: -176, eR: 0, flip: true }],
  [0.47, { x: 0, y: 0, rot: -60, neck: -25, hL: -15, kL: -20, hR: -20, kR: -25, sL: 30, eL: 10, sR: 40, eR: 15, flip: true }],
  [0.56, { x: 0, y: 0, rot: -95, neck: -35, hL: -40, kL: -50, hR: -35, kR: -55, sL: 15, eL: 5, sR: 20, eR: 5, flip: true }],
  [0.64, { x: 0, y: 0, rot: -105, neck: -20, hL: 30, kL: -10, hR: 35, kR: -5, sL: 10, eL: 10, sR: 15, eR: 10, flip: true }],
  [0.72, { x: 0, y: 0, rot: -122, neck: 10, hL: 70, kL: -30, hR: 75, kR: -25, sL: -30, eL: 20, sR: -20, eR: 20, flip: true }],
  [0.84, { x: 0, y: 0, rot: -100, neck: 0, hL: 45, kL: -70, hR: 50, kR: -65, sL: 60, eL: 10, sR: 70, eR: 10, flip: true }],
  [1, { x: 0, y: 0, rot: -96, neck: -5, hL: 40, kL: -75, hR: 48, kR: -70, sL: 150, eL: 5, sR: 165, eR: 5, flip: true }],
];

// Trayectoria de la cadera en vuelo
function hipAt(u: number): Vec {
  const x = mix(430, 618, u);
  const y = mix(342, 392, u) - 132 * 4 * u * (1 - u);
  return [x, y];
}

function poseAt(p: number): Pose {
  if (p < 0.32) {
    const t = seg(p, 0, 0.32);
    const r = runPose(t * Math.PI * 9);
    return { ...r, x: mix(110, 400, t), y: STAND + r.y };
  }
  if (p < 0.4) return timeline(p, TAKEOFF);
  const pose = timeline(p, FLIGHT);
  const u = seg(p, 0.4, 0.72);
  const [x, y] = hipAt(u);
  const bounce = -10 * Math.sin(Math.PI * seg(p, 0.72, 0.8));
  return { ...pose, x, y: y + bounce };
}

export const pivot = 0.34;
export const keyFrame = 0.56;

export default function Fosbury({ p }: { p: number }) {
  const pose = poseAt(p);
  const inFlight = p > 0.4 && p < 0.76;
  const u = seg(p, 0.4, 0.72);
  const trail: Vec[] = [];
  for (let i = 0; i <= 40 && i / 40 <= u; i++) trail.push(hipAt(i / 40));
  const running = p < 0.34;
  const barWobble = p > 0.56 && p < 0.66 ? Math.sin(seg(p, 0.56, 0.66) * Math.PI * 4) * 2 * (1 - seg(p, 0.56, 0.66)) : 0;

  return (
    <svg viewBox="0 0 800 560" className="scene-svg" role="img" aria-label="Dick Fosbury saltando de espaldas sobre el listón">
      <g transform="translate(400 300) scale(1.2) translate(-462 -300)">
      {/* Colchoneta */}
      <polygon points="470,440 770,440 800,405 505,405" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      <rect x="470" y="440" width="300" height="40" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="770" y1="480" x2="800" y2="445" stroke="var(--ink)" strokeWidth="3" />
      <line x1="800" y1="405" x2="800" y2="445" stroke="var(--ink)" strokeWidth="3" />
      {/* Poste lejano y listón */}
      <line x1="610" y1="405" x2="610" y2="240" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <line x1="520" y1={298 + barWobble} x2="610" y2="250" stroke="var(--ink)" strokeWidth="9" strokeLinecap="round" />
      <line x1="520" y1={298 + barWobble} x2="610" y2="250" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" />
      {/* Suelo */}
      <line x1="0" y1={GROUND} x2="800" y2={GROUND} stroke="var(--ink)" strokeWidth="3" />
      {/* Trazo de la trayectoria */}
      {trail.length > 1 && (
        <polyline points={trail.map((v) => v.join(",")).join(" ")} fill="none" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
      )}
      {/* Líneas de velocidad en la carrera */}
      {running &&
        [0, 1, 2].map((i) => (
          <line
            key={i}
            x1={pose.x - 70 - i * 18}
            x2={pose.x - 120 - i * 30}
            y1={pose.y - 60 + i * 34}
            y2={pose.y - 60 + i * 34}
            stroke="var(--paper)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={clamp(0.9 - i * 0.25)}
          />
        ))}
      {/* Estela de siluetas durante el vuelo */}
      {inFlight &&
        [0.05, 0.03].map((d, i) => (
          <g key={d} opacity={0.35 + i * 0.15}>
            <Figure pose={poseAt(Math.max(0.4, p - d))} color="var(--paper)" far="var(--paper)" />
          </g>
        ))}
      <Figure pose={pose} />
      {/* Poste cercano, por delante del atleta */}
      <line x1="520" y1={GROUND} x2="520" y2="290" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
      {/* Medalla de oro al final */}
      <g transform={`translate(240 150) scale(${easeOut(seg(p, 0.8, 0.92))})`}>
        <path d="M -14 -60 L -4 -22 M 14 -60 L 4 -22" stroke="var(--ink)" strokeWidth="6" />
        <circle r="30" fill="var(--ink)" />
        <circle r="22" fill="none" stroke="var(--yellow)" strokeWidth="3" />
        <text className="scene-caption" fill="var(--yellow)" fontSize="20" textAnchor="middle" dominantBaseline="central">
          68
        </text>
      </g>
      </g>
    </svg>
  );
}
