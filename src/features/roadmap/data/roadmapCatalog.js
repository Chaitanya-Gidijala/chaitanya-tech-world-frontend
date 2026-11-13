/**
 * Catalogue of learning paths shown on /roadmap.
 * `status: 'live'` cards link to `href` (or /roadmap/:id); 'soon' cards are shown disabled.
 */
export const COURSE_ROADMAPS = [
  {
    id: 'java',
    title: 'Java Backend Developer',
    path: ['Core Java', 'Spring Boot', 'Microservices', 'Cloud deployment'],
    status: 'live',
    stats: [
      { label: 'Phases', value: 10 },
      { label: 'Topics', value: '85+' },
      { label: 'Weeks', value: 36 },
    ],
    tags: ['Core Java', 'Spring Boot', 'Hibernate', 'Docker'],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    path: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Next.js'],
    status: 'live',
    stats: [
      { label: 'Phases', value: 8 },
      { label: 'Topics', value: '90+' },
      { label: 'Weeks', value: 28 },
    ],
    tags: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript'],
  },
  {
    id: 'gen-ai',
    title: 'Gen AI & Prompt Engineering',
    path: ['Fundamentals', 'Prompt engineering', 'Advanced control', 'MCP'],
    // The interactive tutorial route (/tutorial/gen-ai) is currently disabled in AppRoutes.
    // Switch back to 'live' with `href: '/tutorial/gen-ai'` once it is re-enabled.
    status: 'soon',
    stats: [
      { label: 'Phases', value: 4 },
      { label: 'Topics', value: 17 },
      { label: 'Format', value: 'Interactive' },
    ],
    tags: ['Generative AI', 'Prompting', 'LLMs', 'MCP'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    path: ['Java backend', 'React frontend', 'DevOps'],
    status: 'soon',
    stats: [
      { label: 'Phases', value: 12 },
      { label: 'Topics', value: '150+' },
      { label: 'Weeks', value: 52 },
    ],
    tags: ['Java', 'React', 'APIs', 'DevOps'],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    path: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS/GCP'],
    status: 'soon',
    stats: [
      { label: 'Phases', value: 7 },
      { label: 'Topics', value: '60+' },
      { label: 'Weeks', value: 24 },
    ],
    tags: ['Linux', 'Docker', 'Kubernetes', 'AWS'],
  },
];

export const CERT_TRACKS = [
  {
    id: 'claude',
    provider: 'Anthropic',
    title: 'Claude AI certifications',
    description: 'Four certifications from Associate to Expert, with study guides built from the official exam blueprints.',
    levels: ['Foundations', 'Developer', 'Architect', 'Expert'],
    href: '/roadmap/certifications/claude',
  },
];

/**
 * Catalogue of Claude certifications shown on /roadmap/certifications/claude.
 * Live entries must have a matching study guide in CERT_REGISTRY (ClaudeCertPage).
 */
export const CLAUDE_CERTS = [
  {
    id: 'claude-certified-associate-foundations',
    code: 'CCAO-F',
    title: 'Claude Certified Associate',
    subtitle: 'Foundations',
    level: 'Associate',
    description:
      'The fundamentals of working with Claude — prompt engineering, output evaluation, governance, model selection and workflow integration.',
    status: 'live',
    stats: { domains: 7, objectives: 27, resources: 47, hours: 40 },
    tags: ['Prompt engineering', 'Output validation', 'Governance', 'Model selection'],
    difficulty: 'Beginner',
  },
  {
    id: 'claude-certified-developer',
    code: 'CCD',
    title: 'Claude Certified Developer',
    subtitle: 'Builder & integrations',
    level: 'Developer',
    description:
      'Build Claude-powered applications with the Anthropic API — RAG pipelines, multi-agent systems, tool use, streaming and production integrations.',
    status: 'live',
    stats: { domains: 8, objectives: 34, resources: 62, hours: 60 },
    tags: ['Anthropic API', 'Tool use', 'RAG', 'Agents'],
    difficulty: 'Intermediate',
  },
  {
    id: 'claude-certified-architect',
    code: 'CCA',
    title: 'Claude Certified Architect',
    subtitle: 'Enterprise & system design',
    level: 'Architect',
    description:
      'Design, secure and optimise large-scale Claude deployments — multi-model orchestration, safety guardrails, cost management and MLOps patterns.',
    status: 'soon',
    stats: { domains: 9, objectives: 40, resources: 75, hours: 80 },
    tags: ['Enterprise', 'MLOps', 'Guardrails', 'Orchestration'],
    difficulty: 'Advanced',
  },
  {
    id: 'claude-certified-expert',
    code: 'CCE',
    title: 'Claude Certified Expert',
    subtitle: 'Research & frontier applications',
    level: 'Expert',
    description:
      'Research applications, constitutional AI, interpretability, frontier model capabilities and Anthropic’s alignment principles.',
    status: 'soon',
    stats: { domains: 10, objectives: 50, resources: 90, hours: 120 },
    tags: ['Constitutional AI', 'Alignment', 'Interpretability', 'Frontier'],
    difficulty: 'Expert',
  },
];

export const DIFFICULTY_TONE = {
  Beginner: 'success',
  Intermediate: 'info',
  Advanced: 'warning',
  Expert: 'danger',
};
