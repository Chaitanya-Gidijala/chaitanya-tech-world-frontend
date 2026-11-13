import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const EXPONENTIAL_SEARCH_CODE = [
  'int exponentialSearch(int[] arr, int target) {',
  '    if (arr[0] == target) return 0;',
  '    int bound = 1;',
  '    while (bound < arr.length && arr[bound] < target)',
  '        bound *= 2;                       // double the range',
  '    int low = bound / 2, high = Math.min(bound, arr.length - 1);',
  '    while (low <= high) {                 // binary search the range',
  '        int mid = low + (high - low) / 2;',
  '        if (arr[mid] == target) return mid;',
  '        if (arr[mid] < target) low = mid + 1; else high = mid - 1;',
  '    }',
  '    return -1;',
  '}',
];

export function generateExponentialSearchTrace(input, target) {
  const t = createTracer(input);
  const { arr } = t;
  const n = arr.length;

  t.metrics.comparisons++;
  if (arr[0] === target) {
    t.step(EventType.MARK_FOUND, { indices: [0], variables: { target }, description: `Found ${target} at index 0`, explanation: 'The first element is the target.', codeLine: 1 });
    return t.done({ keepSorted: false, indices: [0], description: 'Found at index 0', explanation: '1 comparison.', codeLine: 1, foundIndex: 0 });
  }

  let bound = 1;
  t.step(EventType.VARIABLE_UPDATE, {
    indices: [0],
    variables: { bound, target },
    description: 'Phase 1: find a range by doubling',
    explanation: `arr[0] isn't ${target}. Probe indices 1, 2, 4, 8 … until we pass the target.`,
    whyText: 'Doubling finds a bracket containing the target in O(log i) steps, where i is the target position — great for unbounded or huge lists.',
    beginnerNote: 'Like searching for a house number by checking 1, 2, 4, 8, 16… then narrowing down.',
    codeLine: 2,
  });

  while (bound < n && arr[bound] < target) {
    t.metrics.comparisons++;
    t.metrics.reads++;
    t.step(EventType.COMPARE, {
      indices: [bound],
      variables: { bound, target },
      description: `arr[${bound}] = ${arr[bound]} < ${target}`,
      explanation: `Still too small — double the bound to ${bound * 2}.`,
      codeLine: 4,
    });
    t.discard(Math.floor(bound / 2), bound);
    bound *= 2;
  }

  let low = Math.floor(bound / 2);
  let high = Math.min(bound, n - 1);
  t.step(EventType.POINTER_MOVE, {
    indices: [low, high],
    variables: { low, high, target },
    description: `Phase 2: binary search in [${low}, ${high}]`,
    explanation: `The target, if present, lies between indices ${low} and ${high}.`,
    codeLine: 5,
  });

  while (low <= high) {
    t.metrics.iterations++;
    const mid = low + Math.floor((high - low) / 2);
    t.metrics.comparisons++;
    t.metrics.reads++;
    if (arr[mid] === target) {
      t.step(EventType.MARK_FOUND, { indices: [mid], variables: { low, mid, high, target }, description: `Found ${target} at index ${mid}`, explanation: 'Binary search hit the target.', codeLine: 8 });
      return t.done({ keepSorted: false, indices: [mid], description: `Found at index ${mid}`, explanation: `${t.metrics.comparisons} comparisons in total.`, codeLine: 8, foundIndex: mid });
    }
    t.step(EventType.COMPARE, {
      indices: [mid],
      variables: { low, mid, high, target },
      description: `arr[${mid}] = ${arr[mid]} ${arr[mid] < target ? '<' : '>'} ${target}`,
      explanation: arr[mid] < target ? 'Discard the left half.' : 'Discard the right half.',
      codeLine: 9,
    });
    if (arr[mid] < target) {
      t.discard(low, mid);
      low = mid + 1;
    } else {
      t.discard(mid, high);
      high = mid - 1;
    }
  }

  return t.done({ keepSorted: false, description: `${target} not found`, explanation: 'The bracketed range was exhausted.', codeLine: 11 });
}
