import Section from '../ui/Section.jsx';
import useReveal from '../../hooks/useReveal.js';

function TimelineItem({ year, title, subtitle, result, links }) {
  const ref = useReveal();
  return (
    <li ref={ref} className="reveal relative pl-10">
      <span className="absolute left-1.5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-500 ring-4 ring-brand-500/20" />
      <div className="mb-10">
        {year && <p className="font-mono text-xs text-brand-500 dark:text-brand-400">{year}</p>}
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
        {result && <p className="mt-1 text-sm text-slate-500">{result}</p>}
        {links?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost !px-3 !py-1.5 text-xs"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function Timeline({ children }) {
  const lineRef = useReveal({ threshold: 0.1 });
  return (
    <div className="relative">
      <span className="absolute left-0 top-0 h-full w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
      <span
        ref={lineRef}
        aria-hidden="true"
        className="timeline-line absolute left-0 top-0 h-full w-px bg-gradient-to-b from-brand-500 via-accent-cyan to-accent-violet"
      />
      <ol>{children}</ol>
    </div>
  );
}

export default function Journey({ education = [], training = [] }) {
  return (
    <Section
      id="journey"
      eyebrow="// journey"
      title="Education & training"
      description="The path so far — from classroom fundamentals to full-stack delivery."
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 text-xl font-semibold">Education</h3>
          <Timeline>
            {education.map((item) => (
              <TimelineItem
                key={item._id}
                year={item.passingYear}
                title={item.institution}
                subtitle={[item.degree, item.field].filter(Boolean).join(' · ')}
                result={item.result}
              />
            ))}
            {!education.length && <li className="pl-10 text-slate-500">No entries yet.</li>}
          </Timeline>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">Training & certificates</h3>
          <Timeline>
            {training.map((item) => (
              <TimelineItem
                key={item._id}
                year={item.year}
                title={item.title}
                subtitle={[item.provider, item.batch].filter(Boolean).join(' · ')}
                links={[
                  item.certificateUrl && { label: 'Certificate', href: item.certificateUrl },
                  item.assessmentUrl && { label: 'Assessment', href: item.assessmentUrl },
                ].filter(Boolean)}
              />
            ))}
            {!training.length && <li className="pl-10 text-slate-500">No entries yet.</li>}
          </Timeline>
        </div>
      </div>
    </Section>
  );
}
