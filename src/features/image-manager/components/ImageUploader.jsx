import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, Github } from 'lucide-react';

const ImageUploader = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const validateFile = (selectedFile) => {
        setError(null);
        if (!selectedFile) return false;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Only JPG, PNG, WEBP, and GIF formats are allowed.');
            return false;
        }
        
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB.');
            return false;
        }
        
        return true;
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        }
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);
        try {
            await onUploadSuccess(file);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="up-container">
            <style>{`
                .up-container {
                    background-color: #ffffff;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    overflow: hidden;
                }
                
                @media (max-width: 480px) {
                    .up-container {
                        border-radius: 8px;
                    }
                }

                .up-dropzone {
                    position: relative;
                    padding: 40px;
                    transition: all 0.3s ease;
                    background-color: ${isDragging ? '#eef2ff' : '#ffffff'};
                    border-bottom: 1px solid transparent;
                }
                
                @media (max-width: 768px) {
                    .up-dropzone {
                        padding: 24px 16px;
                    }
                }

                .up-dashed-border {
                    position: absolute;
                    top: 16px; right: 16px; bottom: 16px; left: 16px;
                    border: 2px dashed ${isDragging ? '#818cf8' : '#d1d5db'};
                    border-radius: 12px;
                    pointer-events: none;
                    transition: border-color 0.3s;
                }
                
                @media (max-width: 768px) {
                    .up-dashed-border {
                        top: 8px; right: 8px; bottom: 8px; left: 8px;
                    }
                }

                .up-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    z-index: 10;
                    padding: 16px 0;
                }

                .up-icon-circle {
                    width: 56px;
                    height: 56px;
                    background-color: #eef2ff;
                    color: #4f46e5;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    border: 1px solid #e0e7ff;
                    transition: transform 0.2s;
                }
                
                .up-empty-state:hover .up-icon-circle {
                    transform: scale(1.1);
                }

                .up-title {
                    font-size: 16px !important;
                    font-weight: 700 !important;
                    color: #1f2937;
                    margin: 0 0 4px 0;
                    text-align: center;
                }

                .up-subtitle {
                    font-size: 13px;
                    font-weight: 500;
                    color: #6b7280;
                    margin: 0;
                    text-align: center;
                }

                .up-active-state {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    flex-wrap: wrap;
                }
                
                @media (max-width: 768px) {
                    .up-active-state {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 16px;
                    }
                }

                .up-file-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex: 1 1 auto;
                    min-width: 0;
                }

                .up-preview-box {
                    width: 64px;
                    height: 64px;
                    border-radius: 8px;
                    background-color: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 1px solid #e5e7eb;
                }

                .up-file-name {
                    font-size: 14px !important;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 4px 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
                
                @media (max-width: 480px) {
                    .up-file-name {
                        font-size: 12px !important;
                        margin: 0 0 2px 0;
                    }
                }

                .up-file-size {
                    font-size: 12px;
                    font-weight: 500;
                    color: #6b7280;
                    margin: 0;
                }

                .up-action-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                @media (max-width: 768px) {
                    .up-action-row {
                        flex-direction: row;
                        width: 100%;
                    }
                }

                .up-remove-btn {
                    padding: 8px;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    background-color: transparent;
                    color: #6b7280;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .up-remove-btn:hover {
                    background-color: #f3f4f6;
                    color: #dc2626;
                }

                .up-upload-btn {
                    padding: 10px 24px;
                    background-color: #4f46e5;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 8px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                
                @media (max-width: 768px) {
                    .up-upload-btn {
                        flex: 1;
                    }
                }
                
                @media (max-width: 480px) {
                    .up-container {
                        border-radius: 8px !important;
                    }
                    .up-dropzone {
                        padding: 16px 12px !important;
                    }
                    .up-icon-circle {
                        width: 40px !important;
                        height: 40px !important;
                        margin-bottom: 8px !important;
                    }
                    .up-title {
                        font-size: 14px !important;
                    }
                    .up-subtitle {
                        font-size: 11px !important;
                    }
                    .up-active-state {
                        padding: 12px !important;
                        gap: 12px !important;
                    }
                    .up-preview-box {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 6px !important;
                    }
                    .up-file-info {
                        gap: 12px !important;
                        max-width: 100% !important;
                        overflow: hidden !important;
                    }
                    .up-file-name {
                        font-size: 12px !important;
                        margin: 0 0 2px 0 !important;
                        width: 100% !important;
                        max-width: calc(100vw - 120px) !important;
                    }
                    .up-file-size {
                        font-size: 11px !important;
                    }
                    .up-action-row {
                        gap: 8px !important;
                    }
                    .up-upload-btn {
                        padding: 8px 16px !important;
                        font-size: 13px !important;
                        flex: 1 !important;
                        height: 36px !important;
                    }
                    .up-remove-btn {
                        padding: 6px !important;
                        height: 36px !important;
                        width: 36px !important;
                    }
                }

                .up-upload-btn:hover:not(:disabled) {
                    background-color: #4338ca;
                }

                .up-error-box {
                    background-color: #fef2f2;
                    border-top: 1px solid #fee2e2;
                    padding: 12px 24px;
                    display: flex;
                    justify-content: center;
                }

                .up-error-text {
                    font-size: 13px;
                    font-weight: 500;
                    color: #dc2626;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>

            <div 
                className="up-dropzone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="up-dashed-border"></div>

                {!file ? (
                    <div 
                        className="up-empty-state"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="up-icon-circle">
                            <UploadCloud size={28} strokeWidth={1.5} />
                        </div>
                        <div className="up-title">
                            Click to upload or drag and drop
                        </div>
                        <p className="up-subtitle">
                            SVG, PNG, JPG, or GIF (Max 10MB)
                        </p>
                    </div>
                ) : (
                    <div className="up-active-state">
                        <div className="up-file-info">
                            <div className="up-preview-box">
                                {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                ) : (
                                    <UploadCloud size={24} color="#9ca3af" />
                                )}
                            </div>
                            <div style={{ minWidth: 0, paddingRight: '16px' }}>
                                <p className="up-file-name" title={file.name}>{file.name}</p>
                                <p className="up-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>

                        <div className="up-action-row">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="up-remove-btn"
                                title="Remove file"
                                disabled={isUploading}
                            >
                                <X size={20} />
                            </button>
                            
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="up-upload-btn"
                                style={{
                                    opacity: isUploading ? 0.7 : 1,
                                    cursor: isUploading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Github size={18} />
                                        Save to GitHub
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    style={{ display: 'none' }}
                    accept="image/jpeg, image/png, image/webp, image/gif" 
                />
            </div>
            
            {error && (
                <div className="up-error-box">
                    <p className="up-error-text">
                        <X size={16} /> {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
