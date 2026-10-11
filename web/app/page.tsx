import Link from "next/link";
import { HeroMedia } from "@/components/HeroMedia";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { RouteCompare, TrailerFill, LiveTrack, LaneLoop } from "@/components/Illustrations";
import { SERVICES, INDUSTRIES, FAQ, SITE } from "@/lib/site";
import { PLACES } from "@/lib/places";

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroMedia />
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap grid">
          <div>
            <p className="eyebrow">Asset-based 3PL · Last mile · Mid mile · Recurring lanes</p>
            <h1>Skip LTL. <em>Skip</em> the redistribution center.</h1>
            <p className="sub">
              Can&apos;t fill a 53-footer? Put it on one of our trucks instead. Our people take it from your dock straight to your
              customer&apos;s, with live temperature and live freight tracking the whole way.
            </p>
            <div className="ctas">
              <Link className="btn gold" href="/quote">Get an instant free quote</Link>
              <Link className="btn ghost" href="/tools/is-a-3pl-right-for-you">Is a 3PL right for you?</Link>
            </div>
            <ul className="proof">
              <li>Our trucks</li>
              <li>Our people</li>
              <li>Live temperature tracking</li>
              <li>Live freight tracking</li>
            </ul>
          </div>
          <form className="glass form" action="/quote" method="get" aria-label="Quick quote">
            <h2>Quick quote</h2>
            <div className="row">
              <div className="field">
                <label htmlFor="hq-from">Pickup</label>
                <select id="hq-from" name="from" defaultValue="cle">
                  {PLACES.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="hq-to">Delivery</label>
                <select id="hq-to" name="to" defaultValue="det">
                  {PLACES.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="hq-temp">Freight</label>
                <select id="hq-temp" name="temp" defaultValue="refrigerated">
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                  <option value="dry">Dry</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="hq-pallets">Pallets</label>
                <input id="hq-pallets" name="pallets" type="number" min={1} max={52} defaultValue={6} inputMode="numeric" />
              </div>
            </div>
            <button className="btn gold block" type="submit">See my price</button>
            <p className="small" style={{ color: "var(--hero-ink-2)" }}>Free. No account. Priced instantly.</p>
          </form>
        </div>
        <span className="hero-caption">Live network · illustrative</span>
      </section>

      <div className="stats">
        <div><b>1</b><span>truck from your dock to theirs</span></div>
        <div><b>3</b><span>temperature modes: frozen, chilled, dry</span></div>
        <div><b>5</b><span>regional hubs around Cleveland</span></div>
        <div><b>100%</b><span>of loads with live GPS and temperature</span></div>
      </div>

      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">The LTL detour</p>
            <h2>No longer are the days of LTL for what you can&apos;t fill a 53-footer.</h2>
            <p className="lede">
              LTL fills a trailer with many shippers&apos; freight, then sorts it at terminals and redistribution centers on the way to your
              customer. Every transfer is another forklift, another dock and another day. Why not put it on one of our trucks and skip
              the hassle?
            </p>
            <ul className="checks">
              <li>One truck, one driver, dock to dock</li>
              <li>No terminal dwell, no cross-dock sorting</li>
              <li>A truck sized to your load, from sprinter van to 53′ trailer</li>
            </ul>
            <p style={{ marginTop: 24 }}><Link className="btn line" href="/tools/recurring-lane-calculator">Compare your lane with LTL</Link></p>
          </div>
          <div data-reveal="2"><RouteCompare /></div>
        </div>
      </section>

      <section className="section alt" id="solutions">
        <div className="wrap">
          <div className="head" data-reveal>
            <p className="eyebrow">Solutions</p>
            <h2>Creative 3PL options for freight that repeats</h2>
            <p className="lede">Recurring last mile and mid mile are where we do our best work. Single drops, white glove and full freight run on the same trucks, with the same people.</p>
          </div>
          <div className="grid-3">
            {SERVICES.map((s, i) => (
              <Link key={s.slug} className="card" href={`/services/${s.slug}`} data-reveal={String((i % 3) + 1)}>
                <span className="icon"><Icon name={s.icon} /></span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="more">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split flip">
          <div data-reveal>
            <p className="eyebrow">Right-size the truck</p>
            <h2>Pay for your freight, not for empty trailer</h2>
            <p className="lede">
              Eight pallets is a third of a 53′ trailer and a full 26′ box truck. We match the truck to the load, so it can leave when
              you&apos;re ready and go straight to the dock.
            </p>
            <p style={{ marginTop: 24 }}><Link className="btn line" href="/tools/capacity-distance-calculator">Find the truck that fits</Link></p>
          </div>
          <div data-reveal="2"><TrailerFill pallets={8} /></div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="head" data-reveal>
            <p className="eyebrow">How it works</p>
            <h2>From quote to recurring lane</h2>
            <p className="lede">One point of contact from the first quote to the hundredth run.</p>
          </div>
          <ol className="steps">
            <li data-reveal="1"><h3>Price it</h3><p>Get an instant free quote online, or project a full lane with the recurring lane calculator.</p></li>
            <li data-reveal="2"><h3>Pilot it</h3><p>Run a single drop or a one-week pilot on your busiest lane. No contract to start.</p></li>
            <li data-reveal="3"><h3>Watch it</h3><p>A live GPS and temperature link goes out at pickup. Digital POD at every stop.</p></li>
            <li data-reveal="4"><h3>Lock it</h3><p>Lock the lane, the truck and the driver at a recurring rate that drops as frequency goes up.</p></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">Visibility</p>
            <h2>See the freight. See the temperature. Live.</h2>
            <p className="lede">Every load, every time. You get a tracking link at pickup and a temperature log you can hand to QA.</p>
            <div className="grid-2" style={{ marginTop: 24 }}>
              <div className="card"><span className="icon"><Icon name="gps" /></span><h3>Live freight tracking</h3><p>Watch the truck in real time, with ETAs built around your receiving windows.</p></div>
              <div className="card"><span className="icon"><Icon name="temp" /></span><h3>Live temperature</h3><p>Frozen, refrigerated and ambient set points monitored and logged for the whole trip.</p></div>
            </div>
          </div>
          <div data-reveal="2"><LiveTrack /></div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split flip">
          <div data-reveal>
            <p className="eyebrow">Our trucks, our people</p>
            <h2>The same truck and the same face, every run</h2>
            <p className="lede">
              We are an asset-based carrier, not a load board. The driver at your dock works for SupplyNow, knows your receivers, and
              runs your lane on schedule. When something changes, you call one number and a person answers.
            </p>
            <ul className="checks">
              <li>Active authority: {SITE.mc} · {SITE.usdot}</li>
              <li>Home base Cleveland, hubs in {SITE.hubs.join(", ")}</li>
              <li>Recurring lanes beyond the hub network on request</li>
            </ul>
          </div>
          <div data-reveal="2"><LaneLoop /></div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="head center" data-reveal>
            <p className="eyebrow">Tools</p>
            <h2>Do the math before you call</h2>
            <p className="lede">Four free tools, no sign-up. Every number comes from the same pricing engine our team quotes from.</p>
          </div>
          <div className="grid-4">
            <Link className="card" href="/quote" data-reveal="1"><span className="icon"><Icon name="calc" /></span><h3>Instant free quote</h3><p>A ballpark price for one load in about a minute.</p></Link>
            <Link className="card" href="/tools/recurring-lane-calculator" data-reveal="2"><span className="icon"><Icon name="loop" /></span><h3>Recurring lane</h3><p>Weekly, yearly and three-year cost of a lane, next to LTL.</p></Link>
            <Link className="card" href="/tools/capacity-distance-calculator" data-reveal="3"><span className="icon"><Icon name="trailer" /></span><h3>Capacity and distance</h3><p>Which truck fits, how full it runs and how far it reaches in a shift.</p></Link>
            <Link className="card" href="/tools/is-a-3pl-right-for-you" data-reveal="4"><span className="icon"><Icon name="quiz" /></span><h3>Is a 3PL right for you?</h3><p>Eight quick questions and an honest answer.</p></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head" data-reveal>
            <p className="eyebrow">Industries</p>
            <h2>Built for freight that can&apos;t wait at a terminal</h2>
          </div>
          <div className="grid-3">
            {INDUSTRIES.map((x, i) => (
              <div key={x.name} className="card" data-reveal={String((i % 3) + 1)}><h3 style={{ marginTop: 0 }}>{x.name}</h3><p>{x.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div data-reveal>
            <p className="eyebrow">Customer service</p>
            <h2>Real people. One number.</h2>
            <p className="lede">Track a load, fix a delivery window, ask for a COI or file a claim. Our customer service team handles it from start to finish.</p>
            <div className="ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <Link className="btn teal" href="/support">Visit customer service</Link>
              <a className="btn line" href={SITE.phoneHref}>Call {SITE.phone}</a>
            </div>
          </div>
          <div className="faq" data-reveal="2">
            {FAQ.slice(0, 4).map((f) => (<details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>))}
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.slice(0, 4).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
