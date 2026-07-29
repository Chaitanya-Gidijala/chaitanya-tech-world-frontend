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
    push({ type: EventType.SELECT, indices: [low, high], variables: { low, high }, sortedIndices: [...sortedIndices], description: 'partition(arr, ' + low + ', ' + high + ')', codeLine: 8, metrics: { ...metrics }, arrayState: snap() });

    let pivot = arr[high];
    push({ type: EventType.VARIABLE_UPDATE, indices: [high], variables: { low, high, pivot }, sortedIndices: [...sortedIndices], description: 'int pivot = arr[high]', codeLine: 9, metrics: { ...metrics }, arrayState: snap() });

    let i = low - 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { low, high, pivot, i }, sortedIndices: [...sortedIndices], description: 'int i = (low - 1)', codeLine: 10, metrics: { ...metrics }, arrayState: snap() });

    for (let j = low; j < high; j++) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [j], variables: { low, high, pivot, i, j }, sortedIndices: [...sortedIndices], description: 'for (int j = ' + j + '; j < high; j++)', codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

      metrics.comparisons++;
      push({ type: EventType.COMPARE, indices: [j, high], variables: { low, high, i, j, pivot, 'arr[j]': arr[j] }, sortedIndices: [...sortedIndices], description: 'if (arr[j] < pivot)', codeLine: 12, metrics: { ...metrics }, arrayState: snap() });

      if (arr[j] < pivot) {
        i++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: 'i++', codeLine: 13, metrics: { ...metrics }, arrayState: snap() });

        metrics.swaps++;
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: 'int temp = arr[i]', codeLine: 14, metrics: { ...metrics }, arrayState: snap() });

        let temp = arr[i];
        arr[i] = arr[j];
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: 'arr[i] = arr[j]', codeLine: 15, metrics: { ...metrics }, arrayState: snap() });
        
        arr[j] = temp;
        push({ type: EventType.SWAP, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: 'arr[j] = temp', codeLine: 16, metrics: { ...metrics }, arrayState: snap() });
        
        push({ type: EventType.SELECT, indices: [i, j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: '}', codeLine: 17, metrics: { ...metrics }, arrayState: snap() });
      }
      push({ type: EventType.SELECT, indices: [j], variables: { low, high, i, j, pivot }, sortedIndices: [...sortedIndices], description: '}', codeLine: 18, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { low, high, pivot, i }, sortedIndices: [...sortedIndices], description: 'for j < high false', codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

    metrics.swaps++;
    push({ type: EventType.SELECT, indices: [i + 1, high], variables: { low, high, i, pivot }, sortedIndices: [...sortedIndices], description: 'int temp = arr[i + 1]', codeLine: 19, metrics: { ...metrics }, arrayState: snap() });
    
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    push({ type: EventType.SELECT, indices: [i + 1, high], variables: { low, high, i, pivot }, sortedIndices: [...sortedIndices], description: 'arr[i + 1] = arr[high]', codeLine: 20, metrics: { ...metrics }, arrayState: snap() });

    arr[high] = temp;
    push({ type: EventType.SWAP, indices: [i + 1, high], variables: { low, high, i, 'j (was high)': high, pivot }, sortedIndices: [...sortedIndices], description: 'arr[high] = temp', codeLine: 21, metrics: { ...metrics }, arrayState: snap() });

    let pi = i + 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [pi], variables: { low, high, i, pivot, pi }, sortedIndices: [...sortedIndices], description: 'return i + 1', codeLine: 22, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [pi], variables: { low, high, i, pivot, pi }, sortedIndices: [...sortedIndices], description: '}', codeLine: 23, metrics: { ...metrics }, arrayState: snap() });

    return pi;
  }

  function quickSort(low, high) {
    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: 'quickSort(arr, ' + low + ', ' + high + ')', codeLine: 0, metrics: { ...metrics }, arrayState: snap() });
    
    if (low >= high) {
      if (low === high) {
        sortedIndices.add(low);
        push({ type: EventType.MARK_SORTED, indices: [low], sortedIndices: [...sortedIndices], description: 'if (low < high) false', codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
      } else {
        push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: 'if (low < high) false', codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
      }
      return;
    }

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: 'if (low < high)', codeLine: 1, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: 'int pi = partition(arr, low, high)', codeLine: 2, metrics: { ...metrics }, arrayState: snap() });
    let pi = partition(low, high);
    sortedIndices.add(pi);

    push({ type: EventType.MARK_SORTED, indices: [pi], sortedIndices: [...sortedIndices], description: 'partition returned ' + pi, codeLine: 2, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [], variables: { low, high, pi }, sortedIndices: [...sortedIndices], description: 'quickSort(arr, low, pi - 1)', codeLine: 3, metrics: { ...metrics }, arrayState: snap() });
    quickSort(low, pi - 1);

    push({ type: EventType.SELECT, indices: [], variables: { low, high, pi }, sortedIndices: [...sortedIndices], description: 'quickSort(arr, pi + 1, high)', codeLine: 4, metrics: { ...metrics }, arrayState: snap() });
    quickSort(pi + 1, high);

    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: '}', codeLine: 5, metrics: { ...metrics }, arrayState: snap() });
    push({ type: EventType.SELECT, indices: [], variables: { low, high }, sortedIndices: [...sortedIndices], description: '}', codeLine: 6, metrics: { ...metrics }, arrayState: snap() });
  }

  quickSort(0, arr.length - 1);

  push({ type: EventType.COMPLETE, indices: [], sortedIndices: [...sortedIndices], description: 'Quick Sort Complete', metrics: { ...metrics }, arrayState: snap() });
  return events;
}
