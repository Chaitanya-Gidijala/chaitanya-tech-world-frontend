import { useSyncExternalStore } from 'react';
import config from '@/config/apiConfig';

/**
 * Learner account session (public site). Separate from the admin session.
 *
 *   • email + password via the security-service (/api/v1/auth/login, /register)
 *   • Google / GitHub via the security-service OAuth2 flow, which redirects back
 *     to /oauth2/callback?token=…
 */

const TOKEN_KEY = 'ctw_user_token';
const USER_KEY = 'ctw_user';
const RETURN_KEY = 'ctw_auth_return';
const listeners = new Set();

export const AUTH_ORIGIN = (() => {
  try {
    return new URL(config.AUTH_API_URL).origin;
  } catch {
    return '';
  }
})();

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
    if (!claims || (claims.exp && claims.exp * 1000 <= Date.now())) return null;
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      user = null;
    }
    const roles = claims.roles ?? user?.roles ?? [];
    return {
      token,
      username: claims.sub,
      email: claims.email ?? user?.email ?? null,
      name: user?.name || claims.sub,
      provider: user?.provider ?? null,
      roles,
      isAdmin: roles.includes('ROLE_ADMIN'),
      expiresAt: claims.exp ? claims.exp * 1000 : null,
    };
  } catch {
    return null;
  }
}

let session = typeof window === 'undefined' ? null : read();

function emit() {
  session = read();
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) emit();
  });
}

export const getAccount = () => session;

export function useAccount() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getAccount,
    getAccount,
  );
}

export class AccountError extends Error {}

async function json(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function loadProfile(token) {
  try {
    const res = await fetch(config.endpoints.auth.me, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const body = await json(res);
    return body.data ?? null;
  } catch {
    return null;
  }
}

async function establish(token, user, provider) {
  const profile = user ?? (await loadProfile(token));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...(profile ?? {}), provider: provider ?? profile?.provider ?? 'account' }));
  emit();
  return getAccount();
}

export async function signInWithPassword(identity, password) {
  let res;
  try {
    res = await fetch(config.endpoints.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: identity.trim(), password }),
    });
  } catch {
    throw new AccountError('Cannot reach the sign-in service. It may be waking up — try again in a few seconds.');
  }
  const body = await json(res);
  if (!res.ok || !body.data?.accessToken) {
    throw new AccountError(res.status === 401 || res.status === 400 ? 'Incorrect email or password.' : body.message || 'Sign-in failed.');
  }
  return establish(body.data.accessToken, body.data.user, 'account');
}

/** Create an account (name, email, password), then sign in. */
export async function register(name, email, password) {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'learner';
  const username = `${base.length >= 3 ? base : `${base}user`}${Math.floor(100 + Math.random() * 900)}`;
  let res;
  try {
    res = await fetch(config.endpoints.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), username, email: email.trim(), password }),
    });
  } catch {
    throw new AccountError('Cannot reach the sign-in service. It may be waking up — try again in a few seconds.');
  }
  const body = await json(res);
  if (!res.ok) {
    const fieldErrors = body.data && typeof body.data === 'object' ? Object.values(body.data).join(' ') : '';
    throw new AccountError(body.message?.includes('exist') ? 'An account with this email already exists — sign in instead.' : fieldErrors || body.message || 'Could not create the account.');
  }
  return signInWithPassword(email, password);
}

/** Redirect to Google / GitHub through the security-service. */
export function startOAuth(provider) {
  try {
    sessionStorage.setItem(RETURN_KEY, window.location.pathname + window.location.search);
    sessionStorage.setItem('ctw_auth_provider', provider);
  } catch {
    /* ignore */
  }
  window.location.href = `${AUTH_ORIGIN}/oauth2/authorization/${provider}`;
}

/** Called on /oauth2/callback?token=… */
export async function completeOAuth(token) {
  let provider = 'account';
  let returnTo = '/progress';
  try {
    provider = sessionStorage.getItem('ctw_auth_provider') || 'account';
    returnTo = sessionStorage.getItem(RETURN_KEY) || '/progress';
    sessionStorage.removeItem(RETURN_KEY);
    sessionStorage.removeItem('ctw_auth_provider');
  } catch {
    /* ignore */
  }
  const account = await establish(token, null, provider);
  return { account, returnTo: returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/progress' };
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emit();
}

/** Authenticated JSON request to the main API on behalf of the learner. */
export async function accountRequest(path, { method = 'GET', body } = {}) {
  const token = getAccount()?.token;
  if (!token) throw new AccountError('Please sign in first.');
  const res = await fetch(`${config.API_BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    signOut();
    throw new AccountError('Your session expired. Please sign in again.');
  }
  const data = await json(res);
  if (!res.ok) throw new AccountError(data.message || `Request failed (${res.status})`);
  return data.data ?? data;
}

/* ── Tiny event bus so any component can open the sign-in dialog ─────────── */

const openers = new Set();
export function openAuth(reason) {
  openers.forEach((fn) => fn(reason));
}
export function onOpenAuth(fn) {
  openers.add(fn);
  return () => openers.delete(fn);
}
