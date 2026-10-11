"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { quote, money, ACCESSORIALS, type AccessorialId, type Temp, type Quote } from "@/lib/pricing";
import { LanePicker, laneMiles, type LaneValue } from "./LanePicker";
import { TempChips } from "./TempChips";
import { SERVICES, SITE } from "@/lib/site";

type Init = { from?: string; to?: string; temp?: string; pallets?: string; service?: string; runs?: string };

const ACC_CHOICES: AccessorialId[] = ["liftgate", "inside", "whiteGlove", "appointment"];

type ServerQuote = { id: string; quote: Quote; validUntil: string; forwarded: boolean };

export function QuoteForm() {
  const sp = useSearchParams();
  const init: Init = { from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined, temp: sp.get("temp") ?? undefined, pallets: sp.get("pallets") ?? undefined, service: sp.get("service") ?? undefined, runs: sp.get("runs") ?? undefined };
  const [lane, setLane] = useState<LaneValue>({ from: init.from || "cle", to: init.to || "det", manual: false, miles: 170 });
  const [temp, setTemp] = useState<Temp>((["dry", "refrigerated", "frozen"].includes(init.temp || "") ? init.temp : "refrigerated") as Temp);
  const [pallets, setPallets] = useState(Math.max(1, Math.min(52, Number(init.pallets) || 6)));
  const [lbs, setLbs] = useState(pallets * 900);
  const [stops, setStops] = useState(1);
  const [acc, setAcc] = useState<AccessorialId[]>(init.service === "white-glove-delivery" ? ["whiteGlove", "inside"] : []);
  const [expedited, setExpedited] = useState(false);
  const [recurring, setRecurring] = useState(Boolean(Number(init.runs)) || (init.service || "").startsWith("recurring"));
  const [runs, setRuns] = useState(Math.max(1, Number(init.runs) || 3));
  const [service, setService] = useState(init.service && SERVICES.some((s) => s.slug === init.service) ? init.service : "single-drop-delivery");
  const [contact, setContact] = useState({ name: "", company: "", email: "", phone: "", pickupDate: "", notes: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [server, setServer] = useState<ServerQuote | null>(null);
  const [error, setError] = useState("");

  const miles = laneMiles(lane);
  const q = useMemo(
    () => quote({ miles, pallets, lbs, temp, stops, accessorials: acc, expedited, runsPerWeek: recurring ? runs : 0 }),
    [miles, pallets, lbs, temp, stops, acc, expedited, recurring, runs],
  );

  const toggleAcc = (id: AccessorialId) => setAcc((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!contact.email && !contact.phone) { setError("Add an email or phone number so we can send your quote."); return; }
    setState("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lane, miles, pallets, lbs, temp, stops, accessorials: acc, expedited, runsPerWeek: recurring ? runs : 0, service, contact, website: (e.target as HTMLFormElement).website?.value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setServer(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  const shown = server?.quote ?? q;
  const mailBody = encodeURIComponent(
    `Quote request\nLane: ${lane.manual ? `${miles} miles` : `${lane.from.toUpperCase()} to ${lane.to.toUpperCase()} (~${miles} mi)`}\nFreight: ${pallets} pallets, ${lbs} lbs, ${temp}\nStops: ${stops}\nService: ${service}\nEstimate: ${money(q.total)}\n\n${contact.name} ${contact.company} ${contact.phone}`,
  );

  return (
    <div className="calc">
      <form className="card form" onSubmit={submit} aria-label="Instant free quote">
        <h2 style={{ fontSize: 30 }}>1. The lane</h2>
        <LanePicker value={lane} onChange={setLane} idPrefix="q" />
        <h2 style={{ fontSize: 30, marginTop: 8 }}>2. The freight</h2>
        <TempChips value={temp} onChange={setTemp} name="q-temp" />
        <div className="row three">
          <div className="field">
            <label htmlFor="q-pallets">Pallets</label>
            <input id="q-pallets" type="number" min={1} max={52} inputMode="numeric" value={pallets} onChange={(e) => setPallets(Math.max(1, Number(e.target.value)))} />
          </div>
          <div className="field">
            <label htmlFor="q-lbs">Total weight (lbs)</label>
            <input id="q-lbs" type="number" min={1} max={90000} inputMode="numeric" value={lbs} onChange={(e) => setLbs(Math.max(1, Number(e.target.value)))} />
          </div>
          <div className="field">
            <label htmlFor="q-stops">Delivery stops</label>
            <input id="q-stops" type="number" min={1} max={30} inputMode="numeric" value={stops} onChange={(e) => setStops(Math.max(1, Number(e.target.value)))} />
          </div>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="legend" style={{ marginBottom: 6 }}>At delivery</legend>
          <div className="chips">
            {ACC_CHOICES.map((id) => (
              <label key={id} className="chip"><input type="checkbox" checked={acc.includes(id)} onChange={() => toggleAcc(id)} />{ACCESSORIALS[id].label}</label>
            ))}
            <label className="chip"><input type="checkbox" checked={expedited} onChange={(e) => setExpedited(e.target.checked)} />Same-day priority</label>
          </div>
        </fieldset>
        <div className="row">
          <div className="field">
            <label htmlFor="q-service">Service</label>
            <select id="q-service" value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((s) => (<option key={s.slug} value={s.slug}>{s.name}</option>))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="q-runs">Recurring?</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label className="chip"><input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />Yes</label>
              {recurring && (
                <select id="q-runs" value={runs} onChange={(e) => setRuns(Number(e.target.value))} aria-label="Runs per week">
                  {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (<option key={n} value={n}>{n}× per week</option>))}
                </select>
              )}
            </div>
          </div>
        </div>
        <h2 style={{ fontSize: 30, marginTop: 8 }}>3. Where to send it</h2>
        <div className="row">
          <div className="field"><label htmlFor="q-name">Name</label><input id="q-name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="q-company">Company</label><input id="q-company" autoComplete="organization" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} /></div>
        </div>
        <div className="row">
          <div className="field"><label htmlFor="q-email">Email</label><input id="q-email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
          <div className="field"><label htmlFor="q-phone">Phone</label><input id="q-phone" type="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
        </div>
        <div className="row">
          <div className="field"><label htmlFor="q-date">First pickup date</label><input id="q-date" type="date" value={contact.pickupDate} onChange={(e) => setContact({ ...contact, pickupDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="q-notes">Anything else?</label><input id="q-notes" placeholder="Dock hours, set point, commodity" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} /></div>
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
        {error && <p className="err" role="alert">{error}</p>}
        <button className="btn gold block" type="submit" disabled={state === "sending"}>{state === "sending" ? "Locking your quote…" : "Send me this quote"}</button>
        <p className="hint">Prefer to talk? Call or text <a href={SITE.phoneHref}>{SITE.phone}</a> or <a href={`mailto:${SITE.email}?subject=Quote%20request&body=${mailBody}`}>email the details</a>.</p>
      </form>

      <aside className="out" aria-live="polite">
        <div className="result">
          {state === "done" && server ? (
            <>
              <span className="badge">Quote {server.id} saved</span>
              <p className="label" style={{ marginTop: 14 }}>Your estimate</p>
              <p className="big">{money(shown.total)}</p>
              <p className="muted">Calculated by our quoting engine. Valid until {new Date(server.validUntil).toLocaleDateString()}. A SupplyNow specialist will confirm the details{contact.email ? ` at ${contact.email}` : ""}.</p>
            </>
          ) : (
            <>
              <p className="label">Instant estimate</p>
              <p className="big">{money(shown.total)}</p>
              <p className="muted">{shown.trucks > 1 ? `${shown.trucks} × ` : ""}{shown.equipment.name} · {Math.round(miles)} mi · {temp}</p>
            </>
          )}
          <table className="lines">
            <tbody>
              {shown.lines.map((l) => (<tr key={l.label}><td>{l.label}</td><td>{money(l.amount)}</td></tr>))}
              <tr className="total"><td>All-in estimate</td><td>{money(shown.total)}</td></tr>
            </tbody>
          </table>
          <div className="kv">
            <div><b>{money(shown.perPallet)}</b><span>per pallet</span></div>
            <div><b>{shown.transitDays === 1 ? "Same day" : `${shown.transitDays} days`}</b><span>est. transit ({shown.transitHours} hrs incl. loading)</span></div>
          </div>
          {shown.notes.map((n) => (<p key={n} className="note">• {n}</p>))}
          <p className="note">Ballpark estimate including fuel. Final rate is confirmed by a specialist after reviewing addresses, dock hours and accessorials.</p>
        </div>
      </aside>
    </div>
  );
}
