import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { RouteCompare, TrailerFill, LiveTrack, LaneLoop, ReachRings } from "@/components/Illustrations";
import { Icon } from "@/components/Icon";
import { SERVICES } from "@/lib/site";

// Internal storyboard: the visitor's journey from first frame to quote, scene by scene,
// with the illustration and motion for each. Not indexed.
export const metadata: Metadata = { title: "Website storyboard", robots: { index: false, follow: false } };

const T = { fill: "#a9bcc8", fontSize: 12, fontWeight: 600 } as const;

function HeroFrame() {
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label="Hero frame: night highway with a tracked SupplyNow truck">
      <defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#060d13" /><stop offset="1" stopColor="#16303e" /></linearGradient></defs>
      <rect width="500" height="300" rx="16" fill="url(#sky)" />
      <rect y="150" width="500" height="150" fill="#060c11" />
      <path d="M340 150 L60 300 M340 150 L620 300" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
      <path d="M340 150 L330 300" stroke="rgba(233,200,100,.5)" strokeWidth="2" strokeDasharray="10 12">
        <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1s" repeatCount="indefinite" />
      </path>
      <circle cx="380" cy="190" r="5" fill="#00b4a6" /><circle cx="380" cy="190" r="5" fill="none" stroke="#00b4a6" strokeWidth="2" className="pulse" />
      <rect x="392" y="200" width="96" height="18" rx="9" fill="rgba(6,13,19,.85)" stroke="#00b4a6" /><text x="400" y="213" fill="#bff3ee" fontSize="10" fontWeight="700">34°F · LIVE GPS</text>
      <rect x="28" y="60" width="210" height="22" rx="3" fill="#f2f6f8" /><rect x="28" y="88" width="170" height="22" rx="3" fill="#00b4a6" />
      <rect x="28" y="122" width="190" height="8" rx="4" fill="#a9bcc8" /><rect x="28" y="136" width="150" height="8" rx="4" fill="#a9bcc8" />
      <rect x="28" y="160" width="120" height="28" rx="6" fill="#e9c864" /><rect x="156" y="160" width="100" height="28" rx="6" fill="none" stroke="rgba(255,255,255,.4)" />
      <rect x="300" y="40" width="170" height="110" rx="10" fill="rgba(8,18,26,.7)" stroke="rgba(255,255,255,.15)" /><text x="312" y="62" fill="#f2f6f8" fontSize="13" fontWeight="700">Quick quote</text>
      <rect x="312" y="74" width="70" height="18" rx="4" fill="rgba(255,255,255,.08)" /><rect x="388" y="74" width="70" height="18" rx="4" fill="rgba(255,255,255,.08)" />
      <rect x="312" y="118" width="146" height="20" rx="5" fill="#e9c864" />
    </svg>
  );
}

function ServicesFrame() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%" }}>
      {SERVICES.map((s, i) => (
        <div key={s.slug} className="card float" style={{ background: "var(--hero-2)", borderColor: "rgba(255,255,255,.08)", color: "#fff", padding: 12, boxShadow: "none", animationDelay: `${i * 0.3}s` }}>
          <span className="icon" style={{ width: 40, height: 40, background: "rgba(0,180,166,.14)", color: "#00b4a6" }}><Icon name={s.icon} /></span>
          <b style={{ display: "block", marginTop: 8, fontSize: 14 }}>{s.name}</b>
        </div>
      ))}
    </div>
  );
}

function QuoteFrame() {
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label="Quote frame: form on the left, price counting up on the right">
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <rect x="20" y="20" width="240" height="260" rx="12" fill="#f5f8f8" />
      {[50, 100, 150, 200].map((y) => (<g key={y}><rect x="36" y={y - 14} width="80" height="8" rx="4" fill="#6d7c88" /><rect x="36" y={y} width="208" height="24" rx="6" fill="#fff" stroke="#dbe3e6" /></g>))}
      <rect x="36" y="240" width="208" height="28" rx="7" fill="#e9c864" />
      <rect x="276" y="20" width="204" height="260" rx="12" fill="#12293a" />
      <text x="292" y="52" {...T}>INSTANT ESTIMATE</text>
      <text x="292" y="104" fill="#fff" fontSize="46" fontWeight="700" fontFamily="Barlow Condensed, Arial Narrow">
        <tspan>$</tspan>
        <tspan>
          <animate attributeName="opacity" values="0;1" dur=".6s" fill="freeze" />
          612
        </tspan>
      </text>
      {[132, 156, 180, 204].map((y, i) => (<g key={y}><rect x="292" y={y} width={110 - i * 12} height="8" rx="4" fill="#a9bcc8" opacity=".6" /><rect x="430" y={y} width="34" height="8" rx="4" fill="#fff" opacity=".8" /></g>))}
      <rect x="292" y="236" width="90" height="22" rx="11" fill="rgba(0,180,166,.2)" /><text x="302" y="251" fill="#00b4a6" fontSize="11" fontWeight="700">QUOTE Q-7F3K</text>
    </svg>
  );
}

const SCENES = [
  {
    name: "Arrival: the road at night",
    frame: <HeroFrame />,
    copy: "Skip LTL. Skip the redistribution center. Can't fill a 53-footer? Put it on one of our trucks.",
    motion: "The supplynow.org hero video (hero-network.mp4) plays full-bleed. If it can't load, the original night-highway canvas runs instead: light trails heading into a skyline, one teal-pinged SupplyNow truck tagged 34°F · LIVE GPS. Headline fades up, CTA buttons follow 150 ms later, the four proof dots pulse.",
    interaction: "Quick quote glass card on the right (pickup, delivery, freight, pallets) hands off to the full quote with fields pre-filled.",
    purpose: "In five seconds: who we are (asset-based 3PL), what we replace (LTL), what you can do now (price it).",
  },
  {
    name: "The LTL detour",
    frame: <RouteCompare />,
    copy: "No longer are the days of LTL for what you can't fill a 53-footer.",
    motion: "Top lane: a red pallet hops dock → LTL terminal → redistribution center → customer, pausing at each node. Bottom lane: the teal route draws itself, then a SupplyNow truck drives it in one move and arrives while the pallet is still waiting at the terminal. Loops every 7 s.",
    interaction: "Button: Compare your lane with LTL → recurring lane calculator.",
    purpose: "Make the core argument visible without a single statistic.",
  },
  {
    name: "Solutions grid",
    frame: <ServicesFrame />,
    copy: "Creative 3PL options for freight that repeats.",
    motion: "Six service cards rise in on scroll in three staggered columns; each lifts 3 px and turns its border teal on hover.",
    interaction: "Each card opens its own SEO landing page: recurring last mile, mid mile, recurring lanes, single drop, white glove, freight.",
    purpose: "Recurring last mile and mid mile first, everything else on the same trucks.",
  },
  {
    name: "Right-size the truck",
    frame: <TrailerFill pallets={8} />,
    copy: "Pay for your freight, not for empty trailer.",
    motion: "Eight gold pallets slide into a 53′ trailer one by one, leaving 18 dashed empty spots (31% full). Then the same eight slide into a 26′ box truck, labeled right-sized · goes direct.",
    interaction: "Button: Find the truck that fits → capacity and distance calculator.",
    purpose: "Show why a smaller truck going direct beats a shared big trailer.",
  },
  {
    name: "How it works",
    frame: <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, width: "100%" }}>{["Price it", "Pilot it", "Watch it", "Lock it"].map((s, i) => (<div key={s} className="float" style={{ background: "var(--hero-2)", borderRadius: 12, padding: 14, color: "#fff", animationDelay: `${i * .25}s` }}><b style={{ font: "700 30px/1 var(--display)", color: "var(--brand)" }}>0{i + 1}</b><div style={{ fontWeight: 700, marginTop: 6 }}>{s}</div></div>))}</div>,
    copy: "From quote to recurring lane: Price it, Pilot it, Watch it, Lock it.",
    motion: "Dark band. Four numbered steps reveal left to right, 100 ms apart.",
    interaction: "None; it sets up the next two scenes.",
    purpose: "Lower the risk: no contract, start with a one-week pilot.",
  },
  {
    name: "Live visibility",
    frame: <LiveTrack />,
    copy: "See the freight. See the temperature. Live.",
    motion: "A truck marker with a LIVE · 34.1°F · ON TIME tag travels a dotted route on a grid map; underneath, the temperature trace draws itself flat inside the teal set-point band.",
    interaction: "Two cards: Live freight tracking and Live temperature.",
    purpose: "Prove the two promises in the brief: live temperature tracking, live freight tracking.",
  },
  {
    name: "Our trucks, our people",
    frame: <LaneLoop />,
    copy: "The same truck and the same face, every run.",
    motion: "A truck loops Plant → DC → Plant; weekday pills light up Mon to Fri in sequence as it passes.",
    interaction: "Authority line (MC / USDOT) and hub list for credibility.",
    purpose: "Recurring lanes and the asset-based difference: our people, not a load board.",
  },
  {
    name: "Tools",
    frame: <ReachRings />,
    copy: "Do the math before you call.",
    motion: "Four tool cards rise in. On the capacity page, reach rings pulse out from Cleveland over the five hubs.",
    interaction: "Instant quote, recurring lane calculator, capacity and distance calculator, Is a 3PL right for you?",
    purpose: "Let a shipper qualify themselves before talking to anyone.",
  },
  {
    name: "Instant quote",
    frame: <QuoteFrame />,
    copy: "Price your load in about a minute.",
    motion: "Every field change re-prices instantly on the right. On submit, the server re-prices, the badge flips to Quote Q-XXXX saved, and the total settles.",
    interaction: "Lane, freight, accessorials, recurring toggle, contact. Back end: /api/quote prices it, assigns an ID and forwards the lead.",
    purpose: "Convert. Every earlier scene points here.",
  },
  {
    name: "Customer service and close",
    frame: <svg className="illo" viewBox="0 0 500 300" role="img" aria-label="Support chat and call to action"><rect width="500" height="300" rx="16" fill="#0b1b27" /><rect x="20" y="20" width="250" height="260" rx="12" fill="#f5f8f8" /><rect x="20" y="20" width="250" height="40" rx="12" fill="#12293a" /><circle cx="40" cy="40" r="5" fill="#00b4a6" className="pulse" /><text x="54" y="45" fill="#fff" fontSize="13" fontWeight="700">SupplyNow Assist</text><rect x="34" y="76" width="170" height="34" rx="10" fill="#e6f5f3" /><rect x="110" y="122" width="146" height="26" rx="10" fill="#00b4a6" /><rect x="34" y="160" width="190" height="44" rx="10" fill="#e6f5f3" /><rect x="290" y="70" width="190" height="160" rx="16" fill="#0f3a3d" /><rect x="306" y="96" width="150" height="16" rx="3" fill="#fff" /><rect x="306" y="118" width="110" height="16" rx="3" fill="#fff" /><rect x="306" y="180" width="120" height="30" rx="7" fill="#e9c864" /></svg>,
    copy: "Real people. One number. Then: Get a free quote in about a minute.",
    motion: "Assist chat pulses its live dot; FAQ items expand with a rotating plus. Closing CTA band slides up with the gold button.",
    interaction: "Track a shipment, open a ticket (claims, billing, COI, changes), call or text 440-554-2222. Mobile: sticky Call / Free quote dock.",
    purpose: "The customer service arm, and a last ask before the footer.",
  },
];

export default function Storyboard() {
  return (
    <>
      <PageHead eyebrow="Internal · not indexed" title="Website storyboard" lede="The visitor's path through the new home page, scene by scene, with the illustration, motion and copy for each. Every frame below is the live animation used on the site." />
      <section className="section">
        <div className="wrap">
          {SCENES.map((s, i) => (
            <article key={s.name} className="scene">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 style={{ fontSize: 34 }}>{s.name}</h2>
                <p className="lede" style={{ fontSize: 18 }}>&ldquo;{s.copy}&rdquo;</p>
                <dl>
                  <dt>Motion</dt><dd>{s.motion}</dd>
                  <dt>Interaction</dt><dd>{s.interaction}</dd>
                  <dt>Purpose</dt><dd>{s.purpose}</dd>
                </dl>
              </div>
              <div className="frame" data-reveal>{s.frame}</div>
            </article>
          ))}
          <p style={{ marginTop: 32 }}><Link className="btn line" href="/">See it live on the home page</Link></p>
        </div>
      </section>
    </>
  );
}
