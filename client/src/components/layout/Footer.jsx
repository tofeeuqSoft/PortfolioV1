import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';

function VisitorCounter() {
  const { data } = useFetch('/analytics/public');
  if (!data?.totalViews) return null;
  return (
    <span className="font-mono text-xs text-slate-400">
      👁 {data.totalViews.toLocaleString()} visits
    </span>
  );
}

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#journey', label: 'Journey' },
  { href: '/#contact', label: 'Contact' },
];

export default function Footer() {
  const { data: profile } = useFetch('/profile');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/70 dark:border-white/10">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <Link to="/" className="font-mono text-lg font-bold">
            <span className="gradient-text">&lt;Tofeeuq /&gt;</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-600 dark:text-slate-400">
            {profile?.title || 'Full Stack MERN Developer'} building reliable, scalable web apps.
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Quick links
          </h3>
          <ul className="space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Elsewhere
          </h3>
          <ul className="space-y-2 text-sm">
            {profile?.socials?.github && (
              <li>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  GitHub
                </a>
              </li>
            )}
            {profile?.socials?.linkedin && (
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  LinkedIn
                </a>
              </li>
            )}
            <li>
              <Link
                to="/admin/login"
                className="text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/70 dark:border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© {year} Tauhidul Islam. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <VisitorCounter />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-ghost"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
