import React, { useState, useEffect, useMemo } from 'react';
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

const ITEMS_PER_PAGE = 20;

const PromptsGalleryPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPrompts();

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

  }, []);

  useEffect(() => { setCurrentPage(1); }, [activeModel, activeCategory]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the full gallery once so filters and client-side pagination work across all prompts.
      const res = await promptService.getAllPrompts(0, 500);
      const payload = res?.data ?? res;
      const promptList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.content)
          ? payload.content
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.data?.content)
              ? payload.data.content
              : [];
      setPrompts(promptList);
    } catch (err) {
      console.error(err);
      const message = err?.code === 'ECONNABORTED'
        ? 'The prompts service is taking too long to respond. Please try again shortly.'
        : 'Unable to load prompts right now. Please try again shortly.';
      setError(message);
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

  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);
  const visiblePrompts = filteredPrompts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
    // Scroll to top of gallery smoothly
    const offset = window.innerWidth > 768 ? 400 : 300;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
    const offset = window.innerWidth > 768 ? 400 : 300;
    window.scrollTo({ top: offset, behavior: 'smooth' });
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
      <section className="pg-hero">
        <div className="pg-hero-inner">
          <div className="pg-hero-copy">
            <span className="pg-hero-kicker">Image generation prompts</span>
            <h1 className="pg-hero-title">Create images with intention.</h1>
            <p className="pg-hero-desc">
              Explore ready-to-use prompts for portraits, product shots, editorial scenes, and visual storytelling.
            </p>
          </div>
          <div className="pg-hero-preview" aria-hidden="true">
            <div className="pg-preview-glow" />
            <div className="pg-preview-header"><span>Prompt recipe</span><i /></div>
            <strong>Describe. Direct. Create.</strong>
            <div className="pg-preview-lines"><span /><span /><span /></div>
            <div className="pg-preview-tags"><span>Style</span><span>Lighting</span><span>Composition</span></div>
          </div>
          <div className="pg-hero-stats" aria-label="Prompt library statistics">
            <div className="pg-hero-stat">
              <strong>{prompts.length}</strong>
              <span>Prompts</span>
            </div>
            <div className="pg-hero-stat">
              <strong>{availableModels.length - 1 || '—'}</strong>
              <span>AI models</span>
            </div>
            <div className="pg-hero-stat">
              <strong>{availableCategories.length - 1 || '—'}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <div className="pg-container">
        {error && (
          <div className="pg-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
            <button onClick={fetchPrompts}>Retry</button>
          </div>
        )}

        <div className="pg-gallery-toolbar">
          <div>
            <span className="pg-gallery-kicker">Browse the collection</span>
            <h2>Find your next visual direction</h2>
          </div>
          <div className="pg-gallery-filters">
            <select className="pg-gallery-select" value={activeModel} onChange={(e) => setActiveModel(e.target.value)}>
              {availableModels.map(model => <option key={model} value={model}>{model === 'All' ? 'All models' : model}</option>)}
            </select>
            <select className="pg-gallery-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
              {availableCategories.map(category => <option key={category} value={category}>{category === 'All' ? 'All categories' : category}</option>)}
            </select>
          </div>
        </div>

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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pg-pagination" style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '16px', 
                marginTop: '40px',
                padding: '20px 0'
              }}>
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    color: currentPage === 1 ? '#666' : '#fff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Previous
                </button>
                
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Page <strong style={{ color: '#fff' }}>{currentPage}</strong> of {totalPages}
                </span>
                
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    color: currentPage === totalPages ? '#666' : '#fff',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptsGalleryPage;
