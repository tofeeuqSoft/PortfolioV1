import { useState } from 'react';
import api, { apiError, assetUrl } from '../../services/api.js';

/**
 * Upload multiple images (POST /upload/image) and manage them as a URL array.
 * `value` is an array of image URLs; `onChange` receives the next array.
 */
export default function ImageListField({ value = [], onChange }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const images = Array.isArray(value) ? value : [];

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const { data } = await api.post('/upload/image', body);
        uploaded.push(data.data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrl('');
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  const move = (index, dir) => {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="group relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200/70 dark:border-white/10"
          >
            <img src={assetUrl(src)} alt={`Project ${i + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-slate-950/60 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                aria-label="Move left"
                className="px-1 text-xs text-white disabled:opacity-30"
                disabled={i === 0}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove image"
                className="px-1 text-xs text-red-300"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                aria-label="Move right"
                className="px-1 text-xs text-white disabled:opacity-30"
                disabled={i === images.length - 1}
              >
                →
              </button>
            </div>
          </div>
        ))}
        {!images.length && (
          <p className="text-sm text-slate-500">No images yet.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-ghost cursor-pointer">
          {busy ? 'Uploading…' : 'Upload images'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={busy} />
        </label>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="url"
            className="field"
            placeholder="…or paste an image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <button type="button" onClick={addUrl} className="btn-ghost !px-3">
            Add
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-slate-500">Hover an image to reorder or remove it.</p>
    </div>
  );
}
