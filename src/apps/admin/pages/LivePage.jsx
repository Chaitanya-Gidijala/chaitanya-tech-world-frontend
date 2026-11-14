import { useMemo, useState } from 'react';
import { useNow } from '../lib/useNow';
import clsx from 'clsx';
import { Monitor, RadioTower, Search, Smartphone, Tablet, TrendingUp, UsersRound } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { useLiveMonitor } from '../lib/liveMonitor';
import { ago, duration, flag, num, place, refHost, visitorName } from '../lib/format';
import { BarList } from '../components/charts';
import { EmptyState, PageHeader, Panel, StatTile, StatusPill } from '../components/ui';
import VisitorDrawer from '../components/VisitorDrawer';

const DEVICE_ICON = { Mobile: Smartphone, Tablet, Desktop: Monitor };

function VisitorCell({ s }) {
  return (
    <span className="ad-visitor">
      <span className="ad-visitor__avatar" aria-hidden="true">
        {flag(s.countryCode)}
      </span>
      <span>
        <strong>{s.username ?? visitorName(s.visitorId)}</strong>
        <span className="ad-visitor__sub">
          {s.returning ? 'Returning today' : 'New today'}
          {!s.visible && ' · background tab'}
        </span>
      </span>
    </span>
  );
}

export default function LivePage() {
  useDocumentMeta({ title: 'Live visitors | CTW Control', robots: 'noindex, nofollow' });
  const presence = useLiveMonitor((s) => s.presence);
  const status = useLiveMonitor((s) => s.status);
  const now = useNow();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const sessions = useMemo(() => presence?.sessions ?? [], [presence]);
  const b = presence?.breakdown ?? {};
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) =>
      [s.path, s.title, s.country, s.city, s.region, s.browser, s.os, s.device, s.referrer, s.visitorId, s.username, s.ip]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [sessions, query]);

  const mobile = sessions.filter((s) => s.device === 'Mobile').length;

  return (
    <div className="ad-page">
      <PageHeader
        title="Live visitors"
        description="Everyone with the website open right now. Updates in real time; a visitor drops off ~45s after closing the tab."
        actions={<StatusPill tone={status === 'live' ? 'success' : 'warning'}>{status === 'live' ? 'Streaming' : 'Reconnecting'}</StatusPill>}
      />

      <div className="ad-stats ad-stats--4">
        <StatTile live label="Online now" icon={RadioTower} value={num(b.live ?? 0)} hint={`${num(b.visitors ?? 0)} distinct visitors`} />
        <StatTile label="Peak today" icon={TrendingUp} value={num(b.peakToday ?? 0)} hint={b.peakAt ? `at ${new Date(b.peakAt).toLocaleTimeString()}` : '—'} />
        <StatTile label="Countries" icon={UsersRound} value={num(b.countries?.length ?? 0)} hint={b.countries?.[0] ? `Most: ${b.countries[0].name}` : '—'} />
        <StatTile label="On mobile" icon={Smartphone} value={sessions.length ? `${Math.round((mobile / sessions.length) * 100)}%` : '—'} hint={`${mobile} of ${sessions.length} sessions`} />
      </div>

      <Panel
        title={`Sessions (${filtered.length})`}
        padded={false}
        actions={
          <label className="ad-search">
            <Search size={15} aria-hidden="true" />
            <input type="search" placeholder="Filter by page, country, device…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter sessions" />
          </label>
        }
      >
        {!filtered.length ? (
          <EmptyState icon={RadioTower} title={sessions.length ? 'No sessions match the filter' : 'Nobody is on the site right now'}>
            {sessions.length ? 'Clear the filter to see everyone.' : 'Visitors appear here the moment they open any page.'}
          </EmptyState>
        ) : (
          <>
            <div className="ad-table-wrap ad-only-desktop">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th scope="col">Visitor</th>
                    <th scope="col">Location</th>
                    <th scope="col">Viewing</th>
                    <th scope="col">Device</th>
                    <th scope="col">Source</th>
                    <th scope="col" className="is-num">Pages</th>
                    <th scope="col" className="is-num">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const DeviceIcon = DEVICE_ICON[s.device] ?? Monitor;
                    return (
                      <tr key={s.sessionId} className="is-clickable" onClick={() => setSelected(s.visitorId)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelected(s.visitorId)}>
                        <td>
                          <VisitorCell s={s} />
                        </td>
                        <td>
                          <span className="ad-cell-main">{place(s)}</span>
                          <span className="ad-cell-sub">{s.ip}</span>
                        </td>
                        <td className="ad-cell-path">
                          <code>{s.path}</code>
                          <span className="ad-cell-sub">{duration(now - s.pageSince)} on page</span>
                        </td>
                        <td>
                          <span className="ad-inline-icon">
                            <DeviceIcon size={14} aria-hidden="true" /> {s.browser}
                          </span>
                          <span className="ad-cell-sub">{s.os}</span>
                        </td>
                        <td>{refHost(s.referrer)}</td>
                        <td className="is-num">{s.pageViews}</td>
                        <td className="is-num">
                          {duration(now - s.startedAt)}
                          <span className="ad-cell-sub">seen {ago(s.lastSeen, now)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="ad-cards ad-only-mobile">
              {filtered.map((s) => (
                <li key={s.sessionId}>
                  <button type="button" className="ad-card-btn" onClick={() => setSelected(s.visitorId)}>
                    <div className="ad-card-btn__top">
                      <VisitorCell s={s} />
                      <span className="ad-muted">{duration(now - s.startedAt)}</span>
                    </div>
                    <code className="ad-card-btn__path">{s.path}</code>
                    <span className="ad-card-btn__meta">
                      {place(s)} · {s.device} · {s.browser} · {s.pageViews} page{s.pageViews === 1 ? '' : 's'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <div className="ad-grid ad-grid--3">
        <Panel title="Pages" subtitle="What people are reading">
          <BarList items={b.pages} renderName={(i) => <code>{i.name}</code>} empty="—" />
        </Panel>
        <Panel title="Countries">
          <BarList items={b.countries} empty="—" />
        </Panel>
        <Panel title="Sources">
          <BarList items={b.referrers} empty="—" />
        </Panel>
        <Panel title="Devices">
          <BarList items={b.devices} empty="—" />
        </Panel>
        <Panel title="Browsers">
          <BarList items={b.browsers} empty="—" />
        </Panel>
        <Panel title="Map" subtitle="Approximate visitor positions" className={clsx(!sessions.some((s) => s.lat != null) && 'ad-panel--dim')}>
          <DotMap sessions={sessions} />
        </Panel>
      </div>

      <VisitorDrawer visitorId={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/** Equirectangular dot plot of live sessions (no basemap — graticule only). */
function DotMap({ sessions }) {
  const pts = sessions.filter((s) => s.lat != null && s.lon != null);
  if (!pts.length) return <p className="ad-empty-line">Positions appear once locations resolve.</p>;
  return (
    <svg viewBox="0 0 360 180" className="ad-dotmap" role="img" aria-label={`${pts.length} visitors plotted by location`}>
      {[-120, -60, 0, 60, 120].map((lon) => (
        <line key={`lon${lon}`} x1={lon + 180} x2={lon + 180} y1="0" y2="180" className="ad-dotmap__grid" />
      ))}
      {[-60, -30, 0, 30, 60].map((lat) => (
        <line key={`lat${lat}`} x1="0" x2="360" y1={90 - lat} y2={90 - lat} className="ad-dotmap__grid" />
      ))}
      {pts.map((s) => (
        <circle key={s.sessionId} cx={s.lon + 180} cy={90 - s.lat} r="4" className="ad-dotmap__dot">
          <title>{`${place(s)} — ${s.path}`}</title>
        </circle>
      ))}
    </svg>
  );
}
