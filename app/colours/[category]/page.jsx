import CatalogueContent from '../../_components/CatalogueContent';
import categories from '../../../src/data/categories.json';

export function generateStaticParams() {
  return categories
    .filter((c) => c.slug !== 'all')
    .map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return { title: 'Colours' };
  return {
    title: `${cat.name} Quartz Worktops`,
    description: cat.description,
    alternates: { canonical: `/colours/${params.category}` },
  };
}

export default function CategoryPage({ params }) {
  return <CatalogueContent category={params.category} />;
}
