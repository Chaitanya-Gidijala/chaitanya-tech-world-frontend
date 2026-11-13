import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImageOff, RotateCw, Search } from 'lucide-react';
import {
  Button,
  Callout,
  Container,
  EmptyState,
  Section,
  SelectField,
  TextField,
  useDocumentMeta,
} from '@/design-system';
import PageHero from '@/components/site/PageHero';
import PromptCard, { PromptCardSkeleton } from '../components/PromptCard';
import Pagination from '../components/Pagination';
import { promptErrorMessage, usePrompts } from '../hooks/usePrompts';
import '../prompts.css';

const PAGE_SIZE = 20;
const ALL = 'all';

const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

/** Filter state is kept in the URL so it survives navigation to a prompt and back. */
function useGalleryParams() {
  const [params, setParams] = useSearchParams();
  const state = {
    q: params.get('q') ?? '',
    model: params.get('model') ?? ALL,
    category: params.get('category') ?? ALL,
    page: Math.max(1, Number(params.get('page')) || 1),
  };

  const update = (patch) => {
    const next = { ...state, page: 1, ...patch };
    const out = new URLSearchParams();
    if (next.q) out.set('q', next.q);
    if (next.model !== ALL) out.set('model', next.model);
    if (next.category !== ALL) out.set('category', next.category);
    if (next.page > 1) out.set('page', String(next.page));
    setParams(out, { replace: true });
  };

  return [state, update];
}

export default function PromptsGalleryPage() {
  const { data: prompts = [], isPending, isError, error, refetch, isFetching } = usePrompts();
  const [{ q, model, category, page }, update] = useGalleryParams();
  const galleryRef = useRef(null);

  useDocumentMeta({
    title: 'AI Image Prompt Library | Chaitanya Tech World',
    description:
      'Hand-picked image-generation prompts for ChatGPT, Gemini, Midjourney and more. Copy, paste and create.',
    keywords: 'AI prompts, ChatGPT prompts, Midjourney prompts, Gemini prompts, image prompts, prompt engineering',
  });

  const models = useMemo(() => uniqueSorted(prompts.map((p) => p.aiModel)), [prompts]);
  const categories = useMemo(() => uniqueSorted(prompts.map((p) => p.category)), [prompts]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return prompts.filter(
      (p) =>
        (model === ALL || p.aiModel?.toLowerCase() === model.toLowerCase()) &&
        (category === ALL || p.category?.toLowerCase() === category.toLowerCase()) &&
        (!query || `${p.title} ${p.description ?? ''}`.toLowerCase().includes(query)),
    );
  }, [prompts, q, model, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = q || model !== ALL || category !== ALL;

  const goToPage = (p) => {
    update({ page: p });
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHero
        eyebrow="Prompt library"
        title="Image prompts, ready to use"
        description="Prompts for portraits, product shots, editorial scenes and visual storytelling. Open one, copy it, and make it your own."
        stats={[
          { label: 'Prompts', value: isPending || isError ? '—' : prompts.length },
          { label: 'AI models', value: isPending || isError ? '—' : models.length },
          { label: 'Categories', value: isPending || isError ? '—' : categories.length },
        ]}
      />

      <Section compact>
        <Container>
          <div className="pr-toolbar" ref={galleryRef}>
            <TextField
              className="pr-toolbar__search"
              type="search"
              label="Search"
              placeholder="Search by title or description"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
            />
            <SelectField
              label="Model"
              value={model}
              onChange={(e) => update({ model: e.target.value })}
              options={[{ value: ALL, label: 'All models' }, ...models.map((m) => ({ value: m, label: m }))]}
            />
            <SelectField
              label="Category"
              value={category}
              onChange={(e) => update({ category: e.target.value })}
              options={[{ value: ALL, label: 'All categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
            />
          </div>

          <div className="pr-results-bar">
            <p className="ds-meta" aria-live="polite">
              {isPending ? 'Loading prompts…' : `${filtered.length} ${filtered.length === 1 ? 'prompt' : 'prompts'}`}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => update({ q: '', model: ALL, category: ALL })}>
                Clear filters
              </Button>
            )}
          </div>

          {isError && (
            <Callout
              tone="danger"
              title="Couldn’t load the prompt library"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetch()}
                  loading={isFetching}
                  iconStart={<RotateCw size={14} />}
                >
                  Retry
                </Button>
              }
            >
              {promptErrorMessage(error)}
            </Callout>
          )}

          {isPending ? (
            <div className="pr-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <PromptCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <>
              <ul className="pr-grid">
                {visible.map((p) => (
                  <li key={p.id}>
                    <PromptCard prompt={p} />
                  </li>
                ))}
              </ul>
              <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
            </>
          ) : (
            !isError && (
              <EmptyState
                icon={hasFilters ? <Search size={20} /> : <ImageOff size={20} />}
                title="No prompts found"
                description={
                  hasFilters ? 'Try a different search or filter.' : 'The library is empty right now — check back soon.'
                }
                action={
                  hasFilters && (
                    <Button variant="secondary" onClick={() => update({ q: '', model: ALL, category: ALL })}>
                      Show all prompts
                    </Button>
                  )
                }
              />
            )
          )}
        </Container>
      </Section>
    </>
  );
}
