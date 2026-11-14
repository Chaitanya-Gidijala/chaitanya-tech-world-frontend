import { lazy, Suspense } from 'react';
import { useDocumentMeta } from '@/design-system';
import { PageHeader, Panel, SkeletonRows } from '../components/ui';

// The existing prompt manager (create / edit / delete, image upload) — reused as-is.
const AdminPromptsPage = lazy(() => import('@/features/prompts-gallery/pages/AdminPromptsPage'));

export default function PromptsPage() {
  useDocumentMeta({ title: 'Prompt library | CTW Control', robots: 'noindex, nofollow' });
  return (
    <div className="ad-page">
      <PageHeader title="Prompt library" description="Create, edit and remove prompts in the public image prompt gallery." />
      <Panel className="ad-embed">
        <Suspense fallback={<SkeletonRows rows={8} />}>
          <AdminPromptsPage />
        </Suspense>
      </Panel>
    </div>
  );
}
