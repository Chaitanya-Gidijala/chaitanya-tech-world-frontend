import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Download, Pause, Play, ScrollText, Search, Trash2 } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { clearLogs, useLiveMonitor } from '../lib/liveMonitor';
import { dateTime, ms, num, time, visitorName } from '../lib/format';
import { download, logText, logTitle, toCsv } from '../lib/logs';
import { Drawer, EmptyState, ErrorBanner, PageHeader, Panel, Segmented, SkeletonRows } from '../components/ui';
import { KindBadge, LogDetail, StatusBadge } from '../components/LogParts';
import VisitorDrawer from '../components/VisitorDrawer';

const KINDS = [
  { value: 'ALL', label: 'All' },
  { value: 'REQUEST', label: 'API requests' },
  { value: 'PAGEVIEW', label: 'Page views' },
  { value: 'CLICK', label: 'Clicks' },
  { value: 'ERROR', label: 'Errors' },
  { value: 'VITAL', label: 'Vitals' },
];

const STATUS = [
  { value: '', label: 'Any status' },
  { value: '2xx', label: '2xx' },
  { value: '3xx', label: '3xx' },
  { value: '4xx', label: '4xx' },
  { value: '5xx', label: '5xx' },
];

const RENDER_LIMIT = 400;

function LogRows({ rows, onOpen, onVisitor }) {
  return (
    <>
      <div className="ad-table-wrap ad-only-desktop">
        <table className="ad-table ad-table--logs">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Event</th>
              <th scope="col">Status</th>
              <th scope="col" className="is-num">Latency</th>
              <th scope="col">Who</th>
              <th scope="col">Where</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.key} className={clsx('is-clickable', (l.status >= 500 || l.kind === 'ERROR') && 'is-error')} onClick={() => onOpen(l)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(l)}>
                <td className="ad-cell-time" title={dateTime(l.ts)}>
                  {time(l.ts)}
                </td>
                <td>
                  <KindBadge log={l} />
                </td>
                <td className="ad-cell-event">{logTitle(l)}</td>
                <td>
                  <StatusBadge status={l.status} />
                </td>
                <td className="is-num">{l.durationMs != null ? ms(l.durationMs) : ''}</td>
                <td>
                  {l.username ? (
                    <strong>{l.username}</strong>
                  ) : l.visitorId ? (
                    <button
                      type="button"
                      className="ad-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitor(l.visitorId);
                      }}
                    >
                      {visitorName(l.visitorId)}
                    </button>
                  ) : (
                    <span className="ad-muted">{l.ip ?? 'Anonymous'}</span>
                  )}
                </td>
                <td className="ad-cell-sub-inline">{[l.city, l.country].filter(Boolean).join(', ') || l.ip || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="ad-cards ad-only-mobile">
        {rows.map((l) => (
          <li key={l.key}>
            <button type="button" className={clsx('ad-card-btn', (l.status >= 500 || l.kind === 'ERROR') && 'is-error')} onClick={() => onOpen(l)}>
              <div className="ad-card-btn__top">
                <span className="ad-inline-icon">
                  <KindBadge log={l} /> <StatusBadge status={l.status} />
                </span>
                <span className="ad-muted">{time(l.ts)}</span>
              </div>
              <span className="ad-card-btn__path">{logTitle(l)}</span>
              <span className="ad-card-btn__meta">
                {l.username ?? visitorName(l.visitorId)} · {[l.city, l.country].filter(Boolean).join(', ') || l.ip || '—'}
                {l.durationMs != null && ` · ${ms(l.durationMs)}`}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function LiveTail({ onOpen, onVisitor }) {
  const logs = useLiveMonitor((s) => s.logs);
  const [kind, setKind] = useState('ALL');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState(null);

  const source = paused ? frozen ?? logs : logs;
  const togglePause = () => {
    setFrozen(paused ? null : logs);
    setPaused((p) => !p);
  };

  const counts = useMemo(() => {
    const c = { ALL: 0 };
    logs.forEach((l) => {
      if (l.kind === 'HEARTBEAT') return;
      c.ALL++;
      c[l.kind] = (c[l.kind] ?? 0) + 1;
    });
    return c;
  }, [logs]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = [];
    for (let i = source.length - 1; i >= 0 && out.length < RENDER_LIMIT; i--) {
      const l = source[i];
      if (l.kind === 'HEARTBEAT') continue;
      if (kind !== 'ALL' && l.kind !== kind) continue;
      if (status && !(l.status && String(l.status)[0] === status[0])) continue;
      if (q && !logText(l).includes(q)) continue;
      out.push({ ...l, key: `live-${l.seq}` });
    }
    return out;
  }, [source, kind, status, query]);

  const pending = paused ? logs.length - (frozen?.length ?? 0) : 0;

  return (
    <Panel
      padded={false}
      title="Live tail"
      subtitle={`${num(counts.ALL)} lines this session · newest first`}
      actions={
        <div className="ad-toolbar">
          <button type="button" className={clsx('ad-btn ad-btn--sm', paused ? 'ad-btn--primary' : 'ad-btn--ghost')} onClick={togglePause}>
            {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? `Resume${pending > 0 ? ` (${pending} new)` : ''}` : 'Pause'}
          </button>
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => download(`ctw-live-logs-${Date.now()}.csv`, toCsv(rows))} disabled={!rows.length}>
            <Download size={14} /> CSV
          </button>
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={clearLogs} aria-label="Clear live tail">
            <Trash2 size={14} />
          </button>
        </div>
      }
    >
      <div className="ad-filters">
        <Segmented label="Log type" value={kind} onChange={setKind} options={KINDS.map((k) => ({ ...k, count: counts[k.value] ?? 0 }))} />
        <div className="ad-filters__row">
          <label className="ad-search">
            <Search size={15} aria-hidden="true" />
            <input type="search" placeholder="Search path, user, IP, city, click text…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search live logs" />
          </label>
          <select className="ad-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter">
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {rows.length ? (
        <LogRows rows={rows} onOpen={onOpen} onVisitor={onVisitor} />
      ) : (
        <EmptyState icon={ScrollText} title={logs.length ? 'No lines match these filters' : 'Waiting for activity'}>
          Every API request, page view, click and front-end error appears here within a second.
        </EmptyState>
      )}
    </Panel>
  );
}

function History({ onOpen, onVisitor }) {
  const [form, setForm] = useState({ kind: 'ALL', q: '', status: '', method: '', from: '', to: '' });
  const [applied, setApplied] = useState(form);
  const [page, setPage] = useState(0);

  const params = {
    kind: applied.kind === 'ALL' ? undefined : applied.kind,
    q: applied.q || undefined,
    status: applied.status || undefined,
    method: applied.method || undefined,
    from: applied.from ? new Date(applied.from).getTime() : undefined,
    to: applied.to ? new Date(applied.to).getTime() : undefined,
    page,
    size: 50,
  };

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: ({ signal }) => adminApi.searchLogs(params, { signal }),
    placeholderData: keepPreviousData,
  });

  const rows = (data?.items ?? []).map((r) => ({ ...r, ts: new Date(r.createdAt).getTime(), key: `db-${r.id}` }));
  const submit = (e) => {
    e.preventDefault();
    setPage(0);
    setApplied(form);
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Panel
      padded={false}
      title="History"
      subtitle={data ? `${num(data.total)} matching lines in the database` : 'Search everything that has been logged'}
      actions={
        <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => download(`ctw-logs-page-${page + 1}.csv`, toCsv(data?.items ?? []))} disabled={!rows.length}>
          <Download size={14} /> CSV
        </button>
      }
    >
      <form className="ad-filters ad-filters--form" onSubmit={submit}>
        <label className="ad-search ad-filters__grow">
          <Search size={15} aria-hidden="true" />
          <input type="search" placeholder="Path, user, IP, visitor id, city…" value={form.q} onChange={set('q')} aria-label="Search history" />
        </label>
        <select className="ad-select" value={form.kind} onChange={set('kind')} aria-label="Type">
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <select className="ad-select" value={form.status} onChange={set('status')} aria-label="Status">
          {STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select className="ad-select" value={form.method} onChange={set('method')} aria-label="HTTP method">
          {['', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <option key={m} value={m}>
              {m || 'Any method'}
            </option>
          ))}
        </select>
        <input className="ad-input ad-input--sm" type="datetime-local" value={form.from} onChange={set('from')} aria-label="From" />
        <input className="ad-input ad-input--sm" type="datetime-local" value={form.to} onChange={set('to')} aria-label="To" />
        <button type="submit" className="ad-btn ad-btn--primary ad-btn--sm">
          Search
        </button>
      </form>
      <ErrorBanner error={error} onRetry={refetch} />
      {isFetching && !rows.length ? (
        <div className="ad-panel__body">
          <SkeletonRows rows={8} />
        </div>
      ) : rows.length ? (
        <>
          <LogRows rows={rows} onOpen={onOpen} onVisitor={onVisitor} />
          <div className="ad-pager">
            <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={14} /> Newer
            </button>
            <span className="ad-muted">
              Page {page + 1} of {Math.max(1, data?.pages ?? 1)}
            </span>
            <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page + 1 >= (data?.pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
              Older <ChevronRight size={14} />
            </button>
          </div>
        </>
      ) : (
        <EmptyState icon={ScrollText} title="No matching log lines">
          Logs are kept for 14 days.
        </EmptyState>
      )}
    </Panel>
  );
}

export default function LogsPage() {
  useDocumentMeta({ title: 'Activity logs | CTW Control', robots: 'noindex, nofollow' });
  const [tab, setTab] = useState('live');
  const [open, setOpen] = useState(null);
  const [visitor, setVisitor] = useState(null);
  const top = useRef(null);

  useEffect(() => top.current?.scrollIntoView({ block: 'nearest' }), [tab]);

  return (
    <div className="ad-page" ref={top}>
      <PageHeader
        title="Activity logs"
        description="Every API request, page view, click, front-end error and Web Vital — who did it, from where, and how long it took."
        actions={
          <Segmented
            label="View"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'live', label: 'Live tail' },
              { value: 'history', label: 'History' },
            ]}
          />
        }
      />
      {tab === 'live' ? <LiveTail onOpen={setOpen} onVisitor={setVisitor} /> : <History onOpen={setOpen} onVisitor={setVisitor} />}

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)} title="Log details">
        {open && (
          <LogDetail
            log={open}
            onVisitor={(id) => {
              setOpen(null);
              setVisitor(id);
            }}
          />
        )}
      </Drawer>
      <VisitorDrawer visitorId={visitor} onClose={() => setVisitor(null)} />
    </div>
  );
}
