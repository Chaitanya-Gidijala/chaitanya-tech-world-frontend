import React, { useState, useEffect } from 'react';
import { promptService } from '../services/promptService';
import ImageUploadField from '../components/ImageUploadField';
import './AdminPromptsPage.css';

const AI_MODELS = [
  { value: 'ChatGPT', label: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  { value: 'Gemini', label: 'Gemini', icon: '✨', color: '#4285f4' },
  { value: 'Midjourney', label: 'Midjourney', icon: '🎨', color: '#9146ff' },
  { value: 'DALL·E', label: 'DALL·E', icon: '🖼️', color: '#ff6b35' },
  { value: 'Claude', label: 'Claude', icon: '🧠', color: '#c97b4b' },
  { value: 'Stable Diffusion', label: 'Stable Diffusion', icon: '🌀', color: '#7b2d8b' },
];

const CATEGORIES = ['Men', 'Women', 'Nature', 'Birthday', 'Other'];

const BLANK_FORM = {
  title: '', description: '', mediaUrl: '',
  mediaType: 'PHOTO', promptText: '', aiModel: 'ChatGPT', category: 'Men'
};

const AdminPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formData, setFormData] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  // Tracks the raw GitHub URL returned alongside the CDN URL after upload
  const [uploadedRawUrl, setUploadedRawUrl] = useState('');

  useEffect(() => { fetchPrompts(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await promptService.getAllPrompts();
      const data = res.data || res;
      setPrompts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load prompts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setFormData(BLANK_FORM);
    setEditingId(null);
    setUploadedRawUrl('');
    setShowForm(true);
    setTimeout(() => document.getElementById('ap-title')?.focus(), 100);
  };

  const openEdit = (prompt) => {
    setFormData({
      title: prompt.title || '',
      description: prompt.description || '',
      mediaUrl: prompt.mediaUrl || '',
      mediaType: prompt.mediaType || 'PHOTO',
      promptText: prompt.promptText || '',
      aiModel: prompt.aiModel || 'ChatGPT',
      category: prompt.category || 'Men',
    });
    setUploadedRawUrl('');
    setEditingId(prompt.id);
    setShowForm(true);
    setTimeout(() => document.getElementById('ap-title')?.focus(), 100);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(BLANK_FORM);
    setUploadedRawUrl('');
  };

  // Called by ImageUploadField after a successful upload
  const handleUploadSuccess = (result) => {
    if (result) {
      // Prefer CDN URL as primary; save raw as fallback in description metadata
      setFormData(prev => ({ ...prev, mediaUrl: result.imageUrl }));
      setUploadedRawUrl(result.rawUrl);
    } else {
      // User cleared the image
      setFormData(prev => ({ ...prev, mediaUrl: '' }));
      setUploadedRawUrl('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await promptService.updatePrompt(editingId, formData);
        showToast('Prompt updated successfully!', 'success');
      } else {
        await promptService.createPrompt(formData);
        showToast('Prompt created successfully!', 'success');
      }
      cancelForm();
      fetchPrompts();
    } catch (err) {
      console.error(err);
      showToast('Failed to save prompt.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(deleteConfirm.id);
    try {
      await promptService.deletePrompt(deleteConfirm.id);
      showToast('Prompt deleted.', 'success');
      fetchPrompts();
    } catch (err) {
      showToast('Failed to delete.', 'error');
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const selectedModel = AI_MODELS.find(m => m.value === formData.aiModel) || AI_MODELS[0];

  return (
    <div className="ap-root">
      {/* Toast */}
      {toast && (
        <div className={`ap-toast ap-toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="ap-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="ap-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-confirm-icon">🗑️</div>
            <h3>Delete Prompt?</h3>
            <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.</p>
            <div className="ap-confirm-actions">
              <button className="ap-btn ap-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="ap-btn ap-btn-danger" onClick={handleDeleteConfirm} disabled={!!deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="ap-header">
        <div className="ap-header-left">
          <h1 className="ap-title">Prompts Gallery</h1>
          <p className="ap-subtitle">{prompts.length} prompt{prompts.length !== 1 ? 's' : ''} in library</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Prompt
        </button>
      </div>

      <div className={`ap-layout ${showForm ? 'with-form' : ''}`}>
        {/* Table Section */}
        <div className="ap-table-section">
          {loading ? (
            <div className="ap-loading">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="ap-skeleton-row">
                  <div className="ap-skeleton-thumb" />
                  <div className="ap-skeleton-lines">
                    <div className="ap-skeleton-line" style={{ width: '55%' }} />
                    <div className="ap-skeleton-line" style={{ width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon">✨</div>
              <h3>No prompts yet</h3>
              <p>Start by adding your first AI prompt to the gallery.</p>
              <button className="ap-btn ap-btn-primary" onClick={openAdd}>Add First Prompt</button>
            </div>
          ) : (
            <div className="ap-cards-grid">
              {prompts.map(prompt => {
                const model = AI_MODELS.find(m => m.value === prompt.aiModel);
                return (
                  <div key={prompt.id} className={`ap-card ${editingId === prompt.id ? 'ap-card--editing' : ''}`}>
                    <div className="ap-card-img-wrap">
                      {prompt.mediaType === 'VIDEO' ? (
                        <video src={prompt.mediaUrl} className="ap-card-img" muted />
                      ) : (
                        <img src={prompt.mediaUrl} alt={prompt.title} className="ap-card-img" />
                      )}
                      {model && (
                        <div className="ap-card-model-badge" style={{ '--mc': model.color }}>
                          {model.icon} {model.label}
                        </div>
                      )}
                      <div className="ap-card-type">{prompt.mediaType}</div>
                    </div>
                    <div className="ap-card-body">
                      <h4 className="ap-card-title">{prompt.title}</h4>
                      {prompt.description && (
                        <p className="ap-card-desc">
                          {prompt.description.length > 70
                            ? prompt.description.slice(0, 70) + '...'
                            : prompt.description}
                        </p>
                      )}
                      <p className="ap-card-date">
                        {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="ap-card-actions">
                      <button className="ap-card-btn ap-card-btn--edit" onClick={() => openEdit(prompt)} title="Edit">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button className="ap-card-btn ap-card-btn--delete" onClick={() => setDeleteConfirm(prompt)} title="Delete">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Slide-in Form Panel */}
        {showForm && (
          <div className="ap-form-panel">
            <div className="ap-form-panel-header">
              <h2>{editingId ? 'Edit Prompt' : 'New Prompt'}</h2>
              <button className="ap-form-close" onClick={cancelForm} title="Close">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Image preview */}
            {formData.mediaUrl && (
              <div className="ap-form-preview">
                {formData.mediaType === 'VIDEO' ? (
                  <video src={formData.mediaUrl} className="ap-preview-img" muted />
                ) : (
                  <img src={formData.mediaUrl} alt="preview" className="ap-preview-img" />
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ap-form">
              <div className="ap-field">
                <label className="ap-label">Title <span>*</span></label>
                <input
                  id="ap-title"
                  type="text"
                  name="title"
                  className="ap-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Futuristic City at Night"
                />
              </div>

              <div className="ap-field">
                <label className="ap-label">Description</label>
                <textarea
                  name="description"
                  className="ap-input ap-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short description for gallery cards..."
                />
              </div>

              {/* Category Dropdown */}
              <div className="ap-field">
                <label className="ap-label">Category <span>*</span></label>
                <select
                  name="category"
                  className="ap-input"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* AI Model - Visual selector */}
              <div className="ap-field">
                <label className="ap-label">AI Model <span>*</span></label>
                <div className="ap-model-grid">
                  {AI_MODELS.map(model => (
                    <button
                      key={model.value}
                      type="button"
                      className={`ap-model-chip ${formData.aiModel === model.value ? 'active' : ''}`}
                      style={{ '--mc': model.color }}
                      onClick={() => setFormData(prev => ({ ...prev, aiModel: model.value }))}
                    >
                      <span className="ap-model-chip-icon">{model.icon}</span>
                      <span>{model.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Type - Toggle */}
              <div className="ap-field">
                <label className="ap-label">Media Type <span>*</span></label>
                <div className="ap-toggle-row">
                  {['PHOTO', 'VIDEO'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`ap-toggle-btn ${formData.mediaType === type ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, mediaType: type }))}
                    >
                      {type === 'PHOTO' ? '📷' : '▶'} {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ap-field">
                <label className="ap-label">Image <span>*</span></label>
                <ImageUploadField
                  onUploadSuccess={handleUploadSuccess}
                  currentUrl={formData.mediaUrl}
                  disabled={saving}
                />
                {/* Manual URL override — auto-filled after upload, editable as fallback */}
                <input
                  type="url"
                  name="mediaUrl"
                  className="ap-input"
                  style={{ marginTop: '8px' }}
                  value={formData.mediaUrl}
                  onChange={handleChange}
                  required
                  placeholder="CDN URL auto-filled after upload — or paste a URL manually"
                />
                {uploadedRawUrl && (
                  <span className="ap-hint">
                    Raw fallback: <a href={uploadedRawUrl} target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>{uploadedRawUrl}</a>
                  </span>
                )}
                {!uploadedRawUrl && (
                  <span className="ap-hint">Upload an image above, or paste any public URL directly</span>
                )}
              </div>

              <div className="ap-field">
                <label className="ap-label">Prompt Text <span>*</span></label>
                <textarea
                  name="promptText"
                  className="ap-input ap-textarea ap-textarea--tall"
                  value={formData.promptText}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Enter the full prompt used to generate this image/video..."
                />
              </div>

              <div className="ap-form-actions">
                <button type="button" className="ap-btn ap-btn-ghost" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="ap-btn ap-btn-primary" disabled={saving}>
                  {saving ? (
                    <><div className="ap-spinner" /> Saving...</>
                  ) : (
                    <>{editingId ? '✓ Update Prompt' : '+ Save Prompt'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromptsPage;
