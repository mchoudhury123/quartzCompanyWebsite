import productsData from '../src/data/products.json';

const BASE_URL = 'https://www.thequartzcompany.co.uk';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/kitchens', priority: 0.95, changeFrequency: 'monthly' },
    { path: '/printed-quartz-worktops', priority: 0.95, changeFrequency: 'monthly' },
    { path: '/quartz-vs-granite', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/quartz-vs-gemini', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/quartz-vs-caesarstone', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/colours', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/colours/veined', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/colours/plain', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/materials/quartz', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/materials/printed-quartz', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/quote', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/how-to-buy', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/measuring-guide', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/design-options', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/installation-coverage', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/warranty', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/sale', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/careers', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...productsData.map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
