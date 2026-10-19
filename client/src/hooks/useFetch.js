import { useCallback, useEffect, useRef, useState } from 'react';
import api, { apiError } from '../services/api';

/**
 * Small data-fetching hook around axios with loading/error state.
 */
export default function useFetch(url, { initial = null, deps = [] } = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      if (mounted.current) setData(res.data.data);
    } catch (err) {
      if (mounted.current) setError(apiError(err));
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: load, setData };
}
