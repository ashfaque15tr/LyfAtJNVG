const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. GENERATE COMPLETE BATCH OPTIONS HTML (1993 - 2026)
// =========================================================================
let batchOptionsHtml = '<option value="all">All Batches</option>\n';
for (let y = 1993; y <= 2026; y++) {
  const label = (y === 1993) ? '1993 (First Batch)' : String(y);
  batchOptionsHtml += `              <option value="${y}">${label}</option>\n`;
}

// =========================================================================
// 2. UPDATE index.html
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const oldBatchSelectRegex = /<select id="dirBatchFilter"[\s\S]*?<\/select>/;
const newBatchSelectHtml = `<select id="dirBatchFilter" onchange="filterDirectory()" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200">
${batchOptionsHtml}            </select>`;

if (oldBatchSelectRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldBatchSelectRegex, newBatchSelectHtml);
  console.log('✓ Updated dirBatchFilter in index.html with all batches (1993-2026)');
} else {
  console.warn('⚠️ Could not match dirBatchFilter in index.html');
}

indexHtml = indexHtml.replace(/\?v=20261122_[a-zA-Z0-9]+/g, '?v=20261122_v6');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');


// =========================================================================
// 3. UPDATE mobile_app/index.html
// =========================================================================
const mobIndexPath = path.join(rootDir, 'mobile_app', 'index.html');
if (fs.existsSync(mobIndexPath)) {
  let mobIndex = fs.readFileSync(mobIndexPath, 'utf8');
  if (oldBatchSelectRegex.test(mobIndex)) {
    mobIndex = mobIndex.replace(oldBatchSelectRegex, newBatchSelectHtml);
    console.log('✓ Updated dirBatchFilter in mobile_app/index.html with all batches (1993-2026)');
  }
  mobIndex = mobIndex.replace(/\?v=20261122_[a-zA-Z0-9]+/g, '?v=20261122_v6');
  fs.writeFileSync(mobIndexPath, mobIndex, 'utf8');
}


// =========================================================================
// 4. UPDATE assets/js/app.js (Dynamic Populator & Direct Rakesh Photo Sync)
// =========================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A) Add populateBatchFilterOptions helper before renderDirectory
const dynamicBatchPopulator = `
function populateBatchFilterOptions() {
  const select = document.getElementById('dirBatchFilter');
  if (!select) return;
  const currentVal = select.value || 'all';

  // Ensure all batches from 1993 to 2026 are present
  const existingValues = new Set();
  for (let i = 0; i < select.options.length; i++) {
    existingValues.add(select.options[i].value);
  }

  const allBatches = new Set();
  for (let y = 1993; y <= 2026; y++) allBatches.add(y);

  if (AppState && Array.isArray(AppState.directory)) {
    AppState.directory.forEach(a => {
      const b = parseInt(a.batch, 10);
      if (b && !isNaN(b)) allBatches.add(b);
    });
  }

  const sorted = Array.from(allBatches).sort((a, b) => a - b);
  let html = '<option value="all">All Batches</option>';
  sorted.forEach(y => {
    const lbl = (y === 1993) ? '1993 (First Batch)' : String(y);
    html += \`<option value="\${y}">\${lbl}</option>\`;
  });
  select.innerHTML = html;
  if (existingValues.has(currentVal)) {
    select.value = currentVal;
  }
}
`;

if (!appJs.includes('function populateBatchFilterOptions()')) {
  appJs = appJs.replace(
    'function renderDirectory(append = false) {',
    dynamicBatchPopulator + '\nfunction renderDirectory(append = false) {'
  );
}

// B) Ensure populateBatchFilterOptions is called inside renderDirectory
appJs = appJs.replace(
  /if \(window\.AlumniStorageEngine && typeof window\.AlumniStorageEngine\.buildCacheIndexes === 'function'\) \{\s*window\.AlumniStorageEngine\.buildCacheIndexes\(AppState\.directory \|\| \[\]\);\s*\}/,
  `if (typeof populateBatchFilterOptions === 'function') populateBatchFilterOptions();
  if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
    window.AlumniStorageEngine.buildCacheIndexes(AppState.directory || []);
  }`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated assets/js/app.js with populateBatchFilterOptions');


// =========================================================================
// 5. UPDATE assets/js/cloud-sync.js (In-place Directory Enrichment on Sync)
// =========================================================================
const cloudSyncPath = path.join(rootDir, 'assets', 'js', 'cloud-sync.js');
let cloudSync = fs.readFileSync(cloudSyncPath, 'utf8');

// Update syncRegistrations to enrich existing directory records with newly uploaded photo/details
const oldSyncRegDirLogic = /\/\/ Add to Directory if not present[\s\S]*?(?=if \(hasChanges\) \{)/;

const newSyncRegDirLogic = `// Add or in-place enrich Directory
        if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory)) {
          const uPayload = evt.payload;
          const targetEmail = approvedEmail;
          const targetPhone = (uPayload.phone || '').replace(/\\D/g, '').slice(-10);

          let existingDir = null;
          if (uPayload.claimedDirectoryId) {
            existingDir = AppState.directory.find(d => String(d.id) === String(uPayload.claimedDirectoryId));
          }
          if (!existingDir) {
            existingDir = AppState.directory.find(d => 
              (d.email && d.email.toLowerCase() === targetEmail) ||
              (d.phone && d.phone.replace(/\\D/g, '').slice(-10) === targetPhone) ||
              (d.name && d.name.toLowerCase() === (uPayload.name || '').toLowerCase() && parseInt(d.batch) === parseInt(uPayload.batch))
            );
          }

          if (existingDir) {
            if (uPayload.photo) existingDir.photo = uPayload.photo;
            if (uPayload.house) {
              existingDir.house = uPayload.house;
              existingDir.badge = uPayload.house;
            }
            if (uPayload.profession || uPayload.designation) {
              existingDir.role = (uPayload.profession || uPayload.designation);
            }
            if (uPayload.city) existingDir.location = uPayload.city;
            if (uPayload.phone) existingDir.phone = uPayload.phone;
            if (uPayload.email) existingDir.email = uPayload.email;
            existingDir.claimed = true;
            hasChanges = true;
          } else if (uPayload.name) {
            AppState.directory.push({
              id: uPayload.id || \`dir-\${Date.now()}\`,
              name: uPayload.name,
              email: targetEmail,
              phone: uPayload.phone,
              batch: parseInt(uPayload.batch) || 2005,
              house: uPayload.house || 'Aravali',
              role: uPayload.profession || 'Alumnus',
              location: uPayload.city || 'India',
              domain: uPayload.domain || 'Corporate',
              photo: uPayload.photo || null,
              badge: uPayload.house || 'Aravali',
              tag: 'Alumnus',
              claimed: true
            });
            hasChanges = true;
          }
        }
      }
    });
`;

if (oldSyncRegDirLogic.test(cloudSync)) {
  cloudSync = cloudSync.replace(oldSyncRegDirLogic, newSyncRegDirLogic);
  console.log('✓ Updated syncRegistrations in assets/js/cloud-sync.js');
} else {
  console.warn('⚠️ Could not match oldSyncRegDirLogic in cloud-sync.js');
}

fs.writeFileSync(cloudSyncPath, cloudSync, 'utf8');


// =========================================================================
// 6. UPDATE sw.js and login.html
// =========================================================================
const swPath = path.join(rootDir, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const CACHE_NAME = '[^']*';/, "const CACHE_NAME = 'jnvg-alumni-v20261122-v6';");
fs.writeFileSync(swPath, sw, 'utf8');

const loginPath = path.join(rootDir, 'login.html');
let login = fs.readFileSync(loginPath, 'utf8');
login = login.replace(/\?v=20261122_[a-zA-Z0-9]+/g, '?v=20261122_v6');
fs.writeFileSync(loginPath, login, 'utf8');

console.log('✓ All batch filter updates completed.');
