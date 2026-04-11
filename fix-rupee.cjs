const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/features/photo-editor/components/GalleryPage.jsx');
let content = fs.readFileSync(file, 'utf8');

// Count broken patterns before fix
const before = (content.match(/â‚¹/g) || []).length;

// Replace broken rupee with correct ₹
content = content.replace(/â‚¹/g, '\u20B9');

fs.writeFileSync(file, content, 'utf8');

const afterContent = fs.readFileSync(file, 'utf8');
const after = (afterContent.match(/\u20B9/g) || []).length;

console.log('Broken sequences removed:', before);
console.log('Correct rupee symbols now:', after);
