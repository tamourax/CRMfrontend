import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  timeout: 65000,
  headers: { Accept: 'application/json' },
});

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

export const money = (value: string | number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value));
export const compactMoney = (value: string | number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value));
export const dateLabel = (value: string | null | undefined) =>
  value
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
    : 'Not scheduled';
export const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;
export const titleCase = (value: string) =>
  value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
