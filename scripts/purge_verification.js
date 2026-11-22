const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. CLEAN login.html
// =========================================================================
const loginHtmlPath = path.join(rootDir, 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

// Add No-Cache Meta Headers inside <head>
const noCacheMeta = `
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
`;
if (!loginHtml.includes('http-equiv="Cache-Control"')) {
  loginHtml = loginHtml.replace('<meta name="viewport"', noCacheMeta + '  <meta name="viewport"');
}

// Remove regOtpModal completely
loginHtml = loginHtml.replace(
  /<!-- ================= 3\. TWO-FACTOR AUTHENTICATION \(2FA\) OTP MODAL ================= -->[\s\S]*?(?=<!-- ================= 4\. FORGOT PASSWORD MODAL)/,
  `<!-- Registration OTP and Review Modals completely removed -->\n  `
);

// In case regUnderReviewModal remains
loginHtml = loginHtml.replace(
  /<div id="regUnderReviewModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  ''
);

// Update registration submit button text if needed
loginHtml = loginHtml.replace(
  /<span>Verify via WhatsApp \/ SMS & Register<\/span>/g,
  '<span>Complete Registration / पंजीकरण पूर्ण करें</span>'
);
loginHtml = loginHtml.replace(
  /<span>Verify Mobile 2FA & Complete Registration<\/span>/g,
  '<span>Complete Registration / पंजीकरण पूर्ण करें</span>'
);

// Update script cache busters
loginHtml = loginHtml.replace(/src="assets\/js\/theme\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/theme.js?v=20261122_v4"');
loginHtml = loginHtml.replace(/src="assets\/js\/directory-seed\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/directory-seed.js?v=20261122_v4"');
loginHtml = loginHtml.replace(/src="assets\/js\/storage-engine\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/storage-engine.js?v=20261122_v4"');
loginHtml = loginHtml.replace(/src="assets\/js\/cloud-sync\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/cloud-sync.js?v=20261122_v4"');
loginHtml = loginHtml.replace(/src="assets\/js\/auth\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/auth.js?v=20261122_v4"');

fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');
console.log('✓ login.html cleaned of all verification modals');
