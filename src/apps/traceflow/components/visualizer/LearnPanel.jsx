import { Check, Globe2, HelpCircle, X } from 'lucide-react';

function Block({ title, children }) {
  return (
    <section className="tfv-learn__block">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

/** LearnPanel — the reference material for an algorithm (also used on the detail page). */
export default function LearnPanel({ algo }) {
  const c = algo.complexity ?? {};
  return (
    <div className="tfv-learn">
      <Block title="Overview">
        <p>{algo.summary}</p>
      </Block>

      <Block title="Complexity">
        <dl className="tfv-cx">
          {[
            ['Best', c.best],
            ['Average', c.average],
            ['Worst', c.worst],
            ['Space', c.space ?? algo.spaceComplexity],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="tfv-flags">
          {algo.stable != null && <span>{algo.stable ? 'Stable' : 'Not stable'}</span>}
          {algo.inPlace && <span>In-place</span>}
          {algo.requiresSorted && <span>Needs sorted input</span>}
        </div>
      </Block>

      {algo.steps?.length > 0 && (
        <Block title="How it works">
          <ol className="tfv-steps">
            {algo.steps.map((s, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Block>
      )}

      {(algo.pros || algo.cons) && (
        <Block title="Trade-offs">
          <ul className="tfv-pc">
            {algo.pros?.map((p) => (
              <li key={p} className="is-pro">
                <Check size={14} aria-hidden="true" /> {p}
              </li>
            ))}
            {algo.cons?.map((p) => (
              <li key={p} className="is-con">
                <X size={14} aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title="When to use it">
        <p>{algo.whenToUse}</p>
      </Block>

      {algo.realWorld?.length > 0 && (
        <Block title="Where you’ll see it">
          <ul className="tfv-list">
            {algo.realWorld.map((r) => (
              <li key={r}>
                <Globe2 size={14} aria-hidden="true" /> {r}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {algo.interviewQuestions?.length > 0 && (
        <Block title="Interview questions">
          <ul className="tfv-list">
            {algo.interviewQuestions.map((q) => (
              <li key={q}>
                <HelpCircle size={14} aria-hidden="true" /> {q}
              </li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  );
}
