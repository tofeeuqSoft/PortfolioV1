import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'blog', label: 'Blog', to: '/blog' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return undefined;
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const goTo = (id) => {
    setOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition ${
        scrolled
          ? 'border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80'
          : 'border-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="font-mono text-lg font-bold">
          <span className="gradient-text">&lt;Tofeeuq /&gt;</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <Link
                key={item.id}
                to={item.to}
                aria-current={location.pathname === item.to ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === item.to
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={isHome && active === item.id ? 'true' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isHome && active === item.id
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="rounded-lg border border-slate-300 p-2 md:hidden dark:border-white/15"
          >
            <span
              className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${
                open ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`mt-1 block h-0.5 w-5 bg-current transition-opacity duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`mt-1 block h-0.5 w-5 bg-current transition-transform duration-300 ${
                open ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <div
        aria-hidden={!open}
        className={`overflow-hidden border-t border-slate-200/70 bg-white/95 backdrop-blur transition-all duration-300 ease-out md:hidden dark:border-white/10 dark:bg-slate-950/95 ${
          open ? 'max-h-96 translate-y-0 opacity-100' : 'max-h-0 -translate-y-2 opacity-0'
        }`}
      >
        <nav className="container-page flex flex-col py-3" aria-label="Mobile">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              onClick={() => {
                if (item.to) {
                  setOpen(false);
                  navigate(item.to);
                } else {
                  goTo(item.id);
                }
              }}
              className={`rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
