import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Play, ArrowLeft, Terminal, Cpu, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { getAlgorithm } from '../algorithms/index.js';
import CodeEditor from '../components/CodeEditor.jsx';
import './AlgorithmDetail.css';

export default function AlgorithmDetail() {
  const { slug } = useParams();
  const algo = getAlgorithm(slug);

  if (!algo) {
    return <Navigate to="/traceflow/catalogue" replace />;
  }

  return (
    <div className="tf-algo-detail tf-page">
      {/* Premium Hero Header */}
      <div className="tf-algo-header">
        <div className="tf-algo-header__glow"></div>
        <div className="tf-container">
          <div className="tf-algo-header__breadcrumbs">
            <Link to="/traceflow/catalogue">Algorithms</Link>
            <ChevronRight size={14} />
            <span className="tf-text-primary">{algo.name}</span>
          </div>

          <div className="tf-algo-header__content">
            <h1 className="tf-algo-header__title">{algo.name}</h1>
            <p className="tf-algo-header__summary">{algo.summary}</p>
            
            <div className="tf-algo-header__badges">
              <span className={`tf-badge tf-badge--${algo.difficulty === 'advanced' ? 'error' : algo.difficulty === 'intermediate' ? 'warning' : 'success'}`}>
                {algo.difficulty}
              </span>
              <span className="tf-badge tf-badge--accent">{algo.category}</span>
              {algo.stable && <span className="tf-badge tf-badge--default">Stable</span>}
              {algo.inPlace && <span className="tf-badge tf-badge--default">In-place</span>}
            </div>

            <div className="tf-algo-header__actions">
              <Link to={`/traceflow/visualizer/${algo.slug}`} className="tf-btn tf-btn--primary tf-btn--lg tf-btn--glow tf-launch-btn">
                <Play size={18} fill="currentColor" /> Launch Visualizer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="tf-container">
        <div className="tf-algo-detail__grid">
          {/* Main Content */}
          <div className="tf-algo-detail__main">
            <section className="tf-detail-card tf-detail-section tf-animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="tf-detail-section__header">
                <div className="tf-icon-box tf-icon-box--blue">
                  <Info size={20} />
                </div>
                <h2>Intuition</h2>
              </div>
              <div className="tf-detail-section__body">
                <p className="tf-detail-text">{algo.intuition}</p>
              </div>
            </section>

            <section className="tf-detail-card tf-detail-section tf-animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="tf-detail-section__header">
                <div className="tf-icon-box tf-icon-box--green">
                  <CheckCircle2 size={20} />
                </div>
                <h2>When to Use</h2>
              </div>
              <div className="tf-detail-section__body">
                <p className="tf-detail-text">{algo.whenToUse}</p>
              </div>
            </section>

            {algo.steps && algo.steps.length > 0 && (
              <section className="tf-detail-card tf-detail-section tf-animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <div className="tf-detail-section__header">
                  <div className="tf-icon-box tf-icon-box--purple">
                    <Terminal size={20} />
                  </div>
                  <h2>Steps to Implement</h2>
                </div>
                <div className="tf-detail-section__body">
                  <ol className="tf-detail-list tf-detail-list--ordered">
                    {algo.steps.map((step, idx) => (
                      <li key={idx}>
                        <span className="tf-step-number">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {algo.goodPractices && algo.goodPractices.length > 0 && (
              <section className="tf-detail-card tf-detail-section tf-animate-slide-up" style={{ animationDelay: '0.35s' }}>
                <div className="tf-detail-section__header">
                  <div className="tf-icon-box tf-icon-box--orange">
                    <CheckCircle2 size={20} />
                  </div>
                  <h2>Good Practices</h2>
                </div>
                <div className="tf-detail-section__body">
                  <ul className="tf-detail-list tf-detail-list--unordered">
                    {algo.goodPractices.map((practice, idx) => (
                      <li key={idx}>{practice}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section className="tf-detail-card tf-detail-section tf-algo-detail__code-section tf-animate-slide-up" style={{ animationDelay: '0.45s' }}>
              <div className="tf-detail-section__header">
                <div className="tf-icon-box tf-icon-box--blue">
                  <Terminal size={20} />
                </div>
                <h2>Implementation (Java)</h2>
              </div>
              <div className="tf-algo-detail__code">
                <CodeEditor
                  code={algo.codeLines.join('\n')}
                  readOnly={true}
                  language="java"
                  height={algo.codeLines.length * 24 + 32}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="tf-algo-detail__sidebar tf-animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="tf-detail-card tf-sidebar-card">
              <h3 className="tf-detail-card__title">Complexity</h3>
              <div className="tf-complexity-list">
                <div className="tf-complexity-row">
                  <span>Time Complexity</span>
                  <span className="tf-complexity-val">{algo.timeComplexity}</span>
                </div>
                <div className="tf-complexity-row">
                  <span>Space Complexity</span>
                  <span className="tf-complexity-val">{algo.spaceComplexity}</span>
                </div>
              </div>
            </div>

            <div className="tf-detail-card tf-sidebar-card">
              <h3 className="tf-detail-card__title">Tags</h3>
              <div className="tf-detail-tags">
                {algo.tags.map(tag => (
                  <span key={tag} className="tf-tag">{tag}</span>
                ))}
              </div>
            </div>

            {algo.interviewQuestions?.length > 0 && (
              <div className="tf-detail-card tf-sidebar-card">
                <h3 className="tf-detail-card__title">Interview prep</h3>
                <ul className="tf-interview-list">
                  {algo.interviewQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
