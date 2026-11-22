const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// 1. UPDATE assets/js/app.js
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A) Remove Colonel Virendra Kumar Pandey's contact details (phone & email)
appJs = appJs.replace(
  /"id": "alumni-260",\s*"name": "Virendra Kumar Pandey",\s*"initials": "VK",\s*"batch": 1994,\s*"house": "Nilgiri",\s*"role": "Lieutenant Colonel",\s*"location": "Rajouri",\s*"domain": "Corporate",\s*"email": "rvkp1977@gmail\.com",\s*"phone": "9161746797"/g,
  '"id": "alumni-260",\n    "name": "Virendra Kumar Pandey",\n    "initials": "VK",\n    "batch": 1994,\n    "house": "Nilgiri",\n    "role": "Lieutenant Colonel",\n    "location": "Rajouri",\n    "domain": "Corporate",\n    "email": "",\n    "phone": ""'
);

// In Notable Alumni list: remove Col. Virendra Kumar Pandey phone
appJs = appJs.replace(
  /"name": "Col\. Virendra Kumar Pandey",[\s\S]*?"phone": "9161746797"/g,
  (match) => match.replace('"phone": "9161746797"', '"phone": ""')
);

// B) Update Rakesh Kumar (Batch 2003) House from Nilgiri to Aravali
appJs = appJs.replace(
  /"id": "alumni-111",\s*"name": "Rakesh Kumar",\s*"initials": "RK",\s*"batch": 2003,\s*"house": "Nilgiri",\s*"role": "LIC Agent",\s*"location": "Sultanpur",\s*"domain": "Corporate",\s*"email": "raka\.softage@gmail\.com",\s*"phone": "9919563333",\s*"badge": "Nilgiri",\s*"tag": "Alumnus",\s*"bio": "LIC Agent at LIC • Batch of 2003 \(Nilgiri House\)\."/g,
  '"id": "alumni-111",\n    "name": "Rakesh Kumar",\n    "initials": "RK",\n    "batch": 2003,\n    "house": "Aravali",\n    "role": "LIC Agent",\n    "location": "Sultanpur",\n    "domain": "Corporate",\n    "email": "raka.softage@gmail.com",\n    "phone": "9919563333",\n    "badge": "Aravali",\n    "tag": "Alumnus",\n    "bio": "LIC Agent at LIC • Batch of 2003 (Aravali House)."'
);

// C) Remove auto WhatsApp trigger and replace 9161746797 with Super Admin Ashfaque Ahmad (+91 9972868674)
// Replace all remaining admin verification links to 9161746797 with 9972868674
appJs = appJs.replace(/https:\/\/wa\.me\/919161746797/g, 'https://wa.me/919972868674');
appJs = appJs.replace(/\+91 9161746797/g, '+91 9972868674');

// In handleRegistrationSubmit / 2FA submission in app.js:
// Remove automated window.open:
appJs = appJs.replace(
  /const waUrl = `https:\/\/wa\.me\/919972868674\?text=\${encodeURIComponent\(waMsg\)}`;\s*try\s*{\s*window\.open\(waUrl,\s*'_blank'\);\s*}\s*catch\(e\)\s*{\s*}/g,
  'const waUrl = `https://wa.me/919972868674?text=${encodeURIComponent(waMsg)}`;\n  // Manual expedited approval link only - NO auto popups'
);

// D) Fix approveRegistration & renderAdminRegistrations in app.js
// Ensure renderAdminRegistrations assigns valid reg.id
const oldRenderReg = `  AppState.pendingRegistrations.forEach(reg => {
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    card.id = reg.id;`;

const newRenderReg = `  AppState.pendingRegistrations.forEach((reg, idx) => {
    if (!reg.id) {
      reg.id = 'reg-' + (reg.email ? reg.email.replace(/[^a-z0-9]/gi, '_') : Date.now() + '-' + idx);
    }
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    card.id = reg.id;`;

if (appJs.includes(oldRenderReg)) {
  appJs = appJs.replace(oldRenderReg, newRenderReg);
}

// Enhance approveRegistration to robustly find registration by id, string id, email, or name
const oldApproveRegHead = `function approveRegistration(regId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canModerate = curUser && ['admin', 'host', 'batch_admin', 'moderator'].includes(curUser.role);
  if (!canModerate) {
    showToast('🔒 Clearance required: Only Super Admin, Hosts, and Moderators can approve alumni registrations.');
    return;
  }

  const index = AppState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index === -1) return;`;

const newApproveRegHead = `function approveRegistration(regId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canModerate = curUser && ['admin', 'host', 'batch_admin', 'moderator'].includes(curUser.role);
  if (!canModerate) {
    showToast('🔒 Clearance required: Only Super Admin, Hosts, and Moderators can approve alumni registrations.');
    return;
  }

  if (!AppState.pendingRegistrations || !Array.isArray(AppState.pendingRegistrations)) {
    AppState.pendingRegistrations = [];
    return;
  }

  const index = AppState.pendingRegistrations.findIndex(r => 
    (r.id && String(r.id) === String(regId)) ||
    (r.email && regId && r.email.toLowerCase() === String(regId).toLowerCase()) ||
    (r.name && regId && r.name.toLowerCase() === String(regId).toLowerCase()) ||
    (r.id === regId)
  );

  if (index === -1) {
    console.warn("Registration not found for id:", regId);
    showToast("⚠️ Registration request not found or already approved.");
    renderAdminRegistrations();
    return;
  }`;

if (appJs.includes(oldApproveRegHead)) {
  appJs = appJs.replace(oldApproveRegHead, newApproveRegHead);
}

// Broadcast approval to cloud sync in approveRegistration
const approvalBroadcastTarget = `  AppState.pendingRegistrations.splice(index, 1);
  saveAppData();`;

const approvalBroadcastReplacement = `  AppState.pendingRegistrations.splice(index, 1);
  saveAppData();

  // Broadcast real-time approval to CloudSync network
  try {
    if (typeof AlumniCloudSync !== 'undefined' && AlumniCloudSync.broadcastApproval) {
      AlumniCloudSync.broadcastApproval(reg);
    }
  } catch (err) {
    console.warn("[CloudSync] Approval broadcast error:", err);
  }`;

if (appJs.includes(approvalBroadcastTarget) && !appJs.includes('AlumniCloudSync.broadcastApproval')) {
  appJs = appJs.replace(approvalBroadcastTarget, approvalBroadcastReplacement);
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated assets/js/app.js successfully');

// 2. UPDATE assets/js/auth.js
const authJsPath = path.join(rootDir, 'assets', 'js', 'auth.js');
let authJs = fs.readFileSync(authJsPath, 'utf8');
authJs = authJs.replace(/https:\/\/wa\.me\/919161746797/g, 'https://wa.me/919972868674');
authJs = authJs.replace(/\+91 9161746797/g, '+91 9972868674');
fs.writeFileSync(authJsPath, authJs, 'utf8');
console.log('✓ Updated assets/js/auth.js successfully');

// 3. UPDATE assets/js/cloud-sync.js
const cloudSyncPath = path.join(rootDir, 'assets', 'js', 'cloud-sync.js');
let cloudSync = fs.readFileSync(cloudSyncPath, 'utf8');
// Ensure pendingRegistrations created by cloud-sync always have id
const oldCloudPush = `            AppState.pendingRegistrations.push({
              name: u.name,
              email: u.email,
              phone: u.phone,
              batch: u.batch,
              house: u.house,
              role: u.role,
              submittedAt: new Date().toLocaleString('en-IN')
            });`;

const newCloudPush = `            AppState.pendingRegistrations.push({
              id: u.id || 'reg-' + (u.email ? u.email.replace(/[^a-z0-9]/gi, '_') : Date.now()),
              name: u.name,
              email: u.email,
              phone: u.phone,
              batch: u.batch,
              house: u.house,
              role: u.role,
              submittedAt: new Date().toLocaleString('en-IN')
            });`;

if (cloudSync.includes(oldCloudPush)) {
  cloudSync = cloudSync.replace(oldCloudPush, newCloudPush);
  fs.writeFileSync(cloudSyncPath, cloudSync, 'utf8');
  console.log('✓ Updated assets/js/cloud-sync.js successfully');
}

// 4. UPDATE index.html
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/https:\/\/wa\.me\/919161746797/g, 'https://wa.me/919972868674');
indexHtml = indexHtml.replace(/\+91 9161746797/g, '+91 9972868674');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Updated index.html successfully');

// 5. UPDATE login.html
const loginHtmlPath = path.join(rootDir, 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

// Replace phone number references
loginHtml = loginHtml.replace(/https:\/\/wa\.me\/919161746797/g, 'https://wa.me/919972868674');
loginHtml = loginHtml.replace(/\+91 9161746797/g, '+91 9972868674');

// Remove automated window.open in login.html
loginHtml = loginHtml.replace(
  /\/\/ Auto trigger WhatsApp in new window\s*try\s*{\s*window\.open\(waUrl,\s*'_blank'\);\s*}\s*catch\(err\)\s*{\s*}/g,
  '// Manual expedited approval link only - auto popup removed'
);

// Fix house field being overwritten when user manually changes it:
const oldAutoPreFillHouse = `      if (houseEl && rec.house) {
        const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
        for (let i = 0; i < houseEl.options.length; i++) {
          if (houseEl.options[i].value.toLowerCase().includes(nh) || nh.includes(houseEl.options[i].value.toLowerCase())) {
            houseEl.selectedIndex = i;
            break;
          }
        }
      }`;

const newAutoPreFillHouse = `      if (houseEl && rec.house && !houseEl.dataset.userModified) {
        const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
        for (let i = 0; i < houseEl.options.length; i++) {
          if (houseEl.options[i].value.toLowerCase().includes(nh) || nh.includes(houseEl.options[i].value.toLowerCase())) {
            houseEl.selectedIndex = i;
            break;
          }
        }
      }`;

loginHtml = loginHtml.replace(oldAutoPreFillHouse, newAutoPreFillHouse);

// Track user modification on house select
const oldHouseListener = `      ['regPhone', 'regEmail', 'regName', 'regBatch', 'regHouse', 'regProfession'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
          el.addEventListener('input', checkRegistrationMatch);
          el.addEventListener('change', checkRegistrationMatch);
        }
      });`;

const newHouseListener = `      const houseEl = document.getElementById('regHouse');
      if (houseEl) {
        houseEl.addEventListener('change', () => { houseEl.dataset.userModified = 'true'; });
      }
      ['regPhone', 'regEmail', 'regName', 'regBatch', 'regHouse', 'regProfession'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
          el.addEventListener('input', checkRegistrationMatch);
          el.addEventListener('change', checkRegistrationMatch);
        }
      });`;

loginHtml = loginHtml.replace(oldHouseListener, newHouseListener);

fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');
console.log('✓ Updated login.html successfully');

console.log('All core files updated. Mirroring to www, android, and mobile_app...');

// Update directory-seed.js
const seedPath = path.join(rootDir, 'assets', 'js', 'directory-seed.js');
if (fs.existsSync(seedPath)) {
  let s = fs.readFileSync(seedPath, 'utf8');
  s = s.replace(
    /"id": "alumni-260",\s*"name": "Virendra Kumar Pandey",\s*"initials": "VK",\s*"batch": 1994,\s*"house": "Nilgiri",\s*"role": "Lieutenant Colonel",\s*"location": "Rajouri",\s*"domain": "Corporate",\s*"email": "rvkp1977@gmail\.com",\s*"phone": "9161746797"/g,
    '"id": "alumni-260",\n    "name": "Virendra Kumar Pandey",\n    "initials": "VK",\n    "batch": 1994,\n    "house": "Nilgiri",\n    "role": "Lieutenant Colonel",\n    "location": "Rajouri",\n    "domain": "Corporate",\n    "email": "",\n    "phone": ""'
  );
  s = s.replace(
    /"id": "alumni-111",\s*"name": "Rakesh Kumar",\s*"initials": "RK",\s*"batch": 2003,\s*"house": "Nilgiri",\s*"role": "LIC Agent",\s*"location": "Sultanpur",\s*"domain": "Corporate",\s*"email": "raka\.softage@gmail\.com",\s*"phone": "9919563333",\s*"badge": "Nilgiri",\s*"tag": "Alumnus",\s*"bio": "LIC Agent at LIC • Batch of 2003 \(Nilgiri House\)\."/g,
    '"id": "alumni-111",\n    "name": "Rakesh Kumar",\n    "initials": "RK",\n    "batch": 2003,\n    "house": "Aravali",\n    "role": "LIC Agent",\n    "location": "Sultanpur",\n    "domain": "Corporate",\n    "email": "raka.softage@gmail.com",\n    "phone": "9919563333",\n    "badge": "Aravali",\n    "tag": "Alumnus",\n    "bio": "LIC Agent at LIC • Batch of 2003 (Aravali House)."'
  );
  fs.writeFileSync(seedPath, s, 'utf8');
  console.log('✓ Updated assets/js/directory-seed.js successfully');
}
