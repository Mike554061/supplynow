import { NextResponse } from "next/server";
import { quote, clampNum, ACCESSORIALS, type AccessorialId, type Temp } from "@/lib/pricing";
import { findPlace, roadMiles } from "@/lib/places";
import { SERVICES } from "@/lib/site";
import { forward, newId, str, isEmail } from "@/lib/leads";

// The instant quote back end: re-prices the request server-side (the browser's number is never
// trusted), assigns a quote ID, and hands the lead off to the team.
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (str(b.website)) return NextResponse.json({ error: "Invalid request" }, { status: 400 }); // honeypot

  const lane = (b.lane ?? {}) as Record<string, unknown>;
  const from = findPlace(str(lane.from)), to = findPlace(str(lane.to));
  const miles = lane.manual || !from || !to ? clampNum(b.miles, 1, 3500, NaN) : roadMiles(from, to);
  if (!Number.isFinite(miles)) return NextResponse.json({ error: "Tell us the lane or the miles." }, { status: 400 });

  const temp = (["dry", "refrigerated", "frozen"] as Temp[]).includes(b.temp as Temp) ? (b.temp as Temp) : "dry";
  const accessorials = (Array.isArray(b.accessorials) ? b.accessorials : []).filter((a): a is AccessorialId => typeof a === "string" && a in ACCESSORIALS);
  const contact = (b.contact ?? {}) as Record<string, unknown>;
  const email = str(contact.email, 200), phone = str(contact.phone, 40);
  if (!email && !phone) return NextResponse.json({ error: "Add an email or phone number so we can send your quote." }, { status: 400 });
  if (email && !isEmail(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });

  const q = quote({
    miles,
    pallets: clampNum(b.pallets, 1, 260, 1),
    lbs: clampNum(b.lbs, 1, 450000, 1000),
    temp,
    stops: clampNum(b.stops, 1, 30, 1),
    accessorials,
    expedited: b.expedited === true,
    runsPerWeek: clampNum(b.runsPerWeek, 0, 21, 0),
  });
  const id = newId("Q");
  const validUntil = new Date(Date.now() + 7 * 864e5).toISOString();
  const service = SERVICES.find((s) => s.slug === b.service)?.name ?? "Unspecified";

  const forwarded = await forward("quote", {
    id, validUntil, service,
    lane: from && to && !lane.manual ? `${from.name} → ${to.name}` : `${miles} miles (customer entered)`,
    miles, temp, pallets: b.pallets, lbs: b.lbs, stops: b.stops, accessorials, expedited: b.expedited === true, runsPerWeek: b.runsPerWeek,
    total: q.total, equipment: q.equipment.name, trucks: q.trucks, lines: q.lines,
    contact: { name: str(contact.name), company: str(contact.company), email, phone, pickupDate: str(contact.pickupDate, 20), notes: str(contact.notes, 1000) },
  });

  return NextResponse.json({ id, quote: q, validUntil, forwarded });
}
