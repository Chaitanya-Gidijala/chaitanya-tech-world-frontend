import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const COMB_SORT_CODE = [
  'void combSort(int[] arr) {',
  '    int gap = arr.length;',
  '    boolean sorted = false;',
  '    while (!sorted) {',
  '        gap = (int) (gap / 1.3);',
  '        if (gap <= 1) { gap = 1; sorted = true; }',
  '        for (int i = 0; i + gap < arr.length; i++) {',
  '            if (arr[i] > arr[i + gap]) {',
  '                swap(arr, i, i + gap);',
  '                sorted = false;',
  '            }',
  '        }',
  '    }',
  '}',
];

const SHRINK = 1.3;

export function generateCombSortTrace(input) {
  const t = createTracer(input);
  const { arr } = t;
  const n = arr.length;
  let gap = n;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / SHRINK);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    t.metrics.iterations++;
    t.step(EventType.VARIABLE_UPDATE, {
      variables: { gap },
      description: `Shrink the gap to ${gap}`,
      explanation: `gap = previous gap / 1.3 → ${gap}. We compare elements that are ${gap} position${gap > 1 ? 's' : ''} apart.`,
      whyText: 'Large gaps move far-away values quickly; shrinking by 1.3 each round was found empirically to work best.',
      beginnerNote: 'Like combing tangled hair — start with a wide-tooth comb, then use finer teeth.',
      codeLine: 4,
    });

    for (let i = 0; i + gap < n; i++) {
      const diff = t.compare(i, i + gap);
      t.step(EventType.COMPARE, {
        indices: [i, i + gap],
        variables: { i, gap },
        description: `Compare arr[${i}]=${arr[i]} with arr[${i + gap}]=${arr[i + gap]}`,
        explanation: diff > 0 ? `${arr[i]} > ${arr[i + gap]} — out of order across the gap.` : 'Already in order across the gap.',
        codeLine: 7,
      });
      if (diff > 0) {
        t.swap(i, i + gap);
        sorted = false;
        t.step(EventType.SWAP, {
          indices: [i, i + gap],
          variables: { i, gap },
          description: `Swap across gap ${gap}`,
          explanation: `Swapping moves ${arr[i + gap]} ${gap} places right in a single step.`,
          codeLine: 8,
        });
      }
    }
  }

  return t.done({
    description: 'Array is sorted',
    explanation: `A full pass with gap 1 made no swaps, so the array is sorted. ${t.metrics.comparisons} comparisons, ${t.metrics.swaps} swaps.`,
    codeLine: 13,
  });
}
