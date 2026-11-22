const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Remove pending verification checks in openModal('storyModal')
appJs = appJs.replace(
  /if \(curUser\.status === 'pending' \|\| curUser\.role === 'unverified' \|\| curUser\.role === 'unverified_teacher'\) \{\s*showPendingVerificationModal\('posting messages or photos on the Memory Wall'\);\s*return;\s*\}/g,
  `if (curUser) { curUser.status = 'approved'; }`
);

// 2. Remove pending verification check in openTeacherTributeModal
appJs = appJs.replace(
  /if \(curUser\.status === 'pending' \|\| curUser\.role === 'unverified' \|\| curUser\.role === 'unverified_teacher'\) \{\s*showPendingVerificationModal\('submitting tributes to revered faculty'\);\s*return;\s*\}/g,
  `if (curUser) { curUser.status = 'approved'; }`
);

// 3. Remove pending verification check in openEditProfileModal
appJs = appJs.replace(
  /if \(user\.status === 'pending' \|\| user\.role === 'unverified' \|\| user\.role === 'unverified_teacher'\) \{\s*showPendingVerificationModal\('updating alumni profile records'\);\s*return;\s*\}/g,
  `if (user) { user.status = 'approved'; }`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Cleaned all pending verification checks from assets/js/app.js');

// 4. Update sw.js to v4 and clean caches
const swPath = path.join(rootDir, 'sw.js');
const swCode = `// Service Worker for JNV Gauriganj Alumni App
const CACHE_NAME = 'jnvg-alumni-v20261122-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
`;
fs.writeFileSync(swPath, swCode, 'utf8');
console.log('✓ Cleaned sw.js to automatically evict stale cache');
