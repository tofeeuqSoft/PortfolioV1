import { useEffect } from 'react';

const SITE_NAME = 'Tauhidul Islam · Full Stack MERN Developer';
const SCRIPT_ID = 'route-structured-data';

function setMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(data) {
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = SCRIPT_ID;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Sets the document title, description, canonical URL, Open Graph / Twitter
 * tags, and optional JSON-LD structured data for the current route.
 */
export default function Seo({ title, description, image, type = 'website', jsonLd }) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    const url = window.location.href;
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
    setCanonical(url);
    setJsonLd(jsonLdString ? JSON.parse(jsonLdString) : null);

    return () => setJsonLd(null);
  }, [title, description, image, type, jsonLdString]);

  return null;
}
