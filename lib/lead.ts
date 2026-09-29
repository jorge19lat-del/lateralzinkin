export type LeadPayload = {
  type: "contact" | "quiz";
  locale: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  sector?: string;
  budget?: string;
  message?: string;
  score?: number;
  tier?: string;
  dims?: Record<string, number>;
  answers?: string[];
  website?: string; // honeypot
};

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
