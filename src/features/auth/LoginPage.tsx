import { useLogin } from './queries';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { ArrowRight, Building2, Handshake, LoaderCircle, Orbit } from 'lucide-react';
import { errorMessage } from '../../lib/api';
import { useT } from '../../preferences/LocaleProvider';

export function LoginPage() {
  const [email, setEmail] = useState('ahmed@7bahmedtamer.example');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const t = useT();
  function submit(event: FormEvent) {
    event.preventDefault();
    login.mutate({ email, password });
  }
  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand">
          <Orbit size={28} />
          <span>7B <span className="brand-dot">AHMED TAMER</span></span>
        </div>
        <div className="orbit-art" aria-hidden="true">
          <div />
          <div />
          <div />
          <span><Handshake size={48} /></span>
          <i />
          <b />
        </div>
      </section>
      <section className="login-form-side">
        <div className="login-form">
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
