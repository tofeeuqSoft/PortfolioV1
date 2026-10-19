import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../services/api.js';
import Seo from '../components/Seo.jsx';
import { ListSkeleton } from '../components/ui/Skeleton.jsx';

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const [tag, setTag] = useState('All');

  useEffect(() => {
    api
      .get('/posts')
      .then(({ data }) => setPosts(data.data))
      .catch((err) => setError(apiError(err)));
  }, []);

  const tags = useMemo(
    () => ['All', ...new Set((posts || []).flatMap((p) => p.tags || []))],
    [posts]
  );
  const filtered = useMemo(
    () => (posts || []).filter((p) => tag === 'All' || (p.tags || []).includes(tag)),
    [posts, tag]
  );

  if (error) return <div className="container-page py-24 text-center text-slate-500">{error}</div>;
  if (!posts) return <ListSkeleton />;

  return (
    <div className="container-page py-16">
      <Seo title="Blog" description="Learning notes and write-ups." />
      <h1 className="text-3xl font-extrabold sm:text-4xl">Learning notes</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Thoughts on building and learning with the MERN stack.
      </p>

      {tags.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tag === t
                  ? 'bg-brand-500 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {filtered.map((post) => (
          <article key={post._id} className="card flex flex-col">
            <div className="mb-3 flex flex-wrap gap-2">
              {(post.tags || []).map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold">
              <Link to={`/blog/${post.slug}`} className="hover:text-brand-500">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between font-mono text-xs text-slate-500">
              <span>{post.readingTime || 1} min read</span>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
            </div>
          </article>
        ))}
        {!filtered.length && <p className="text-slate-500">No posts yet.</p>}
      </div>

      <Link to="/" className="btn-ghost mt-10">
        ← Back home
      </Link>
    </div>
  );
}
