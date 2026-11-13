import { useQuery } from '@tanstack/react-query';
import { normalizePrompt, normalizePromptList, promptService } from '../services/promptService';

// The gallery filters and paginates client-side, so fetch the whole library once.
const LIBRARY_PAGE_SIZE = 500;
const STALE_TIME_MS = 5 * 60 * 1000;

export const promptKeys = {
  all: ['prompts'],
  detail: (id) => ['prompts', String(id)],
};

/** usePrompts — the full prompt library, cached and shared across pages. */
export function usePrompts() {
  return useQuery({
    queryKey: promptKeys.all,
    queryFn: async () => normalizePromptList(await promptService.getAllPrompts(0, LIBRARY_PAGE_SIZE)),
    staleTime: STALE_TIME_MS,
  });
}

/** usePrompt — a single prompt by id. */
export function usePrompt(id) {
  return useQuery({
    queryKey: promptKeys.detail(id),
    queryFn: async () => normalizePrompt(await promptService.getPromptById(id)),
    enabled: id != null,
    staleTime: STALE_TIME_MS,
  });
}

/** Human-readable message for a failed prompts request. */
export function promptErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'The prompts service is taking too long to respond. It may be waking up — please try again shortly.';
  }
  return 'Unable to load prompts right now. Please try again shortly.';
}
