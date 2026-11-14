import { useSyncExternalStore } from 'react';
import { adminApi } from './api';

/**
 * Live monitor — one shared Server-Sent Events connection for the whole admin app.
 *
 * Frames:  presence (who is online) · logs (new log lines, batched per second)
 *          metrics (rates, latency, JVM — every 5s)
 * The stream is opened with a one-time ticket; on any drop a fresh ticket is
 * fetched and the stream reconnects with exponential backoff.
 */

const MAX_LOGS = 2_000;
const MAX_HISTORY = 120; // 120 × 5s = 10 minutes of sparkline history

const initial = {
  status: 'idle', // idle | connecting | live | reconnecting | offline
  presence: null,
  logs: [],
  metrics: null,
  history: [],
  lastEventAt: null,
  error: null,
};

let state = initial;
const listeners = new Set();
let source = null;
let retryTimer = null;
let attempts = 0;
let wanted = false;

function set(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function onLogs(e) {
  try {
    const batch = JSON.parse(e.data);
    if (!Array.isArray(batch) || !batch.length) return;
    const merged = state.logs.concat(batch);
    set({ logs: merged.length > MAX_LOGS ? merged.slice(merged.length - MAX_LOGS) : merged, lastEventAt: Date.now() });
  } catch {
    /* ignore bad frame */
  }
}

function onPresence(e) {
  try {
    set({ presence: JSON.parse(e.data), lastEventAt: Date.now() });
  } catch {
    /* ignore */
  }
}

function onMetrics(e) {
  try {
    const m = JSON.parse(e.data);
    const point = {
      at: m.at ?? Date.now(),
      live: m.live ?? 0,
      rpm: m.rpm ?? 0,
      heapUsed: m.heapUsed ?? 0,
      heapMax: m.heapMax ?? 0,
      cpu: m.processCpu ?? 0,
      p95: m.p95Ms ?? 0,
    };
    const history = state.history.concat(point).slice(-MAX_HISTORY);
    set({ metrics: m, history, lastEventAt: Date.now() });
  } catch {
    /* ignore */
  }
}

async function connect() {
  if (!wanted) return;
  set({ status: attempts ? 'reconnecting' : 'connecting', error: null });
  try {
    const { ticket } = await adminApi.streamTicket();
    if (!wanted) return;
    source = new EventSource(adminApi.streamUrl(ticket));
    source.addEventListener('open', () => {
      attempts = 0;
      set({ status: 'live' });
    });
    source.addEventListener('logs', onLogs);
    source.addEventListener('presence', onPresence);
    source.addEventListener('metrics', onMetrics);
    source.addEventListener('error', () => {
      // Tickets are single-use, so never let EventSource retry by itself.
      source?.close();
      source = null;
      schedule();
    });
  } catch (err) {
    set({ error: err.message });
    if (err.status === 401 || err.status === 403) {
      stopLiveMonitor();
      return;
    }
    schedule();
  }
}

function schedule() {
  if (!wanted) return;
  attempts += 1;
  const delay = Math.min(30_000, 1_000 * 2 ** Math.min(attempts, 5));
  set({ status: attempts > 4 ? 'offline' : 'reconnecting' });
  clearTimeout(retryTimer);
  retryTimer = setTimeout(connect, delay);
}

export function startLiveMonitor() {
  if (wanted) return;
  wanted = true;
  attempts = 0;
  connect();
}

export function stopLiveMonitor() {
  wanted = false;
  clearTimeout(retryTimer);
  source?.close();
  source = null;
  state = { ...initial };
  listeners.forEach((l) => l());
}

export function reconnectNow() {
  source?.close();
  source = null;
  attempts = 0;
  clearTimeout(retryTimer);
  connect();
}

export function clearLogs() {
  set({ logs: [] });
}

const getState = () => state;

export function useLiveMonitor(selector = (s) => s) {
  const snap = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getState,
    getState,
  );
  return selector(snap);
}
