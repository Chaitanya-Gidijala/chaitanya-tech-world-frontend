import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, ArrowRight, Hash, Layers, GitBranch, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllAlgorithms } from '../algorithms/index.js';
import './CommandSearch.css';

const categoryIcons = {
  sorting: TrendingUp,
  searching: Search,
  patterns: GitBranch,
  ds: Layers,
};

const difficultyColor = { beginner: 'success', intermediate: 'warning', advanced: 'error' };

export default function CommandSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allAlgorithms = getAllAlgorithms();
  const results = query.trim().length < 1
    ? allAlgorithms.slice(0, 8)
    : allAlgorithms.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.includes(query.toLowerCase())) ||
        a.category.includes(query.toLowerCase())
      ).slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const go = useCallback((algo) => {
    navigate(`/traceflow/algorithm/${algo.slug}`);
    onClose();
  }, [navigate, onClose]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) go(results[activeIdx]);
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tf-search-backdrop" onClick={onClose}>
      <div className="tf-search-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKey}>
        <div className="tf-search-input-row">
          <Search size={16} className="tf-search-icon" />
          <input
            ref={inputRef}
            className="tf-search-input"
            placeholder="Search algorithms, patterns, data structures…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
          />
          {query && (
            <button className="tf-btn tf-btn--icon tf-btn--ghost" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
          <kbd className="tf-search-esc">ESC</kbd>
        </div>

        {!query && (
          <div className="tf-search-section-label">All Algorithms</div>
        )}

        <div className="tf-search-results">
          {results.length === 0 ? (
            <div className="tf-search-empty">
              <Hash size={20} />
              <span>No results for "<strong>{query}</strong>"</span>
            </div>
          ) : results.map((algo, i) => {
            const Icon = categoryIcons[algo.category] ?? Hash;
            return (
              <button
                key={algo.slug}
                className={`tf-search-result ${i === activeIdx ? 'tf-search-result--active' : ''}`}
                onClick={() => go(algo)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <div className="tf-search-result-icon">
                  <Icon size={14} />
                </div>
                <div className="tf-search-result-body">
                  <span className="tf-search-result-name">{algo.name}</span>
                  <span className="tf-search-result-meta">{algo.category} · {algo.timeComplexity}</span>
                </div>
                <span className={`tf-badge tf-badge--${difficultyColor[algo.difficulty]}`}>
                  {algo.difficulty}
                </span>
                <ArrowRight size={14} className="tf-search-result-arrow" />
              </button>
            );
          })}
        </div>

        <div className="tf-search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
