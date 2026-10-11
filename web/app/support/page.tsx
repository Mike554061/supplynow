import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { SupportDesk, TicketForm } from "@/components/SupportDesk";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { FAQ, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer service and shipment tracking",
  description: "SupplyNow customer service: track a shipment, change a delivery, request a COI, ask about billing or file a claim. Real people at 440-554-2222.",
  alternates: { canonical: "/support" },
};

export default function Support() {
  return (
    <>
      <PageHead eyebrow="Customer service" title="Real people. One number." lede="Tracking, delivery changes, billing, claims and paperwork, handled by the same team that runs your freight." crumbs={[{ href: "/support", label: "Customer service" }]} />
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <div className="grid-2">
              <a className="card" href={SITE.phoneHref}><span className="icon"><Icon name="headset" /></span><h3>Call dispatch</h3><p>{SITE.phone}</p></a>
              <a className="card" href={SITE.smsHref}><span className="icon"><Icon name="people" /></span><h3>Text us</h3><p>{SITE.phone}</p></a>
            </div>
            <div className="faq" style={{ marginTop: 24 }}>
              {FAQ.map((f) => (<details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>))}
            </div>
          </div>
          <SupportDesk />
        </div>
      </section>
      <section className="section alt" id="track">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <p className="eyebrow">Track a shipment</p>
            <h2>Lost your tracking link?</h2>
            <p className="lede">Every load gets a live GPS and temperature link at pickup. Give us any reference number and we&apos;ll resend it by email or text.</p>
          </div>
          <TicketForm mode="track" />
        </div>
      </section>
      <section className="section" id="ticket">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <p className="eyebrow">Open a ticket</p>
            <h2>Claims, billing, changes and paperwork</h2>
            <p className="lede">You get a ticket number right away, and one person owns it until it&apos;s closed. For anything happening today, call or text {SITE.phone}.</p>
            <ul className="checks">
              <li>Delivery and appointment changes</li>
              <li>Damage and shortage claims with photos and POD</li>
              <li>Invoices and billing questions</li>
              <li>Certificates of insurance and carrier packet</li>
            </ul>
          </div>
          <TicketForm mode="ticket" />
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
