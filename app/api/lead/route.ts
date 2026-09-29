import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/lead";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function row(label: string, value: unknown) {
  if (value === undefined || value === null || value === "") return "";
  return `<tr><td style="padding:6px 16px 6px 0;color:#6b675f;vertical-align:top">${esc(label)}</td><td style="padding:6px 0">${esc(value).replace(/\n/g, "<br>")}</td></tr>`;
}

function buildEmail(p: LeadPayload) {
  const isQuiz = p.type === "quiz";
  const subject = isQuiz
    ? `Test de visibilidad: ${p.name} (${p.score}/100 · ${p.tier})`
    : `Nuevo contacto web: ${p.name}${p.company ? ` · ${p.company}` : ""}`;
  const dims = p.dims ? Object.entries(p.dims).map(([k, v]) => `${k}: ${v}%`).join(" · ") : "";
  const html = `
  <div style="font-family:system-ui,sans-serif;font-size:15px;color:#0d0d0d">
    <div style="background:#ffd900;padding:16px 20px;font-weight:700">${isQuiz ? "Nuevo lead del test" : "Nuevo contacto desde la web"}</div>
    <table style="margin:16px 20px;border-collapse:collapse">
      ${row("Nombre", p.name)}
      ${row("Email", p.email)}
      ${row("Empresa", p.company)}
      ${row("Teléfono", p.phone)}
      ${row("Sector", p.sector)}
      ${row("Inversión", p.budget)}
      ${row("Mensaje", p.message)}
      ${row("Puntuación", p.score !== undefined ? `${p.score}/100 · ${p.tier}` : "")}
      ${row("Áreas", dims)}
      ${row("Respuestas", p.answers?.join("\n"))}
      ${row("Idioma", p.locale)}
    </table>
  </div>`;
  return { subject, html };
}

export async function POST(request: Request) {
  let p: LeadPayload;
  try {
    p = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: los bots rellenan el campo oculto; respondemos ok sin enviar nada
  if (p.website) return NextResponse.json({ ok: true });

  if (!p.name?.trim() || !EMAIL_RE.test(p.email || "") || (p.type !== "contact" && p.type !== "quiz")) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }
  if ((p.message?.length || 0) > 5000 || p.name.length > 200) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 422 });
  }

  const { subject, html } = buildEmail(p);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Sin proveedor configurado: el lead queda registrado en los logs de Vercel para no perderlo
    console.warn("[lead] RESEND_API_KEY no configurada. Lead recibido:", JSON.stringify({ subject, ...p }));
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "Lateral Zinkin <onboarding@resend.dev>",
      to: [process.env.LEAD_TO_EMAIL || "lateral@lateralzinkin.com"],
      reply_to: p.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[lead] Error de Resend", res.status, await res.text(), JSON.stringify(p));
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
