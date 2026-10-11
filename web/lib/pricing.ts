// SupplyNow pricing and planning engine.
// Every rate below is a starting assumption for ballpark quotes. Edit the numbers here and every
// calculator, the instant quote and the /api/quote back end pick them up.

export type Temp = "dry" | "refrigerated" | "frozen";
export type EquipmentId = "sprinter" | "box16" | "box26" | "reefer26" | "van53" | "reefer53";

export type Equipment = {
  id: EquipmentId;
  name: string;
  pallets: number;
  maxLbs: number;
  temps: Temp[];
  perMile: number;
  minimum: number;
  /** Local dedicated day rate (8–10 hours), when the truck class offers one. */
  dayRate?: number;
  halfDayRate?: number;
};

export const EQUIPMENT: Equipment[] = [
  { id: "sprinter", name: "Sprinter / cargo van", pallets: 3, maxLbs: 3500, temps: ["dry"], perMile: 1.95, minimum: 225, dayRate: 950, halfDayRate: 525 },
  { id: "box16", name: "16′ box truck", pallets: 8, maxLbs: 5000, temps: ["dry"], perMile: 2.4, minimum: 325, dayRate: 1150, halfDayRate: 625 },
  { id: "box26", name: "26′ box truck with liftgate", pallets: 12, maxLbs: 10000, temps: ["dry"], perMile: 2.85, minimum: 450, dayRate: 1250, halfDayRate: 650 },
  { id: "reefer26", name: "26′ refrigerated box truck", pallets: 12, maxLbs: 9000, temps: ["dry", "refrigerated", "frozen"], perMile: 3.25, minimum: 550, dayRate: 1350, halfDayRate: 699 },
  { id: "van53", name: "53′ dry van", pallets: 26, maxLbs: 44000, temps: ["dry"], perMile: 2.45, minimum: 650 },
  { id: "reefer53", name: "53′ reefer trailer", pallets: 26, maxLbs: 42000, temps: ["dry", "refrigerated", "frozen"], perMile: 2.85, minimum: 800 },
];

export const ACCESSORIALS = {
  liftgate: { label: "Liftgate", price: 75 },
  inside: { label: "Inside delivery", price: 95 },
  whiteGlove: { label: "White glove (per stop)", price: 175 },
  appointment: { label: "Appointment window", price: 0 },
  extraStop: { label: "Extra stop", price: 60 },
} as const;

export type AccessorialId = keyof typeof ACCESSORIALS;

export const FROZEN_UPLIFT = 0.08; // over refrigerated
export const EXPEDITE_UPLIFT = 0.2;

/** Discount by runs per week on a recurring lane. */
export function frequencyDiscount(runsPerWeek: number): number {
  if (runsPerWeek >= 6) return 0.14;
  if (runsPerWeek >= 4) return 0.1;
  if (runsPerWeek >= 2) return 0.05;
  return 0;
}

// Planning assumptions (used for transit time and hours-of-service checks).
export const AVG_MPH = 50;
export const DRIVE_HOURS_PER_DAY = 11; // FMCSA property-carrying driving limit
export const DUTY_WINDOW_HOURS = 14;
export const LOAD_UNLOAD_HOURS = 1.5;
export const STOP_HOURS = 0.5;

// LTL benchmark, for comparison only. Illustrative industry-style pricing, not a carrier tariff.
export const LTL = {
  perPalletBase: 70,
  perPalletMile: 0.22,
  volumeBreakPallets: 6,
  volumeBreakDiscount: 0.15,
  reeferUplift: 0.35,
  accessorialAverage: 85,
  terminalDwellDays: 1,
  milesPerDay: 350,
  typicalTouches: 4,
};

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Smallest truck that fits the pallets, weight and temperature. Null if nothing single-truck fits. */
export function pickEquipment(pallets: number, lbs: number, temp: Temp): Equipment | null {
  return EQUIPMENT.filter((e) => e.temps.includes(temp) && e.pallets >= pallets && e.maxLbs >= lbs).sort(
    (a, b) => a.pallets - b.pallets || a.perMile - b.perMile,
  )[0] ?? null;
}

export type QuoteInput = {
  miles: number;
  pallets: number;
  lbs: number;
  temp: Temp;
  stops?: number; // delivery stops, default 1
  accessorials?: AccessorialId[];
  expedited?: boolean;
  runsPerWeek?: number; // >0 means a recurring lane
  equipment?: EquipmentId; // force a truck class
};

export type QuoteLine = { label: string; amount: number };
export type Quote = {
  equipment: Equipment;
  trucks: number;
  lines: QuoteLine[];
  total: number;
  perPallet: number;
  perMile: number;
  transitHours: number;
  transitDays: number;
  notes: string[];
};

export function clampNum(n: unknown, min: number, max: number, fallback: number): number {
  const v = typeof n === "number" ? n : parseFloat(String(n));
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

export function driveHours(miles: number, stops = 1): number {
  return miles / AVG_MPH + LOAD_UNLOAD_HOURS + Math.max(0, stops - 1) * STOP_HOURS;
}

export function transitDays(miles: number, stops = 1): number {
  const drive = miles / AVG_MPH + Math.max(0, stops - 1) * STOP_HOURS;
  return Math.max(1, Math.ceil(drive / DRIVE_HOURS_PER_DAY));
}

export function quote(input: QuoteInput): Quote {
  const miles = clampNum(input.miles, 1, 3500, 100);
  const pallets = Math.round(clampNum(input.pallets, 1, 260, 1));
  const lbs = clampNum(input.lbs, 1, 450000, 1000);
  const stops = Math.round(clampNum(input.stops ?? 1, 1, 30, 1));
  const notes: string[] = [];

  let eq = input.equipment ? EQUIPMENT.find((e) => e.id === input.equipment) ?? null : null;
  if (eq && !eq.temps.includes(input.temp)) eq = null;
  let trucks = 1;
  if (!eq) eq = pickEquipment(pallets, lbs, input.temp);
  if (!eq) {
    // Split across the biggest temperature-capable trailer.
    eq = EQUIPMENT.filter((e) => e.temps.includes(input.temp)).sort((a, b) => b.pallets - a.pallets)[0];
    trucks = Math.max(Math.ceil(pallets / eq.pallets), Math.ceil(lbs / eq.maxLbs));
    notes.push(`Load splits across ${trucks} ${eq.name}s.`);
  } else if (eq.pallets < pallets || eq.maxLbs < lbs) {
    trucks = Math.max(Math.ceil(pallets / eq.pallets), Math.ceil(lbs / eq.maxLbs));
    notes.push(`Load splits across ${trucks} ${eq.name}s.`);
  }

  const lines: QuoteLine[] = [];
  const linehaulOne = Math.max(eq.minimum, miles * eq.perMile);
  lines.push({ label: `Linehaul, ${eq.name}${trucks > 1 ? ` × ${trucks}` : ""} (${Math.round(miles)} mi, fuel included)`, amount: linehaulOne * trucks });

  if (input.temp === "frozen") lines.push({ label: "Frozen set point", amount: linehaulOne * trucks * FROZEN_UPLIFT });
  if (stops > 1) lines.push({ label: `${stops - 1} extra stop${stops > 2 ? "s" : ""}`, amount: (stops - 1) * ACCESSORIALS.extraStop.price * trucks });

  for (const id of input.accessorials ?? []) {
    const a = ACCESSORIALS[id];
    if (!a || id === "extraStop") continue;
    const perStop = id === "whiteGlove" || id === "inside";
    const amount = a.price * (perStop ? stops : 1) * trucks;
    if (amount > 0) lines.push({ label: a.label + (perStop && stops > 1 ? ` × ${stops} stops` : ""), amount });
  }

  if (input.expedited) {
    const sub = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({ label: "Expedited / same-day priority", amount: sub * EXPEDITE_UPLIFT });
  }

  const runs = clampNum(input.runsPerWeek ?? 0, 0, 21, 0);
  const disc = frequencyDiscount(runs);
  if (disc > 0) {
    const sub = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({ label: `Recurring lane discount (${runs}× per week)`, amount: -sub * disc });
  }

  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0));
  const hours = driveHours(miles, stops);
  if (miles / AVG_MPH > DRIVE_HOURS_PER_DAY) notes.push("Over 11 driving hours: planned as a multi-day or team run.");
  if (pallets <= 12 && input.temp !== "dry" && eq.id === "reefer26") notes.push("A 26′ reefer box fits this load; no need to pay for a 53′ reefer.");

  return {
    equipment: eq,
    trucks,
    lines: lines.map((l) => ({ ...l, amount: Math.round(l.amount) })),
    total,
    perPallet: Math.round(total / pallets),
    perMile: Math.round((total / miles) * 100) / 100,
    transitHours: Math.round(hours * 10) / 10,
    transitDays: transitDays(miles, stops),
    notes,
  };
}

export function ltlEstimate(miles: number, pallets: number, temp: Temp): { cost: number; days: number; touches: number } {
  let per = LTL.perPalletBase + LTL.perPalletMile * miles;
  if (pallets > LTL.volumeBreakPallets) per *= 1 - LTL.volumeBreakDiscount;
  let cost = per * pallets + LTL.accessorialAverage;
  if (temp !== "dry") cost *= 1 + LTL.reeferUplift;
  const days = 1 + LTL.terminalDwellDays + Math.ceil(miles / LTL.milesPerDay);
  return { cost: Math.round(cost), days, touches: LTL.typicalTouches };
}

export type LaneInput = {
  miles: number;
  pallets: number;
  lbs: number;
  temp: Temp;
  runsPerWeek: number;
  weeksPerYear: number;
  stops: number;
  accessorials: AccessorialId[];
  /** Annual growth in runs, percent. */
  growthPct: number;
};

export type LaneProjection = {
  perRun: Quote;
  runsYear1: number;
  year1: number;
  threeYear: number;
  ltlPerRun: number;
  ltlYear1: number;
  savingsYear1: number;
  monthly: number;
  daysSavedPerRun: number;
  touchesAvoidedYear1: number;
  years: { year: number; runs: number; supplynow: number; ltl: number }[];
};

export function projectLane(i: LaneInput): LaneProjection {
  const runs = clampNum(i.runsPerWeek, 0.25, 21, 1);
  const weeks = clampNum(i.weeksPerYear, 1, 52, 50);
  const growth = clampNum(i.growthPct, -50, 200, 0) / 100;
  const perRun = quote({ miles: i.miles, pallets: i.pallets, lbs: i.lbs, temp: i.temp, stops: i.stops, accessorials: i.accessorials, runsPerWeek: runs });
  const ltl = ltlEstimate(i.miles, i.pallets, i.temp);
  const ltlStops = ltl.cost * Math.max(1, i.stops) ** 0.85; // LTL bills each consignee separately
  const years = [1, 2, 3].map((year) => {
    const r = runs * weeks * (1 + growth) ** (year - 1);
    const q = year === 1 ? perRun : quote({ miles: i.miles, pallets: i.pallets, lbs: i.lbs, temp: i.temp, stops: i.stops, accessorials: i.accessorials, runsPerWeek: runs * (1 + growth) ** (year - 1) });
    return { year, runs: Math.round(r), supplynow: Math.round(q.total * r), ltl: Math.round(ltlStops * r) };
  });
  const directDays = perRun.transitDays;
  return {
    perRun,
    runsYear1: years[0].runs,
    year1: years[0].supplynow,
    threeYear: years.reduce((s, y) => s + y.supplynow, 0),
    ltlPerRun: Math.round(ltlStops),
    ltlYear1: years[0].ltl,
    savingsYear1: years[0].ltl - years[0].supplynow,
    monthly: Math.round(years[0].supplynow / 12),
    daysSavedPerRun: Math.max(0, ltl.days - directDays),
    touchesAvoidedYear1: Math.round((ltl.touches - 1) * years[0].runs),
    years,
  };
}

export type CapacityInput = {
  miles: number;
  pallets: number;
  lbs: number;
  temp: Temp;
  stops: number;
};

export type CapacityPlan = {
  options: {
    equipment: Equipment;
    trucks: number;
    palletFill: number;
    weightFill: number;
    cost: number;
    recommended: boolean;
  }[];
  driveHours: number;
  dutyHours: number;
  transitDays: number;
  sameDay: boolean;
  roundTripInShift: boolean;
  oneShiftReachMiles: number;
  roundTripReachMiles: number;
  trailer53Fill: number;
};

export function planCapacity(i: CapacityInput): CapacityPlan {
  const miles = clampNum(i.miles, 1, 3500, 100);
  const pallets = Math.round(clampNum(i.pallets, 1, 260, 1));
  const lbs = clampNum(i.lbs, 1, 450000, 1000);
  const stops = Math.round(clampNum(i.stops, 1, 30, 1));
  const best = pickEquipment(pallets, lbs, i.temp);
  const options = EQUIPMENT.filter((e) => e.temps.includes(i.temp)).map((e) => {
    const trucks = Math.max(Math.ceil(pallets / e.pallets), Math.ceil(lbs / e.maxLbs));
    const q = quote({ miles, pallets, lbs, temp: i.temp, stops, equipment: e.id });
    return {
      equipment: e,
      trucks,
      palletFill: Math.min(1, pallets / (e.pallets * trucks)),
      weightFill: Math.min(1, lbs / (e.maxLbs * trucks)),
      cost: q.total,
      recommended: best ? best.id === e.id : false,
    };
  });
  if (!best && options.length) {
    const cheapest = options.reduce((a, b) => (b.cost < a.cost ? b : a));
    cheapest.recommended = true;
  }
  const extraStopHours = Math.max(0, stops - 1) * STOP_HOURS;
  const drive = miles / AVG_MPH;
  const duty = drive + LOAD_UNLOAD_HOURS + extraStopHours;
  const shiftDrive = Math.min(DRIVE_HOURS_PER_DAY, DUTY_WINDOW_HOURS - LOAD_UNLOAD_HOURS - extraStopHours);
  return {
    options,
    driveHours: Math.round(drive * 10) / 10,
    dutyHours: Math.round(duty * 10) / 10,
    transitDays: transitDays(miles, stops),
    sameDay: drive <= DRIVE_HOURS_PER_DAY && duty <= DUTY_WINDOW_HOURS,
    roundTripInShift: drive * 2 <= DRIVE_HOURS_PER_DAY && drive * 2 + LOAD_UNLOAD_HOURS + extraStopHours <= DUTY_WINDOW_HOURS,
    oneShiftReachMiles: Math.round(Math.max(0, shiftDrive) * AVG_MPH),
    roundTripReachMiles: Math.round((Math.max(0, shiftDrive) * AVG_MPH) / 2),
    trailer53Fill: Math.min(1, pallets / 26),
  };
}
