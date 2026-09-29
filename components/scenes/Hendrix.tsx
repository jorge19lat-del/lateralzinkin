import { clamp, dir, ease, easeOut, ik, mix, pts, seg, LIMB, type Vec } from "./rig";

// Woodstock: la guitarra "de diestro" gira, él la toca al revés y el sonido lo inunda todo.
const HX = 360;
const HY = 330;
const S = 1.78;
const FOOT_Y = (480 - HY) / S;

const frac = (v: number) => v - Math.floor(v);

function guitarPoint(g: { x: number; y: number; a: number; fx: number }, u: number, v: number): Vec {
  const r = (g.a * Math.PI) / 180;
  const ux = u * Math.cos(r) - v * Math.sin(r);
  const uy = u * Math.sin(r) + v * Math.cos(r);
  return [g.x + g.fx * ux, g.y + uy];
}

function pickElbow(from: Vec, target: Vec, a: number, b: number, outward: 1 | -1): Vec {
  const e1 = ik(from, target, a, b, 1);
  const e2 = ik(from, target, a, b, -1);
  return (e1[0] - e2[0]) * outward > 0 ? e1 : e2;
}

export const pivot = 0.14;
export const keyFrame = 0.62;

export default function Hendrix({ p }: { p: number }) {
  const flipT = ease(seg(p, 0.12, 0.36));
  const play = seg(p, 0.36, 0.44) * (1 - seg(p, 0.96, 1) * 0.3);
  const finale = ease(seg(p, 0.8, 0.92));

  // Cuerpo: balanceo, flexión y cabeceo mientras toca
  const sway = 5 * Math.sin(p * Math.PI * 2 * 3) * play - 8 * finale;
  const dip = 7 + (7 * (1 + Math.sin(p * Math.PI * 2 * 6)) * play) / 2 + 4 * finale;
  const nod = 10 * Math.sin(p * Math.PI * 2 * 6) * play;

  const up = dir(180 - sway);
  const right: Vec = [Math.cos((sway * Math.PI) / 180), Math.sin((sway * Math.PI) / 180)];
  const hip: Vec = [0, dip / S];
  const shoulder: Vec = [hip[0] + up[0] * LIMB.torso, hip[1] + up[1] * LIMB.torso];
  const shL: Vec = [shoulder[0] - right[0] * 17, shoulder[1] - right[1] * 17];
  const shR: Vec = [shoulder[0] + right[0] * 17, shoulder[1] + right[1] * 17];
  const hpL: Vec = [hip[0] - right[0] * 10, hip[1] - right[1] * 10];
  const hpR: Vec = [hip[0] + right[0] * 10, hip[1] + right[1] * 10];
  const headDir = dir(180 - sway - nod * 0.4);
  const head: Vec = [shoulder[0] + headDir[0] * 22, shoulder[1] + headDir[1] * 22];

  // Piernas abiertas con los pies fijos en el suelo
  const footL: Vec = [-32, FOOT_Y];
  const footR: Vec = [32, FOOT_Y];
  const kneeL = pickElbow(hpL, footL, LIMB.thigh, LIMB.shin, -1);
  const kneeR = pickElbow(hpR, footR, LIMB.thigh, LIMB.shin, 1);

  // Guitarra: empieza "de diestro" (mástil a la derecha) y gira hasta quedar de zurdo
  const guitar = {
    x: mix(2, 22, finale),
    y: mix(-20, -52, finale) - 10 * Math.sin(Math.PI * flipT) + dip / S,
    a: mix(-30, -58, finale) + 8 * Math.sin(Math.PI * flipT),
    fx: Math.cos(Math.PI * flipT),
  };
  const strum = 9 * Math.sin(p * Math.PI * 2 * 22) * play;
  const tStrum = guitarPoint(guitar, -10, strum);
  const tFret = guitarPoint(guitar, mix(46, 34, finale), 0);
  const [tLeft, tRight] = tStrum[0] < tFret[0] ? [tStrum, tFret] : [tFret, tStrum];
  const elbowL = pickElbow(shL, tLeft, LIMB.upper, LIMB.fore, -1);
  const elbowR = pickElbow(shR, tRight, LIMB.upper, LIMB.fore, 1);

  const gBody = guitarPoint(guitar, -6, 0);
  const world = (v: Vec): Vec => [HX + v[0] * S, HY + v[1] * S];
  const src = world(gBody);

  const rings = Array.from({ length: 7 }, (_, i) => {
    const ph = frac(p * 7 + i / 7);
    return { r: 30 + ph * mix(360, 620, finale), o: (1 - ph) * play, ink: i % 2 === 1 };
  });

  const limb = (list: Vec[], w = 14) => (
    <polyline points={pts(list)} fill="none" stroke="var(--ink)" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );

  return (
    <svg viewBox="0 0 800 560" className="scene-svg" role="img" aria-label="Jimi Hendrix tocando una guitarra de diestro al revés">
      <defs>
        <clipPath id="hx-clip">
          <rect width="800" height="560" />
        </clipPath>
      </defs>
      <g clipPath="url(#hx-clip)">
        {/* Rayos del final */}
        <g transform={`translate(${src[0]} ${src[1]}) rotate(${p * 90})`} opacity={finale}>
          {Array.from({ length: 16 }, (_, i) => (
            <polygon key={i} points="0,0 -26,-700 26,-700" fill="var(--paper)" opacity="0.35" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        {/* Foco */}
        <polygon points={`${HX - 40},-10 ${HX + 40},-10 ${HX + 190},480 ${HX - 190},480`} fill="var(--paper)" opacity={0.28 * easeOut(seg(p, 0, 0.12))} />
        {/* Ondas de sonido */}
        {rings.map((r, i) => (
          <circle
            key={i}
            cx={src[0]}
            cy={src[1]}
            r={r.r}
            fill="none"
            stroke={r.ink ? "var(--ink)" : "var(--paper)"}
            strokeWidth={r.ink ? 3 : 5}
            opacity={clamp(r.o)}
          />
        ))}
        {/* Amplificador y cable */}
        <path
          d={`M ${src[0]} ${src[1] + 10} C ${src[0] + 40} 520, 580 520, 660 470`}
          fill="none"
          stroke="var(--paper)"
          strokeWidth="4"
          opacity={0.9}
        />
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(630 ${336 + k * 74})`}>
            <rect width="130" height="70" rx="4" fill="var(--ink)" />
            {[0, 1, 2, 3].map((l) => (
              <line key={l} x1="12" x2="118" y1={16 + l * 13} y2={16 + l * 13} stroke="var(--paper)" strokeWidth="2" opacity="0.35" />
            ))}
            <circle cx="65" cy="36" r={18 + 3 * play * Math.abs(Math.sin(p * 90 + k))} fill="none" stroke="var(--yellow)" strokeWidth="3" />
          </g>
        ))}
        {/* Suelo del escenario */}
        <rect x="0" y="480" width="800" height="80" fill="var(--ink)" />

        <g transform={`translate(${HX} ${HY}) scale(${S})`}>
          {/* Piernas (pantalón de campana) */}
          {limb([hpL, kneeL, footL], 17)}
          {limb([hpR, kneeR, footR], 17)}
          <polygon points={`${footL[0] - 9},${footL[1]} ${footL[0] + 9},${footL[1]} ${footL[0] + 5},${footL[1] - 16} ${footL[0] - 5},${footL[1] - 16}`} fill="var(--ink)" />
          <polygon points={`${footR[0] - 9},${footR[1]} ${footR[0] + 9},${footR[1]} ${footR[0] + 5},${footR[1] - 16} ${footR[0] - 5},${footR[1] - 16}`} fill="var(--ink)" />
          {/* Torso */}
          <polygon points={pts([shL, shR, hpR, hpL])} fill="var(--ink)" stroke="var(--ink)" strokeWidth="12" strokeLinejoin="round" />
          {/* Correa */}
          <line x1={shR[0]} y1={shR[1]} x2={guitarPoint(guitar, -30, 12)[0]} y2={guitarPoint(guitar, -30, 12)[1]} stroke="var(--paper)" strokeWidth="3" />
          {/* Guitarra */}
          <g transform={`translate(${guitar.x} ${guitar.y}) scale(${guitar.fx} 1) rotate(${guitar.a})`}>
            {/* Mástil y pala */}
            <rect x="8" y="-3.4" width="62" height="6.8" rx="2" fill="var(--ink)" stroke="var(--paper)" strokeWidth="1.3" />
            <path d="M 68 -4 L 84 -9 Q 90 -8 88 -2 L 84 4 L 68 4 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />
            {[22, 34, 46, 58].map((u) => (
              <line key={u} x1={u} y1="-3.4" x2={u} y2="3.4" stroke="var(--paper)" strokeWidth="0.8" opacity="0.6" />
            ))}
            {/* Cuerpo de doble recorte, blanco como la de Woodstock */}
            <path
              d="M 14 -8 C 18 -15 10 -19 3 -13 C -6 -22 -26 -21 -33 -9 C -39 1 -36 15 -25 20 C -14 25 -3 21 3 14 C 9 19 17 16 13 8 C 11 4 11 -3 14 -8 Z"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path d="M 6 -9 C -2 -15 -16 -14 -22 -6 L -18 10 C -10 15 0 13 5 8 Z" fill="var(--ink)" opacity="0.9" />
            <rect x="-26" y="-7" width="3" height="14" rx="1" fill="var(--paper)" />
            <line x1="-28" y1="0" x2="86" y2="-1" stroke="var(--yellow)" strokeWidth="0.9" />
          </g>
          {/* Brazos */}
          {limb([shL, elbowL, tLeft], 15)}
          {limb([shR, elbowR, tRight], 15)}
          {/* Cabeza, afro y cinta */}
          <circle cx={head[0] + headDir[0] * 5} cy={head[1] + headDir[1] * 5} r="22" fill="var(--ink)" />
          <circle cx={head[0]} cy={head[1]} r={LIMB.head} fill="var(--ink)" />
          <line
            x1={head[0] - 21 * Math.cos((sway * Math.PI) / 180)}
            y1={head[1] - 3 - 21 * Math.sin((sway * Math.PI) / 180)}
            x2={head[0] + 21 * Math.cos((sway * Math.PI) / 180)}
            y2={head[1] - 3 + 21 * Math.sin((sway * Math.PI) / 180)}
            stroke="var(--paper)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
