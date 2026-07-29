import { EventType, createMetrics } from '../types.js';

export const BINARY_SEARCH_CODE = [
  'int binarySearch(int[] arr, int target) {',
  '    int low = 0, high = arr.length - 1;',
  '    while (low <= high) {',
  '        int mid = low + (high - low) / 2;',
  '        if (arr[mid] == target) {',
  '            return mid;',
  '        } else if (arr[mid] < target) {',
  '            low = mid + 1;',
  '        } else {',
  '            high = mid - 1;',
  '        }',
  '    }',
  '    return -1;',
  '}',
];

export function generateBinarySearchTrace(sortedArray, target) {
  const arr = [...sortedArray];
  const n = arr.length;
  const events = [];
  const metrics = createMetrics();
  const discarded = new Set();
  const snap = () => [...arr];
  const push = (e) => events.push(e);

  let low = 0, high = n - 1;

  push({
    type: EventType.VARIABLE_UPDATE,
    indices: [],
    variables: { low, high, target },
    sortedIndices: [],
    discarded: [...discarded],
    description: `Start: low=0, high=${n-1}, target=${target}`,
    explanation: `We begin with the entire array in scope. LOW points to index 0, HIGH points to the last index (${n-1}). We are looking for ${target}.`,
    whyText: `Binary search requires a sorted array. We exploit the sorted order to eliminate half the search space at every step — giving us O(log n) efficiency.`,
    beginnerNote: `Imagine you're looking for a word in a dictionary. You open to the middle — if your word comes after the middle word, you ignore the left half entirely.`,
    codeLine: 1,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  while (low <= high) {
    metrics.iterations++;
    metrics.comparisons++;

    // Step: while (low <= high)
    push({
      type: EventType.SELECT,
      indices: [low, high],
      variables: { low, high, target },
      discarded: [...discarded],
      description: `Check loop condition: low <= high`,
      explanation: `Since low (${low}) is less than or equal to high (${high}), the search space is still valid. We continue searching.`,
      codeLine: 2,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    const mid = low + Math.floor((high - low) / 2);
    metrics.reads++;

    push({
      type: EventType.POINTER_MOVE,
      indices: [low, mid, high],
      values: [arr[low], arr[mid], arr[high]],
      variables: { low, high, mid, 'arr[mid]': arr[mid], target },
      discarded: [...discarded],
      description: `mid = ${mid}, arr[mid] = ${arr[mid]}`,
      explanation: `mid = low + (high - low) / 2 = ${low} + (${high} - ${low}) / 2 = ${mid}. The middle element is ${arr[mid]}.`,
      whyText: `We use low + (high-low)/2 instead of (low+high)/2 to prevent integer overflow for very large arrays.`,
      codeLine: 3,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    if (arr[mid] === target) {
      push({
        type: EventType.MARK_FOUND,
        indices: [mid],
        values: [arr[mid]],
        variables: { low, high, mid, 'arr[mid]': arr[mid], target, result: mid },
        discarded: [...discarded],
        description: `Found! arr[${mid}] = ${target}`,
        explanation: `arr[${mid}] = ${arr[mid]} equals the target ${target}. The element was found at index ${mid}.`,
        whyText: `The middle element exactly matches what we were looking for. Return the index.`,
        codeLine: 5,
        metrics: { ...metrics },
        arrayState: snap(),
      });
      push({
        type: EventType.COMPLETE,
        indices: [mid],
        variables: { result: mid },
        discarded: [...discarded],
        description: `Search complete — found ${target} at index ${mid}`,
        explanation: `Binary search found the target value ${target} at index ${mid} in ${metrics.iterations} iteration(s). A linear search would have taken up to ${n} steps.`,
        codeLine: 5,
        metrics: { ...metrics },
        arrayState: snap(),
      });
      return events;
    } else if (arr[mid] < target) {
      // Discard left half
      for (let k = low; k <= mid; k++) discarded.add(k);
      const prevLow = low;
      low = mid + 1;
      push({
        type: EventType.MARK_DISCARDED,
        indices: Array.from({length: mid - prevLow + 1}, (_, k) => prevLow + k),
        values: arr.slice(prevLow, mid + 1),
        variables: { low, high, mid, 'arr[mid]': arr[mid], target },
        discarded: [...discarded],
        description: `${arr[mid]} < ${target} → discard left half, low = ${low}`,
        explanation: `arr[mid] = ${arr[mid]} is less than target ${target}. Since the array is sorted, every element from index ${prevLow} to ${mid} is also less than ${target}. We can safely discard them all. Move low to ${low}.`,
        whyText: `In a sorted array, if the middle value is smaller than our target, the target cannot be in the left half. This is the key insight that gives binary search its power.`,
        beginnerNote: `Dictionary analogy: the middle word comes before your word alphabetically, so your word must be in the right half. Ignore the left half completely.`,
        codeLine: 7,
        metrics: { ...metrics },
        arrayState: snap(),
      });
    } else {
      // Discard right half
      for (let k = mid; k <= high; k++) discarded.add(k);
      const prevHigh = high;
      high = mid - 1;
      push({
        type: EventType.MARK_DISCARDED,
        indices: Array.from({length: prevHigh - mid + 1}, (_, k) => mid + k),
        values: arr.slice(mid, prevHigh + 1),
        variables: { low, high, mid, 'arr[mid]': arr[mid], target },
        discarded: [...discarded],
        description: `${arr[mid]} > ${target} → discard right half, high = ${high}`,
        explanation: `arr[mid] = ${arr[mid]} is greater than target ${target}. Every element from index ${mid} to ${prevHigh} must also be greater. Discard them. Move high to ${high}.`,
        whyText: `If the middle value is larger than our target, the target must be in the left half. Move high below mid.`,
        codeLine: 9,
        metrics: { ...metrics },
        arrayState: snap(),
      });
    }
  }

  // Step: while (low <= high) fails
  push({
    type: EventType.SELECT,
    indices: [],
    variables: { low, high, target },
    discarded: [...discarded],
    description: `Check loop condition: low <= high`,
    explanation: `low (${low}) is now greater than high (${high}). The search space is completely empty. We break out of the loop.`,
    codeLine: 2,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  push({
    type: EventType.COMPLETE,
    indices: [],
    variables: { result: -1, target },
    discarded: [...discarded],
    description: `Target ${target} not found`,
    explanation: `low (${low}) > high (${high}), so the search space is empty. The target value ${target} does not exist in this array. Return -1.`,
    codeLine: 13,
    metrics: { ...metrics },
    arrayState: snap(),
  });
  return events;
}
