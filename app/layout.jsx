import '../src/styles/global.css';
import Header from './_components/Header';
import Footer from './_components/Footer';

export const metadata = {
  metadataBase: new URL('https://thequartzcompany.co.uk'),
  title: {
    default: 'Affordable Quartz Worktops UK | The Quartz Company',
    template: '%s | The Quartz Company',
  },
  description:
    'Affordable engineered & printed quartz kitchen worktops, handcrafted in Britain. Free samples, fixed-price quotes, 25-year warranty. UK delivery and fitting.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'The Quartz Company',
    locale: 'en_GB',
    images: ['/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Quartz Company',
  legalName: 'Quartz Company SP Ltd',
  url: 'https://thequartzcompany.co.uk',
  logo: 'https://thequartzcompany.co.uk/logo.png',
  description: 'Affordable engineered and printed quartz kitchen worktops, handcrafted in Britain.',
  identifier: 'Company No. 17057823',
  telephone: '+44 7375 303416',
  email: 'sales@thequartzcompany.co.uk',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Northamptonshire',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.instagram.com/thequartzcompanyuk/',
    'https://www.facebook.com/profile.php?id=61587732770864',
    'https://www.tiktok.com/@thequartzcompany',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Quartz Company',
  url: 'https://thequartzcompany.co.uk',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://thequartzcompany.co.uk/colours?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
