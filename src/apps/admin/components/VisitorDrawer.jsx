import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { useNow } from '../lib/useNow';
import { useLiveMonitor } from '../lib/liveMonitor';
import { ago, dateTime, duration, flag, num, place, refHost, time, visitorName, who } from '../lib/format';
import { logTitle } from '../lib/logs';
import { Drawer, KeyValues, SkeletonRows, StatusPill } from './ui';
import { KindBadge } from './LogParts';

const DETAIL_LABELS = {
  browserVersion: 'Browser',
  osVersion: 'Operating system',
  viewport: 'Browser window',
  dpr: 'Pixel ratio',
  platform: 'Platform',
  languages: 'Preferred languages',
  cores: 'CPU cores',
  memory: 'Device memory',
  connection: 'Network type',
  downlink: 'Bandwidth (est.)',
  saveData: 'Data saver',
  touch: 'Touch screen',
  colorScheme: 'Colour scheme',
  reducedMotion: 'Reduced motion',
  pwa: 'Opened as',
  cookies: 'Cookies',
};

const ts = (v) => (v ? new Date(v).getTime() : null);

/** Everything known about one visitor: stored profile, live session, path trail, full activity timeline. */
export default function VisitorDrawer({ visitorId, onClose }) {
  const sessions = useLiveMonitor((s) => s.presence?.sessions);
  const liveLogs = useLiveMonitor((s) => s.logs);
  const session = sessions?.find((s) => s.visitorId === visitorId);
  const now = useNow();

  const { data: stored, isLoading: profileLoading } = useQuery({
    queryKey: ['admin', 'profile', visitorId],
    queryFn: ({ signal }) => adminApi.profile(visitorId, { signal }),
    enabled: Boolean(visitorId),
    refetchInterval: 20_000,
    retry: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'timeline', visitorId],
    queryFn: ({ signal }) => adminApi.timeline(visitorId, { signal }),
    enabled: Boolean(visitorId),
    refetchInterval: 15_000,
  });

  const timeline = useMemo(() => {
    const fromDb = (data ?? []).map((r) => ({ ...r, ts: new Date(r.createdAt).getTime(), key: `db-${r.id}` }));
    const newest = fromDb[0]?.ts ?? 0;
    const fresh = liveLogs
      .filter((l) => l.visitorId === visitorId && l.kind !== 'HEARTBEAT' && l.ts > newest)
      .map((l) => ({ ...l, key: `live-${l.seq}` }))
      .reverse();
    return [...fresh, ...fromDb].slice(0, 300);
  }, [data, liveLogs, visitorId]);

  const p = stored?.profile;
  const details = { ...(stored?.details ?? {}), ...(session?.details ?? {}) };
  const identity = who(session) ?? who(p);

  return (
    <Drawer open={Boolean(visitorId)} onClose={onClose} title={identity ?? visitorName(visitorId)} wide>
      <div className="ad-stack">
        <div className="ad-detail-head">
          {session ? <StatusPill tone="success">Online now</StatusPill> : <StatusPill tone="muted">Offline</StatusPill>}
          {p && <StatusPill tone={p.visits > 1 ? 'info' : 'warning'}>{p.visits > 1 ? `Returning · ${p.visits} visits` : 'New visitor'}</StatusPill>}
          {p?.bot && <StatusPill tone="danger">Bot</StatusPill>}
          <code className="ad-muted">{visitorId}</code>
        </div>

        {session && (
          <section>
            <h3 className="ad-subhead">Right now</h3>
            <KeyValues
              items={[
                ['Viewing', <code key="p">{session.path}</code>],
                ['Page title', session.title],
                ['On this page', duration(now - session.pageSince)],
                ['This visit', `${duration(now - session.startedAt)} · ${session.pageViews} page${session.pageViews === 1 ? '' : 's'}`],
                ['Tab visible', session.visible ? 'Yes' : 'No (background tab)'],
                ['Last heartbeat', ago(session.lastSeen, now)],
              ]}
            />
            {session.trail?.length > 0 && (
              <ol className="ad-trail">
                {session.trail.map((path, i) => (
                  <li key={`${path}-${i}`}>
                    <code>{path}</code>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        <section>
          <h3 className="ad-subhead">Visitor profile</h3>
          {profileLoading && !p ? (
            <SkeletonRows rows={4} />
          ) : p ? (
            <KeyValues
              items={[
                ['First seen', `${dateTime(ts(p.firstSeen))} (${ago(ts(p.firstSeen), now)})`],
                ['Last seen', session ? 'Now' : `${dateTime(ts(p.lastSeen))} (${ago(ts(p.lastSeen), now)})`],
                ['Visits · pages', `${num(p.visits)} visits · ${num(p.pageViews)} page views`],
                ['Came from', p.source ?? refHost(p.firstReferrer)],
                p.firstReferrer && ['First referrer', <span key="r" className="ad-break">{p.firstReferrer}</span>],
                p.utmCampaign && ['Campaign', [p.source, p.utmMedium, p.utmCampaign].filter(Boolean).join(' / ')],
                ['Landing page', <code key="l">{p.landingPage}</code>],
                ['Last page', <code key="lp">{p.lastPage}</code>],
                identity && ['Signed in as', identity],
              ]}
            />
          ) : (
            <p className="ad-empty-line">The profile appears a few seconds after the first visit.</p>
          )}
        </section>

        <section>
          <h3 className="ad-subhead">Location &amp; network</h3>
          <KeyValues
            items={[
              ['Approx. location (IP)', `${flag(session?.countryCode ?? p?.countryCode)} ${place(session ?? p ?? {})}`],
              ['Internet provider', session?.isp ?? p?.isp],
              ['IP address', session?.ip ?? p?.ip],
              ['Browser timezone', session?.timezone ?? p?.timezone],
              ['Language', session?.language ?? p?.language],
            ]}
          />
        </section>

        <section>
          <h3 className="ad-subhead">Device &amp; browser</h3>
          <KeyValues
            items={[
              ['Device', session?.device ?? p?.device],
              ['Screen', session?.screen ?? p?.screen],
              ...Object.entries(DETAIL_LABELS)
                .filter(([k]) => details[k])
                .map(([k, label]) => [label, details[k]]),
              session?.appVersion && ['Site version', session.appVersion],
            ]}
          />
        </section>

        <section>
          <h3 className="ad-subhead">Activity timeline</h3>
          {isLoading && !timeline.length ? (
            <SkeletonRows rows={6} />
          ) : timeline.length ? (
            <ul className="ad-timeline">
              {timeline.map((l) => (
                <li key={l.key}>
                  <time title={dateTime(l.ts)}>{time(l.ts)}</time>
                  <KindBadge log={l} />
                  <span className="ad-timeline__text">
                    {logTitle(l)}
                    {l.status != null && <span className="ad-muted"> · {l.status}</span>}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ad-empty-line">No recorded activity for this visitor yet.</p>
          )}
        </section>
      </div>
    </Drawer>
  );
}
