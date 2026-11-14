/** Formatting helpers for the admin dashboard. */

export const num = (n) => (n == null || Number.isNaN(n) ? '—' : Number(n).toLocaleString());

export function compact(n) {
  if (n == null) return '—';
  return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function bytes(b) {
  if (b == null || b < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = b;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function duration(ms) {
  if (ms == null) return '—';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

export function ago(ts, now = Date.now()) {
  if (!ts) return '—';
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const time = (ts) =>
  ts ? new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

export const dateTime = (ts) =>
  ts ? new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

export const ms = (v) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`);

/** 🇮🇳 from "IN". */
export function flag(code) {
  if (!code || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return '🌐';
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function place(s) {
  const parts = [s?.city, s?.region, s?.country].filter(Boolean);
  if (parts.length) return [...new Set(parts)].join(', ');
  return s?.timezone ? s.timezone.replace(/_/g, ' ') : 'Locating…';
}

export function statusTone(status) {
  if (status == null || status === 0) return 'muted';
  if (status >= 500) return 'danger';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'info';
  return 'success';
}

export const shortId = (id) => (id ? `${id.slice(0, 4)}…${id.slice(-4)}` : '—');

/** Stable friendly name for an anonymous visitor ("Visitor 3fa2"). */
export const visitorName = (id) => (id ? `Visitor ${id.slice(0, 4).toUpperCase()}` : 'Anonymous');

/** "news.ycombinator.com" from a referrer URL; "Direct" when absent. */
export function refHost(ref) {
  if (!ref) return 'Direct';
  try {
    return new URL(ref).hostname.replace(/^www\./, '') || 'Direct';
  } catch {
    return 'Other';
  }
}
