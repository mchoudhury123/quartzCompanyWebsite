import Link from 'next/link';
import '../_components/landing.css';

export const metadata = {
  title: 'Quartz Kitchen Worktops UK – From £214/m²',
  description:
    'Affordable engineered and printed quartz kitchen worktops, handcrafted in Britain. Free samples, fixed-price quotes, 25-year warranty. Compare colours, edges and prices.',
  alternates: { canonical: '/kitchens' },
  openGraph: {
    title: 'Quartz Kitchen Worktops UK | The Quartz Company',
    description:
      'Affordable engineered and printed quartz kitchen worktops, handcrafted in Britain.',
    url: '/kitchens',
  },
};

const faqs = [
  {
    q: 'Are quartz worktops good for kitchens?',
    a: 'Yes — quartz is one of the most popular kitchen worktop materials in the UK for good reason. It is non-porous so it does not stain, harder than granite so it resists scratches, heat resistant to around 150°C, and requires no sealing. It is virtually maintenance-free and comes in hundreds of colours and patterns including realistic marble effects.',
  },
  {
    q: 'How much do quartz kitchen worktops cost?',
    a: 'Our quartz kitchen worktops start from £214/m² for 20mm engineered slabs. A typical UK kitchen worktop is 4–6m² of usable surface, so most kitchens come in between £1,800 and £3,500 supply only, or £2,500 to £5,000 fully fitted with templating, cutting, edge profiling and installation.',
  },
  {
    q: 'How long do quartz worktops last in a kitchen?',
    a: 'A properly installed quartz worktop will easily last 25+ years of daily kitchen use. We back ours with a 25-year warranty. Unlike laminate, which can chip or delaminate, or wood, which needs periodic re-oiling, quartz is essentially set-and-forget.',
  },
  {
    q: 'Quartz vs granite for a kitchen — which is better?',
    a: 'Both are excellent. Quartz wins on consistency (every slab matches), stain resistance (it never needs sealing), and pattern variety (including printed marble effects that look identical to natural marble at a fraction of the price). Granite wins on heat resistance and the appeal of a one-of-a-kind natural stone. For most UK kitchens, quartz is the more practical choice.',
  },
  {
    q: 'Can you install quartz kitchen worktops across the UK?',
    a: 'Yes. We deliver UK-wide and offer professional templating and installation across Northamptonshire and the surrounding counties (Warwickshire, Leicestershire, Buckinghamshire, Bedfordshire, Oxfordshire, Cambridgeshire). For other parts of the UK we deliver to your fitter or can recommend trusted installers.',
  },
  {
    q: 'How long does a kitchen worktop installation take?',
    a: 'From order, a typical lead time is 10–20 working days including templating, fabrication and fitting. The on-site fitting itself takes 2–4 hours for a standard kitchen, or up to a full day for kitchens with islands, mitred waterfall edges or integrated sinks.',
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
    { '@type': 'ListItem', position: 2, name: 'Quartz Kitchen Worktops', item: 'https://www.thequartzcompany.co.uk/kitchens' },
  ],
};

export default function KitchensPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="lp-hero">
        <div className="lp-hero__container">
          <h1>Quartz Kitchen Worktops</h1>
          <p className="lp-hero__subtitle">
            Affordable engineered &amp; printed quartz worktops for British kitchens.
            Hundreds of colours, fixed-price quotes, free samples and a 25-year warranty.
            From £214 per square metre.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">
              Get a Free Quote
            </Link>
            <Link href="/colours" className="btn btn--lg btn--outline">
              Browse Colours
            </Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>Why quartz is the smart choice for British kitchens</h2>
            <p>
              Quartz has overtaken granite as the most popular worktop material in UK
              kitchens — and for good reason. It is engineered from roughly 93% natural
              quartz crystal combined with resins and pigments, creating a surface that is
              <strong> harder than granite, completely non-porous, and consistent from slab to slab</strong>.
              You get the look of natural stone with none of the drawbacks.
            </p>
            <p>
              At The Quartz Company we specialise in two grades: standard{' '}
              <Link href="/materials/quartz">engineered quartz</Link>, available in over
              60 colours from plain whites and speckled neutrals to dramatic veined
              patterns; and{' '}
              <Link href="/printed-quartz-worktops">full-body printed quartz</Link>,
              where the veining pattern runs right through the slab so mitred edges,
              waterfall ends and undermount sinks look flawless.
            </p>

            <h3>The five reasons homeowners choose quartz</h3>
            <ul>
              <li>
                <strong>It will not stain.</strong> Non-porous, so red wine, turmeric,
                coffee and oil wipe away with a damp cloth. No annual sealing like granite
                or marble.
              </li>
              <li>
                <strong>It is incredibly hard-wearing.</strong> Mohs hardness of around 7
                — that is harder than steel knives, which is why we ask you to still use
                a chopping board (the knife loses, not the worktop).
              </li>
              <li>
                <strong>It handles heat well.</strong> Stable up to about 150°C.
                Trivets recommended for very hot pans, but everyday cooking presents no
                issue.
              </li>
              <li>
                <strong>The colour you see is the colour you get.</strong> Unlike granite
                where every slab is a one-off, quartz is engineered to a consistent
                pattern, so the worktop you see in a sample is the worktop you end up
                with.
              </li>
              <li>
                <strong>It looks like the most expensive stone you can buy.</strong> Our
                printed Calacatta and Statuario ranges are visually indistinguishable from
                real Italian marble, at a fraction of the price and without the staining
                problem.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">How quartz compares for a kitchen</h2>
          <p className="lp-section__lede">
            Honest comparison across the materials British homeowners actually consider.
          </p>
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__highlight">Quartz</th>
                <th>Granite</th>
                <th>Laminate</th>
                <th>Solid wood</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stain resistance</td>
                <td className="lp-compare__highlight">Excellent — non-porous</td>
                <td>Needs sealing</td>
                <td>Good</td>
                <td>Poor — stains easily</td>
              </tr>
              <tr>
                <td>Scratch resistance</td>
                <td className="lp-compare__highlight">Excellent</td>
                <td>Very good</td>
                <td>Fair</td>
                <td>Poor</td>
              </tr>
              <tr>
                <td>Heat resistance</td>
                <td className="lp-compare__highlight">Up to ~150°C</td>
                <td>Excellent</td>
                <td>Poor</td>
                <td>Poor</td>
              </tr>
              <tr>
                <td>Maintenance</td>
                <td className="lp-compare__highlight">Wipe clean</td>
                <td>Annual sealing</td>
                <td>Wipe clean</td>
                <td>Re-oil every few months</td>
              </tr>
              <tr>
                <td>Consistency slab-to-slab</td>
                <td className="lp-compare__highlight">Perfect</td>
                <td>Every slab is unique</td>
                <td>Consistent print</td>
                <td>Natural variation</td>
              </tr>
              <tr>
                <td>Lifespan</td>
                <td className="lp-compare__highlight">25+ years</td>
                <td>25+ years</td>
                <td>5–10 years</td>
                <td>10–20 years</td>
              </tr>
              <tr>
                <td>Cost per m²</td>
                <td className="lp-compare__highlight">From £214</td>
                <td>From £180</td>
                <td>From £30</td>
                <td>From £80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Choosing the right colour for your kitchen</h2>
          <p className="lp-section__lede">
            The right worktop depends on your cabinets, your lighting and how much drama
            you want the kitchen to have.
          </p>
          <div className="lp-grid-2">
            <div className="lp-card">
              <h3>For white or cream cabinets</h3>
              <p>
                Veined whites and greys are the most popular pairing. Calacatta Classico
                and Statuario Gold give that Italian-marble look without the maintenance.
                For something quieter, Bianco Merino or Blanco White read as crisp and
                bright.
              </p>
            </div>
            <div className="lp-card">
              <h3>For navy, sage or dark cabinets</h3>
              <p>
                A dramatic veined white or warm Carrara reads beautifully against deep
                colours. Lincoln (a soft warm white) is a designer favourite for shaker
                kitchens in muted greens and blues.
              </p>
            </div>
            <div className="lp-card">
              <h3>For wood or oak cabinets</h3>
              <p>
                Warm-toned veined quartz like Calacatta Lusso bridges the wood tones
                without competing. For a more contemporary look, Bianco Galaxy adds subtle
                metallic flecks that pick up oak grain beautifully.
              </p>
            </div>
            <div className="lp-card">
              <h3>For dark or industrial kitchens</h3>
              <p>
                Nero Sparkle is our go-to: deep charcoal with fine mica flecks that catch
                pendant lighting. Pairs exceptionally well with brass or copper fittings
                and concrete-effect splashbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Frequently asked questions about quartz kitchens</h2>
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
          <h2>Ready to spec your kitchen worktops?</h2>
          <p>
            Get up to five free samples posted to your door and a fixed-price quote
            within 24 hours. No site visit needed for the initial quote.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">
              Get Free Quote &amp; Samples
            </Link>
            <Link href="/colours" className="btn btn--lg btn--outline">
              View Colour Range
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
