import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { installStaleChunkHandler } from './utils/lazyWithRetry';

installStaleChunkHandler();

// Legacy global styles (landing / contact pages)
import './styles/colors.css';
import './styles/global.css';

// CTW design system — order matters: tokens → base → components
import './design-system/tokens.css';
import './design-system/base.css';
import './design-system/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
