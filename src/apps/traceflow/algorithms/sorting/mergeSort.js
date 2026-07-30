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
    push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Begin merging subarrays: left[${l}..${m}] and right[${m + 1}..${r}]`, codeLine: 9, metrics: { ...metrics }, arrayState: snap() });

    let n1 = m - l + 1;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1 }, sortedIndices: [...sortedIndices], description: `Calculate length of left subarray (n1 = ${n1})`, codeLine: 10, metrics: { ...metrics }, arrayState: snap() });

    let n2 = r - m;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: `Calculate length of right subarray (n2 = ${n2})`, codeLine: 11, metrics: { ...metrics }, arrayState: snap() });

    let L = new Array(n1);
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: `Create temporary array L for left half`, codeLine: 12, metrics: { ...metrics }, arrayState: snap() });

    let R = new Array(n2);
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, n1, n2 }, sortedIndices: [...sortedIndices], description: `Create temporary array R for right half`, codeLine: 13, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Copy data from original array to L`, codeLine: 14, metrics: { ...metrics }, arrayState: snap() });
    for (let i = 0; i < n1; ++i) {
      L[i] = arr[l + i];
      metrics.reads++;
    }

    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Copy data from original array to R`, codeLine: 15, metrics: { ...metrics }, arrayState: snap() });
    for (let j = 0; j < n2; ++j) {
      R[j] = arr[m + 1 + j];
      metrics.reads++;
    }

    let i = 0, j = 0, k = l;
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, m, r, i, j, k }, sortedIndices: [...sortedIndices], description: `Initialize pointers i, j for L and R, and k for main array`, codeLine: 16, metrics: { ...metrics }, arrayState: snap() });

    while (i < n1 && j < n2) {
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1, j, n2, k }, sortedIndices: [...sortedIndices], description: `Compare elements while both L and R have remaining items`, codeLine: 17, metrics: { ...metrics }, arrayState: snap() });
      metrics.comparisons++;

      push({ type: EventType.COMPARE, indices: [k], variables: { i, j, k, 'L[i]': L[i], 'R[j]': R[j] }, sortedIndices: [...sortedIndices], description: `Is L[${i}] (${L[i]}) <= R[${j}] (${R[j]})?`, codeLine: 18, metrics: { ...metrics }, arrayState: snap() });
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        metrics.writes++;
        push({ type: EventType.INSERT, indices: [k], variables: { i, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: `Yes! Place ${L[i]} into main array at index ${k}`, codeLine: 19, metrics: { ...metrics }, arrayState: snap() });
        i++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i }, sortedIndices: [...sortedIndices], description: `Increment L pointer (i)`, codeLine: 20, metrics: { ...metrics }, arrayState: snap() });
      } else {
        push({ type: EventType.SELECT, indices: [], variables: { i, j }, sortedIndices: [...sortedIndices], description: `No! L[${i}] is greater than R[${j}]`, codeLine: 21, metrics: { ...metrics }, arrayState: snap() });
        arr[k] = R[j];
        metrics.writes++;
        push({ type: EventType.INSERT, indices: [k], variables: { j, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: `Place ${R[j]} into main array at index ${k}`, codeLine: 22, metrics: { ...metrics }, arrayState: snap() });
        j++;
        push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: `Increment R pointer (j)`, codeLine: 23, metrics: { ...metrics }, arrayState: snap() });
        push({ type: EventType.SELECT, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: `End of else block`, codeLine: 24, metrics: { ...metrics }, arrayState: snap() });
      }

      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Increment main array pointer (k)`, codeLine: 25, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Repeat loop`, codeLine: 26, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1, j, n2, k }, sortedIndices: [...sortedIndices], description: `One of the temporary arrays is empty, exit comparison loop`, codeLine: 17, metrics: { ...metrics }, arrayState: snap() });

    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i, n1 }, sortedIndices: [...sortedIndices], description: `Check if L has remaining elements`, codeLine: 27, metrics: { ...metrics }, arrayState: snap() });
    while (i < n1) {
      arr[k] = L[i];
      metrics.writes++;
      push({ type: EventType.INSERT, indices: [k], variables: { i, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: `Copy remaining element ${L[i]} from L to main array`, codeLine: 28, metrics: { ...metrics }, arrayState: snap() });
      i++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { i }, sortedIndices: [...sortedIndices], description: `Increment i`, codeLine: 29, metrics: { ...metrics }, arrayState: snap() });
      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Increment k`, codeLine: 30, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Check loop condition again`, codeLine: 31, metrics: { ...metrics }, arrayState: snap() });
    }
    
    push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j, n2 }, sortedIndices: [...sortedIndices], description: `Check if R has remaining elements`, codeLine: 32, metrics: { ...metrics }, arrayState: snap() });
    while (j < n2) {
      arr[k] = R[j];
      metrics.writes++;
      push({ type: EventType.INSERT, indices: [k], variables: { j, k, 'arr[k]': arr[k] }, sortedIndices: [...sortedIndices], description: `Copy remaining element ${R[j]} from R to main array`, codeLine: 33, metrics: { ...metrics }, arrayState: snap() });
      j++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { j }, sortedIndices: [...sortedIndices], description: `Increment j`, codeLine: 34, metrics: { ...metrics }, arrayState: snap() });
      k++;
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Increment k`, codeLine: 35, metrics: { ...metrics }, arrayState: snap() });
      push({ type: EventType.SELECT, indices: [], variables: { k }, sortedIndices: [...sortedIndices], description: `Check loop condition again`, codeLine: 36, metrics: { ...metrics }, arrayState: snap() });
    }

    push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Merge complete for this segment`, codeLine: 37, metrics: { ...metrics }, arrayState: snap() });

    if (l === 0 && r === arr.length - 1) {
      for (let x = 0; x <= r; x++) sortedIndices.add(x);
    }
  }

  function doMergeSort(l, r) {
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: `Start mergeSort on subarray [${l}..${r}]`, codeLine: 0, metrics: { ...metrics }, arrayState: snap() });
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: `Check base condition: is left (${l}) < right (${r})?`, codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
    if (l < r) {
      let m = Math.floor(l + (r - l) / 2);
      push({ type: EventType.VARIABLE_UPDATE, indices: [], variables: { l, r, m }, sortedIndices: [...sortedIndices], description: `Yes. Calculate middle index m = ${m}`, codeLine: 2, metrics: { ...metrics }, arrayState: snap() });
      
      push({ type: EventType.SELECT, indices: [], variables: { l, m }, sortedIndices: [...sortedIndices], description: `Recursively sort the left half: [${l}..${m}]`, codeLine: 3, metrics: { ...metrics }, arrayState: snap() });
      doMergeSort(l, m);
      
      push({ type: EventType.SELECT, indices: [], variables: { 'm+1': m + 1, r }, sortedIndices: [...sortedIndices], description: `Recursively sort the right half: [${m+1}..${r}]`, codeLine: 4, metrics: { ...metrics }, arrayState: snap() });
      doMergeSort(m + 1, r);
      
      push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Merge the two sorted halves back together`, codeLine: 5, metrics: { ...metrics }, arrayState: snap() });
      merge(l, m, r);
      
      push({ type: EventType.SELECT, indices: [], variables: { l, m, r }, sortedIndices: [...sortedIndices], description: `Completed sorting subarray [${l}..${r}]`, codeLine: 6, metrics: { ...metrics }, arrayState: snap() });
    } else {
       push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: `No. Subarray has 1 or fewer elements, returning`, codeLine: 1, metrics: { ...metrics }, arrayState: snap() });
    }
    push({ type: EventType.SELECT, indices: [], variables: { l, r }, sortedIndices: [...sortedIndices], description: `Return to caller`, codeLine: 7, metrics: { ...metrics }, arrayState: snap() });
  }

  doMergeSort(0, arr.length - 1);
  push({ type: EventType.COMPLETE, indices: [], sortedIndices: [...sortedIndices], description: 'Array is fully sorted', metrics: { ...metrics }, arrayState: snap() });
  return events;
}
