import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, MailCheck, Send, ShieldOff } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { getLearnerId } from '@/features/engagement/lib/store';
import { adminApi } from '../lib/api';
import { ago, num, shortId } from '../lib/format';
import { EmptyState, ErrorBanner, PageHeader, Panel, Segmented, SkeletonRows, StatTile, StatusPill } from '../components/ui';

const MODES = [
  { value: 'EVERY_VISIT', label: 'Every visit' },
  { value: 'NEW_VISITORS', label: 'New visitors only' },
  { value: 'OFF', label: 'Off' },
];

const STATUS_TONE = { SENT: 'success', SKIPPED: 'muted', FAILED: 'danger' };

function SettingsForm({ settings, onSaved }) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState(null);
  const save = useMutation({
    mutationFn: (changes) => adminApi.saveNotificationSettings(changes),
    onSuccess: (data) => {
      setMessage({ ok: true, text: 'Saved.' });
      onSaved(data);
    },
    onError: (e) => setMessage({ ok: false, text: e.message }),
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? String(e.target.checked) : e.target.value }));
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  return (
    <form
      className="ad-form ad-form--settings"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        const { 'notify.ignoreVisitors': _ignored, ...changes } = form;
        save.mutate(changes);
      }}
    >
      <div className="ad-field">
        <span className="ad-field__label">Send an email when</span>
        <Segmented label="Notification mode" value={form['notify.mode']} onChange={(v) => setForm((f) => ({ ...f, 'notify.mode': v }))} options={MODES} />
        <span className="ad-field__hint">
          “Every visit” emails each new visit (a new browser session), limited by the cooldown and the daily cap.
        </span>
      </div>
      <div className="ad-form__row">
        <label className="ad-field">
          <span className="ad-field__label">Per-visitor cooldown (hours)</span>
          <input className="ad-input" type="number" min="0" max="720" value={form['notify.cooldownHours']} onChange={set('notify.cooldownHours')} />
        </label>
        <label className="ad-field">
          <span className="ad-field__label">Daily email limit</span>
          <input className="ad-input" type="number" min="0" max="1000" value={form['notify.dailyCap']} onChange={set('notify.dailyCap')} />
        </label>
      </div>
      <label className="ad-field">
        <span className="ad-field__label">Send to</span>
        <input className="ad-input" type="email" placeholder="Leave empty to use the admin address (APP_ADMIN_EMAIL)" value={form['notify.recipient']} onChange={set('notify.recipient')} />
      </label>
      <label className="ad-check">
        <input type="checkbox" checked={form['notify.skipBots'] === 'true'} onChange={set('notify.skipBots')} /> Don’t email for bots and automated browsers
      </label>
      {message && (
        <p className={message.ok ? 'ad-ok' : 'ad-error'} role="status">
          {message.text}
        </p>
      )}
      <div className="ad-toolbar">
        <button type="submit" className="ad-btn ad-btn--primary" disabled={!dirty || save.isPending}>
          {save.isPending ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}

export default function NotificationsPage() {
  useDocumentMeta({ title: 'Notifications | CTW Control', robots: 'noindex, nofollow' });
  const qc = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: ({ signal }) => adminApi.notifications({ signal }),
    refetchInterval: 15_000,
  });
  const [note, setNote] = useState(null);
  const test = useMutation({
    mutationFn: adminApi.testNotification,
    onSuccess: (o) => {
      setNote({ ok: o.status === 'SENT', text: o.reason });
      refetch();
    },
    onError: (e) => setNote({ ok: false, text: e.message }),
  });
  const myId = getLearnerId();
  const ignored = (data?.settings?.['notify.ignoreVisitors'] ?? '').split(',').filter(Boolean);
  const ignoreMe = useMutation({
    mutationFn: () => adminApi.ignoreVisitor(myId),
    onSuccess: () => refetch(),
    onError: (e) => setNote({ ok: false, text: e.message }),
  });

  const onSaved = (settings) => qc.setQueryData(['admin', 'notifications'], (prev) => ({ ...prev, settings }));
  const recent = data?.recent ?? [];
  const sent = recent.filter((r) => r.status === 'SENT').length;

  return (
    <div className="ad-page">
      <PageHeader title="Notifications" description="Get an email when someone visits your website. Emails go through your existing Brevo setup." />
      <ErrorBanner error={error} onRetry={refetch} />

      <div className="ad-stats">
        <StatTile label="Emails today" icon={MailCheck} value={num(data?.sentToday)} hint={`Limit ${data?.settings?.['notify.dailyCap'] ?? '—'} per day`} />
        <StatTile label="Waiting to send" icon={BellRing} value={num(data?.pending)} hint="Sent ~25s after a visit starts" />
        <StatTile label="Recently sent" icon={Send} value={num(sent)} hint={`of the last ${recent.length} decisions`} />
        <StatTile label="Ignored browsers" icon={ShieldOff} value={num(ignored.length)} hint={ignored.includes(myId) ? 'Including this browser' : 'This browser is notified'} />
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Settings" subtitle={data ? `Emails go to ${data.recipient}` : ''}>
          {isLoading || !data ? <SkeletonRows rows={6} /> : <SettingsForm key={JSON.stringify(data.settings)} settings={data.settings} onSaved={onSaved} />}
        </Panel>
        <div className="ad-stack">
          <Panel title="Check the setup">
            <div className="ad-stack">
              <p className="ad-muted ad-small">Sends a test email to the address above using Brevo.</p>
              <button type="button" className="ad-btn ad-btn--ghost" onClick={() => test.mutate()} disabled={test.isPending}>
                <Send size={15} /> {test.isPending ? 'Sending…' : 'Send test email'}
              </button>
              {note && (
                <p className={note.ok ? 'ad-ok' : 'ad-error'} role="status">
                  {note.text}
                </p>
              )}
            </div>
          </Panel>
          <Panel title="Your own visits">
            <div className="ad-stack">
              <p className="ad-muted ad-small">Stop emails about this browser (the visitor id stored here: {shortId(myId)}).</p>
              <button type="button" className="ad-btn ad-btn--ghost" onClick={() => ignoreMe.mutate()} disabled={ignoreMe.isPending || ignored.includes(myId)}>
                <ShieldOff size={15} /> {ignored.includes(myId) ? 'This browser is ignored' : 'Ignore this browser'}
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Recent decisions" subtitle="Every visit that could trigger an email, and what happened" padded={false}>
        {recent.length ? (
          <ul className="ad-inbox">
            {recent.map((r) => (
              <li key={`${r.at}-${r.visitorId}`}>
                <div className="ad-inbox__item ad-inbox__item--static">
                  <span className="ad-inbox__icon">
                    <StatusPill tone={STATUS_TONE[r.status] ?? 'muted'}>{r.status}</StatusPill>
                  </span>
                  <span className="ad-inbox__main">
                    <span className="ad-inbox__top">
                      <strong>{r.visitorId === 'test' ? 'Test email' : `Visitor ${r.visitorId.slice(0, 4).toUpperCase()}`}</strong>
                      <span className="ad-muted">{r.place}</span>
                    </span>
                    <span className="ad-inbox__preview">{r.reason}</span>
                  </span>
                  <span className="ad-inbox__meta">
                    <time className="ad-muted">{ago(r.at)}</time>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={BellRing} title="No visits yet since the last restart">
            Decisions appear here about 25 seconds after someone opens the site.
          </EmptyState>
        )}
      </Panel>
    </div>
  );
}
