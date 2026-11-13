import { EventType, createMetrics } from './types.js';

/**
 * createTracer — shared bookkeeping for trace generators.
 *
 * Keeps the working array, metrics and sorted/discarded sets, and turns each
 * `step()` call into a fully-populated TraceEvent (array snapshot, metrics copy,
 * sorted/discarded indices). Generators only describe *what happened*.
 *
 *   const t = createTracer(input);
 *   t.step(EventType.COMPARE, { indices: [0, 1], description, explanation, codeLine });
 *   return t.done({ description, explanation, codeLine });
 */
export function createTracer(input) {
  const arr = [...input];
  const metrics = createMetrics();
  const sorted = new Set();
  const discarded = new Set();
  const events = [];

  const step = (type, { indices = [], variables = {}, ...rest } = {}) => {
    events.push({
      type,
      indices,
      values: indices.map((i) => arr[i]),
      variables,
      sortedIndices: [...sorted],
      discarded: [...discarded],
      metrics: { ...metrics },
      arrayState: [...arr],
      ...rest,
    });
  };

  /** Compare arr[a] with arr[b] (counts a comparison + two reads). */
  const compare = (a, b) => {
    metrics.comparisons++;
    metrics.reads += 2;
    return arr[a] - arr[b];
  };

  /** Swap arr[a] and arr[b] (counts a swap + two writes). */
  const swap = (a, b) => {
    metrics.swaps++;
    metrics.writes += 2;
    [arr[a], arr[b]] = [arr[b], arr[a]];
  };

  /** Write a value (counts one write). */
  const write = (i, value) => {
    metrics.writes++;
    arr[i] = value;
  };

  const read = (i) => {
    metrics.reads++;
    return arr[i];
  };

  const markSorted = (...idx) => idx.forEach((i) => sorted.add(i));
  const discard = (from, to) => {
    for (let i = from; i <= to; i++) discarded.add(i);
  };

  /** Final COMPLETE event; marks everything sorted unless `keepSorted` is false. */
  const done = ({ keepSorted = true, ...rest } = {}) => {
    if (keepSorted) arr.forEach((_, i) => sorted.add(i));
    step(EventType.COMPLETE, { indices: [], ...rest });
    return events;
  };

  return { arr, metrics, events, step, compare, swap, write, read, markSorted, discard, done };
}
