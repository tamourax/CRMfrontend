import { useLogin } from './queries';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Handshake, LoaderCircle, Orbit, ShieldCheck } from 'lucide-react';
import { errorMessage } from '../../lib/api';
import { useLocale, useT } from '../../preferences/LocaleProvider';

export function LoginPage() {
  const [email, setEmail] = useState('alex@orbit.example');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const { locale, setLocale } = useLocale();
  const t = useT();
  function submit(event: FormEvent) {
    event.preventDefault();
    login.mutate({ email, password });
  }
  return (
    <main className="login-page">
      <section className="login-story">
        <Link to="/" className="brand">
          <Orbit size={30} />
          <span>
            orbit<span className="brand-dot">.</span>
          </span>
        </Link>
        <div>
          <div className="eyebrow light">YOUR NEXT OPPORTUNITY STARTS HERE</div>
          <h1>
            Good relationships.
            <br />
            Great possibilities.
          </h1>
          <p>
            A little more clarity. A lot more momentum.
            <br />
            Your customers, deals, and next move — together.
          </p>
          <div className="orbit-art" aria-hidden="true">
            <div />
            <div />
            <div />
            <span>
              <Handshake size={48} />
            </span>
            <i />
            <b />
          </div>
        </div>
        <span className="login-caption">A thoughtful workspace for moving business forward.</span>
      </section>
      <section className="login-form-side">
        <button className="locale-toggle" type="button" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? 'عربي' : 'EN'}</button>
        <div className="login-form">
          <span className="welcome-icon">
            <Building2 size={23} />
          </span>
          <h2>{t('Welcome back')}</h2>
          <p>{t('Sign in to your sales workspace.')}</p>
          <form onSubmit={submit}>
            <label htmlFor="email">{t('Work email')}</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password">{t('Password')}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('Enter your password')}
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
                  {t('Sign in')} <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <div className="demo-hint">
            <ShieldCheck size={18} />
            <p>
              {t('Demo workspace')}
              <br />
              <span>{t('Use the seeded account and password from the README.')}</span>
            </p>
          </div>
        </div>
        <span className="login-footer">Orbit CRM · Built for a clearer picture.</span>
      </section>
    </main>
  );
}
