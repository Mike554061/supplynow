import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { SITE, SERVICES } from "@/lib/site";
import { PRIMARY_KEYWORDS, SECONDARY_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SupplyNow | Recurring last mile, mid mile and LTL-alternative trucking",
    template: "%s | SupplyNow",
  },
  description:
    "Can't fill a 53-footer? Skip LTL and the redistribution center. SupplyNow runs recurring last mile, mid mile, single drop and white glove freight on our own trucks with our own people, with live temperature and freight tracking.",
  keywords: [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SupplyNow",
    url: SITE.url,
    title: "SupplyNow | Our trucks. Our people. Your freight, direct.",
    description: "Recurring last mile, mid mile and LTL-alternative trucking with live temperature and freight tracking.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0b1b27", width: "device-width", initialScale: 1 };

const org = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/supplynow-lockup-light.png`,
  telephone: "+1-440-554-2222",
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.street, addressLocality: "Cleveland", addressRegion: "OH", postalCode: SITE.postal, addressCountry: "US" },
  areaServed: ["Ohio", "Michigan", "Pennsylvania", "Illinois", "Indiana", "New York", "Midwest United States"],
  slogan: SITE.tagline,
  makesOffer: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${SITE.url}/services/${s.slug}` } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={org} />
      </head>
      <body>
        <a className="sr-only" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
