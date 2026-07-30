import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptService } from '../services/promptService';
import './PromptsGalleryPage.css';

const MODEL_META = {
  chatgpt: { icon: '◎', color: '#10a37f', bg: 'rgba(16,163,127,0.1)', border: 'rgba(16,163,127,0.3)' },
  gpt:     { icon: '◎', color: '#10a37f', bg: 'rgba(16,163,127,0.1)', border: 'rgba(16,163,127,0.3)' },
  gemini:  { icon: '✦', color: '#4285f4', bg: 'rgba(66,133,244,0.1)', border: 'rgba(66,133,244,0.3)' },
  midjourney: { icon: '⬡', color: '#9146ff', bg: 'rgba(145,70,255,0.1)', border: 'rgba(145,70,255,0.3)' },
  'dall·e':{ icon: '◈', color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
  dalle:   { icon: '◈', color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
  claude:  { icon: '◆', color: '#d4a46a', bg: 'rgba(212,164,106,0.1)', border: 'rgba(212,164,106,0.3)' },
  'stable diffusion': { icon: '❋', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)' },
};

const getModelMeta = (model) => {
  if (!model) return { icon: '◉', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)' };
  const key = model.toLowerCase();
  for (const [k, v] of Object.entries(MODEL_META)) {
    if (key.includes(k)) return v;
  }
  return { icon: '◉', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)' };
};

const INITIAL_LOAD = 20;
const LOAD_MORE_COUNT = 20;

const PromptsGalleryPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchPrompts();
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    // SEO updates
    document.title = "Best AI Prompts Gallery | Chaitanya Tech World";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Discover the best handpicked AI prompts for ChatGPT, Gemini, Midjourney, and more. Copy, paste, and create stunning AI outputs instantly.";

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "AI prompts, ChatGPT prompts, Midjourney prompts, Gemini prompts, prompt engineering, free prompts, best prompts";

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setVisibleCount(INITIAL_LOAD); }, [activeModel, activeCategory]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await promptService.getAllPrompts();
      const data = res.data || res;
      setPrompts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load prompts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableModels = useMemo(() => {
    const models = new Set(prompts.map(p => p.aiModel).filter(Boolean));
    return ['All', ...Array.from(models)];
  }, [prompts]);

  const availableCategories = useMemo(() => {
    const cats = new Set(prompts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchModel = activeModel === 'All' || p.aiModel?.toLowerCase() === activeModel.toLowerCase();
      const matchCat = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchModel && matchCat;
    });
  }, [prompts, activeModel, activeCategory]);

  const visiblePrompts = filteredPrompts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPrompts.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(v => v + LOAD_MORE_COUNT);
      setLoadingMore(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="pg-root">
        {/* Hero skeleton */}
        <div className="pg-hero">
          <div className="pg-hero-noise" />
          <div className="pg-hero-glow pg-hero-glow--1" />
          <div className="pg-hero-glow pg-hero-glow--2" />
          <div className="pg-hero-inner">
            <div className="pg-skeleton-badge" />
            <div className="pg-skeleton-h1" />
            <div className="pg-skeleton-sub" />
          </div>
        </div>
        <div className="pg-container">
          <div className="pg-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pg-skeleton-card" style={{ '--i': i }}>
                <div className="pg-skeleton-img" />
                <div className="pg-skeleton-body">
                  <div className="pg-skeleton-line" style={{ width: '75%' }} />
                  <div className="pg-skeleton-line" style={{ width: '55%', height: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-root">
      {/* ─── HERO ─── */}
      <section className="pg-hero" ref={heroRef}>
        <div className="pg-hero-noise" />
        <div className="pg-hero-glow pg-hero-glow--1" />
        <div className="pg-hero-glow pg-hero-glow--2" />
        <div className="pg-hero-glow pg-hero-glow--3" />

        {/* Floating orbit rings */}
        <div className="pg-orbit pg-orbit--1" />
        <div className="pg-orbit pg-orbit--2" />

        <div className="pg-hero-inner">
          <div className="pg-hero-eyebrow">
            <span className="pg-eyebrow-dot" />
            AI Prompt Library
          </div>

          <h1 className="pg-hero-title">
            <span className="pg-title-line-1">Creative</span>
            <span className="pg-title-line-2">
              Prompts <em>Gallery</em>
            </span>
          </h1>

          <p className="pg-hero-desc">
            Handpicked prompts for ChatGPT, Gemini, Midjourney &amp; more —<br />
            copy, paste, and create stunning AI outputs instantly.
          </p>

          {/* Stat pills */}
          <div className="pg-hero-pills">
            <div className="pg-pill">
              <span className="pg-pill-value">{prompts.length}</span>
              <span className="pg-pill-label">Prompts</span>
            </div>
            <div className="pg-pill-sep" />
            <div className="pg-pill">
              <span className="pg-pill-value">{availableModels.length - 1 || '—'}</span>
              <span className="pg-pill-label">AI Tools</span>
            </div>
            <div className="pg-pill-sep" />
            <div className="pg-pill">
              <span className="pg-pill-value pg-pill-value--accent">Free</span>
              <span className="pg-pill-label">Forever</span>
            </div>
          </div>


        </div>

        {/* Wave divider */}
        <div className="pg-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ─── STICKY FILTER BAR (shows when scrolled past hero) ─── */}
      <div className={`pg-sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="pg-sticky-inner">
          <span className="pg-sticky-label">Model:</span>
          <select
            className="pg-category-select"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
          >
            {availableModels.map(model => (
              <option key={model} value={model}>{model === 'All' ? 'All Models' : model}</option>
            ))}
          </select>
          <span className="pg-sticky-label" style={{marginLeft: '16px'}}>Type:</span>
          <select 
            className="pg-category-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Types' : cat}</option>
            ))}
          </select>
          <span className="pg-sticky-count">{filteredPrompts.length} results</span>
        </div>
      </div>

      {/* ─── GALLERY ─── */}
      <div className="pg-container">
        {error && (
          <div className="pg-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
            <button onClick={fetchPrompts}>Retry</button>
          </div>
        )}

        {visiblePrompts.length === 0 && !error ? (
          <div className="pg-empty">
            <div className="pg-empty-art">
              <div className="pg-empty-circle" />
              <span className="pg-empty-icon">🎨</span>
            </div>
            <h3>No prompts found</h3>
            <p>No prompts found for <strong>"{activeModel}"</strong> and <strong>"{activeCategory}"</strong> type.<br />Try a different filter or check back soon.</p>
            <button className="pg-reset-btn" onClick={() => {setActiveModel('All'); setActiveCategory('All');}}>
              ← Show all prompts
            </button>
          </div>
        ) : (
          <>
            {/* Section label */}
            <div className="pg-section-label">
              <span>{activeModel === 'All' ? 'All Prompts' : `${activeModel} Prompts`}</span>
              <div className="pg-section-line" />
              <span className="pg-section-count">{filteredPrompts.length}</span>
            </div>

            <div className="pg-grid">
              {visiblePrompts.map((prompt, index) => {
                const meta = getModelMeta(prompt.aiModel);
                return (
                  <article
                    key={prompt.id}
                    className="pg-card"
                    onClick={() => navigate(`/prompts/${prompt.id}`)}
                    style={{ '--i': index % 12, '--c': meta.color }}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/prompts/${prompt.id}`)}
                    aria-label={`View prompt: ${prompt.title}`}
                  >
                    {/* Image */}
                    <div className="pg-card-media">
                      {prompt.mediaType === 'VIDEO' ? (
                        <video src={prompt.mediaUrl} className="pg-card-img" muted playsInline />
                      ) : (
                        <img src={prompt.mediaUrl} alt={prompt.title} className="pg-card-img" loading="lazy" />
                      )}

                      {/* Gradient overlay */}
                      <div className="pg-card-gradient" />

                      {/* Media type tag — icon only */}
                      <div className="pg-card-media-tag" title={prompt.mediaType}>
                        {prompt.mediaType === 'VIDEO' ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        )}
                      </div>

                      {/* Top-right: AI model */}
                      {prompt.aiModel && (
                        <div
                          className="pg-card-model"
                          style={{ '--c': meta.color, '--bg': meta.bg, '--bd': meta.border }}
                        >
                          <span className="pg-card-model-icon">{meta.icon}</span>
                          {prompt.aiModel}
                        </div>
                      )}

                      {/* Hover CTA */}
                      <div className="pg-card-cta">
                        <span className="pg-card-cta-btn">
                          View Prompt
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="pg-card-body">
                      <h3 className="pg-card-title">{prompt.title}</h3>
                      {prompt.description && (
                        <p className="pg-card-desc">{prompt.description}</p>
                      )}
                      <div className="pg-card-footer">
                        <div className="pg-card-dot" style={{ background: meta.color }} />
                        <span className="pg-card-copy-hint">Click to copy &amp; use</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="pg-loadmore">
                <div className="pg-loadmore-info">
                  <div className="pg-loadmore-bar">
                    <div
                      className="pg-loadmore-fill"
                      style={{ width: `${(visiblePrompts.length / filteredPrompts.length) * 100}%` }}
                    />
                  </div>
                  <span>{visiblePrompts.length} of {filteredPrompts.length} prompts</span>
                </div>
                <button
                  className={`pg-loadmore-btn ${loadingMore ? 'loading' : ''}`}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <><div className="pg-spin" />Loading...</>
                  ) : (
                    <>
                      Load {Math.min(LOAD_MORE_COUNT, filteredPrompts.length - visibleCount)} More
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* All seen */}
            {!hasMore && filteredPrompts.length > INITIAL_LOAD && (
              <div className="pg-all-seen">
                <div className="pg-all-seen-line" />
                <span>✓ All {filteredPrompts.length} prompts loaded</span>
                <div className="pg-all-seen-line" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptsGalleryPage;
