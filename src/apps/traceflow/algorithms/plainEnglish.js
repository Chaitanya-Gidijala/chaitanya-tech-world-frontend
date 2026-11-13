/**
 * Plain-English explanations — written to be read (or listened to) like a
 * friend explaining the algorithm out loud. Shown on the algorithm detail page.
 *
 *   hook        one-sentence answer to "what does it do?"
 *   story       short conversational paragraphs that walk through the idea
 *   takeaways   three things to remember
 *   example     a tiny input for the auto-generated worked example (+ target for searches)
 */
export const PLAIN_ENGLISH = {
  'bubble-sort': {
    hook: 'Bubble Sort keeps swapping neighbours that are in the wrong order until nothing needs swapping.',
    story: [
      'Picture a row of numbers. Bubble Sort starts at the left and looks at just two numbers at a time — the first and the second. If the left one is bigger, it swaps them. Then it moves one step right and does the same with the next pair.',
      'By the time it reaches the end of the row, something nice has happened: the biggest number has been carried all the way to the last position, like a bubble rising to the surface. That number is now in its final place, so we never need to touch it again.',
      'Then we go back to the start and do another pass, this time stopping one place earlier. Each pass locks one more big number into place at the end.',
      'We keep going until a full pass makes no swaps at all. That tells us every neighbour is already in order — so the whole list is sorted.',
    ],
    takeaways: [
      'It only ever compares and swaps neighbours.',
      'After each pass, the largest remaining number is in its final spot.',
      'Simple to understand, but slow on big lists — about n² comparisons.',
    ],
    example: { input: [5, 1, 4, 2] },
  },
  'selection-sort': {
    hook: 'Selection Sort repeatedly finds the smallest remaining number and puts it next in line.',
    story: [
      'Think of the list as two parts: a sorted part on the left, which starts empty, and an unsorted part on the right.',
      'Selection Sort scans the whole unsorted part to find the smallest number. Once it has found it, it swaps that number into the first unsorted position. Now the sorted part is one number longer.',
      'Then it does the same again: scan what is left, find the smallest, move it into place. It is a bit like picking the shortest person out of a crowd, one at a time, and lining them up.',
      'When only one number is left, it must already be the biggest, so we are done.',
    ],
    takeaways: [
      'Each round places exactly one number in its final position.',
      'It makes very few swaps — at most one per round.',
      'It always does about n² comparisons, even if the list is already sorted.',
    ],
    example: { input: [29, 10, 14, 37] },
  },
  'insertion-sort': {
    hook: 'Insertion Sort builds a sorted list one number at a time, sliding each new number into the right spot.',
    story: [
      'This is exactly how most people sort playing cards in their hand. You pick up one card at a time and slide it left until it sits in the right place among the cards you are already holding.',
      'Insertion Sort treats the first number as a tiny sorted list. Then it takes the next number and compares it with the numbers to its left. Every bigger number shifts one place to the right to make room, and the new number drops into the gap.',
      'It repeats this for every number, so the sorted part on the left keeps growing until it covers the whole list.',
      'If the list is already nearly sorted, each number only moves a little, which makes Insertion Sort very fast in that case.',
    ],
    takeaways: [
      'The left part of the list is always sorted.',
      'Very fast on small or nearly sorted lists.',
      'Used inside faster real-world sorts for small pieces of data.',
    ],
    example: { input: [12, 11, 13, 5] },
  },
  'merge-sort': {
    hook: 'Merge Sort splits the list in half again and again, then merges the sorted halves back together.',
    story: [
      'Merge Sort is built on one simple trick: merging two lists that are already sorted is easy. You just look at the front of each list, take the smaller one, and repeat.',
      'So Merge Sort keeps cutting the list in half until every piece has just one number — and a single number is already sorted.',
      'Then it works its way back up, merging pairs of small sorted pieces into bigger sorted pieces, until everything is merged into one fully sorted list.',
      'Because the list is halved each time, there are only about log n levels of merging, and each level touches every number once. That is why it is reliably fast.',
    ],
    takeaways: [
      'Divide and conquer: split, sort the halves, merge.',
      'Always O(n log n) — no bad cases.',
      'Needs extra memory to hold the merged pieces.',
    ],
    example: { input: [38, 27, 43, 3] },
  },
  'quick-sort': {
    hook: 'Quick Sort picks a pivot, puts smaller numbers on its left and bigger ones on its right, then repeats on each side.',
    story: [
      'Quick Sort chooses one number to be the pivot. It then walks through the list and arranges it so that everything smaller than the pivot ends up on the left, and everything bigger ends up on the right.',
      'At that point the pivot is sitting in exactly the right position for the final sorted list. It will never move again.',
      'Now we have two smaller problems: the left side and the right side. Quick Sort simply does the same thing to each of them — pick a pivot, split around it — until every piece is tiny.',
      'With good pivots it is one of the fastest sorts in practice. With unlucky pivots, like always picking the biggest number, it can slow down a lot.',
    ],
    takeaways: [
      'Each partition puts the pivot in its final place.',
      'Usually O(n log n) and very fast in practice.',
      'Bad pivot choices can make it O(n²).',
    ],
    example: { input: [10, 7, 8, 9, 1] },
  },
  'cocktail-sort': {
    hook: 'Cocktail Shaker Sort is Bubble Sort that sweeps forwards and then backwards, over and over.',
    story: [
      'Regular Bubble Sort only moves left to right. Big numbers race to the end quickly, but small numbers near the end crawl left just one step per pass.',
      'Cocktail Shaker Sort fixes that by alternating direction. The forward sweep carries the biggest number to the right end. The backward sweep then carries the smallest number to the left end.',
      'After each round, both ends of the list are settled, so the unsorted window shrinks from both sides — like shaking a cocktail back and forth until everything settles.',
      'It stops as soon as a sweep makes no swaps.',
    ],
    takeaways: [
      'Two directions per round: forward, then backward.',
      'Fixes Bubble Sort’s slow-moving small values.',
      'Still O(n²) on average — great for learning, not for big data.',
    ],
    example: { input: [5, 1, 4, 2, 8, 0] },
  },
  'comb-sort': {
    hook: 'Comb Sort compares numbers that are far apart first, then gradually closes the gap.',
    story: [
      'Bubble Sort only compares neighbours, so a small number stuck at the end has a long, slow trip home.',
      'Comb Sort starts by comparing numbers that are far apart — a big gap — and swaps them if they are out of order. That lets badly placed numbers jump a long way in one move.',
      'After each pass the gap shrinks, by dividing it by about 1.3. Eventually the gap becomes 1, and it finishes with ordinary neighbour swaps on a list that is already almost sorted.',
      'Think of combing tangled hair: a wide-tooth comb first, then finer and finer combs.',
    ],
    takeaways: [
      'Starts with a big gap and shrinks it each pass.',
      'Much faster than Bubble Sort in practice.',
      'Simple code, no extra memory.',
    ],
    example: { input: [8, 4, 1, 56, 3] },
  },
  'shell-sort': {
    hook: 'Shell Sort runs Insertion Sort on numbers spaced far apart, then on closer and closer ones.',
    story: [
      'Insertion Sort is great when the list is nearly sorted, but slow when numbers are far from where they belong.',
      'Shell Sort first picks a gap — say half the length of the list — and sorts the numbers that are that far apart, as if they were their own little lists. This moves far-away numbers close to where they should be very quickly.',
      'Then it halves the gap and does it again. Each round, the list becomes more and more ordered.',
      'Finally the gap is 1, which is just a normal Insertion Sort — but by now the list is almost sorted, so this last pass is fast.',
    ],
    takeaways: [
      'Insertion Sort, but on gap-spaced sub-lists first.',
      'The gap halves every round until it is 1.',
      'Speed depends on the gap sequence you choose.',
    ],
    example: { input: [23, 12, 1, 8, 34, 54] },
  },
  'heap-sort': {
    hook: 'Heap Sort arranges the list into a “heap” so the biggest number is always on top, then pulls it off one at a time.',
    story: [
      'A heap is a special tree where every parent is bigger than its children. The cool part is that we can store this tree right inside the array: the children of position k live at positions 2k + 1 and 2k + 2.',
      'First, Heap Sort rearranges the list into a max-heap. Now the biggest number is sitting at the very front.',
      'Then it swaps that biggest number to the end of the list, where it belongs, and shrinks the heap by one. The new top might be out of place, so it lets that number sink down until the heap is valid again.',
      'Repeat — biggest to the end, fix the heap — and the list sorts itself from the back to the front.',
    ],
    takeaways: [
      'Phase 1 builds the heap; phase 2 extracts the maximum repeatedly.',
      'Always O(n log n) and needs no extra memory.',
      'The same idea powers priority queues.',
    ],
    example: { input: [4, 10, 3, 5, 1] },
  },
  'linear-search': {
    hook: 'Linear Search checks every item, one by one, until it finds what you are looking for.',
    story: [
      'This is the most natural way to search. Start at the first item and ask: is this the one? If not, move to the next one.',
      'Keep going until you either find the target or reach the end of the list. If you reach the end, the target simply is not there.',
      'It works on any list, sorted or not, which makes it very flexible. The downside is that on a long list you might have to check every single item.',
    ],
    takeaways: [
      'Checks items in order from start to end.',
      'Works on unsorted data.',
      'O(n) — the time grows with the size of the list.',
    ],
    example: { input: [7, 3, 9, 4, 6], target: 4 },
  },
  'binary-search': {
    hook: 'Binary Search finds a value in a sorted list by repeatedly cutting the search area in half.',
    story: [
      'Imagine guessing a number between 1 and 100, where someone tells you “higher” or “lower”. The smart move is to guess 50 first — whatever they say, you have ruled out half the numbers.',
      'Binary Search does exactly that. It looks at the middle item. If that is the target, great. If the target is bigger, it throws away the left half. If smaller, it throws away the right half.',
      'Then it repeats on the half that is left. Each step halves the search area, so even a list of a million items needs only about twenty checks.',
      'The one rule: the list must be sorted, otherwise “higher” and “lower” mean nothing.',
    ],
    takeaways: [
      'Only works on sorted data.',
      'Each check removes half of what is left.',
      'O(log n) — incredibly fast on large lists.',
    ],
    example: { input: [2, 5, 8, 12, 16, 23, 38], target: 23 },
  },
  'jump-search': {
    hook: 'Jump Search skips ahead in fixed-size jumps, then searches the small block where the target must be.',
    story: [
      'Instead of checking every item, Jump Search leaps forward by a fixed step — usually the square root of the list length.',
      'At each landing spot it asks: is the number here still smaller than my target? If yes, jump again. As soon as it lands on a number that is not smaller, it knows the target must be in the block it just jumped over.',
      'Then it walks back to the start of that block and checks each item one by one.',
      'It is like flipping through a book a chapter at a time, then reading page by page once you have gone past the part you need.',
    ],
    takeaways: [
      'Needs a sorted list.',
      'Big jumps first, then a short step-by-step scan.',
      'O(√n) — between linear and binary search.',
    ],
    example: { input: [1, 3, 5, 8, 11, 14, 17, 21, 25], target: 17 },
  },
  'interpolation-search': {
    hook: 'Interpolation Search guesses where the target should be based on its value, instead of always looking in the middle.',
    story: [
      'If you are looking up “Williams” in a phone book, you do not open it in the middle — you open it near the end, because W is near the end of the alphabet.',
      'Interpolation Search does the same with numbers. It looks at the smallest and biggest values in the current range and estimates where the target would sit if the numbers were evenly spread out.',
      'It checks that estimated spot. If it is too small, it searches to the right; if too big, to the left — and makes a new estimate.',
      'When the numbers really are evenly spread, the guesses are so good that it finds the target almost immediately.',
    ],
    takeaways: [
      'Needs sorted, evenly spread data to shine.',
      'Uses the value to estimate the position.',
      'Very fast on uniform data, slow on skewed data.',
    ],
    example: { input: [10, 20, 30, 40, 50, 60, 70], target: 60 },
  },
  'exponential-search': {
    hook: 'Exponential Search doubles its step size to find a range quickly, then runs Binary Search inside it.',
    story: [
      'Exponential Search first checks positions 1, 2, 4, 8, 16 and so on — doubling each time — until it lands on a number bigger than the target.',
      'Now it knows the target sits between the last two positions it checked. That range is small, so it hands the job over to Binary Search to finish.',
      'This is especially handy when you do not know how long the list is, or when the target is likely to be near the beginning.',
    ],
    takeaways: [
      'Phase 1: double the bound until it passes the target.',
      'Phase 2: binary search inside that range.',
      'Great for very long or unbounded sorted lists.',
    ],
    example: { input: [2, 3, 4, 10, 40, 45, 51, 60], target: 45 },
  },
  'ternary-search': {
    hook: 'Ternary Search splits the search area into three parts and keeps only the part that can hold the target.',
    story: [
      'Binary Search cuts the range in half with one middle point. Ternary Search uses two points instead, splitting the range into three equal thirds.',
      'It checks both points. If one of them is the target, it is done. Otherwise it compares the target with them to decide which third it must be in, and throws the other two thirds away.',
      'It sounds faster, but it actually does more comparisons per step, so for normal lookups Binary Search usually wins. Ternary Search really shines when you are looking for the highest or lowest point of a curve.',
    ],
    takeaways: [
      'Two probe points split the range into thirds.',
      'Keeps one third, discards two.',
      'Best known for finding the peak of a unimodal function.',
    ],
    example: { input: [1, 4, 7, 9, 13, 18, 21, 26, 31], target: 21 },
  },
};
