export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/quote/view/', '/api/'],
      },
    ],
    sitemap: 'https://thequartzcompany.co.uk/sitemap.xml',
  };
}
