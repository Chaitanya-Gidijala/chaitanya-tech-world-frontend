import { useMemo } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { Button } from '@/design-system';
import { EventType } from '../algorithms/types.js';
import { visualizerPath } from '../utils/algoMeta.js';

const MAX_STEPS = 10;

// Events worth narrating in a worked example (loop bookkeeping is skipped).
const KEY_EVENTS = new Set([
  EventType.COMPARE,
  EventType.SWAP,
  EventType.SHIFT,
  EventType.INSERT,
  EventType.MARK_SORTED,
  EventType.MARK_FOUND,
  EventType.POINTER_MOVE,
  EventType.COMPLETE,
]);

const CELL_STATE = {
  [EventType.COMPARE]: 'compare',
  [EventType.SWAP]: 'swap',
  [EventType.SHIFT]: 'swap',
  [EventType.INSERT]: 'select',
  [EventType.POINTER_MOVE]: 'select',
  [EventType.MARK_FOUND]: 'found',
  [EventType.MARK_SORTED]: 'sorted',
};

function cellState(event, i) {
  if (event.foundIndex === i) return 'found';
  if (event.type === EventType.COMPLETE) return event.sortedIndices?.includes(i) ? 'sorted' : '';
  if (event.discarded?.includes(i)) return 'out';
  if (event.indices?.includes(i)) return CELL_STATE[event.type] ?? 'select';
  if (event.sortedIndices?.includes(i)) return 'sorted';
  return '';
}

/** Mini array snapshot for one step. */
function Snapshot({ event }) {
  return (
    <div className="tfp-snap" aria-hidden="true">
      {event.arrayState.map((v, i) => (
        <span key={i} className={clsx('tfp-snap__cell', cellState(event, i) && `is-${cellState(event, i)}`)}>
          {v}
        </span>
      ))}
    </div>
  );
}

/**
 * WorkedExample — runs the real algorithm on a tiny input and narrates the key
 * steps with an array snapshot for each. Generated from the same trace the
 * visualiser plays, so it is always accurate.
 */
export default function WorkedExample({ algo }) {
  const example = algo.plainEnglish?.example;

  const { steps, total, last } = useMemo(() => {
    if (!example) return { steps: [], total: 0, last: null };
    const trace = algo.hasTarget
      ? algo.traceGenerator(example.input, example.target)
      : algo.traceGenerator(example.input);
    const key = trace.filter((e) => KEY_EVENTS.has(e.type) && e.type !== EventType.COMPLETE);
    return { steps: key.slice(0, MAX_STEPS), total: key.length, last: trace[trace.length - 1] };
  }, [algo, example]);

  if (!example) return null;

  return (
    <div className="tfp-example">
      <div className="tfp-example__start">
        <p>
          Let’s {algo.hasTarget ? `search for ${example.target} in` : 'sort'}{' '}
          <code>[{example.input.join(', ')}]</code>
        </p>
      </div>

      <ol className="tfp-example__steps">
        {steps.map((e, i) => (
          <li key={i} className="tfp-example__step">
            <span className="tfp-example__num">{i + 1}</span>
            <div className="tfp-example__body">
              <p className="tfp-example__title">{e.description}</p>
              {e.explanation && <p className="tfp-example__text">{e.explanation}</p>}
              <Snapshot event={e} />
            </div>
          </li>
        ))}
      </ol>

      {total > steps.length && (
        <p className="tfp-example__more">…and {total - steps.length} more steps. Watch every one in the visualiser.</p>
      )}

      {last && (
        <div className="tfp-example__result">
          <p className="tfp-example__title">{last.description}</p>
          <Snapshot event={last} />
        </div>
      )}

      <Button to={visualizerPath(algo.slug)} iconStart={<Play size={14} />} className="tfp-example__cta">
        Play this in the visualiser
      </Button>
    </div>
  );
}
