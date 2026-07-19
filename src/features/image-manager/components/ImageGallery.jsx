import React, { useState } from 'react';
import { Copy, Trash2, ExternalLink, Image as ImageIcon, Check, UploadCloud, Sparkles } from 'lucide-react';
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
            <>
                <style>{`
                    .im-empty-state {
                        min-height: 380px;
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(260px, 380px);
                        align-items: stretch;
                        gap: 0;
                        background: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
                    }

                    .im-empty-copy {
                        padding: 44px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .im-empty-kicker {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 18px;
                        padding: 7px 11px;
                        border: 1px solid #dbeafe;
                        border-radius: 999px;
                        background: #eff6ff;
                        color: #1d4ed8;
                        font-size: 12px;
                        font-weight: 800;
                        letter-spacing: 0;
                    }

                    .im-empty-state h3 {
                        margin: 0;
                        max-width: 520px;
                        color: #111827;
                        font-size: 26px;
                        line-height: 1.18;
                        font-weight: 800;
                        letter-spacing: 0;
                    }

                    .im-empty-state p {
                        margin: 12px 0 0;
                        max-width: 560px;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.65;
                        font-weight: 500;
                    }

                    .im-empty-steps {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 10px;
                        width: 100%;
                        margin-top: 26px;
                    }

                    .im-empty-step {
                        min-height: 82px;
                        padding: 13px;
                        border: 1px solid #eef2f7;
                        border-radius: 10px;
                        background: #f8fafc;
                    }

                    .im-empty-step span {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        margin-bottom: 9px;
                        border-radius: 50%;
                        background: #111827;
                        color: #ffffff;
                        font-size: 11px;
                        font-weight: 800;
                    }

                    .im-empty-step strong {
                        display: block;
                        color: #1f2937;
                        font-size: 12px;
                        line-height: 1.35;
                        font-weight: 800;
                    }

                    .im-empty-preview {
                        position: relative;
                        min-height: 100%;
                        background: #f8fafc;
                        border-left: 1px solid #e5e7eb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 32px;
                    }

                    .im-empty-preview-grid {
                        width: min(100%, 280px);
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 12px;
                    }

                    .im-empty-tile {
                        aspect-ratio: 1;
                        border-radius: 12px;
                        border: 1px solid #e5e7eb;
                        background:
                            linear-gradient(135deg, rgba(79, 70, 229, 0.14), rgba(16, 185, 129, 0.08)),
                            #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #64748b;
                        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
                    }

                    .im-empty-tile:nth-child(2) {
                        transform: translateY(18px);
                        background:
                            linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(244, 114, 182, 0.08)),
                            #ffffff;
                    }

                    .im-empty-tile:nth-child(3) {
                        transform: translateY(-8px);
                        background:
                            linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(99, 102, 241, 0.08)),
                            #ffffff;
                    }

                    .im-empty-upload-mark {
                        position: absolute;
                        right: 24px;
                        bottom: 24px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 12px;
                        border: 1px solid #d1fae5;
                        border-radius: 10px;
                        background: #ecfdf5;
                        color: #047857;
                        font-size: 12px;
                        font-weight: 800;
                        box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
                    }

                    @media (max-width: 900px) {
                        .im-empty-state {
                            grid-template-columns: 1fr;
                            min-height: 0;
                        }

                        .im-empty-copy {
                            padding: 32px 24px;
                            align-items: center;
                            text-align: center;
                        }

                        .im-empty-preview {
                            min-height: 210px;
                            border-left: none;
                            border-top: 1px solid #e5e7eb;
                        }

                        .im-empty-state h3 {
                            font-size: 22px;
                        }

                        .im-empty-steps {
                            max-width: 520px;
                        }
                    }

                    @media (max-width: 560px) {
                        .im-empty-state {
                            border-radius: 10px;
                        }

                        .im-empty-copy {
                            padding: 26px 16px;
                        }

                        .im-empty-state h3 {
                            font-size: 19px;
                            line-height: 1.28;
                        }

                        .im-empty-state p {
                            font-size: 13px;
                            line-height: 1.55;
                        }

                        .im-empty-steps {
                            grid-template-columns: 1fr;
                            gap: 8px;
                            margin-top: 20px;
                        }

                        .im-empty-step {
                            min-height: 0;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            text-align: left;
                            padding: 10px;
                        }

                        .im-empty-step span {
                            margin-bottom: 0;
                            flex: 0 0 auto;
                        }

                        .im-empty-preview {
                            min-height: 170px;
                            padding: 22px;
                        }

                        .im-empty-preview-grid {
                            width: min(100%, 220px);
                            gap: 9px;
                        }

                        .im-empty-tile {
                            border-radius: 10px;
                        }

                        .im-empty-upload-mark {
                            right: 14px;
                            bottom: 14px;
                            padding: 8px 10px;
                            font-size: 11px;
                        }
                    }
                `}</style>
                <div className="im-empty-state">
                    <div className="im-empty-copy">
                        <div className="im-empty-kicker">
                            <Sparkles size={14} />
                            Repository Gallery
                        </div>
                        <h3>No images uploaded yet</h3>
                        <p>Upload an image from the uploader pane and it will appear here with its GitHub URL ready to copy, preview, or manage.</p>

                        <div className="im-empty-steps" aria-label="Image upload flow">
                            <div className="im-empty-step">
                                <span>1</span>
                                <strong>Choose an image file</strong>
                            </div>
                            <div className="im-empty-step">
                                <span>2</span>
                                <strong>Upload to repository</strong>
                            </div>
                            <div className="im-empty-step">
                                <span>3</span>
                                <strong>Copy and reuse the URL</strong>
                            </div>
                        </div>
                    </div>
                    <div className="im-empty-preview" aria-hidden="true">
                        <div className="im-empty-preview-grid">
                            <div className="im-empty-tile"><ImageIcon size={28} /></div>
                            <div className="im-empty-tile"><ImageIcon size={28} /></div>
                            <div className="im-empty-tile"><ImageIcon size={28} /></div>
                            <div className="im-empty-tile"><ImageIcon size={28} /></div>
                        </div>
                        <div className="im-empty-upload-mark">
                            <UploadCloud size={15} />
                            Ready
                        </div>
                    </div>
                </div>
            </>
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
