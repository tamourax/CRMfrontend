const currentLocale = () => (document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US');

export const money = (value: string | number) =>
  new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
export const compactMoney = (value: string | number) =>
  new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency: 'EGP',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Number(value));
export const dateLabel = (value: string | null | undefined) =>
  value
    ? new Intl.DateTimeFormat(currentLocale(), {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
    : currentLocale() === 'ar-EG'
      ? 'غير محدد'
      : 'Not scheduled';

export const titleCase = (value: string) =>
  value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
