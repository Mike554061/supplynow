// Metro list for the quote and calculators. Distances are straight-line (haversine)
// times a road factor, so no paid mapping API is needed. Customers can always type exact miles.

export type Place = { id: string; name: string; lat: number; lon: number; hub?: boolean };

export const PLACES: Place[] = [
  { id: "cle", name: "Cleveland, OH", lat: 41.4993, lon: -81.6944, hub: true },
  { id: "chi", name: "Chicago, IL", lat: 41.8781, lon: -87.6298, hub: true },
  { id: "det", name: "Detroit, MI", lat: 42.3314, lon: -83.0458, hub: true },
  { id: "cmh", name: "Columbus, OH", lat: 39.9612, lon: -82.9988, hub: true },
  { id: "pit", name: "Pittsburgh, PA", lat: 40.4406, lon: -79.9959, hub: true },
  { id: "wbr", name: "Wilkes-Barre, PA", lat: 41.2459, lon: -75.8813, hub: true },
  { id: "akr", name: "Akron, OH", lat: 41.0814, lon: -81.519 },
  { id: "can", name: "Canton, OH", lat: 40.7989, lon: -81.3784 },
  { id: "tol", name: "Toledo, OH", lat: 41.6528, lon: -83.5379 },
  { id: "yng", name: "Youngstown, OH", lat: 41.0998, lon: -80.6495 },
  { id: "cin", name: "Cincinnati, OH", lat: 39.1031, lon: -84.512 },
  { id: "day", name: "Dayton, OH", lat: 39.7589, lon: -84.1916 },
  { id: "eri", name: "Erie, PA", lat: 42.1292, lon: -80.0851 },
  { id: "buf", name: "Buffalo, NY", lat: 42.8864, lon: -78.8784 },
  { id: "roc", name: "Rochester, NY", lat: 43.1566, lon: -77.6088 },
  { id: "syr", name: "Syracuse, NY", lat: 43.0481, lon: -76.1474 },
  { id: "alb", name: "Albany, NY", lat: 42.6526, lon: -73.7562 },
  { id: "nyc", name: "New York, NY", lat: 40.7128, lon: -74.006 },
  { id: "nwk", name: "Newark, NJ", lat: 40.7357, lon: -74.1724 },
  { id: "phl", name: "Philadelphia, PA", lat: 39.9526, lon: -75.1652 },
  { id: "abe", name: "Allentown, PA", lat: 40.6084, lon: -75.4902 },
  { id: "hbg", name: "Harrisburg, PA", lat: 40.2732, lon: -76.8867 },
  { id: "bal", name: "Baltimore, MD", lat: 39.2904, lon: -76.6122 },
  { id: "dca", name: "Washington, DC", lat: 38.9072, lon: -77.0369 },
  { id: "ric", name: "Richmond, VA", lat: 37.5407, lon: -77.436 },
  { id: "bos", name: "Boston, MA", lat: 42.3601, lon: -71.0589 },
  { id: "chs", name: "Charleston, WV", lat: 38.3498, lon: -81.6326 },
  { id: "lou", name: "Louisville, KY", lat: 38.2527, lon: -85.7585 },
  { id: "lex", name: "Lexington, KY", lat: 38.0406, lon: -84.5037 },
  { id: "ind", name: "Indianapolis, IN", lat: 39.7684, lon: -86.1581 },
  { id: "fwa", name: "Fort Wayne, IN", lat: 41.0793, lon: -85.1394 },
  { id: "sbn", name: "South Bend, IN", lat: 41.6764, lon: -86.252 },
  { id: "grr", name: "Grand Rapids, MI", lat: 42.9634, lon: -85.6681 },
  { id: "lan", name: "Lansing, MI", lat: 42.7325, lon: -84.5555 },
  { id: "fnt", name: "Flint, MI", lat: 43.0125, lon: -83.6875 },
  { id: "mke", name: "Milwaukee, WI", lat: 43.0389, lon: -87.9065 },
  { id: "msn", name: "Madison, WI", lat: 43.0731, lon: -89.4012 },
  { id: "msp", name: "Minneapolis, MN", lat: 44.9778, lon: -93.265 },
  { id: "stl", name: "St. Louis, MO", lat: 38.627, lon: -90.1994 },
  { id: "mci", name: "Kansas City, MO", lat: 39.0997, lon: -94.5786 },
  { id: "dsm", name: "Des Moines, IA", lat: 41.5868, lon: -93.625 },
  { id: "oma", name: "Omaha, NE", lat: 41.2565, lon: -95.9345 },
  { id: "bna", name: "Nashville, TN", lat: 36.1627, lon: -86.7816 },
  { id: "mem", name: "Memphis, TN", lat: 35.1495, lon: -90.049 },
  { id: "tys", name: "Knoxville, TN", lat: 35.9606, lon: -83.9207 },
  { id: "clt", name: "Charlotte, NC", lat: 35.2271, lon: -80.8431 },
  { id: "rdu", name: "Raleigh, NC", lat: 35.7796, lon: -78.6382 },
  { id: "atl", name: "Atlanta, GA", lat: 33.749, lon: -84.388 },
  { id: "jax", name: "Jacksonville, FL", lat: 30.3322, lon: -81.6557 },
  { id: "orl", name: "Orlando, FL", lat: 28.5383, lon: -81.3792 },
  { id: "mia", name: "Miami, FL", lat: 25.7617, lon: -80.1918 },
  { id: "dfw", name: "Dallas, TX", lat: 32.7767, lon: -96.797 },
  { id: "hou", name: "Houston, TX", lat: 29.7604, lon: -95.3698 },
];

export const ROAD_FACTOR = 1.18;

export function findPlace(id: string | undefined | null): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export function crowMiles(a: Place, b: Place): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const TOLEDO = { id: "tol-wp", name: "Toledo", lat: 41.6528, lon: -83.5379 };
const isMichiganSide = (p: Place) => p.lat > 41.8 && p.lon < -82.6 && p.lon > -87.5;
const isSouthShore = (p: Place) => p.lon > -82.6 && p.lon < -79.5 && p.lat < 42.3;

/** Estimated road miles between two metros. Same metro counts as a 25-mile local run.
 *  Michigan to the Ohio/Pennsylvania shore is routed around Lake Erie through Toledo. */
export function roadMiles(a: Place, b: Place): number {
  if (a.id === b.id) return 25;
  const lake = (isMichiganSide(a) && isSouthShore(b)) || (isMichiganSide(b) && isSouthShore(a));
  const crow = lake ? crowMiles(a, TOLEDO) + crowMiles(TOLEDO, b) : crowMiles(a, b);
  return Math.max(25, Math.round(crow * ROAD_FACTOR));
}
