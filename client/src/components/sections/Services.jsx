import Section from '../ui/Section.jsx';

export default function Services({ services = [] }) {
  if (!services.length) return null;

  return (
    <Section
      id="services"
      eyebrow="// services"
      title="What I can do for you"
      description="Engagements I take on, from a single API to a full product."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div key={service._id} className="card">
            <div className="mb-3 text-3xl">{service.icon || '⚡'}</div>
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
