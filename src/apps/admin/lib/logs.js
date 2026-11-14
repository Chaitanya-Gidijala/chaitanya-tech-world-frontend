/** Log-line helpers shared by the activity feed, live tail and history search. */

export const KIND_META = {
  REQUEST: { label: 'API', tone: 'info' },
  PAGEVIEW: { label: 'View', tone: 'accent' },
  CLICK: { label: 'Click', tone: 'neutral' },
  ERROR: { label: 'Error', tone: 'danger' },
  VITAL: { label: 'Vital', tone: 'success' },
  HEARTBEAT: { label: 'Beat', tone: 'muted' },
};

/** One-line human description of a log line. */
export function logTitle(l) {
  switch (l.kind) {
    case 'REQUEST':
      return `${l.method} ${l.path}${l.query ? `?${l.query}` : ''}`;
    case 'PAGEVIEW':
      return `Viewed ${l.path}${l.label ? ` — ${l.label}` : ''}`;
    case 'CLICK':
      return `Clicked “${l.label || 'element'}” on ${l.path}`;
    case 'ERROR':
      return `${l.label || 'JavaScript error'} on ${l.path}`;
    case 'VITAL':
      return `${l.label} = ${l.detail} on ${l.path}`;
    case 'HEARTBEAT':
      return `${l.method} ${l.path}`;
    default:
      return l.path ?? l.kind;
  }
}

/** Plain-text haystack for client-side search. */
export function logText(l) {
  return [l.kind, l.method, l.path, l.query, l.label, l.detail, l.username, l.visitorId, l.ip, l.country, l.city, l.browser, l.os, l.status]
    .filter((v) => v != null)
    .join(' ')
    .toLowerCase();
}

export function toCsv(rows) {
  const cols = ['createdAt', 'kind', 'method', 'path', 'query', 'status', 'durationMs', 'username', 'visitorId', 'ip', 'country', 'city', 'browser', 'os', 'device', 'label', 'detail'];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(c === 'createdAt' ? r.createdAt ?? new Date(r.ts).toISOString() : r[c])).join(','))].join('\n');
}

export function download(name, text, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
