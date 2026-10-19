import { Router } from 'express';
import Project from '../models/Project.js';
import Post from '../models/Post.js';

const router = Router();

function siteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.CLIENT_ORIGIN?.split(',')[0] ||
    'http://localhost:5173'
  ).replace(/\/$/, '');
}

function escapeXml(value = '') {
  return String(value).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });
}

router.get('/robots.txt', (req, res) => {
  const base = siteUrl();
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');
  res.type('text/plain').send(body);
});

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const base = siteUrl();
    const [projects, posts] = await Promise.all([
      Project.find().select('slug updatedAt'),
      Post.find({ status: 'published' }).select('slug updatedAt'),
    ]);

    const staticUrls = ['', 'blog'].map((p) => ({
      loc: `${base}/${p}`.replace(/\/$/, p === '' ? '/' : ''),
      priority: p === '' ? '1.0' : '0.6',
    }));

    const urls = [
      ...staticUrls,
      ...projects.map((p) => ({
        loc: `${base}/projects/${p.slug}`,
        lastmod: p.updatedAt?.toISOString(),
        priority: '0.8',
      })),
      ...posts.map((p) => ({
        loc: `${base}/blog/${p.slug}`,
        lastmod: p.updatedAt?.toISOString(),
        priority: '0.5',
      })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map((u) =>
        [
          '  <url>',
          `    <loc>${escapeXml(u.loc)}</loc>`,
          u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
          `    <priority>${u.priority}</priority>`,
          '  </url>',
        ]
          .filter(Boolean)
          .join('\n')
      ),
      '</urlset>',
      '',
    ].join('\n');

    res.type('application/xml').send(xml);
  } catch (err) {
    next(err);
  }
});

export default router;
