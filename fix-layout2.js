import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Other stragglers
code = code.replace(/max-w-md mx-auto w-full/g, "w-full lg:max-w-7xl mx-auto");
code = code.replace(/max-w-[85%]/g, "max-w-[85%] md:max-w-[70%] lg:max-w-[60%]");

fs.writeFileSync('src/App.tsx', code);
