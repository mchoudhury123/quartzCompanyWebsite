import { useEffect } from 'react';

/**
 * usePageMeta – lightweight per-page SEO for this SPA.
 * Sets document.title, the meta description, and (optionally) a
 * JSON-LD structured-data block while the page is mounted.
 *
 * @param {string} title        Full <title> for the page.
 * @param {string} description  Meta description text.
 * @param {object} [jsonLd]     Optional JSON-LD object (schema.org).
 */
export default function usePageMeta(title, description, jsonLd) {
  useEffect(() => {
    if (title) document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-jsonld', 'true');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [title, description, jsonLd]);
}
