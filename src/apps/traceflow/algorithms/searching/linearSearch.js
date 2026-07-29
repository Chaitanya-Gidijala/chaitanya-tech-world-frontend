import { EventType, createMetrics } from '../types.js';

export const LINEAR_SEARCH_CODE = [
  'int linearSearch(int[] arr, int target) {',
  '    for (int i = 0; i < arr.length; i++) {',
  '        if (arr[i] == target) {',
  '            return i;',
  '        }',
  '    }',
  '    return -1;',
  '}',
];

export function generateLinearSearchTrace(inputArray, target) {
  const arr = [...inputArray];
  const events = [];
  const metrics = createMetrics();
  const snap = () => [...arr];
  const push = (e) => events.push(e);

  for (let i = 0; i < arr.length; i++) {
    metrics.iterations++;
    
    // 1. Loop condition check
    push({
      type: EventType.COMPARE,
      indices: [i],
      values: [arr[i]],
      variables: { i, 'arr.length': arr.length, target },
      description: `Checking loop condition i = ${i} < ${arr.length}`,
      explanation: `i is ${i}, which is less than the array length ${arr.length}. Proceeding into loop.`,
      whyText: `The for-loop ensures we don't read past the end of the array.`,
      codeLine: 2,
      metrics: { ...metrics },
      arrayState: snap(),
    });

    metrics.comparisons++;
    metrics.reads++;

    if (arr[i] === target) {
      // 2. If condition (match)
      push({
        type: EventType.MARK_FOUND,
        indices: [i],
        values: [arr[i]],
        variables: { i, 'arr[i]': arr[i], target },
        description: `Found! arr[${i}] = ${target}`,
        explanation: `arr[${i}] = ${arr[i]} matches the target ${target}.`,
        whyText: `We found our target. Linear search checks each element one by one until a match is found.`,
        codeLine: 3,
        metrics: { ...metrics },
        arrayState: snap(),
      });
      
      // 3. Return statement
      push({
        type: EventType.COMPLETE,
        indices: [i],
        variables: { result: i },
        description: `Search complete — returning index ${i}`,
        explanation: `Returning ${i} because we found ${target} at this position.`,
        codeLine: 4,
        metrics: { ...metrics },
        arrayState: snap(),
      });
      return events;
    } else {
      // 2. If condition (mismatch)
      push({
        type: EventType.COMPARE,
        indices: [i],
        values: [arr[i]],
        variables: { i, 'arr[i]': arr[i], target },
        description: `arr[${i}]=${arr[i]} ≠ ${target} — move on`,
        explanation: `arr[${i}] = ${arr[i]} does not match target ${target}. Move to the next element.`,
        whyText: `Linear search has no shortcut — it must check each element until it finds the target or exhausts the array.`,
        codeLine: 3,
        metrics: { ...metrics },
        arrayState: snap(),
      });
    }
  }

  // Loop exhausted
  push({
    type: EventType.SELECT,
    indices: [],
    variables: { i: arr.length, 'arr.length': arr.length, target },
    description: `Loop ends: i = ${arr.length}`,
    explanation: `i is now ${arr.length}, which is not less than the array length. The loop ends.`,
    codeLine: 2,
    metrics: { ...metrics },
    arrayState: snap(),
  });

  push({
    type: EventType.COMPLETE,
    indices: [],
    variables: { result: -1 },
    description: `Target ${target} not found`,
    explanation: `Searched all ${arr.length} elements. ${target} is not in the array. Return -1.`,
    codeLine: 7,
    metrics: { ...metrics },
    arrayState: snap(),
  });
  return events;
}
