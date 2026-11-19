const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function syncWebAssetsTo(targetPublicDir) {
  if (fs.existsSync(targetPublicDir)) {
    fs.rmSync(targetPublicDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetPublicDir, { recursive: true });

  ['index.html', 'login.html', 'manifest.json', 'CNAME', 'robots.txt'].forEach(file => {
    const src = path.join(rootDir, file);
    const dest = path.join(targetPublicDir, file);
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
    copyDir(assetsDir, path.join(targetPublicDir, 'assets'));
  }
}

try {
  // 1. Prepare www/
  const wwwDir = path.join(rootDir, 'www');
  syncWebAssetsTo(wwwDir);

  // 2. Prepare android/app/src/main/assets/public/
  const androidPublicDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'public');
  syncWebAssetsTo(androidPublicDir);

  // 3. Ensure capacitor.config.json is in android/app/src/main/assets/
  const capSrc = path.join(rootDir, 'capacitor.config.json');
  const capDest = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'capacitor.config.json');
  if (fs.existsSync(capSrc)) {
    fs.copyFileSync(capSrc, capDest);
  }

  console.log('✅ Web assets successfully compiled into both www/ and android assets public directory.');
} catch (err) {
  console.error('❌ Error compiling web assets:', err);
  process.exit(1);
}
