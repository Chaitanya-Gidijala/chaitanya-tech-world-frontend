import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Lock, LogIn, RadioTower, ShieldCheck, Activity } from 'lucide-react';
import { ThemeToggle, useDocumentMeta } from '@/design-system';
import BrandLogo from '@/components/site/BrandLogo';
import { AuthError, signIn, useAdminSession } from '../lib/auth';

/** Only same-app admin paths are accepted as a post-login redirect. */
function safeNext(next) {
  return next && next.startsWith('/admin') && !next.startsWith('/admin/login') && !next.startsWith('//') ? next : '/admin';
}

const FEATURES = [
  { icon: RadioTower, title: 'Live visitors', text: 'Who is on the site right now, where they are and what they are reading.' },
  { icon: Activity, title: 'Every request, logged', text: 'API calls, page views and clicks streamed in real time.' },
  { icon: ShieldCheck, title: 'System health', text: 'Spring Boot, database, auth service and React app status.' },
];

export default function LoginPage() {
  const session = useAdminSession();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useDocumentMeta({ title: 'Admin sign in | Chaitanya Tech World', robots: 'noindex, nofollow' });

  if (session?.isAdmin) return <Navigate to={next} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!identity.trim() || !password) {
      setError('Enter your username or email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(identity.trim(), password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => setCaps(e.getModifierState?.('CapsLock') ?? false);

  return (
    <div className="ad-login">
      <section className="ad-login__hero" aria-hidden="true">
        <div className="ad-login__glow" />
        <div className="ad-login__grid" />
        <div className="ad-login__hero-inner">
          <div className="ad-brand ad-brand--lg">
            <BrandLogo size={40} animated />
            <span>
              <strong>CTW</strong> Control
            </span>
          </div>
          <h1 className="ad-login__headline">
            Your whole site,
            <br />
            <span className="ds-gradient-text">live in one place.</span>
          </h1>
          <ul className="ad-login__features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="ad-login__feature-icon">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="ad-login__pulse">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ '--i': i, '--h': `${20 + ((i * 53) % 70)}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="ad-login__panel">
        <div className="ad-login__top">
          <Link to="/" className="ad-login__back">
            <ArrowLeft size={15} aria-hidden="true" /> Back to website
          </Link>
          <ThemeToggle />
        </div>

        <div className="ad-login__card">
          <div className="ad-login__mark">
            <Lock size={20} aria-hidden="true" />
          </div>
          <h2 className="ad-login__title">Administrator sign in</h2>
          <p className="ad-login__subtitle">Restricted area. Access is limited to administrator accounts and every sign-in is logged.</p>

          <form className="ad-form" onSubmit={onSubmit} noValidate>
            <label className="ad-field">
              <span className="ad-field__label">Username or email</span>
              <input
                className="ad-input"
                type="text"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                disabled={busy}
                autoFocus
                required
              />
            </label>

            <label className="ad-field">
              <span className="ad-field__label">Password</span>
              <span className="ad-input-wrap">
                <input
                  className="ad-input"
                  type={show ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={onKey}
                  onKeyDown={onKey}
                  disabled={busy}
                  required
                />
                <button
                  type="button"
                  className="ad-input-wrap__btn"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  aria-pressed={show}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              {caps && (
                <span className="ad-field__hint is-warning">
                  <AlertTriangle size={13} aria-hidden="true" /> Caps Lock is on
                </span>
              )}
            </label>

            {error && (
              <div className="ad-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="ad-btn ad-btn--primary ad-btn--block ad-btn--lg" disabled={busy}>
              {busy ? <span className="ad-spinner" aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="ad-login__note">
            <ShieldCheck size={14} aria-hidden="true" /> Protected by role-based access. Sessions expire automatically.
          </p>
        </div>
      </section>
    </div>
  );
}
