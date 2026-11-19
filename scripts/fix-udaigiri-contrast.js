const fs = require('fs');
const path = require('path');

// 1. Update assets/css/styles.css and mobile_app/assets/css/styles.css
const cssFiles = [
  path.join(__dirname, '..', 'assets', 'css', 'styles.css'),
  path.join(__dirname, '..', 'mobile_app', 'assets', 'css', 'styles.css')
];

const targetCssBlock = `/* Tinted Containers Overrides in Light Sky Mode */
html[data-theme="sky"] [class*="bg-amber-950"],
body:not(.theme-dark) [class*="bg-amber-950"] {
  background-color: #fefce8 !important;
  border: 1.5px solid #fde68a !important;
  color: #78350f !important;
}`;

const replacementCssBlock = `/* Tinted Containers Overrides in Light Sky Mode - ALL House Variants */
html[data-theme="sky"] [class*="bg-amber-950"],
html[data-theme="sky"] [class*="bg-yellow-950"],
html[data-theme="sky"] [class*="bg-yellow-900"],
html[data-theme="sky"] .bg-yellow-950\\/60,
html[data-theme="sky"] .bg-yellow-950\\/70,
html[data-theme="sky"] .bg-yellow-950\\/80,
body:not(.theme-dark) [class*="bg-amber-950"],
body:not(.theme-dark) [class*="bg-yellow-950"],
body:not(.theme-dark) [class*="bg-yellow-900"],
body:not(.theme-dark) .bg-yellow-950\\/60,
body:not(.theme-dark) .bg-yellow-950\\/70,
body:not(.theme-dark) .bg-yellow-950\\/80 {
  background-color: #fefce8 !important;
  border: 1.5px solid #fde047 !important;
  color: #78350f !important;
}

html[data-theme="sky"] [class*="bg-amber-950"] span,
html[data-theme="sky"] [class*="bg-yellow-950"] span,
html[data-theme="sky"] [class*="bg-yellow-900"] span,
html[data-theme="sky"] .bg-yellow-950\\/60 span,
html[data-theme="sky"] .bg-yellow-950\\/80 span,
body:not(.theme-dark) [class*="bg-amber-950"] span,
body:not(.theme-dark) [class*="bg-yellow-950"] span,
body:not(.theme-dark) [class*="bg-yellow-900"] span,
body:not(.theme-dark) .bg-yellow-950\\/60 span,
body:not(.theme-dark) .bg-yellow-950\\/80 span {
  color: #78350f !important;
  -webkit-text-fill-color: #78350f !important;
}

html[data-theme="sky"] [class*="bg-yellow-950"] span:first-child,
html[data-theme="sky"] .bg-yellow-950\\/60 span:first-child,
html[data-theme="sky"] .bg-yellow-950\\/80 span:first-child,
body:not(.theme-dark) [class*="bg-yellow-950"] span:first-child,
body:not(.theme-dark) .bg-yellow-950\\/60 span:first-child,
body:not(.theme-dark) .bg-yellow-950\\/80 span:first-child {
  color: #78350f !important;
  -webkit-text-fill-color: #78350f !important;
  font-weight: 800 !important;
}

html[data-theme="sky"] [class*="bg-yellow-950"] span:last-child,
html[data-theme="sky"] .bg-yellow-950\\/60 span:last-child,
html[data-theme="sky"] .bg-yellow-950\\/80 span:last-child,
body:not(.theme-dark) [class*="bg-yellow-950"] span:last-child,
body:not(.theme-dark) .bg-yellow-950\\/60 span:last-child,
body:not(.theme-dark) .bg-yellow-950\\/80 span:last-child {
  color: #92400e !important;
  -webkit-text-fill-color: #92400e !important;
  font-weight: 600 !important;
}

html[data-theme="sky"] [class*="border-yellow-500"],
html[data-theme="sky"] [class*="border-yellow-800"],
body:not(.theme-dark) [class*="border-yellow-500"],
body:not(.theme-dark) [class*="border-yellow-800"] {
  border-color: #fde047 !important;
}`;

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetCssBlock)) {
      content = content.replace(targetCssBlock, replacementCssBlock);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated CSS in:', file);
    } else {
      console.log('Target block not found directly, appending replacement:', file);
      content += '\n\n' + replacementCssBlock;
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});

// 2. Add ?v=0.0.2 to styles.css link in html files for instant cache-busting
const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'login.html'),
  path.join(__dirname, '..', 'mobile_app', 'index.html')
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/href="assets\/css\/styles\.css(\?v=[^"]*)?"/g, 'href="assets/css/styles.css?v=0.0.2"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated CSS cache-busting link in:', file);
  }
});

console.log('Udaigiri light mode visibility fix applied successfully.');
