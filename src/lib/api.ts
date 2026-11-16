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
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 419)
      return 'Your session expired. Refresh the page and sign in again.';
    if (error.response?.status === 429)
      return 'Too many requests. Please wait a minute and try again.';
    return (
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to connect. Check that the API is running.')
    );
  }
  return 'Something went wrong. Please try again.';
}

export function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
