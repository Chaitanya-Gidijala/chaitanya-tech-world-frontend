import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Copy, FileQuestion } from 'lucide-react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  EmptyState,
  Section,
  SectionHeader,
  Skeleton,
  useDocumentMeta,
} from '@/design-system';
import ROUTES from '@/constants/routes';
import PromptCard, { PromptMedia } from '../components/PromptCard';
import { usePrompt, usePrompts } from '../hooks/usePrompts';
import { getModelInfo } from '../data/aiModels';
import '../prompts.css';

const RELATED_COUNT = 4;

function useCopy(text) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard write failed:', err);
    }
  };
  return [copied, copy];
}

function PromptBox({ text }) {
  const [copied, copy] = useCopy(text);
  return (
    <figure className="pr-promptbox">
      <figcaption className="pr-promptbox__bar">
        <span className="ds-eyebrow">Prompt</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          iconStart={copied ? <Check size={14} /> : <Copy size={14} />}
          aria-live="polite"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </figcaption>
      <pre className="pr-promptbox__text">{text}</pre>
    </figure>
  );
}

function HowToSteps({ steps }) {
  return (
    <ol className="pr-steps">
      {steps.map((s, i) => (
        <li key={i}>
          {s.text}
          {s.link && (
            <>
              {' '}
              <a href={s.link.href} target="_blank" rel="noopener noreferrer">
                {s.link.label}
              </a>
            </>
          )}
          {s.suffix && ` ${s.suffix}`}
        </li>
      ))}
    </ol>
  );
}

function DetailSkeleton() {
  return (
    <div className="pr-detail" aria-busy="true">
      <Skeleton className="pr-detail__media" height="auto" />
      <div className="pr-detail__info">
        <Skeleton width="30%" height={20} />
        <Skeleton width="85%" height={36} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="100%" height={160} />
      </div>
    </div>
  );
}

export default function PromptDetailPage() {
  const { id } = useParams();
  const { data: prompt, isPending, isError } = usePrompt(id);
  const { data: library = [] } = usePrompts();
  const model = getModelInfo(prompt?.aiModel);
  const [copied, copy] = useCopy(prompt?.promptText ?? '');

  const related = useMemo(() => {
    const others = library.filter((p) => String(p.id) !== String(id));
    const sameCategory = others.filter((p) => prompt?.category && p.category === prompt.category);
    const rest = others.filter((p) => !sameCategory.includes(p));
    return [...sameCategory, ...rest].slice(0, RELATED_COUNT);
  }, [library, id, prompt]);

  useDocumentMeta({
    title: prompt ? `${prompt.title} | AI Prompt Library` : 'AI Prompt Library',
    description: prompt?.description || (prompt ? `A ready-to-use ${model.label} prompt.` : undefined),
    keywords: prompt ? `${prompt.title}, ${model.label} prompts, AI prompts, prompt engineering` : undefined,
  });

  return (
    <>
      <Section compact className="pr-detail-section">
        <Container>
          <Breadcrumbs
            className="pr-detail__crumbs"
            items={[{ label: 'Prompts', to: ROUTES.PROMPTS }, { label: prompt?.title ?? 'Prompt' }]}
          />

          {isPending ? (
            <DetailSkeleton />
          ) : isError || !prompt ? (
            <EmptyState
              icon={<FileQuestion size={20} />}
              title="Prompt not found"
              description="It may have been removed, or the link is incorrect."
              action={
                <Button to={ROUTES.PROMPTS} variant="secondary">
                  Back to the library
                </Button>
              }
            />
          ) : (
            <article className="pr-detail">
              <div className="pr-detail__media">
                <PromptMedia prompt={prompt} className="pr-detail__img" controls eager />
              </div>

              <div className="pr-detail__info">
                <div className="pr-detail__badges">
                  {prompt.aiModel && <Badge tone="accent">{model.label}</Badge>}
                  {prompt.category && <Badge>{prompt.category}</Badge>}
                </div>
                <h1 className="pr-detail__title">{prompt.title}</h1>
                {prompt.description && <p className="pr-detail__desc">{prompt.description}</p>}

                <PromptBox text={prompt.promptText} />

                <div className="pr-detail__actions">
                  <Button onClick={copy} iconStart={copied ? <Check size={15} /> : <Copy size={15} />}>
                    {copied ? 'Copied to clipboard' : 'Copy prompt'}
                  </Button>
                  {model.openUrl && (
                    <Button
                      href={model.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      iconEnd={<ArrowUpRight size={15} />}
                    >
                      Open {model.label}
                    </Button>
                  )}
                </div>
                <p className="pr-detail__tip">Tip: swap in your own subject, style or setting for unique results.</p>

                <section className="pr-detail__howto">
                  <h2 className="ds-eyebrow">How to use this prompt</h2>
                  <HowToSteps steps={model.steps} />
                </section>
              </div>
            </article>
          )}
        </Container>
      </Section>

      {related.length > 0 && (
        <Section bordered compact>
          <Container>
            <SectionHeader
              eyebrow="Keep exploring"
              title="More prompts"
              actions={
                <Button to={ROUTES.PROMPTS} variant="secondary" size="sm" iconEnd={<ArrowRight size={14} />}>
                  View all
                </Button>
              }
            />
            <ul className="pr-grid">
              {related.map((p) => (
                <li key={p.id}>
                  <PromptCard prompt={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
