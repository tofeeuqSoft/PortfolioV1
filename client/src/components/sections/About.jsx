import Section from '../ui/Section.jsx';
import { assetUrl } from '../../services/api.js';
import useCountUp from '../../hooks/useCountUp.js';

function StatCard({ value, label }) {
  const { ref, value: count } = useCountUp(value);
  return (
    <div ref={ref} className="card text-center">
      <p className="text-3xl font-extrabold gradient-text">{count}+</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}

export default function About({ profile, stats }) {
  return (
    <Section
      id="about"
      eyebrow="// about"
      title="About me"
      description="A quick look at who I am and what I focus on."
    >
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="mx-auto w-full max-w-xs">
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            {profile?.photoUrl ? (
              <img
                src={assetUrl(profile.photoUrl)}
                alt={profile.fullName}
                width="320"
                height="320"
                loading="lazy"
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 font-mono text-5xl font-bold text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-600">
                TI
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.location && <span className="chip">📍 {profile.location}</span>}
            <span className="chip">💼 {profile?.title || 'MERN Developer'}</span>
          </div>
        </div>

        <div>
          <p className="text-slate-600 dark:text-slate-300">{profile?.bio}</p>
          {profile?.objective && (
            <blockquote className="mt-5 border-l-2 border-brand-500 pl-4 italic text-slate-600 dark:text-slate-400">
              {profile.objective}
            </blockquote>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard value={stats?.projects ?? 0} label="Projects built" />
            <StatCard value={stats?.technologies ?? 0} label="Technologies" />
            <StatCard value={stats?.certificates ?? 0} label="Certificates" />
          </div>
        </div>
      </div>
    </Section>
  );
}
