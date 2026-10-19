import { Link } from 'react-router-dom';
import Section from '../ui/Section.jsx';

export default function BlogPreview({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <Section
      id="blog"
      eyebrow="// blog"
      title="Learning notes"
      description="Write-ups on what I'm building and learning."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <article key={post._id} className="card flex flex-col">
            <div className="mb-3 flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 2).map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-semibold">
              <Link to={`/blog/${post.slug}`} className="hover:text-brand-500">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
              {post.excerpt}
            </p>
            <p className="mt-4 font-mono text-xs text-slate-500">
              {post.readingTime || 1} min read
            </p>
          </article>
        ))}
      </div>

      <Link to="/blog" className="btn-ghost mt-8">
        Read all posts →
      </Link>
    </Section>
  );
}
