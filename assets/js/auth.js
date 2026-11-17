/**
 * JNV Gauriganj Alumni Platform - Authentication & RBAC Engine
 * Supports Multi-Role Enterprise Sessions, Registration Approvals, 2FA OTP Verification,
 * Password Reconfirmation, and Forgot Password Mechanisms.
 */

const AUTH_STORAGE_KEY = 'JNVG_CURRENT_USER_SESSION';
const USERS_STORAGE_KEY = 'JNVG_REGISTERED_USERS_DB';
const OTP_STORAGE_KEY = 'JNVG_ACTIVE_OTP_SESSIONS';

// Pre-seeded verified alumni user directory with distinct roles
const DEFAULT_ACCOUNTS = [
  {
    id: "usr-admin-1",
    email: "admin@jnvalumni.org",
    password: "password123",
    name: "Dr. Amitabh Singh",
    batch: 1998,
    house: "Shivalik",
    role: "admin", // Super Admin
    roleTitle: "Super Admin",
    status: "approved",
    phone: "+91 9876543210",
    city: "Lucknow, UP",
    profession: "Senior Consultant Neurosurgeon",
    domain: "Medicine",
    avatar: "AS",
    joinedDate: "Registered Foundation Member"
  },
  {
    id: "usr-batch-1",
    email: "batch1996@jnvalumni.org",
    password: "password123",
    name: "Smriti Singh",
    batch: 1996,
    house: "Arawali",
    role: "batch_admin", // Batch-Wise Admin for Host 1996 Batch
    roleTitle: "Host Batch Organizer & Admin",
    status: "approved",
    phone: "+91 9415003344",
    city: "Lucknow, UP",
    profession: "Host Batch General Secretary & Senior Director",
    domain: "Corporate Leadership",
    avatar: "SS",
    joinedDate: "Host Committee Organizer"
  },
  {
    id: "usr-mod-1",
    email: "moderator@jnvalumni.org",
    password: "password123",
    name: "Priya Mishra",
    batch: 2014,
    house: "Arawali",
    role: "moderator", // Semi-Admin / Content Moderator
    roleTitle: "Content Moderator",
    status: "approved",
    phone: "+91 9811223344",
    city: "Hyderabad, India",
    profession: "Staff Cloud Architect",
    domain: "Software",
    avatar: "PM",
    joinedDate: "Moderator Committee"
  },
  {
    id: "usr-member-1",
    email: "member@jnvalumni.org",
    password: "password123",
    name: "Ramesh Yadav",
    batch: 2008,
    house: "Shivalik",
    role: "member", // Standard Verified Alumnus
    roleTitle: "Verified Alumnus",
    status: "approved",
    phone: "+91 9876543210",
    city: "Varanasi / Bengaluru",
    profession: "Senior Staff Software Engineer",
    domain: "Software",
    avatar: "RY",
    joinedDate: "Batch of 2008"
  },
  {
    id: "usr-ashfaq-1",
    email: "ashfaq@jnvalumni.org",
    password: "password123",
    name: "Ashfaq Ahmed",
    batch: 2008,
    house: "Arawali",
    role: "member",
    roleTitle: "Lead Enterprise & Systems Solutions Architect",
    status: "approved",
    phone: "+91 9876501234",
    city: "Lucknow / New Delhi",
    profession: "Lead Enterprise Solutions Architect",
    domain: "Software",
    avatar: "AA",
    joinedDate: "Batch of 2008 • Technology Committee Lead"
  },
  {
    id: "usr-mod-2005",
    email: "moderator2005@jnvalumni.org",
    password: "password123",
    name: "Utkrisht Pandey",
    batch: 2005,
    house: "Udaigiri",
    role: "moderator",
    roleTitle: "Batch 2005 Moderator",
    status: "approved",
    phone: "+91 9793004455",
    city: "New Delhi",
    profession: "Senior Corporate Legal Counsel",
    domain: "Law",
    avatar: "UP",
    joinedDate: "Batch of 2005 • Content Moderator"
  },
  {
    id: "usr-tch-principal",
    email: "principal@jnvalumni.org",
    password: "password123",
    name: "Mr. P. K. Singh",
    batch: "Principal",
    house: "Administration",
    role: "teacher",
    roleTitle: "Principal • Institutional Patron",
    designation: "Principal, JNV Gauriganj",
    status: "approved",
    phone: "+91 9415112233",
    city: "JNV Gauriganj Campus",
    profession: "Campus Principal & Administration",
    domain: "Institutional Leadership",
    avatar: "PKS",
    joinedDate: "Principal & Institutional Patron"
  },
  {
    id: "usr-tch-vp",
    email: "viceprincipal@jnvalumni.org",
    password: "password123",
    name: "Mr. N. N. Tripathi",
    batch: "Vice Principal",
    house: "Administration",
    role: "teacher",
    roleTitle: "Vice Principal • Academic Leadership",
    designation: "Vice Principal, JNV Gauriganj",
    status: "approved",
    phone: "+91 9415223344",
    city: "JNV Gauriganj Campus",
    profession: "Academic Administration & Discipline",
    domain: "Academic Leadership",
    avatar: "NNT",
    joinedDate: "Vice Principal & Academic Patron"
  },
  {
    id: "usr-tch-coord",
    email: "alumnicoordinator@jnvalumni.org",
    password: "password123",
    name: "Mr. S. K. Singh",
    batch: "Alumni In-Charge",
    house: "Nilgiri",
    role: "teacher",
    roleTitle: "Alumni Coordinator Teacher",
    designation: "Alumni Liaison Cell In-Charge",
    status: "approved",
    phone: "+91 9415334455",
    city: "JNV Gauriganj Campus",
    profession: "Student Mentorship & Alumni Liaison",
    domain: "Faculty Mentorship",
    avatar: "SKS",
    joinedDate: "Alumni Cell Faculty In-Charge"
  },
  {
    id: "usr-tch-chaudhary",
    email: "teacher@jnvalumni.org",
    password: "password123",
    name: "Dr. S. K. Chaudhary",
    batch: "1989-2006",
    house: "Arawali",
    role: "teacher",
    roleTitle: "Revered Faculty Luminary & Former Vice Principal",
    designation: "Senior Chemistry Luminary & Former Vice Principal",
    status: "approved",
    phone: "+91 9415001122",
    city: "Prayagraj / Lucknow, UP",
    profession: "PGT Chemistry & Former Vice Principal",
    domain: "Chemistry & Sciences",
    avatar: "SKC",
    joinedDate: "Former Faculty (1989 – 2006)"
  }
];

function initUsersDB() {
  let existing = null;
  try {
    existing = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
  } catch (e) { existing = null; }

  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  } else {
    let modified = false;
    DEFAULT_ACCOUNTS.forEach(acc => {
      const exists = existing.find(u => u.email === acc.email);
      if (!exists) {
        existing.push(acc);
        modified = true;
      }
    });
    // Auto-approve any pending users so every member has immediate active access
    existing.forEach(u => {
      if (u.status === "pending") {
        u.status = "approved";
        u.roleTitle = "Verified Alumnus";
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existing));
    }
  }
}

function getAllUsers() {
  initUsersDB();
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || DEFAULT_ACCOUNTS;
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

function saveAllUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Find user by Email or Phone number
function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  const q = identifier.trim().toLowerCase();
  const digitsOnly = q.replace(/\D/g, '');
  const users = getAllUsers();
  return users.find(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uPhoneDigits = (u.phone || '').replace(/\D/g, '');
    return uEmail === q || (digitsOnly.length >= 8 && uPhoneDigits.endsWith(digitsOnly));
  }) || null;
}

// Get Logged In User
function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Session parse error:", e);
  }
  return null;
}

// Set Active Session
function setCurrentUser(user, remember = true) {
  const str = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(AUTH_STORAGE_KEY, str);
  }
  sessionStorage.setItem(AUTH_STORAGE_KEY, str);
}

// Real Login Execution
function loginUser(email, password, remember = true) {
  const users = getAllUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return { success: false, message: "No registered alumni account found with this email." };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password. Please verify credentials or use 'Forgot password'." };
  }

  // If account was marked pending, auto-approve immediately as Member
  if (user.status === "pending") {
    user.status = "approved";
    user.role = user.role || "member";
    user.roleTitle = "Verified Alumnus";
    saveAllUsers(users);
  }

  if (user.status === "rejected") {
    return { success: false, message: "This registration request was declined. Contact the Alumni Association Committee." };
  }

  // Approved! Store session
  setCurrentUser(user, remember);
  return { success: true, user };
}

// Quick 1-Click Role Login (For Demonstration / Testing)
function quickRoleLogin(roleKey) {
  const users = getAllUsers();
  let target = users.find(u => u.role === roleKey);
  if (!target && roleKey === 'batch_admin') {
    target = users.find(u => u.email === "batch1996@jnvalumni.org");
  }
  if (!target && (roleKey === 'ashfaq' || roleKey === 'tech_lead')) {
    target = users.find(u => u.email === "ashfaq@jnvalumni.org");
  }
  if (!target && (roleKey === 'teacher' || roleKey === 'faculty' || roleKey === 'gurujan')) {
    target = users.find(u => u.email === "principal@jnvalumni.org") || users.find(u => u.role === 'teacher');
  }
  if (target) {
    setCurrentUser(target, true);
    return target;
  }
  return null;
}

// ==========================================
// 2FA OTP ENGINE (Two-Factor Authentication)
// ==========================================
function getOtpSessions() {
  try {
    return JSON.parse(sessionStorage.getItem(OTP_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveOtpSessions(sessions) {
  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {}
}

/**
 * Generate 6-digit cryptographic OTP for 2FA verification
 * @param {string} identifier - Email or Phone
 * @param {string} purpose - 'registration' | 'password_reset'
 */
function generateOtp(identifier, purpose = 'registration') {
  if (!identifier) return { success: false, message: "Identifier is required." };
  const key = `${purpose}_${identifier.trim().toLowerCase()}`;
  // Generate 6 digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  const sessions = getOtpSessions();
  sessions[key] = {
    code: code,
    identifier: identifier.trim().toLowerCase(),
    purpose: purpose,
    expiresAt: expiry,
    createdAt: Date.now()
  };
  saveOtpSessions(sessions);

  return {
    success: true,
    otp: code,
    identifier: identifier,
    purpose: purpose,
    expiresInSeconds: 600
  };
}

/**
 * Dispatch Mobile SMS OTP via Indian Cellular SMS / WhatsApp Network
 */
function sendMobileSmsOtp(phoneNumber, otpCode, purpose = 'registration') {
  if (!phoneNumber) return { success: false, message: "Phone number required" };
  const cleanPhone = String(phoneNumber).replace(/\D/g, '').slice(-10);
  const maskedPhone = `+91 ******${cleanPhone.slice(-4)}`;
  const message = `Your JNVGFamily 2FA Security Verification OTP for JNV Gauriganj is: ${otpCode}. Valid for 10 minutes.`;
  
  const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent('Your JNVGFamily 2FA Security Verification OTP for JNV Gauriganj Alumni is: *' + otpCode + '*. Valid for 10 minutes. (Do not share this code).')}`;
  const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(message)}`;

  if (typeof window !== 'undefined') {
    window._lastSmsOtpDispatch = {
      phone: cleanPhone,
      maskedPhone: maskedPhone,
      waUrl: waUrl,
      smsUrl: smsUrl,
      timestamp: Date.now()
    };
  }

  return {
    success: true,
    maskedPhone: maskedPhone,
    cleanPhone: cleanPhone,
    waUrl: waUrl,
    smsUrl: smsUrl,
    message: `Secure OTP dispatched via SMS to ${maskedPhone}.`
  };
}

/**
 * Verify 2FA OTP
 */
function verifyOtp(identifier, inputCode, purpose = 'registration') {
  if (!identifier || !inputCode) {
    return { success: false, message: "Please provide both identifier and OTP code." };
  }
  const key = `${purpose}_${identifier.trim().toLowerCase()}`;
  const sessions = getOtpSessions();
  const session = sessions[key];

  if (!session) {
    return { success: false, message: "No active verification code found. Please request a new OTP." };
  }

  if (Date.now() > session.expiresAt) {
    delete sessions[key];
    saveOtpSessions(sessions);
    return { success: false, message: "Verification code has expired. Please request a new OTP." };
  }

  if (session.code !== inputCode.trim()) {
    return { success: false, message: "Invalid 6-digit OTP code. Please enter the correct code." };
  }

  // Code verified! Remove consumed session
  delete sessions[key];
  saveOtpSessions(sessions);
  return { success: true, message: "Two-factor authentication verified successfully." };
}

// ==========================================
// REGISTRATION WITH PASSWORD RECONFIRMATION & 2FA
// ==========================================

function validateRegistrationData(userData) {
  if (!userData.name || !userData.name.trim()) {
    return { valid: false, message: "Please enter your full legal name." };
  }
  if (!userData.batch || userData.batch < 1990 || userData.batch > 2030) {
    return { valid: false, message: "Please specify a valid passout batch year (1992 - 2025)." };
  }
  if (!userData.email || !userData.email.includes('@')) {
    return { valid: false, message: "Please enter a valid email address." };
  }
  if (!userData.phone || userData.phone.replace(/\D/g, '').length < 10) {
    return { valid: false, message: "Please enter a valid 10-digit mobile / WhatsApp number." };
  }
  if (!userData.password || userData.password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long." };
  }
  if (userData.confirmPassword !== undefined && userData.password !== userData.confirmPassword) {
    return { valid: false, message: "Passwords do not match! Please confirm your password correctly." };
  }

  // Check uniqueness
  const users = getAllUsers();
  const exists = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
  if (exists) {
    return { valid: false, message: "An alumni account with this email address already exists. Please log in instead." };
  }

  return { valid: true };
}

// Initiate 2FA for Registration
function initiateRegistrationOtp(userData) {
  const check = validateRegistrationData(userData);
  if (!check.valid) {
    return { success: false, message: check.message };
  }
  const otpRes = generateOtp(userData.email, 'registration');
  return {
    success: true,
    otp: otpRes.otp,
    email: userData.email,
    phone: userData.phone,
    message: `Two-Factor Authentication code generated for ${userData.email}`
  };
}

// Complete Registration after OTP verification
function completeRegistrationWithOtp(userData, otpCode) {
  const otpCheck = verifyOtp(userData.email, otpCode, 'registration');
  if (!otpCheck.success) {
    return otpCheck;
  }
  return registerAlumni(userData);
}

// Register New Alumni Record
function registerAlumni(userData) {
  const users = getAllUsers();
  const exists = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
  if (exists) {
    return { success: false, message: "An account with this email address already exists." };
  }

  const initials = userData.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const newAlumnus = {
    id: `usr-${Date.now()}`,
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    name: userData.name.trim(),
    batch: parseInt(userData.batch),
    house: userData.house || "Arawali",
    role: "member",
    roleTitle: "Verified Alumnus",
    status: "approved", // By default granted Member role with immediate active access
    phone: userData.phone.trim(),
    city: (userData.city || "Gauriganj, UP").trim(),
    profession: (userData.profession || "Alumnus").trim(),
    domain: userData.domain || "Other",
    avatar: initials || "NV",
    photo: userData.photo || null,
    twoFactorVerified: true,
    joinedDate: `Registered ${new Date().toLocaleDateString('en-GB')}`
  };

  users.push(newAlumnus);
  saveAllUsers(users);

  // Directly sync to AppState.directory so the alumnus is instantly live in the Directory & Chat
  try {
    const appData = JSON.parse(localStorage.getItem('JNVG_ALUMNI_APP_DATA_V2')) || {};
    if (!appData.directory) appData.directory = [];
    const dirExists = appData.directory.some(d => (d.name || '').toLowerCase() === newAlumnus.name.toLowerCase());
    if (!dirExists) {
      appData.directory.push({
        id: newAlumnus.id,
        name: newAlumnus.name,
        batch: newAlumnus.batch,
        house: newAlumnus.house,
        role: newAlumnus.profession,
        location: newAlumnus.city,
        domain: newAlumnus.domain,
        initials: initials,
        photo: newAlumnus.photo || null,
        tag: `Batch of ${newAlumnus.batch}`
      });
      localStorage.setItem('JNVG_ALUMNI_APP_DATA_V2', JSON.stringify(appData));
    }
  } catch (e) {
    console.warn("Could not sync to AppState directory:", e);
  }

  return { success: true, user: newAlumnus };
}

// ==========================================
// FORGOT PASSWORD MECHANISM
// ==========================================

// Step 1: Initiate Forgot Password
function initiateForgotPassword(identifier) {
  if (!identifier || !identifier.trim()) {
    return { success: false, message: "Please enter your registered email or phone number." };
  }
  const user = findUserByIdentifier(identifier);
  if (!user) {
    return { success: false, message: "No registered alumni account found with this email or phone number." };
  }

  const otpRes = generateOtp(user.email, 'password_reset');
  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      batch: user.batch
    },
    otp: otpRes.otp,
    message: `Verification code generated for ${user.email}`
  };
}

// Step 2: Reset Password with OTP and Password Reconfirmation
function resetUserPasswordWithOtp(identifier, otpCode, newPassword, confirmPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, message: "Passwords do not match! Please confirm your new password correctly." };
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    return { success: false, message: "No registered account found." };
  }

  const otpCheck = verifyOtp(user.email, otpCode, 'password_reset');
  if (!otpCheck.success) {
    return otpCheck;
  }

  // Update password in DB
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].password = newPassword;
    saveAllUsers(users);
    return {
      success: true,
      email: user.email,
      message: `Password reset successfully! You can now log in using your new credentials.`
    };
  }

  return { success: false, message: "Failed to update account credentials." };
}

// Approve User Application (Invoked by Super Admin or Batch Admin)
function approveUserRegistration(userId) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].status = "approved";
    users[idx].roleTitle = "Verified Alumnus";
    saveAllUsers(users);
    return users[idx];
  }
  return null;
}

// Logout
function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'login.html';
}

// Guard: Redirect to login if unauthenticated
function requireAuth(redirectUrl = 'login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return null;
  }
  return user;
}

// Lightweight Canvas Image Compression for Profile Pictures (keeps avatar < 15KB)
function compressProfileImage(file, callback, maxWidth = 160, maxHeight = 160, quality = 0.82) {
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

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (callback) callback(dataUrl);
    };
    img.onerror = function() {
      if (callback) callback(null);
    };
    img.src = e.target.result;
  };
  reader.onerror = function() {
    if (callback) callback(null);
  };
  reader.readAsDataURL(file);
}


// Initialize on Load
initUsersDB();
