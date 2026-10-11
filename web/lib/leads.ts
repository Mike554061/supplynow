// Lead and ticket hand-off. With no extra services, submissions land in the Vercel function logs.
// Set LEAD_WEBHOOK_URL (any HTTPS webhook: Zapier, Make, Airtable automation, Slack workflow)
// and every quote and support ticket is also POSTed there as JSON.

export function newId(prefix: string): string {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${t}${r}`;
}

export async function forward(kind: "quote" | "support", payload: Record<string, unknown>): Promise<boolean> {
  const body = { kind, receivedAt: new Date().toISOString(), ...payload };
  console.log(`[supplynow:${kind}]`, JSON.stringify(body));
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-supplynow-secret": process.env.LEAD_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch (err) {
    console.error(`[supplynow:${kind}] webhook failed`, err);
    return false;
  }
}

export const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
