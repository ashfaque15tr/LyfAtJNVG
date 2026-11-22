const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. UPDATE login.html
// =========================================================================
const loginHtmlPath = path.join(rootDir, 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

// A) Remove regHouse from fields that trigger checkRegistrationMatch
loginHtml = loginHtml.replace(
  /\['regPhone', 'regEmail', 'regName', 'regBatch', 'regHouse', 'regProfession'\]/g,
  `['regPhone', 'regEmail', 'regName', 'regBatch', 'regProfession']`
);

// B) Update autoPreFillFields to only prefill once per record and never overwrite user-modified fields
const oldAutoPreFillRegex = /function autoPreFillFields\(rec\) \{[\s\S]*?(?=function autoPreFillTeacherFields)/;

const newAutoPreFillCode = `let lastPreFilledDirectoryId = null;

    function autoPreFillFields(rec, forceApply = false) {
      if (!rec) return;
      if (!forceApply && lastPreFilledDirectoryId === rec.id) {
        return; // Already prefilled this record once, do not overwrite user modifications!
      }
      lastPreFilledDirectoryId = rec.id;

      const nameEl = document.getElementById('regName');
      const batchEl = document.getElementById('regBatch');
      const houseEl = document.getElementById('regHouse');
      const roleEl = document.getElementById('regProfession');
      const cityEl = document.getElementById('regCity');
      const phoneEl = document.getElementById('regPhone');
      const emailEl = document.getElementById('regEmail');

      if (nameEl && (!nameEl.value || nameEl.value.trim().length < 3)) nameEl.value = rec.name || '';
      if (batchEl && (!batchEl.value || batchEl.value.trim() === '')) {
        const bNum = parseInt(rec.batch, 10);
        if (bNum && !isNaN(bNum)) batchEl.value = bNum;
      }

      // Pre-fill House ONLY if user has not manually modified it
      if (houseEl && rec.house) {
        const isUserModified = houseEl.dataset.userModified === 'true' || houseEl.getAttribute('data-user-modified') === 'true';
        if (!isUserModified) {
          const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
          for (let i = 0; i < houseEl.options.length; i++) {
            const optVal = houseEl.options[i].value.toLowerCase();
            if (optVal === nh || optVal.includes(nh) || nh.includes(optVal)) {
              houseEl.selectedIndex = i;
              break;
            }
          }
        }
      }

      if (roleEl && (!roleEl.value || roleEl.value.trim() === '') && rec.role) roleEl.value = rec.role;
      if (cityEl && (!cityEl.value || cityEl.value.trim() === '') && rec.location) cityEl.value = rec.location;
      if (phoneEl && (!phoneEl.value || phoneEl.value.trim() === '') && rec.phone) phoneEl.value = rec.phone;
      if (emailEl && (!emailEl.value || emailEl.value.trim() === '') && rec.email) emailEl.value = rec.email;

      if (rec.photo && !regUploadedPhoto) {
        regUploadedPhoto = rec.photo;
        const previewImg = document.getElementById('regPhotoPreview');
        const placeholder = document.getElementById('regPhotoPlaceholder');
        const removeBtn = document.getElementById('regPhotoRemoveBtn');
        if (previewImg) { previewImg.src = rec.photo; previewImg.classList.remove('hidden'); }
        if (placeholder) placeholder.classList.add('hidden');
        if (removeBtn) removeBtn.classList.remove('hidden');
      }
    }

    `;

if (oldAutoPreFillRegex.test(loginHtml)) {
  loginHtml = loginHtml.replace(oldAutoPreFillRegex, newAutoPreFillCode);
  console.log('✓ Updated autoPreFillFields in login.html');
} else {
  console.warn('⚠️ autoPreFillFields pattern not matched in login.html');
}

// C) Update autoPreFillTeacherFields similarly
const oldAutoPreFillTeacherRegex = /function autoPreFillTeacherFields\(rec\) \{[\s\S]*?(?=function applyMatchedDirectoryData)/;

const newAutoPreFillTeacherCode = `let lastPreFilledTeacherId = null;

    function autoPreFillTeacherFields(rec, forceApply = false) {
      if (!rec) return;
      if (!forceApply && lastPreFilledTeacherId === rec.id) {
        return;
      }
      lastPreFilledTeacherId = rec.id;

      const nameEl = document.getElementById('regName');
      const batchEl = document.getElementById('regBatch');
      const houseEl = document.getElementById('regHouse');
      const roleEl = document.getElementById('regProfession');
      const domainEl = document.getElementById('regDomain');
      const cityEl = document.getElementById('regCity');
      const phoneEl = document.getElementById('regPhone');
      const emailEl = document.getElementById('regEmail');
      const guruMsgEl = document.getElementById('regGuruMessage');

      if (nameEl && (!nameEl.value || nameEl.value.trim().length < 3)) nameEl.value = rec.name || '';
      if (batchEl && (!batchEl.value || batchEl.value.trim() === '')) {
        const tenureYear = (rec.tenure || '').match(/\\b(19\\d\\d|20\\d\\d)\\b/);
        if (tenureYear) batchEl.value = tenureYear[1];
        else if (rec.tenure) batchEl.value = tenureYear;
      }
      if (roleEl && (!roleEl.value || roleEl.value.trim() === '')) {
        roleEl.value = rec.post || rec.subject || 'Faculty Member';
      }
      if (domainEl && rec.subject) {
        for (let i = 0; i < domainEl.options.length; i++) {
          if (domainEl.options[i].value.toLowerCase().includes('education') || domainEl.options[i].value.toLowerCase().includes('academic')) {
            domainEl.selectedIndex = i;
            break;
          }
        }
      }
      if (houseEl && rec.house) {
        const isUserModified = houseEl.dataset.userModified === 'true' || houseEl.getAttribute('data-user-modified') === 'true';
        if (!isUserModified) {
          const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
          for (let i = 0; i < houseEl.options.length; i++) {
            const optVal = houseEl.options[i].value.toLowerCase();
            if (optVal === nh || optVal.includes(nh) || nh.includes(optVal)) {
              houseEl.selectedIndex = i;
              break;
            }
          }
        }
      }
      if (cityEl && (!cityEl.value || cityEl.value.trim() === '') && rec.location) cityEl.value = rec.location;
      if (phoneEl && (!phoneEl.value || phoneEl.value.trim() === '') && rec.phone) phoneEl.value = rec.phone;
      if (emailEl && (!emailEl.value || emailEl.value.trim() === '') && rec.email) emailEl.value = rec.email;
      if (guruMsgEl && (!guruMsgEl.value || guruMsgEl.value.trim() === '') && (rec.message || rec.blessingMessage)) {
        guruMsgEl.value = rec.message || rec.blessingMessage;
      }

      if (rec.photo && !regUploadedPhoto) {
        regUploadedPhoto = rec.photo;
        const previewImg = document.getElementById('regPhotoPreview');
        const placeholder = document.getElementById('regPhotoPlaceholder');
        const removeBtn = document.getElementById('regPhotoRemoveBtn');
        if (previewImg) { previewImg.src = rec.photo; previewImg.classList.remove('hidden'); }
        if (placeholder) placeholder.classList.add('hidden');
        if (removeBtn) removeBtn.classList.remove('hidden');
      }
    }

    `;

if (oldAutoPreFillTeacherRegex.test(loginHtml)) {
  loginHtml = loginHtml.replace(oldAutoPreFillTeacherRegex, newAutoPreFillTeacherCode);
  console.log('✓ Updated autoPreFillTeacherFields in login.html');
}

// D) Fix applyMatchedDirectoryData to pass forceApply = true
loginHtml = loginHtml.replace(
  /autoPreFillTeacherFields\(currentTeacherMatch\);/g,
  'autoPreFillTeacherFields(currentTeacherMatch, true);'
);
loginHtml = loginHtml.replace(
  /autoPreFillFields\(currentDirectoryMatch\);/g,
  'autoPreFillFields(currentDirectoryMatch, true);'
);

// E) Make sure house change listener sets userModified immediately (both change and input)
const oldAttachListenersRegex = /\/\/ Attach listeners on load[\s\S]*?(?=<\/script>\s*<\/body>)/;
const newAttachListenersCode = `// Attach listeners on load
    function initFieldListeners() {
      const houseEl = document.getElementById('regHouse');
      if (houseEl) {
        const markHouseModified = () => {
          houseEl.dataset.userModified = 'true';
          houseEl.setAttribute('data-user-modified', 'true');
        };
        houseEl.addEventListener('change', markHouseModified);
        houseEl.addEventListener('input', markHouseModified);
      }

      ['regPhone', 'regEmail', 'regName', 'regBatch', 'regProfession'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
          el.addEventListener('input', checkRegistrationMatch);
          el.addEventListener('change', checkRegistrationMatch);
        }
      });

      // Self-heal stale localStorage for Rakesh Kumar (Batch 2003) -> ensure Aravali House
      try {
        const raw = localStorage.getItem('JNVG_ALUMNI_APP_DATA_V2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.directory)) {
            let changed = false;
            parsed.directory.forEach(d => {
              if (d.id === 'alumni-111' || d.phone === '9919563333' || (d.email && d.email.toLowerCase() === 'raka.softage@gmail.com')) {
                d.house = 'Aravali';
                d.badge = 'Aravali';
                d.bio = (d.bio || '').replace(/Nilgiri/gi, 'Aravali');
                changed = true;
              }
            });
            if (changed) {
              localStorage.setItem('JNVG_ALUMNI_APP_DATA_V2', JSON.stringify(parsed));
            }
          }
        }
      } catch(e) {}
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFieldListeners);
    } else {
      initFieldListeners();
    }
  `;

if (oldAttachListenersRegex.test(loginHtml)) {
  loginHtml = loginHtml.replace(oldAttachListenersRegex, newAttachListenersCode);
  console.log('✓ Updated listener initialization in login.html');
}

// F) Update cache busters in login.html to v20261122_v5
loginHtml = loginHtml.replace(/\?v=20261122_[a-zA-Z0-9]+/g, '?v=20261122_v5');
fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');


// =========================================================================
// 2. UPDATE assets/js/app.js
// =========================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A) Update loadAppData to protect Rakesh Kumar Aravali from stale localStorage
appJs = appJs.replace(
  /const merged = saved \? \{ \.\.\.def, \.\.\.saved \} : def;/g,
  `const merged = saved ? { ...def, ...saved } : def;
          if (def.id === 'alumni-111' || def.phone === '9919563333' || (def.email && def.email.toLowerCase() === 'raka.softage@gmail.com')) {
            merged.house = 'Aravali';
            merged.badge = 'Aravali';
            merged.bio = (merged.bio || '').replace(/Nilgiri/gi, 'Aravali');
          }`
);

// B) Update autoPreFillModalFields to check userModified
appJs = appJs.replace(
  /if \(houseEl && rec\.house\) \{\s*const nh = \(typeof normalizeHouse === 'function'\) \? normalizeHouse\(rec\.house\) : rec\.house\.toLowerCase\(\);\s*for \(let i = 0; i < houseEl\.options\.length; i\+\+\) \{\s*if \(houseEl\.options\[i\]\.value\.toLowerCase\(\)\.includes\(nh\) \|\| nh\.includes\(houseEl\.options\[i\]\.value\.toLowerCase\(\)\)\) \{\s*houseEl\.selectedIndex = i;\s*break;\s*\}\s*\}\s*\}/g,
  `if (houseEl && rec.house) {
    const isUserModified = houseEl.dataset.userModified === 'true' || houseEl.getAttribute('data-user-modified') === 'true';
    if (!isUserModified) {
      const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
      for (let i = 0; i < houseEl.options.length; i++) {
        const optVal = houseEl.options[i].value.toLowerCase();
        if (optVal === nh || optVal.includes(nh) || nh.includes(optVal)) {
          houseEl.selectedIndex = i;
          break;
        }
      }
    }
  }`
);

// C) Remove regHouse from initModalMatchListeners
appJs = appJs.replace(
  /\['regPhone', 'regEmail', 'regName', 'regBatch', 'regHouse', 'regRole'\]/g,
  `['regPhone', 'regEmail', 'regName', 'regBatch', 'regRole']`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated assets/js/app.js');


// =========================================================================
// 3. UPDATE assets/js/auth.js
// =========================================================================
const authJsPath = path.join(rootDir, 'assets', 'js', 'auth.js');
let authJs = fs.readFileSync(authJsPath, 'utf8');

// Ensure getDirectoryRecords enforces Aravali for alumni-111
const oldGetDirRegex = /function getDirectoryRecords\(\) \{[\s\S]*?(?=function findDirectoryMatch)/;
const newGetDirCode = `function getDirectoryRecords() {
  let recs = [];
  if (typeof window !== 'undefined' && window.AppState && Array.isArray(window.AppState.directory) && window.AppState.directory.length > 0) {
    recs = window.AppState.directory;
  } else if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory) && AppState.directory.length > 0) {
    recs = AppState.directory;
  } else if (typeof defaultDirectoryAlumni !== 'undefined' && Array.isArray(defaultDirectoryAlumni) && defaultDirectoryAlumni.length > 0) {
    recs = defaultDirectoryAlumni;
  } else if (typeof window !== 'undefined' && window.defaultDirectoryAlumni && Array.isArray(window.defaultDirectoryAlumni) && window.defaultDirectoryAlumni.length > 0) {
    recs = window.defaultDirectoryAlumni;
  } else {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('JNVG_ALUMNI_APP_DATA_V2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.directory) && parsed.directory.length > 0) {
            recs = parsed.directory;
          }
        }
      }
    } catch(e) {}
  }

  // Enforce verified corrections across all records
  if (Array.isArray(recs)) {
    recs.forEach(r => {
      if (r.id === 'alumni-111' || r.phone === '9919563333' || (r.email && r.email.toLowerCase() === 'raka.softage@gmail.com')) {
        r.house = 'Aravali';
        r.badge = 'Aravali';
      }
    });
  }
  return recs || [];
}

`;

if (oldGetDirRegex.test(authJs)) {
  authJs = authJs.replace(oldGetDirRegex, newGetDirCode);
  console.log('✓ Updated getDirectoryRecords in assets/js/auth.js');
}

fs.writeFileSync(authJsPath, authJs, 'utf8');


// =========================================================================
// 4. UPDATE index.html and sw.js
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/\?v=20261122_[a-zA-Z0-9]+/g, '?v=20261122_v5');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

const swPath = path.join(rootDir, 'sw.js');
let swCode = fs.readFileSync(swPath, 'utf8');
swCode = swCode.replace(/const CACHE_NAME = '[^']*';/, "const CACHE_NAME = 'jnvg-alumni-v20261122-v5';");
fs.writeFileSync(swPath, swCode, 'utf8');
console.log('✓ Updated index.html and sw.js cache version to v5');
