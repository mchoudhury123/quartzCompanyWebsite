export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/quote/view/', '/api/'],
      },
    ],
    sitemap: 'https://www.thequartzcompany.co.uk/sitemap.xml',
  };
}
