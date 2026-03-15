const fs = require('fs');
const path = require('path');

const basePath = 'e:/myproject/findsharp/chiatanya-tech-world/src/apps/photo-editor/components';

// WebDev.jsx
let webDevContent = fs.readFileSync(path.join(basePath, 'WebDev.jsx'), 'utf8');
webDevContent = webDevContent.replace(/const features = \[[^]*?\];\n\nconst stats = \[[^]*?\];/m, "import { webDevFeatures as features, webDevStats as stats } from '../../../config/photoEditorData';");
fs.writeFileSync(path.join(basePath, 'WebDev.jsx'), webDevContent);

// Portfolio.jsx
let portContent = fs.readFileSync(path.join(basePath, 'Portfolio.jsx'), 'utf8');
portContent = portContent.replace(/const categories = \['All', 'Design', 'Websites', 'Branding'\];\n\nlet galleryData = {};[^]*?export const projects = \[[^]*?\];/m, "import { categories, projects } from '../../../config/photoEditorData';");
fs.writeFileSync(path.join(basePath, 'Portfolio.jsx'), portContent);

// GalleryPage.jsx
let galContent = fs.readFileSync(path.join(basePath, 'GalleryPage.jsx'), 'utf8');
galContent = galContent.replace(/\/\* ── Per‑service rich data ──────────────────────────────── \*\/[\s\S]*?const SERVICE_DATA = \{[\s\S]*?\n\};\n\n\/\* ── Lightbox ──────────────────────────────────────────────── \*\//m, "import { SERVICE_DATA } from '../../../config/photoEditorData';\n\n/* ── Lightbox ──────────────────────────────────────────────── */");
fs.writeFileSync(path.join(basePath, 'GalleryPage.jsx'), galContent);

console.log('Refactoring config imports complete');
