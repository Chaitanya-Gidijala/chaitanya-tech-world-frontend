import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const TERNARY_SEARCH_CODE = [
  'int ternarySearch(int[] arr, int target) {',
  '    int low = 0, high = arr.length - 1;',
  '    while (low <= high) {',
  '        int third = (high - low) / 3;',
  '        int mid1 = low + third, mid2 = high - third;',
  '        if (arr[mid1] == target) return mid1;',
  '        if (arr[mid2] == target) return mid2;',
  '        if (target < arr[mid1]) high = mid1 - 1;          // left third',
  '        else if (target > arr[mid2]) low = mid2 + 1;      // right third',
  '        else { low = mid1 + 1; high = mid2 - 1; }         // middle third',
  '    }',
  '    return -1;',
  '}',
];

export function generateTernarySearchTrace(input, target) {
  const t = createTracer(input);
  const { arr } = t;
  let low = 0;
  let high = arr.length - 1;

  t.step(EventType.VARIABLE_UPDATE, {
    indices: [low, high],
    variables: { low, high, target },
    description: `Search for ${target}`,
    explanation: 'Split the range into three parts with two probes, mid1 and mid2.',
    whyText: 'Each round keeps one third of the range. It needs more comparisons per round than binary search, which is why binary search is usually preferred.',
    beginnerNote: 'Ternary search really shines for finding the peak of a unimodal function.',
    codeLine: 1,
  });

  while (low <= high) {
    t.metrics.iterations++;
    const third = Math.floor((high - low) / 3);
    const mid1 = low + third;
    const mid2 = high - third;
    t.metrics.reads += 2;
    t.step(EventType.POINTER_MOVE, {
      indices: [mid1, mid2],
      variables: { low, mid1, mid2, high, target },
      description: `mid1 = ${mid1} (${arr[mid1]}), mid2 = ${mid2} (${arr[mid2]})`,
      explanation: `Probe the two points that split [${low}, ${high}] into thirds.`,
      codeLine: 4,
    });

    for (const m of [mid1, mid2]) {
      t.metrics.comparisons++;
      if (arr[m] === target) {
        t.step(EventType.MARK_FOUND, { indices: [m], variables: { low, mid1, mid2, high, target }, description: `Found ${target} at index ${m}`, explanation: 'One of the probes hit the target.', codeLine: m === mid1 ? 5 : 6 });
        return t.done({ keepSorted: false, indices: [m], description: `Found at index ${m}`, explanation: `${t.metrics.comparisons} comparisons in total.`, codeLine: m === mid1 ? 5 : 6, foundIndex: m });
      }
    }

    t.metrics.comparisons++;
    if (target < arr[mid1]) {
      t.discard(mid1, high);
      high = mid1 - 1;
      t.step(EventType.COMPARE, { indices: [mid1], variables: { low, high, target }, description: `${target} < ${arr[mid1]} → keep the left third`, explanation: `New range [${low}, ${high}].`, codeLine: 7 });
    } else if (target > arr[mid2]) {
      t.discard(low, mid2);
      low = mid2 + 1;
      t.step(EventType.COMPARE, { indices: [mid2], variables: { low, high, target }, description: `${target} > ${arr[mid2]} → keep the right third`, explanation: `New range [${low}, ${high}].`, codeLine: 8 });
    } else {
      t.discard(low, mid1);
      t.discard(mid2, high);
      low = mid1 + 1;
      high = mid2 - 1;
      t.step(EventType.COMPARE, { indices: [mid1, mid2], variables: { low, high, target }, description: 'Keep the middle third', explanation: `${target} lies between ${arr[mid1]} and ${arr[mid2]}. New range [${low}, ${high}].`, codeLine: 9 });
    }
  }

  return t.done({ keepSorted: false, description: `${target} not found`, explanation: 'The range became empty.', codeLine: 11 });
}
