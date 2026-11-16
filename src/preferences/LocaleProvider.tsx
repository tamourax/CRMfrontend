import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

export type Locale = 'en' | 'ar';

type TranslationKey = string;

function valueAt(dictionary: object, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[part];
  }, dictionary);
  return typeof value === 'string' ? value : undefined;
}

export function translate(key: TranslationKey, locale: Locale): string {
  return valueAt(locale === 'ar' ? ar : en, key) ?? valueAt(en, key) ?? key;
}

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(
  null,
);

function initialLocale(): Locale {
  return localStorage.getItem('orbit-locale') === 'ar' ? 'ar' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const queryClient = useQueryClient();
  const previousLocale = useRef(locale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('orbit-locale', locale);
    if (previousLocale.current !== locale) {
      previousLocale.current = locale;
      void queryClient.invalidateQueries();
    }
  }, [locale, queryClient]);
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}

export function useT() {
  const { locale } = useLocale();
  return (key: TranslationKey, values: Record<string, string | number> = {}) =>
    Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      translate(key, locale),
    );
}
