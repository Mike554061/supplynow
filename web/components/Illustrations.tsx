// Animated SVG illustrations used on the home page, service pages and the storyboard.
// Movement uses SMIL animateMotion (works everywhere without JS); line-drawing and pulses use CSS
// and start when the wrapping [data-reveal] element scrolls into view.

const T = { fill: "#a9bcc8", fontSize: 12, fontWeight: 600 } as const;
const Tw = { fill: "#f2f6f8", fontSize: 13, fontWeight: 700 } as const;

function Truck({ color = "#00b4a6" }: { color?: string }) {
  return (
    <g transform="translate(-18,-12)">
      <rect x="0" y="0" width="24" height="16" rx="2" fill={color} />
      <path d="M24 5h6l5 5v6H24z" fill="#e9eef1" />
      <circle cx="7" cy="18" r="3" fill="#0b1b27" stroke="#e9eef1" strokeWidth="1.5" />
      <circle cx="29" cy="18" r="3" fill="#0b1b27" stroke="#e9eef1" strokeWidth="1.5" />
    </g>
  );
}

export function RouteCompare({ title = "LTL route versus a SupplyNow direct truck" }: { title?: string }) {
  const ltl = "M60 70 L170 70 L170 150 L300 150 L300 70 L440 70";
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label={title}>
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <text x="24" y="30" {...Tw}>LTL</text>
      <text x="62" y="30" {...T}>terminal → cross-dock → redistribution center</text>
      <path d={ltl} className="ltl-path" fill="none" strokeWidth="2.5" />
      {[[60, 70, "Your dock"], [170, 150, "LTL terminal"], [300, 150, "Redistribution ctr"], [440, 70, "Customer"]].map(([x, y, l], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="11" className={`node${i === 1 || i === 2 ? " hot" : ""}`} strokeWidth="2" />
          <text x={x as number} y={(y as number) + (i === 1 || i === 2 ? 30 : -18)} textAnchor="middle" {...T}>{l}</text>
        </g>
      ))}
      <g>
        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#e46b56" />
        <animateMotion dur="7s" repeatCount="indefinite" path={ltl} keyPoints="0;0.35;0.35;0.59;0.59;1;1" keyTimes="0;0.18;0.32;0.46;0.62;0.85;1" calcMode="linear" />
      </g>
      <line x1="24" x2="476" y1="196" y2="196" stroke="rgba(255,255,255,.08)" />
      <text x="24" y="222" {...Tw}>SupplyNow</text>
      <text x="104" y="222" {...T}>our truck, our driver, dock to dock</text>
      <path d="M60 255 L440 255" className="road" strokeWidth="2" fill="none" />
      <path d="M60 255 L440 255" className="direct-path" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="255" r="9" className="node" strokeWidth="2" />
      <circle cx="440" cy="255" r="9" className="node" strokeWidth="2" />
      <circle cx="440" cy="255" r="9" fill="none" stroke="#00b4a6" strokeWidth="2" className="pulse" />
      <g>
        <Truck />
        <animateMotion dur="7s" repeatCount="indefinite" path="M60 250 L440 250" keyPoints="0;1;1" keyTimes="0;0.42;1" calcMode="linear" />
      </g>
      <text x="476" y="290" textAnchor="end" {...T}>Illustrative. Handling points vary by LTL carrier.</text>
    </svg>
  );
}

export function TrailerFill({ pallets = 8 }: { pallets?: number }) {
  const slots53 = Array.from({ length: 26 }, (_, i) => i);
  const slots26 = Array.from({ length: 12 }, (_, i) => i);
  const pct = Math.round((pallets / 26) * 100);
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label={`${pallets} pallets fill ${pct}% of a 53-foot trailer but a 26-foot box truck carries them direct`}>
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <text x="24" y="34" {...Tw}>53′ trailer</text>
      <text x="476" y="34" textAnchor="end" {...T}>{pallets} of 26 pallet spots · {pct}% full</text>
      <rect x="24" y="46" width="452" height="74" rx="6" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" />
      {slots53.map((i) => {
        const col = Math.floor(i / 2), row = i % 2;
        const filled = i < pallets;
        return (
          <rect key={i} x={30 + col * 34.4} y={52 + row * 33} width="30" height="29" rx="3"
            className={filled ? "pallet" : undefined}
            style={filled ? { animationDelay: `${0.15 * i}s` } : undefined}
            fill={filled ? undefined : "rgba(255,255,255,.04)"} stroke={filled ? "none" : "rgba(255,255,255,.12)"} strokeDasharray={filled ? undefined : "3 3"} />
        );
      })}
      <text x="24" y="146" {...T}>LTL fills the empty space with other shippers' freight, then sorts it at terminals.</text>
      <text x="24" y="196" {...Tw}>26′ SupplyNow box truck</text>
      <text x="476" y="196" textAnchor="end" fill="#00b4a6" fontSize="13" fontWeight="700">right-sized · goes direct</text>
      <rect x="24" y="208" width="214" height="74" rx="6" fill="none" stroke="#00b4a6" strokeWidth="2" />
      <path d="M238 222h30l18 18v42h-48z" fill="none" stroke="#00b4a6" strokeWidth="2" />
      {slots26.map((i) => {
        const col = Math.floor(i / 2), row = i % 2;
        const filled = i < Math.min(pallets, 12);
        return <rect key={i} x={30 + col * 34.4} y={214 + row * 33} width="30" height="29" rx="3" className={filled ? "pallet" : undefined}
          style={filled ? { animationDelay: `${1.6 + 0.12 * i}s` } : undefined}
          fill={filled ? undefined : "rgba(255,255,255,.04)"} stroke={filled ? "none" : "rgba(255,255,255,.12)"} strokeDasharray={filled ? undefined : "3 3"} />;
      })}
      <text x="306" y="240" {...T}>Same pallets.</text>
      <text x="306" y="258" {...T}>No terminal. No sort.</text>
      <text x="306" y="276" {...T}>Nobody else's freight.</text>
    </svg>
  );
}

export function LiveTrack() {
  const route = "M30 150 C 120 50, 210 200, 300 100 S 440 50, 470 110";
  const temps = "M30 268 L70 266 L110 267 L150 265 L190 268 L230 266 L270 267 L310 264 L350 266 L390 265 L430 267 L470 266";
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label="Live GPS position and temperature log for a load in transit">
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <g stroke="rgba(255,255,255,.05)">
        {Array.from({ length: 12 }, (_, i) => <line key={`v${i}`} x1={i * 44} x2={i * 44} y1="0" y2="200" />)}
        {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" x2="500" y1={i * 44} y2={i * 44} />)}
      </g>
      <path d={route} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="6" strokeLinecap="round" />
      <path d={route} fill="none" stroke="#00b4a6" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
      <circle cx="30" cy="150" r="6" fill="#e9c864" />
      <circle cx="470" cy="110" r="6" fill="#e9c864" />
      <g>
        <circle r="14" fill="none" stroke="#00b4a6" strokeWidth="2" className="pulse" />
        <circle r="6" fill="#00b4a6" />
        <rect x="12" y="-30" width="118" height="22" rx="11" fill="rgba(6,13,19,.9)" stroke="#00b4a6" />
        <text x="22" y="-15" fill="#bff3ee" fontSize="11" fontWeight="700">LIVE · 34.1°F · ON TIME</text>
        <animateMotion dur="12s" repeatCount="indefinite" path={route} />
      </g>
      <rect x="0" y="200" width="500" height="100" fill="#0e2230" />
      <text x="24" y="224" {...Tw}>Reefer temperature</text>
      <text x="476" y="224" textAnchor="end" {...T}>set point 34°F · logged every minute</text>
      <rect x="30" y="250" width="440" height="30" fill="rgba(0,180,166,.08)" />
      <path d={temps} className="templine" />
    </svg>
  );
}

export function LaneLoop() {
  const loop = "M120 150 C 120 70, 380 70, 380 150 C 380 230, 120 230, 120 150 Z";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label="A recurring lane running between a plant and a distribution center every weekday">
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <path d={loop} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="10" />
      <path d={loop} fill="none" stroke="#00b4a6" strokeWidth="2" strokeDasharray="4 10" />
      <g><rect x="80" y="126" width="80" height="48" rx="6" className="node" strokeWidth="2" /><text x="120" y="155" textAnchor="middle" {...Tw}>Plant</text></g>
      <g><rect x="340" y="126" width="80" height="48" rx="6" className="node" strokeWidth="2" /><text x="380" y="155" textAnchor="middle" {...Tw}>DC</text></g>
      <g><Truck /><animateMotion dur="6s" repeatCount="indefinite" path={loop} rotate="auto" /></g>
      {days.map((d, i) => (
        <g key={d} transform={`translate(${110 + i * 64},258)`}>
          <rect x="-24" y="-16" width="48" height="26" rx="13" fill="rgba(0,180,166,.15)" stroke="#00b4a6">
            <animate attributeName="fill" values="rgba(0,180,166,.15);rgba(0,180,166,.7);rgba(0,180,166,.15)" dur="6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          </rect>
          <text x="0" y="2" textAnchor="middle" {...Tw}>{d}</text>
        </g>
      ))}
      <text x="250" y="40" textAnchor="middle" {...Tw}>Same truck. Same driver. Same window.</text>
    </svg>
  );
}

export function ReachRings({ oneShift = 525, roundTrip = 262 }: { oneShift?: number; roundTrip?: number }) {
  // Hubs as approximate miles east and north of Cleveland, drawn at 1px ≈ 3.2 mi.
  const s = 1 / 3.2;
  const hubs: [string, number, number][] = [["Detroit", -90, 58], ["Chicago", -310, 26], ["Columbus", -36, -106], ["Pittsburgh", 96, -73], ["Wilkes-Barre", 305, -17]];
  return (
    <svg className="illo" viewBox="0 0 500 300" role="img" aria-label={`From Cleveland, one shift reaches about ${oneShift} miles one way and ${roundTrip} miles out and back`}>
      <rect width="500" height="300" rx="16" fill="#0b1b27" />
      <g transform="translate(300,140)">
        <circle r={Math.min(240, oneShift * s)} fill="rgba(0,180,166,.06)" stroke="rgba(0,180,166,.5)" strokeDasharray="5 6" />
        <circle r={Math.min(240, roundTrip * s)} fill="rgba(233,200,100,.07)" stroke="rgba(233,200,100,.6)" strokeDasharray="5 6" />
        {hubs.map(([n, x, y]) => (
          <g key={n} transform={`translate(${x * s},${-y * s})`}>
            <circle r="5" fill="#a9bcc8" /><text x="8" y="4" {...T}>{n}</text>
          </g>
        ))}
        <circle r="7" fill="#00b4a6" /><circle r="7" fill="none" stroke="#00b4a6" strokeWidth="2" className="pulse" />
        <text x="10" y="-10" {...Tw}>Cleveland</text>
      </g>
      <text x="20" y="276" fill="#00b4a6" fontSize="12" fontWeight="700">— one-way in one shift</text>
      <text x="20" y="292" fill="#e9c864" fontSize="12" fontWeight="700">— out and back in one shift</text>
    </svg>
  );
}
