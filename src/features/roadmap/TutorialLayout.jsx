import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import RoadmapNavbar from './RoadmapNavbar';
import LandingFooter from '@/components/layout/LandingFooter';
import { genAiData } from './data/genAiData';
import { whatIsGenAiContent } from './data/content/whatIsGenAi';
import { nextTokenPredictionContent } from './data/content/nextTokenPrediction';
import { howAiThinksContent } from './data/content/howAiThinks';
import { tokensAndContextContent } from './data/content/tokensAndContext';
import { controllingAiContent } from './data/content/controllingAi';
import { multimodalAiContent } from './data/content/multimodalAi';
import { anatomyOfAPromptContent } from './data/content/anatomyOfAPrompt';
import { zeroVsFewShotContent } from './data/content/zeroVsFewShot';
import { actAsTechniqueContent } from './data/content/actAsTechnique';
import { chainOfThoughtContent } from './data/content/chainOfThought';
import { outputFormattingContent } from './data/content/outputFormatting';
import { providingContextContent } from './data/content/providingContext';
import { whatIsAnAgentContent } from './data/content/whatIsAnAgent';
import { introToMcpContent } from './data/content/introToMcp';
import { mcpExamplesContent } from './data/content/mcpExamples';

// New Phase 1 Imports
import { content as aiVsMlVsDlContent } from './data/content/ai-vs-ml-vs-dl';
import { content as trainingVsInferenceContent } from './data/content/training-vs-inference';
import { content as pretrainingVsFinetuningContent } from './data/content/pretraining-vs-finetuning';
import { content as hallucinationsContent } from './data/content/hallucinations';

// New Phase 2 Imports
import { content as whatIsPromptEngineeringContent } from './data/content/what-is-prompt-engineering';
import { content as positiveNegativeInstructionsContent } from './data/content/positive-negative-instructions';
import { content as promptTemplatesContent } from './data/content/prompt-templates';
import { content as promptChainingContent } from './data/content/prompt-chaining';
import { content as commonPromptingMistakesContent } from './data/content/common-prompting-mistakes';

// New Phase 3 Imports
import { introToLlmApisContent } from './data/content/introToLlmApis';
import { chatVsCompletionsContent } from './data/content/chatVsCompletions';
import { structuredOutputsContent } from './data/content/structuredOutputs';
import { contextManagementContent } from './data/content/contextManagement';
import { streamingResponsesContent } from './data/content/streamingResponses';
import { requestResponseLifecycleContent } from './data/content/requestResponseLifecycle';
import { tokenUsageCostContent } from './data/content/tokenUsageCost';
import { rateLimitsRetriesContent } from './data/content/rateLimitsRetries';

// New Phase 4 Imports
import { whatAreEmbeddingsContent } from './data/content/whatAreEmbeddings';
import { textToVectorContent } from './data/content/textToVector';
import { keywordVsSemanticContent } from './data/content/keywordVsSemantic';
import { cosineSimilarityContent } from './data/content/cosineSimilarity';
import { embeddingModelsContent } from './data/content/embeddingModels';

import './TutorialLayout.css';

// Map topic IDs to their markdown content
const contentMap = {
  // Phase 1
  'ai-vs-ml-vs-dl': aiVsMlVsDlContent,
  'what-is-gen-ai': whatIsGenAiContent,
  'next-token-prediction': nextTokenPredictionContent,
  'how-ai-thinks': howAiThinksContent,
  'tokens-and-context': tokensAndContextContent,
  'controlling-ai': controllingAiContent,
  'training-vs-inference': trainingVsInferenceContent,
  'pretraining-vs-finetuning': pretrainingVsFinetuningContent,
  'hallucinations': hallucinationsContent,
  'multimodal-ai': multimodalAiContent,

  // Phase 2
  'what-is-prompt-engineering': whatIsPromptEngineeringContent,
  'anatomy-of-a-prompt': anatomyOfAPromptContent,
  'zero-vs-few-shot': zeroVsFewShotContent,
  'act-as-technique': actAsTechniqueContent,
  'chain-of-thought': chainOfThoughtContent,
  'output-formatting': outputFormattingContent,
  'positive-negative-instructions': positiveNegativeInstructionsContent,
  'prompt-templates': promptTemplatesContent,
  'prompt-chaining': promptChainingContent,
  'common-prompting-mistakes': commonPromptingMistakesContent,

  // Phase 3
  'intro-to-llm-apis': introToLlmApisContent,
  'request-response-lifecycle': requestResponseLifecycleContent,
  'chat-vs-completions': chatVsCompletionsContent,
  'streaming-responses': streamingResponsesContent,
  'structured-outputs': structuredOutputsContent,
  'token-usage-cost': tokenUsageCostContent,
  'context-management': contextManagementContent,
  'rate-limits-retries': rateLimitsRetriesContent,

  // Phase 4
  'what-are-embeddings': whatAreEmbeddingsContent,
  'text-to-vector': textToVectorContent,
  'keyword-vs-semantic': keywordVsSemanticContent,
  'cosine-similarity': cosineSimilarityContent,
  'embedding-models': embeddingModelsContent,

  // Existing Other Phases
  'providing-context': providingContextContent,
  'what-is-an-agent': whatIsAnAgentContent,
  'intro-to-mcp': introToMcpContent,
  'mcp-examples': mcpExamplesContent,
};

const TutorialLayout = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

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

  const content = contentMap[currentTopic.id] || `
# ${currentTopic.title}

<br/>

> [!TIP]
> **Content Coming Soon!** 
> 
> We are actively writing this comprehensive guide as part of our massive curriculum expansion. Please check back shortly for the full lesson!
`;

  return (
    <div className="cc-tutorial-root">
      <RoadmapNavbar theme={theme} toggleTheme={toggleTheme} />
      
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
        
        <LandingFooter />
      </div>
    </div>
    </div>
  );
};

export default TutorialLayout;
