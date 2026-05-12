import CatalogueContent from '../_components/CatalogueContent';

export const metadata = {
  title: 'Quartz Worktop Colours – 60+ Designs from £214/m²',
  description:
    'Browse our complete range of quartz kitchen worktop colours: veined Calacatta, plain whites, dark sparkles, marble-effect printed quartz. Free samples posted UK-wide.',
  alternates: { canonical: '/colours' },
};

export default function CataloguePage() {
  return <CatalogueContent category="all" />;
}
