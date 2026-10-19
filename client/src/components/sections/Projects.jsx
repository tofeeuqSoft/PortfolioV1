import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../ui/Section.jsx';
import { assetUrl } from '../../services/api.js';

export default function Projects({ projects = [] }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const topViewedId = useMemo(() => {
    if (!projects.length) return null;
    const top = projects.reduce((a, b) => ((b.views || 0) > (a.views || 0) ? b : a));
    return (top.views || 0) > 0 ? top._id : null;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCategory = category === 'All' || p.category === category;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        (p.techStack || []).some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [projects, category, query]);

  return (
    <Section
      id="projects"
      eyebrow="// projects"
      title="Featured projects"
      description="Real MERN work with live links and source code."
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'border border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-brand-400/40 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="field sm:max-w-xs"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <article
            key={project._id}
            className={`group flex flex-col overflow-hidden rounded-2xl p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl ${
              project.featured
                ? 'gradient-border'
                : 'border border-slate-200 bg-white/80 hover:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-400/40'
            }`}
          >
            {project.images?.[0] && (
              <div className="-mx-6 -mt-6 mb-4 h-40 overflow-hidden">
                <img
                  src={assetUrl(project.images[0])}
                  alt={`${project.title} preview`}
                  width="400"
                  height="160"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="mb-4 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {project.featured && (
                  <span className="chip border-brand-500/40 bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    Featured
                  </span>
                )}
                {topViewedId === project._id && (
                  <span className="chip border-accent-cyan/40 bg-accent-cyan/10 text-cyan-600 dark:text-accent-cyan">
                    Most viewed
                  </span>
                )}
              </div>
            </div>
            <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">{project.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.techStack || []).slice(0, 4).map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={`/projects/${project.slug}`} className="btn-brand !px-4 !py-2 text-xs">
                Case study
              </Link>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !px-4 !py-2 text-xs"
                >
                  Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !px-4 !py-2 text-xs"
                >
                  Code
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <p className="text-slate-500">No projects match your search.</p>
      )}
    </Section>
  );
}
