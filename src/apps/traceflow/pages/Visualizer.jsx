import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  BookOpen,
  ChevronLeft,
  Code2,
  History,
  LayoutGrid,
  MessageSquareText,
  Moon,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';
import { getAlgorithm } from '../algorithms/index.js';
import { recordVisualize } from '@/features/engagement/lib/store';
import ArrayRenderer from '../visualization/renderers/ArrayRenderer.jsx';
import CustomInputModal from '../components/CustomInputModal.jsx';
import ExplainPanel from '../components/visualizer/ExplainPanel.jsx';
import CodePanel from '../components/visualizer/CodePanel.jsx';
import TraceLog from '../components/visualizer/TraceLog.jsx';
import LearnPanel from '../components/visualizer/LearnPanel.jsx';
import Legend from '../components/visualizer/Legend.jsx';
import { presetsFor } from '../utils/inputPresets.js';
import { DIFFICULTY_TONE, detailPath } from '../utils/algoMeta.js';
import './Visualizer.css';
import '../styles/visualizer-extras.css';

const TABS = [
  { id: 'explain', label: 'Explain', icon: MessageSquareText },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'log', label: 'Trace log', icon: History },
  { id: 'learn', label: 'Learn', icon: BookOpen },
];

const BADGE_CLASS = { success: 'success', warning: 'warning', danger: 'error' };
const MIN_SIDEBAR = 320;
const MAX_SIDEBAR = 760;

/** Stable keys so each bar keeps its identity (and animates) when values move. */
function toItems(values) {
  const counts = {};
  return values.map((val) => {
    counts[val] = (counts[val] || 0) + 1;
    return { id: `item-${val}-${counts[val]}`, val };
  });
}

/** Resizable sidebar width (drag the divider). */
function useResizableSidebar(initial = 420) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const next = window.innerWidth - e.clientX;
      if (next >= MIN_SIDEBAR && next <= MAX_SIDEBAR) setWidth(next);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
  };
  return [width, startDrag];
}

/**
 * Visualizer — full-screen workspace for one algorithm.
 * Stage + transport on the left; Explain / Code / Trace log / Learn tabs on the right.
 */
/**
 * Optional deep-link input: ?input=5,3,8&target=8 (used by the Daily Challenge
 * "Step through it" links). Invalid values fall back to the algorithm defaults.
 */
function inputFromQuery(algo, params) {
  const fallback = { array: algo?.defaultInput ?? [], target: algo?.defaultTarget ?? null };
  const raw = params.get('input');
  if (!algo || !raw) return fallback;
  const array = raw.split(',').map((v) => Number(v.trim()));
  if (array.length < 2 || array.length > 30 || array.some((v) => !Number.isFinite(v))) return fallback;
  const sortedArray = algo.requiresSorted ? [...array].sort((a, b) => a - b) : array;
  const t = Number(params.get('target'));
  return { array: sortedArray, target: algo.hasTarget ? (Number.isFinite(t) && params.has('target') ? t : fallback.target) : null };
}

function VisualizerWorkspace({ slug, theme, toggleTheme }) {
  const algo = getAlgorithm(slug);
  const [searchParams] = useSearchParams();

  const [input, setInput] = useState(() => inputFromQuery(algo, searchParams));
  const [stepIndex, setStepIndex] = useState(0); // 0 = initial array, n = after n-th event
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(550);
  const [tab, setTab] = useState('explain');
  const [beginner, setBeginner] = useState(true);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [sidebarWidth, startDrag] = useResizableSidebar();

  // The full execution trace for the current input; the UI is a cursor over it.
  const trace = useMemo(() => {
    if (!algo) return [];
    return algo.hasTarget ? algo.traceGenerator(input.array, input.target) : algo.traceGenerator(input.array);
  }, [algo, input]);

  const totalSteps = trace.length;
  const isFinished = stepIndex >= totalSteps;

  // Running an algorithm (a few steps in) counts as today's learning activity.
  useEffect(() => {
    if (algo && stepIndex >= 3) recordVisualize(algo.slug);
  }, [algo, stepIndex]);
  const playing = isPlaying && !isFinished;

  const goTo = useCallback((i) => setStepIndex(Math.max(0, Math.min(totalSteps, i))), [totalSteps]);
  const stepForward = useCallback(() => setStepIndex((s) => Math.min(totalSteps, s + 1)), [totalSteps]);
  const stepBackward = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  // Playback loop — advances one step per tick until the end of the trace.
  useEffect(() => {
    if (!playing) return undefined;
    const timer = setTimeout(stepForward, speed);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, speed, stepForward]);

  const togglePlay = useCallback(() => {
    if (isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  }, [isFinished]);

  const pauseAnd = useCallback(
    (fn) => () => {
      setIsPlaying(false);
      fn();
    },
    [],
  );

  /** Replace the input and rewind to the start. */
  const changeInput = (next) => {
    setIsPlaying(false);
    setStepIndex(0);
    setInput(next);
  };

  // Keyboard shortcuts: Space/K play-pause, ←/→ step, Home reset, End jump to finish.
  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack keys while typing in a field or the code editor.
      if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor')) return;
      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'k') {
        e.preventDefault();
        togglePlay();
        return;
      }
      const actions = { arrowright: stepForward, arrowleft: stepBackward, home: () => goTo(0), end: () => goTo(totalSteps) };
      if (actions[key]) {
        setIsPlaying(false);
        actions[key]();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, stepForward, stepBackward, goTo, totalSteps]);

  const currentEvent = stepIndex > 0 ? trace[stepIndex - 1] : null;
  const items = useMemo(() => toItems(currentEvent?.arrayState ?? input.array), [currentEvent, input.array]);

  if (!algo) return <Navigate to="/traceflow/catalogue" replace />;

  const progress = totalSteps === 0 ? 0 : stepIndex / totalSteps;
  const metrics = currentEvent?.metrics ?? { comparisons: 0, swaps: 0, reads: 0, writes: 0 };
  const presets = presetsFor(algo);
  const tone = DIFFICULTY_TONE[algo.difficulty];

  const applyPreset = (preset) => {
    const n = Math.max(6, Math.min(12, input.array.length || 8));
    const next = preset.build(n, algo.requiresSorted);
    setActivePreset(preset.id);
    changeInput({ array: next.array, target: next.target ?? input.target });
  };

  return (
    <div className="tf-viz-layout">
      {/* Top bar */}
      <div className="tf-viz-nav">
        <div className="tf-viz-nav__left">
          <Link to={detailPath(algo.slug)} className="tf-btn tf-btn--icon tf-btn--ghost" title="Back to details" aria-label="Back to details">
            <ChevronLeft size={20} />
          </Link>
          <div className="tf-viz-nav__title">
            <span className="tf-viz-nav__name">{algo.name}</span>
            <span className={`tf-badge tf-badge--${BADGE_CLASS[tone]}`}>{algo.difficulty}</span>
            {algo.hasTarget && <span className="tfv-target">target = {input.target}</span>}
          </div>
        </div>
        <div className="tf-viz-nav__right">
          <Link to="/traceflow/catalogue" className="tf-btn tf-btn--icon tf-btn--ghost" title="All algorithms" aria-label="All algorithms">
            <LayoutGrid size={18} />
          </Link>
          <button
            type="button"
            className="tf-btn tf-btn--icon tf-btn--ghost"
            onClick={() => setIsInputModalOpen(true)}
            title="Custom input"
            aria-label="Custom input"
          >
            <SlidersHorizontal size={18} />
          </button>
          {toggleTheme && (
            <button type="button" className="tf-btn tf-btn--icon tf-btn--ghost" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>

      <div className="tf-viz-workspace">
        {/* Left: stage + controls */}
        <div className="tf-viz-main" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className="tfv-presets" role="group" aria-label="Input presets">
            <span className="tfv-presets__label">Input</span>
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx('tfv-chip', activePreset === p.id && 'is-active')}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
            <button type="button" className="tfv-chip" onClick={() => setIsInputModalOpen(true)}>
              Custom…
            </button>
          </div>

          <div className="tf-viz-stage">
            {currentEvent?.variables && Object.keys(currentEvent.variables).length > 0 && (
              <div className="tf-viz-variables-overlay">
                {Object.entries(currentEvent.variables).map(([name, val]) => (
                  <div key={name} className="tf-viz-variable-badge">
                    <span className="tf-viz-variable-name">{name}</span>
                    <span className="tf-viz-variable-value">{val !== undefined ? String(val) : 'null'}</span>
                  </div>
                ))}
              </div>
            )}
            <ArrayRenderer array={items} currentEvent={currentEvent} maxValue={Math.max(...input.array, 10)} />
          </div>

          <div className="tfv-statusbar">
            <Legend category={algo.category} />
            <dl className="tfv-metrics">
              <div>
                <dt>Comparisons</dt>
                <dd>{metrics.comparisons}</dd>
              </div>
              {algo.category === 'sorting' && (
                <div>
                  <dt>Swaps</dt>
                  <dd>{metrics.swaps}</dd>
                </div>
              )}
              <div>
                <dt>Reads</dt>
                <dd>{metrics.reads}</dd>
              </div>
              <div>
                <dt>Writes</dt>
                <dd>{metrics.writes}</dd>
              </div>
            </dl>
          </div>

          <div className="tf-viz-controls-panel">
            <div className="tfv-scrub">
              <input
                type="range"
                min={0}
                max={totalSteps}
                value={stepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  goTo(Number(e.target.value));
                }}
                aria-label="Timeline"
                style={{ '--p': `${progress * 100}%` }}
              />
              <div className="tfv-scrub__labels">
                <span>
                  Step {stepIndex} of {totalSteps}
                </span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
            </div>

            <div className="tf-viz-transport">
              <div className="tf-viz-transport__buttons">
                <button
                  type="button"
                  className="tf-btn tf-btn--icon tf-btn--secondary"
                  onClick={pauseAnd(() => goTo(0))}
                  disabled={stepIndex === 0}
                  title="Reset (Home)"
                  aria-label="Reset"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  className="tf-btn tf-btn--icon tf-btn--secondary"
                  onClick={pauseAnd(stepBackward)}
                  disabled={stepIndex === 0}
                  title="Step back (←)"
                  aria-label="Step back"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  type="button"
                  className="tf-btn tf-btn--icon tf-btn--primary tf-btn--lg"
                  onClick={togglePlay}
                  title={playing ? 'Pause (Space)' : 'Play (Space)'}
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                </button>
                <button
                  type="button"
                  className="tf-btn tf-btn--icon tf-btn--secondary"
                  onClick={pauseAnd(stepForward)}
                  disabled={isFinished}
                  title="Step forward (→)"
                  aria-label="Step forward"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              <div className="tf-viz-speed">
                <span className="tf-viz-speed__label">Speed</span>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={1550 - speed}
                  onChange={(e) => setSpeed(1550 - Number(e.target.value))}
                  className="tf-viz-speed__slider"
                  aria-label="Playback speed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="tf-viz-resizer" onMouseDown={startDrag} title="Drag to resize" aria-hidden="true" />

        {/* Right: explanation tabs */}
        <aside className="tf-viz-sidebar tfv-sidebar" style={{ width: sidebarWidth }}>
          <div className="tfv-tabs" role="tablist" aria-label="Explanation views">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={clsx('tfv-tab', tab === id && 'is-active')}
                onClick={() => setTab(id)}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <div className="tfv-tabpanel" role="tabpanel">
            {tab === 'explain' && (
              <ExplainPanel event={currentEvent} algo={algo} beginner={beginner} onToggleBeginner={setBeginner} />
            )}
            {tab === 'code' && (
              <CodePanel
                algo={algo}
                theme={theme}
                activeLine={currentEvent?.codeLine !== undefined ? currentEvent.codeLine + 1 : undefined}
              />
            )}
            {tab === 'log' && (
              <TraceLog
                events={trace}
                stepIndex={stepIndex}
                onJump={(i) => {
                  setIsPlaying(false);
                  goTo(i);
                }}
              />
            )}
            {tab === 'learn' && <LearnPanel algo={algo} />}
          </div>
        </aside>
      </div>

      <CustomInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onApply={(array, target) => {
          setActivePreset(null);
          changeInput({ array, target });
        }}
        initialArray={input.array}
        initialTarget={input.target}
        hasTarget={algo.hasTarget}
        requiresSorted={algo.requiresSorted}
      />
    </div>
  );
}

/** Route entry — keyed by slug so switching algorithms starts from a clean state. */
export default function Visualizer(props) {
  const { slug } = useParams();
  return <VisualizerWorkspace key={slug} slug={slug} {...props} />;
}
