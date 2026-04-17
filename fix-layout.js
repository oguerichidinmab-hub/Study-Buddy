import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// The main layout wrappers
code = code.replace(/max-w-md mx-auto min-h-screen/g, "w-full lg:max-w-7xl mx-auto min-h-screen");

// Fixed inset-0 backgrounds (modals, overlays)
code = code.replace(/fixed inset-0 max-w-md mx-auto/g, "fixed inset-0 w-full");

// Fixed headers / bottom navs
code = code.replace(/w-full max-w-md/g, "w-full lg:max-w-7xl mx-auto");

fs.writeFileSync('src/App.tsx', code);
