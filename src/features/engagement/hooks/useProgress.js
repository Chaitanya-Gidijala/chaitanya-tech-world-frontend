import { useSyncExternalStore } from 'react';
import { progressStore } from '../lib/store';

/** Raw progress state (re-renders on any change, in this tab or another). */
export function useProgressState() {
  return useSyncExternalStore(progressStore.subscribe, progressStore.getState, progressStore.getState);
}

/** Derived summary: streak, XP, level, counts. */
export function useProgressSummary() {
  return useSyncExternalStore(progressStore.subscribe, progressStore.getSummary, progressStore.getSummary);
}

/** Completed topic map for one roadmap. */
export function useRoadmapProgress(roadmapId) {
  const state = useProgressState();
  return state.roadmaps[roadmapId] ?? EMPTY;
}

const EMPTY = Object.freeze({});
