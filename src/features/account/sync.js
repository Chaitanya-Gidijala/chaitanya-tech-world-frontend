import { getLearnerId, progressStore, replaceProgress } from '@/features/engagement/lib/store';
import { accountRequest, getAccount } from './session';

/**
 * Cross-device progress for signed-in learners.
 *
 *   • on sign-in: link this browser's visitor id to the account, then merge the
 *     local progress with the server copy (server unions both) and adopt the result
 *   • afterwards: push local changes (debounced)
 */

let timer = null;
let unsubscribe = null;
let lastSent = '';

async function push() {
  if (!getAccount()) return;
  const state = progressStore.getState();
  const body = JSON.stringify(state);
  if (body === lastSent) return;
  try {
    const merged = await accountRequest('/me/progress', { method: 'PUT', body: state });
    lastSent = body;
    if (merged && typeof merged === 'object') replaceProgress(merged);
    lastSent = JSON.stringify(progressStore.getState());
  } catch {
    /* offline or expired — retried on the next change */
  }
}

export async function linkAndSync(provider) {
  const account = getAccount();
  if (!account) return;
  try {
    await accountRequest('/me/identify', { method: 'POST', body: { visitorId: getLearnerId(), name: account.name, provider } });
  } catch {
    /* identity linking is best-effort */
  }
  await push();
  startAutoSync();
}

export function startAutoSync() {
  if (unsubscribe || !getAccount()) return;
  unsubscribe = progressStore.subscribe(() => {
    clearTimeout(timer);
    timer = setTimeout(push, 4000);
  });
}

export function stopAutoSync() {
  unsubscribe?.();
  unsubscribe = null;
  clearTimeout(timer);
  lastSent = '';
}
