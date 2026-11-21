import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Award, BellRing, Cloud, Globe2, Mail, Megaphone, Send, Share2, UserCheck } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { getSession } from '../lib/auth';
import { ago, num } from '../lib/format';
import { BarList } from '../components/charts';
import { EmptyState, ErrorBanner, KeyValues, PageHeader, Panel, Segmented, SkeletonRows, StatTile, StatusPill } from '../components/ui';

const ts = (v) => (v ? new Date(v).getTime() : null);
const SOURCE_LABEL = { google: 'Google', github: 'GitHub', account: 'Email account', newsletter: 'Newsletter', contact: 'Contact form' };

function Feedback({ result }) {
  if (!result) return null;
  return (
    <p className={result.ok ? 'ad-ok' : 'ad-error'} role="status">
      {result.text}
    </p>
  );
}

function EmailPanel({ data, onDone }) {
  const [kind, setKind] = useState('daily');
  const [result, setResult] = useState(null);
  const run = useMutation({
    mutationFn: ({ action }) => (action === 'test' ? adminApi.digestTest(kind) : adminApi.digestSend(kind)),
    onSuccess: (r, { action }) => {
      setResult(
        action === 'test'
          ? { ok: r?.sent, text: r?.sent ? 'Test email sent to your admin address.' : 'Brevo rejected the test email.' }
          : { ok: true, text: `Sent ${r.sent}, failed ${r.failed}, skipped ${r.skipped} (already sent today or over the limit).` },
      );
      onDone();
    },
    onError: (e) => setResult({ ok: false, text: e.message }),
  });
  const preview = async () => {
    const res = await fetch(adminApi.digestPreviewUrl(kind), { headers: { Authorization: `Bearer ${getSession()?.token}` } });
    const html = await res.text();
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };
  const n = data?.newsletter;
  return (
    <Panel title="Email list" subtitle={n ? `${num(n.active)} active · ${num(n.daily)} daily · ${num(n.weekly)} weekly` : ''} padded={false}>
      <div className="ad-panel__body ad-stack">
        <div className="ad-toolbar">
          <Segmented label="Email" value={kind} onChange={setKind} options={[{ value: 'daily', label: 'Daily puzzle' }, { value: 'weekly', label: 'Weekly recap' }]} />
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={preview}>
            Preview
          </button>
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={run.isPending} onClick={() => run.mutate({ action: 'test' })}>
            Send test to me
          </button>
          <button
            type="button"
            className="ad-btn ad-btn--primary ad-btn--sm"
            disabled={run.isPending}
            onClick={() => window.confirm(`Send the ${kind} email to all ${kind} subscribers now?`) && run.mutate({ action: 'send' })}
          >
            <Send size={14} /> Send now
          </button>
        </div>
        <Feedback result={result} />
        <p className="ad-muted ad-small">Sent automatically: daily puzzle at 08:00 IST, weekly recap on Mondays 09:00 IST (toggle below).</p>
      </div>
      {n?.recent?.length ? (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th scope="col">Subscriber</th>
                <th scope="col">Emails</th>
                <th scope="col">Source</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {n.recent.map((s) => (
                <tr key={s.email}>
                  <td>
                    <span className="ad-cell-main">{s.name || s.email}</span>
                    {s.name && <span className="ad-cell-sub">{s.email}</span>}
                    {s.visitorId && (
                      <Link className="ad-link" to={`/admin/visitors?visitor=${s.visitorId}`}>
                        Visitor profile
                      </Link>
                    )}
                  </td>
                  <td>{s.active ? [s.daily && 'Daily', s.weekly && 'Weekly'].filter(Boolean).join(' + ') || '—' : <StatusPill tone="muted">Unsubscribed</StatusPill>}</td>
                  <td>{s.source ?? '—'}</td>
                  <td>{s.subscribedAt ? ago(ts(s.subscribedAt)) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Mail} title="No subscribers yet">
          Sign-up forms are on the daily puzzle, progress page, leaderboard and footer.
        </EmptyState>
      )}
    </Panel>
  );
}

function PushPanel({ count, onDone }) {
  const [form, setForm] = useState({ title: '', body: '', url: '/daily' });
  const [result, setResult] = useState(null);
  const send = useMutation({
    mutationFn: () => adminApi.pushBroadcast(form),
    onSuccess: (r) => {
      setResult({ ok: true, text: `Delivered to ${r.sent}, failed ${r.failed}, removed ${r.removed} expired.` });
      onDone();
    },
    onError: (e) => setResult({ ok: false, text: e.message }),
  });
  return (
    <Panel title="Push notification" subtitle={`${num(count)} browser${count === 1 ? '' : 's'} subscribed`}>
      <form
        className="ad-form ad-form--settings"
        onSubmit={(e) => {
          e.preventDefault();
          if (window.confirm(`Send this notification to ${count} browsers?`)) send.mutate();
        }}
      >
        <label className="ad-field">
          <span className="ad-field__label">Title</span>
          <input className="ad-input" maxLength={80} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="New: graph algorithms are live" />
        </label>
        <label className="ad-field">
          <span className="ad-field__label">Message</span>
          <input className="ad-input" maxLength={200} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Watch Dijkstra find the shortest path, step by step." />
        </label>
        <label className="ad-field">
          <span className="ad-field__label">Opens</span>
          <input className="ad-input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </label>
        <Feedback result={result} />
        <div className="ad-toolbar">
          <button type="submit" className="ad-btn ad-btn--primary" disabled={!form.title || !count || send.isPending}>
            <Megaphone size={15} /> Send to all
          </button>
        </div>
        <p className="ad-muted ad-small">A daily “puzzle is live” reminder is sent automatically at 08:05 IST.</p>
      </form>
    </Panel>
  );
}

function LaunchSettings({ data, onDone }) {
  const s = data?.settings ?? {};
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: (changes) => adminApi.saveNotificationSettings(changes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'growth'] });
      onDone();
    },
  });
  const toggle = (key) => save.mutate({ [key]: String(s[key] !== 'true') });
  const rows = [
    ['digest.daily', 'Daily puzzle email (08:00 IST)'],
    ['digest.weekly', 'Weekly recap email (Mon 09:00 IST)'],
    ['push.daily', 'Daily push reminder (08:05 IST)'],
    ['notify.onIdentify', 'Email me when someone signs in, subscribes or writes'],
  ];
  return (
    <Panel title="Automations">
      <div className="ad-stack">
        {rows.map(([key, label]) => (
          <label key={key} className="ad-check">
            <input type="checkbox" checked={s[key] === 'true'} onChange={() => toggle(key)} disabled={save.isPending} /> {label}
          </label>
        ))}
        <KeyValues items={[['Emails per run limit', s['digest.cap'] ?? '—']]} />
      </div>
    </Panel>
  );
}

function SearchEngines({ data, onDone }) {
  const [result, setResult] = useState(null);
  const run = useMutation({
    mutationFn: adminApi.indexNow,
    onSuccess: (r) => {
      setResult({ ok: r.ok, text: r.ok ? `Submitted ${r.urls} URLs to Bing, Yandex and other IndexNow engines.` : r.error || `Failed (${r.status})` });
      onDone();
    },
    onError: (e) => setResult({ ok: false, text: e.message }),
  });
  const last = data?.indexNow;
  return (
    <Panel title="Search engines" subtitle="Get new pages indexed faster">
      <div className="ad-stack">
        <button type="button" className="ad-btn ad-btn--ghost" onClick={() => run.mutate()} disabled={run.isPending}>
          <Globe2 size={15} /> {run.isPending ? 'Submitting…' : 'Submit sitemap via IndexNow'}
        </button>
        <Feedback result={result} />
        {last?.at && <p className="ad-muted ad-small">Last run {ago(last.at)}: {last.ok ? `${last.urls} URLs accepted` : last.error}</p>}
        <p className="ad-muted ad-small">
          Google: add your site in{' '}
          <a className="ad-link" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
            Search Console
          </a>{' '}
          and submit <code>{data?.siteUrl}/sitemap.xml</code>. Set <code>VITE_GOOGLE_SITE_VERIFICATION</code> on the frontend build to verify ownership.
        </p>
      </div>
    </Panel>
  );
}

export default function GrowthPage() {
  useDocumentMeta({ title: 'Growth | CTW Control', robots: 'noindex, nofollow' });
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'growth'],
    queryFn: ({ signal }) => adminApi.growth({ signal }),
    refetchInterval: 30_000,
  });
  const id = data?.identified;
  const shares = data?.shares30d ?? [];
  const totalShares = shares.reduce((s, x) => s + Number(x.count), 0);

  return (
    <div className="ad-page">
      <PageHeader title="Growth" description="Who your visitors are, how they found you, and the tools that bring them back." />
      <ErrorBanner error={error} onRetry={refetch} />

      <div className="ad-stats ad-stats--6">
        <StatTile label="Identified people" icon={UserCheck} value={num(id?.total)} hint="Name or email known" />
        <StatTile label="Email subscribers" icon={Mail} value={num(data?.newsletter?.active)} hint={`${num(data?.newsletter?.new7d)} new this week`} />
        <StatTile label="Synced accounts" icon={Cloud} value={num(data?.accountsSynced)} hint="Progress saved to an account" />
        <StatTile label="Push subscribers" icon={BellRing} value={num(data?.pushSubscribers)} hint="Daily reminder enabled" />
        <StatTile label="Certificates" icon={Award} value={num(data?.certificates?.total)} hint="Issued to learners" />
        <StatTile label="Shares · 30d" icon={Share2} value={num(totalShares)} hint="Share-button clicks" />
      </div>

      <Panel title="People who identified themselves" subtitle="Signed in, subscribed or sent the contact form — newest first" padded={false}>
        {isLoading ? (
          <div className="ad-panel__body">
            <SkeletonRows rows={5} />
          </div>
        ) : id?.recent?.length ? (
          <>
            <div className="ad-table-wrap ad-only-desktop">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">How</th>
                    <th scope="col">First came from</th>
                    <th scope="col">Location</th>
                    <th scope="col" className="is-num">Visits</th>
                    <th scope="col">When</th>
                  </tr>
                </thead>
                <tbody>
                  {id.recent.map((p) => (
                    <tr key={p.visitorId} className="is-clickable">
                      <td>
                        <Link className="ad-cell-main" to={`/admin/visitors?visitor=${p.visitorId}`}>
                          {p.name ?? p.username ?? '—'}
                        </Link>
                      </td>
                      <td>{p.email ? <a className="ad-link" href={`mailto:${p.email}`}>{p.email}</a> : '—'}</td>
                      <td>
                        <StatusPill tone={['google', 'github', 'account'].includes(p.identitySource) ? 'success' : 'info'}>{SOURCE_LABEL[p.identitySource] ?? p.identitySource}</StatusPill>
                      </td>
                      <td>{p.source ?? 'Direct'}</td>
                      <td>{[p.city, p.country].filter(Boolean).join(', ') || '—'}</td>
                      <td className="is-num">{num(p.visits)}</td>
                      <td>{ago(ts(p.identifiedAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="ad-cards ad-only-mobile">
              {id.recent.map((p) => (
                <li key={p.visitorId}>
                  <Link className="ad-card-btn" to={`/admin/visitors?visitor=${p.visitorId}`}>
                    <div className="ad-card-btn__top">
                      <strong>{p.name ?? p.username ?? '—'}</strong>
                      <StatusPill tone="info">{SOURCE_LABEL[p.identitySource] ?? p.identitySource}</StatusPill>
                    </div>
                    <span className="ad-card-btn__path">{p.email}</span>
                    <span className="ad-card-btn__meta">
                      {p.source ?? 'Direct'} · {[p.city, p.country].filter(Boolean).join(', ') || '—'} · {ago(ts(p.identifiedAt))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState icon={UserCheck} title="Nobody has identified themselves yet">
            People appear here when they sign in, subscribe to emails or send the contact form.
          </EmptyState>
        )}
      </Panel>

      <div className="ad-grid ad-grid--3">
        <Panel title="How people identify" subtitle="All time">
          <BarList items={Object.entries(id?.bySource ?? {}).map(([name, count]) => ({ name: SOURCE_LABEL[name] ?? name, count }))} empty="—" />
        </Panel>
        <Panel title="Shares by channel" subtitle="Last 30 days">
          <BarList items={shares.map((s) => ({ name: s.name.replace(/^Share (on |by |with )?/, ''), count: Number(s.count) }))} empty="No shares yet" />
        </Panel>
        <Panel title="Leaderboard today" subtitle="Top 5">
          {data?.leaderboardToday?.length ? (
            <ol className="ad-feed">
              {data.leaderboardToday.map((e) => (
                <li key={e.rank}>
                  <span className="ad-kind is-accent">#{e.rank}</span>
                  <span className="ad-feed__text">
                    <span className="ad-feed__title">{e.name}</span>
                    <span className="ad-feed__meta">
                      {e.score}/3 · {Math.round(e.durationMs / 1000)}s
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="ad-empty-line">No players yet today.</p>
          )}
        </Panel>
      </div>

      <Panel title="Conversion by traffic source" subtitle="Visitors active in the last 30 days, and how many identified themselves" padded={false}>
        {data?.conversion30d?.length ? (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col" className="is-num">Visitors</th>
                  <th scope="col" className="is-num">Identified</th>
                  <th scope="col" className="is-num">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.conversion30d.map((r) => (
                  <tr key={r.source}>
                    <td className="ad-cell-main">{r.source}</td>
                    <td className="is-num">{num(r.visitors)}</td>
                    <td className="is-num">{num(r.identified)}</td>
                    <td className={clsx('is-num', r.rate > 0 && 'ad-text-success')}>{r.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="ad-empty-line ad-panel__body">No visitors in the last 30 days.</p>
        )}
      </Panel>

      <div className="ad-grid ad-grid--2-1">
        <EmailPanel data={data} onDone={refetch} />
        <div className="ad-stack">
          <LaunchSettings data={data} onDone={refetch} />
          <SearchEngines data={data} onDone={refetch} />
        </div>
      </div>

      <div className="ad-grid ad-grid--2-1">
        <PushPanel count={data?.pushSubscribers ?? 0} onDone={refetch} />
        <Panel title="Recent certificates">
          {data?.certificates?.recent?.length ? (
            <ul className="ad-feed">
              {data.certificates.recent.map((c) => (
                <li key={c.code}>
                  <Award size={16} aria-hidden="true" />
                  <span className="ad-feed__text">
                    <a className="ad-feed__title ad-link" href={`/certificate/${c.code}`} target="_blank" rel="noopener noreferrer">
                      {c.recipientName}
                    </a>
                    <span className="ad-feed__meta">{c.title}</span>
                  </span>
                  <time className="ad-feed__time">{ago(ts(c.issuedAt))}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ad-empty-line">None issued yet.</p>
          )}
        </Panel>
      </div>

      {data?.newsletter?.runs?.length > 0 && (
        <Panel title="Recent sends" subtitle="Scheduled and manual email / push runs">
          <ul className="ad-feed">
            {data.newsletter.runs.map((r) => (
              <li key={`${r.kind}-${r.at}`}>
                <span className="ad-kind is-info">{r.kind}</span>
                <span className="ad-feed__text">
                  <span className="ad-feed__title">{r.note}</span>
                  <span className="ad-feed__meta">
                    sent {r.sent} · failed {r.failed} · skipped {r.skipped}
                  </span>
                </span>
                <time className="ad-feed__time">{ago(r.at)}</time>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
