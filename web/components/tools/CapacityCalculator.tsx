"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { planCapacity, money, type Temp } from "@/lib/pricing";
import { LanePicker, laneMiles, type LaneValue } from "./LanePicker";
import { TempChips } from "./TempChips";
import { ReachRings, TrailerFill } from "@/components/Illustrations";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function CapacityCalculator() {
  const [lane, setLane] = useState<LaneValue>({ from: "cle", to: "pit", manual: false, miles: 136 });
  const [temp, setTemp] = useState<Temp>("dry");
  const [pallets, setPallets] = useState(10);
  const [lbs, setLbs] = useState(9000);
  const [stops, setStops] = useState(1);
  const miles = laneMiles(lane);
  const plan = useMemo(() => planCapacity({ miles, pallets, lbs, temp, stops }), [miles, pallets, lbs, temp, stops]);
  const rec = plan.options.find((o) => o.recommended);
  const quoteHref = `/quote?from=${lane.from}&to=${lane.to}&temp=${temp}&pallets=${pallets}&service=single-drop-delivery`;

  return (
    <>
      <div className="calc">
        <div className="card form">
          <h2 style={{ fontSize: 30 }}>Load and distance</h2>
          <LanePicker value={lane} onChange={setLane} idPrefix="c" />
          <TempChips value={temp} onChange={setTemp} name="c-temp" />
          <div className="field">
            <label htmlFor="c-pallets">Pallets: <b>{pallets}</b></label>
            <input id="c-pallets" className="range" type="range" min={1} max={52} value={pallets} onChange={(e) => setPallets(Number(e.target.value))} />
          </div>
          <div className="row">
            <div className="field"><label htmlFor="c-lbs">Total weight (lbs)</label><input id="c-lbs" type="number" min={1} max={90000} value={lbs} onChange={(e) => setLbs(Math.max(1, Number(e.target.value)))} /></div>
            <div className="field"><label htmlFor="c-stops">Delivery stops</label><input id="c-stops" type="number" min={1} max={30} value={stops} onChange={(e) => setStops(Math.max(1, Number(e.target.value)))} /></div>
          </div>
          <div style={{ marginTop: 6 }}><TrailerFill pallets={Math.min(pallets, 26)} /></div>
        </div>

        <aside className="out" aria-live="polite">
          <div className="result">
            <p className="label">Best fit</p>
            <p className="big" style={{ fontSize: "clamp(34px,4.6vw,48px)" }}>{rec ? `${rec.trucks > 1 ? `${rec.trucks} × ` : ""}${rec.equipment.name}` : "Call us"}</p>
            {rec && <p className="muted">{pct(rec.palletFill)} of pallet space · {pct(rec.weightFill)} of weight capacity · about {money(rec.cost)}</p>}
            <div className="kv">
              <div><b>{plan.driveHours} hrs</b><span>driving, {Math.round(miles)} mi one way</span></div>
              <div><b>{plan.sameDay ? "Same day" : `${plan.transitDays} days`}</b><span>{plan.sameDay ? `fits one ${plan.dutyHours}-hr duty day` : "multi-day or team run"}</span></div>
              <div><b>{plan.roundTripInShift ? "Yes" : "No"}</b><span>out and back in one shift</span></div>
              <div><b>{pct(plan.trailer53Fill)}</b><span>of a 53′ trailer this load would use</span></div>
            </div>
            {plan.trailer53Fill < 0.6 && (
              <p className="note"><span className="badge warn">LTL alert</span> At {pct(plan.trailer53Fill)} of a 53′, this load usually goes LTL through a terminal. A right-sized truck takes it direct.</p>
            )}
            <div style={{ marginTop: 18 }}><Link className="btn gold" href={quoteHref}>Quote this load</Link></div>
          </div>
        </aside>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Every truck that can run it</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Truck</th><th>Trucks</th><th>Pallet fill</th><th>Weight fill</th><th>Est. cost</th></tr></thead>
              <tbody>
                {plan.options.map((o) => (
                  <tr key={o.equipment.id} className={o.recommended ? "rec" : undefined}>
                    <td>{o.equipment.name}{o.recommended ? " ★" : ""}</td>
                    <td>{o.trucks}</td>
                    <td>{pct(o.palletFill)}</td>
                    <td>{pct(o.weightFill)}</td>
                    <td>{money(o.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 10 }}>★ smallest truck that fits the pallets, weight and temperature in one move.</p>
        </div>
        <div className="card" data-reveal>
          <h3 style={{ marginTop: 0 }}>How far one shift reaches</h3>
          <p>With {stops} stop{stops > 1 ? "s" : ""}, one driver covers about <b>{plan.oneShiftReachMiles} miles one way</b> or <b>{plan.roundTripReachMiles} miles out and back</b> inside the 11-hour driving and 14-hour duty limits.</p>
          <div style={{ marginTop: 12 }}><ReachRings oneShift={plan.oneShiftReachMiles} roundTrip={plan.roundTripReachMiles} /></div>
        </div>
      </div>
    </>
  );
}
