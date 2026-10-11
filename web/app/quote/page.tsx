import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHead } from "@/components/PageHead";
import { QuoteForm } from "@/components/tools/QuoteForm";

export const metadata: Metadata = {
  title: "Instant free freight quote",
  description: "Get an instant free quote for refrigerated, frozen or dry freight. Single drop, recurring lane, last mile, mid mile and white glove delivery priced in about a minute.",
  keywords: ["instant freight quote", "free trucking quote", "box truck delivery quote", "refrigerated freight quote", "LTL alternative quote"],
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHead eyebrow="Instant free quote" title="Price your load in about a minute" lede="Pick the lane, describe the freight and see an all-in estimate update as you go. Send it to us and our quoting engine locks it with a quote number." crumbs={[{ href: "/quote", label: "Instant quote" }]} />
      <section className="section">
        <div className="wrap">
          <Suspense fallback={<p>Loading the quote tool…</p>}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
