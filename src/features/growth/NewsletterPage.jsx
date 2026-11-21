import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Container, Section, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { growthApi } from './api';
import NewsletterSignup from './NewsletterSignup';
import './growth.css';

/** /newsletter — sign up, or manage preferences / unsubscribe from an emailed link (?token=). */
export default function NewsletterPage() {
  useDocumentMeta({
    title: 'Daily Algorithm Puzzle by Email | Chaitanya Tech World',
    description: 'Get a new 2-minute algorithm puzzle in your inbox every morning and a short weekly recap. Free, one-click unsubscribe.',
  });
  const [params] = useSearchParams();
  const token = params.get('token');
  const wantsUnsubscribe = params.get('action') === 'unsubscribe';
  const [prefs, setPrefs] = useState(null);
  const [status, setStatus] = useState(token ? 'loading' : 'signup');
  const [message, setMessage] = useState(null);
  const done = useRef(false);

  useEffect(() => {
    if (!token || done.current) return;
    done.current = true;
    (async () => {
      try {
        let p = await growthApi.preferences(token);
        if (wantsUnsubscribe && p.active) {
          p = await growthApi.savePreferences({ token, daily: false, weekly: false });
          setMessage('You’ve been unsubscribed. You won’t get any more emails.');
        }
        setPrefs(p);
        setStatus('manage');
      } catch (e) {
        setMessage(e.message);
        setStatus('error');
      }
    })();
  }, [token, wantsUnsubscribe]);

  const save = async (next) => {
    setStatus('saving');
    try {
      const p = await growthApi.savePreferences({ token, ...next });
      setPrefs(p);
      setMessage(p.active ? 'Preferences saved.' : 'You’ve been unsubscribed.');
      setStatus('manage');
    } catch (e) {
      setMessage(e.message);
      setStatus('manage');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Email"
        title={
          <>
            The puzzle, <span className="ds-gradient-text">in your inbox</span>
          </>
        }
        description="One short email each morning with the new Traceflow Daily puzzle, and a Monday recap of your week."
      />
      <Section compact>
        <Container size="narrow">
          {status === 'signup' && <NewsletterSignup source="newsletter-page" />}
          {status === 'loading' && (
            <p className="gr-note">
              <Loader2 size={16} className="gr-spin" /> Loading your preferences…
            </p>
          )}
          {status === 'error' && <p className="gr-error">{message}</p>}
          {(status === 'manage' || status === 'saving') && prefs && (
            <div className="gr-prefs">
              <h2>Email preferences for {prefs.email}</h2>
              {message && (
                <p className="gr-ok" role="status">
                  <CheckCircle2 size={16} /> {message}
                </p>
              )}
              <label>
                <input type="checkbox" checked={prefs.daily} disabled={status === 'saving'} onChange={(e) => save({ daily: e.target.checked, weekly: prefs.weekly })} />
                Daily puzzle email (every morning)
              </label>
              <label>
                <input type="checkbox" checked={prefs.weekly} disabled={status === 'saving'} onChange={(e) => save({ daily: prefs.daily, weekly: e.target.checked })} />
                Weekly recap (Mondays)
              </label>
              {prefs.active ? (
                <button type="button" className="gr-btn gr-btn--ghost" disabled={status === 'saving'} onClick={() => save({ daily: false, weekly: false })}>
                  Unsubscribe from everything
                </button>
              ) : (
                <button type="button" className="gr-btn" disabled={status === 'saving'} onClick={() => save({ daily: true, weekly: true })}>
                  Subscribe again
                </button>
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
