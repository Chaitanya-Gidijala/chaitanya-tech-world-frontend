import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const INTERPOLATION_SEARCH_CODE = [
  'int interpolationSearch(int[] arr, int target) {',
  '    int low = 0, high = arr.length - 1;',
  '    while (low <= high && target >= arr[low] && target <= arr[high]) {',
  '        if (arr[high] == arr[low]) return arr[low] == target ? low : -1;',
  '        int pos = low + (target - arr[low]) * (high - low)',
  '                        / (arr[high] - arr[low]);',
  '        if (arr[pos] == target) return pos;',
  '        if (arr[pos] < target) low = pos + 1;',
  '        else high = pos - 1;',
  '    }',
  '    return -1;',
  '}',
];

export function generateInterpolationSearchTrace(input, target) {
  const t = createTracer(input);
  const { arr } = t;
  let low = 0;
  let high = arr.length - 1;

  t.step(EventType.VARIABLE_UPDATE, {
    indices: [low, high],
    variables: { low, high, target },
    description: `Search for ${target} between indices ${low} and ${high}`,
    explanation: 'Instead of always probing the middle, estimate where the target should be from its value.',
    whyText: 'On uniformly distributed data the estimate lands very close to the target — about O(log log n) probes.',
    beginnerNote: 'Looking up "Williams" in a phone book, you open near the end, not the middle.',
    codeLine: 1,
  });

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    t.metrics.iterations++;
    if (arr[high] === arr[low]) {
      const hit = arr[low] === target;
      return t.done({ keepSorted: false, indices: hit ? [low] : [], description: hit ? `Found at index ${low}` : `${target} not found`, explanation: 'Range collapsed to equal values.', codeLine: 3 });
    }
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    t.metrics.reads += 3;
    t.step(EventType.POINTER_MOVE, {
      indices: [low, pos, high],
      variables: { low, pos, high, target },
      description: `Estimated position pos = ${pos}`,
      explanation: `pos = ${low} + (${target} − ${arr[low]}) × (${high} − ${low}) / (${arr[high]} − ${arr[low]}) = ${pos}.`,
      whyText: 'The formula assumes values grow roughly linearly between arr[low] and arr[high].',
      codeLine: 4,
    });

    t.metrics.comparisons++;
    if (arr[pos] === target) {
      t.step(EventType.MARK_FOUND, {
        indices: [pos],
        variables: { low, pos, high, target },
        description: `Found ${target} at index ${pos}`,
        explanation: 'The estimate hit the target directly.',
        codeLine: 6,
      });
      return t.done({ keepSorted: false, indices: [pos], description: `Found at index ${pos}`, explanation: `${t.metrics.comparisons} probe(s).`, codeLine: 6, foundIndex: pos });
    }
    if (arr[pos] < target) {
      t.discard(low, pos);
      low = pos + 1;
      t.step(EventType.COMPARE, {
        indices: [pos],
        variables: { low, high, target },
        description: `${arr[pos]} < ${target} → search right`,
        explanation: `Everything up to index ${pos} is too small; low moves to ${low}.`,
        codeLine: 7,
      });
    } else {
      t.discard(pos, high);
      high = pos - 1;
      t.step(EventType.COMPARE, {
        indices: [pos],
        variables: { low, high, target },
        description: `${arr[pos]} > ${target} → search left`,
        explanation: `Everything from index ${pos} is too large; high moves to ${high}.`,
        codeLine: 8,
      });
    }
  }

  return t.done({ keepSorted: false, description: `${target} not found`, explanation: 'The target fell outside the remaining value range.', codeLine: 10 });
}
