import { useLogout } from '../features/auth/queries';
import { useState } from 'react';

import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  Command,
  Handshake,
  LayoutDashboard,
  LogOut,
  Orbit,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { errorMessage } from '../lib/api';
import type { User } from '../types';
import { useLocale, useT } from '../preferences/LocaleProvider';

export function WorkspaceLayout({ user }: { user: User }) {
  const logout = useLogout();
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="workspace">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMobileOpen(false)}>
          <Orbit size={28} />
          <span>
            orbit<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace-switch">
          <span className="workspace-mark">O</span>
          <div>
            {t('Sales workspace')}<small>{t('Personal workspace')}</small>
          </div>
          <ChevronRight size={14} />
        </div>
        <div className="nav-label">{t('WORKSPACE')}</div>
        <nav aria-label="Main navigation">
          {[
            { to: '/', icon: LayoutDashboard, text: t('Overview'), end: true },
            { to: '/customers', icon: Users, text: t('Customers') },
            { to: '/deals', icon: Handshake, text: t('Deals') },
            { to: '/assistant', icon: Sparkles, text: t('AI Assistant') },
          ].map(({ to, icon: Icon, text, end }) => (
            <NavLink end={end} key={to} to={to} onClick={() => setMobileOpen(false)}>
              <Icon size={19} />
              <span>{text}</span>
              {to === '/assistant' && <span className="new-pill">AI</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>
              <Sparkles size={19} />
            </span>
            <h3>{t('Your data, a clearer story.')}</h3>
            <p>{t('Ask your assistant about deals, opportunities, and what comes next.')}</p>
            <Link to="/assistant" onClick={() => setMobileOpen(false)}>
              {t('Explore assistant')} <ArrowUpRight size={15} />
            </Link>
          </div>
          <Link className="help-link" to="/assistant">
            <CircleHelp size={17} /> {t('Explore your CRM')} <ArrowUpRight size={13} />
          </Link>
          <div className="user-row">
            <span className="avatar">{initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{t('Sales representative')}</small>
            </div>
            <button
              aria-label={t('Sign out')}
              title={t('Sign out')}
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOut size={17} />
            </button>
          </div>
          {logout.isError && (
            <p className="sidebar-error" role="alert">
              {errorMessage(logout.error)}
            </p>
          )}
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Command size={21} />
          </button>
          <div className="breadcrumb">
            <ChartNoAxesCombined size={17} />
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>Sales</strong>
          </div>
          <div className="topbar-right">
            <button type="button" className="locale-toggle" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? 'عربي' : 'EN'}</button>
            <span className="live-dot" />
            {t('Private workspace')}<span className="topbar-avatar">{initials}</span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="workspace-footer">
          <span>{t('Made for meaningful connections.')}</span>
          <span>
            <ShieldCheck size={13} /> {t('Your workspace. Your data.')}
          </span>
        </footer>
      </div>
    </div>
  );
}
