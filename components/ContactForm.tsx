"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n";
import { sendLead } from "@/lib/lead";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "ok" | "error" | "invalid";

export default function ContactForm({ locale, t }: { locale: string; t: Dict }) {
  const f = t.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("invalid");
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    const ok = await sendLead({
      type: "contact",
      locale,
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      sector: data.sector,
      budget: data.budget,
      message: data.message,
      website: data.website,
    });
    setStatus(ok ? "ok" : "error");
    if (ok) form.reset();
  }

  if (status === "ok") {
    return (
      <div className="form-msg form-msg--ok" role="status">
        {f.success}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-name">{f.name} *</label>
          <input id="cf-name" name="name" required autoComplete="name" maxLength={200} />
        </div>
        <div className="field">
          <label htmlFor="cf-email">{f.email} *</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-company">{f.company}</label>
          <input id="cf-company" name="company" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">{f.phone}</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-sector">{f.sector}</label>
          <select id="cf-sector" name="sector" defaultValue={f.sectorOptions[0]}>
            {f.sectorOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cf-budget">{f.budget}</label>
          <select id="cf-budget" name="budget" defaultValue={f.budgetOptions[0]}>
            {f.budgetOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-message">{f.message} *</label>
        <textarea id="cf-message" name="message" required maxLength={5000} placeholder={f.messagePlaceholder} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>
          {f.consentA} <Link href={href(locale, `${paths.legal}/privacidad`)}>{f.consentLink}</Link>. *
        </span>
      </label>
      {status === "invalid" && <p className="form-msg form-msg--err">{f.required}</p>}
      {status === "error" && (
        <p className="form-msg form-msg--err" role="alert">
          {f.error} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      )}
      <button className="btn btn--block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? f.sending : f.submit} <span className="arrow">→</span>
      </button>
    </form>
  );
}
