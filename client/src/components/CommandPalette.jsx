import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const SECTIONS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Journey', id: 'journey' },
  { label: 'Contact', id: 'contact' },
];

export default function CommandPalette({ extra = [] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [projects, setProjects] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/projects')
      .then(({ data }) => setProjects(data.data))
      .catch(() => {});
  }, []);

  const commands = useMemo(() => {
    const list = [];
    SECTIONS.forEach((s) =>
      list.push({ id: `section-${s.id}`, label: s.label, group: 'Sections', go: () => scrollTo(s.id) })
    );
    list.push({ id: 'page-blog', label: 'Blog', group: 'Pages', go: () => navigate('/blog') });
    projects.forEach((p) =>
      list.push({
        id: `project-${p._id}`,
        label: p.title,
        group: 'Projects',
        go: () => navigate(`/projects/${p.slug}`),
      })
    );
    extra.forEach((e) => list.push(e));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, extra, navigate]);

  function scrollTo(id) {
    if (window.location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const run = (cmd) => {
    setOpen(false);
    cmd.go();
  };

  const onFormKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-24 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onFormKeyDown}
          placeholder="Jump to a section or project…"
          className="w-full border-b border-slate-200/70 bg-transparent px-5 py-4 outline-none dark:border-white/10"
        />
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.map((cmd, i) => (
            <li key={cmd.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => run(cmd)}
                className={`flex w-full items-center justify-between px-5 py-2.5 text-left text-sm ${
                  i === active ? 'bg-brand-500/10 text-brand-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{cmd.label}</span>
                <span className="font-mono text-xs text-slate-400">{cmd.group}</span>
              </button>
            </li>
          ))}
          {!filtered.length && (
            <li className="px-5 py-4 text-sm text-slate-500">No matches.</li>
          )}
        </ul>
        <div className="border-t border-slate-200/70 px-5 py-2 text-right text-xs text-slate-400 dark:border-white/10">
          Ctrl/⌘ + K to toggle
        </div>
      </div>
    </div>
  );
}
