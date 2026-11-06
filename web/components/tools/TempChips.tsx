"use client";
import type { Temp } from "@/lib/pricing";

const OPTS: { v: Temp; l: string }[] = [
  { v: "refrigerated", l: "Refrigerated" },
  { v: "frozen", l: "Frozen" },
  { v: "dry", l: "Dry" },
];

export function TempChips({ value, onChange, name }: { value: Temp; onChange: (t: Temp) => void; name: string }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="legend" style={{ marginBottom: 6 }}>Temperature</legend>
      <div className="chips">
        {OPTS.map((o) => (
          <label key={o.v} className="chip">
            <input type="radio" name={name} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} />
            {o.l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
