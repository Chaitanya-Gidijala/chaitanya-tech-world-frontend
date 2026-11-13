import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion } from 'framer-motion';
import { EventType } from '../../algorithms/types.js';
import './ArrayRenderer.css';

// Variable names rendered as pointer tags under the bars.
const POINTER_KEYS = new Set([
  'i', 'j', 'k', 'minIdx', 'low', 'mid', 'high', 'left', 'right',
  'start', 'end', 'pos', 'mid1', 'mid2', 'prev', 'bound', 'root', 'largest',
]);

const ACTIVE_STATE = {
  [EventType.COMPARE]: 'comparing',
  [EventType.SWAP]: 'swapping',
  [EventType.SHIFT]: 'swapping',
  [EventType.SELECT]: 'selected',
  [EventType.INSERT]: 'selected',
  [EventType.POINTER_MOVE]: 'pointer',
  [EventType.MARK_FOUND]: 'found',
};

/** Visual state of the bar at `index` for the current trace event. */
function stateFor(index, event) {
  if (!event) return 'default';
  const { type, indices = [], sortedIndices = [], discarded = [], foundIndex } = event;
  if (foundIndex === index) return 'found';
  if (discarded.includes(index)) return 'discarded';
  if (sortedIndices.includes(index)) {
    return type === EventType.MARK_SORTED && indices.includes(index) ? 'sorted-new' : 'sorted';
  }
  if (indices.includes(index)) return ACTIVE_STATE[type] ?? 'active';
  return 'default';
}

/** Pointer variables (i, j, low, mid…) that currently point at `index`. */
function pointersFor(index, event) {
  if (!event?.variables) return [];
  return Object.entries(event.variables)
    .filter(([key, val]) => POINTER_KEYS.has(key) && val === index)
    .map(([key]) => key);
}

/**
 * Height of a bar as a percentage of the slot. Uses log scaling when one value
 * dwarfs the rest so small bars stay visible.
 */
function heightPercent(value, maxValue, logScale) {
  const v = Math.abs(value);
  const ratio = logScale ? Math.log1p(v) / Math.log1p(maxValue) : v / Math.max(1, maxValue);
  return Math.max(4, ratio * 100);
}

/**
 * ArrayRenderer — the array as an animated bar chart.
 *
 * @param {{id: string, val: number}[]} array  current values with stable ids (for swap animations)
 * @param {object} currentEvent                current trace event (drives colours and pointers)
 * @param {number} maxValue                    largest value, for scaling
 */
export default function ArrayRenderer({ array, currentEvent, maxValue = 100 }) {
  if (!array || array.length === 0) return null;

  const mean = array.reduce((sum, item) => sum + Math.abs(item.val), 0) / array.length;
  const logScale = maxValue > mean * 3 && maxValue > 100;
  const density = array.length > 14 ? 'dense' : array.length > 9 ? 'medium' : 'roomy';

  return (
    <div className={clsx('tf-array-renderer', `tf-array-renderer--${density}`)}>
      <div className="tf-array-bars">
        {array.map((item, idx) => {
          const state = stateFor(idx, currentEvent);
          const pointers = pointersFor(idx, currentEvent);
          return (
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              key={item.id}
              className={`tf-bar tf-bar--${state}`}
            >
              <div className="tf-bar__slot">
                <div className="tf-bar__fill" style={{ height: `${heightPercent(item.val, maxValue, logScale)}%` }}>
                  <span className="tf-bar__val">{item.val}</span>
                </div>
              </div>
              <span className="tf-bar__idx">{idx}</span>
              <div className="tf-bar__ptrs">
                {pointers.slice(0, 2).map((p) => (
                  <span key={p} className={`tf-pointer-label tf-pointer-label--${p}`}>
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
