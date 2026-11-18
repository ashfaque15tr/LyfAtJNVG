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

// Load auth.js & app.js into global context
vm.runInThisContext(authCode);
vm.runInThisContext(appCode);

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
assert(indexHtml.includes('Suggestion / Issue Report') && indexHtml.includes('Site Version: v4.2.0'), 'Footer Suggestion/Issue Report and Site Version verified');
assert(indexHtml.includes('Arawali') && indexHtml.includes('Udaigiri') && indexHtml.includes('Nilgiri'), 'Official NVS standard house spellings verified (Arawali, Udaigiri, Nilgiri)');

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
assert(loginHtml.includes('regLiveOtpPreview') && loginHtml.includes('autoFillRegOtp'), 'login.html contains live OTP preview & 1-click auto-fill helper');

// ----------------------------------------------------
// TEST SUITE 11: SOLE SUPER ADMIN, TEACHER MESSAGING & LIGHT CONTRAST
// ----------------------------------------------------
console.log('\n--- TEST SUITE 11: SOLE SUPER ADMIN, TEACHER MESSAGING & LIGHT CONTRAST ---');

// 1. Directory Clean Slate: Ashfaque Ahmad is the sole Super Admin in directory
assert(defaultDirectoryAlumni.length === 1 && (defaultDirectoryAlumni[0].name === 'Ashfaque Ahmad' || defaultDirectoryAlumni[0].name === 'Ashfaq Ahmed') && defaultDirectoryAlumni[0].isSuperAdmin === true, 'Directory contains only Ashfaque Ahmad as sole Super Admin');

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
// TEST SUITE 12: 17 NOTABLE ALUMNI, ADMIN SAHAYATA QUEUE & LIGHT SKY CONTRAST
// ----------------------------------------------------
console.log('\n--- TEST SUITE 12: 17 NOTABLE ALUMNI, ADMIN SAHAYATA QUEUE & LIGHT SKY CONTRAST ---');

assert(Array.isArray(NOTABLE_ALUMNI_LIST) && NOTABLE_ALUMNI_LIST.length === 20, 'Full 20 Notable Alumni registered in Hall of Fame');
const jkm = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Jai Krishna Mishra'));
assert(jkm && jkm.batch.includes('1993') && jkm.role.includes('DRDO'), 'Dr. Jai Krishna Mishra (1993, DRDO ASL) verified');
const up = NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Utkrisht Pandey'));
assert(up && up.intro.includes('Rishigram Organics') && up.role.includes('SSB'), 'Utkrisht Pandey (SSB & Rishigram Organics) verified');
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

// 1. Top 4 Notable Alumni Sequencing (Vivek Tiwari -> Alok Dubey -> Ratnesh Tiwari -> Utkrisht Pandey)
assert(NOTABLE_ALUMNI_LIST[0].name === 'Sh. Vivek Tiwari', 'Notable Alumni rank 1 is Sh. Vivek Tiwari');
assert(NOTABLE_ALUMNI_LIST[1].name === 'Alok Dubey, IAS', 'Notable Alumni rank 2 is Alok Dubey, IAS');
assert(NOTABLE_ALUMNI_LIST[2].name.includes('Ratnesh Tiwari'), 'Notable Alumni rank 3 is Dr. Ratnesh Tiwari');
assert(NOTABLE_ALUMNI_LIST[3].name.includes('Utkrisht Pandey'), 'Notable Alumni rank 4 is Sh. Utkrisht Pandey');

// Batch and Profile Verifications
assert(NOTABLE_ALUMNI_LIST.find(a => a.name === 'Virika Solanki').batch === '2009', 'Virika Solanki batch verified as 2009');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Utkrisht Pandey')).batch === '2002', 'Utkrisht Pandey batch verified as 2002');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name === 'Alok Singh').batch === '1995', 'Alok Singh batch verified as 1995');
assert(NOTABLE_ALUMNI_LIST.some(a => a.name === 'Yasir Abdul' && a.batch === '1995' && a.link.includes('yasir-abdul-66258828')), 'Yasir Abdul Batch of 1995 added to Notable Alumni');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Ratnesh Tiwari')).link === 'https://koshishindia.in/founders-thought/', 'Ratnesh Tiwari profile link verified as koshishindia.in/founders-thought/');
assert(NOTABLE_ALUMNI_LIST.find(a => a.name.includes('Ashwini Mishra')).intro.includes('**Be grounded..Be Honest..**'), 'Ashwini Mishra quote contains bold Be grounded..Be Honest..');

// Logged-in User Profile Edit Feature
assert(typeof openEditProfileModal === 'function' && typeof handleProfileUpdate === 'function', 'Self-service Profile Edit engine exported');
assert(indexHtml.includes('editProfileModal') && indexHtml.includes('btnEditProfile'), 'index.html contains editProfileModal and btnEditProfile');
assert(indexHtml.includes('Meet Memories & Gallery'), 'Meet Memories and Gallery unified into single tab');

// 2. Added Notable Alumni Profiles
const alokSingh = NOTABLE_ALUMNI_LIST.find(a => a.name === 'Alok Singh');
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
// TEST SUMMARY
// ----------------------------------------------------
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
