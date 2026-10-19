import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || baseURL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export function assetUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function apiError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
}

export default api;
