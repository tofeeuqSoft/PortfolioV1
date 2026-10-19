import { useEffect, useMemo, useState } from 'react';
import Section from '../ui/Section.jsx';
import { assetUrl } from '../../services/api.js';

export default function Testimonials({ testimonials = [] }) {
  const items = useMemo(() => testimonials.filter((t) => t.visible !== false), [testimonials]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const active = items[Math.min(index, items.length - 1)];

  return (
    <Section
      id="testimonials"
      eyebrow="// testimonials"
      title="Recommendations"
      description="What mentors and collaborators say."
    >
      <div className="card mx-auto max-w-3xl text-center">
        <blockquote className="text-lg italic text-slate-700 dark:text-slate-200">
          “{active.message}”
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3">
          {active.avatarUrl ? (
            <img
              src={assetUrl(active.avatarUrl)}
              alt={active.name}
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 font-semibold text-brand-500">
              {active.name.charAt(0)}
            </span>
          )}
          <div className="text-left">
            <p className="font-semibold">{active.name}</p>
            <p className="text-sm text-slate-500">{active.role}</p>
          </div>
        </div>

        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item._id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
