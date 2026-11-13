import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const SHELL_SORT_CODE = [
  'void shellSort(int[] arr) {',
  '    int n = arr.length;',
  '    for (int gap = n / 2; gap > 0; gap /= 2) {',
  '        for (int i = gap; i < n; i++) {',
  '            int temp = arr[i];',
  '            int j = i;',
  '            while (j >= gap && arr[j - gap] > temp) {',
  '                arr[j] = arr[j - gap];',
  '                j -= gap;',
  '            }',
  '            arr[j] = temp;',
  '        }',
  '    }',
  '}',
];

export function generateShellSortTrace(input) {
  const t = createTracer(input);
  const { arr } = t;
  const n = arr.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    t.metrics.iterations++;
    t.step(EventType.VARIABLE_UPDATE, {
      variables: { gap },
      description: `Gap = ${gap}`,
      explanation: `Run an insertion sort on every sub-list of elements ${gap} apart.`,
      whyText: 'Sorting far-apart elements first means the final gap-1 insertion sort has very little work left to do.',
      beginnerNote: 'Each gap creates interleaved mini-lists; sorting them roughly arranges the whole array.',
      codeLine: 2,
    });

    for (let i = gap; i < n; i++) {
      const temp = t.read(i);
      let j = i;
      t.step(EventType.SELECT, {
        indices: [i],
        variables: { gap, i, j, temp },
        description: `Pick arr[${i}] = ${temp}`,
        explanation: `Hold ${temp} aside and look back in steps of ${gap} for where it belongs.`,
        codeLine: 4,
      });

      while (j >= gap) {
        t.metrics.comparisons++;
        t.metrics.reads++;
        const bigger = arr[j - gap] > temp;
        t.step(EventType.COMPARE, {
          indices: [j - gap, j],
          variables: { gap, i, j, temp },
          description: `Is arr[${j - gap}] = ${arr[j - gap]} > ${temp}?`,
          explanation: bigger ? `Yes — shift ${arr[j - gap]} forward by ${gap}.` : `No — ${temp} belongs at index ${j}.`,
          codeLine: 6,
        });
        if (!bigger) break;
        // Shift via swap so the moving value stays visible in the animation.
        t.swap(j - gap, j);
        t.step(EventType.SHIFT, {
          indices: [j - gap, j],
          variables: { gap, i, j, temp },
          description: `Shift ${arr[j]} right by ${gap}`,
          explanation: `${arr[j]} moves to index ${j}; ${temp} moves back to index ${j - gap}.`,
          codeLine: 7,
        });
        j -= gap;
      }

      t.step(EventType.INSERT, {
        indices: [j],
        variables: { gap, i, j, temp },
        description: `Place ${temp} at index ${j}`,
        explanation: `${temp} is now in order within its gap-${gap} sub-list.`,
        codeLine: 10,
      });
    }
  }

  return t.done({
    description: 'Array is sorted',
    explanation: `The final pass used gap 1 — a plain insertion sort on an almost-sorted array. ${t.metrics.comparisons} comparisons.`,
    codeLine: 13,
  });
}
