import { useState } from 'react';
import clsx from 'clsx';
import { Check, Link2, Send, Share2 } from 'lucide-react';
import SocialIcon from '@/components/site/SocialIcon';
import { withUtm } from './utm';
import './growth.css';

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

/**
 * One-tap sharing. Each button's aria-label ("Share on WhatsApp" …) is what the
 * site tracker records, so the admin Growth page can count shares per channel.
 */
export default function ShareBar({ url, text, campaign = 'share', title = 'Share', className, compact = false }) {
  const [copied, setCopied] = useState(false);
  const link = (source) => withUtm(url, source, campaign);
  const targets = [
    { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon />, href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${link('whatsapp')}`)}` },
    { id: 'linkedin', label: 'LinkedIn', icon: <SocialIcon name="linkedin" size={15} />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link('linkedin'))}` },
    { id: 'x', label: 'X', icon: <XIcon />, href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link('x'))}` },
    { id: 'telegram', label: 'Telegram', icon: <Send size={15} />, href: `https://t.me/share/url?url=${encodeURIComponent(link('telegram'))}&text=${encodeURIComponent(text)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${link('copy')}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const native = async () => {
    try {
      await navigator.share({ title: document.title, text, url: link('native') });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className={clsx('gr-share', compact && 'is-compact', className)} role="group" aria-label={title}>
      {!compact && <span className="gr-share__title">{title}</span>}
      <div className="gr-share__buttons">
        {targets.map((t) => (
          <a key={t.id} className={`gr-share__btn is-${t.id}`} href={t.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${t.label}`}>
            {t.icon}
            {!compact && <span>{t.label}</span>}
          </a>
        ))}
        <button type="button" className="gr-share__btn" onClick={copy} aria-label="Share by copying the link">
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {!compact && <span>{copied ? 'Copied' : 'Copy link'}</span>}
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button type="button" className="gr-share__btn" onClick={native} aria-label="Share with the device share sheet">
            <Share2 size={15} />
            {!compact && <span>More</span>}
          </button>
        )}
      </div>
    </div>
  );
}
