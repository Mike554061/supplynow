import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Freight calculators and shipping tools",
  description: "Free freight tools: instant quote, recurring lane cost calculator, truck capacity and distance calculator, and an is-a-3PL-right-for-you assessment.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  { href: "/quote", icon: "calc" as const, name: "Instant free quote", text: "An all-in ballpark price for one load, locked with a quote number." },
  { href: "/tools/recurring-lane-calculator", icon: "loop" as const, name: "Recurring lane calculator", text: "Project weekly, yearly and three-year cost for a lane you run again and again, next to an LTL benchmark." },
  { href: "/tools/capacity-distance-calculator", icon: "trailer" as const, name: "Capacity and distance calculator", text: "Find the smallest truck that fits, how full it runs, and how far one shift can reach." },
  { href: "/tools/is-a-3pl-right-for-you", icon: "quiz" as const, name: "Is a 3PL right for you?", text: "Eight questions about how you ship today. A fit score and where to start." },
];

export default function Tools() {
  return (
    <>
      <PageHead eyebrow="Tools" title="Do the math before you call" lede="Every tool runs on the same pricing and planning engine our team quotes from. No sign-up." crumbs={[{ href: "/tools", label: "Tools" }]} />
      <section className="section">
        <div className="wrap grid-2">
          {TOOLS.map((t, i) => (
            <Link key={t.href} className="card" href={t.href} data-reveal={String((i % 2) + 1)}>
              <span className="icon"><Icon name={t.icon} /></span>
              <h3>{t.name}</h3>
              <p>{t.text}</p>
              <span className="more">Open →</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
