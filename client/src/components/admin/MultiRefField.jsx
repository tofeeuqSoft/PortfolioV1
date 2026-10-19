import { useEffect, useState } from 'react';
import api, { apiError } from '../../services/api.js';

/**
 * Checkbox multi-select backed by another API resource.
 * `value` is an array of ids; `onChange` receives the next array.
 */
export default function MultiRefField({ value = [], optionsEndpoint, labelKey = 'title', onChange }) {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get(optionsEndpoint)
      .then(({ data }) => active && setOptions(data.data))
      .catch((err) => active && setError(apiError(err)));
    return () => {
      active = false;
    };
  }, [optionsEndpoint]);

  const selected = (Array.isArray(value) ? value : []).map((v) =>
    typeof v === 'string' ? v : v?._id
  );

  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-slate-200/70 p-3 dark:border-white/10">
      {options.map((opt) => (
        <label key={opt._id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(opt._id)}
            onChange={() => toggle(opt._id)}
          />
          {opt[labelKey]}
        </label>
      ))}
      {!options.length && <span className="text-xs text-slate-500">No options available.</span>}
    </div>
  );
}
