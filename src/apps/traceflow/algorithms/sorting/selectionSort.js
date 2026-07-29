import { EventType, createMetrics } from '../types.js';

export const SELECTION_SORT_CODE = [
  'void selectionSort(int[] arr) {',
  '    int n = arr.length;',
  '    for (int i = 0; i < n - 1; i++) {',
  '        int minIdx = i;',
  '        for (int j = i + 1; j < n; j++) {',
  '            if (arr[j] < arr[minIdx]) {',
  '                minIdx = j;',
  '            }',
  '        }',
  '        if (minIdx != i) {',
  '            int temp = arr[i];',
  '            arr[i] = arr[minIdx];',
  '            arr[minIdx] = temp;',
  '        }',
  '    }',
  '}',
];

export function generateSelectionSortTrace(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const events = [];
  const metrics = createMetrics();
  const sortedIndices = new Set();
  const snap = () => [...arr];
  const push = (e) => events.push(e);

  for (let i = 0; i < n - 1; i++) {
    metrics.iterations++;
    
    // Step: Outer loop
    push({
      type: EventType.SELECT,
      indices: [],
      values: [],
      variables: { i },
      sortedIndices: [...sortedIndices],
      description: `Outer loop iteration: i = ${i}`,
      explanation: `We begin pass ${i + 1} with i = ${i}. Selection sort requires n-1 passes.`,
      whyText: `The outer loop tracks the boundary between the sorted (left) and unsorted (right) portions of the array.`,
      codeLine: 3,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    let minIdx = i;

    // Step: int minIdx = i;
    push({
      type: EventType.SELECT,
      indices: [i],
      values: [arr[i]],
      variables: { i, minIdx, 'arr[minIdx]': arr[minIdx] },
      sortedIndices: [...sortedIndices],
      description: `Pass ${i+1}: finding minimum in arr[${i}..${n-1}]`,
      explanation: `We start scanning from index ${i}. The current candidate for minimum is arr[${i}] = ${arr[i]}.`,
      whyText: `Selection sort works by repeatedly finding the minimum element from the unsorted portion and placing it at the beginning.`,
      codeLine: 4,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    for (let j = i + 1; j < n; j++) {
      // Step: Inner loop
      push({
        type: EventType.SELECT,
        indices: [j],
        values: [arr[j]],
        variables: { i, j, minIdx },
        sortedIndices: [...sortedIndices],
        description: `Inner loop: j = ${j}`,
        explanation: `We start the inner loop with j = ${j} to scan for a smaller element.`,
        codeLine: 5,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      metrics.comparisons++;
      metrics.reads += 2;

      push({
        type: EventType.COMPARE,
        indices: [j, minIdx],
        values: [arr[j], arr[minIdx]],
        variables: { i, j, minIdx, 'arr[j]': arr[j], 'arr[minIdx]': arr[minIdx] },
        sortedIndices: [...sortedIndices],
        description: `Compare arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`,
        explanation: `Is arr[${j}] = ${arr[j]} less than the current minimum arr[${minIdx}] = ${arr[minIdx]}? ${arr[j] < arr[minIdx] ? 'Yes — new minimum found!' : 'No — current minimum stays.'}`,
        codeLine: 6,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        push({
          type: EventType.POINTER_MOVE,
          indices: [minIdx],
          values: [arr[minIdx]],
          variables: { i, j, minIdx, 'arr[minIdx]': arr[minIdx] },
          sortedIndices: [...sortedIndices],
          description: `New minimum: arr[${minIdx}]=${arr[minIdx]}`,
          explanation: `arr[${j}] = ${arr[j]} is smaller than the previous minimum. We update minIdx to ${j}.`,
          codeLine: 7,
          metrics: { ...metrics },
          arrayState: snap(),
        });
      }
    }

    if (minIdx !== i) {
      metrics.swaps++;
      const before = [...arr];

      // Step 1: int temp = arr[i];
      push({
        type: EventType.VARIABLE_UPDATE,
        indices: [i],
        values: [arr[i]],
        variables: { i, minIdx, temp: before[i], 'arr[i]': arr[i], 'arr[minIdx]': arr[minIdx] },
        sortedIndices: [...sortedIndices],
        description: `Store arr[${i}] in temp`,
        explanation: `We temporarily store the value ${before[i]} in the 'temp' variable before overwriting it.`,
        codeLine: 11,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      // Step 2: arr[i] = arr[minIdx];
      push({
        type: EventType.VARIABLE_UPDATE,
        indices: [i, minIdx],
        values: [arr[i], arr[minIdx]],
        variables: { i, minIdx, temp: before[i], 'arr[i]': arr[minIdx], 'arr[minIdx]': arr[minIdx] },
        sortedIndices: [...sortedIndices],
        description: `Overwrite arr[${i}] with arr[${minIdx}]`,
        explanation: `We move the minimum value ${before[minIdx]} to index ${i}.`,
        codeLine: 12,
        metrics: { ...metrics },
        arrayState: snap(), // Still return the original array state
      });

      // Step 3: arr[minIdx] = temp; (Perform the actual swap)
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      push({
        type: EventType.SWAP,
        indices: [i, minIdx],
        values: [arr[i], arr[minIdx]],
        variables: { i, minIdx, temp: before[i], 'arr[i]': arr[i], 'arr[minIdx]': arr[minIdx] },
        sortedIndices: [...sortedIndices],
        description: `Complete swap: arr[${minIdx}] = temp`,
        explanation: `We move the stored value ${before[i]} into index ${minIdx}. Swap complete!`,
        codeLine: 13,
        metrics: { ...metrics },
        arrayState: snap(), // Now the array state is swapped, triggering the smooth framer-motion animation
      });
    }

    sortedIndices.add(i);
    push({
      type: EventType.MARK_SORTED,
      indices: [i],
      values: [arr[i]],
      sortedIndices: [...sortedIndices],
      variables: { i },
      description: `arr[${i}]=${arr[i]} is now in its final position`,
      explanation: `The ${i+1} smallest element is now at index ${i}. It will never move again.`,
      codeLine: 15,
      metrics: { ...metrics },
      arrayState: snap(),
    });
  }

  sortedIndices.add(n - 1);
  push({
    type: EventType.COMPLETE,
    indices: [...Array(n).keys()],
    sortedIndices: [...sortedIndices],
    variables: {},
    description: 'Array is fully sorted!',
    explanation: `Selection sort complete. Total: ${metrics.comparisons} comparisons, ${metrics.swaps} swaps.`,
    codeLine: 16,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  return events;
}
