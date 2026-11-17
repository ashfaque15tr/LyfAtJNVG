/**
 * JNV Gauriganj (Amethi / Sultanpur) Alumni Platform
 * Core Application Engine & State Manager
 */

// Global Application State with LocalStorage Persistence
const APP_STORAGE_KEY = 'JNVG_ALUMNI_APP_DATA_V2';

let attachedStoryPhoto = null;

const defaultData = {
  role: 'member',
  currentLang: 'en',
  viewport: 'desktop',
  donationAmount: 5000,
  activeTab: 'home',
  
  rsvps: [],

  contributions: [],

  feedPosts: [],

  queueItems: [],

  pendingRegistrations: [],

  directory: [],

  meetSchedule: [
    { id: "sch-1", time: "09:00 AM", color: "blue", title: "Tilak Welcome, Registration & Kit Distribution", desc: "Campus entry, welcome tilak, breakfast tea, ID tag & souvenir bag collection." },
    { id: "sch-2", time: "10:00 AM", color: "amber", title: "Morning Assembly & Prayer (\"हम नवोदय हो\")", desc: "Guru Vandana, lighting of the lamp by Principal Mr. P. K. Singh, collective Navodaya prayer." },
    { id: "sch-3", time: "11:30 AM", color: "amber", title: "Keynote Address & Teacher Felicitations (गुरु दक्षिणा सम्मान)", desc: "Honoring former gurus & faculty legends, speech by Principal & Alumni President, unveiling Association projects." },
    { id: "sch-4", time: "01:00 PM", color: "emerald", title: "Nostalgic Navodaya Mess Feast (विशेष मेस भोज)", desc: "Traditional hostel feast (puri-chole, kheer, special menu) together in the central dining hall." },
    { id: "sch-5", time: "02:30 PM", color: "purple", title: "Cultural Fiesta & Open Mic (सांस्कृतिक संगम)", desc: "Music, nostalgic hostel skits, poetry, comedy, and batch memories on the open amphitheater stage." },
    { id: "sch-6", time: "04:30 PM", color: "red", title: "Inter-House Tug-of-War & Friendly Sports", desc: "Arawali, Shivalik, Udaigiri & Nilgiri face-off on the legendary JNV sports ground." },
    { id: "sch-7", time: "06:00 PM", color: "blue", title: "High Tea, Valedictory & Navodaya Pledge", desc: "Batch group photographs, vote of thanks by Host Batch 1996, collective pledge & farewell." }
  ],

  culturalActs: [
    {
      id: "act-1",
      performer: "Neelam Singh",
      batch: 2016,
      type: "Solo Song",
      duration: "5 mins",
      title: "हम नवोदय हो (Acoustic Semi-Classical Fusion)",
      requirements: "2 Cordless Mics, Acoustic Guitar Jack",
      description: "Soulful acoustic rendition of the Navodaya prayer mixed with regional classical tunes.",
      status: "Slot Approved",
      notes: "Assigned slot 02:40 PM. Audio team will test wireless guitar input during mess lunch break."
    },
    {
      id: "act-2",
      performer: "Anand Kumar Maurya & Batchmates",
      batch: 2011,
      type: "Nostalgic Skit",
      duration: "10 mins",
      title: "हॉस्टल की रातें और सुबह की पीटी (Mess & Roll-Call Comedy Skit)",
      requirements: "3 Headset Mics, 2 Chairs, Whistle prop",
      description: "Comical theater reenactment of hostel life, night study escapes, and morning PT roll-call under Varshney Sir.",
      status: "Pending Review",
      notes: "Requested stage rehearsal slot at 01:45 PM before crowd settles in auditorium."
    }
  ],

  notableMessages: [
    { id: 1, author: "Sh. Vivek Tiwari", batch: "1987-1994", role: "MD & CEO, Satya MicroCapital Ltd. & Donor", house: "Arawali", quote: "Navodaya gave us the courage to dream and build without fear. Every milestone in corporate or public leadership is rooted in the resilience learned in those Gauriganj classrooms. Support your junior peers relentlessly." },
    { id: 2, author: "Alok Dubey, IAS", batch: "2007", role: "Indian Administrative Service", house: "Nilgiri", quote: "Public service is the natural continuum of Navodaya's core pledge 'Pragyanam Brahma'. To all young scholars: stay disciplined, read widely, and let integrity be your defining hallmark." },
    { id: 3, author: "Ratnesh Tiwari", batch: "1996-2003", role: "CEO, Koshish India & Co-Founder Satyapath Foundation", house: "Nilgiri", quote: "True Navodayan spirit is giving back tenfold to the rural soil that nurtured us. Empower the next generation through education, infrastructure, and sustainable community support." },
    { id: 4, author: "Sh. Rama Sankar Yadav", batch: "1987-1994", role: "Head Master, Model School Pachehari & Donor", house: "Shivalik", quote: "Education is the greatest tool of nation-building. Every Navodayan who teaches and guides a child fulfills the core mission Rajiv Gandhi envisioned for our Vidyalayas." },
    { id: 5, author: "Dr. Amitabh Singh", batch: "1998", role: "Senior Consultant Neurosurgeon", house: "Shivalik", quote: "Discipline forged on the sports field under Varshney Sir and analytical clarity from Chaudhary Sir became my greatest surgical instruments. Always stay humble and grounded in our Navodaya values." }
  ],

  helpRequests: [
    {
      id: "help-1",
      title: "Medical Surgery & Critical Care Assistance for Alumnus Parent",
      requesterName: "Dr. Rajesh Verma",
      requesterId: "usr-rv-1",
      batch: 2002,
      house: "Udaygiri",
      category: "medical",
      categoryLabel: "Medical Emergency",
      currentTier: 3,
      status: "escalated_apex",
      statusLabel: "Tier 3: Apex Central Welfare Fund (Active Grant)",
      urgency: "urgent",
      targetAmount: 100000,
      raisedAmount: 75000,
      description: "Urgent neurovascular procedure required at SGPGI Lucknow. Initial appeal in Batch of 2002 raised ₹45,000. Escalated through Regional Chapter to Central Welfare Fund where an additional ₹30,000 grant has been sanctioned.",
      resolutionNotes: [
        { time: "05 Nov 2026", note: "Tier 1: Request initiated within Batch of 2002 circle. ₹45,000 mobilized by batchmates." },
        { time: "08 Nov 2026", note: "Tier 2: Escalated to Lucknow Regional Chapter for hospital facilitation at SGPGI." },
        { time: "11 Nov 2026", note: "Tier 3: Central Executive Committee approved ₹30,000 emergency grant from Alumni Welfare Fund." }
      ],
      date: "05 Nov 2026"
    },
    {
      id: "help-2",
      title: "UPSC Civil Services Mentorship & Advanced Study Resource Support",
      requesterName: "Anand Kumar Maurya",
      requesterId: "usr-am-1",
      batch: 2011,
      house: "Aravali",
      category: "career",
      categoryLabel: "Career & Mentorship",
      currentTier: 1,
      status: "resolved",
      statusLabel: "Tier 1: Resolved within Batch & Mentor Circle",
      urgency: "normal",
      targetAmount: null,
      raisedAmount: null,
      description: "Guidance requested for UPSC Civil Services optional subject strategy (Public Administration & Essay). Successfully connected with senior alumnus Alok Dubey, IAS (Batch 2007) for 1-on-1 mentorship.",
      resolutionNotes: [
        { time: "10 Nov 2026", note: "Tier 1: Batch of 2011 peers connected Anand with Alok Dubey Bhaiya (2007). Strategy session completed." }
      ],
      date: "10 Nov 2026"
    },
    {
      id: "help-3",
      title: "Immediate Job Relocation & Technical Interview Referral in Bengaluru",
      requesterName: "Vikas Maurya",
      requesterId: "usr-vm-1",
      batch: 2016,
      house: "Neelgiri",
      category: "career",
      categoryLabel: "Career & Placement",
      currentTier: 2,
      status: "regional_review",
      statusLabel: "Tier 2: Escalated to Bengaluru Regional Chapter",
      urgency: "medium",
      targetAmount: null,
      raisedAmount: null,
      description: "Junior alumnus seeking senior software role referral and temporary accommodation guidance in Bengaluru tech hub. Batch 2016 initiated request; escalated to Bengaluru Regional Chapter.",
      resolutionNotes: [
        { time: "12 Nov 2026", note: "Tier 1: Batchmates provided initial resume review." },
        { time: "14 Nov 2026", note: "Tier 2: Escalated to Bengaluru Chapter. Ramesh Yadav (2008) and Saurabh Shukla (2007) arranged interview referrals at top tech firms." }
      ],
      date: "12 Nov 2026"
    }
  ],
  teachers: [
    {
      id: "tch-1",
      name: "Dr. S. K. Chaudhary",
      title: "Senior Chemistry Luminary & Former Vice Principal",
      category: "former",
      statusLabel: "Former Faculty (Retired)",
      post: "PGT Chemistry & Former Vice Principal",
      subject: "Chemistry & Sciences",
      tenure: "1989 – 2006 (17 Years)",
      house: "Aravali",
      houseDetail: "House Master - Aravali (Ashok)",
      location: "Prayagraj / Lucknow, UP",
      initials: "SKC",
      photo: null,
      message: "नवोदय सिर्फ एक विद्यालय नहीं, यह संस्कार और चरित्र निर्माण की पावन तपोभूमि है। हमारे विद्यार्थियों ने जब भी प्रयोगशाला के टेस्ट ट्यूब से निकलकर जीवन के कठिन मैदानों में कदम रखा, उन्होंने हमेशा सत्य और परिश्रम का परचम लहराया। 13 दिसंबर को चतुर्थ महासम्मेलन में अपने सभी प्रिय शिष्यों से मिलने की उत्कंठा है। सदा विजयी भव!",
      specialNote: "Revered Chemistry Guru who mentored over 30 batches toward national medical & engineering excellence."
    },
    {
      id: "tch-2",
      name: "Legendary Varshney Sir",
      title: "PET Sir • Physical Education, Sports & Discipline Patriarch",
      category: "former",
      statusLabel: "Former Faculty (Retired)",
      post: "Physical Education Teacher (PET) & Chief Warden",
      subject: "Physical Education & Discipline",
      tenure: "1990 – 2012 (22 Years)",
      house: "Shivalik",
      houseDetail: "Chief House Master & Sports Coordinator",
      location: "Aligarh / Gauriganj",
      initials: "VS",
      photo: null,
      message: "सुबह 5:30 बजे की सीटी, खेल मैदान का चक्कर और अनुशासन—यही नवोदयी को दुनिया की किसी भी विपरीत परिस्थिति में अडिग खड़ा रखता है। मैदान में पसीना बहाने वाला कभी जिंदगी की दौड़ में पीछे नहीं रहता। अनुशासन ही नवोदय की सबसे बड़ी शक्ति है। खूब बढ़ो और संस्था का नाम रोशन करो!",
      specialNote: "Legendary sports mentor who led JNV Gauriganj to consecutive Regional & National Navodaya Sports Championships."
    },
    {
      id: "tch-3",
      name: "Sh. Mahendra Singh Rawat",
      title: "History Luminary, Scholar & Pastoral Guide",
      category: "former",
      statusLabel: "Former Faculty (Superannuated)",
      post: "PGT History & Senior House Master",
      subject: "History & Social Sciences",
      tenure: "1991 – 2010 (19 Years)",
      house: "Neelgiri",
      houseDetail: "House Master - Neelgiri",
      location: "Dehradun, Uttarakhand",
      initials: "MSR",
      photo: null,
      message: "इतिहास गवाह है कि वही कौम और वही संस्थाएं अमर होती हैं जो अपनी जड़ों और संस्कारों से जुड़ी रहती हैं। हमारे पूर्व छात्र आज देश के हर कोने में समाज को नई दिशा दे रहे हैं। जब आप अपनी पुरानी कक्षाओं और हॉस्टलों की ओर मुड़कर देखते हैं, तो नवोदय की उस पवित्र मिट्टी का ऋण स्मरण रखें।",
      specialNote: "Eminent scholar of Indian history and ethics; guide for civil services aspirants."
    },
    {
      id: "tch-4",
      name: "Smt. Shakuntala Devi",
      title: "Senior Guide • Matrubhasha & Girls Hostel Matron",
      category: "former",
      statusLabel: "Former Faculty (Retired)",
      post: "TGT Hindi & Girls Hostel In-charge",
      subject: "Hindi Literature & Value Education",
      tenure: "1992 – 2014 (22 Years)",
      house: "Priyadarshni / Sarojini",
      houseDetail: "Matron - Priyadarshni & Sarojini House (Later unified with 4 Houses)",
      location: "Sultanpur / Lucknow, UP",
      initials: "SD",
      photo: null,
      message: "प्रिय नवोदयी बेटियों और बेटों! तुम जब छोटे-छोटे बस्ते लेकर गौरीगंज आए थे, तब से लेकर आज देश-विदेश में नेतृत्व करते देखने का सुख अद्वितीय है। संस्कार, दया और अपनी भाषा व संस्कृति का गौरव कभी मत छोड़ना। सम्मेलन में सभी को मेरा असीम स्नेह व आशीर्वाद।",
      specialNote: "Affectionate maternal mentor for the hostel students and pioneer of cultural drama clubs."
    },
    {
      id: "tch-5",
      name: "Sh. R. K. Sharma",
      title: "PGT Physics & Science Club Founder",
      category: "former",
      statusLabel: "Former Faculty (Transferred)",
      post: "PGT Physics & Innovation Lab In-charge",
      subject: "Physics",
      tenure: "1993 – 2009 (16 Years)",
      house: "Udaygiri",
      houseDetail: "House Master - Udaygiri",
      location: "Kanpur, UP",
      initials: "RKS",
      photo: null,
      message: "गौरीगंज परिसर की छत पर टेलिस्कोप से तारों को देखना और भौतिकी के सिद्धांतों को वास्तविक जीवन में परखना आज भी ताजा है। निरंतर वैज्ञानिक सोच और जिज्ञासु स्वभाव बनाए रखें।",
      specialNote: "Science Olympiad trainer and robotics pioneer."
    },
    {
      id: "tch-6",
      name: "Mr. P. K. Singh",
      title: "Principal, Jawahar Navodaya Vidyalaya, Gauriganj",
      category: "current",
      statusLabel: "Current Leadership (Principal)",
      post: "Principal (Present)",
      subject: "Institutional Leadership & Administration",
      tenure: "Present",
      house: "Administration",
      houseDetail: "Campus Head",
      location: "Campus Residence, JNV Gauriganj",
      initials: "PKS",
      photo: null,
      message: "जवाहर नवोदय विद्यालय, गौरीगंज के गौरवशाली पूर्व छात्रों का परिसर में हार्दिक स्वागत है। 13 दिसंबर 2026 को आयोजित होने वाला यह चतुर्थ महासम्मेलन हमारे वर्तमान अध्ययनरत 550+ विद्यार्थियों के लिए जीवंत प्रेरणा बनेगा। आपका मार्गदर्शन और सहभागिता विद्यालय को नई ऊंचाइयों पर ले जाएगा।",
      specialNote: "Leading current campus digital infrastructure and academic transformation."
    },
    {
      id: "tch-7",
      name: "Mr. N. N. Tripathi",
      title: "Vice Principal, Jawahar Navodaya Vidyalaya, Gauriganj",
      category: "current",
      statusLabel: "Current Leadership (Vice Principal)",
      post: "Vice Principal (Present)",
      subject: "Academic Administration & Discipline",
      tenure: "Present",
      house: "Administration",
      houseDetail: "Academic Discipline Coordinator",
      location: "Campus Staff Quarters, JNV Gauriganj",
      initials: "NNT",
      photo: null,
      message: "विद्यालय की सबसे बड़ी पूंजी उसके द्वारा गढ़े गए नागरिक हैं। पूर्व छात्रों का यह एकजुट संगठन वर्तमान पीढ़ी के लिए एक मजबूत पुल है। हम सभी शिक्षकगण चतुर्थ सम्मेलन में आपके स्वागत के लिए सज्ज हैं।",
      specialNote: "Spearheading board examination academic excellence and student counseling."
    },
    {
      id: "tch-8",
      name: "Mr. S. K. Singh",
      title: "Alumni Coordinator Teacher & Senior Faculty",
      category: "current",
      statusLabel: "Current Faculty (Alumni Cell Coordinator)",
      post: "Alumni Coordinator Teacher (Faculty In-Charge)",
      subject: "Student Mentorship & Alumni Liaison",
      tenure: "Present",
      house: "Neelgiri",
      houseDetail: "Alumni Liaison Cell & Mentorship In-charge",
      location: "JNV Gauriganj Campus",
      initials: "SKS",
      photo: null,
      message: "पूर्व छात्र प्रकोष्ठ (Alumni Cell) के माध्यम से हम विद्यालय के पूर्व और वर्तमान छात्रों के बीच सतत संवाद स्थापित कर रहे हैं। 13 दिसंबर 2026 को आयोजित चतुर्थ वार्षिक सम्मेलन में आप सभी पूर्व विद्यार्थियों का सस्नेह स्वागत है।",
      specialNote: "Direct campus liaison officer for 4th Annual Mega Meet arrangements."
    },
    {
      id: "tch-9",
      name: "Sh. Ram Ashray Ram",
      title: "Pastoral Care Patriarch • Mess & Hostel Custodian",
      category: "pastoral",
      statusLabel: "Non-Academic Veteran (Superannuated)",
      post: "Senior Hostel Superintendent & Mess Custodian",
      subject: "Pastoral Care & Hostel Welfare",
      tenure: "1989 – 2014 (25 Years)",
      house: "All Houses",
      houseDetail: "Hostel Caretaker & Dining Hall In-charge",
      location: "Gauriganj, Amethi",
      initials: "RAR",
      photo: null,
      message: "रात को हॉस्टल में जब बच्चे घर की याद में रोते थे, तब उन्हें अपने बच्चे की तरह संभालना मेरा फर्ज था। आज आप सब बड़े अफसर, डॉक्टर, इंजीनियर और लीडर बन गए हैं। मेरे लिए इससे बड़ा कोई धन नहीं। 13 दिसंबर को सबको गले लगाने का इंतजार है।",
      specialNote: "Served 25 uninterrupted years taking caring fatherly responsibility for thousands of residential students."
    }
  ]
};

const SOFT_LAUNCH_STORAGE_FLAG = 'JNVG_SOFT_LAUNCH_2026_CLEARED_V6';

// As of today, Ashfaq Ahmed is the ONLY verified alumni present in the directory as Super Admin
const defaultDirectoryAlumni = [
  {
    id: "dir-ashfaq-ahmed",
    name: "Ashfaq Ahmed",
    initials: "AA",
    batch: 2008,
    house: "Arawali",
    role: "Lead Enterprise & Systems Solutions Architect",
    location: "Lucknow / New Delhi",
    domain: "Software",
    email: "ashfaque15tr@gmail.com",
    badge: "Arawali",
    tag: "Super Admin • Batch of 2008",
    systemRole: "admin",
    isSuperAdmin: true,
    verified: true,
    joinedDate: "Platform Super Admin"
  }
];

function loadAppData() {
  try {
    // Soft Launch Auto-Purge: Wipe pre-launch mock feeds, directory members, RSVPs & contributions once
    const isSoftLaunchCleared = localStorage.getItem(SOFT_LAUNCH_STORAGE_FLAG);
    if (!isSoftLaunchCleared) {
      localStorage.setItem(SOFT_LAUNCH_STORAGE_FLAG, 'true');
      const cleanData = {
        ...defaultData,
        rsvps: [],
        contributions: [],
        feedPosts: [],
        queueItems: [],
        pendingRegistrations: [],
        directory: defaultDirectoryAlumni.slice(),

  meetSchedule: [
    { id: "sch-1", time: "09:00 AM", color: "blue", title: "Tilak Welcome, Registration & Kit Distribution", desc: "Campus entry, welcome tilak, breakfast tea, ID tag & souvenir bag collection." },
    { id: "sch-2", time: "10:00 AM", color: "amber", title: "Morning Assembly & Prayer (\"हम नवोदय हो\")", desc: "Guru Vandana, lighting of the lamp by Principal Mr. P. K. Singh, collective Navodaya prayer." },
    { id: "sch-3", time: "11:30 AM", color: "amber", title: "Keynote Address & Teacher Felicitations (गुरु दक्षिणा सम्मान)", desc: "Honoring former gurus & faculty legends, speech by Principal & Alumni President, unveiling Association projects." },
    { id: "sch-4", time: "01:00 PM", color: "emerald", title: "Nostalgic Navodaya Mess Feast (विशेष मेस भोज)", desc: "Traditional hostel feast (puri-chole, kheer, special menu) together in the central dining hall." },
    { id: "sch-5", time: "02:30 PM", color: "purple", title: "Cultural Fiesta & Open Mic (सांस्कृतिक संगम)", desc: "Music, nostalgic hostel skits, poetry, comedy, and batch memories on the open amphitheater stage." },
    { id: "sch-6", time: "04:30 PM", color: "red", title: "Inter-House Tug-of-War & Friendly Sports", desc: "Aravali, Shivalik, Udaygiri & Neelgiri face-off on the legendary JNV sports ground." },
    { id: "sch-7", time: "06:00 PM", color: "blue", title: "High Tea, Valedictory & Navodaya Pledge", desc: "Batch group photographs, vote of thanks by Host Batch 1996, collective pledge & farewell." }
  ],

  culturalActs: [
    {
      id: "act-1",
      performer: "Neelam Singh",
      batch: 2016,
      type: "Solo Song",
      duration: "5 mins",
      title: "हम नवोदय हो (Acoustic Semi-Classical Fusion)",
      requirements: "2 Cordless Mics, Acoustic Guitar Jack",
      description: "Soulful acoustic rendition of the Navodaya prayer mixed with regional classical tunes.",
      status: "Slot Approved",
      notes: "Assigned slot 02:40 PM. Audio team will test wireless guitar input during mess lunch break."
    },
    {
      id: "act-2",
      performer: "Anand Kumar Maurya & Batchmates",
      batch: 2011,
      type: "Nostalgic Skit",
      duration: "10 mins",
      title: "हॉस्टल की रातें और सुबह की पीटी (Mess & Roll-Call Comedy Skit)",
      requirements: "3 Headset Mics, 2 Chairs, Whistle prop",
      description: "Comical theater reenactment of hostel life, night study escapes, and morning PT roll-call under Varshney Sir.",
      status: "Pending Review",
      notes: "Requested stage rehearsal slot at 01:45 PM before crowd settles in auditorium."
    }
  ],
        teachers: defaultData.teachers,
        helpRequests: defaultData.helpRequests,
        notableMessages: defaultData.notableMessages
      };
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(cleanData));
      if (window.indexedDB) {
        try { window.indexedDB.deleteDatabase('JNVG_ALUMNI_ENTERPRISE_DB'); } catch(e) {}
      }
      return cleanData;
    }

    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.teachers && defaultData.teachers) {
        const existingTeacherNames = new Set(parsed.teachers.map(t => t.name.toLowerCase()));
        defaultData.teachers.forEach(item => {
          if (!existingTeacherNames.has(item.name.toLowerCase())) {
            parsed.teachers.push(item);
          }
        });
      }
      if (parsed.teachers) {
        parsed.teachers.sort((a, b) => {
          const getLeadershipRank = (t) => {
            const p = (t.post || '').toLowerCase();
            const s = (t.statusLabel || '').toLowerCase();
            const isCur = t.category === 'current' || s.includes('current');
            if (isCur && p.includes('principal') && !p.includes('vice')) return 1;
            if (isCur && p.includes('vice principal')) return 2;
            if (isCur && (p.includes('alumni') || (t.title || '').toLowerCase().includes('alumni') || p.includes('coordinator'))) return 3;
            if (isCur) return 4;
            return 10;
          };
          return getLeadershipRank(a) - getLeadershipRank(b);
        });
      }
      if (!parsed.meetSchedule || !Array.isArray(parsed.meetSchedule) || parsed.meetSchedule.length === 0) {
        parsed.meetSchedule = defaultData.meetSchedule;
      }
      if (!parsed.culturalActs || !Array.isArray(parsed.culturalActs)) {
        parsed.culturalActs = defaultData.culturalActs;
      }
      // Ensure only Ashfaq Ahmed is present in directory as sole Super Admin today
      parsed.directory = defaultDirectoryAlumni.slice();
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.error("Could not load from localStorage:", e);
  }
  return defaultData;
}

const AppState = loadAppData();

function saveAppData() {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({
      rsvps: AppState.rsvps,
      contributions: AppState.contributions,
      feedPosts: AppState.feedPosts,
      queueItems: AppState.queueItems,
      pendingRegistrations: AppState.pendingRegistrations,
      directory: AppState.directory,
      teachers: AppState.teachers,
      helpRequests: AppState.helpRequests,
      notableMessages: AppState.notableMessages,
      meetSchedule: AppState.meetSchedule,
      culturalActs: AppState.culturalActs,
      role: AppState.role,
      currentLang: AppState.currentLang
    }));
  } catch (e) {
    console.warn("Storage quota or error:", e);
  }
}

// 1. Navigation & Tab Switching
function switchTab(tabId) {
  AppState.activeTab = tabId;
  
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('block');
  });
  
  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('block');
  }

  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('bg-brand-700', 'text-white', 'shadow');
      btn.classList.remove('text-slate-300');
    } else {
      btn.classList.remove('bg-brand-700', 'text-white', 'shadow');
      btn.classList.add('text-slate-300');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Real User Session & Role-Based Access Engine
function applyUserSession(user) {
  const avatarEl = document.getElementById('userAvatarInitials');
  const nameEl = document.getElementById('userDisplayName');
  const roleEl = document.getElementById('userDisplayRole');
  const roleBadge = document.getElementById('roleBadge');
  const rbacMessage = document.getElementById('rbacMessage');
  const adminTabNav = document.getElementById('adminTabNav');
  const userProfileTopBar = document.getElementById('userProfileTopBar');
  const guestTopBar = document.getElementById('guestTopBar');
  const btnAddScheduleEvent = document.getElementById('btnAddScheduleEvent');
  const hostCulturalCommandDesk = document.getElementById('hostCulturalCommandDesk');
  const ledgerSection = document.getElementById('contributionLedgerSection');
  const restrictedNotice = document.getElementById('ledgerRestrictedNotice');
  const btnBatchBroadcast = document.getElementById('btnBatchBroadcast');
  const btnBatchBroadcastText = document.getElementById('btnBatchBroadcastText');
  const btnChatBroadcast = document.getElementById('btnChatBroadcast');

  // GUEST / UNANIMOUS VISITOR (When not logged in)
  if (!user) {
    AppState.role = 'member';
    if (userProfileTopBar) userProfileTopBar.classList.add('hidden');
    if (guestTopBar) guestTopBar.classList.remove('hidden');

    if (roleBadge) {
      roleBadge.textContent = "Alumni Guest";
      roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700";
    }
    if (rbacMessage) {
      rbacMessage.textContent = "Welcome to Jawahar Navodaya Vidyalaya Alumni Association, Gauriganj. Please sign in or register.";
    }
    if (adminTabNav) adminTabNav.classList.add('hidden');
    if (AppState.activeTab === 'admin') switchTab('home');

    if (btnAddScheduleEvent) btnAddScheduleEvent.classList.add('hidden');
    if (hostCulturalCommandDesk) hostCulturalCommandDesk.classList.add('hidden');

    if (ledgerSection) ledgerSection.classList.add('hidden');
    if (restrictedNotice) restrictedNotice.classList.remove('hidden');

    if (btnBatchBroadcast) btnBatchBroadcast.classList.add('hidden');
    if (btnChatBroadcast) btnChatBroadcast.classList.add('hidden');

    renderMeetSchedule();
    renderCulturalActs();
    return;
  }

  // AUTHENTICATED USER SESSION
  AppState.role = user.role;
  if (userProfileTopBar) userProfileTopBar.classList.remove('hidden');
  if (guestTopBar) guestTopBar.classList.add('hidden');

  if (avatarEl) {
    if (user.photo) {
      avatarEl.innerHTML = `<img src="${user.photo}" alt="${user.name}" class="w-full h-full rounded-full object-cover">`;
    } else {
      avatarEl.textContent = user.avatar || "NV";
    }
  }
  if (nameEl) nameEl.textContent = user.name;

  // Clean Role Title Display (No Demo Role text)
  let cleanRoleTitle = 'Member';
  if (user.role === 'admin') cleanRoleTitle = 'Super Admin';
  else if (user.role === 'host' || user.role === 'batch_admin') cleanRoleTitle = 'Host';
  else if (user.role === 'moderator') cleanRoleTitle = 'Moderator';
  else if (user.role === 'teacher') cleanRoleTitle = 'Revered Gurujan';

  if (roleEl) {
    if (user.role === 'teacher') {
      roleEl.textContent = `${user.designation || user.roleTitle || 'Revered Faculty'}`;
    } else {
      roleEl.textContent = `${cleanRoleTitle} • Batch ${user.batch || 'Alumni'}`;
    }
  }

  const isCurAdmin = user.role === 'admin';
  const isCurHost = user.role === 'host' || user.role === 'batch_admin';
  const isCurMod = user.role === 'moderator';
  const isCurTeacher = user.role === 'teacher';

  if (isCurAdmin) {
    if (roleBadge) { roleBadge.textContent = "Super Admin"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30"; }
    if (rbacMessage) { rbacMessage.textContent = `Super Admin Session: ${user.name}. Full administrative governance, schedule controls, role assignments, all batches ledger, and moderation enabled.`; }
    if (adminTabNav) adminTabNav.classList.remove('hidden');
  } else if (isCurHost) {
    if (roleBadge) { roleBadge.textContent = "Event Host"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40"; }
    if (rbacMessage) { rbacMessage.textContent = `Event Host Session: ${user.name} (Batch ${user.batch}). 4th Mega Meet schedule management, cultural acts command notes, and audited funds access active.`; }
    if (adminTabNav) adminTabNav.classList.remove('hidden');
  } else if (isCurMod) {
    if (roleBadge) { roleBadge.textContent = "Content Moderator"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30"; }
    if (rbacMessage) { rbacMessage.textContent = `Content Moderator Session: ${user.name} (Batch ${user.batch}). Stories moderation and batch broadcast active.`; }
    if (adminTabNav) adminTabNav.classList.remove('hidden');
  } else if (isCurTeacher) {
    if (roleBadge) { roleBadge.textContent = "Revered Gurujan / Faculty"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40"; }
    if (rbacMessage) { rbacMessage.textContent = `सादर प्रणाम, आदरणीय ${user.name}! Revered Faculty Session active. Blessings & campus memories can be shared on the Memory Wall.`; }
    if (adminTabNav) adminTabNav.classList.add('hidden');
    if (AppState.activeTab === 'admin') switchTab('home');
  } else {
    if (roleBadge) { roleBadge.textContent = "Alumni Member"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"; }
    if (rbacMessage) { rbacMessage.textContent = `Welcome, ${user.name} (Batch ${user.batch}, ${user.house} House). Verified Alumni portal access enabled.`; }
    if (adminTabNav) adminTabNav.classList.add('hidden');
    if (AppState.activeTab === 'admin') switchTab('home');
  }

  // 4th Annual Meet Schedule Controls (Host & Admin only)
  if (btnAddScheduleEvent) {
    if (isCurAdmin || isCurHost) btnAddScheduleEvent.classList.remove('hidden');
    else btnAddScheduleEvent.classList.add('hidden');
  }

  // Cultural Acts Command Desk & Notes (Host & Admin only)
  if (hostCulturalCommandDesk) {
    if (isCurAdmin || isCurHost) hostCulturalCommandDesk.classList.remove('hidden');
    else hostCulturalCommandDesk.classList.add('hidden');
  }

  // Audited Contribution Ledger & Corpus: STRICTLY restricted to Super Admin (admin) and Host (host / batch_admin)
  const canViewAudits = isCurAdmin || isCurHost;
  if (ledgerSection) {
    if (canViewAudits) ledgerSection.classList.remove('hidden');
    else ledgerSection.classList.add('hidden');
  }
  if (restrictedNotice) {
    if (canViewAudits) restrictedNotice.classList.add('hidden');
    else restrictedNotice.classList.remove('hidden');
  }

  // Batch Broadcast / Mass Message Controls for Moderator, Host, and Super Admin
  const canBroadcast = isCurMod || isCurHost || isCurAdmin;
  if (btnBatchBroadcast) {
    if (canBroadcast) {
      btnBatchBroadcast.classList.remove('hidden');
      if (btnBatchBroadcastText) {
        btnBatchBroadcastText.textContent = isCurAdmin ? '📢 Broadcast to Batch' : `📢 Broadcast to Batch ${user.batch}`;
      }
    } else {
      btnBatchBroadcast.classList.add('hidden');
    }
  }
  if (btnChatBroadcast) {
    if (canBroadcast) {
      btnChatBroadcast.classList.remove('hidden');
      btnChatBroadcast.textContent = `📢 Batch ${user.batch || ''} Broadcast`;
    } else {
      btnChatBroadcast.classList.add('hidden');
    }
  }

  renderMeetSchedule();
  renderCulturalActs();
  renderRoleGovernanceList();
}

// 3. Viewport Mode
function setViewport(mode) {
  AppState.viewport = mode;
  const container = document.getElementById('appViewportContainer');
  const btnDesk = document.getElementById('btnViewDesktop');
  const btnMob = document.getElementById('btnViewMobile');

  if (mode === 'mobile') {
    container.classList.add('mobile-frame-view');
    if (btnMob) { btnMob.classList.add('bg-brand-700', 'text-white'); btnMob.classList.remove('bg-slate-800', 'text-slate-300'); }
    if (btnDesk) { btnDesk.classList.remove('bg-brand-700', 'text-white'); btnDesk.classList.add('bg-slate-800', 'text-slate-300'); }
    showToast("Mobile App Preview Frame Enabled");
  } else {
    container.classList.remove('mobile-frame-view');
    if (btnDesk) { btnDesk.classList.add('bg-brand-700', 'text-white'); btnDesk.classList.remove('bg-slate-800', 'text-slate-300'); }
    if (btnMob) { btnMob.classList.remove('bg-brand-700', 'text-white'); btnMob.classList.add('bg-slate-800', 'text-slate-300'); }
    showToast("Desktop View Enabled");
  }
}

// 4. Bilingual Toggle
function toggleLanguage() {
  AppState.currentLang = AppState.currentLang === 'en' ? 'hi' : 'en';
  saveAppData();
  const isHindi = AppState.currentLang === 'hi';
  document.getElementById('langLabel').textContent = isHindi ? 'English Mode' : 'हिन्दी मोड';

  document.querySelectorAll('.tab-title').forEach(el => {
    const text = isHindi ? el.getAttribute('data-hi') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });

  showToast(isHindi ? "हिन्दी भाषा मोड सक्रिय" : "English Mode Activated");
}

// 5. Donation Tier Selection
function selectTier(amount) {
  AppState.donationAmount = amount;
  document.getElementById('customAmountWrap').classList.add('hidden');
  document.getElementById('qrAmountDisplay').textContent = `₹${amount.toLocaleString('en-IN')}`;
  
  const confirmEl = document.getElementById('confirmAmountText');
  if (confirmEl) confirmEl.textContent = `₹${amount.toLocaleString('en-IN')}`;

  document.querySelectorAll('.tier-btn').forEach(btn => {
    btn.classList.remove('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-400');
    btn.classList.add('border-slate-700', 'bg-slate-950', 'text-slate-200');
  });

  if (event && event.target) {
    event.target.classList.add('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-400');
    event.target.classList.remove('border-slate-700', 'bg-slate-950', 'text-slate-200');
  }
}

function selectCustomTier() {
  document.getElementById('customAmountWrap').classList.remove('hidden');
  const customInput = document.getElementById('customAmountInput');
  customInput.focus();
  if (customInput.value) {
    updateCustomAmount(customInput.value);
  }
}

function updateCustomAmount(val) {
  const num = parseInt(val) || 0;
  AppState.donationAmount = num;
  document.getElementById('qrAmountDisplay').textContent = `₹${num.toLocaleString('en-IN')}`;
  const confirmEl = document.getElementById('confirmAmountText');
  if (confirmEl) confirmEl.textContent = `₹${num.toLocaleString('en-IN')}`;
}

// 6. Generate Official Contribution Receipt
function handleGenerateReceipt(e) {
  e.preventDefault();
  const donorName = document.getElementById('donorName').value || 'Alumni Member';
  const donorBatch = parseInt(document.getElementById('donorBatch').value) || 2008;
  const donorHouse = document.getElementById('donorHouse').value;
  const donorPhone = document.getElementById('donorPhone').value || '+91 9876543210';
  const donorCause = document.getElementById('donorCause').value;
  const donorUtr = document.getElementById('donorUtr').value.trim();
  const confirmed = document.getElementById('donorConfirmedPayment').checked;
  const amount = AppState.donationAmount || 5000;

  if (!donorUtr) {
    showToast("Please enter Bank UTR / UPI Reference ID to verify payment.");
    document.getElementById('donorUtr').focus();
    return;
  }

  if (!confirmed) {
    showToast("Please check the confirmation box verifying payment transfer.");
    return;
  }

  const newTxn = {
    id: `TXN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    name: donorName, batch: donorBatch, house: donorHouse.split(' ')[0],
    phone: donorPhone, cause: donorCause, amount: amount,
    utr: donorUtr,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Verified'
  };

  AppState.contributions.unshift(newTxn);
  saveAppData();
  renderContributionLedger();

  document.getElementById('recDonorName').textContent = donorName;
  document.getElementById('recBatch').textContent = `Batch of ${donorBatch}`;
  document.getElementById('recHouse').textContent = donorHouse;
  document.getElementById('recPhone').textContent = donorPhone;
  document.getElementById('recCause').textContent = donorCause;
  document.getElementById('recAmountValue').textContent = `₹${amount.toLocaleString('en-IN')}.00`;
  document.getElementById('recNumber').textContent = `JNVG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById('recDate').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('recAmountInWords').textContent = `Indian Rupees ${inWords(amount)} Only`;
  
  const recUtrEl = document.getElementById('recUtr');
  if (recUtrEl) recUtrEl.textContent = donorUtr;

  openModal('receiptModal');
  showToast(`Payment confirmed & official receipt issued for ₹${amount.toLocaleString('en-IN')}!`);
}

function inWords(num) {
  const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if ((num = num.toString()).length > 9) return 'Large Amount';
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim();
}

// 7. Batch-Wise Contribution Ledger
function renderContributionLedger() {
  const tbody = document.getElementById('contributionLedgerBody');
  if (!tbody) return;

  const filterBatch = document.getElementById('ledgerBatchFilter') ? document.getElementById('ledgerBatchFilter').value : 'all';
  const search = document.getElementById('ledgerSearchInput') ? document.getElementById('ledgerSearchInput').value.toLowerCase() : '';

  let totalAmount = 0;
  const batchCounts = {};

  AppState.contributions.forEach(item => {
    totalAmount += item.amount;
    batchCounts[item.batch] = (batchCounts[item.batch] || 0) + item.amount;
  });

  const totalAmountEl = document.getElementById('ledgerTotalAmount');
  const donorCountEl = document.getElementById('ledgerDonorCount');
  const topBatchEl = document.getElementById('ledgerTopBatch');

  if (totalAmountEl) totalAmountEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
  if (donorCountEl) donorCountEl.textContent = `${AppState.contributions.length} Donors`;

  let topB = "—";
  let maxB = 0;
  for (let b in batchCounts) {
    if (batchCounts[b] > maxB) { maxB = batchCounts[b]; topB = b; }
  }
  if (topBatchEl) topBatchEl.textContent = maxB > 0 ? `${topB} (₹${maxB.toLocaleString('en-IN')})` : '—';

  tbody.innerHTML = '';

  const filtered = AppState.contributions.filter(item => {
    const matchBatch = (filterBatch === 'all' || item.batch.toString() === filterBatch);
    const matchSearch = item.name.toLowerCase().includes(search) || item.utr.toLowerCase().includes(search) || item.cause.toLowerCase().includes(search);
    return matchBatch && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-500 font-sans">No verified contributions recorded yet. Verified donations will be listed here with audited transparency.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-800/40 transition font-sans";
    tr.innerHTML = `
      <td class="py-3 px-4 font-semibold text-white flex items-center gap-2">
        <span>${item.name}</span>
        ${item.batch === 1996 ? '<span class="px-1.5 py-0.2 text-[9px] bg-amber-500 text-slate-950 font-bold rounded">Host</span>' : ''}
      </td>
      <td class="py-3 px-4 text-slate-300 font-mono">${item.batch}</td>
      <td class="py-3 px-4 text-slate-400">${item.house}</td>
      <td class="py-3 px-4 text-slate-300 text-xs">${item.cause}</td>
      <td class="py-3 px-4 font-mono text-emerald-400 text-xs">${item.utr}</td>
      <td class="py-3 px-4 text-slate-400 text-xs">${item.date}</td>
      <td class="py-3 px-4 text-right font-mono font-bold text-amber-300">₹${item.amount.toLocaleString('en-IN')}</td>
      <td class="py-3 px-4 text-center">
        <button onclick="openReceiptForTxn('${item.id}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gold-400 hover:text-gold-300 text-[11px] font-semibold border border-slate-700">Receipt</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterContributionLedger() { renderContributionLedger(); }

function openReceiptForTxn(txnId) {
  const item = AppState.contributions.find(c => c.id === txnId);
  if (!item) return;
  document.getElementById('recDonorName').textContent = item.name;
  document.getElementById('recBatch').textContent = `Batch of ${item.batch}`;
  document.getElementById('recHouse').textContent = item.house;
  document.getElementById('recPhone').textContent = item.phone || '+91 9876543210';
  document.getElementById('recCause').textContent = item.cause;
  document.getElementById('recAmountValue').textContent = `₹${item.amount.toLocaleString('en-IN')}.00`;
  document.getElementById('recNumber').textContent = `JNVG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById('recDate').textContent = item.date;
  document.getElementById('recAmountInWords').textContent = `Indian Rupees ${inWords(item.amount)} Only`;
  const recUtrEl = document.getElementById('recUtr');
  if (recUtrEl) recUtrEl.textContent = item.utr;
  openModal('receiptModal');
}

// 8. Modals
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// 9. Copy to Clipboard
function copyToClipboard(elementId, msg) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg || 'Copied to clipboard!');
  }).catch(() => {
    const temp = document.createElement("input");
    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showToast(msg || 'Copied to clipboard!');
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = "toast-notification fixed bottom-5 right-5 bg-gold-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl z-50 flex items-center gap-2";
  toast.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// 10. RSVP
function handleRsvpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('rsvpName').value;
  const batch = parseInt(document.getElementById('rsvpBatch').value) || 2008;
  const house = document.getElementById('rsvpHouse').value;
  const city = document.getElementById('rsvpCity').value;
  const family = document.getElementById('rsvpFamily').value;

  const newRsvp = { id: Date.now(), name, batch, house: house.split(' ')[0], city, family, role: "Alumni Member", status: "Confirmed" };

  AppState.rsvps.unshift(newRsvp);
  saveAppData();
  renderRsvpTable();
  closeModal('rsvpModal');
  showToast(`RSVP Confirmed for ${name}! See you on 13 Dec 2026.`);
}

function renderRsvpTable() {
  const tbody = document.getElementById('rsvpTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!AppState.rsvps || AppState.rsvps.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500 font-sans">No confirmed attendees yet. Be the first to confirm attendance for the 4th Mega Meet!</td></tr>';
    return;
  }

  const houseColors = {
    Arawali: 'bg-red-950 text-red-300 border border-red-500/40',
    Aravali: 'bg-red-950 text-red-300 border border-red-500/40',
    Shivalik: 'bg-blue-950 text-blue-300 border border-blue-500/40',
    Udaigiri: 'bg-yellow-950 text-yellow-300 border border-yellow-500/40',
    Udaygiri: 'bg-yellow-950 text-yellow-300 border border-yellow-500/40',
    Nilgiri: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40',
    Neelgiri: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
  };

  AppState.rsvps.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-800/40 transition";
    const hColor = houseColors[item.house] || 'bg-slate-800 text-slate-300';
    tr.innerHTML = `
      <td class="py-3 px-4 font-semibold text-white flex items-center gap-2">
        <span>${item.name}</span>
        ${item.batch === 1996 ? '<span class="px-1.5 py-0.2 text-[9px] bg-amber-500 text-slate-950 font-bold rounded">Host</span>' : ''}
      </td>
      <td class="py-3 px-4 text-slate-300">${item.batch}</td>
      <td class="py-3 px-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${hColor}">${item.house}</span></td>
      <td class="py-3 px-4 text-slate-300">${item.city}</td>
      <td class="py-3 px-4 text-slate-400">${item.family}</td>
      <td class="py-3 px-4"><span class="text-emerald-400 font-bold flex items-center gap-1">✓ Confirmed</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterRsvpTable() {
  const query = document.getElementById('rsvpSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#rsvpTableBody tr');
  rows.forEach(r => { const text = r.textContent.toLowerCase(); r.style.display = text.includes(query) ? '' : 'none'; });
}

// 11. Community Feed
function previewStoryImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      attachedStoryPhoto = e.target.result;
      const preview = document.getElementById('storyImagePreview');
      const container = document.getElementById('storyImagePreviewContainer');
      if (preview && container) { preview.src = e.target.result; container.classList.remove('hidden'); }
    };
    reader.readAsDataURL(file);
  }
}

function selectPresetStoryImage(url) {
  attachedStoryPhoto = url;
  const preview = document.getElementById('storyImagePreview');
  const container = document.getElementById('storyImagePreviewContainer');
  if (preview && container) { preview.src = url; container.classList.remove('hidden'); }
  showToast("Campus archival photo attached!");
}

function removeStoryImage() {
  attachedStoryPhoto = null;
  const preview = document.getElementById('storyImagePreview');
  const container = document.getElementById('storyImagePreviewContainer');
  const input = document.getElementById('storyImageInput');
  if (preview) preview.src = "";
  if (container) container.classList.add('hidden');
  if (input) input.value = "";
}

function handleStorySubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('storyCategory').value;
  const text = (document.getElementById('storyText').value || '').trim();
  if (!text) return;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null) || { name: "Alumni Member", batch: 2008, house: "Aravali" };
  const initials = curUser.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NV';
  const isTeacher = curUser.role === 'teacher';
  const postTag = isTeacher ? '🪔 गुरु शुभाशीष / Faculty Blessing' : (cat.charAt(0).toUpperCase() + cat.slice(1));

  const newPost = {
    id: "pst-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
    author: curUser.name,
    batch: curUser.batch || (isTeacher ? 'Gurujan' : 2008),
    house: curUser.house || "Campus",
    initials: initials,
    authorPhoto: curUser.photo || null,
    authorRole: curUser.role || 'member',
    isTeacher: isTeacher,
    roleTitle: curUser.roleTitle || (isTeacher ? 'Revered Faculty' : 'Verified Alumnus'),
    time: "Just now",
    content: text,
    category: isTeacher ? 'teacher_blessing' : cat,
    tag: postTag,
    likes: 0,
    image: attachedStoryPhoto || null,
    imageCaption: attachedStoryPhoto ? `${curUser.name}'s Memory` : null,
    comments: []
  };

  if (!AppState.feedPosts) AppState.feedPosts = [];
  AppState.feedPosts.unshift(newPost);
  saveAppData();

  if (window.AlumniStorageEngine) {
    window.AlumniStorageEngine.putItem('posts', newPost);
  }

  feedCurrentPage = 1;
  renderFeed();

  removeStoryImage();
  document.getElementById('storyText').value = '';
  closeModal('storyModal');
  showToast('🎉 Your memory has been posted live to the Memory Wall!');
}



let feedCurrentPage = 1;
const FEED_PAGE_SIZE = 10;
let feedActiveCategory = 'all';

function renderFeed(append = false) {
  const container = document.getElementById('feedPostsStream');
  if (!container) return;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null) || {};
  const canDeleteAll = ['admin', 'batch_admin', 'host', 'moderator'].includes(curUser.role);

  const posts = AppState.feedPosts || [];
  const filtered = feedActiveCategory === 'all' ? posts : posts.filter(p => p.category === feedActiveCategory);

  if (!append) {
    container.innerHTML = '';
  }

  const existingLoadMore = document.getElementById('btnLoadMoreFeed');
  if (existingLoadMore) existingLoadMore.remove();

  const totalFiltered = filtered.length;
  const sliceEnd = feedCurrentPage * FEED_PAGE_SIZE;
  const visibleSlice = filtered.slice(append ? (feedCurrentPage - 1) * FEED_PAGE_SIZE : 0, sliceEnd);

  if (!append && totalFiltered === 0) {
    container.innerHTML = '<div class="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">No memories in this category yet. Be the first to share one!</div>';
    return;
  }

  visibleSlice.forEach(post => {
    const isTeacherPost = post.isTeacher || post.authorRole === 'teacher';
    const article = document.createElement('article');
    article.id = 'feed-card-' + post.id;
    article.className = isTeacherPost 
      ? "bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-5 hover:border-amber-400/60 transition space-y-3 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
      : "bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-3";
    article.setAttribute('data-category', post.category);

    const canDeleteThis = canDeleteAll || (curUser.name && curUser.name.toLowerCase() === (post.author || '').toLowerCase());

    let imageHtml = '';
    if (post.image) {
      imageHtml = `
        <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 mt-2 cursor-pointer group" onclick="openImageModal('${post.image}', '${post.tag || 'Campus Memory'}')">
          <img src="${post.image}" alt="Campus Memory" loading="lazy" class="w-full max-h-72 object-cover group-hover:scale-105 transition duration-500">
          ${post.imageCaption ? `<div class="p-2 text-[11px] text-slate-400 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between"><span>📷 ${post.imageCaption}</span><span class="text-amber-400">Click to view</span></div>` : ''}
        </div>
      `;
    }

    let commentsHtml = '';
    if (post.comments && post.comments.length > 0) {
      commentsHtml = `
        <div id="comment-box-${post.id}" class="hidden pt-3 border-t border-slate-800 space-y-2 text-xs">
          ${post.comments.map(c => `
            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <strong class="text-amber-400">${c.author}:</strong> 
              <span class="text-slate-300 ml-1">${c.text}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    const authorRoleBadge = isTeacherPost 
      ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">Gurujan</span>` 
      : '';

    const authorSubtext = isTeacherPost
      ? `<p class="text-[10px] text-amber-300/90 font-medium">${post.roleTitle || 'Revered Faculty'} • ${post.house} House</p>`
      : `<p class="text-[10px] text-slate-400">Batch of ${post.batch} • ${post.house} House</p>`;

    const tagBadge = isTeacherPost
      ? `<span class="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${post.tag || 'Guru Sandesh'}</span>`
      : `<span class="text-[10px] text-slate-500">${post.tag || 'Memories'}</span>`;

    article.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          ${post.authorPhoto 
            ? `<img src="${post.authorPhoto}" alt="${post.author}" class="w-10 h-10 rounded-full object-cover border ${isTeacherPost ? 'border-amber-400' : 'border-amber-500/40'} shadow-sm flex-shrink-0">` 
            : `<div class="w-10 h-10 rounded-full ${isTeacherPost ? 'bg-amber-950 border border-amber-500/50 text-amber-300' : 'bg-blue-950 border border-blue-500/30 text-blue-400'} flex items-center justify-center font-bold text-xs flex-shrink-0">${post.initials || 'NV'}</div>`}
          <div>
            <h4 class="text-xs font-bold ${isTeacherPost ? 'text-amber-300' : 'text-slate-100'} flex items-center gap-1.5">
              ${isTeacherPost ? '<span>🪔</span>' : ''}
              <span>${post.author}</span>
              ${authorRoleBadge}
            </h4>
            ${authorSubtext}
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${tagBadge}
          ${canDeleteThis ? `
            <button onclick="deleteFeedPost('${post.id}')" class="text-rose-400 hover:text-rose-300 transition flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20" title="Delete Post (Moderator / Admin / Author Authority)">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Delete</span>
            </button>
          ` : ''}
        </div>
      </div>
      <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-hindi">"${post.content}"</p>
      ${imageHtml}
      <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div class="flex items-center space-x-4">
          <button onclick="likePost(this)" class="flex items-center gap-1.5 hover:text-red-400 transition">
            <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
            <span class="like-count font-mono">${post.likes}</span>
          </button>
          <button onclick="toggleComments('comment-box-${post.id}')" class="flex items-center gap-1.5 hover:text-slate-200 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>${post.comments ? post.comments.length : 0} Comments</span>
          </button>
        </div>
        <button onclick="shareLink('JNV Gauriganj Memory')" class="hover:text-amber-400 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </button>
      </div>
      ${commentsHtml}
    `;
    container.appendChild(article);
  });

  if (sliceEnd < totalFiltered) {
    const loadBtn = document.createElement('div');
    loadBtn.id = 'btnLoadMoreFeed';
    loadBtn.className = "text-center pt-4";
    loadBtn.innerHTML = `
      <button onclick="loadMoreFeed()" class="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 shadow-md">
        Load More Memories (Showing ${Math.min(sliceEnd, totalFiltered)} of ${totalFiltered}) ↓
      </button>
    `;
    container.appendChild(loadBtn);
  }
}

function loadMoreFeed() {
  feedCurrentPage += 1;
  renderFeed(true);
}

function deleteFeedPost(postId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null) || {};
  const canDeleteAll = ['admin', 'batch_admin', 'host', 'moderator'].includes(curUser.role);
  const postIndex = (AppState.feedPosts || []).findIndex(p => p.id === postId);
  if (postIndex === -1) return;
  const post = AppState.feedPosts[postIndex];

  if (!canDeleteAll && (post.author || '').toLowerCase() !== (curUser.name || '').toLowerCase()) {
    showToast('Permission denied. You can only delete your own memories.');
    return;
  }

  if (confirm('Are you sure you want to remove this post from the Memory Wall?')) {
    AppState.feedPosts.splice(postIndex, 1);
    saveAppData();
    if (window.AlumniStorageEngine) {
      window.AlumniStorageEngine.deleteFromStore('posts', postId);
    }
    renderFeed();
    showToast('Post removed successfully.');
  }
}

function likePost(btn) {
  const counter = btn.querySelector('.like-count');
  let val = parseInt(counter.textContent) || 0;
  counter.textContent = val + 1;
  btn.classList.add('text-red-400');
  showToast("Liked post!");
}

function toggleComments(id) {
  const box = document.getElementById(id);
  if (box) box.classList.toggle('hidden');
}

function shareLink(title) {
  if (navigator.share) { navigator.share({ title: title, url: window.location.href }); }
  else { copyToClipboard('bankAccVal', 'Portal URL link copied!'); }
}

function filterFeed(cat) {
  document.querySelectorAll('.feed-filter-btn').forEach(b => {
    b.classList.remove('active', 'bg-brand-700', 'text-white');
    b.classList.add('bg-slate-800', 'text-slate-300');
  });
  if (event && event.target) {
    event.target.classList.add('active', 'bg-brand-700', 'text-white');
    event.target.classList.remove('bg-slate-800', 'text-slate-300');
  }
  const articles = document.querySelectorAll('#feedPostsStream article');
  articles.forEach(art => {
    if (cat === 'all' || art.getAttribute('data-category') === cat) { art.style.display = 'block'; }
    else { art.style.display = 'none'; }
  });
}

// 12. Registration & Approval
let modalUploadedPhoto = null;

function previewModalRegPhoto(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (typeof compressProfileImage === 'function') {
    compressProfileImage(file, (dataUrl) => {
      if (dataUrl) {
        modalUploadedPhoto = dataUrl;
        const previewImg = document.getElementById('modalRegPhotoPreview');
        const placeholder = document.getElementById('modalRegPhotoPlaceholder');
        const removeBtn = document.getElementById('modalRegPhotoRemoveBtn');
        if (previewImg) { previewImg.src = dataUrl; previewImg.classList.remove('hidden'); }
        if (placeholder) placeholder.classList.add('hidden');
        if (removeBtn) removeBtn.classList.remove('hidden');
      }
    });
  } else {
    const reader = new FileReader();
    reader.onload = (ev) => {
      modalUploadedPhoto = ev.target.result;
      const previewImg = document.getElementById('modalRegPhotoPreview');
      const placeholder = document.getElementById('modalRegPhotoPlaceholder');
      const removeBtn = document.getElementById('modalRegPhotoRemoveBtn');
      if (previewImg) { previewImg.src = ev.target.result; previewImg.classList.remove('hidden'); }
      if (placeholder) placeholder.classList.add('hidden');
      if (removeBtn) removeBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

function removeModalRegPhoto() {
  modalUploadedPhoto = null;
  const input = document.getElementById('modalRegPhotoInput');
  const previewImg = document.getElementById('modalRegPhotoPreview');
  const placeholder = document.getElementById('modalRegPhotoPlaceholder');
  const removeBtn = document.getElementById('modalRegPhotoRemoveBtn');
  if (input) input.value = '';
  if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  if (removeBtn) removeBtn.classList.add('hidden');
}

let pendingIndexReg = null;

function openIndexWhatsAppOtp() {
  if (pendingIndexReg && pendingIndexReg.otp && typeof sendMobileSmsOtp === 'function') {
    const dispatch = sendMobileSmsOtp(pendingIndexReg.phone, pendingIndexReg.otp, 'registration');
    window.open(dispatch.waUrl, '_blank');
  } else if (window._lastSmsOtpDispatch && window._lastSmsOtpDispatch.waUrl) {
    window.open(window._lastSmsOtpDispatch.waUrl, '_blank');
  }
}

function openIndexDeviceSmsOtp() {
  if (pendingIndexReg && pendingIndexReg.otp && typeof sendMobileSmsOtp === 'function') {
    const dispatch = sendMobileSmsOtp(pendingIndexReg.phone, pendingIndexReg.otp, 'registration');
    window.location.href = dispatch.smsUrl;
  } else if (window._lastSmsOtpDispatch && window._lastSmsOtpDispatch.smsUrl) {
    window.location.href = window._lastSmsOtpDispatch.smsUrl;
  }
}

function autoFillIndexOtp() {
  if (pendingIndexReg && pendingIndexReg.otp) {
    const input = document.getElementById('indexOtpInput');
    if (input) input.value = pendingIndexReg.otp;
  }
}

function copyIndexOtp() {
  if (pendingIndexReg && pendingIndexReg.otp) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pendingIndexReg.otp);
    }
    alert(`✓ Copied OTP ${pendingIndexReg.otp} to clipboard.`);
  }
}

function handleRegistrationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const batch = parseInt(document.getElementById('regBatch').value) || 2011;
  const house = document.getElementById('regHouse').value;
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const role = document.getElementById('regRole').value.trim();
  const domain = document.getElementById('regDomain').value;
  const city = document.getElementById('regCity').value.trim();

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

  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  const maskedPhone = `+91 ******${cleanPhone.slice(-4)}`;

  pendingIndexReg = {
    name, batch, house, phone, email, role, domain, city, password,
    photo: modalUploadedPhoto || null,
    otp: otpRes.otp
  };

  const targetEmailEl = document.getElementById('indexOtpTargetEmail');
  const targetPhoneEl = document.getElementById('indexOtpTargetPhone');
  const previewEl = document.getElementById('indexLiveOtpPreview');
  const inputEl = document.getElementById('indexOtpInput');
  const errEl = document.getElementById('indexOtpError');

  if (targetEmailEl) targetEmailEl.textContent = email;
  if (targetPhoneEl) targetPhoneEl.textContent = maskedPhone;
  if (previewEl) previewEl.textContent = `OTP: ${otpRes.otp}`;
  if (inputEl) inputEl.value = '';
  if (errEl) errEl.classList.add('hidden');

  closeModal('registerModal');
  openModal('indexOtpModal');
}

function handleVerifyIndexOtp(e) {
  e.preventDefault();
  const enteredOtp = (document.getElementById('indexOtpInput').value || '').trim();
  const errEl = document.getElementById('indexOtpError');

  if (!pendingIndexReg) {
    if (errEl) {
      errEl.textContent = "Registration session expired. Please refill registration form.";
      errEl.classList.remove('hidden');
    }
    return;
  }

  if (typeof verifyOtp === 'function') {
    const check = verifyOtp(pendingIndexReg.email, enteredOtp, 'registration');
    if (!check.success) {
      if (errEl) {
        errEl.textContent = `⚠️ Verification Failed: ${check.message}`;
        errEl.classList.remove('hidden');
      }
      return;
    }
  }

  const { name, batch, house, phone, email, role, domain, city, password, photo } = pendingIndexReg;

  if (typeof registerAlumni === 'function') {
    registerAlumni({ name, batch, house, phone, email, profession: role, domain, city, password, photo });
  }

  const newReg = { id: `reg-${Date.now()}`, name, batch, house, phone, email, role, domain, city, photo, date: "Just now (Verified with 2FA OTP)" };

  AppState.pendingRegistrations.unshift(newReg);
  saveAppData();
  renderAdminRegistrations();
  updateQueueBadges();

  closeModal('indexOtpModal');
  pendingIndexReg = null;
  showToast(`🎉 2FA Verified! Registration submitted for ${name}. Forwarded to Batch Admin & Super Admin for approval.`);
}

function renderAdminRegistrations() {
  const container = document.getElementById('adminRegistrationsList');
  if (!container) return;

  if (AppState.pendingRegistrations.length === 0) {
    container.innerHTML = `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-xs">✓ No pending registrations. All alumni membership requests have been reviewed.</div>`;
    return;
  }

  container.innerHTML = '';
  AppState.pendingRegistrations.forEach(reg => {
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    card.id = reg.id;
    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">✓ 2FA Verified</span>
          <span class="text-sm font-bold text-white">${reg.name}</span>
          <span class="text-xs text-amber-400 font-mono">Batch ${reg.batch}</span>
          <span class="text-[10px] text-slate-500">• ${reg.house} House</span>
        </div>
        <p class="text-xs text-slate-300"><strong>Profession:</strong> ${reg.role} (${reg.domain}) • <strong>Location:</strong> ${reg.city}</p>
        <p class="text-[11px] text-slate-400"><strong>Contact:</strong> ${reg.phone} | ${reg.email}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="approveRegistration('${reg.id}')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Approve & Activate in Directory
        </button>
        <button onclick="rejectRegistration('${reg.id}')" class="px-3.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-bold text-xs flex items-center gap-1 transition">Decline</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function approveRegistration(regId) {
  const index = AppState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index === -1) return;

  const reg = AppState.pendingRegistrations[index];
  const initials = reg.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const newDirectoryEntry = { id: Date.now(), name: reg.name, initials: initials || "NV", batch: reg.batch, house: reg.house, role: reg.role, location: reg.city, domain: reg.domain, badge: `${reg.house}`, verified: true, tag: `Batch of ${reg.batch}` };

  AppState.directory.unshift(newDirectoryEntry);
  AppState.pendingRegistrations.splice(index, 1);
  saveAppData();

  try {
    if (typeof getAllUsers === 'function' && typeof saveAllUsers === 'function') {
      const users = getAllUsers();
      const u = users.find(x => x.id === reg.id || (x.email && x.email.toLowerCase() === (reg.email || '').toLowerCase()));
      if (u) { u.status = "approved"; u.roleTitle = "Verified Alumnus"; saveAllUsers(users); }
    }
  } catch(e) { console.warn("User status sync warning:", e); }

  renderDirectory();
  renderTeachers('all');
  renderHelpRequests('all');
  refreshInboxBadge();
  renderAdminRegistrations();
  updateQueueBadges();
  showToast(`Approved! ${reg.name} is now activated and live in the Alumni Directory.`);
}

function rejectRegistration(regId) {
  const index = AppState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index !== -1) {
    AppState.pendingRegistrations.splice(index, 1);
    saveAppData();
    renderAdminRegistrations();
    updateQueueBadges();
    showToast('Registration declined.');
  }
}

// 13. Directory
let dirCurrentPage = 1;
const DIR_PAGE_SIZE = 24;

function renderDirectory(append = false) {
  const grid = document.getElementById('directoryGrid');
  if (!grid) return;

  if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
    window.AlumniStorageEngine.buildCacheIndexes(AppState.directory || []);
  }

  const q = (document.getElementById('dirSearch') ? document.getElementById('dirSearch').value : '').trim();
  const batch = document.getElementById('dirBatchFilter') ? document.getElementById('dirBatchFilter').value : 'all';
  const house = document.getElementById('dirHouseFilter') ? document.getElementById('dirHouseFilter').value : 'all';
  const domain = document.getElementById('dirDomainFilter') ? document.getElementById('dirDomainFilter').value : 'all';

  let result;
  if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.queryDirectory === 'function') {
    result = window.AlumniStorageEngine.queryDirectory({
      query: q,
      batch: batch,
      house: house,
      domain: domain,
      page: dirCurrentPage,
      pageSize: DIR_PAGE_SIZE
    });
  } else {
    const filtered = (AppState.directory || []).filter(item => {
      const matchQ = !q || (item.name || '').toLowerCase().includes(q.toLowerCase()) || (item.role || '').toLowerCase().includes(q.toLowerCase());
      const matchBatch = (batch === 'all' || item.batch.toString() === batch);
      const matchHouse = (house === 'all' || item.house === house);
      const matchDomain = (domain === 'all' || (item.domain || '').includes(domain));
      return matchQ && matchBatch && matchHouse && matchDomain;
    });
    const totalCount = filtered.length;
    const startIndex = (dirCurrentPage - 1) * DIR_PAGE_SIZE;
    result = {
      items: filtered.slice(startIndex, startIndex + DIR_PAGE_SIZE),
      totalCount: totalCount,
      hasMore: startIndex + DIR_PAGE_SIZE < totalCount
    };
  }

  if (!append) {
    grid.innerHTML = '';
  }

  const existingLoadMore = document.getElementById('dirLoadMoreContainer');
  if (existingLoadMore) existingLoadMore.remove();

  const counterEl = document.getElementById('dirResultsCount');
  if (counterEl) {
    const shown = Math.min(dirCurrentPage * DIR_PAGE_SIZE, result.totalCount);
    counterEl.textContent = `Showing ${shown} of ${result.totalCount} Verified Alumni`;
  }

  if (!append && result.items.length === 0) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-2"><p class="text-slate-400 text-sm">No alumni records found matching the selected filters.</p><p class="text-xs text-slate-500">Please adjust your batch, house, or domain filters to view alumni.</p></div>';
    return;
  }

  const houseStyles = {
    Arawali: 'bg-red-950 text-red-300 border border-red-800',
    Aravali: 'bg-red-950 text-red-300 border border-red-800',
    Shivalik: 'bg-blue-950 text-blue-300 border border-blue-800',
    Udaigiri: 'bg-yellow-950 text-yellow-300 border border-yellow-800',
    Udaygiri: 'bg-yellow-950 text-yellow-300 border border-yellow-800',
    Nilgiri: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    Neelgiri: 'bg-emerald-950 text-emerald-300 border border-emerald-800'
  };
  const avatarStyles = {
    Arawali: 'bg-red-900/40 border-red-500/30 text-red-300',
    Aravali: 'bg-red-900/40 border-red-500/30 text-red-300',
    Shivalik: 'bg-blue-900/40 border-blue-500/30 text-blue-300',
    Udaigiri: 'bg-yellow-900/40 border-yellow-500/30 text-yellow-300',
    Udaygiri: 'bg-yellow-900/40 border-yellow-500/30 text-yellow-300',
    Nilgiri: 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300',
    Neelgiri: 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300'
  };

  result.items.forEach(item => {
    const card = document.createElement('div');
    card.className = "dir-card bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-3";
    card.setAttribute('data-name', item.name);
    card.setAttribute('data-batch', item.batch);
    card.setAttribute('data-house', item.house);
    card.setAttribute('data-domain', item.domain);

    const hClass = houseStyles[item.house] || 'bg-slate-800 text-slate-300';
    const aClass = avatarStyles[item.house] || 'bg-slate-800 text-slate-300';

    const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
    const isCurAdmin = curUser && curUser.role === 'admin';
    const isCurHost = curUser && (curUser.role === 'host' || curUser.role === 'batch_admin');
    const targetSystemRole = item.systemRole || getUserSystemRole(item.name) || 'member';

    let roleControlHtml = '';
    if (isCurAdmin) {
      roleControlHtml = `
        <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Role Admin:</span>
          <select onchange="changeUserRole('${item.name}', this.value)" class="bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] text-amber-300 font-bold focus:outline-none focus:border-amber-500">
            <option value="member" ${targetSystemRole === 'member' ? 'selected' : ''}>Member</option>
            <option value="moderator" ${targetSystemRole === 'moderator' ? 'selected' : ''}>Moderator</option>
            <option value="host" ${targetSystemRole === 'host' || targetSystemRole === 'batch_admin' ? 'selected' : ''}>Host</option>
            <option value="teacher" ${targetSystemRole === 'teacher' ? 'selected' : ''}>Teacher / Gurujan</option>
          </select>
        </div>
      `;
    } else if (isCurHost) {
      if (targetSystemRole === 'member') {
        roleControlHtml = `
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span class="text-[10px] text-slate-400 font-semibold">Host Delegation:</span>
            <button onclick="changeUserRole('${item.name}', 'moderator')" class="px-2 py-0.5 rounded bg-blue-900/50 hover:bg-blue-900/80 text-blue-200 border border-blue-500/30 text-[10px] font-bold transition">
              + Make Moderator
            </button>
          </div>
        `;
      } else if (targetSystemRole === 'moderator') {
        roleControlHtml = `
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span class="text-[10px] text-blue-400 font-semibold">Moderator</span>
            <button onclick="changeUserRole('${item.name}', 'member')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-semibold transition">
              Demote to Member
            </button>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          ${item.photo 
            ? `<img src="${item.photo}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm flex-shrink-0">` 
            : `<div class="w-12 h-12 rounded-xl border flex items-center justify-center font-bold flex-shrink-0 ${aClass}">${item.initials || 'NV'}</div>`}
          <div>
            <h4 class="text-sm font-bold text-white">${item.name}</h4>
            <span class="text-xs text-amber-400 font-medium">${item.tag || `Batch of ${item.batch}`}</span>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hClass}">${item.house}</span>
      </div>
      <div class="text-xs text-slate-300 space-y-1">
        <p><strong class="text-slate-400">Role:</strong> ${item.role}</p>
        <p><strong class="text-slate-400">Location:</strong> ${item.location}</p>
        <p><strong class="text-slate-400">Domain:</strong> ${item.domain}</p>
      </div>
      <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <span class="text-slate-300">Phone Protected</span> • <span class="text-emerald-400">Verified</span>
        </span>
        <div class="flex items-center gap-2">
          <button onclick="openChatWithAlumnus('${item.name}')" class="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center gap-1 transition">
            <span>💬</span> <span>Message</span>
          </button>
          <button onclick="showToast('🔒 Privacy Protected: Alumni phone numbers are confidential. Direct peer message initiated via portal.')" class="text-gold-400 hover:text-gold-300 font-semibold text-xs flex items-center gap-1">Connect →</button>
        </div>
      </div>
      ${roleControlHtml}
    `;
    grid.appendChild(card);
  });

  if (result.hasMore) {
    const moreContainer = document.createElement('div');
    moreContainer.id = 'dirLoadMoreContainer';
    moreContainer.className = "col-span-full text-center py-6";
    moreContainer.innerHTML = '<button onclick="loadMoreDirectory()" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition">Load More Alumni (+24) ↓</button>';
    grid.appendChild(moreContainer);
  }
}

function loadMoreDirectory() {
  dirCurrentPage += 1;
  renderDirectory(true);
}

const debouncedFilterDirectory = (window.AlumniStorageEngine && window.AlumniStorageEngine.debounce)
  ? window.AlumniStorageEngine.debounce(() => { dirCurrentPage = 1; renderDirectory(false); }, 180)
  : () => { dirCurrentPage = 1; renderDirectory(false); };

function filterDirectory() {
  debouncedFilterDirectory();
}

function resetDirectoryFilters() {
  if (document.getElementById('dirSearch')) document.getElementById('dirSearch').value = '';
  if (document.getElementById('dirBatchFilter')) document.getElementById('dirBatchFilter').value = 'all';
  if (document.getElementById('dirHouseFilter')) document.getElementById('dirHouseFilter').value = 'all';
  if (document.getElementById('dirDomainFilter')) document.getElementById('dirDomainFilter').value = 'all';
  dirCurrentPage = 1;
  renderDirectory(false);
}

// 14. Notable Messages
function renderNotableMessages() {
  const container = document.getElementById('notableQuotesContainer');
  if (!container) return;
  container.innerHTML = '';
  AppState.notableMessages.forEach(msg => {
    const card = document.createElement('div');
    card.className = "bg-gradient-to-br from-slate-900 to-slate-950 border border-gold-500/30 p-5 rounded-2xl relative shadow-lg";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div>
          <span class="text-xs font-bold text-amber-300 block">${msg.author}</span>
          <span class="text-[10px] text-slate-400 font-medium">${msg.role} • Batch ${msg.batch}</span>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">★ Key Guidance</span>
      </div>
      <p class="text-xs text-slate-200 italic leading-relaxed">"${msg.quote}"</p>
    `;
    container.appendChild(card);
  });
}

function handleNotableMessageSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('notableName').value.trim();
  const batch = parseInt(document.getElementById('notableBatch').value) || 1996;
  const role = document.getElementById('notableRole').value.trim();
  const quote = document.getElementById('notableQuote').value.trim();

  const newMsg = { id: Date.now(), author: name, batch, role, quote };
  AppState.notableMessages.unshift(newMsg);
  saveAppData();
  renderNotableMessages();
  closeModal('notableMessageModal');
  showToast(`Guidance message from ${name} published on Hall of Distinction!`);
}

// 15. Admin Moderation
function approveQueueItem(id, successMsg) {
  const index = AppState.queueItems.findIndex(i => i.id === id);
  if (index !== -1) {
    const item = AppState.queueItems[index];
    if (item.type === "Memory Story") {
      const newFeedPost = { id: Date.now(), author: item.author.split('(')[0].trim(), initials: "AK", batch: "2011", house: "Aravali", category: item.category || "assembly", tag: "Approved Memory", content: item.text, image: item.image || null, likes: 1, comments: [] };
      AppState.feedPosts.unshift(newFeedPost);
      renderFeed();
    }
    AppState.queueItems.splice(index, 1);
    saveAppData();
    renderAdminQueue();
    updateQueueBadges();
    showToast(successMsg || 'Approved & Published!');
  }
}

function rejectQueueItem(id) {
  const index = AppState.queueItems.findIndex(i => i.id === id);
  if (index !== -1) {
    AppState.queueItems.splice(index, 1);
    saveAppData();
    renderAdminQueue();
    updateQueueBadges();
    showToast('Submission removed from moderation queue.');
  }
}

function renderAdminQueue() {
  const container = document.getElementById('adminQueueList');
  if (!container) return;

  if (AppState.queueItems.length === 0) {
    container.innerHTML = `<div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs">✓ Moderation queue is clear! All stories and cultural acts have been reviewed.</div>`;
    return;
  }

  container.innerHTML = '';
  AppState.queueItems.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    card.id = item.id;
    let imgPreview = '';
    if (item.image) { imgPreview = `<div class="mt-2 w-28 h-20 rounded-lg overflow-hidden border border-slate-700"><img src="${item.image}" alt="Attached preview" class="w-full h-full object-cover"></div>`; }
    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/40 text-blue-300">${item.type}</span>
          <span class="text-xs font-bold text-white">${item.author}</span>
          <span class="text-[10px] text-slate-500">• ${item.time}</span>
        </div>
        <p class="text-xs text-slate-300 italic">"${item.text}"</p>
        ${imgPreview}
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="approveQueueItem('${item.id}', 'Item approved and published!')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Approve
        </button>
        <button onclick="rejectQueueItem('${item.id}')" class="px-3.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-bold text-xs flex items-center gap-1 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          Reject
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateQueueBadges() {
  const contentCount = AppState.queueItems.length;
  const regCount = AppState.pendingRegistrations.length;
  const countBadge = document.getElementById('queueBadgeCount');
  const countText = document.getElementById('pendingQueueCountText');
  const regCountText = document.getElementById('pendingRegCountText');
  if (countBadge) countBadge.textContent = contentCount + regCount;
  if (countText) countText.textContent = `${contentCount} Pending Items`;
  if (regCountText) regCountText.textContent = `${regCount} Pending Approval${regCount === 1 ? '' : 's'}`;
}

// 16. Countdown: Days To Go
function updateCountdown() {
  const targetDate = new Date('2026-12-13T09:00:00+05:30').getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;
  const dEl = document.getElementById('cd-days');
  const boxEl = document.getElementById('cd-days-box');
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dEl) dEl.textContent = days;
  } else {
    if (boxEl) boxEl.innerHTML = `<span class="text-xl font-bold font-cinzel text-amber-300">🎉 Today is Meet Day!</span>`;
  }
}

// 17. Lightbox
function openImageModal(src, title) {
  const modal = document.getElementById('imageLightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  if (modal && img) { img.src = src; if (caption) caption.textContent = title || "JNV Gauriganj Archive Photo"; modal.classList.remove('hidden'); }
}
function closeImageModal() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) modal.classList.add('hidden');
}


// 19. Teachers & Mentors Engine
let currentTeacherFilter = 'all';

function renderTeachers(filter = 'all', searchQuery = '') {
  currentTeacherFilter = filter;
  const grid = document.getElementById('teachersGrid');
  if (!grid) return;

  const houseBadgeStyles = {
    Arawali: 'bg-rose-950/70 text-rose-300 border border-rose-500/30',
    Aravali: 'bg-rose-950/70 text-rose-300 border border-rose-500/30',
    Shivalik: 'bg-blue-950/70 text-blue-300 border border-blue-500/30',
    Udaigiri: 'bg-yellow-950/70 text-yellow-300 border border-yellow-500/30',
    Udaygiri: 'bg-yellow-950/70 text-yellow-300 border border-yellow-500/30',
    Nilgiri: 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30',
    Neelgiri: 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30',
    'Priyadarshni / Sarojini': 'bg-purple-950/70 text-purple-300 border border-purple-500/30',
    Administration: 'bg-amber-950/70 text-amber-300 border border-amber-500/30',
    All: 'bg-slate-800 text-slate-300 border border-slate-700'
  };

  const q = (searchQuery || (document.getElementById('teacherSearch') ? document.getElementById('teacherSearch').value : '')).toLowerCase().trim();

  const filtered = (AppState.teachers || []).filter(t => {
    let matchCat = true;
    if (filter === 'leadership') {
      matchCat = (t.category === 'current' || t.category === 'leadership' || (t.post && t.post.toLowerCase().includes('principal')) || (t.post && t.post.toLowerCase().includes('coordinator')));
    } else if (filter === 'former') {
      matchCat = (t.category === 'former' || (t.statusLabel && (t.statusLabel.toLowerCase().includes('retired') || t.statusLabel.toLowerCase().includes('superannuated') || t.statusLabel.toLowerCase().includes('transferred'))));
    } else if (filter === 'teaching' || filter === 'academic') {
      matchCat = (t.post && (t.post.includes('PGT') || t.post.includes('TGT') || t.post.toLowerCase().includes('teacher') || t.post.toLowerCase().includes('faculty') || t.post.toLowerCase().includes('teaching staff') || t.subject)) && !(t.post && (t.post.toLowerCase().includes('custodian') || t.post.toLowerCase().includes('caretaker') || t.post.toLowerCase().includes('mess')));
    } else if (filter === 'nonteaching' || filter === 'pastoral') {
      matchCat = (t.post && (t.post.includes('PET') || t.post.toLowerCase().includes('warden') || t.post.toLowerCase().includes('custodian') || t.post.toLowerCase().includes('caretaker') || t.post.toLowerCase().includes('mess') || t.post.toLowerCase().includes('non-teaching') || t.post.toLowerCase().includes('non teaching') || t.post.toLowerCase().includes('pastoral') || t.post.toLowerCase().includes('matron'))) || (t.category === 'pastoral') || (t.category === 'nonteaching');
    }

    if (!matchCat) return false;

    if (q) {
      const matchName = (t.name || '').toLowerCase().includes(q);
      const matchPost = (t.post || '').toLowerCase().includes(q);
      const matchSub = (t.subject || '').toLowerCase().includes(q);
      const matchHouse = (t.house || '').toLowerCase().includes(q);
      const matchMsg = (t.message || '').toLowerCase().includes(q);
      const matchNote = (t.specialNote || '').toLowerCase().includes(q);
      return matchName || matchPost || matchSub || matchHouse || matchMsg || matchNote;
    }
    return true;
  });

  // Strict Hierarchy Sorting: Current Principal (1), Current Vice Principal (2), Current Faculty Alumni Coordinator (3) MUST be on TOP!
  filtered.sort((a, b) => {
    const getLeadershipRank = (t) => {
      const p = (t.post || '').toLowerCase();
      const s = (t.statusLabel || '').toLowerCase();
      const isCur = t.category === 'current' || s.includes('current');
      if (isCur && p.includes('principal') && !p.includes('vice')) return 1; // Current Principal
      if (isCur && p.includes('vice principal')) return 2; // Current Vice Principal
      if (isCur && (p.includes('alumni') || (t.title || '').toLowerCase().includes('alumni') || p.includes('coordinator'))) return 3; // Current Faculty Alumni Coordinator
      if (isCur) return 4;
      return 10;
    };
    return getLeadershipRank(a) - getLeadershipRank(b);
  });

  document.querySelectorAll('.teacher-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-900', 'text-slate-300');
    } else {
      btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.add('bg-slate-900', 'text-slate-300');
    }
  });

  const countBadge = document.getElementById('teachersCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} Gurujan Listed`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-slate-900/60 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
        <p class="text-slate-400 text-sm">No teacher records found matching "${q}".</p>
        <button onclick="filterTeachers('all')" class="text-xs text-amber-400 underline font-semibold">View All Teachers</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = "bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl";

    const hClass = houseBadgeStyles[t.house] || 'bg-slate-800 text-slate-300 border border-slate-700';
    const statusBg = (t.statusLabel && t.statusLabel.toLowerCase().includes('principal'))
      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
      : (t.category === 'current' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700');

    card.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center space-x-3.5">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-cinzel font-bold text-amber-400 text-lg flex-shrink-0 shadow-inner">
              ${t.initials || t.name.split(' ').map(w => w[0]).filter(Boolean).slice(-2).join('')}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-bold font-cinzel text-white leading-tight">${t.name}</h3>
              </div>
              <p class="text-xs text-amber-300 font-medium mt-0.5">${t.post}</p>
              <p class="text-[11px] text-slate-400">${t.subject}</p>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBg} flex-shrink-0 whitespace-nowrap">
            ${t.statusLabel || (t.category === 'current' ? 'Current Faculty' : 'Former Faculty')}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
          <div class="bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 block text-[10px] font-semibold uppercase">Tenure</span>
            <span class="text-white font-medium">${t.tenure || 'JNV Gauriganj'}</span>
          </div>
          <div class="bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 block text-[10px] font-semibold uppercase">House / Role</span>
            <span class="text-amber-300 font-medium">${t.houseDetail || t.house || 'Campus-wide'}</span>
          </div>
        </div>

        ${t.location ? `<p class="text-[11px] text-slate-400 flex items-center gap-1.5"><span class="text-slate-500">📍 Current Base:</span> <span class="text-slate-300 font-medium">${t.location}</span></p>` : ''}

        ${t.message ? `
        <div class="bg-amber-500/5 border-l-2 border-amber-500/50 p-3.5 rounded-r-2xl space-y-1">
          <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🪔</span> <span>गुरु सन्देश एवं शुभाशीष</span>
          </div>
          <p class="text-xs text-slate-200 italic leading-relaxed">"${t.message}"</p>
        </div>` : ''}

        ${t.specialNote ? `
        <p class="text-[11px] text-slate-400 leading-relaxed"><strong class="text-slate-300 font-semibold">Distinction Note:</strong> ${t.specialNote}</p>` : ''}
      </div>

      <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
        <span class="text-[10px] text-amber-400 font-bold flex items-center gap-1">
          <span>🙏</span> <span>${t.respectCount || 0} Respects</span>
        </span>
        <div class="flex items-center gap-1.5">
          <button onclick="openChatWithTeacher('${t.id}')" class="px-2.5 py-1.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/70 border border-blue-500/40 text-blue-300 hover:text-white font-bold text-xs flex items-center gap-1 transition touch-ripple">
            <span>💬</span> <span>Send Message</span>
          </button>
          <button onclick="openPranamModal('${t.id}')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center gap-1 transition touch-ripple">
            <span>🙏</span> <span>चरण स्पर्श / Send Respect</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterTeachers(filter) {
  renderTeachers(filter);
}

function searchTeachers(query) {
  renderTeachers(currentTeacherFilter, query);
}

function openTeacherEnrollModal() {
  const modal = document.getElementById('teacherEnrollModal');
  if (modal) modal.classList.remove('hidden');
}

function closeTeacherEnrollModal() {
  const modal = document.getElementById('teacherEnrollModal');
  if (modal) modal.classList.add('hidden');
}

function handleTeacherEnrollment(e) {
  e.preventDefault();
  const name = document.getElementById('tchName').value.trim();
  const status = document.getElementById('tchStatus').value;
  const post = document.getElementById('tchPost').value.trim();
  const subject = document.getElementById('tchSubject').value.trim();
  const tenure = document.getElementById('tchTenure').value.trim();
  const house = document.getElementById('tchHouse').value;
  const location = document.getElementById('tchLocation').value.trim();
  const message = document.getElementById('tchMessage').value.trim();
  const phone = document.getElementById('tchPhone').value.trim();

  let category = 'former';
  let statusLabel = 'Former Faculty (Retired)';
  if (status === 'current') {
    category = 'current';
    statusLabel = 'Current Faculty';
  } else if (status === 'transferred') {
    category = 'former';
    statusLabel = 'Former Faculty (Transferred)';
  }

  const initials = name.replace(/^(Dr\.|Prof\.|Sh\.|Smt\.)\s*/i, '').split(' ').map(w => w[0]).filter(Boolean).slice(0, 3).join('').toUpperCase();

  const newTeacher = {
    id: `tch-${Date.now()}`,
    name,
    title: `${post} • ${subject}`,
    category,
    statusLabel,
    post,
    subject,
    tenure,
    house,
    houseDetail: house === 'All' ? 'Campus-wide Mentor' : `House Master - ${house}`,
    location,
    initials: initials || 'TCH',
    photo: null,
    message,
    phonePrivate: phone,
    specialNote: `Registered Gurujan of JNV Gauriganj (${tenure}).`
  };

  AppState.teachers.unshift(newTeacher);

  // Register Teacher Portal Login Account if email is provided
  const emailInput = document.getElementById('tchEmail');
  const passInput = document.getElementById('tchPassword');
  const tchEmail = emailInput ? emailInput.value.trim() : '';
  const tchPass = passInput && passInput.value.trim() ? passInput.value.trim() : 'password123';

  if (tchEmail) {
    const allUsers = typeof getAllUsers === 'function' ? getAllUsers() : [];
    const existingIdx = allUsers.findIndex(u => u.email.toLowerCase() === tchEmail.toLowerCase());
    const teacherAccount = {
      id: `usr-${newTeacher.id}`,
      email: tchEmail,
      password: tchPass,
      name: name,
      batch: tenure || 'Faculty',
      house: house || 'Administration',
      role: 'teacher',
      roleTitle: `Revered Gurujan • ${post}`,
      designation: `${post} (${subject})`,
      status: 'approved',
      phone: phone,
      city: location,
      profession: `${post} • ${subject}`,
      domain: 'Faculty Mentorship',
      avatar: initials || 'TCH',
      joinedDate: `Registered Faculty (${tenure})`
    };
    if (existingIdx !== -1) {
      allUsers[existingIdx] = { ...allUsers[existingIdx], ...teacherAccount };
    } else {
      allUsers.push(teacherAccount);
    }
    if (typeof saveAllUsers === 'function') saveAllUsers(allUsers);
  }

  // Automatically broadcast Guru Sandesh to the Memory Wall as a Revered Blessing
  if (message) {
    const teacherFeedPost = {
      id: `pst-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      author: name,
      batch: tenure || 'Gurujan',
      house: house || 'Campus',
      initials: initials || 'TCH',
      authorPhoto: null,
      authorRole: 'teacher',
      isTeacher: true,
      roleTitle: `${post} • ${subject}`,
      time: "Just now",
      content: message,
      category: 'teacher_blessing',
      tag: '🪔 गुरु शुभाशीष / Faculty Blessing',
      likes: 1,
      image: null,
      comments: []
    };
    if (!AppState.feedPosts) AppState.feedPosts = [];
    AppState.feedPosts.unshift(teacherFeedPost);
    renderFeed();
  }

  saveAppData();
  renderTeachers(currentTeacherFilter);
  closeTeacherEnrollModal();
  e.target.reset();
  showToast(`सादर नमन! Respected ${name} enrolled successfully. Guru Sandesh is now published on the Memory Wall.`);
}

let activePranamTeacher = null;
function openPranamModal(teacherId) {
  const t = (AppState.teachers || []).find(item => item.id === teacherId || item.name === teacherId);
  if (!t) return;
  activePranamTeacher = t;
  const titleEl = document.getElementById('pranamTeacherName');
  const postEl = document.getElementById('pranamTeacherPost');
  if (titleEl) titleEl.textContent = t.name;
  if (postEl) postEl.textContent = `${t.post} (${t.tenure})`;
  const modal = document.getElementById('teacherPranamModal');
  if (modal) modal.classList.remove('hidden');
}

function closePranamModal() {
  const modal = document.getElementById('teacherPranamModal');
  if (modal) modal.classList.add('hidden');
}

function submitTeacherPranam(e) {
  e.preventDefault();
  const sender = document.getElementById('pranamSenderName').value.trim();
  const batch = document.getElementById('pranamSenderBatch').value.trim();
  const msg = document.getElementById('pranamNote').value.trim();
  const teacher = activePranamTeacher;

  if (teacher) {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const msgs = getAllChatMessages();
    const newMsg = {
      id: "respect-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      senderId: curUser ? curUser.id : ('guest-' + Date.now()),
      senderName: sender || (curUser ? curUser.name : 'Alumnus'),
      senderBatch: batch || (curUser ? curUser.batch : 'Alumni'),
      recipientId: teacher.id,
      recipientName: teacher.name,
      recipientBatch: teacher.post || 'Faculty',
      text: `🙏 [चरण स्पर्श एवं सादर प्रणाम / Respect]: ${msg || 'सादर प्रणाम गुरुजी! Batch of ' + (batch || 'Alumni') + ' sends their utmost reverence and respects.'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      type: 'respect',
      read: false
    };
    msgs.push(newMsg);
    saveAllChatMessages(msgs);

    teacher.respectCount = (teacher.respectCount || 0) + 1;
    saveAppData();
    renderTeachers(currentTeacherFilter);
    refreshInboxBadge();
  }

  closePranamModal();
  e.target.reset();
  showToast(`🙏 सादर प्रणाम प्रेषित! Your respectful regards from Batch of ${batch} have been conveyed to ${teacher ? teacher.name : 'Guruji'}.`);
}

function openChatWithTeacher(teacherId) {
  const teacher = (AppState.teachers || []).find(t => t.id === teacherId || t.name === teacherId);
  if (!teacher) return;
  openChatModal(teacher.name);
}



// ========================================================
// 20. ALUMNI CHAT & INBOX ENGINE (Peer-to-Peer Messaging)
// ========================================================
const CHAT_STORAGE_KEY = 'JNVG_CHAT_MESSAGES_V2';

const DEFAULT_CHAT_MESSAGES = [
  {
    id: "msg-101",
    senderId: "usr-batch-1",
    senderName: "Smriti Singh",
    senderBatch: 1996,
    recipientId: "usr-admin-1",
    recipientName: "Dr. Amitabh Singh",
    recipientBatch: 1998,
    text: "Respected Amitabh Bhaiya, we are finalizing the stage arrangements and audio-visual setups for 13th Dec meet. We need your guidance on the medical helpdesk counter for elderly Gurujan.",
    timestamp: "Yesterday, 04:30 PM",
    createdAt: Date.now() - 86400000,
    read: false
  },
  {
    id: "msg-102",
    senderId: "usr-ashfaq-1",
    senderName: "Ashfaq Ahmed",
    senderBatch: 2008,
    recipientId: "usr-batch-1",
    recipientName: "Smriti Singh",
    recipientBatch: 1996,
    text: "Smriti Di, the new Gurujan & Teachers page has been deployed along with privacy protection for alumni mobile numbers. All teachers from 1989 to present are listed.",
    timestamp: "Today, 09:15 AM",
    createdAt: Date.now() - 3600000 * 3,
    read: true
  },
  {
    id: "msg-103",
    senderId: "usr-batch-1",
    senderName: "Smriti Singh",
    senderBatch: 1996,
    recipientId: "usr-ashfaq-1",
    recipientName: "Ashfaq Ahmed",
    recipientBatch: 2008,
    text: "Shabaash Ashfaq! The Gurujan wall with blessings looks wonderful. Let's make sure the Helpdesk escalation matrix is also integrated so juniors can get structured help from their batches first.",
    timestamp: "Today, 09:30 AM",
    createdAt: Date.now() - 3600000 * 2,
    read: false
  },
  {
    id: "msg-104",
    senderId: "usr-ashfaq-1",
    senderName: "Ashfaq Ahmed",
    senderBatch: 2008,
    recipientId: "usr-member-1",
    recipientName: "Ramesh Yadav",
    recipientBatch: 2008,
    text: "Ramesh bhai, are you joining the Batch of 2008 delegation for the Gauriganj mega meet? We are coordinating accommodation near the campus.",
    timestamp: "Today, 10:00 AM",
    createdAt: Date.now() - 3600000,
    read: false
  },
  {
    id: "msg-105",
    senderId: "usr-member-1",
    senderName: "Ramesh Yadav",
    senderBatch: 2008,
    recipientId: "usr-ashfaq-1",
    recipientName: "Ashfaq Ahmed",
    recipientBatch: 2008,
    text: "Haan Ashfaq, tickets booked! Reaching Gauriganj on 12th Dec evening. Looking forward to meeting all teachers and batchmates.",
    timestamp: "Today, 10:25 AM",
    createdAt: Date.now() - 1800000,
    read: true
  }
];

function initChatDB() {
  const existing = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(DEFAULT_CHAT_MESSAGES));
  }
}

function getAllChatMessages() {
  initChatDB();
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || DEFAULT_CHAT_MESSAGES;
  } catch (e) {
    return DEFAULT_CHAT_MESSAGES;
  }
}

function saveAllChatMessages(msgs) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
}

let activeChatPartner = null;

function refreshInboxBadge() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const msgs = getAllChatMessages();
  const unreadCount = msgs.filter(m => {
    const isRecipient = (m.recipientId === currentUser.id || (m.recipientName && m.recipientName.toLowerCase() === currentUser.name.toLowerCase()));
    return isRecipient && !m.read;
  }).length;

  const topBadge = document.getElementById('unreadInboxBadge');
  if (topBadge) {
    if (unreadCount > 0) {
      topBadge.textContent = unreadCount;
      topBadge.classList.remove('hidden');
    } else {
      topBadge.textContent = '0';
      topBadge.classList.add('hidden');
    }
  }

  const mTopBadge = document.getElementById('mUnreadInboxBadge');
  if (mTopBadge) {
    if (unreadCount > 0) {
      mTopBadge.textContent = unreadCount;
      mTopBadge.classList.remove('hidden');
    } else {
      mTopBadge.classList.add('hidden');
    }
  }
}

function getChatConversations() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  const msgs = getAllChatMessages();
  const convMap = new Map();

  msgs.forEach(m => {
    let partnerId = null;
    let partnerName = null;
    let partnerBatch = null;

    const isOutgoing = (m.senderId === currentUser.id || (m.senderName && m.senderName.toLowerCase() === currentUser.name.toLowerCase()));
    const isIncoming = (m.recipientId === currentUser.id || (m.recipientName && m.recipientName.toLowerCase() === currentUser.name.toLowerCase()));

    if (isOutgoing) {
      partnerId = m.recipientId;
      partnerName = m.recipientName;
      partnerBatch = m.recipientBatch;
    } else if (isIncoming) {
      partnerId = m.senderId;
      partnerName = m.senderName;
      partnerBatch = m.senderBatch;
    }

    if (partnerName) {
      const key = partnerName.toLowerCase();
      const existing = convMap.get(key);
      const isUnread = isIncoming && !m.read;

      if (!existing || m.createdAt > existing.lastMessageTime) {
        convMap.set(key, {
          partnerId: partnerId || key,
          partnerName: partnerName,
          partnerBatch: partnerBatch || 'Alumnus',
          lastMessage: m.text,
          lastMessageTime: m.createdAt,
          lastTimestamp: m.timestamp,
          unreadCount: (existing ? existing.unreadCount : 0) + (isUnread ? 1 : 0)
        });
      } else if (isUnread) {
        existing.unreadCount += 1;
      }
    }
  });

  return Array.from(convMap.values()).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
}

function openChatModal(partnerNameOrId) {
  const modal = document.getElementById('alumniChatModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  renderChatConversations();

  if (partnerNameOrId) {
    selectChatPartner(partnerNameOrId);
  } else {
    const convs = getChatConversations();
    if (convs.length > 0) {
      selectChatPartner(convs[0].partnerName);
    } else {
      // Pick first user from directory as default
      const defaultPartner = (AppState.directory && AppState.directory[0]) ? AppState.directory[0].name : "Smriti Singh";
      selectChatPartner(defaultPartner);
    }
  }
}

function closeChatModal() {
  const modal = document.getElementById('alumniChatModal');
  if (modal) modal.classList.add('hidden');
  refreshInboxBadge();
}

function renderChatConversations() {
  const container = document.getElementById('chatConversationsList');
  if (!container) return;
  const convs = getChatConversations();
  container.innerHTML = '';

  if (convs.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">No active conversations yet.<br>Click "+ New Message" to start.</div>`;
    return;
  }

  convs.forEach(c => {
    const isSelected = activeChatPartner && (activeChatPartner.name.toLowerCase() === c.partnerName.toLowerCase());
    const item = document.createElement('div');
    item.className = `p-3 rounded-2xl cursor-pointer transition flex items-start gap-3 ${isSelected ? 'bg-brand-900/40 border border-gold-500/40 shadow-sm' : 'hover:bg-slate-800/60 border border-transparent'}`;
    item.onclick = () => selectChatPartner(c.partnerName);

    const initials = c.partnerName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
    let partnerObj = null;
    if (AppState.directory) partnerObj = AppState.directory.find(d => (d.name || '').toLowerCase() === c.partnerName.toLowerCase());
    if (!partnerObj && typeof getAllUsers === 'function') partnerObj = getAllUsers().find(u => (u.name || '').toLowerCase() === c.partnerName.toLowerCase());
    const pPhoto = partnerObj ? partnerObj.photo : null;

    item.innerHTML = `
      ${pPhoto 
        ? `<img src="${pPhoto}" alt="${c.partnerName}" class="w-10 h-10 rounded-xl object-cover border border-slate-700 flex-shrink-0">` 
        : `<div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">${initials}</div>`}
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-1">
          <span class="font-bold text-white text-xs truncate">${c.partnerName}</span>
          <span class="text-[9px] text-slate-400 font-mono flex-shrink-0">${c.lastTimestamp}</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
          <span class="truncate pr-1 text-slate-300">${c.lastMessage}</span>
          ${c.unreadCount > 0 ? `<span class="w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0">${c.unreadCount}</span>` : ''}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function selectChatPartner(partnerIdentifier) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Find partner in directory or users
  let partner = null;
  if (AppState.directory) {
    partner = AppState.directory.find(d => d.name.toLowerCase() === partnerIdentifier.toLowerCase());
  }
  if (!partner && typeof getAllUsers === 'function') {
    partner = getAllUsers().find(u => u.name.toLowerCase() === partnerIdentifier.toLowerCase() || u.id === partnerIdentifier);
  }
  if (!partner && AppState.teachers) {
    const t = AppState.teachers.find(item => (item.id && item.id.toLowerCase() === partnerIdentifier.toLowerCase()) || (item.name && item.name.toLowerCase() === partnerIdentifier.toLowerCase()));
    if (t) {
      partner = {
        id: t.id,
        name: t.name,
        batch: t.tenure || 'Faculty',
        role: t.post || 'Revered Faculty',
        house: t.house || 'Campus',
        isTeacher: true
      };
    }
  }
  if (!partner) {
    partner = { name: partnerIdentifier, batch: "Alumnus", role: "Verified Alumnus", house: "Aravali" };
  }

  activeChatPartner = partner;

  // Mark messages from this partner as read
  const msgs = getAllChatMessages();
  let updated = false;
  msgs.forEach(m => {
    const isFromPartner = (m.senderName && m.senderName.toLowerCase() === partner.name.toLowerCase());
    const isToCurrent = (m.recipientId === currentUser.id || (m.recipientName && m.recipientName.toLowerCase() === currentUser.name.toLowerCase()));
    if (isFromPartner && isToCurrent && !m.read) {
      m.read = true;
      updated = true;
    }
  });
  if (updated) {
    saveAllChatMessages(msgs);
    refreshInboxBadge();
  }

  // Update Header UI
  const headerName = document.getElementById('chatHeaderName');
  const headerMeta = document.getElementById('chatHeaderMeta');
  const headerAvatar = document.getElementById('chatHeaderAvatar');
  if (headerName) headerName.textContent = partner.name;
  if (headerMeta) headerMeta.textContent = `Batch of ${partner.batch || ''} • ${partner.role || 'Verified Alumnus'} (${partner.house || ''})`;
  if (headerAvatar) {
    if (partner.photo) {
      headerAvatar.innerHTML = `<img src="${partner.photo}" alt="${partner.name}" class="w-full h-full rounded-xl object-cover">`;
    } else {
      headerAvatar.textContent = partner.initials || partner.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
    }
  }

  renderChatConversations();
  renderActiveChatMessages();
}

function renderActiveChatMessages() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container || !activeChatPartner) return;
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const msgs = getAllChatMessages();
  const thread = msgs.filter(m => {
    const isOut = (m.senderName && m.senderName.toLowerCase() === currentUser.name.toLowerCase()) &&
                  (m.recipientName && m.recipientName.toLowerCase() === activeChatPartner.name.toLowerCase());
    const isIn = (m.senderName && m.senderName.toLowerCase() === activeChatPartner.name.toLowerCase()) &&
                 (m.recipientName && m.recipientName.toLowerCase() === currentUser.name.toLowerCase());
    return isOut || isIn;
  }).sort((a, b) => a.createdAt - b.createdAt);

  container.innerHTML = '';
  if (thread.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
        <span class="text-3xl">🔒</span>
        <h4 class="text-sm font-bold text-white">Private Alumni Conversation</h4>
        <p class="text-xs text-slate-400 max-w-sm">Messages are confidential between verified alumni. Start the conversation with <strong>${activeChatPartner.name}</strong>.</p>
      </div>
    `;
    return;
  }

  thread.forEach(m => {
    const isMe = (m.senderName && m.senderName.toLowerCase() === currentUser.name.toLowerCase());
    const isRespect = m.type === 'respect' || (m.text && m.text.includes('[चरण स्पर्श'));
    const respectPill = isRespect ? `<div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold mb-1.5"><span>🙏</span> <span>चरण स्पर्श एवं सादर प्रणाम / Reverence Note</span></div>` : '';
    const row = document.createElement('div');
    row.className = `flex ${isMe ? 'justify-end' : 'justify-start'}`;

    row.innerHTML = `
      <div class="max-w-[78%] rounded-2xl p-3.5 space-y-1 shadow ${isRespect ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/50 text-amber-100' : isMe ? 'bg-gradient-to-r from-brand-700 to-brand-800 text-white rounded-br-none border border-gold-500/30' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/80'}">
        ${respectPill}
        <p class="text-xs leading-relaxed whitespace-pre-wrap">${m.text}</p>
        <div class="flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-amber-200/80' : 'text-slate-400'} font-mono pt-0.5">
          <span>${m.timestamp}</span>
          ${isMe ? `<span>✓✓</span>` : ''}
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chatMessageInput');
  if (!input || !activeChatPartner) return;
  const text = input.value.trim();
  if (!text) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderBatch: currentUser.batch,
    recipientId: activeChatPartner.id || `partner-${activeChatPartner.name.replace(/\s+/g, '-').toLowerCase()}`,
    recipientName: activeChatPartner.name,
    recipientBatch: activeChatPartner.batch || 2008,
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
    read: false
  };

  const msgs = getAllChatMessages();
  msgs.push(newMsg);
  saveAllChatMessages(msgs);

  input.value = '';
  renderActiveChatMessages();
  renderChatConversations();
  refreshInboxBadge();
  showToast(`Message delivered to ${activeChatPartner.name}.`);
}

function sendQuickChatMessage(promptText) {
  const input = document.getElementById('chatMessageInput');
  if (input) {
    input.value = promptText;
    sendChatMessage();
  }
}

function openChatWithAlumnus(alumnusName) {
  openChatModal(alumnusName);
}

function showNewChatSelector() {
  const container = document.getElementById('newChatSelectorModal');
  if (container) container.classList.remove('hidden');
}

function closeNewChatSelector() {
  const container = document.getElementById('newChatSelectorModal');
  if (container) container.classList.add('hidden');
}

function startChatWithSelectedAlumnus(alumnusName) {
  closeNewChatSelector();
  selectChatPartner(alumnusName);
}

// ========================================================
// 21. SAHAYATA & ESCALATION MATRIX ENGINE (Alumni Helpdesk)
// ========================================================
let currentHelpFilter = 'all';

function renderHelpRequests(filter = 'all') {
  currentHelpFilter = filter;
  const container = document.getElementById('helpRequestsList');
  if (!container) return;

  const reqs = AppState.helpRequests || [];
  const currentUser = getCurrentUser();

  const filtered = reqs.filter(r => {
    if (filter === 'tier1') return r.currentTier === 1 && r.status !== 'resolved';
    if (filter === 'tier2') return r.currentTier === 2 && r.status !== 'resolved';
    if (filter === 'tier3') return r.currentTier === 3 && r.status !== 'resolved';
    if (filter === 'resolved') return r.status === 'resolved';
    return true;
  });

  // Filter chips active state
  document.querySelectorAll('.help-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-900', 'text-slate-300');
    } else {
      btn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
      btn.classList.add('bg-slate-900', 'text-slate-300');
    }
  });

  const countBadge = document.getElementById('helpRequestsCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} Requests Active`;

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl text-center space-y-2">
        <p class="text-slate-400 text-xs">No active helpdesk requests found in this tier.</p>
        <button onclick="renderHelpRequests('all')" class="text-xs text-cyan-400 underline font-semibold">View All Requests</button>
      </div>
    `;
    return;
  }

  filtered.forEach(r => {
    const card = document.createElement('div');
    card.className = "bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 transition duration-300 space-y-4 shadow-xl";

    // Tier step pills
    const t1Class = r.currentTier >= 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500';
    const t2Class = r.currentTier >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500';
    const t3Class = r.currentTier >= 3 ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-500';

    const statusBadgeColor = r.status === 'resolved'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : (r.currentTier === 3 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : (r.currentTier === 2 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'));

    let resolutionNotesHtml = '';
    if (r.resolutionNotes && r.resolutionNotes.length > 0) {
      resolutionNotesHtml = `
        <div class="mt-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-[11px]">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Escalation Audit Trail / कार्यवाही प्रगति:</span>
          ${r.resolutionNotes.map(n => `<div class="flex items-start gap-1.5 text-slate-300"><span class="text-cyan-400 font-mono text-[10px]">•</span> <span><strong>${n.time}:</strong> ${n.note}</span></div>`).join('')}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusBadgeColor}">${r.categoryLabel || r.category}</span>
            <span class="text-[11px] text-slate-400">Filed on ${r.date}</span>
            ${r.urgency === 'urgent' ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-600/30 text-red-300 border border-red-500/40 animate-pulse">⚡ Urgent Emergency</span>' : ''}
          </div>
          <h3 class="text-base sm:text-lg font-bold text-white font-cinzel leading-snug">${r.title}</h3>
          <p class="text-xs text-slate-300 mt-0.5">Requester: <strong>${r.requesterName}</strong> • Batch of ${r.batch} (${r.house} House)</p>
        </div>
        <div class="px-3 py-1.5 rounded-xl border ${statusBadgeColor} text-right flex-shrink-0">
          <span class="text-[10px] uppercase font-bold block">${r.status === 'resolved' ? 'Case Resolved ✓' : `Active at Tier ${r.currentTier}`}</span>
          <span class="text-xs font-semibold">${r.statusLabel}</span>
        </div>
      </div>

      <!-- 3-TIER PROGRESS PIPELINE -->
      <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
        <div class="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
          <span>Escalation Pipeline Status</span>
          <span class="text-cyan-400">${r.status === 'resolved' ? 'Resolution Complete' : `Next Escalation: ${r.currentTier < 3 ? 'Tier ' + (r.currentTier + 1) : 'Apex Active'}`}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div class="p-2 rounded-xl border ${r.currentTier >= 1 ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 bg-slate-900/50 text-slate-500'}">
            <span class="block font-bold">Tier 1</span>
            <span class="text-[9px]">Batch Circle</span>
          </div>
          <div class="p-2 rounded-xl border ${r.currentTier >= 2 ? 'border-amber-500/40 bg-amber-950/30 text-amber-200' : 'border-slate-800 bg-slate-900/50 text-slate-500'}">
            <span class="block font-bold">Tier 2</span>
            <span class="text-[9px]">Regional Chapter</span>
          </div>
          <div class="p-2 rounded-xl border ${r.currentTier >= 3 ? 'border-rose-500/40 bg-rose-950/30 text-rose-200' : 'border-slate-800 bg-slate-900/50 text-slate-500'}">
            <span class="block font-bold">Tier 3</span>
            <span class="text-[9px]">Apex Welfare Fund</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-slate-200 leading-relaxed">${r.description}</p>

      ${r.targetAmount ? `
      <div class="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl text-xs">
        <span class="text-slate-300">Target Fund Needed: <strong class="text-white font-mono">₹${r.targetAmount.toLocaleString('en-IN')}</strong></span>
        <span class="text-emerald-400 font-bold">Mobilized: ₹${(r.raisedAmount || 0).toLocaleString('en-IN')}</span>
      </div>` : ''}

      ${resolutionNotesHtml}

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
        <div class="flex items-center gap-2">
          <button onclick="openChatWithAlumnus('${r.requesterName}')" class="px-3 py-1.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 font-bold flex items-center gap-1.5 transition">
            <span>💬</span> <span>Message Requester</span>
          </button>
          <button onclick="offerHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 transition">
            <span>🤝</span> <span>Offer Support / Pledges</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${r.status !== 'resolved' && r.currentTier < 3 ? `
          <button onclick="escalateHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1 transition">
            <span>⬆️</span> <span>Escalate to Tier ${r.currentTier + 1}</span>
          </button>` : ''}
          ${r.status !== 'resolved' ? `
          <button onclick="resolveHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition">
            <span>✓</span> <span>Mark Resolved</span>
          </button>` : '<span class="text-[11px] text-emerald-400 font-bold">✓ Closed & Resolved</span>'}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function openHelpRequestModal() {
  const modal = document.getElementById('helpRequestModal');
  if (modal) modal.classList.remove('hidden');
}

function closeHelpRequestModal() {
  const modal = document.getElementById('helpRequestModal');
  if (modal) modal.classList.add('hidden');
}

function handleHelpRequestSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('helpTitle').value.trim();
  const category = document.getElementById('helpCategory').value;
  const urgency = document.getElementById('helpUrgency').value;
  const desc = document.getElementById('helpDescription').value.trim();
  const amountStr = document.getElementById('helpAmount').value.trim();
  const amount = amountStr ? parseInt(amountStr) : null;

  const currentUser = getCurrentUser() || { name: "Alumni Member", batch: 2008, house: "Aravali" };

  const categoryLabels = {
    medical: "Medical Emergency",
    career: "Career & Mentorship",
    education: "Educational Relief",
    financial: "Financial Hardship",
    legal: "Local & Legal Assistance"
  };

  const newHelp = {
    id: `help-${Date.now()}`,
    title,
    requesterName: currentUser.name,
    requesterId: currentUser.id || `usr-${Date.now()}`,
    batch: currentUser.batch || 2008,
    house: currentUser.house || "Aravali",
    category,
    categoryLabel: categoryLabels[category] || "General Assistance",
    currentTier: 1, // Always starts at Batch level
    status: "batch_review",
    statusLabel: `Tier 1: In Batch of ${currentUser.batch || 2008} Circle`,
    urgency,
    targetAmount: amount,
    raisedAmount: 0,
    description: desc,
    resolutionNotes: [
      { time: "Just now", note: `Tier 1: Request initiated by ${currentUser.name}. Routed to Batch of ${currentUser.batch || 2008} peers.` }
    ],
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  if (!AppState.helpRequests) AppState.helpRequests = [];
  AppState.helpRequests.unshift(newHelp);
  saveAppData();
  renderHelpRequests(currentHelpFilter);
  closeHelpRequestModal();
  e.target.reset();
  showToast(`Help request submitted to Tier 1 (Batch of ${currentUser.batch || 2008}). You will be updated on batch and regional escalations.`);
}

function escalateHelpRequest(requestId) {
  const req = (AppState.helpRequests || []).find(r => r.id === requestId);
  if (!req || req.currentTier >= 3) return;

  req.currentTier += 1;
  const tierNames = {
    2: "Tier 2: Moderator Level Review & Regional Coordination",
    3: "Tier 3: Governance Admin & Apex Central Welfare Fund"
  };
  req.status = req.currentTier === 2 ? "tier2_moderator" : "tier3_admin";
  req.statusLabel = tierNames[req.currentTier];

  if (!req.resolutionNotes) req.resolutionNotes = [];
  req.resolutionNotes.push({
    time: "Just now",
    note: req.currentTier === 2
      ? "Tier 2: Escalated from Batch circle to Regional Chapters for wider mobilization."
      : "Tier 3: Escalated to Apex Central Executive Committee & Alumni Welfare Fund for emergency intervention."
  });

  saveAppData();
  renderHelpRequests(currentHelpFilter);
  showToast(`Escalated to Tier ${req.currentTier}! The broader alumni network has been notified.`);
}

function resolveHelpRequest(requestId) {
  const req = (AppState.helpRequests || []).find(r => r.id === requestId);
  if (!req) return;
  req.status = "resolved";
  req.statusLabel = `Resolved with Alumni Fraternity Solidarity`;
  if (!req.resolutionNotes) req.resolutionNotes = [];
  req.resolutionNotes.push({
    time: "Just now",
    note: "Case successfully resolved and assistance delivered. Gratitude recorded."
  });
  saveAppData();
  renderHelpRequests(currentHelpFilter);
  showToast(`Assistance case marked resolved. Gratitude to the Navodaya fraternity!`);
}

function offerHelpRequest(requestId) {
  const req = (AppState.helpRequests || []).find(r => r.id === requestId);
  if (!req) return;
  openChatWithAlumnus(req.requesterName);
}


// 18. PWA Registration
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => { console.log('JNVG Service Worker active:', reg.scope); }).catch((err) => { console.warn('SW registration skipped:', err); });
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderRsvpTable();
  renderFeed();
  renderDirectory();
  renderTeachers('all');
  renderHelpRequests('all');
  refreshInboxBadge();
  renderContributionLedger();
  renderNotableMessages();
  renderAdminQueue();
  renderAdminRegistrations();
  updateQueueBadges();
  
  const user = getCurrentUser();
  applyUserSession(user);
  renderMeetSchedule();
  renderCulturalActs();
  renderRoleGovernanceList();
  refreshInboxBadge();

  setInterval(updateCountdown, 1000);
  updateCountdown();
});

// ========================================================
// 21. MODERATOR BATCH BROADCAST & MASS MESSAGING ENGINE
// ========================================================
function openBatchBroadcastModal() {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser) {
    showToast('Please sign in as a Moderator or Admin to send batch broadcasts.');
    return;
  }
  const modal = document.getElementById('batchBroadcastModal');
  if (!modal) return;

  const batch = curUser.batch || 2005;
  const batchDisplay = document.getElementById('broadcastTargetBatchDisplay');
  const countDisplay = document.getElementById('broadcastRecipientCount');
  const senderDisplay = document.getElementById('broadcastSenderDisplay');

  if (batchDisplay) batchDisplay.textContent = 'Batch of ' + batch;
  if (senderDisplay) senderDisplay.textContent = curUser.name + ' (' + (curUser.roleTitle || curUser.role) + ')';

  const dirMembers = (AppState.directory || []).filter(d => parseInt(d.batch) === parseInt(batch) && (d.name || '').toLowerCase() !== (curUser.name || '').toLowerCase());
  const allUsers = (typeof getAllUsers === 'function') ? getAllUsers() : [];
  const userMembers = allUsers.filter(u => parseInt(u.batch) === parseInt(batch) && (u.name || '').toLowerCase() !== (curUser.name || '').toLowerCase());

  const uniqueNames = new Set();
  dirMembers.forEach(m => uniqueNames.add(m.name));
  userMembers.forEach(m => uniqueNames.add(m.name));

  const count = uniqueNames.size > 0 ? uniqueNames.size : 1;
  if (countDisplay) countDisplay.textContent = count + ' Batchmate' + (count > 1 ? 's' : '');

  modal.classList.remove('hidden');
}

function closeBatchBroadcastModal() {
  const modal = document.getElementById('batchBroadcastModal');
  if (modal) modal.classList.add('hidden');
}

function sendBatchBroadcast(e) {
  e.preventDefault();
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser) return;

  const subject = (document.getElementById('broadcastSubject').value || '').trim();
  const text = (document.getElementById('broadcastMessage').value || '').trim();
  if (!subject || !text) return;

  const batch = curUser.batch || 2005;
  const dirMembers = (AppState.directory || []).filter(d => parseInt(d.batch) === parseInt(batch) && (d.name || '').toLowerCase() !== (curUser.name || '').toLowerCase());
  const allUsers = (typeof getAllUsers === 'function') ? getAllUsers() : [];
  const userMembers = allUsers.filter(u => parseInt(u.batch) === parseInt(batch) && (u.name || '').toLowerCase() !== (curUser.name || '').toLowerCase());

  const recipientsMap = new Map();
  dirMembers.forEach(m => recipientsMap.set((m.name || '').toLowerCase(), { id: m.id || ('dir-' + m.name), name: m.name, batch: m.batch }));
  userMembers.forEach(u => recipientsMap.set((u.name || '').toLowerCase(), { id: u.id, name: u.name, batch: u.batch }));

  const recipients = Array.from(recipientsMap.values());
  if (recipients.length === 0) {
    recipients.push({ id: 'usr-demo-' + batch, name: 'Batch of ' + batch + ' Alumnus', batch: batch });
  }

  let msgs = getAllChatMessages();
  const now = Date.now();
  const timeStr = "Just now";

  recipients.forEach((rec, idx) => {
    msgs.push({
      id: 'msg-bcast-' + now + '-' + idx,
      senderId: curUser.id || 'usr-mod',
      senderName: curUser.name,
      senderBatch: curUser.batch,
      recipientId: rec.id,
      recipientName: rec.name,
      recipientBatch: rec.batch,
      text: '📢 [BATCH ' + curUser.batch + ' BROADCAST: ' + subject + ']\n' + text,
      timestamp: timeStr,
      createdAt: now + idx,
      read: false,
      isBroadcast: true
    });
  });

  saveAllChatMessages(msgs);
  refreshInboxBadge();
  closeBatchBroadcastModal();
  const f = document.getElementById('broadcastForm');
  if (f) f.reset();
  showToast('📢 Mass broadcast delivered to all ' + recipients.length + ' members of Batch ' + batch + '!');
}

// ========================================================
// 22. 4TH ANNUAL MEET SCHEDULE ENGINE (Host & Admin Management)
// ========================================================
function renderMeetSchedule() {
  const container = document.getElementById('meetScheduleTimeline');
  if (!container) return;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canManage = curUser && (curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin');

  const schedule = AppState.meetSchedule || defaultData.meetSchedule || [];
  if (schedule.length === 0) {
    container.innerHTML = '<div class="pl-6 text-xs text-slate-500 py-4">No events scheduled yet.</div>';
    return;
  }

  const colorStyles = {
    blue: { dot: 'bg-blue-600', text: 'text-blue-400' },
    amber: { dot: 'bg-amber-500', text: 'text-amber-400' },
    emerald: { dot: 'bg-emerald-500', text: 'text-emerald-400' },
    purple: { dot: 'bg-purple-500', text: 'text-purple-400' },
    red: { dot: 'bg-red-500', text: 'text-red-400' }
  };

  container.innerHTML = schedule.map(ev => {
    const col = colorStyles[ev.color] || colorStyles.blue;
    return `
      <div class="relative pl-6 sm:pl-8 group">
        <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${col.dot} border-2 border-slate-950 shadow"></div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span class="text-xs font-mono font-bold ${col.text}">${ev.time}</span>
            <h4 class="text-base font-bold text-slate-100">${ev.title}</h4>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">${ev.desc}</p>
          </div>
          ${canManage ? `
            <div class="flex items-center gap-1.5 mt-2 sm:mt-0 flex-shrink-0">
              <button onclick="openEditScheduleModal('${ev.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition" title="Edit this schedule event">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                <span>Edit</span>
              </button>
              <button onclick="deleteScheduleEvent('${ev.id}')" class="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 border border-red-500/30 text-[11px] font-semibold flex items-center gap-1 transition" title="Delete this event from itinerary">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Delete</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openAddScheduleModal() {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser || !(curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin')) {
    showToast('Permission denied. Only Event Hosts and Admins can modify the schedule.');
    return;
  }
  const modal = document.getElementById('scheduleEventModal');
  if (!modal) return;
  document.getElementById('schEventId').value = '';
  document.getElementById('schTime').value = '';
  document.getElementById('schTitle').value = '';
  document.getElementById('schDesc').value = '';
  document.getElementById('schColor').value = 'blue';
  const titleEl = document.getElementById('scheduleModalTitle');
  if (titleEl) titleEl.textContent = 'Add Schedule Event';
  modal.classList.remove('hidden');
}

function openEditScheduleModal(eventId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser || !(curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin')) {
    showToast('Permission denied. Only Event Hosts and Admins can modify the schedule.');
    return;
  }
  const schedule = AppState.meetSchedule || [];
  const ev = schedule.find(item => item.id === eventId);
  if (!ev) return;

  const modal = document.getElementById('scheduleEventModal');
  if (!modal) return;
  document.getElementById('schEventId').value = ev.id;
  document.getElementById('schTime').value = ev.time;
  document.getElementById('schTitle').value = ev.title;
  document.getElementById('schDesc').value = ev.desc;
  document.getElementById('schColor').value = ev.color || 'blue';
  const titleEl = document.getElementById('scheduleModalTitle');
  if (titleEl) titleEl.textContent = 'Edit Schedule Event';
  modal.classList.remove('hidden');
}

function handleScheduleSubmit(e) {
  e.preventDefault();
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser || !(curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin')) {
    showToast('Permission denied. Only Event Hosts and Admins can modify the schedule.');
    return;
  }

  const eventId = document.getElementById('schEventId').value.trim();
  const time = document.getElementById('schTime').value.trim();
  const color = document.getElementById('schColor').value;
  const title = document.getElementById('schTitle').value.trim();
  const desc = document.getElementById('schDesc').value.trim();

  if (!time || !title || !desc) {
    showToast('Please fill all required schedule details.');
    return;
  }

  if (!AppState.meetSchedule) AppState.meetSchedule = [...(defaultData.meetSchedule || [])];

  if (eventId) {
    const idx = AppState.meetSchedule.findIndex(item => item.id === eventId);
    if (idx !== -1) {
      AppState.meetSchedule[idx] = { id: eventId, time, color, title, desc };
      showToast(`Schedule event "${title}" updated successfully.`);
    }
  } else {
    const newId = `sch-${Date.now()}`;
    AppState.meetSchedule.push({ id: newId, time, color, title, desc });
    showToast(`New event "${title}" added to 4th Annual Meet schedule.`);
  }

  saveAppData();
  renderMeetSchedule();
  closeModal('scheduleEventModal');
}

function deleteScheduleEvent(eventId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser || !(curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin')) {
    showToast('Permission denied. Only Event Hosts and Admins can modify the schedule.');
    return;
  }
  const schedule = AppState.meetSchedule || [];
  const idx = schedule.findIndex(item => item.id === eventId);
  if (idx === -1) return;

  const ev = schedule[idx];
  if (confirm(`Are you sure you want to remove "${ev.title}" from the official program itinerary?`)) {
    AppState.meetSchedule.splice(idx, 1);
    saveAppData();
    renderMeetSchedule();
    showToast(`Schedule event "${ev.title}" removed.`);
  }
}

// ========================================================
// 23. CULTURAL ACTS REGISTRATION & HOST COMMAND NOTES DESK
// ========================================================
function renderCulturalActs() {
  const listContainer = document.getElementById('culturalActsList');
  const countBadge = document.getElementById('culturalActsCountBadge');
  const desk = document.getElementById('hostCulturalCommandDesk');

  const acts = AppState.culturalActs || defaultData.culturalActs || [];
  if (countBadge) countBadge.textContent = `${acts.length} Act${acts.length === 1 ? '' : 's'} Registered`;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canManage = curUser && (curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin');

  if (desk) {
    if (canManage) desk.classList.remove('hidden');
    else desk.classList.add('hidden');
  }

  if (!listContainer) return;

  if (acts.length === 0) {
    listContainer.innerHTML = '<div class="col-span-full p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">No cultural acts registered yet. Be the first to take the stage on 13 December!</div>';
    return;
  }

  listContainer.innerHTML = acts.map(act => {
    return `
      <div class="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-md">
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🎤</span> <span>${act.title}</span>
            </h4>
            <p class="text-xs text-purple-300 font-semibold mt-0.5">
              ${act.performer} • <span class="text-amber-400">Batch of ${act.batch}</span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-1 flex-shrink-0">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">${act.type}</span>
            <span class="text-[10px] text-slate-400 font-mono">⏱️ ${act.duration}</span>
          </div>
        </div>

        <div class="text-xs text-slate-300 space-y-1">
          <p><strong class="text-slate-400">Audio / Stage Needs:</strong> <span class="text-amber-300">${act.requirements || 'Standard Stage Mic'}</span></p>
          <p class="text-slate-300 leading-relaxed italic">"${act.description}"</p>
        </div>

        <!-- Host & Admin Stage Command Slot & Notes -->
        <div class="pt-2 border-t border-slate-800/80 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label class="text-[10px] font-bold uppercase tracking-wider text-purple-400">Stage Status:</label>
            <select id="actStatus-${act.id}" class="bg-slate-900 border border-purple-500/40 rounded-lg px-2 py-1 text-[11px] text-purple-200 font-semibold">
              <option value="Pending Review" ${act.status === 'Pending Review' ? 'selected' : ''}>⏳ Pending Review</option>
              <option value="Slot Approved" ${act.status === 'Slot Approved' ? 'selected' : ''}>✅ Slot Approved</option>
              <option value="Stage Ready" ${act.status === 'Stage Ready' ? 'selected' : ''}>🎸 Stage Ready</option>
              <option value="Completed" ${act.status === 'Completed' ? 'selected' : ''}>🏆 Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] text-slate-400 font-semibold mb-1">Host & Admin Command Notes (Stage timing, mics, cue):</label>
            <textarea id="actNotes-${act.id}" rows="2" placeholder="e.g. Assigned 02:45 PM slot. Sound team notified for 2 wireless mics." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500">${act.notes || ''}</textarea>
          </div>
          <div class="flex items-center justify-end">
            <button onclick="saveCulturalActNotes('${act.id}')" class="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1 shadow transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>Save Command Notes</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handlePerformanceSubmit(e) {
  e.preventDefault();
  const performer = (document.getElementById('perfPerformer').value || '').trim();
  const batch = parseInt(document.getElementById('perfBatch').value) || 2026;
  const type = document.getElementById('perfType').value;
  const duration = document.getElementById('perfDuration').value;
  const title = (document.getElementById('perfTitle').value || '').trim();
  const requirements = (document.getElementById('perfReqs').value || '').trim();
  const description = (document.getElementById('perfDesc').value || '').trim();

  if (!performer || !title || !description) {
    showToast('Please fill all required cultural act fields.');
    return;
  }

  const newAct = {
    id: `act-${Date.now()}`,
    performer,
    batch,
    type,
    duration,
    title,
    requirements: requirements || 'Standard Stage Mic & Sound',
    description,
    status: 'Pending Review',
    notes: 'Registered via official portal. Awaiting Host & Admin stage slot allocation.'
  };

  if (!AppState.culturalActs) AppState.culturalActs = [...(defaultData.culturalActs || [])];
  AppState.culturalActs.unshift(newAct);
  saveAppData();

  renderCulturalActs();
  closeModal('performanceModal');
  e.target.reset();

  showToast(`🎭 Cultural Act "${title}" registered! Event Hosts & Admin have received your stage requirements.`);
}

function saveCulturalActNotes(actId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser || !(curUser.role === 'admin' || curUser.role === 'host' || curUser.role === 'batch_admin')) {
    showToast('Permission denied. Only Event Hosts and Admins can update stage command notes.');
    return;
  }

  const acts = AppState.culturalActs || [];
  const act = acts.find(a => a.id === actId);
  if (!act) return;

  const statusEl = document.getElementById(`actStatus-${actId}`);
  const notesEl = document.getElementById(`actNotes-${actId}`);

  if (statusEl) act.status = statusEl.value;
  if (notesEl) act.notes = notesEl.value.trim();

  saveAppData();
  renderCulturalActs();
  showToast(`Command notes updated for "${act.title}" (${act.performer}).`);
}

// ========================================================
// 24. ALUMNI ROLE GOVERNANCE & DELEGATION ENGINE
// ========================================================
function getUserSystemRole(nameOrId) {
  const users = typeof getAllUsers === 'function' ? getAllUsers() : [];
  const found = users.find(u => (u.id && u.id === nameOrId) || ((u.name || '').toLowerCase() === (nameOrId || '').toLowerCase()));
  if (found) return found.role;
  return 'member';
}

function renderRoleGovernanceList(searchQuery = '') {
  const container = document.getElementById('roleGovernanceList');
  if (!container) return;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const isCurAdmin = curUser && curUser.role === 'admin';

  const allUsers = typeof getAllUsers === 'function' ? getAllUsers() : [];

  // Ashfaq Ahmed is the ONLY Super Admin
  const ashfaq = allUsers.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com') || {
    id: "usr-ashfaque-admin",
    name: "Ashfaq Ahmed",
    batch: 2008,
    house: "Arawali",
    role: "admin",
    roleTitle: "Super Admin",
    email: "ashfaque15tr@gmail.com",
    profession: "Lead Enterprise & Systems Solutions Architect"
  };

  container.innerHTML = `
    <!-- Sole Active Super Admin Record -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 shadow-lg">
      <div class="flex items-center space-x-3.5">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow flex-shrink-0">
          AA
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="text-sm font-bold text-white font-cinzel">${ashfaq.name}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-400/50">Sole Super Admin</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Permanent Authority</span>
          </div>
          <p class="text-xs text-slate-300 mt-0.5">Batch of ${ashfaq.batch} • ${ashfaq.house} House • ${ashfaq.profession || 'Lead Enterprise & Systems Solutions Architect'}</p>
          <p class="text-[11px] text-amber-400/90 font-mono mt-0.5">${ashfaq.email}</p>
        </div>
      </div>
      <div class="w-full sm:w-auto flex items-center justify-end">
        <span class="text-xs text-purple-300 font-bold px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center gap-1.5 shadow">
          <span>👑</span> <span>Platform Super Admin</span>
        </span>
      </div>
    </div>

    <!-- Governance Status & Role Hierarchy Summary -->
    <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2 mt-3">
      <div class="flex items-center gap-2 text-amber-400 font-bold">
        <span>🛡️</span> <span>RBAC Governance Cleared (Single Super Admin Mode)</span>
      </div>
      <p class="text-[11px] leading-relaxed text-slate-300">
        All previous legacy admin entries have been cleared. <strong>Ashfaq Ahmed</strong> is the sole administrator holding the Super Admin role.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
        <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <strong class="text-amber-300 block mb-0.5">🏛️ Host Role:</strong>
          Full access to contribution of the fund, financial ledger, and 4th Mega Meet event coordination.
        </div>
        <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
          <strong class="text-blue-300 block mb-0.5">🛡️ Moderator Role:</strong>
          Authorized to review, approve, and reject new alumni member registration requests.
        </div>
      </div>
      <p class="text-[10px] text-slate-400 italic pt-1">
        Additional Host (one member per team) and Moderator assignments will be populated as committee nominations are finalized.
      </p>
    </div>
  `;
}

function changeUserRole(targetIdentifier, newRole) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser) {
    showToast('Permission denied. Please log in.');
    return;
  }

  const isCurAdmin = curUser.role === 'admin';
  const isCurHost = curUser.role === 'host' || curUser.role === 'batch_admin';

  if (!isCurAdmin && !isCurHost) {
    showToast('Permission denied. Only Admins and Hosts can manage roles.');
    return;
  }

  // Host constraints: can only assign 'moderator' or 'member'
  if (isCurHost && !isCurAdmin) {
    if (newRole !== 'moderator' && newRole !== 'member') {
      showToast('Permission denied: Hosts can only assign Moderator or Member roles.');
      return;
    }
  }

  const allUsers = typeof getAllUsers === 'function' ? getAllUsers() : [];
  const targetLower = (targetIdentifier || '').trim().toLowerCase();

  const userIdx = allUsers.findIndex(u => (u.id && u.id.toLowerCase() === targetLower) || ((u.name || '').toLowerCase() === targetLower));
  
  // Host cannot modify an Admin, Teacher, or Host
  if (userIdx !== -1 && isCurHost && !isCurAdmin) {
    const targetUser = allUsers[userIdx];
    if (targetUser.role === 'admin' || targetUser.role === 'host' || targetUser.role === 'batch_admin' || targetUser.role === 'teacher') {
      showToast('Permission denied: Hosts cannot modify Admin, Teacher, or Host roles.');
      return;
    }
  }

  let targetDisplayName = targetIdentifier;

  if (userIdx !== -1) {
    const u = allUsers[userIdx];
    targetDisplayName = u.name;
    u.role = newRole;
    if (newRole === 'host') {
      u.roleTitle = 'Host Batch Organizer & Admin';
    } else if (newRole === 'moderator') {
      u.roleTitle = `Batch ${u.batch} Content Moderator`;
    } else if (newRole === 'teacher') {
      u.roleTitle = 'Revered Gurujan / Faculty';
    } else if (newRole === 'member') {
      u.roleTitle = 'Verified Alumnus';
    }
    if (typeof saveAllUsers === 'function') {
      saveAllUsers(allUsers);
    }
  }

  // Update in directory if present
  if (AppState.directory) {
    const dirItem = AppState.directory.find(d => (d.name || '').toLowerCase() === targetLower);
    if (dirItem) {
      targetDisplayName = dirItem.name;
      dirItem.systemRole = newRole;
      if (newRole === 'host') dirItem.tag = `Host • Batch of ${dirItem.batch}`;
      else if (newRole === 'moderator') dirItem.tag = `Moderator • Batch of ${dirItem.batch}`;
      else if (newRole === 'teacher') dirItem.tag = `Gurujan • ${dirItem.role || 'Faculty'}`;
      else dirItem.tag = `Batch of ${dirItem.batch}`;
    }
  }

  // If current session is the target, update it live
  if (curUser && (curUser.name || '').toLowerCase() === targetLower) {
    curUser.role = newRole;
    if (typeof setCurrentUser === 'function') setCurrentUser(curUser, true);
    applyUserSession(curUser);
  }

  saveAppData();
  renderRoleGovernanceList(document.getElementById('roleManageSearch') ? document.getElementById('roleManageSearch').value : '');
  renderDirectory();

  const cleanRoleName = newRole === 'admin' ? 'Super Admin' : newRole === 'host' ? 'Host' : newRole === 'moderator' ? 'Moderator' : newRole === 'teacher' ? 'Revered Gurujan' : 'Member';
  showToast(`Role updated: ${targetDisplayName} is now a ${cleanRoleName}!`);
}

// Handler for Footer Suggestion & Issue Report Modal
function handleSuggestionSubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('sugCategory') ? document.getElementById('sugCategory').value : 'Suggestion';
  const name = document.getElementById('sugName') ? document.getElementById('sugName').value.trim() : '';
  const batch = document.getElementById('sugBatch') ? document.getElementById('sugBatch').value.trim() : '';
  const contact = document.getElementById('sugContact') ? document.getElementById('sugContact').value.trim() : '';
  const details = document.getElementById('sugDetails') ? document.getElementById('sugDetails').value.trim() : '';

  const report = {
    id: `sug-${Date.now()}`,
    category: cat,
    name,
    batch,
    contact,
    details,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  try {
    const list = JSON.parse(localStorage.getItem('JNVG_SUGGESTIONS_ISSUES') || '[]');
    list.unshift(report);
    localStorage.setItem('JNVG_SUGGESTIONS_ISSUES', JSON.stringify(list));
  } catch (err) {
    console.warn("Could not save suggestion locally:", err);
  }

  if (typeof closeModal === 'function') closeModal('suggestionIssueModal');
  alert(`✓ Thank you ${name}! Your ${cat.toLowerCase()} has been recorded. Our alumni web administration team will review it for Site Version v4.2.1.`);
  e.target.reset();
}