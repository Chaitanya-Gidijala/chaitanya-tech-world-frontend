/**
 * Input presets for the visualiser. Each returns { array, target? }.
 * Searching algorithms that need sorted input always receive sorted arrays.
 */

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomArray = (n, max = 99) => Array.from({ length: n }, () => randInt(1, max));
const sortAsc = (a) => [...a].sort((x, y) => x - y);
const uniqueSorted = (n) => {
  const set = new Set();
  while (set.size < n) set.add(randInt(1, 99));
  return sortAsc([...set]);
};

export const SORT_PRESETS = [
  { id: 'random', label: 'Random', build: (n) => ({ array: randomArray(n) }) },
  { id: 'sorted', label: 'Already sorted', build: (n) => ({ array: sortAsc(randomArray(n)) }) },
  { id: 'reversed', label: 'Reversed', build: (n) => ({ array: sortAsc(randomArray(n)).reverse() }) },
  {
    id: 'nearly',
    label: 'Nearly sorted',
    build: (n) => {
      const a = sortAsc(randomArray(n));
      for (let k = 0; k < Math.max(1, Math.floor(n / 5)); k++) {
        const i = randInt(0, n - 2);
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
      }
      return { array: a };
    },
  },
  { id: 'few-unique', label: 'Few unique values', build: (n) => ({ array: Array.from({ length: n }, () => randInt(1, 4) * 20) }) },
];

export const SEARCH_PRESETS = [
  {
    id: 'present',
    label: 'Target present',
    build: (n, sorted) => {
      const array = sorted ? uniqueSorted(n) : randomArray(n);
      return { array, target: array[randInt(0, n - 1)] };
    },
  },
  {
    id: 'missing',
    label: 'Target missing',
    build: (n, sorted) => {
      const array = sorted ? uniqueSorted(n) : randomArray(n);
      let target = randInt(1, 99);
      while (array.includes(target)) target = randInt(1, 99);
      return { array, target };
    },
  },
  {
    id: 'first',
    label: 'Target at the start',
    build: (n, sorted) => {
      const array = sorted ? uniqueSorted(n) : randomArray(n);
      return { array, target: array[0] };
    },
  },
  {
    id: 'last',
    label: 'Target at the end',
    build: (n, sorted) => {
      const array = sorted ? uniqueSorted(n) : randomArray(n);
      return { array, target: array[n - 1] };
    },
  },
];

export function presetsFor(algo) {
  return algo.hasTarget ? SEARCH_PRESETS : SORT_PRESETS;
}
