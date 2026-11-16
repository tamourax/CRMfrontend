import { translate } from '../preferences/LocaleProvider';
import axios from 'axios';

export const sessionExpiredEvent = 'crm:session-expired';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  timeout: 65000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((request) => {
  request.headers.set(
    'Accept-Language',
    localStorage.getItem('orbit-locale') === 'ar' ? 'ar' : 'en',
  );
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event(sessionExpiredEvent));
    }
    return Promise.reject(error);
  },
);

export function errorMessage(error: unknown): string {
  const text = (key: string) =>
    translate('errors.' + key, localStorage.getItem('orbit-locale') === 'ar' ? 'ar' : 'en');
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 419) return text('expired');
    if (error.response?.status === 429) return text('limited');
    return (
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? text('timeout') : text('connection'))
    );
  }
  return text('unknown');
}

export function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
