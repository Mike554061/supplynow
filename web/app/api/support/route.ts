import { NextResponse } from "next/server";
import { forward, newId, str, isEmail } from "@/lib/leads";

const TOPICS = ["tracking", "delivery", "billing", "claim", "coi", "quote", "other"];

// Customer service tickets: tracking requests, delivery changes, billing, claims, COI requests.
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (str(b.website)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const topic = TOPICS.includes(str(b.topic)) ? str(b.topic) : "other";
  const email = str(b.email, 200), phone = str(b.phone, 40), message = str(b.message, 4000), reference = str(b.reference, 80);
  if (!email && !phone) return NextResponse.json({ error: "Add an email or phone number so we can reach you." }, { status: 400 });
  if (email && !isEmail(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  if (topic !== "tracking" && message.length < 5) return NextResponse.json({ error: "Tell us a little about what you need." }, { status: 400 });
  const id = newId("CS");
  const forwarded = await forward("support", { id, topic, reference, name: str(b.name), company: str(b.company), email, phone, message });
  return NextResponse.json({ id, forwarded });
}
