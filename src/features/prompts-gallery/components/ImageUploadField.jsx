import React, { useState, useRef, useCallback } from 'react';
import './ImageUploadField.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (server limit)
const ALLOWED_TYPES  = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXT    = '.jpg, .jpeg, .png, .webp';

// ─── Client-side compression ─────────────────────────────────────────────────
/**
 * Draws the image onto a canvas at a reduced quality/size and returns a Blob.
 * Targets ≤ 4 MB so there's head-room under the 5 MB server limit.
 */
async function compressImage(file, maxWidthPx = 1920, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions keeping aspect ratio
        let { width, height } = img;
        if (width > maxWidthPx) {
          height = Math.round((height * maxWidthPx) / width);
          width  = maxWidthPx;
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        // Prefer WebP for best compression, fall back to JPEG
        const mimeOut = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => resolve(blob || file), // if toBlob fails, use original
          mimeOut,
          quality
        );
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * ImageUploadField
 *
 * Props:
 *  - onUploadSuccess(result)  called with { imageUrl, rawUrl, path, sha } after successful upload
 *  - currentUrl               existing image URL shown when editing a prompt
 *  - disabled                 disables the field while parent form is saving
 */
const ImageUploadField = ({ onUploadSuccess, currentUrl, disabled }) => {
  const [preview,    setPreview]   = useState(currentUrl || null);
  const [uploading,  setUploading] = useState(false);
  const [progress,   setProgress]  = useState(0);   // 0-100
  const [error,      setError]     = useState(null);
  const [cdnFailed,  setCdnFailed] = useState(false); // track CDN fallback
  const fileInputRef = useRef(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type "${file.type}". Only JPG, PNG and WEBP are allowed.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return `File is ${mb} MB. It will be compressed automatically — if still too large after compression, please resize it first.`;
    }
    return null;
  };

  // ── Core upload flow ────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    setError(null);
    setCdnFailed(false);

    // 1. Client-side validation
    const validationError = validate(file);
    if (validationError) { setError(validationError); return; }

    // 2. Show local preview immediately for responsive feel
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    // 3. Compress if over 2 MB to keep uploads fast, especially on mobile
    let fileToUpload = file;
    if (file.size > 2 * 1024 * 1024) {
      setProgress(10);
      const blob = await compressImage(file);
      fileToUpload = new File([blob], file.name, { type: blob.type });
    }

    // 4. Upload to backend
    setUploading(true);
    setProgress(30);

    const formData = new FormData();
    formData.append('file', fileToUpload);

    const token = localStorage.getItem('jp_admin_token');

    try {
      // Simulate progress while waiting (XHR progress events aren't great with fetch)
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 85 ? prev + 8 : prev));
      }, 400);

      const response = await fetch(
        `${import.meta.env.VITE_API_HOST || 'https://job-portal-backend-world-4ay3.onrender.com/api'}/admin/prompts/upload-image`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setProgress(95);

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `Upload failed (${response.status})`);
      }

      const result = json.data; // { imageUrl, rawUrl, path, sha, originalFilename }
      setProgress(100);
      onUploadSuccess(result);

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setPreview(currentUrl || null); // revert preview on failure
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }, [currentUrl, onUploadSuccess]);

  // ── Event handlers ───────────────────────────────────────────────────────────
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset so same file can be re-selected after error
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e) => e.preventDefault();

  const clearImage = () => {
    setPreview(null);
    setError(null);
    setProgress(0);
    onUploadSuccess(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="iuf-root">
      {/* Drop zone / trigger */}
      <div
        className={`iuf-dropzone ${uploading ? 'iuf-dropzone--uploading' : ''} ${preview ? 'iuf-dropzone--has-preview' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => !uploading && !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label="Image upload area"
      >
        {/* Preview image */}
        {preview ? (
          <div className="iuf-preview-wrap">
            <img
              src={cdnFailed && currentUrl ? currentUrl : preview}
              alt="Preview"
              className="iuf-preview-img"
              onError={() => {
                if (!cdnFailed) {
                  setCdnFailed(true);
                }
              }}
            />
            {!uploading && !disabled && (
              <div className="iuf-preview-overlay">
                <span>🔄 Click or drag to replace</span>
              </div>
            )}
          </div>
        ) : (
          <div className="iuf-placeholder">
            <div className="iuf-placeholder-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className="iuf-placeholder-title">Drag &amp; drop an image here</p>
            <p className="iuf-placeholder-sub">or click to browse · JPG, PNG, WEBP · max 5 MB</p>
            <p className="iuf-placeholder-sub">📱 Mobile camera photos are auto-compressed</p>
          </div>
        )}

        {/* Progress bar */}
        {uploading && (
          <div className="iuf-progress-bar-wrap">
            <div className="iuf-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Hidden file input — allow camera capture on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXT}
        capture="environment"
        className="iuf-hidden-input"
        onChange={onFileChange}
        disabled={uploading || disabled}
        aria-hidden="true"
      />

      {/* Action buttons */}
      <div className="iuf-actions">
        <button
          type="button"
          className="iuf-btn iuf-btn--browse"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
        >
          {uploading ? (
            <><span className="iuf-spinner" /> Uploading…</>
          ) : (
            <>📂 {preview ? 'Replace Image' : 'Choose Image'}</>
          )}
        </button>

        {preview && !uploading && (
          <button
            type="button"
            className="iuf-btn iuf-btn--clear"
            onClick={clearImage}
            disabled={disabled}
          >
            ✕ Remove
          </button>
        )}
      </div>

      {/* Status messages */}
      {uploading && (
        <p className="iuf-status iuf-status--info">
          ⏳ Uploading to GitHub… {progress}%
        </p>
      )}
      {error && (
        <p className="iuf-status iuf-status--error" role="alert">
          ⚠ {error}
        </p>
      )}
      {!uploading && !error && preview && preview !== currentUrl && (
        <p className="iuf-status iuf-status--success">
          ✓ Image uploaded · CDN URL saved
        </p>
      )}

      {/* Hint below field */}
      <p className="iuf-hint">
        Images are stored in GitHub and served via jsDelivr CDN for fast global delivery.
        A raw GitHub URL is saved as fallback.
      </p>
    </div>
  );
};

export default ImageUploadField;
