import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <Seo title="Page not found" description="The page you are looking for does not exist." />

      <p className="animate-float-slow font-mono text-8xl font-extrabold gradient-text text-glow">
        404
      </p>

      <div className="glass mt-8 w-full max-w-md rounded-2xl p-5 text-left font-mono text-sm">
        <div className="mb-3 flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          <span className="text-brand-500 dark:text-brand-400">$</span> resolve --route{' '}
          {typeof window !== 'undefined' ? window.location.pathname : ''}
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Error: route not found <span className="animate-blink">▌</span>
        </p>
      </div>

      <h1 className="mt-8 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back home
        </Link>
        <Link to="/blog" className="btn-ghost">
          Read the blog
        </Link>
      </div>
    </div>
  );
}
