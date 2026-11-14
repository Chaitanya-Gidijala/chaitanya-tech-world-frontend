import config from '@/config/apiConfig';
import { getSession, signOut } from './auth';

const API = config.API_BASE_URL;
const USERS = config.endpoints.users.base;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** Authenticated JSON request; a 401 ends the session (token expired or revoked). */
export async function request(url, { method = 'GET', body, signal } = {}) {
  const token = getSession()?.token;
  let res;
  try {
    res = await fetch(url, {
      method,
      signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Network error — the API may be starting up.', 0);
  }
  if (res.status === 401) {
    signOut();
    throw new ApiError('Your session has expired. Please sign in again.', 401);
  }
  if (res.status === 403) throw new ApiError('You do not have permission for this action.', 403);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const detail = json?.message || (!json && text ? text.slice(0, 300) : '');
    throw new ApiError(detail ? `${detail} (${res.status})` : `Request failed (${res.status})`, res.status);
  }
  return json && typeof json === 'object' && 'data' in json ? json.data : json;
}

const qs = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === '') return;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const adminApi = {
  overview: (o) => request(`${API}/admin/monitor/overview`, o),
  visitors: (o) => request(`${API}/admin/monitor/visitors`, o),
  timeline: (visitorId, o) => request(`${API}/admin/monitor/visitors/${encodeURIComponent(visitorId)}/timeline`, o),
  recentLogs: (params, o) => request(`${API}/admin/monitor/logs/recent${qs(params)}`, o),
  searchLogs: (params, o) => request(`${API}/admin/monitor/logs${qs(params)}`, o),
  health: (o) => request(`${API}/admin/monitor/health`, o),
  streamTicket: () => request(`${API}/admin/monitor/stream-ticket`, { method: 'POST' }),
  streamUrl: (ticket) => `${API}/admin/monitor/stream?ticket=${encodeURIComponent(ticket)}`,
  inquiries: (o) => request(`${API}/contact/all`, o),
  markInquiry: (id, read) => request(`${API}/admin/monitor/inquiries/${id}/read?read=${read}`, { method: 'PATCH' }),
  users: (o) => request(USERS, o),
  apiPing: () => fetch(`${API}/health`).then((r) => r.ok),
};
