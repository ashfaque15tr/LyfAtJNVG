const fs = require('fs');
const path = require('path');

// Mock localStorage & sessionStorage
class StorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

global.localStorage = new StorageMock();
global.sessionStorage = new StorageMock();

// Mock DOM elements
class ElementMock {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.classList = {
      classes: new Set(),
      add(...args) { args.forEach(c => this.classes.add(c)); },
      remove(...args) { args.forEach(c => this.classes.delete(c)); },
      contains(c) { return this.classes.has(c); }
    };
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.children = [];
  }
  appendChild(child) { this.children.push(child); }
  remove() {}
  querySelector() { return new ElementMock('sub'); }
  querySelectorAll() { return []; }
  setAttribute() {}
  getAttribute() { return null; }
  reset() {}
}

const elements = {};
function getOrCreate(id) {
  if (!elements[id]) elements[id] = new ElementMock(id);
  return elements[id];
}

global.document = {
  body: new ElementMock('body'),
  getElementById: (id) => getOrCreate(id),
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => new ElementMock('dynamic', tag),
  addEventListener: () => {}
};

global.window = {
  location: { href: '', protocol: 'https:' },
  addEventListener: () => {},
  scrollTo: () => {}
};

global.navigator = {
  serviceWorker: {
    register: () => Promise.resolve({ scope: '/' })
  }
};

global.confirm = () => true;
global.showToast = (msg) => { /* console.log('   [Toast]:', msg); */ };

const vm = require('vm');
const rootDir = path.resolve(__dirname, '..');
const authCode = fs.readFileSync(path.join(rootDir, 'assets/js/auth.js'), 'utf8');
const appCode = fs.readFileSync(path.join(rootDir, 'assets/js/app.js'), 'utf8');
const storageCode = fs.readFileSync(path.join(rootDir, 'assets/js/storage-engine.js'), 'utf8');

// Load auth.js, app.js & storage-engine.js into global context
vm.runInThisContext(authCode);
vm.runInThisContext(appCode);
vm.runInThisContext(storageCode);

console.log('====================================================');
console.log('JNV GAURIGANJ ALUMNI PLATFORM - AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ [PASS] ${testName}`);
  } else {
    console.error(`✗ [FAIL] ${testName}`);
  }
}

// ----------------------------------------------------
// TEST SUITE 1: PRE-SEEDED ROLES & AUTHENTICATION
// ----------------------------------------------------
console.log('--- TEST SUITE 1: ROLES & CREDENTIAL AUTHENTICATION ---');

const superAdminLogin = loginUser('ashfaque15tr@gmail.com', 'AAaa11!!');
assert(superAdminLogin.success && superAdminLogin.user.role === 'admin', 'Sole Super Admin Login (Ashfaq Ahmed)');

const hostDrAmitabh = loginUser('admin@jnvalumni.org', 'password123');
assert(hostDrAmitabh.success && hostDrAmitabh.user.role === 'host', 'Event Host & Senior Patron Login (Dr. Amitabh Singh)');

const hostLogin = loginUser('batch1996@jnvalumni.org', 'password123');
assert(hostLogin.success && (hostLogin.user.role === 'host' || hostLogin.user.role === 'batch_admin') && hostLogin.user.name === 'Sh. Manoj Mishra', 'Event Host Login (Sh. Manoj Mishra)');

const modLogin = loginUser('moderator@jnvalumni.org', 'password123');
assert(modLogin.success && modLogin.user.role === 'moderator', 'Moderator Login (Priya Mishra)');

const memberLogin = loginUser('member@jnvalumni.org', 'password123');
assert(memberLogin.success && memberLogin.user.role === 'member', 'Alumni Member Login (Ramesh Yadav)');

const teacherLogin = loginUser('principal@jnvalumni.org', 'password123');
assert(teacherLogin.success && teacherLogin.user.role === 'teacher', 'Teacher Principal Login (Mr. P. K. Singh)');

const teacherVPLogin = loginUser('viceprincipal@jnvalumni.org', 'password123');
assert(teacherVPLogin.success && teacherVPLogin.user.role === 'teacher', 'Teacher VP Login (Mr. N. N. Tripathi)');

const quickTeacher = quickRoleLogin('teacher');
assert(quickTeacher && quickTeacher.role === 'teacher', 'Quick 1-Click Teacher Login');

// ----------------------------------------------------
// TEST SUITE 2: TEST PROFILE CREATION & REGISTRATION
// ----------------------------------------------------
console.log('\n--- TEST SUITE 2: CREATION OF 4 TEST MEMBER PROFILES ---');

const testProfiles = [
  { name: 'Kavita Sharma', email: 'kavita.sharma@test.org', batch: 2012, house: 'Aravali', phone: '9811100001' },
  { name: 'Rohan Verma', email: 'rohan.verma@test.org', batch: 2015, house: 'Shivalik', phone: '9811100002' },
  { name: 'Deepak Tiwari', email: 'deepak.tiwari@test.org', batch: 2004, house: 'Udaygiri', phone: '9811100003' },
  { name: 'Sunita Maurya', email: 'sunita.maurya@test.org', batch: 2018, house: 'Neelgiri', phone: '9811100004' }
];

let allUsers = getAllUsers();
testProfiles.forEach(tp => {
  allUsers.push({
    id: `usr-test-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    name: tp.name,
    email: tp.email,
    password: 'password123',
    batch: tp.batch,
    house: tp.house,
    role: 'member',
    roleTitle: 'Verified Alumnus',
    status: 'approved',
    phone: tp.phone,
    city: 'New Delhi / Lucknow',
    profession: 'Software Consultant',
    domain: 'Technology',
    avatar: tp.name.split(' ').map(n=>n[0]).join('')
  });

  AppState.directory.push({
    name: tp.name,
    batch: tp.batch,
    house: tp.house,
    role: 'Software Consultant',
    location: 'New Delhi',
    domain: 'Technology',
    systemRole: 'member',
    tag: `Batch of ${tp.batch}`
  });
});
saveAllUsers(allUsers);
saveAppData();

assert(testProfiles.every(tp => getAllUsers().some(u => u.email === tp.email)), 'All 4 Member Profiles registered in Users DB');
assert(testProfiles.every(tp => AppState.directory.some(d => d.name === tp.name)), 'All 4 Member Profiles enrolled in Alumni Directory');

// ----------------------------------------------------
// TEST SUITE 3: RBAC ROLE PROMOTIONS & DELEGATIONS
// ----------------------------------------------------
console.log('\n--- TEST SUITE 3: ROLE PROMOTIONS & ACCESS DELEGATION ---');

// 1. Admin promotes Kavita Sharma to Host
setCurrentUser(superAdminLogin.user, true);
changeUserRole('Kavita Sharma', 'host');
let updatedKavita = getAllUsers().find(u => u.name === 'Kavita Sharma');
assert(updatedKavita.role === 'host', 'Super Admin promoted Kavita Sharma to Host');

// 2. Admin promotes Rohan Verma to Moderator
changeUserRole('Rohan Verma', 'moderator');
let updatedRohan = getAllUsers().find(u => u.name === 'Rohan Verma');
assert(updatedRohan.role === 'moderator', 'Super Admin promoted Rohan Verma to Moderator');

// 3. Host (Sh. Manoj Mishra) promotes Deepak Tiwari to Moderator
setCurrentUser(hostLogin.user, true);
changeUserRole('Deepak Tiwari', 'moderator');
let updatedDeepak = getAllUsers().find(u => u.name === 'Deepak Tiwari');
assert(updatedDeepak.role === 'moderator', 'Event Host promoted Deepak Tiwari to Moderator');

// 4. Host tries to promote someone to Admin or Host (MUST BE BLOCKED)
changeUserRole('Sunita Maurya', 'admin');
let updatedSunita = getAllUsers().find(u => u.name === 'Sunita Maurya');
assert(updatedSunita.role === 'member', 'Security Guard: Host cannot promote member to Admin (remains Member)');

changeUserRole('Sunita Maurya', 'host');
updatedSunita = getAllUsers().find(u => u.name === 'Sunita Maurya');
assert(updatedSunita.role === 'member', 'Security Guard: Host cannot promote member to Host (remains Member)');

// 5. Host demotes Moderator Deepak Tiwari back to Member
changeUserRole('Deepak Tiwari', 'member');
updatedDeepak = getAllUsers().find(u => u.name === 'Deepak Tiwari');
assert(updatedDeepak.role === 'member', 'Event Host can demote Moderator back to Member');

// ----------------------------------------------------
// TEST SUITE 4: 4TH ANNUAL MEET SCHEDULE CONTROLS
// ----------------------------------------------------
console.log('\n--- TEST SUITE 4: 4TH ANNUAL MEET SCHEDULE CONTROLS ---');

// Check standard schedule loading
assert(AppState.meetSchedule && AppState.meetSchedule.length >= 7, 'Default 7 itinerary schedule events present');

// Host adds a new schedule item
setCurrentUser(hostLogin.user, true);
getOrCreate('schEventId').value = '';
getOrCreate('schTime').value = '08:00 PM';
getOrCreate('schColor').value = 'purple';
getOrCreate('schTitle').value = 'Hostel Reunion Bonfire & Gazal Night';
getOrCreate('schDesc').value = 'Acoustic guitar and hostel memories around the sacred amphitheater bonfire.';
handleScheduleSubmit({ preventDefault: () => {} });

const hasNewEvent = AppState.meetSchedule.some(ev => ev.title === 'Hostel Reunion Bonfire & Gazal Night');
assert(hasNewEvent, 'Host successfully added new event to 4th Annual Meet schedule');

// Regular Member attempts to add event (MUST BE BLOCKED)
setCurrentUser(memberLogin.user, true);
const prevLen = AppState.meetSchedule.length;
getOrCreate('schEventId').value = '';
getOrCreate('schTime').value = '11:00 PM';
getOrCreate('schTitle').value = 'Unauthorized Midnight Feast';
getOrCreate('schDesc').value = 'Attempted member modification.';
handleScheduleSubmit({ preventDefault: () => {} });
assert(AppState.meetSchedule.length === prevLen, 'Security Guard: Member blocked from modifying schedule');

// ----------------------------------------------------
// TEST SUITE 5: CULTURAL ACTS & COMMAND NOTES
// ----------------------------------------------------
console.log('\n--- TEST SUITE 5: CULTURAL ACTS REGISTRATION & HOST NOTES ---');

// Member registers a cultural act
setCurrentUser(memberLogin.user, true);
getOrCreate('perfPerformer').value = 'Sunita Maurya';
getOrCreate('perfBatch').value = '2018';
getOrCreate('perfType').value = 'Classical Dance';
getOrCreate('perfDuration').value = '7 mins';
getOrCreate('perfTitle').value = 'Kathak Tribute to Gurus';
getOrCreate('perfReqs').value = 'Stage lighting, MP3 track connection';
getOrCreate('perfDesc').value = 'Classical dance dedicated to the teachers of JNV Gauriganj.';
handlePerformanceSubmit({ preventDefault: () => {}, target: { reset: () => {} } });

const sunitaAct = (AppState.culturalActs || []).find(a => a.performer === 'Sunita Maurya');
assert(sunitaAct && sunitaAct.title === 'Kathak Tribute to Gurus', 'Member successfully registered Cultural Act');

// Host reviews act and writes Command Notes
setCurrentUser(hostLogin.user, true);
getOrCreate(`actStatus-${sunitaAct.id}`).value = 'Slot Approved';
getOrCreate(`actNotes-${sunitaAct.id}`).value = 'Approved for 03:30 PM slot. Sound engineer requested to cue audio track #4.';
saveCulturalActNotes(sunitaAct.id);

const updatedAct = AppState.culturalActs.find(a => a.id === sunitaAct.id);
assert(updatedAct.status === 'Slot Approved' && updatedAct.notes.includes('03:30 PM slot'), 'Host wrote and persisted Command Notes on Cultural Act');

// ----------------------------------------------------
// TEST SUITE 6: POSTING & FEED PERMISSIONS
// ----------------------------------------------------
console.log('\n--- TEST SUITE 6: MEMORY WALL POSTING & DELETION ---');

// 1. Teacher posts blessing
setCurrentUser(teacherLogin.user, true);
getOrCreate('storyCategory').value = 'academics';
getOrCreate('storyText').value = 'विद्या ददाति विनयं विनयाद् याति पात्रताम्। समस्त प्रिय नवोदयी विद्यार्थियों को चतुर्थ महासम्मेलन हेतु कोटिशः शुभाशीष!';
handleStorySubmit({ preventDefault: () => {} });

const teacherPost = AppState.feedPosts.find(p => p.author === 'Mr. P. K. Singh');
assert(teacherPost && teacherPost.isTeacher, 'Teacher posted Guru Blessing on Memory Wall');

// 2. Member posts memory
setCurrentUser(memberLogin.user, true);
getOrCreate('storyCategory').value = 'hostel';
getOrCreate('storyText').value = 'Missing the Aravali house evening milk roll-call and Sunday movies!';
handleStorySubmit({ preventDefault: () => {} });

const memberPost = AppState.feedPosts.find(p => p.author === memberLogin.user.name);
assert(memberPost !== undefined, 'Member posted memory on Memory Wall');

// 3. Member cannot delete Teacher post (MUST BE BLOCKED)
const initialPostCount = AppState.feedPosts.length;
deleteFeedPost(teacherPost.id);
assert(AppState.feedPosts.length === initialPostCount, 'Security Guard: Member cannot delete another user post');

// 4. Member CAN delete their own post
deleteFeedPost(memberPost.id);
assert(AppState.feedPosts.length === initialPostCount - 1, 'Member successfully deleted their own post');

// 5. Host CAN delete any post
setCurrentUser(hostLogin.user, true);
deleteFeedPost(teacherPost.id);
assert(AppState.feedPosts.length === initialPostCount - 2, 'Host has administrative authority to moderate/delete posts');

// ----------------------------------------------------
// TEST SUITE 7: PAYMENT, DONATION & AUDIT CONTROLS
// ----------------------------------------------------
console.log('\n--- TEST SUITE 7: CONTRIBUTION & FINANCIAL AUDIT RBAC ---');

// Simulate verified donation
const testDonation = {
  id: 'TXN-2026-999',
  name: 'Rohan Verma',
  batch: 2015,
  house: 'Shivalik',
  phone: '9811100002',
  cause: 'Alumni Welfare Corpus',
  amount: 5100,
  utr: 'UPI/20261213/987654321',
  date: '13 Dec 2026',
  status: 'Verified'
};
AppState.contributions.unshift(testDonation);
saveAppData();

assert(AppState.contributions.some(c => c.utr === testDonation.utr), 'Donation transaction verified & recorded in ledger');

// Check UI Access Controls for Financial Ledger
// As Member:
setCurrentUser(memberLogin.user, true);
applyUserSession(memberLogin.user);
assert(getOrCreate('contributionLedgerSection').classList.contains('hidden'), 'Audited Ledger hidden from regular Member');
assert(!getOrCreate('ledgerRestrictedNotice').classList.contains('hidden'), 'Restricted Compliance Notice shown to regular Member');

// As Host:
setCurrentUser(hostLogin.user, true);
applyUserSession(hostLogin.user);
assert(!getOrCreate('contributionLedgerSection').classList.contains('hidden'), 'Audited Ledger visible to Event Host');
assert(getOrCreate('ledgerRestrictedNotice').classList.contains('hidden'), 'Restricted Notice hidden from Event Host');

// As Admin:
setCurrentUser(superAdminLogin.user, true);
applyUserSession(superAdminLogin.user);
assert(!getOrCreate('contributionLedgerSection').classList.contains('hidden'), 'Audited Ledger visible to Super Admin');

// ----------------------------------------------------
// TEST SUITE 8: MOBILE APP & STORE BUNDLE VALIDATION
// ----------------------------------------------------
console.log('\n--- TEST SUITE 8: MOBILE APP & STORE PACKAGING ---');

const mobileHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
const capacitorConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'mobile_app', 'capacitor.config.json'), 'utf8'));
const androidManifest = fs.readFileSync(path.join(rootDir, 'mobile_app', 'android', 'AndroidManifest.xml'), 'utf8');
const iosPlist = fs.readFileSync(path.join(rootDir, 'mobile_app', 'ios', 'Info.plist'), 'utf8');
const zipExists = fs.existsSync(path.join(rootDir, 'JNV_Alumni_Mobile_App_Bundle.zip'));

assert(capacitorConfig.appId === 'org.jnvalumni.gauriganj', 'Capacitor App ID configured for Google Play / Apple Store');
assert(androidManifest.includes('package="org.jnvalumni.gauriganj"'), 'Android Manifest package configured');
assert(iosPlist.includes('org.jnvalumni.gauriganj'), 'iOS Info.plist bundle identifier configured');
assert(mobileHtml.includes('viewport-fit=cover'), 'Mobile App viewport optimized for iOS notch and Android gestures');
assert(zipExists, 'JNV_Alumni_Mobile_App_Bundle.zip packaged & available for app stores');

// ----------------------------------------------------
// TEST SUITE 9: 2FA MOBILE SMS DISPATCH & NOTABLE ALUMNI
// ----------------------------------------------------
console.log('\n--- TEST SUITE 9: 2FA MOBILE SMS DISPATCH & NOTABLE ALUMNI ---');

// Test Mobile SMS OTP Dispatcher
const smsDispatch = sendMobileSmsOtp('9876543210', '789123', 'registration');
assert(smsDispatch.success === true, 'Mobile SMS OTP Dispatch returned success');
assert(smsDispatch.maskedPhone === '+91 ******3210', 'Phone number correctly masked (+91 ******3210)');
assert(smsDispatch.waUrl.includes('789123'), 'WhatsApp SMS URL payload contains OTP code');
assert(smsDispatch.smsUrl.includes('sms:+919876543210'), 'Device SMS URL formatted with Indian country code (+91)');

// Verify Notable Alumni Batches, Houses, & Donor's Board in index.html
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(indexHtml.includes('Alok Dubey, IAS') && indexHtml.includes('2007'), 'Alok Dubey, IAS passout batch verified as 2007');
assert(indexHtml.includes('Ratnesh Tiwari') && (indexHtml.includes('2003') || indexHtml.includes('1996–2003')), 'Ratnesh Tiwari passout batch verified as 2003');
assert(indexHtml.includes('Ratnesh Tiwari') && (indexHtml.includes('Nilgiri House') || indexHtml.includes('Neelgiri House')), 'Ratnesh Tiwari verified as belonging to Nilgiri House');
assert(indexHtml.includes('JNVGFamily'), 'JNVGFamily branding in index.html header verified');
assert(indexHtml.includes('jnvgfamily.in'), 'jnvgfamily.in domain verified in index.html');
assert(smsDispatch.waUrl.includes('JNVGFamily'), 'WhatsApp 2FA SMS payload contains JNVGFamily branding');
assert(indexHtml.includes('donors-board.jpg') && indexHtml.includes('125 KVA Kirloskar'), 'Official Vidyalaya Donor\'s Board plaque & genset grant verified');
assert(indexHtml.includes('Suggestion / Issue Report') && indexHtml.includes('Site Version: v0.0.1'), 'Footer Suggestion/Issue Report and Site Version verified as strictly v0.0.1');
assert(indexHtml.includes('Aravali') && indexHtml.includes('Udaigiri') && indexHtml.includes('Nilgiri'), 'Official NVS standard house spellings verified (Aravali, Udaigiri, Nilgiri)');

// Verify Gallery Images exist
assert(fs.existsSync(path.join(rootDir, 'assets', 'images', 'meet2025-1.jpg')), 'Photo Gallery asset meet2025-1.jpg exists');
assert(fs.existsSync(path.join(rootDir, 'assets', 'images', 'meet2025-2.jpg')), 'Photo Gallery asset meet2025-2.jpg exists');
assert(fs.existsSync(path.join(rootDir, 'assets', 'images', 'meet2025-3.jpg')), 'Photo Gallery asset meet2025-3.jpg exists');
assert(fs.existsSync(path.join(rootDir, 'assets', 'images', 'meet2025-4.jpg')), 'Photo Gallery asset meet2025-4.jpg exists');

// ----------------------------------------------------
// TEST SUITE 10: DUAL-THEME SWITCHER, PERMANENT ADMIN & SMS GATEWAY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 10: DUAL-THEME SWITCHER, PERMANENT ADMIN & SMS GATEWAY ---');

// 1. Permanent Super Admin credentials (ashfaque15tr@gmail.com / AAaa11!!)
const ashfaqLogin = loginUser('ashfaque15tr@gmail.com', 'AAaa11!!');
assert(ashfaqLogin.success === true, 'Permanent Super Admin ashfaque15tr@gmail.com authenticated');
assert(ashfaqLogin.user.role === 'admin', 'ashfaque15tr@gmail.com possesses admin role');
assert(ashfaqLogin.user.roleTitle.includes('Super Admin'), 'ashfaque15tr@gmail.com holds Super Admin title');
assert(ashfaqLogin.user.house === 'Nilgiri', 'ashfaque15tr@gmail.com belongs to Nilgiri house');
assert(ashfaqLogin.user.profession === 'Software Architect', 'ashfaque15tr@gmail.com has profession Software Architect');
assert(ashfaqLogin.user.city === 'Bangalore', 'ashfaque15tr@gmail.com location is Bangalore');

// 2. Shivalik Raman & Shivaji mapping in index.html & login.html
const loginHtml = fs.readFileSync(path.join(rootDir, 'login.html'), 'utf8');
assert(indexHtml.includes('Shivalik') && indexHtml.includes('Raman & Shivaji'), 'index.html Shivalik strip maps Raman & Shivaji');
assert(loginHtml.includes('Shivalik') && loginHtml.includes('Raman & Shivaji'), 'login.html Shivalik strip maps Raman & Shivaji');

// 3. Dual-Theme Engine & Switcher
assert(fs.existsSync(path.join(rootDir, 'assets', 'js', 'theme.js')), 'Theme engine script assets/js/theme.js exists');
assert(indexHtml.includes('themeToggleBtn') && indexHtml.includes('toggleTheme()'), 'index.html contains themeToggleBtn');
assert(loginHtml.includes('themeToggleBtn') && loginHtml.includes('toggleTheme()'), 'login.html contains themeToggleBtn');
const stylesCss = fs.readFileSync(path.join(rootDir, 'assets', 'css', 'styles.css'), 'utf8');
assert(stylesCss.includes('data-theme="sky"') && stylesCss.includes('data-theme="dark"'), 'styles.css supports both data-theme="sky" and data-theme="dark"');
assert(indexHtml.includes('Light Theme'), 'index.html displays Light Theme label on toggle button');
const themeJsSrc = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'theme.js'), 'utf8');
assert(themeJsSrc.includes("'Dark Theme'") && themeJsSrc.includes("'Light Theme'"), 'theme.js manages Dark Theme and Light Theme labels');

// 4. SMS Gateway Engine & Storage Configuration
assert(typeof getSmsGatewayConfig === 'function', 'getSmsGatewayConfig function is exported');
assert(typeof saveSmsGatewayConfig === 'function', 'saveSmsGatewayConfig function is exported');
const initialCfg = getSmsGatewayConfig();
assert(initialCfg.provider === 'fast2sms', 'Default SMS gateway provider is Fast2SMS');
saveSmsGatewayConfig({ apiKey: 'TEST_KEY_123', provider: 'twofactor' });
const updatedCfg = getSmsGatewayConfig();
assert(updatedCfg.apiKey === 'TEST_KEY_123' && updatedCfg.provider === 'twofactor', 'SMS Gateway configuration persisted to storage');

// 5. Index & Login OTP Modal Live Preview & Auto-fill elements
assert(indexHtml.includes('indexOtpModal') && indexHtml.includes('openIndexWhatsAppOtp'), 'index.html contains 2FA indexOtpModal with WhatsApp dispatch');
assert(loginHtml.includes('openWhatsAppSmsOtp') && loginHtml.includes('openDeviceSmsOtp'), 'login.html enforces secure handset 2FA dispatch via WhatsApp & SMS');

// ----------------------------------------------------
// TEST SUITE 11: SOLE SUPER ADMIN, TEACHER MESSAGING & LIGHT CONTRAST
// ----------------------------------------------------
console.log('\n--- TEST SUITE 11: SOLE SUPER ADMIN, TEACHER MESSAGING & LIGHT CONTRAST ---');

// 1. Directory Clean Slate: Ashfaque Ahmad is the sole Super Admin in directory
assert(defaultDirectoryAlumni.some(a => (a.name === 'Ashfaque Ahmad' || a.name === 'Ashfaq Ahmed') && a.isSuperAdmin === true) && defaultDirectoryAlumni.length >= 500, 'Directory contains unified alumni registry from Excel with Ashfaque Ahmad as permanent administrator');

// 2. High Contrast Light Mode CSS Overrides
assert(stylesCss.includes('#homeHeroCard') && stylesCss.includes('footer-association-text'), 'styles.css contains high-contrast Light Sky overrides for hero card & footer');

// 3. Teacher Respect & Messaging Workflow
const sampleTeacher = AppState.teachers.find(t => t.name === 'Mr. P. K. Singh');
assert(sampleTeacher !== undefined, 'Mr. P. K. Singh exists in AppState.teachers');

// Simulate sending respect to Mr. P. K. Singh
let chatMsgs = getAllChatMessages();
const respectMsg = {
  id: 'test-respect-1',
  senderId: 'usr-member-1',
  senderName: 'Ramesh Yadav',
  senderBatch: 2008,
  recipientId: sampleTeacher.id,
  recipientName: sampleTeacher.name,
  recipientBatch: sampleTeacher.post,
  text: '🙏 [चरण स्पर्श एवं सादर प्रणाम / Respect]: सादर प्रणाम प्रिंसिपल सर!',
  timestamp: 'Just now',
  createdAt: Date.now(),
  type: 'respect',
  read: false
};
chatMsgs.push(respectMsg);
saveAllChatMessages(chatMsgs);

// Principal logs in and checks inbox
setCurrentUser(teacherLogin.user, true);
refreshInboxBadge();
const pConvs = getChatConversations();
assert(pConvs.some(c => c.partnerName === 'Ramesh Yadav'), 'Incoming respect conversation appears in Principal inbox');
const unreadForPrincipal = getAllChatMessages().filter(m => (m.recipientId === sampleTeacher.id || m.recipientName.toLowerCase() === teacherLogin.user.name.toLowerCase()) && !m.read);
assert(unreadForPrincipal.length > 0, 'Principal receives unread notification for respect note');

// Principal replies with blessings
const replyMsg = {
  id: 'test-blessing-1',
  senderId: teacherLogin.user.id,
  senderName: teacherLogin.user.name,
  senderBatch: teacherLogin.user.designation || 'Principal',
  recipientId: 'usr-member-1',
  recipientName: 'Ramesh Yadav',
  recipientBatch: 2008,
  text: 'सदा विजयी रहो! शुभाशीष।',
  timestamp: 'Just now',
  createdAt: Date.now(),
  read: false
};
chatMsgs = getAllChatMessages();
chatMsgs.push(replyMsg);
saveAllChatMessages(chatMsgs);

// Switch back to Ramesh Yadav session
const memberSession = loginUser('member@jnvalumni.org', 'password123');
setCurrentUser(memberSession.user, true);
refreshInboxBadge();
const mConvs = getChatConversations();
assert(mConvs.some(c => c.partnerName === 'Mr. P. K. Singh'), 'Alumnus receives Guru Ashirwad blessing in inbox');

// ----------------------------------------------------
// TEST SUITE 12: 37 NOTABLE ALUMNI, ADMIN SAHAYATA QUEUE & LIGHT SKY CONTRAST
// ----------------------------------------------------
console.log('\n--- TEST SUITE 12: 37 NOTABLE ALUMNI, ADMIN SAHAYATA QUEUE & LIGHT SKY CONTRAST ---');

assert(Array.isArray(NOTABLE_ALUMNI_LIST) && NOTABLE_ALUMNI_LIST.length >= 39, 'Full 39 Notable Alumni registered in Hall of Fame');
assert(NOTABLE_ALUMNI_LIST[0].name.includes('Alok Dubey'), 'Notable Alumni #1 is Alok Dubey, IAS');
assert(NOTABLE_ALUMNI_LIST[1].name.includes('Vivek Tiwari'), 'Notable Alumni #2 is Sh. Vivek Tiwari');
assert(NOTABLE_ALUMNI_LIST[2].name.includes('Ashwini Mishra'), 'Notable Alumni #3 is Ashwini Mishra');
assert(NOTABLE_ALUMNI_LIST[3].name.includes('Utkrisht Pandey'), 'Notable Alumni #4 is Sh. Utkrisht Pandey');
assert(NOTABLE_ALUMNI_LIST[4].name.includes('Virendra Kumar Pandey'), 'Notable Alumni #5 is Col. Virendra Kumar Pandey');
assert(NOTABLE_ALUMNI_LIST[5].name.includes('Manish Rana'), 'Notable Alumni #6 is Sh. Manish Rana');
assert(NOTABLE_ALUMNI_LIST[6].name.includes('Chandan Kumar'), 'Notable Alumni #7 is Sh. Chandan Kumar');
assert(NOTABLE_ALUMNI_LIST[7].name.includes('Ratnesh Tiwari'), 'Notable Alumni #8 is Dr. Ratnesh Tiwari');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Manish Rana') && a.batch === '2007' && a.role.includes('Civil Judge')), 'Sh. Manish Rana (2007 Batch, Judicial Magistrate / Civil Judge) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Prabhat') && a.batch === '2002' && a.role.includes('PPS')), 'Sh. Prabhat (PPS Officer, 2002 Batch) verified');
const jkm = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Jai Krishna Mishra'));
assert(jkm && jkm.batch.includes('1993') && jkm.role.includes('DRDO'), 'Dr. Jai Krishna Mishra (1993, DRDO ASL) verified');
const up = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Utkrisht Pandey'));
assert(up && up.intro.includes('Rishigram Organics') && up.role.includes('SSB'), 'Utkrisht Pandey (SSB & Rishigram Organics) verified');
assert(up.house === 'Nilgiri', 'Utkrisht Pandey house verified as Nilgiri');
assert(up.intro.includes('Red Fort') && up.intro.includes('2025'), 'Utkrisht Pandey Red Fort 2025 honors verified in intro');
assert(up.intro.includes('Raj Bhavan'), 'Utkrisht Pandey Raj Bhavan invitation verified in intro');

// User-Requested Distinguished Alumni Verified in Hall of Fame
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Virendra Kumar Pandey') && a.role.includes('Colonel')), 'Col. Virendra Kumar Pandey (1994) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Bhanu Pratap Singh') && a.role.includes('Captain')), 'Capt. Bhanu Pratap Singh (1998, UK) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Vinod Kumar Singh') && a.role.includes('Commandant')), 'Asst. Commandant Vinod Kumar Singh (CRPF 1997) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Sunil Kaushal') && a.role.includes('D.D.O.')), 'Sunil Kaushal DDO (2000) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Sanjay') && a.role.includes('Section Officer')), 'Sanjay Section Officer (UP Secretariat 2004) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Neeraj Singh') && a.role.includes('MBBS')), 'Dr. Neeraj Singh MBBS PMHS (1994) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Shyam Ji Sonkar')), 'Dr. Shyam Ji Sonkar Professor (1994) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Anurag') && a.role.includes('Orthopaedic')), 'Dr. Anurag Orthopaedic Surgeon (2004) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Shalini') && a.role.includes('Tehsildar')), 'Mrs. Shalini Naib Tehsildar (2006) verified');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Shesh Kishan')), 'Dr. Shesh Kishan Chemical Scientist (2012) verified');

// Sh. B. S. Singh Rautela (Former Principal)
const rautela = AppState.teachers.find(t => t.name.includes('Rautela'));
assert(rautela && rautela.post === 'Former Principal', 'Sh. B. S. Singh Rautela verified as Former Principal in AppState.teachers');
assert(rautela.message && rautela.message.includes('चतुर्थ महासम्मेलन'), 'Sh. B. S. Singh Rautela inspirational key message verified');
assert(indexHtml.includes('Sh. B. S. Singh Rautela'), 'index.html displays Sh. B. S. Singh Rautela in Leadership & Guru Vandana');
assert(indexHtml.includes('हमीं नवोदय हों'), 'index.html contains updated official motto हमीं नवोदय हों');
const smt = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Shailendra Mohan Tripathi'));
assert(smt && smt.batch === '1997' && smt.role.includes('KGMU'), 'Dr. Shailendra Mohan Tripathi (1997, KGMU & Univ of Aberdeen) verified');
const ck = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Chandan Kumar'));
assert(ck && ck.batch === '2004' && ck.role.includes('Shaurya Chakra'), 'Chandan Kumar (2004, Shaurya Chakra) verified');
const sss = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Satyendra Singh Satya'));
assert(sss && sss.batch === '1998' && sss.link.includes('cybr0x'), 'Satyendra Singh Satya (cybr0x, 1998) verified');

// Sole Super Admin Ashfaque Ahmad Batch & Photo
const ashfaqAdmin = getAllUsers().find(u => u.email === 'ashfaque15tr@gmail.com');
assert(ashfaqAdmin && ashfaqAdmin.batch === 2005 && ashfaqAdmin.role === 'admin', 'Ashfaque Ahmad sole Super Admin verified as Batch of 2005');
assert(ashfaqAdmin.photo === 'assets/images/ashfaq-ahmed.png', 'Ashfaque Ahmad photo correctly mapped to assets/images/ashfaq-ahmed.png');
assert(ashfaqAdmin.house === 'Nilgiri', 'Ashfaque Ahmad house verified as Nilgiri');
assert(ashfaqAdmin.city === 'Bangalore', 'Ashfaque Ahmad city verified as Bangalore');
assert(ashfaqAdmin.profession === 'Software Architect', 'Ashfaque Ahmad profession verified as Software Architect');

// Admin Sahayata Queue & Functions
const authJs = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'auth.js'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'app.js'), 'utf8');
assert(indexHtml.includes('adminHelpDeskList') && indexHtml.includes('Alumni Sahayata & Grievance Help Desk Queue'), 'index.html contains Admin Sahayata & Grievance Help Desk Queue');
assert(typeof renderAdminHelpDeskQueue === 'function', 'renderAdminHelpDeskQueue function exists');
assert(typeof renderAdminSuggestionsList === 'function', 'renderAdminSuggestionsList function exists');
assert(indexHtml.includes('adminSuggestionsList') && indexHtml.includes('Registered Alumni Suggestions & Issues'), 'index.html contains Issue & Suggestion Tracker section');
assert(typeof openNotableMessageModal === 'function', 'openNotableMessageModal function exists');
assert(stylesCss.includes('html[data-theme="sky"] [class*="bg-slate-950"]') && stylesCss.includes('background-image: none !important'), 'styles.css universally enforces high contrast and strips dark gradients in Light Sky mode');
assert(stylesCss.includes('html[data-theme="sky"] table') && stylesCss.includes('html[data-theme="sky"] thead'), 'styles.css contains high-contrast Light Sky styling for tables');
assert(indexHtml.includes("darkMode: ['selector', '[data-theme=\"dark\"]']") && loginHtml.includes("darkMode: ['selector', '[data-theme=\"dark\"]']"), 'Tailwind CDN explicitly configured with data-theme selector dark mode');
assert(!authJs.includes('"Smriti Singh"'), 'Smriti Singh completely eradicated from default auth accounts');
assert(!appJs.includes('"Smriti Singh"'), 'Smriti Singh completely eradicated from default chat messages');
assert(stylesCss.includes('news-ticker-track') && stylesCss.includes('#0c2f54'), 'News ticker styled with dark navy high contrast in Light Sky mode');
assert(stylesCss.includes('html[data-theme="sky"] [class*="border-slate-"]'), 'Universal slate borders overridden for clean light sky aesthetics');

// ----------------------------------------------------
// TEST SUITE 13: GURU VANDANA HIERARCHY, DONOR BOARD & PROFILE DELETION RBAC
// ----------------------------------------------------
console.log('\n--- TEST SUITE 13: GURU VANDANA HIERARCHY, DONOR BOARD & PROFILE DELETION RBAC ---');

// 1. Key Leadership in Notable Alumni (Vivek Tiwari, Alok Dubey, Ratnesh Tiwari, Utkrisht Pandey)
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Vivek Tiwari')), 'Notable Alumni includes Sh. Vivek Tiwari');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Alok Dubey')), 'Notable Alumni includes Alok Dubey, IAS');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Ratnesh Tiwari')), 'Notable Alumni includes Dr. Ratnesh Tiwari');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name.includes('Utkrisht Pandey')), 'Notable Alumni includes Sh. Utkrisht Pandey');

// Batch and Profile Verifications
assert(NOTABLE_ALUMNI_LIST.find(a => a.name === 'Virika Solanki').batch === '2009', 'Virika Solanki batch verified as 2009');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Utkrisht Pandey')).batch.includes('1999') || NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Utkrisht Pandey')).batch === '2002', 'Utkrisht Pandey batch verified');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Alok Singh')).batch === '1995', 'Alok Singh batch verified as 1995');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name === 'Yasir Abdul' && a.batch === '1995' && a.link.includes('yasir-abdul-66258828')), 'Yasir Abdul Batch of 1995 added to Notable Alumni');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Ratnesh Tiwari')).link === 'https://koshishindia.in/founders-thought/', 'Ratnesh Tiwari profile link verified as koshishindia.in/founders-thought/');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Ashwini Mishra')).intro.includes('**Be grounded..Be Honest..**'), 'Ashwini Mishra quote contains bold Be grounded..Be Honest..');

// Logged-in User Profile Edit Feature
assert(typeof openEditProfileModal === 'function' && typeof handleProfileUpdate === 'function', 'Self-service Profile Edit engine exported');
assert(indexHtml.includes('editProfileModal') && indexHtml.includes('btnEditProfile'), 'index.html contains editProfileModal and btnEditProfile');
assert(indexHtml.includes('Meet Memories & Gallery'), 'Meet Memories and Gallery unified into single tab');

// 2. Added Notable Alumni Profiles
const alokSingh = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Alok Singh'));
assert(alokSingh && alokSingh.link && alokSingh.link.includes('aloksinghanalytics'), 'Alok Singh profile added to Notable Alumni');
const manishTiwari = NOTABLE_ALUMNI_LIST.find(a => a.name === 'Manish Tiwari');
assert(manishTiwari && manishTiwari.batch === '2004' && manishTiwari.link.includes('manish-tiwari-37845514'), 'Manish Tiwari (Batch 2004) added to Notable Alumni');

// 3. Guru Vandana: Late Dr. S. P. Singh & Late Dr. Preetam Singh
const lateSPS = AppState.teachers.find(t => t.name.includes('S. P. Singh') || t.name.includes('S.P. Singh'));
assert(lateSPS && lateSPS.isDeceased === true, 'Late Dr. S. P. Singh exists with isDeceased true');
const latePS = AppState.teachers.find(t => t.name.includes('Preetam Singh') || t.name.includes('Pritam Singh'));
assert(latePS && latePS.isDeceased === true, 'Late Dr. Preetam Singh exists with isDeceased true');
assert(typeof openTeacherTributeModal === 'function', 'openTeacherTributeModal function exists');
assert(typeof submitTeacherTribute === 'function', 'submitTeacherTribute function exists');
assert(indexHtml.includes('teacherTributeModal'), 'index.html contains teacherTributeModal for floral homage');

// 4. Guru Vandana Hierarchy on Home Page in index.html
const spsIdx = indexHtml.indexOf('Late Dr. S. P. Singh');
const psIdx = indexHtml.indexOf('Late Dr. Preetam Singh');
const pksIdx = indexHtml.indexOf('Mr. P. K. Singh');
const nntIdx = indexHtml.indexOf('Mr. N. N. Tripathi');
assert(spsIdx !== -1 && psIdx !== -1 && pksIdx !== -1 && nntIdx !== -1, 'All 4 Guru Vandana apex Gurujan present in index.html');
assert(spsIdx < psIdx && psIdx < pksIdx && pksIdx < nntIdx, 'Guru Vandana sequence strictly ordered: Late Dr. S.P. Singh -> Late Dr. Preetam Singh -> Mr. P.K. Singh -> Mr. N.N. Tripathi');

// 5. Donor Board Direct Visibility Without Click
assert(indexHtml.includes('Official Vidyalaya Plaque — Directly Readable'), 'Donor Board is directly readable in index.html without requiring click');
assert(!indexHtml.includes('🔍 Click to View Authentic Plaque in High Resolution'), 'Obstructing click-to-view overlay removed from Donor Board');

// 6. Super Admin & Host Power to Delete Profiles
assert(typeof deleteAlumniProfile === 'function', 'deleteAlumniProfile function exists');

let deleteAlertMsg = '';
const origAlert = global.alert;
global.alert = (msg) => { deleteAlertMsg = msg; };

// Case A: Regular member is denied delete permission
const memberUser = getAllUsers().find(u => u.role === 'member');
setCurrentUser(memberUser, true);
deleteAlumniProfile('Deepak Tiwari');
assert(deleteAlertMsg.includes('Permission Denied'), 'Security Guard: Regular member cannot delete directory profiles');

// Case B: Super Admin logged in, attempting to delete permanent Super Admin profile
setCurrentUser(ashfaqLogin.user, true);
deleteAlertMsg = '';
deleteAlumniProfile('Ashfaque Ahmad');
assert(deleteAlertMsg.includes('Protected Account'), 'Security Guard: Permanent Super Admin Ashfaque Ahmad cannot be deleted');

// Case C: Host logged in, attempting to delete Super Admin or another Host
const hostUser = getAllUsers().find(u => u.role === 'host');
setCurrentUser(hostUser, true);
deleteAlertMsg = '';
deleteAlumniProfile('Ashfaque Ahmad');
assert(deleteAlertMsg.includes('Protected Account') || deleteAlertMsg.includes('Permission Denied'), 'Security Guard: Host cannot delete Super Admin profile');

// Case D: Super Admin successfully deletes a test profile
setCurrentUser(ashfaqLogin.user, true);
AppState.directory.push({ name: 'DeleteMe Profile', batch: 2020, house: 'Nilgiri' });
deleteAlumniProfile('DeleteMe Profile');
assert(!AppState.directory.some(d => d.name === 'DeleteMe Profile'), 'Super Admin successfully deleted directory profile');

global.alert = origAlert;

// ----------------------------------------------------
// TEST SUITE 14: PROFILE PICTURE EDITING, PREVIEW & PERSISTENCE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 14: PROFILE PICTURE EDITING, PREVIEW & PERSISTENCE ---');
const mIndexHtml = fs.readFileSync(path.join(__dirname, '../mobile_app/index.html'), 'utf8');

// 1. Web Edit Profile Picture Controls
assert(indexHtml.includes('id="editProfilePhotoFile"'), 'index.html contains file upload input for profile photo');
assert(indexHtml.includes('id="editProfilePhotoUrl"'), 'index.html contains URL input for profile photo');
assert(indexHtml.includes('id="editProfileAvatarPreview"'), 'index.html contains live avatar preview image');
assert(indexHtml.includes('onclick="removeProfilePhoto()"'), 'index.html contains remove profile photo button');

// 2. JavaScript Photo Handlers
assert(typeof previewProfilePhotoUpload === 'function', 'previewProfilePhotoUpload handler function exported');
assert(typeof previewProfilePhotoUrl === 'function', 'previewProfilePhotoUrl handler function exported');
assert(typeof removeProfilePhoto === 'function', 'removeProfilePhoto handler function exported');
assert(typeof setProfileAvatarPreview === 'function', 'setProfileAvatarPreview handler function exported');

// 3. Mobile App Profile Picture Controls
assert(mIndexHtml.includes('id="mEditPhotoFile"'), 'mobile_app/index.html contains file upload input');
assert(mIndexHtml.includes('id="mEditPhotoUrl"'), 'mobile_app/index.html contains URL input');
assert(mIndexHtml.includes('id="mEditAvatarPreview"'), 'mobile_app/index.html contains mobile avatar preview');
assert(mIndexHtml.includes('function previewMobilePhotoUpload'), 'mobile_app/index.html defines previewMobilePhotoUpload');
assert(mIndexHtml.includes('function removeMobileProfilePhoto'), 'mobile_app/index.html defines removeMobileProfilePhoto');

// 4. Persistence verification: update photo via mock
global.alert = () => {};
setCurrentUser(ashfaqLogin.user, true);
assert(typeof handleProfileUpdate === 'function', 'handleProfileUpdate function exists');

// Set form input element values in mock DOM
document.getElementById('editProfileName').value = 'Ashfaque Ahmad';
document.getElementById('editProfilePhone').value = '+91 9876543210';
document.getElementById('editProfileCity').value = 'Bangalore';
document.getElementById('editProfileProfession').value = 'Principal Software Architect';
document.getElementById('editProfileDomain').value = 'Technology';
document.getElementById('editProfileHouse').value = 'Nilgiri';
document.getElementById('editProfileBio').value = 'Passionate about distributed systems & AI.';

// Simulate photo update
const testPhotoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
previewProfilePhotoUrl(testPhotoData);

// Mock form submission event
const mockEvt = {
  preventDefault: () => {}
};

handleProfileUpdate(mockEvt);
const updatedUser = getCurrentUser();
assert(updatedUser.photo === testPhotoData, 'handleProfileUpdate saved photo data to current user session');
assert(updatedUser.avatarImage === testPhotoData, 'handleProfileUpdate saved avatarImage to current user session');
const updatedDirectoryEntry = AppState.directory.find(d => d.email === ashfaqLogin.user.email);
assert(updatedDirectoryEntry && updatedDirectoryEntry.photo === testPhotoData, 'handleProfileUpdate saved photo to directory entry');

// Verify remove photo
removeProfilePhoto();
document.getElementById('editProfileBio').value = 'Updated bio after photo reset';
handleProfileUpdate(mockEvt);
const userAfterRemoval = getCurrentUser();
assert(!userAfterRemoval.photo, 'removeProfilePhoto successfully reset photo to null on profile update');

// ----------------------------------------------------
// TEST SUITE 15: MOBILE APP FULL-FEATURED FIDELITY & ZERO OBSOLETE RECORDS
// ----------------------------------------------------
console.log('\n--- TEST SUITE 15: MOBILE APP FULL-FEATURED FIDELITY & ZERO OBSOLETE RECORDS ---');

// 1. Elimination of outdated records
assert(!mIndexHtml.includes('Welcome, Dr. Amitabh Singh'), 'Eliminated hardcoded Dr. Amitabh Singh greeting from mobile app');
assert(!mIndexHtml.includes('Batch 1998</span>\n        </div>\n        <h2'), 'Eliminated hardcoded Batch 1998 banner from mobile app');
assert(!mIndexHtml.includes('../assets'), 'Eliminated broken ../assets relative paths from mobile app');

// 2. Full-featured parity & new sections
assert(mIndexHtml.includes('id="mTab-notable"'), 'mobile_app/index.html includes complete Notable Alumni Hall of Fame tab');
assert(mIndexHtml.includes('data-tab="notable"'), 'mobile_app/index.html includes Notable Alumni button in native bottom navigation bar');
assert(mIndexHtml.includes('id="mThemeToggleBtn"'), 'mobile_app/index.html includes Dual-Theme switcher (Sky Mode vs Dark Navy)');
assert(mIndexHtml.includes('assets/images/donors-board.jpg'), 'mobile_app/index.html includes Vidyalaya Donor Board plaque');
assert(mIndexHtml.includes('assets/images/alumni-meet-2026.png'), 'mobile_app/index.html includes 4th Annual Meet invitation poster');

// 3. Revered Gurujan & Floral Homage
assert(mIndexHtml.includes('Late Dr. S. P. Singh') && mIndexHtml.includes('Late Dr. Preetam Singh'), 'mobile_app/index.html contains Late Dr. S.P. Singh and Late Dr. Preetam Singh');
assert(mIndexHtml.includes('mTeacherTributeModal'), 'mobile_app/index.html contains floral homage tribute modal (पुष्पांजलि)');

// 4. Key Guidance Sequence & Quotes
assert(mIndexHtml.includes('NOTABLE_GUIDANCE_LIST'), 'mobile_app/index.html defines NOTABLE_GUIDANCE_LIST with 8 leaders');
assert(mIndexHtml.includes('**Be grounded..Be Honest..**'), 'mobile_app/index.html includes Ashwini Mishra bold phrase');

// 5. Packaged Assets Directory
assert(fs.existsSync(path.join(rootDir, 'mobile_app', 'assets', 'images', 'donors-board.jpg')), 'mobile_app/assets contains donors-board.jpg');
assert(fs.existsSync(path.join(rootDir, 'mobile_app', 'assets', 'images', 'alumni-meet-2026.png')), 'mobile_app/assets contains alumni-meet-2026.png');



// ----------------------------------------------------
// TEST SUMMARY

// ----------------------------------------------------
// TEST SUITE 16: FULL MOBILE & WEB APP SYNC, 10 TABS PARITY & DIGNITY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 16: FULL MOBILE & WEB APP SYNC, 10 TABS PARITY & DIGNITY ---');

const mHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
const wHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const rootAppJs = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'app.js'), 'utf8');
const mobAppJs = fs.readFileSync(path.join(rootDir, 'mobile_app', 'assets', 'js', 'app.js'), 'utf8');

// 1. Full 10 Tabs Parity across Web and Mobile App
const expectedTabs = ['tab-home', 'tab-meet', 'tab-teachers', 'tab-donate', 'tab-helpdesk', 'tab-feed', 'tab-directory', 'tab-notable', 'tab-gallery', 'tab-admin'];
expectedTabs.forEach(tId => {
  assert(wHtml.includes(`id="${tId}"`), `index.html includes full-fledged section ${tId}`);
  assert(mHtml.includes(`id="${tId}"`), `mobile_app/index.html includes full-fledged section ${tId}`);
});

// 2. Elimination of Old Records
assert(!mHtml.includes('30th December') && !mHtml.includes('30 December'), 'mobile_app/index.html has no obsolete 30th December date');
assert(!wHtml.includes('30th December') && !wHtml.includes('30 December'), 'index.html has no obsolete 30th December date');
assert(!mHtml.includes('Tagore / Subhash') && !mHtml.includes('Ashoka / Patel'), 'mobile_app eliminated outdated corrupted house mappings');
assert(mHtml.includes('Aravali') && mHtml.includes('Shivalik') && mHtml.includes('Udaigiri') && mHtml.includes('Nilgiri'), 'mobile_app contains verified 4 houses');

// 3. Home Page Full-Fledged Content Parity
assert(mHtml.includes('Google Form') || mHtml.includes('1FAIpQLScM31QFqQdBlDvFzlsLzJm7FHglEtb0qc4oyi8Hd7ftpwkACA'), 'mobile_app home contains 4th Meet Google Form registration link');
assert(mHtml.includes('चतुर्थ वार्षिक सम्मेलन का आह्वान: 1996 बैच की ओर से सादर आमंत्रण'), 'mobile_app home contains 1996 Host Batch Appeal');
assert(mHtml.includes('donors-board.jpg') && mHtml.includes('125 KVA'), 'mobile_app home contains authentic Vidyalaya Donors Board & generator grant');
assert(mHtml.includes('campus-main-building.png'), 'mobile_app home contains campus building photography');

// 4. Memory Wall vs Meet Memories & Gallery Separation
assert(wHtml.includes('id="tab-feed"') && wHtml.includes('id="tab-gallery"'), 'Web app separates Memory Wall (tab-feed) from Gallery (tab-gallery)');
assert(mHtml.includes('id="tab-feed"') && mHtml.includes('id="tab-gallery"'), 'Mobile app separates Memory Wall (tab-feed) from Gallery (tab-gallery)');
assert(!rootAppJs.includes("tabId === 'feed') tabId = 'gallery'"), 'switchTab does not collapse feed into gallery');

// 5. Dignity: Respect Phrasing & Zero Disrespect
assert(!rootAppJs.includes('0 Respects') && !rootAppJs.includes('0 चरण स्पर्श'), 'app.js does not display disrespectful 0 respects count');
assert(rootAppJs.includes('सादर प्रणाम') || rootAppJs.includes('सम्मान संदेश'), 'app.js uses dignified Saadar Pranaam respectful phrasing');

// 6. Mobile Assets Direct Synchronization
assert(rootAppJs === mobAppJs, 'mobile_app/assets/js/app.js is 100% synchronized with root assets/js/app.js');
assert(mHtml.includes('id="mobileBottomNav"'), 'mobile_app includes sticky bottom navigation bar');
assert(mHtml.includes('id="mobileMoreSheet"'), 'mobile_app includes native More Drawer Sheet for 1-touch navigation');
assert(mHtml.includes('window.Capacitor'), 'mobile_app includes native Capacitor Android / iOS bridge integration');


// ----------------------------------------------------
// TEST SUITE 17: GUEST RBAC, EXCEL REGISTRY & MEMORY WALL BANNER
// ----------------------------------------------------
console.log('\n--- TEST SUITE 17: GUEST RBAC, EXCEL REGISTRY & MEMORY WALL BANNER ---');

// 1. Concealment of Super Admin Identity
const ashfaqDir = defaultDirectoryAlumni.find(a => a.name === 'Ashfaque Ahmad' || a.name === 'Ashfaq Ahmed');
assert(ashfaqDir && ashfaqDir.tag !== 'Super Admin', 'Ashfaq public directory tag is not Super Admin (is Software Architect)');
assert(!wHtml.includes('Super Admin • \'05'), 'index.html does not expose Super Admin in public batch pill');
assert(!mHtml.includes('Super Admin • \'05'), 'mobile_app does not expose Super Admin in public batch pill');
const ashfaqNotable = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Ashfaque'));
assert(!ashfaqNotable, 'Notable alumni list conceals Super Admin title and identity');

// 2. Memory Wall Office Gate Banner & Social Composer
assert(wHtml.includes('assets/images/office-gate.png'), 'index.html Memory Wall contains official Office Gate banner');
assert(mHtml.includes('assets/images/office-gate.png'), 'mobile_app Memory Wall contains official Office Gate banner');
assert(wHtml.includes('Live Social Broadcast Composer'), 'index.html Memory Wall includes social composer box');
assert(!wHtml.includes('<section id="tab-feed"[\s\S]*?meet2025-1\.jpg'), 'Memory Wall does not contain 2025 gallery grid');

// 3. Unified Excel Directory & Two-Way Deduplication Engine
assert(typeof upsertAlumniRecord === 'function', 'upsertAlumniRecord two-way deduplication engine is exported');
const initialDirCount = AppState.directory.length;
const testDup = upsertAlumniRecord({
  name: 'Ashwini Mishra',
  batch: 1993,
  email: 'ashwinimishra99@gmail.com',
  profession: 'Senior Journalist, Executive Producer DD News',
  location: 'New Delhi'
});
assert(testDup.isNew === false, 'Two-Way Deduplication Engine correctly matched existing alumni and updated without duplication');
assert(AppState.directory.length === initialDirCount, 'Directory total count preserved without duplicate inflation');

// 4. Guest User RBAC Protection
// Simulate unauthenticated guest access to Directory
setCurrentUser(null, false);
getOrCreate('directoryGrid').innerHTML = '';
renderDirectory();
assert(getOrCreate('directoryGrid').innerHTML.includes('Alumni Directory is Protected'), 'Guest user is blocked from viewing Alumni Directory');

// Restore Super Admin session
setCurrentUser(ashfaqLogin.user, true);
getOrCreate('directoryGrid').innerHTML = '';
renderDirectory();
assert(!getOrCreate('directoryGrid').innerHTML.includes('Alumni Directory is Protected'), 'Authenticated member can view Alumni Directory');

// ----------------------------------------------------

// ----------------------------------------------------
// TEST SUITE 18: VERSION 0.0.1 & MEMORY WALL BANNER CONTRAST INTEGRITY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 18: VERSION 0.0.1 & MEMORY WALL BANNER CONTRAST INTEGRITY ---');

// 1. Initial Release Version v0.0.1 Verification
const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
assert(pkgJson.version === '0.0.1', 'package.json version is strictly 0.0.1');

const mobileIndexHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
assert(mobileIndexHtml.includes('Site Version: v0.0.1'), 'mobile_app/index.html footer contains Site Version: v0.0.1');
assert(mobileIndexHtml.includes('Current build: <span class="font-mono text-emerald-400 font-semibold">v0.0.1</span>'), 'mobile_app/index.html contains Current build: v0.0.1');

const infoPlist = fs.readFileSync(path.join(rootDir, 'mobile_app', 'ios', 'Info.plist'), 'utf8');
assert(infoPlist.includes('<string>0.0.1</string>'), 'mobile_app/ios/Info.plist CFBundleShortVersionString is strictly 0.0.1');

// 2. Memory Wall & Community Broadcast Banner Legibility & Contrast
assert(indexHtml.includes('memory-wall-banner-card'), 'index.html contains memory-wall-banner-card high-contrast container');
assert(mobileIndexHtml.includes('memory-wall-banner-card'), 'mobile_app/index.html contains memory-wall-banner-card high-contrast container');
assert(indexHtml.includes('-webkit-text-fill-color: #ffffff !important;'), 'index.html specifies explicit -webkit-text-fill-color: #ffffff !important on banner title');
assert(mobileIndexHtml.includes('-webkit-text-fill-color: #ffffff !important;'), 'mobile_app/index.html specifies explicit -webkit-text-fill-color: #ffffff !important on banner title');

const rootStylesCss = fs.readFileSync(path.join(rootDir, 'assets', 'css', 'styles.css'), 'utf8');
const mobileStylesCss = fs.readFileSync(path.join(rootDir, 'mobile_app', 'assets', 'css', 'styles.css'), 'utf8');
assert(rootStylesCss.includes('.memory-banner-text') && rootStylesCss.includes('-webkit-text-fill-color: #ffffff !important;'), 'assets/css/styles.css enforces white text-fill on memory banner text');
assert(mobileStylesCss.includes('.memory-banner-text') && mobileStylesCss.includes('-webkit-text-fill-color: #ffffff !important;'), 'mobile_app/assets/css/styles.css enforces white text-fill on memory banner text');
assert(rootStylesCss.includes('.memory-wall-banner-card'), 'assets/css/styles.css defines dedicated .memory-wall-banner-card styling');

// ----------------------------------------------------
// TEST SUITE 19: GOOGLE PLAY STORE COMPLIANCE & PRIVACY POLICY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 19: GOOGLE PLAY STORE COMPLIANCE & PRIVACY POLICY ---');

assert(fs.existsSync(path.join(rootDir, 'privacy.html')), 'privacy.html exists in root directory');
const privacyHtml = fs.readFileSync(path.join(rootDir, 'privacy.html'), 'utf8');
assert(privacyHtml.includes('Privacy Policy') && privacyHtml.includes('jnvgfamily.in'), 'privacy.html contains valid policy content for jnvgfamily.in');
assert(privacyHtml.includes('ashfaque15tr@gmail.com'), 'privacy.html includes mandatory grievance officer / deletion contact');
assert(privacyHtml.includes('Data Deletion & Account Erasure Requests'), 'privacy.html complies with Google Play Account Deletion requirements');

const refreshedIndexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(refreshedIndexHtml.includes('href="privacy.html"'), 'index.html footer links to privacy.html');

const refreshedMobileIndexHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
assert(refreshedMobileIndexHtml.includes('href="privacy.html"'), 'mobile_app/index.html footer links to privacy.html');

assert(fs.existsSync(path.join(rootDir, 'play_store_assets', 'icon-512x512.png')), 'Google Play Store 512x512 icon exists');
assert(fs.existsSync(path.join(rootDir, 'play_store_assets', 'feature-graphic-1024x500.png')), 'Google Play Store 1024x500 feature graphic exists');
assert(fs.existsSync(path.join(rootDir, 'play_store_assets', 'store_listing_metadata.txt')), 'Google Play Store listing metadata exists');
assert(fs.existsSync(path.join(rootDir, 'android', 'app', 'release.keystore')), 'Android production release.keystore exists');

// ----------------------------------------------------
// TEST SUITE 20: ALUMNI DIRECTORY HOUSE FILTER ACCURACY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 20: ALUMNI DIRECTORY HOUSE FILTER ACCURACY ---');

const latestIndexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const latestMobileHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');

assert(latestIndexHtml.includes('<option value="Aravali">Aravali</option>'), 'index.html dirHouseFilter contains Aravali');
assert(latestIndexHtml.includes('<option value="Nilgiri">Nilgiri</option>'), 'index.html dirHouseFilter contains Nilgiri');
assert(latestIndexHtml.includes('<option value="Shivalik">Shivalik</option>'), 'index.html dirHouseFilter contains Shivalik');
assert(latestIndexHtml.includes('<option value="Udaigiri">Udaigiri</option>'), 'index.html dirHouseFilter contains Udaigiri');

assert(!latestIndexHtml.includes('<option value="Arawali">Arawali</option>'), 'index.html dirHouseFilter eliminated Arawali in favor of Aravali');
assert(!latestIndexHtml.includes('<option value="Neelgiri">Neelgiri</option>'), 'index.html dirHouseFilter eliminated incorrect Neelgiri');
assert(!latestIndexHtml.includes('<option value="Udaygiri">Udaygiri</option>'), 'index.html dirHouseFilter eliminated incorrect Udaygiri');

assert(latestMobileHtml.includes('<option value="Aravali">Aravali</option>'), 'mobile_app dirHouseFilter contains Aravali');
assert(latestMobileHtml.includes('<option value="Nilgiri">Nilgiri</option>'), 'mobile_app dirHouseFilter contains Nilgiri');
assert(latestMobileHtml.includes('<option value="Shivalik">Shivalik</option>'), 'mobile_app dirHouseFilter contains Shivalik');
assert(latestMobileHtml.includes('<option value="Udaigiri">Udaigiri</option>'), 'mobile_app dirHouseFilter contains Udaigiri');

// Functional testing of StorageEngine queryDirectory with the 4 houses
const storageEngineCode = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'storage-engine.js'), 'utf8');
assert(storageEngineCode.includes('normalizeHouse'), 'storage-engine.js implements normalizeHouse matching logic');

// Batch filter options verification (all batches 1993 - 2026 including 2003)
assert(latestIndexHtml.includes('<option value="2003">2003</option>'), 'index.html dirBatchFilter contains Batch 2003');
assert(latestIndexHtml.includes('<option value="1993">1993 (First Batch)</option>'), 'index.html dirBatchFilter contains Batch 1993');
assert(latestIndexHtml.includes('<option value="2026">2026</option>'), 'index.html dirBatchFilter contains Batch 2026');
assert(latestMobileHtml.includes('<option value="2003">2003</option>'), 'mobile_app dirBatchFilter contains Batch 2003');
const appJsCode = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'app.js'), 'utf8');
assert(appJsCode.includes('populateBatchFilterOptions'), 'app.js defines populateBatchFilterOptions');

// ----------------------------------------------------
// TEST SUITE 21: DIRECTORY SMART MATCH & PROFILE CLAIM ENGINE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 21: DIRECTORY SMART MATCH & PROFILE CLAIM ENGINE ---');

assert(typeof findDirectoryMatch === 'function', 'findDirectoryMatch is exported as a function');
assert(typeof cleanName === 'function', 'cleanName is exported as a function');
assert(typeof cleanPhone === 'function', 'cleanPhone is exported as a function');

// Test cleanName honorific and title stripping
assert(cleanName('Sh. Manish Rana') === cleanName('Manish Rana'), 'cleanName strips Sh. prefix correctly');
assert(cleanName('Dr. Ratnesh Tiwari') === 'ratnesh tiwari', 'cleanName strips Dr. prefix correctly');
assert(cleanName('Col. Virendra Kumar Pandey') === 'virendra kumar pandey', 'cleanName strips Col. prefix correctly');
assert(cleanName('Alok Dubey, IAS') === 'alok dubey', 'cleanName strips IAS suffix and punctuation correctly');
assert(cleanName('Sh. Prabhat (PPS)') === 'prabhat', 'cleanName strips parentheses and PPS designation');

// Tier 1 Exact Phone & Email Matching
const matchPhone = findDirectoryMatch({ phone: '8317024401' });
assert(matchPhone.matched && matchPhone.tier === 1 && matchPhone.record && matchPhone.record.id === 'alumni-83', 'Tier 1: Phone match finds Manish Rana (alumni-83)');

const matchEmail = findDirectoryMatch({ email: 'manishranabhulaw@gmail.com' });
assert(matchEmail.matched && matchEmail.tier === 1 && matchEmail.record && matchEmail.record.id === 'alumni-83', 'Tier 1: Email match finds Manish Rana (alumni-83)');

// Tier 2 Triangulation Matching (Name + Passout Batch)
const matchNameBatch = findDirectoryMatch({ name: 'Sh. Manish Rana', batch: 2007 });
assert(matchNameBatch.matched && matchNameBatch.tier === 2 && matchNameBatch.confidence === 95 && matchNameBatch.record.id === 'alumni-83', 'Tier 2: Name + Batch 2007 triangulates Manish Rana');

const matchPrabhat = findDirectoryMatch({ name: 'Prabhat', batch: 2002 });
assert(matchPrabhat.matched && matchPrabhat.tier === 2 && matchPrabhat.record && (matchPrabhat.record.name.includes('Prabhat')), 'Tier 2: Name + Batch 2002 triangulates Sh. Prabhat (PPS)');

// Tier 3 Legacy Match (Name + House)
const matchNameHouse = findDirectoryMatch({ name: 'Manish Rana', house: 'Udaigiri' });
assert(matchNameHouse.matched && matchNameHouse.tier === 3 && matchNameHouse.confidence === 85 && matchNameHouse.record.id === 'alumni-83', 'Tier 3: Name + House Udaigiri matches Manish Rana');

// Tier 4 Anti-Takeover Safeguard
// Ashfaque Ahmad is an active approved administrator
const matchAshfaq = findDirectoryMatch({ email: 'ashfaque15tr@gmail.com' });
assert(matchAshfaq.matched && matchAshfaq.isAlreadyClaimed === true, 'Anti-Takeover Safeguard: Approved member returns isAlreadyClaimed: true');

const currentUsersList = getAllUsers();
const ashfaqUser = currentUsersList.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com');
if (ashfaqUser) {
  ashfaqUser.claimedDirectoryId = 'dir-ashfaque-ahmad';
  saveAllUsers(currentUsersList);
}
const blockedClaim = validateRegistrationData({
  name: 'Ashfaque Ahmad Impersonator',
  batch: 2005,
  house: 'Nilgiri',
  email: 'fake.ashfaq@example.com',
  phone: '9988776655',
  password: 'password123',
  claimedDirectoryId: 'dir-ashfaque-ahmad'
});
assert(!blockedClaim.valid && blockedClaim.message.includes('already been claimed'), 'Anti-Takeover Safeguard blocks re-registration of claimed profile');

// In-Place Directory Profile Claim & Enrichment
const dirCountBeforeClaim = AppState.directory.length;
const testClaimRes = registerAlumni({
  claimedDirectoryId: 'alumni-83',
  name: 'Sh. Manish Rana',
  batch: 2007,
  house: 'Udaigiri',
  profession: 'Judicial Magistrate / Civil Judge, U.P. Judiciary',
  city: 'Budaun, UP',
  domain: 'Govt / PSU',
  photo: 'data:image/jpeg;base64,TEST_ENRICHED_PHOTO_DATA',
  phone: '8317024401',
  email: 'test.manish.claim@example.com',
  password: 'password123'
});

assert(testClaimRes.success && testClaimRes.claimedDirectoryId === 'alumni-83', 'Profile claim registration succeeded with claimedDirectoryId');
const mrDirRecord = AppState.directory.find(d => String(d.id) === 'alumni-83');
assert(mrDirRecord && mrDirRecord.photo === 'data:image/jpeg;base64,TEST_ENRICHED_PHOTO_DATA', 'In-place enrichment updated directory photo directly');
assert(mrDirRecord && mrDirRecord.role === 'Judicial Magistrate / Civil Judge, U.P. Judiciary', 'In-place enrichment updated directory role');

// Admin Approval does NOT duplicate the record
const pendingItem = AppState.pendingRegistrations.find(p => p.claimedDirectoryId === 'alumni-83');
assert(pendingItem && pendingItem.isClaimedProfile === true, 'Pending registration tagged with isClaimedProfile');
approveRegistration(pendingItem.id);
assert(AppState.directory.length === dirCountBeforeClaim, 'Directory total record count strictly preserved (no duplicate inflation)');
assert(AppState.directory.filter(d => String(d.id) === 'alumni-83').length === 1, 'Directory contains exactly one unified record for alumni-83');

// UI DOM Integration Assertions
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const loginHtmlContent = fs.readFileSync(path.join(rootDir, 'login.html'), 'utf8');
const mobIndexHtmlContent = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
const mobLoginHtmlContent = fs.readFileSync(path.join(rootDir, 'mobile_app', 'login.html'), 'utf8');

assert(indexHtmlContent.includes('id="modalRegMatchNotice"'), 'index.html contains modalRegMatchNotice');
assert(indexHtmlContent.includes('id="modalRegClaimedNotice"'), 'index.html contains modalRegClaimedNotice');
assert(indexHtmlContent.includes('id="claimedDirectoryId"'), 'index.html contains claimedDirectoryId input');
assert(indexHtmlContent.includes('id="modalRegPhotoInput"'), 'index.html contains modalRegPhotoInput');

assert(loginHtmlContent.includes('id="regMatchNotice"'), 'login.html contains regMatchNotice');
assert(loginHtmlContent.includes('id="regClaimedNotice"'), 'login.html contains regClaimedNotice');
assert(loginHtmlContent.includes('id="claimedDirectoryId"'), 'login.html contains claimedDirectoryId input');
assert(loginHtmlContent.includes('id="regPhotoInput"'), 'login.html contains regPhotoInput');

assert(mobIndexHtmlContent.includes('id="modalRegMatchNotice"'), 'mobile_app/index.html contains modalRegMatchNotice');
assert(mobLoginHtmlContent.includes('id="regMatchNotice"'), 'mobile_app/login.html contains regMatchNotice');

// ----------------------------------------------------
// TEST SUITE 22: GURUJAN / FACULTY SMART MATCH & PROFILE CLAIM ENGINE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 22: GURUJAN / FACULTY SMART MATCH & PROFILE CLAIM ENGINE ---');

// 1. Export Checks
assert(typeof findTeacherMatch === 'function', 'findTeacherMatch is exported as a function');
assert(typeof getTeacherRecords === 'function', 'getTeacherRecords is exported as a function');
const teacherRecords = getTeacherRecords();
assert(Array.isArray(teacherRecords) && teacherRecords.length === 14, `Faculty roster has exactly 14 verified Gurujan entries (found ${teacherRecords.length})`);

// 2. Exact & Canonical Name Matching for Living Faculty
const skcMatch = findTeacherMatch({ name: 'Dr. S. K. Chaudhary' });
assert(skcMatch.matched && skcMatch.record && skcMatch.record.id === 'tch-1', 'Name match finds Dr. S. K. Chaudhary (tch-1)');

const lsyMatch = findTeacherMatch({ name: 'Sh. L. S. Yadav' });
assert(lsyMatch.matched && lsyMatch.record && lsyMatch.record.id === 'tch-lsy', 'Name match finds Sh. L. S. Yadav (tch-lsy)');

const varshneyMatch = findTeacherMatch({ name: 'Legendary Varshney Sir' });
assert(varshneyMatch.matched && varshneyMatch.record && varshneyMatch.record.id === 'tch-2', 'Name match finds Legendary Varshney Sir (tch-2)');

const msrMatch = findTeacherMatch({ name: 'Sh. Mahendra Singh Rawat' });
assert(msrMatch.matched && msrMatch.record && msrMatch.record.id === 'tch-3', 'Name match finds Sh. Mahendra Singh Rawat (tch-3)');

const sdMatch = findTeacherMatch({ name: 'Smt. Shakuntala Devi' });
assert(sdMatch.matched && sdMatch.record && sdMatch.record.id === 'tch-4', 'Name match finds Smt. Shakuntala Devi (tch-4)');

// 3. Amar Smriti / In-Memoriam Protection
const spsMatch = findTeacherMatch({ name: 'Late Dr. S. P. Singh' });
assert(spsMatch.matched && spsMatch.isDeceased === true && spsMatch.record.id === 'tch-sps', 'Amar Smriti Protection: Late Dr. S. P. Singh flagged as deceased memorial');

const psMatch = findTeacherMatch({ name: 'Late Dr. Preetam Singh' });
assert(psMatch.matched && psMatch.isDeceased === true && psMatch.record.id === 'tch-ps', 'Amar Smriti Protection: Late Dr. Preetam Singh flagged as deceased memorial');

// 4. Unknown / New Faculty Registration Opportunity
const newFacultyMatch = findTeacherMatch({ name: 'Dr. Anjali Verma' });
assert(!newFacultyMatch.matched, 'Unlisted faculty member (Dr. Anjali Verma) returns matched: false to allow filling from scratch');

// 5. Anti-Takeover Safeguard for Faculty
const allUsersTch = getAllUsers();
const tchUserItem = allUsersTch.find(u => u.claimedTeacherId === 'tch-1' || u.role === 'teacher');
if (tchUserItem) {
  tchUserItem.claimedTeacherId = 'tch-1';
  tchUserItem.status = 'approved';
  saveAllUsers(allUsersTch);
}
const claimedTchMatch = findTeacherMatch({ name: 'Dr. S. K. Chaudhary' });
assert(claimedTchMatch.matched && claimedTchMatch.isAlreadyClaimed === true, 'Anti-Takeover Safeguard: Approved faculty returns isAlreadyClaimed: true');

const blockedTchClaim = validateRegistrationData({
  name: 'Dr. S. K. Chaudhary Impersonator',
  batch: '1989',
  house: 'Aravali',
  email: 'fake.skc@example.com',
  phone: '9988776655',
  password: 'password123',
  isTeacher: true,
  claimedTeacherId: 'tch-1'
});
assert(!blockedTchClaim.valid && blockedTchClaim.message.includes('claimed'), 'validateRegistrationData blocks claim of already claimed faculty profile');

// 6. In-place Gurujan Profile Enrichment
// Ensure login as Super Admin
const superAdminForTch = allUsersTch.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com');
setCurrentUser(superAdminForTch, true);

const initialTeacherCount = AppState.teachers.length;
const testTchClaimRes = registerAlumni({
  claimedTeacherId: 'tch-lsy',
  name: 'Sh. L. S. Yadav',
  batch: '2021',
  tenure: '2021 – Present',
  house: 'Campus',
  profession: 'T.G.T.-English & Chief Editor Navonmesh',
  city: 'JNV Gauriganj Campus',
  domain: 'English Language & Literature',
  photo: 'data:image/jpeg;base64,TEST_ENRICHED_TEACHER_PHOTO',
  phone: '9415001234',
  email: 'lsyadav.test.claim@example.com',
  password: 'password123',
  isTeacher: true,
  message: 'May all Navodaya scholars shine across the universe with flying colours!'
});

assert(testTchClaimRes.success && testTchClaimRes.claimedTeacherId === 'tch-lsy', 'Gurujan profile claim registration succeeded with claimedTeacherId');
const lsyRecord = AppState.teachers.find(t => String(t.id) === 'tch-lsy');
assert(lsyRecord && lsyRecord.photo === 'data:image/jpeg;base64,TEST_ENRICHED_TEACHER_PHOTO', 'In-place enrichment updated teacher photo in AppState.teachers');
assert(lsyRecord && lsyRecord.message.includes('May all Navodaya scholars shine'), 'In-place enrichment updated teacher Guru Sandesh message');

// 7. Admin Approval of Claimed Faculty
const pendingTchItem = AppState.pendingRegistrations.find(p => p.claimedTeacherId === 'tch-lsy');
assert(pendingTchItem && pendingTchItem.isClaimedProfile === true, 'Pending faculty registration tagged with isClaimedProfile');
approveRegistration(pendingTchItem.id);
assert(AppState.teachers.length === initialTeacherCount, 'Gurujan roster count strictly preserved without duplicate inflation on approval');
assert(AppState.teachers.filter(t => String(t.id) === 'tch-lsy').length === 1, 'Gurujan roster contains exactly one unified card for tch-lsy');

// 8. New Faculty Registration & Approval (Opportunity to write new profile)
const newTchRegRes = registerAlumni({
  name: 'Dr. Anjali Verma',
  batch: '2024',
  tenure: '2024 – Present',
  house: 'Campus',
  profession: 'PGT Biology & Eco Club Mentor',
  city: 'Gauriganj Campus',
  domain: 'Life Sciences',
  photo: 'data:image/jpeg;base64,ANJALI_PHOTO',
  phone: '9876543219',
  email: 'anjali.verma@example.com',
  password: 'password123',
  isTeacher: true,
  message: 'Dedicated to cultivating scientific inquiry and moral integrity in our students.'
});
assert(newTchRegRes.success, 'New faculty member registered successfully from scratch');
const pendingNewTch = AppState.pendingRegistrations.find(p => p.email === 'anjali.verma@example.com');
assert(pendingNewTch && pendingNewTch.isTeacher === true, 'Pending registration correctly recorded as isTeacher: true');
approveRegistration(pendingNewTch.id);
assert(AppState.teachers.length === initialTeacherCount + 1, 'New faculty profile activated and unshifted into AppState.teachers (count incremented by 1)');
const createdTch = AppState.teachers.find(t => t.name === 'Dr. Anjali Verma');
assert(createdTch && createdTch.post === 'PGT Biology & Eco Club Mentor', 'Created teacher record contains correct post');

const updatedUsersList22 = getAllUsers();
const anjaliUser = updatedUsersList22.find(u => u.email === 'anjali.verma@example.com');
assert(anjaliUser && anjaliUser.status === 'approved' && anjaliUser.role === 'teacher' && anjaliUser.roleTitle === 'Revered Faculty Member', 'Approved faculty user activated with teacher role and Revered Faculty Member title');

// 9. UI Integration Assertions for Teachers
assert(indexHtmlContent.includes('id="modalRegTypeTeacherBtn"'), 'index.html contains modalRegTypeTeacherBtn');
assert(indexHtmlContent.includes('id="modalRegGuruMessageGroup"'), 'index.html contains modalRegGuruMessageGroup');
assert(indexHtmlContent.includes('id="claimedTeacherId"'), 'index.html contains claimedTeacherId input');

assert(loginHtmlContent.includes('id="regTypeTeacherBtn"'), 'login.html contains regTypeTeacherBtn');
assert(loginHtmlContent.includes('id="regGuruMessageGroup"'), 'login.html contains regGuruMessageGroup');
assert(loginHtmlContent.includes('id="claimedTeacherId"'), 'login.html contains claimedTeacherId input');

assert(mobIndexHtmlContent.includes('id="modalRegTypeTeacherBtn"'), 'mobile_app/index.html contains modalRegTypeTeacherBtn');
assert(mobIndexHtmlContent.includes('id="modalRegGuruMessageGroup"'), 'mobile_app/index.html contains modalRegGuruMessageGroup');
assert(mobIndexHtmlContent.includes('id="claimedTeacherId"'), 'mobile_app/index.html contains claimedTeacherId input');

assert(mobLoginHtmlContent.includes('id="regTypeTeacherBtn"'), 'mobile_app/login.html contains regTypeTeacherBtn');
assert(mobLoginHtmlContent.includes('id="regGuruMessageGroup"'), 'mobile_app/login.html contains regGuruMessageGroup');
assert(mobLoginHtmlContent.includes('id="claimedTeacherId"'), 'mobile_app/login.html contains claimedTeacherId input');


// ----------------------------------------------------
// TEST SUITE 23: GURUJAN ROSTER ACCURACY, NOTABLE CIVIL LEADERSHIP & AUDIT LOG
// ----------------------------------------------------
console.log('\n--- TEST SUITE 23: GURUJAN ROSTER ACCURACY, NOTABLE CIVIL LEADERSHIP & AUDIT LOG ---');

// 1. Sh. Gulab Chand Sonkar (Notable Alumni & Directory)
const gulabNotable = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Gulab Chand Sonkar'));
assert(gulabNotable && gulabNotable.batch === '2002' && gulabNotable.house === 'Shivalik', 'Sh. Gulab Chand Sonkar verified in Notable Alumni (Batch 2002, Shivalik House)');
assert(gulabNotable && gulabNotable.role.includes('Deputy Commissioner'), 'Sh. Gulab Chand Sonkar role is Deputy Commissioner, Prayagraj');

const gulabDir = AppState.directory.find(d => (d.name && d.name.includes('Gulab')) || d.id === 'alumni-112');
assert(gulabDir && gulabDir.batch === 2002 && gulabDir.house === 'Shivalik', 'Alumni-112 updated to Sh. Gulab Chand Sonkar (Batch 2002, Shivalik House)');

// 2. Smt. Arpana Yadav (Photo & Tenure 1995-2016)
const arpanaTch = AppState.teachers.find(t => t.id === 'tch-ay' || t.name.includes('Arpana Yadav'));
assert(arpanaTch && arpanaTch.photo === 'assets/images/arpana-yadav.jpg', 'Smt. Arpana Yadav profile photo verified');
assert(arpanaTch && arpanaTch.tenure.includes('1995') && arpanaTch.tenure.includes('2016'), 'Smt. Arpana Yadav tenure verified as 1995-2016');

// 3. Late Dr. Preetam Singh (Nilgiri House Master)
const preetamTch = AppState.teachers.find(t => t.id === 'tch-ps' || t.name.includes('Preetam Singh'));
assert(preetamTch && preetamTch.house === 'Nilgiri', 'Late Dr. Preetam Singh verified as House Master of Nilgiri House');

// 4. Sh. L. S. Yadav (Revered English Faculty & Login Account)
const lsyTch = AppState.teachers.find(t => t.id === 'tch-lsy' || t.name.includes('L. S. Yadav'));
assert(lsyTch && (lsyTch.house === 'Udaigiri' || (lsyTch.houseDetail && lsyTch.houseDetail.includes('Udaigiri'))), 'Sh. L. S. Yadav verified as Udaigiri House Master');
assert(lsyTch && lsyTch.phonePrivate === '8563975888', 'Sh. L. S. Yadav phone number verified');

const lsyLoginRes = loginUser('teacher.laxmisln777@gmail.com', 'password123');
assert(lsyLoginRes && lsyLoginRes.success && lsyLoginRes.user.role === 'teacher', 'Sh. L. S. Yadav authenticates successfully as Revered Faculty');

// 5. Platform Activity & Change Audit Log Engine
assert(typeof logPlatformActivity === 'function', 'logPlatformActivity is defined and exported');
assert(typeof renderAuditLogs === 'function', 'renderAuditLogs is defined and exported');

const initialLogCount = getAuditLogs().length;
assert(initialLogCount <= 50, 'Audit log capped at 50 activities');

// Record a state change activity
logPlatformActivity('MEET_RSVP', 'Test Alumnus', 'Test Alumnus confirmed attendance for 4th Annual Meet 2026');
const logsAfterChange = getAuditLogs();
assert(logsAfterChange[0].type === 'MEET_RSVP' && logsAfterChange[0].actor === 'Test Alumnus', 'State change activity successfully recorded in audit log');

// Ensure passive events (LOGIN, PAGE_BROWSE, etc.) are strictly rejected
const countBeforePassive = getAuditLogs().length;
logPlatformActivity('LOGIN', 'Test Alumnus', 'User logged in');
logPlatformActivity('VIEW_PROFILE', 'Test Alumnus', 'Viewed profile');
const countAfterPassive = getAuditLogs();
assert(countAfterPassive.length === countBeforePassive && countAfterPassive[0].type !== 'LOGIN', 'Passive events (LOGIN, VIEW_PROFILE) strictly excluded from audit log');

// UI container assertions
const freshIndexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(freshIndexHtml.includes('id="adminAuditLogsList"'), 'index.html contains adminAuditLogsList container');
const freshMobIndexHtml = fs.readFileSync(path.join(rootDir, 'mobile_app', 'index.html'), 'utf8');
assert(freshMobIndexHtml.includes('id="adminAuditLogsList"'), 'mobile_app/index.html contains adminAuditLogsList container');

// 6. Dynamic Batch Leaderboard Live Counter
const liveStats = getBatchRegistrationStats();
assert(liveStats && liveStats.total >= 550, 'Batch leaderboard stats dynamically counts all live community members (>= 550)');
assert(freshIndexHtml.includes('id="liveLeaderboardMemberCountPill"'), 'index.html contains liveLeaderboardMemberCountPill');


// =========================================================================
// TEST SUITE 24: FLEXIBLE PASSWORD ENGINE, MOBILE LOGIN & CHANGE PASSWORD
// =========================================================================
console.log('\n--- TEST SUITE 24: FLEXIBLE PASSWORD ENGINE, MOBILE LOGIN & CHANGE PASSWORD ---');

assert(typeof verifyPasswordMatch === 'function', 'verifyPasswordMatch is exported and callable');
assert(verifyPasswordMatch('password123', 'password123', 'test@example.com') === true, 'Exact password matches');
assert(verifyPasswordMatch('password 123', 'password123', 'test@example.com') === true, 'Spaced password ("password 123") matches "password123"');
assert(verifyPasswordMatch('Password 123', 'password123', 'test@example.com') === true, 'Capitalized and spaced password ("Password 123") matches');
assert(verifyPasswordMatch('password123 ', 'password123', 'test@example.com') === true, 'Trailing whitespace password matches');
assert(verifyPasswordMatch('wrongpass', 'password123', 'test@example.com') === false, 'Invalid password rejected');

// Sh. L. S. Yadav Login Flexibility Tests
const lsyByEmailSpaced = loginUser('teacher.laxmisln777@gmail.com', 'password 123');
assert(lsyByEmailSpaced.success === true, 'Sh. L. S. Yadav logs in via email with spaced password "password 123"');

const lsyByPhone = loginUser('8563975888', 'password123');
assert(lsyByPhone.success === true, 'Sh. L. S. Yadav logs in via 10-digit mobile number 8563975888');

const lsyByPhoneSpaced = loginUser('8563975888', 'password 123');
assert(lsyByPhoneSpaced.success === true, 'Sh. L. S. Yadav logs in via mobile number with spaced password "password 123"');

const lsyByIntlPhone = loginUser('+91 8563975888', 'Password 123');
assert(lsyByIntlPhone.success === true, 'Sh. L. S. Yadav logs in via +91 phone with capitalized spaced password');

// DOM and Modal Presence
const indexContent = fs.readFileSync('index.html', 'utf8');
const loginContent = fs.readFileSync('login.html', 'utf8');
const mobIndexContent = fs.readFileSync('mobile_app/index.html', 'utf8');

assert(indexContent.includes('id="btnChangePassword"'), 'index.html contains #btnChangePassword button in navbar');
assert(indexContent.includes('id="changePasswordModal"'), 'index.html contains #changePasswordModal');
assert(mobIndexContent.includes('id="btnChangePassword"'), 'mobile_app/index.html contains #btnChangePassword');
assert(mobIndexContent.includes('id="changePasswordModal"'), 'mobile_app/index.html contains #changePasswordModal');

// Form input types allow mobile numbers
assert(loginContent.includes('id="loginEmail"') && loginContent.includes('type="text" id="loginEmail"'), 'login.html alumni login allows phone numbers (type="text")');
assert(loginContent.includes('id="teacherLoginEmail"') && loginContent.includes('type="text" id="teacherLoginEmail"'), 'login.html teacher login allows phone numbers (type="text")');
assert(loginContent.includes('Default password for Gurujan accounts is'), 'login.html contains Gurujan password guidance tip');


// =========================================================================
// TEST SUITE 25: BATCH 2025 ALUMNI, SHIV VERMA NOTABLE & DIRECTORY SYNC
// =========================================================================
console.log('\n--- TEST SUITE 25: BATCH 2025 ALUMNI, SHIV VERMA NOTABLE & DIRECTORY SYNC ---');

// 1. Shiv Kumar Verma (1995, Shivalik / Raman) in Notable Alumni
const shivNotable = NOTABLE_ALUMNI_LIST.find(a => a.id === 'notable-skv-1');
assert(!!shivNotable, 'Sh. Shiv Kumar Verma is registered in NOTABLE_ALUMNI_LIST');
assert(shivNotable.batch === '1995', 'Sh. Shiv Kumar Verma batch is 1995');
assert(shivNotable.house === 'Shivalik', 'Sh. Shiv Kumar Verma house is Shivalik (Raman House)');
assert(shivNotable.link === 'https://www.linkedin.com/in/vermashiv/', 'Sh. Shiv Kumar Verma has verified LinkedIn link');

// 2. Aryansh Patel and Anurag in Batch 2025 Directory Seed
const seedDir = require('../assets/js/directory-seed.js');
const aryanshSeed = seedDir.find(d => d.name === 'Aryansh Patel' && parseInt(d.batch) === 2025);
assert(!!aryanshSeed, 'Aryansh Patel is present in directory-seed.js (Batch 2025)');
assert(aryanshSeed.house === 'Nilgiri', 'Aryansh Patel belongs to Nilgiri House');

const anuragSeed = seedDir.find(d => d.name === 'Anurag' && parseInt(d.batch) === 2025);
assert(!!anuragSeed, 'Anurag is present in directory-seed.js (Batch 2025)');
assert(anuragSeed.house === 'Udaigiri', 'Anurag belongs to Udaigiri House');

// 3. Storage Engine Cache Indexing (Integer & String batch query resolution)
if (typeof window.AlumniStorageEngine === 'undefined' && typeof AlumniStorageEngine !== 'undefined') window.AlumniStorageEngine = AlumniStorageEngine;
window.AlumniStorageEngine.buildCacheIndexes(seedDir);
const qStr2025 = window.AlumniStorageEngine.queryDirectory({ batch: '2025' });
assert(qStr2025.totalCount >= 2, 'Batch "2025" string query finds at least 2 alumni (found ' + qStr2025.totalCount + ')');
assert(qStr2025.items.some(x => x.name === 'Aryansh Patel'), 'Batch "2025" string query contains Aryansh Patel');
assert(qStr2025.items.some(x => x.name === 'Anurag'), 'Batch "2025" string query contains Anurag');

const qNum2025 = window.AlumniStorageEngine.queryDirectory({ batch: 2025 });
assert(qNum2025.totalCount >= 2, 'Batch 2025 integer query finds at least 2 alumni (found ' + qNum2025.totalCount + ')');
assert(qNum2025.items.some(x => x.name === 'Aryansh Patel'), 'Batch 2025 integer query contains Aryansh Patel');

// 4. Default accounts include Aryansh Patel
const allUsersList = getAllUsers();
const aryanshUser = allUsersList.find(u => u.name === 'Aryansh Patel');
assert(!!aryanshUser, 'Aryansh Patel is present in default accounts/users database');
assert(aryanshUser.house === 'Nilgiri', 'Aryansh Patel user account house is Nilgiri');
assert(aryanshUser.batch === 2025, 'Aryansh Patel user account batch is 2025');

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
console.log('====================================================');

if (passedTests !== totalTests || totalTests === 0) {
  console.error(`\n❌ TEST SUITE FAILED: ${totalTests - passedTests} assertion(s) failed.`);
  process.exit(1);
} else {
  console.log('\n✅ ALL ASSERTIONS PASSED SUCCESSFULLY (100%).\n');
  process.exit(0);
}
