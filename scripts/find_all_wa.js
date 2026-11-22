const fs = require('fs');
const path = require('path');

function searchWA(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'refer' || entry.name === 'scratch') continue;
    if (entry.isDirectory()) {
      searchWA(fullPath);
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((l, idx) => {
          if (l.includes('whatsapp.com') || l.includes('wa.me') || l.includes('9161746797') || l.includes('91617') || l.includes('46797') || l.includes('rvkp')) {
            console.log(`${fullPath}:${idx + 1} -> ${l.trim()}`);
          }
        });
      } catch (e) {}
    }
  }
}

searchWA('.');
