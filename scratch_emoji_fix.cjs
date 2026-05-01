const fs = require('fs');
const files = ['ManageJobs.jsx', 'ManageResources.jsx', 'ManageQuizzes.jsx'];
files.forEach(f => {
    const p = 'e:/myproject/chaitanya-tech-world-frontend/chaitanya-tech-world-frontend/src/features/job-portal/components/admin/' + f;
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/ðŸ ¢/g, '🏢').replace(/ðŸ“š/g, '📚').replace(/ðŸ§ /g, '🧠');
    fs.writeFileSync(p, c);
});
console.log("Done");
