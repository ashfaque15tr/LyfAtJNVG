const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// =============================================================================
// 1. UPDATE BOTTOM NAVIGATION MEET '26 ICON IN ALL HTML FILES
// =============================================================================
const newMeetBadge = `<span class="inline-flex flex-col items-center justify-center w-5 h-5 rounded-[4px] border border-rose-500/80 bg-white shadow-sm overflow-hidden leading-none flex-shrink-0">
        <span class="w-full bg-rose-600 text-[6px] font-black text-white text-center tracking-tighter py-[1px] leading-none block">DEC</span>
        <span class="text-[9px] font-black text-slate-950 leading-none pt-0.5 block">13</span>
      </span>
      <span class="text-[10px] mt-1">Meet '26</span>`;

['index.html', 'mobile_app/index.html'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Match: <span class="text-base leading-none">📅</span>\s*<span class="text-[10px] mt-1">Meet '26</span>
  const regex = /<span class="text-base leading-none">📅<\/span>\s*<span class="text-\[10px\] mt-1">Meet '26<\/span>/g;
  if (regex.test(html)) {
    html = html.replace(regex, newMeetBadge);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Replaced 📅 with DEC 13 badge in ${relPath}`);
  } else {
    console.log(`⚠️ Regex did not match in ${relPath}`);
  }
});

// =============================================================================
// 2. ENHANCE FEED POST PERSISTENCE AND COMPRESSION IN assets/js/app.js
// =============================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A. Add constant if not exists
if (!appJs.includes('PERSISTENT_FEED_STORAGE_KEY')) {
  appJs = `const PERSISTENT_FEED_STORAGE_KEY = 'JNVG_MEMORY_WALL_FEED_V1';\n` + appJs;
}

// B. Add compressFeedImage function and update previewStoryImage
const oldPreviewImage = `function previewStoryImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      attachedStoryPhoto = e.target.result;
      const preview = document.getElementById('storyImagePreview');
      const container = document.getElementById('storyImagePreviewContainer');
      if (preview && container) { preview.src = e.target.result; container.classList.remove('hidden'); }
    };
    reader.readAsDataURL(file);
  }
}`;

const newPreviewImage = `function compressFeedImage(file, callback) {
  if (!file || !file.type.startsWith('image/')) {
    if (callback) callback(null);
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 800;
      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.72);
      if (callback) callback(compressed);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewStoryImage(event) {
  const file = event.target.files[0];
  if (file) {
    compressFeedImage(file, function(compressedDataUrl) {
      attachedStoryPhoto = compressedDataUrl;
      const preview = document.getElementById('storyImagePreview');
      const container = document.getElementById('storyImagePreviewContainer');
      if (preview && container) { preview.src = compressedDataUrl; container.classList.remove('hidden'); }
    });
  }
}`;

if (appJs.includes('function previewStoryImage(event) {')) {
  // Replace cleanly
  appJs = appJs.replace(oldPreviewImage, newPreviewImage);
  console.log('✅ Added image compression to previewStoryImage');
}

// C. Update saveAppData to write to PERSISTENT_FEED_STORAGE_KEY
const oldSaveAppData = `function saveAppData() {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({
      rsvps: AppState.rsvps,
      contributions: AppState.contributions,
      feedPosts: AppState.feedPosts,`;

const newSaveAppData = `function saveAppData() {
  try {
    if (typeof localStorage !== 'undefined' && Array.isArray(AppState.feedPosts)) {
      try { localStorage.setItem(PERSISTENT_FEED_STORAGE_KEY, JSON.stringify(AppState.feedPosts)); } catch(fe) {}
    }
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({
      rsvps: AppState.rsvps,
      contributions: AppState.contributions,
      feedPosts: AppState.feedPosts,`;

if (appJs.includes(oldSaveAppData)) {
  appJs = appJs.replace(oldSaveAppData, newSaveAppData);
  console.log('✅ Updated saveAppData with PERSISTENT_FEED_STORAGE_KEY backup');
}

// D. Update loadAppData to load from PERSISTENT_FEED_STORAGE_KEY
const targetLoadReturn = `return { ...defaultData, ...parsed };`;
const newLoadReturn = `// Rehydrate persistent community feed posts
      try {
        const pFeed = localStorage.getItem(PERSISTENT_FEED_STORAGE_KEY);
        if (pFeed) {
          const list = JSON.parse(pFeed);
          if (Array.isArray(list) && list.length > 0) {
            parsed.feedPosts = list;
          }
        }
      } catch(e) {}
      return { ...defaultData, ...parsed };`;

if (appJs.includes(targetLoadReturn)) {
  appJs = appJs.replace(targetLoadReturn, newLoadReturn);
  console.log('✅ Updated loadAppData with PERSISTENT_FEED_STORAGE_KEY loader');
}

// E. Update SOFT_LAUNCH_STORAGE_FLAG cleanData to not erase PERSISTENT_FEED_STORAGE_KEY
const oldCleanFeed = `feedPosts: [],`;
const newCleanFeed = `feedPosts: (function() {
          try {
            const f = localStorage.getItem(PERSISTENT_FEED_STORAGE_KEY);
            return (f ? JSON.parse(f) : []);
          } catch(e) { return []; }
        })(),`;

if (appJs.includes(oldCleanFeed)) {
  appJs = appJs.replace(oldCleanFeed, newCleanFeed);
  console.log('✅ Preserved persistent feed posts across soft-launch cleanings');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✅ Updated assets/js/app.js successfully');

// Copy to mobile_app
fs.copyFileSync(appJsPath, path.join(rootDir, 'mobile_app', 'assets', 'js', 'app.js'));
console.log('✅ Synchronized to mobile_app/assets/js/app.js');
