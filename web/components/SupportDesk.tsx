"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

// SupplyNow Assist: a rule-based helper that answers common questions and hands anything else to a
// person through a support ticket. It needs no paid service; swap in an AI model later if wanted.

type Msg = { from: "bot" | "me"; text: string; link?: { href: string; label: string } };

const INTENTS: { test: RegExp; reply: Msg }[] = [
  { test: /track|where.*(truck|load|freight|shipment)|eta|status/i, reply: { from: "bot", text: "Every load gets a live GPS and temperature link at pickup. If you can't find yours, send your load or PO number and we'll resend it.", link: { href: "#track", label: "Request my tracking link" } } },
  { test: /quote|price|cost|rate|how much/i, reply: { from: "bot", text: "The instant quote prices a load in about a minute and gives you a quote number. For a lane you run every week, the recurring lane calculator shows the yearly cost.", link: { href: "/quote", label: "Open the instant quote" } } },
  { test: /temp|temperature|reefer|frozen|cold/i, reply: { from: "bot", text: "We run frozen, refrigerated and ambient. The set point is monitored live and logged for the whole trip, and the log is yours on request." } },
  { test: /claim|damage|short|missing|broken/i, reply: { from: "bot", text: "Sorry about that. Open a claim ticket with photos and your POD and a person will own it until it's closed.", link: { href: "#ticket", label: "Open a claim ticket" } } },
  { test: /invoice|bill|billing|pay|payment/i, reply: { from: "bot", text: "Billing questions go straight to our team. Include the invoice or load number and we'll sort it out.", link: { href: "#ticket", label: "Open a billing ticket" } } },
  { test: /coi|insurance|certificate|carrier packet|w-?9|authority|mc|dot/i, reply: { from: "bot", text: `We're an asset-based carrier: ${SITE.mc}, ${SITE.usdot}. Ask for a COI naming your company and we'll send it.`, link: { href: "#ticket", label: "Request a COI" } } },
  { test: /reschedul|change|window|appointment|cancel|late/i, reply: { from: "bot", text: `For a change today, call or text dispatch at ${SITE.phone} so a person can act on it right away. For future runs, open a ticket.`, link: { href: "#ticket", label: "Change a delivery" } } },
  { test: /where.*(run|deliver|go)|area|coverage|hub|lane/i, reply: { from: "bot", text: `Cleveland is home base, with hubs in ${SITE.hubs.join(", ")}. Recurring lanes run beyond the hubs; ask about yours.` } },
  { test: /broker/i, reply: { from: "bot", text: "We're not a broker. Your freight rides our trucks with our drivers." } },
  { test: /human|person|agent|call|talk|someone/i, reply: { from: "bot", text: `You can reach a person at ${SITE.phone} (call or text) or ${SITE.email}. Or open a ticket below and we'll come to you.`, link: { href: "#ticket", label: "Open a ticket" } } },
];

const QUICK = ["Track my shipment", "Get a quote", "File a claim", "Request a COI", "Talk to a person"];

export function SupportDesk() {
  const [log, setLog] = useState<Msg[]>([{ from: "bot", text: "Hi, I'm SupplyNow Assist. Ask about tracking, quotes, temperature, billing or claims, or pick a topic below." }]);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [log]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    const hit = INTENTS.find((i) => i.test.test(text));
    const reply: Msg = hit ? hit.reply : { from: "bot", text: "I'm not sure about that one. Open a ticket and a person will answer.", link: { href: "#ticket", label: "Open a ticket" } };
    setLog((l) => [...l, { from: "me", text }, reply]);
    setInput("");
  };

  return (
    <div className="chat" aria-label="SupplyNow Assist">
      <header><span className="dot" aria-hidden="true" /><b>SupplyNow Assist</b><span className="small" style={{ marginLeft: "auto", color: "var(--hero-ink-2)" }}>People behind every answer</span></header>
      <div className="log" role="log" aria-live="polite">
        {log.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>
            {m.text}
            {m.link && (<div style={{ marginTop: 6 }}>{m.link.href.startsWith("#") ? <a href={m.link.href}>{m.link.label} →</a> : <Link href={m.link.href}>{m.link.label} →</Link>}</div>)}
          </div>
        ))}
        {log.length < 3 && (
          <div className="quick">{QUICK.map((q) => (<button key={q} type="button" onClick={() => ask(q)}>{q}</button>))}</div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label htmlFor="assist-in" className="sr-only">Ask a question</label>
        <input id="assist-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" autoComplete="off" />
        <button className="btn teal" type="submit">Send</button>
      </form>
    </div>
  );
}

export function TicketForm({ mode }: { mode: "track" | "ticket" }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    if (mode === "track") body.topic = "tracking";
    setState("sending");
    try {
      const res = await fetch("/api/support", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setId(data.id);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="card" role="status">
        <span className="badge" style={{ background: "var(--tint)", color: "var(--brand-ink)" }}>Ticket {id}</span>
        <h3>{mode === "track" ? "We'll resend your tracking link" : "Got it. A person owns this now."}</h3>
        <p>Keep your ticket number handy. For anything urgent today, call or text <a href={SITE.phoneHref}>{SITE.phone}</a>.</p>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={submit}>
      {mode === "track" ? (
        <>
          <div className="field"><label htmlFor="t-ref">Load, PO or quote number</label><input id="t-ref" name="reference" required /></div>
          <div className="row">
            <div className="field"><label htmlFor="t-email">Email</label><input id="t-email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="t-phone">Mobile (for a text link)</label><input id="t-phone" name="phone" type="tel" autoComplete="tel" /></div>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            <div className="field">
              <label htmlFor="k-topic">Topic</label>
              <select id="k-topic" name="topic" defaultValue="delivery">
                <option value="delivery">Change a delivery or window</option>
                <option value="claim">Damage or shortage claim</option>
                <option value="billing">Billing or invoice</option>
                <option value="coi">COI or carrier packet</option>
                <option value="quote">Quote follow-up</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="field"><label htmlFor="k-ref">Load, invoice or quote number</label><input id="k-ref" name="reference" /></div>
          </div>
          <div className="row">
            <div className="field"><label htmlFor="k-name">Name</label><input id="k-name" name="name" autoComplete="name" /></div>
            <div className="field"><label htmlFor="k-company">Company</label><input id="k-company" name="company" autoComplete="organization" /></div>
          </div>
          <div className="row">
            <div className="field"><label htmlFor="k-email">Email</label><input id="k-email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="k-phone">Phone</label><input id="k-phone" name="phone" type="tel" autoComplete="tel" /></div>
          </div>
          <div className="field"><label htmlFor="k-msg">What do you need?</label><textarea id="k-msg" name="message" required /></div>
        </>
      )}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : mode === "track" ? "Send my tracking link" : "Open ticket"}</button>
    </form>
  );
}
