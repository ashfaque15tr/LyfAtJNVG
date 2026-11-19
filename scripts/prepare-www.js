const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

try {
  if (fs.existsSync(wwwDir)) {
    fs.rmSync(wwwDir, { recursive: true, force: true });
  }
  fs.mkdirSync(wwwDir, { recursive: true });

  ['index.html', 'login.html', 'manifest.json', 'CNAME', 'robots.txt'].forEach(file => {
    const src = path.join(rootDir, file);
    const dest = path.join(wwwDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  });

  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const ent of entries) {
      const s = path.join(src, ent.name);
      const d = path.join(dest, ent.name);
      if (ent.isDirectory()) {
        copyDir(s, d);
      } else {
        fs.copyFileSync(s, d);
      }
    }
  }

  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    copyDir(assetsDir, path.join(wwwDir, 'assets'));
  }
  console.log('✅ Web assets successfully compiled into www/');
} catch (err) {
  console.error('❌ Error compiling web assets to www:', err);
  process.exit(1);
}
