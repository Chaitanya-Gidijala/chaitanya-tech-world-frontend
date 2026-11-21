import { useState } from 'react';
import clsx from 'clsx';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { getLearnerId } from '@/features/engagement/lib/store';
import { useAccount } from '@/features/account/session';
import { growthApi } from './api';
import './growth.css';

const DONE_KEY = 'ctw-newsletter-email';

/**
 * Email sign-up: daily puzzle email and/or the Monday summary.
 * Linked to the anonymous visitor id, so the admin sees who subscribed.
 */
export default function NewsletterSignup({ source = 'site', variant = 'card', title, description }) {
  const account = useAccount();
  const [email, setEmail] = useState(account?.email ?? '');
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(() => {
    try {
      return localStorage.getItem(DONE_KEY);
    } catch {
      return null;
    }
  });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (!daily && !weekly) return setError('Choose at least one email.');
    setBusy(true);
    try {
      await growthApi.subscribe({ email: email.trim(), name: account?.name, visitorId: getLearnerId(), daily, weekly, source });
      try {
        localStorage.setItem(DONE_KEY, email.trim());
      } catch {
        /* ignore */
      }
      setDone(email.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className={clsx('gr-news', `is-${variant}`, 'is-done')} role="status">
        <CheckCircle2 size={20} aria-hidden="true" />
        <div>
          <strong>You’re subscribed</strong>
          <p>We’ll email {done}. Every email has a one-click unsubscribe link.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={clsx('gr-news', `is-${variant}`)} onSubmit={submit} noValidate>
      <div className="gr-news__text">
        <span className="gr-news__icon" aria-hidden="true">
          <Mail size={18} />
        </span>
        <div>
          <strong>{title ?? 'Get the daily puzzle in your inbox'}</strong>
          <p>{description ?? 'A new 2-minute algorithm puzzle every morning, plus a short Monday recap. Free, no spam.'}</p>
        </div>
      </div>
      <div className="gr-news__row">
        <label className="ds-visually-hidden" htmlFor={`news-${source}`}>
          Email address
        </label>
        <input
          id={`news-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
        <button type="submit" disabled={busy}>
          {busy ? <Loader2 size={15} className="gr-spin" aria-hidden="true" /> : null}
          Subscribe
        </button>
      </div>
      <div className="gr-news__prefs">
        <label>
          <input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} /> Daily puzzle
        </label>
        <label>
          <input type="checkbox" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} /> Weekly recap
        </label>
      </div>
      {error && (
        <p className="gr-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
