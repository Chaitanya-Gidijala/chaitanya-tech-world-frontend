// =========================================================
// TRACEFLOW — Core Types
// =========================================================

/**
 * Every action an algorithm takes is encoded as a TraceEvent.
 * The visualization engine consumes these to animate each step.
 */

export const EventType = {
  COMPARE:         'COMPARE',
  SWAP:            'SWAP',
  MARK_SORTED:     'MARK_SORTED',
  MARK_VISITED:    'MARK_VISITED',
  MARK_FOUND:      'MARK_FOUND',
  MARK_DISCARDED:  'MARK_DISCARDED',
  POINTER_MOVE:    'POINTER_MOVE',
  PIVOT_SET:       'PIVOT_SET',
  SELECT:          'SELECT',
  INSERT:          'INSERT',
  SHIFT:           'SHIFT',
  WINDOW_MOVE:     'WINDOW_MOVE',
  VARIABLE_UPDATE: 'VARIABLE_UPDATE',
  COMPLETE:        'COMPLETE',
  RESET:           'RESET',
};

/**
 * @typedef {Object} TraceEvent
 * @property {string}   type          - One of EventType values
 * @property {number[]} [indices]     - Which array indices are involved
 * @property {any[]}    [values]      - Actual values at those indices
 * @property {Object}   [variables]   - Named variable snapshot: { low: 0, high: 9, mid: 4 }
 * @property {number[]} [sortedUpto]  - Indices confirmed sorted
 * @property {number[]} [discarded]   - Indices eliminated (binary search halves)
 * @property {Object}   [window]      - { start, end } for sliding window
 * @property {string}   description   - Short label: "Comparing 8 and 4"
 * @property {string}   explanation   - Full explanation for step panel
 * @property {string}   [beginnerNote]- Extra detail for beginner mode
 * @property {string}   [whyText]     - The "WHY" — reason for this action
 * @property {number}   [codeLine]    - 0-based line in Java code to highlight
 * @property {TraceMetrics} metrics   - Running totals
 * @property {number[]} arrayState    - Full array snapshot at this step
 */

/**
 * @typedef {Object} TraceMetrics
 * @property {number} comparisons
 * @property {number} swaps
 * @property {number} iterations
 * @property {number} [reads]
 * @property {number} [writes]
 */

/** Create a fresh metrics object */
export const createMetrics = () => ({
  comparisons: 0,
  swaps: 0,
  iterations: 0,
  reads: 0,
  writes: 0,
});

/**
 * @typedef {Object} AlgorithmMeta
 * @property {string}   id
 * @property {string}   slug
 * @property {string}   name
 * @property {string}   category      - 'sorting' | 'searching' | 'patterns' | 'ds'
 * @property {string}   difficulty    - 'beginner' | 'intermediate' | 'advanced'
 * @property {string}   summary       - One sentence
 * @property {string}   timeComplexity   - e.g. 'O(n²)'
 * @property {string}   spaceComplexity  - e.g. 'O(1)'
 * @property {boolean}  [stable]
 * @property {boolean}  [inPlace]
 * @property {string[]} tags
 */
