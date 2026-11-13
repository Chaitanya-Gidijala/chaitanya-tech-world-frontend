import { AlertTriangle, ArrowUpRight, Check, HelpCircle } from 'lucide-react';
import { Badge, Disclosure, TagList } from '@/design-system';
import { PRIORITY_META } from '../data/certConstants';

function Block({ title, children }) {
  return (
    <section className="rm-block">
      <h4 className="ds-eyebrow rm-block__title">{title}</h4>
      {children}
    </section>
  );
}

function BulletList({ items, variant = 'dash' }) {
  return (
    <ul className={`rm-list rm-list--${variant}`}>
      {items.map((item) => (
        <li key={item}>
          {variant === 'check' && <Check size={14} aria-hidden="true" />}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ObjectiveList({ objectives }) {
  return (
    <div className="rm-objectives">
      {objectives.map((obj, i) => (
        <Disclosure
          key={obj.id ?? obj.title}
          headingLevel={5}
          className="rm-objective"
          summary={
            <span className="rm-objective__summary">
              <span className="rm-objective__letter">{String.fromCharCode(65 + i)}</span>
              <span className="rm-objective__title">{obj.title}</span>
              <span className="rm-objective__count">{obj.resources.length} links</span>
            </span>
          }
        >
          <ul className="rm-resources">
            {obj.resources.map((r) => (
              <li key={`${r.label}-${r.url}`}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="rm-resource">
                  <span>{r.label}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Disclosure>
      ))}
    </div>
  );
}

/** DomainPanel — expanded content for one exam domain. */
export default function DomainPanel({ domain }) {
  const priority = PRIORITY_META[domain.priority];

  return (
    <div className="rm-domain">
      {domain.description && (
        <div className="rm-domain__intro">
          <p>{domain.description}</p>
          {priority && <Badge tone={priority.tone}>{priority.label} priority</Badge>}
        </div>
      )}

      {domain.topicsToLearn && (
        <Block title="Topics to learn">
          <TagList items={domain.topicsToLearn} />
        </Block>
      )}

      <div className="rm-block-grid">
        {domain.importantConcepts && (
          <Block title="Important concepts">
            <BulletList items={domain.importantConcepts} />
          </Block>
        )}
        {domain.practicalSkills && (
          <Block title="Skills to practise">
            <BulletList items={domain.practicalSkills} variant="check" />
          </Block>
        )}
        {domain.learningOutcomes && (
          <Block title="Learning outcomes">
            <BulletList items={domain.learningOutcomes} />
          </Block>
        )}
        {domain.revisionPoints && (
          <Block title="Quick revision">
            <BulletList items={domain.revisionPoints} />
          </Block>
        )}
      </div>

      {domain.commonMistakes && (
        <Block title="Common exam traps">
          <ul className="rm-flag-list">
            {domain.commonMistakes.map((m) => (
              <li key={m} className="rm-flag rm-flag--warning">
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {domain.questionTypes && (
        <Block title="Example question types">
          <p className="rm-block__note">These describe question patterns, not actual exam questions.</p>
          <ul className="rm-flag-list">
            {domain.questionTypes.map((q) => (
              <li key={q} className="rm-flag">
                <HelpCircle size={15} aria-hidden="true" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {domain.objectives?.length > 0 && (
        <Block title="Objectives & resources">
          <ObjectiveList objectives={domain.objectives} />
        </Block>
      )}
    </div>
  );
}
