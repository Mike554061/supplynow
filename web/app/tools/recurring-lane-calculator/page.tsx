import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { LaneCalculator } from "@/components/tools/LaneCalculator";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Recurring lane cost calculator",
  description: "Project the weekly, yearly and three-year cost of a recurring freight lane, and compare a dedicated SupplyNow truck with an LTL benchmark.",
  keywords: ["recurring lane calculator", "freight lane cost calculator", "dedicated lane pricing", "LTL vs box truck cost", "how much does a recurring delivery lane cost"],
  alternates: { canonical: "/tools/recurring-lane-calculator" },
};

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Projected recurring lane calculator" title="What does your lane cost a year?" lede="Set the lane, the freight and how often it runs. See the per-run price, the monthly and yearly spend, a three-year projection with growth, and how it stacks up against shipping it LTL." crumbs={[{ href: "/tools", label: "Tools" }, { href: "/tools/recurring-lane-calculator", label: "Recurring lane" }]} />
      <section className="section"><div className="wrap"><LaneCalculator /></div></section>
      <CtaBand title="Lock the lane, the truck and the driver" text="Recurring rates drop as frequency goes up. Start with a one-week pilot; no contract." />
    </>
  );
}
