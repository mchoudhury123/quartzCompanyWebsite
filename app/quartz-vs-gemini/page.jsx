import Link from 'next/link';
import '../_components/landing.css';

export const metadata = {
  title: 'Quartz Worktops vs Gemini Worktops – UK Buyer\'s Comparison',
  description:
    'A buyer\'s comparison between Gemini Worktops and The Quartz Company. Price, range, lead times and warranty compared honestly so you can pick the right supplier.',
  alternates: { canonical: '/quartz-vs-gemini' },
  openGraph: {
    title: 'Quartz Worktops vs Gemini Worktops | The Quartz Company',
    description: 'Honest UK supplier comparison.',
    url: '/quartz-vs-gemini',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thequartzcompany.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Quartz vs Gemini', item: 'https://www.thequartzcompany.co.uk/quartz-vs-gemini' },
  ],
};

export default function QuartzVsGeminiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="lp-hero">
        <div className="lp-hero__container">
          <h1>Quartz Worktops vs Gemini Worktops</h1>
          <p className="lp-hero__subtitle">
            Both supply quality engineered quartz to UK kitchens. Here is how we differ —
            on range, on price, on lead times and on the bits that matter when you are
            choosing a worktop supplier.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">Get a Free Quote</Link>
            <Link href="/colours" className="btn btn--lg btn--outline">See Our Range</Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>The short version</h2>
            <p>
              Gemini Worktops is a well-known UK supplier of engineered quartz with
              showroom presence and an established trade network. The Quartz Company is a
              direct-to-homeowner specialist focused on{' '}
              <strong>affordable engineered quartz and full-body printed quartz</strong>,
              with a leaner cost base passed through as lower prices. Both are reputable;
              the right choice depends on what you value.
            </p>
            <p>
              We do not run nationwide showrooms or fund extensive television
              advertising. That is deliberate: it lets us price our worktops well below
              the established players while delivering the same engineered quartz
              quality, the same 25-year warranty and the same UK fitting standards.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">How we compare</h2>
          <p className="lp-section__lede">
            Comparison based on publicly available information from both companies as of
            2026. Always confirm specifics with each supplier when quoting.
          </p>
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__highlight">The Quartz Company</th>
                <th>Gemini Worktops</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Specialism</td><td className="lp-compare__highlight">Engineered + full-body printed quartz</td><td>Engineered quartz across multiple brands</td></tr>
              <tr><td>Starting price per m²</td><td className="lp-compare__highlight">From £214</td><td>Varies by brand &amp; design</td></tr>
              <tr><td>Free samples</td><td className="lp-compare__highlight">Up to five, posted free</td><td>Available — check current offer</td></tr>
              <tr><td>Fixed-price quotes</td><td className="lp-compare__highlight">Yes — within 24 hours</td><td>Yes</td></tr>
              <tr><td>Warranty</td><td className="lp-compare__highlight">25 years</td><td>Manufacturer-dependent</td></tr>
              <tr><td>Typical lead time</td><td className="lp-compare__highlight">10–20 working days</td><td>Varies by region and product</td></tr>
              <tr><td>Showroom network</td><td>By appointment only</td><td className="lp-compare__highlight">Multiple showrooms</td></tr>
              <tr><td>Installation</td><td className="lp-compare__highlight">Northamptonshire + neighbouring counties; UK-wide delivery</td><td>National network of installers</td></tr>
              <tr><td>Direct-to-homeowner pricing</td><td className="lp-compare__highlight">Yes — no middleman markup</td><td>Quoted via showroom or installer</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>When Gemini is the better choice</h2>
            <ul>
              <li><strong>You want to walk into a showroom near you.</strong> Gemini's nationwide showroom network is genuinely useful if you prefer to see large-format slabs in person before committing.</li>
              <li><strong>You want a specific premium brand</strong> (Silestone, Caesarstone, etc.) that they stock as an authorised distributor.</li>
              <li><strong>You are outside our installation coverage area</strong> and prefer a single supplier-and-installer package rather than coordinating delivery to an independent fitter.</li>
            </ul>

            <h2>When The Quartz Company is the better choice</h2>
            <ul>
              <li><strong>Price matters and you do not need a showroom visit.</strong> Free samples cover most decisions; our pricing reflects the savings.</li>
              <li><strong>You want full-body printed quartz</strong> for waterfall edges, mitres or undermount sinks — it is one of our specialisms.</li>
              <li><strong>You want a fast fixed-price quote</strong> without a sales visit or showroom appointment.</li>
              <li><strong>You are in Northamptonshire, Warwickshire, Leicestershire, Buckinghamshire, Bedfordshire, Oxfordshire, Cambridgeshire</strong> or surrounding postcodes — we template and fit directly.</li>
            </ul>

            <h2>Get both quotes before you decide</h2>
            <p>
              The best way to compare is to get a fixed-price quote from both. Ours takes
              24 hours and includes free samples by post — no obligation, no sales visit.
            </p>
            <p>
              <Link href="/quote">Request your quote</Link> and we will respond within
              one working day with prices for your exact kitchen layout.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-cta-banner">
        <div className="lp-cta-banner__container">
          <h2>Get our price before you sign anything</h2>
          <p>Free samples, free quote, no sales visit. We will give you a fixed price for your kitchen within 24 hours.</p>
          <Link href="/quote" className="btn btn--gold btn--lg">Get Free Quote</Link>
        </div>
      </section>
    </>
  );
}
