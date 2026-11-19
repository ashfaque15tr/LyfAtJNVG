const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// =============================================================================
// 1. UPDATE "Our Roots in Gauriganj (Est. 1986)" TEXT
// =============================================================================
const oldRootsText = "Over three decades, the campus has nurtured hundreds of talents who now lead in Civil Services, Medicine, Corporate Leadership, Defense, and Global Technology.";
const newRootsText = "Over three decades, the campus has nurtured hundreds of talents who now lead in Civil Services, Medicine, Corporate Leadership, Defense, Academics & Education, and Global Technologies.";

['index.html', 'mobile_app/index.html'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(oldRootsText)) {
    content = content.replace(oldRootsText, newRootsText);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated Roots text in ${relPath}`);
  } else {
    console.log(`ℹ️ Roots text already updated or not found in ${relPath}`);
  }
});

// =============================================================================
// 2. UPDATE BOTTOM NAVIGATION MEET '26 ICON (JUL 17 -> DEC 13 BADGE)
// =============================================================================
const oldMeetEmoji = `<span class="text-base leading-none">📅</span>\n      <span class="text-[10px] mt-1">Meet '26</span>`;
const newMeetBadge = `<span class="inline-flex flex-col items-center justify-center w-5 h-5 rounded-[4px] border border-rose-500/80 bg-white shadow-sm overflow-hidden leading-none flex-shrink-0">
        <span class="w-full bg-rose-600 text-[6px] font-black text-white text-center tracking-tighter py-[1px] leading-none block">DEC</span>
        <span class="text-[9px] font-black text-slate-950 leading-none pt-0.5 block">13</span>
      </span>
      <span class="text-[10px] mt-1">Meet '26</span>`;

['index.html', 'mobile_app/index.html'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(oldMeetEmoji)) {
    content = content.replace(oldMeetEmoji, newMeetBadge);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Replaced calendar emoji with DEC 13 badge in ${relPath}`);
  } else {
    console.log(`ℹ️ Meet emoji target not found in ${relPath}`);
  }
});

// =============================================================================
// 3. UPDATE STYLES FOR UDAIGIRI BOX IN LIGHT MODE (Make background lighter)
// =============================================================================
['assets/css/styles.css', 'mobile_app/assets/css/styles.css'].forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let css = fs.readFileSync(filePath, 'utf8');
  
  // Replace the Udaigiri light mode rule
  const oldUdaigiriCss = `html[data-theme="sky"] .bg-yellow-950\\/80,
body:not(.theme-dark) .bg-yellow-950\\/80 {
  background-color: #fefce8 !important;
  border: 1.5px solid #fde047 !important;
}
html[data-theme="sky"] .bg-yellow-950\\/80 span,
body:not(.theme-dark) .bg-yellow-950\\/80 span {
  color: #854d0e !important;
  -webkit-text-fill-color: #854d0e !important;
  font-weight: 800 !important;
}`;

  const newUdaigiriCss = `html[data-theme="sky"] .bg-yellow-950\\/80,
body:not(.theme-dark) .bg-yellow-950\\/80 {
  background-color: #fffdf0 !important;
  border: 1.5px solid #fde68a !important;
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.08) !important;
}
html[data-theme="sky"] .bg-yellow-950\\/80 span,
body:not(.theme-dark) .bg-yellow-950\\/80 span {
  color: #78350f !important;
  -webkit-text-fill-color: #78350f !important;
  font-weight: 800 !important;
}
html[data-theme="sky"] .bg-yellow-950\\/80 span.text-yellow-300,
html[data-theme="sky"] .bg-yellow-950\\/80 span:last-child,
body:not(.theme-dark) .bg-yellow-950\\/80 span.text-yellow-300,
body:not(.theme-dark) .bg-yellow-950\\/80 span:last-child {
  color: #92400e !important;
  -webkit-text-fill-color: #92400e !important;
  font-weight: 700 !important;
}`;

  if (css.includes(oldUdaigiriCss)) {
    css = css.replace(oldUdaigiriCss, newUdaigiriCss);
    fs.writeFileSync(filePath, css, 'utf8');
    console.log(`✅ Updated Udaigiri light mode styles in ${relPath}`);
  } else {
    // If not exact match, append enhanced rule at bottom
    css += `\n/* Enhanced Udaigiri Light Sky Mode Legibility */\n` + newUdaigiriCss + `\n`;
    fs.writeFileSync(filePath, css, 'utf8');
    console.log(`✅ Appended Udaigiri light mode styles in ${relPath}`);
  }
});

// =============================================================================
// 4. FIX LOGIN REDIRECT ON MOBILE (Keep web mobile users on index.html)
// =============================================================================
const loginPath = path.join(rootDir, 'login.html');
if (fs.existsSync(loginPath)) {
  let loginHtml = fs.readFileSync(loginPath, 'utf8');
  loginHtml = loginHtml.replace(/window\.location\.href = isMobile \? 'mobile_app\/index\.html#teachers' : 'index\.html#teachers';/g, "window.location.href = 'index.html#teachers';");
  loginHtml = loginHtml.replace(/window\.location\.href = isMobile \? 'mobile_app\/index\.html' : 'index\.html';/g, "window.location.href = 'index.html';");
  fs.writeFileSync(loginPath, loginHtml, 'utf8');
  console.log('✅ Updated login.html redirects to stay on index.html');
}

console.log('Step 1 complete.');
