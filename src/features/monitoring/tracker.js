import config from '@/config/apiConfig';
import { getLearnerId } from '@/features/engagement/lib/store';

/**
 * Site tracker — feeds the admin dashboard's live visitors and activity logs.
 *
 *   presence   heartbeat every 15s + on navigation  → "who is on the site now"
 *   events     page views, clicks, JS errors, Web Vitals (batched every 5s)
 *
 * Privacy: visitors are anonymous (a random per-browser id); no form values or
 * keystrokes are ever read. With Do Not Track / Global Privacy Control enabled,
 * only the anonymous presence heartbeat is sent. Admin pages are never tracked.
 * Transport uses text/plain bodies and sendBeacon, so there is no CORS preflight.
 */

/* global __APP_VERSION__ */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const API = config.API_BASE_URL;
const HEARTBEAT_MS = 15_000;
const FLUSH_MS = 5_000;
const MAX_QUEUE = 40;

let started = false;
let sessionId = null;
let currentPath = null;
let heartbeat = null;
let flushTimer = null;
let queue = [];
const firstReferrer = typeof document !== 'undefined' ? document.referrer : '';

const privacyMode = () =>
  typeof navigator !== 'undefined' && (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1');

const isAdminPath = (p) => p === '/admin' || p.startsWith('/admin/');

function uuid() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function getSessionId() {
  if (sessionId) return sessionId;
  try {
    sessionId = sessionStorage.getItem('ctw-session') || uuid();
    sessionStorage.setItem('ctw-session', sessionId);
  } catch {
    sessionId = uuid();
  }
  return sessionId;
}

function post(path, payload, { beacon = false } = {}) {
  const body = JSON.stringify(payload);
  const url = `${API}${path}`;
  try {
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
      return;
    }
    fetch(url, { method: 'POST', body, keepalive: body.length < 60_000, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  } catch {
    /* never break the page */
  }
}

function presence(extra = {}) {
  if (!currentPath || isAdminPath(currentPath)) return;
  post('/monitor/presence', {
    sessionId: getSessionId(),
    visitorId: getLearnerId(),
    path: currentPath,
    title: document.title,
    referrer: firstReferrer,
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    appVersion: APP_VERSION,
    visible: document.visibilityState === 'visible',
    ...extra,
  });
}

function enqueue(event) {
  if (privacyMode() || !currentPath || isAdminPath(currentPath)) return;
  queue.push({ ts: Date.now(), path: currentPath, ...event });
  if (queue.length >= MAX_QUEUE) flush();
}

function flush(beacon = false) {
  if (!queue.length) return;
  const events = queue.splice(0, 50);
  post('/monitor/events', { sessionId: getSessionId(), visitorId: getLearnerId(), appVersion: APP_VERSION, events }, { beacon });
}

/* ── Clicks ────────────────────────────────────────────────────────────── */

const CLICKABLE = 'a, button, [role="button"], [role="tab"], [role="radio"], summary, input[type="checkbox"], input[type="submit"], label';

function describe(el) {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const cls = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
  return `${tag}${id}${cls}`;
}

function onClick(e) {
  const el = e.target instanceof Element ? e.target.closest(CLICKABLE) : null;
  if (!el) return;
  const text = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || el.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
  const href = el.closest('a')?.getAttribute('href');
  enqueue({ type: 'click', label: text.slice(0, 120) || describe(el), detail: href ? `${href} (${describe(el)})` : describe(el) });
}

/* ── Errors ────────────────────────────────────────────────────────────── */

let errorCount = 0;
function reportError(message, detail) {
  if (++errorCount > 20) return; // a crash loop should not flood the logs
  enqueue({ type: 'error', label: String(message).slice(0, 300), detail: String(detail ?? '').slice(0, 900) });
}

const onError = (e) => reportError(e.message || 'Script error', e.error?.stack || `${e.filename}:${e.lineno}:${e.colno}`);
const onRejection = (e) => reportError(e.reason?.message || String(e.reason || 'Unhandled promise rejection'), e.reason?.stack);

/* ── Web Vitals (lightweight, no dependency) ──────────────────────────── */

const vitals = {};
let vitalsSent = false;

function observe(type, cb) {
  try {
    const po = new PerformanceObserver((list) => list.getEntries().forEach(cb));
    po.observe({ type, buffered: true });
  } catch {
    /* unsupported entry type */
  }
}

function initVitals() {
  observe('largest-contentful-paint', (e) => {
    vitals.LCP = e.startTime;
  });
  observe('paint', (e) => {
    if (e.name === 'first-contentful-paint') vitals.FCP = e.startTime;
  });
  let cls = 0;
  observe('layout-shift', (e) => {
    if (!e.hadRecentInput) {
      cls += e.value;
      vitals.CLS = cls;
    }
  });
  observe('event', (e) => {
    if (e.interactionId && e.duration > (vitals.INP ?? 0)) vitals.INP = e.duration;
  });
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  if (nav) vitals.TTFB = nav.responseStart;
}

function sendVitals() {
  if (vitalsSent) return;
  vitalsSent = true;
  Object.entries(vitals).forEach(([name, value]) => {
    if (value != null && Number.isFinite(value)) enqueue({ type: 'vital', label: name, detail: String(Math.round(value * 1000) / 1000) });
  });
}

/* ── Lifecycle ─────────────────────────────────────────────────────────── */

function onVisibility() {
  if (document.visibilityState === 'hidden') {
    sendVitals();
    presence({ visible: false });
    flush(true);
  } else {
    presence();
  }
}

function onPageHide() {
  sendVitals();
  flush(true);
  post('/monitor/leave', { sessionId: getSessionId() }, { beacon: true });
}

export function startTracker() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (!privacyMode()) {
    document.addEventListener('click', onClick, { capture: true, passive: true });
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    initVitals();
  }
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  heartbeat = setInterval(() => presence(), HEARTBEAT_MS);
  flushTimer = setInterval(() => flush(), FLUSH_MS);
}

/** Call on every route change. */
export function trackPage(path) {
  if (!started) startTracker();
  const prev = currentPath;
  currentPath = path;
  if (isAdminPath(path)) {
    if (prev && !isAdminPath(prev)) post('/monitor/leave', { sessionId: getSessionId() }, { beacon: true });
    return;
  }
  if (prev === path) return;
  presence();
  // Wait for the page (often lazy-loaded) to set its <title>.
  setTimeout(() => {
    if (currentPath !== path) return;
    enqueue({ type: 'pageview', label: document.title, detail: prev ? `from ${prev}` : firstReferrer || 'direct' });
    presence();
  }, 800);
}

export function stopTracker() {
  clearInterval(heartbeat);
  clearInterval(flushTimer);
  started = false;
}
