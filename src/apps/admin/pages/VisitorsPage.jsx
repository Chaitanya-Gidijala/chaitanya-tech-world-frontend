import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Download, Repeat, Search, Sparkles, UserPlus, Users } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { useLiveMonitor } from '../lib/liveMonitor';
import { useNow } from '../lib/useNow';
import { ago, flag, num, place, visitorName, who } from '../lib/format';
import { download } from '../lib/logs';
import { BarList } from '../components/charts';
import { EmptyState, ErrorBanner, PageHeader, Panel, Segmented, SkeletonRows, StatTile, StatusPill } from '../components/ui';
import VisitorDrawer from '../components/VisitorDrawer';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'returning', label: 'Returning' },
  { value: 'signedIn', label: 'Signed in' },
];

const SORTS = [
  { value: 'lastSeen', label: 'Last seen' },
  { value: 'firstSeen', label: 'First seen' },
  { value: 'visits', label: 'Most visits' },
  { value: 'pageViews', label: 'Most pages' },
];

const ts = (v) => (v ? new Date(v).getTime() : null);

function toCsv(rows) {
  const cols = ['visitorId', 'firstSeen', 'lastSeen', 'visits', 'pageViews', 'source', 'utmCampaign', 'landingPage', 'lastPage', 'city', 'region', 'country', 'isp', 'ip', 'device', 'os', 'browser', 'screen', 'language', 'timezone', 'username', 'email'];
  const esc = (v) => (v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

export default function VisitorsPage() {
  useDocumentMeta({ title: 'Visitors | CTW Control', robots: 'noindex, nofollow' });
  const now = useNow(30_000);
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState({ q: '', type: '', device: '', sort: 'lastSeen' });
  const [applied, setApplied] = useState(form);
  const [page, setPage] = useState(0);
  const online = useLiveMonitor((s) => new Set((s.presence?.sessions ?? []).map((x) => x.visitorId)));
  const selected = params.get('visitor');

  const summary = useQuery({ queryKey: ['admin', 'visitor-summary'], queryFn: ({ signal }) => adminApi.visitorSummary({ signal }), refetchInterval: 60_000 });
  const query = {
    q: applied.q || undefined,
    type: applied.type || undefined,
    device: applied.device || undefined,
    sort: applied.sort,
    page,
    size: 50,
  };
  const list = useQuery({
    queryKey: ['admin', 'directory', query],
    queryFn: ({ signal }) => adminApi.directory(query, { signal }),
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });

  const s = summary.data;
  const rows = list.data?.items ?? [];
  const open = (id) => setParams(id ? { visitor: id } : {}, { replace: false });
  const apply = (next) => {
    setForm(next);
    setApplied(next);
    setPage(0);
  };

  return (
    <div className="ad-page">
      <PageHeader
        title="Visitors"
        description="Every visitor to the site, stored permanently: first and last visit, how often they come back, where they came from and what they used."
      />
      <ErrorBanner error={summary.error || list.error} onRetry={() => { summary.refetch(); list.refetch(); }} />

      <div className="ad-stats">
        <StatTile label="All visitors" icon={Users} value={num(s?.total)} hint={`${num(s?.active30d)} active in 30 days`} />
        <StatTile label="New · 24h" icon={UserPlus} value={num(s?.new24h)} hint="First visit in the last day" />
        <StatTile label="Returning · 24h" icon={Repeat} value={num(s?.returning24h)} hint={`${num(s?.active24h)} active in the last day`} />
        <StatTile label="Online now" icon={Sparkles} value={num(online.size)} hint="Live sessions" live />
      </div>

      <div className="ad-grid ad-grid--3">
        <Panel title="Where they come from" subtitle="Source · 30 days">
          <BarList items={s?.sources30d} empty="—" />
        </Panel>
        <Panel title="Countries" subtitle="Approximate · 30 days">
          <BarList items={s?.countries30d} empty="—" />
        </Panel>
        <Panel title="Devices & browsers" subtitle="30 days">
          <BarList items={[...(s?.devices30d ?? []), ...(s?.browsers30d ?? []).slice(0, 4)]} empty="—" />
        </Panel>
      </div>

      <Panel
        padded={false}
        title={`${num(list.data?.total ?? 0)} visitor${list.data?.total === 1 ? '' : 's'}`}
        actions={
          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => download(`ctw-visitors-${Date.now()}.csv`, toCsv(rows))} disabled={!rows.length}>
            <Download size={14} /> CSV
          </button>
        }
      >
        <form
          className="ad-filters ad-filters--form"
          onSubmit={(e) => {
            e.preventDefault();
            apply(form);
          }}
        >
          <label className="ad-search ad-filters__grow">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              placeholder="City, country, source, IP, provider, page, email…"
              value={form.q}
              onChange={(e) => setForm({ ...form, q: e.target.value })}
              aria-label="Search visitors"
            />
          </label>
          <Segmented label="Visitor type" value={form.type} onChange={(type) => apply({ ...form, type })} options={TYPES} />
          <select className="ad-select" value={form.device} onChange={(e) => apply({ ...form, device: e.target.value })} aria-label="Device">
            {['', 'Desktop', 'Mobile', 'Tablet', 'Bot'].map((d) => (
              <option key={d} value={d}>
                {d || 'Any device'}
              </option>
            ))}
          </select>
          <select className="ad-select" value={form.sort} onChange={(e) => apply({ ...form, sort: e.target.value })} aria-label="Sort by">
            {SORTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button type="submit" className="ad-btn ad-btn--primary ad-btn--sm">
            Search
          </button>
        </form>

        {list.isLoading ? (
          <div className="ad-panel__body">
            <SkeletonRows rows={8} />
          </div>
        ) : rows.length ? (
          <>
            <div className="ad-table-wrap ad-only-desktop">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th scope="col">Visitor</th>
                    <th scope="col">Approx. location</th>
                    <th scope="col">Source</th>
                    <th scope="col">Device</th>
                    <th scope="col" className="is-num">Visits</th>
                    <th scope="col" className="is-num">Pages</th>
                    <th scope="col">First seen</th>
                    <th scope="col">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v) => (
                    <tr key={v.visitorId} className="is-clickable" onClick={() => open(v.visitorId)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open(v.visitorId)}>
                      <td>
                        <span className="ad-visitor">
                          <span className="ad-visitor__avatar" aria-hidden="true">
                            {flag(v.countryCode)}
                          </span>
                          <span>
                            <strong>{who(v) ?? visitorName(v.visitorId)}</strong>
                            <span className="ad-visitor__sub">
                              {online.has(v.visitorId) ? <StatusPill tone="success">Online</StatusPill> : v.visits > 1 ? 'Returning' : 'New'}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="ad-cell-main">{place(v)}</span>
                        <span className="ad-cell-sub">{v.isp ?? v.ip}</span>
                      </td>
                      <td>
                        <span className="ad-cell-main">{v.source ?? 'Direct'}</span>
                        {v.utmCampaign && <span className="ad-cell-sub">{v.utmCampaign}</span>}
                      </td>
                      <td>
                        <span className="ad-cell-main">{v.device}</span>
                        <span className="ad-cell-sub">
                          {v.os} · {v.browser}
                        </span>
                      </td>
                      <td className="is-num">{num(v.visits)}</td>
                      <td className="is-num">{num(v.pageViews)}</td>
                      <td title={new Date(v.firstSeen).toLocaleString()}>{ago(ts(v.firstSeen), now)}</td>
                      <td title={new Date(v.lastSeen).toLocaleString()} className={clsx(online.has(v.visitorId) && 'ad-text-success')}>
                        {online.has(v.visitorId) ? 'Now' : ago(ts(v.lastSeen), now)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="ad-cards ad-only-mobile">
              {rows.map((v) => (
                <li key={v.visitorId}>
                  <button type="button" className="ad-card-btn" onClick={() => open(v.visitorId)}>
                    <div className="ad-card-btn__top">
                      <strong>
                        {flag(v.countryCode)} {who(v) ?? visitorName(v.visitorId)}
                      </strong>
                      <span className="ad-muted">{online.has(v.visitorId) ? 'Online' : ago(ts(v.lastSeen), now)}</span>
                    </div>
                    <span className="ad-card-btn__path">{place(v)}</span>
                    <span className="ad-card-btn__meta">
                      {num(v.visits)} visits · {num(v.pageViews)} pages · {v.source ?? 'Direct'} · {v.device} · {v.browser}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="ad-pager">
              <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="ad-muted">
                Page {page + 1} of {Math.max(1, list.data?.pages ?? 1)}
              </span>
              <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page + 1 >= (list.data?.pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <EmptyState icon={Users} title="No visitors match">
            Visitors are recorded from the first page they open.
          </EmptyState>
        )}
      </Panel>

      <VisitorDrawer visitorId={selected} onClose={() => open(null)} />
    </div>
  );
}
