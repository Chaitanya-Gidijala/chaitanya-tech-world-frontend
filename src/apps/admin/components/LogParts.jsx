import clsx from 'clsx';
import { KIND_META } from '../lib/logs';
import { dateTime, ms, statusTone, visitorName, who } from '../lib/format';
import { KeyValues, StatusPill } from './ui';

export function KindBadge({ log }) {
  const meta = KIND_META[log.kind] ?? { label: log.kind, tone: 'muted' };
  return <span className={clsx('ad-kind', `is-${meta.tone}`)}>{meta.label}</span>;
}

export function StatusBadge({ status }) {
  if (status == null) return null;
  return <StatusPill tone={statusTone(status)}>{status}</StatusPill>;
}

/** Full detail for one log line (drawer body). */
export function LogDetail({ log, onVisitor }) {
  const ts = log.ts ?? (log.createdAt ? new Date(log.createdAt).getTime() : null);
  return (
    <div className="ad-stack">
      <div className="ad-detail-head">
        <KindBadge log={log} />
        <StatusBadge status={log.status} />
        {log.durationMs != null && <span className="ad-muted">{ms(log.durationMs)}</span>}
      </div>
      <KeyValues
        items={[
          ['Time', dateTime(ts)],
          log.method && ['Method', log.method],
          ['Path', log.path && <code>{log.path}</code>],
          log.query && ['Query', <code key="q">{log.query}</code>],
          log.label && [log.kind === 'REQUEST' ? 'Visitor page' : 'Label', log.label],
          log.detail && [log.kind === 'REQUEST' ? 'Referer' : 'Detail', <span key="d" className="ad-break">{log.detail}</span>],
          ['User', who(log) ?? 'Anonymous (not signed in)'],
          [
            'Visitor',
            log.visitorId ? (
              <button key="v" type="button" className="ad-link" onClick={() => onVisitor?.(log.visitorId)}>
                {visitorName(log.visitorId)} · {log.visitorId}
              </button>
            ) : (
              '—'
            ),
          ],
          log.sessionId && ['Session', <code key="s">{log.sessionId}</code>],
          ['IP address', log.ip],
          ['Approx. location (IP)', [log.city, log.country].filter(Boolean).join(', ') || '—'],
          ['Device', [log.device, log.os, log.browser].filter(Boolean).join(' · ')],
          log.appVersion && ['App version', log.appVersion],
          log.userAgent && ['User agent', <span key="ua" className="ad-break ad-muted">{log.userAgent}</span>],
        ]}
      />
    </div>
  );
}
