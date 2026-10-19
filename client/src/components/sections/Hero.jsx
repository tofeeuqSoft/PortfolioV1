import { useEffect, useState } from 'react';
import { assetUrl, API_ORIGIN } from '../../services/api.js';

function useTypewriter(words, speed = 90) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0]);
      return undefined;
    }
    const current = words[index % words.length];
    const delay = deleting ? speed / 2 : speed;

    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setDeleting(true);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, speed]);

  return text;
}

export default function Hero({ profile }) {
  const roles = profile?.heroRoles?.length ? profile.heroRoles : ['Full Stack MERN Developer'];
  const typed = useTypewriter(roles);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative overflow-hidden pt-16 sm:pt-24">
      <div className="container-page grid items-center gap-12 pb-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="animate-fade-up">
          {profile?.availableForWork && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Available for work
            </span>
          )}

          <p className="font-mono text-sm text-brand-500 dark:text-brand-400">
            &gt; building scalable MERN apps
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Hi, I&apos;m <span className="gradient-text">{profile?.fullName || 'Tauhidul Islam'}</span>
          </h1>
          <p className="mt-4 flex h-8 items-center font-mono text-lg text-slate-600 dark:text-slate-300">
            <span>{typed}</span>
            <span className="ml-1 inline-block h-5 w-0.5 animate-blink bg-brand-500 align-middle" />
          </p>
          <p className="mt-5 max-w-xl text-slate-600 dark:text-slate-400">
            {profile?.pitch ||
              'I design and build full-stack web applications with React, Node.js, Express and MongoDB.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo('projects')} className="btn-primary">
              View Projects
            </button>
            <a href={assetUrl(profile?.cvUrl) || `${API_ORIGIN}/api/cv/download`} className="btn-ghost">
              Download CV
            </a>
            <button type="button" onClick={() => scrollTo('contact')} className="btn-ghost">
              Contact
            </button>
          </div>

          <div className="mt-8 flex gap-4 text-sm">
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-500">
                GitHub
              </a>
            )}
            {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-500">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 animate-float rounded-full bg-gradient-to-tr from-brand-500/30 via-accent-violet/30 to-accent-cyan/30 blur-2xl" />

          <div className="gradient-border aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl dark:from-slate-800 dark:to-slate-900">
            {profile?.photoUrl ? (
              <img
                src={assetUrl(profile.photoUrl)}
                alt={profile.fullName}
                width="480"
                height="480"
                loading="eager"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-6xl font-bold text-slate-400 dark:text-slate-600">
                TI
              </div>
            )}
          </div>

          {['React', 'Node.js', 'MongoDB', 'Express'].map((tech, i) => (
            <span
              key={tech}
              className={`glass absolute rounded-full px-3 py-1 font-mono text-xs text-slate-700 shadow-lg animate-float-slow dark:text-slate-200 ${
                [
                  '-left-4 top-8',
                  '-right-3 top-1/3',
                  '-left-6 bottom-16',
                  '-right-5 bottom-6',
                ][i]
              }`}
              style={{ animationDelay: `${i * -1.6}s` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
