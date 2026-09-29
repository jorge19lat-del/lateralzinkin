"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

// Foto (o vídeo, si está configurado) de cada historia, animada con el progreso del scroll.
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Encuadre inicial y final (object-position en %) siguiendo el gesto de cada uno
const framing: Record<string, { from: [number, number]; to: [number, number] }> = {
  fosbury: { from: [25, 55], to: [62, 40] },
  cruyff: { from: [72, 40], to: [48, 35] },
  hendrix: { from: [40, 12], to: [52, 6] },
};

export const PIVOT = 0.4;

export default function SceneMedia({ scene, alt, p }: { scene: string; alt: string; p: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = site.lateralVideos[scene];
  const f = framing[scene] ?? { from: [50, 50], to: [50, 50] };

  // Con vídeo, el scroll mueve la cabeza de reproducción
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const id = requestAnimationFrame(() => {
      v.currentTime = p * (v.duration - 0.05);
    });
    return () => cancelAnimationFrame(id);
  }, [p]);

  const t = ease(p);
  const reveal = ease(seg(p, PIVOT - 0.02, PIVOT + 0.1)); // el momento lateral
  const wipe = seg(p, PIVOT - 0.04, PIVOT + 0.08);
  const scale = mix(1.02, 1.2, t);
  const tilt = mix(-4, 0, reveal) * seg(p, PIVOT - 0.1, PIVOT);
  const x = mix(f.from[0], f.to[0], t);
  const y = mix(f.from[1], f.to[1], t);
  const bright = mix(1.35, 1.9, reveal);
  const contrast = mix(1.1, 1.5, reveal);

  const mediaStyle = {
    objectPosition: `${x}% ${y}%`,
    transform: `scale(${scale}) rotate(${tilt}deg)`,
    filter: `grayscale(1) brightness(${bright}) contrast(${contrast})`,
  };

  return (
    <div className="scene-media">
      {video ? (
        <video ref={videoRef} className="scene-media__img" src={video} muted playsInline preload="auto" style={{ ...mediaStyle, objectFit: "cover" }} />
      ) : (
        <Image src={`/img/${scene}.jpg`} alt={alt} fill sizes="(min-width: 960px) 60vw, 100vw" className="scene-media__img" style={mediaStyle} />
      )}
      {/* Antes del giro, la escena está apagada; después, se enciende */}
      <div className="scene-media__shade" style={{ opacity: 0.35 * (1 - reveal) }} />
      {/* Barrido de la exclamación en el momento clave */}
      <div className="scene-media__wipe" style={{ transform: `translateX(${mix(-130, 130, wipe)}%) skewX(-12deg)`, opacity: wipe > 0 && wipe < 1 ? 1 : 0 }} />
      <div className="scene-media__grain" aria-hidden="true" />
      <div className="scene-media__vignette" aria-hidden="true" />
      <span className="scene-media__counter" aria-hidden="true">
        {String(Math.round(p * 240)).padStart(4, "0")}
      </span>
    </div>
  );
}
