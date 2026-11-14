import { formatDuration } from '@/features/engagement/lib/dates';

/**
 * Share helpers — the spoiler-free result (emoji squares, like Wordle) as text,
 * plus a 1200×630 social card rendered on a canvas.
 */

export const DAILY_PATH = '/daily';

/** "#3 of 41" for small fields, "Top 7%" once enough people have played. */
export function formatStanding(standing) {
  if (!standing?.rank || !standing?.total) return null;
  const { rank, total } = standing;
  if (total < 50) return `#${rank} of ${total}`;
  return `Top ${Math.max(1, Math.ceil((rank / total) * 100))}%`;
}

export function shareUrl() {
  return `${window.location.origin}${DAILY_PATH}`;
}

export function shareText({ number, answers, durationMs, streak }) {
  const score = answers.filter(Boolean).length;
  const squares = answers.map((a) => (a ? '🟩' : '🟥')).join('');
  const lines = [
    `Traceflow Daily #${number} — ${score}/3`,
    `${squares}  ⏱ ${formatDuration(durationMs)}${streak > 1 ? `  🔥 ${streak}-day streak` : ''}`,
    shareUrl(),
  ];
  return lines.join('\n');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Render the result card to a PNG Blob. */
export async function renderShareCard({ number, answers, durationMs, streak, standing }) {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  try {
    await document.fonts?.ready;
  } catch {
    /* fonts optional */
  }
  const sans = "'Geist', 'Segoe UI', system-ui, sans-serif";
  const display = "'Syne', 'Geist', system-ui, sans-serif";

  // Background — deep space with a violet → cyan glow.
  ctx.fillStyle = '#06070d';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.1, 40, W * 0.85, H * 0.1, 700);
  glow.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
  glow.addColorStop(1, 'rgba(6, 7, 13, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W * 0.1, H, 40, W * 0.1, H, 600);
  glow2.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
  glow2.addColorStop(1, 'rgba(6, 7, 13, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const brand = ctx.createLinearGradient(80, 0, 700, 0);
  brand.addColorStop(0, '#a78bfa');
  brand.addColorStop(1, '#22d3ee');

  // Header
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `600 26px ${sans}`;
  ctx.fillText('CHAITANYA TECH WORLD  ·  TRACEFLOW DAILY', 80, 100);

  ctx.fillStyle = brand;
  ctx.font = `800 96px ${display}`;
  ctx.fillText(`Daily #${number}`, 80, 210);

  // Score squares
  const score = answers.filter(Boolean).length;
  answers.forEach((ok, i) => {
    const x = 80 + i * 130;
    roundRect(ctx, x, 260, 110, 110, 22);
    ctx.fillStyle = ok ? '#22c55e' : '#ef4444';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = `700 54px ${sans}`;
    ctx.textAlign = 'center';
    ctx.fillText(ok ? '✓' : '✕', x + 55, 335);
    ctx.textAlign = 'left';
  });

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 120px ${display}`;
  ctx.fillText(`${score}/3`, 500, 360);

  // Stat chips
  const chips = [`⏱  ${formatDuration(durationMs)}`];
  if (streak > 0) chips.push(`🔥  ${streak}-day streak`);
  const place = formatStanding(standing);
  if (place) chips.push(place);
  let cx = 80;
  ctx.font = `600 32px ${sans}`;
  chips.forEach((label) => {
    const w = ctx.measureText(label).width + 48;
    roundRect(ctx, cx, 420, w, 64, 32);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, cx + 24, 463);
    cx += w + 16;
  });

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `500 28px ${sans}`;
  ctx.fillText('Can you beat it? Play today’s puzzle →', 80, 565);
  ctx.fillStyle = brand;
  ctx.font = `700 28px ${sans}`;
  ctx.textAlign = 'right';
  ctx.fillText(shareUrl().replace(/^https?:\/\//, ''), W - 80, 565);
  ctx.textAlign = 'left';

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

/**
 * Share with the native sheet (image + text when supported), falling back to
 * copying the text. Returns 'shared' | 'copied' | 'cancelled'.
 */
export async function shareResult(result) {
  const text = shareText(result);
  try {
    if (navigator.share) {
      const blob = await renderShareCard(result);
      const file = blob && new File([blob], `traceflow-daily-${result.number}.png`, { type: 'image/png' });
      const payload = file && navigator.canShare?.({ files: [file] }) ? { text, files: [file] } : { text };
      await navigator.share(payload);
      return 'shared';
    }
  } catch (err) {
    if (err?.name === 'AbortError') return 'cancelled';
  }
  await navigator.clipboard.writeText(text);
  return 'copied';
}

export async function downloadShareCard(result) {
  const blob = await renderShareCard(result);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `traceflow-daily-${result.number}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
