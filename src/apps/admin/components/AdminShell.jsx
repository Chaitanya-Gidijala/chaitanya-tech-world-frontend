import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Activity,
  ExternalLink,
  Gauge,
  HeartPulse,
  Image as ImageIcon,
  Inbox,
  LogOut,
  Menu,
  RadioTower,
  ScrollText,
  Users,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/design-system';
import BrandLogo from '@/components/site/BrandLogo';
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary';
import { refreshSession, signOut, useAdminSession } from '../lib/auth';
import { reconnectNow, startLiveMonitor, stopLiveMonitor, useLiveMonitor } from '../lib/liveMonitor';
import { duration } from '../lib/format';
import { useNow } from '../lib/useNow';

const ADMIN_NAV = [
  {
    group: 'Monitor',
    items: [
      { to: '/admin', label: 'Overview', icon: Gauge, end: true },
      { to: '/admin/live', label: 'Live visitors', icon: RadioTower, live: true },
      { to: '/admin/logs', label: 'Activity logs', icon: ScrollText },
      { to: '/admin/health', label: 'System health', icon: HeartPulse },
    ],
  },
  {
    group: 'Manage',
    items: [
      { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/prompts', label: 'Prompt library', icon: ImageIcon },
    ],
  },
];

const STATUS_TEXT = {
  idle: 'Idle',
  connecting: 'Connecting',
  live: 'Live',
  reconnecting: 'Reconnecting',
  offline: 'Offline',
};

/** Route guard: only a valid ROLE_ADMIN session gets past this point. */
export function RequireAdmin({ children }) {
  const session = useAdminSession();
  const location = useLocation();
  if (!session?.isAdmin) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }
  return children;
}

function StreamBadge() {
  const status = useLiveMonitor((s) => s.status);
  const live = useLiveMonitor((s) => s.presence?.breakdown?.live);
  return (
    <button
      type="button"
      className={clsx('ad-stream', `is-${status}`)}
      onClick={reconnectNow}
      title={status === 'live' ? 'Live stream connected' : 'Click to reconnect'}
    >
      <span className="ad-stream__dot" aria-hidden="true" />
      <span className="ad-stream__label">{STATUS_TEXT[status]}</span>
      {live != null && (
        <span className="ad-stream__count">
          <strong>{live}</strong> online
        </span>
      )}
    </button>
  );
}

function Sidebar({ onNavigate }) {
  const live = useLiveMonitor((s) => s.presence?.breakdown?.live);
  return (
    <nav className="ad-nav" aria-label="Admin">
      {ADMIN_NAV.map((section) => (
        <div key={section.group} className="ad-nav__group">
          <p className="ad-nav__heading">{section.group}</p>
          <ul>
            {section.items.map(({ to, label, icon: Icon, end, live: showLive }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={({ isActive }) => clsx('ad-nav__link', isActive && 'is-active')} onClick={onNavigate}>
                  <Icon size={17} aria-hidden="true" />
                  <span>{label}</span>
                  {showLive && live > 0 && <span className="ad-nav__badge">{live}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="ad-nav__group">
        <a href="/" target="_blank" rel="noopener" className="ad-nav__link">
          <ExternalLink size={17} aria-hidden="true" />
          <span>View website</span>
        </a>
      </div>
    </nav>
  );
}

export default function AdminShell() {
  const session = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useNow(30_000);

  // One live stream for the whole dashboard.
  useEffect(() => {
    startLiveMonitor();
    return () => stopLiveMonitor();
  }, []);

  // Watch token expiry.
  useEffect(() => {
    const id = setInterval(refreshSession, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const onSignOut = () => {
    stopLiveMonitor();
    signOut();
    navigate('/admin/login', { replace: true });
  };

  const initials = (session?.name ?? session?.username ?? 'A')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={clsx('ad-app', menuOpen && 'is-menu-open')}>
      <a href="#ad-main" className="ds-skip-link">
        Skip to content
      </a>

      <aside className="ad-sidebar" aria-label="Sidebar">
        <div className="ad-sidebar__brand">
          <Link to="/admin" className="ad-brand">
            <BrandLogo size={30} />
            <span>
              <strong>CTW</strong> Control
            </span>
          </Link>
          <button type="button" className="ad-icon-btn ad-sidebar__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
        <div className="ad-sidebar__foot">
          <div className="ad-user">
            <span className="ad-user__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="ad-user__meta">
              <strong>{session?.name}</strong>
              <span>{session?.expiresAt ? `Session ends in ${duration(session.expiresAt - now)}` : session?.email}</span>
            </span>
          </div>
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--block" onClick={onSignOut}>
            <LogOut size={15} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
      <div className="ad-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />

      <div className="ad-main-col">
        <header className="ad-topbar">
          <button type="button" className="ad-icon-btn ad-topbar__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="ad-topbar__title">
            <Activity size={16} aria-hidden="true" />
            <span>Mission control</span>
          </div>
          <div className="ad-topbar__actions">
            <StreamBadge />
            <ThemeToggle />
            <button type="button" className="ad-icon-btn" onClick={onSignOut} aria-label="Sign out" title="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main id="ad-main" className="ad-main">
          <RouteErrorBoundary resetKey={location.pathname}>
            <Outlet />
          </RouteErrorBoundary>
        </main>
      </div>
    </div>
  );
}
