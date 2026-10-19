import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { apiError } from '../services/api.js';
import { renderMarkdown } from '../utils/markdown.js';
import Seo from '../components/Seo.jsx';
import { DetailSkeleton } from '../components/ui/Skeleton.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setPost(null);
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => active && setPost(data.data))
      .catch((err) => active && setError(apiError(err)));
    return () => {
      active = false;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-slate-500">{error}</p>
        <Link to="/blog" className="btn-primary">
          All posts
        </Link>
      </div>
    );
  }

  if (!post) return <DetailSkeleton />;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags?.join(', '),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  return (
    <article className="container-page max-w-3xl py-16">
      <Seo
        title={post.title}
        description={post.excerpt}
        type="article"
        jsonLd={articleJsonLd}
      />
      <Link to="/blog" className="text-sm text-brand-500 hover:underline">
        ← All posts
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500">
        <time>
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
        </time>
        <span>{post.readingTime || 1} min read</span>
        {(post.tags || []).map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <div
        className="markdown-body mt-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.contentMarkdown) }}
      />
    </article>
  );
}
