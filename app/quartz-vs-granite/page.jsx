import Link from 'next/link';
import '../_components/landing.css';

export const metadata = {
  title: 'Quartz vs Granite Worktops – Honest UK Comparison (2026)',
  description:
    'Quartz vs granite kitchen worktops compared on price, durability, stain resistance, heat, maintenance and resale value. An honest UK 2026 guide.',
  alternates: { canonical: '/quartz-vs-granite' },
  openGraph: {
    title: 'Quartz vs Granite Worktops | The Quartz Company',
    description: 'Honest UK comparison of quartz and granite kitchen worktops.',
    url: '/quartz-vs-granite',
  },
};

const faqs = [
  {
    q: 'Is quartz better than granite for a kitchen?',
    a: 'For most British kitchens, yes. Quartz is non-porous so it does not stain or need sealing, it is harder and more scratch-resistant, and the colour you see in a sample is exactly what you get because it is engineered. Granite is still excellent — it is more heat-resistant and every slab is a one-off — but quartz wins on day-to-day practicality.',
  },
  {
    q: 'Which is cheaper, quartz or granite?',
    a: 'They overlap. Entry-level granite (around £180/m²) is slightly cheaper than entry-level quartz (around £214/m²). Mid-range and premium granites with exotic patterns can cost more than equivalent quartz. The total fitted cost — including templating, fabrication and installation — is broadly similar.',
  },
  {
    q: 'Does quartz scratch easier than granite?',
    a: 'No — the opposite. Quartz has a Mohs hardness of around 7, granite is 6–7 depending on the stone. Both are harder than steel kitchen knives, which is why you should still use a chopping board. Neither will be scratched by everyday use.',
  },
  {
    q: 'Can you put a hot pan on quartz?',
    a: 'You can briefly, but quartz contains polymer resin that softens above about 150°C, so a long-contact hot pan can leave a mark. Granite has no resin and handles direct heat indefinitely. For both materials we recommend a trivet for very hot cookware — habit, not necessity.',
  },
  {
    q: 'Which adds more to home resale value?',
    a: 'Both signal "premium kitchen" to UK buyers. Estate agents report similar resale uplift for either material in 2024–2026. The fitted finish quality matters more than which of the two stones you chose.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thequartzcompany.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Quartz vs Granite', item: 'https://www.thequartzcompany.co.uk/quartz-vs-granite' },
  ],
};

export default function QuartzVsGranitePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="lp-hero">
        <div className="lp-hero__container">
          <h1>Quartz vs Granite Worktops</h1>
          <p className="lp-hero__subtitle">
            An honest 2026 UK comparison. Both are excellent kitchen worktop materials —
            here is exactly where each one wins, what they cost, and which to pick for
            your kitchen.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">Get a Free Quote</Link>
            <Link href="/colours" className="btn btn--lg btn--outline">See Quartz Colours</Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Side-by-side comparison</h2>
          <p className="lp-section__lede">No marketing fluff. The real differences.</p>
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__highlight">Quartz</th>
                <th>Granite</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Material type</td><td className="lp-compare__highlight">Engineered (~93% natural quartz crystal + resin)</td><td>100% natural stone</td></tr>
              <tr><td>Stain resistance</td><td className="lp-compare__highlight">Non-porous — no staining</td><td>Porous — needs annual sealing</td></tr>
              <tr><td>Scratch resistance</td><td className="lp-compare__highlight">Excellent (Mohs 7)</td><td>Very good (Mohs 6–7)</td></tr>
              <tr><td>Heat resistance</td><td>Up to ~150°C (use trivet)</td><td className="lp-compare__highlight">Excellent — direct heat OK</td></tr>
              <tr><td>UV resistance</td><td>Some colours can fade in direct sun (indoor only)</td><td className="lp-compare__highlight">No fading — outdoor-safe</td></tr>
              <tr><td>Pattern variety</td><td className="lp-compare__highlight">Hundreds of designs including marble effects</td><td>Natural patterns only</td></tr>
              <tr><td>Consistency slab-to-slab</td><td className="lp-compare__highlight">Perfect — engineered to match</td><td>Every slab is unique</td></tr>
              <tr><td>Maintenance</td><td className="lp-compare__highlight">Wipe with soapy water</td><td>Reseal every 6–12 months</td></tr>
              <tr><td>Hygiene</td><td className="lp-compare__highlight">Non-porous — bacteria cannot soak in</td><td>Bacteria can collect in unsealed pores</td></tr>
              <tr><td>Repairability</td><td>Chips can be filled by professionals</td><td className="lp-compare__highlight">Chips repairable, often resealable</td></tr>
              <tr><td>Price per m² supply</td><td>From £214</td><td className="lp-compare__highlight">From £180</td></tr>
              <tr><td>Lifespan</td><td>25+ years</td><td>25+ years</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>When granite is the right choice</h2>
            <ul>
              <li><strong>You want a one-of-a-kind kitchen.</strong> Every granite slab is unique. If the soul of the worktop matters to you, granite has natural character quartz cannot replicate.</li>
              <li><strong>You bake a lot or use very hot pans.</strong> Granite tolerates direct heat without any resin to soften.</li>
              <li><strong>You want an outdoor kitchen.</strong> Most quartz is rated indoor-only because UV can fade pigments. Granite is outdoor-safe.</li>
              <li><strong>You will reseal annually.</strong> If you do not mind 30 minutes of maintenance once a year, granite is essentially equivalent on stain resistance.</li>
            </ul>

            <h2>When quartz is the right choice</h2>
            <ul>
              <li><strong>You want marble-look without the marble problems.</strong> Calacatta and Statuario printed quartz are visually indistinguishable from Italian marble but never stain.</li>
              <li><strong>You want zero maintenance.</strong> No sealing, no specialist cleaners — just soapy water.</li>
              <li><strong>You want predictable design.</strong> The sample you choose is exactly what gets fitted. With granite you have to approve the actual slab.</li>
              <li><strong>You have light cabinets and want consistency.</strong> Crisp whites and soft greys are harder to find in granite without significant natural variation.</li>
              <li><strong>You want the highest hygiene rating.</strong> Non-porous = bacteria cannot soak in. Important for households with food allergies.</li>
            </ul>

            <h2>The verdict for a typical British kitchen</h2>
            <p>
              For 8 out of 10 UK kitchens we quote, quartz is the better choice. The
              stain resistance and zero-maintenance benefits compound over a 25-year
              ownership window. Where granite still wins is for owner-cooks who use very
              hot pans, design enthusiasts who want unique natural stone, and outdoor
              kitchens.
            </p>
            <p>
              Browse our{' '}
              <Link href="/colours">full quartz colour range</Link> or read about our{' '}
              <Link href="/printed-quartz-worktops">printed quartz options</Link> for the
              marble look. Or just{' '}
              <Link href="/quote">request free samples</Link> of both — we deliver up to
              five.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Frequently asked questions</h2>
          <div className="lp-faq">
            {faqs.map((faq) => (
              <div className="lp-faq__item" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta-banner">
        <div className="lp-cta-banner__container">
          <h2>Still undecided?</h2>
          <p>Order free samples of both materials and see them under your own kitchen lighting before you commit.</p>
          <Link href="/quote" className="btn btn--gold btn--lg">Get Free Samples</Link>
        </div>
      </section>
    </>
  );
}
