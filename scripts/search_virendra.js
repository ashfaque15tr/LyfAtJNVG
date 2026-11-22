const fs = require('fs');
const path = require('path');

const patterns = ['9161746797', '91617', '46797', 'rvkp', 'virendra'];

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'refer') continue;
    if (entry.isDirectory()) {
      searchDir(fullPath);
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        patterns.forEach(p => {
          if (content.toLowerCase().includes(p.toLowerCase())) {
            console.log(`FOUND '${p}' in: ${fullPath}`);
          }
        });
      } catch (e) {}
    }
  }
}

searchDir('.');
console.log('Search complete.');
