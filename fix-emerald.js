import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/bg-emerald-50\b/g, "bg-emerald-500/10");
content = content.replace(/bg-violet-50\b/g, "bg-violet-500/10");
content = content.replace(/bg-amber-50\b/g, "bg-amber-500/10");
fs.writeFileSync('src/App.tsx', content);
