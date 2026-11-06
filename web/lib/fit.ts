// "Is a 3PL right for you?" questionnaire. Each answer carries points toward fit and,
// optionally, services it points to. Max score is the sum of each question's best answer.

export type FitOption = { label: string; points: number; services?: string[]; flag?: string };
export type FitQuestion = { id: string; q: string; help?: string; options: FitOption[]; multi?: boolean };

export const FIT_QUESTIONS: FitQuestion[] = [
  {
    id: "frequency",
    q: "How often do you ship the same lane?",
    help: "A lane is the same pickup and delivery area, like your plant to one customer's DC.",
    options: [
      { label: "Daily", points: 20, services: ["recurring-lane-trucking", "recurring-last-mile-delivery"] },
      { label: "2–4 times a week", points: 17, services: ["recurring-lane-trucking"] },
      { label: "Weekly", points: 12, services: ["recurring-lane-trucking"] },
      { label: "A few times a month", points: 6, services: ["single-drop-delivery"] },
      { label: "Rarely or one-off", points: 2, services: ["single-drop-delivery"] },
    ],
  },
  {
    id: "size",
    q: "What does a typical shipment look like?",
    options: [
      { label: "1–3 pallets or loose cartons", points: 12, services: ["single-drop-delivery", "recurring-last-mile-delivery"], flag: "ltl-sweet-spot" },
      { label: "4–12 pallets", points: 16, services: ["single-drop-delivery", "mid-mile-logistics"], flag: "ltl-sweet-spot" },
      { label: "13–25 pallets", points: 12, services: ["mid-mile-logistics", "freight-trucking"] },
      { label: "Full 53′ trailer", points: 8, services: ["freight-trucking"] },
      { label: "It varies a lot", points: 10 },
    ],
  },
  {
    id: "temp",
    q: "Is your freight temperature-sensitive?",
    options: [
      { label: "Frozen", points: 12, services: ["freight-trucking"], flag: "temp" },
      { label: "Refrigerated", points: 12, services: ["freight-trucking"], flag: "temp" },
      { label: "Needs to stay above freezing", points: 8, flag: "temp" },
      { label: "No, dry freight", points: 5 },
    ],
  },
  {
    id: "today",
    q: "How do you ship today?",
    options: [
      { label: "LTL carriers", points: 14, flag: "ltl" },
      { label: "Our own trucks and drivers", points: 12, flag: "fleet" },
      { label: "A freight broker or load board", points: 11, flag: "broker" },
      { label: "Courier or parcel apps", points: 9 },
      { label: "A mix of all of the above", points: 13 },
    ],
  },
  {
    id: "pain",
    q: "What hurts most right now?",
    multi: true,
    help: "Pick all that apply.",
    options: [
      { label: "Damage and claims from handling", points: 4, flag: "damage" },
      { label: "Late or missed delivery windows", points: 4, flag: "late" },
      { label: "Not knowing where freight is or what temperature it's at", points: 4, flag: "visibility" },
      { label: "Hiring and keeping drivers", points: 4, flag: "drivers" },
      { label: "Cost keeps changing week to week", points: 4, flag: "cost" },
      { label: "Nothing major, just exploring", points: 0 },
    ],
  },
  {
    id: "receivers",
    q: "What do your receivers need at delivery?",
    multi: true,
    help: "Pick all that apply.",
    options: [
      { label: "Appointment windows", points: 3, services: ["recurring-last-mile-delivery"] },
      { label: "Liftgate or pallet jack", points: 3, services: ["single-drop-delivery"] },
      { label: "Inside delivery or placement", points: 3, services: ["white-glove-delivery"] },
      { label: "Unpacking or debris removal", points: 3, services: ["white-glove-delivery"] },
      { label: "Just a dock", points: 1 },
    ],
  },
  {
    id: "team",
    q: "Who manages transportation at your company?",
    options: [
      { label: "Nobody full-time, it falls on whoever's free", points: 12 },
      { label: "One person, part of their job", points: 10 },
      { label: "A dedicated logistics team", points: 6 },
    ],
  },
  {
    id: "growth",
    q: "What's next for your shipping volume?",
    options: [
      { label: "Opening new markets or customers", points: 10, services: ["mid-mile-logistics"] },
      { label: "Growing in the same markets", points: 8 },
      { label: "Holding steady", points: 5 },
      { label: "Shrinking", points: 2 },
    ],
  },
];

export type FitAnswers = Record<string, number[]>;

export type FitResult = {
  score: number; // 0–100
  tier: "strong" | "good" | "pilot" | "notyet";
  headline: string;
  summary: string;
  services: string[];
  reasons: string[];
};

const MAX = FIT_QUESTIONS.reduce((s, q) => {
  if (q.multi) return s + Math.min(12, q.options.reduce((t, o) => t + o.points, 0));
  return s + Math.max(...q.options.map((o) => o.points));
}, 0);

export function scoreFit(answers: FitAnswers): FitResult {
  let raw = 0;
  const serviceVotes = new Map<string, number>();
  const flags = new Set<string>();
  for (const q of FIT_QUESTIONS) {
    const picked = (answers[q.id] ?? []).map((i) => q.options[i]).filter(Boolean);
    let pts = picked.reduce((s, o) => s + o.points, 0);
    if (q.multi) pts = Math.min(12, pts);
    raw += pts;
    for (const o of picked) {
      o.services?.forEach((s) => serviceVotes.set(s, (serviceVotes.get(s) ?? 0) + 1));
      if (o.flag) flags.add(o.flag);
    }
  }
  const score = Math.round((raw / MAX) * 100);
  const services = [...serviceVotes.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 3);

  const reasons: string[] = [];
  if (flags.has("ltl") && flags.has("ltl-sweet-spot"))
    reasons.push("You're paying LTL for loads a right-sized box truck can take direct, skipping terminal and redistribution-center handling.");
  if (flags.has("temp")) reasons.push("Temperature-sensitive freight benefits from fewer handoffs and a live temperature log for the whole trip.");
  if (flags.has("fleet")) reasons.push("Running your own trucks ties up capital and drivers; recurring lanes give you the same control without the fleet.");
  if (flags.has("broker")) reasons.push("Brokered loads change carriers week to week. Our trucks and our people run your lane every time.");
  if (flags.has("damage")) reasons.push("Damage usually happens at transfers. One truck from your dock to theirs removes the transfers.");
  if (flags.has("late")) reasons.push("Recurring routes run on fixed appointment windows with a live tracking link.");
  if (flags.has("visibility")) reasons.push("Every load gets live GPS and temperature tracking, plus a digital POD.");
  if (flags.has("drivers")) reasons.push("Our drivers are our employees and our problem, not yours.");
  if (flags.has("cost")) reasons.push("A locked recurring lane rate replaces week-to-week spot pricing.");

  let tier: FitResult["tier"], headline: string, summary: string;
  if (score >= 75) {
    tier = "strong";
    headline = "A 3PL is a strong fit for you";
    summary = "You ship often enough, in the right sizes, that a dedicated or recurring setup should beat what you do today on handling, visibility and predictability.";
  } else if (score >= 58) {
    tier = "good";
    headline = "A 3PL looks like a good fit";
    summary = "Start with your busiest lane. Run a one-week pilot, compare it with what you pay now, and lock the rate if it holds up.";
  } else if (score >= 40) {
    tier = "pilot";
    headline = "Worth testing on one lane";
    summary = "Your volume is mixed. On-demand single drops for hot orders, plus one recurring lane, is usually the right first step.";
  } else {
    tier = "notyet";
    headline = "You may not need a 3PL yet";
    summary = "With occasional shipments, an instant quote when you need a truck is likely enough. Come back when a lane starts repeating.";
  }
  if (!services.length) services.push("single-drop-delivery");
  return { score, tier, headline, summary, services, reasons: reasons.slice(0, 4) };
}
