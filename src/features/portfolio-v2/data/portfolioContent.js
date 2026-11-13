/**
 * Portfolio content — edit this file to update the portfolio page.
 * Components in ../components render this data and contain no copy of their own.
 */

export const PROFILE = {
  name: 'Chaitanya Gidijala',
  initials: 'CG',
  role: 'Java Backend Engineer',
  location: 'Hyderabad, India',
  email: 'chaitugidijala@gmail.com',
  phone: '+91 73370 72766',
  phoneHref: 'tel:+917337072766',
  resume: {
    href: '/Chaitanya-Gidijala-Resume-2026.pdf',
    filename: 'Chaitanya-Gidijala-Resume-2026.pdf',
  },
  socials: [
    { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/chaitanya-gidijala-660406231/', handle: 'Chaitanya Gidijala' },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/chaitanya-gidijala', handle: 'chaitanya-gidijala' },
  ],
};

export const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

export const HERO = {
  eyebrow: 'Java backend engineer · Hyderabad, IN',
  lead:
    'I build Spring Boot microservices and REST APIs for enterprise platforms — currently at Capgemini on a GE Aerospace system that processes 50,000+ transactions a day.',
  // Rotating phrases after "I build …" in the hero.
  roles: ['Spring Boot microservices', 'production REST APIs', 'reliable backend systems', 'AI-assisted dev tooling'],
  // Lines typed out by the hero terminal.
  terminal: [
    { cmd: 'whoami', out: 'chaitanya-gidijala' },
    { cmd: 'cat role.txt', out: 'Java Developer @ Capgemini · GE Aerospace' },
    { cmd: 'ls stack/', out: 'java-21  spring-boot-3  mysql  kafka  docker' },
    { cmd: 'uptime --career', out: '2+ years · 10+ APIs · 50k+ txns/day' },
  ],
};

export const STATS = [
  { label: 'Years experience', value: '2+' },
  { label: 'Production APIs', value: '10+' },
  { label: 'Daily transactions', value: '50k+' },
  { label: 'Latency reduced', value: '50%' },
];

export const ABOUT = {
  paragraphs: [
    'I’m a Java developer with 2+ years of experience building and maintaining **Spring Boot microservices and REST APIs** for an enterprise platform supporting **GE Aerospace**, processing **50,000+ daily transactions** across US, UK and India operations.',
    'I use **AI-assisted development** for scaffolding, review, documentation and test generation — and validate every change for quality and security. My work spans API performance, automated testing, CI/CD and developer-focused AI tools.',
  ],
  highlights: [
    { icon: 'server', text: 'Built and maintained 10+ production REST APIs' },
    { icon: 'zap', text: 'Cut API response latency 50% through SQL and pool tuning' },
    { icon: 'layers', text: 'Jenkins CI/CD, Docker and Kubernetes fundamentals' },
    { icon: 'shield', text: 'JWT auth, role-based access and quality gates' },
  ],
};

export const SKILL_GROUPS = [
  {
    title: 'Languages & frameworks',
    icon: 'code',
    items: ['Java 17/21', 'Spring Boot 3.x', 'Spring Data JPA', 'Hibernate', 'Spring MVC', 'REST APIs', 'Microservices', 'JDBC', 'SQL'],
  },
  {
    title: 'Data, infrastructure & DevOps',
    icon: 'database',
    items: ['MySQL', 'Redis', 'Apache Kafka', 'RabbitMQ', 'Docker', 'Kubernetes (basics)', 'Jenkins CI/CD', 'AWS — EC2, S3, RDS, Lambda'],
  },
  {
    title: 'Quality, security & tooling',
    icon: 'shield',
    items: ['JUnit 5', 'Mockito', 'JWT', 'OAuth 2.0', 'Swagger / OpenAPI', 'Postman', 'Git & GitHub', 'GitHub Copilot', 'Agentic AI workflows'],
  },
];

export const EXPERIENCE = [
  {
    role: 'Java Developer',
    company: 'Capgemini',
    period: 'Aug 2024 — Present',
    client: 'GE Aerospace · Enterprise microservices platform',
    bullets: [
      'Developed and maintained 10+ Spring Boot REST APIs for aircraft-parts tracking and maintenance workflows.',
      'Reduced API response latency by 50% (800 ms → 400 ms) by optimising SQL queries, adding composite indexes and tuning connection pooling.',
      'Implemented Spring Data JPA / Hibernate persistence with centralised exception handling and consistent JSON error responses.',
      'Reached 85%+ unit and integration test coverage with JUnit 5 and Mockito, including validation and negative scenarios.',
      'Worked within Jenkins CI/CD quality gates; applied JWT authentication and role-based access control to REST APIs.',
      'Ran daily knowledge-transfer sessions on Docker, Kubernetes and Jenkins for 7 junior developers, lifting the team’s certification pass rate by 85%.',
    ],
  },
];

export const PROJECTS = [
  {
    title: 'Chaitanya Tech World',
    category: 'Learning platform',
    description:
      'A personal learning platform with an AI prompts gallery, technology roadmaps, Traceflow DSA visualisations and system-design learning content.',
    tags: ['Spring Boot', 'React', 'MySQL'],
    link: { label: 'Visit the app', href: '/' },
  },
  {
    title: 'webMethods AI Expert',
    category: 'Developer automation',
    description:
      'An AI-powered assistant for package scaffolding, automated documentation, integration-log analysis and functional test-case generation.',
    tags: ['AI automation', 'React', 'webMethods IS'],
    note: 'Private project — details on request',
  },
  {
    title: 'System Design Learning Content',
    category: 'Technical education',
    description:
      'Visual learning content that breaks down system architecture, components, data flow and core design concepts.',
    tags: ['System Design', 'Architecture', 'Visual learning'],
    link: { label: 'View roadmaps', href: '/roadmap' },
  },
];

export const EDUCATION = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Andhra University, Visakhapatnam',
    detail: 'CGPA 8.6',
  },
  {
    degree: 'B.Sc. Computer Science',
    institution: 'Dr. B.R. Ambedkar University · Sri GCSR College, Rajam',
    detail: 'CGPA 8.2',
  },
];

export const CERTIFICATIONS = [
  { name: 'Claude Certified Associate (CCAO-F)', issuer: 'Anthropic', year: '2026' },
  { name: 'Claude Certified Developer (CCDV-F)', issuer: 'Anthropic', year: '2026' },
  { name: 'Microsoft GitHub Copilot for SE Practitioners', issuer: null, year: '2026' },
  { name: 'GitHub Copilot Fundamentals: AI-Paired Programming', issuer: null, year: '2026' },
  { name: 'Java OCEAN Certification — Level 1 & 2', issuer: 'Capgemini', year: '2025–26' },
  { name: 'Java Full Stack Developer', issuer: 'Frontlines Media', year: '2024' },
];
