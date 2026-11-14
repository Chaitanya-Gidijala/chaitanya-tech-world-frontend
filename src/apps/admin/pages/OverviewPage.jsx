import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { AlertTriangle, ArrowRight, Eye, Globe2, Inbox, Puzzle, RadioTower, Timer, UserRound, Zap } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { useLiveMonitor } from '../lib/liveMonitor';
import { compact, ms, num, time, visitorName } from '../lib/format';
import { AreaChart, BarList } from '../components/charts';
import { ErrorBanner, PageHeader, Panel, SkeletonRows, StatTile } from '../components/ui';
import { KindBadge } from '../components/LogParts';
import { logTitle } from '../lib/logs';

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
              {l.username ?? visitorName(l.visitorId)} · {l.city ?? l.country ?? l.ip ?? '—'}
            </span>
          </span>
          <time className="ad-feed__time">{time(l.ts)}</time>
        </li>
      ))}
    </ul>
  );
}

export default function OverviewPage() {
  useDocumentMeta({ title: 'Overview | CTW Control', robots: 'noindex, nofollow' });
  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: ({ signal }) => adminApi.overview({ signal }),
    refetchInterval: 30_000,
  });

  const presence = useLiveMonitor((s) => s.presence);
  const metrics = useLiveMonitor((s) => s.metrics);
  const history = useLiveMonitor((s) => s.history);

  const live = presence?.breakdown ?? data?.live;
  const m = metrics ?? data?.metrics;
  const series = (m?.series ?? []).map((p) => ({ x: p.t, y: p.requests }));
  const daily = (data?.daily30 ?? []).map((d) => ({ x: new Date(d.dateId).getTime(), y: d.totalViews }));
  const puzzle = data?.dailyChallenge;
  const errorRate = m?.errorRate ?? 0;

  return (
    <div className="ad-page">
      <PageHeader
        title="Overview"
        description={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      />
      <ErrorBanner error={error} onRetry={refetch} />

      <div className="ad-stats">
        <StatTile
          live
          label="Online now"
          icon={RadioTower}
          value={num(live?.live ?? 0)}
          hint={`Peak today ${num(live?.peakToday ?? data?.today?.peakConcurrent ?? 0)}`}
          trend={history.map((h) => h.live)}
        />
        <StatTile label="Page views today" icon={Eye} value={num(data?.today?.views)} hint={`${compact(data?.allTimeViews)} all time`} />
        <StatTile label="Unique visitors today" icon={UserRound} value={num(data?.today?.uniqueVisitors)} hint={`${num(live?.visitors ?? 0)} on site now`} />
        <StatTile label="Requests / min" icon={Zap} value={num(m?.rpm ?? 0)} hint={`${compact(m?.requests)} in the last ${m?.series?.length ?? 60} min`} trend={history.map((h) => h.rpm)} />
        <StatTile label="p95 latency" icon={Timer} value={ms(m?.p95Ms)} hint={`p50 ${ms(m?.p50Ms)} · avg ${ms(m?.avgMs)}`} trend={history.map((h) => h.p95)} series={2} />
        <StatTile
          label="Server error rate"
          icon={AlertTriangle}
          value={`${errorRate}%`}
          tone={errorRate >= 5 ? 'danger' : errorRate >= 1 ? 'warning' : undefined}
          hint={`${num(m?.serverErrors ?? 0)} 5xx · ${num(m?.clientErrors ?? 0)} 4xx`}
        />
        <StatTile label="Daily puzzle players" icon={Puzzle} value={num(puzzle?.completions)} hint={puzzle ? `Puzzle #${puzzle.day} · avg ${puzzle.averageScore}/3` : '—'} />
        <StatTile
          label="Unread inquiries"
          icon={Inbox}
          value={num(data?.inquiries?.unread)}
          tone={data?.inquiries?.unread > 0 ? 'warning' : undefined}
          hint={`${num(data?.inquiries?.total)} total`}
        />
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Requests per minute" subtitle="Every API request to the Spring Boot service, live">
          <AreaChart data={series} label="Requests per minute" height={220} />
        </Panel>
        <Panel
          title="Right now"
          subtitle="Pages being viewed"
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
        <Panel title="Where visitors are" subtitle="Live, by country">
          <BarList items={live?.countries} empty="No live visitors" />
        </Panel>
        <Panel title="Devices" subtitle="Live sessions">
          <BarList items={live?.devices} empty="No live visitors" />
        </Panel>
        <Panel title="Traffic sources" subtitle="Live sessions">
          <BarList items={live?.referrers} empty="No live visitors" />
        </Panel>
      </div>

      <div className="ad-grid ad-grid--2-1">
        <Panel title="Page views, last 30 days" subtitle="From the daily analytics table">
          {isLoading ? <SkeletonRows rows={4} /> : <AreaChart data={daily} label="Page views per day" series={2} height={220} formatX={(x) => new Date(x).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />}
        </Panel>
        <Panel
          title="Latest activity"
          subtitle="Requests, page views and clicks"
          actions={
            <Link to="/admin/logs" className="ad-link">
              All logs <ArrowRight size={13} />
            </Link>
          }
        >
          <ActivityFeed />
        </Panel>
      </div>

      <div className="ad-grid ad-grid--3">
        <Panel title="Top pages · 24h" subtitle="Client page views">
          <BarList items={data?.topPages24h} renderName={(i) => <code>{i.name}</code>} empty="No page views recorded yet" />
        </Panel>
        <Panel title="Top countries · 24h" subtitle="Client page views">
          <BarList
            items={data?.topCountries24h}
            empty="No page views recorded yet"
            renderName={(i) => (
              <span className={clsx(i.name === 'Unknown' && 'ad-muted')}>
                <Globe2 size={12} aria-hidden="true" /> {i.name}
              </span>
            )}
          />
        </Panel>
        <Panel title="Busiest API endpoints" subtitle="Since the API started">
          <BarList items={(data?.topEndpoints ?? []).map((e) => ({ name: e.endpoint, count: e.count }))} renderName={(i) => <code>{i.name}</code>} empty="No requests yet" />
        </Panel>
      </div>
    </div>
  );
}
