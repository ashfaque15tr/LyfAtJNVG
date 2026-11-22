const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';
const mobIndexPath = path.join(rootDir, 'mobile_app', 'index.html');
let mobIndex = fs.readFileSync(mobIndexPath, 'utf8');

// Remove banner
mobIndex = mobIndex.replace(
  /<!-- PENDING VERIFICATION ALERT BANNER -->[\s\S]*?(?=<!-- MAIN HEADER \/ HERO BANNER -->)/,
  `<!-- Pending Verification Banner completely removed -->\n  `
);

// Remove modal
mobIndex = mobIndex.replace(
  /<!-- PENDING VERIFICATION ACTION REQUIRED MODAL -->[\s\S]*?(?=<!-- 4\. SHARE A MEMORY MODAL -->)/,
  `<!-- Pending Verification Modal completely removed -->\n  `
);

fs.writeFileSync(mobIndexPath, mobIndex, 'utf8');
console.log('✓ Cleaned mobile_app/index.html of pending banners and modals');
