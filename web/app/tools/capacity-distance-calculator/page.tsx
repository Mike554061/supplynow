import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { CapacityCalculator } from "@/components/tools/CapacityCalculator";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Truck capacity and distance calculator",
  description: "Which truck fits your pallets and weight, how full it runs, how long the drive takes and how far one shift can reach. Sprinter van to 53-foot reefer.",
  keywords: ["truck capacity calculator", "what truck fits 12 pallets", "how far can a truck drive in one day", "box truck vs 53 foot trailer", "pallet capacity calculator"],
  alternates: { canonical: "/tools/capacity-distance-calculator" },
};

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Capacity and distance calculator" title="Which truck fits, and how far can it go?" lede="Enter pallets, weight and distance. We size the truck, show how full it runs, check the drive against hours-of-service limits and map what one shift can reach." crumbs={[{ href: "/tools", label: "Tools" }, { href: "/tools/capacity-distance-calculator", label: "Capacity and distance" }]} />
      <section className="section"><div className="wrap"><CapacityCalculator /></div></section>
      <CtaBand />
    </>
  );
}
