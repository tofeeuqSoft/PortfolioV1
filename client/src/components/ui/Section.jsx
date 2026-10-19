import useReveal from '../../hooks/useReveal';

export default function Section({ id, eyebrow, title, description, children, className = '' }) {
  const ref = useReveal();
  return (
    <section id={id} className={`section container-page ${className}`}>
      <div ref={ref} className="reveal">
        {eyebrow && (
          <p className="mb-2 font-mono text-sm text-brand-500 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        {(title || description) && (
          <header className="mb-10 max-w-2xl">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
                <span className="heading-underline" aria-hidden="true" />
              </h2>
            )}
            {description && (
              <p className="mt-3 text-slate-600 dark:text-slate-400">{description}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
