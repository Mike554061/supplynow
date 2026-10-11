# SEO plan and keyword map

Goal: rank for shippers who repeat the same lanes and are stuck choosing between LTL and a full truck.
Golden intent: **creative 3PL options for recurring last mile and mid mile customers**, plus freight, single drop, recurring lanes and white glove.

## Keyword clusters

| Cluster | Primary keyword | Supporting keywords | Page |
|---|---|---|---|
| Brand + core | 3PL for recurring deliveries | asset based 3PL Ohio, our trucks our people | `/` |
| LTL replacement | LTL alternative | partial truckload alternative, skip the redistribution center, box truck vs LTL for 8 pallets | `/`, `/why-supplynow`, `/services/single-drop-delivery` |
| Last mile | recurring last mile delivery | scheduled final mile delivery, multi-stop route delivery, last mile 3PL | `/services/recurring-last-mile-delivery` |
| Mid mile | mid mile logistics | mid mile delivery, DC to store replenishment, plant to warehouse trucking | `/services/mid-mile-logistics` |
| Recurring lanes | recurring lane trucking | dedicated lane carrier, dedicated truck capacity, contract freight lanes | `/services/recurring-lane-trucking`, `/tools/recurring-lane-calculator` |
| Single drop | single drop delivery | direct truck delivery, same day freight delivery Ohio | `/services/single-drop-delivery` |
| White glove | white glove delivery | white glove freight, inside delivery service, commercial white glove logistics | `/services/white-glove-delivery` |
| Freight / cold chain | refrigerated trucking Cleveland | reefer freight carrier, cold chain last mile Midwest, dry van and reefer trucking | `/services/freight-trucking` |
| Visibility | live temperature tracking freight | real-time freight tracking, reefer temperature monitoring | `/`, service pages |
| Tools (linkable assets) | instant freight quote | free trucking quote, freight lane cost calculator, truck capacity calculator, how far can a truck drive in one day, is a 3PL right for my business | `/quote`, `/tools/*` |

## Long-tail questions to answer in content

- Is a 3PL right for my business?
- How much does a recurring delivery lane cost per year?
- Box truck vs LTL for 8 pallets: which is cheaper?
- What truck fits 12 pallets?
- How far can a truck drive in one day under hours-of-service rules?
- Refrigerated box truck delivery Cleveland to Detroit / Columbus / Pittsburgh / Chicago
- Dedicated delivery route for food distributors

Next content to add (one post each, linking to the matching tool): the five questions above, plus one lane page per hub city ("Cleveland to Detroit refrigerated freight").

## What's built in

- Unique `<title>`, meta description, keywords and canonical on every page (`app/**/page.tsx`, values in `lib/site.ts` and `lib/seo.ts`).
- `sitemap.xml` and `robots.txt` generated from code (`app/sitemap.ts`, `app/robots.ts`). `/api/` and `/storyboard` are excluded.
- Structured data: Organization + LocalBusiness (layout), Service (each service page), FAQPage (home and support).
- Static pre-rendering for every page, so crawlers get full HTML. Scroll animations only hide content once JavaScript has loaded, so nothing is invisible to crawlers.
- Open Graph and Twitter card tags. Add a 1200×630 `app/opengraph-image.png` for social previews.
- Breadcrumbs on inner pages, descriptive link text, one H1 per page.

## After launch

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain in Vercel so canonicals and the sitemap match.
2. Verify the domain in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`.
3. Update the Google Business Profile with the new site URL and the services list.
4. If the domain changes from the current site, add 301 redirects from old URLs in `next.config.ts`.
