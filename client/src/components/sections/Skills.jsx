import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../ui/Section.jsx';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools'];

function SkillBar({ skill, visible }) {
  const projects = (skill.projects || []).filter((p) => p && p.slug);
  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="font-mono text-slate-500">{skill.level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-[width] duration-1000 ease-out"
          style={{ width: visible ? `${skill.level}%` : '0%' }}
        >
          {visible && (
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent bg-[length:200%_100%]"
            />
          )}
        </div>
      </div>
      {projects.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project.slug}`}
              className="chip hover:border-brand-500/50 hover:text-brand-500"
            >
              {project.title}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

export default function Skills({ skills = [] }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length);

  return (
    <Section
      id="skills"
      eyebrow="// skills"
      title="Skills & technologies"
      description="Grouped by where they sit in the stack, with a confidence level for each."
    >
      <div ref={ref} className="grid gap-6 sm:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.category} className="card">
            <h3 className="mb-4 text-lg font-semibold">{group.category}</h3>
            <ul className="space-y-4">
              {group.items.map((skill) => (
                <SkillBar key={skill._id || skill.name} skill={skill} visible={visible} />
              ))}
            </ul>
          </div>
        ))}
        {!grouped.length && (
          <p className="text-slate-500">No skills yet — add them from the admin dashboard.</p>
        )}
      </div>
    </Section>
  );
}
