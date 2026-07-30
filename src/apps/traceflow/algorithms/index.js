import { generateBubbleSortTrace, BUBBLE_SORT_CODE } from './sorting/bubbleSort.js';
import { generateSelectionSortTrace, SELECTION_SORT_CODE } from './sorting/selectionSort.js';
import { generateInsertionSortTrace, INSERTION_SORT_CODE } from './sorting/insertionSort.js';
import { generateMergeSortTrace, MERGE_SORT_CODE } from './sorting/mergeSort.js';
import { generateQuickSortTrace, QUICK_SORT_CODE } from './sorting/quickSort.js';
import { generateBinarySearchTrace, BINARY_SEARCH_CODE } from './searching/binarySearch.js';
import { generateLinearSearchTrace, LINEAR_SEARCH_CODE } from './searching/linearSearch.js';

// =========================================================
// ALGORITHM REGISTRY — content + trace generators
// =========================================================

export const ALGORITHMS = {
  'bubble-sort': {
    id: 'bubble-sort',
    slug: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'beginner',
    summary: 'Bubble Sort is a straightforward, beginner-friendly sorting algorithm that repeatedly steps through the list. In every pass, it compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted. It is named for the way larger elements "bubble" to the top (or end) of the list with each iteration.',
    intuition: 'Imagine bubbles rising to the surface of water. Each pass through the array "bubbles" the largest unsorted element to its correct position at the end.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    tags: ['comparison', 'in-place', 'stable', 'sorting'],
    codeLines: BUBBLE_SORT_CODE,
    traceGenerator: (arr) => generateBubbleSortTrace(arr),
    defaultInput: [64, 34, 25, 12, 22, 11, 90],
    requiresSorted: false,
    hasTarget: false,
    whenToUse: 'Educational purposes and very small arrays. Never use in production due to O(n²) worst-case.',
    steps: [
      'Compare adjacent elements (starting from index 0).',
      'If the first is greater than the second, swap them.',
      'Move to the next adjacent pair and repeat until the end of the array.',
      'The largest element will "bubble up" to the last position, which is now sorted.',
      'Repeat the entire process for the remaining unsorted elements until no swaps are needed.'
    ],
    interviewQuestions: [
      'What is the best-case time complexity of Bubble Sort?',
      'How would you detect if an array is already sorted in one pass?',
      'Why is Bubble Sort considered stable?',
    ],
    goodPractices: [
      'Only use for educational purposes or extremely small datasets.',
      'Implement an early termination flag (e.g. `swapped = false`) to optimize cases where the array is already sorted.',
      'Prefer Insertion Sort over Bubble Sort if you need a simple O(n²) algorithm.'
    ],
  },
  'selection-sort': {
    id: 'selection-sort',
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    difficulty: 'beginner',
    summary: 'Selection Sort is a simple comparison algorithm that divides the array into two sections: a sorted portion at the front and an unsorted portion at the back. It repeatedly scans the unsorted portion to find the absolute smallest element, and then swaps it with the first unsorted element. This process securely locks one more element into its final sorted position with every pass.',
    intuition: 'Like sorting a hand of cards by always picking the smallest card from the remaining unsorted pile and placing it next.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    tags: ['comparison', 'in-place', 'sorting'],
    codeLines: SELECTION_SORT_CODE,
    traceGenerator: (arr) => generateSelectionSortTrace(arr),
    defaultInput: [64, 25, 12, 22, 11],
    requiresSorted: false,
    hasTarget: false,
    whenToUse: 'When memory writes are expensive (minimizes swaps). Otherwise, insertion sort is generally preferred.',
    steps: [
      'Assume the first unsorted element is the minimum (minIdx).',
      'Scan the rest of the unsorted array to find if there is a smaller element.',
      'If a smaller element is found, update minIdx to that element\'s index.',
      'After the scan, swap the minimum element found with the first unsorted element.',
      'The sorted boundary moves one step to the right. Repeat.'
    ],
    interviewQuestions: [
      'Why is Selection Sort not stable by default?',
      'Compare Selection Sort and Bubble Sort in terms of swaps.',
      'Can Selection Sort be made stable?',
    ],
    goodPractices: [
      'Use Selection Sort when memory writes (swaps) are significantly more expensive than memory reads, as it makes at most O(n) swaps.',
      'Do not use Selection Sort if stability is required (e.g. sorting objects by multiple keys).',
      'For general sorting, prefer built-in sorting methods or more efficient algorithms like Merge Sort.'
    ],
  },
  'insertion-sort': {
    id: 'insertion-sort',
    slug: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'beginner',
    summary: 'Insertion Sort is an intuitive algorithm that builds the final sorted array one item at a time. It iterates through the input array, consuming one element per iteration, and finds its correct position within the already sorted left-hand side of the array. It does this by shifting any larger elements to the right to make room for the new element, much like sorting playing cards in your hand.',
    intuition: 'Like sorting playing cards — you pick one card at a time and slide it into the correct position among the cards you are already holding.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    tags: ['comparison', 'in-place', 'stable', 'adaptive', 'sorting'],
    codeLines: INSERTION_SORT_CODE,
    traceGenerator: (arr) => generateInsertionSortTrace(arr),
    defaultInput: [12, 11, 13, 5, 6],
    requiresSorted: false,
    hasTarget: false,
    whenToUse: 'Small arrays or nearly-sorted arrays. O(n) best case for already-sorted input. Used as a subroutine in Timsort.',
    steps: [
      'Assume the first element (index 0) is already sorted.',
      'Pick the next element and store it in a temporary variable (key).',
      'Compare the key with the elements in the sorted portion (right to left).',
      'Shift elements that are greater than the key to the right.',
      'Insert the key into the correct position. Repeat for all elements.'
    ],
    interviewQuestions: [
      'What is the best-case time complexity of Insertion Sort?',
      'When would you prefer Insertion Sort over Merge Sort?',
      'Is Insertion Sort adaptive?',
    ],
    goodPractices: [
      'Use for very small datasets (typically n < 50) as it has very low overhead compared to O(n log n) algorithms.',
      'Excellent choice when you know the input data is already nearly sorted (adaptive behavior).',
      'It is commonly used as the base-case sorting algorithm in hybrid sorts like Timsort (used in Python and Java).'
    ],
  },
  'merge-sort': {
    id: 'merge-sort',
    slug: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'intermediate',
    summary: 'Merge Sort is a highly efficient, stable sorting algorithm based on the Divide and Conquer paradigm. It divides the input array into two halves, recursively calls itself for the two halves, and then merges the two sorted halves. It is widely used in systems where stable sorting is required and memory is not a strict constraint.',
    intuition: 'If you have two sorted piles of cards, you can easily merge them into one sorted pile by comparing the top cards. Merge Sort repeatedly halves the deck until every pile is size 1 (which is sorted), then merges them back together.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    tags: ['divide-and-conquer', 'stable', 'sorting'],
    codeLines: MERGE_SORT_CODE,
    traceGenerator: (arr) => generateMergeSortTrace(arr),
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    requiresSorted: false,
    hasTarget: false,
    whenToUse: 'When stable sorting is strictly required and O(n) extra space is acceptable. Highly predictable performance (always O(n log n)).',
    steps: [
      'Find the middle point to divide the array into two halves.',
      'Call mergeSort recursively for the first half.',
      'Call mergeSort recursively for the second half.',
      'Merge the two sorted halves back into a single sorted sequence.'
    ],
    interviewQuestions: [
      'Why is Merge Sort preferred for Linked Lists over arrays?',
      'Can Merge Sort be implemented in-place?',
      'What is the space complexity of Merge Sort?'
    ],
    goodPractices: [
      'Prefer Merge Sort for sorting linked lists because elements can be inserted without shifting.',
      'Use Merge Sort when stability is absolutely necessary (e.g., sorting objects with multiple keys).'
    ],
  },
  'quick-sort': {
    id: 'quick-sort',
    slug: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'intermediate',
    summary: 'Quick Sort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. By placing the pivot in its exact correct sorted position and organizing smaller elements to its left and larger elements to its right, it effectively breaks the sorting problem into two smaller sub-problems.',
    intuition: 'Pick a person in the line (pivot). Ask everyone shorter to stand on their left and everyone taller on their right. Now the pivot is in the exact right spot. Repeat for the left and right groups.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    tags: ['divide-and-conquer', 'in-place', 'sorting'],
    codeLines: QUICK_SORT_CODE,
    traceGenerator: (arr) => generateQuickSortTrace(arr),
    defaultInput: [10, 80, 30, 90, 40, 50, 70],
    requiresSorted: false,
    hasTarget: false,
    whenToUse: 'General-purpose sorting. Fast in practice due to excellent cache locality. Default algorithm used in many language libraries (often hybridised as Introsort).',
    steps: [
      'Pick an element as pivot (we use the last element).',
      'Partition the array by moving elements smaller than the pivot to the left, and larger elements to the right.',
      'Place the pivot in its correct sorted position.',
      'Recursively apply the same logic to the left and right sub-arrays.'
    ],
    interviewQuestions: [
      'What is the worst-case time complexity of Quick Sort, and when does it occur?',
      'How can you mitigate the O(n²) worst-case scenario in Quick Sort?',
      'Why is Quick Sort generally preferred over Merge Sort for arrays?'
    ],
    goodPractices: [
      'Choose pivots wisely (e.g., median-of-three, randomized pivot) to avoid worst-case O(n²) performance.',
      'Switch to Insertion Sort for very small sub-arrays to optimize overhead.'
    ],
  },
  'linear-search': {
    id: 'linear-search',
    slug: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    difficulty: 'beginner',
    summary: 'Linear Search (also known as Sequential Search) is the most basic and intuitive method for finding a target value within a list. It simply checks every single element of the list, one by one, starting from the very first element and moving sequentially until a match is found or until all elements have been checked. It works perfectly on both sorted and unsorted data.',
    intuition: 'Looking for your keys by checking every room in the house, one by one, until you find them.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    tags: ['searching', 'brute-force'],
    codeLines: LINEAR_SEARCH_CODE,
    traceGenerator: (arr, target) => generateLinearSearchTrace(arr, target),
    defaultInput: [5, 3, 8, 1, 9, 2, 7],
    defaultTarget: 9,
    requiresSorted: false,
    hasTarget: true,
    whenToUse: 'Unsorted arrays, small datasets, or when you need to find all occurrences.',
    steps: [
      'Start at the first element (index 0) of the array.',
      'Compare the current element with the target value.',
      'If they match, return the current index (target found).',
      'If they don\'t match, move to the next element.',
      'If the end of the array is reached, return -1 (target not found).'
    ],
    interviewQuestions: [
      'When would you use Linear Search over Binary Search?',
      'What is the average case comparisons for Linear Search?',
    ],
    goodPractices: [
      'Use Linear Search when the dataset is unsorted or very small.',
      'For frequent searches on the same dataset, consider sorting the data first and using Binary Search, or use a Hash Map.',
      'It is perfectly safe for linked lists where you cannot jump directly to the middle element.'
    ],
  },
  'binary-search': {
    id: 'binary-search',
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    difficulty: 'beginner',
    summary: 'Binary Search is a highly efficient search algorithm that finds the position of a target value within a sorted array. Instead of scanning one by one, it works by repeatedly dividing the search space in half. It compares the target to the middle element: if the target is smaller, it completely discards the right half; if it is larger, it discards the left half. This halving makes it incredibly fast, even for massive datasets.',
    intuition: 'Like finding a word in a dictionary — you open to the middle, check if your word is before or after, and eliminate half the book.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    tags: ['searching', 'divide-and-conquer', 'sorted'],
    codeLines: BINARY_SEARCH_CODE,
    traceGenerator: (arr, target) => generateBinarySearchTrace(arr, target),
    defaultInput: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    defaultTarget: 13,
    requiresSorted: true,
    hasTarget: true,
    whenToUse: 'Sorted arrays when O(log n) search time is needed. Foundation for many advanced algorithms.',
    steps: [
      'Initialize two pointers: low (start) and high (end) of the array.',
      'Calculate the mid index: mid = low + (high - low) / 2.',
      'Compare the middle element with the target value.',
      'If it matches, return the mid index.',
      'If the target is smaller, search the left half (high = mid - 1).',
      'If the target is larger, search the right half (low = mid + 1). Repeat until low > high.'
    ],
    interviewQuestions: [
      'Why must the array be sorted for Binary Search?',
      'Why use mid = low + (high-low)/2 instead of (low+high)/2?',
      'What is the iterative vs recursive complexity of Binary Search?',
      'How would you find the first or last occurrence of a duplicate?',
    ],
    goodPractices: [
      'Always ensure the array is strictly sorted before performing a Binary Search.',
      'Use `mid = low + (high - low) / 2` instead of `mid = (low + high) / 2` to prevent integer overflow for large arrays.',
      'Pay close attention to loop conditions (`low <= high` vs `low < high`) to avoid infinite loops.'
    ],
  },
};

export const CATEGORIES = [
  {
    id: 'sorting',
    name: 'Sorting',
    icon: 'ArrowUpDown',
    description: 'Algorithms that arrange elements in a specific order.',
    color: '#6366F1',
    algorithms: ['bubble-sort', 'selection-sort', 'insertion-sort'],
  },
  {
    id: 'searching',
    name: 'Searching',
    icon: 'Search',
    description: 'Techniques to find elements within data structures.',
    color: '#10B981',
    algorithms: ['linear-search', 'binary-search'],
  },
];

// =========================================================
// TOPIC GROUPS — sidebar navigation tree
// =========================================================
export const TOPIC_GROUPS = [
  {
    id: 'sorting',
    label: 'Sorting Algorithms',
    color: '#6366F1',
    topics: [
      { id: 'basic-sorting', label: 'Basic Sorts', slugs: ['bubble-sort', 'selection-sort', 'insertion-sort'] },
      { id: 'advanced-sorting', label: 'Advanced Sorts', slugs: [], comingSoon: true },
      { id: 'hybrid-sorting', label: 'Hybrid Sorts', slugs: [], comingSoon: true },
    ],
  },
  {
    id: 'searching',
    label: 'Searching Algorithms',
    color: '#10B981',
    topics: [
      { id: 'linear', label: 'Linear Search', slugs: ['linear-search'] },
      { id: 'binary', label: 'Binary Search', slugs: ['binary-search'] },
      { id: 'advanced-search', label: 'Advanced Search', slugs: [], comingSoon: true },
    ],
  },
  {
    id: 'graphs',
    label: 'Graph Algorithms',
    color: '#F59E0B',
    comingSoon: true,
    topics: [
      { id: 'traversal', label: 'BFS & DFS', slugs: [], comingSoon: true },
      { id: 'shortest-path', label: 'Shortest Path', slugs: [], comingSoon: true },
      { id: 'mst', label: 'Minimum Spanning Tree', slugs: [], comingSoon: true },
    ],
  },
  {
    id: 'dynamic-programming',
    label: 'Dynamic Programming',
    color: '#EF4444',
    comingSoon: true,
    topics: [
      { id: 'dp-1d', label: '1D DP', slugs: [], comingSoon: true },
      { id: 'dp-2d', label: '2D DP', slugs: [], comingSoon: true },
      { id: 'dp-knapsack', label: 'Knapsack Problems', slugs: [], comingSoon: true },
    ],
  },
  {
    id: 'trees',
    label: 'Trees & Tries',
    color: '#8B5CF6',
    comingSoon: true,
    topics: [
      { id: 'bst', label: 'Binary Search Tree', slugs: [], comingSoon: true },
      { id: 'heap', label: 'Heaps & Priority Queue', slugs: [], comingSoon: true },
      { id: 'trie', label: 'Tries', slugs: [], comingSoon: true },
    ],
  },
  {
    id: 'data-structures',
    label: 'Data Structures',
    color: '#06B6D4',
    comingSoon: true,
    topics: [
      { id: 'arrays', label: 'Arrays & Hashing', slugs: [], comingSoon: true },
      { id: 'linked-list', label: 'Linked Lists', slugs: [], comingSoon: true },
      { id: 'stack-queue', label: 'Stack & Queue', slugs: [], comingSoon: true },
    ],
  },
];

// =========================================================
// SYSTEM DESIGN GROUPS
// =========================================================
export const SYSTEM_DESIGN_GROUPS = [
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    color: '#8B5CF6',
    topics: [
      { id: 'networking', label: 'Networking Basics', slugs: [] },
      { id: 'performance', label: 'Performance Metrics', slugs: [] },
    ],
  },
  {
    id: 'core-components',
    label: 'Core Components',
    color: '#F59E0B',
    topics: [
      { id: 'load-balancers', label: 'Load Balancers', slugs: [] },
      { id: 'caching', label: 'Caching', slugs: [] },
      { id: 'databases', label: 'Databases', slugs: [] },
      { id: 'message-queues', label: 'Message Queues', slugs: [] },
    ],
  },
  {
    id: 'case-studies',
    label: 'System Case Studies',
    color: '#EC4899',
    topics: [
      { id: 'social-media', label: 'Social Media', slugs: [] },
      { id: 'streaming', label: 'Video Streaming', slugs: [] },
      { id: 'ecommerce', label: 'E-commerce', slugs: [] },
    ],
  },
];

// =========================================================
// SYSTEM DESIGN — concepts and case studies
// =========================================================
export const SYSTEM_DESIGN_TOPICS = [
  { id: 'sd-001', title: 'Design a URL Shortener', category: 'basics', difficulty: 'intermediate', tags: ['hashing', 'databases', 'scalability'], status: 'coming-soon' },
  { id: 'sd-002', title: 'Design a Rate Limiter', category: 'basics', difficulty: 'intermediate', tags: ['algorithms', 'redis', 'api-design'], status: 'coming-soon' },
  { id: 'sd-003', title: 'Design Twitter / X Feed', category: 'social', difficulty: 'advanced', tags: ['feed', 'fanout', 'caching'], status: 'coming-soon' },
  { id: 'sd-004', title: 'Design YouTube', category: 'media', difficulty: 'advanced', tags: ['cdn', 'video-streaming', 'encoding'], status: 'coming-soon' },
  { id: 'sd-005', title: 'Design WhatsApp', category: 'messaging', difficulty: 'advanced', tags: ['websockets', 'end-to-end-encryption', 'presence'], status: 'coming-soon' },
  { id: 'sd-006', title: 'Design a Key-Value Store', category: 'basics', difficulty: 'intermediate', tags: ['consistent-hashing', 'replication', 'cap-theorem'], status: 'coming-soon' },
  { id: 'sd-007', title: 'Design Uber / Lyft', category: 'location', difficulty: 'advanced', tags: ['geospatial', 'real-time', 'matching'], status: 'coming-soon' },
  { id: 'sd-008', title: 'Load Balancing Strategies', category: 'fundamentals', difficulty: 'beginner', tags: ['round-robin', 'least-connections', 'consistent-hashing'], status: 'coming-soon' },
  { id: 'sd-009', title: 'Caching Strategies & Patterns', category: 'fundamentals', difficulty: 'beginner', tags: ['redis', 'memcached', 'cdn', 'eviction'], status: 'coming-soon' },
  { id: 'sd-010', title: 'SQL vs NoSQL Databases', category: 'fundamentals', difficulty: 'beginner', tags: ['mysql', 'mongodb', 'trade-offs'], status: 'coming-soon' },
  { id: 'sd-011', title: 'Design a Notification System', category: 'basics', difficulty: 'intermediate', tags: ['message-queues', 'push-pull', 'fanout'], status: 'coming-soon' },
  { id: 'sd-012', title: 'Design Google Search', category: 'search', difficulty: 'advanced', tags: ['crawling', 'indexing', 'ranking', 'pagerank'], status: 'coming-soon' },
];

export function getAlgorithm(slug) {
  return ALGORITHMS[slug] ?? null;
}

export function getAllAlgorithms() {
  return Object.values(ALGORITHMS);
}

export function getAlgorithmsByCategory(category) {
  return Object.values(ALGORITHMS).filter(a => a.category === category);
}
