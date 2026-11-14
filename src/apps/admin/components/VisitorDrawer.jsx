import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { useNow } from '../lib/useNow';
import { useLiveMonitor } from '../lib/liveMonitor';
import { ago, dateTime, duration, flag, place, time, visitorName, who } from '../lib/format';
import { logTitle } from '../lib/logs';
import { Drawer, KeyValues, SkeletonRows, StatusPill } from './ui';
import { KindBadge } from './LogParts';

/** Everything known about one visitor: live session, path trail, full activity timeline. */
export default function VisitorDrawer({ visitorId, onClose }) {
  const sessions = useLiveMonitor((s) => s.presence?.sessions);
  const liveLogs = useLiveMonitor((s) => s.logs);
  const session = sessions?.find((s) => s.visitorId === visitorId);
  const now = useNow();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'timeline', visitorId],
    queryFn: ({ signal }) => adminApi.timeline(visitorId, { signal }),
    enabled: Boolean(visitorId),
    refetchInterval: 15_000,
  });

  // Merge persisted history with lines that arrived on the stream but are not yet in the DB.
  const timeline = useMemo(() => {
    const fromDb = (data ?? []).map((r) => ({ ...r, ts: new Date(r.createdAt).getTime(), key: `db-${r.id}` }));
    const newest = fromDb[0]?.ts ?? 0;
    const fresh = liveLogs
      .filter((l) => l.visitorId === visitorId && l.kind !== 'HEARTBEAT' && l.ts > newest)
      .map((l) => ({ ...l, key: `live-${l.seq}` }))
      .reverse();
    return [...fresh, ...fromDb].slice(0, 300);
  }, [data, liveLogs, visitorId]);

  return (
    <Drawer open={Boolean(visitorId)} onClose={onClose} title={visitorName(visitorId)} wide>
      <div className="ad-stack">
        <div className="ad-detail-head">
          {session ? <StatusPill tone="success">Online now</StatusPill> : <StatusPill tone="muted">Offline</StatusPill>}
          {who(session) && <StatusPill tone="info">{who(session)}</StatusPill>}
          <code className="ad-muted">{visitorId}</code>
        </div>

        {session && (
          <>
            <KeyValues
              items={[
                ['Approx. location (IP)', `${flag(session.countryCode)} ${place(session)}`],
                ['Internet provider', session.isp],
                ['Browser timezone', session.timezone],
                ['Now viewing', <code key="p">{session.path}</code>],
                ['Page title', session.title],
                ['On this page', duration(now - session.pageSince)],
                ['Session length', duration(now - session.startedAt)],
                ['Pages this session', session.pageViews],
                ['Came from', session.referrer || 'Direct'],
                ['Device', `${session.device} · ${session.os} · ${session.browser}`],
                ['Screen', session.screen],
                ['Language', session.language],
                ['IP address', session.ip],
                ['App version', session.appVersion],
                ['Tab visible', session.visible ? 'Yes' : 'No (background tab)'],
                ['Last heartbeat', ago(session.lastSeen, now)],
              ]}
            />
            {session.trail?.length > 0 && (
              <div>
                <h3 className="ad-subhead">Path this session</h3>
                <ol className="ad-trail">
                  {session.trail.map((p, i) => (
                    <li key={`${p}-${i}`}>
                      <code>{p}</code>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        <div>
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
        </div>
      </div>
    </Drawer>
  );
}
