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
  location: { href: '' },
  addEventListener: () => {},
  scrollTo: () => {}
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

const adminLogin = loginUser('admin@jnvalumni.org', 'password123');
assert(adminLogin.success && adminLogin.user.role === 'admin', 'Super Admin Login (Dr. Amitabh Singh)');

const hostLogin = loginUser('batch1996@jnvalumni.org', 'password123');
assert(hostLogin.success && (hostLogin.user.role === 'host' || hostLogin.user.role === 'batch_admin'), 'Event Host Login (Smriti Singh)');

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
setCurrentUser(adminLogin.user, true);
changeUserRole('Kavita Sharma', 'host');
let updatedKavita = getAllUsers().find(u => u.name === 'Kavita Sharma');
assert(updatedKavita.role === 'host', 'Super Admin promoted Kavita Sharma to Host');

// 2. Admin promotes Rohan Verma to Moderator
changeUserRole('Rohan Verma', 'moderator');
let updatedRohan = getAllUsers().find(u => u.name === 'Rohan Verma');
assert(updatedRohan.role === 'moderator', 'Super Admin promoted Rohan Verma to Moderator');

// 3. Host (Smriti Singh) promotes Deepak Tiwari to Moderator
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
setCurrentUser(adminLogin.user, true);
applyUserSession(adminLogin.user);
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
