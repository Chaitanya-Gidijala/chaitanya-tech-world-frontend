import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Badge, Button } from '@/design-system';
import { DIFFICULTY_TONE, detailPath, visualizerPath } from '../utils/algoMeta.js';
import MiniBars from './MiniBars.jsx';

/**
 * AlgoCard — catalogue/landing card. The whole card opens the detail page
 * (stretched title link); the Visualise button opens the visualiser directly.
 */
export default function AlgoCard({ algo }) {
  const c = algo.complexity ?? {};
  return (
    <article className="tfp-card ds-card ds-card--interactive">
      <div className="tfp-card__top">
        <Badge tone={DIFFICULTY_TONE[algo.difficulty]}>{algo.difficulty}</Badge>
        <span className="tfp-card__cat">{algo.category}</span>
      </div>

      <MiniBars values={algo.defaultInput} className="tfp-card__bars" />

      <h3 className="tfp-card__title">
        <Link to={detailPath(algo.slug)} className="tfp-card__link">
          {algo.name}
        </Link>
      </h3>
      <p className="tfp-card__intuition">{algo.intuition}</p>

      <dl className="tfp-card__stats">
        <div>
          <dt>Average</dt>
          <dd>{c.average ?? algo.timeComplexity}</dd>
        </div>
        <div>
          <dt>Worst</dt>
          <dd>{c.worst ?? algo.timeComplexity}</dd>
        </div>
        <div>
          <dt>Space</dt>
          <dd>{c.space ?? algo.spaceComplexity}</dd>
        </div>
      </dl>

      <div className="tfp-card__actions">
        <Button to={visualizerPath(algo.slug)} size="sm" iconStart={<Play size={13} />} className="tfp-card__cta">
          Visualise
        </Button>
        <span className="tfp-card__learn">Learn more →</span>
      </div>
    </article>
  );
}
