import { useMemo } from 'react';
import clsx from 'clsx';
import { CheckCircle2, Square, Volume2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech.js';

/**
 * PlainEnglish — a conversational, spoken-style explanation of an algorithm with
 * an optional "Listen" mode that reads it aloud and highlights each paragraph.
 */
export default function PlainEnglish({ algo }) {
  const content = algo.plainEnglish;
  const paragraphs = useMemo(
    () => (content ? [content.hook, ...content.story, `Remember: ${content.takeaways.join(' ')}`] : []),
    [content],
  );
  const { supported, speaking, current, start, stop } = useSpeech(paragraphs);

  if (!content) return null;

  return (
    <article className="tfp-plain">
      <header className="tfp-plain__head">
        <p className={clsx('tfp-plain__hook', current === 0 && 'is-reading')}>{content.hook}</p>
        {supported && (
          <button
            type="button"
            className={clsx('tfp-listen', speaking && 'is-on')}
            onClick={speaking ? stop : start}
            aria-pressed={speaking}
          >
            {speaking ? <Square size={14} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            {speaking ? 'Stop' : 'Listen'}
            {speaking && (
              <span className="tfp-listen__wave" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        )}
      </header>

      <div className="tfp-plain__story">
        {content.story.map((p, i) => (
          <p key={i} className={clsx(current === i + 1 && 'is-reading')}>
            {p}
          </p>
        ))}
      </div>

      <div className={clsx('tfp-plain__takeaways', current === paragraphs.length - 1 && 'is-reading')}>
        <p className="tfp-plain__label">Remember</p>
        <ul>
          {content.takeaways.map((t) => (
            <li key={t}>
              <CheckCircle2 size={16} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
