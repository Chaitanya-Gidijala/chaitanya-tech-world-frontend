import { useEffect, useRef, useState } from 'react';
import config from '@/config/apiConfig';
import { getLearnerId } from '../lib/store';

/**
 * Daily-challenge community stats.
 *
 *   GET  /engagement/daily/{n}/stats    snapshot
 *   POST /engagement/daily/{n}/results  submit a finished run → { stats, percentile, rank }
 *   GET  /engagement/daily/{n}/live     Server-Sent Events: `stats` on every change + presence
 *
 * The backend sleeps on the free tier, so every call is optional: the challenge
 * itself is fully client-side and the UI simply hides community numbers when offline.
 */

const { engagement } = config.endpoints;

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return body?.data ?? body;
}

export const fetchDailyStats = (day) => request(engagement.dailyStats(day));

export function submitDailyResult(day, { answers, durationMs }) {
  return request(engagement.dailyResults(day), {
    method: 'POST',
    body: JSON.stringify({
      learnerId: getLearnerId(),
      answers: answers.map((a) => (a ? 1 : 0)).join(''),
      score: answers.filter(Boolean).length,
      durationMs: Math.round(durationMs),
    }),
  });
}

const POLL_MS = 30_000;

/**
 * useLiveDailyStats — real-time stats for one puzzle.
 * Opens an SSE stream (auto-reconnecting); falls back to polling when SSE is
 * unavailable. `status` is 'connecting' | 'live' | 'polling' | 'offline'.
 */
export function useLiveDailyStats(day, { enabled = true } = {}) {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('connecting');
  const failures = useRef(0);

  useEffect(() => {
    if (!enabled || !day) return undefined;
    let cancelled = false;
    let source = null;
    let pollTimer = null;

    // Frames can arrive out of order (snapshot GET vs. stream) — keep the newest.
    const apply = (data) => {
      if (cancelled || !data) return;
      setStats((prev) => (prev?.updatedAt && data.updatedAt && data.updatedAt < prev.updatedAt ? prev : data));
    };

    const poll = async () => {
      try {
        apply(await fetchDailyStats(day));
        if (!cancelled) setStatus('polling');
      } catch {
        if (!cancelled) setStatus('offline');
      }
      if (!cancelled) pollTimer = setTimeout(poll, POLL_MS);
    };

    // Snapshot first so numbers appear even before the stream connects.
    fetchDailyStats(day).then(apply).catch(() => {});

    if (typeof EventSource === 'undefined') {
      poll();
    } else {
      const url = `${engagement.dailyLive(day)}?learnerId=${encodeURIComponent(getLearnerId())}`;
      source = new EventSource(url);
      source.addEventListener('open', () => {
        failures.current = 0;
        if (!cancelled) setStatus('live');
      });
      source.addEventListener('stats', (e) => {
        try {
          apply(JSON.parse(e.data));
          if (!cancelled) setStatus('live');
        } catch {
          /* ignore malformed frame */
        }
      });
      source.addEventListener('error', () => {
        failures.current += 1;
        // EventSource retries on its own; after repeated failures switch to polling.
        if (failures.current >= 3 && source) {
          source.close();
          source = null;
          poll();
        } else if (!cancelled) {
          setStatus('connecting');
        }
      });
    }

    return () => {
      cancelled = true;
      if (source) source.close();
      clearTimeout(pollTimer);
    };
  }, [day, enabled]);

  return { stats, status, setStats };
}
