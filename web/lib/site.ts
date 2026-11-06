// One place for company facts, services and FAQ copy. Pages and schema read from here.

export const SITE = {
  name: "SupplyNow",
  legalName: "Supply Now Inc.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.supplynow.org").replace(/\/$/, ""),
  phone: "440-554-2222",
  phoneHref: "tel:+14405542222",
  smsHref: "sms:+14405542222",
  email: "info@supplynow.org",
  mc: "MC 1660872",
  usdot: "USDOT 3976910",
  city: "Cleveland, OH",
  street: "2800 Euclid Ave, Suite 310",
  postal: "44115",
  hubs: ["Chicago", "Detroit", "Columbus", "Pittsburgh", "Wilkes-Barre"],
  tagline: "Our trucks. Our people. Your freight, direct.",
  mission:
    "Give recurring shippers a direct, accountable alternative to LTL: freight that rides our trucks with our people, straight to the dock, with live temperature and live tracking from pickup to proof of delivery.",
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  title: string; // <title> and H1
  description: string; // meta description
  keywords: string[];
  pitch: string;
  bullets: string[];
  fit: string[];
  icon: IconName;
};

export type IconName = "lastmile" | "midmile" | "loop" | "pin" | "glove" | "trailer";

export const SERVICES: Service[] = [
  {
    slug: "recurring-last-mile-delivery",
    name: "Recurring last mile",
    short: "Scheduled final-mile runs to stores, kitchens and job sites, with the same drivers every week.",
    title: "Recurring last mile delivery",
    description:
      "Scheduled, recurring last mile delivery on SupplyNow trucks with SupplyNow drivers. Multi-stop routes, appointment windows, live GPS and temperature tracking.",
    keywords: ["recurring last mile delivery", "scheduled final mile delivery", "multi-stop route delivery", "last mile 3PL"],
    pitch:
      "Your receivers see the same truck and the same face on the same day. We build the route once, run it every week, and keep it on time as your stops change.",
    bullets: [
      "Daily, weekly or custom schedules with fixed appointment windows",
      "Multi-stop routes to stores, restaurants, clinics and job sites",
      "Liftgate, pallet jack and inside delivery available on every truck class",
      "Live GPS and temperature link at pickup, digital POD at every stop",
    ],
    fit: ["Food and beverage distributors", "Specialty retail replenishment", "Commissary and central kitchens"],
    icon: "lastmile",
  },
  {
    slug: "mid-mile-logistics",
    name: "Mid mile",
    short: "Plant to warehouse, DC to store, cross-dock to cross-dock. The middle leg, without the middleman.",
    title: "Mid mile logistics and DC replenishment",
    description:
      "Mid mile freight between plants, warehouses, distribution centers and stores. Asset-based trucks, no broker chain, live temperature and freight tracking.",
    keywords: ["mid mile logistics", "mid mile delivery", "DC to store replenishment", "plant to warehouse trucking"],
    pitch:
      "The middle leg is where freight waits. We pick up at the plant or DC and drop at the next node on a schedule you set, with no terminal dwell in between.",
    bullets: [
      "Plant to DC, DC to store and inter-facility transfers",
      "Drop-trailer and no-touch moves where the dock allows",
      "Frozen, refrigerated and dry on the same network",
      "Fixed weekly capacity you can plan production around",
    ],
    fit: ["Manufacturers and co-packers", "Regional distributors", "Retail replenishment"],
    icon: "midmile",
  },
  {
    slug: "recurring-lane-trucking",
    name: "Recurring lanes",
    short: "The same lane, every week, at a rate you lock in. Dedicated capacity without owning a fleet.",
    title: "Recurring lane and dedicated trucking",
    description:
      "Recurring lane trucking and dedicated capacity at locked weekly rates. Project your annual lane cost with the SupplyNow recurring lane calculator.",
    keywords: ["recurring lane trucking", "dedicated lane carrier", "dedicated truck capacity", "contract freight lanes"],
    pitch:
      "If you ship the same lane every week, you should not be re-quoting it every week. Lock the lane, the truck and the driver, and get a rate that drops as frequency goes up.",
    bullets: [
      "Rate locked by lane and frequency, with volume tiers",
      "Dedicated equipment and drivers your dock knows",
      "Weekly lane reporting: on-time, temperature, exceptions",
      "Scale runs up or down with notice instead of re-bidding",
    ],
    fit: ["Shippers with 2+ runs a week on one lane", "Teams replacing a private fleet", "Seasonal surge lanes"],
    icon: "loop",
  },
  {
    slug: "single-drop-delivery",
    name: "Single drop",
    short: "One pickup, one delivery, today. A truck sized to your load instead of a spot on an LTL dock.",
    title: "Single drop and direct truck delivery",
    description:
      "Single drop, direct-to-dock delivery on a truck sized to your freight. Skip LTL terminals and redistribution centers. Get an instant free quote.",
    keywords: ["single drop delivery", "direct truck delivery", "LTL alternative", "partial truckload alternative", "same day freight delivery"],
    pitch:
      "Can't fill a 53-footer? Don't send it LTL. A sprinter, 16′ or 26′ box truck goes straight from your dock to theirs, with nobody else's freight on board.",
    bullets: [
      "Exclusive-use truck from pickup to delivery",
      "No terminal transfers, no cross-dock handling",
      "Same-day and next-day options inside the hub network",
      "Instant ballpark quote, confirmed by a specialist",
    ],
    fit: ["1 to 12 pallet shipments", "Hot orders and recovery deliveries", "Fragile or high-value freight"],
    icon: "pin",
  },
  {
    slug: "white-glove-delivery",
    name: "White glove",
    short: "Inside delivery, room of choice, unpacking and debris removal by trained two-person teams.",
    title: "White glove delivery",
    description:
      "White glove delivery with inside placement, unpacking, assembly coordination and debris removal. Two-person SupplyNow teams with live tracking.",
    keywords: ["white glove delivery", "white glove freight", "inside delivery service", "commercial white glove logistics"],
    pitch:
      "Some freight should never touch a terminal floor. Our two-person teams carry it in, place it, unpack it and take the packaging with them.",
    bullets: [
      "Inside delivery and room-of-choice placement",
      "Unpacking, debris removal and photo confirmation",
      "Scheduled windows with a call-ahead before arrival",
      "Equipment, fixtures, furniture and medical or lab equipment",
    ],
    fit: ["Restaurant and commercial kitchen equipment", "Store fixtures and displays", "Office and healthcare installs"],
    icon: "glove",
  },
  {
    slug: "freight-trucking",
    name: "Freight",
    short: "Full and partial truckload: reefer, frozen and dry, from sprinter vans to 53′ trailers.",
    title: "Refrigerated, frozen and dry freight trucking",
    description:
      "Asset-based refrigerated, frozen and dry freight trucking out of Cleveland. Full and partial truckload, live temperature monitoring and GPS on every load.",
    keywords: ["refrigerated trucking company Cleveland", "reefer freight carrier", "asset based carrier Ohio", "dry van and reefer trucking"],
    pitch:
      "One asset-based carrier for frozen, refrigerated and dry freight. Our trucks, our drivers, our authority, and one phone number when you need an answer.",
    bullets: [
      "Frozen, refrigerated and ambient set points logged for the whole trip",
      "Sprinter vans, 16′ and 26′ box trucks, 53′ trailers",
      "Full truckload and partial loads",
      "Active authority: MC 1660872, USDOT 3976910",
    ],
    fit: ["Food manufacturers and distributors", "Grocery and foodservice", "Industrial and CPG freight"],
    icon: "trailer",
  },
];

export const INDUSTRIES = [
  { name: "Food and beverage", text: "Frozen, chilled and ambient product with set points logged from dock to dock." },
  { name: "Grocery and specialty retail", text: "Store replenishment on fixed windows, with the same driver every run." },
  { name: "Restaurants and foodservice", text: "Commissary-to-kitchen routes and recovery deliveries when an order comes up short." },
  { name: "Manufacturing and CPG", text: "Plant-to-DC mid mile and partial loads that never wait at a terminal." },
  { name: "Healthcare and lab supply", text: "Temperature-sensitive supplies with live temperature and chain-of-custody PODs." },
  { name: "Furniture, fixtures and equipment", text: "White glove inside delivery, placement and debris removal." },
];

export const FAQ = [
  {
    q: "Are you a broker?",
    a: "No. SupplyNow is an asset-based carrier and 3PL. Your freight moves on our trucks with our drivers under our own authority (MC 1660872, USDOT 3976910). When a surge needs more trucks than we field, we tell you up front which partner carrier is running it.",
  },
  {
    q: "Why not just ship LTL?",
    a: "LTL is built to fill a 53-foot trailer with many shippers' freight, which means terminal transfers, cross-docks and redistribution centers between you and your customer. If you ship a few pallets on the same lane every week, a right-sized truck going direct is often faster, handled less and comparable in cost. The recurring lane calculator shows the comparison for your lane.",
  },
  {
    q: "What does the instant quote include?",
    a: "Linehaul, fuel and the accessorials you select (liftgate, inside delivery, white glove, extra stops). It is a ballpark estimate calculated on our server the moment you submit. A specialist confirms the details before issuing a final rate.",
  },
  {
    q: "Can I track temperature and location live?",
    a: "Yes. A live GPS and temperature link goes out at pickup, and you receive a digital proof of delivery when it is signed.",
  },
  {
    q: "Where do you run?",
    a: "Cleveland is home base, with hubs in Chicago, Detroit, Columbus, Pittsburgh and Wilkes-Barre. Recurring lanes run beyond the hub network; if your lane isn't listed, ask.",
  },
  {
    q: "Do I need a long-term contract?",
    a: "No. Most customers start with a single drop or a pilot week on one lane, then lock a recurring rate once the lane is proven.",
  },
];
