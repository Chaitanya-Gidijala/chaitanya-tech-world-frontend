import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronLeft, Lightbulb, TrendingUp, Settings, Activity, ArrowRight, Sun, Moon } from 'lucide-react';
import { getAlgorithm } from '../algorithms/index.js';
import { createTraceEngine } from '../visualization/traceEngine.js';
import ArrayRenderer from '../visualization/renderers/ArrayRenderer.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import CustomInputModal from '../components/CustomInputModal.jsx';
import './Visualizer.css';

export default function Visualizer({ theme, toggleTheme }) {
  const { slug } = useParams();
  const algo = getAlgorithm(slug);

  const [engine, setEngine] = useState(null);
  const [state, setState] = useState(null);
  const [speed, setSpeed] = useState(500); // ms per step
  const [inputArray, setInputArray] = useState(algo?.defaultInput || []);
  const [target, setTarget] = useState(algo?.defaultTarget || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  
  const isDragging = React.useRef(false);

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 300 && newWidth < 800) {
      setSidebarWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Initialize engine
  useEffect(() => {
    if (!algo) return;

    let trace;
    if (algo.hasTarget) {
      trace = algo.traceGenerator(inputArray, target);
    } else {
      trace = algo.traceGenerator(inputArray);
    }

    const newEngine = createTraceEngine(trace, {
      onStateChange: (newState) => setState(newState),
    });

    setEngine(newEngine);
    setState(newEngine.getState());
    setIsPlaying(false);

    return () => newEngine.destroy();
  }, [algo, inputArray, target]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || !engine) return;

    if (state?.isFinished) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      engine.stepForward();
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, state, engine, speed]);

  const handlePlayPause = useCallback(() => {
    if (state?.isFinished) {
      engine.reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(p => !p);
    }
  }, [engine, state]);

  // Compute derived state above early returns to obey Rules of Hooks
  const currentEvent = state?.currentEvent;
  const currentArrayState = currentEvent?.arrayState || inputArray;

  const stableArrayState = useMemo(() => {
    const counts = {};
    return currentArrayState.map(val => {
      counts[val] = (counts[val] || 0) + 1;
      return { id: `item-${val}-${counts[val]}`, val };
    });
  }, [currentArrayState]);

  if (!algo) return <Navigate to="/traceflow/catalogue" replace />;
  if (!state) return null; // Loading

  const { isFinished, progress, stepIndex, totalSteps } = state;
  const currentMetrics = currentEvent?.metrics || { comparisons: 0, swaps: 0, reads: 0, writes: 0, iterations: 0 };

  return (
    <div className="tf-viz-layout">
      {/* Top Navbar */}
      <div className="tf-viz-nav">
        <div className="tf-viz-nav__left">
          <Link to={`/traceflow/algorithm/${algo.slug}`} className="tf-btn tf-btn--icon tf-btn--ghost" title="Back to details">
            <ChevronLeft size={20} />
          </Link>
          <div className="tf-viz-nav__title">
            <span className="tf-viz-nav__name">{algo.name}</span>
            <span className={`tf-badge tf-badge--${algo.difficulty === 'advanced' ? 'error' : algo.difficulty === 'intermediate' ? 'warning' : 'success'}`}>
              {algo.difficulty}
            </span>
          </div>
        </div>
        <div className="tf-viz-nav__right">
          <button className="tf-btn tf-btn--icon tf-btn--ghost" onClick={() => setIsInputModalOpen(true)} title="Custom Input Settings">
            <Settings size={18} />
          </button>
          {toggleTheme && (
            <button className="tf-btn tf-btn--icon tf-btn--ghost" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="tf-viz-workspace">
        {/* Left Column: Visualizer & Controls */}
        <div className="tf-viz-main" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          
          {/* Renderer Area */}
          <div className="tf-viz-stage">
            {currentEvent?.variables && Object.keys(currentEvent.variables).length > 0 && (
              <div className="tf-viz-variables-overlay">
                {Object.entries(currentEvent.variables).map(([name, val]) => (
                  <div key={name} className="tf-viz-variable-badge">
                    <span className="tf-viz-variable-name">{name}</span>
                    <span className="tf-viz-variable-value">{val !== undefined ? val : 'null'}</span>
                  </div>
                ))}
              </div>
            )}
            
            <ArrayRenderer 
              array={stableArrayState} 
              currentEvent={currentEvent} 
              maxValue={Math.max(...inputArray, 10)} 
            />
          </div>

          {/* Controls Panel */}
          <div className="tf-viz-controls-panel">
            {/* Progress Bar */}
            <div className="tf-viz-progress">
              <div className="tf-viz-progress__track">
                <div 
                  className="tf-viz-progress__fill" 
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="tf-viz-progress__labels">
                <span>Step {stepIndex + 1} of {totalSteps}</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="tf-viz-transport">
              <div className="tf-viz-transport__buttons">
                <button 
                  className="tf-btn tf-btn--icon tf-btn--secondary" 
                  onClick={() => { setIsPlaying(false); engine.reset(); }}
                  disabled={stepIndex === 0}
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  className="tf-btn tf-btn--icon tf-btn--secondary" 
                  onClick={() => { setIsPlaying(false); engine.stepBackward(); }}
                  disabled={stepIndex === 0}
                  title="Step Backward"
                >
                  <SkipBack size={16} />
                </button>
                <button 
                  className="tf-btn tf-btn--icon tf-btn--primary tf-btn--lg" 
                  onClick={handlePlayPause}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{marginLeft: 2}} />}
                </button>
                <button 
                  className="tf-btn tf-btn--icon tf-btn--secondary" 
                  onClick={() => { setIsPlaying(false); engine.stepForward(); }}
                  disabled={isFinished}
                  title="Step Forward"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Speed Control */}
              <div className="tf-viz-speed">
                <span className="tf-viz-speed__label">Speed</span>
                <input 
                  type="range" 
                  min="50" max="1500" 
                  step="50"
                  value={1550 - speed} // Invert for slider (right = faster)
                  onChange={(e) => setSpeed(1550 - Number(e.target.value))}
                  className="tf-viz-speed__slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          className="tf-viz-resizer" 
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />

        {/* Right Column: Code & Explanation */}
        <div className="tf-viz-sidebar" style={{ width: sidebarWidth }}>
          
          {/* Explanation Panel */}
          <div className="tf-viz-panel tf-viz-explanation">
            <div className="tf-viz-panel__header">
              <Lightbulb size={16} className="tf-viz-panel__icon" />
              <h3>Current Step</h3>
            </div>
            <div className="tf-viz-panel__content">
              {currentEvent ? (
                <>
                  <h4 className="tf-explanation-title">{currentEvent.description}</h4>
                  <p className="tf-explanation-text">{currentEvent.explanation}</p>
                  {currentEvent.whyText && (
                    <div className="tf-explanation-why">
                      <strong>Why?</strong> {currentEvent.whyText}
                    </div>
                  )}
                  {currentEvent.beginnerNote && (
                    <div className="tf-explanation-note">
                      <strong>💡 Note:</strong> {currentEvent.beginnerNote}
                    </div>
                  )}
                </>
              ) : (
                <p className="tf-text-muted">Press play to start the visualization.</p>
              )}
            </div>
          </div>

          {/* Code Panel */}
          <div className="tf-viz-panel tf-viz-code">
            <div className="tf-viz-panel__header">
              <TrendingUp size={16} className="tf-viz-panel__icon" />
              <h3>Implementation</h3>
            </div>
            <div className="tf-viz-code-wrapper">
              <CodeEditor 
                code={algo.codeLines.join('\n')}
                activeLine={currentEvent?.codeLine !== undefined ? currentEvent.codeLine + 1 : undefined}
                readOnly={true}
                theme={theme}
                height={algo.codeLines.length * 24 + 32}
              />
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="tf-viz-panel tf-viz-metrics">
            <div className="tf-viz-panel__header">
              <Activity size={16} className="tf-viz-panel__icon" />
              <h3>Metrics</h3>
            </div>
            <div className="tf-viz-panel__content">
              <div className="tf-metrics-grid">
                <div className="tf-metric">
                  <span className="tf-metric__label">Comparisons</span>
                  <span className="tf-metric__val">{currentMetrics.comparisons}</span>
                </div>
                {algo.category === 'sorting' && (
                  <div className="tf-metric">
                    <span className="tf-metric__label">Swaps</span>
                    <span className="tf-metric__val">{currentMetrics.swaps}</span>
                  </div>
                )}
                <div className="tf-metric">
                  <span className="tf-metric__label">Array Reads</span>
                  <span className="tf-metric__val">{currentMetrics.reads}</span>
                </div>
                <div className="tf-metric">
                  <span className="tf-metric__label">Array Writes</span>
                  <span className="tf-metric__val">{currentMetrics.writes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Info Panel */}
          <div className="tf-viz-panel tf-viz-algo-info">
            <div className="tf-viz-panel__header">
              <Activity size={16} className="tf-viz-panel__icon" />
              <h3>Algorithm Details</h3>
            </div>
            <div className="tf-viz-panel__content">
              <div className="tf-algo-detail-section">
                <h4>Definition</h4>
                <p>{algo.summary}</p>
              </div>
              
              {algo.steps && algo.steps.length > 0 && (
                <div className="tf-algo-detail-section" style={{ marginTop: '1rem' }}>
                  <h4>Processing Steps</h4>
                  <ol className="tf-algo-steps">
                    {algo.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="tf-algo-detail-section" style={{ marginTop: '1rem' }}>
                <h4>When to Use</h4>
                <p>{algo.whenToUse}</p>
              </div>

              <div className="tf-metrics-grid" style={{ marginTop: '1rem' }}>
                <div className="tf-metric">
                  <span className="tf-metric__label">Time Complexity</span>
                  <span className="tf-metric__val" style={{ color: 'var(--tf-viz-swapping)' }}>{algo.timeComplexity}</span>
                </div>
                <div className="tf-metric">
                  <span className="tf-metric__label">Space Complexity</span>
                  <span className="tf-metric__val" style={{ color: 'var(--tf-accent)' }}>{algo.spaceComplexity}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <CustomInputModal 
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onApply={(newArray, newTarget) => {
          setInputArray(newArray);
          setTarget(newTarget);
        }}
        initialArray={inputArray}
        initialTarget={target}
        hasTarget={algo.hasTarget}
        requiresSorted={algo.requiresSorted}
      />
    </div>
  );
}
