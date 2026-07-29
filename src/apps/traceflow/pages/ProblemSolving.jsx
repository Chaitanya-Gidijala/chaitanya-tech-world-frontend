import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Check, TerminalSquare, AlertCircle, Settings, Maximize2, Minimize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { DSA_PROBLEMS } from '../algorithms/index.js';
import config from '../../../config/apiConfig.js';
import './ProblemSolving.css';

const LANGUAGES = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++'
};

export default function ProblemSolving({ theme }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [nextProblemSlug, setNextProblemSlug] = useState(null);
  
  // Mobile guard
  const [isMobile, setIsMobile] = useState(false);
  
  // IDE State
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  
  // Console State
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases', 'result'
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  // Splitter & Maximize State
  const [leftWidth, setLeftWidth] = useState(45); // percentage
  const [consoleHeight, setConsoleHeight] = useState(300); // pixels
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingConsole, setIsResizingConsole] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Left Pane Tab State
  const [leftTab, setLeftTab] = useState('description'); // 'description', 'solutions', 'submissions'
  const [solutionLang, setSolutionLang] = useState('python');
  
  // Editor Validation State
  const [editorMarkers, setEditorMarkers] = useState([]);

  const handleEditorValidation = (markers) => {
    setEditorMarkers(markers);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentIndex = DSA_PROBLEMS.findIndex(p => p.id === slug);
    if (currentIndex !== -1) {
      setProblem(DSA_PROBLEMS[currentIndex]);
      setCode(DSA_PROBLEMS[currentIndex].starterCode?.[language] || '');
      setRunResult(null);
      setActiveTab('testcases');
      
      if (currentIndex < DSA_PROBLEMS.length - 1) {
        setNextProblemSlug(DSA_PROBLEMS[currentIndex + 1].id);
      } else {
        setNextProblemSlug(null);
      }
    } else {
      navigate('/catalogue');
    }
  }, [slug, navigate, language]);

  // Resizer logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) {
          setLeftWidth(newWidth);
        }
      } else if (isResizingConsole) {
        // Calculate height from bottom of screen
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 48 && newHeight < window.innerHeight * 0.8) {
          setConsoleHeight(newHeight);
          setConsoleOpen(true);
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingConsole(false);
    };
    
    if (isResizingLeft || isResizingConsole) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingConsole]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem && problem.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    } else {
      setCode('');
    }
  };

  const handleRunCode = async () => {
    setConsoleOpen(true);
    setActiveTab('result');
    setIsRunning(true);
    setRunResult(null);
    
    const testCases = problem.testCases || [];
    
    let fullCode = "";
    if (problem.driverCode && problem.driverCode[language]) {
      fullCode = problem.driverCode[language].replace(/(\/\/|#) @@@USER_CODE@@@/, code);
    }

    try {
      // Send code to the real Spring Boot execution engine
      const response = await fetch(`${config.API_BASE_URL}/execute-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          code: code,
          fullCode: fullCode,
          testCases: testCases.map(tc => ({
            input: tc.input,
            expected: tc.expected
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRunResult(data);
    } catch (error) {
      console.error("Execution error:", error);
      setRunResult({
        status: 'error',
        message: 'Server Error',
        runtime: 'N/A',
        memory: 'N/A',
        passed: 0,
        total: testCases.length,
        caseResults: testCases.map(tc => ({
          ...tc,
          passed: false,
          actualOutput: "Failed to reach execution server. Please ensure the backend and Docker are running."
        }))
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (isMobile) {
    return (
      <div className="tf-ps-mobile-guard">
        <AlertCircle size={48} color="var(--tf-accent)" style={{ marginBottom: '1rem' }} />
        <h2>Desktop Required</h2>
        <p>The TraceFlow Problem Solving IDE is a powerful tool optimized for larger screens. Please login on a laptop or desktop to start solving problems.</p>
        <button className="tf-btn tf-btn--primary" onClick={() => navigate('/traceflow/catalogue')}>
          Return to Catalogue
        </button>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className={`tf-ps-layout ${(isResizingLeft || isResizingConsole) ? 'tf-ps-layout--resizing' : ''}`}>
      {/* LEFT PANE */}
      <div 
        className={`tf-ps-left-pane ${isMaximized ? 'tf-ps-left-pane--hidden' : ''}`}
        style={{ width: `${leftWidth}%` }}
      >
        <div className="tf-ps-tabs">
          <div 
            className={`tf-ps-tab ${leftTab === 'description' ? 'tf-ps-tab--active' : ''}`}
            onClick={() => setLeftTab('description')}
          >
            <ArrowLeft size={14} style={{ display: 'inline', marginRight: '8px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate('/traceflow/catalogue'); }} />
            Description
          </div>
          <div 
            className={`tf-ps-tab ${leftTab === 'solutions' ? 'tf-ps-tab--active' : ''}`}
            onClick={() => setLeftTab('solutions')}
          >
            Solutions
          </div>
          <div 
            className={`tf-ps-tab ${leftTab === 'submissions' ? 'tf-ps-tab--active' : ''}`}
            onClick={() => setLeftTab('submissions')}
          >
            Submissions
          </div>
        </div>
        
        <div className="tf-ps-content">
          {/* DESCRIPTION TAB */}
          {leftTab === 'description' && (
            <>
              <div className="tf-ps-header">
                <h1 className="tf-ps-title">{problem.title}</h1>
                <div className="tf-ps-meta">
                  <span className={`tf-badge tf-badge--sm tf-badge--${problem.difficulty === 'beginner' ? 'success' : problem.difficulty === 'intermediate' ? 'warning' : 'danger'}`}>
                    {problem.difficulty}
                  </span>
                  <span className="tf-text-muted tf-text-sm">Acceptance: {problem.acceptance}</span>
                </div>
              </div>
              
              <div className="tf-ps-description" dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
              
              {problem.examples && problem.examples.map((ex, idx) => (
                <div key={idx} className="tf-ps-example">
                  <div className="tf-ps-section-title" style={{ fontSize: '14px' }}>Example {idx + 1}:</div>
                  <p><strong>Input:</strong> {ex.input}</p>
                  <p><strong>Output:</strong> {ex.output}</p>
                  {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
                </div>
              ))}
              
              {problem.constraints && (
                <div className="tf-ps-constraints">
                  <div className="tf-ps-section-title" style={{ fontSize: '14px' }}>Constraints:</div>
                  <ul>
                    {problem.constraints.map((c, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: c.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* SOLUTIONS TAB */}
          {leftTab === 'solutions' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="tf-ps-section-title" style={{ margin: 0 }}>Editorial Solutions</div>
                <select 
                  className="tf-ps-lang-select" 
                  value={solutionLang} 
                  onChange={(e) => setSolutionLang(e.target.value)}
                >
                  {Object.entries(LANGUAGES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {problem.solutions && problem.solutions.length > 0 ? (
                problem.solutions.map((sol, idx) => (
                  <div key={idx} className="tf-ps-solution-block">
                    <div className="tf-ps-solution-header">
                      Approach {idx + 1}: {sol.name}
                    </div>
                    <div className="tf-ps-solution-content">
                      <div className="tf-ps-solution-explanation" dangerouslySetInnerHTML={{ __html: sol.explanation.replace(/\n/g, '<br/>') }} />
                      {sol.code && sol.code[solutionLang] && (
                        <div className="tf-ps-solution-code">
                          {sol.code[solutionLang]}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--tf-text-secondary)', padding: '2rem 0' }}>
                  No editorial solutions available for this problem yet.
                </div>
              )}
            </>
          )}

          {/* SUBMISSIONS TAB */}
          {leftTab === 'submissions' && (
            <>
              <div className="tf-ps-section-title" style={{ marginBottom: '1rem' }}>Your Submissions</div>
              {problem.submissions && problem.submissions.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="tf-ps-submissions-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Runtime</th>
                        <th>Memory</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problem.submissions.map((sub, idx) => (
                        <tr key={idx}>
                          <td style={{ color: sub.status === 'Accepted' ? 'var(--tf-success)' : 'var(--tf-danger)', fontWeight: 500 }}>
                            {sub.status}
                          </td>
                          <td>
                            <span className="tf-badge tf-badge--sm tf-badge--outline">{sub.language}</span>
                          </td>
                          <td>{sub.runtime}</td>
                          <td>{sub.memory}</td>
                          <td style={{ color: 'var(--tf-text-muted)' }}>{sub.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--tf-text-secondary)', padding: '2rem 0' }}>
                  You haven't submitted any code for this problem yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* HORIZONTAL DRAG RESIZER */}
      {!isMaximized && (
        <div 
          className="tf-ps-resizer" 
          onMouseDown={() => setIsResizingLeft(true)}
          title="Drag to resize"
        />
      )}

      {/* RIGHT PANE */}
      <div className="tf-ps-right-pane">
        <div className="tf-ps-editor-toolbar">
          <select 
            className="tf-ps-lang-select" 
            value={language} 
            onChange={handleLanguageChange}
          >
            {Object.entries(LANGUAGES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Settings size={16} style={{ color: 'var(--tf-text-muted)', cursor: 'pointer' }} />
            {isMaximized ? (
              <Minimize2 size={16} style={{ color: 'var(--tf-text-muted)', cursor: 'pointer' }} onClick={() => setIsMaximized(false)} title="Restore" />
            ) : (
              <Maximize2 size={16} style={{ color: 'var(--tf-text-muted)', cursor: 'pointer' }} onClick={() => setIsMaximized(true)} title="Maximize" />
            )}
          </div>
        </div>

        <div className="tf-ps-editor-container">
          <Editor
            height="100%"
            language={language}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={code}
            onChange={(val) => setCode(val)}
            onValidate={handleEditorValidation}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              roundedSelection: false,
              padding: { top: 16 }
            }}
          />
        </div>

        {/* VERTICAL DRAG RESIZER */}
        <div 
          className="tf-ps-resizer-horizontal"
          onMouseDown={() => setIsResizingConsole(true)}
          title="Drag to resize console"
        />

        {/* CONSOLE */}
        <div 
          className={`tf-ps-console ${!consoleOpen ? 'tf-ps-console--collapsed' : ''}`}
          style={{ height: consoleOpen ? `${consoleHeight}px` : '48px' }}
        >
          <div className="tf-ps-console-header" onClick={() => {
            if (!consoleOpen && consoleHeight < 100) {
              setConsoleHeight(300); // Reset height if it was dragged too small
            }
            setConsoleOpen(prev => !prev);
          }}>
            <div className="tf-ps-console-title">
              <TerminalSquare size={16} />
              Console
            </div>
            <div className="tf-ps-console-actions" onClick={e => e.stopPropagation()}>
              {runResult?.status === 'success' && nextProblemSlug && (
                <button className="tf-btn tf-btn--primary tf-btn--sm" onClick={() => navigate(`/traceflow/problem/${nextProblemSlug}`)}>
                  Next Question
                </button>
              )}
              <button className="tf-btn tf-btn--secondary tf-btn--sm" onClick={handleRunCode} disabled={isRunning}>
                <Play size={14} /> Run Code
              </button>
              <button className="tf-btn tf-btn--primary tf-btn--sm" onClick={handleRunCode} disabled={isRunning}>
                <Check size={14} /> Submit
              </button>
            </div>
          </div>
          
          <div className="tf-ps-console-content">
            {isRunning && (
              <div className="tf-ps-console-overlay">
                <div className="tf-ps-spinner" />
                <div style={{ color: 'var(--tf-text-primary)' }}>Executing tests...</div>
              </div>
            )}
            
            <div className="tf-ps-tabs" style={{ background: 'transparent', padding: 0 }}>
              <div 
                className={`tf-ps-tab ${activeTab === 'testcases' ? 'tf-ps-tab--active' : ''}`}
                onClick={() => setActiveTab('testcases')}
              >
                Test Cases
              </div>
              <div 
                className={`tf-ps-tab ${activeTab === 'result' ? 'tf-ps-tab--active' : ''}`}
                onClick={() => setActiveTab('result')}
              >
                Test Result
              </div>
            </div>

            {activeTab === 'testcases' && problem.testCases && (
              <div className="tf-ps-testcases-view">
                <div className="tf-ps-testcase-pills">
                  {problem.testCases.map((tc, i) => (
                    <div 
                      key={i} 
                      className={`tf-ps-pill ${selectedTestCase === i ? 'tf-ps-pill--active' : ''}`}
                      onClick={() => setSelectedTestCase(i)}
                    >
                      Case {i + 1}
                    </div>
                  ))}
                </div>
                {problem.testCases[selectedTestCase] && (
                  <div className="tf-ps-test-case">
                    <div className="tf-ps-output-row">
                      <div className="tf-ps-output-label">Input</div>
                      <div className="tf-ps-output-value">{problem.testCases[selectedTestCase].input}</div>
                    </div>
                    <div className="tf-ps-output-row">
                      <div className="tf-ps-output-label">Expected</div>
                      <div className="tf-ps-output-value">{problem.testCases[selectedTestCase].expected}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'result' && runResult && (
              <div className="tf-ps-result-wrapper">
                <h3 
                  className={`tf-ps-result-status ${runResult.status === 'success' ? 'tf-ps-result-status--success' : 'tf-ps-result-status--error'}`}
                >
                  {runResult.message}
                  {runResult.status === 'success' && <span className="tf-ps-celebration">🎉</span>}
                </h3>
                
                {runResult.status === 'error' && runResult.total > 0 && (
                  <div className="tf-ps-result-failure-msg">
                    {runResult.total - runResult.passed} / {runResult.total} test cases failed.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div className="tf-ps-test-case-title">Runtime</div>
                    <div className="tf-ps-test-case-value">{runResult.runtime || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="tf-ps-test-case-title">Memory</div>
                    <div className="tf-ps-test-case-value">{runResult.memory || 'N/A'}</div>
                  </div>
                </div>
                
                {(!runResult.total || runResult.total === 0) && runResult.status === 'error' ? (
                  <div className="tf-ps-test-case" style={{ borderColor: 'var(--tf-danger)' }}>
                    <div className="tf-ps-output-row">
                      <div className={`tf-ps-output-value tf-ps-output-value--error`}>
                        {runResult.caseResults?.[0]?.actualOutput || 'Unknown Error'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tf-ps-testcases-view">
                    <div className="tf-ps-testcase-pills">
                      {runResult.caseResults && runResult.caseResults.map((caseRes, i) => (
                        <div 
                          key={i} 
                          className={`tf-ps-pill ${selectedTestCase === i ? 'tf-ps-pill--active' : ''}`}
                          onClick={() => setSelectedTestCase(i)}
                        >
                          <span className={`tf-ps-pill-dot ${caseRes.passed ? 'tf-ps-pill-dot--success' : 'tf-ps-pill-dot--error'}`} />
                          Case {i + 1}
                        </div>
                      ))}
                    </div>

                    {runResult.caseResults && runResult.caseResults[selectedTestCase] && (() => {
                      const activeCase = runResult.caseResults[selectedTestCase];
                      return (
                        <div className="tf-ps-test-case" style={{ borderColor: activeCase.passed ? 'var(--tf-border)' : 'var(--tf-danger)' }}>
                          <div className="tf-ps-output-row">
                            <div className="tf-ps-output-label">Input</div>
                            <div className="tf-ps-output-value">{activeCase.input}</div>
                          </div>
                          <div className="tf-ps-output-row">
                            <div className="tf-ps-output-label">Expected Output</div>
                            <div className="tf-ps-output-value">{activeCase.expected}</div>
                          </div>
                          <div className="tf-ps-output-row">
                            <div className="tf-ps-output-label">Actual Output</div>
                            <div className={`tf-ps-output-value ${activeCase.passed ? 'tf-ps-output-value--success' : 'tf-ps-output-value--error'}`}>
                              {activeCase.actualOutput}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
