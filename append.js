const fs = require('fs');
const content = fs.readFileSync('e:/myproject/findsharp/chiatanya-tech-world/src/apps/photo-editor/components/GalleryPage.jsx', 'utf8');

const match = content.match(/const SERVICE_DATA = \{[\s\S]*?\n\};\n/);
if (match) {
    let data = match[0].replace('const SERVICE_DATA =', 'export const SERVICE_DATA =');
    data = data.replace(/'engagement-invitations':/g, "'engagement-invitations-cards':")
               .replace(/'wedding-invitations':/g, "'wedding-invitations-cards':")
               .replace(/'birthday-invitations':/g, "'birthday-invitations-cards':")
               .replace(/'housewarming-invitations':/g, "'housewarming-invitations-cards':")
               .replace(/'corporate-invitations':/g, "'corporate-invitations-cards':");
    fs.appendFileSync('e:/myproject/findsharp/chiatanya-tech-world/src/config/photoEditorData.js', '\n' + data);
    console.log('Appended SERVICE_DATA successfully');
} else {
    console.log('SERVICE_DATA not found');
}
