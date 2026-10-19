import { describe, it, expect } from 'vitest';
import { renderMarkdown, readingTime } from './markdown.js';

describe('readingTime', () => {
  it('returns at least 1 for empty content', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('   ')).toBe(1);
  });

  it('rounds to 1 for ~200 words', () => {
    const words = Array.from({ length: 200 }, () => 'word').join(' ');
    expect(readingTime(words)).toBe(1);
  });

  it('rounds to 2 for ~400 words', () => {
    const words = Array.from({ length: 400 }, () => 'word').join(' ');
    expect(readingTime(words)).toBe(2);
  });
});

describe('renderMarkdown', () => {
  it('renders headings to HTML', () => {
    expect(renderMarkdown('# Title')).toContain('<h1');
  });

  it('renders lists', () => {
    const html = renderMarkdown('- one\n- two');
    expect(html).toContain('<ul');
    expect(html).toContain('<li>');
  });

  it('strips <script> tags', () => {
    const html = renderMarkdown('<script>alert(1)</script>hello');
    expect(html).not.toContain('<script');
    expect(html).toContain('hello');
  });

  it('removes javascript: URLs', () => {
    const html = renderMarkdown('[click](javascript:alert(1))');
    expect(html).not.toContain('javascript:');
  });

  it('keeps safe links', () => {
    const html = renderMarkdown('[site](https://example.com)');
    expect(html).toContain('href="https://example.com"');
  });
});
