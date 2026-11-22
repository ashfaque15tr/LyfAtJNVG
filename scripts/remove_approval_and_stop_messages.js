const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. UPDATE assets/js/auth.js
// =========================================================================
const authJsPath = path.join(rootDir, 'assets', 'js', 'auth.js');
let authJs = fs.readFileSync(authJsPath, 'utf8');

// A) Migration on load: auto-approve any pending users
const autoApproveMigration = `
// Auto-approve any pending registrations: Open Community Access
(function migratePendingUsersToApproved() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('JNVG_REGISTERED_USERS_DB') : null;
    if (raw) {
      const users = JSON.parse(raw);
      let changed = false;
      users.forEach(u => {
        if (u.status === 'pending' || u.role === 'unverified' || u.role === 'unverified_teacher') {
          u.status = 'approved';
          u.role = (u.profession === 'Faculty' || u.isTeacher) ? 'teacher' : 'member';
          u.roleTitle = (u.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
          changed = true;
        }
      });
      if (changed) localStorage.setItem('JNVG_REGISTERED_USERS_DB', JSON.stringify(users));
    }
    const sessRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('JNVG_CURRENT_USER_SESSION') : null;
    if (sessRaw) {
      const cur = JSON.parse(sessRaw);
      if (cur && (cur.status === 'pending' || cur.role === 'unverified' || cur.role === 'unverified_teacher')) {
        cur.status = 'approved';
        cur.role = (cur.profession === 'Faculty' || cur.isTeacher) ? 'teacher' : 'member';
        cur.roleTitle = (cur.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
        localStorage.setItem('JNVG_CURRENT_USER_SESSION', JSON.stringify(cur));
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('JNVG_CURRENT_USER_SESSION', JSON.stringify(cur));
      }
    }
  } catch(e) {}
})();
`;

if (!authJs.includes('migratePendingUsersToApproved')) {
  authJs = autoApproveMigration + '\n' + authJs;
}

// B) loginUser: Auto-approve pending users upon login
authJs = authJs.replace(
  /\/\/ Pending verification user \(Preserve pending state and grant read-only session\)[\s\S]*?if \(user\.status === "pending"\) \{[\s\S]*?return \{[\s\S]*?pendingApproval: true,[\s\S]*?\};[\s\S]*?\}/g,
  `// Auto-approve any pending user upon login (Instant Access)
  if (user.status === "pending" || user.role === 'unverified' || user.role === 'unverified_teacher') {
    user.status = "approved";
    user.role = (user.profession === 'Faculty' || user.isTeacher) ? 'teacher' : 'member';
    user.roleTitle = (user.role === 'teacher') ? "Revered Faculty Member" : "Verified Alumnus";
    setCurrentUser(user, remember);
    // Persist approved status to DB
    const all = getAllUsers();
    const idx = all.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      all[idx].status = 'approved';
      all[idx].role = user.role;
      all[idx].roleTitle = user.roleTitle;
      saveAllUsers(all);
    }
    return { success: true, user: user, pendingApproval: false };
  }`
);

// C) registerAlumni: Auto-approve immediately & add directly to directory
authJs = authJs.replace(
  /role: isTeacher \? "unverified_teacher" : "unverified",\s*roleTitle: isTeacher \? "Faculty Pending Verification" : "Membership Pending Verification",\s*designation: userData\.designation \|\| userData\.profession \|\| \(isTeacher \? "Faculty" : "Alumnus"\),\s*status: "pending", \/\/ Strict Alumni \/ Faculty Verification required/g,
  `role: isTeacher ? "teacher" : "member",
    roleTitle: isTeacher ? "Revered Faculty Member" : "Verified Alumnus",
    designation: userData.designation || userData.profession || (isTeacher ? "Faculty" : "Alumnus"),
    status: "approved", // Open Registration - Instant Approval!`
);

authJs = authJs.replace(
  /return \{ success: true, user: newAlumnus, pendingApproval: true, claimedDirectoryId: claimedId, claimedTeacherId: claimedTeacherId \};/g,
  `// Automatically enroll into directory if not claiming existing record
  if (!claimedId && !isTeacher) {
    try {
      if (typeof upsertAlumniRecord === 'function') {
        upsertAlumniRecord(newAlumnus);
      } else {
        const storageKey = 'JNVG_ALUMNI_APP_DATA_V2';
        let appData = JSON.parse(localStorage.getItem(storageKey)) || {};
        if (!appData.directory) appData.directory = [];
        if (!appData.directory.some(d => (d.email && d.email.toLowerCase() === newAlumnus.email) || (d.name && d.name.toLowerCase() === newAlumnus.name.toLowerCase()))) {
          appData.directory.unshift({
            id: 'dir-' + Date.now(),
            name: newAlumnus.name,
            initials: newAlumnus.avatar || 'NV',
            batch: newAlumnus.batch,
            house: newAlumnus.house,
            role: newAlumnus.profession,
            location: newAlumnus.city,
            domain: newAlumnus.domain,
            email: newAlumnus.email,
            phone: newAlumnus.phone,
            photo: newAlumnus.photo,
            badge: newAlumnus.house,
            tag: 'Verified Alumnus'
          });
          localStorage.setItem(storageKey, JSON.stringify(appData));
        }
      }
    } catch(e) {}
  }
  return { success: true, user: newAlumnus, pendingApproval: false, claimedDirectoryId: claimedId, claimedTeacherId: claimedTeacherId };`
);

// D) In dispatchRealSmsViaGateway: Do not call external telecom gateways
authJs = authJs.replace(
  /async function dispatchRealSmsViaGateway\(phoneNumber, otpCode, purpose = 'registration'\) \{[\s\S]*?return \{[\s\S]*?success: true,[\s\S]*?\};[\s\S]*?\}/g,
  `async function dispatchRealSmsViaGateway(phoneNumber, otpCode, purpose = 'registration') {
  // Real telecom SMS disabled per user request
  return { success: true, provider: 'telecom_disabled', message: 'SMS dispatch bypassed' };
}`
);

fs.writeFileSync(authJsPath, authJs, 'utf8');
console.log('✓ Updated assets/js/auth.js: Auto-approval enabled, SMS telecom dispatch disabled');

// =========================================================================
// 2. UPDATE login.html: Direct instant registration, no OTP popup, no WhatsApp
// =========================================================================
const loginHtmlPath = path.join(rootDir, 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

// Replace handleFormRegister with instant registration & auto-login
const oldHandleFormRegister = `    // --- Registration Initiation: Dispatches 2FA SMS to Mobile ---
    function handleFormRegister(e) {
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
        roleTitle: isTeacher ? 'Revered Faculty Member' : 'Verified Alumni Member'
      };

      const res = initiateRegistrationOtp(userData);
      if (!res.success) {
        showAlert(res.message, false);
        return;
      }

      // Store in memory & dispatch Mobile SMS
      pendingRegData = userData;
      pendingRegOtp = res.otp;

      const smsDispatch = sendMobileSmsOtp(userData.phone, res.otp, 'registration');
      window._lastSmsOtpDispatch = smsDispatch;

      document.getElementById('regOtpTargetEmail').textContent = userData.email;
      document.getElementById('regOtpTargetPhone').textContent = \`+91 \${cleanPhone}\`;
      const maskedPhoneEl = document.getElementById('regOtpMaskedPhone');
      if (maskedPhoneEl) maskedPhoneEl.textContent = smsDispatch.maskedPhone;

      document.getElementById('regOtpInput').value = '';
      document.getElementById('regOtpError').classList.add('hidden');

      if (regOtpCountdownInterval) clearInterval(regOtpCountdownInterval);
      regOtpCountdownInterval = startCountdownTimer('regOtpTimer', 600, () => {
        document.getElementById('regOtpError').textContent = "⚠️ OTP has expired. Please click 'Resend SMS OTP'.";
        document.getElementById('regOtpError').classList.remove('hidden');
      });

      document.getElementById('regOtpModal').classList.remove('hidden');
    }`;

const newHandleFormRegister = `    // --- Instant Direct Registration (Open Access - No SMS / No WhatsApp / No OTP) ---
    function handleFormRegister(e) {
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
        roleTitle: isTeacher ? 'Revered Faculty Member' : 'Verified Alumnus',
        status: 'approved'
      };

      const res = (typeof registerAlumni === 'function') ? registerAlumni(userData) : { success: true, user: userData };
      if (!res.success) {
        showAlert(res.message, false);
        return;
      }

      // Auto login user immediately
      if (typeof setCurrentUser === 'function') {
        setCurrentUser(res.user, true);
      }

      // Broadcast to cloud sync if available
      try {
        if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastRegistration === 'function') {
          window.AlumniCloudSync.broadcastRegistration(res.user || userData);
        }
        if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastApproval === 'function') {
          window.AlumniCloudSync.broadcastApproval(res.user || userData);
        }
      } catch(err) {}

      showAlert(\`🎉 Registration Successful! Welcome to JNVGFamily, <strong>\${userData.name}</strong>. Your account is active. Redirecting to portal...\`, true);
      const formEl = document.getElementById('registrationForm');
      if (formEl) formEl.reset();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }`;

if (loginHtml.includes(oldHandleFormRegister)) {
  loginHtml = loginHtml.replace(oldHandleFormRegister, newHandleFormRegister);
}

// Remove any automated window.open calls across login.html
loginHtml = loginHtml.replace(/try\s*\{\s*window\.open\(smsDispatch\.waUrl,\s*'_blank'\);\s*\}\s*catch\(e\)\s*\{\s*\}/g, '// auto-open removed');

fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');
console.log('✓ Updated login.html: Instant registration & auto-login active, zero SMS/WhatsApp triggers');

// =========================================================================
// 3. UPDATE assets/js/app.js: In portal modal registration -> Instant approval
// =========================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace handleRegistrationSubmit with instant approval
const oldHandleRegistrationSubmitHead = `function handleRegistrationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const rawBatch = document.getElementById('regBatch').value.trim();
  const isTeacher = currentModalRegisterType === 'teacher';
  const batch = isTeacher ? rawBatch || 'Faculty' : (parseInt(rawBatch) || 2011);
  const house = document.getElementById('regHouse').value;
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const role = document.getElementById('regRole').value.trim();
  const domain = document.getElementById('regDomain').value;
  const city = document.getElementById('regCity').value.trim();
  const guruMessage = (document.getElementById('regGuruMessage')?.value || '').trim();

  const passEl = document.getElementById('regPortalPassword');
  const confEl = document.getElementById('regPortalConfirmPassword');
  let password = "password123";
  if (passEl && confEl) {
    if (passEl.value !== confEl.value) { alert("⚠️ Passwords do not match! Please confirm both password fields are identical."); return; }
    if (passEl.value.length < 6) { alert("⚠️ Password must be at least 6 characters in length."); return; }
    password = passEl.value;
  }

  let otpRes = { otp: "123456" };
  if (typeof generateOtp === 'function') { otpRes = generateOtp(email, 'registration'); }
  if (typeof sendMobileSmsOtp === 'function') {
    sendMobileSmsOtp(phone, otpRes.otp, 'registration');
  }

  const cleanPhone = String(phone).replace(/\\D/g, '').slice(-10);
  const maskedPhone = \`+91 ******\${cleanPhone.slice(-4)}\`;
  const claimedId = (!isTeacher) ? (document.getElementById('claimedDirectoryId')?.value || (modalMatchedDirectoryRecord ? modalMatchedDirectoryRecord.id : '')) || null : null;
  const claimedTchId = (isTeacher) ? (document.getElementById('claimedTeacherId')?.value || (modalMatchedTeacherRecord ? modalMatchedTeacherRecord.id : '')) || null : null;

  pendingIndexReg = {
    name, batch, house, phone, email, role, domain, city, password,
    photo: modalUploadedPhoto || null,
    isTeacher,
    claimedDirectoryId: claimedId,
    claimedTeacherId: claimedTchId,
    guruMessage: guruMessage || null,
    otp: otpRes.otp
  };

  const targetEmailEl = document.getElementById('indexOtpTargetEmail');
  const targetPhoneEl = document.getElementById('indexOtpTargetPhone');
  const previewEl = document.getElementById('indexLiveOtpPreview');
  const inputEl = document.getElementById('indexOtpInput');
  const errEl = document.getElementById('indexOtpError');

  if (targetEmailEl) targetEmailEl.textContent = email;
  if (targetPhoneEl) targetPhoneEl.textContent = maskedPhone;
  if (previewEl) previewEl.textContent = \`OTP: \${otpRes.otp}\`;
  if (inputEl) inputEl.value = '';
  if (errEl) errEl.classList.add('hidden');

  closeModal('registerModal');
  openModal('indexOtpModal');
}`;

const newHandleRegistrationSubmitHead = `function handleRegistrationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const rawBatch = document.getElementById('regBatch').value.trim();
  const isTeacher = currentModalRegisterType === 'teacher';
  const batch = isTeacher ? rawBatch || 'Faculty' : (parseInt(rawBatch) || 2011);
  const house = document.getElementById('regHouse').value;
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const role = document.getElementById('regRole').value.trim();
  const domain = document.getElementById('regDomain').value;
  const city = document.getElementById('regCity').value.trim();
  const guruMessage = (document.getElementById('regGuruMessage')?.value || '').trim();

  const passEl = document.getElementById('regPortalPassword');
  const confEl = document.getElementById('regPortalConfirmPassword');
  let password = "password123";
  if (passEl && confEl) {
    if (passEl.value !== confEl.value) { alert("⚠️ Passwords do not match! Please confirm both password fields are identical."); return; }
    if (passEl.value.length < 6) { alert("⚠️ Password must be at least 6 characters in length."); return; }
    password = passEl.value;
  }

  const cleanPhone = String(phone).replace(/\\D/g, '').slice(-10);
  const claimedId = (!isTeacher) ? (document.getElementById('claimedDirectoryId')?.value || (modalMatchedDirectoryRecord ? modalMatchedDirectoryRecord.id : '')) || null : null;
  const claimedTchId = (isTeacher) ? (document.getElementById('claimedTeacherId')?.value || (modalMatchedTeacherRecord ? modalMatchedTeacherRecord.id : '')) || null : null;

  const userData = {
    name, batch, house, phone: cleanPhone, email, role, domain, city, password,
    photo: modalUploadedPhoto || null,
    isTeacher,
    claimedDirectoryId: claimedId,
    claimedTeacherId: claimedTchId,
    guruMessage: guruMessage || null,
    profession: role,
    status: 'approved',
    roleTitle: isTeacher ? 'Revered Faculty Member' : 'Verified Alumnus'
  };

  const regRes = (typeof registerAlumni === 'function') ? registerAlumni(userData) : { success: true, user: userData };
  if (!regRes.success) {
    alert("⚠️ " + regRes.message);
    return;
  }

  const registeredUser = regRes.user || userData;
  registeredUser.status = 'approved';
  registeredUser.role = isTeacher ? 'teacher' : 'member';

  if (typeof setCurrentUser === 'function') {
    setCurrentUser(registeredUser, true);
  }
  if (typeof applyUserSession === 'function') {
    applyUserSession(registeredUser);
  }

  try {
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastRegistration === 'function') {
      window.AlumniCloudSync.broadcastRegistration(registeredUser);
    }
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastApproval === 'function') {
      window.AlumniCloudSync.broadcastApproval(registeredUser);
    }
  } catch(e) {}

  closeModal('registerModal');
  showToast(\`🎉 Welcome \${name}! Your registration is complete and your profile is active.\`);
  if (typeof renderDirectory === 'function') renderDirectory();
  if (typeof renderTeachers === 'function') renderTeachers('all');
}`;

if (appJs.includes(oldHandleRegistrationSubmitHead)) {
  appJs = appJs.replace(oldHandleRegistrationSubmitHead, newHandleRegistrationSubmitHead);
}

// In applyUserSession: auto-approve any user and hide pending banner
appJs = appJs.replace(
  /const isPending = user && \(user\.status === 'pending' \|\| user\.role === 'unverified' \|\| user\.role === 'unverified_teacher'\);[\s\S]*?if \(pendingBanner\) \{[\s\S]*?pendingBanner\.classList\.add\('hidden'\);\s*\}\s*\}/g,
  `if (user && (user.status === 'pending' || user.role === 'unverified' || user.role === 'unverified_teacher')) {
    user.status = 'approved';
    user.role = (user.isTeacher || user.profession === 'Faculty') ? 'teacher' : 'member';
    user.roleTitle = (user.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
    if (typeof setCurrentUser === 'function') setCurrentUser(user, true);
  }
  const pendingBanner = document.getElementById('pendingVerificationAlertBanner');
  if (pendingBanner) {
    pendingBanner.classList.add('hidden');
  }`
);

// showPendingVerificationModal: never block
appJs = appJs.replace(
  /function showPendingVerificationModal\(actionDesc = 'creating or publishing content'\) \{[\s\S]*?alert\([\s\S]*?\);\s*\}\s*\}/g,
  `function showPendingVerificationModal(actionDesc = 'creating or publishing content') {
  // Open access enabled for all alumni - do not block
  return;
}`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated assets/js/app.js: In-portal registration auto-approves immediately, pending blocks removed');

// =========================================================================
// 4. UPDATE assets/js/cloud-sync.js: Real-time broadcast auto-approves
// =========================================================================
const cloudSyncPath = path.join(rootDir, 'assets', 'js', 'cloud-sync.js');
let cloudSync = fs.readFileSync(cloudSyncPath, 'utf8');

cloudSync = cloudSync.replace(
  /status: 'pending',/g,
  "status: 'approved',"
);

fs.writeFileSync(cloudSyncPath, cloudSync, 'utf8');
console.log('✓ Updated assets/js/cloud-sync.js: Cloud registrations marked approved immediately');

console.log('\n--- ALL UPDATES APPLIED SUCCESSFULLY ---');
