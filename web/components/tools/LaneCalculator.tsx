"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { projectLane, money, type Temp, type AccessorialId } from "@/lib/pricing";
import { LanePicker, laneMiles, type LaneValue } from "./LanePicker";
import { TempChips } from "./TempChips";

export function LaneCalculator() {
  const [lane, setLane] = useState<LaneValue>({ from: "cle", to: "cmh", manual: false, miles: 150 });
  const [temp, setTemp] = useState<Temp>("refrigerated");
  const [pallets, setPallets] = useState(8);
  const [lbs, setLbs] = useState(7000);
  const [runs, setRuns] = useState(3);
  const [weeks, setWeeks] = useState(50);
  const [stops, setStops] = useState(1);
  const [growth, setGrowth] = useState(10);
  const [liftgate, setLiftgate] = useState(true);

  const miles = laneMiles(lane);
  const acc: AccessorialId[] = liftgate ? ["liftgate"] : [];
  const p = useMemo(
    () => projectLane({ miles, pallets, lbs, temp, runsPerWeek: runs, weeksPerYear: weeks, stops, accessorials: acc, growthPct: growth }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [miles, pallets, lbs, temp, runs, weeks, stops, liftgate, growth],
  );
  const maxYear = Math.max(...p.years.map((y) => Math.max(y.supplynow, y.ltl)), 1);
  const quoteHref = `/quote?from=${lane.from}&to=${lane.to}&temp=${temp}&pallets=${pallets}&runs=${runs}&service=recurring-lane-trucking`;

  return (
    <div className="calc">
      <div className="card form">
        <h2 style={{ fontSize: 30 }}>Your lane</h2>
        <LanePicker value={lane} onChange={setLane} idPrefix="l" />
        <TempChips value={temp} onChange={setTemp} name="l-temp" />
        <div className="row three">
          <div className="field"><label htmlFor="l-pallets">Pallets per run</label><input id="l-pallets" type="number" min={1} max={52} value={pallets} onChange={(e) => setPallets(Math.max(1, Number(e.target.value)))} /></div>
          <div className="field"><label htmlFor="l-lbs">Weight per run (lbs)</label><input id="l-lbs" type="number" min={1} max={90000} value={lbs} onChange={(e) => setLbs(Math.max(1, Number(e.target.value)))} /></div>
          <div className="field"><label htmlFor="l-stops">Stops per run</label><input id="l-stops" type="number" min={1} max={30} value={stops} onChange={(e) => setStops(Math.max(1, Number(e.target.value)))} /></div>
        </div>
        <div className="field">
          <label htmlFor="l-runs">Runs per week: <b>{runs}</b></label>
          <input id="l-runs" className="range" type="range" min={1} max={14} value={runs} onChange={(e) => setRuns(Number(e.target.value))} />
          <span className="hint">Discount tiers start at 2, 4 and 6 runs a week.</span>
        </div>
        <div className="field">
          <label htmlFor="l-weeks">Weeks per year: <b>{weeks}</b></label>
          <input id="l-weeks" className="range" type="range" min={4} max={52} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="l-growth">Expected yearly growth in runs: <b>{growth}%</b></label>
          <input id="l-growth" className="range" type="range" min={-20} max={100} step={5} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} />
        </div>
        <label className="chip" style={{ justifySelf: "start" }}><input type="checkbox" checked={liftgate} onChange={(e) => setLiftgate(e.target.checked)} />Liftgate at delivery</label>
      </div>

      <aside className="out" aria-live="polite">
        <div className="result">
          <p className="label">Projected year-one lane spend</p>
          <p className="big">{money(p.year1)}</p>
          <p className="muted">{p.runsYear1} runs · {money(p.perRun.total)} per run · {money(p.monthly)} a month on a {p.perRun.equipment.name}</p>
          <div className="kv">
            <div><b>{money(p.threeYear)}</b><span>three-year projection</span></div>
            <div><b>{p.savingsYear1 >= 0 ? money(p.savingsYear1) : "About even"}</b><span>{p.savingsYear1 >= 0 ? "year-one vs. LTL benchmark" : "cost vs. LTL; you gain speed and fewer touches"}</span></div>
            <div><b>{p.daysSavedPerRun > 0 ? `${p.daysSavedPerRun} day${p.daysSavedPerRun > 1 ? "s" : ""}` : "Same day"}</b><span>{p.daysSavedPerRun > 0 ? "faster per run than LTL" : "direct transit"}</span></div>
            <div><b>{p.touchesAvoidedYear1.toLocaleString()}</b><span>terminal handoffs avoided a year</span></div>
          </div>
          <div className="bars" aria-label="Yearly cost, SupplyNow versus LTL benchmark">
            {p.years.map((y) => (
              <div key={y.year} style={{ display: "grid", gap: 6 }}>
                <div className="barrow"><span>Year {y.year}</span><div className="track"><div className="fill" style={{ width: `${(y.supplynow / maxYear) * 100}%` }} /></div><b>{money(y.supplynow)}</b></div>
                <div className="barrow"><span>LTL est.</span><div className="track"><div className="fill ltl" style={{ width: `${(y.ltl / maxYear) * 100}%` }} /></div><b>{money(y.ltl)}</b></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <Link className="btn gold" href={quoteHref}>Lock this lane</Link>
          </div>
          <p className="note">SupplyNow figures use our current recurring lane rates, fuel included. The LTL line is an illustrative industry-style benchmark, not a specific carrier&apos;s tariff, and assumes {p.perRun.equipment.pallets >= pallets ? "the same pallets" : "the same freight"} billed per consignee with typical accessorials.</p>
        </div>
      </aside>
    </div>
  );
}
