import { EventType, createMetrics } from '../types.js';

export const INSERTION_SORT_CODE = [
  'void insertionSort(int[] arr) {',
  '    int n = arr.length;',
  '    for (int i = 1; i < n; i++) {',
  '        int key = arr[i];',
  '        int j = i - 1;',
  '        while (j >= 0 && arr[j] > key) {',
  '            arr[j + 1] = arr[j];',
  '            j--;',
  '        }',
  '        arr[j + 1] = key;',
  '    }',
  '}',
];

export function generateInsertionSortTrace(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const events = [];
  const metrics = createMetrics();
  const sortedIndices = new Set([0]);
  const snap = () => [...arr];
  const push = (e) => events.push(e);

  for (let i = 1; i < n; i++) {
    metrics.iterations++;
    
    // Step 1: `for (int i = 1; i < n; i++)`
    push({
      type: EventType.SELECT,
      indices: [i],
      values: [arr[i]],
      variables: { i },
      sortedIndices: [...sortedIndices],
      description: `Iterate i = ${i}`,
      explanation: `We begin the next iteration of the outer loop with i = ${i}.`,
      whyText: `Insertion sort builds a sorted portion from left to right.`,
      codeLine: 3,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    const key = arr[i];
    
    // Step 2: `int key = arr[i];`
    push({
      type: EventType.SELECT,
      indices: [i],
      values: [key],
      variables: { i, key },
      sortedIndices: [...sortedIndices],
      description: `Pick key = arr[${i}] = ${key}`,
      explanation: `We pick the element at index ${i} (value ${key}) as the key to insert into the sorted left portion (indices 0 to ${i-1}).`,
      beginnerNote: `Think of sorting playing cards in your hand. You pick up a new card and slide it into the right position.`,
      codeLine: 4,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    let j = i - 1;
    
    // Step 3: `int j = i - 1;`
    push({
      type: EventType.SELECT,
      indices: [i, j],
      values: [key, arr[j]],
      variables: { i, key, j },
      sortedIndices: [...sortedIndices],
      description: `Set j = ${j}`,
      explanation: `We set j = ${j} to start comparing our key with elements in the sorted portion from right to left.`,
      codeLine: 5,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    while (j >= 0 && arr[j] > key) {
      metrics.comparisons++;
      
      push({
        type: EventType.COMPARE,
        indices: [j],
        values: [arr[j], key],
        variables: { i, key, j },
        sortedIndices: [...sortedIndices],
        description: `Compare arr[${j}] > key`,
        explanation: `Is arr[${j}] (${arr[j]}) greater than key (${key})? Yes.`,
        codeLine: 6,
        metrics: { ...metrics },
        arrayState: snap(),
      });

      metrics.reads++;
      metrics.writes++;
      arr[j + 1] = arr[j];

      push({
        type: EventType.SHIFT,
        indices: [j, j + 1],
        values: [arr[j + 1], key],
        variables: { i, key, j, 'arr[j]': arr[j + 1] },
        sortedIndices: [...sortedIndices],
        description: `arr[${j+1}] = arr[${j}]`,
        explanation: `Shift ${arr[j+1]} one position to the right to make room for the key.`,
        codeLine: 7,
        metrics: { ...metrics },
        arrayState: snap(),
      });
      
      j--;
      
      push({
        type: EventType.SELECT,
        indices: j >= 0 ? [j] : [],
        values: [],
        variables: { i, key, j },
        sortedIndices: [...sortedIndices],
        description: `j--`,
        explanation: `Decrement j to ${j} to check the next element to the left.`,
        codeLine: 8,
        metrics: { ...metrics },
        arrayState: snap(),
      });
    }

    if (j >= 0) {
      metrics.comparisons++;
      push({
        type: EventType.COMPARE,
        indices: [j],
        values: [arr[j], key],
        variables: { i, key, j },
        sortedIndices: [...sortedIndices],
        description: `Compare arr[${j}] > key`,
        explanation: `Is arr[${j}] (${arr[j]}) greater than key (${key})? No, we found the insertion point.`,
        codeLine: 6,
        metrics: { ...metrics },
        arrayState: snap(),
      });
    }

    arr[j + 1] = key;
    metrics.writes++;

    sortedIndices.add(i);

    push({
      type: EventType.INSERT,
      indices: [j + 1],
      values: [key],
      variables: { i, key, j, insertedAt: j + 1 },
      sortedIndices: [...sortedIndices],
      description: `Insert key=${key} at index ${j + 1}`,
      explanation: `Found the correct position at index ${j+1}. Placed ${key} there. The left portion (0 to ${i}) is now sorted.`,
      codeLine: 10,
      metrics: { ...metrics },
      arrayState: snap(),
    });
  }

  push({
    type: EventType.COMPLETE,
    indices: [...Array(n).keys()],
    sortedIndices: [...Array(n).keys()],
    variables: {},
    description: 'Array is fully sorted!',
    explanation: `Insertion sort complete. ${metrics.comparisons} comparisons, ${metrics.writes} writes.`,
    codeLine: 11,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  return events;
}
