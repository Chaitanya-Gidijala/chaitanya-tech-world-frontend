import config from '@/config/apiConfig';

const API = config.API_BASE_URL;

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Network error — please try again in a moment.');
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data.data ?? data;
}

export const growthApi = {
  subscribe: (payload) => request('/newsletter/subscribe', { method: 'POST', body: payload }),
  preferences: (token) => request(`/newsletter/preferences?token=${encodeURIComponent(token)}`),
  savePreferences: (payload) => request('/newsletter/preferences', { method: 'POST', body: payload }),
  leaderboard: (board, learnerId, limit = 20) =>
    request(`/engagement/leaderboard?board=${board}&limit=${limit}${learnerId ? `&learnerId=${encodeURIComponent(learnerId)}` : ''}`),
  certificate: (code) => request(`/certificates/${encodeURIComponent(code)}`),
  pushKey: () => request('/push/public-key'),
  pushSubscribe: (payload) => request('/push/subscribe', { method: 'POST', body: payload }),
  pushUnsubscribe: (payload) => request('/push/unsubscribe', { method: 'POST', body: payload }),
};
