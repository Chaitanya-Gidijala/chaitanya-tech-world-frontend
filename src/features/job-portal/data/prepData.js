export const PREP_TOPICS = [
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'javascript', name: 'JavaScript', icon: 'JS' },
    { id: 'spring', name: 'Spring Boot', icon: '🍃' },
    { id: 'frontend', name: 'Frontend', icon: '🎨' },
    { id: 'backend', name: 'Backend', icon: '⚙️' },
    { id: 'database', name: 'Database', icon: '🗄️' },
    { id: 'devops', name: 'DevOps', icon: '🚀' }
];

export const PREP_QUESTIONS = [
    {
        id: 1,
        question: "What is the difference between Hooks and Class components in React?",
        answer: "Hooks allow you to use state and other React features without writing a class. They provide a more functional approach to component logic, better code reuse, and easier testing compared to life-cycle methods in class components.",
        difficulty: "Intermediate",
        tags: ["React", "JavaScript", "Frontend"],
    },
    {
        id: 2,
        question: "How does Dependency Injection work in Spring?",
        answer: "Dependency Injection is a design pattern that removes the dependency from the programming code so that it can be easy to manage and test the application. In Spring, the Inversion of Control (IoC) container is responsible for creating objects, wiring them together, and managing their complete life cycle.",
        difficulty: "Intermediate",
        tags: ["Java", "Spring", "Backend"],
    },
    {
        id: 3,
        question: "Explain the 'this' keyword in JavaScript.",
        answer: "The 'this' keyword refers to the object it belongs to. It has different values depending on where it is used: In a method, 'this' refers to the owner object. Alone, 'this' refers to the global object.",
        difficulty: "Easy",
        tags: ["JavaScript", "Frontend"],
    },
    {
        id: 4,
        question: "What are Java Streams and why are they used?",
        answer: "Java Streams represent a sequence of elements and support different kinds of operations to perform calculations upon those elements. They allow developers to process data in a declarative way, similar to SQL queries, and can be used for both sequential and parallel processing.",
        difficulty: "Intermediate",
        tags: ["Java", "Backend"],
    },
    {
        id: 5,
        question: "Explain Redux middleware.",
        answer: "Redux middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It is commonly used for logging, crash reporting, performing asynchronous tasks like API calls, and more.",
        difficulty: "Hard",
        tags: ["React", "JavaScript", "Frontend"],
    },
    {
        id: 'd1', question: 'Explain React Fiber and its reconciliation algorithm.',
        answer: 'React Fiber is a complete rewrite of the React core algorithm that enables incremental rendering. It splits rendering work into chunks spread over multiple frames, making complex UIs feel smoother. The reconciler compares a virtual DOM tree to the actual DOM and applies only the necessary changes — a process called diffing. Fiber introduces priority-based scheduling so high-priority updates (like animations) preempt low-priority ones (like data fetching).',
        difficulty: 'Hard', tags: ['React', 'Core'],
        keyPoints: ['Enables incremental rendering via time-slicing', 'Priority-based task scheduling', 'Enables Concurrent Mode and Suspense', 'Diffing runs in phases: render & commit']
    },
    {
        id: 'd2', question: 'What is the Event Loop in Node.js?',
        answer: 'The event loop allows Node.js to perform non-blocking I/O operations despite being single-threaded. When an async operation is initiated (e.g., reading a file), Node delegates it to the OS and registers a callback. The event loop continuously checks if operations are done and runs their callbacks. It cycles through phases: Timers, Pending Callbacks, I/O Poll, Check (setImmediate), and Close Callbacks.',
        difficulty: 'Intermediate', tags: ['Node.js', 'Runtime'],
        keyPoints: ['Single-threaded non-blocking I/O', '6 phases: timers → I/O → check → close', 'libuv provides the thread pool for heavy tasks', 'process.nextTick runs before each phase']
    },
    {
        id: 'd3', question: 'How does Dependency Injection work in Spring Boot?',
        answer: 'Dependency Injection (DI) is a design pattern implementing Inversion of Control — objects receive their dependencies from an external container instead of creating them. Spring\'s IoC container manages bean lifecycle. You use @Component, @Service, or @Repository to register beans, and @Autowired or constructor injection to wire them. Constructor injection is preferred for immutability and testability.',
        difficulty: 'Intermediate', tags: ['Java', 'Spring'],
        keyPoints: ['IoC container manages all bean lifecycles', 'Constructor injection > field injection', '@Autowired, @Qualifier for wiring', 'Enables easy mocking in unit tests']
    },
    {
        id: 'd4', question: 'ACID vs BASE properties in Database Systems.',
        answer: 'ACID (Atomicity, Consistency, Isolation, Durability) is the gold standard for relational databases — every transaction is treated as a single unit that either fully succeeds or fully rolls back. BASE (Basically Available, Soft state, Eventual consistency) is the trade-off in distributed NoSQL systems that prioritize availability and partition tolerance over strict data consistency, allowing stale reads temporarily.',
        difficulty: 'Hard', tags: ['SQL', 'NoSQL'],
        keyPoints: ['ACID → strong consistency, used in RDBMS', 'BASE → high availability, used in NoSQL', 'CAP theorem: you can only guarantee 2 of 3', 'Eventual consistency ≠ no consistency']
    },
    {
        id: 'd5', question: 'Explain JWT authentication and its workflow.',
        answer: 'JSON Web Token (JWT) is a compact, URL-safe token format with three base64-encoded parts: Header (algorithm), Payload (claims), and Signature. Workflow: user logs in → server creates and signs a JWT with a secret → client stores the JWT → client sends it in the Authorization header on every request → server verifies the signature without hitting the database.',
        difficulty: 'Easy', tags: ['Auth', 'Web'],
        keyPoints: ['Stateless — no session storage needed', 'Three parts: header.payload.signature', 'Use short expiry + refresh tokens', 'Never store sensitive data in payload (it\'s base64, not encrypted)']
    },
    {
        id: 'd6', question: 'What are the main differences between Python 2 and Python 3?',
        answer: 'Python 3 introduced print() as a function, true division (3/2 = 1.5 vs 1), native Unicode strings, and superior async support via asyncio. It also improved error handling with exception chaining, removed outdated modules, and made iterators the default (range instead of xrange). Python 2 reached end-of-life in January 2020.',
        difficulty: 'Easy', tags: ['Python', 'System'],
        keyPoints: ['print() is a function in Py3', 'Integer division changed: 3/2 = 1.5', 'Strings are Unicode by default', 'asyncio, f-strings, type hints are Py3 only']
    },
    {
        id: 'd7', question: 'What is the difference between TCP and UDP?',
        answer: 'TCP (Transmission Control Protocol) is connection-oriented — it performs a 3-way handshake, ensures data delivery via acknowledgments, retransmits lost packets, and guarantees order. UDP (User Datagram Protocol) is connectionless — it fires packets without handshaking or guarantees, trading reliability for raw speed.',
        difficulty: 'Intermediate', tags: ['Networking', 'System'],
        keyPoints: ['TCP → reliable, ordered, connection-based', 'UDP → fast, no guarantees, connectionless', 'TCP uses 3-way handshake (SYN, SYN-ACK, ACK)', 'Use UDP for streaming, DNS, gaming']
    },
    {
        id: 'd8', question: 'Explain Big O Notation and time complexity.',
        answer: 'Big O notation describes the upper-bound growth rate of an algorithm\'s runtime as input size n grows. Common complexities: O(1) constant, O(log n) logarithmic (binary search), O(n) linear (simple loop), O(n log n) linearithmic (merge sort), O(n²) quadratic (bubble sort), O(2ⁿ) exponential (subset enumeration). Always analyze the worst-case scenario unless stated otherwise.',
        difficulty: 'Easy', tags: ['DSA', 'Core'],
        keyPoints: ['Describes worst-case growth, not exact time', 'Drop constants: O(2n) = O(n)', 'Space complexity matters too', 'Binary search is O(log n) — halves input each step']
    }
];

export const PREP_TESTS = [
    {
        id: 'java-basic',
        title: 'Java Fundamentals Quiz',
        duration: 20, // minutes
        totalQuestions: 15,
        tags: ["Java", "Backend"],
        questions: [
            {
                id: 1,
                question: "Which of these is NOT a primitive type in Java?",
                options: ["int", "boolean", "String", "char"],
                correctAnswer: "String",
                difficulty: "Easy"
            },
            {
                id: 2,
                question: "What is the default value of an object reference in Java?",
                options: ["null", "0", "undefined", "empty"],
                correctAnswer: "null",
                difficulty: "Easy"
            }
        ]
    },
    {
        id: 'react-hooks',
        title: 'React Hooks Mastery',
        duration: 15,
        totalQuestions: 10,
        tags: ["React", "Frontend"],
        questions: [
            {
                id: 1,
                question: "Which hook is used to handle side effects in functional components?",
                options: ["useState", "useEffect", "useContext", "useReducer"],
                correctAnswer: "useEffect",
                difficulty: "Easy"
            }
        ]
    }
];

export const PREP_RESOURCES = [
    {
        id: 1,
        title: "React Official Documentation",
        url: "https://react.dev",
        type: "link",
        tags: ["React", "Frontend"],
        description: "Official documentation and tutorials for React."
    },
    {
        id: 2,
        title: "Spring Boot Guide (PDF)",
        url: "#",
        type: "pdf",
        tags: ["Spring", "Backend", "Java"],
        description: "A comprehensive guide to building microservices with Spring Boot."
    },
    {
        id: 3,
        title: "Modern JavaScript (Video Course)",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        type: "video",
        tags: ["JavaScript", "Frontend"],
        description: "Crash course on ES6+ features."
    }
];
