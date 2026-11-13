import { Lightbulb, Sparkles } from 'lucide-react';

/** ExplainPanel — narration of the current step: what happened, why, and a beginner analogy. */
export default function ExplainPanel({ event, algo, beginner, onToggleBeginner }) {
  return (
    <div className="tfv-explain">
      <label className="tfv-switch">
        <input type="checkbox" checked={beginner} onChange={(e) => onToggleBeginner(e.target.checked)} />
        <span className="tfv-switch__track" aria-hidden="true">
          <span />
        </span>
        Beginner tips
      </label>

      {event ? (
        <div className="tfv-explain__body" key={event.description}>
          {event.phase && <span className="tfv-phase">{event.phase}</span>}
          <h4 className="tfv-explain__title">{event.description}</h4>
          <p className="tfv-explain__text">{event.explanation}</p>
          {event.whyText && (
            <div className="tfv-note tfv-note--why">
              <Lightbulb size={15} aria-hidden="true" />
              <p>
                <strong>Why? </strong>
                {event.whyText}
              </p>
            </div>
          )}
          {beginner && event.beginnerNote && (
            <div className="tfv-note tfv-note--tip">
              <Sparkles size={15} aria-hidden="true" />
              <p>
                <strong>Think of it like this: </strong>
                {event.beginnerNote}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="tfv-explain__body">
          <h4 className="tfv-explain__title">Ready when you are</h4>
          <p className="tfv-explain__text">{algo.intuition}</p>
          <p className="tfv-explain__hint">
            Press <kbd>Space</kbd> to play, <kbd>←</kbd> <kbd>→</kbd> to step.
          </p>
        </div>
      )}
    </div>
  );
}
