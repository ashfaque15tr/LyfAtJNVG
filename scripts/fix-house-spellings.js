const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update HTML files
['index.html', 'mobile_app/index.html'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Fix dropdown options in dirHouseFilter
  const oldRegex = /<option value="Aravali">Aravali<\/option>\s*<option value="Shivalik">Shivalik<\/option>\s*<option value="Udaygiri">Udaygiri<\/option>\s*<option value="Neelgiri">Neelgiri<\/option>/g;
  const newOptions = `<option value="Arawali">Arawali</option>\n              <option value="Nilgiri">Nilgiri</option>\n              <option value="Shivalik">Shivalik</option>\n              <option value="Udaigiri">Udaigiri</option>`;
  html = html.replace(oldRegex, newOptions);

  // Fix other occurrences
  html = html.replace(/House Master - Aravali/g, 'House Master - Arawali');
  html = html.replace(/House Master - Udaygiri/g, 'House Master - Udaigiri');
  html = html.replace(/House Master - Neelgiri/g, 'House Master - Nilgiri');
  html = html.replace(/Ashfaq Ahmed \(2005 • Aravali\)/g, 'Ashfaq Ahmed (2005 • Nilgiri)');
  html = html.replace(/Vivek Tiwari \(1994 • Aravali\)/g, 'Vivek Tiwari (1994 • Arawali)');
  html = html.replace(/Alok Dubey, IAS \(2007 • Neelgiri\)/g, 'Alok Dubey, IAS (2007 • Nilgiri)');
  html = html.replace(/Aravali, Neelgiri, Shivalik, Udaygiri House Flags/g, 'Arawali, Nilgiri, Shivalik, Udaigiri House Flags');
  html = html.replace(/<option value="Udaygiri">Udaygiri<\/option>/g, '<option value="Udaigiri">Udaigiri</option>');
  html = html.replace(/Alumnus 1987-1994 Batch • Aravali House/g, 'Alumnus 1987-1994 Batch • Arawali House');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('✅ Updated HTML file:', relPath);
});

// 2. Synchronize JS files to mobile_app
fs.copyFileSync(path.join(rootDir, 'assets', 'js', 'storage-engine.js'), path.join(rootDir, 'mobile_app', 'assets', 'js', 'storage-engine.js'));
fs.copyFileSync(path.join(rootDir, 'assets', 'js', 'app.js'), path.join(rootDir, 'mobile_app', 'assets', 'js', 'app.js'));
console.log('✅ Synchronized storage-engine.js and app.js to mobile_app/assets/js/');
