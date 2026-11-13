import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const COCKTAIL_SORT_CODE = [
  'void cocktailSort(int[] arr) {',
  '    int start = 0, end = arr.length - 1;',
  '    boolean swapped = true;',
  '    while (swapped) {',
  '        swapped = false;',
  '        for (int i = start; i < end; i++)        // forward pass',
  '            if (arr[i] > arr[i + 1]) { swap(arr, i, i + 1); swapped = true; }',
  '        end--;',
  '        for (int i = end - 1; i >= start; i--)   // backward pass',
  '            if (arr[i] > arr[i + 1]) { swap(arr, i, i + 1); swapped = true; }',
  '        start++;',
  '    }',
  '}',
];

export function generateCocktailSortTrace(input) {
  const t = createTracer(input);
  const { arr } = t;
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;
  let pass = 0;

  while (swapped) {
    swapped = false;
    pass++;
    t.metrics.iterations++;
    t.step(EventType.SELECT, {
      variables: { start, end, pass },
      description: `Pass ${pass}: forward sweep from ${start} to ${end}`,
      explanation: `Sweep left → right, carrying the largest unsorted value towards index ${end}.`,
      whyText: 'Cocktail sort alternates direction so small values near the end move left quickly too — fixing bubble sort’s "turtle" problem.',
      codeLine: 5,
    });

    for (let i = start; i < end; i++) {
      const diff = t.compare(i, i + 1);
      t.step(EventType.COMPARE, {
        indices: [i, i + 1],
        variables: { i, start, end },
        description: `Compare ${arr[i]} and ${arr[i + 1]}`,
        explanation: `Is ${arr[i]} greater than ${arr[i + 1]}? ${diff > 0 ? 'Yes — they are out of order.' : 'No — leave them.'}`,
        codeLine: 6,
      });
      if (diff > 0) {
        t.swap(i, i + 1);
        swapped = true;
        t.step(EventType.SWAP, {
          indices: [i, i + 1],
          variables: { i, start, end, swapped: 'true' },
          description: `Swap → ${arr[i]}, ${arr[i + 1]}`,
          explanation: `The larger value moves one step right.`,
          codeLine: 6,
        });
      }
    }
    t.markSorted(end);
    t.step(EventType.MARK_SORTED, {
      indices: [end],
      variables: { start, end },
      description: `${arr[end]} is in its final place`,
      explanation: `The forward sweep parked the largest remaining value at index ${end}.`,
      codeLine: 7,
    });
    end--;
    if (!swapped) break;

    swapped = false;
    t.step(EventType.SELECT, {
      variables: { start, end, pass },
      description: `Pass ${pass}: backward sweep from ${end} to ${start}`,
      explanation: `Now sweep right → left, carrying the smallest unsorted value towards index ${start}.`,
      beginnerNote: 'Like shaking a cocktail back and forth — values settle from both ends.',
      codeLine: 8,
    });
    for (let i = end - 1; i >= start; i--) {
      const diff = t.compare(i, i + 1);
      t.step(EventType.COMPARE, {
        indices: [i, i + 1],
        variables: { i, start, end },
        description: `Compare ${arr[i]} and ${arr[i + 1]}`,
        explanation: `Is ${arr[i]} greater than ${arr[i + 1]}? ${diff > 0 ? 'Yes — swap so the smaller moves left.' : 'No — keep going.'}`,
        codeLine: 9,
      });
      if (diff > 0) {
        t.swap(i, i + 1);
        swapped = true;
        t.step(EventType.SWAP, {
          indices: [i, i + 1],
          variables: { i, start, end, swapped: 'true' },
          description: `Swap → ${arr[i]}, ${arr[i + 1]}`,
          explanation: 'The smaller value moves one step left.',
          codeLine: 9,
        });
      }
    }
    t.markSorted(start);
    t.step(EventType.MARK_SORTED, {
      indices: [start],
      variables: { start, end },
      description: `${arr[start]} is in its final place`,
      explanation: `The backward sweep parked the smallest remaining value at index ${start}.`,
      codeLine: 10,
    });
    start++;
  }

  return t.done({
    description: 'Array is sorted',
    explanation: `No swaps happened in the last sweep, so every element is in order. ${t.metrics.comparisons} comparisons, ${t.metrics.swaps} swaps.`,
    codeLine: 12,
  });
}
