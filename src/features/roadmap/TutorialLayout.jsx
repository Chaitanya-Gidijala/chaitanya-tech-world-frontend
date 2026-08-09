import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { genAiData } from './data/genAiData';
import { whatIsGenAiContent } from './data/content/whatIsGenAi';
import './TutorialLayout.css';

// A simple map to simulate dynamic imports for our content
const contentMap = {
  'what-is-gen-ai': whatIsGenAiContent,
  // we can add others as we generate them
};

const TutorialLayout = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const course = genAiData; // Hardcoded to genAiData for now, but could be dynamic based on a courseId param
  
  // Find current topic
  let currentTopic = null;
  let currentPhase = null;
  
  course.phases.forEach(phase => {
    const topic = phase.topics.find(t => t.id === topicId);
    if (topic) {
      currentTopic = topic;
      currentPhase = phase;
    }
  });

  // Default to first topic if none found
  useEffect(() => {
    if (!currentTopic && course.phases[0].topics.length > 0) {
      navigate(`/tutorial/gen-ai/${course.phases[0].topics[0].id}`, { replace: true });
    }
  }, [currentTopic, navigate, course]);

  if (!currentTopic) return null;

  const content = contentMap[currentTopic.id] || `### Content for ${currentTopic.title} is coming soon!`;

  return (
    <div className="cc-tutorial-container">
      {/* Mobile Header / Menu Toggle */}
      <div className="cc-tutorial-mobile-header">
        <button className="cc-tutorial-menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="cc-tutorial-mobile-title">{course.title}</span>
      </div>

      {/* Sidebar Navigation */}
      <div className={`cc-tutorial-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="cc-tutorial-sidebar-header">
          <Link to="/roadmap" className="cc-tutorial-back-link">
            ← Back to Roadmaps
          </Link>
          <h2>{course.title}</h2>
          <button className="cc-tutorial-close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>

        <nav className="cc-tutorial-nav">
          {course.phases.map((phase, pIdx) => (
            <div key={phase.id} className="cc-tutorial-nav-phase">
              <h4 className="cc-tutorial-nav-phase-title">
                <span className="cc-phase-num">Phase {pIdx + 1}</span>
                {phase.title}
              </h4>
              <ul className="cc-tutorial-nav-topics">
                {phase.topics.map(topic => (
                  <li key={topic.id}>
                    <Link
                      to={`/tutorial/gen-ai/${topic.id}`}
                      className={`cc-tutorial-nav-link ${topic.id === currentTopic.id ? 'active' : ''}`}
                      onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after clicking
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="cc-tutorial-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="cc-tutorial-content-wrapper">
        <main className="cc-tutorial-main">
          <div className="cc-tutorial-breadcrumbs">
            <span>{course.title}</span> <span className="separator">/</span>
            <span>{currentPhase?.title}</span>
          </div>
          
          <div className="cc-tutorial-markdown">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div className="cc-tutorial-footer">
            <p>End of {currentTopic.title}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorialLayout;
