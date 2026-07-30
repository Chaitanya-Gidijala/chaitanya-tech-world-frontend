import { EventType, createMetrics } from '../types.js';

export const QUICK_SORT_CODE = [
  'void quickSort(int[] arr, int low, int high) {',
  '    if (low < high) {',
  '        int pi = partition(arr, low, high);',
  '        quickSort(arr, low, pi - 1);',
  '        quickSort(arr, pi + 1, high);',
  '    }',
  '}',
  '',
  'int partition(int[] arr, int low, int high) {',
  '    int pivot = arr[high];',
  '    int i = (low - 1);',
  '    for (int j = low; j < high; j++) {',
  '        if (arr[j] < pivot) {',
  '            i++;',
  '            int temp = arr[i];',
  '            arr[i] = arr[j];',
  '            arr[j] = temp;',
  '        }',
  '    }',
  '    int temp = arr[i + 1];',
  '    arr[i + 1] = arr[high];',
  '    arr[high] = temp;',
  '    return i + 1;',
  '}'
];

export function generateQuickSortTrace(inputArray) {
  const arr = [...inputArray];
  const events = [];
  const metrics = createMetrics();
  const sortedIndices = new Set();
  const snap = () => [...arr];
  const push = (event) => events.push(event);

  function partition(low, high) {
    push({ type: EventType.SELECT, indices: [low, high], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Partitioning subarray from index ${low} to ${high}`, codeLine: 8, metrics: { ...metrics }, arrayState: snap() });

    let pivot = arr[high];
    push({ type: EventType.VARIABLE_UPDATE, indices: [high], variables: { low, high, pivot }, sortedIndices: [...sortedIndices], description: `Choose the last element (${pivot}) as the pivot`, codeLine: 9, metrics: { ...metrics }, arrayState: snap() });

    let i = low - 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { low, high, pivot, i }, sortedIndices: [...sortedIndices], description: `Initialize index i = ${i} (points to the last smaller element)`, codeLine: 10, metrics: { ...metrics }, arrayState: snap() });

    for (let j = low; j < high; j++) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [j], variables: { low, high, pivot, i, j }, sortedIndices: [...sortedIndices], description: `Scanning element at index j = ${j}`, codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

      metrics.comparisons++;
      push({ type: EventType.COMPARE, indices: [j, high], variables: { low, high, i, j, pivot, 'arr[j]': arr[j] }, sortedIndices: [...sortedIndices], description: `Is arr[${j}] (${arr[j]}) < pivot (${pivot})?`, codeLine: 12, metrics: { ...metrics }, arrayState: snap() });

      if (arr[j] < pivot) {
        i++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `Yes. Increment i to ${i} to make room for smaller element`, codeLine: 13, metrics: { ...metrics }, arrayState: snap() });

        metrics.swaps++;
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `Store arr[${i}] in temp`, codeLine: 14, metrics: { ...metrics }, arrayState: snap() });

        let temp = arr[i];
        arr[i] = arr[j];
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `Overwrite arr[${i}] with arr[${j}]`, codeLine: 15, metrics: { ...metrics }, arrayState: snap() });
        
        arr[j] = temp;
        push({ type: EventType.SWAP, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `Swap complete. Placed smaller element at index ${i}`, codeLine: 16, metrics: { ...metrics }, arrayState: snap() });
        
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `End of swap block`, codeLine: 17, metrics: { ...metrics }, arrayState: snap() });
      } else {
        push({ type: EventType.SELECT, indices: [j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `No. Leave it on the right side of the pivot`, codeLine: 12, metrics: { ...metrics }, arrayState: snap() });
      }
      push({ type: EventType.SELECT, indices: [j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: `Move to the next element`, codeLine: 18, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { low, high, pivot, i }, sortedIndices: [...sortedIndices], description: `Finished scanning all elements up to the pivot`, codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

    metrics.swaps++;
    push({ type: EventType.SELECT, indices: [i + 1, high], variables: { low, high, i, pivot }, sortedIndices: [...sortedIndices], description: `Prepare to move pivot to its final sorted position at index ${i + 1}`, codeLine: 19, metrics: { ...metrics }, arrayState: snap() });
    
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    push({ type: EventType.SELECT, indices: [i + 1, high], variables: { low, high, i, pivot }, sortedIndices: [...sortedIndices], description: `Place the pivot at index ${i + 1}`, codeLine: 20, metrics: { ...metrics }, arrayState: snap() });

    arr[high] = temp;
    push({ type: EventType.SWAP, indices: [i + 1, high], variables: { low, high, i, 'j (was high)': high, pivot }, sortedIndices: [...sortedIndices], description: `Swap complete. Pivot is now properly placed`, codeLine: 21, metrics: { ...metrics }, arrayState: snap() });

    let pi = i + 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [pi], variables: { low, high, i, pivot, pi }, sortedIndices: [...sortedIndices], description: `Return partition index pi = ${pi}`, codeLine: 22, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [pi], variables: { low, high, i, pivot, pi }, sortedIndices: [...sortedIndices], description: `End of partition logic`, codeLine: 23, metrics: { ...metrics }, arrayState: snap() });

    return pi;
  }

  function doQuickSort(low, high) {
    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Start quickSort on subarray [${low}..${high}]`, codeLine: 0, metrics: { ...metrics }, arrayState: snap() });
    
    if (low >= high) {
      if (low === high) {
        sortedIndices.add(low);
        push({ type: EventType.MARK_SORTED, indices: [low], sortedIndices: [...sortedIndices], description: `Subarray has 1 element, it is sorted`, codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
      } else {
        push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Subarray is empty`, codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
      }
      return;
    }

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Check if low (${low}) < high (${high}): True`, codeLine: 1, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Call partition on subarray [${low}..${high}]`, codeLine: 2, metrics: { ...metrics }, arrayState: snap() });
    let pi = partition(low, high);
    sortedIndices.add(pi);

    push({ type: EventType.MARK_SORTED, indices: [pi], sortedIndices: [...sortedIndices], description: `Pivot is placed in its final sorted position at index ${pi}`, codeLine: 2, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [], variables: { low, high, pi }, sortedIndices: [...sortedIndices], description: `Recursively sort the left side of the pivot: [${low}..${pi - 1}]`, codeLine: 3, metrics: { ...metrics }, arrayState: snap() });
    doQuickSort(low, pi - 1);

    push({ type: EventType.SELECT, indices: [], variables: { low, high, pi }, sortedIndices: [...sortedIndices], description: `Recursively sort the right side of the pivot: [${pi + 1}..${high}]`, codeLine: 4, metrics: { ...metrics }, arrayState: snap() });
    doQuickSort(pi + 1, high);

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `End of if block`, codeLine: 5, metrics: { ...metrics }, arrayState: snap() });
    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: `Completed sorting for subarray [${low}..${high}]`, codeLine: 6, metrics: { ...metrics }, arrayState: snap() });
  }

  doQuickSort(0, arr.length - 1);

  push({ type: EventType.COMPLETE, indices: [], sortedIndices: [...sortedIndices], description: `Quick Sort is complete!`, metrics: { ...metrics }, arrayState: snap() });
  return events;
}
