import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  Badge,
  Button,
  Callout,
  Card,
  Container,
  Disclosure,
  RichText,
  Section,
  SectionHeader,
  useDocumentMeta,
} from '@/design-system';
import PageHero from '@/components/site/PageHero';
import ROUTES from '@/constants/routes';
import OutlineLayout from './components/OutlineLayout';
import ExpandAllButton from './components/ExpandAllButton';
import DomainPanel from './components/DomainPanel';
import { useExpandableSet } from './hooks/useExpandableSet';
import { PRIORITY_META } from './data/certConstants';
import { claudeFoundationsData } from './data/claudeFoundationsData';
import { claudeDeveloperData } from './data/claudeDeveloperData';
import './roadmap.css';

const CERT_REGISTRY = {
  [claudeFoundationsData.slug]: claudeFoundationsData,
  [claudeDeveloperData.slug]: claudeDeveloperData,
};

const domainAnchor = (domain) => `domain-${domain.number}`;

function DomainSummary({ domain, maxWeight }) {
  const resources = domain.objectives.reduce((a, o) => a + o.resources.length, 0);
  return (
    <span className="rm-item-summary">
      <span className="rm-item-summary__label">Domain {domain.number}</span>
      <span className="rm-item-summary__title">{domain.title}</span>
      <span className="rm-item-summary__sub">
        {domain.objectives.length > 0
          ? `${domain.objectives.length} objectives · ${resources} resources`
          : `${domain.topicsToLearn?.length ?? 0} topics to learn`}
      </span>
      <span className="rm-item-summary__meta rm-weight" aria-label={`${domain.weight}% of exam`}>
        <span className="rm-weight__bar" aria-hidden="true">
          <span style={{ width: `${(domain.weight / maxWeight) * 100}%` }} />
        </span>
        <span className="ds-meta">{domain.weight}%</span>
      </span>
    </span>
  );
}

function WeightBreakdown({ domains }) {
  return (
    <Card padding="md" className="rm-breakdown">
      <p className="ds-eyebrow">Exam weighting</p>
      <ul className="rm-breakdown__list">
        {domains.map((d) => (
          <li key={d.id} className="rm-breakdown__row">
            <span className="rm-breakdown__name">{d.title}</span>
            <span className="rm-breakdown__bar" aria-hidden="true">
              <span style={{ width: `${(d.weight / domains[0].weight) * 100}%` }} />
            </span>
            <span className="rm-breakdown__pct">{d.weight}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function StudyStrategy({ data, domainsByWeight }) {
  return (
    <Section bordered compact>
      <Container>
        <SectionHeader eyebrow="Strategy" title="How to study for this exam" />
        <div className="rm-two-col">
          {data.howToUse && (
            <Card padding="lg">
              <h3 className="rm-card-heading">How to use this guide</h3>
              <ol className="rm-numbered">
                {data.howToUse.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}.</strong> {step.text}
                  </li>
                ))}
              </ol>
            </Card>
          )}
          <Card padding="lg">
            <h3 className="rm-card-heading">Domain priority</h3>
            <div className="rm-table-wrap">
              <table className="rm-table">
                <thead>
                  <tr>
                    <th scope="col">Priority</th>
                    <th scope="col">Domain</th>
                    <th scope="col" className="is-num">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domainsByWeight.map((d) => {
                    const p = PRIORITY_META[d.priority];
                    return (
                      <tr key={d.id}>
                        <td>{p && <Badge tone={p.tone}>{p.label}</Badge>}</td>
                        <td>{d.title}</td>
                        <td className="is-num">{d.weight}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

function FinalPrep({ data }) {
  if (!data.revisionPlan && !data.examChecklist) return null;
  return (
    <div className="rm-two-col rm-final">
      {data.revisionPlan && (
        <Card padding="lg">
          <h3 className="rm-card-heading">Two-day final revision</h3>
          <div className="rm-days">
            {data.revisionPlan.map((day) => (
              <div key={day.title}>
                <p className="ds-eyebrow">{day.title}</p>
                <ul className="rm-list rm-list--dash">
                  {day.items.map((item) => (
                    <li key={item}>
                      <span>
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
      {data.examChecklist && (
        <Card padding="lg">
          <h3 className="rm-card-heading">Final exam checklist</h3>
          <ul className="rm-checklist">
            {data.examChecklist.map((item) => (
              <li key={item}>
                <label>
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function CertStudyGuide({ data }) {
  const domainsByWeight = useMemo(() => [...data.domains].sort((a, b) => b.weight - a.weight), [data]);
  const anchors = useMemo(() => data.domains.map(domainAnchor), [data]);
  const maxWeight = domainsByWeight[0]?.weight ?? 100;
  const { isOpen, setItem, allOpen, toggleAll } = useExpandableSet(anchors, [anchors[0]]);

  const totalObjectives = data.domains.reduce((a, d) => a + d.objectives.length, 0);
  const totalResources = data.domains.reduce(
    (a, d) => a + d.objectives.reduce((b, o) => b + o.resources.length, 0),
    0,
  );

  useDocumentMeta({
    title: `${data.shortName} Study Guide | Chaitanya Tech World`,
    description: data.description,
  });

  const registerButton = data.registerUrl && (
    <Button
      href={data.registerUrl}
      target="_blank"
      rel="noopener noreferrer"
      iconEnd={<ArrowUpRight size={15} />}
    >
      Register for the exam
    </Button>
  );

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: 'Roadmaps', to: ROUTES.ROADMAPS },
          { label: 'Claude certifications', to: ROUTES.CLAUDE_CERTS },
          { label: data.shortName },
        ]}
        meta={
          <>
            <Badge tone="accent">{data.provider} official</Badge>
            <Badge>{data.level} level</Badge>
            <Badge>
              {data.examDuration} · {data.questionCount} questions
            </Badge>
            {data.passingNote && <Badge>{data.passingNote}</Badge>}
          </>
        }
        eyebrow={`Exam ${data.examCode}`}
        title={data.fullName}
        description={data.description}
        actions={registerButton}
        aside={<WeightBreakdown domains={domainsByWeight} />}
        stats={[
          { label: 'Domains', value: data.domains.length },
          totalObjectives > 0 && { label: 'Objectives', value: totalObjectives },
          totalResources > 0 && { label: 'Resources', value: totalResources },
          { label: 'Study time', value: `~${data.estimatedHours}h` },
          { label: 'Pass score', value: `${data.passScore}%` },
        ].filter(Boolean)}
      />

      <StudyStrategy data={data} domainsByWeight={domainsByWeight} />

      <Section bordered>
        <Container>
          <SectionHeader
            eyebrow="Domains"
            title="Exam domains"
            description={
              totalObjectives > 0
                ? `${data.domains.length} domains · ${totalObjectives} learning objectives`
                : `${data.domains.length} domains, ordered as in the official blueprint`
            }
          />
          <OutlineLayout
            title="Domains"
            items={data.domains.map((d) => ({ id: domainAnchor(d), label: d.title, meta: `${d.weight}%` }))}
            onSelect={(id) => setItem(id, true)}
            toolbar={<ExpandAllButton allOpen={allOpen} onClick={toggleAll} />}
          >
            <div className="rm-stack">
              {data.domains.map((domain) => {
                const id = domainAnchor(domain);
                return (
                  <Disclosure
                    key={id}
                    id={id}
                    headingLevel={3}
                    className="rm-item"
                    open={isOpen(id)}
                    onOpenChange={(v) => setItem(id, v)}
                    summary={<DomainSummary domain={domain} maxWeight={maxWeight} />}
                  >
                    <DomainPanel domain={domain} />
                  </Disclosure>
                );
              })}
            </div>

            <FinalPrep data={data} />

            {registerButton && (
              <Callout tone="accent" className="rm-cta" title="Ready to take the exam?" action={registerButton}>
                Once you’ve worked through every domain, register for {data.shortName} on the official Anthropic
                portal.
              </Callout>
            )}
          </OutlineLayout>
        </Container>
      </Section>
    </>
  );
}

export default function ClaudeCertPage() {
  const { certName } = useParams();
  const data = CERT_REGISTRY[certName];

  if (!data) return <Navigate to={ROUTES.CLAUDE_CERTS} replace />;

  return <CertStudyGuide key={certName} data={data} />;
}
