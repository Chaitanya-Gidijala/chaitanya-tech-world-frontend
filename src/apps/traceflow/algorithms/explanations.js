/**
 * Extra learning material per algorithm — merged into every registry entry in ./index.js.
 *
 *   complexity  best / average / worst time, plus space
 *   pseudocode  language-neutral outline shown next to the Java implementation
 *   pros, cons  trade-offs at a glance
 *   realWorld   where the algorithm (or its idea) shows up in practice
 */
export const EXPLANATIONS = {
  'bubble-sort': {
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'repeat n − 1 times:',
      '  for each adjacent pair (a, b):',
      '    if a > b: swap a and b',
      '  the largest unsorted value is now at the end',
    ],
    pros: ['Very easy to understand and implement', 'Stable and in-place', 'Detects an already-sorted array in one pass (with a swap flag)'],
    cons: ['O(n²) comparisons on average', 'Many swaps compared to other simple sorts'],
    realWorld: ['Teaching sorting fundamentals', 'Tiny arrays in embedded code', 'Checking whether data is “almost sorted”'],
  },
  'selection-sort': {
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'for i from 0 to n − 2:',
      '  min ← index of smallest value in i … n − 1',
      '  swap arr[i] with arr[min]',
    ],
    pros: ['At most n − 1 swaps — good when writes are expensive', 'Simple and in-place'],
    cons: ['Always O(n²), even on sorted input', 'Not stable in its standard form'],
    realWorld: ['Flash/EEPROM memory where writes are costly', 'Teaching invariants (sorted prefix grows by one)'],
  },
  'insertion-sort': {
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'for i from 1 to n − 1:',
      '  key ← arr[i]',
      '  shift larger values in the sorted prefix one step right',
      '  insert key into the gap',
    ],
    pros: ['Excellent on small or nearly-sorted data', 'Stable, in-place and online (sorts as data arrives)'],
    cons: ['O(n²) on random or reversed data'],
    realWorld: ['Inside TimSort and IntroSort for small partitions', 'Sorting a hand of cards', 'Keeping a small leaderboard ordered'],
  },
  'merge-sort': {
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    pseudocode: [
      'mergeSort(list):',
      '  if size ≤ 1: return list',
      '  split into left and right halves',
      '  sort each half recursively',
      '  merge the two sorted halves',
    ],
    pros: ['Guaranteed O(n log n)', 'Stable', 'Great for linked lists and external (disk) sorting'],
    cons: ['Needs O(n) extra memory for arrays', 'Slower than Quick Sort on small in-memory arrays'],
    realWorld: ['Java’s Collections.sort / TimSort for objects', 'External sorting of huge files', 'Counting inversions'],
  },
  'quick-sort': {
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    pseudocode: [
      'quickSort(low, high):',
      '  if low < high:',
      '    p ← partition around a pivot',
      '    quickSort(low, p − 1)',
      '    quickSort(p + 1, high)',
    ],
    pros: ['Very fast in practice thanks to cache-friendly partitioning', 'In-place'],
    cons: ['O(n²) worst case with poor pivots', 'Not stable'],
    realWorld: ['Java’s Arrays.sort for primitives (dual-pivot Quick Sort)', 'C’s qsort', 'Quickselect for k-th smallest'],
  },
  'cocktail-sort': {
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'while a swap happened:',
      '  sweep left → right, swapping out-of-order pairs',
      '  sweep right → left, swapping out-of-order pairs',
      '  shrink the window from both sides',
    ],
    pros: ['Moves small values left quickly (fixes Bubble Sort’s “turtles”)', 'Stable and in-place'],
    cons: ['Still O(n²) on average'],
    realWorld: ['Teaching bidirectional passes', 'Small, nearly-sorted lists'],
  },
  'comb-sort': {
    complexity: { best: 'O(n log n)', average: 'O(n² / 2ᵖ)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'gap ← n',
      'repeat until gap = 1 and no swaps:',
      '  gap ← max(1, gap / 1.3)',
      '  compare-and-swap every pair gap apart',
    ],
    pros: ['Much faster than Bubble Sort in practice', 'Tiny code, constant memory'],
    cons: ['Not stable', 'Worst case is still quadratic'],
    realWorld: ['Memory-constrained devices needing a quick, simple sort'],
  },
  'shell-sort': {
    complexity: { best: 'O(n log n)', average: 'Gap-dependent', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: [
      'for gap in n/2, n/4, …, 1:',
      '  for i from gap to n − 1:',
      '    insertion-sort arr[i] into its gap-spaced sub-list',
    ],
    pros: ['Big speed-up over Insertion Sort', 'In-place, no recursion'],
    cons: ['Not stable', 'Complexity depends on the gap sequence (halving gaps: O(n²) worst case)'],
    realWorld: ['Embedded C libraries (e.g. uClibc’s qsort)', 'bzip2’s block sorting for small groups'],
  },
  'heap-sort': {
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    pseudocode: [
      'build a max-heap from the array',
      'for end from n − 1 down to 1:',
      '  swap the root (max) with arr[end]',
      '  heapify the root within 0 … end − 1',
    ],
    pros: ['Guaranteed O(n log n)', 'O(1) extra memory'],
    cons: ['Not stable', 'Poor cache locality — often slower than Quick Sort'],
    realWorld: ['IntroSort’s fallback (C++ std::sort)', 'Priority queues and schedulers', 'Top-K problems'],
  },
  'linear-search': {
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    pseudocode: ['for i from 0 to n − 1:', '  if arr[i] = target: return i', 'return −1'],
    pros: ['Works on unsorted data', 'Simplest possible search'],
    cons: ['O(n) — slow on large data'],
    realWorld: ['Small or unsorted lists', 'Scanning a stream once', 'Finding all matches'],
  },
  'binary-search': {
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    pseudocode: [
      'low ← 0, high ← n − 1',
      'while low ≤ high:',
      '  mid ← low + (high − low) / 2',
      '  if arr[mid] = target: return mid',
      '  if arr[mid] < target: low ← mid + 1 else high ← mid − 1',
      'return −1',
    ],
    pros: ['O(log n) — a million items in ~20 steps', 'Constant memory'],
    cons: ['Requires sorted data', 'Easy to get boundary conditions wrong'],
    realWorld: ['Database indexes (B-trees)', 'git bisect', 'Arrays.binarySearch / lower_bound'],
  },
  'jump-search': {
    complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    pseudocode: [
      'step ← √n, prev ← 0',
      'while arr[min(step, n) − 1] < target:',
      '  prev ← step, step ← step + √n',
      'linear-scan arr[prev … step − 1]',
    ],
    pros: ['Fewer backward moves than Binary Search', 'Simple'],
    cons: ['Slower than Binary Search (O(√n) vs O(log n))', 'Requires sorted data'],
    realWorld: ['Sequential-access storage', 'Skip lists use a related idea'],
  },
  'interpolation-search': {
    complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    pseudocode: [
      'while target is within arr[low] … arr[high]:',
      '  pos ← low + (target − arr[low]) × (high − low) / (arr[high] − arr[low])',
      '  if arr[pos] = target: return pos',
      '  narrow low or high past pos',
    ],
    pros: ['Extremely fast on uniformly distributed data'],
    cons: ['Degrades to O(n) on skewed data', 'Requires sorted numeric keys'],
    realWorld: ['Searching sorted IDs or timestamps', 'Phone-book style lookups'],
  },
  'exponential-search': {
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    pseudocode: [
      'if arr[0] = target: return 0',
      'bound ← 1; while bound < n and arr[bound] < target: bound ← bound × 2',
      'binary-search arr[bound / 2 … min(bound, n − 1)]',
    ],
    pros: ['Works on unbounded / infinite sorted lists', 'Fast when the target is near the start'],
    cons: ['Requires sorted data'],
    realWorld: ['Searching sorted streams of unknown length', 'Galloping mode in TimSort'],
  },
  'ternary-search': {
    complexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)', space: 'O(1)' },
    pseudocode: [
      'while low ≤ high:',
      '  mid1 ← low + (high − low) / 3, mid2 ← high − (high − low) / 3',
      '  check both probes',
      '  keep the third that can contain the target',
    ],
    pros: ['Ideal for finding extrema of unimodal functions'],
    cons: ['More comparisons than Binary Search for plain lookups'],
    realWorld: ['Optimising unimodal functions (e.g. best price point)', 'Competitive programming'],
  },
};
