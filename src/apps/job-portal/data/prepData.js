
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
