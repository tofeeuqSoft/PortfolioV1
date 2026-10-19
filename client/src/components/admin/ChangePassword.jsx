import { useState } from 'react';
import api, { apiError } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

function FieldError({ name, touched, errors }) {
  if (!touched[name] || !errors[name]) return null;
  return (
    <p id={`${name}-error`} className="mt-1 text-xs text-red-500">
      {errors[name]}
    </p>
  );
}

function validate(form) {
  return {
    currentPassword: form.currentPassword ? '' : 'Enter your current password.',
    newPassword:
      form.newPassword.length >= 8 ? '' : 'New password must be at least 8 characters.',
    confirmPassword:
      form.confirmPassword === form.newPassword ? '' : 'New passwords do not match.',
  };
}

export default function ChangePassword() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState({});

  const errors = validate(form);
  const isValid = Object.values(errors).every((e) => !e);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const fieldProps = (name) => {
    const invalid = Boolean(touched[name] && errors[name]);
    return {
      name,
      value: form[name],
      onChange,
      onBlur,
      'aria-invalid': invalid || undefined,
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
      className: `field ${
        invalid ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/30' : ''
      }`,
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (!isValid) return;
    setStatus({ type: 'idle', message: '' });
    setBusy(true);
    try {
      await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(EMPTY);
      setTouched({});
      setStatus({ type: 'success', message: 'Password updated successfully.' });
      toast.success('Password updated successfully.');
    } catch (err) {
      setStatus({ type: 'error', message: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="card max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Change password</h3>

      <div>
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium">
          Current password
        </label>
        <input id="currentPassword" type="password" autoComplete="current-password" {...fieldProps('currentPassword')} />
        <FieldError name="currentPassword" touched={touched} errors={errors} />
      </div>
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
          New password
        </label>
        <input id="newPassword" type="password" autoComplete="new-password" {...fieldProps('newPassword')} />
        {touched.newPassword && errors.newPassword ? (
          <FieldError name="newPassword" touched={touched} errors={errors} />
        ) : (
          <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
        )}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...fieldProps('confirmPassword')}
        />
        <FieldError name="confirmPassword" touched={touched} errors={errors} />
      </div>

      {status.message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-xl px-4 py-2 text-sm ${
            status.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={busy || !isValid} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
