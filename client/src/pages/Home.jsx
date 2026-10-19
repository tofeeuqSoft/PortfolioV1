import { useEffect, useState } from 'react';
import api, { apiError, assetUrl } from '../services/api.js';
import Seo from '../components/Seo.jsx';
import Hero from '../components/sections/Hero.jsx';
import About from '../components/sections/About.jsx';
import Skills from '../components/sections/Skills.jsx';
import Projects from '../components/sections/Projects.jsx';
import Services from '../components/sections/Services.jsx';
import Journey from '../components/sections/Journey.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import BlogPreview from '../components/sections/BlogPreview.jsx';
import GithubActivity from '../components/sections/GithubActivity.jsx';
import Contact from '../components/sections/Contact.jsx';
import TechMarquee from '../components/sections/TechMarquee.jsx';
import { HomeSkeleton } from '../components/ui/Skeleton.jsx';

const DEFAULT_VISIBLE = {
  about: true,
  skills: true,
  projects: true,
  services: true,
  journey: true,
  testimonials: true,
  blog: true,
  contact: true,
};

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/profile'),
      api.get('/projects'),
      api.get('/skills'),
      api.get('/education'),
      api.get('/training'),
      api.get('/services'),
      api.get('/testimonials'),
      api.get('/posts'),
    ])
      .then(([profile, projects, skills, education, training, services, testimonials, posts]) => {
        if (!active) return;
        setData({
          profile: profile.data.data,
          projects: projects.data.data,
          skills: skills.data.data,
          education: education.data.data,
          training: training.data.data,
          services: services.data.data,
          testimonials: testimonials.data.data,
          posts: posts.data.data,
        });
      })
      .catch((err) => active && setError(apiError(err)));
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold">Couldn&apos;t load the portfolio</h1>
        <p className="text-slate-500">{error}</p>
        <p className="text-sm text-slate-400">Make sure the API server is running.</p>
      </div>
    );
  }

  if (!data) return <HomeSkeleton />;

  const { profile } = data;
  const visible = { ...DEFAULT_VISIBLE, ...(profile.visibleSections || {}) };
  const stats = {
    projects: data.projects.length,
    technologies: data.skills.length,
    certificates: data.training.filter((t) => t.certificateUrl).length || data.training.length,
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.title,
    description: profile.pitch || profile.objective,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    image: profile.photoUrl ? assetUrl(profile.photoUrl) : undefined,
    email: profile.email || undefined,
    address: profile.location
      ? { '@type': 'PostalAddress', addressLocality: profile.location }
      : undefined,
    sameAs: [profile.socials?.github, profile.socials?.linkedin].filter(Boolean),
    knowsAbout: data.skills.map((s) => s.name),
  };

  return (
    <>
      <Seo
        title={profile.fullName}
        description={profile.pitch || 'Full Stack MERN Developer portfolio.'}
        image={profile.photoUrl ? assetUrl(profile.photoUrl) : undefined}
        jsonLd={personJsonLd}
      />
      <Hero profile={profile} />
      <TechMarquee
        items={[
          ...new Set([
            ...data.skills.map((s) => s.name),
            ...data.projects.flatMap((p) => p.techStack || []),
          ]),
        ]}
      />
      {visible.about && <About profile={profile} stats={stats} />}
      {visible.skills && <Skills skills={data.skills} />}
      {visible.projects && <Projects projects={data.projects} />}
      {visible.services && <Services services={data.services} />}
      {visible.journey && <Journey education={data.education} training={data.training} />}
      {visible.testimonials && <Testimonials testimonials={data.testimonials} />}
      {visible.blog && <BlogPreview posts={data.posts} />}
      <GithubActivity />
      {visible.contact && <Contact profile={profile} />}
    </>
  );
}
