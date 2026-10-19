import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { apiError, assetUrl } from '../services/api.js';
import Seo from '../components/Seo.jsx';
import { DetailSkeleton } from '../components/ui/Skeleton.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/projects/${slug}`)
      .then(({ data }) => active && setProject(data.data))
      .catch((err) => active && setError(apiError(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (error || !project) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-slate-500">{error || 'This project may have been removed.'}</p>
        <Link to="/#projects" className="btn-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: project.liveUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
    codeRepository: project.githubUrl || undefined,
    keywords: (project.techStack || []).join(', '),
    image: project.images?.[0] ? assetUrl(project.images[0]) : undefined,
    author: { '@type': 'Person', name: 'Tauhidul Islam' },
  };

  return (
    <article className="container-page py-16">
      <Seo
        title={project.title}
        description={project.summary}
        type="article"
        image={project.images?.[0] ? assetUrl(project.images[0]) : undefined}
        jsonLd={projectJsonLd}
      />

      <Link to="/#projects" className="text-sm text-brand-500 hover:underline">
        ← Back to projects
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="chip">{project.category}</span>
          {project.featured && <span className="chip border-brand-500/40 text-brand-500">Featured</span>}
        </div>
        <h1 className="text-3xl font-extrabold sm:text-5xl">{project.title}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Live demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              View code
            </a>
          )}
        </div>
      </header>

      {project.images?.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {project.images.map((img) => (
            <img
              key={img}
              src={assetUrl(img)}
              alt={`${project.title} screenshot`}
              width="640"
              height="400"
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-2xl border border-slate-200/70 dark:border-white/10"
            />
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          {project.description && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Overview</h2>
              <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                {project.description}
              </p>
            </section>
          )}

          {project.features?.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Key features</h2>
              <ul className="space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-slate-600 dark:text-slate-300">
                    <span className="text-brand-500">▹</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.challenges && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Challenges & solutions</h2>
              <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                {project.challenges}
              </p>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200/70 p-6 dark:border-white/10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {(project.techStack || []).map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">👁 {project.views || 0} views</p>
        </aside>
      </div>
    </article>
  );
}
