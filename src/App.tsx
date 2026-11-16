import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Building2, ChartNoAxesCombined, ChevronRight, CircleHelp, Command, Handshake, LayoutDashboard, LoaderCircle, LogOut, Orbit, ShieldCheck, Sparkles, Users } from 'lucide-react';
import axios from 'axios';
import { api, errorMessage } from './lib/api';
import type { User } from './types';
import { Empty, ErrorState, Loading } from './components/ui';
import { CustomersPage, CustomerPage, DealsPage, DealPage } from './pages/Records';
import { ReportPage } from './pages/Report';
import { AssistantPage } from './pages/Assistant';

function Login({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [email, setEmail] = useState('alex@orbit.example');
  const [password, setPassword] = useState('');
  const login = useMutation({ mutationFn: async () => { await api.get('/sanctum/csrf-cookie'); return (await api.post<{ data: User }>('/login', { email, password })).data.data; }, onSuccess });
  function submit(event: FormEvent) { event.preventDefault(); login.mutate(); }
  return <main className="login-page"><section className="login-story"><Link to="/" className="brand"><Orbit size={30}/><span>orbit<span className="brand-dot">.</span></span></Link><div><div className="eyebrow light">YOUR NEXT OPPORTUNITY STARTS HERE</div><h1>Good relationships.<br/>Great possibilities.</h1><p>A little more clarity. A lot more momentum.<br/>Your customers, deals, and next move — together.</p><div className="orbit-art" aria-hidden="true"><div/><div/><div/><span><Handshake size={48}/></span><i/><b/></div></div><span className="login-caption">A thoughtful workspace for moving business forward.</span></section><section className="login-form-side"><div className="login-form"><span className="welcome-icon"><Building2 size={23}/></span><h2>Welcome back</h2><p>Sign in to your sales workspace.</p><form onSubmit={submit}><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)}/><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password"/>{login.isError && <p className="inline-error" role="alert">{errorMessage(login.error)}</p>}<button className="button primary" disabled={login.isPending}>{login.isPending ? <LoaderCircle size={17} className="spin"/> : <>Sign in <ArrowRight size={17}/></>}</button></form><div className="demo-hint"><ShieldCheck size={18}/><p>Demo workspace<br/><span>Use the seeded account and password from the README.</span></p></div></div><span className="login-footer">Orbit CRM · Built for a clearer picture.</span></section></main>;
}

function Workspace({ user }: { user: User }) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({ mutationFn: async () => { await api.get('/sanctum/csrf-cookie'); return api.post('/logout'); }, onSuccess: async () => { await client.cancelQueries(); client.removeQueries({ predicate: query => query.queryKey[0] !== 'user' }); client.setQueryData(['user'], null); navigate('/login'); } });
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user.name.split(' ').map(part => part[0]).slice(0, 2).join('');
  return <div className="workspace"><aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}><Link className="brand" to="/" onClick={() => setMobileOpen(false)}><Orbit size={28}/><span>orbit<span className="brand-dot">.</span></span></Link><div className="workspace-switch"><span className="workspace-mark">O</span><div>Sales workspace<small>Personal workspace</small></div><ChevronRight size={14}/></div><div className="nav-label">WORKSPACE</div><nav aria-label="Main navigation">{[{ to: '/', icon: LayoutDashboard, text: 'Overview', end: true }, { to: '/customers', icon: Users, text: 'Customers' }, { to: '/deals', icon: Handshake, text: 'Deals' }, { to: '/assistant', icon: Sparkles, text: 'AI Assistant' }].map(({ to, icon: Icon, text, end }) => <NavLink end={end} key={to} to={to} onClick={() => setMobileOpen(false)}><Icon size={19}/><span>{text}</span>{to === '/assistant' && <span className="new-pill">AI</span>}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-tip"><span><Sparkles size={19}/></span><h3>Your data, a clearer story.</h3><p>Ask your assistant about deals, opportunities, and what comes next.</p><Link to="/assistant" onClick={() => setMobileOpen(false)}>Explore assistant <ArrowUpRight size={15}/></Link></div><a className="help-link" href="https://github.com/topics/crm" target="_blank" rel="noreferrer"><CircleHelp size={17}/> About this workspace <ArrowUpRight size={13}/></a><div className="user-row"><span className="avatar">{initials}</span><div><strong>{user.name}</strong><small>Sales representative</small></div><button aria-label="Sign out" title="Sign out" disabled={logout.isPending} onClick={() => logout.mutate()}><LogOut size={17}/></button></div>{logout.isError && <p className="sidebar-error" role="alert">{errorMessage(logout.error)}</p>}</div></aside><div className="workspace-main"><header className="topbar"><button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileOpen(!mobileOpen)}><Command size={21}/></button><div className="breadcrumb"><ChartNoAxesCombined size={17}/><span>Workspace</span><ChevronRight size={13}/><strong>Sales</strong></div><div className="topbar-right"><span className="live-dot"/>Private workspace<span className="topbar-avatar">{initials}</span></div></header><main className="main-content"><Routes><Route path="/" element={<ReportPage/>}/><Route path="/customers" element={<CustomersPage/>}/><Route path="/customers/:id" element={<CustomerPage/>}/><Route path="/deals" element={<DealsPage/>}/><Route path="/deals/:id" element={<DealPage/>}/><Route path="/assistant" element={<AssistantPage/>}/><Route path="/login" element={<Navigate replace to="/"/>}/><Route path="*" element={<Empty title="Page not found" description="Choose a page from the navigation to get back to your workspace."/>}/></Routes></main><footer className="workspace-footer"><span>Made for meaningful connections.</span><span><ShieldCheck size={13}/> Your workspace. Your data.</span></footer></div></div>;
}

export function App() {
  const client = useQueryClient();
  const user = useQuery({ queryKey: ['user'], queryFn: async () => (await api.get<{ data: User }>('/api/user')).data.data, retry: false });
  if (user.isPending) return <Loading/>;
  if (user.isError && !(axios.isAxiosError(user.error) && user.error.response?.status === 401)) return <ErrorState error={user.error} retry={() => void user.refetch()}/>;
  if (!user.data) return <Login onSuccess={data => client.setQueryData(['user'], data)}/>;
  return <Workspace user={user.data}/>;
}
