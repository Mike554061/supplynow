"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SERVICES, SITE } from "@/lib/site";

const TOOLS = [
  { href: "/quote", name: "Instant free quote", text: "A ballpark price for any lane in about a minute." },
  { href: "/tools/recurring-lane-calculator", name: "Recurring lane calculator", text: "Project a lane's weekly, yearly and three-year cost." },
  { href: "/tools/capacity-distance-calculator", name: "Capacity and distance calculator", text: "Which truck fits, how far it can go, and how fast." },
  { href: "/tools/is-a-3pl-right-for-you", name: "Is a 3PL right for you?", text: "Eight questions, one honest answer." },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <Link href="/support">Customer service</Link>
          <Link href="/support#track">Track a shipment</Link>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </div>
      </div>
      <header className="bar">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="SupplyNow home">
            <img src="/supplynow-wordmark-light.png" alt="SupplyNow" width={438} height={67} />
          </Link>
          <ul className="nav" aria-label="Main">
            <li>
              <Link className="top" href="/services">Solutions ▾</Link>
              <div className="mega">
                {SERVICES.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`}><b>{s.name}</b><span>{s.short}</span></Link>
                ))}
              </div>
            </li>
            <li>
              <Link className="top" href="/tools">Tools ▾</Link>
              <div className="mega">
                {TOOLS.map((t) => (<Link key={t.href} href={t.href}><b>{t.name}</b><span>{t.text}</span></Link>))}
              </div>
            </li>
            <li><Link className="top" href="/why-supplynow">Why SupplyNow</Link></li>
            <li><Link className="top" href="/support">Support</Link></li>
          </ul>
          <Link className="btn gold cta" href="/quote">Get a free quote</Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        </div>
        <nav id="drawer" className={`drawer${open ? " open" : ""}`} aria-label="Mobile">
          <div className="group">Solutions</div>
          {SERVICES.map((s) => (<Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>))}
          <div className="group">Tools</div>
          {TOOLS.map((t) => (<Link key={t.href} href={t.href}>{t.name}</Link>))}
          <div className="group">Company</div>
          <Link href="/why-supplynow">Why SupplyNow</Link>
          <Link href="/support">Customer service</Link>
        </nav>
      </header>
    </>
  );
}
