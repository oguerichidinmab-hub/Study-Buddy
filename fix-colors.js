import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard zinc/light colors with dark blue (slate) colors

// Backgrounds
code = code.replace(/bg-zinc-50/g, "bg-slate-900");
code = code.replace(/bg-white/g, "bg-slate-800");

// Text Colors
code = code.replace(/text-zinc-900/g, "text-white");
code = code.replace(/text-zinc-800/g, "text-slate-100");
code = code.replace(/text-zinc-600/g, "text-slate-300");
code = code.replace(/text-zinc-500/g, "text-slate-400");
code = code.replace(/text-zinc-400/g, "text-slate-500");

// Borders
code = code.replace(/border-zinc-100/g, "border-slate-700");
code = code.replace(/border-zinc-200/g, "border-slate-600");

// Secondary Backgrounds / Hover states
code = code.replace(/bg-zinc-100/g, "bg-slate-800");
code = code.replace(/bg-zinc-200/g, "bg-slate-700");

fs.writeFileSync('src/App.tsx', code);
