import Link from "next/link";
import { SITE } from "@/lib/site";

export function CtaBand({ title = "Get a free quote in about a minute", text = "Tell us the lane and the freight. The price is calculated instantly, and a SupplyNow specialist confirms it with you." }: { title?: string; text?: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="ctaband" data-reveal>
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="ctas">
            <Link className="btn gold" href="/quote">Get an instant free quote</Link>
            <a className="btn ghost" href={SITE.phoneHref}>Call {SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
