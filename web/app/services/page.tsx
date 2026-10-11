import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { RouteCompare } from "@/components/Illustrations";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "3PL solutions: last mile, mid mile, recurring lanes, white glove",
  description: "Recurring last mile, mid mile, recurring lanes, single drop, white glove and refrigerated freight on SupplyNow trucks with SupplyNow drivers.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <>
      <PageHead eyebrow="Solutions" title="Creative 3PL options for freight that repeats" lede="Every service runs on our own trucks with our own people, with live temperature and freight tracking. Pick the one that fits, or combine them on one lane." crumbs={[{ href: "/services", label: "Solutions" }]} />
      <section className="section">
        <div className="wrap grid-3">
          {SERVICES.map((s, i) => (
            <Link key={s.slug} className="card" href={`/services/${s.slug}`} data-reveal={String((i % 3) + 1)}>
              <span className="icon"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span className="more">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">Why it works</p>
            <h2>One truck beats four docks</h2>
            <p className="lede">Most damage, delay and lost visibility happen at transfers. Our model removes them: the truck that picks up is the truck that delivers.</p>
          </div>
          <div data-reveal="2"><RouteCompare /></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
