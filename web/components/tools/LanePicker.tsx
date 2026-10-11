"use client";
import { PLACES, findPlace, roadMiles } from "@/lib/places";

export type LaneValue = { from: string; to: string; manual: boolean; miles: number };

export function laneMiles(v: LaneValue): number {
  if (v.manual) return Math.max(1, v.miles || 1);
  const a = findPlace(v.from), b = findPlace(v.to);
  return a && b ? roadMiles(a, b) : 100;
}

export function LanePicker({ value, onChange, idPrefix }: { value: LaneValue; onChange: (v: LaneValue) => void; idPrefix: string }) {
  const miles = laneMiles(value);
  return (
    <div className="form" style={{ gap: 10 }}>
      <div className="row">
        <div className="field">
          <label htmlFor={`${idPrefix}-from`}>Pickup metro</label>
          <select id={`${idPrefix}-from`} value={value.from} disabled={value.manual} onChange={(e) => onChange({ ...value, from: e.target.value })}>
            {PLACES.map((p) => (<option key={p.id} value={p.id}>{p.name}{p.hub ? " (hub)" : ""}</option>))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-to`}>Delivery metro</label>
          <select id={`${idPrefix}-to`} value={value.to} disabled={value.manual} onChange={(e) => onChange({ ...value, to: e.target.value })}>
            {PLACES.map((p) => (<option key={p.id} value={p.id}>{p.name}{p.hub ? " (hub)" : ""}</option>))}
          </select>
        </div>
      </div>
      <div className="row">
        <label className="chip" style={{ justifySelf: "start" }}>
          <input type="checkbox" checked={value.manual} onChange={(e) => onChange({ ...value, manual: e.target.checked, miles: value.manual ? value.miles : miles })} />
          I know the exact miles
        </label>
        {value.manual ? (
          <div className="field">
            <label htmlFor={`${idPrefix}-miles`}>One-way miles</label>
            <input id={`${idPrefix}-miles`} type="number" min={1} max={3500} inputMode="numeric" value={value.miles} onChange={(e) => onChange({ ...value, miles: Number(e.target.value) })} />
          </div>
        ) : (
          <p className="hint" style={{ alignSelf: "center" }}>About <b>{miles.toLocaleString()} road miles</b> one way (estimated).</p>
        )}
      </div>
    </div>
  );
}
