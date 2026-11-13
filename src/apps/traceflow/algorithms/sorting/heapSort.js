import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const HEAP_SORT_CODE = [
  'void heapSort(int[] arr) {',
  '    int n = arr.length;',
  '    for (int i = n / 2 - 1; i >= 0; i--)   // build max-heap',
  '        heapify(arr, n, i);',
  '    for (int end = n - 1; end > 0; end--) {',
  '        swap(arr, 0, end);                  // move max to the end',
  '        heapify(arr, end, 0);               // restore heap',
  '    }',
  '}',
  'void heapify(int[] arr, int size, int root) {',
  '    int largest = root, left = 2 * root + 1, right = 2 * root + 2;',
  '    if (left < size && arr[left] > arr[largest]) largest = left;',
  '    if (right < size && arr[right] > arr[largest]) largest = right;',
  '    if (largest != root) {',
  '        swap(arr, root, largest);',
  '        heapify(arr, size, largest);',
  '    }',
  '}',
];

export function generateHeapSortTrace(input) {
  const t = createTracer(input);
  const { arr } = t;
  const n = arr.length;

  const heapify = (size, root, phase) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    t.step(EventType.SELECT, {
      indices: [root, left, right].filter((x) => x < size),
      variables: { root, left, right, size },
      description: `Heapify at root ${root} (${arr[root]})`,
      explanation: `Compare the parent ${arr[root]} with its children${left < size ? ` ${arr[left]}` : ''}${right < size ? ` and ${arr[right]}` : ''}.`,
      whyText: 'In a max-heap every parent must be ≥ its children. Heapify fixes one parent and pushes the fault downwards.',
      beginnerNote: `The array is a tree: children of index k live at 2k+1 and 2k+2.`,
      codeLine: 10,
      phase,
    });

    if (left < size) {
      if (t.compare(left, largest) > 0) largest = left;
      t.step(EventType.COMPARE, {
        indices: [left, root],
        variables: { root, left, largest, size },
        description: `Left child ${arr[left]} vs ${arr[root]}`,
        explanation: largest === left ? `${arr[left]} is larger — it becomes the candidate.` : `Parent stays the largest so far.`,
        codeLine: 11,
        phase,
      });
    }
    if (right < size) {
      const before = largest;
      if (t.compare(right, largest) > 0) largest = right;
      t.step(EventType.COMPARE, {
        indices: [right, before],
        variables: { root, right, largest, size },
        description: `Right child ${arr[right]} vs ${arr[before]}`,
        explanation: largest === right ? `${arr[right]} is the largest of the three.` : `${arr[before]} remains the largest.`,
        codeLine: 12,
        phase,
      });
    }

    if (largest !== root) {
      t.swap(root, largest);
      t.step(EventType.SWAP, {
        indices: [root, largest],
        variables: { root, largest, size },
        description: `Swap ${arr[largest]} down, ${arr[root]} up`,
        explanation: `The larger child rises to the parent slot. Continue heapifying from index ${largest}.`,
        codeLine: 14,
        phase,
      });
      heapify(size, largest, phase);
    }
  };

  t.step(EventType.VARIABLE_UPDATE, {
    variables: { n },
    description: 'Phase 1: build a max-heap',
    explanation: `Heapify every non-leaf node from index ${Math.floor(n / 2) - 1} down to 0.`,
    whyText: 'Starting from the last parent guarantees each subtree is already a heap when we fix its parent.',
    codeLine: 2,
    phase: 'Build heap',
  });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i, 'Build heap');

  t.step(EventType.VARIABLE_UPDATE, {
    indices: [0],
    variables: { max: arr[0] },
    description: `Max-heap ready — ${arr[0]} is at the root`,
    explanation: 'The largest value is now at index 0. Phase 2 repeatedly moves it to the end.',
    codeLine: 4,
    phase: 'Extract',
  });

  for (let end = n - 1; end > 0; end--) {
    t.metrics.iterations++;
    t.swap(0, end);
    t.markSorted(end);
    t.step(EventType.SWAP, {
      indices: [0, end],
      variables: { end },
      description: `Move max ${arr[end]} to index ${end}`,
      explanation: `Swap the root (largest) with the last heap element. Index ${end} is now final.`,
      codeLine: 5,
      phase: 'Extract',
    });
    heapify(end, 0, 'Extract');
  }
  t.markSorted(0);

  return t.done({
    description: 'Array is sorted',
    explanation: `Every extraction placed the next-largest value. ${t.metrics.comparisons} comparisons, ${t.metrics.swaps} swaps — O(n log n) regardless of input order.`,
    codeLine: 8,
  });
}
