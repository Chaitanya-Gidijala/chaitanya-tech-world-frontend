import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bug,
  Eye,
  Gauge,
  Inbox,
  Layers,
  MousePointerClick,
  Power,
  Puzzle,
  RadioTower,
  Timer,
  UserRound,
  Users,
  Zap,
} from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { useLiveMonitor } from '../lib/liveMonitor';
import { compact, duration, ms, num, time, visitorName } from '../lib/format';
import { logTitle } from '../lib/logs';
import { useNow } from '../lib/useNow';
import { AreaChart, BarList } from '../components/charts';
import { ErrorBanner, PageHeader, Panel, Segmented, SkeletonRows, StatTile } from '../components/ui';
import { KindBadge } from '../components/LogParts';

const HOURLY_METRICS = [
  { value: 'pageViews', label: 'Page views', series: 1 },
  { value: 'visitors', label: 'Visitors', series: 1 },
  { value: 'requests', label: 'API requests', series: 1 },
  { value: 'serverErrors', label: 'Server errors', series: 2 },
  { value: 'jsErrors', label: 'JS errors', series: 2 },
];

const hourLabel = (x) => new Date(x).toLocaleTimeString(undefined, { hour: 'numeric' });

function ActivityFeed() {
  const logs = useLiveMonitor((s) => s.logs);
  const recent = logs.filter((l) => l.kind !== 'HEARTBEAT').slice(-10).reverse();
  if (!recent.length) return <p className="ad-empty-line">Waiting for activity…</p>;
  return (
    <ul className="ad-feed">
      {recent.map((l) => (
        <li key={l.seq}>
          <KindBadge log={l} />
          <span className="ad-feed__text">
            <span className="ad-feed__title">{logTitle(l)}</span>
            <span className="ad-feed__meta">
              {l.userEmail ?? l.username ?? visitorName(l.visitorId)} · {l.city ?? l.country ?? l.ip ?? '—'}
            </span>
          </span>
          <time className="ad-feed__time">{time(l.ts)}</time>
        </li>
      ))}
    </ul>
  );
}

function SectionErrors({ errors, onRetry }) {
  const keys = Object.keys(errors ?? {});
  if (!keys.length) return null;
  return (
    <div className="ad-error" role="alert">
      <details>
        <summary>
          {keys.length} section{keys.length === 1 ? '' : 's'} unavailable: {keys.join(', ')}
        </summary>
        <ul className="ad-error__list">
          {keys.map((k) => (
            <li key={k}>
              <strong>{k}</strong>: <code>{errors[k]}</code>
            </li>
          ))}
        </ul>
      </details>
      <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

function EndpointTable({ rows }) {
  if (!rows?.length) return <p className="ad-empty-line ad-panel__body">No API requests since the last restart.</p>;
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th scope="col">Endpoint</th>
            <th scope="col" className="is-num">Hits</th>
            <th scope="col" className="is-num">Avg</th>
            <th scope="col" className="is-num">p95</th>
            <th scope="col" className="is-num">5xx</th>
            <th scope="col" className="is-num">4xx</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.endpoint} className={clsx(r.serverErrors > 0 && 'is-error')}>
              <td className="ad-cell-event">
                <code>{r.endpoint}</code>
              </td>
              <td className="is-num">{num(r.hits)}</td>
              <td className="is-num">{ms(r.avgMs)}</td>
              <td className="is-num">{ms(r.p95Ms)}</td>
              <td className="is-num">{r.serverErrors ? `${num(r.serverErrors)} (${r.errorRate}%)` : '0'}</td>
              <td className="is-num">{num(r.clientErrors)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OverviewPage() {
  useDocumentMeta({ title: 'Overview | CTW Control', robots: 'noindex, nofollow' });
  const now = useNow(30_000);
  const [metric, setMetric] = useState('pageViews');
  const { data, error, refetch, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: ({ signal }) => adminApi.overview({ signal }),
    refetchInterval: 30_000,
  });

  const presence = useLiveMonitor((s) => s.presence);
  const metrics = useLiveMonitor((s) => s.metrics);
  const history = useLiveMonitor((s) => s.history);

  const live = presence?.breakdown ?? data?.live;
  const m = metrics ?? data?.metrics;
  const t24 = data?.traffic24h;
  const series = (m?.series ?? []).map((p) => ({ x: p.t, y: p.requests }));
  const daily = (data?.daily30 ?? []).map((d) => ({ x: new Date(d.dateId).getTime(), y: d.totalViews }));
  const hourly = (t24?.hourly ?? []).map((h) => ({ x: h.t, y: h[metric] ?? 0 }));
  const metricMeta = HOURLY_METRICS.find((h) => h.value === metric);
  const puzzle = data?.dailyChallenge;
  const errorRate = m?.errorRate ?? 0;
  const uptimeMs = data?.uptime ? data.uptime.uptimeMs + Math.max(0, now - dataUpdatedAt) : null;

  return (
    <div className="ad-page">
      <PageHeader
        title="Overview"
        description={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      />
      <ErrorBanner error={error} onRetry={refetch} />
      <SectionErrors errors={data?.errors} onRetry={refetch} />

      <h2 className="ad-section-title">Right now</h2>
      <div className="ad-stats">
        <StatTile
          live
          label="Online now"
          icon={RadioTower}
          value={num(live?.live ?? 0)}
          hint={`Peak today ${num(live?.peakToday ?? data?.today?.peakConcurrent ?? 0)}`}
          trend={history.map((h) => h.live)}
        />
        <StatTile label="Requests / min" icon={Zap} value={num(m?.rpm ?? 0)} hint={`${compact(m?.requests)} in the last ${m?.series?.length ?? 60} min`} trend={history.map((h) => h.rpm)} />
        <StatTile label="p95 latency" icon={Timer} value={ms(m?.p95Ms)} hint={`p50 ${ms(m?.p50Ms)} · avg ${ms(m?.avgMs)}`} trend={history.map((h) => h.p95)} series={2} />
        <StatTile
          label="Server error rate"
          icon={AlertTriangle}
          value={`${errorRate}%`}
          tone={errorRate >= 5 ? 'danger' : errorRate >= 1 ? 'warning' : undefined}
          hint={`${num(m?.serverErrors ?? 0)} 5xx · ${num(m?.clientErrors ?? 0)} 4xx · recent`}
        />
      </div>

      <h2 className="ad-section-title">Last 24 hours</h2>
      <div className="ad-stats ad-stats--6">
        <StatTile label="Sessions" icon={Layers} value={num(t24?.sessions)} hint={`${num(t24?.pagesPerSession)} pages / session`} />
        <StatTile label="Visitors" icon={Users} value={num(t24?.visitors)} hint={`${num(data?.today?.uniqueVisitors)} unique today`} />
        <StatTile label="Page views" icon={Eye} value={num(t24?.pageViews)} hint={`${num(data?.today?.views)} today · ${compact(data?.allTimeViews)} all time`} />
        <StatTile
          label="Bounce rate"
          icon={MousePointerClick}
          value={t24 ? `${t24.bounceRate}%` : '—'}
          hint="Sessions with a single page"
          tone={t24?.bounceRate >= 80 ? 'warning' : undefined}
        />
        <StatTile label="API requests" icon={Activity} value={num(t24?.requests)} hint={`${num(t24?.serverErrors)} 5xx · ${num(t24?.clientErrors)} 4xx`} tone={t24?.serverErrors > 0 ? 'warning' : undefined} />
        <StatTile label="JS errors" icon={Bug} value={num(t24?.jsErrors)} hint="Front-end exceptions" tone={t24?.jsErrors > 0 ? 'warning' : undefined} />
      </div>

      <Panel
        title="Hour by hour"
        subtitle="Last 24 hours, from stored logs"
        actions={<Segmented label="Metric" value={metric} onChange={setMetric} options={HOURLY_METRICS.map(({ value, label }) => ({ value, label }))} />}
      >
        {isLoading ? <SkeletonRows rows={5} /> : <AreaChart data={hourly} label={`${metricMeta.label} per hour`} series={metricMeta.series} height={240} formatX={hourLabel} />}
      </Panel>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Requests per minute" subtitle="Every API request to the Spring Boot service, live">
          <AreaChart data={series} label="Requests per minute" height={220} />
        </Panel>
        <Panel
          title="Pages being viewed now"
          actions={
            <Link to="/admin/live" className="ad-link">
              Live view <ArrowRight size={13} />
            </Link>
          }
        >
          <BarList items={live?.pages} empty="Nobody on the site right now" renderName={(i) => <code>{i.name}</code>} />
        </Panel>
      </div>

      <div className="ad-grid ad-grid--3">
        <Panel title="Top pages" subtitle="Page views · 24h">
          <BarList items={t24?.topPages} renderName={(i) => <code>{i.name}</code>} empty="No page views recorded yet" />
        </Panel>
        <Panel title="Countries" subtitle="Page views · 24h (approximate, IP-based)">
          <BarList items={t24?.countries} empty="No page views recorded yet" />
        </Panel>
        <Panel title="Devices" subtitle="Page views · 24h">
          <BarList items={t24?.devices} empty="—" />
        </Panel>
        <Panel title="Browsers" subtitle="Page views · 24h">
          <BarList items={t24?.browsers} empty="—" />
        </Panel>
        <Panel title="Operating systems" subtitle="Page views · 24h">
          <BarList items={t24?.os} empty="—" />
        </Panel>
        <Panel title="Response codes" subtitle="API requests · 24h">
          <BarList items={t24?.statusClasses} empty="—" />
        </Panel>
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Endpoint performance" subtitle="Since the API last started, by traffic" padded={false}>
          <EndpointTable rows={data?.endpoints} />
        </Panel>
        <div className="ad-stack">
          <Panel title="Failing endpoints" subtitle="Server 5xx · 24h">
            <BarList items={t24?.failingEndpoints} renderName={(i) => <code>{i.name}</code>} empty="No server errors in the last 24 hours" />
          </Panel>
          <div className="ad-mini-stats">
            <StatTile label="API uptime" icon={Power} value={duration(uptimeMs)} hint={data?.uptime ? `Since ${new Date(data.uptime.startedAt).toLocaleString()}` : '—'} />
            <StatTile label="Daily puzzle" icon={Puzzle} value={num(puzzle?.completions)} hint={puzzle ? `#${puzzle.day} · avg ${puzzle.averageScore}/3` : '—'} />
            <StatTile label="Unread inquiries" icon={Inbox} value={num(data?.inquiries?.unread)} hint={`${num(data?.inquiries?.total)} total`} tone={data?.inquiries?.unread > 0 ? 'warning' : undefined} />
            <StatTile label="Online peak" icon={Gauge} value={num(live?.peakToday ?? 0)} hint="Concurrent visitors today" />
          </div>
        </div>
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Page views, last 30 days" subtitle="Daily analytics">
          {isLoading ? <SkeletonRows rows={4} /> : <AreaChart data={daily} label="Page views per day" series={2} height={220} formatX={(x) => new Date(x).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />}
        </Panel>
        <Panel
          title="Latest activity"
          actions={
            <Link to="/admin/logs" className="ad-link">
              All logs <ArrowRight size={13} />
            </Link>
          }
        >
          <ActivityFeed />
        </Panel>
      </div>
      <p className="ad-footnote">
        <UserRound size={13} aria-hidden="true" /> Visitors are anonymous unless signed in. Locations are approximate (IP-based).
      </p>
    </div>
  );
}
