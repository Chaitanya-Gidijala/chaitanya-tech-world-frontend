import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getAlgorithm } from '../algorithms/index.js';
import ArrayRenderer from '../visualization/renderers/ArrayRenderer.jsx';
import { visualizerPath } from '../utils/algoMeta.js';

const STEP_MS = 420;
const END_HOLD_STEPS = 6;

function buildTrace(algo) {
  return algo.hasTarget ? algo.traceGenerator(algo.defaultInput, algo.defaultTarget) : algo.traceGenerator(algo.defaultInput);
}

/** Stable keys so bars keep identity (and animate) when values move. */
function toItems(values) {
  const counts = {};
  return values.map((val) => {
    counts[val] = (counts[val] || 0) + 1;
    return { id: `v-${val}-${counts[val]}`, val };
  });
}

/**
 * LivePreview — auto-playing, looping visualisation of real algorithm traces,
 * with tabs to switch algorithm. Used as the Traceflow landing hero.
 */
export default function LivePreview({ slugs }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(slugs[0]);
  const [step, setStep] = useState(0);

  const algo = getAlgorithm(active);
  const trace = useMemo(() => buildTrace(algo), [algo]);

  useEffect(() => {
    if (reduce) return undefined;
    const timer = setInterval(() => {
      setStep((s) => (s + 1 >= trace.length + END_HOLD_STEPS ? 0 : s + 1));
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [trace, reduce]);

  const event = trace[Math.min(step, trace.length - 1)];
  const items = toItems(event.arrayState);
  const codeLine = event.codeLine != null ? algo.codeLines[event.codeLine]?.trim() : null;
  const progress = Math.min(1, (step + 1) / trace.length);

  const select = (slug) => {
    setActive(slug);
    setStep(0);
  };

  return (
    <div className="tfp-live ds-spotlight">
      <div className="tfp-live__tabs" role="tablist" aria-label="Preview algorithm">
        {slugs.map((slug) => (
          <button
            key={slug}
            type="button"
            role="tab"
            aria-selected={slug === active}
            className={clsx('tfp-live__tab', slug === active && 'is-active')}
            onClick={() => select(slug)}
          >
            {getAlgorithm(slug).name}
          </button>
        ))}
      </div>

      <div className="tfp-live__stage" aria-hidden="true">
        <ArrayRenderer array={items} currentEvent={event} maxValue={Math.max(...algo.defaultInput, 10)} />
      </div>

      <div className="tfp-live__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="tfp-live__footer">
        <div className="tfp-live__narration" aria-live="off">
          <p className="tfp-live__desc">{event.description}</p>
          {codeLine && <code className="tfp-live__code">{codeLine}</code>}
        </div>
        <Link to={visualizerPath(active)} className="tfp-live__open">
          Open <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
