import { useId } from 'react';
import clsx from 'clsx';

/**
 * BrandLogo — the Chaitanya Tech World mark.
 *
 * A bold "C" (Chaitanya) with a rising trace line that breaks out of its opening
 * and ends in a glowing node — learning that grows beyond the frame.
 * Same artwork as /public/favicon.svg; keep the two in sync.
 *
 * @param {number} size      rendered size in px
 * @param {boolean} animated draws the trace line and pulses the node on mount
 */
export default function BrandLogo({ size = 36, animated = false, className, title }) {
  const id = useId().replace(/:/g, '');
  const gradId = `ctw-logo-bg-${id}`;

  return (
    <svg
      className={clsx('brand-logo', animated && 'brand-logo--animated', className)}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8B5CFF" />
          <stop offset="0.55" stopColor="#5B6CFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradId})`} />
      <path
        className="brand-logo__c"
        d="M43.6 21.4A16 16 0 1 0 43.6 42.6"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
        pathLength="1"
      />
      <path
        className="brand-logo__trace"
        d="M23.5 37.5 30 31l5 4.2 10.6-11.4"
        stroke="#fff"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <circle className="brand-logo__node" cx="47.6" cy="21.6" r="4.6" fill="#fff" />
      <circle className="brand-logo__core" cx="47.6" cy="21.6" r="2" fill="#22D3EE" />
    </svg>
  );
}
