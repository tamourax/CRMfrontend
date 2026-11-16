import { useLogout } from '../features/auth/queries';
import { useState } from 'react';

import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ChartNoAxesCombined,
  ChevronRight,
  Command,
  Handshake,
  LayoutDashboard,
  LogOut,
  Orbit,
  Sparkles,
  Users,
  Moon,
  Sun,
} from 'lucide-react';
import { errorMessage } from '../lib/api';
import type { User } from '../types';
import { useTheme } from '../preferences/ThemeProvider';
import { useLocale, useT } from '../preferences/LocaleProvider';

export function WorkspaceLayout({ user }: { user: User }) {
  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
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
            7B <span className="brand-dot">AHMED TAMER</span>
          </span>
        </Link>
        <div className="workspace-switch">
          <span className="workspace-mark">O</span>
          <div>
            {t('layout.salesWorkspace')}<small>{t('layout.personalWorkspace')}</small>
          </div>
          <ChevronRight size={14} />
        </div>
        <div className="nav-label">{t('nav.section')}</div>
        <nav aria-label="Main navigation">
          {[
            { to: '/', icon: LayoutDashboard, text: t('nav.overview'), end: true },
            { to: '/customers', icon: Users, text: t('nav.customers') },
            { to: '/deals', icon: Handshake, text: t('nav.deals') },
            { to: '/assistant', icon: Sparkles, text: t('nav.assistant') },
          ].map(({ to, icon: Icon, text, end }) => (
            <NavLink end={end} key={to} to={to} onClick={() => setMobileOpen(false)}>
              <Icon size={19} />
              <span>{text}</span>
              {to === '/assistant' && <span className="new-pill">AI</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-row">
            <span className="avatar">{initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{t('layout.salesRepresentative')}</small>
            </div>
            <button
              aria-label={t('layout.signOut')}
              title={t('layout.signOut')}
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
            <button className="preference-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button type="button" className="locale-toggle" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? t('common.arabic') : 'EN'}</button>
            <span className="live-dot" aria-label="Online" />
            <span className="topbar-avatar" aria-label={user.name}>{initials}</span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
