import Link from 'next/link';
import '../_components/landing.css';

export const metadata = {
  title: 'Printed Quartz Worktops UK – Full-Body Marble Effect',
  description:
    'Full-body printed quartz worktops where the pattern runs through the whole slab. Perfect for waterfall edges, mitres and undermount sinks. UK supply, fitting and 25-year warranty.',
  alternates: { canonical: '/printed-quartz-worktops' },
  openGraph: {
    title: 'Printed Quartz Worktops UK | The Quartz Company',
    description:
      'Full-body printed quartz worktops where the pattern runs through the whole slab.',
    url: '/printed-quartz-worktops',
  },
};

const faqs = [
  {
    q: 'What is printed quartz?',
    a: 'Printed quartz (sometimes called full-body printed quartz) is engineered quartz where the marble-effect veining is replicated all the way through the depth of the slab, not just on the surface. The result is a worktop that looks like a single block of natural marble — including on mitred edges, waterfall ends and the cutout for an undermount sink.',
  },
  {
    q: 'How is it different from standard engineered quartz?',
    a: 'Standard engineered quartz has the pattern on the top surface. When you cut a 90-degree mitred edge (the corner where a waterfall island folds down), the side of the cut shows a slightly different cross-section — usually a thin uniform band. Printed quartz solves this: the veining flows continuously across the mitre, so the join is invisible and the surface looks like a solid marble block.',
  },
  {
    q: 'Does printed quartz look real?',
    a: 'Side-by-side with natural Calacatta or Statuario marble, most people cannot tell them apart. The advantage over real marble is that printed quartz is non-porous, stain-resistant, scratch-resistant and never needs sealing — none of which is true of natural marble.',
  },
  {
    q: 'Where does printed quartz make the biggest difference?',
    a: 'Three places: (1) waterfall island ends, where the vein flowing over the edge is the centrepiece of the kitchen; (2) mitred 40mm or 60mm worktop edges, where the chunky front face reveals the cross-section; and (3) undermount sink cutouts, where the inside edge of the cut is fully visible.',
  },
  {
    q: 'Is printed quartz more expensive?',
    a: 'A little. Expect a 10–20% premium over standard engineered quartz of the same colour. Considering printed quartz is the affordable alternative to Italian marble — which can cost 3–5× as much and stains — it remains the most cost-effective way to get the high-end marble look.',
  },
  {
    q: 'Can I see what it looks like before ordering?',
    a: 'Yes — order up to five free samples and we will post them to you. Samples are cut from the same slab material we use for full worktops, so you see exactly the colour, finish and depth of vein.',
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
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thequartzcompany.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Printed Quartz Worktops', item: 'https://thequartzcompany.co.uk/printed-quartz-worktops' },
  ],
};

export default function PrintedQuartzPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="lp-hero">
        <div className="lp-hero__container">
          <h1>Printed Quartz Worktops</h1>
          <p className="lp-hero__subtitle">
            Full-body printed quartz where the marble vein runs continuously through the
            entire slab. The affordable, stain-proof alternative to Italian marble — for
            kitchens that need a flawless mitre, waterfall or undermount sink.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">Get a Free Quote</Link>
            <Link href="/colours/veined" className="btn btn--lg btn--outline">View Printed Range</Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__container">
          <div className="lp-prose">
            <h2>What makes printed quartz different</h2>
            <p>
              Standard engineered quartz has the colour and pattern printed on the top
              surface only. That works perfectly for the worktop you look down at — but
              the moment you do a 90-degree mitre (for example a waterfall island
              cascading down the side), the cut reveals a band of plain quartz on the
              vertical face. The marble vein stops at the top edge.
            </p>
            <p>
              <strong>Full-body printed quartz solves this.</strong> The veining is
              extruded through the depth of the slab during manufacture, so a mitred cut
              shows the same continuous pattern on both the horizontal and vertical
              faces. The waterfall edge looks like a single solid block of marble. The
              undermount sink cutout looks like solid marble. The 40mm or 60mm thick
              front profile looks like solid marble.
            </p>
            <p>
              For most kitchens this is the difference between a worktop that says
              &ldquo;nice engineered stone&rdquo; and one that says &ldquo;is that real
              Calacatta?&rdquo; — except yours never stains, never needs sealing, and
              cost a fraction of the price.
            </p>

            <h3>Where it matters most</h3>
            <ul>
              <li>
                <strong>Waterfall island edges.</strong> The single most photographed
                feature of any modern kitchen. With printed quartz the vein flows
                seamlessly from the worktop, over the edge and down the side.
              </li>
              <li>
                <strong>Thick mitred worktop fronts.</strong> A 40mm or 60mm chunky front
                profile is built from two 20mm slabs mitred at the front edge. With
                printed quartz the mitre disappears.
              </li>
              <li>
                <strong>Undermount sinks.</strong> The cut edge of the sink hole is
                always visible. With printed quartz, the vein continues through.
              </li>
              <li>
                <strong>Hob cutouts and breakfast bars.</strong> Any exposed edge benefits
                from continuous veining.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <div className="lp-section__container">
          <h2 className="lp-section__heading">Printed quartz vs natural marble</h2>
          <p className="lp-section__lede">
            The look is the same. The performance and price are not.
          </p>
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__highlight">Printed Quartz</th>
                <th>Natural Calacatta / Statuario Marble</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Appearance</td>
                <td className="lp-compare__highlight">Indistinguishable at arm's length</td>
                <td>Unique natural veining</td>
              </tr>
              <tr>
                <td>Stain resistance</td>
                <td className="lp-compare__highlight">Excellent — non-porous</td>
                <td>Poor — porous, stains from wine, coffee, citrus</td>
              </tr>
              <tr>
                <td>Etching from acids</td>
                <td className="lp-compare__highlight">None</td>
                <td>Etches from lemon, vinegar, tomato</td>
              </tr>
              <tr>
                <td>Sealing required</td>
                <td className="lp-compare__highlight">Never</td>
                <td>Every 6–12 months</td>
              </tr>
              <tr>
                <td>Cost per m² (typical)</td>
                <td className="lp-compare__highlight">From £240</td>
                <td>£600–£1,200</td>
              </tr>
              <tr>
                <td>Maintenance</td>
                <td className="lp-compare__highlight">Wipe clean</td>
                <td>Careful daily care, specialist cleaning</td>
              </tr>
            </tbody>
          </table>
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
          <h2>See it in your own kitchen</h2>
          <p>
            Free samples posted to your door. See the depth of vein under your own
            lighting before you commit to a full kitchen.
          </p>
          <div className="lp-hero__ctas">
            <Link href="/quote" className="btn btn--gold btn--lg">Order Free Samples</Link>
            <Link href="/kitchens" className="btn btn--lg btn--outline">Quartz for Kitchens</Link>
          </div>
        </div>
      </section>
    </>
  );
}
