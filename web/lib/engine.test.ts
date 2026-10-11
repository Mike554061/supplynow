import { test } from "node:test";
import assert from "node:assert/strict";
import { quote, pickEquipment, projectLane, planCapacity } from "./pricing.ts";
import { scoreFit, FIT_QUESTIONS } from "./fit.ts";
import { PLACES, roadMiles } from "./places.ts";

test("smallest truck that fits is picked", () => {
  assert.equal(pickEquipment(2, 1500, "dry")?.id, "sprinter");
  assert.equal(pickEquipment(10, 6000, "refrigerated")?.id, "reefer26");
  assert.equal(pickEquipment(20, 30000, "frozen")?.id, "reefer53");
  assert.equal(pickEquipment(40, 30000, "dry"), null);
});

test("quote applies minimum, accessorials and recurring discount", () => {
  const short = quote({ miles: 10, pallets: 1, lbs: 500, temp: "dry" });
  assert.equal(short.total, 225);
  const q = quote({ miles: 300, pallets: 10, lbs: 6000, temp: "dry", accessorials: ["liftgate"] });
  assert.equal(q.total, Math.round(300 * 2.85 + 75));
  const r = quote({ miles: 300, pallets: 10, lbs: 6000, temp: "dry", accessorials: ["liftgate"], runsPerWeek: 5 });
  assert.ok(r.total < q.total);
});

test("oversize loads split across trucks", () => {
  const q = quote({ miles: 200, pallets: 40, lbs: 40000, temp: "dry" });
  assert.equal(q.trucks, 2);
  assert.equal(q.equipment.id, "van53");
});

test("lane projection and capacity plan are consistent", () => {
  const p = projectLane({ miles: 170, pallets: 8, lbs: 6000, temp: "refrigerated", runsPerWeek: 3, weeksPerYear: 50, stops: 1, accessorials: [], growthPct: 10 });
  assert.equal(p.runsYear1, 150);
  assert.ok(p.years[2].runs > p.years[0].runs);
  const c = planCapacity({ miles: 170, pallets: 8, lbs: 6000, temp: "refrigerated", stops: 1 });
  assert.ok(c.sameDay);
  assert.ok(c.roundTripInShift);
  assert.equal(c.options.filter((o) => o.recommended).length, 1);
  const far = planCapacity({ miles: 900, pallets: 8, lbs: 6000, temp: "dry", stops: 1 });
  assert.equal(far.sameDay, false);
  assert.equal(far.transitDays, 2);
});

test("fit score spans tiers", () => {
  const best: Record<string, number[]> = {};
  const worst: Record<string, number[]> = {};
  for (const q of FIT_QUESTIONS) {
    const idx = q.options.map((o, i) => [o.points, i]).sort((a, b) => b[0] - a[0]);
    best[q.id] = q.multi ? q.options.map((_, i) => i) : [idx[0][1]];
    worst[q.id] = [idx[idx.length - 1][1]];
  }
  assert.equal(scoreFit(best).tier, "strong");
  assert.equal(scoreFit(worst).tier, "notyet");
});

test("Cleveland to Detroit road miles are in a sane range", () => {
  const m = roadMiles(PLACES[0], PLACES.find((p) => p.id === "det")!);
  assert.ok(m > 120 && m < 200, String(m));
});
