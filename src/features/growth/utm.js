/** Adds campaign tags so the admin dashboard can attribute visits to each channel. */
export function withUtm(url, source, campaign = 'share') {
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', 'social');
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    return url;
  }
}
