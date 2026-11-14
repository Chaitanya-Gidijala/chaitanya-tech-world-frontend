import { useQuery } from '@tanstack/react-query';
import { AlertOctagon, Atom, Cpu, Database, Leaf, ShieldCheck } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { useLiveMonitor } from '../lib/liveMonitor';
import { ago, bytes, duration, ms, num, time } from '../lib/format';
import { logTitle } from '../lib/logs';
import { AreaChart, Meter, Sparkline, UptimeBars } from '../components/charts';
import { EmptyState, ErrorBanner, KeyValues, PageHeader, Panel, SkeletonRows, StatusPill } from '../components/ui';
import { KindBadge } from '../components/LogParts';

/* global __APP_VERSION__, __APP_BUILT_AT__ */
const ADMIN_BUILD = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const ADMIN_BUILT_AT = typeof __APP_BUILT_AT__ !== 'undefined' ? __APP_BUILT_AT__ : null;

/** Google's Core Web Vitals thresholds (good / needs improvement). */
const VITALS = {
  LCP: { label: 'Largest Contentful Paint', good: 2500, poor: 4000, unit: 'ms' },
  INP: { label: 'Interaction to Next Paint', good: 200, poor: 500, unit: 'ms' },
  CLS: { label: 'Cumulative Layout Shift', good: 0.1, poor: 0.25, unit: '' },
  FCP: { label: 'First Contentful Paint', good: 1800, poor: 3000, unit: 'ms' },
  TTFB: { label: 'Time to First Byte', good: 800, poor: 1800, unit: 'ms' },
};

function upTone(status) {
  if (status === 'UP') return 'success';
  if (status === 'DOWN') return 'danger';
  return 'warning';
}

function ServiceCard({ icon: Icon, name, status, children, footer }) {
  return (
    <article className="ad-service">
      <header className="ad-service__head">
        <span className="ad-service__icon">
          <Icon size={18} aria-hidden="true" />
        </span>
        <h3>{name}</h3>
        <StatusPill tone={upTone(status)}>{status}</StatusPill>
      </header>
      <div className="ad-service__body">{children}</div>
      {footer && <footer className="ad-service__foot">{footer}</footer>}
    </article>
  );
}

function probeFor(services, name) {
  return services?.find((s) => s.name === name);
}

export default function HealthPage() {
  useDocumentMeta({ title: 'System health | CTW Control', robots: 'noindex, nofollow' });
  const { data, error, refetch, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['admin', 'health'],
    queryFn: ({ signal }) => adminApi.health({ signal }),
    refetchInterval: 10_000,
  });
  const history = useLiveMonitor((s) => s.history);
  const liveMetrics = useLiveMonitor((s) => s.metrics);

  const jvm = data?.api?.jvm;
  const actuator = data?.api?.actuator;
  const db = data?.database;
  const security = probeFor(data?.services, 'security-service');
  const frontend = probeFor(data?.services, 'react-frontend');
  const client = data?.client;
  const m = liveMetrics ?? data?.metrics;
  const apiStatus = error ? 'DOWN' : data ? actuator?.status ?? 'UP' : 'PENDING';
  const jsErrors = client?.jsErrorsLastHour ?? 0;
  const frontendStatus = frontend?.status === 'DOWN' ? 'DOWN' : jsErrors > 20 ? 'DEGRADED' : frontend?.status ?? 'UP';

  return (
    <div className="ad-page">
      <PageHeader
        title="System health"
        description={dataUpdatedAt ? `Checked ${ago(dataUpdatedAt)} · refreshes every 10s` : 'Checking services…'}
      />
      <ErrorBanner error={error && new Error(`Spring Boot API unreachable: ${error.message}`)} onRetry={refetch} />

      <div className="ad-services">
        <ServiceCard
          icon={Leaf}
          name="Spring Boot API"
          status={apiStatus}
          footer={jvm && `Java ${jvm.javaVersion} · ${jvm.processors} CPU · started ${new Date(jvm.startedAt).toLocaleString()}`}
        >
          {isLoading ? (
            <SkeletonRows rows={3} />
          ) : (
            <KeyValues
              items={[
                ['Uptime', duration(jvm?.uptimeMs)],
                ['Requests / min', num(m?.rpm ?? 0)],
                ['p95 latency', ms(m?.p95Ms)],
                ['5xx last hour', num(m?.serverErrors ?? 0)],
                ['Actuator', actuator?.components ? Object.entries(actuator.components).map(([k, v]) => `${k}: ${v.status}`).join(' · ') : actuator?.status],
              ]}
            />
          )}
        </ServiceCard>

        <ServiceCard icon={Database} name="Database" status={db ? (db.up ? 'UP' : 'DOWN') : 'PENDING'} footer={db?.product && `${db.product} ${db.version ?? ''}`}>
          <KeyValues
            items={[
              ['Round trip', ms(db?.latencyMs)],
              ['Pending log writes', num(data?.monitor?.pendingWrites ?? 0)],
              db?.error && ['Error', db.error],
            ]}
          />
        </ServiceCard>

        <ServiceCard icon={ShieldCheck} name="Auth service" status={security?.status ?? 'PENDING'} footer={security?.url}>
          <KeyValues
            items={[
              ['Response', security?.last ? `${security.last.status || '—'} in ${ms(security.last.latencyMs)}` : 'Waiting for first probe'],
              ['Uptime (last checks)', security?.uptimePct != null ? `${security.uptimePct}%` : '—'],
              security?.last?.error && ['Error', security.last.error],
            ]}
          />
          <UptimeBars history={security?.history} />
        </ServiceCard>

        <ServiceCard icon={Atom} name="React frontend" status={frontendStatus} footer={`This dashboard build: ${ADMIN_BUILD}${ADMIN_BUILT_AT ? ` · ${new Date(ADMIN_BUILT_AT).toLocaleString()}` : ''}`}>
          <KeyValues
            items={[
              ['Site response', frontend?.last ? `${frontend.last.status || '—'} in ${ms(frontend.last.latencyMs)}` : 'Waiting for first probe'],
              ['JS errors last hour', num(jsErrors)],
              ['Page views last hour', num(client?.pageViewsLastHour ?? 0)],
              ['Versions in use', client?.versions ? Object.keys(client.versions).slice(0, 3).join(', ') || '—' : '—'],
              frontend?.last?.error && ['Error', frontend.last.error],
            ]}
          />
          <UptimeBars history={frontend?.history} />
        </ServiceCard>
      </div>

      <div className="ad-grid ad-grid--2">
        <Panel title="JVM resources" subtitle="Spring Boot process">
          {jvm ? (
            <div className="ad-stack">
              <Meter label="Heap memory" value={jvm.heapUsed} max={jvm.heapMax > 0 ? jvm.heapMax : jvm.heapCommitted} display={`${bytes(jvm.heapUsed)} / ${bytes(jvm.heapMax > 0 ? jvm.heapMax : jvm.heapCommitted)}`} />
              <Meter label="Process CPU" value={jvm.processCpu ?? 0} max={100} display={jvm.processCpu != null ? `${jvm.processCpu}%` : 'n/a'} />
              {jvm.hostMemoryTotal && <Meter label="Host memory" value={jvm.hostMemoryTotal - jvm.hostMemoryFree} max={jvm.hostMemoryTotal} display={`${bytes(jvm.hostMemoryTotal - jvm.hostMemoryFree)} / ${bytes(jvm.hostMemoryTotal)}`} />}
              <Meter label="Disk" value={jvm.diskTotal - jvm.diskFree} max={jvm.diskTotal} display={`${bytes(jvm.diskFree)} free`} warn={0.8} danger={0.95} />
              <KeyValues
                items={[
                  ['Threads', `${jvm.threads} live · ${jvm.peakThreads} peak · ${jvm.daemonThreads} daemon`],
                  ['Garbage collection', `${num(jvm.gcCount)} runs · ${ms(jvm.gcTimeMs)} total`],
                  ['Non-heap', bytes(jvm.nonHeapUsed)],
                  ['System load', jvm.systemLoad ?? 'n/a'],
                ]}
              />
              <div className="ad-mini-charts">
                <div>
                  <span className="ad-muted">Heap, last 10 min</span>
                  <Sparkline values={history.map((h) => h.heapUsed)} />
                </div>
                <div>
                  <span className="ad-muted">CPU, last 10 min</span>
                  <Sparkline values={history.map((h) => h.cpu)} series={2} />
                </div>
              </div>
            </div>
          ) : (
            <SkeletonRows rows={6} />
          )}
        </Panel>

        <Panel title="Response time" subtitle="Average per minute, last hour">
          <AreaChart data={(data?.metrics?.series ?? []).map((p) => ({ x: p.t, y: p.avgMs }))} label="Average response time" formatY={(v) => `${Math.round(v)}ms`} height={200} />
          <dl className="ad-percentiles">
            {[
              ['p50', m?.p50Ms],
              ['p95', m?.p95Ms],
              ['p99', m?.p99Ms],
              ['avg', m?.avgMs],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{ms(v)}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="ad-grid ad-grid--2">
        <Panel title="Core Web Vitals" subtitle="Real visitors, 75th percentile (Google's thresholds)">
          {client?.vitals && Object.keys(client.vitals).length ? (
            <ul className="ad-vitals">
              {Object.entries(VITALS).map(([key, v]) => {
                const sample = client.vitals[key];
                if (!sample) return null;
                const value = sample.p75;
                const tone = value <= v.good ? 'success' : value <= v.poor ? 'warning' : 'danger';
                return (
                  <li key={key}>
                    <span className="ad-vitals__name">
                      <strong>{key}</strong>
                      <span className="ad-muted">{v.label}</span>
                    </span>
                    <span className="ad-vitals__value">{v.unit === 'ms' ? ms(value) : value.toFixed(3)}</span>
                    <StatusPill tone={tone}>{tone === 'success' ? 'Good' : tone === 'warning' ? 'Needs work' : 'Poor'}</StatusPill>
                    <span className="ad-muted ad-vitals__n">{num(sample.samples)} samples</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ad-empty-line">Vitals arrive as visitors browse the site.</p>
          )}
        </Panel>

        <Panel title="Errors per minute" subtitle="Server 5xx, last hour">
          <AreaChart data={(data?.metrics?.series ?? []).map((p) => ({ x: p.t, y: p.errors }))} label="Server errors per minute" series={2} height={200} />
        </Panel>
      </div>

      <Panel title="Recent errors" subtitle="Latest server 5xx responses and front-end JavaScript errors">
        {data?.recentErrors?.length ? (
          <ul className="ad-feed">
            {data.recentErrors.map((e) => (
              <li key={e.seq}>
                <KindBadge log={e} />
                <span className="ad-feed__text">
                  <span className="ad-feed__title">{logTitle(e)}</span>
                  <span className="ad-feed__meta ad-break">{e.kind === 'ERROR' ? e.detail : `${e.status} · ${ms(e.durationMs)} · ${e.ip}`}</span>
                </span>
                <time className="ad-feed__time">{time(e.ts)}</time>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={AlertOctagon} title="No errors recorded">
            Nice. Server 5xx responses and browser errors will show up here.
          </EmptyState>
        )}
      </Panel>

      <p className="ad-footnote">
        <Cpu size={13} aria-hidden="true" /> Monitor: {num(data?.monitor?.liveStreams ?? 0)} admin stream(s) · {num(data?.monitor?.liveSessions ?? 0)} live sessions.
      </p>
    </div>
  );
}
