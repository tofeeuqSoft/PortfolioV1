import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api.js';

/**
 * Records a page view on each route change (best-effort, never throws).
 * Skips admin routes.
 */
export default function usePageView() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    api.post('/analytics/pageview').catch(() => {});
  }, [pathname]);
}
