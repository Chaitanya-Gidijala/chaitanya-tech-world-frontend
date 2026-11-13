import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Skeleton } from '@/design-system';
import ROUTES from '@/constants/routes';

/** PromptMedia — image or muted video thumbnail for a prompt. */
export function PromptMedia({ prompt, className, controls = false, eager = false }) {
  if (prompt.mediaType === 'VIDEO') {
    return (
      <video
        src={prompt.mediaUrl}
        className={className}
        muted
        playsInline
        loop={controls}
        autoPlay={controls}
        controls={controls}
        preload="metadata"
      />
    );
  }
  return (
    <img
      src={prompt.mediaUrl}
      alt={prompt.title}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** PromptCard — thumbnail card linking to the prompt detail page. */
export default function PromptCard({ prompt }) {
  return (
    <Link to={ROUTES.PROMPT_DETAIL(prompt.id)} className="pr-card">
      <div className="pr-card__media">
        <PromptMedia prompt={prompt} className="pr-card__img" />
        {prompt.mediaType === 'VIDEO' && (
          <span className="pr-card__video" aria-label="Video">
            <Play size={11} fill="currentColor" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="pr-card__body">
        <h3 className="pr-card__title">{prompt.title}</h3>
        <p className="pr-card__meta">
          {[prompt.aiModel, prompt.category].filter(Boolean).join(' · ') || 'Prompt'}
        </p>
      </div>
    </Link>
  );
}

export function PromptCardSkeleton() {
  return (
    <div className="pr-card is-loading" aria-hidden="true">
      <Skeleton className="pr-card__media" height="auto" radius={0} />
      <div className="pr-card__body">
        <Skeleton width="80%" height={14} />
        <Skeleton width="45%" height={10} style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}
