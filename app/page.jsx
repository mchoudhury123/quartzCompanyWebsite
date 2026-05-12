import HomeContent from './_components/HomeContent';

export const metadata = {
  title: 'Affordable Quartz Worktops UK',
  description:
    'Affordable engineered & printed quartz kitchen worktops, handcrafted in Britain. Free samples, fixed-price quotes, 25-year warranty. UK delivery and fitting.',
  alternates: { canonical: '/' },
};

const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What materials do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We specialise in two types of premium worktop: engineered quartz and full body printed quartz. Both are non-porous, scratch resistant and incredibly durable.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do worktops cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most kitchens fall between £2,000 and £5,000 fully fitted, depending on colour, thickness, edge profile and complexity.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer free samples?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — up to five free samples posted directly to your door so you can see and feel the surface in your own kitchen lighting.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you cover for installation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Northamptonshire and surrounding counties: Warwickshire, Leicestershire, Buckinghamshire, Bedfordshire, Oxfordshire, Cambridgeshire and parts of the West Midlands.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On-site fitting takes 2–4 hours for a typical kitchen, up to a full day for islands or waterfall edges. Total lead time from order is 10–20 working days.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <HomeContent />
    </>
  );
}
