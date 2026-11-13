import { Routes, Route } from 'react-router-dom';
import PromptsGalleryPage from './pages/PromptsGalleryPage';
import PromptDetailPage from './pages/PromptDetailPage';

export default function PromptsApp() {
  return (
    <Routes>
      <Route path="/" element={<PromptsGalleryPage />} />
      <Route path="/:id" element={<PromptDetailPage />} />
    </Routes>
  );
}
