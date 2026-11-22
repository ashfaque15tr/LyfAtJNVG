const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 2. CLEAN index.html
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Add No-Cache Meta Headers inside <head>
const noCacheMeta = `
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
`;
if (!indexHtml.includes('http-equiv="Cache-Control"')) {
  indexHtml = indexHtml.replace('<meta name="viewport"', noCacheMeta + '  <meta name="viewport"');
}

// Remove pendingVerificationAlertBanner completely
indexHtml = indexHtml.replace(
  /<!-- PENDING VERIFICATION ALERT BANNER -->[\s\S]*?(?=<!-- MAIN HEADER \/ HERO BANNER -->)/,
  `<!-- Pending Verification Banner completely removed -->\n  `
);

// Remove pendingVerificationModal completely
indexHtml = indexHtml.replace(
  /<!-- PENDING VERIFICATION ACTION REQUIRED MODAL -->[\s\S]*?(?=<!-- 4\. SHARE A MEMORY MODAL -->)/,
  `<!-- Pending Verification Modal completely removed -->\n  `
);

// In registerModal, remove the approval notice
indexHtml = indexHtml.replace(
  /<div class="p-3 rounded-xl bg-amber-950\/40 border border-amber-800\/40 text-amber-200 text-\[11px\] leading-relaxed">[\s\S]*?<\/div>/,
  `<div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-[11px] leading-relaxed">
        🎉 <strong>Open Alumni Registration:</strong> JNV Gauriganj alumni and faculty are welcome! Register directly to activate your membership and join the official network.
      </div>`
);

// In registerModal, update submit button
indexHtml = indexHtml.replace(
  /<span id="modalRegSubmitBtnText">🛡️ Verify with 2FA OTP & Submit Request<\/span>/g,
  '<span id="modalRegSubmitBtnText">🎉 Complete Registration / पंजीकरण पूर्ण करें</span>'
);

// Update script cache busters
indexHtml = indexHtml.replace(/src="assets\/js\/theme\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/theme.js?v=20261122_v4"');
indexHtml = indexHtml.replace(/src="assets\/js\/storage-engine\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/storage-engine.js?v=20261122_v4"');
indexHtml = indexHtml.replace(/src="assets\/js\/cloud-sync\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/cloud-sync.js?v=20261122_v4"');
indexHtml = indexHtml.replace(/src="assets\/js\/auth\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/auth.js?v=20261122_v4"');
indexHtml = indexHtml.replace(/src="assets\/js\/app\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/app.js?v=20261122_v4"');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ index.html cleaned of all pending verification banners and modals');
