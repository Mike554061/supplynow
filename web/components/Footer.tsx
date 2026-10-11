import Link from "next/link";
import { SERVICES, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="cols">
          <div>
            <img src="/supplynow-wordmark-light.png" alt="SupplyNow" width={438} height={67} style={{ height: 26, width: "auto", marginBottom: 16 }} />
            <p>{SITE.tagline}</p>
            <p style={{ marginTop: 12 }}>{SITE.legalName}<br />{SITE.street}<br />Cleveland, OH {SITE.postal}</p>
            <p style={{ marginTop: 12 }}>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
          <div>
            <h4>Solutions</h4>
            {SERVICES.map((s) => (<Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>))}
          </div>
          <div>
            <h4>Tools</h4>
            <Link href="/quote">Instant free quote</Link>
            <Link href="/tools/recurring-lane-calculator">Recurring lane calculator</Link>
            <Link href="/tools/capacity-distance-calculator">Capacity and distance</Link>
            <Link href="/tools/is-a-3pl-right-for-you">Is a 3PL right for you?</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/why-supplynow">Why SupplyNow</Link>
            <Link href="/support">Customer service</Link>
            <Link href="/support#track">Track a shipment</Link>
            <Link href="/support#ticket">Claims and billing</Link>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {SITE.legalName} · {SITE.mc} · {SITE.usdot}</span>
          <span>Asset-based carrier and 3PL. Home base Cleveland, OH.</span>
        </div>
      </div>
      <div className="dock">
        <a className="btn ghost" href={SITE.phoneHref}>Call</a>
        <Link className="btn gold" href="/quote">Free quote</Link>
      </div>
    </footer>
  );
}
