import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

/**
 * Converts markdown to sanitized HTML safe for dangerouslySetInnerHTML.
 */
export function renderMarkdown(markdown = '') {
  const raw = marked.parse(markdown);
  return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
}

export function readingTime(markdown = '') {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
