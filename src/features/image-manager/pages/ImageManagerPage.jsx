import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { imageService } from '../services/imageService';
import ImageUploader from '../components/ImageUploader';
import ImageGallery from '../components/ImageGallery';
import { useToast } from '@/components/ui/Toast';
import { RefreshCw, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12; // Adjusted to be a multiple of 6 for the 6-col grid

const ImageManagerPage = () => {
    const { showToast } = useToast();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const loadImages = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await imageService.getAllImages();
            setImages(data.data || []);
            setCurrentPage(1); 
        } catch (error) {
            showToast('Failed to load images', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleUploadSuccess = async (file) => {
        try {
            await imageService.uploadImage(file);
            showToast('Image uploaded successfully!', 'success');
            loadImages();
        } catch (error) {
            showToast(error.message || 'Upload failed', 'error');
            throw error;
        }
    };

    const handleDelete = async (id) => {
        setIsDeleting(id);
        try {
            await imageService.deleteImage(id);
            showToast('Image deleted successfully!', 'success');
            setImages(prev => prev.filter(img => img.id !== id));
            if (paginatedImages.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (error) {
            showToast('Failed to delete image', 'error');
        } finally {
            setIsDeleting(null);
        }
    };

    const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE) || 1;
    
    const paginatedImages = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return images.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [images, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="im-page-container">
            <style>{`
                .im-page-container {
                    padding: 24px;
                    max-width: 1600px;
                    margin: 0 auto;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                @media (max-width: 768px) {
                    .im-page-container {
                        padding: 12px;
                        gap: 16px;
                    }
                }

                @media (max-width: 480px) {
                    .im-page-container {
                        padding: 8px; /* Full width on mobile basically */
                        gap: 12px;
                    }
                }

                .im-page-card {
                    background-color: #ffffff;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                @media (max-width: 480px) {
                    .im-page-card {
                        border-radius: 8px; /* Smaller radius on mobile */
                    }
                }

                .im-header-box {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f3f4f6;
                    background-color: #f9fafb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                @media (max-width: 768px) {
                    .im-header-box {
                        padding: 16px;
                    }
                }

                .im-header-title {
                    font-size: 18px !important;
                    font-weight: 700 !important;
                    color: #1f2937;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .im-badge {
                    background-color: #e0e7ff;
                    color: #4f46e5;
                    padding: 2px 10px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .im-header-subtitle {
                    font-size: 13px;
                    color: #6b7280;
                    margin: 4px 0 0 44px;
                }
                
                @media (max-width: 768px) {
                    .im-header-subtitle {
                        margin-left: 0;
                        margin-top: 8px;
                    }
                }
                
                @media (max-width: 480px) {
                    .im-refresh-text {
                        display: none !important;
                    }
                    .im-header-title {
                        font-size: 14px !important;
                        font-family: 'Inter', sans-serif !important;
                    }
                    .im-header-subtitle {
                        font-size: 11px !important;
                        line-height: 1.4 !important;
                        font-family: 'Inter', sans-serif !important;
                    }
                }

                .im-button-secondary {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background-color: #ffffff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    color: #374151;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                @media (max-width: 480px) {
                    .im-button-secondary {
                        padding: 6px 12px;
                        font-size: 12px;
                        gap: 6px;
                    }
                }
                
                .im-button-secondary:hover:not(:disabled) {
                    background-color: #f9fafb;
                    color: #4f46e5;
                }

                .im-pagination-bar {
                    padding: 16px 24px;
                    border-top: 1px solid #f3f4f6;
                    background-color: #ffffff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                @media (max-width: 768px) {
                    .im-pagination-bar {
                        padding: 16px;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                }

                .im-page-button {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .im-page-button.active {
                    border: 1px solid #4f46e5;
                    background-color: #4f46e5;
                    color: #ffffff;
                }
                
                .im-page-button:not(.active) {
                    border: 1px solid transparent;
                    background-color: transparent;
                    color: #4b5563;
                }
                
                .im-page-button:not(.active):hover {
                    background-color: #f3f4f6;
                }
            `}</style>

            {/* Uploader Section */}
            <section>
                <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </section>
            
            {/* Gallery Section */}
            <section className="im-page-card">
                {/* Header */}
                <div className="im-header-box">
                    <div>
                        <div className="im-header-title">
                            <div style={{ padding: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '8px', display: 'flex' }}>
                                <ImageIcon size={20} />
                            </div>
                            Repository Gallery
                            <span className="im-badge">{images.length}</span>
                        </div>
                        <p className="im-header-subtitle">Manage assets stored in your GitHub repository</p>
                    </div>

                    <button 
                        onClick={loadImages} 
                        className="im-button-secondary"
                        style={{ width: 'auto' }}
                        title="Refresh Gallery"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} style={{ color: isLoading ? '#4f46e5' : 'inherit' }} />
                        <span className="im-refresh-text">Refresh Gallery</span>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '400px' }} className="im-gallery-content">
                    <style>{`
                        @media (max-width: 768px) {
                            .im-gallery-content {
                                padding: 12px !important;
                            }
                        }
                    `}</style>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', opacity: 0.6 }}>
                            <RefreshCw size={32} className="animate-spin" style={{ color: '#4f46e5', marginBottom: '16px' }} />
                            <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Syncing with GitHub...</p>
                        </div>
                    ) : (
                        <ImageGallery 
                            images={paginatedImages} 
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                        />
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && images.length > 0 && (
                    <div className="im-pagination-bar">
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Showing <span style={{ fontWeight: '600', color: '#1f2937' }}>{Math.min(images.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span style={{ fontWeight: '600', color: '#1f2937' }}>{Math.min(images.length, currentPage * ITEMS_PER_PAGE)}</span> of <span style={{ fontWeight: '600', color: '#1f2937' }}>{images.length}</span> entries
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="im-button-secondary"
                                style={{
                                    padding: '6px', 
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`im-page-button ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="im-button-secondary"
                                style={{
                                    padding: '6px',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ImageManagerPage;
