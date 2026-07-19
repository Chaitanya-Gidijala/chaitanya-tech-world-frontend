import React, { useState } from 'react';
import { Copy, Trash2, ExternalLink, Image as ImageIcon, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const ImageGallery = ({ images, onDelete, isDeleting }) => {
    const { showToast } = useToast();
    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                showToast('URL copied to clipboard!', 'success');
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch(() => showToast('Failed to copy URL', 'error'));
    };

    if (!images || images.length === 0) {
        return (
            <div className="im-empty-state">
                <div className="im-empty-icon">
                    <ImageIcon size={28} />
                </div>
                <h3>No images uploaded yet</h3>
                <p>Upload your first image using the uploader pane to see it appear in this repository gallery.</p>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .im-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 16px;
                }
                
                @media (max-width: 1024px) {
                    .im-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .im-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }
                }
                
                @media (max-width: 480px) {
                    .im-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }
                }

                .im-card {
                    background-color: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                }
                
                .im-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .im-image-container {
                    height: 120px;
                    position: relative;
                    background-color: #f9fafb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                @media (max-width: 768px) {
                    .im-image-container {
                        height: 90px;
                    }
                }

                .im-checkerboard {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    opacity: 0.1;
                    background-image: linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%);
                    background-size: 16px 16px;
                    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
                }

                .im-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    position: relative;
                    z-index: 10;
                }

                .im-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(17, 24, 39, 0.7);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    z-index: 20;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .im-card:hover .im-overlay {
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    /* On mobile, always show overlay slightly or rely on the below-image buttons */
                    .im-overlay {
                        display: none; /* Hide hover overlay on mobile to save space, rely on footer buttons */
                    }
                }

                .im-action-btn {
                    width: 32px;
                    height: 32px;
                    background-color: rgba(255, 255, 255, 0.2);
                    color: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    text-decoration: none;
                }

                .im-action-btn:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .im-action-btn.danger {
                    background-color: rgba(239, 68, 68, 0.9);
                }

                .im-action-btn.danger:hover {
                    background-color: rgba(220, 38, 38, 1);
                }

                .im-body {
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                
                @media (max-width: 768px) {
                    .im-body {
                        padding: 8px;
                    }
                }

                .im-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 4px 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .im-date {
                    font-size: 10px;
                    font-weight: 500;
                    color: #6b7280;
                    margin: 0 0 8px 0;
                }

                .im-footer {
                    margin-top: auto;
                    padding-top: 8px;
                    border-top: 1px solid #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .im-copy-btn {
                    font-size: 10px;
                    font-weight: 700;
                    color: #ffffff;
                    background-color: #4f46e5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    padding: 6px;
                    width: 100%;
                    transition: background-color 0.2s;
                }

                .im-copy-btn:hover {
                    background-color: #4338ca;
                }
                
                .im-copy-btn.copied {
                    background-color: #10b981;
                }

                .im-url-input {
                    font-size: 9px;
                    color: #6b7280;
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    padding: 4px;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    outline: none;
                }
                
                .im-delete-mobile {
                    display: none;
                }
                
                @media (max-width: 768px) {
                    .im-delete-mobile {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 4px;
                        font-size: 10px;
                        font-weight: 600;
                        color: #ef4444;
                        background: none;
                        border: 1px solid #fee2e2;
                        background-color: #fef2f2;
                        border-radius: 4px;
                        padding: 6px;
                        width: 100%;
                        cursor: pointer;
                        margin-top: 4px;
                    }
                }

                /* Empty state */
                .im-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 64px 20px;
                    background-color: #ffffff;
                    border: 1px solid #f3f4f6;
                    border-radius: 16px;
                    text-align: center;
                }
                .im-empty-icon {
                    width: 64px;
                    height: 64px;
                    background-color: #f9fafb;
                    border: 1px solid #f3f4f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                    margin-bottom: 16px;
                }
            `}</style>
            
            <div className="im-grid">
                {images.map((image) => (
                    <div key={image.id} className="im-card">
                        <div className="im-image-container">
                            <div className="im-checkerboard"></div>
                            <img 
                                src={image.githubUrl} 
                                alt={image.filename} 
                                className="im-image"
                                loading="lazy"
                            />
                            
                            <div className="im-overlay">
                                <a 
                                    href={image.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="im-action-btn"
                                    title="Open Full Image"
                                >
                                    <ExternalLink size={14} />
                                </a>
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Delete this image from the GitHub repository permanently?')) {
                                            onDelete(image.id);
                                        }
                                    }}
                                    disabled={isDeleting === image.id}
                                    className="im-action-btn danger"
                                    style={{ opacity: isDeleting === image.id ? 0.5 : 1 }}
                                    title="Delete from GitHub"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="im-body">
                            <h4 className="im-title" title={image.filename}>
                                {image.filename}
                            </h4>
                            
                            <div className="im-footer">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={image.githubUrl} 
                                    className="im-url-input"
                                    onClick={(e) => e.target.select()}
                                    title="Click to select URL"
                                />
                                <button
                                    onClick={() => copyToClipboard(image.githubUrl, image.id)}
                                    className={`im-copy-btn ${copiedId === image.id ? 'copied' : ''}`}
                                >
                                    {copiedId === image.id ? <Check size={12} /> : <Copy size={12} />} 
                                    {copiedId === image.id ? 'Copied!' : 'Copy URL'}
                                </button>
                                
                                <button 
                                    className="im-delete-mobile"
                                    onClick={() => {
                                        if (window.confirm('Delete this image?')) {
                                            onDelete(image.id);
                                        }
                                    }}
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ImageGallery;
