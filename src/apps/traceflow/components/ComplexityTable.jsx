import { Link } from 'react-router-dom';
import { Badge } from '@/design-system';
import { DIFFICULTY_TONE, complexityRank, detailPath } from '../utils/algoMeta.js';

/** Colour class for a complexity cell — greener is faster. */
function tone(value) {
  const r = complexityRank(value);
  if (r <= 3) return 'is-fast';
  if (r <= 6) return 'is-ok';
  return 'is-slow';
}

/** ComplexityTable — best / average / worst / space cheat sheet for a list of algorithms. */
export default function ComplexityTable({ algorithms }) {
  return (
    <div className="tfp-table-wrap">
      <table className="tfp-table">
        <thead>
          <tr>
            <th scope="col">Algorithm</th>
            <th scope="col">Best</th>
            <th scope="col">Average</th>
            <th scope="col">Worst</th>
            <th scope="col">Space</th>
            <th scope="col">Stable</th>
            <th scope="col">Level</th>
          </tr>
        </thead>
        <tbody>
          {algorithms.map((a) => (
            <tr key={a.slug}>
              <th scope="row">
                <Link to={detailPath(a.slug)}>{a.name}</Link>
              </th>
              {['best', 'average', 'worst'].map((k) => (
                <td key={k}>
                  <span className={`tfp-cx ${tone(a.complexity[k])}`}>{a.complexity[k]}</span>
                </td>
              ))}
              <td>
                <span className={`tfp-cx ${tone(a.complexity.space)}`}>{a.complexity.space}</span>
              </td>
              <td>{a.stable === true ? 'Yes' : a.stable === false ? 'No' : '—'}</td>
              <td>
                <Badge tone={DIFFICULTY_TONE[a.difficulty]}>{a.difficulty}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
