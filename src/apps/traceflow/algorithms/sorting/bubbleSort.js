import { EventType, createMetrics } from '../types.js';

// =========================================================
// BUBBLE SORT — Trace Generator
// =========================================================

export const BUBBLE_SORT_CODE = [
  'void bubbleSort(int[] arr) {',
  '    int n = arr.length;',
  '    for (int i = 0; i < n - 1; i++) {',
  '        for (int j = 0; j < n - i - 1; j++) {',
  '            if (arr[j] > arr[j + 1]) {',
  '                int temp = arr[j];',
  '                arr[j] = arr[j + 1];',
  '                arr[j + 1] = temp;',
  '            }',
  '        }',
  '    }',
  '}',
];

/**
 * Generates a complete execution trace for Bubble Sort.
 * @param {number[]} inputArray
 * @returns {import('../types.js').TraceEvent[]}
 */
export function generateBubbleSortTrace(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const events = [];
  const metrics = createMetrics();
  const sortedIndices = new Set();

  const snap = () => [...arr];

  const push = (event) => events.push(event);

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
      explanation: `We begin pass ${i + 1} with i = ${i}. Bubble sort requires n-1 passes.`,
      whyText: `The outer loop tracks how many full passes we have made. After each pass, the largest remaining element is placed in its final position.`,
      codeLine: 2,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Step: Inner loop
      push({
        type: EventType.SELECT,
        indices: [j],
        values: [arr[j]],
        variables: { i, j },
        sortedIndices: [...sortedIndices],
        description: `Inner loop: j = ${j}`,
        explanation: `We start the inner loop with j = ${j}. We will compare elements up to index ${n - i - 1 - 1}.`,
        codeLine: 3,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      metrics.comparisons++;
      metrics.reads += 2;

      // COMPARE event
      push({
        type: EventType.COMPARE,
        indices: [j, j + 1],
        values: [arr[j], arr[j + 1]],
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
        sortedIndices: [...sortedIndices],
        description: `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`,
        explanation: `We compare the element at index ${j} (value ${arr[j]}) with the element at index ${j+1} (value ${arr[j+1]}).`,
        whyText: `Bubble sort checks every adjacent pair. If the left element is larger than the right, they are in the wrong order for ascending sort.`,
        beginnerNote: `Think of it like checking two neighbours in a queue — if the taller person is standing behind the shorter one, they need to swap.`,
        codeLine: 4,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      if (arr[j] > arr[j + 1]) {
        metrics.swaps++;
        metrics.writes += 2;
        const before = [...arr];

        // Step 1: int temp = arr[j];
        push({
          type: EventType.VARIABLE_UPDATE,
          indices: [j],
          values: [arr[j]],
          variables: { i, j, temp: before[j], 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          sortedIndices: [...sortedIndices],
          description: `Store arr[${j}] in temp`,
          explanation: `We temporarily store the value ${before[j]} in the 'temp' variable before overwriting it.`,
          codeLine: 5,
          metrics: { ...metrics },
          arrayState: snap(),
        });

        // Step 2: arr[j] = arr[j + 1];
        push({
          type: EventType.VARIABLE_UPDATE,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          variables: { i, j, temp: before[j], 'arr[j]': arr[j + 1], 'arr[j+1]': arr[j + 1] },
          sortedIndices: [...sortedIndices],
          description: `Overwrite arr[${j}] with arr[${j+1}]`,
          explanation: `We move the smaller value ${before[j+1]} to index ${j}.`,
          codeLine: 6,
          metrics: { ...metrics },
          arrayState: snap(), // Still return the original array state to keep bars from resizing awkwardly
        });

        // Step 3: arr[j + 1] = temp; (Perform the actual swap)
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        push({
          type: EventType.SWAP,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          variables: { i, j, temp: before[j], 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          sortedIndices: [...sortedIndices],
          description: `Complete swap: arr[${j+1}] = temp`,
          explanation: `We move the stored value ${before[j]} into index ${j+1}. Swap complete!`,
          whyText: `Since ${before[j]} is larger than ${before[j+1]}, keeping them in this order would violate the ascending sort rule. We swap to fix it.`,
          beginnerNote: `After swapping, the larger value has "bubbled" one position to the right — like a bubble rising to the surface.`,
          codeLine: 7,
          metrics: { ...metrics },
          arrayState: snap(), // Now the array state is swapped, triggering the smooth framer-motion animation
        });
      }
    }

    // Mark the last element of this pass as sorted
    sortedIndices.add(n - 1 - i);
    push({
      type: EventType.MARK_SORTED,
      indices: [n - 1 - i],
      values: [arr[n - 1 - i]],
      sortedIndices: [...sortedIndices],
      variables: { i, passComplete: true },
      description: `Pass ${i + 1} complete — arr[${n-1-i}]=${arr[n-1-i]} is now sorted`,
      explanation: `After pass ${i + 1}, the largest unsorted element has bubbled to its correct final position at index ${n-1-i}. It will never be moved again.`,
      whyText: `Each full pass guarantees that the largest remaining element settles at the end. After ${i+1} passes, the last ${i+1} elements are confirmed in their final positions.`,
      codeLine: 9,
      metrics: { ...metrics },
      arrayState: snap(),
    });
  }

  // Mark the first element as sorted too
  sortedIndices.add(0);
  push({
    type: EventType.COMPLETE,
    indices: [...Array(n).keys()],
    sortedIndices: [...sortedIndices],
    variables: {},
    description: 'Array is fully sorted!',
    explanation: `Bubble sort is complete. All ${n} elements are in their correct ascending positions. Total: ${metrics.comparisons} comparisons, ${metrics.swaps} swaps.`,
    whyText: `When only one element remains unprocessed, it must already be in the correct position — there is nothing left to compare it against.`,
    codeLine: 10,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  return events;
}
