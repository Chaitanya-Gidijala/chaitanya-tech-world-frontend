// Java Full-Stack Backend Developer Roadmap Data

export const javaRoadmapData = {
  id: 'java',
  title: 'Java Backend Developer',
  subtitle: 'From Zero to Production-Ready Java Engineer',
  description: 'A comprehensive, battle-tested roadmap covering everything you need to become a professional Java backend developer. Built from 15+ years of industry experience.',
  icon: '☕',
  gradient: 'linear-gradient(135deg, #f89820 0%, #e74c3c 50%, #c0392b 100%)',
  accentColor: '#f89820',
  totalTopics: 85,
  estimatedWeeks: 36,
  phases: [
    {
      id: 'phase-1',
      phase: 1,
      title: 'Java Foundations',
      subtitle: 'Core Language Mastery',
      icon: '🧱',
      color: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.4)',
      estimatedWeeks: '4–6 weeks',
      sections: [
        {
          id: 'sec-1-1',
          title: 'Environment Setup',
          icon: '⚙️',
          status: 'foundation',
          topics: [
            { name: 'Install JDK 21', level: 'beginner' },
            { name: 'IntelliJ IDEA / VS Code', level: 'beginner' },
            { name: 'Maven & Gradle', level: 'beginner' },
            { name: 'Git & GitHub Basics', level: 'beginner' },
          ]
        },
        {
          id: 'sec-1-2',
          title: 'Core Java Fundamentals',
          icon: '📦',
          status: 'foundation',
          topics: [
            { name: 'Data Types & Variables', level: 'beginner' },
            { name: 'Operators & Expressions', level: 'beginner' },
            { name: 'Control Flow (if, switch, loops)', level: 'beginner' },
            { name: 'Arrays & Strings', level: 'beginner' },
            { name: 'Methods & Varargs', level: 'beginner' },
            { name: 'Scanner & Console I/O', level: 'beginner' },
          ]
        },
        {
          id: 'sec-1-3',
          title: 'Object-Oriented Programming',
          icon: '🏗️',
          status: 'foundation',
          topics: [
            { name: 'Classes & Objects', level: 'beginner' },
            { name: 'Constructors & this keyword', level: 'beginner' },
            { name: 'Encapsulation & Access Modifiers', level: 'beginner' },
            { name: 'Inheritance & super keyword', level: 'intermediate' },
            { name: 'Polymorphism (Overloading & Overriding)', level: 'intermediate' },
            { name: 'Abstraction (Abstract Classes & Interfaces)', level: 'intermediate' },
            { name: 'Static Members & Inner Classes', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-1-4',
          title: 'Exception Handling',
          icon: '🛡️',
          status: 'foundation',
          topics: [
            { name: 'try-catch-finally', level: 'beginner' },
            { name: 'Checked vs Unchecked Exceptions', level: 'intermediate' },
            { name: 'Custom Exceptions', level: 'intermediate' },
            { name: 'try-with-resources', level: 'intermediate' },
            { name: 'Multi-catch Blocks', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'phase-2',
      phase: 2,
      title: 'Java Collections & Generics',
      subtitle: 'Data Structures Deep Dive',
      icon: '🗂️',
      color: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.4)',
      estimatedWeeks: '3–4 weeks',
      sections: [
        {
          id: 'sec-2-1',
          title: 'Collections Framework',
          icon: '📚',
          status: 'core',
          topics: [
            { name: 'List (ArrayList, LinkedList, Vector)', level: 'intermediate' },
            { name: 'Set (HashSet, LinkedHashSet, TreeSet)', level: 'intermediate' },
            { name: 'Map (HashMap, LinkedHashMap, TreeMap)', level: 'intermediate' },
            { name: 'Queue & Deque (PriorityQueue, ArrayDeque)', level: 'intermediate' },
            { name: 'Stack & Collections Utility Class', level: 'intermediate' },
            { name: 'Comparable vs Comparator', level: 'intermediate' },
            { name: 'Iterator & ListIterator', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-2-2',
          title: 'Generics',
          icon: '🔷',
          status: 'core',
          topics: [
            { name: 'Generic Classes & Methods', level: 'intermediate' },
            { name: 'Bounded Type Parameters', level: 'intermediate' },
            { name: 'Wildcards (?, extends, super)', level: 'advanced' },
            { name: 'Type Erasure', level: 'advanced' },
          ]
        },
        {
          id: 'sec-2-3',
          title: 'File I/O & NIO',
          icon: '📁',
          status: 'core',
          topics: [
            { name: 'File & Path APIs', level: 'intermediate' },
            { name: 'BufferedReader / BufferedWriter', level: 'intermediate' },
            { name: 'FileInputStream / FileOutputStream', level: 'intermediate' },
            { name: 'NIO2 (Files, Paths)', level: 'intermediate' },
            { name: 'Serialization', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'phase-3',
      phase: 3,
      title: 'Java 8 Features',
      subtitle: 'Modern Java Programming',
      icon: '⚡',
      color: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.4)',
      estimatedWeeks: '4–5 weeks',
      sections: [
        {
          id: 'sec-3-1',
          title: 'Functional Programming',
          icon: '🔧',
          status: 'modern',
          topics: [
            { name: 'Lambda Expressions', level: 'intermediate' },
            { name: 'Functional Interfaces (Predicate, Function, Consumer, Supplier)', level: 'intermediate' },
            { name: 'Method References (::)', level: 'intermediate' },
            { name: 'Default & Static Interface Methods', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-3-2',
          title: 'Stream API',
          icon: '🌊',
          status: 'modern',
          topics: [
            { name: 'Creating Streams', level: 'intermediate' },
            { name: 'Intermediate Operations (filter, map, flatMap, sorted, distinct)', level: 'intermediate' },
            { name: 'Terminal Operations (collect, reduce, forEach, count)', level: 'intermediate' },
            { name: 'Collectors (toList, toMap, groupingBy, joining)', level: 'advanced' },
            { name: 'Parallel Streams', level: 'advanced' },
          ]
        },
        {
          id: 'sec-3-3',
          title: 'Optional & Date/Time API',
          icon: '📅',
          status: 'modern',
          topics: [
            { name: 'Optional Class (of, empty, isPresent, orElse)', level: 'intermediate' },
            { name: 'LocalDate, LocalTime, LocalDateTime', level: 'intermediate' },
            { name: 'ZonedDateTime & DateTimeFormatter', level: 'intermediate' },
            { name: 'Period & Duration', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'phase-4',
      phase: 4,
      title: 'Java 11, 17 & 21 Features',
      subtitle: 'Latest Java Capabilities',
      icon: '🚀',
      color: '#14b8a6',
      glow: 'rgba(20, 184, 166, 0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'sec-4-1',
          title: 'Java 11 Highlights',
          icon: '✨',
          status: 'modern',
          topics: [
            { name: 'var (Local Variable Type Inference)', level: 'intermediate' },
            { name: 'String Methods (isBlank, strip, lines, repeat)', level: 'intermediate' },
            { name: 'HttpClient API', level: 'intermediate' },
            { name: 'New Collection Methods (copyOf, of)', level: 'beginner' },
          ]
        },
        {
          id: 'sec-4-2',
          title: 'Java 17 Highlights',
          icon: '🌟',
          status: 'modern',
          topics: [
            { name: 'Sealed Classes', level: 'advanced' },
            { name: 'Records', level: 'intermediate' },
            { name: 'Pattern Matching for instanceof', level: 'intermediate' },
            { name: 'Text Blocks (Multi-line Strings)', level: 'intermediate' },
            { name: 'Switch Expressions', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-4-3',
          title: 'Java 21 Highlights',
          icon: '💥',
          status: 'advanced',
          topics: [
            { name: 'Virtual Threads (Project Loom)', level: 'advanced' },
            { name: 'Pattern Matching for Switch', level: 'advanced' },
            { name: 'Sequenced Collections', level: 'intermediate' },
            { name: 'Record Patterns', level: 'advanced' },
            { name: 'String Templates (Preview)', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'phase-5',
      phase: 5,
      title: 'Multithreading & Concurrency',
      subtitle: 'Write High-Performance Code',
      icon: '🔀',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      estimatedWeeks: '3–4 weeks',
      sections: [
        {
          id: 'sec-5-1',
          title: 'Threading Basics',
          icon: '🧵',
          status: 'core',
          topics: [
            { name: 'Thread Lifecycle', level: 'intermediate' },
            { name: 'Extending Thread vs Runnable', level: 'intermediate' },
            { name: 'synchronized keyword', level: 'intermediate' },
            { name: 'volatile keyword', level: 'advanced' },
            { name: 'Thread.sleep(), join(), yield()', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-5-2',
          title: 'Concurrency Utilities',
          icon: '⚙️',
          status: 'advanced',
          topics: [
            { name: 'Executor Service & Thread Pools', level: 'advanced' },
            { name: 'Future & Callable', level: 'advanced' },
            { name: 'CompletableFuture', level: 'advanced' },
            { name: 'ReentrantLock & Semaphore', level: 'advanced' },
            { name: 'CountDownLatch & CyclicBarrier', level: 'advanced' },
            { name: 'Concurrent Collections (ConcurrentHashMap)', level: 'advanced' },
            { name: 'Atomic Classes (AtomicInteger, AtomicLong)', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'phase-6',
      phase: 6,
      title: 'Database & SQL',
      subtitle: 'Data Persistence Layer',
      icon: '🗄️',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      estimatedWeeks: '2–3 weeks',
      sections: [
        {
          id: 'sec-6-1',
          title: 'SQL Fundamentals',
          icon: '📊',
          status: 'core',
          topics: [
            { name: 'DDL (CREATE, ALTER, DROP)', level: 'beginner' },
            { name: 'DML (SELECT, INSERT, UPDATE, DELETE)', level: 'beginner' },
            { name: 'Joins (INNER, LEFT, RIGHT, FULL)', level: 'intermediate' },
            { name: 'Subqueries & CTEs', level: 'intermediate' },
            { name: 'Indexes & Performance', level: 'intermediate' },
            { name: 'Transactions & ACID', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-6-2',
          title: 'JDBC',
          icon: '🔌',
          status: 'core',
          topics: [
            { name: 'JDBC Architecture & Drivers', level: 'intermediate' },
            { name: 'Connection, Statement, ResultSet', level: 'intermediate' },
            { name: 'PreparedStatement vs Statement', level: 'intermediate' },
            { name: 'Connection Pooling (HikariCP)', level: 'advanced' },
            { name: 'Batch Processing', level: 'advanced' },
            { name: 'Transaction Management', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'phase-7',
      phase: 7,
      title: 'Hibernate & JPA',
      subtitle: 'Object-Relational Mapping',
      icon: '🏛️',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
      estimatedWeeks: '3–4 weeks',
      sections: [
        {
          id: 'sec-7-1',
          title: 'JPA Core',
          icon: '🗺️',
          status: 'core',
          topics: [
            { name: '@Entity, @Table, @Column', level: 'intermediate' },
            { name: 'Primary Keys (@Id, @GeneratedValue)', level: 'intermediate' },
            { name: 'Entity Lifecycle', level: 'intermediate' },
            { name: 'EntityManager & Persistence Context', level: 'advanced' },
            { name: 'JPQL & Criteria API', level: 'advanced' },
          ]
        },
        {
          id: 'sec-7-2',
          title: 'Hibernate Advanced',
          icon: '⚡',
          status: 'advanced',
          topics: [
            { name: 'Relationships (@OneToOne, @OneToMany, @ManyToMany)', level: 'advanced' },
            { name: 'Cascading & Fetch Types (EAGER vs LAZY)', level: 'advanced' },
            { name: 'N+1 Problem & Solutions', level: 'advanced' },
            { name: 'Second-Level Cache', level: 'advanced' },
            { name: 'Auditing & Timestamps', level: 'intermediate' },
          ]
        },
      ]
    },
    {
      id: 'phase-8',
      phase: 8,
      title: 'Spring Framework',
      subtitle: 'Enterprise Java Platform',
      icon: '🌱',
      color: '#22c55e',
      glow: 'rgba(34, 197, 94, 0.4)',
      estimatedWeeks: '4–5 weeks',
      sections: [
        {
          id: 'sec-8-1',
          title: 'Spring Core',
          icon: '🏗️',
          status: 'core',
          topics: [
            { name: 'IoC Container & Dependency Injection', level: 'intermediate' },
            { name: '@Component, @Service, @Repository, @Controller', level: 'intermediate' },
            { name: 'Bean Lifecycle & Scopes', level: 'advanced' },
            { name: '@Autowired, @Qualifier, @Primary', level: 'intermediate' },
            { name: 'ApplicationContext', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-8-2',
          title: 'Spring AOP',
          icon: '🔄',
          status: 'advanced',
          topics: [
            { name: 'Aspect-Oriented Programming Concepts', level: 'advanced' },
            { name: '@Aspect, @Around, @Before, @After', level: 'advanced' },
            { name: 'Pointcut Expressions', level: 'advanced' },
            { name: 'Logging with AOP', level: 'advanced' },
          ]
        },
        {
          id: 'sec-8-3',
          title: 'Spring Data JPA',
          icon: '💾',
          status: 'core',
          topics: [
            { name: 'JpaRepository & CrudRepository', level: 'intermediate' },
            { name: 'Custom Query Methods (findByXxx)', level: 'intermediate' },
            { name: '@Query with JPQL & Native SQL', level: 'intermediate' },
            { name: 'Pagination & Sorting', level: 'intermediate' },
            { name: 'Specifications', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'phase-9',
      phase: 9,
      title: 'Spring Boot',
      subtitle: 'Production-Ready Applications',
      icon: '🎯',
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.4)',
      estimatedWeeks: '4–6 weeks',
      sections: [
        {
          id: 'sec-9-1',
          title: 'Spring Boot Core',
          icon: '⚙️',
          status: 'core',
          topics: [
            { name: 'Auto-configuration & Starters', level: 'intermediate' },
            { name: 'application.properties / YAML', level: 'intermediate' },
            { name: '@ConfigurationProperties', level: 'intermediate' },
            { name: 'Profiles (dev, prod, test)', level: 'intermediate' },
            { name: 'Embedded Tomcat/Jetty', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-9-2',
          title: 'REST API Development',
          icon: '🌐',
          status: 'core',
          topics: [
            { name: '@RestController, @RequestMapping', level: 'intermediate' },
            { name: 'HTTP Methods (GET, POST, PUT, DELETE, PATCH)', level: 'intermediate' },
            { name: '@PathVariable & @RequestParam', level: 'intermediate' },
            { name: '@RequestBody & @ResponseBody', level: 'intermediate' },
            { name: 'ResponseEntity & HTTP Status Codes', level: 'intermediate' },
            { name: 'Global Exception Handling (@ControllerAdvice)', level: 'advanced' },
            { name: 'Bean Validation (@Valid, @NotNull)', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-9-3',
          title: 'Spring Security',
          icon: '🔐',
          status: 'advanced',
          topics: [
            { name: 'Authentication vs Authorization', level: 'intermediate' },
            { name: 'JWT (JSON Web Tokens)', level: 'advanced' },
            { name: 'OAuth2 & Social Login', level: 'advanced' },
            { name: 'SecurityFilterChain', level: 'advanced' },
            { name: 'RBAC (Role-Based Access Control)', level: 'advanced' },
            { name: 'CORS Configuration', level: 'intermediate' },
            { name: 'Password Encoding (BCrypt)', level: 'intermediate' },
          ]
        },
        {
          id: 'sec-9-4',
          title: 'Spring Boot Actuator & Testing',
          icon: '🧪',
          status: 'advanced',
          topics: [
            { name: 'Actuator Endpoints (health, metrics, info)', level: 'intermediate' },
            { name: 'JUnit 5 Unit Testing', level: 'intermediate' },
            { name: 'Mockito & Mocking', level: 'advanced' },
            { name: '@SpringBootTest Integration Tests', level: 'advanced' },
            { name: 'MockMvc for REST Testing', level: 'advanced' },
            { name: 'Test Containers', level: 'advanced' },
          ]
        },
      ]
    },
    {
      id: 'phase-10',
      phase: 10,
      title: 'Microservices & DevOps',
      subtitle: 'Scalable Architecture',
      icon: '🏗️',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.4)',
      estimatedWeeks: '4–6 weeks',
      sections: [
        {
          id: 'sec-10-1',
          title: 'Microservices Patterns',
          icon: '🔗',
          status: 'advanced',
          topics: [
            { name: 'Monolith vs Microservices', level: 'intermediate' },
            { name: 'Service Discovery (Eureka)', level: 'advanced' },
            { name: 'API Gateway (Spring Cloud Gateway)', level: 'advanced' },
            { name: 'Circuit Breaker (Resilience4j)', level: 'advanced' },
            { name: 'Config Server', level: 'advanced' },
            { name: 'Load Balancing', level: 'advanced' },
          ]
        },
        {
          id: 'sec-10-2',
          title: 'Messaging & Events',
          icon: '📨',
          status: 'advanced',
          topics: [
            { name: 'Apache Kafka Basics', level: 'advanced' },
            { name: 'Producers & Consumers', level: 'advanced' },
            { name: 'RabbitMQ', level: 'advanced' },
            { name: 'Event-Driven Architecture', level: 'advanced' },
          ]
        },
        {
          id: 'sec-10-3',
          title: 'DevOps & Deployment',
          icon: '🚢',
          status: 'advanced',
          topics: [
            { name: 'Docker & Dockerfiles', level: 'intermediate' },
            { name: 'Docker Compose', level: 'intermediate' },
            { name: 'CI/CD Pipelines (GitHub Actions)', level: 'advanced' },
            { name: 'Kubernetes Basics', level: 'advanced' },
            { name: 'Cloud Deployment (AWS / GCP / Azure)', level: 'advanced' },
            { name: 'Monitoring (Prometheus + Grafana)', level: 'advanced' },
          ]
        },
      ]
    },
  ]
};

export const allRoadmaps = [
  {
    id: 'java',
    title: 'Java Backend',
    icon: '☕',
    gradient: 'linear-gradient(135deg, #f89820, #e74c3c)',
    description: 'Core Java to Microservices',
    status: 'available',
    phases: 10,
  },
  {
    id: 'react',
    title: 'React Frontend',
    icon: '⚛️',
    gradient: 'linear-gradient(135deg, #61dafb, #0ea5e9)',
    description: 'HTML to Production React Apps',
    status: 'coming-soon',
    phases: 8,
  },
  {
    id: 'fullstack',
    title: 'Full Stack',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    description: 'Complete Web Developer Path',
    status: 'coming-soon',
    phases: 12,
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    description: 'Docker to Kubernetes & Cloud',
    status: 'coming-soon',
    phases: 7,
  },
  {
    id: 'python',
    title: 'Python Backend',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3b82f6, #fbbf24)',
    description: 'Python & Django / FastAPI',
    status: 'coming-soon',
    phases: 9,
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    icon: '💚',
    gradient: 'linear-gradient(135deg, #16a34a, #84cc16)',
    description: 'JavaScript Backend Development',
    status: 'coming-soon',
    phases: 8,
  },
];
