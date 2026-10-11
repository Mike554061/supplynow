import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { FitQuiz } from "@/components/tools/FitQuiz";

export const metadata: Metadata = {
  title: "Is a 3PL right for you? Free assessment",
  description: "Answer eight questions about how you ship today and get a 3PL fit score, the reasons behind it, and which services to start with.",
  keywords: ["is a 3PL right for my business", "3PL assessment", "should I outsource logistics", "3PL vs private fleet", "3PL for small business"],
  alternates: { canonical: "/tools/is-a-3pl-right-for-you" },
};

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Is a 3PL right for you?" title="Eight questions. One honest answer." lede="Not every shipper needs a 3PL. Tell us how you ship today and we'll tell you whether a partner like us makes sense, and where to start." crumbs={[{ href: "/tools", label: "Tools" }, { href: "/tools/is-a-3pl-right-for-you", label: "3PL fit" }]} />
      <section className="section"><div className="wrap"><FitQuiz /></div></section>
    </>
  );
}
