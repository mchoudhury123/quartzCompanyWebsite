import MaterialContent from '../../_components/MaterialContent';
import { materialData } from '../../_lib/material-data';

export function generateStaticParams() {
  return [{ type: 'quartz' }, { type: 'printed-quartz' }];
}

export function generateMetadata({ params }) {
  const m = materialData[params.type];
  if (!m) return { title: 'Material Not Found' };
  return {
    title: `${m.heroTitle} – ${m.heroSubtitle}`,
    description: m.introduction.slice(0, 160),
    alternates: { canonical: `/materials/${params.type}` },
  };
}

export default function MaterialPage({ params }) {
  return <MaterialContent type={params.type} />;
}
