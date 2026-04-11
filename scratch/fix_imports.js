const fs = require('fs');
const path = require('path');

const dir = 'src/features/our-services/components';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('../styles/PhotoEditor.css')) {
            console.log(`Updating ${file}...`);
            content = content.replace('../styles/PhotoEditor.css', '../styles/OurServices_v1.css');
            fs.writeFileSync(filePath, content);
        }
    }
});
