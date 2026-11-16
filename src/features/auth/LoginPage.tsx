import { useLogin } from './queries';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { ArrowRight, Building2, LoaderCircle } from 'lucide-react';
import { errorMessage } from '../../lib/api';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../preferences/ThemeProvider';
import { useLocale, useT } from '../../preferences/LocaleProvider';

export function LoginPage() {
  const [email, setEmail] = useState('alex@orbit.example');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const t = useT();
  function submit(event: FormEvent) {
    event.preventDefault();
    login.mutate({ email, password });
  }
  return (
    <main className="login-page">
      <section className="login-form-side">
        <button className="preference-toggle login-theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="locale-toggle" type="button" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? t('common.arabic') : 'EN'}</button>
        <div className="login-form">
          <strong className="login-brand">7B AHMED TAMER</strong>
          <span className="welcome-icon">
            <Building2 size={23} />
          </span>
          <h2>{t('auth.welcomeBack')}</h2>
          <p>{t('auth.signInHint')}</p>
          <form onSubmit={submit}>
            <label htmlFor="email">{t('auth.workEmail')}</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
            />
            {login.isError && (
              <p className="inline-error" role="alert">
                {errorMessage(login.error)}
              </p>
            )}
            <button className="button primary" disabled={login.isPending}>
              {login.isPending ? (
                <LoaderCircle size={17} className="spin" />
              ) : (
                <>
                  {t('auth.signIn')} <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
