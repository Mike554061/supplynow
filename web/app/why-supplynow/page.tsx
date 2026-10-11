import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { CtaBand } from "@/components/CtaBand";
import { RouteCompare, LiveTrack } from "@/components/Illustrations";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why SupplyNow: an asset-based alternative to LTL",
  description: "SupplyNow is an asset-based 3PL out of Cleveland. Our trucks, our people, live temperature and freight tracking, and no redistribution center between you and your customer.",
  alternates: { canonical: "/why-supplynow" },
};

const COMPARE = [
  ["Who moves your freight", "Our trucks, our employees", "Several carriers and dock crews", "Whoever takes the load"],
  ["Handoffs per shipment", "One truck, dock to dock", "Terminals, cross-docks, redistribution", "Varies by carrier"],
  ["Temperature visibility", "Live, logged every trip", "Limited, varies by terminal", "Depends on the carrier"],
  ["Freight tracking", "Live GPS link at pickup", "Scan events at terminals", "Check calls"],
  ["Recurring lanes", "Same truck, same driver, locked rate", "Re-rated by tariff", "Re-bid week to week"],
];

export default function Why() {
  return (
    <>
      <PageHead eyebrow="Why SupplyNow" title="Our mission" lede={SITE.mission} crumbs={[{ href: "/why-supplynow", label: "Why SupplyNow" }]} />
      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">The problem</p>
            <h2>LTL was built for the trailer, not for you</h2>
            <p className="lede">When you can&apos;t fill a 53-footer, the default is LTL: your pallets ride with other shippers&apos; freight and get sorted at terminals and redistribution centers on the way. That is more handling, more time and less visibility, exactly where food, temperature-sensitive and high-value freight can least afford it.</p>
          </div>
          <div data-reveal="2"><RouteCompare /></div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split flip">
          <div data-reveal>
            <p className="eyebrow">Our answer</p>
            <h2>Put it on one of our trucks</h2>
            <p className="lede">We match a truck to your load, from sprinter van to 53′ reefer, and send it straight from your dock to your customer&apos;s. For freight that repeats, we lock the lane, the truck and the driver so your receivers see the same face every run.</p>
            <ul className="checks"><li>Our trucks and our people</li><li>Live temperature tracking</li><li>Live freight tracking</li><li>Recurring last mile and mid mile, plus single drop, white glove and full freight</li></ul>
          </div>
          <div data-reveal="2"><LiveTrack /></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="head"><p className="eyebrow">Side by side</p><h2>SupplyNow, LTL and brokers</h2></div>
          <div className="card table-wrap" style={{ padding: 0 }}>
            <table className="table">
              <thead><tr><th></th><th>SupplyNow</th><th>LTL</th><th>Broker / load board</th></tr></thead>
              <tbody>{COMPARE.map((r) => (<tr key={r[0]}><td><b>{r[0]}</b></td><td style={{ color: "var(--brand-ink)", fontWeight: 700 }}>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>))}</tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 10 }}>General comparison; specific LTL carriers and brokers vary.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
