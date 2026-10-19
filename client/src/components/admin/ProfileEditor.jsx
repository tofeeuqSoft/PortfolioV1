import { useEffect, useState } from 'react';
import api, { apiError, assetUrl } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProfileEditor() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState({});

  const errors = form
    ? {
        fullName: form.fullName?.trim() ? '' : 'Full name is required.',
        email:
          !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            ? ''
            : 'Enter a valid email address.',
      }
    : {};
  const isValid = Object.values(errors).every((e) => !e);

  useEffect(() => {
    api
      .get('/profile')
      .then(({ data }) => setForm(data.data))
      .catch((err) => setStatus(apiError(err)));
  }, []);

  if (!form) return <p className="text-slate-500">Loading profile…</p>;

  const update = (path, value) => {
    setForm((f) => {
      const next = structuredClone(f);
      const keys = path.split('.');
      let ref = next;
      keys.slice(0, -1).forEach((k) => {
        ref[k] = ref[k] || {};
        ref = ref[k];
      });
      ref[keys.at(-1)] = value;
      return next;
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true });
    if (!isValid) return;
    setBusy(true);
    setStatus('');
    try {
      const { data } = await api.put('/profile', form);
      setForm(data.data);
      toast.success('Profile saved.');
    } catch (err) {
      setStatus(apiError(err));
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (file, kind) => {
    const body = new FormData();
    body.append(kind === 'cv' ? 'cv' : 'file', file);
    const { data } = await api.post(`/upload/${kind}`, body);
    return data.data.url;
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, 'image');
      update('photoUrl', url);
      setStatus('Photo uploaded — click Save to apply.');
    } catch (err) {
      setStatus(apiError(err));
    }
  };

  const onCv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadFile(file, 'cv');
      setStatus('CV uploaded.');
    } catch (err) {
      setStatus(apiError(err));
    }
  };

  const fields = [
    ['fullName', 'Full name'],
    ['title', 'Title'],
    ['pitch', 'Hero pitch', 'textarea'],
    ['bio', 'Bio', 'textarea'],
    ['objective', 'Career objective', 'textarea'],
    ['location', 'Location'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['photoUrl', 'Photo URL'],
    ['socials.github', 'GitHub URL'],
    ['socials.linkedin', 'LinkedIn URL'],
  ];

  return (
    <form onSubmit={onSave} className="card space-y-4">
      <h3 className="text-lg font-semibold">Profile & hero</h3>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="heroRoles">
          Hero roles (comma separated)
        </label>
        <input
          id="heroRoles"
          className="field"
          value={(form.heroRoles || []).join(', ')}
          onChange={(e) =>
            update(
              'heroRoles',
              e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            )
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([path, label, type]) => {
          const invalid = Boolean(touched[path] && errors[path]);
          const fieldClass = `field ${
            invalid ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/30' : ''
          }`;
          const errId = `${path}-error`;
          return (
            <div key={path} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label htmlFor={path} className="mb-1 block text-sm font-medium">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  id={path}
                  rows={3}
                  className={fieldClass}
                  value={path.split('.').reduce((o, k) => o?.[k] ?? '', form)}
                  onChange={(e) => update(path, e.target.value)}
                />
              ) : (
                <input
                  id={path}
                  className={fieldClass}
                  value={path.split('.').reduce((o, k) => o?.[k] ?? '', form)}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errId : undefined}
                  onBlur={() => setTouched((t) => ({ ...t, [path]: true }))}
                  onChange={(e) => update(path, e.target.value)}
                />
              )}
              {invalid && (
                <p id={errId} className="mt-1 text-xs text-red-500">
                  {errors[path]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={Boolean(form.availableForWork)}
          onChange={(e) => update('availableForWork', e.target.checked)}
        />
        Show &quot;Available for work&quot; badge
      </label>

      <div className="flex flex-wrap items-center gap-4">
        {form.photoUrl && (
          <img
            src={assetUrl(form.photoUrl)}
            alt="Current"
            className="h-16 w-16 rounded-full object-cover"
          />
        )}
        <label className="btn-ghost cursor-pointer">
          Upload photo
          <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </label>
        <label className="btn-ghost cursor-pointer">
          Upload CV (PDF)
          <input type="file" accept="application/pdf" className="hidden" onChange={onCv} />
        </label>
      </div>

      <fieldset className="rounded-xl border border-slate-200/70 p-4 dark:border-white/10">
        <legend className="px-1 text-sm font-medium">Visible sections</legend>
        <div className="flex flex-wrap gap-4">
          {Object.keys(form.visibleSections || {}).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={form.visibleSections[key] !== false}
                onChange={(e) => update(`visibleSections.${key}`, e.target.checked)}
              />
              {key}
            </label>
          ))}
        </div>
      </fieldset>

      {status && <p className="text-sm text-slate-500">{status}</p>}

      <button type="submit" disabled={busy || !isValid} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
