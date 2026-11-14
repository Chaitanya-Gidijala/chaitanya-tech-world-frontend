import { lazy } from 'react';

/**
 * Stale-deploy protection for code-split routes.
 *
 * After a new deploy, a tab that is still open asks for the previous build's
 * chunk files, which no longer exist, so the dynamic import fails and the route
 * renders nothing. When that happens we reload once to pick up the new build.
 * A sessionStorage guard prevents reload loops if the network is really down.
 */

const KEY = 'ctw-chunk-reload-at';
const LOOP_GUARD_MS = 30_000;

export function isChunkLoadError(error) {
  const msg = String(error?.message ?? error ?? '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed|ChunkLoadError|MIME type/i.test(msg);
}

/** Reload the page once (per 30s) to recover from a stale deploy. Returns true when a reload was triggered. */
export function reloadForNewDeploy() {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < LOOP_GUARD_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage unavailable — still try once */
  }
  window.location.reload();
  return true;
}

export function lazyWithRetry(factory) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      if (isChunkLoadError(error) && reloadForNewDeploy()) {
        // Keep Suspense pending while the page reloads.
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

/** Vite fires this when a preloaded dependency of a chunk fails to load. */
export function installStaleChunkHandler() {
  if (typeof window === 'undefined') return;
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadForNewDeploy()) event.preventDefault();
  });
}
