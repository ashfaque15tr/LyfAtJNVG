const fs = require('fs');

function inspectLines(file) {
  console.log('=== ' + file + ' ===');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((l, i) => {
    if (l.includes('91617') || l.includes('46797') || l.toLowerCase().includes('virendra')) {
      console.log(`${i + 1}: ${l}`);
    }
  });
}

inspectLines('assets/js/app.js');
inspectLines('assets/js/directory-seed.js');
