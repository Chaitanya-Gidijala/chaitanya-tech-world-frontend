/**
 * constants/routes.js
 *
 * Centralised route path strings. Use these everywhere instead of hard-coding
 * paths so renaming a route only requires a change in one place.
 */
const ROUTES = {
  HOME: '/',
  CONTACT: '/contact',
  PORTFOLIO: '/portfolio',
  ROADMAPS: '/roadmap',
  ROADMAP_DETAIL: (tech) => `/roadmap/${tech}`,
  CLAUDE_CERTS: '/roadmap/certifications/claude',
  CERT_DETAIL: (slug) => `/roadmap/certifications/${slug}`,
  TRACEFLOW: '/traceflow',
  PROMPTS: '/prompts',
  PROMPT_DETAIL: (id) => `/prompts/${id}`,
  DAILY: '/daily',
  PROGRESS: '/progress',
  ALGO_COMPARE: (a, b) => `/traceflow/compare/${a}-vs-${b}`,

  // Legacy (routes currently disabled in AppRoutes)
  OUR_SERVICES: '/services/*',
  OUR_SERVICES_PAGE: '/our-services',
  JOB_PORTAL: '/job-portal/*',
  AI_RESUME_BUILDER: '/ai-resume-builder/*',
  CHAITANYA_TECH_WORLD: '/chaitanya-tech-world/*',
  NOT_FOUND: '*',
};

export default ROUTES;
