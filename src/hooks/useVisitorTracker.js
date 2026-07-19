import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementVisitorCount } from '@/features/job-portal/services/analyticsService';

/**
 * useVisitorTracker — Production-grade, zero double-count visitor tracker.
 *
 * THREE-LAYER dedup strategy:
 *  1. sessionStorage: each resolved canonical path fires AT MOST ONCE per browser tab session.
 *     (survives React StrictMode remounts, survives re-renders, survives prop changes)
 *  2. Module-level Map: 5-second cooldown per path, guards against any edge-case double fire
 *     between the sessionStorage write and the async fetch completing.
 *  3. Admin route exclusion: /AdminPortal paths never tracked.
 */

// ── Module-level 5-second cooldown guard (survives StrictMode remounts) ───────
const inFlight = new Map(); // path → timestamp
const COOLDOWN_MS = 5000;

const isInCooldown = (path) => {
    const last = inFlight.get(path);
    return last && Date.now() - last < COOLDOWN_MS;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getBrowser = () => {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua))         return 'Edge';
    if (/OPR\/|Opera/.test(ua))   return 'Opera';
    if (/Chrome\//.test(ua))      return 'Chrome';
    if (/Firefox\//.test(ua))     return 'Firefox';
    if (/Safari\//.test(ua))      return 'Safari';
    if (/MSIE|Trident/.test(ua))  return 'IE';
    return 'Unknown';
};

const getOS = () => {
    const ua = navigator.userAgent;
    if (/Windows/.test(ua))       return 'Windows';
    if (/Android/.test(ua))       return 'Android';
    if (/iPhone|iPad/.test(ua))   return 'iOS';
    if (/Mac/.test(ua))           return 'macOS';
    if (/Linux/.test(ua))         return 'Linux';
    return 'Unknown';
};

const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/Tablet|iPad/.test(ua))                  return 'Tablet';
    if (/Mobile|Android|iPhone|iPod/.test(ua))   return 'Mobile';
    return 'Desktop';
};

// ── Session storage key for tracked paths ─────────────────────────────────────
const SESSION_KEY = 'ctw_tracked_paths';

const hasTrackedThisSession = (path) => {
    try {
        const tracked = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
        return tracked.includes(path);
    } catch {
        return false;
    }
};

const markTrackedThisSession = (path) => {
    try {
        const tracked = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
        if (!tracked.includes(path)) {
            tracked.push(path);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(tracked));
        }
    } catch {
        // sessionStorage unavailable (private mode edge case) — fallback to cooldown only
    }
};

// ── Record daily stat in localStorage for chart rendering ─────────────────────
const recordDailyStat = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = 'jp_daily_stats';
    try {
        const daily = JSON.parse(localStorage.getItem(key) || '{}');
        daily[today] = (daily[today] || 0) + 1;
        // Prune entries older than 30 days
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        Object.keys(daily).forEach(d => { if (new Date(d) < cutoff) delete daily[d]; });
        localStorage.setItem(key, JSON.stringify(daily));
    } catch { /* localStorage unavailable */ }
};

// ── Hook ──────────────────────────────────────────────────────────────────────
const useVisitorTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        // Layer 0: never track admin portal
        if (path.startsWith('/AdminPortal')) return;

        // Layer 1: sessionStorage — this path already tracked in this tab session
        if (hasTrackedThisSession(path)) return;

        // Layer 2: module-level cooldown — handles StrictMode double-fire
        if (isInCooldown(path)) return;

        // --- Commit: mark as tracked BEFORE the async call so any re-run is blocked ---
        markTrackedThisSession(path);
        inFlight.set(path, Date.now());
        recordDailyStat();

        // Get current user if logged in (for tracking admin/registered visits)
        let userEmail = 'anonymous';
        try {
            const userStr = localStorage.getItem('jp_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.email) userEmail = user.email;
            }
        } catch(e) {}

        // Gather deep system specs
        const sysInfo = [
            `TZ: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            `Screen: ${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
            `Cores: ${navigator.hardwareConcurrency || 'unknown'}`,
            `RAM: ${navigator.deviceMemory ? navigator.deviceMemory + 'GB+' : 'unknown'}`,
            `Conn: ${navigator.connection ? navigator.connection.effectiveType : 'unknown'}`,
        ].join(' | ');

        const metadata = {
            page:         path,
            browser:      getBrowser(),
            os:           getOS(),
            device:       getDeviceType(),
            language:     navigator.language || 'unknown',
            referrer:     document.referrer || 'direct',
            userEmail:    userEmail,
            systemInfo:   sysInfo,
        };

        incrementVisitorCount(metadata).catch(() => {});
    }, [location.pathname]);
};

export default useVisitorTracker;
