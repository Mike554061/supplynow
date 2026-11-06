import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export default function NotFound() {
  return (
    <PageHead eyebrow="404" title="Wrong turn" lede="That page isn't on our route. Try the instant quote or head home.">
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link className="btn gold" href="/quote">Get a free quote</Link>
        <Link className="btn ghost" href="/">Home</Link>
      </div>
    </PageHead>
  );
}
