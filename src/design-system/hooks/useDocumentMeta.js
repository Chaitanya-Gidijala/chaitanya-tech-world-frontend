import { useEffect } from 'react';

function setMeta(name, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * useDocumentMeta — sets <title>, description and keywords for the current page.
 * Replaces the copy-pasted `document.querySelector('meta…')` blocks in each page.
 */
export function useDocumentMeta({ title, description, keywords } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('description', description);
    setMeta('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
  }, [title, description, keywords]);
}
