// Frontend Developer Roadmap Data

export const frontendRoadmapData = {
  id: 'frontend',
  title: 'Frontend Developer',
  subtitle: 'From HTML Basics to Production React Apps',
  description: 'A complete, structured roadmap covering everything from HTML/CSS fundamentals to advanced React, performance optimization, and deployment — built for real-world project success.',
  icon: '⚛️',
  gradient: 'linear-gradient(135deg, #61dafb 0%, #0ea5e9 50%, #6366f1 100%)',
  accentColor: '#61dafb',
  estimatedWeeks: 28,
  phases: [
    {
      id: 'fe-phase-1',
      phase: 1,
      title: 'Web Foundations',
      subtitle: 'HTML, CSS & How Browsers Work',
      icon: '🌐',
      color: '#f97316',
      glow: 'rgba(249,115,22,0.4)',
      estimatedWeeks: '3–4 weeks',
      sections: [
        {
          id: 'fe-1-1',
          title: 'HTML Essentials',
          icon: '📄',
          topics: [
            { name: 'HTML5 Document Structure', level: 'beginner' },
            { name: 'Semantic Tags (header, nav, main, footer, section, article)', level: 'beginner' },
            { name: 'Forms & Input Types', level: 'beginner' },
            { name: 'Tables, Lists & Media Elements', level: 'beginner' },
            { name: 'Accessibility (ARIA, alt text, labels)', level: 'intermediate' },
            { name: 'SEO Meta Tags & Open Graph', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-1-2',
          title: 'CSS Fundamentals',
          icon: '🎨',
          topics: [
            { name: 'Selectors, Specificity & Cascade', level: 'beginner' },
            { name: 'Box Model (margin, border, padding)', level: 'beginner' },
            { name: 'Colors, Typography & Google Fonts', level: 'beginner' },
            { name: 'Display & Positioning (static, relative, absolute, fixed)', level: 'beginner' },
            { name: 'Flexbox — Complete Guide', level: 'beginner' },
            { name: 'CSS Grid — Complete Guide', level: 'intermediate' },
            { name: 'Responsive Design & Media Queries', level: 'intermediate' },
            { name: 'CSS Variables (Custom Properties)', level: 'intermediate' },
            { name: 'Pseudo-classes & Pseudo-elements', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-1-3',
          title: 'CSS Advanced',
          icon: '✨',
          topics: [
            { name: 'Transitions & Animations (@keyframes)', level: 'intermediate' },
            { name: 'Transforms (scale, rotate, translate)', level: 'intermediate' },
            { name: 'CSS Filters & Blend Modes', level: 'advanced' },
            { name: 'Glassmorphism & Neumorphism Techniques', level: 'advanced' },
            { name: 'CSS Architecture (BEM, SMACSS)', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-2',
      phase: 2,
      title: 'JavaScript Core',
      subtitle: 'The Language of the Web',
      icon: '⚡',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.4)',
      estimatedWeeks: '4–5 weeks',
      sections: [
        {
          id: 'fe-2-1',
          title: 'JS Fundamentals',
          icon: '📦',
          topics: [
            { name: 'Variables (var, let, const)', level: 'beginner' },
            { name: 'Data Types & Type Coercion', level: 'beginner' },
            { name: 'Operators & Control Flow', level: 'beginner' },
            { name: 'Functions (declarations, expressions, arrow)', level: 'beginner' },
            { name: 'Scope, Closures & Hoisting', level: 'intermediate' },
            { name: 'Arrays & Array Methods (map, filter, reduce)', level: 'intermediate' },
            { name: 'Objects & Destructuring', level: 'intermediate' },
            { name: 'Spread & Rest Operators', level: 'intermediate' },
            { name: 'Template Literals', level: 'beginner' },
          ]
        },
        {
          id: 'fe-2-2',
          title: 'DOM & Browser APIs',
          icon: '🌲',
          topics: [
            { name: 'DOM Manipulation (querySelector, innerHTML)', level: 'beginner' },
            { name: 'Events & Event Listeners', level: 'beginner' },
            { name: 'Event Bubbling & Delegation', level: 'intermediate' },
            { name: 'Local Storage & Session Storage', level: 'intermediate' },
            { name: 'Fetch API & XMLHttpRequest', level: 'intermediate' },
            { name: 'Intersection Observer API', level: 'advanced' },
          ]
        },
        {
          id: 'fe-2-3',
          title: 'Async JavaScript',
          icon: '🔄',
          topics: [
            { name: 'Callbacks & Callback Hell', level: 'intermediate' },
            { name: 'Promises (then, catch, finally)', level: 'intermediate' },
            { name: 'async / await', level: 'intermediate' },
            { name: 'Promise.all, Promise.race, Promise.allSettled', level: 'advanced' },
            { name: 'Error Handling in Async Code', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-2-4',
          title: 'ES6+ Modern JS',
          icon: '🚀',
          topics: [
            { name: 'Modules (import / export)', level: 'intermediate' },
            { name: 'Classes & Inheritance', level: 'intermediate' },
            { name: 'Iterators & Generators', level: 'advanced' },
            { name: 'Symbol & WeakMap', level: 'advanced' },
            { name: 'Optional Chaining (?.) & Nullish Coalescing (??)', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-3',
      phase: 3,
      title: 'Version Control & Tooling',
      subtitle: 'Developer Workflow Essentials',
      icon: '🛠️',
      color: '#22c55e',
      glow: 'rgba(34,197,94,0.4)',
      estimatedWeeks: '1–2 weeks',
      sections: [
        {
          id: 'fe-3-1',
          title: 'Git & GitHub',
          icon: '🔀',
          topics: [
            { name: 'Git Init, Add, Commit, Push', level: 'beginner' },
            { name: 'Branching & Merging', level: 'beginner' },
            { name: 'Pull Requests & Code Reviews', level: 'intermediate' },
            { name: 'Rebase, Cherry-pick & Stash', level: 'advanced' },
            { name: 'GitHub Actions (CI/CD Basics)', level: 'advanced' },
          ]
        },
        {
          id: 'fe-3-2',
          title: 'Build Tools',
          icon: '⚙️',
          topics: [
            { name: 'npm / yarn / pnpm', level: 'beginner' },
            { name: 'Vite (Modern Build Tool)', level: 'intermediate' },
            { name: 'Webpack Basics', level: 'intermediate' },
            { name: 'ESLint & Prettier', level: 'intermediate' },
            { name: 'Environment Variables (.env)', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-4',
      phase: 4,
      title: 'React.js',
      subtitle: 'The Industry-Standard UI Library',
      icon: '⚛️',
      color: '#61dafb',
      glow: 'rgba(97,218,251,0.3)',
      estimatedWeeks: '5–6 weeks',
      sections: [
        {
          id: 'fe-4-1',
          title: 'React Core Concepts',
          icon: '⚛️',
          topics: [
            { name: 'JSX Syntax & Rules', level: 'beginner' },
            { name: 'Components (Functional & Class)', level: 'beginner' },
            { name: 'Props & Prop Drilling', level: 'beginner' },
            { name: 'State & useState Hook', level: 'beginner' },
            { name: 'useEffect & Lifecycle', level: 'intermediate' },
            { name: 'Conditional Rendering', level: 'beginner' },
            { name: 'Lists & Keys', level: 'beginner' },
            { name: 'Event Handling in React', level: 'beginner' },
          ]
        },
        {
          id: 'fe-4-2',
          title: 'React Hooks (Deep Dive)',
          icon: '🪝',
          topics: [
            { name: 'useRef & DOM Access', level: 'intermediate' },
            { name: 'useContext & Context API', level: 'intermediate' },
            { name: 'useReducer for Complex State', level: 'intermediate' },
            { name: 'useMemo & useCallback (Performance)', level: 'advanced' },
            { name: 'Custom Hooks — Build Your Own', level: 'advanced' },
            { name: 'useLayoutEffect', level: 'advanced' },
          ]
        },
        {
          id: 'fe-4-3',
          title: 'React Ecosystem',
          icon: '🌍',
          topics: [
            { name: 'React Router v6 (Navigation, Nested Routes)', level: 'intermediate' },
            { name: 'Axios & API Integration', level: 'intermediate' },
            { name: 'TanStack Query (React Query)', level: 'advanced' },
            { name: 'React Hook Form & Validation', level: 'intermediate' },
            { name: 'Lazy Loading & Suspense', level: 'advanced' },
            { name: 'Error Boundaries', level: 'advanced' },
          ]
        },
        {
          id: 'fe-4-4',
          title: 'State Management',
          icon: '🗃️',
          topics: [
            { name: 'Local vs Global State Strategy', level: 'intermediate' },
            { name: 'Redux Toolkit (RTK)', level: 'advanced' },
            { name: 'Zustand (Lightweight Alternative)', level: 'advanced' },
            { name: 'Jotai / Recoil (Atomic State)', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-5',
      phase: 5,
      title: 'Styling Frameworks',
      subtitle: 'Build UIs 10x Faster',
      icon: '💅',
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'fe-5-1',
          title: 'Tailwind CSS',
          icon: '💨',
          topics: [
            { name: 'Utility-First Philosophy', level: 'beginner' },
            { name: 'Responsive Prefixes (sm, md, lg, xl)', level: 'intermediate' },
            { name: 'Dark Mode & Variants', level: 'intermediate' },
            { name: 'Custom Config (tailwind.config.js)', level: 'advanced' },
            { name: 'Component Libraries (shadcn/ui, DaisyUI)', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-5-2',
          title: 'CSS-in-JS & Modules',
          icon: '💎',
          topics: [
            { name: 'CSS Modules', level: 'intermediate' },
            { name: 'Styled Components', level: 'intermediate' },
            { name: 'Emotion', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-5-3',
          title: 'Animation Libraries',
          icon: '🎬',
          topics: [
            { name: 'Framer Motion — Basics to Advanced', level: 'intermediate' },
            { name: 'GSAP (GreenSock)', level: 'advanced' },
            { name: 'React Spring', level: 'advanced' },
            { name: 'Lottie Animations', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-6',
      phase: 6,
      title: 'TypeScript',
      subtitle: 'Type-Safe JavaScript',
      icon: '🔷',
      color: '#3178c6',
      glow: 'rgba(49,120,198,0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'fe-6-1',
          title: 'TypeScript Fundamentals',
          icon: '📘',
          topics: [
            { name: 'Types, Interfaces & Type Aliases', level: 'intermediate' },
            { name: 'Union, Intersection & Literal Types', level: 'intermediate' },
            { name: 'Generics', level: 'advanced' },
            { name: 'Enums', level: 'intermediate' },
            { name: 'Type Guards & Narrowing', level: 'advanced' },
            { name: 'Utility Types (Partial, Pick, Omit, Record)', level: 'advanced' },
            { name: 'TypeScript with React (props, hooks, events)', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-7',
      phase: 7,
      title: 'Testing',
      subtitle: 'Write Reliable, Maintainable Code',
      icon: '🧪',
      color: '#ec4899',
      glow: 'rgba(236,72,153,0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'fe-7-1',
          title: 'Unit & Integration Testing',
          icon: '✅',
          topics: [
            { name: 'Jest — Setup & Basics', level: 'intermediate' },
            { name: 'React Testing Library', level: 'intermediate' },
            { name: 'Mocking APIs & Modules', level: 'advanced' },
            { name: 'Test Coverage Reports', level: 'intermediate' },
          ]
        },
        {
          id: 'fe-7-2',
          title: 'E2E Testing',
          icon: '🤖',
          topics: [
            { name: 'Playwright — Complete Guide', level: 'advanced' },
            { name: 'Cypress Basics', level: 'advanced' },
            { name: 'Visual Regression Testing', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'fe-phase-8',
      phase: 8,
      title: 'Performance & Best Practices',
      subtitle: 'Ship Fast, Accessible Apps',
      icon: '⚡',
      color: '#14b8a6',
      glow: 'rgba(20,184,166,0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'fe-8-1',
          title: 'Web Performance',
          icon: '📊',
          topics: [
            { name: 'Core Web Vitals (LCP, FID, CLS)', level: 'intermediate' },
            { name: 'Code Splitting & Lazy Loading', level: 'advanced' },
            { name: 'Image Optimization (WebP, lazy, srcset)', level: 'intermediate' },
            { name: 'Caching Strategies', level: 'advanced' },
            { name: 'Bundle Analysis & Tree Shaking', level: 'advanced' },
          ]
        },
        {
          id: 'fe-8-2',
          title: 'Deployment & DevOps',
          icon: '🚀',
          topics: [
            { name: 'Deploying to Vercel / Netlify', level: 'intermediate' },
            { name: 'Firebase Hosting', level: 'intermediate' },
            { name: 'Environment Variables in Production', level: 'intermediate' },
            { name: 'Custom Domain & HTTPS', level: 'intermediate' },
            { name: 'CI/CD with GitHub Actions', level: 'advanced' },
            { name: 'Docker for Frontend Apps', level: 'advanced' },
          ]
        },
        {
          id: 'fe-8-3',
          title: 'Next.js (Full-Stack Frontend)',
          icon: '▲',
          topics: [
            { name: 'App Router vs Pages Router', level: 'intermediate' },
            { name: 'Server Components & Client Components', level: 'advanced' },
            { name: 'SSR, SSG & ISR', level: 'advanced' },
            { name: 'API Routes', level: 'intermediate' },
            { name: 'Next.js Image & Font Optimization', level: 'intermediate' },
            { name: 'Middleware & Edge Functions', level: 'advanced' },
          ]
        },
      ]
    },
  ]
};
