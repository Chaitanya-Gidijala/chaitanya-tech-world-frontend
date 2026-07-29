// =========================================================
// TRACEFLOW — Trace Engine
// The core runtime that manages history, playback and state.
// =========================================================

export function createTraceEngine(events = [], options = {}) {
  let currentIndex = 0; // 0 means starting state, before any steps
  const totalSteps = events.length;
  const { onStateChange } = options;

  const notify = () => {
    if (onStateChange) {
      onStateChange(engine.getState());
    }
  };

  const engine = {
    getState: () => {
      const isFinished = currentIndex >= totalSteps;
      const progress = totalSteps === 0 ? 0 : currentIndex / totalSteps;
      const currentEvent = currentIndex > 0 ? events[currentIndex - 1] : null;

      return {
        currentEvent,
        isFinished,
        progress,
        stepIndex: currentIndex,
        totalSteps
      };
    },
    
    stepForward: () => {
      if (currentIndex < totalSteps) {
        currentIndex++;
        notify();
      }
    },
    
    stepBackward: () => {
      if (currentIndex > 0) {
        currentIndex--;
        notify();
      }
    },
    
    reset: () => {
      currentIndex = 0;
      notify();
    },

    jumpTo: (index) => {
      currentIndex = Math.max(0, Math.min(totalSteps, index));
      notify();
    },

    destroy: () => {
      // Cleanup if needed
    }
  };

  return engine;
}

// =========================================================
// ALGORITHM REGISTRY
// Maps slug → trace generator function
// =========================================================
const registry = {};

export function registerAlgorithm(slug, generator) {
  registry[slug] = generator;
}

export function getAlgorithmGenerator(slug) {
  return registry[slug] ?? null;
}

export function generateTrace(slug, input) {
  const gen = registry[slug];
  if (!gen) throw new Error(`No trace generator registered for "${slug}"`);
  return gen(input);
}
