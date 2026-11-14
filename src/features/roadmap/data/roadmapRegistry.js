import { javaRoadmapData } from './javaRoadmapData.js';
import { frontendRoadmapData } from './frontendRoadmapData.js';

/** Roadmaps with a detail page at /roadmap/:id — shared by RoadmapPage and the progress tracker. */
export const ROADMAP_REGISTRY = {
  java: javaRoadmapData,
  frontend: frontendRoadmapData,
};

/** Stable id for a topic's completion record (section ids are unique within a roadmap). */
export const topicKey = (section, topic) => `${section.id}::${topic.name}`;

/** Every topic key in a roadmap, in order, with its phase. */
export function roadmapTopics(data) {
  return data.phases.flatMap((phase) =>
    phase.sections.flatMap((section) =>
      section.topics.map((topic) => ({ key: topicKey(section, topic), name: topic.name, phase, section })),
    ),
  );
}

/** { done, total, percent, next } for one roadmap given its completion map. */
export function roadmapProgress(data, doneMap = {}) {
  const topics = roadmapTopics(data);
  const done = topics.filter((t) => doneMap[t.key]).length;
  return {
    done,
    total: topics.length,
    percent: topics.length ? Math.round((done / topics.length) * 100) : 0,
    next: topics.find((t) => !doneMap[t.key]) ?? null,
  };
}
