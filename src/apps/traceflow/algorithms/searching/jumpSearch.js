import { EventType } from '../types.js';
import { createTracer } from '../tracer.js';

export const JUMP_SEARCH_CODE = [
  'int jumpSearch(int[] arr, int target) {',
  '    int n = arr.length, step = (int) Math.sqrt(n), prev = 0;',
  '    while (arr[Math.min(step, n) - 1] < target) {   // jump ahead',
  '        prev = step;',
  '        step += (int) Math.sqrt(n);',
  '        if (prev >= n) return -1;',
  '    }',
  '    for (int i = prev; i < Math.min(step, n); i++)   // scan block',
  '        if (arr[i] == target) return i;',
  '    return -1;',
  '}',
];

export function generateJumpSearchTrace(input, target) {
  const t = createTracer(input);
  const { arr } = t;
  const n = arr.length;
  const jump = Math.max(1, Math.floor(Math.sqrt(n)));
  let step = jump;
  let prev = 0;

  t.step(EventType.VARIABLE_UPDATE, {
    variables: { step, prev, target },
    description: `Block size √${n} ≈ ${jump}`,
    explanation: `Jump through the sorted array in blocks of ${jump}, then scan inside one block.`,
    whyText: 'Jumping √n at a time balances the number of jumps against the length of the final linear scan: O(√n) total.',
    beginnerNote: 'Like flipping a book a chapter at a time, then reading page by page once you overshoot.',
    codeLine: 1,
  });

  while (true) {
    const probe = Math.min(step, n) - 1;
    t.metrics.comparisons++;
    t.metrics.reads++;
    const less = arr[probe] < target;
    t.step(EventType.COMPARE, {
      indices: [probe],
      variables: { prev, step, target },
      description: `Block end arr[${probe}] = ${arr[probe]} vs ${target}`,
      explanation: less ? `${arr[probe]} < ${target} — the target is further ahead. Jump.` : `${arr[probe]} ≥ ${target} — the target, if present, is in this block.`,
      codeLine: 2,
    });
    if (!less) break;
    t.discard(prev, probe);
    prev = step;
    step += jump;
    t.metrics.iterations++;
    t.step(EventType.POINTER_MOVE, {
      indices: [Math.min(prev, n - 1)],
      variables: { prev, step, target },
      description: `Jump to the next block (prev = ${prev})`,
      explanation: 'The whole previous block was smaller than the target, so it is skipped.',
      codeLine: 4,
    });
    if (prev >= n) {
      return t.done({ keepSorted: false, description: `${target} not found`, explanation: 'We jumped past the end of the array.', codeLine: 5 });
    }
  }

  for (let i = prev; i < Math.min(step, n); i++) {
    t.metrics.comparisons++;
    t.metrics.reads++;
    const hit = arr[i] === target;
    t.step(hit ? EventType.MARK_FOUND : EventType.COMPARE, {
      indices: [i],
      variables: { i, prev, step, target },
      description: hit ? `Found ${target} at index ${i}` : `arr[${i}] = ${arr[i]} ≠ ${target}`,
      explanation: hit ? `Linear scan inside the block found the target.` : 'Keep scanning the block.',
      codeLine: 8,
    });
    if (hit) {
      return t.done({ keepSorted: false, indices: [i], description: `Found at index ${i}`, explanation: `${t.metrics.comparisons} comparisons in total.`, codeLine: 8, foundIndex: i });
    }
  }
  return t.done({ keepSorted: false, description: `${target} not found`, explanation: 'The block was scanned completely without a match.', codeLine: 9 });
}
