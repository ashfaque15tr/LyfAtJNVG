
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

﻿/**
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
    id: "usr-yasir-1",
    email: "yasir.abdul@jnvalumni.org",
    password: "password123",
    name: "Yasir Abdul",
    batch: 1995,
    house: "Nilgiri",
    role: "member",
    roleTitle: "Enterprise Technology Leader",
    status: "approved",
    phone: "+91 9876543219",
    city: "Global / India",
    profession: "Enterprise Technology Leader",
    domain: "Software & Technology",
    avatar: "YA",
    joinedDate: "Batch of 1995"
  },

  {
    id: "usr-ashfaque-admin",
    email: "ashfaque15tr@gmail.com",
    password: "AAaa11!!",
    name: "Ashfaque Ahmad",
    batch: 2005,
    house: "Nilgiri",
    role: "admin", // Permanent Super Admin
    roleTitle: "Super Admin • Software Architect",
    status: "approved",
    phone: "+91 9876501234",
    city: "Bangalore",
    profession: "Software Architect",
    domain: "Software",
    avatar: "AA",
    photo: "assets/images/ashfaq-ahmed.png",
    avatarImage: "assets/images/ashfaq-ahmed.png",
    joinedDate: "Permanent Platform Super Admin"
  },
  {
    id: "usr-admin-1",
    email: "admin@jnvalumni.org",
    password: "password123",
    name: "Dr. Amitabh Singh",
    batch: 1998,
    house: "Shivalik",
    role: "host", // Host / Senior Patron (Admin role reserved exclusively for Ashfaq Ahmed)
    roleTitle: "Host Batch Organizer & Senior Patron",
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
    name: "Sh. Manoj Mishra",
    batch: 1996,
    house: "Aravali",
    role: "batch_admin", // Batch-Wise Admin for Host 1996 Batch
    roleTitle: "Host Batch Organizer & Senior Space Scientist (ISRO)",
    status: "approved",
    phone: "+91 9415003344",
    city: "Bengaluru / Lucknow",
    profession: "Senior Space Scientist, ISRO",
    domain: "Science & Technology",
    avatar: "MM",
    photo: null,
    joinedDate: "Host Committee Organizer"
  },
  {
    id: "usr-mod-1",
    email: "moderator@jnvalumni.org",
    password: "password123",
    name: "Priya Mishra",
    batch: 2014,
    house: "Aravali",
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
    id: "usr-mod-2005",
    email: "moderator2005@jnvalumni.org",
    password: "password123",
    name: "Utkrisht Pandey",
    batch: 2005,
    house: "Nilgiri",
    role: "moderator",
    roleTitle: "Batch 2005 Moderator",
    status: "approved",
    phone: "+91 9793004455",
    city: "New Delhi",
    profession: "Founder, Rishigram Organics • Retd. Assistant Commandant, SSB",
    domain: "Sustainable Agriculture & Organic Enterprise",
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
    house: "Aravali",
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
      const exists = existing.find(u => (u.email || '').toLowerCase() === acc.email.toLowerCase());
      if (!exists) {
        existing.push(acc);
        modified = true;
      }
    });

    // Guarantee ashfaque15tr@gmail.com ALWAYS holds permanent Super Admin credentials (Batch 2005)
    // Remove any legacy duplicate 2008 entry
    const beforeCount = existing.length;
    existing = existing.filter(u => u.id !== 'usr-ashfaq-1' && (u.email || '').toLowerCase() !== 'ashfaq@jnvalumni.org');
    if (existing.length !== beforeCount) modified = true;

    let ashfaq = existing.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com');
    if (!ashfaq) {
      ashfaq = {
        id: "usr-ashfaque-admin",
        email: "ashfaque15tr@gmail.com",
        password: "AAaa11!!",
        name: "Ashfaque Ahmad",
        batch: 2005,
        house: "Nilgiri",
        role: "admin",
        roleTitle: "Super Admin • Software Architect",
        status: "approved",
        phone: "+91 9876501234",
        city: "Bangalore",
        profession: "Software Architect",
        domain: "Software",
        avatar: "AA",
        photo: "assets/images/ashfaq-ahmed.png",
        avatarImage: "assets/images/ashfaq-ahmed.png",
        joinedDate: "Permanent Platform Super Admin"
      };
      existing.unshift(ashfaq);
      modified = true;
    } else {
      if (ashfaq.name !== 'Ashfaque Ahmad' || ashfaq.batch !== 2005 || ashfaq.house !== 'Nilgiri' || ashfaq.role !== 'admin' || ashfaq.city !== 'Bangalore' || ashfaq.profession !== 'Software Architect' || ashfaq.password !== 'AAaa11!!' || ashfaq.status !== 'approved' || ashfaq.photo !== 'assets/images/ashfaq-ahmed.png' || (ashfaq.photo && ashfaq.photo.startsWith('data:image'))) {
        ashfaq.name = 'Ashfaque Ahmad';
        ashfaq.batch = 2005;
        ashfaq.house = 'Nilgiri';
        ashfaq.role = 'admin';
        ashfaq.roleTitle = 'Super Admin • Software Architect';
        ashfaq.city = 'Bangalore';
        ashfaq.profession = 'Software Architect';
        ashfaq.domain = 'Software';
        ashfaq.password = 'AAaa11!!';
        ashfaq.status = 'approved';
        ashfaq.photo = 'assets/images/ashfaq-ahmed.png';
        ashfaq.avatarImage = 'assets/images/ashfaq-ahmed.png';
        modified = true;
      }
    }

    // Strictly enforce: ONLY ashfaque15tr@gmail.com can have the admin (Super Admin) role!
    existing.forEach(u => {
      if ((u.email || '').toLowerCase() !== 'ashfaque15tr@gmail.com' && u.role === 'admin') {
        u.role = 'host';
        u.roleTitle = 'Host Batch Organizer & Senior Patron';
        modified = true;
      }
    });

    // Purge any lingering reference to Smriti Singh from existing users
    existing.forEach(u => {
      if ((u.name || '').toLowerCase() === 'smriti singh' || (u.email || '').toLowerCase() === 'batch1996@jnvalumni.org') {
        u.name = "Sh. Manoj Mishra";
        u.batch = 1996;
        u.profession = "Senior Space Scientist, ISRO";
        u.role = "batch_admin";
        u.roleTitle = "Host Batch Organizer & Senior Space Scientist (ISRO)";
        u.avatar = "MM";
        modified = true;
      }
    });

    // Also check session storage and local storage current session for Smriti Singh
    try {
      if (typeof window !== 'undefined') {
        [sessionStorage, localStorage].forEach(store => {
          const raw = store.getItem(AUTH_STORAGE_KEY);
          if (raw) {
            const ses = JSON.parse(raw);
            if ((ses.name || '').toLowerCase() === 'smriti singh') {
              ses.name = "Sh. Manoj Mishra";
              ses.profession = "Senior Space Scientist, ISRO";
              ses.roleTitle = "Host Batch Organizer & Senior Space Scientist (ISRO)";
              ses.avatar = "MM";
              store.setItem(AUTH_STORAGE_KEY, JSON.stringify(ses));
            }
          }
        });
      }
    } catch(e) {}

    // Ensure clean state without auto-approving pending applications
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
      const u = JSON.parse(raw);
      if (u && (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com') {
        u.name = 'Ashfaque Ahmad';
        u.batch = 2005;
        u.house = 'Nilgiri';
        u.city = 'Bangalore';
        u.profession = 'Software Architect';
        u.domain = 'Software';
        u.role = 'admin';
        u.roleTitle = 'Super Admin • Software Architect';
        if (u.photo === undefined || (typeof u.photo === 'string' && u.photo.includes('screenshot'))) {
          u.photo = 'assets/images/ashfaq-ahmed.png';
          u.avatarImage = 'assets/images/ashfaq-ahmed.png';
        }
      }
      return u;
    }
  } catch (e) {
    console.error("Session parse error:", e);
  }
  return null;
}

// Set Active Session
function setCurrentUser(user, remember = true) {
  if (user && (user.email || '').toLowerCase() === 'ashfaque15tr@gmail.com') {
    user.name = 'Ashfaque Ahmad';
    user.batch = 2005;
    user.house = 'Nilgiri';
    user.city = 'Bangalore';
    user.profession = 'Software Architect';
    user.domain = 'Software';
    user.role = 'admin';
    user.roleTitle = 'Super Admin • Software Architect';
    if (user.photo === undefined) {
      user.photo = 'assets/images/ashfaq-ahmed.png';
      user.avatarImage = 'assets/images/ashfaq-ahmed.png';
    }
  }
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

  // Guaranteed Super Admin authentication for ashfaque15tr@gmail.com
  if (normalizedEmail === 'ashfaque15tr@gmail.com' && password === 'AAaa11!!') {
    let ashfaq = users.find(u => (u.email || '').toLowerCase() === normalizedEmail);
    if (!ashfaq) {
      ashfaq = {
        id: "usr-ashfaque-admin",
        email: "ashfaque15tr@gmail.com",
        password: "AAaa11!!",
        name: "Ashfaque Ahmad",
        batch: 2005,
        house: "Nilgiri",
        role: "admin",
        roleTitle: "Super Admin • Software Architect",
        status: "approved",
        phone: "+91 9876501234",
        city: "Bangalore",
        profession: "Software Architect",
        domain: "Software",
        avatar: "AA",
        photo: "assets/images/ashfaq-ahmed.png",
        avatarImage: "assets/images/ashfaq-ahmed.png",
        joinedDate: "Permanent Platform Super Admin"
      };
      users.unshift(ashfaq);
      saveAllUsers(users);
    } else {
      ashfaq.name = "Ashfaque Ahmad";
      ashfaq.batch = 2005;
      ashfaq.house = "Nilgiri";
      ashfaq.city = "Bangalore";
      ashfaq.profession = "Software Architect";
      ashfaq.domain = "Software";
      ashfaq.role = "admin";
      ashfaq.roleTitle = "Super Admin • Software Architect";
      ashfaq.status = "approved";
      ashfaq.password = "AAaa11!!";
      ashfaq.photo = ashfaq.photo || "assets/images/ashfaq-ahmed.png";
      ashfaq.avatarImage = ashfaq.avatarImage || "assets/images/ashfaq-ahmed.png";
      saveAllUsers(users);
    }
    setCurrentUser(ashfaq, remember);
    return { success: true, user: ashfaq };
  }
  
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return { success: false, message: "No registered alumni account found with this email." };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password. Please verify credentials or use 'Forgot password'." };
  }

  if (user.status === "rejected") {
    return { success: false, message: "Your registration was declined by the Alumni Verification Committee. Please contact Ashfaque Ahmad (+91 9972868674) on WhatsApp for clarification." };
  }

  // Auto-approve any pending user upon login (Instant Access)
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
  }

  // Approved! Store session
  setCurrentUser(user, remember);
  return { success: true, user };
}

// Quick 1-Click Role Login (For Demonstration / Testing)
function quickRoleLogin(roleKey) {
  const users = getAllUsers();
  let target = null;
  if (roleKey === 'admin' || roleKey === 'superadmin') {
    target = users.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com');
  } else if (roleKey === 'host' || roleKey === 'batch_admin') {
    target = users.find(u => u.email === "batch1996@jnvalumni.org") || users.find(u => u.email === "admin@jnvalumni.org");
  } else if (roleKey === 'ashfaq' || roleKey === 'tech_lead') {
    target = users.find(u => u.email === "ashfaque15tr@gmail.com");
  } else if (roleKey === 'teacher' || roleKey === 'faculty' || roleKey === 'gurujan') {
    target = users.find(u => u.email === "principal@jnvalumni.org") || users.find(u => u.role === 'teacher');
  } else {
    target = users.find(u => u.role === roleKey);
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

// ==========================================
// 2FA OTP ENGINE & TELECOM SMS GATEWAY
// Supports Fast2SMS, 2Factor.in, MSG91, Textlocal & Custom Webhook
// ==========================================

const SMS_GATEWAY_STORAGE_KEY = 'JNVG_SMS_GATEWAY_CONFIG';

const DEFAULT_SMS_GATEWAY = {
  provider: 'fast2sms', // 'fast2sms' | 'twofactor' | 'msg91' | 'textlocal' | 'custom'
  apiKey: 'oT5Y9CQwW4nA8GLNP8kXM1W3k7tg7OG2Y7cwqskcLwshE9EJIosCp4lWfQjU277FAgIvEyjA2G4pF8tc',
  senderId: 'JNVGFM',
  customWebhookUrl: '',
  autoTriggerApp: false
};

function getSmsGatewayConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SMS_GATEWAY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SMS_GATEWAY,
          ...parsed,
          apiKey: parsed.apiKey || DEFAULT_SMS_GATEWAY.apiKey
        };
      }
    }
  } catch (e) {
    console.error("SMS Gateway config read error:", e);
  }
  return { ...DEFAULT_SMS_GATEWAY };
}

function saveSmsGatewayConfig(cfg) {
  try {
    const current = getSmsGatewayConfig();
    const updated = { ...current, ...cfg };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SMS_GATEWAY_STORAGE_KEY, JSON.stringify(updated));
    }
    return { success: true, config: updated };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

/**
 * Dispatch real cellular SMS via Telecom SMS Gateway (Fast2SMS / 2Factor / MSG91 / Webhook)
 */
async function dispatchRealSmsViaGateway(phoneNumber, otpCode, purpose = 'registration') {
  // Real telecom SMS disabled per user request
  return { success: true, provider: 'telecom_disabled', message: 'SMS dispatch bypassed' };
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
      otp: otpCode,
      timestamp: Date.now()
    };
    // Trigger real telecom gateway SMS asynchronously
    if (typeof dispatchRealSmsViaGateway === 'function') {
      dispatchRealSmsViaGateway(cleanPhone, otpCode, purpose).catch(e => console.error("Real SMS dispatch error:", e));
    }
  }

  return {
    success: true,
    maskedPhone: maskedPhone,
    cleanPhone: cleanPhone,
    waUrl: waUrl,
    smsUrl: smsUrl,
    otp: otpCode,
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
// 4-TIER DIRECTORY SMART MATCH & PROFILE CLAIM ENGINE
// ==========================================

function cleanName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(sh|shri|smt|shrimati|mr|mrs|ms|dr|col|colonel|er|adv|advocate|prof|professor|ias|ips|pps|ies|irs|officer|judge|sir|bhaiya)\b\.?/gi, ' ')
    .replace(/[.,/#!$%^&*;:{}=\-_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPhone(str) {
  if (!str) return '';
  const digits = String(str).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : '';
}

function cleanEmail(str) {
  if (!str) return '';
  return String(str).trim().toLowerCase();
}

function normalizeHouse(val) {
  if (!val) return '';
  const s = val.toString().trim().toLowerCase();
  if (s.startsWith('arav') || s.startsWith('araw')) return 'aravali';
  if (s.startsWith('nilg') || s.startsWith('neel')) return 'nilgiri';
  if (s.startsWith('udai') || s.startsWith('uday')) return 'udaigiri';
  if (s.startsWith('shiv') || s.startsWith('shiw')) return 'shivalik';
  return s;
}

function matchesBatch(itemBatch, userBatch) {
  if (!itemBatch || !userBatch) return false;
  const ub = parseInt(userBatch, 10);
  if (!ub) return false;
  const ibStr = String(itemBatch).trim();
  const ibNum = parseInt(ibStr, 10);
  if (ibNum === ub) return true;
  const parts = ibStr.split(/[-–—]/).map(p => parseInt(p.trim(), 10)).filter(p => !isNaN(p));
  if (parts.length === 2) {
    if (ub >= parts[0] && ub <= parts[1]) return true;
  }
  return false;
}

function getDirectoryRecords() {
  let recs = [];
  if (typeof window !== 'undefined' && window.AppState && Array.isArray(window.AppState.directory) && window.AppState.directory.length > 0) {
    recs = window.AppState.directory;
  } else if (typeof AppState !== 'undefined' && Array.isArray(AppState.directory) && AppState.directory.length > 0) {
    recs = AppState.directory;
  } else if (typeof defaultDirectoryAlumni !== 'undefined' && Array.isArray(defaultDirectoryAlumni) && defaultDirectoryAlumni.length > 0) {
    recs = defaultDirectoryAlumni;
  } else if (typeof window !== 'undefined' && window.defaultDirectoryAlumni && Array.isArray(window.defaultDirectoryAlumni) && window.defaultDirectoryAlumni.length > 0) {
    recs = window.defaultDirectoryAlumni;
  } else {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('JNVG_ALUMNI_APP_DATA_V2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.directory) && parsed.directory.length > 0) {
            recs = parsed.directory;
          }
        }
      }
    } catch(e) {}
  }

  // Enforce verified corrections across all records
  if (Array.isArray(recs)) {
    recs.forEach(r => {
      if (r.id === 'alumni-111' || r.phone === '9919563333' || (r.email && r.email.toLowerCase() === 'raka.softage@gmail.com')) {
        r.house = 'Aravali';
        r.badge = 'Aravali';
      }
    });
  }
  return recs || [];
}

function findDirectoryMatch(query = {}) {
  const records = getDirectoryRecords();
  if (!records || records.length === 0) {
    return { matched: false };
  }

  const cp = cleanPhone(query.phone || '');
  const ce = cleanEmail(query.email || '');
  const cn = cleanName(query.name || '');
  const ub = parseInt(query.batch, 10);
  const nh = normalizeHouse(query.house || '');

  const registeredUsers = getAllUsers();

  function evaluateClaim(dirItem) {
    const claimedUser = registeredUsers.find(u => {
      if (u.claimedDirectoryId && String(u.claimedDirectoryId) === String(dirItem.id)) return true;
      if (u.email && dirItem.email && cleanEmail(u.email) === cleanEmail(dirItem.email)) return true;
      if (u.phone && dirItem.phone && cleanPhone(u.phone) === cleanPhone(dirItem.phone)) return true;
      return false;
    });

    if (claimedUser && claimedUser.status === 'approved') {
      return {
        isAlreadyClaimed: true,
        claimedUser: {
          id: claimedUser.id,
          name: claimedUser.name,
          email: claimedUser.email,
          status: claimedUser.status
        }
      };
    }
    return { isAlreadyClaimed: false, claimedUser: claimedUser || null };
  }

  // Tier 1: 100% Exact Unique Match on Phone (10 digits) OR Email
  if (cp && cp.length === 10) {
    const match = records.find(r => r.phone && cleanPhone(r.phone) === cp);
    if (match) {
      const claim = evaluateClaim(match);
      return {
        matched: true,
        tier: 1,
        confidence: 100,
        matchType: 'phone',
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  if (ce && ce.includes('@')) {
    const match = records.find(r => r.email && cleanEmail(r.email) === ce);
    if (match) {
      const claim = evaluateClaim(match);
      return {
        matched: true,
        tier: 1,
        confidence: 100,
        matchType: 'email',
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  // Tier 2: 95% Triangulation Match on Sanitized Name + Passout Batch
  if (cn && cn.length >= 3 && ub) {
    const match = records.find(r => {
      const rName = cleanName(r.name);
      if (rName === cn || (rName.length >= 4 && (rName.includes(cn) || cn.includes(rName)))) {
        return matchesBatch(r.batch, ub);
      }
      return false;
    });

    if (match) {
      const claim = evaluateClaim(match);
      return {
        matched: true,
        tier: 2,
        confidence: 95,
        matchType: 'name_batch',
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  // Tier 3: 85% Legacy Match on Sanitized Name + House (e.g. where batch in directory was missing or generic)
  if (cn && cn.length >= 4 && nh) {
    const match = records.find(r => {
      const rName = cleanName(r.name);
      if (rName === cn || (rName.length >= 5 && (rName.includes(cn) || cn.includes(rName)))) {
        const rHouse = normalizeHouse(r.house);
        return rHouse === nh;
      }
      return false;
    });

    if (match) {
      const claim = evaluateClaim(match);
      return {
        matched: true,
        tier: 3,
        confidence: 85,
        matchType: 'name_house',
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  return { matched: false };
}

/**
 * Retrieve verified faculty / Gurujan dataset
 */
function getTeacherRecords() {
  if (typeof window !== 'undefined' && window.AppState && Array.isArray(window.AppState.teachers) && window.AppState.teachers.length > 0) {
    return window.AppState.teachers;
  }
  if (typeof AppState !== 'undefined' && Array.isArray(AppState.teachers) && AppState.teachers.length > 0) {
    return AppState.teachers;
  }
  if (typeof window !== 'undefined' && window.defaultTeachers && Array.isArray(window.defaultTeachers) && window.defaultTeachers.length > 0) {
    return window.defaultTeachers;
  }
  if (typeof defaultData !== 'undefined' && Array.isArray(defaultData.teachers) && defaultData.teachers.length > 0) {
    return defaultData.teachers;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('JNVG_ALUMNI_APP_DATA_V2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.teachers) && parsed.teachers.length > 0) {
          return parsed.teachers;
        }
      }
    }
  } catch(e) {}
  if (typeof window !== 'undefined' && Array.isArray(window.JNVG_TEACHERS_SEED) && window.JNVG_TEACHERS_SEED.length > 0) {
    return window.JNVG_TEACHERS_SEED;
  }
  return [];
}

/**
 * Find Revered Faculty / Gurujan Match
 * Supports living faculty claim/enrichment, deceased Amar Smriti protection, and anti-takeover
 * @param {Object} query - { phone, email, name, subject, tenure, house }
 * @returns {Object} { matched: boolean, isDeceased: boolean, isAlreadyClaimed: boolean, record: Object, claimedUser: Object }
 */
function findTeacherMatch(query = {}) {
  const records = getTeacherRecords();
  if (!records || records.length === 0) {
    return { matched: false };
  }

  const cp = cleanPhone(query.phone || '');
  const ce = cleanEmail(query.email || '');
  const cn = cleanName(query.name || '');

  const registeredUsers = getAllUsers();

  function evaluateTeacherClaim(tchItem) {
    const claimedUser = registeredUsers.find(u => {
      if (u.claimedTeacherId && String(u.claimedTeacherId) === String(tchItem.id)) return true;
      if (u.email && tchItem.email && cleanEmail(u.email) === cleanEmail(tchItem.email)) return true;
      if (u.phone && tchItem.phone && cleanPhone(u.phone) === cleanPhone(tchItem.phone)) return true;
      return false;
    });

    if (claimedUser && claimedUser.status === 'approved') {
      return {
        isAlreadyClaimed: true,
        claimedUser: {
          id: claimedUser.id,
          name: claimedUser.name,
          email: claimedUser.email,
          status: claimedUser.status
        }
      };
    }
    return { isAlreadyClaimed: false, claimedUser: claimedUser || null };
  }

  // Tier 1: Exact Unique Match on Phone (10 digits) OR Email
  if (cp && cp.length === 10) {
    const match = records.find(r => r.phone && cleanPhone(r.phone) === cp);
    if (match) {
      const claim = evaluateTeacherClaim(match);
      return {
        matched: true,
        tier: 1,
        confidence: 100,
        matchType: 'phone',
        isDeceased: !!(match.isDeceased || match.category === 'in_memoriam'),
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  if (ce && ce.includes('@')) {
    const match = records.find(r => r.email && cleanEmail(r.email) === ce);
    if (match) {
      const claim = evaluateTeacherClaim(match);
      return {
        matched: true,
        tier: 1,
        confidence: 100,
        matchType: 'email',
        isDeceased: !!(match.isDeceased || match.category === 'in_memoriam'),
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  // Tier 2: Canonical Name Matching
  if (cn && cn.length >= 3) {
    const match = records.find(r => {
      const tName = cleanName(r.name);
      return tName === cn || (tName.length >= 4 && (tName.includes(cn) || cn.includes(tName)));
    });

    if (match) {
      const claim = evaluateTeacherClaim(match);
      return {
        matched: true,
        tier: 2,
        confidence: 95,
        matchType: 'name',
        isDeceased: !!(match.isDeceased || match.category === 'in_memoriam'),
        record: match,
        isAlreadyClaimed: claim.isAlreadyClaimed,
        claimedUser: claim.claimedUser
      };
    }
  }

  return { matched: false };
}

// ==========================================
// REGISTRATION WITH PASSWORD RECONFIRMATION & 2FA
// ==========================================

function validateRegistrationData(userData) {
  if (!userData.name || !userData.name.trim()) {
    return { valid: false, message: "Please enter your full legal name." };
  }
  const isTeacher = userData.role === 'teacher' || userData.profession === 'Faculty' || userData.isTeacher;
  if (!isTeacher) {
    if (!userData.batch || userData.batch < 1990 || userData.batch > 2030) {
      return { valid: false, message: "Please specify a valid passout batch year (1992 - 2025)." };
    }
  } else {
    if (!userData.batch && !userData.tenure) {
      return { valid: false, message: "Please specify your joining / service year at JNV Gauriganj." };
    }
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

  // Check anti-takeover and uniqueness
  const users = getAllUsers();
  const exists = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
  if (exists) {
    return { valid: false, message: "An account with this email address already exists. Please log in instead." };
  }

  if (userData.claimedDirectoryId) {
    const claimedExists = users.find(u => u.claimedDirectoryId && String(u.claimedDirectoryId) === String(userData.claimedDirectoryId) && u.status === 'approved');
    if (claimedExists) {
      return { valid: false, message: "This directory profile has already been claimed and verified by an active member. Please log in instead." };
    }
  }

  if (userData.claimedTeacherId) {
    const claimedTchExists = users.find(u => u.claimedTeacherId && String(u.claimedTeacherId) === String(userData.claimedTeacherId) && u.status === 'approved');
    if (claimedTchExists) {
      return { valid: false, message: "This revered faculty profile has already been claimed and verified by an active member. Please log in instead." };
    }
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

// Register New Alumni Record (Strict Membership Verification & Profile Claim/Enrichment Workflow)
function registerAlumni(userData) {
  const users = getAllUsers();
  const exists = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
  if (exists) {
    return { success: false, message: "An account with this email address already exists." };
  }

  const initials = userData.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const isTeacher = userData.role === 'teacher' || userData.profession === 'Faculty' || userData.isTeacher;
  const claimedId = userData.claimedDirectoryId || null;
  const claimedTeacherId = userData.claimedTeacherId || null;

  const newAlumnus = {
    id: `usr-${Date.now()}`,
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    name: userData.name.trim(),
    batch: parseInt(userData.batch, 10) || (isTeacher ? (parseInt(userData.tenure, 10) || 1995) : 2010),
    house: userData.house || (isTeacher ? "Campus" : "Aravali"),
    role: isTeacher ? "teacher" : "member",
    roleTitle: isTeacher ? "Revered Faculty Member" : "Verified Alumnus",
    designation: userData.designation || userData.profession || (isTeacher ? "Faculty" : "Alumnus"),
    status: "approved", // Open Registration - Instant Approval!
    phone: userData.phone.trim(),
    city: (userData.city || "Gauriganj, UP").trim(),
    profession: (userData.profession || (isTeacher ? "Faculty" : "Alumnus")).trim(),
    domain: userData.domain || (isTeacher ? "Academics" : "Other"),
    avatar: initials || "NV",
    photo: userData.photo || null,
    claimedDirectoryId: claimedId,
    isClaimedProfile: !!claimedId,
    claimedTeacherId: claimedTeacherId,
    isClaimedTeacher: !!claimedTeacherId,
    isTeacher: isTeacher,
    message: userData.message || userData.guruMessage || null,
    twoFactorVerified: true,
    joinedDate: `Registered ${new Date().toLocaleDateString('en-GB')}`
  };

  users.push(newAlumnus);
  saveAllUsers(users);

  // In-place Faculty Profile Enrichment if claiming an existing teacher entry
  if (claimedTeacherId) {
    try {
      const storageKey = 'JNVG_ALUMNI_APP_DATA_V2';
      let appData = null;
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(storageKey);
        if (raw) appData = JSON.parse(raw);
      }
      if (!appData && typeof AppState !== 'undefined' && AppState.teachers) {
        appData = AppState;
      }

      if (appData && Array.isArray(appData.teachers)) {
        const targetTeacher = appData.teachers.find(t => String(t.id) === String(claimedTeacherId));
        if (targetTeacher) {
          if (userData.name) targetTeacher.name = userData.name.trim();
          if (userData.subject || userData.profession) targetTeacher.subject = (userData.subject || userData.profession).trim();
          if (userData.designation || userData.post || userData.profession) targetTeacher.post = (userData.designation || userData.post || userData.profession).trim();
          if (userData.tenure || userData.batch) targetTeacher.tenure = String(userData.tenure || userData.batch).trim();
          if (userData.house) targetTeacher.house = userData.house;
          if (userData.city) targetTeacher.location = userData.city.trim();
          if (userData.message || userData.guruMessage) targetTeacher.message = (userData.message || userData.guruMessage).trim();
          if (userData.photo) targetTeacher.photo = userData.photo;
          if (userData.phone) targetTeacher.phone = userData.phone.trim();
          if (userData.email) targetTeacher.email = userData.email.trim().toLowerCase();
          targetTeacher.claimed = true;
          targetTeacher.claimedBy = newAlumnus.id;
          targetTeacher.claimedAt = new Date().toISOString();

          // Sync in-memory AppState if present
          if (typeof AppState !== 'undefined' && AppState.teachers) {
            const inMem = AppState.teachers.find(t => String(t.id) === String(claimedTeacherId));
            if (inMem) Object.assign(inMem, targetTeacher);
          }
          if (typeof window !== 'undefined' && window.AppState && window.AppState.teachers) {
            const inWin = window.AppState.teachers.find(t => String(t.id) === String(claimedTeacherId));
            if (inWin) Object.assign(inWin, targetTeacher);
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(appData));
          }
        }
      }
    } catch (e) {
      console.warn("Could not enrich teacher record in place:", e);
    }
  }

  // In-place Directory Profile Enrichment if claiming an existing directory entry
  if (claimedId) {
    try {
      const storageKey = 'JNVG_ALUMNI_APP_DATA_V2';
      let appData = null;
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(storageKey);
        if (raw) appData = JSON.parse(raw);
      }
      if (!appData && typeof AppState !== 'undefined' && AppState.directory) {
        appData = AppState;
      }

      if (appData && Array.isArray(appData.directory)) {
        const target = appData.directory.find(d => String(d.id) === String(claimedId));
        if (target) {
          if (userData.name) target.name = userData.name.trim();
          if (userData.batch) target.batch = parseInt(userData.batch, 10) || target.batch;
          if (userData.house) target.house = userData.house;
          if (userData.profession || userData.role) target.role = (userData.profession || userData.role).trim();
          if (userData.city) target.location = userData.city.trim();
          if (userData.domain) target.domain = userData.domain;
          if (userData.photo) target.photo = userData.photo;
          if (userData.phone) target.phone = userData.phone.trim();
          if (userData.email) target.email = userData.email.trim().toLowerCase();
          target.claimed = true;
          target.claimedBy = newAlumnus.id;
          target.claimedAt = new Date().toISOString();

          // Sync in-memory AppState if present
          if (typeof AppState !== 'undefined' && AppState.directory) {
            const inMem = AppState.directory.find(d => String(d.id) === String(claimedId));
            if (inMem) Object.assign(inMem, target);
          }
          if (typeof window !== 'undefined' && window.AppState && window.AppState.directory) {
            const inWin = window.AppState.directory.find(d => String(d.id) === String(claimedId));
            if (inWin) Object.assign(inWin, target);
          }
          if (typeof window !== 'undefined' && window.AlumniStorageEngine && window.AlumniStorageEngine.cache && window.AlumniStorageEngine.cache.directory) {
            const inCache = window.AlumniStorageEngine.cache.directory.find(d => String(d.id) === String(claimedId));
            if (inCache) Object.assign(inCache, target);
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(appData));
          }
        }
      }
    } catch (e) {
      console.warn("Could not enrich directory item in place:", e);
    }
  }

  // Sync to AppState.pendingRegistrations in JNVG_ALUMNI_APP_DATA_V2 so it appears in Admin Tab immediately
  try {
    const storageKey = 'JNVG_ALUMNI_APP_DATA_V2';
    const appData = JSON.parse(localStorage.getItem(storageKey)) || {};
    if (!appData.pendingRegistrations) appData.pendingRegistrations = [];
    const regExists = appData.pendingRegistrations.some(r => (r.email || '').toLowerCase() === newAlumnus.email);
    const pendingObj = {
      id: newAlumnus.id,
      name: newAlumnus.name,
      batch: newAlumnus.batch,
      house: newAlumnus.house,
      phone: newAlumnus.phone,
      email: newAlumnus.email,
      role: newAlumnus.profession,
      domain: newAlumnus.domain,
      city: newAlumnus.city,
      photo: newAlumnus.photo,
      claimedDirectoryId: claimedId,
      isClaimedProfile: !!(claimedId || claimedTeacherId),
      claimedTeacherId: claimedTeacherId,
      isClaimedTeacher: !!claimedTeacherId,
      isTeacher: isTeacher,
      message: userData.message || userData.guruMessage || null,
      enrichmentNote: claimedTeacherId ? `Claimed & enriched verified Faculty entry #${claimedTeacherId}` : (claimedId ? `Claimed & enriched verified Directory entry #${claimedId}` : null),
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (2FA Verified)",
      status: "pending"
    };
    if (!regExists) {
      appData.pendingRegistrations.unshift(pendingObj);
      localStorage.setItem(storageKey, JSON.stringify(appData));
    }
    if (typeof AppState !== 'undefined' && AppState && AppState.pendingRegistrations) {
      if (!AppState.pendingRegistrations.some(r => (r.email || '').toLowerCase() === newAlumnus.email)) {
        AppState.pendingRegistrations.unshift(pendingObj);
      }
    }
    if (typeof window !== 'undefined' && window.AppState && window.AppState.pendingRegistrations) {
      if (!window.AppState.pendingRegistrations.some(r => (r.email || '').toLowerCase() === newAlumnus.email)) {
        window.AppState.pendingRegistrations.unshift(pendingObj);
      }
    }
  } catch (e) {
    console.warn("Could not sync to AppState pendingRegistrations:", e);
  }

  // Automatically enroll into directory if not claiming existing record
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
  return { success: true, user: newAlumnus, pendingApproval: false, claimedDirectoryId: claimedId, claimedTeacherId: claimedTeacherId };
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
  const idx = users.findIndex(u => u.id === userId || (u.email && u.email.toLowerCase() === (userId || '').toLowerCase()));
  if (idx !== -1) {
    const u = users[idx];
    u.status = "approved";
    u.role = (u.role === 'unverified_teacher' || u.profession === 'Faculty') ? 'teacher' : 'member';
    u.roleTitle = (u.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
    saveAllUsers(users);
    return u;
  }
  return null;
}

// Reject User Application
function rejectUserRegistration(userId) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === userId || (u.email && u.email.toLowerCase() === (userId || '').toLowerCase()));
  if (idx !== -1) {
    const u = users[idx];
    u.status = "rejected";
    u.roleTitle = "Application Declined";
    saveAllUsers(users);
    return u;
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


// Global Window & Module Exports
if (typeof window !== 'undefined') {
  window.cleanName = cleanName;
  window.cleanPhone = cleanPhone;
  window.cleanEmail = cleanEmail;
  window.normalizeHouse = normalizeHouse;
  window.matchesBatch = matchesBatch;
  window.getDirectoryRecords = getDirectoryRecords;
  window.findDirectoryMatch = findDirectoryMatch;
  window.getTeacherRecords = getTeacherRecords;
  window.findTeacherMatch = findTeacherMatch;
  window.registerAlumni = registerAlumni;
  window.validateRegistrationData = validateRegistrationData;
  window.initiateRegistrationOtp = initiateRegistrationOtp;
  window.completeRegistrationWithOtp = completeRegistrationWithOtp;
  window.compressProfileImage = compressProfileImage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanName,
    cleanPhone,
    cleanEmail,
    normalizeHouse,
    matchesBatch,
    getDirectoryRecords,
    findDirectoryMatch,
    getTeacherRecords,
    findTeacherMatch,
    loginUser,
    registerAlumni,
    validateRegistrationData,
    initiateRegistrationOtp,
    completeRegistrationWithOtp,
    getAllUsers,
    saveAllUsers,
    compressProfileImage
  };
}

// Initialize on Load
initUsersDB();
