import { Check } from 'lucide-react';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion } from 'framer-motion';
import { CERT_LEVELS, LIVE_ROADMAPS } from '../data/homeContent';
import SortingBars from './SortingBars';

/**
 * Animated product mock-ups used by the home page showcase.
 * Each one animates on mount, so swapping them replays the animation.
 */

const EASE = [0.22, 1, 0.36, 1];

export function RoadmapPreview() {
  const phases = [
    { name: 'Java Foundations', fill: 100 },
    { name: 'OOP & Collections', fill: 100 },
    { name: 'Spring Boot', fill: 64 },
    { name: 'Microservices', fill: 22 },
    { name: 'Cloud deployment', fill: 0 },
  ];
  return (
    <div className="hp-preview hp-preview--roadmap">
      <div className="hp-preview__head">
        <span className="hp-preview__title">{LIVE_ROADMAPS[0]?.title ?? 'Java Backend Developer'}</span>
        <span className="hp-preview__badge">10 phases</span>
      </div>
      <ol className="hp-phases">
        {phases.map((p, i) => (
          <motion.li
            key={p.name}
            className={p.fill === 100 ? 'is-done' : p.fill > 0 ? 'is-active' : undefined}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
          >
            <span className="hp-phases__dot">{p.fill === 100 ? <Check size={12} /> : i + 1}</span>
            <span className="hp-phases__name">{p.name}</span>
            <span className="hp-phases__track">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${p.fill}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: EASE }}
              />
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function TraceflowPreview() {
  return (
    <div className="hp-preview hp-preview--traceflow">
      <div className="hp-preview__head">
        <span className="hp-preview__title">Bubble sort</span>
        <span className="hp-preview__badge hp-preview__badge--live">Running</span>
      </div>
      <SortingBars interval={380} />
      <div className="hp-code" aria-hidden="true">
        <span>
          <b>for</b> (int j = 0; j &lt; n - i - 1; j++)
        </span>
        <span className="is-hl">
          &nbsp;&nbsp;<b>if</b> (arr[j] &gt; arr[j + 1]) swap(arr, j, j + 1);
        </span>
      </div>
    </div>
  );
}

export function CertPreview() {
  const weights = [21, 16, 15, 14, 12];
  return (
    <div className="hp-preview hp-preview--certs">
      <ol className="hp-levels">
        {CERT_LEVELS.map((c, i) => (
          <motion.li
            key={c.code}
            className={c.live ? 'is-live' : undefined}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.08, duration: 0.45, ease: EASE }}
          >
            <span className="hp-levels__num">{i + 1}</span>
            <span>{c.level}</span>
          </motion.li>
        ))}
      </ol>
      <p className="hp-preview__label">Exam weighting · CCAO-F</p>
      <ul className="hp-weights">
        {weights.map((w, i) => (
          <li key={w + i}>
            <span className="hp-weights__track">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${(w / weights[0]) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.9, ease: EASE }}
              />
            </span>
            <span className="hp-weights__pct">{w}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PromptPreview() {
  return (
    <div className="hp-preview hp-preview--prompts">
      <div className="hp-mosaic" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.span
            key={i}
            style={{ '--i': i }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: EASE }}
          />
        ))}
      </div>
      <div className="hp-prompt-line">
        <span>“Cinematic portrait, soft rim light, 85mm…”</span>
        <span className="hp-prompt-line__copy">Copy</span>
      </div>
    </div>
  );
}
