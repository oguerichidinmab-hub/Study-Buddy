import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/text-zinc-100/g, "text-slate-100");
content = content.replace(/text-zinc-200/g, "text-slate-200");
content = content.replace(/text-zinc-300/g, "text-slate-300");
content = content.replace(/text-zinc-700/g, "text-slate-300");
content = content.replace(/bg-zinc-100/g, "bg-slate-700");
content = content.replace(/border-zinc-300/g, "border-slate-600");
fs.writeFileSync('src/App.tsx', content);
