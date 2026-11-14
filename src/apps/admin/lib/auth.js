import { useSyncExternalStore } from 'react';
import config from '@/config/apiConfig';

/**
 * Admin session — JWT from the security-service, ROLE_ADMIN only.
 *
 * Storage keys are shared with the existing prompt admin tools (`jp_admin_token`,
 * `jp_user`) so those screens keep working inside the new dashboard.
 */

const TOKEN_KEY = 'jp_admin_token';
const USER_KEY = 'jp_user';
const listeners = new Set();

function decode(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
}

function read() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const claims = decode(token);
    if (!claims) return null;
    const roles = claims.roles ?? [];
    const expiresAt = claims.exp ? claims.exp * 1000 : null;
    if (expiresAt && expiresAt <= Date.now()) return null;
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      user = null;
    }
    return {
      token,
      username: claims.sub,
      email: claims.email ?? user?.email,
      name: user?.name ?? claims.sub,
      roles,
      isAdmin: roles.includes('ROLE_ADMIN') || roles.includes('ADMIN'),
      expiresAt,
    };
  } catch {
    return null;
  }
}

let session = read();

function emit() {
  session = read();
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) emit();
  });
}

export const getSession = () => session;

export function useAdminSession() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSession,
    getSession,
  );
}

export class AuthError extends Error {}

/** Sign in against the security-service; rejects non-admin accounts. */
export async function signIn(usernameOrEmail, password) {
  let res;
  try {
    res = await fetch(config.endpoints.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  } catch {
    throw new AuthError('Cannot reach the authentication service. It may be waking up — try again in a few seconds.');
  }
  let body = {};
  try {
    body = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    throw new AuthError(res.status === 401 || res.status === 400 ? 'Incorrect username or password.' : body.message || `Sign-in failed (${res.status}).`);
  }
  const token = body.data?.accessToken;
  const claims = token && decode(token);
  const roles = claims?.roles ?? [];
  if (!roles.includes('ROLE_ADMIN') && !roles.includes('ADMIN')) {
    throw new AuthError('This account does not have administrator access.');
  }
  localStorage.setItem(TOKEN_KEY, token);
  if (body.data.user) localStorage.setItem(USER_KEY, JSON.stringify(body.data.user));
  emit();
  return getSession();
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emit();
}

/** Re-check expiry (called on an interval by the shell). */
export function refreshSession() {
  const before = session?.token;
  session = read();
  if (before !== session?.token) listeners.forEach((l) => l());
}
