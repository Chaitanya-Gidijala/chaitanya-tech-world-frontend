import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PromptsGalleryPage from './pages/PromptsGalleryPage';
import PromptDetailPage from './pages/PromptDetailPage';

const PromptsApp = () => {
  return (
    <Routes>
      <Route path="/" element={<PromptsGalleryPage />} />
      <Route path="/:id" element={<PromptDetailPage />} />
    </Routes>
  );
};

export default PromptsApp;
