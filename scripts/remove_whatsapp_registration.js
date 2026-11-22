const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. UPDATE login.html
// =========================================================================
const loginHtmlPath = path.join(rootDir, 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

// A) Replace handleFormRegister to directly register without any OTP or WhatsApp
const oldHandleFormRegisterRegex = /function handleFormRegister\(e\) \{[\s\S]*?(?=\/\/ --- FORGOT PASSWORD FLOW)/;

const newHandleFormRegisterCode = `function handleFormRegister(e) {
      e.preventDefault();
      const pass = document.getElementById('regPassword').value;
      const conf = document.getElementById('regConfirmPassword').value;

      if (pass !== conf) {
        showAlert("⚠️ Passwords do not match! Please make sure both password fields are identical.", false);
        return;
      }

      if (pass.length < 6) {
        showAlert("⚠️ Password must be at least 6 characters in length.", false);
        return;
      }

      const isTeacher = currentRegisterType === 'teacher';
      const cleanPhone = document.getElementById('regPhone').value.replace(/\\D/g, '').slice(-10);

      const claimedDirId = (!isTeacher) ? (document.getElementById('claimedDirectoryId')?.value || (currentDirectoryMatch ? currentDirectoryMatch.id : '')) || null : null;
      const claimedTchId = (isTeacher) ? (document.getElementById('claimedTeacherId')?.value || (currentTeacherMatch ? currentTeacherMatch.id : '')) || null : null;
      const guruMessage = (document.getElementById('regGuruMessage')?.value || '').trim();

      const userData = {
        name: document.getElementById('regName').value.trim(),
        batch: document.getElementById('regBatch').value.trim(),
        house: document.getElementById('regHouse').value,
        phone: cleanPhone,
        email: document.getElementById('regEmail').value.trim().toLowerCase(),
        profession: document.getElementById('regProfession').value.trim(),
        domain: document.getElementById('regDomain').value,
        city: document.getElementById('regCity').value.trim(),
        photo: regUploadedPhoto || null,
        isTeacher: isTeacher,
        claimedDirectoryId: claimedDirId,
        claimedTeacherId: claimedTchId,
        message: guruMessage || undefined,
        password: pass,
        confirmPassword: conf,
        role: isTeacher ? 'teacher' : 'member',
        roleTitle: isTeacher ? 'Revered Faculty Member' : 'Verified Alumni Member',
        status: 'approved'
      };

      const res = (typeof registerAlumni === 'function') ? registerAlumni(userData) : { success: true, user: userData };
      if (!res.success) {
        showAlert("⚠️ " + res.message, false);
        return;
      }

      const registeredUser = res.user || userData;
      registeredUser.status = 'approved';
      registeredUser.role = isTeacher ? 'teacher' : 'member';

      if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastRegistration === 'function') {
        window.AlumniCloudSync.broadcastRegistration(registeredUser);
      }
      if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastApproval === 'function') {
        window.AlumniCloudSync.broadcastApproval(registeredUser);
      }

      setCurrentUser(registeredUser, true);

      showAlert(\`🎉 Registration successful! Welcome \${registeredUser.name}. Entering portal...\`, true);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }

    function closeRegOtpModal() {
      const modal = document.getElementById('regOtpModal');
      if (modal) modal.classList.add('hidden');
    }

    function resendRegOtp() {}
    function proceedToPortalReadOnly() { window.location.href = 'index.html'; }
    function handleVerifyRegOtp(e) { if (e) e.preventDefault(); window.location.href = 'index.html'; }
    function openWhatsAppSmsOtp() {}
    function openEmailOtp() {}

    `;

if (oldHandleFormRegisterRegex.test(loginHtml)) {
  loginHtml = loginHtml.replace(oldHandleFormRegisterRegex, newHandleFormRegisterCode);
  console.log('✓ Successfully updated handleFormRegister in login.html');
} else {
  console.warn('⚠️ handleFormRegister pattern not found in login.html');
}

// B) Remove WhatsApp review modal button and any WhatsApp links in login.html
loginHtml = loginHtml.replace(
  /<a id="regReviewWhatsAppBtn"[\s\S]*?<\/a>/g,
  `<!-- Registration WhatsApp button removed -->`
);

// C) Add Cache-Buster to scripts in login.html
loginHtml = loginHtml.replace(/src="assets\/js\/theme\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/theme.js?v=20261122_v2"');
loginHtml = loginHtml.replace(/src="assets\/js\/directory-seed\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/directory-seed.js?v=20261122_v2"');
loginHtml = loginHtml.replace(/src="assets\/js\/storage-engine\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/storage-engine.js?v=20261122_v2"');
loginHtml = loginHtml.replace(/src="assets\/js\/cloud-sync\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/cloud-sync.js?v=20261122_v2"');
loginHtml = loginHtml.replace(/src="assets\/js\/auth\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/auth.js?v=20261122_v2"');

fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');


// =========================================================================
// 2. UPDATE assets/js/app.js
// =========================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// A) Remove Message button on Notable Alumni card and use Send Regards
const oldNotableCardButtonRegex = /<button onclick="openChatWithAlumnus\('\$\{item\.name\}'\)" class="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm">\s*<span>💬 Message<\/span>\s*<\/button>/;

const newNotableCardButton = `<button onclick="openNotableRegardsModal('\${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
          <span>🤝</span> <span>Send Regards / शुभकामनाएं</span>
        </button>`;

if (oldNotableCardButtonRegex.test(appJs)) {
  appJs = appJs.replace(oldNotableCardButtonRegex, newNotableCardButton);
  console.log('✓ Successfully replaced Notable Alumni Message button with Send Regards in app.js');
} else {
  console.warn('⚠️ Notable Alumni Message button pattern not found in app.js');
}

// B) Remove WhatsApp dispatch in Admin Registrations Queue
appJs = appJs.replace(
  /const waChatApplicantUrl = `https:\/\/wa\.me\/91\$\{cleanPhone\}\?text=\$\{encodeURIComponent\(\(isTeacher \? 'Pranam ' : 'Namaste '\) \+ reg\.name \+ ' ji, this is from the JNVGFamily Alumni Verification Committee regarding your registration\.\.\.'\)\}`;/g,
  `const waChatApplicantUrl = '#';`
);

// Remove the WhatsApp button from admin registration card
appJs = appJs.replace(
  /<a href="\$\{waChatApplicantUrl\}" target="_blank" class="px-3 py-1\.5 rounded-lg bg-emerald-600\/20 text-emerald-300 hover:bg-emerald-600\/30 border border-emerald-500\/30 font-bold text-xs flex items-center gap-1 transition">\s*<span>💬 WhatsApp<\/span>\s*<\/a>/g,
  `<!-- WhatsApp trigger removed for applicant -->`
);

// C) Remove unused waUrl in handleVerifyIndexOtp
appJs = appJs.replace(
  /const waUrl = `https:\/\/wa\.me\/919972868674\?text=\$\{encodeURIComponent\(waMsg\)\}`;/g,
  `const waUrl = '';`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');


// =========================================================================
// 3. UPDATE index.html
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// A) Remove pending WhatsApp buttons in index.html
indexHtml = indexHtml.replace(
  /<a id="pendingNotifyAdminWaBtn"[\s\S]*?<\/a>/g,
  `<!-- WhatsApp notification button removed -->`
);
indexHtml = indexHtml.replace(
  /<a id="pendingModalWaBtn"[\s\S]*?<\/a>/g,
  `<!-- WhatsApp modal button removed -->`
);

// B) Add Cache-Buster to scripts in index.html
indexHtml = indexHtml.replace(/src="assets\/js\/theme\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/theme.js?v=20261122_v2"');
indexHtml = indexHtml.replace(/src="assets\/js\/storage-engine\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/storage-engine.js?v=20261122_v2"');
indexHtml = indexHtml.replace(/src="assets\/js\/cloud-sync\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/cloud-sync.js?v=20261122_v2"');
indexHtml = indexHtml.replace(/src="assets\/js\/auth\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/auth.js?v=20261122_v2"');
indexHtml = indexHtml.replace(/src="assets\/js\/app\.js(?:\?v=[^"]*)?"/g, 'src="assets/js/app.js?v=20261122_v2"');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Successfully updated index.html');


// =========================================================================
// 4. UPDATE sw.js (Service Worker Cache Busting)
// =========================================================================
const swJsPath = path.join(rootDir, 'sw.js');
let swJs = fs.readFileSync(swJsPath, 'utf8');
swJs = swJs.replace(/const CACHE_NAME = '[^']*';/, "const CACHE_NAME = 'jnvg-alumni-v20261122-v3';");
// Force cache cleanup of any old cache
fs.writeFileSync(swJsPath, swJs, 'utf8');
console.log('✓ Successfully updated sw.js with fresh cache version');
