import { useEffect } from 'react';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://chaitanyatechworld.com').replace(/\/$/, '');

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
  const id = 'ctw-jsonld';
  let script = document.getElementById(id);
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * useDocumentMeta — per-page <title>, description, keywords, canonical URL,
 * Open Graph / Twitter cards, robots and JSON-LD structured data.
 *
 * Mirrors what scripts/prerender.mjs bakes into the static HTML for crawlers,
 * so client-side navigation and the first server response always agree.
 */
export function useDocumentMeta({ title, description, keywords, path, image, robots, jsonLd } = {}) {
  const jsonKey = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    setMeta('name', 'robots', robots ?? 'index, follow');
    setCanonical(url);

    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    setJsonLd(jsonKey ? JSON.parse(jsonKey) : null);
  }, [title, description, keywords, path, image, robots, jsonKey]);
}
