import { useState } from 'react';
import Section from '../ui/Section.jsx';
import api, { apiError } from '../../services/api.js';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'A valid email is required';
  if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function Contact({ profile }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    setStatus({ type: 'idle', message: '' });
    try {
      await api.post('/contact', values);
      setValues(EMPTY);
      setStatus({ type: 'success', message: 'Thanks! Your message has been sent.' });
    } catch (err) {
      setStatus({ type: 'error', message: apiError(err) });
    } finally {
      setSending(false);
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="// contact"
      title="Get in touch"
      description="Have a role, project or question? Send a message and I'll reply."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="card" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input id="name" name="name" value={values.name} onChange={onChange} className="field" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input id="email" name="email" type="email" value={values.email} onChange={onChange} className="field" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="subject" className="mb-1 block text-sm font-medium">
              Subject
            </label>
            <input id="subject" name="subject" value={values.subject} onChange={onChange} className="field" />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea id="message" name="message" rows={5} value={values.message} onChange={onChange} className="field" />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          {/* Honeypot — hidden from real users, catches bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
          </div>

          <button type="submit" disabled={sending} className="btn-primary mt-6 disabled:opacity-60">
            {sending ? 'Sending…' : 'Send message'}
          </button>

          {status.message && (
            <p
              role="status"
              className={`mt-4 rounded-xl px-4 py-2 text-sm ${
                status.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {status.message}
            </p>
          )}
        </form>

        <div className="space-y-4">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="card block">
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{profile.email}</p>
            </a>
          )}
          {profile?.phone && (
            <a href={`tel:${profile.phone}`} className="card block">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-medium">{profile.phone}</p>
            </a>
          )}
          {profile?.location && (
            <div className="card">
              <p className="text-sm text-slate-500">Location</p>
              <p className="font-medium">{profile.location}</p>
            </div>
          )}
          <div className="flex gap-3">
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
                GitHub
              </a>
            )}
            {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
