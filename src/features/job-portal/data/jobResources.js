export const JOB_RESOURCES = {
    1: { // Senior React Developer
        interviewQuestions: [
            {
                question: "What is the Virtual DOM and how does it work?",
                answer: "The Virtual DOM is a lightweight copy of the real DOM. React keeps it in memory and syncs it with the real DOM. When state changes, React updates the Virtual DOM, diffs it with the previous version, and blindly updates only the changed parts in the real DOM (Reconciliation)."
            },
            {
                question: "Explain the difference between useMemo and useCallback.",
                answer: "useMemo is used to memoize the result of a calculation to avoid expensive re-computations. useCallback is used to memoize a function definition to prevent it from being recreated on every render, which is useful when passing callbacks to optimized child components."
            },
            {
                question: "How do you manage state in a large React application?",
                answer: "For local state, useState/useReducer. For global state, Context API, Redux, Zustand, or Recoil. Server state is often managed with React Query or SWR."
            }
        ],
        resources: [
            {
                title: "React Official Documentation",
                url: "https://react.dev/",
                type: "link"
            },
            {
                title: "Advanced React Patterns PDF",
                url: "https://example.com/advanced-react.pdf",
                type: "pdf"
            },
            {
                title: "Redux Toolkit Guide",
                url: "https://redux-toolkit.js.org/",
                type: "link"
            }
        ],
        mcqQuestions: [
            {
                id: 1,
                question: "What is the primary purpose of React keys?",
                options: [
                    "To bind data to components",
                    "To identify which items have changed, are added, or are removed",
                    "To style lists elements",
                    "To enforce unique IDs in the DOM"
                ],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Which hook would you use to perform side effects?",
                options: ["useState", "useReducer", "useEffect", "useContext"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "What is Prop Drilling?",
                options: [
                    "Passing tools to child components",
                    "Passing data through multiple levels of components",
                    "A method to debug props",
                    "Injecting props directly into the DOM"
                ],
                correctAnswer: 1
            },
            {
                id: 4,
                question: "Which of the following is NOT a hook?",
                options: ["useState", "useReact", "useMemo", "useRef"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "What does the virtual DOM improve?",
                options: ["SEO", "Browser Rendering Speed", "Network Latency", "Database Queries"],
                correctAnswer: 1
            }
        ]
    },
    2: { // Java Backend Engineer
        interviewQuestions: [
            {
                question: "What is the difference between Checked and Unchecked Exceptions in Java?",
                answer: "Checked exceptions are checked at compile-time (e.g., IOException) and must be handled. Unchecked exceptions are checked at runtime (e.g., NullPointerException) and don't force explicit handling."
            },
            {
                question: "Explain Dependency Injection in Spring Boot.",
                answer: "Dependency Injection is a design pattern where the IoC container keeps track of objects (beans) and injects them into other objects that need them, promoting loose coupling."
            }
        ],
        resources: [
            {
                title: "Spring Boot Reference Guide",
                url: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
                type: "link"
            },
            {
                title: "Java Concurrency in Practice",
                url: "https://jcip.net/",
                type: "link"
            }
        ],
        mcqQuestions: [
            {
                id: 1,
                question: "What is the default scope of a Spring Bean?",
                options: ["Prototype", "Singleton", "Request", "Session"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Which annotation is used to denote a service layer component?",
                options: ["@Component", "@Repository", "@Service", "@Controller"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "What does JRE stand for?",
                options: ["Java Runtime Environment", "Java Running Earth", "Java Runtime Edition", "Java Read Environment"],
                correctAnswer: 0
            }
        ]
    },
    3: { // UI/UX Designer
        interviewQuestions: [
            {
                question: "What is the difference between UX and UI?",
                answer: "UX (User Experience) focuses on the overall feel of the experience, while UI (User Interface) focuses on the look and layout of the product."
            }
        ],
        resources: [
            {
                title: "Nielsen Norman Group UX Articles",
                url: "https://www.nngroup.com/articles/",
                type: "link"
            },
            {
                title: "Figma Community Files",
                url: "https://www.figma.com/community",
                type: "link"
            }
        ],
        mcqQuestions: [
            {
                id: 1,
                question: "What is the Golden Ratio?",
                options: ["1:1.5", "1:1.618", "1:1.414", "1:2"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Which tool is primarily used for vector graphics?",
                options: ["Photoshop", "Illustrator", "Premiere Pro", "Lightroom"],
                correctAnswer: 1
            }
        ]
    }
};
