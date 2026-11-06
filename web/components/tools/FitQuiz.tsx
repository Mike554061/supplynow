"use client";
import { useState } from "react";
import Link from "next/link";
import { FIT_QUESTIONS, scoreFit, type FitAnswers } from "@/lib/fit";
import { SERVICES } from "@/lib/site";

export function FitQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FitAnswers>({});
  const done = step >= FIT_QUESTIONS.length;
  const q = FIT_QUESTIONS[Math.min(step, FIT_QUESTIONS.length - 1)];
  const picked = answers[q.id] ?? [];

  const choose = (i: number) => {
    if (q.multi) {
      setAnswers({ ...answers, [q.id]: picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i] });
    } else {
      setAnswers({ ...answers, [q.id]: [i] });
      setTimeout(() => setStep((s) => s + 1), 180);
    }
  };

  if (done) {
    const r = scoreFit(answers);
    const svc = r.services.map((s) => SERVICES.find((x) => x.slug === s)).filter(Boolean);
    const first = svc[0];
    return (
      <div className="calc">
        <div className="result">
          <p className="label">Your 3PL fit score</p>
          <p className="big">{r.score}<span style={{ fontSize: 28, color: "var(--hero-ink-2)" }}> / 100</span></p>
          <div className="track" style={{ height: 12, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden", marginTop: 8 }}>
            <div className="fill" style={{ height: "100%", width: `${r.score}%`, background: "var(--brand)", borderRadius: 999, transition: "width .8s" }} />
          </div>
          <h2 style={{ fontSize: 34, marginTop: 20 }}>{r.headline}</h2>
          <p className="muted" style={{ marginTop: 8 }}>{r.summary}</p>
          {r.reasons.length > 0 && (
            <ul className="checks" style={{ marginTop: 18 }}>
              {r.reasons.map((x) => (<li key={x} style={{ color: "var(--hero-ink-2)" }}>{x}</li>))}
            </ul>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link className="btn gold" href={`/quote${first ? `?service=${first.slug}` : ""}`}>Get a free quote</Link>
            <button className="btn ghost" onClick={() => { setAnswers({}); setStep(0); }}>Start over</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Where we&apos;d start</h3>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {svc.map((s) => s && (
              <Link key={s.slug} className="card" href={`/services/${s.slug}`} style={{ boxShadow: "none" }}>
                <b>{s.name}</b>
                <p style={{ marginTop: 4 }}>{s.short}</p>
              </Link>
            ))}
          </div>
          <p className="hint" style={{ marginTop: 14 }}>Next step: put your busiest lane in the <Link href="/tools/recurring-lane-calculator">recurring lane calculator</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 760, marginInline: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span className="eyebrow" style={{ margin: 0 }}>Question {step + 1} of {FIT_QUESTIONS.length}</span>
        {step > 0 && <button className="btn line" style={{ minHeight: 36, padding: "4px 12px" }} onClick={() => setStep(step - 1)}>Back</button>}
      </div>
      <div style={{ height: 6, background: "var(--line)", borderRadius: 999, margin: "14px 0 22px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(step / FIT_QUESTIONS.length) * 100}%`, background: "var(--brand)", transition: "width .4s" }} />
      </div>
      <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", textTransform: "none" }}>{q.q}</h2>
      {q.help && <p className="hint" style={{ marginTop: 6 }}>{q.help}</p>}
      <div style={{ display: "grid", gap: 10, marginTop: 20 }} role={q.multi ? "group" : "radiogroup"} aria-label={q.q}>
        {q.options.map((o, i) => (
          <button key={o.label} type="button" className="chip" aria-pressed={picked.includes(i)} onClick={() => choose(i)} style={{ justifyContent: "flex-start", borderRadius: 12, padding: "14px 16px", fontSize: 17, textAlign: "left" }}>
            {o.label}
          </button>
        ))}
      </div>
      {q.multi && (
        <button className="btn gold" style={{ marginTop: 20 }} disabled={picked.length === 0} onClick={() => setStep(step + 1)}>
          {step === FIT_QUESTIONS.length - 1 ? "See my result" : "Next"}
        </button>
      )}
    </div>
  );
}
