import CookiesContent from '../_components/CookiesContent';

export const metadata = {
  title: 'Cookie Policy',
  description: 'Information about the cookies used on The Quartz Company website and how to manage your cookie preferences.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
