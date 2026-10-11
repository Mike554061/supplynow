import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { RouteCompare, TrailerFill, LiveTrack, LaneLoop } from "@/components/Illustrations";
import { SERVICES, SITE } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.title, description: s.description, keywords: s.keywords, alternates: { canonical: `/services/${s.slug}` } };
}

const ILLO = { lastmile: LiveTrack, midmile: RouteCompare, loop: LaneLoop, pin: TrailerFill, glove: LiveTrack, trailer: LiveTrack };

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const Illo = ILLO[s.icon];
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  return (
    <>
      <PageHead eyebrow={s.name} title={s.title} lede={s.pitch} crumbs={[{ href: "/services", label: "Solutions" }, { href: `/services/${s.slug}`, label: s.name }]}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
          <Link className="btn gold" href={`/quote?service=${s.slug}`}>Get an instant free quote</Link>
          <a className="btn ghost" href={SITE.phoneHref}>Call {SITE.phone}</a>
        </div>
      </PageHead>
      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">What you get</p>
            <h2>Our trucks. Our people. Live tracking.</h2>
            <ul className="checks">{s.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>
            <p className="eyebrow" style={{ marginTop: 32 }}>A good fit for</p>
            <ul className="checks">{s.fit.map((b) => (<li key={b}>{b}</li>))}</ul>
          </div>
          <div data-reveal="2"><Illo /></div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <div className="head"><p className="eyebrow">Run the numbers</p><h2>Price it before you call</h2></div>
          <div className="grid-3">
            <Link className="card" href={`/quote?service=${s.slug}`}><span className="icon"><Icon name="calc" /></span><h3>Instant free quote</h3><p>One load, priced in about a minute.</p></Link>
            <Link className="card" href="/tools/recurring-lane-calculator"><span className="icon"><Icon name="loop" /></span><h3>Recurring lane calculator</h3><p>Yearly cost of a repeating lane, next to LTL.</p></Link>
            <Link className="card" href="/tools/capacity-distance-calculator"><span className="icon"><Icon name="trailer" /></span><h3>Capacity and distance</h3><p>Which truck fits and how far it reaches.</p></Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="head"><p className="eyebrow">Related solutions</p></div>
          <div className="grid-3">
            {others.map((o) => (
              <Link key={o.slug} className="card" href={`/services/${o.slug}`}><span className="icon"><Icon name={o.icon} /></span><h3>{o.name}</h3><p>{o.short}</p></Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.description, serviceType: s.name,
        provider: { "@type": "Organization", name: SITE.name, url: SITE.url, telephone: "+1-440-554-2222" },
        areaServed: "Midwest and Northeast United States", url: `${SITE.url}/services/${s.slug}`,
      }} />
    </>
  );
}
