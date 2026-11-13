import ROUTES from '@/constants/routes';
import { CLAUDE_CERTS, COURSE_ROADMAPS } from '@/features/roadmap/data/roadmapCatalog';

/** Copy and data for the home page. Components in ../components render this. */

export const HERO = {
  announcement: { label: 'New', text: 'Claude certification study guides', to: ROUTES.CLAUDE_CERTS },
  title: ['Master', 'modern', 'engineering,'],
  titleAccent: ['one', 'visual', 'step', 'at', 'a', 'time.'],
  description:
    'Structured roadmaps, animated algorithm walkthroughs, AI certification guides and a curated prompt library — everything a developer needs to level up, in one place.',
  primary: { label: 'Explore roadmaps', to: ROUTES.ROADMAPS },
  secondary: { label: 'Launch Traceflow', to: ROUTES.TRACEFLOW },
  trust: ['Free forever', 'No sign-up', 'Built by a working engineer'],
};

export const STATS = [
  { label: 'Learning paths', value: COURSE_ROADMAPS.length + 1 },
  { label: 'Topics covered', value: '350+' },
  { label: 'AI certification guides', value: CLAUDE_CERTS.length },
  { label: 'Algorithms visualised', value: 7 },
];

export const TECH_STACK = [
  'Java',
  'Spring Boot',
  'Microservices',
  'React',
  'TypeScript',
  'Next.js',
  'Docker',
  'Kubernetes',
  'AWS',
  'Kafka',
  'MySQL',
  'Claude',
  'Prompt Engineering',
  'Data Structures',
  'Algorithms',
  'System Design',
];

export const LIVE_ROADMAPS = COURSE_ROADMAPS.filter((r) => r.status === 'live');
export const LIVE_CERTS = CLAUDE_CERTS.filter((c) => c.status === 'live');
export const CERT_LEVELS = CLAUDE_CERTS.map((c) => ({ level: c.level, code: c.code, live: c.status === 'live' }));

/** Scroll-driven product showcase — `preview` selects the animated mock on the right. */
export const SHOWCASE = [
  {
    id: 'showcase-roadmaps',
    preview: 'roadmaps',
    kicker: 'Roadmaps',
    title: 'A clear path from fundamentals to production',
    text: 'Phase-by-phase learning paths for Java backend and frontend engineering, with every topic tagged by level so you always know what to learn next.',
    points: ['Beginner → advanced levels', 'Estimated weeks per phase', 'Expand-all study outline'],
    cta: { label: 'Browse roadmaps', to: ROUTES.ROADMAPS },
  },
  {
    id: 'showcase-traceflow',
    preview: 'traceflow',
    kicker: 'Traceflow',
    title: 'Watch algorithms think, step by step',
    text: 'Sorting and searching algorithms animated one comparison at a time, with the matching line of Java highlighted and a plain-English explanation of every move.',
    points: ['Play, pause, step and scrub', 'Synced Java source', 'Custom input arrays'],
    cta: { label: 'Open Traceflow', to: ROUTES.TRACEFLOW },
  },
  {
    id: 'showcase-certs',
    preview: 'certs',
    kicker: 'Certifications',
    title: 'Study guides mapped to the real exam',
    text: 'Claude certification guides organised by the official exam domains and weightings — with concepts, practice skills, common traps and links to official documentation.',
    points: ['Domain weighting at a glance', 'Exam traps & revision points', 'Final-week checklist'],
    cta: { label: 'View certifications', to: ROUTES.CLAUDE_CERTS },
  },
  {
    id: 'showcase-prompts',
    preview: 'prompts',
    kicker: 'Prompt library',
    title: 'Image prompts that just work',
    text: 'A curated gallery of ready-to-use prompts for portraits, product shots and editorial scenes — filter by model and category, then copy in one click.',
    points: ['ChatGPT, Gemini, Midjourney & more', 'One-click copy', 'How-to steps per model'],
    cta: { label: 'Explore prompts', to: ROUTES.PROMPTS },
  },
];

export const BENEFITS = [
  { icon: 'layers', title: 'Structured, not scattered', text: 'Every path is ordered into phases so you never wonder what comes next.' },
  { icon: 'eye', title: 'See it, then code it', text: 'Animations and synced Java code turn abstract algorithms into intuition.' },
  { icon: 'target', title: 'Blueprint-aligned', text: 'Certification guides follow the official exam domains and weightings.' },
  { icon: 'briefcase', title: 'Built from real work', text: 'Content shaped by hands-on enterprise backend engineering experience.' },
  { icon: 'unlock', title: 'Free and open', text: 'No paywall, no account, no tracking walls — just open the page and learn.' },
  { icon: 'smartphone', title: 'Learn anywhere', text: 'Fully responsive on phone, tablet and desktop, in dark or light mode.' },
];

export const STEPS = [
  {
    title: 'Pick a path',
    text: 'Choose a roadmap or certification track that matches where you want to go next.',
    icon: 'map',
  },
  {
    title: 'Learn visually',
    text: 'Follow phase-by-phase topics and watch algorithms execute step by step in Traceflow.',
    icon: 'eye',
  },
  {
    title: 'Prove it',
    text: 'Prepare for official AI certifications with curated, blueprint-mapped study guides.',
    icon: 'award',
  },
];

export const FAQ = [
  {
    q: 'Is everything really free?',
    a: 'Yes. All roadmaps, certification guides, Traceflow visualisations and the prompt library are free to use — there is no paywall.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Every page is open to everyone; there is no sign-up or login.',
  },
  {
    q: 'How are the Claude certification guides built?',
    a: 'Each guide follows the published exam blueprint — its domains, weightings and objectives — and links to official Anthropic documentation. They are independent study aids, not official Anthropic material.',
  },
  {
    q: 'Which algorithms does Traceflow cover?',
    a: 'Bubble, selection, insertion, merge and quick sort, plus linear and binary search — each with step-by-step animation and synced Java code.',
  },
  {
    q: 'Can I suggest a topic or report a problem?',
    a: 'Absolutely — use the contact page to send suggestions, corrections or questions.',
  },
];
