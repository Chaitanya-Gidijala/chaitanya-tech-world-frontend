import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Cloud, Eye, EyeOff, Flame, Loader2, Trophy, X } from 'lucide-react';
import SocialIcon from '@/components/site/SocialIcon';
import { AccountError, onOpenAuth, register, signInWithPassword, startOAuth } from './session';
import { linkAndSync } from './sync';
import './account.css';

const BENEFITS = [
  { icon: Cloud, text: 'Keep your streak, XP and roadmap progress on every device' },
  { icon: Trophy, text: 'Appear on the daily puzzle leaderboard by name' },
  { icon: Award, text: 'Earn verifiable certificates to share on LinkedIn' },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z" />
    </svg>
  );
}

/** Global sign-in / sign-up dialog. Open it from anywhere with openAuth(reason). */
export default function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const panel = useRef(null);

  useEffect(
    () =>
      onOpenAuth((why) => {
        setReason(why ?? null);
        setError(null);
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    panel.current?.querySelector('button, input')?.focus();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (mode === 'signup' && form.name.trim().length < 2) return setError('Please enter your name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return setError('Please enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setBusy(true);
    try {
      if (mode === 'signup') await register(form.name, form.email, form.password);
      else await signInWithPassword(form.email, form.password);
      await linkAndSync('account');
      setOpen(false);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err instanceof AccountError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="acc-dialog" role="presentation">
      <div className="acc-dialog__backdrop" onClick={() => setOpen(false)} />
      <div ref={panel} className="acc-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="acc-title">
        <button type="button" className="acc-dialog__close" onClick={() => setOpen(false)} aria-label="Close">
          <X size={18} />
        </button>

        <div className="acc-dialog__head">
          <span className="acc-dialog__badge">
            <Flame size={18} aria-hidden="true" />
          </span>
          <h2 id="acc-title">{mode === 'signup' ? 'Create your free account' : 'Welcome back'}</h2>
          <p>{reason ?? 'Save your progress and join the leaderboard.'}</p>
        </div>

        <ul className="acc-benefits">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon size={15} aria-hidden="true" /> {text}
            </li>
          ))}
        </ul>

        <div className="acc-oauth">
          <button type="button" className="acc-oauth__btn" onClick={() => startOAuth('google')}>
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="acc-oauth__btn" onClick={() => startOAuth('github')}>
            <SocialIcon name="github" size={18} /> Continue with GitHub
          </button>
        </div>

        <div className="acc-divider">
          <span>or with email</span>
        </div>

        <form className="acc-form" onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <label className="acc-field">
              <span>Full name</span>
              <input autoComplete="name" value={form.name} onChange={set('name')} disabled={busy} />
            </label>
          )}
          <label className="acc-field">
            <span>Email</span>
            <input type="email" autoComplete="email" inputMode="email" value={form.email} onChange={set('email')} disabled={busy} />
          </label>
          <label className="acc-field">
            <span>Password</span>
            <span className="acc-field__wrap">
              <input
                type={show ? 'text' : 'password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={set('password')}
                disabled={busy}
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          {error && (
            <p className="acc-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="acc-submit" disabled={busy}>
            {busy && <Loader2 size={16} className="acc-spin" aria-hidden="true" />}
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="acc-switch">
          {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError(null);
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Create a free account'}
          </button>
        </p>
        <p className="acc-legal">We use your name and email to save your progress and show you on leaderboards. No spam.</p>
      </div>
    </div>,
    document.body,
  );
}
