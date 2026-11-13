import { useEffect, useRef } from 'react';
import clsx from 'clsx';

const TYPE_LABEL = {
  COMPARE: 'compare',
  SWAP: 'swap',
  SHIFT: 'shift',
  INSERT: 'insert',
  SELECT: 'select',
  POINTER_MOVE: 'pointer',
  MARK_SORTED: 'sorted',
  MARK_FOUND: 'found',
  VARIABLE_UPDATE: 'update',
  COMPLETE: 'done',
};

/**
 * TraceLog — every step of the run as a clickable list. Clicking a step jumps
 * the visualisation there; the current step stays scrolled into view.
 */
export default function TraceLog({ events, stepIndex, onJump }) {
  const listRef = useRef(null);

  useEffect(() => {
    const current = listRef.current?.querySelector('[aria-current="step"]');
    current?.scrollIntoView({ block: 'nearest' });
  }, [stepIndex]);

  return (
    <ol className="tfv-log" ref={listRef}>
      <li>
        <button
          type="button"
          className={clsx('tfv-log__item', stepIndex === 0 && 'is-current')}
          aria-current={stepIndex === 0 ? 'step' : undefined}
          onClick={() => onJump(0)}
        >
          <span className="tfv-log__num">0</span>
          <span className="tfv-log__desc">Initial array</span>
        </button>
      </li>
      {events.map((e, i) => {
        const n = i + 1;
        return (
          <li key={n}>
            <button
              type="button"
              className={clsx('tfv-log__item', n === stepIndex && 'is-current', n > stepIndex && 'is-future')}
              aria-current={n === stepIndex ? 'step' : undefined}
              onClick={() => onJump(n)}
            >
              <span className="tfv-log__num">{n}</span>
              <span className={`tfv-log__type tfv-log__type--${(TYPE_LABEL[e.type] ?? 'step')}`}>{TYPE_LABEL[e.type] ?? 'step'}</span>
              <span className="tfv-log__desc">{e.description}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
