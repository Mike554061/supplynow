# SupplyNow company website

Next.js (App Router) site for Vercel. The old GitHub Pages landing page in the repo root is untouched.

## Pages

- `/` home: hero, LTL detour, solutions, right-size, how it works, visibility, tools, industries, customer service
- `/quote` instant free quote (priced live in the browser, locked by `/api/quote`)
- `/tools/recurring-lane-calculator`, `/tools/capacity-distance-calculator`, `/tools/is-a-3pl-right-for-you`
- `/services` and six service landing pages
- `/support` customer service: SupplyNow Assist, track a shipment, tickets (`/api/support`)
- `/why-supplynow` mission and comparison
- `/storyboard` scene-by-scene storyboard (not indexed)

## Deploy on Vercel

1. In Vercel: **Add New → Project → Import** `Mike554061/supplynow`.
2. Set **Root Directory** to `web`. Framework preset: Next.js. No other build settings needed.
3. Environment variables (optional):
   - `NEXT_PUBLIC_SITE_URL`: final domain, for example `https://www.supplynow.org`
   - `LEAD_WEBHOOK_URL`: any HTTPS webhook (Zapier, Make, Airtable automation, Slack). Every quote and support ticket is POSTed there as JSON.
   - `LEAD_WEBHOOK_SECRET`: sent as the `x-supplynow-secret` header so the receiver can verify it.
   - `NEXT_PUBLIC_HERO_VIDEO`: override the hero video URL.
4. Deploy, then add the domain under **Settings → Domains**.

Without a webhook, quotes and tickets still work and appear in Vercel's function logs (search `[supplynow:quote]`).

## Hero video

The hero tries `/hero-network.mp4` (put the file from supplynow.org in `web/public/`), then `https://www.supplynow.org/hero-network.mp4`, then falls back to the animated night-highway canvas from the original landing page. Copy the file into `public/` before pointing supplynow.org at this site, or the middle option disappears with the old site.

## Editing prices and assumptions

Every rate lives in `lib/pricing.ts`: per-mile rates and minimums by truck, accessorials, frozen and expedite uplifts, recurring discounts, hours-of-service assumptions and the LTL comparison benchmark. Change a number there and the quote, the calculators and the API all follow. Company facts and service copy are in `lib/site.ts`; the metro list is in `lib/places.ts`.

## Develop

```
npm install
npm run dev     # http://localhost:3000
npm test        # pricing, capacity and fit-score tests
npm run build
```
