const SORT_KEYS = [
  ['comparing', 'Comparing'],
  ['swapping', 'Swapping / moving'],
  ['selected', 'Selected'],
  ['sorted', 'Sorted'],
];

const SEARCH_KEYS = [
  ['comparing', 'Probing'],
  ['pointer', 'Pointer'],
  ['found', 'Found'],
  ['discarded', 'Ruled out'],
];

/** Legend — what each bar colour means for the current algorithm type. */
export default function Legend({ category }) {
  const keys = category === 'searching' ? SEARCH_KEYS : SORT_KEYS;
  return (
    <ul className="tfv-legend" aria-label="Colour legend">
      {keys.map(([state, label]) => (
        <li key={state}>
          <span className={`tfv-legend__swatch tfv-legend__swatch--${state}`} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
