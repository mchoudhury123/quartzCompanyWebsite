import PrivacyContent from '../_components/PrivacyContent';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for The Quartz Company — how we collect, use and protect your personal data under UK GDPR.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
