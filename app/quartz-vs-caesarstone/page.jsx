import Link from 'next/link';
import '../_components/landing.css';

export const metadata = {
  title: 'Caesarstone Alternative UK – Affordable Engineered Quartz',
  description:
    'Looking for a Caesarstone alternative in the UK? Compare Caesarstone with The Quartz Company on price, range and warranty. Same engineered quartz quality, lower price.',
  alternates: { canonical: '/quartz-vs-caesarstone' },
  openGraph: {
    title: 'Caesarstone Alternative UK | The Quartz Company',
    description: 'Affordable engineered quartz that matches Caesarstone quality.',
    url: '/quartz-vs-caesarstone',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thequartzcompany.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Caesarstone Alternative', item: 'https://www.thequartzcompany.co.uk/quartz-vs-caesarstone' },
  ],
};

export default function QuartzVsCaesarstonePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="lp-hero">
        <div className="lp-hero__container">
          <h1>The Affordable Caesarstone Alternative</h1>
          <p className="lp-hero__subtitle">
            Caesarstone built the engineered quartz category and their products are
            excellent. Our engineered quartz delivers the same core qualities — non-porous
            surface, scratch resistance, 25-year warranty — at a meaningfully lower price.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">Get Free Samples &amp; Quote</Link>
            <Link href="/colours" className="btn btn--lg btn--outline">See Our Range</Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>Why people search for a Caesarstone alternative</h2>
            <p>
              Caesarstone is the original engineered quartz manufacturer and is regarded
              as a premium brand. That premium comes with a premium price tag — UK supply
              prices for popular Caesarstone designs frequently land in the
              £350–£550/m² range supply-only, before fabrication and fitting.
            </p>
            <p>
              For homeowners who want the same engineered-quartz benefits without the
              brand premium, our worktops are the obvious answer.{' '}
              <strong>Same ~93% natural quartz composition. Same non-porous, stain-resistant surface. Same 25-year warranty. From £214/m².</strong>
            </p>

            <h2>What is the same</h2>
            <ul>
              <li><strong>Material composition.</strong> Both are engineered from natural quartz aggregate (~93%) bonded with polymer resin (~7%) and pigments. The base technology is the same.</li>
              <li><strong>Performance.</strong> Both are non-porous, stain-resistant, scratch-resistant (Mohs 7), heat-tolerant to ~150°C, and never need sealing.</li>
              <li><strong>Hygiene.</strong> Both pass standard hygiene testing for kitchen surfaces (NSF certification or equivalent).</li>
              <li><strong>Warranty.</strong> Both offer 25-year residential warranties.</li>
            </ul>

            <h2>What is different</h2>
            <ul>
              <li><strong>Price.</strong> Caesarstone is a premium brand priced accordingly. Our equivalent designs typically come in at 30–50% less per m².</li>
              <li><strong>Marketing budget.</strong> Caesarstone funds substantial advertising; that cost is built into their pricing.</li>
              <li><strong>Range structure.</strong> Caesarstone has a curated collection of branded designs. We offer over 60 colours including direct-equivalent veined whites, calacatta-style printed quartz, plain whites and dark sparkles.</li>
              <li><strong>Distribution model.</strong> Caesarstone sells through authorised dealers and showrooms. We sell direct to the homeowner with free samples by post.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Direct comparison</h2>
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__highlight">The Quartz Company</th>
                <th>Caesarstone</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Material</td><td className="lp-compare__highlight">~93% natural quartz + resin</td><td>~93% natural quartz + resin</td></tr>
              <tr><td>Starting price per m²</td><td className="lp-compare__highlight">From £214</td><td>From around £350</td></tr>
              <tr><td>Range size</td><td className="lp-compare__highlight">60+ colours</td><td>Curated collection</td></tr>
              <tr><td>Marble-effect veining</td><td className="lp-compare__highlight">Yes — including full-body printed</td><td>Yes — premium veined range</td></tr>
              <tr><td>Free samples</td><td className="lp-compare__highlight">Up to 5 free</td><td>Available through showrooms</td></tr>
              <tr><td>Warranty</td><td className="lp-compare__highlight">25 years</td><td>25 years (Caesarstone Lifetime in some markets)</td></tr>
              <tr><td>Made in</td><td className="lp-compare__highlight">United Kingdom</td><td>Israel / international</td></tr>
              <tr><td>Buying process</td><td className="lp-compare__highlight">Direct online + free samples</td><td>Via authorised dealer / showroom</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>When Caesarstone is still the right call</h2>
            <ul>
              <li><strong>You specifically want the Caesarstone brand</strong> — for resale, for a specific design (e.g. their Calacatta Maximus or Statuario Maximus), or because your kitchen designer specifies it.</li>
              <li><strong>You want a particular Caesarstone exclusive pattern</strong> we cannot directly match (their proprietary designs are distinctive).</li>
              <li><strong>Budget is not a constraint</strong> and you prefer the established premium brand.</li>
            </ul>

            <h2>When we are the better fit</h2>
            <ul>
              <li><strong>You want the same engineered-quartz performance for less.</strong> Most popular looks (white veined, calacatta, statuario, plain whites, dark sparkles) have direct equivalents in our range.</li>
              <li><strong>You want full-body printed quartz</strong> for flawless waterfall edges and mitres — a specialism of ours.</li>
              <li><strong>You prefer to shortcut the showroom visit</strong> with free posted samples and an online fixed-price quote.</li>
            </ul>

            <p>
              <Link href="/colours">Browse our full colour range</Link>, read about{' '}
              <Link href="/printed-quartz-worktops">our printed quartz</Link>, or{' '}
              <Link href="/quote">request free samples</Link> to compare directly.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-cta-banner">
        <div className="lp-cta-banner__container">
          <h2>Same quartz, lower price</h2>
          <p>Free samples posted to your door. Compare in your own kitchen lighting before you spend.</p>
          <Link href="/quote" className="btn btn--gold btn--lg">Get Free Samples</Link>
        </div>
      </section>
    </>
  );
}
