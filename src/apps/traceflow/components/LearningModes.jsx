import { Code2, Gauge, History, ListTree, MessageSquareText, Scale } from 'lucide-react';
import { Reveal } from '@/design-system';
import { LEARNING_MODES } from '../utils/algoMeta.js';

const ICONS = { message: MessageSquareText, code: Code2, list: ListTree, history: History, gauge: Gauge, scale: Scale };

/** LearningModes — grid describing the six ways Traceflow explains an algorithm. */
export default function LearningModes() {
  return (
    <ul className="tfp-modes">
      {LEARNING_MODES.map((m, i) => {
        const Icon = ICONS[m.icon];
        return (
          <Reveal as="li" key={m.title} delay={(i % 3) * 0.08} className="tfp-mode ds-spotlight">
            <span className="tfp-mode__icon">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3>{m.title}</h3>
            <p>{m.text}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
