import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { promptService } from '../services/promptService';
import './PromptDetailPage.css';

const AI_MODEL_META = {
  chatgpt: { label: 'ChatGPT', color: '#10a37f', icon: '🤖', openUrl: 'https://chat.openai.com/' },
  gemini: { label: 'Gemini', color: '#4285f4', icon: '✨', openUrl: 'https://gemini.google.com/' },
  midjourney: { label: 'Midjourney', color: '#9146ff', icon: '🎨', openUrl: 'https://www.midjourney.com/' },
  'dall-e': { label: 'DALL·E', color: '#ff6b35', icon: '🖼️', openUrl: 'https://labs.openai.com/' },
  claude: { label: 'Claude', color: '#c97b4b', icon: '🧠', openUrl: 'https://claude.ai/' },
  stable_diffusion: { label: 'Stable Diffusion', color: '#7b2d8b', icon: '🌀', openUrl: 'https://stability.ai/' },
};

const getModelMeta = (model) => {
  if (!model) return null;
  const key = model.toLowerCase().replace(/[\s.]/g, '-').replace('dall-e', 'dall-e');
  return AI_MODEL_META[key] || AI_MODEL_META[model.toLowerCase()] || { label: model, color: '#6366f1', icon: '🤖', openUrl: null };
};

const PromptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [morePrompts, setMorePrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const [detailRes, allRes] = await Promise.all([
        promptService.getPromptById(id),
        promptService.getAllPrompts(),
      ]);
      const detail = detailRes.data || detailRes;
      const all = allRes.data || allRes;
      setPrompt(detail);
      setMorePrompts(all.filter(p => String(p.id) !== String(id)).slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // SEO Optimization for Detail Page
  useEffect(() => {
    if (prompt) {
      document.title = `${prompt.title} | AI Prompts`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = prompt.description || `Use this powerful ${prompt.aiModel} prompt for incredible results.`;

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = `${prompt.title}, ${prompt.aiModel} prompts, AI prompts, prompt engineering, how to use ${prompt.aiModel}`;
    }
  }, [prompt]);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const modelMeta = prompt ? getModelMeta(prompt.aiModel) : null;

  const getSteps = (model) => {
    const m = (model || '').toLowerCase();
    if (m.includes('chatgpt') || m.includes('gpt')) {
      return [
        { step: '1', text: 'Copy the prompt below' },
        { step: '2', text: <>Open ChatGPT at <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="pd-step-link">chatgpt.com</a></> },
        { step: '3', text: 'Paste the prompt in the message box' },
        { step: '4', text: 'Press Enter and get your result!' },
      ];
    }
    if (m.includes('gemini')) {
      return [
        { step: '1', text: 'Copy the prompt below' },
        { step: '2', text: <>Open Google Gemini at <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="pd-step-link">gemini.google.com</a></> },
        { step: '3', text: 'Paste the prompt and hit Submit' },
        { step: '4', text: 'Enjoy the AI-generated result!' },
      ];
    }
    if (m.includes('midjourney')) {
      return [
        { step: '1', text: 'Copy the prompt below' },
        { step: '2', text: <>Open Discord and go to your <a href="https://discord.com/app" target="_blank" rel="noopener noreferrer" className="pd-step-link">Midjourney bot</a></> },
        { step: '3', text: 'Type /imagine and paste the prompt' },
        { step: '4', text: 'Submit and wait for your masterpiece!' },
      ];
    }
    if (m.includes('dall')) {
      return [
        { step: '1', text: 'Copy the prompt below' },
        { step: '2', text: <>Open <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="pd-step-link">chatgpt.com</a> (DALL·E is built-in)</> },
        { step: '3', text: 'Paste the prompt in the message box' },
        { step: '4', text: 'Hit generate and download your image!' },
      ];
    }
    return [
      { step: '1', text: 'Copy the prompt below' },
      { step: '2', text: 'Open your preferred AI tool' },
      { step: '3', text: 'Paste the prompt in the input area' },
      { step: '4', text: 'Hit submit and enjoy your creation!' },
    ];
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Loading prompt...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="pd-loading">
        <p>Prompt not found.</p>
        <button onClick={() => navigate('/prompts')} className="pd-back-btn">← Back to Gallery</button>
      </div>
    );
  }

  const steps = getSteps(prompt.aiModel);

  return (
    <div className="pd-root">
      {/* Back navigation */}
      <div className="pd-topbar">
        <button className="pd-back-btn" onClick={() => navigate('/prompts')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
          Back to Prompt Library
        </button>
      </div>

      {/* Main content */}
      <div className="pd-hero">
        {/* Left: Image */}
        <div className="pd-image-col">
          <div className="pd-image-wrapper">
            {prompt.mediaType === 'VIDEO' ? (
              <video src={prompt.mediaUrl} className="pd-media" controls autoPlay muted loop playsInline />
            ) : (
              <img src={prompt.mediaUrl} alt={prompt.title} className="pd-media" />
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="pd-info-col">
          <h1 className="pd-title">{prompt.title}</h1>
          {prompt.description && (
            <p className="pd-description">{prompt.description}</p>
          )}

          <div className="pd-divider"></div>

          {/* CTA Buttons */}
          <div className="pd-cta-section">
            <p className="pd-cta-label">TRY IT NOW</p>
            {modelMeta?.openUrl && (
              <a
                href={modelMeta.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn-primary"
              >
                <span>{modelMeta.icon}</span>
                Try This Prompt in {modelMeta.label}
              </a>
            )}
            <p className="pd-pro-tip">Pro tip: Customize the prompt with your own details to get unique results.</p>
          </div>

          {/* Full Prompt Text */}
          <div className="pd-prompt-section">
            <h3 className="pd-prompt-heading">Prompt</h3>
            <div className="pd-prompt-box">
              <p className="pd-prompt-text">{prompt.promptText}</p>
            </div>
            <button className={`pd-btn pd-btn-copy-main ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? (
                <>✓ Copied!</>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy prompt
                </>
              )}
            </button>
          </div>

          <div className="pd-divider"></div>

          {/* How to use steps */}
          <div className="pd-steps-section">
            <h3 className="pd-steps-title">How to Use This Prompt</h3>
            <div className="pd-steps-list">
              {steps.map((s) => (
                <div key={s.step} className="pd-step-item">
                  <div className="pd-step-num">{s.step}</div>
                  <p className="pd-step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More Prompts section */}
      {morePrompts.length > 0 && (
        <section className="pd-more-section">
          <div className="pd-more-header">
            <h2 className="pd-more-title">More Prompts</h2>
            <button className="pd-view-all-btn" onClick={() => navigate('/prompts')}>View all →</button>
          </div>
          <div className="pd-more-grid">
            {morePrompts.map((p) => (
              <div key={p.id} className="pd-more-card" onClick={() => navigate(`/prompts/${p.id}`)}>
                <div className="pd-more-img-wrap">
                  {p.mediaType === 'VIDEO' ? (
                    <video src={p.mediaUrl} className="pd-more-img" muted />
                  ) : (
                    <img src={p.mediaUrl} alt={p.title} className="pd-more-img" />
                  )}
                  <div className="pd-more-overlay">
                    <span>View Prompt →</span>
                  </div>
                </div>
                <p className="pd-more-card-title">{p.title}</p>
                {p.aiModel && (
                  <span className="pd-more-model">{p.aiModel}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PromptDetailPage;
