import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Phone, ChevronRight, 
  Code, Database, Server, Cloud, Shield, Wrench, Monitor, Activity 
} from 'lucide-react';
import './PortfolioPage.css';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PortfolioPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skills = [
    {
      category: "Languages",
      icon: <Code size={20} />,
      items: ["Java 17/21", "SQL"]
    },
    {
      category: "Frameworks",
      icon: <Monitor size={20} />,
      items: ["Spring Boot 3.x", "Spring MVC", "Spring Data JPA", "Hibernate ORM", "RESTful APIs", "Microservices Architecture", "JDBC"]
    },
    {
      category: "Messaging & Streaming",
      icon: <Activity size={20} />,
      items: ["Apache Kafka", "Rabbit MQ"]
    },
    {
      category: "Databases",
      icon: <Database size={20} />,
      items: ["MySQL", "SQL query optimization", "Redis (caching)", "JDBC"]
    },
    {
      category: "CI/CD & DevOps",
      icon: <Server size={20} />,
      items: ["Jenkins CI/CD", "Docker", "Kubernetes (K8s)", "Helm Charts", "SonarQube"]
    },
    {
      category: "Cloud & Security",
      icon: <Cloud size={20} />,
      items: ["AWS", "JWT", "OAuth 2.0", "RBAC", "HTTPS/TLS", "Swagger/OpenAPI 3.0"]
    },
    {
      category: "AI & Dev Tools",
      icon: <Wrench size={20} />,
      items: ["GitHub Copilot", "Agentic AI workflows", "GenAI code review", "JUnit 5", "Mockito", "Postman", "Git/GitHub"]
    }
  ];

  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-bg-glow"></div>
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span variants={fadeIn} className="hero-greeting">Hi, I am</motion.span>
            <motion.h1 variants={fadeIn} className="hero-name">Chaitanya Gidijala.</motion.h1>
            <motion.h2 variants={fadeIn} className="hero-title">Java Developer | Spring Boot | AI-Native</motion.h2>
            <motion.p variants={fadeIn} className="hero-description">
              I'm a Java Developer with experience building, testing, and operating production Spring Boot microservices on enterprise platforms processing 50,000+ daily transactions. I leverage agentic AI workflows and GitHub Copilot to deliver robust, secure, and highly optimized REST APIs.
            </motion.p>
            <motion.div variants={fadeIn} className="hero-actions">
              <a href="mailto:chaitugidijala@gmail.com" className="btn-primary">
                Get In Touch
              </a>
              <div className="social-links">
                <a href="https://linkedin.com/in/chaitanya-gidijala" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://github.com/chaitanya-gidijala" target="_blank" rel="noreferrer" className="social-link" title="GitHub">
                  <Github size={20} />
                </a>
                <a href="mailto:chaitugidijala@gmail.com" className="social-link" title="Email">
                  <Mail size={20} />
                </a>
                <a href="tel:+917337072766" className="social-link" title="Phone">
                  <Phone size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SKILLS SECTION */}
        <motion.section 
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="section-title">Core Skills</h2>
          <motion.div className="skills-grid" variants={staggerContainer}>
            {skills.map((skill, index) => (
              <motion.div key={index} className="skill-category-card" variants={fadeIn}>
                <div className="skill-category-header">
                  {skill.icon}
                  <h3>{skill.category}</h3>
                </div>
                <div className="skill-tags">
                  {skill.items.map((item, i) => (
                    <span key={i} className="skill-tag">{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* EXPERIENCE SECTION */}
        <motion.section 
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="section-title">Professional Experience</h2>
          <div className="experience-timeline">
            
            <motion.div className="experience-card" variants={fadeIn}>
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">Java Developer</h3>
                  <h4 className="exp-company">Capgemini (Client: GE Aerospace)</h4>
                </div>
                <span className="exp-date">Aug 2024 - Present</span>
              </div>
              <ul className="exp-details">
                <li>Owned end-to-end delivery of a core Spring Boot microservice processing 50,000+ daily transactions across US, UK & India operations.</li>
                <li>Built and maintained 15+ Spring Boot REST APIs for aircraft parts tracking and maintenance operations.</li>
                <li>Reduced API response latency by 50% (800ms → 400ms) by optimizing SQL queries, adding composite indexing, and tuning connection pooling.</li>
                <li>Containerized the microservice with Docker multi-stage builds and authored a Helm chart for Kubernetes, cutting deployment time by 80%.</li>
                <li>Secured REST APIs with JWT authentication, OAuth 2.0, and RBAC, applying security considerations to aerospace operational data.</li>
                <li>Used Apache Kafka for event-driven communication and Apache Flink for real-time stream processing.</li>
                <li>Appointed COE Team Lead - ran daily knowledge-transfer sessions on Docker, Kubernetes, Jenkins, and Helm for 7 junior developers.</li>
              </ul>
            </motion.div>

            <motion.div className="experience-card" variants={fadeIn}>
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">Java Backend Developer (Independent Project)</h3>
                  <h4 className="exp-company">Chaitanya Tech World</h4>
                </div>
                <span className="exp-date">2024 - Present</span>
              </div>
              <ul className="exp-details">
                <li>Built Spring Boot REST APIs for a Resume Builder and Job Portal, applying production-grade validation and exception handling.</li>
                <li>Implemented JWT-based authentication with token generation, validation, and protected routes.</li>
                <li>Used Spring Data JPA with SQL (MySQL) to model job listings and user profiles, including custom queries and dynamic search.</li>
                <li>Integrated the iText library for on-the-fly PDF resume generation.</li>
              </ul>
            </motion.div>

            <motion.div className="experience-card" variants={fadeIn}>
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">WebMethods AI (Independent Project)</h3>
                  <h4 className="exp-company">Chaitanya Tech World</h4>
                </div>
                <span className="exp-date">2026 - Present</span>
              </div>
              <ul className="exp-details">
                <li>Designed and built an AI-assisted tool that automatically generates webMethods IS packages and scaffolds their structure.</li>
                <li>Built an auto-documentation engine that parses package/flow-service structure and generates technical documentation.</li>
                <li>Developed an AI-driven error analyzer that inspects flow service logs and configurations to surface likely root causes.</li>
                <li>Built frontend in React.js and backend in Java Spring Boot REST APIs, integrating LLM-based generation logic.</li>
              </ul>
            </motion.div>

          </div>
        </motion.section>

        {/* EDUCATION & CERTIFICATIONS */}
        <motion.section 
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="edu-cert-grid">
            
            {/* Education */}
            <div>
              <h2 className="section-title">Education</h2>
              <motion.div className="edu-card" variants={fadeIn}>
                <h4>Master of Computer Applications (MCA)</h4>
                <div className="edu-meta">
                  <span>Andhra University, Visakhapatnam</span>
                  <span>CGPA: 8.6 | 2024-2026</span>
                </div>
              </motion.div>
              <motion.div className="edu-card" variants={fadeIn}>
                <h4>Bachelor of Science, Computer Science</h4>
                <div className="edu-meta">
                  <span>Dr. B.R. Ambedkar University, Sri GCSR College, Rajam</span>
                  <span>CGPA: 8.2 | 2019-2022</span>
                </div>
              </motion.div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="section-title">Certifications</h2>
              <motion.div className="cert-card" variants={fadeIn}>
                <h4>Microsoft GitHub Copilot for Software Engineering Practitioners</h4>
                <div className="cert-meta">2026</div>
              </motion.div>
              <motion.div className="cert-card" variants={fadeIn}>
                <h4>GitHub Copilot Fundamentals: AI-Paired Programming</h4>
                <div className="cert-meta">2026</div>
              </motion.div>
              <motion.div className="cert-card" variants={fadeIn}>
                <h4>Java OCEAN Certification Level 1 & Level 2</h4>
                <div className="cert-meta">Capgemini (2025, 2026)</div>
              </motion.div>
              <motion.div className="cert-card" variants={fadeIn}>
                <h4>Java Full Stack Developer Certification</h4>
                <div className="cert-meta">Frontlines Media Edutech Pvt. Ltd. (2024)</div>
              </motion.div>
            </div>

          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="portfolio-footer">
          <p>© {new Date().getFullYear()} Chaitanya Gidijala. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default PortfolioPage;
