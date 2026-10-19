import { useEffect, useState } from 'react';
import api, { apiError } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import ImageListField from './ImageListField.jsx';
import MultiRefField from './MultiRefField.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';

function emptyValues(fields) {
  return fields.reduce((acc, f) => {
    if (f.type === 'images' || f.type === 'multiref') acc[f.name] = [];
    else acc[f.name] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
    return acc;
  }, {});
}

function toInput(field, value) {
  if (field.type === 'images') return Array.isArray(value) ? value : [];
  if (field.type === 'multiref') {
    return Array.isArray(value) ? value.map((v) => (typeof v === 'string' ? v : v?._id)) : [];
  }
  if (field.type === 'tags') return Array.isArray(value) ? value.join(', ') : value || '';
  return value ?? '';
}

function fromInput(field, value) {
  if (field.type === 'images' || field.type === 'multiref') {
    return Array.isArray(value) ? value : [];
  }
  if (field.type === 'tags') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  if (field.type === 'number') return Number(value) || 0;
  if (field.type === 'checkbox') return Boolean(value);
  return value;
}

export default function ResourceManager({ title, endpoint, fields, columns }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyValues(fields));
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const isEmpty = (value) =>
    value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && !value.length);

  const fieldError = (field) => {
    if (!field.required) return '';
    if (field.type === 'checkbox') return '';
    const value = fromInput(field, form[field.name]);
    return isEmpty(value) ? `${field.label} is required.` : '';
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data.data);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const reset = () => {
    setForm(emptyValues(fields));
    setEditId(null);
    setShowErrors(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (fields.some((f) => fieldError(f))) {
      setShowErrors(true);
      return;
    }
    setBusy(true);
    const payload = fields.reduce((acc, f) => {
      acc[f.name] = fromInput(f, form[f.name]);
      return acc;
    }, {});
    try {
      if (editId) await api.put(`${endpoint}/${editId}`, payload);
      else await api.post(endpoint, payload);
      toast.success(`${title.charAt(0).toUpperCase() + title.slice(1)} ${editId ? 'updated' : 'created'}.`);
      reset();
      await load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const onEdit = (item) => {
    setEditId(item._id);
    setForm(
      fields.reduce((acc, f) => {
        acc[f.name] = toInput(f, item[f.name]);
        return acc;
      }, {})
    );
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success('Deleted.');
      await load();
    } catch (err) {
      setError(apiError(err));
      toast.error(apiError(err));
    }
  };

  const moveItem = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((it, i) => ({ ...it, order: i })));
    try {
      await Promise.all(
        next.map((it, i) => api.put(`${endpoint}/${it._id}`, { order: i }))
      );
    } catch (err) {
      setError(apiError(err));
      toast.error('Could not reorder. Restored previous order.');
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="card space-y-4">
        <h3 className="text-lg font-semibold">{editId ? 'Edit' : 'Add'} {title}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const invalid = showErrors && Boolean(fieldError(field));
            const fieldClass = `field ${
              invalid ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/30' : ''
            }`;
            const errorId = `${endpoint}-${field.name}-error`;
            return (
              <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                <label htmlFor={`${endpoint}-${field.name}`} className="mb-1 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={`${endpoint}-${field.name}`}
                    className={fieldClass}
                    value={form[field.name]}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? errorId : undefined}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={`${endpoint}-${field.name}`}
                    rows={3}
                    className={fieldClass}
                    value={form[field.name]}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? errorId : undefined}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    id={`${endpoint}-${field.name}`}
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.checked }))}
                  />
                ) : field.type === 'images' ? (
                  <ImageListField
                    value={form[field.name]}
                    onChange={(next) => setForm((f) => ({ ...f, [field.name]: next }))}
                  />
                ) : field.type === 'multiref' ? (
                  <MultiRefField
                    value={form[field.name]}
                    optionsEndpoint={field.optionsEndpoint}
                    labelKey={field.labelKey}
                    onChange={(next) => setForm((f) => ({ ...f, [field.name]: next }))}
                  />
                ) : (
                  <input
                    id={`${endpoint}-${field.name}`}
                    type={field.type === 'number' ? 'number' : 'text'}
                    className={fieldClass}
                    value={form[field.name]}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? errorId : undefined}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                  />
                )}
                {invalid ? (
                  <p id={errorId} className="mt-1 text-xs text-red-500">
                    {fieldError(field)}
                  </p>
                ) : (
                  field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
            {editId ? 'Save changes' : 'Create'}
          </button>
          {editId && (
            <button type="button" onClick={reset} className="btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="pb-3 pr-4 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }).map((_, row) => (
                <tr key={`skeleton-${row}`} className="border-t border-slate-200/70 dark:border-white/10">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 pr-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                  <td className="py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                </tr>
              ))}

            {!loading &&
              items.map((item, index) => (
              <tr key={item._id} className="border-t border-slate-200/70 dark:border-white/10">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 pr-4">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      title="Move up"
                      className="disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Move down"
                      title="Move down"
                      className="disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button type="button" onClick={() => onEdit(item)} className="text-brand-500 hover:underline">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={columns.length + 1} className="py-4 text-slate-500">
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
