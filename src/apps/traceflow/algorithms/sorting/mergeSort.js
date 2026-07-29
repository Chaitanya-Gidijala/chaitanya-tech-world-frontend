import { EventType, createMetrics } from '../types.js';

export const MERGE_SORT_CODE = [
  'void mergeSort(int[] arr, int l, int r) {',
  '    if (l < r) {',
  '        int m = l + (r - l) / 2;',
  '        mergeSort(arr, l, m);',
  '        mergeSort(arr, m + 1, r);',
  '        merge(arr, l, m, r);',
  '    }',
  '}',
  '',
  'void merge(int[] arr, int l, int m, int r) {',
  '    int n1 = m - l + 1;',
  '    int n2 = r - m;',
  '    int[] L = new int[n1];',
  '    int[] R = new int[n2];',
  '    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];',
  '    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];',
  '    int i = 0, j = 0, k = l;',
  '    while (i < n1 && j < n2) {',
  '        if (L[i] <= R[j]) {',
  '            arr[k] = L[i];',
  '            i++;',
  '        } else {',
  '            arr[k] = R[j];',
  '            j++;',
  '        }',
  '        k++;',
  '    }',
  '    while (i < n1) {',
  '        arr[k] = L[i];',
  '        i++;',
  '        k++;',
  '    }',
  '    while (j < n2) {',
  '        arr[k] = R[j];',
  '        j++;',
  '        k++;',
  '    }',
  '}'
];

export function generateMergeSortTrace(inputArray) {
  const arr = [...inputArray];
  const events = [];
  const metrics = createMetrics();
  const sortedIndices = new Set();
  const snap = () => [...arr];
  const push = (event) => events.push(event);

  function merge(l, m, r) {
    push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: 'merge(arr, ' + l + ', ' + m + ', ' + r + ')', codeLine: 9, metrics: { ...metrics }, arrayState: snap() });

    let n1 = m - l + 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1 }, sortedIndices: [...sortedIndices], description: 'int n1 = m - l + 1', codeLine: 10, metrics: { ...metrics }, arrayState: snap() });

    let n2 = r - m;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: 'int n2 = r - m', codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

    let L = new Array(n1);
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: 'int[] L = new int[n1]', codeLine: 12, metrics: { ...metrics }, arrayState: snap() });

    let R = new Array(n2);
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: 'int[] R = new int[n2]', codeLine: 13, metrics: { ...metrics }, arrayState: snap() });

    for (let i = 0; i < n1; ++i) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, i }, sortedIndices: [...sortedIndices], description: 'for (int i = ' + i + '; i < n1; ++i)', codeLine: 14, metrics: { ...metrics }, arrayState: snap() });
      L[i] = arr[l + i];
      metrics.reads++;
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: 'for i < n1 false', codeLine: 14, metrics: { ...metrics }, arrayState: snap() });

    for (let j = 0; j < n2; ++j) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, j }, sortedIndices: [...sortedIndices], description: 'for (int j = ' + j + '; j < n2; ++j)', codeLine: 15, metrics: { ...metrics }, arrayState: snap() });
      R[j] = arr[m + 1 + j];
      metrics.reads++;
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: 'for j < n2 false', codeLine: 15, metrics: { ...metrics }, arrayState: snap() });

    let i = 0, j = 0, k = l;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, i, j, k }, sortedIndices: [...sortedIndices], description: 'int i = 0, j = 0, k = l', codeLine: 16, metrics: { ...metrics }, arrayState: snap() });

    while (i < n1 && j < n2) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1, j, n2, k }, sortedIndices: [...sortedIndices], description: 'while (i < n1 && j < n2)', codeLine: 17, metrics: { ...metrics }, arrayState: snap() });
      metrics.comparisons++;

      push({ type: EventType.COMPARE, indices: [k], variables: { i, j, k, 'L[i]': L[i], 'R[j]': R[j] }, sortedIndices: [...sortedIndices], description: 'if (L[i] <= R[j])', codeLine: 18, metrics: { ...metrics }, arrayState: snap() });
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        metrics.writes++;
        push({ type: EventType.INSERT, indices: [k], variables: { i, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: 'arr[k] = L[i]', codeLine: 19, metrics: { ...metrics }, arrayState: snap() });
        i++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i }, sortedIndices: [...sortedIndices], description: 'i++', codeLine: 20, metrics: { ...metrics }, arrayState: snap() });
      } else {
        push({ type: EventType.SELECT, indices: [], variables: { i, j }, sortedIndices: [...sortedIndices], description: '} else {', codeLine: 21, metrics: { ...metrics }, arrayState: snap() });
        arr[k] = R[j];
        metrics.writes++;
        push({ type: EventType.INSERT, indices: [k], variables: { j, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: 'arr[k] = R[j]', codeLine: 22, metrics: { ...metrics }, arrayState: snap() });
        j++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: 'j++', codeLine: 23, metrics: { ...metrics }, arrayState: snap() });
        push({ type: EventType.SELECT, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: '}', codeLine: 24, metrics: { ...metrics }, arrayState: snap() });
      }

      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: 'k++', codeLine: 25, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: '}', codeLine: 26, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1, j, n2, k }, sortedIndices: [...sortedIndices], description: 'while (i < n1 && j < n2) is false', codeLine: 17, metrics: { ...metrics }, arrayState: snap() });

    while (i < n1) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1 }, sortedIndices: [...sortedIndices], description: 'while (i < n1)', codeLine: 27, metrics: { ...metrics }, arrayState: snap() });
      arr[k] = L[i];
      metrics.writes++;
      push({ type: EventType.INSERT, indices: [k], variables: { i, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: 'arr[k] = L[i]', codeLine: 28, metrics: { ...metrics }, arrayState: snap() });
      i++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i }, sortedIndices: [...sortedIndices], description: 'i++', codeLine: 29, metrics: { ...metrics }, arrayState: snap() });
      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: 'k++', codeLine: 30, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: '}', codeLine: 31, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1 }, sortedIndices: [...sortedIndices], description: 'while (i < n1) is false', codeLine: 27, metrics: { ...metrics }, arrayState: snap() });

    while (j < n2) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j, n2 }, sortedIndices: [...sortedIndices], description: 'while (j < n2)', codeLine: 32, metrics: { ...metrics }, arrayState: snap() });
      arr[k] = R[j];
      metrics.writes++;
      push({ type: EventType.INSERT, indices: [k], variables: { j, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: 'arr[k] = R[j]', codeLine: 33, metrics: { ...metrics }, arrayState: snap() });
      j++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: 'j++', codeLine: 34, metrics: { ...metrics }, arrayState: snap() });
      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: 'k++', codeLine: 35, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: '}', codeLine: 36, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j, n2 }, sortedIndices: [...sortedIndices], description: 'while (j < n2) is false', codeLine: 32, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: 'End of merge', codeLine: 37, metrics: { ...metrics }, arrayState: snap() });

    if (l === 0 && r === arr.length - 1) {
      for (let x = 0; x <= r; x++) sortedIndices.add(x);
    }
  }

  function mergeSort(l, r) {
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: 'mergeSort(arr, ' + l + ', ' + r + ')', codeLine: 0, metrics: { ...metrics }, arrayState: snap() });
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: 'if (l < r)', codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
    if (l < r) {
      let m = Math.floor(l + (r - l) / 2);
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, r, m }, sortedIndices: [...sortedIndices], description: 'int m = l + (r - l) / 2', codeLine: 2, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { l, m }, sortedIndices: [...sortedIndices], description: 'mergeSort(arr, l, m)', codeLine: 3, metrics: { ...metrics }, arrayState: snap() });
      mergeSort(l, m);
      push({ type: EventType.SELECT, indices: [], variables: { 'm+1': m + 1, r }, sortedIndices: [...sortedIndices], description: 'mergeSort(arr, m + 1, r)', codeLine: 4, metrics: { ...metrics }, arrayState: snap() });
      mergeSort(m + 1, r);
      push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: 'merge(arr, l, m, r)', codeLine: 5, metrics: { ...metrics }, arrayState: snap() });
      merge(l, m, r);
      push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: '}', codeLine: 6, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: '}', codeLine: 7, metrics: { ...metrics }, arrayState: snap() });
  }

  mergeSort(0, arr.length - 1);
  push({ type: EventType.COMPLETE, indices: [], sortedIndices: [...sortedIndices], description: 'Merge Sort Complete', metrics: { ...metrics }, arrayState: snap() });
  return events;
}
