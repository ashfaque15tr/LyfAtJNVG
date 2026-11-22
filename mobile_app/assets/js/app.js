const PERSISTENT_FEED_STORAGE_KEY = 'JNVG_MEMORY_WALL_FEED_V1';
﻿/**
 * JNV Gauriganj (Amethi / Sultanpur) Alumni Platform
 * Core Application Engine & State Manager
 */

// Global Application State with LocalStorage Persistence
const APP_STORAGE_KEY = 'JNVG_ALUMNI_APP_DATA_V2';

let attachedStoryPhoto = null;

const defaultCommunityBroadcasts = [
  {
    id: "feed-official-welcome",
    author: "Ashfaque Ahmad",
    authorRole: "admin",
    roleBadge: "Super Admin",
    authorPhoto: "assets/images/ashfaq-ahmed.png",
    initials: "AA",
    batch: 2005,
    house: "Nilgiri",
    timestamp: "19 Nov 2026, 11:30 AM",
    timeAgo: "Official Announcement",
    category: "gratitude",
    tag: "Memories",
    content: "Welcome to JNVGFamily! The official digital home of JNV Gauriganj Alumni. Connect with batchmates across the globe, mentor young minds, and stay updated on campus reunions and milestones.",
    text: "Welcome to JNVGFamily! The official digital home of JNV Gauriganj Alumni. Connect with batchmates across the globe, mentor young minds, and stay updated on campus reunions and milestones.",
    likes: 42,
    liked: false,
    comments: [
      { author: "Vivek Tiwari", text: "Proud moment for all Navodayans! Looking forward to 13th Dec 2026." },
      { author: "Dr. Jai Krishna Mishra", text: "Heartiest congratulations and best wishes to the entire JNV Gauriganj family." }
    ]
  },
  {
    id: "feed-gurujan-lsy",
    author: "Sh. L. S. Yadav",
    authorRole: "teacher",
    isTeacher: true,
    roleBadge: "Current Faculty (TGT English) • Editor, 'Navonmesh'",
    roleTitle: "Revered Faculty • Editor, 'Navonmesh'",
    authorPhoto: "assets/images/ls-yadav.jpg",
    initials: "LS",
    batch: null,
    house: "Campus",
    timestamp: "19 Nov 2026, 11:32 AM",
    timeAgo: "Gurujan Sandesh",
    category: "gratitude",
    tag: "Guru Sandesh",
    content: "Navodaya is the confluence of multi-dimensional talents. \nLet's come together and work together to succeed with flying colours by caring and sharing, J N V Stars! ⭐⭐⭐⭐⭐",
    text: "Navodaya is the confluence of multi-dimensional talents. \nLet's come together and work together to succeed with flying colours by caring and sharing, J N V Stars! ⭐⭐⭐⭐⭐",
    likes: 38,
    liked: false,
    comments: []
  },
  {
    id: "feed-gurujan-ay",
    author: "Smt. Arpana Yadav",
    authorRole: "teacher",
    isTeacher: true,
    roleBadge: "Former Faculty (TGT English)",
    roleTitle: "Revered Faculty",
    authorPhoto: null,
    initials: "AY",
    batch: null,
    house: "Priyadarshni / Sarojini",
    timestamp: "19 Nov 2026, 11:33 AM",
    timeAgo: "Gurujan Sandesh",
    category: "memories",
    tag: "Guru Sandesh",
    content: "कहाँ हो भाई सब? बहुत अच्छे लग रहे हैं आप सब! Love you all! Education is not the filling of a pail, but the lighting of a fire. हॉस्टल में आपका माँ सा ध्यान रखना और अंग्रेजी भाषा व नैतिक मूल्यों को जीवन में उतारना ही मेरा संकल्प रहा। सदा विजयी भव!",
    text: "कहाँ हो भाई सब? बहुत अच्छे लग रहे हैं आप सब! Love you all! Education is not the filling of a pail, but the lighting of a fire. हॉस्टल में आपका माँ सा ध्यान रखना और अंग्रेजी भाषा व नैतिक मूल्यों को जीवन में उतारना ही मेरा संकल्प रहा। सदा विजयी भव!",
    likes: 45,
    liked: false,
    comments: []
  },
  {
    id: "feed-gurujan-rautela",
    author: "Sh. B. S. Singh Rautela",
    authorRole: "teacher",
    isTeacher: true,
    roleBadge: "Former Principal",
    roleTitle: "Former Principal Legend",
    authorPhoto: null,
    initials: "BR",
    batch: null,
    house: "Administration",
    timestamp: "19 Nov 2026, 11:34 AM",
    timeAgo: "Principal Blessings",
    category: "gratitude",
    tag: "Guru Sandesh",
    content: "नवोदय का प्रांगण केवल ज्ञानार्जन का केंद्र नहीं, बल्कि चरित्र, बंधुत्व और राष्ट्र-निर्माण की पावन तपोभूमि है। जेएनवी गौरीगंज के विद्यार्थियों ने हर क्षेत्र में जो कीर्तिमान स्थापित किए हैं, उन पर मुझे गर्व है। हमीं नवोदय हों!",
    text: "नवोदय का प्रांगण केवल ज्ञानार्जन का केंद्र नहीं, बल्कि चरित्र, बंधुत्व और राष्ट्र-निर्माण की पावन तपोभूमि है। जेएनवी गौरीगंज के विद्यार्थियों ने हर क्षेत्र में जो कीर्तिमान स्थापित किए हैं, उन पर मुझे गर्व है। हमीं नवोदय हों!",
    likes: 51,
    liked: false,
    comments: []
  }
];

const defaultData = {
  role: 'member',
  currentLang: 'en',
  viewport: 'desktop',
  donationAmount: 5000,
  activeTab: 'home',
  
  rsvps: [],

  contributions: [],

  feedPosts: (function() {
    try {
      const f = localStorage.getItem(PERSISTENT_FEED_STORAGE_KEY);
      if (f) {
        const parsed = JSON.parse(f);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return defaultCommunityBroadcasts.slice();
  })(),

  queueItems: [],

  pendingRegistrations: [],

  directory: [],

  meetSchedule: [
    { id: "sch-1", time: "09:00 AM", color: "blue", title: "Tilak Welcome, Registration & Kit Distribution", desc: "Campus entry, welcome tilak, breakfast tea, ID tag & souvenir bag collection." },
    { id: "sch-2", time: "10:00 AM", color: "amber", title: "Morning Assembly & Prayer (\"हम नवोदय हों\")", desc: "Guru Vandana, lighting of the lamp by Principal Mr. P. K. Singh, collective Navodaya prayer." },
    { id: "sch-3", time: "11:30 AM", color: "amber", title: "Keynote Address & Teacher Felicitations (गुरु दक्षिणा सम्मान)", desc: "Honoring former gurus & faculty legends, speech by Principal & Alumni President, unveiling Association projects." },
    { id: "sch-4", time: "01:00 PM", color: "emerald", title: "Nostalgic Navodaya Mess Feast (विशेष मेस भोज)", desc: "Traditional hostel feast (puri-chole, kheer, special menu) together in the central dining hall." },
    { id: "sch-5", time: "02:30 PM", color: "purple", title: "Cultural Fiesta & Open Mic (सांस्कृतिक संगम)", desc: "Music, nostalgic hostel skits, poetry, comedy, and batch memories on the open amphitheater stage." },
    { id: "sch-6", time: "04:30 PM", color: "red", title: "Inter-House Tug-of-War & Friendly Sports", desc: "Aravali, Shivalik, Udaigiri & Nilgiri face-off on the legendary JNV sports ground." },
    { id: "sch-7", time: "06:00 PM", color: "blue", title: "High Tea, Valedictory & Navodaya Pledge", desc: "Batch group photographs, vote of thanks by Host Batch 1996, collective pledge & farewell." }
  ],

  culturalActs: [
    {
      id: "act-1",
      performer: "Neelam Singh",
      batch: 2016,
      type: "Solo Song",
      duration: "5 mins",
      title: "हम नवोदय हों (Acoustic Semi-Classical Fusion)",
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
    { id: 1, author: "Sh. Vivek Tiwari", batch: "1987-1994", role: "MD & CEO, Satya MicroCapital Ltd. & Donor", house: "Aravali", quote: "Navodaya gave us the courage to dream and build without fear. Every milestone in corporate or public leadership is rooted in the resilience learned in those Gauriganj classrooms. Support your junior peers relentlessly." },
    { id: 2, author: "Alok Dubey, IAS", batch: "2007", role: "Indian Administrative Service", house: "Nilgiri", quote: "Public service is the natural continuum of Navodaya's core pledge 'Pragyanam Brahma'. To all young scholars: stay disciplined, read widely, and let integrity be your defining hallmark." },
    { id: 3, author: "Dr. Ratnesh Tiwari", batch: "1996-2003", role: "CEO, Koshish India & Co-Founder Satyapath Foundation", house: "Nilgiri", quote: "True Navodayan spirit is giving back tenfold to the rural soil that nurtured us. Empower the next generation through education, infrastructure, and sustainable community support." },
    { id: 4, author: "Sh. Utkrisht Pandey", batch: "2002", role: "Founder, Rishigram Organics • Retd. Assistant Commandant, SSB", house: "Nilgiri", quote: "From the discipline of morning assembly and cross-country runs at JNVG to guarding borders with SSB and cultivating heritage sandalwood, the greatest success is creating sustainable, ethical value rooted in our native soil." },
    { id: 5, author: "Dr. Jai Krishna Mishra", batch: "1993 (First Batch)", role: "Project Director, ASL, DRDO Hyderabad", house: "Aravali", quote: "Discipline, relentless inquiry, and dedication to the motherland were ingrained in us at Gauriganj. Whether designing critical solid propulsion technologies or mentoring the next generation, strive for uncompromising national self-reliance." },
    { id: 6, author: "Dr. Shailendra Mohan Tripathi", batch: "1997", role: "Addl. Professor, Geriatric Mental Health, KGMU & Univ. of Aberdeen", house: "Nilgiri", quote: "Navodaya taught us empathy for the vulnerable and elder care. As clinicians and researchers battling Dementia, standing by our aged Gurujan and parents with compassionate healthcare is our sacred duty." },
    { id: 7, author: "Ashwini Mishra", batch: "1993 (First Batch)", role: "Senior Journalist, Executive Producer & News Anchor, DD News", house: "Shivalik", quote: "We are the beneficiaries of a remarkable visionary rural education system, and paying that debt back to society is our highest calling. Measure your success not just by the lives you uplift and the communities you transform **Be grounded..Be Honest..**" },
    { id: 8, author: "Alok Singh", batch: "1995", role: "Senior Analytics & AI Leader • Enterprise Data Strategist", house: "Aravali", quote: "In the era of Artificial Intelligence and rapid technological transition, our most enduring algorithm is the curiosity, character, and lifelong fraternity forged on the campus of JNV Gauriganj." }
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
      id: "tch-bsr",
      name: "Sh. B. S. Singh Rautela",
      title: "Former Principal • Jawahar Navodaya Vidyalaya, Gauriganj",
      category: "former",
      statusLabel: "Former Leadership (Principal)",
      post: "Former Principal",
      subject: "Institutional Leadership & Educational Administration",
      tenure: "Former Principal",
      house: "Administration",
      houseDetail: "Vidyalaya Leadership & Mentorship",
      location: "Uttarakhand / Uttar Pradesh",
      initials: "BSR",
      photo: null,
      respectCount: 220,
      message: "नवोदय का प्रांगण केवल ज्ञानार्जन का केंद्र नहीं, बल्कि चरित्र, बंधुत्व और राष्ट्र-निर्माण की पावन तपोभूमि है। जेएनवी गौरीगंज के विद्यार्थियों ने हर क्षेत्र में जो कीर्तिमान स्थापित किए हैं, उन पर मुझे गर्व है। अपनी जड़ों, गुरुजनों और नवोदय के संस्कारों को सदैव हृदय में संजोकर रखें। चतुर्थ महासम्मेलन के सफल आयोजन हेतु सभी प्रिय पूर्व छात्रों को मेरा असीम शुभाशीष। हमीं नवोदय हों!",
      specialNote: "Revered former Principal whose exemplary leadership, discipline, and educational vision shaped JNV Gauriganj during crucial formative years."
    },
    {
      id: "tch-sps",
      name: "Late Dr. S. P. Singh",
      title: "Former Principal • Amar Smriti (अमर स्मृति)",
      category: "in_memoriam",
      statusLabel: "Amar Smriti • Former Principal",
      post: "Founder Principal (In Memoriam)",
      subject: "Foundational Leadership & Institutional Vision",
      tenure: "1989 – 1998 (Founder Principal)",
      house: "Administration",
      houseDetail: "Vidyalaya Founder & Principal",
      location: "Amar Smriti • In Eternal Memory",
      initials: "SPS",
      photo: null,
      isDeceased: true,
      tributeCount: 156,
      respectCount: 156,
      message: "स्वर्गीय डॉ. एस. पी. सिंह जी ने जेएनवी गौरीगंज के स्थापना काल में अपने अप्रतिम नेतृत्व, अनुशासन और दूरदर्शिता से इस पावन संस्थान की सुदृढ़ नींव रखी। उनका स्नेह और आदर्श सदैव जीवित रहेगा।",
      specialNote: "Revered Founder Principal who established the high academic and moral standards of JNV Gauriganj."
    },
    {
      id: "tch-ps",
      name: "Late Dr. Preetam Singh",
      title: "Former PGT Hindi • Amar Smriti (अमर स्मृति)",
      category: "in_memoriam",
      statusLabel: "Amar Smriti • Former PGT Hindi",
      post: "Former PGT Hindi (In Memoriam)",
      subject: "Hindi Literature & Sahitya",
      tenure: "1990 – 2005 (15 Years)",
      house: "Aravali",
      houseDetail: "House Master - Aravali & Hindi Sahitya Parishad",
      location: "Amar Smriti • In Eternal Memory",
      initials: "PS",
      photo: null,
      isDeceased: true,
      tributeCount: 142,
      respectCount: 142,
      message: "स्वर्गीय डॉ. प्रीतम सिंह जी ने नवोदय के विद्यार्थियों के भीतर हिंदी साहित्य के प्रति अगाध प्रेम और मानवीय संवेदनाओं का बीजारोपण किया। उनकी ओजस्वी वाणी और संस्कार आज भी गूंजते हैं।",
      specialNote: "Beloved Hindi scholar and mentor who inspired generations of students in literary and ethical excellence."
    },
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
      respectCount: 210,
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
      respectCount: 245,
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
      respectCount: 180,
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
      id: "tch-lsy",
      name: "Sh. L. S. Yadav",
      title: "T.G.T.-English, Jawahar Navodaya Vidyalaya, Gauriganj • Editor, Vidyalaya Magazine 'Navonmesh'",
      category: "current",
      statusLabel: "Current Faculty (TGT English) • Editor, 'Navonmesh'",
      post: "T.G.T.-English • Editor, Vidyalaya Magazine 'Navonmesh'",
      subject: "English Language, Literature & Chief Editor 'Navonmesh'",
      tenure: "2021 – Present",
      house: "Campus",
      houseDetail: "Faculty of English & Literary Society • Chief Editor, Navonmesh Magazine",
      location: "Campus Staff Quarters, JNV Gauriganj",
      initials: "LSY",
      photo: "assets/images/ls-yadav.jpg",
      respectCount: 168,
      message: "Navodaya is the confluence of multi-dimensional talents. \nLet's come together and work together to succeed with flying colours by caring and sharing, J N V Stars! ⭐⭐⭐⭐⭐",
      specialNote: "Dedicated English educator nurturing communicative excellence and literary expression at JNV Gauriganj since 2021. Chief Editor of Vidyalaya Annual Magazine 'Navonmesh' (नवोन्मेष)."
    },
    {
      id: "tch-ay",
      name: "Smt. Arpana Yadav",
      title: "Senior Faculty (T.G.T.-English) & House Mother",
      category: "former",
      statusLabel: "Former Faculty (TGT English) & House Mother",
      post: "T.G.T.-English & House Mother",
      subject: "English Language, Literature & Values",
      tenure: "1994 – 2012 (18 Years)",
      house: "Priyadarshni / Sarojini",
      houseDetail: "Senior House Mother & Literary Society In-charge",
      location: "Lucknow / Sultanpur, UP",
      initials: "AY",
      photo: null,
      respectCount: 198,
      message: "कहाँ हो भाई सब? बहुत अच्छे लग रहे हैं आप सब! Love you all! Education is not the filling of a pail, but the lighting of a fire. हॉस्टल में आपका माँ सा ध्यान रखना और अंग्रेजी भाषा व नैतिक मूल्यों को जीवन में उतारना ही मेरा संकल्प रहा। सदा विजयी भव!",
      specialNote: "Affectionate English mentor and pastoral guide remembered warmly by generations of Navodayans for her maternal care and inspiring literary guidance."
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

const SOFT_LAUNCH_STORAGE_FLAG = 'JNVG_SOFT_LAUNCH_2026_CLEARED_V8';

// As of today, Ashfaque Ahmad is the ONLY verified alumni present in the directory as Super Admin (Batch of 2005)
const defaultDirectoryAlumni = [
  {
    "id": "dir-ashfaque-ahmad",
    "name": "Ashfaque Ahmad",
    "initials": "AA",
    "photo": "assets/images/ashfaq-ahmed.png",
    "avatarImage": "assets/images/ashfaq-ahmed.png",
    "batch": 2005,
    "house": "Nilgiri",
    "role": "Software Architect",
    "location": "Bangalore",
    "domain": "Software",
    "email": "ashfaque15tr@gmail.com",
    "badge": "Nilgiri",
    "tag": "Software Architect",
    "isSuperAdmin": true,
    "isPermanentAdmin": true,
    "bio": "Software Architect & Cloud Solutions Specialist • Batch of 2005 (Nilgiri House)."
  },
  {
    "id": "alumni-2",
    "name": "Ashwini Mishra",
    "initials": "AM",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Journalist, DD News Delhi",
    "location": "Delhi",
    "domain": "Media & Journalism",
    "email": "ashwinimishra99@gmail.com",
    "phone": "9999450510",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Journalist, DD News Delhi at DD News • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-3",
    "name": "Alok Singh",
    "initials": "AS",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Manager, Analytics",
    "location": "Pune",
    "domain": "Corporate",
    "email": "kumaraloksingh@gmail.com",
    "phone": "9158177868",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Manager, Analytics at Infosys Limited • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-4",
    "name": "Shiv Shanker Verma",
    "initials": "SS",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "General Manager (O&amp;M)",
    "location": "Corporate O&amp;M, NOIDA",
    "domain": "Corporate",
    "email": "ssverma.gail@gmail.com",
    "phone": "9811708105",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "General Manager (O&amp;M) at GAIL (INDIA) LTD. • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-5",
    "name": "Ranjeet Kumar",
    "initials": "RK",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Health education officer",
    "location": "CHC TANDA AMBEDKARNAGAR U.P",
    "domain": "Medicine",
    "email": "ranjeet.verma754@gmail.com",
    "phone": "9450050754",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Health education officer at Medical health andFamily welfare Uttar Pradesh government • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-6",
    "name": "Raj Kumar Gupta",
    "initials": "RK",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "raaj.gupta18@gmail.com",
    "phone": "9807222143",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education department • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-7",
    "name": "Dr. Sunil Kumar Singh",
    "initials": "DS",
    "batch": 1995,
    "house": "Aravali",
    "role": "ASSOCIATE PROFESSOR",
    "location": "VARANASI",
    "domain": "Academia",
    "email": "drsunilsinghmaths@gmail.com",
    "phone": "9451280526",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "ASSOCIATE PROFESSOR at U.P. COLLEGE, VARANASI • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-8",
    "name": "Dr Jai Krishna Mishra",
    "initials": "DJ",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Scientist G &amp; Project Director",
    "location": "Hyderabad",
    "domain": "Corporate",
    "email": "jkmishra06@gmail.com",
    "phone": "8309467805",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Scientist G &amp; Project Director at Defence R &amp; D Organisation ( DRDO), Min of Defence • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-9",
    "name": "Raj Kumar Singh",
    "initials": "RK",
    "batch": 1993,
    "house": "Aravali",
    "role": "Govt job/ACP",
    "location": "ACP BAZARKHALA LKO",
    "domain": "Civil Services",
    "email": "rajuppolice24@gmail.com",
    "phone": "9415273180",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Govt job/ACP at UP Police • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-10",
    "name": "Anil Kumar Singh",
    "initials": "AK",
    "batch": 1996,
    "house": "Aravali",
    "role": "Business",
    "location": "Kolkata",
    "domain": "Corporate",
    "email": "anil.singh9050@gmail.com",
    "phone": "6394127981",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business at Singh moovars • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-11",
    "name": "Anil Kumar Yadav",
    "initials": "AK",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Business",
    "location": "Sangipur pratapgarh",
    "domain": "Corporate",
    "email": "anily6413@gmail.com",
    "phone": "9415741044",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Business at Electronics • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-12",
    "name": "Ram Bhawan Pal",
    "initials": "RB",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Gov Contractor/Prop",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "rbpal999@gmail.com",
    "phone": "9540774239",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Gov Contractor/Prop at Military Engineering Services • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-13",
    "name": "Hariom Shukla",
    "initials": "HS",
    "batch": 1996,
    "house": "Shivalik",
    "role": "Student",
    "location": "Home",
    "domain": "Corporate",
    "email": "hariomnh56@gmail.com",
    "phone": "8004961031",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at Home • Batch of 1996 (Shivalik House)."
  },
  {
    "id": "alumni-14",
    "name": "Shailesh Kumar Singh",
    "initials": "SK",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "TEACHER",
    "location": "SITAPUR",
    "domain": "Academia",
    "email": "shailesamita@gmail.com",
    "phone": "9984006844",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "TEACHER at GOVERNMENT • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-15",
    "name": "Ajay Kumar Singh",
    "initials": "AK",
    "batch": 1996,
    "house": "Aravali",
    "role": "Company Secretary",
    "location": "Noida",
    "domain": "Corporate",
    "email": "singhajaycs@gmail.com",
    "phone": "9911995899",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Company Secretary at Nuberg Engineering Limited • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-16",
    "name": "मुकेश प्रताप सिंह",
    "initials": "मप",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Head teacher primary school",
    "location": "अयोध्या",
    "domain": "Academia",
    "email": "mukeshsinghht1976@gmail.com",
    "phone": "9721173362",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Head teacher primary school at बेसिक शिक्षा विभाग, अयोध्या • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-17",
    "name": "Ashish Mishra",
    "initials": "AM",
    "batch": 2000,
    "house": "Shivalik",
    "role": "Bussiness",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "ashishmishra2605@gmail.com",
    "phone": "9266050802",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Bussiness at Own Bussiness • Batch of 2000 (Shivalik House)."
  },
  {
    "id": "alumni-18",
    "name": "Dr. Chandraprabha",
    "initials": "DC",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Assistant professor",
    "location": "Kanpur",
    "domain": "Academia",
    "email": "prabhac228@gmail.com",
    "phone": "9453111198",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant professor at VSSD COLLEGE KANPUR • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-19",
    "name": "Rajesh Kumar Sharma",
    "initials": "RK",
    "batch": 1993,
    "house": "Aravali",
    "role": "Retailer/franchise Puma, Canary London,Shiv Naresh",
    "location": "Sultanpur city UP",
    "domain": "Corporate",
    "email": "allora.raj@gmail.com",
    "phone": "7905185517",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Retailer/franchise Puma, Canary London,Shiv Naresh at Ganpati Enterprises • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-20",
    "name": "Amit Mishra",
    "initials": "AM",
    "batch": 1993,
    "house": "Aravali",
    "role": "Doctor",
    "location": "Daryaganj",
    "domain": "Medicine",
    "email": "dramitmishra1@gmail.com",
    "phone": "9717416466",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Doctor at Sabharwal hospital • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-21",
    "name": "Sanjeev Kumar Kanaujia",
    "initials": "SK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Junior Engineer in UPPCL",
    "location": "Gauriganj",
    "domain": "Technology",
    "email": "sanjeevkanaujia35@gmail.com",
    "phone": "9936084460",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Junior Engineer in UPPCL at UPPCL • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-22",
    "name": "Dr. Ratnesh Tiwari",
    "initials": "RT",
    "batch": 2003,
    "house": "Shivalik",
    "role": "Businessman",
    "location": "Noida",
    "domain": "Corporate",
    "email": "ratty20jul@gmail.com",
    "phone": "9971675555",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Businessman at Koshish Sustainable Solutions Private Limited • Batch of 2003 (Shivalik House)."
  },
  {
    "id": "alumni-23",
    "name": "Kaushal Kishore Mishra",
    "initials": "KK",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Media",
    "location": "New Delhi",
    "domain": "Media & Journalism",
    "email": "kaushal76@gmail.com",
    "phone": "9871859466",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Media at D D News • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-24",
    "name": "सन्तोष कुमार श्रीवास्तव",
    "initials": "सक",
    "batch": 1993,
    "house": "Aravali",
    "role": "व्यापार",
    "location": "सुलतानपुर",
    "domain": "Corporate",
    "email": "arsktraders@gmail.com",
    "phone": "9415068548",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "व्यापार at ARSK TRADERS • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-25",
    "name": "Raj Narayan",
    "initials": "RN",
    "batch": 1993,
    "house": "Aravali",
    "role": "Teaching",
    "location": "Kadipur",
    "domain": "Corporate",
    "email": "rajnarayan22417@gmail.com",
    "phone": "9451094720",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teaching at Basic siksha • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-26",
    "name": "Anurag Yadav",
    "initials": "AY",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "P G T",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "anuragamethi@gmail.com",
    "phone": "9454267417",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "P G T at MPVM • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-27",
    "name": "Shailendra Singh",
    "initials": "SS",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Chartered Accountant",
    "location": "Goa",
    "domain": "Corporate",
    "email": "shailendra26051978@gmail.com",
    "phone": "8806669727",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Chartered Accountant at Deltin Grp • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-28",
    "name": "Dilip Kumar",
    "initials": "DK",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Gram Vikas Adhikari",
    "location": "Amethi",
    "domain": "Corporate",
    "email": "dilipkumar.khushi@gmail.com",
    "phone": "9451455180",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Gram Vikas Adhikari at Development • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-29",
    "name": "Ram Shabd Yadav",
    "initials": "RS",
    "batch": 1997,
    "house": "Aravali",
    "role": "Assistant Teacher Intercollege",
    "location": "Aligarh",
    "domain": "Academia",
    "email": "ramshabd1979@gmail.com",
    "phone": "9650272088",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Teacher Intercollege at Ric Akarabad Aligarh • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-30",
    "name": "Anurag Jaiswal",
    "initials": "AJ",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Business",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "omjaiswal4312@gmail.com",
    "phone": "9918353654",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Business at Jaiswal home appliances • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-31",
    "name": "Bajrang Bali",
    "initials": "BB",
    "batch": 1996,
    "house": "Aravali",
    "role": "Primary school HT",
    "location": "Jamon Amethi",
    "domain": "Academia",
    "email": "bajrangbali8914@gmail.com",
    "phone": "9919203726",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Primary school HT at Besic Education Department • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-32",
    "name": "Rana Pratap Singh",
    "initials": "RP",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Director",
    "location": "New Delhi",
    "domain": "Corporate",
    "email": "icallrana@gmail.com",
    "phone": "9968058057",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Director at Saurya Edunext Gen Private Limited • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-33",
    "name": "Amit Kumar Singh",
    "initials": "AK",
    "batch": 1994,
    "house": "Udaigiri",
    "role": "BANKER",
    "location": "RAEBARELI",
    "domain": "Corporate",
    "email": "amitsingh508@gmail.com",
    "phone": "8331967953",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "BANKER at BANK OF BARODA • Batch of 1994 (Udaigiri House)."
  },
  {
    "id": "alumni-34",
    "name": "Jai Prakash Yadav",
    "initials": "JP",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Chief Cipher Inspector West Central Railway Headquarter Jabalpur M.P",
    "location": "Jabalpur MP",
    "domain": "Corporate",
    "email": "jpyadav954@gmail.com",
    "phone": "9516642644",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Chief Cipher Inspector West Central Railway Headquarter Jabalpur M.P at Indian Railways • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-35",
    "name": "Abhishek Kumar Baranwal",
    "initials": "AK",
    "batch": 1997,
    "house": "Aravali",
    "role": "Shopkeeper",
    "location": "Chowk sultanpur",
    "domain": "Corporate",
    "email": "suitcollection890@gmail.com",
    "phone": "7081736183",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Shopkeeper at Suit collection • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-36",
    "name": "Rajendra Kumar Singh",
    "initials": "RK",
    "batch": 1997,
    "house": "Shivalik",
    "role": "Senior Auditor officer",
    "location": "Sultanpur",
    "domain": "Technology",
    "email": "rajendrasingh20381@gmail.com",
    "phone": "9415576427",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Senior Auditor officer at Up government • Batch of 1997 (Shivalik House)."
  },
  {
    "id": "alumni-37",
    "name": "Pankaj Pandey",
    "initials": "PP",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Civil Engineer",
    "location": "Surat, Gujarat",
    "domain": "Technology",
    "email": "pankajpandey.lko@gmail.com",
    "phone": "9927201099",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Civil Engineer at Larsen and Toubro • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-38",
    "name": "Vinay Kumar Agrawal",
    "initials": "VK",
    "batch": 1998,
    "house": "Shivalik",
    "role": "PROPERIETOR",
    "location": "JAGDIASHPUR",
    "domain": "Corporate",
    "email": "12.vinay@gmail.com",
    "phone": "9868451284",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "PROPERIETOR at RAJ AND ASSOCIATES • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-39",
    "name": "Ramesh Kumar Singh",
    "initials": "RK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Agriculture / Transporting",
    "location": "Kolkata",
    "domain": "Corporate",
    "email": "ramesh.singh0531@gmail.com",
    "phone": "7897543048",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Agriculture / Transporting at Krishna Traders • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-40",
    "name": "Bharat Bhushan Pratap Singh",
    "initials": "BB",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Second in Command",
    "location": "Kashmir",
    "domain": "Corporate",
    "email": "bharatbps@gmail.com",
    "phone": "9415332824",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Second in Command at CRPF • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-41",
    "name": "Ashutosh Singh",
    "initials": "AS",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Regional Operations Manager",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "ashutoshsingh79@gmail.com",
    "phone": "9997007666",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Regional Operations Manager at Axis Bank ltd • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-42",
    "name": "Navratna Pandey",
    "initials": "NP",
    "batch": 1994,
    "house": "Shivalik",
    "role": "legal wing",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "navratnapandey112@gmail.com",
    "phone": "8108788687",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "legal wing at Indian Air Force (Retired) • Batch of 1994 (Shivalik House)."
  },
  {
    "id": "alumni-43",
    "name": "Vinay Kumar Gupta",
    "initials": "VK",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "QA manager",
    "location": "Dehradun",
    "domain": "Corporate",
    "email": "vinayjnv07@gmail.com",
    "phone": "9580399191",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "QA manager at MM pharma • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-44",
    "name": "Ram Sanware",
    "initials": "RS",
    "batch": 1993,
    "house": "Aravali",
    "role": "TEACHER IN BASIC EDUCATION",
    "location": "JAISINGHPUR SULTANPUR",
    "domain": "Academia",
    "email": "rsrao.isa@gmail.com",
    "phone": "8853777094",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "TEACHER IN BASIC EDUCATION at BASIC SHIKSHA PARISHAD UTTAR PRADESH • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-45",
    "name": "Anuradha Rai",
    "initials": "AR",
    "batch": 2009,
    "house": "Shivalik",
    "role": "Engineer",
    "location": "Lucknow",
    "domain": "Technology",
    "email": "anuradharai2008@gmail.com",
    "phone": "9569198089",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Engineer at UP METRO • Batch of 2009 (Shivalik House)."
  },
  {
    "id": "alumni-46",
    "name": "Shiva Mishra",
    "initials": "SM",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Government Employee",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "shiwanimishra333@gmail.com",
    "phone": "8299657773",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Government Employee at Uttar Pradesh Police • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-47",
    "name": "Imamuddin",
    "initials": "I",
    "batch": 1995,
    "house": "Aravali",
    "role": "Head teacher",
    "location": "Sitapur",
    "domain": "Academia",
    "email": "ansariimam666@gmail.com",
    "phone": "9598802349",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Head teacher at Besic education • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-48",
    "name": "Smriti K. Singh",
    "initials": "SS",
    "batch": 1996,
    "house": "Aravali",
    "role": "Bussiness",
    "location": "Work from home",
    "domain": "Corporate",
    "email": "smriti.navodaya@gmail.com",
    "phone": "7905866418",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Bussiness at Youtube • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-49",
    "name": "Anjani Kumar Giri",
    "initials": "AK",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Senior Manager",
    "location": "Kanpur Terminal",
    "domain": "Corporate",
    "email": "anjanigiri@gmail.com",
    "phone": "919866651634",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Senior Manager at Hindustan petroleum • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-50",
    "name": "Lal Prakhar Singh",
    "initials": "LP",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Energy Traders",
    "location": "Gujarat -Kutch",
    "domain": "Corporate",
    "email": "lalprakhar@gmail.com",
    "phone": "942667782q",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Energy Traders at Kandla Trade Link • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-51",
    "name": "Khushilal Maurya",
    "initials": "KM",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Assistant teacher jhs",
    "location": "Composite school motiganj",
    "domain": "Academia",
    "email": "mauryakhushilal@gmail.com",
    "phone": "94526 34272",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant teacher jhs at Basic education • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-52",
    "name": "Amit Kumar",
    "initials": "AK",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Assistant Teacher",
    "location": "Khairatpur, Jagdishpur, Amethi (U.P.)",
    "domain": "Academia",
    "email": "amitjmnps@gmail.com",
    "phone": "9670822202",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at Basic Shiksha Parishad • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-53",
    "name": "Arunesh Vaish",
    "initials": "AV",
    "batch": 1993,
    "house": "Aravali",
    "role": "HEAD MASTER",
    "location": "LUCKNOW",
    "domain": "Corporate",
    "email": "avaish2k3@gmail.com",
    "phone": "7839456550",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "HEAD MASTER at KENDRIYA VIDYALAYA SANGATHAN • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-54",
    "name": "Dharmendra Mishra",
    "initials": "DM",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Business",
    "location": "Pagyagipur sultanpur",
    "domain": "Corporate",
    "email": "mishradharam13@gmail.com",
    "phone": "9415705021",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Business at Bharat bhushan filling station • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-55",
    "name": "Katyayni Kumar Mishra",
    "initials": "KK",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Doctor ( Radiologist)",
    "location": "Safdarjung Enclave , New Delhi",
    "domain": "Medicine",
    "email": "dr.kkmisra@gmail.com",
    "phone": "9871421227",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Doctor ( Radiologist) at Saksham Imaging &amp; Diagnostics Private Limited • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-56",
    "name": "Vinod Kumar Singh",
    "initials": "VK",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Assistant Commandant",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "andhul05@gmail.com",
    "phone": "8072528634",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant Commandant at CRPF • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-57",
    "name": "Raj Kamal",
    "initials": "RK",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "District Balrampur up",
    "domain": "Academia",
    "email": "rajkamal5177@gmail.com",
    "phone": "9628081655",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education department • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-58",
    "name": "Amit Mishra",
    "initials": "AM",
    "batch": 1993,
    "house": "Aravali",
    "role": "Automobil Engg/Service Genral Manager",
    "location": "Pratapgarh/ Sultanpur",
    "domain": "Corporate",
    "email": "amitmishra.sultanpur@gmail.com",
    "phone": "7355418242",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Automobil Engg/Service Genral Manager at Unique Autosales Pvt Ltd. Tata Motors Commercial • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-59",
    "name": "Dr Alok Tiwari",
    "initials": "DA",
    "batch": 1994,
    "house": "Aravali",
    "role": "Principal",
    "location": "Hathua Gopalganj Bihar",
    "domain": "Corporate",
    "email": "alokjayaakash@gmail.com",
    "phone": "6388144876",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Principal at Maharani Punam Sahi B Ed College Hathua Gopalganj • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-60",
    "name": "Monika Singh",
    "initials": "MS",
    "batch": 2009,
    "house": "Shivalik",
    "role": "nothing",
    "location": "none",
    "domain": "Corporate",
    "email": "monikasingh9992@gmail.com",
    "phone": "8400451008",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "nothing at none • Batch of 2009 (Shivalik House)."
  },
  {
    "id": "alumni-61",
    "name": "Ashutosh Singh",
    "initials": "AS",
    "batch": 1998,
    "house": "Aravali",
    "role": "Private Sales Officer",
    "location": "Jaunpur",
    "domain": "Civil Services",
    "email": "ashutosh.sultanpur@gmail.com",
    "phone": "8795300082",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Private Sales Officer at Nutricia International Pvt Ltd • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-62",
    "name": "Rupesh Kumar",
    "initials": "RK",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Medical Representative",
    "location": "PRAYAGRAJ",
    "domain": "Medicine",
    "email": "rupeshkumarr1008@gmail.com",
    "phone": "9140214446",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Medical Representative at Synovia • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-63",
    "name": "Harikesh Singh",
    "initials": "HS",
    "batch": 1994,
    "house": "Aravali",
    "role": "Advocate",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "harikeshsing9452@gmail.com",
    "phone": "9452704927",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Advocate at Civil court Sultanpur • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-64",
    "name": "Rajnish Kumar Gautam",
    "initials": "RK",
    "batch": 1996,
    "house": "Aravali",
    "role": "teacher",
    "location": "village Dilawalpur",
    "domain": "Academia",
    "email": "ratneshrolly@gmail.com",
    "phone": "9936493502",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "teacher at Basic dept. • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-65",
    "name": "Pawan Vikram Singh",
    "initials": "PV",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Banker/Branch Manager",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "pawanvikram1@gmail.com",
    "phone": "8887946878",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Banker/Branch Manager at ICICI Bank Ltd • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-66",
    "name": "Neeraj Singh",
    "initials": "NS",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "Doctor",
    "location": "Pratapgarh",
    "domain": "Medicine",
    "email": "drnsinghpbh@gmail.com",
    "phone": "9415476617",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Doctor at Government • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-67",
    "name": "Arun Kumar Srivastava",
    "initials": "AK",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Advocate",
    "location": "Greater Noida",
    "domain": "Corporate",
    "email": "advocate.arun@gmail.com",
    "phone": "9818264723",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Advocate at SHUKLA AND SRIVASTAVA • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-68",
    "name": "Rajesh Pratap Singh",
    "initials": "RP",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Assistant teacher",
    "location": "Gauriganj",
    "domain": "Academia",
    "email": "rajesh.singh227@gmail.com",
    "phone": "6387291788",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic Education Department • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-69",
    "name": "Anil Kumar Gautam",
    "initials": "AK",
    "batch": 1999,
    "house": "Aravali",
    "role": "Teaching/H.T",
    "location": "Jamon, Amethi",
    "domain": "Corporate",
    "email": "aniljnv1999@gmail.com",
    "phone": "9415966146",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teaching/H.T at Besic shiksha vibhaag • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-70",
    "name": "Ashish Mishra",
    "initials": "AM",
    "batch": 1995,
    "house": "Aravali",
    "role": "Social work",
    "location": "Dewa Barabanki",
    "domain": "Corporate",
    "email": "ashish.am47@gmail.com",
    "phone": "8736990246",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Social work at Niramaya hospital and diagnostic center • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-71",
    "name": "Vinod Mishra",
    "initials": "VM",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "Postal Assistance",
    "location": "Shahganj",
    "domain": "Corporate",
    "email": "vinodmishra597@gmail.com",
    "phone": "919452490122",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Postal Assistance at India post • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-72",
    "name": "Dr Pratima Mishra",
    "initials": "DP",
    "batch": 1996,
    "house": "Shivalik",
    "role": "Assistant Professor",
    "location": "NIT Hamirpur",
    "domain": "Academia",
    "email": "pratima@nith.ac.in",
    "phone": "9882152947",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant Professor at National Institute of Technology, Hamirpur, H.P. • Batch of 1996 (Shivalik House)."
  },
  {
    "id": "alumni-73",
    "name": "Harishankar",
    "initials": "H",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Musafirkhana",
    "domain": "Academia",
    "email": "5878hs@gmail.com",
    "phone": "8009103934",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Ah Inter College Musafirkhana • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-74",
    "name": "Ankita Rai",
    "initials": "AR",
    "batch": 2006,
    "house": "Aravali",
    "role": "Physics Lecturer",
    "location": "Sarojininagar Lucknow",
    "domain": "Corporate",
    "email": "ankita.rai24@gmail.com",
    "phone": "8840381993",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Physics Lecturer at Government U.P Sainik Inter college Sarojininagar Lucknow • Batch of 2006 (Aravali House)."
  },
  {
    "id": "alumni-75",
    "name": "Mahesh Chandra",
    "initials": "MC",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Service/ Managet",
    "location": "New Delhi",
    "domain": "Corporate",
    "email": "sonu280907@gmail.com",
    "phone": "7290097142",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Service/ Managet at SATYA Microcapital Ltd. • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-76",
    "name": "Krishna Kumar Tripathi",
    "initials": "KK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Medical representative",
    "location": "Sultanpur",
    "domain": "Medicine",
    "email": "kktripathi41@gmail.com",
    "phone": "9455477541",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Medical representative at Lard Pharma • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-77",
    "name": "Prateek Dwivedi",
    "initials": "PD",
    "batch": 2004,
    "house": "Nilgiri",
    "role": "Principal",
    "location": "Pratapgarh",
    "domain": "Corporate",
    "email": "prateekdwivedi20@gmail.com",
    "phone": "9129351297",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Principal at BDSK EDUCATIONAL INSTITUTE • Batch of 2004 (Nilgiri House)."
  },
  {
    "id": "alumni-78",
    "name": "Rajesh Giri",
    "initials": "RG",
    "batch": 1997,
    "house": "Aravali",
    "role": "Govt service",
    "location": "Mumbai",
    "domain": "Civil Services",
    "email": "rajeshgiri13@gmail.com",
    "phone": "9969233017",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Govt service at Income tax department • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-79",
    "name": "Dr.pravin Kumar Pandey",
    "initials": "DK",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "ASST.PROFESSOR",
    "location": "Pati,champawat",
    "domain": "Academia",
    "email": "pravinrelief@gmail.com",
    "phone": "9554080950",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "ASST.PROFESSOR at Department of Higher education, Uttrakhand govt. • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-80",
    "name": "Santosh Kumar Gupta",
    "initials": "SK",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Business",
    "location": "Surapur",
    "domain": "Corporate",
    "email": "santoshjwell@gmail.com",
    "phone": "9044000152",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Business at Pawan jewell • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-81",
    "name": "Brijesh Kumar Mishra",
    "initials": "BK",
    "batch": 1994,
    "house": "Udaigiri",
    "role": "Teacher/HT",
    "location": "Ps rampur matha, kurwar",
    "domain": "Academia",
    "email": "mishrabrijesh131@gmail.com",
    "phone": "9452079010",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher/HT at Basik shicha parishad • Batch of 1994 (Udaigiri House)."
  },
  {
    "id": "alumni-82",
    "name": "Sushen Chandra Pandey",
    "initials": "SC",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Banker",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "pandeysushen@gmail.com",
    "phone": "7905933185",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Banker at SBI • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-83",
    "name": "Manish Rana",
    "initials": "MR",
    "batch": 2007,
    "house": "Udaigiri",
    "role": "Judicial Magistrate / Civil Judge, U.P. Judiciary",
    "location": "Budaun",
    "domain": "Govt / PSU",
    "email": "manishranabhulaw@gmail.com",
    "phone": "8317024401",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Judicial Magistrate / Civil Judge, U.P. Judicial Service at High Court Allahabad (Civil Court Bisauli, Budaun) • Batch of 2007 (Udaigiri House)." // Banaras Hindu University Law Faculty
  },
  {
    "id": "alumni-84",
    "name": "Alok Kumar Singh",
    "initials": "AK",
    "batch": 2000,
    "house": "Aravali",
    "role": "Business Owner",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "aloksinghdd@gmail.com",
    "phone": "9873241617",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business Owner at SS Vegan Foods • Batch of 2000 (Aravali House)."
  },
  {
    "id": "alumni-85",
    "name": "Anand Verma",
    "initials": "AV",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Assistant Labour Commissioner (Central)",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "alcallahabad23@gmail.com",
    "phone": "9039138220",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant Labour Commissioner (Central) at Ministry of Labour &amp; Employment , GOI • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-86",
    "name": "Utkrisht Pandey",
    "initials": "UP",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "Ex Assistant Commandant,Now in Farming at Native palce",
    "location": "Pratapgarh",
    "domain": "Corporate",
    "email": "utkrishtpandey@gmail.com",
    "phone": "9580250135",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Founder, Rishigram Organics • Decorated former Assistant Commandant (SSB) • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-87",
    "name": "Satyadev",
    "initials": "S",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "General Secretary",
    "location": "All over country",
    "domain": "Corporate",
    "email": "satyadev@navodayajantantrikparty.org",
    "phone": "7376574817",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "General Secretary at Navodaya Jantantrik Party • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-88",
    "name": "Shiv Sharan Chaturvedi",
    "initials": "SS",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Internal Audit (HOD)",
    "location": "New Delhi",
    "domain": "Technology",
    "email": "sharanchaturvedi@gmail.com",
    "phone": "8882030501",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Internal Audit (HOD) at Rudrabhishek Enterprises Limited • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-89",
    "name": "Amlendu Tripathi",
    "initials": "AT",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Doctor (Homeopathic physician)",
    "location": "Lucknow",
    "domain": "Medicine",
    "email": "dramlendu2010@gmail.com",
    "phone": "9795513223",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Doctor (Homeopathic physician) at Vinayak Homeopathic clinic • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-90",
    "name": "Ajay Pandey",
    "initials": "AP",
    "batch": 1993,
    "house": "Aravali",
    "role": "Advocate",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "ajayadvocate1251@gmail.com",
    "phone": "9415068535",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Advocate at Ajay Pandey Advocate • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-91",
    "name": "Adv H L Gautam",
    "initials": "AH",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Advocate",
    "location": "Delhi High court &amp; Supreme court of India",
    "domain": "Corporate",
    "email": "gautamslp@gmail.com",
    "phone": "9953715729",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Advocate at H.L.GAUTAM &amp; ASSOCIATES (LAW FIRM) • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-92",
    "name": "Mohd Vaseem Akram",
    "initials": "MV",
    "batch": 2005,
    "house": "Udaigiri",
    "role": "Job",
    "location": "Raebareli",
    "domain": "Corporate",
    "email": "vaseemakram485@gmail.com",
    "phone": "9454798260",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Job at Excise • Batch of 2005 (Udaigiri House)."
  },
  {
    "id": "alumni-93",
    "name": "Bhanu Pratap Singh",
    "initials": "BP",
    "batch": 1998,
    "house": "Aravali",
    "role": "Captain in Merchant Navy",
    "location": "World wide",
    "domain": "Corporate",
    "email": "bpsingh901@gmail.com",
    "phone": "8299535890",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Captain in Merchant Navy at UML • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-94",
    "name": "Nand Kumar",
    "initials": "NK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Teacher",
    "location": "JAGDISHPUR",
    "domain": "Academia",
    "email": "nand11381@gmail.com",
    "phone": "9473555346",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-95",
    "name": "Pramod Kumar Singh",
    "initials": "PK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Software professional",
    "location": "Pune",
    "domain": "Technology",
    "email": "pramodksingh03@gmail.com",
    "phone": "9604812405",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Software professional at Capita India LTD • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-96",
    "name": "Avinash",
    "initials": "A",
    "batch": 1993,
    "house": "Aravali",
    "role": "Manager Technical",
    "location": "Noida",
    "domain": "Technology",
    "email": "d.avinash.k@gmail.com",
    "phone": "9818215530",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Manager Technical at MORIROKU Technology Indian Pvt Ltd • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-97",
    "name": "Atma Prakash",
    "initials": "AP",
    "batch": 1996,
    "house": "Aravali",
    "role": "Manager",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "atmaprakash47516@gmail.com",
    "phone": "9140427083",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Manager at K.M sugar mill • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-98",
    "name": "Rajesh Pr",
    "initials": "RP",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Air Veteran, Clerk in SBI",
    "location": "Ernakulam",
    "domain": "Corporate",
    "email": "mailboxofrajeshpr@gmail.com",
    "phone": "9489643981",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Air Veteran, Clerk in SBI at SBI • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-99",
    "name": "A T Rajani",
    "initials": "AT",
    "batch": 1994,
    "house": "Aravali",
    "role": "STAFF NURSE",
    "location": "MALAMPUZHA,PALAKKAD",
    "domain": "Corporate",
    "email": "muralirajani01@gmail.com",
    "phone": "8889262830",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "STAFF NURSE at NAVODAYA VIDYALAYA SAMITI • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-100",
    "name": "Rama Shankar Yadav",
    "initials": "RS",
    "batch": 1994,
    "house": "Aravali",
    "role": "Governor's Awardee Teacher • Head Teacher",
    "location": "Gauriganj",
    "domain": "Corporate",
    "email": "rshan1477@gmail.com",
    "phone": "9651839467",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "HT at Basic Education • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-101",
    "name": "Mahendra Kumar Singh",
    "initials": "MK",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Teaching",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "akashganga997@gmail.com",
    "phone": "9450144808",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teaching at Basic shiksha parishad • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-102",
    "name": "Vishwanath Pratap Singh",
    "initials": "VP",
    "batch": 2001,
    "house": "Aravali",
    "role": "Head teacher in basic edu dept",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "singh.vishwanathpratap@gmail.com",
    "phone": "7985145735",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Head teacher in basic edu dept at Basic education dept • Batch of 2001 (Aravali House)."
  },
  {
    "id": "alumni-103",
    "name": "Sreeeji Augustine",
    "initials": "SA",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Journalist",
    "location": "Kochi",
    "domain": "Media & Journalism",
    "email": "sreejister@gmail.com",
    "phone": "9447378320",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Journalist at Malayala Manorama • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-104",
    "name": "Kazal Khare",
    "initials": "KK",
    "batch": 2000,
    "house": "Nilgiri",
    "role": "Teacher as P. G. T.",
    "location": "Hardoi",
    "domain": "Academia",
    "email": "kazalsaxena11@gmail.com",
    "phone": "6392959515",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher as P. G. T. at JVCOE KHETUI HARDOI • Batch of 2000 (Nilgiri House)."
  },
  {
    "id": "alumni-105",
    "name": "Pradeep Narayan Jha",
    "initials": "PN",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Teaching",
    "location": "BLOCK KARAUDIKALA SULTANPUR",
    "domain": "Corporate",
    "email": "pradeepjhaa981@gmail.com",
    "phone": "9451695095",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teaching at Basic shiksha vibhag • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-106",
    "name": "K K Tiwari (krishna Kumar Tiwari)",
    "initials": "KK",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Block kurebhar",
    "domain": "Academia",
    "email": "kktiwari04676@gmail.com",
    "phone": "919453503471",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Education department • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-107",
    "name": "Manoj Kumar Jaiswal",
    "initials": "MK",
    "batch": 1997,
    "house": "Aravali",
    "role": "Head cashier",
    "location": "Haidergarh",
    "domain": "Corporate",
    "email": "manoj0910jaiswal@gmail.com",
    "phone": "9473520153",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Head cashier at Bank of India • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-108",
    "name": "Raj Shekhar Singh",
    "initials": "RS",
    "batch": 1995,
    "house": "Aravali",
    "role": "Govt appr contr",
    "location": "एनसी रेल",
    "domain": "Civil Services",
    "email": "rajshekharpbh@gmail.com",
    "phone": "8299039406",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Govt appr contr at Indra inter • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-109",
    "name": "Mohd Vaseem",
    "initials": "MV",
    "batch": 2000,
    "house": "Nilgiri",
    "role": "Electrician",
    "location": "Murlinagar",
    "domain": "Corporate",
    "email": "movaseem92@gmail.com",
    "phone": "9795299278",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Electrician at Self • Batch of 2000 (Nilgiri House)."
  },
  {
    "id": "alumni-110",
    "name": "Geeta Saroj",
    "initials": "GS",
    "batch": 2012,
    "house": "Nilgiri",
    "role": "Assistant teacher",
    "location": "Ayodhya",
    "domain": "Academia",
    "email": "sarojgeeta2503@gmail.com",
    "phone": "8115571200",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic education department • Batch of 2012 (Nilgiri House)."
  },
  {
    "id": "alumni-111",
    "name": "Rakesh Kumar",
    "initials": "RK",
    "batch": 2003,
    "house": "Aravali",
    "role": "LIC Agent",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "raka.softage@gmail.com",
    "phone": "9919563333",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "LIC Agent at LIC • Batch of 2003 (Aravali House)."
  },
  {
    "id": "alumni-112",
    "name": "Gulab Chandra",
    "initials": "GC",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "Govt/ DDO",
    "location": "Unnao",
    "domain": "Civil Services",
    "email": "vinod18896@gmail.com",
    "phone": "7983793938",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Govt/ DDO at Rural development • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-113",
    "name": "Ganga Prasad Gupta",
    "initials": "GP",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Assistnce Teacher (TGT Math)",
    "location": "Maharajganj up",
    "domain": "Academia",
    "email": "gangaprasad34gupta@gmail.com",
    "phone": "9902681390",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistnce Teacher (TGT Math) at UP SESSB • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-114",
    "name": "Bhimesh Kumar Gautam",
    "initials": "BK",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Assistant teacher",
    "location": "DHANPATGANJ",
    "domain": "Academia",
    "email": "bhimeshgautam86@gmail.com",
    "phone": "9140686962",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Parishadiya school, government of up • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-115",
    "name": "Manoj Kumar Mishra",
    "initials": "MK",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Scientist",
    "location": "Space Applications Centre, Ahmedabad",
    "domain": "Corporate",
    "email": "manojkmishra79@gmail.com",
    "phone": "9961295007",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Scientist at Indian Space Research Organisation (ISRO) • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-116",
    "name": "Arunima Kaushal",
    "initials": "AK",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "teacher",
    "location": "Online",
    "domain": "Academia",
    "email": "arunima.kaushal78@gmail.com",
    "phone": "9005796666",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "teacher at 21K • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-117",
    "name": "Munnar Lal",
    "initials": "ML",
    "batch": 1994,
    "house": "Aravali",
    "role": "Government Job",
    "location": "Ayodhya",
    "domain": "Corporate",
    "email": "munnarlal1@gmail.com",
    "phone": "9415879407/6393551871",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Government Job at Planing • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-118",
    "name": "Shweta Singh",
    "initials": "SS",
    "batch": 1998,
    "house": "Aravali",
    "role": "Business",
    "location": "X",
    "domain": "Corporate",
    "email": "shweta23123@gmail.com",
    "phone": "7905827334",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business at X • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-119",
    "name": "Vinod Kumar Shukla",
    "initials": "VK",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Advocate",
    "location": "Greater Noida",
    "domain": "Corporate",
    "email": "vinodshukla723@gmail.com",
    "phone": "9810283723",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Advocate at Shukla and shrivastav associates • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-120",
    "name": "Mukesh Tiwari",
    "initials": "MT",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Operating i o c l ⛽",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "kalawatipharmacy@gmail.com",
    "phone": "9415046485",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Operating i o c l ⛽ at Kalawati filling station lucknow • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-121",
    "name": "Ramendra Kumar",
    "initials": "RK",
    "batch": 2004,
    "house": "Udaigiri",
    "role": "Young professional",
    "location": "Raebareli",
    "domain": "Corporate",
    "email": "ramendrapandey1988@gmail.com",
    "phone": "7905661228",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Young professional at Ministry of labour and employment • Batch of 2004 (Udaigiri House)."
  },
  {
    "id": "alumni-122",
    "name": "Ashish Yadav",
    "initials": "AY",
    "batch": 2022,
    "house": "Udaigiri",
    "role": "Pursuing BCA",
    "location": "CHARBAGH",
    "domain": "Corporate",
    "email": "ashishyadav303579@gmail.com",
    "phone": "8922979740",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Pursuing BCA at GOEL INSTITUTE OF HIGHER STUDIES AND MANAGEMENT • Batch of 2022 (Udaigiri House)."
  },
  {
    "id": "alumni-123",
    "name": "Shivam Sahil Rana",
    "initials": "SS",
    "batch": 2022,
    "house": "Nilgiri",
    "role": "Student",
    "location": "Banaras",
    "domain": "Corporate",
    "email": "ssr807626@gmail.com",
    "phone": "8076269692",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student at Banaras hindu university • Batch of 2022 (Nilgiri House)."
  },
  {
    "id": "alumni-124",
    "name": "Sanuj Savaran (shailendra)",
    "initials": "SS",
    "batch": 2001,
    "house": "Nilgiri",
    "role": "Co founder",
    "location": "Mumbai",
    "domain": "Corporate",
    "email": "shailendra27jan@gmail.com",
    "phone": "9022167205",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Co founder at Teluscare • Batch of 2001 (Nilgiri House)."
  },
  {
    "id": "alumni-125",
    "name": "Vedansh Prasoon",
    "initials": "VP",
    "batch": 2022,
    "house": "Shivalik",
    "role": "Bachelor student",
    "location": "student at Banaras Hindu University",
    "domain": "Corporate",
    "email": "vprasoon8112005@gmail.com",
    "phone": "9260926643",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Bachelor student at Student at BANARAS HINDU UNIVERSITY • Batch of 2022 (Shivalik House)."
  },
  {
    "id": "alumni-126",
    "name": "Sanjay Singh",
    "initials": "SS",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Construction",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "singh94235@gmail.com",
    "phone": "9651865325",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Construction at Om traders • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-127",
    "name": "Dr. Suneeta Paswan",
    "initials": "DS",
    "batch": 1998,
    "house": "Aravali",
    "role": "Scientist",
    "location": "Saharsa , Bihar",
    "domain": "Corporate",
    "email": "suneetapaswan81@gmail.com",
    "phone": "7979817081",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Scientist at KVK, BAU, Sabour, Bhagalpur ( Bihar) • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-128",
    "name": "Narendra Pratap Verma",
    "initials": "NP",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "narendra.verma1980@gmail.com",
    "phone": "9839145709",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education Department • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-129",
    "name": "Shailendra Kumar",
    "initials": "SK",
    "batch": 2001,
    "house": "Shivalik",
    "role": "TEACHER IN BASIC EDUCATION",
    "location": "KARAUNDIKALA, DIST SULTANPUR",
    "domain": "Academia",
    "email": "kshailen85@gmail.com",
    "phone": "9454203352",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "TEACHER IN BASIC EDUCATION at BASIC EDUCATION • Batch of 2001 (Shivalik House)."
  },
  {
    "id": "alumni-130",
    "name": "Rohit Kumar",
    "initials": "RK",
    "batch": 2012,
    "house": "Nilgiri",
    "role": "Assistant teacher basic shiksha parishad uttar pradesh",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "rohitchaudhary945047@gmail.com",
    "phone": "9450478876",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher basic shiksha parishad uttar pradesh at Education • Batch of 2012 (Nilgiri House)."
  },
  {
    "id": "alumni-131",
    "name": "Arun Kumar Bansal",
    "initials": "AK",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Bussiness",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "bansalsultanpur@gmail.com",
    "phone": "8004377753",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Bussiness at Bansal medical agencies • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-132",
    "name": "Khushbu Singh",
    "initials": "KS",
    "batch": 2009,
    "house": "Udaigiri",
    "role": "Assistant teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "khushbu.singh0077@gmail.com",
    "phone": "7084334703",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic shiksha parishad • Batch of 2009 (Udaigiri House)."
  },
  {
    "id": "alumni-133",
    "name": "Sharvan Kumar",
    "initials": "SK",
    "batch": 2022,
    "house": "Nilgiri",
    "role": "Study",
    "location": "NIL",
    "domain": "Corporate",
    "email": "katari8090@gmail.com",
    "phone": "9565759077",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Study at NIL • Batch of 2022 (Nilgiri House)."
  },
  {
    "id": "alumni-134",
    "name": "Shashi Singh",
    "initials": "SS",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "shashisingh60534@gmail.com",
    "phone": "9450402889",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic department • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-135",
    "name": "Neelam Singh",
    "initials": "NS",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "HOUSEWIFE",
    "location": "None",
    "domain": "Corporate",
    "email": "riturajsinghadv18773@gmail.com",
    "phone": "9648603362",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "HOUSEWIFE at None • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-136",
    "name": "Jag Nandan",
    "initials": "JN",
    "batch": 2001,
    "house": "Nilgiri",
    "role": "Sales marketing",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "jagnandan441@gmail.com",
    "phone": "8874475889",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Sales marketing at Ghadi detergent cake/powder • Batch of 2001 (Nilgiri House)."
  },
  {
    "id": "alumni-137",
    "name": "Savitri Shukla",
    "initials": "SS",
    "batch": 2003,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "savitrishukla56@gmail.com",
    "phone": "9335687070",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at School • Batch of 2003 (Shivalik House)."
  },
  {
    "id": "alumni-138",
    "name": "Saurabh Kashyap",
    "initials": "SK",
    "batch": 2022,
    "house": "Shivalik",
    "role": "Student",
    "location": "Munshiganj",
    "domain": "Corporate",
    "email": "saurabhlucky111@gmail.com",
    "phone": "9517334206",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at Rajarshi Rananjay Sinh Institute of Management and Technology • Batch of 2022 (Shivalik House)."
  },
  {
    "id": "alumni-139",
    "name": "Badri Vishal Mishra",
    "initials": "BV",
    "batch": 1993,
    "house": "Aravali",
    "role": "Assistant teacher",
    "location": "Haliyapur Sultanpur are you ready to",
    "domain": "Academia",
    "email": "badrivishalmishra76@gmail.com",
    "phone": "9451255537",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher at SSBS inter College haliyapur Sultanpur up • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-140",
    "name": "Dheeraj",
    "initials": "D",
    "batch": 2022,
    "house": "Shivalik",
    "role": "Student",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "abhinav868704@gmail.com",
    "phone": "9118334203",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at University of allahabad • Batch of 2022 (Shivalik House)."
  },
  {
    "id": "alumni-141",
    "name": "Arun Kumar",
    "initials": "AK",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Chartered Accountant",
    "location": "Mumbai",
    "domain": "Corporate",
    "email": "arunca03@gmail.com",
    "phone": "9833733433",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Chartered Accountant at Arun Jamuna and Co • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-142",
    "name": "Ajay Gautam",
    "initials": "AG",
    "batch": 1997,
    "house": "Aravali",
    "role": "Teaching",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "ajaykumar151180@gmail.com",
    "phone": "8009704462",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teaching at UP Basic shiksha parishad • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-143",
    "name": "Rajnish Kumar Singh",
    "initials": "RK",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "TEACHER",
    "location": "SULTANPUR",
    "domain": "Academia",
    "email": "rajntu07@gmail.com",
    "phone": "9936688615",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "TEACHER at BASIC SIKSHA PARISHAD • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-144",
    "name": "Pratima Singh",
    "initials": "PS",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Teacher/A.T",
    "location": "District-Farrukhabad",
    "domain": "Academia",
    "email": "pratimasingh81276@gmail.com",
    "phone": "9415384232",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher/A.T at Basic education department • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-145",
    "name": "Dr.pradeep Kumar",
    "initials": "DK",
    "batch": 2001,
    "house": "Shivalik",
    "role": "Doctor",
    "location": "Gauriganj",
    "domain": "Medicine",
    "email": "drpradeepkmr@gmail.com",
    "phone": "9450534987",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor at Uttar Pradesh Medical Health and Family Welfare • Batch of 2001 (Shivalik House)."
  },
  {
    "id": "alumni-146",
    "name": "Pradeep Kumar Shukla",
    "initials": "PK",
    "batch": 1997,
    "house": "Shivalik",
    "role": "Excise inspector",
    "location": "Agra",
    "domain": "Corporate",
    "email": "pradeepkushukla@gmail.com",
    "phone": "9161795556",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Excise inspector at Uttar Pradesh excise department • Batch of 1997 (Shivalik House)."
  },
  {
    "id": "alumni-147",
    "name": "Abhay Yadav Jnv Kanpur Nagar",
    "initials": "AY",
    "batch": 2015,
    "house": "Nilgiri",
    "role": "Deputy Manager",
    "location": "Kanpur Nagar",
    "domain": "Corporate",
    "email": "abaxis8090@gmail.com",
    "phone": "9120777203",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Deputy Manager at Axis Bank Ltd • Batch of 2015 (Nilgiri House)."
  },
  {
    "id": "alumni-148",
    "name": "Ravindra Deo",
    "initials": "RD",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Asistant Vice President",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "ravi.deo2010@gmail.com",
    "phone": "9839315515",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Asistant Vice President at Pepsico India • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-149",
    "name": "Rahul Pandey",
    "initials": "RP",
    "batch": 1996,
    "house": "Aravali",
    "role": "Service / Branch Manager",
    "location": "Unnao",
    "domain": "Corporate",
    "email": "rahulaxis@gmail.com",
    "phone": "7007656070",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Service / Branch Manager at HDFC Bank • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-150",
    "name": "Ravi Kumar",
    "initials": "RK",
    "batch": 2003,
    "house": "Shivalik",
    "role": "Private job",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "ritwik080517@gmail.com",
    "phone": "9451267106",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Private job at Indian oil corporation limited • Batch of 2003 (Shivalik House)."
  },
  {
    "id": "alumni-151",
    "name": "Md Saif Khan",
    "initials": "MS",
    "batch": 2022,
    "house": "Udaigiri",
    "role": "Graduation. Running",
    "location": "N/L",
    "domain": "Corporate",
    "email": "khans530008@gmail.com",
    "phone": "7800776437",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Graduation. Running at N/L • Batch of 2022 (Udaigiri House)."
  },
  {
    "id": "alumni-152",
    "name": "Dr Ahmad Ali",
    "initials": "DA",
    "batch": 1996,
    "house": "Aravali",
    "role": "Doctor",
    "location": "Sultanpur",
    "domain": "Medicine",
    "email": "dr.ahmadali1979@gmail.com",
    "phone": "9935845606",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Doctor at Ya Waris Nursing Home • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-153",
    "name": "Mamta Yadav",
    "initials": "MY",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "House wife",
    "location": "My house",
    "domain": "Corporate",
    "email": "kanha201217@gmail.com",
    "phone": "9140260421",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "House wife at Home • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-154",
    "name": "Rajendra Prasad",
    "initials": "RP",
    "batch": 1994,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Babura Tarun Ayodhya",
    "domain": "Academia",
    "email": "rp5991699@gmail.com",
    "phone": "9140149499",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Basic shiksha parishad • Batch of 1994 (Shivalik House)."
  },
  {
    "id": "alumni-155",
    "name": "Biju Baby",
    "initials": "BB",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Asstistant Secretary, Grama Panchayat",
    "location": "Kizhakkambalam, Ernakulam",
    "domain": "Corporate",
    "email": "bijubabynellattu@gmail.com",
    "phone": "9447510638",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Asstistant Secretary, Grama Panchayat at Grama Panchayat, Govt. Of Kerala • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-156",
    "name": "Pawan Singh",
    "initials": "PS",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "JUNIOR ASSISTANT",
    "location": "SULTANPUR",
    "domain": "Corporate",
    "email": "pawancing@gmail.com",
    "phone": "8318762559",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "JUNIOR ASSISTANT at DISTRICT SOLDIER BOARD • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-157",
    "name": "Veer Bhanu Yadav",
    "initials": "VB",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "GRS",
    "location": "Musafir khana",
    "domain": "Corporate",
    "email": "yveerbhanu@gmail.com",
    "phone": "9136926619",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "GRS at Pnchayat • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-158",
    "name": "Sangeeta Maurya",
    "initials": "SM",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Adhiyari, PP Kamaicha, Sultanpur",
    "domain": "Academia",
    "email": "sangeetamaurya1180@gmail.com",
    "phone": "9450188089",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education Department • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-159",
    "name": "Ram Kumar",
    "initials": "RK",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Railway Civil Engineer at Solapur..",
    "location": "Solapur Maharashtra",
    "domain": "Technology",
    "email": "ramkumar151983@gmail.com",
    "phone": "9765646860",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Railway Civil Engineer at Solapur.. at Central railway • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-160",
    "name": "Raj Kumar Baranwal",
    "initials": "RK",
    "batch": 2014,
    "house": "Aravali",
    "role": "JE Indian railway",
    "location": "Bhusawal",
    "domain": "Corporate",
    "email": "rajiit.98@gmail.com",
    "phone": "7007357464",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "JE Indian railway at Indian railway • Batch of 2014 (Aravali House)."
  },
  {
    "id": "alumni-161",
    "name": "Abhay Kumar Tiwari",
    "initials": "AK",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Advocate",
    "location": "sultanpur district court",
    "domain": "Corporate",
    "email": "abhaytiwarijee@gmail.com",
    "phone": "965300868, 9455768559",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Advocate at advocacy • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-162",
    "name": "Devendra Singh",
    "initials": "DS",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Physical Education teacher",
    "location": "Shahjahanpur",
    "domain": "Academia",
    "email": "devendras099@gmail.com",
    "phone": "9415961821",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Physical Education teacher at Navodaya vidyalaya samiti • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-163",
    "name": "Manish Kumar Agrahari",
    "initials": "MK",
    "batch": 2022,
    "house": "Nilgiri",
    "role": "College student",
    "location": "Studying in gl bajaj institute of management and technology",
    "domain": "Academia",
    "email": "mka9146866@gmail.com",
    "phone": "7080645441",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "College student at None • Batch of 2022 (Nilgiri House)."
  },
  {
    "id": "alumni-164",
    "name": "Ravendra Pratap Singh",
    "initials": "RP",
    "batch": 1996,
    "house": "Shivalik",
    "role": "Teaching Assistant teacher",
    "location": "JAGDISHPUR AMETHI",
    "domain": "Academia",
    "email": "pratapsinghravendra76@gmail.com",
    "phone": "9918861966",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teaching Assistant teacher at A H INTER COLLEGE JAGDISHPUR AMETHI • Batch of 1996 (Shivalik House)."
  },
  {
    "id": "alumni-165",
    "name": "Sandeep Kumar Tiwari",
    "initials": "SK",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Fashion &amp; Apparel / Asst. Manager ( Category Management)",
    "location": "Gurgaon",
    "domain": "Corporate",
    "email": "sandeepabhi2007@gmail.com",
    "phone": "9310259148",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Fashion &amp; Apparel / Asst. Manager ( Category Management) at Blackberrys • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-166",
    "name": "Nancy",
    "initials": "N",
    "batch": 2018,
    "house": "Nilgiri",
    "role": "College student",
    "location": "NFSU",
    "domain": "Academia",
    "email": "nancygoswami55@gmail.com",
    "phone": "9935919877",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "College student at .. • Batch of 2018 (Nilgiri House)."
  },
  {
    "id": "alumni-167",
    "name": "Soniya Parveen",
    "initials": "SP",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "Doing MBBS",
    "location": "Shahjahanpur Uttar Pradesh",
    "domain": "Corporate",
    "email": "soniyagem786@gmail.com",
    "phone": "9794329996",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Doing MBBS at Autonomous state medical College Shahjahanpur • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-168",
    "name": "Akash Kanaujiya",
    "initials": "AK",
    "batch": 2019,
    "house": "Udaigiri",
    "role": "MBBS 3rd yr student",
    "location": "Govt. Medical college ambedkarnagar",
    "domain": "Corporate",
    "email": "kanaujiyaakash183@gmail.com",
    "phone": "9580484126",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "MBBS 3rd yr student at Medical field • Batch of 2019 (Udaigiri House)."
  },
  {
    "id": "alumni-169",
    "name": "Sanjay Tiwari",
    "initials": "ST",
    "batch": 2008,
    "house": "Shivalik",
    "role": "Executive Officer",
    "location": "Gorakhpur",
    "domain": "Civil Services",
    "email": "tiwarisanjay786@gmail.com",
    "phone": "7408092808",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Executive Officer at Urban Devlopment Department UP Govt • Batch of 2008 (Shivalik House)."
  },
  {
    "id": "alumni-170",
    "name": "Abhay Sharma",
    "initials": "AS",
    "batch": 2020,
    "house": "Aravali",
    "role": "Engineering",
    "location": "Bhopal",
    "domain": "Technology",
    "email": "abhaysharmamantu@gmail.com",
    "phone": "7413853084",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Engineering at College • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-171",
    "name": "Daya Shankar",
    "initials": "DS",
    "batch": 2008,
    "house": "Aravali",
    "role": "Assistant teacher",
    "location": "Sangrampur",
    "domain": "Academia",
    "email": "devbtc11@gmail.com",
    "phone": "9598447969",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Department of Basic education up • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-172",
    "name": "Anshika Giri",
    "initials": "AG",
    "batch": 2020,
    "house": "Aravali",
    "role": "Bsc student",
    "location": "Home",
    "domain": "Corporate",
    "email": "anshikagiri011@gmail.com",
    "phone": "9219088529",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Bsc student at Awadh University • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-173",
    "name": "Sanjay Singh",
    "initials": "SS",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "-",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "sany.sanjay@gmail.com",
    "phone": "7011130341",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "- at - • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-174",
    "name": "Pawan Kumar Kaushal",
    "initials": "PK",
    "batch": 2001,
    "house": "Aravali",
    "role": "Business",
    "location": "Jagdishpur",
    "domain": "Corporate",
    "email": "pawankaushal0007@gmail.com",
    "phone": "8707566096",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business at Not yet • Batch of 2001 (Aravali House)."
  },
  {
    "id": "alumni-175",
    "name": "Ashfaque Ahmad",
    "initials": "AA",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Software Architect",
    "location": "Sultanpur",
    "domain": "Technology",
    "email": "ashfaque.ahmad15@gmail.com",
    "phone": "9972868674",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Software Architect at CSG International • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-176",
    "name": "Satyarshi Mishra",
    "initials": "SM",
    "batch": 2006,
    "house": "Udaigiri",
    "role": "Chartered Accountant",
    "location": "Pune",
    "domain": "Corporate",
    "email": "casatyarshi@gmail.com",
    "phone": "9595331390",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Chartered Accountant at EisnerAmper (India) Consultants Private Limited • Batch of 2006 (Udaigiri House)."
  },
  {
    "id": "alumni-177",
    "name": "Shashi Prakash Gautam",
    "initials": "SP",
    "batch": 2004,
    "house": "Shivalik",
    "role": "HEAD MASTER PS SONARA SUITHAKALA TEHSIL SHAHGANJ DISTRICT JAUNPUR",
    "location": "JAUNPUR",
    "domain": "Technology",
    "email": "shashipgautam@gmail.com",
    "phone": "9453152252",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "HEAD MASTER PS SONARA SUITHAKALA TEHSIL SHAHGANJ DISTRICT JAUNPUR at BASIC EDUCATION DEPARTMENT UP • Batch of 2004 (Shivalik House)."
  },
  {
    "id": "alumni-178",
    "name": "Alok Kumar Upadhyay",
    "initials": "AK",
    "batch": 2003,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "alokupadhyay1986.au@gmail.com",
    "phone": "8299208520",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Up basic shiksha parishad • Batch of 2003 (Udaigiri House)."
  },
  {
    "id": "alumni-179",
    "name": "Deeptendra Pratap Singh",
    "initials": "DP",
    "batch": 2019,
    "house": "Udaigiri",
    "role": "MBBS 2nd yr",
    "location": "Student",
    "domain": "Corporate",
    "email": "deeptendrapratap2003@gmail.com",
    "phone": "9170734663",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "MBBS 2nd yr at Government • Batch of 2019 (Udaigiri House)."
  },
  {
    "id": "alumni-180",
    "name": "Pradeep Kumar",
    "initials": "PK",
    "batch": 2003,
    "house": "Aravali",
    "role": "Assistant teacher in up basic",
    "location": "C S Hariharpur Bihar Kunda Pratapgarh",
    "domain": "Academia",
    "email": "pk104758@gmail.com",
    "phone": "9621057938",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher in up basic at UP Basic Education • Batch of 2003 (Aravali House)."
  },
  {
    "id": "alumni-181",
    "name": "Raj Gautam",
    "initials": "RG",
    "batch": 2022,
    "house": "Aravali",
    "role": "Student",
    "location": "No",
    "domain": "Corporate",
    "email": "graj37664@gmail.com",
    "phone": "8881403365",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student at No • Batch of 2022 (Aravali House)."
  },
  {
    "id": "alumni-182",
    "name": "Ranjana",
    "initials": "R",
    "batch": 2002,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Ayodhya",
    "domain": "Academia",
    "email": "ranjanakumari7408@gmail.com",
    "phone": "9454155379",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Up basic • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-183",
    "name": "Shubhendra Pratap",
    "initials": "SP",
    "batch": 2020,
    "house": "Shivalik",
    "role": "Student",
    "location": "B.Tech CSE 3rd year",
    "domain": "Corporate",
    "email": "shubhendra9919@gmail.com",
    "phone": "7985933742",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at National Institute of Technology, Patna • Batch of 2020 (Shivalik House)."
  },
  {
    "id": "alumni-184",
    "name": "Neelesh Kumar Agrahari",
    "initials": "NK",
    "batch": 2018,
    "house": "Aravali",
    "role": "Student",
    "location": "Nil",
    "domain": "Corporate",
    "email": "agraharineelesh9@gmail.com",
    "phone": "7393887087",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student at Nil • Batch of 2018 (Aravali House)."
  },
  {
    "id": "alumni-185",
    "name": "Rajesh Kumar",
    "initials": "RK",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Teacher in Ups",
    "location": "Ups Chandipur kalan Block Jahangirganj District Ambedkarnagar",
    "domain": "Academia",
    "email": "rk8607578@gmail.com",
    "phone": "9792116309",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher in Ups at Basic Education • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-186",
    "name": "Akriti Vishwakarma",
    "initials": "AV",
    "batch": 2021,
    "house": "Nilgiri",
    "role": "BSC.student",
    "location": "NIL",
    "domain": "Corporate",
    "email": "akritivishwakarma959@gmail.com",
    "phone": "6388611791",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "BSC.student at Home • Batch of 2021 (Nilgiri House)."
  },
  {
    "id": "alumni-187",
    "name": "Vijay Kumar",
    "initials": "VK",
    "batch": 2004,
    "house": "Nilgiri",
    "role": "Plumber Foreman",
    "location": "Jeddah",
    "domain": "Corporate",
    "email": "vijaykumarlucknow2015@gmail.com",
    "phone": "966573088040",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Plumber Foreman at Safari group • Batch of 2004 (Nilgiri House)."
  },
  {
    "id": "alumni-188",
    "name": "Alok Mishra",
    "initials": "AM",
    "batch": 1993,
    "house": "Aravali",
    "role": "Teacher",
    "location": "Lucknow",
    "domain": "Academia",
    "email": "alokgnj1976@gmail.com",
    "phone": "9452646956",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Khalsa College Lucknow • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-189",
    "name": "Dinesh Maurya",
    "initials": "DM",
    "batch": 2003,
    "house": "Aravali",
    "role": "Teacher",
    "location": "Gonda",
    "domain": "Academia",
    "email": "brdinesh1986@gmail.com",
    "phone": "8795030049",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education • Batch of 2003 (Aravali House)."
  },
  {
    "id": "alumni-190",
    "name": "Amritlal",
    "initials": "A",
    "batch": 2004,
    "house": "Aravali",
    "role": "Subdivisional officer",
    "location": "Ballia",
    "domain": "Civil Services",
    "email": "amritlal270@gmail.com",
    "phone": "9006174987",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Subdivisional officer at Irrigation and water resources department govt of UP • Batch of 2004 (Aravali House)."
  },
  {
    "id": "alumni-191",
    "name": "Anju Kashyap",
    "initials": "AK",
    "batch": 2021,
    "house": "Shivalik",
    "role": "B.a student",
    "location": "Nil",
    "domain": "Corporate",
    "email": "anjukashyap755@gmail.com",
    "phone": "9555495206",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "B.a student at Home • Batch of 2021 (Shivalik House)."
  },
  {
    "id": "alumni-192",
    "name": "Mahendra Kumar",
    "initials": "MK",
    "batch": 2002,
    "house": "Aravali",
    "role": "Up",
    "location": "Erica",
    "domain": "Corporate",
    "email": "n23441643@gmail.com",
    "phone": "7379223899",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Up at Erica • Batch of 2002 (Aravali House)."
  },
  {
    "id": "alumni-193",
    "name": "Atul Kumar Tej",
    "initials": "AK",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Officer in state GST",
    "location": "Lucknow",
    "domain": "Civil Services",
    "email": "ajayatifpratap.1991@gmail.com",
    "phone": "9415615204",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Officer in state GST at UP Govt • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-194",
    "name": "Om Kumar Verma",
    "initials": "OK",
    "batch": 2004,
    "house": "Udaigiri",
    "role": "Clerk in 610088 D.El.Ed college Sultanpur",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "omv4702@gmail.com",
    "phone": "8565072821",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Clerk in 610088 D.El.Ed college Sultanpur at PUSHKER INFOTECH COLLEGE &amp; KPRT .D.El.Ed COLLEGE • Batch of 2004 (Udaigiri House)."
  },
  {
    "id": "alumni-195",
    "name": "Omit Mishra",
    "initials": "OM",
    "batch": 2019,
    "house": "Udaigiri",
    "role": "Persuing Ba. LLB.",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "mishraomit255@gmail.com",
    "phone": "6386552324",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Persuing Ba. LLB. at Allahabad University • Batch of 2019 (Udaigiri House)."
  },
  {
    "id": "alumni-196",
    "name": "Kamran Khan",
    "initials": "KK",
    "batch": 2004,
    "house": "Nilgiri",
    "role": "Self employed",
    "location": "JAGDISHPUR",
    "domain": "Corporate",
    "email": "kamran020188@gmail.com",
    "phone": "9956347070",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Self employed at Jafarganj green city • Batch of 2004 (Nilgiri House)."
  },
  {
    "id": "alumni-197",
    "name": "Anubhav Singh",
    "initials": "AS",
    "batch": 2022,
    "house": "Nilgiri",
    "role": "Graduation",
    "location": "University of Allahabad",
    "domain": "Corporate",
    "email": "singh5anubhav7@gmail.com",
    "phone": "8112684678",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Graduation at University of allahabad • Batch of 2022 (Nilgiri House)."
  },
  {
    "id": "alumni-198",
    "name": "Anil Singh",
    "initials": "AS",
    "batch": 2011,
    "house": "Shivalik",
    "role": "Engineer",
    "location": "Remote",
    "domain": "Technology",
    "email": "sanil123321@gmail.com",
    "phone": "8795645699",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Engineer at https://www.tryjeeves.com • Batch of 2011 (Shivalik House)."
  },
  {
    "id": "alumni-199",
    "name": "Pradeep Kumar Dubey",
    "initials": "PK",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Surveyor, pradhanmantri awas Yojana",
    "location": "Bhadohi",
    "domain": "Corporate",
    "email": "pd471397@gmail.com",
    "phone": "9415674325",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Surveyor, pradhanmantri awas Yojana at Sbengred • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-200",
    "name": "Anil Kumar Singh",
    "initials": "AK",
    "batch": 2001,
    "house": "Shivalik",
    "role": "Service",
    "location": "Barabanki",
    "domain": "Corporate",
    "email": "anilsinghapo@gmail.com",
    "phone": "790561751",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Service at Rd UP • Batch of 2001 (Shivalik House)."
  },
  {
    "id": "alumni-201",
    "name": "Shiv Balak",
    "initials": "SB",
    "batch": 1999,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "UPSIDC Kathaura Amethi",
    "domain": "Academia",
    "email": "shiv.muir@gmail.com",
    "phone": "9454261899",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Department of Basic education • Batch of 1999 (Shivalik House)."
  },
  {
    "id": "alumni-202",
    "name": "Rohit Kumar Saroj",
    "initials": "RK",
    "batch": 2012,
    "house": "Shivalik",
    "role": "Doctor/Senior Resident",
    "location": "VARANASI",
    "domain": "Medicine",
    "email": "rk09997@gmail.com",
    "phone": "8795948848",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor/Senior Resident at Bhu • Batch of 2012 (Shivalik House)."
  },
  {
    "id": "alumni-203",
    "name": "Satyendra Kumar",
    "initials": "SK",
    "batch": 2001,
    "house": "Aravali",
    "role": "Training Manager/Area Manager",
    "location": "LUCKNOW",
    "domain": "Corporate",
    "email": "satyendrak101@gmail.com",
    "phone": "9918399996",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Training Manager/Area Manager at Talent India • Batch of 2001 (Aravali House)."
  },
  {
    "id": "alumni-204",
    "name": "Tribhuwan Prasad",
    "initials": "TP",
    "batch": 2001,
    "house": "Shivalik",
    "role": "Head teacher",
    "location": "Kadipur sultanpur",
    "domain": "Academia",
    "email": "tribhuwansahil@gmail.com",
    "phone": "9450061196",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Head teacher at Basic education department • Batch of 2001 (Shivalik House)."
  },
  {
    "id": "alumni-205",
    "name": "Aaditya Vikram",
    "initials": "AV",
    "batch": 2019,
    "house": "Shivalik",
    "role": "Student",
    "location": "Silchar",
    "domain": "Corporate",
    "email": "vikramadityajnvg@gmail.com",
    "phone": "9450017292",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at NIT silchar Assam • Batch of 2019 (Shivalik House)."
  },
  {
    "id": "alumni-206",
    "name": "Daljeet Kumar",
    "initials": "DK",
    "batch": 2004,
    "house": "Shivalik",
    "role": "Office assistant",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "daljeetk50@gmail.com",
    "phone": "9455624615",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Office assistant at Uttar pradesh pariwahan nigam • Batch of 2004 (Shivalik House)."
  },
  {
    "id": "alumni-207",
    "name": "Anil Kumar Pandey",
    "initials": "AK",
    "batch": 2011,
    "house": "Aravali",
    "role": "Branch manager",
    "location": "Kaushambi",
    "domain": "Corporate",
    "email": "anilpandey10feb@gmail.com",
    "phone": "9415403638",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Branch manager at Bank of Baroda • Batch of 2011 (Aravali House)."
  },
  {
    "id": "alumni-208",
    "name": "Gaurav Rastogi",
    "initials": "GR",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Business",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "gauravrastogi77@gmail.com",
    "phone": "9839170735",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Business at Rastogi dress • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-209",
    "name": "Lavkush Nigam",
    "initials": "LN",
    "batch": 2001,
    "house": "Udaigiri",
    "role": "Ayurved Doctor",
    "location": "Online",
    "domain": "Medicine",
    "email": "lavkushnigam1@gmail.com",
    "phone": "8299008056",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Ayurved Doctor at Dr Lav Ayurved • Batch of 2001 (Udaigiri House)."
  },
  {
    "id": "alumni-210",
    "name": "Renu Srivastava",
    "initials": "RS",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Teacher HT",
    "location": "Uttargaon",
    "domain": "Academia",
    "email": "suryanshrenusri99358@gmail.com",
    "phone": "9935855863",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher HT at Basic education • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-211",
    "name": "Abhay Pratap Singh",
    "initials": "AP",
    "batch": 2006,
    "house": "Aravali",
    "role": "A.T.",
    "location": "Gonda",
    "domain": "Corporate",
    "email": "singhabhaypratap89@gmail.com",
    "phone": "9170386188",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "A.T. at Basic education • Batch of 2006 (Aravali House)."
  },
  {
    "id": "alumni-212",
    "name": "Vishnu Narayan Maurya",
    "initials": "VN",
    "batch": 2007,
    "house": "Aravali",
    "role": "Mechanical Engineer",
    "location": "UAE",
    "domain": "Technology",
    "email": "vishnu91290@gmail.com",
    "phone": "971561311240",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Mechanical Engineer at FIBREX • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-213",
    "name": "Prabhat Kumar",
    "initials": "PK",
    "batch": 2019,
    "house": "Aravali",
    "role": "Legel Students",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "prabhatpk2002s@gmail.com",
    "phone": "9956467680",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Legel Students at Ballb • Batch of 2019 (Aravali House)."
  },
  {
    "id": "alumni-214",
    "name": "Pushpendra Pratap Singh",
    "initials": "PP",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Engineer",
    "location": "Banglore",
    "domain": "Technology",
    "email": "ppsingh1410@gmail.com",
    "phone": "8445710018",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Engineer at ARM • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-215",
    "name": "Parvati Gupta",
    "initials": "PG",
    "batch": 2007,
    "house": "Aravali",
    "role": "Teacher",
    "location": "Jaisinghpur",
    "domain": "Academia",
    "email": "parvatigupta020490@gmail.com",
    "phone": "7007970936",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Basic shiksha vibhag • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-216",
    "name": "Pratima Tiwari",
    "initials": "PT",
    "batch": 1999,
    "house": "Shivalik",
    "role": "Tgt English in Delhi government",
    "location": "East Delhi",
    "domain": "Corporate",
    "email": "pratima.virasat@gmail.com",
    "phone": "9721228703",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Tgt English in Delhi government at RSKV WEST VINOD NAGAR • Batch of 1999 (Shivalik House)."
  },
  {
    "id": "alumni-217",
    "name": "Riya",
    "initials": "R",
    "batch": 2016,
    "house": "Aravali",
    "role": "Study",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "riyakanaujiya18061998@gmail.com",
    "phone": "8810735593",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Study at Allahabad University • Batch of 2016 (Aravali House)."
  },
  {
    "id": "alumni-218",
    "name": "Jai Bahadur",
    "initials": "JB",
    "batch": 1993,
    "house": "Aravali",
    "role": "Teacher",
    "location": "Junior high school Bhanti, Kurwar, Sultanpur",
    "domain": "Academia",
    "email": "jbsln800500@gmail.com",
    "phone": "7985447728",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Shiksha Parishad • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-219",
    "name": "Anudeep Jaiswal",
    "initials": "AJ",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Software Artitect",
    "location": "Noida",
    "domain": "Technology",
    "email": "anudeep.mca@gmail.com",
    "phone": "9891599687",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Software Artitect at Nokia • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-220",
    "name": "Randheer",
    "initials": "R",
    "batch": 2015,
    "house": "Nilgiri",
    "role": "Software Engineer",
    "location": "Remote",
    "domain": "Technology",
    "email": "randheer.dakshana15@gmail.com",
    "phone": "9140535651",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Software Engineer at Amygb.ai • Batch of 2015 (Nilgiri House)."
  },
  {
    "id": "alumni-221",
    "name": "Reetesh Singh",
    "initials": "RS",
    "batch": 2011,
    "house": "Aravali",
    "role": "Technical Lead/Software development",
    "location": "Vancouver, Canada",
    "domain": "Technology",
    "email": "reetesh.29.rks@gmail.com",
    "phone": "17783253530",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Technical Lead/Software development at HCL Technologies • Batch of 2011 (Aravali House)."
  },
  {
    "id": "alumni-222",
    "name": "Pankaj Kumar",
    "initials": "PK",
    "batch": 2006,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Dostpur Sultanpur",
    "domain": "Academia",
    "email": "kumarpankaj.kumar22@gmail.com",
    "phone": "7571030532",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education • Batch of 2006 (Udaigiri House)."
  },
  {
    "id": "alumni-223",
    "name": "Awadhesh Kumar Shukla",
    "initials": "AK",
    "batch": 1999,
    "house": "Aravali",
    "role": "Regional Sales Manager",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "awadhesh1448@gmail.com",
    "phone": "9918871448",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Regional Sales Manager at Kristal Spirits India Pvt Ltd • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-224",
    "name": "Abdul Quais",
    "initials": "AQ",
    "batch": 1993,
    "house": "Aravali",
    "role": "Basic teacher",
    "location": "Maya, Ayodhya",
    "domain": "Academia",
    "email": "abdulquais1976@gmail.com",
    "phone": "9415785500",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Basic teacher at N/A • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-225",
    "name": "Pragati Pandey",
    "initials": "PP",
    "batch": 2015,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Semari",
    "domain": "Academia",
    "email": "pragatipandey458@gmail.com",
    "phone": "8303029258",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Raj Montessori intercollege • Batch of 2015 (Shivalik House)."
  },
  {
    "id": "alumni-226",
    "name": "Rahul Anand Baranwal",
    "initials": "RA",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "Business",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "rab.shanu@gmail.com",
    "phone": "9307906888",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Business at Karuna construction • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-227",
    "name": "Avaneesh Ojha",
    "initials": "AO",
    "batch": 2007,
    "house": "Aravali",
    "role": "Service/Assistant General Manager- Tendering and proposals",
    "location": "NOIDA",
    "domain": "Corporate",
    "email": "avanishoj@gmail.com",
    "phone": "8130148280",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Service/Assistant General Manager- Tendering and proposals at Swam pneumatics pvt ltd • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-228",
    "name": "Ram Govind Dwivedi",
    "initials": "RG",
    "batch": 2006,
    "house": "Aravali",
    "role": "Assistant teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "rgdwivediii@gmail.com",
    "phone": "8299164458",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Department of basic education • Batch of 2006 (Aravali House)."
  },
  {
    "id": "alumni-229",
    "name": "Prem Shankar Pandey",
    "initials": "PS",
    "batch": 1993,
    "house": "Aravali",
    "role": "Business",
    "location": "Bhain",
    "domain": "Corporate",
    "email": "gauravpremshankar75@gmail.com",
    "phone": "6306713092",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business at Director • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-230",
    "name": "Iqbal Kadiri",
    "initials": "IK",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Dentist",
    "location": "CHC shahgarh",
    "domain": "Corporate",
    "email": "kadirishahgarh@gmail.com",
    "phone": "9415381862",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Dentist at None • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-231",
    "name": "Ashok Kumar Yadav",
    "initials": "AK",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "MEDICAL",
    "location": "Sultanpur (UP)",
    "domain": "Medicine",
    "email": "ashokyadav53431@gmail.com",
    "phone": "9451778144. /6388161767",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "MEDICAL at Astha Hospital • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-232",
    "name": "Vijay Kumar",
    "initials": "VK",
    "batch": 2003,
    "house": "Udaigiri",
    "role": "Assistant teacher",
    "location": "Dhanpatganj sultanpur",
    "domain": "Academia",
    "email": "vkanand321@gmail.com",
    "phone": "9415737794",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic shiksha parishad • Batch of 2003 (Udaigiri House)."
  },
  {
    "id": "alumni-233",
    "name": "Akash Shukla",
    "initials": "AS",
    "batch": 2015,
    "house": "Nilgiri",
    "role": "Software Engineer",
    "location": "Noida",
    "domain": "Technology",
    "email": "volubleaakash@gmail.com",
    "phone": "7355950452",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Software Engineer at Cognizant • Batch of 2015 (Nilgiri House)."
  },
  {
    "id": "alumni-234",
    "name": "Aditya Gupta",
    "initials": "AG",
    "batch": 2016,
    "house": "Aravali",
    "role": "Merchant Navy/ Marine Engineer",
    "location": "Worldwide",
    "domain": "Technology",
    "email": "info.gupta.aditya@gmail.com",
    "phone": "9828750156",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Merchant Navy/ Marine Engineer at BSM • Batch of 2016 (Aravali House)."
  },
  {
    "id": "alumni-235",
    "name": "Ankit Kumar",
    "initials": "AK",
    "batch": 2020,
    "house": "Nilgiri",
    "role": "Graduation",
    "location": "Nil",
    "domain": "Corporate",
    "email": "pal244248@gmail.com",
    "phone": "7235940599",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Graduation at Dr Ram Manohar Lohia Avadh University • Batch of 2020 (Nilgiri House)."
  },
  {
    "id": "alumni-236",
    "name": "Aijaj Hussain",
    "initials": "AH",
    "batch": 2007,
    "house": "Aravali",
    "role": "Private job",
    "location": "Bareilly",
    "domain": "Corporate",
    "email": "aijajhussain1990@gmail.com",
    "phone": "8445932036",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Private job at AKC World Bajaj • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-237",
    "name": "Amar Singh",
    "initials": "AS",
    "batch": 2019,
    "house": "Shivalik",
    "role": "Doctor",
    "location": "Ambedkarnagar",
    "domain": "Medicine",
    "email": "amarsinghdr555@gmail.com",
    "phone": "8960144708",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor at Maha maya Medical collage ambedkarnagar • Batch of 2019 (Shivalik House)."
  },
  {
    "id": "alumni-238",
    "name": "Suyash Singh",
    "initials": "SS",
    "batch": 2019,
    "house": "Nilgiri",
    "role": "India post",
    "location": "Hardoi",
    "domain": "Corporate",
    "email": "suyashsinghthakur930@gmail.com",
    "phone": "9305267100",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "India post at India post • Batch of 2019 (Nilgiri House)."
  },
  {
    "id": "alumni-239",
    "name": "Ajay Kumar Verma",
    "initials": "AK",
    "batch": 2008,
    "house": "Aravali",
    "role": "Service",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "ajaymuir76@gmail.com",
    "phone": "9454268816",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Service at Department of post • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-240",
    "name": "Raju Raidas",
    "initials": "RR",
    "batch": 2006,
    "house": "Shivalik",
    "role": "ASSISTANT TEACHER JUNIOR HIGH SCHOOL",
    "location": "VARRA , BLOCK JAMO AMETHI",
    "domain": "Academia",
    "email": "rajuraidas0@gmail.com",
    "phone": "7985830701",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "ASSISTANT TEACHER JUNIOR HIGH SCHOOL at BAAIC EDUCATION • Batch of 2006 (Shivalik House)."
  },
  {
    "id": "alumni-241",
    "name": "Amrit Lal",
    "initials": "AL",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "Loco pilot (Railway Driver )",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "amritlal594@gmail.com",
    "phone": "9140141554",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Loco pilot (Railway Driver ) at Railway • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-242",
    "name": "Chandra Prakash Jaiswal",
    "initials": "CP",
    "batch": 2001,
    "house": "Aravali",
    "role": "Officer",
    "location": "Sultanpur",
    "domain": "Civil Services",
    "email": "chandra.jnv@gmail.com",
    "phone": "9936597487",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Officer at Bank of Baroda • Batch of 2001 (Aravali House)."
  },
  {
    "id": "alumni-243",
    "name": "Prabhat Pathak",
    "initials": "PP",
    "batch": 2007,
    "house": "Shivalik",
    "role": "Branch manager",
    "location": "Ayodhya",
    "domain": "Corporate",
    "email": "prabhat.frnd17@gmail.com",
    "phone": "8355969955",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Branch manager at Union Bank of India • Batch of 2007 (Shivalik House)."
  },
  {
    "id": "alumni-244",
    "name": "Aditya Mishra",
    "initials": "AM",
    "batch": 2015,
    "house": "Aravali",
    "role": "Journalist",
    "location": "Bhopal",
    "domain": "Media & Journalism",
    "email": "adityamishravoice@gmail.com",
    "phone": "7080761722",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Journalist at Dainik Bhaskar • Batch of 2015 (Aravali House)."
  },
  {
    "id": "alumni-245",
    "name": "Sudeep Kumar Yadav",
    "initials": "SK",
    "batch": 2008,
    "house": "Udaigiri",
    "role": "Software Engineer",
    "location": "Gurugram",
    "domain": "Technology",
    "email": "sud1179@gmail.com",
    "phone": "8335887779",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Software Engineer at FIS GLOBAL • Batch of 2008 (Udaigiri House)."
  },
  {
    "id": "alumni-246",
    "name": "Mohammad Mamoon",
    "initials": "MM",
    "batch": 2005,
    "house": "Aravali",
    "role": "Engineer",
    "location": "Delhi",
    "domain": "Technology",
    "email": "mamoon.jmi@gmail.com",
    "phone": "9871182839",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Engineer at GE RENEWABLES • Batch of 2005 (Aravali House)."
  },
  {
    "id": "alumni-247",
    "name": "Mahesh Kumar Bhim",
    "initials": "MK",
    "batch": 2005,
    "house": "Udaigiri",
    "role": "Postal Assistant",
    "location": "Sultanpur Head Post Office",
    "domain": "Corporate",
    "email": "mkbhim563@gmail.com",
    "phone": "9453515331",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Postal Assistant at Department of Post • Batch of 2005 (Udaigiri House)."
  },
  {
    "id": "alumni-248",
    "name": "Bhanu Pratap Singh",
    "initials": "BP",
    "batch": 2014,
    "house": "Aravali",
    "role": "Real Estate Sector",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "1bhanu.singh@gmail.com",
    "phone": "9026272003",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Real Estate Sector at MG BUILDER &amp; DEVELOPERS , ALIGANJ CENTRAL LIBRARY • Batch of 2014 (Aravali House)."
  },
  {
    "id": "alumni-249",
    "name": "Abha Shukla",
    "initials": "AS",
    "batch": 2020,
    "house": "Nilgiri",
    "role": "Student",
    "location": "No",
    "domain": "Corporate",
    "email": "abha59669@gmail.com",
    "phone": "8957228253",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student at No • Batch of 2020 (Nilgiri House)."
  },
  {
    "id": "alumni-250",
    "name": "Shivani",
    "initials": "S",
    "batch": 2019,
    "house": "Udaigiri",
    "role": "MBBS 1st year",
    "location": "MRAMC ,Ambedkarnagar",
    "domain": "Corporate",
    "email": "shivanishivani0416@gmail.com",
    "phone": "9026563033",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "MBBS 1st year at MRAMC Ambedkarnagar • Batch of 2019 (Udaigiri House)."
  },
  {
    "id": "alumni-251",
    "name": "Pradeep Kumar Singh",
    "initials": "PK",
    "batch": 2002,
    "house": "Shivalik",
    "role": "Business",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "ganpati.pradeep86@gmail.com",
    "phone": "9455109010",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Business at Maruti nanadan interprisess • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-252",
    "name": "Vinay Kumar Shukla",
    "initials": "VK",
    "batch": 2004,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Amethi",
    "domain": "Academia",
    "email": "vinaybrilliant@gmail.com",
    "phone": "9473555956",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education • Batch of 2004 (Udaigiri House)."
  },
  {
    "id": "alumni-253",
    "name": "Vivek Kumar Tiwari",
    "initials": "VK",
    "batch": 2011,
    "house": "Shivalik",
    "role": "Engineering / Senior Electrical Engineer",
    "location": "Noida UP",
    "domain": "Technology",
    "email": "tripathi.230@gmail.com",
    "phone": "9891090526",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Engineering / Senior Electrical Engineer at Cinda Engineering and Construction Pvt Ltd • Batch of 2011 (Shivalik House)."
  },
  {
    "id": "alumni-254",
    "name": "Sachin Maurya",
    "initials": "SM",
    "batch": 2021,
    "house": "Udaigiri",
    "role": "As a student",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "sachinm222125@gmail.com",
    "phone": "6389165807",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "As a student at Studying at DU University • Batch of 2021 (Udaigiri House)."
  },
  {
    "id": "alumni-255",
    "name": "Shardool Patel",
    "initials": "SP",
    "batch": 2021,
    "house": "Nilgiri",
    "role": "Batchelor of commerce",
    "location": "Kanpur",
    "domain": "Corporate",
    "email": "shardoolpatel2004@gmail.com",
    "phone": "9918203603",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Batchelor of commerce at Rama University kanpur • Batch of 2021 (Nilgiri House)."
  },
  {
    "id": "alumni-256",
    "name": "Dr Akhilesh Pandey",
    "initials": "DA",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "MBBS,MD (Neuro-psychiatrist)",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "drakhileshpandey9@gmail.com",
    "phone": "9838656999",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "MBBS,MD (Neuro-psychiatrist) at Nav chetna Neuro-psychiatry centre • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-257",
    "name": "Mayank Verma",
    "initials": "MV",
    "batch": 2016,
    "house": "Aravali",
    "role": "Software Developer",
    "location": "Delhi",
    "domain": "Technology",
    "email": "sammayank765@gmail.com",
    "phone": "9454001097",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Software Developer at Gokwik • Batch of 2016 (Aravali House)."
  },
  {
    "id": "alumni-258",
    "name": "Atul Kumar",
    "initials": "AK",
    "batch": 2019,
    "house": "Shivalik",
    "role": "Engineering Student",
    "location": "National Institute of Technology Silchar Assam",
    "domain": "Technology",
    "email": "atulmauryajnv497@gmail.com",
    "phone": "9696017322",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Engineering Student at National Institute of Technology Silchar Assam • Batch of 2019 (Shivalik House)."
  },
  {
    "id": "alumni-259",
    "name": "Prem Chandra Baranwal",
    "initials": "PC",
    "batch": 1999,
    "house": "Aravali",
    "role": "HEAD TEACHER IN BASIC SIKSHA",
    "location": "Mochwa block bhadar dist. Amethi",
    "domain": "Academia",
    "email": "prembaranwal2020@gmail.com",
    "phone": "9452848707",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "HEAD TEACHER IN BASIC SIKSHA at 0 • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-260",
    "name": "Virendra Kumar Pandey",
    "initials": "VK",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Lieutenant Colonel",
    "location": "Rajouri",
    "domain": "Corporate",
    "email": "",
    "phone": "",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Lieutenant Colonel at Indian Army • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-261",
    "name": "Sunil Kaushal",
    "initials": "SK",
    "batch": 2000,
    "house": "Shivalik",
    "role": "Block development officer",
    "location": "Basti",
    "domain": "Civil Services",
    "email": "pdskaushalsunil@gmail.com",
    "phone": "9415607072",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Block development officer at Ministry of RD Uttar pradesh • Batch of 2000 (Shivalik House)."
  },
  {
    "id": "alumni-262",
    "name": "Ramendra Kumar",
    "initials": "RK",
    "batch": 2018,
    "house": "Aravali",
    "role": "DIGITAL MARKETER",
    "location": "LUCKOW",
    "domain": "Technology",
    "email": "conultantramu12@gmail.com",
    "phone": "8299021088",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "DIGITAL MARKETER at SELF EMPLOYED • Batch of 2018 (Aravali House)."
  },
  {
    "id": "alumni-263",
    "name": "Aman Maurya",
    "initials": "AM",
    "batch": 2022,
    "house": "Shivalik",
    "role": "Study",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "aman930maurya@gmail.com",
    "phone": "9305579437",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Study at ( BA) University of allahabad • Batch of 2022 (Shivalik House)."
  },
  {
    "id": "alumni-264",
    "name": "Surendra Mohan Tiwari",
    "initials": "SM",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "TGT MATH",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "st2999976@gmail.com",
    "phone": "9198845629",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "TGT MATH at DOE NCT DELHI • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-265",
    "name": "Rajat Kumar Yadav",
    "initials": "RK",
    "batch": 2007,
    "house": "Aravali",
    "role": "Orthopaedic surgeon",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "rajatyadav966@gmail.com",
    "phone": "9990756148",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Orthopaedic surgeon at Private hospital • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-266",
    "name": "Navneet Kumar Chaudhary",
    "initials": "NK",
    "batch": 2018,
    "house": "Shivalik",
    "role": "Studying",
    "location": "None",
    "domain": "Corporate",
    "email": "navneetc213@gmail.com",
    "phone": "9140216199",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Studying at Banking • Batch of 2018 (Shivalik House)."
  },
  {
    "id": "alumni-267",
    "name": "Maharaj Baksh Singh",
    "initials": "MB",
    "batch": 1993,
    "house": "Aravali",
    "role": "Advocate",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "maharajbaksh30@gmail.com",
    "phone": "9415471325",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Advocate at High Court • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-268",
    "name": "Satyaprakash",
    "initials": "S",
    "batch": 2005,
    "house": "Shivalik",
    "role": "Orthopaedic surgeon",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "sprakashchanda2k6@gmail.com",
    "phone": "8299857258",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Orthopaedic surgeon at Highway hospital • Batch of 2005 (Shivalik House)."
  },
  {
    "id": "alumni-269",
    "name": "Shiva Gupta",
    "initials": "SG",
    "batch": 2023,
    "house": "Udaigiri",
    "role": "Iit Aspirant",
    "location": "Unemployed",
    "domain": "Technology",
    "email": "shivagupta8353940979@gmail.com",
    "phone": "8353940979",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Iit Aspirant at Nothing yet • Batch of 2023 (Udaigiri House)."
  },
  {
    "id": "alumni-270",
    "name": "Manish Tiwari",
    "initials": "MT",
    "batch": 2004,
    "house": "Shivalik",
    "role": "Global Project Manager",
    "location": "Hyderabad",
    "domain": "Corporate",
    "email": "mktiws1188@gmail.com",
    "phone": "7042315810",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Global Project Manager at Hexagon • Batch of 2004 (Shivalik House)."
  },
  {
    "id": "alumni-271",
    "name": "Hemant Gupta",
    "initials": "HG",
    "batch": 2016,
    "house": "Aravali",
    "role": "Student",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "hemantgupta1435@gmail.com",
    "phone": "8707326032",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student at RMLAU • Batch of 2016 (Aravali House)."
  },
  {
    "id": "alumni-272",
    "name": "राजेश कुमार गौतम",
    "initials": "रक",
    "batch": 1993,
    "house": "Shivalik",
    "role": "गवर्नमेंट जॉब ADO (ISB) पट्टी ब्लॉक",
    "location": "पट्टी प्रतापगढ़",
    "domain": "Corporate",
    "email": "rajeshkumargautam414@gmail.com",
    "phone": "9721282269",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "गवर्नमेंट जॉब ADO (ISB) पट्टी ब्लॉक at विकास विभाग • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-273",
    "name": "Omshiv Vaishya",
    "initials": "OV",
    "batch": 2011,
    "house": "Shivalik",
    "role": "Businessman",
    "location": "Sangipur",
    "domain": "Corporate",
    "email": "sagarvaishya13@gmail.com",
    "phone": "9560928504",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Businessman at Mahadev super bazaar • Batch of 2011 (Shivalik House)."
  },
  {
    "id": "alumni-274",
    "name": "Swati Gautam",
    "initials": "SG",
    "batch": 2020,
    "house": "Aravali",
    "role": "PG Student",
    "location": "Akbarpur Ambedkar Nagar",
    "domain": "Corporate",
    "email": "swatiroy9956@gmail.com",
    "phone": "9670910493",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "PG Student at Dr. Ram Manohar Lohia Avadh University ayodhya • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-275",
    "name": "Vijay Nath",
    "initials": "VN",
    "batch": 2004,
    "house": "Udaigiri",
    "role": "Teacher U.P. Basic",
    "location": "Amethi",
    "domain": "Academia",
    "email": "nathvijay531@gmail.com",
    "phone": "6307181224",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher U.P. Basic at U.P. Basic • Batch of 2004 (Udaigiri House)."
  },
  {
    "id": "alumni-276",
    "name": "Arvind Kumar Agrahari",
    "initials": "AK",
    "batch": 2003,
    "house": "Aravali",
    "role": "Medical",
    "location": "Sultanpur",
    "domain": "Medicine",
    "email": "ajayknitgic555@gmail.com",
    "phone": "8830790870",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Medical at Self • Batch of 2003 (Aravali House)."
  },
  {
    "id": "alumni-277",
    "name": "Dr.ravindra Yaduvanshi",
    "initials": "DY",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Doctor",
    "location": "Rampur jaunpur",
    "domain": "Medicine",
    "email": "ravindranathyaduvanshi@gmail.com",
    "phone": "9889708129",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor at Raj clinic • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-278",
    "name": "Vimal Kumar",
    "initials": "VK",
    "batch": 2006,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Pratapgarh",
    "domain": "Academia",
    "email": "itsmevvimal@gmail.com",
    "phone": "8756149919",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Basik education • Batch of 2006 (Shivalik House)."
  },
  {
    "id": "alumni-279",
    "name": "Jai Prakash",
    "initials": "JP",
    "batch": 2006,
    "house": "Shivalik",
    "role": "ASSISTANT TEACHER",
    "location": "AMETHI",
    "domain": "Academia",
    "email": "jpsaroj17@gmail.com",
    "phone": "8005005247",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "ASSISTANT TEACHER at BASIC EDUCATION DEPARTMENT • Batch of 2006 (Shivalik House)."
  },
  {
    "id": "alumni-280",
    "name": "Agni Vrat",
    "initials": "AV",
    "batch": 2014,
    "house": "Nilgiri",
    "role": "Business",
    "location": "Gurgaon",
    "domain": "Corporate",
    "email": "agnivrat2010@gmail.com",
    "phone": "9454599306",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Business at Vision advance polymer • Batch of 2014 (Nilgiri House)."
  },
  {
    "id": "alumni-281",
    "name": "Abhishek Kumar",
    "initials": "AK",
    "batch": 2011,
    "house": "Shivalik",
    "role": "Border security/constable",
    "location": "Barmer, Rajasthan",
    "domain": "Technology",
    "email": "abhishekkumar85448@gmail.com",
    "phone": "9450207978",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Border security/constable at Border security force • Batch of 2011 (Shivalik House)."
  },
  {
    "id": "alumni-282",
    "name": "Sudiksha Tripathi",
    "initials": "ST",
    "batch": 2020,
    "house": "Shivalik",
    "role": "Student",
    "location": "Student",
    "domain": "Corporate",
    "email": "sudikshatiripathi@gmail.com",
    "phone": "8090042911",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at Karmyogi ram surat tripathi pg college • Batch of 2020 (Shivalik House)."
  },
  {
    "id": "alumni-283",
    "name": "Priyanka Singh",
    "initials": "PS",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Self employed",
    "location": "Dostpur, kadipur",
    "domain": "Corporate",
    "email": "priyankasinghcnb@gmail.com",
    "phone": "7007788607",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Self employed at THPG college • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-284",
    "name": "Dr Brijesh Sharma",
    "initials": "DB",
    "batch": 1996,
    "house": "Shivalik",
    "role": "Doctor",
    "location": "Indogulf Hospital",
    "domain": "Medicine",
    "email": "drbrijesh1980@gmail.com",
    "phone": "9452275153",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor at Indogulf Hospital • Batch of 1996 (Shivalik House)."
  },
  {
    "id": "alumni-285",
    "name": "Suman Sharma",
    "initials": "SS",
    "batch": 1996,
    "house": "Aravali",
    "role": "House-wife",
    "location": "NA",
    "domain": "Corporate",
    "email": "ravindrakumar06039@gmail.com",
    "phone": "9616160644",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "House-wife at NA • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-286",
    "name": "Rohit Kumar Gupta",
    "initials": "RK",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Ayodhya",
    "domain": "Academia",
    "email": "rohitgupta94401@gmail.com",
    "phone": "9451909401",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-287",
    "name": "Mahfuzur Rahman",
    "initials": "MR",
    "batch": 2004,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Gonda",
    "domain": "Academia",
    "email": "rahmanmahfooz678@gmail.com",
    "phone": "9198852907",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Education • Batch of 2004 (Nilgiri House)."
  },
  {
    "id": "alumni-288",
    "name": "Abha Mishra",
    "initials": "AM",
    "batch": 2013,
    "house": "Aravali",
    "role": "Housewife",
    "location": "Nil",
    "domain": "Corporate",
    "email": "abhamishra510@gmail.com",
    "phone": "6394954641",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Housewife at Nil • Batch of 2013 (Aravali House)."
  },
  {
    "id": "alumni-289",
    "name": "Santosh Yadav",
    "initials": "SY",
    "batch": 2007,
    "house": "Aravali",
    "role": "Manager - Commercial Air conditioning",
    "location": "Vadodara Gujrat",
    "domain": "Technology",
    "email": "90santosh1110@gmail.com",
    "phone": "9897199095",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Manager - Commercial Air conditioning at Voltas Limited • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-290",
    "name": "Amit Kumar Tripathi",
    "initials": "AK",
    "batch": 2003,
    "house": "Udaigiri",
    "role": "Assistant teacher",
    "location": "Ps datanpur jamo",
    "domain": "Academia",
    "email": "tripathia214@gmail.com",
    "phone": "7800926664",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic shiksha parishad • Batch of 2003 (Udaigiri House)."
  },
  {
    "id": "alumni-291",
    "name": "Komal Kanaujiya",
    "initials": "KK",
    "batch": 2021,
    "house": "Udaigiri",
    "role": "Mbbs student",
    "location": "-",
    "domain": "Corporate",
    "email": "komalkanaujiya26@gmail.com",
    "phone": "7318136116",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Mbbs student at Dr.rmlims Lucknow Uttar Pradesh • Batch of 2021 (Udaigiri House)."
  },
  {
    "id": "alumni-292",
    "name": "Vineeta Saroj",
    "initials": "VS",
    "batch": 2019,
    "house": "Aravali",
    "role": "Art teacher",
    "location": "Study in rammanohar lohia awadh University ayodhya",
    "domain": "Academia",
    "email": "vineetasaroj55@gmail.com",
    "phone": "7565855868",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Art teacher at Master (painting) • Batch of 2019 (Aravali House)."
  },
  {
    "id": "alumni-293",
    "name": "Jyoti Sayankrit",
    "initials": "JS",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Service",
    "location": "Mumbai",
    "domain": "Corporate",
    "email": "jyotisayankritt@gmail.com",
    "phone": "8299780539",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Service at RBI • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-294",
    "name": "Maniah Dixit",
    "initials": "MD",
    "batch": 2002,
    "house": "Udaigiri",
    "role": "Government Service",
    "location": "Allahabad",
    "domain": "Corporate",
    "email": "dixitmanish11@gmail.com",
    "phone": "9889119993",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Government Service at Allahabad high court • Batch of 2002 (Udaigiri House)."
  },
  {
    "id": "alumni-295",
    "name": "Anamika Shukla",
    "initials": "AS",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "LECTURER",
    "location": "ASHOK INTER COLLEGE JAUNPUR",
    "domain": "Corporate",
    "email": "anamikababura@gmail.com",
    "phone": "9935697807",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "LECTURER at ASHOK INTER COLLEGE JAUNPUR • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-296",
    "name": "Manjulata Tiwari",
    "initials": "MT",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "SULTANPUR",
    "domain": "Academia",
    "email": "rajkamaldas63@gmail.com",
    "phone": "7376572443",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-297",
    "name": "Anurag Mishra",
    "initials": "AM",
    "batch": 2016,
    "house": "Shivalik",
    "role": "Doctor",
    "location": "Government medical college azamgarh",
    "domain": "Medicine",
    "email": "mishraanurag136@gmail.com",
    "phone": "8875570010",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Doctor at G.m.c • Batch of 2016 (Shivalik House)."
  },
  {
    "id": "alumni-298",
    "name": "Prabhat Singh",
    "initials": "PS",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Coaching Classes",
    "location": "Surat",
    "domain": "Corporate",
    "email": "prabhat4u2353@gmail.com",
    "phone": "9998020296",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Coaching Classes at Curious Minds Academy • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-299",
    "name": "Ankit Yadav",
    "initials": "AY",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Business",
    "location": "Ayodhya, Sultanpur",
    "domain": "Corporate",
    "email": "ankitsln2nd717@gmail.com",
    "phone": "8318174839",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Business at Prime Solar Solution • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-300",
    "name": "Avinash Kumar Singh",
    "initials": "AK",
    "batch": 2017,
    "house": "Aravali",
    "role": "Process Engineer",
    "location": "UPL Unit-12 Dahej,Bharuch, Gujrat",
    "domain": "Technology",
    "email": "avinash151617ab@gmail.com",
    "phone": "9044384357",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Process Engineer at UPL (United Phosphorus Limited) • Batch of 2017 (Aravali House)."
  },
  {
    "id": "alumni-301",
    "name": "Dev Vrat",
    "initials": "DV",
    "batch": 2007,
    "house": "Nilgiri",
    "role": "Lecturer",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "devvrat018@gmail.com",
    "phone": "9889796381",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Lecturer at Government industrial training institute • Batch of 2007 (Nilgiri House)."
  },
  {
    "id": "alumni-302",
    "name": "Neetu Singh",
    "initials": "NS",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Lalganj",
    "domain": "Academia",
    "email": "neetusingh92750@gmail.com",
    "phone": "6388363987",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Jnv alumni meet • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-303",
    "name": "Amit Tripathi",
    "initials": "AT",
    "batch": 2000,
    "house": "Shivalik",
    "role": "V. P. Sales",
    "location": "Noida",
    "domain": "Corporate",
    "email": "amittripathi91@gmail.com",
    "phone": "7838893231",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "V. P. Sales at I. A. Wealth Management ltd. • Batch of 2000 (Shivalik House)."
  },
  {
    "id": "alumni-304",
    "name": "Dr. Pankaj Baranwal",
    "initials": "DP",
    "batch": 2005,
    "house": "Aravali",
    "role": "Associate professor, Doctor",
    "location": "Darshan ager , ayodhya",
    "domain": "Medicine",
    "email": "pankajims08@gmail.com",
    "phone": "8299272633",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Associate professor, Doctor at Ayodhya medical College, Ayodhya • Batch of 2005 (Aravali House)."
  },
  {
    "id": "alumni-305",
    "name": "Jagat Pal Maurya",
    "initials": "JP",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "Sr.section engineer in Indian railway",
    "location": "Delhi",
    "domain": "Technology",
    "email": "mauryajagatpal1982@gmail.com",
    "phone": "8860923175",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Sr.section engineer in Indian railway at Indian Railway • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-306",
    "name": "Devendra Kumar",
    "initials": "DK",
    "batch": 2015,
    "house": "Shivalik",
    "role": "Railway",
    "location": "Amethi",
    "domain": "Corporate",
    "email": "devendra2015nvs@gmail.com",
    "phone": "9454609269",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Railway at Indian Railways • Batch of 2015 (Shivalik House)."
  },
  {
    "id": "alumni-307",
    "name": "Devendra Mishra",
    "initials": "DM",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Govt. Employee",
    "location": "Sultanpur",
    "domain": "Civil Services",
    "email": "devendramishralawyer@gmail.com",
    "phone": "8317034582",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Govt. Employee at Govt. Of U.P. • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-308",
    "name": "Alok Singh",
    "initials": "AS",
    "batch": 2011,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Fatehpur",
    "domain": "Academia",
    "email": "as0194196@gmail.com",
    "phone": "7007120342",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Basic siksha vibhag • Batch of 2011 (Shivalik House)."
  },
  {
    "id": "alumni-309",
    "name": "Chandradev Kanaujiya",
    "initials": "CK",
    "batch": 1994,
    "house": "Udaigiri",
    "role": "Facility Management",
    "location": "Hiranandani Powai Mumbai 76",
    "domain": "Technology",
    "email": "chandradev.kanaujiya@gmail.com",
    "phone": "9920498168",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Facility Management at Supreme Housing and Hospitality Pvt. Ltd. • Batch of 1994 (Udaigiri House)."
  },
  {
    "id": "alumni-310",
    "name": "Deepa Singh",
    "initials": "DS",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Home maker",
    "location": "Home",
    "domain": "Corporate",
    "email": "deepasingh.0815@gmail.com",
    "phone": "9116782491",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Home maker at None • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-311",
    "name": "Avanish",
    "initials": "A",
    "batch": 2010,
    "house": "Shivalik",
    "role": "up police",
    "location": "Ghazipur",
    "domain": "Civil Services",
    "email": "avanishk032@gmail.com",
    "phone": "9266242063",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "up police at police department • Batch of 2010 (Shivalik House)."
  },
  {
    "id": "alumni-312",
    "name": "Nandini",
    "initials": "N",
    "batch": 2023,
    "house": "Udaigiri",
    "role": "Student",
    "location": "Not working",
    "domain": "Corporate",
    "email": "anitagiri2755@gmail.com",
    "phone": "7388388563",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Student at __ • Batch of 2023 (Udaigiri House)."
  },
  {
    "id": "alumni-313",
    "name": "Ashish Kumar Maurya",
    "initials": "AK",
    "batch": 2018,
    "house": "Shivalik",
    "role": "Study",
    "location": "Not yet",
    "domain": "Corporate",
    "email": "ashishkm0810@gmail.com",
    "phone": "8400549310",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Study at Not yet • Batch of 2018 (Shivalik House)."
  },
  {
    "id": "alumni-314",
    "name": "Varun Kumar Baranwal",
    "initials": "VK",
    "batch": 2007,
    "house": "Nilgiri",
    "role": "Solution Engineer",
    "location": "Noida",
    "domain": "Technology",
    "email": "varun100790@gmail.com",
    "phone": "8126741259",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Solution Engineer at LambdaTest • Batch of 2007 (Nilgiri House)."
  },
  {
    "id": "alumni-315",
    "name": "Yoganchal Mishra",
    "initials": "YM",
    "batch": 1997,
    "house": "Shivalik",
    "role": "Assistant professor",
    "location": "Amethi Uttarpradesh",
    "domain": "Academia",
    "email": "yoganchalmishra@gmail.com",
    "phone": "9670150999",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant professor at R. R. P. G . College Amethi. • Batch of 1997 (Shivalik House)."
  },
  {
    "id": "alumni-316",
    "name": "Bal Kishan Kasaudhan",
    "initials": "BK",
    "batch": 2014,
    "house": "Udaigiri",
    "role": "Software Engineer",
    "location": "Indore",
    "domain": "Technology",
    "email": "mitbbkk@gmail.com",
    "phone": "9560713092",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Software Engineer at Iaastha technology • Batch of 2014 (Udaigiri House)."
  },
  {
    "id": "alumni-317",
    "name": "Santosh Kumar",
    "initials": "SK",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Software",
    "location": "NA",
    "domain": "Technology",
    "email": "sultanpur@gmail.com",
    "phone": "7829336999",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Software at NA • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-318",
    "name": "Sushma Singh",
    "initials": "SS",
    "batch": 1996,
    "house": "Aravali",
    "role": "Assistant teacher",
    "location": "Ranmau block Dalmau Raebareli",
    "domain": "Academia",
    "email": "sushmasinghsln@gmail.com",
    "phone": "9451776860",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic Education • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-319",
    "name": "Deepika Singh",
    "initials": "DS",
    "batch": 2002,
    "house": "Nilgiri",
    "role": "IT Professional",
    "location": "Noida",
    "domain": "Technology",
    "email": "deepikasingh19@gmail.com",
    "phone": "9871092123",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "IT Professional at Naviga Global • Batch of 2002 (Nilgiri House)."
  },
  {
    "id": "alumni-320",
    "name": "Amit Pratap Singh",
    "initials": "AP",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Manager",
    "location": "Chennai",
    "domain": "Corporate",
    "email": "amitsinghrajwar@gmail.com",
    "phone": "9310330820",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Manager at Tciexpress ltd • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-321",
    "name": "Vivek Mishra",
    "initials": "VM",
    "batch": 2008,
    "house": "Aravali",
    "role": "District information system manager",
    "location": "CMO Office",
    "domain": "Corporate",
    "email": "vivekmishra5759@gmail.com",
    "phone": "9453900653",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "District information system manager at Health department • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-322",
    "name": "Anlesh Vikram Rao",
    "initials": "AV",
    "batch": 1999,
    "house": "Aravali",
    "role": "SERVICE",
    "location": "SULTANPUR. UTTAR PRADESH",
    "domain": "Corporate",
    "email": "anilesh123@gmail.com",
    "phone": "9452107617",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "SERVICE at LIFE INSURANCE CORPORATION OF INDIA • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-323",
    "name": "Purnima Singh",
    "initials": "PS",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Ayodhya",
    "domain": "Academia",
    "email": "poornimasingh9451@gmail.com",
    "phone": "9451678992",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic shiskha parishad • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-324",
    "name": "Ankit Kumar Jaiswal",
    "initials": "AK",
    "batch": 2004,
    "house": "Nilgiri",
    "role": "Engineer",
    "location": "Gurugram",
    "domain": "Technology",
    "email": "ankitj051087@gmail.com",
    "phone": "8826298736",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Engineer at Amdocs • Batch of 2004 (Nilgiri House)."
  },
  {
    "id": "alumni-325",
    "name": "Vishal Jaiswal",
    "initials": "VJ",
    "batch": 1998,
    "house": "Aravali",
    "role": "Businessman",
    "location": "Derwa Pratapgarh",
    "domain": "Corporate",
    "email": "jaisankur@gmail.com",
    "phone": "9795116263",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Businessman at Vishal Traders( Reliance Jio Distribution &amp; Electronic Showroom) • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-326",
    "name": "Ragini Shukla",
    "initials": "RS",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Teaching",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "shuklarags@gmail.com",
    "phone": "9305127296",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teaching at LUCKNOW PUBLIC SCHOOL, LUCKNOW • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-327",
    "name": "Rahul Tripathi",
    "initials": "RT",
    "batch": 2006,
    "house": "Aravali",
    "role": "Chief Manager Legal",
    "location": "Mumbai",
    "domain": "Corporate",
    "email": "tripathijirahultripathiji@gmail.com",
    "phone": "9755501166",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Chief Manager Legal at IIFL • Batch of 2006 (Aravali House)."
  },
  {
    "id": "alumni-328",
    "name": "Rajeev Kumar Gautam",
    "initials": "RK",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Preparation",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "aniketrajeev30@gmail.com",
    "phone": "9005556910",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Preparation at TGT sst • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-329",
    "name": "Sampada Mishra",
    "initials": "SM",
    "batch": 1997,
    "house": "Nilgiri",
    "role": "Teaching/lecturer",
    "location": "Prayagraj",
    "domain": "Corporate",
    "email": "sampadamishra777@gmail.com",
    "phone": "6394413117",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teaching/lecturer at R.A.V.chaka prayagraj • Batch of 1997 (Nilgiri House)."
  },
  {
    "id": "alumni-330",
    "name": "Shagun Srivastava",
    "initials": "SS",
    "batch": 2020,
    "house": "Shivalik",
    "role": "Student ( B.Sc. )",
    "location": "RMLAU",
    "domain": "Corporate",
    "email": "shagunsrivastava142@gmail.com",
    "phone": "7985694008",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student ( B.Sc. ) at RMLAU • Batch of 2020 (Shivalik House)."
  },
  {
    "id": "alumni-331",
    "name": "Akanksha Shukla",
    "initials": "AS",
    "batch": 2018,
    "house": "Shivalik",
    "role": "Student (Preparing for IES)",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "akankshawill10@gmail.com",
    "phone": "8840455135",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student (Preparing for IES) at Made easy coaching institute • Batch of 2018 (Shivalik House)."
  },
  {
    "id": "alumni-332",
    "name": "Atul Pratap Singh",
    "initials": "AP",
    "batch": 2010,
    "house": "Nilgiri",
    "role": "Gov. Teacher",
    "location": "Pratapgarh",
    "domain": "Academia",
    "email": "002atul2009@gmail.com",
    "phone": "9453771000",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Gov. Teacher at Basic edu. dept. • Batch of 2010 (Nilgiri House)."
  },
  {
    "id": "alumni-333",
    "name": "Shani Vikram Singh",
    "initials": "SV",
    "batch": 2001,
    "house": "Nilgiri",
    "role": "Engineer",
    "location": "NA",
    "domain": "Technology",
    "email": "svsgcet@gmail.com",
    "phone": "9990902150",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Engineer at NA • Batch of 2001 (Nilgiri House)."
  },
  {
    "id": "alumni-334",
    "name": "Ravi Prakash Sharma",
    "initials": "RP",
    "batch": 2007,
    "house": "Udaigiri",
    "role": "Art Teacher TGT",
    "location": "Jabalpur",
    "domain": "Academia",
    "email": "sharma.terracotta05@gmail.com",
    "phone": "7505268042",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Art Teacher TGT at Kendriya Vidyalaya Sangthan • Batch of 2007 (Udaigiri House)."
  },
  {
    "id": "alumni-335",
    "name": "Akash Kasaudhan",
    "initials": "AK",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Assistant teacher",
    "location": "Surjipur कुड़वार",
    "domain": "Academia",
    "email": "akashkasaudhan1992@gmail.com",
    "phone": "7844976019",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-336",
    "name": "Abhishek Kumar Singh",
    "initials": "AK",
    "batch": 2002,
    "house": "Udaigiri",
    "role": "QA Manager",
    "location": "Gurgaon",
    "domain": "Corporate",
    "email": "abhishek.ft@gmail.com",
    "phone": "9873241625",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "QA Manager at Reckitt Benckiser • Batch of 2002 (Udaigiri House)."
  },
  {
    "id": "alumni-337",
    "name": "Akhil",
    "initials": "A",
    "batch": 2016,
    "house": "Shivalik",
    "role": "STUDY",
    "location": "PRAYAGRAJ",
    "domain": "Corporate",
    "email": "ak4283605@gmail.com",
    "phone": "8009781159",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "STUDY at UPPSC • Batch of 2016 (Shivalik House)."
  },
  {
    "id": "alumni-338",
    "name": "Satyendra Singh",
    "initials": "SS",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Cybersecurity Head in America region",
    "location": "NJ USA",
    "domain": "Technology",
    "email": "s20091981@gmail.com",
    "phone": "9118901872",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Cybersecurity Head in America region at Siemens • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-339",
    "name": "Pradeep Kumar Yadav",
    "initials": "PK",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "ASSISTANT TEACHER",
    "location": "MUSAFIRKHANA, AMETHI",
    "domain": "Academia",
    "email": "dineshy9420adav@gmail.com",
    "phone": "9889088166",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "ASSISTANT TEACHER at BASIC EDUCATION • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-340",
    "name": "Vivekanand Yadav",
    "initials": "VY",
    "batch": 2004,
    "house": "Aravali",
    "role": "Assistant teacher",
    "location": "Varanasi",
    "domain": "Academia",
    "email": "satya15689@gmail.com",
    "phone": "7355424259",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic education up • Batch of 2004 (Aravali House)."
  },
  {
    "id": "alumni-341",
    "name": "Purnima Gupta",
    "initials": "PG",
    "batch": 2013,
    "house": "Udaigiri",
    "role": "Designer",
    "location": "Bangalore",
    "domain": "Corporate",
    "email": "purnima14696@gmail.com",
    "phone": "9588624048",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Designer at Narayana • Batch of 2013 (Udaigiri House)."
  },
  {
    "id": "alumni-342",
    "name": "Dr Pradyumna Singh",
    "initials": "DP",
    "batch": 2007,
    "house": "Shivalik",
    "role": "Chief Medical Director",
    "location": "Delhi NCR",
    "domain": "Medicine",
    "email": "pradhyumnasi@gmail.com",
    "phone": "8287419919",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Chief Medical Director at Indrashila hospital • Batch of 2007 (Shivalik House)."
  },
  {
    "id": "alumni-343",
    "name": "Srikant Ambedkar",
    "initials": "SA",
    "batch": 2018,
    "house": "Udaigiri",
    "role": "Student",
    "location": "No",
    "domain": "Corporate",
    "email": "srikant57217@gmail.com",
    "phone": "9161811018",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Student at No • Batch of 2018 (Udaigiri House)."
  },
  {
    "id": "alumni-344",
    "name": "Garima Singh",
    "initials": "GS",
    "batch": 2006,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "P.s.parasrampur",
    "domain": "Academia",
    "email": "gsingh.7376646584@gmail.com",
    "phone": "7376646584",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Up basic education department • Batch of 2006 (Udaigiri House)."
  },
  {
    "id": "alumni-345",
    "name": "Ajay Vikram",
    "initials": "AV",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Engineer",
    "location": "Bangalore",
    "domain": "Technology",
    "email": "ajay.vikram@gmail.com",
    "phone": "9019593477",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Engineer at Visteon Mobility • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-346",
    "name": "Saiesta Hashmi",
    "initials": "SH",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "Doctor",
    "location": "Nothing",
    "domain": "Medicine",
    "email": "bilkishjahan178@gmail.com",
    "phone": "9369230745",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Doctor at Physics wallah • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-347",
    "name": "Anand Dev Shukla",
    "initials": "AD",
    "batch": 2020,
    "house": "Aravali",
    "role": "Student",
    "location": "Lucknow University",
    "domain": "Corporate",
    "email": "sureshsumananand@gmail.com",
    "phone": "6306776529",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student at Lucknow University • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-348",
    "name": "Aman Mishra",
    "initials": "AM",
    "batch": 2013,
    "house": "Aravali",
    "role": "Non Working / student",
    "location": "NA",
    "domain": "Corporate",
    "email": "amanmishra004@gmail.com",
    "phone": "9120109595",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Non Working / student at NA • Batch of 2013 (Aravali House)."
  },
  {
    "id": "alumni-349",
    "name": "Rajni Kumari",
    "initials": "RK",
    "batch": 2021,
    "house": "Shivalik",
    "role": "Assistant Postmaster",
    "location": "Bastidei, Gauriganj",
    "domain": "Corporate",
    "email": "rajnikumari042004@gmail.com",
    "phone": "8400647742",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant Postmaster at Branch post office department • Batch of 2021 (Shivalik House)."
  },
  {
    "id": "alumni-350",
    "name": "Pravin Pandey",
    "initials": "PP",
    "batch": 2008,
    "house": "Shivalik",
    "role": "Advocate",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "bindupandeyadamyaazad@gmail.com",
    "phone": "9140226336",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Advocate at Highcourt, Lucknow • Batch of 2008 (Shivalik House)."
  },
  {
    "id": "alumni-351",
    "name": "Md Niyaz Ahmad",
    "initials": "MN",
    "batch": 2021,
    "house": "Nilgiri",
    "role": "Student",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "mdzackniyaz@gmail.com",
    "phone": "9026435056",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student at Delhi University • Batch of 2021 (Nilgiri House)."
  },
  {
    "id": "alumni-352",
    "name": "Anshika Mishra",
    "initials": "AM",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "anshikamishra251525@gmail.com",
    "phone": "7267997044",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-353",
    "name": "Akriti Kumari",
    "initials": "AK",
    "batch": 2020,
    "house": "Shivalik",
    "role": "College student",
    "location": "India",
    "domain": "Academia",
    "email": "akriti6756@gmail.com",
    "phone": "8957969957",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "College student • Batch of 2020 (Shivalik House)."
  },
  {
    "id": "alumni-354",
    "name": "Shristi Gupta",
    "initials": "SG",
    "batch": 2022,
    "house": "Nilgiri",
    "role": "Pursuing graduation",
    "location": "India",
    "domain": "Corporate",
    "email": "shristigupta20703@gmail.com",
    "phone": "9336879002",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Pursuing graduation at Lucknow University • Batch of 2022 (Nilgiri House)."
  },
  {
    "id": "alumni-355",
    "name": "Sia",
    "initials": "S",
    "batch": 2023,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "shiiii83444@gmail.com",
    "phone": "8127353447",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2023 (Udaigiri House)."
  },
  {
    "id": "alumni-356",
    "name": "Mohammad Arman",
    "initials": "MA",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "B pharm 3rd year",
    "location": "Student",
    "domain": "Corporate",
    "email": "mohdarman2274@gmail.com",
    "phone": "7897013950",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "B pharm 3rd year at Jnv alumni meet 2024 • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-357",
    "name": "Yogesh Gupta",
    "initials": "YG",
    "batch": 2020,
    "house": "Aravali",
    "role": "Student",
    "location": "Phagwara",
    "domain": "Corporate",
    "email": "yogeshg5031@gmail.com",
    "phone": "7217874571",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student at Lovely professional University • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-358",
    "name": "Amarjeet Kumar Nishad",
    "initials": "AK",
    "batch": 2023,
    "house": "Aravali",
    "role": "Nil",
    "location": "Nil",
    "domain": "Corporate",
    "email": "amarjeetkumarnishad777@gmail.com",
    "phone": "8853072513",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Nil at Nil • Batch of 2023 (Aravali House)."
  },
  {
    "id": "alumni-359",
    "name": "Manish Tripathi",
    "initials": "MT",
    "batch": 1993,
    "house": "Aravali",
    "role": "BPO/DGM",
    "location": "GURGAON",
    "domain": "Corporate",
    "email": "manishtripathi007@gmail.com",
    "phone": "9971533288",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "BPO/DGM at CONCENTRIX • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-360",
    "name": "Satyendra Kumar",
    "initials": "SK",
    "batch": 2000,
    "house": "Nilgiri",
    "role": "Assistent teacher",
    "location": "Composite school barauliys",
    "domain": "Academia",
    "email": "satyendrapsdi8870@gmail.com",
    "phone": "9236260556",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistent teacher at Basic education department • Batch of 2000 (Nilgiri House)."
  },
  {
    "id": "alumni-361",
    "name": "Yogendra Pathik",
    "initials": "YP",
    "batch": 2013,
    "house": "Aravali",
    "role": "Software Engineer",
    "location": "Gurgaon",
    "domain": "Technology",
    "email": "yogendrapathik97@gmail.com",
    "phone": "8318495699",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Software Engineer at Gemini Solutions • Batch of 2013 (Aravali House)."
  },
  {
    "id": "alumni-362",
    "name": "Shilpi Singh",
    "initials": "SS",
    "batch": 2000,
    "house": "Aravali",
    "role": "Teacher",
    "location": "Bhitaura Fatehpur",
    "domain": "Academia",
    "email": "ss895945@gmail.com",
    "phone": "9026192511",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education department • Batch of 2000 (Aravali House)."
  },
  {
    "id": "alumni-363",
    "name": "Joby Paulose",
    "initials": "JP",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Self Employed",
    "location": "Doha, Qatar",
    "domain": "Corporate",
    "email": "jobypaulose@gmail.com",
    "phone": "97466980380",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Self Employed at IT Solutions Qatar Co WLL • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-364",
    "name": "Vijay Kumar Singh",
    "initials": "VK",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Business",
    "location": "Kolkata",
    "domain": "Corporate",
    "email": "kvijay2926@gmail.com",
    "phone": "7003995009",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Business • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-365",
    "name": "Dhananjay Yadav",
    "initials": "DY",
    "batch": 2020,
    "house": "Nilgiri",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "dhananjay742003@gmail.com",
    "phone": "9569806335",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2020 (Nilgiri House)."
  },
  {
    "id": "alumni-366",
    "name": "Avneesh Kumar Singh",
    "initials": "AK",
    "batch": 2002,
    "house": "Shivalik",
    "role": "Business",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "avneeshaks@gmail.com",
    "phone": "9792099911",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Business at Maruti Nandan Enterprises • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-367",
    "name": "Ajay Kumar Mishra",
    "initials": "AK",
    "batch": 2001,
    "house": "Udaigiri",
    "role": "Accountant",
    "location": "New Delhi",
    "domain": "Corporate",
    "email": "mishrapa1984@gmail.com",
    "phone": "9839646889",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Accountant at White Delhi • Batch of 2001 (Udaigiri House)."
  },
  {
    "id": "alumni-368",
    "name": "Malti Prajapati",
    "initials": "MP",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Assistant Teacher in basic",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "maltiprajapati218@gmail.com",
    "phone": "9793638484",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher in basic • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-369",
    "name": "Moti Lal",
    "initials": "ML",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Assistant teacher",
    "location": "Motigarpur , Sultanpur.",
    "domain": "Academia",
    "email": "mr.motilal875692@gmail.com",
    "phone": "8756923109",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic Shiksha Vibhag • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-370",
    "name": "Sakshi Kasaudhan",
    "initials": "SK",
    "batch": 2022,
    "house": "Udaigiri",
    "role": "Nil",
    "location": "Nil",
    "domain": "Corporate",
    "email": "kasaudhansakshi161@gmail.com",
    "phone": "7081350370",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Nil at Nil • Batch of 2022 (Udaigiri House)."
  },
  {
    "id": "alumni-371",
    "name": "Ankita Shukla",
    "initials": "AS",
    "batch": 2012,
    "house": "Shivalik",
    "role": "Dietician",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "ankitashukla16794@gmail.com",
    "phone": "6394665452",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Dietician at Chandan hospital • Batch of 2012 (Shivalik House)."
  },
  {
    "id": "alumni-372",
    "name": "Renu Singh",
    "initials": "RS",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Teaching",
    "location": "Kadipur",
    "domain": "Corporate",
    "email": "renus2781@gmail.com",
    "phone": "7408642021",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teaching at Basic • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-373",
    "name": "Usha Kaushal",
    "initials": "UK",
    "batch": 2001,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "ushaat1984@gmail.com",
    "phone": "8382874425",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2001 (Shivalik House)."
  },
  {
    "id": "alumni-374",
    "name": "Nikhil Kumar Thather",
    "initials": "NK",
    "batch": 2008,
    "house": "Aravali",
    "role": "Assistant Teacher",
    "location": "Jamo",
    "domain": "Academia",
    "email": "niks06kumar@gmail.com",
    "phone": "9169759959",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at Basic education department • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-375",
    "name": "Kirti Shukla",
    "initials": "KS",
    "batch": 2010,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "shuklakirti033@gmail.com",
    "phone": "9625801674",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2010 (Udaigiri House)."
  },
  {
    "id": "alumni-376",
    "name": "Pooja Gupta",
    "initials": "PG",
    "batch": 2009,
    "house": "Aravali",
    "role": "Assistant Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "poojagupta190192@gmail.com",
    "phone": "7786936258",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at Basic shiksha vibhag • Batch of 2009 (Aravali House)."
  },
  {
    "id": "alumni-377",
    "name": "Apoorva Singh",
    "initials": "AS",
    "batch": 2008,
    "house": "Shivalik",
    "role": "PET",
    "location": "Chhattisgarh",
    "domain": "Corporate",
    "email": "apoorvathakur17@gmail.com",
    "phone": "9450007290",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "PET at JNV, Balod Chhattisgarh • Batch of 2008 (Shivalik House)."
  },
  {
    "id": "alumni-378",
    "name": "Subaran Lal",
    "initials": "SL",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Basic Teacher UP Government",
    "location": "Kurebhar, Sultanpur",
    "domain": "Academia",
    "email": "subaran.191lal@gmail.com",
    "phone": "9651985981",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Basic Teacher UP Government at Basic Teacher UP Government • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-379",
    "name": "Shivani Maurya",
    "initials": "SM",
    "batch": 2018,
    "house": "Aravali",
    "role": "Engineer- Developer",
    "location": "Chennai",
    "domain": "Technology",
    "email": "shivanilife06@gmail.com",
    "phone": "6386911782",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Engineer- Developer at Tata Consultancy Services • Batch of 2018 (Aravali House)."
  },
  {
    "id": "alumni-380",
    "name": "Manisha Yadav",
    "initials": "MY",
    "batch": 2018,
    "house": "Nilgiri",
    "role": "No",
    "location": "No",
    "domain": "Corporate",
    "email": "Maniii.2511@gmail.com",
    "phone": "8957261529",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "No at No • Batch of 2018 (Nilgiri House)."
  },
  {
    "id": "alumni-381",
    "name": "Prachi Tiwari",
    "initials": "PT",
    "batch": 2023,
    "house": "Aravali",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "prachi84290@gmail.com",
    "phone": "8429040367",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2023 (Aravali House)."
  },
  {
    "id": "alumni-382",
    "name": "Ajay Narayan Jha",
    "initials": "AN",
    "batch": 1996,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "ajaynarayan710@gmai.com",
    "phone": "7388852024",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-383",
    "name": "Sarita Shukla",
    "initials": "SS",
    "batch": 1998,
    "house": "Nilgiri",
    "role": "Head master in basic education",
    "location": "Singhpur amethi",
    "domain": "Academia",
    "email": "saritatiwari1001@gmail.com",
    "phone": "9415952227",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Head master in basic education at Singhpur block • Batch of 1998 (Nilgiri House)."
  },
  {
    "id": "alumni-384",
    "name": "Madhu Singh Patel",
    "initials": "MS",
    "batch": 2016,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "singh7268madhu@gmail.com",
    "phone": "9598516563",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2016 (Shivalik House)."
  },
  {
    "id": "alumni-385",
    "name": "Ajay Veer Vikram",
    "initials": "AV",
    "batch": 2017,
    "house": "Shivalik",
    "role": "STUDENT",
    "location": "India",
    "domain": "Corporate",
    "email": "ajayveer4141@gmail.com",
    "phone": "7080904141",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "STUDENT • Batch of 2017 (Shivalik House)."
  },
  {
    "id": "alumni-386",
    "name": "Alok Kumar Gupta",
    "initials": "AK",
    "batch": 2013,
    "house": "Shivalik",
    "role": "Software Test engineer",
    "location": "Pune",
    "domain": "Technology",
    "email": "alokguptanvs1995@gmail.com",
    "phone": "9634482480",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Software Test engineer at Cavista technology private limited • Batch of 2013 (Shivalik House)."
  },
  {
    "id": "alumni-387",
    "name": "Aditya",
    "initials": "A",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "Student",
    "location": "sultanpur",
    "domain": "Corporate",
    "email": "adityachandra1810@gmail.com",
    "phone": "9651952043",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Student at BED • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-388",
    "name": "Ghanshyam Agrahari",
    "initials": "GA",
    "batch": 2007,
    "house": "Shivalik",
    "role": "Urban infrastructure expert Amrut Mission",
    "location": "Jaunpur U.P.",
    "domain": "Corporate",
    "email": "ghanshyama554@gmail.com",
    "phone": "9537796561",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Urban infrastructure expert Amrut Mission at Nagar palika parishad jaunpur • Batch of 2007 (Shivalik House)."
  },
  {
    "id": "alumni-389",
    "name": "Sangam Singh Yadav",
    "initials": "SS",
    "batch": 2007,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "sangamyadav1403@gmail.com",
    "phone": "8892461544",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2007 (Shivalik House)."
  },
  {
    "id": "alumni-390",
    "name": "Gaurav Kumar Singh",
    "initials": "GK",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Assistant Teacher P S",
    "location": "Gonda",
    "domain": "Academia",
    "email": "gaurav.singhk@rediffmail.com",
    "phone": "7007484622",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher P S at Basic Education Department UP • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-391",
    "name": "Vijay Sahu",
    "initials": "VS",
    "batch": 1996,
    "house": "Udaigiri",
    "role": "Govt service/ Pharmacist",
    "location": "Sultanpur",
    "domain": "Civil Services",
    "email": "sahuvijay07@gmail.com",
    "phone": "8115885625",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Govt service/ Pharmacist at Health Deptt UP • Batch of 1996 (Udaigiri House)."
  },
  {
    "id": "alumni-392",
    "name": "Uzma Iqbal",
    "initials": "UI",
    "batch": 2008,
    "house": "Udaigiri",
    "role": "ASSISTANT TEACHER AT UTTAR PRADESH GOVERMENT",
    "location": "SULTANPUR",
    "domain": "Academia",
    "email": "uzmaisrar280118@gmail.com",
    "phone": "7905305580",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "ASSISTANT TEACHER AT UTTAR PRADESH GOVERMENT at NOT AVAILABLE • Batch of 2008 (Udaigiri House)."
  },
  {
    "id": "alumni-393",
    "name": "Shekhar Tripathi",
    "initials": "ST",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Chief Manager SBI",
    "location": "Akbarpur, Ambedkar Nagar, Uttar Pradesh",
    "domain": "Corporate",
    "email": "shekhartripathi53@gmail.com",
    "phone": "9651309498",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Chief Manager SBI at State Bank of India • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-394",
    "name": "Devesh Kumar Majumdar",
    "initials": "DK",
    "batch": 1995,
    "house": "Aravali",
    "role": "Homoeopathic Medical Officer",
    "location": "KULPI, SOUTH 24 PARGAMAS, West Bengal",
    "domain": "Medicine",
    "email": "deveshkr.majumdar@gmail.com",
    "phone": "7586-874181",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Homoeopathic Medical Officer at West Bengal Homoeopathic Health Services • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-395",
    "name": "Shailendra Kumar",
    "initials": "SK",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Businessman",
    "location": "Bahrain",
    "domain": "Corporate",
    "email": "27shailendrarai@gmail.com",
    "phone": "97333378602",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Businessman at Tilt Marine Co WLL • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-396",
    "name": "Dr. Shailendra Mohan Tripathi",
    "initials": "DS",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Additional Professor, Department of Geriatric Mental Health, King George’s Medical University, Lucknow",
    "location": "King George’s Medical University, Lucknow",
    "domain": "Medicine",
    "email": "smtripathi@kgmcindia.edu",
    "phone": "9415531178",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Additional Professor, Department of Geriatric Mental Health, King George’s Medical University, Lucknow at King George’s Medical University, Lucknow • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-397",
    "name": "Arvind Kumar",
    "initials": "AK",
    "batch": 2008,
    "house": "Aravali",
    "role": "Assistant Teacher P S Saranw kurwar sultanpur up",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "kumararvind2501@gmail.com",
    "phone": "7905340371",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Teacher P S Saranw kurwar sultanpur up at Jnv alumni • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-398",
    "name": "Vikas Maurya",
    "initials": "VM",
    "batch": 2002,
    "house": "Udaigiri",
    "role": "District backward welfare officer",
    "location": "Ambedkar Nagar",
    "domain": "Civil Services",
    "email": "vikasmvicky27@gmail.com",
    "phone": "8423322671",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "District backward welfare officer at UP Government • Batch of 2002 (Udaigiri House)."
  },
  {
    "id": "alumni-399",
    "name": "Rishabh Kumar",
    "initials": "RK",
    "batch": 2021,
    "house": "Udaigiri",
    "role": "Graduation",
    "location": "Graduation in KNI",
    "domain": "Corporate",
    "email": "rishabhkumar5119@gmail.com",
    "phone": "8303833625",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Graduation at Graduation • Batch of 2021 (Udaigiri House)."
  },
  {
    "id": "alumni-400",
    "name": "Ramroop Gautam",
    "initials": "RG",
    "batch": 1998,
    "house": "Aravali",
    "role": "Private job",
    "location": "Surat Gujarat",
    "domain": "Corporate",
    "email": "ramroopgautam48@gmail.com",
    "phone": "8128085022",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Private job at DyingPrinting mill • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-401",
    "name": "Sudheer Singh",
    "initials": "SS",
    "batch": 2011,
    "house": "Aravali",
    "role": "TEACHER",
    "location": "MUSAFIRKHANA",
    "domain": "Academia",
    "email": "sudheer3ssl@gmail.com",
    "phone": "9452584803",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "TEACHER at BASIC EDUCATION DEPARTMENT • Batch of 2011 (Aravali House)."
  },
  {
    "id": "alumni-402",
    "name": "Rajesh Kumar",
    "initials": "RK",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "JOB",
    "location": "Greater Noida",
    "domain": "Corporate",
    "email": "nirmal2t3t@gmail.com",
    "phone": "7906898848",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "JOB at Satya • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-403",
    "name": "Ram Kishor",
    "initials": "RK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Security guard",
    "location": "Fazilka Punjab",
    "domain": "Technology",
    "email": "k160802318@gmail.com",
    "phone": "6283884275",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Security guard at Markfed • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-404",
    "name": "Anchal Sharma",
    "initials": "AS",
    "batch": 2023,
    "house": "Aravali",
    "role": "Education",
    "location": "India",
    "domain": "Academia",
    "email": "sharmaanchal4442@gmail.com",
    "phone": "9793074968",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Education at BA 1st year • Batch of 2023 (Aravali House)."
  },
  {
    "id": "alumni-405",
    "name": "Shashi Mauli Mishra",
    "initials": "SM",
    "batch": 1998,
    "house": "Shivalik",
    "role": "Store manager",
    "location": "Mumbai",
    "domain": "Corporate",
    "email": "sm9533@gmail.com",
    "phone": "8805501745",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Store manager at Shiv krupa steel &amp; alloys pvt ltd • Batch of 1998 (Shivalik House)."
  },
  {
    "id": "alumni-406",
    "name": "Jitendra Kumar",
    "initials": "JK",
    "batch": 2009,
    "house": "Nilgiri",
    "role": "Assistant teacher basic shiksha vibhag",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "kumarjitendra1201@gmail.com",
    "phone": "8630967602",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant teacher basic shiksha vibhag at Basic education department • Batch of 2009 (Nilgiri House)."
  },
  {
    "id": "alumni-407",
    "name": "Ravi Prakash Jaiswal",
    "initials": "RP",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Defence",
    "location": "Bhuj, Gujarat",
    "domain": "Corporate",
    "email": "ravijassi98@gmail.com",
    "phone": "7508273382",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Defence at IAF • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-408",
    "name": "Anil Kumar Bhatt",
    "initials": "AK",
    "batch": 2007,
    "house": "Nilgiri",
    "role": "Service",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "anilupsrtc1990@gmail.com",
    "phone": "9839237193",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Service at Upsrtc • Batch of 2007 (Nilgiri House)."
  },
  {
    "id": "alumni-409",
    "name": "Mahesh Kumar Pandey",
    "initials": "MK",
    "batch": 2003,
    "house": "Udaigiri",
    "role": "Assistant Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "maheshpandey4678@gmail.com",
    "phone": "7905837424",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at Basic Education Department • Batch of 2003 (Udaigiri House)."
  },
  {
    "id": "alumni-410",
    "name": "Afreen Bano",
    "initials": "AB",
    "batch": 2016,
    "house": "Nilgiri",
    "role": "MBBS student",
    "location": "India",
    "domain": "Corporate",
    "email": "banoafreen505@gmail.com",
    "phone": "7860284074",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "MBBS student • Batch of 2016 (Nilgiri House)."
  },
  {
    "id": "alumni-411",
    "name": "Santosh Kumar Gautam",
    "initials": "SK",
    "batch": 2006,
    "house": "Udaigiri",
    "role": "Government Teacher",
    "location": "AMETHI",
    "domain": "Academia",
    "email": "santynandy89@gmail.com",
    "phone": "9721574597",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Government Teacher at Basic education department • Batch of 2006 (Udaigiri House)."
  },
  {
    "id": "alumni-412",
    "name": "Rajneesh Pathak",
    "initials": "RP",
    "batch": 2002,
    "house": "Shivalik",
    "role": "ADVOCATE",
    "location": "SULTANPUR",
    "domain": "Corporate",
    "email": "sandupathak@gmail.com",
    "phone": "8182043768",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "ADVOCATE at BAR COUNCIL OF UTTAR PRADESH • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-413",
    "name": "Surabhi Jaiswal",
    "initials": "SJ",
    "batch": 2006,
    "house": "Shivalik",
    "role": "Assistant professor",
    "location": "Pune",
    "domain": "Academia",
    "email": "surabhi.jaiswal4@gmail.com",
    "phone": "9979198841",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant professor at Indian Institute of Science Education and Research Pune • Batch of 2006 (Shivalik House)."
  },
  {
    "id": "alumni-414",
    "name": "Mohit Kumar Yadav",
    "initials": "MK",
    "batch": 2000,
    "house": "Shivalik",
    "role": "Revenue Lekhpal",
    "location": "Tahseel Musafirkhana, District Amethi",
    "domain": "Corporate",
    "email": "ymohit622@gmail.com",
    "phone": "9453090940",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Revenue Lekhpal at Government Employee • Batch of 2000 (Shivalik House)."
  },
  {
    "id": "alumni-415",
    "name": "Shiv Kumar Verma",
    "initials": "SK",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Engineer",
    "location": "Washington metropolitan area/National Capital Region",
    "domain": "Technology",
    "email": "shivverma@gmail.com",
    "phone": "",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Engineer • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-416",
    "name": "Ajay Kumar",
    "initials": "AK",
    "batch": 2014,
    "house": "Aravali",
    "role": "Engineer/Assistant Manager",
    "location": "Shaktinagar sonbhadra",
    "domain": "Technology",
    "email": "akmme785@gmail.com",
    "phone": "7004877889",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Engineer/Assistant Manager at Coal India limited • Batch of 2014 (Aravali House)."
  },
  {
    "id": "alumni-417",
    "name": "Rachana Singh",
    "initials": "RS",
    "batch": 2001,
    "house": "Udaigiri",
    "role": "ATPS",
    "location": "Amethi",
    "domain": "Corporate",
    "email": "rachana3604@gmail.com",
    "phone": "8960226925",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "ATPS at Basic Education • Batch of 2001 (Udaigiri House)."
  },
  {
    "id": "alumni-418",
    "name": "Ashutosh Singh",
    "initials": "AS",
    "batch": 2003,
    "house": "Shivalik",
    "role": "PHYSICAL EDUCATION TEACHER",
    "location": "JNV SHEOHAR BIHAR",
    "domain": "Academia",
    "email": "ashutosh2222singh@gmail.com",
    "phone": "7007084637",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "PHYSICAL EDUCATION TEACHER at JNV • Batch of 2003 (Shivalik House)."
  },
  {
    "id": "alumni-419",
    "name": "Gautam Agrahari",
    "initials": "GA",
    "batch": 2021,
    "house": "Aravali",
    "role": "student",
    "location": "India",
    "domain": "Corporate",
    "email": "gautamagraharijnvs@gmail.com",
    "phone": "9628966024",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "student • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-420",
    "name": "Arun Kumar",
    "initials": "AK",
    "batch": 2002,
    "house": "Aravali",
    "role": "TEACHER (HEAD TEACHER)",
    "location": "PS DHEMA BHADAR AMETHI",
    "domain": "Academia",
    "email": "arunkumar1984ht@gmail.com",
    "phone": "9452227675",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "TEACHER (HEAD TEACHER) at Basic education up • Batch of 2002 (Aravali House)."
  },
  {
    "id": "alumni-421",
    "name": "Rakesh Kumar",
    "initials": "RK",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Self employee",
    "location": "Bhadaiyan",
    "domain": "Corporate",
    "email": "rakesh.sln563@gmail.com",
    "phone": "8127446516",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Self employee at NA • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-422",
    "name": "Utkarsh Dwivedi",
    "initials": "UD",
    "batch": 2008,
    "house": "Nilgiri",
    "role": "govt job",
    "location": "sultanpur",
    "domain": "Civil Services",
    "email": "utk92geo@gmail.com",
    "phone": "8303482617",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "govt job • Batch of 2008 (Nilgiri House)."
  },
  {
    "id": "alumni-423",
    "name": "Mamta Verma",
    "initials": "MV",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "LECTURER INTER COLLEGE",
    "location": "GIC AYODHYA",
    "domain": "Academia",
    "email": "mamtav.akv@gmail.com",
    "phone": "9452484451",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "LECTURER INTER COLLEGE at GIC • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-424",
    "name": "Sohan Lal",
    "initials": "SL",
    "batch": 2010,
    "house": "Nilgiri",
    "role": "Teaching (Assistant Professor)",
    "location": "Jaunpur",
    "domain": "Academia",
    "email": "sohanlaldelhi2016@gmail.com",
    "phone": "9450066575",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teaching (Assistant Professor) at Department of Higher Education UP Govt. • Batch of 2010 (Nilgiri House)."
  },
  {
    "id": "alumni-425",
    "name": "Rananjay Mishra",
    "initials": "RM",
    "batch": 2000,
    "house": "Nilgiri",
    "role": "Job Deputy Manager",
    "location": "Varanasi",
    "domain": "Corporate",
    "email": "rananjay.mishra@gmail.com",
    "phone": "9984003311",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Job Deputy Manager at Havells India Ltd • Batch of 2000 (Nilgiri House)."
  },
  {
    "id": "alumni-426",
    "name": "Arjun Kumar Arya",
    "initials": "AK",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Assistant teacher",
    "location": "PS SEWAHA CHAUBEY SANTHA SANT KABIR NAGAR",
    "domain": "Academia",
    "email": "arjunarya741@gmail.com",
    "phone": "7317841838",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant teacher at Basic Shiksha Parishad • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-427",
    "name": "Mohammad Kaleem",
    "initials": "MK",
    "batch": 2008,
    "house": "Nilgiri",
    "role": "Alumnus",
    "location": "Raebareli",
    "domain": "Corporate",
    "email": "amzukaleem781@gmail.com",
    "phone": "7068981787",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2008 (Nilgiri House)."
  },
  {
    "id": "alumni-428",
    "name": "Ajay Kumar Gupta",
    "initials": "AK",
    "batch": 2008,
    "house": "Aravali",
    "role": "Lekhpal",
    "location": "Salon raebareli",
    "domain": "Corporate",
    "email": "ajaykumargupta15@gmail.com",
    "phone": "7317342776",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Lekhpal • Batch of 2008 (Aravali House)."
  },
  {
    "id": "alumni-429",
    "name": "Rakesh Kumar Singh",
    "initials": "RK",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Government contractor",
    "location": "Amethi,sultanpur,",
    "domain": "Corporate",
    "email": "singh.sultanpur76@gmail.com",
    "phone": "97213 90099",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Government contractor at R k construction • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-430",
    "name": "Ansar Ahmad",
    "initials": "AA",
    "batch": 2005,
    "house": "Aravali",
    "role": "Accountant",
    "location": "Aligarh",
    "domain": "Corporate",
    "email": "ansar2106@gmail.com",
    "phone": "9454049823",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Accountant at Allanasons Private Limited • Batch of 2005 (Aravali House)."
  },
  {
    "id": "alumni-431",
    "name": "Md Rizwan Ahmad Ansari",
    "initials": "MR",
    "batch": 2005,
    "house": "Nilgiri",
    "role": "president of trust and running school",
    "location": "MUMBAI AND NEW MUMBAI",
    "domain": "Academia",
    "email": "ansaririz1989@gmail.com",
    "phone": "8286581619",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "president of trust and running school at EDUCARE ENGLISH SCHOOL &amp; SUNSHINE ENGLISH SCHOOL • Batch of 2005 (Nilgiri House)."
  },
  {
    "id": "alumni-432",
    "name": "Swati Shukla",
    "initials": "SS",
    "batch": 2009,
    "house": "Shivalik",
    "role": "AUDITOR",
    "location": "GURGAON",
    "domain": "Technology",
    "email": "avaswatishukla1@gmail.com",
    "phone": "8318582120",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "AUDITOR at AVA BUSINESS CONSELTING &amp; RISK MANGEMENT LLP • Batch of 2009 (Shivalik House)."
  },
  {
    "id": "alumni-433",
    "name": "Sant Lal Prajapati",
    "initials": "SL",
    "batch": 1999,
    "house": "Shivalik",
    "role": "ELECTRICAL ENGINEER/AEN",
    "location": "KOTA, RAJASTHAN",
    "domain": "Technology",
    "email": "prajapati.4182@gmail.com",
    "phone": "7895972204",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "ELECTRICAL ENGINEER/AEN at RP SG GROUP • Batch of 1999 (Shivalik House)."
  },
  {
    "id": "alumni-434",
    "name": "Saurabh Maurya",
    "initials": "SM",
    "batch": 2018,
    "house": "Aravali",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "mauryasaurabh978@gmail.com",
    "phone": "7800675841",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2018 (Aravali House)."
  },
  {
    "id": "alumni-435",
    "name": "Anil Choudhary",
    "initials": "AC",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "pratibhachaudhary1234456@gmail.com",
    "phone": "9598393235",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-436",
    "name": "Raunaq Singh",
    "initials": "RS",
    "batch": 2019,
    "house": "Nilgiri",
    "role": "HITMAN",
    "location": "CCS AIRPORT",
    "domain": "Technology",
    "email": "raunaqsingh404@gmail.com",
    "phone": "7355019501",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "HITMAN at ILLUMINATI • Batch of 2019 (Nilgiri House)."
  },
  {
    "id": "alumni-437",
    "name": "Virika Solanki (pooja)",
    "initials": "VS",
    "batch": 2009,
    "house": "Nilgiri",
    "role": "Actress",
    "location": "Gurgaon",
    "domain": "Corporate",
    "email": "poojarocks.lu@gmail.com",
    "phone": "7054970297",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Actress at Freelance • Batch of 2009 (Nilgiri House)."
  },
  {
    "id": "alumni-438",
    "name": "Arti Kasaudhan",
    "initials": "AK",
    "batch": 2020,
    "house": "Udaigiri",
    "role": "Collage student",
    "location": "India",
    "domain": "Corporate",
    "email": "artikasaudhana@gmail.com",
    "phone": "9335004155",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Collage student • Batch of 2020 (Udaigiri House)."
  },
  {
    "id": "alumni-439",
    "name": "Arti Tiwari",
    "initials": "AT",
    "batch": 2009,
    "house": "Aravali",
    "role": "Assistant Teacher at basic education department",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "artitiwari5562@gmail.com",
    "phone": "7985004795",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at basic education department at Basic education • Batch of 2009 (Aravali House)."
  },
  {
    "id": "alumni-440",
    "name": "Suneeta Yadav",
    "initials": "SY",
    "batch": 1999,
    "house": "Aravali",
    "role": "A.T in basic",
    "location": "Jlalpur",
    "domain": "Corporate",
    "email": "yadavsunit832@gmail.com",
    "phone": "7379922960",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "A.T in basic • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-441",
    "name": "Amita Singh",
    "initials": "AS",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Home Maker",
    "location": "Lucknow",
    "domain": "Corporate",
    "email": "amita8181.singh@gmail.com",
    "phone": "9452554139",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Home Maker at N/A • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-442",
    "name": "Abdul Yasir",
    "initials": "AY",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "Research Scientist",
    "location": "India",
    "domain": "Corporate",
    "email": "yasirabdul78@gmail.com",
    "phone": "+1 8435572975",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Research Scientist at Medical University of South Carolina, USA • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-443",
    "name": "Shivram",
    "initials": "S",
    "batch": 2002,
    "house": "Shivalik",
    "role": "Assistant Teacher Primary school",
    "location": "P.S.Bharkat Lambhua",
    "domain": "Academia",
    "email": "shivrambuddha0005@gmail.com",
    "phone": "8960800234",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant Teacher Primary school at Basic Education department UP • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-444",
    "name": "कुलपति राम अकेला",
    "initials": "कर",
    "batch": 1993,
    "house": "Shivalik",
    "role": "Chattering",
    "location": "India",
    "domain": "Corporate",
    "email": "kulfatiramakela@gmail.com",
    "phone": "9005226422",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Chattering • Batch of 1993 (Shivalik House)."
  },
  {
    "id": "alumni-445",
    "name": "Gyan Prakash",
    "initials": "GP",
    "batch": 1997,
    "house": "Shivalik",
    "role": "Maths teacher",
    "location": "India",
    "domain": "Academia",
    "email": "prakashgyan747@gmail.com",
    "phone": "6387461190",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Maths teacher at MPIC Chak Siloudha Sangipur Pratapgarh • Batch of 1997 (Shivalik House)."
  },
  {
    "id": "alumni-446",
    "name": "Ashvani Pandey",
    "initials": "AP",
    "batch": 2019,
    "house": "Shivalik",
    "role": "Gds",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "pandeyashvani75@gmail.com",
    "phone": "6386862806",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Gds at Post office • Batch of 2019 (Shivalik House)."
  },
  {
    "id": "alumni-447",
    "name": "Kapil Gupta",
    "initials": "KG",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "MARKETING",
    "location": "DISPOSAL(SULTANPUR)",
    "domain": "Corporate",
    "email": "akashaijm121@gmail.com",
    "phone": "734823630",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "MARKETING at DISPOSAL • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-448",
    "name": "Ankit Chaudhary",
    "initials": "AC",
    "batch": 2022,
    "house": "Shivalik",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "ankitgwentas@gmail.com",
    "phone": "9369825634",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student at IIT BHU , Varanasi • Batch of 2022 (Shivalik House)."
  },
  {
    "id": "alumni-449",
    "name": "Mukesh Kumar",
    "initials": "MK",
    "batch": 2000,
    "house": "Aravali",
    "role": "Fitter",
    "location": "Jayant,Singrauli",
    "domain": "Technology",
    "email": "mk6533543@gmail.com",
    "phone": "7000431864",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Fitter at NCL • Batch of 2000 (Aravali House)."
  },
  {
    "id": "alumni-450",
    "name": "Neeraj Sharma",
    "initials": "NS",
    "batch": 1999,
    "house": "Aravali",
    "role": "CA INTER",
    "location": "SULTANPUR",
    "domain": "Corporate",
    "email": "neeraj.ca82@gmail.com",
    "phone": "9891079132",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "CA INTER at E FILING CART • Batch of 1999 (Aravali House)."
  },
  {
    "id": "alumni-451",
    "name": "Jayant Kumar Tiwari",
    "initials": "JK",
    "batch": 2005,
    "house": "Aravali",
    "role": "Assistant Engineer",
    "location": "Anpara",
    "domain": "Technology",
    "email": "jtiwari1989@gmail.com",
    "phone": "9140283926",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Assistant Engineer at UPRVUNL • Batch of 2005 (Aravali House)."
  },
  {
    "id": "alumni-452",
    "name": "Sangeeta Saroj",
    "initials": "SS",
    "batch": 2013,
    "house": "Nilgiri",
    "role": "Teaching",
    "location": "Bihar samastipur",
    "domain": "Corporate",
    "email": "sangusss02@gmail.com",
    "phone": "8115880770",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teaching at BPSC prt • Batch of 2013 (Nilgiri House)."
  },
  {
    "id": "alumni-453",
    "name": "Mohit Kumar Shukla",
    "initials": "MK",
    "batch": 2016,
    "house": "Udaigiri",
    "role": "Constable at Utter Pradesh police",
    "location": "Raebareli",
    "domain": "Civil Services",
    "email": "mohitkumarshukla110@gmail.com",
    "phone": "8127376762",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Constable at Utter Pradesh police • Batch of 2016 (Udaigiri House)."
  },
  {
    "id": "alumni-454",
    "name": "Sandeep Kumar Maurya",
    "initials": "SK",
    "batch": 2018,
    "house": "Udaigiri",
    "role": "Singer &amp; Writer",
    "location": "Amethi",
    "domain": "Technology",
    "email": "singersandeep20@gmail.com",
    "phone": "8318774978",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Singer &amp; Writer at Target Cinema • Batch of 2018 (Udaigiri House)."
  },
  {
    "id": "alumni-455",
    "name": "Shubham Kharwar",
    "initials": "SK",
    "batch": 2010,
    "house": "Shivalik",
    "role": "Assistant Professor",
    "location": "Raebareli",
    "domain": "Academia",
    "email": "kharwar1620@gmail.com",
    "phone": "8840376720",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Assistant Professor at Feroze Gandhi College • Batch of 2010 (Shivalik House)."
  },
  {
    "id": "alumni-456",
    "name": "Raju Bhaskar",
    "initials": "RB",
    "batch": 2014,
    "house": "Udaigiri",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "bhaskarraju156@gmail.com",
    "phone": "9454196410",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2014 (Udaigiri House)."
  },
  {
    "id": "alumni-457",
    "name": "Virendra Pratap",
    "initials": "VP",
    "batch": 2011,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "virendralove.vs@gmail.com",
    "phone": "7827164811",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2011 (Udaigiri House)."
  },
  {
    "id": "alumni-458",
    "name": "Ankit Mishra",
    "initials": "AM",
    "batch": 2019,
    "house": "Nilgiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "khlshwrmishra@gmail.com",
    "phone": "7317465854",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2019 (Nilgiri House)."
  },
  {
    "id": "alumni-459",
    "name": "Abhay Kumar Mishra",
    "initials": "AK",
    "batch": 2007,
    "house": "Shivalik",
    "role": "Software Engineer",
    "location": "Chandigarh",
    "domain": "Technology",
    "email": "1990abhay@gmail.com",
    "phone": "9990697852",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Software Engineer at Duck creek Technology • Batch of 2007 (Shivalik House)."
  },
  {
    "id": "alumni-460",
    "name": "Jay Shankar Yadav",
    "initials": "JS",
    "batch": 2010,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Jagdishpur",
    "domain": "Academia",
    "email": "jayshankarfet@gmail.com",
    "phone": "9411111654",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education • Batch of 2010 (Nilgiri House)."
  },
  {
    "id": "alumni-461",
    "name": "Pradeep Kanaujiya",
    "initials": "PK",
    "batch": 2018,
    "house": "Nilgiri",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "pradeepkanaujiya8400@gmail.com",
    "phone": "8400558466",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student at 1 • Batch of 2018 (Nilgiri House)."
  },
  {
    "id": "alumni-462",
    "name": "Ritika Bharti",
    "initials": "RB",
    "batch": 2014,
    "house": "Nilgiri",
    "role": "Lecturer",
    "location": "Dostpur",
    "domain": "Corporate",
    "email": "ritikakhanna998@gmail.com",
    "phone": "9026548012",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Lecturer at Muid Ahmed Degree College • Batch of 2014 (Nilgiri House)."
  },
  {
    "id": "alumni-463",
    "name": "Arjun Kumar",
    "initials": "AK",
    "batch": 2009,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "arjun.loving123@gmail.com",
    "phone": "9889504227",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2009 (Aravali House)."
  },
  {
    "id": "alumni-464",
    "name": "Anjali Kori",
    "initials": "AK",
    "batch": 2020,
    "house": "Nilgiri",
    "role": "beled",
    "location": "India",
    "domain": "Corporate",
    "email": "kuanjali686@gmail.com",
    "phone": "9670255565",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "beled • Batch of 2020 (Nilgiri House)."
  },
  {
    "id": "alumni-465",
    "name": "Sanjay Kumar",
    "initials": "SK",
    "batch": 2004,
    "house": "Aravali",
    "role": "Govt Job",
    "location": "UP Secretariat",
    "domain": "Civil Services",
    "email": "sanjaykumarassistant@gmail.com",
    "phone": "9454414129",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Govt Job at UP Secretariat • Batch of 2004 (Aravali House)."
  },
  {
    "id": "alumni-466",
    "name": "Anilkumar",
    "initials": "A",
    "batch": 1994,
    "house": "Nilgiri",
    "role": "Doctor",
    "location": "Baharaich up",
    "domain": "Medicine",
    "email": "dr.anilkumar111@gmail.com",
    "phone": "7234941122",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Doctor at PMS • Batch of 1994 (Nilgiri House)."
  },
  {
    "id": "alumni-467",
    "name": "Ruchi Kumari",
    "initials": "RK",
    "batch": 2021,
    "house": "Shivalik",
    "role": "Student",
    "location": "Student",
    "domain": "Corporate",
    "email": "ruchiakb12345@gmail.com",
    "phone": "6392011800",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2021 (Shivalik House)."
  },
  {
    "id": "alumni-468",
    "name": "Brijesh Yadav",
    "initials": "BY",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Executive Engineer",
    "location": "Dehradun",
    "domain": "Technology",
    "email": "brijesh_nit@yahoo.co.in",
    "phone": "9456590174",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Executive Engineer at UJVN LTD • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-469",
    "name": "Adarsh Singh",
    "initials": "AS",
    "batch": 2018,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "singhadarshsln9936@gmail.com",
    "phone": "9695636982",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2018 (Udaigiri House)."
  },
  {
    "id": "alumni-470",
    "name": "Brijlal",
    "initials": "B",
    "batch": 2008,
    "house": "Nilgiri",
    "role": "TEACHER",
    "location": "PP KAMAICHA",
    "domain": "Academia",
    "email": "lalbrij916@gmail.com",
    "phone": "8545037441",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "TEACHER at JNV gauriganj • Batch of 2008 (Nilgiri House)."
  },
  {
    "id": "alumni-471",
    "name": "Amit Kumar Maurya",
    "initials": "AK",
    "batch": 2007,
    "house": "Aravali",
    "role": "Software professional/Technical Lead",
    "location": "Bangalore",
    "domain": "Technology",
    "email": "info.amit28@gmail.com",
    "phone": "8892240182",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Software professional/Technical Lead at Morgan Stanley • Batch of 2007 (Aravali House)."
  },
  {
    "id": "alumni-472",
    "name": "Phool Chandra",
    "initials": "PC",
    "batch": 1995,
    "house": "Aravali",
    "role": "University Teaching and Research / Professor and Head",
    "location": "Moradabad UP India",
    "domain": "Technology",
    "email": "profpcpatel@gmail.com",
    "phone": "9450082374",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "University Teaching and Research / Professor and Head at Teerthanker Mahaveer University, Moradabad • Batch of 1995 (Aravali House)."
  },
  {
    "id": "alumni-473",
    "name": "Ramesh Chandra Yadav",
    "initials": "RC",
    "batch": 1996,
    "house": "Aravali",
    "role": "Member of PLA court sultanpur",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "007yadavramesh@gmail.com",
    "phone": "9454107661",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Member of PLA court sultanpur • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-474",
    "name": "Anita Devi",
    "initials": "AD",
    "batch": 2001,
    "house": "Nilgiri",
    "role": "Assistant Teacher (Basic education)",
    "location": "P.S.Nagmalpur Block Sandwa Chandika District Pratapgarh Uttar Pradesh",
    "domain": "Academia",
    "email": "anitark390@gmail.com",
    "phone": "9956778673",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher (Basic education) at Basic education department • Batch of 2001 (Nilgiri House)."
  },
  {
    "id": "alumni-475",
    "name": "Imran Ahmad",
    "initials": "IA",
    "batch": 2006,
    "house": "Shivalik",
    "role": "Insurance Advisor",
    "location": "Jagdishpur",
    "domain": "Corporate",
    "email": "imranahmad235@gmail.com",
    "phone": "9721658652",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Insurance Advisor at NA • Batch of 2006 (Shivalik House)."
  },
  {
    "id": "alumni-476",
    "name": "Neeraj Tiwari",
    "initials": "NT",
    "batch": 2008,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "neeraj8026@gmail.com",
    "phone": "7081091906",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2008 (Shivalik House)."
  },
  {
    "id": "alumni-477",
    "name": "Ankit Raj Yadav",
    "initials": "AR",
    "batch": 2023,
    "house": "Udaigiri",
    "role": "Student",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "rajankit9450@gmail.com",
    "phone": "9532644744",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Student at Studying in MHARANA PRTAPA PG COLLEGE • Batch of 2023 (Udaigiri House)."
  },
  {
    "id": "alumni-478",
    "name": "Gunjan Mishra",
    "initials": "GM",
    "batch": 2019,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "ankitmishra1247@gmail.com",
    "phone": "9307461950",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2019 (Aravali House)."
  },
  {
    "id": "alumni-479",
    "name": "Manoj Kumar Yadav",
    "initials": "MK",
    "batch": 1997,
    "house": "Udaigiri",
    "role": "Alumnus",
    "location": "Sultanpur",
    "domain": "Corporate",
    "email": "yadavmanoj34@gmail.com",
    "phone": "8565027929",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 1997 (Udaigiri House)."
  },
  {
    "id": "alumni-480",
    "name": "Shiv Shankar Shukla",
    "initials": "SS",
    "batch": 2001,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "shuklashivshankar15@gmail.com",
    "phone": "7235002993",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2001 (Aravali House)."
  },
  {
    "id": "alumni-481",
    "name": "Ankit Kumar Nishad",
    "initials": "AK",
    "batch": 2022,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "nishadankit1290@gmail.com",
    "phone": "8423519873",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2022 (Aravali House)."
  },
  {
    "id": "alumni-482",
    "name": "Rohit Maurya",
    "initials": "RM",
    "batch": 2020,
    "house": "Aravali",
    "role": "Student(Bachelor of Pharmacy)",
    "location": "Rajarshi Rananjay Sinh College of Pharmacy Amethi",
    "domain": "Corporate",
    "email": "rohitmauryaneet0361@gmail.com",
    "phone": "9598811634",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student(Bachelor of Pharmacy) at Rajarshi Rananjay Sinh College of Pharmacy Amethi • Batch of 2020 (Aravali House)."
  },
  {
    "id": "alumni-483",
    "name": "Meenu Singh",
    "initials": "MS",
    "batch": 1999,
    "house": "Udaigiri",
    "role": "Associate Manager",
    "location": "Bangalore",
    "domain": "Corporate",
    "email": "meenupharma@gmail.com",
    "phone": "9986903599",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Associate Manager at Indegene Inc. • Batch of 1999 (Udaigiri House)."
  },
  {
    "id": "alumni-484",
    "name": "Raghu Nandan",
    "initials": "RN",
    "batch": 1996,
    "house": "Aravali",
    "role": "Electrical Officer",
    "location": "Jamnagar, Gujarat",
    "domain": "Civil Services",
    "email": "raghunandankanaujiya@gmail.com",
    "phone": "6352283944",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Electrical Officer at Adsun Offshore • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-485",
    "name": "Arsi Begam",
    "initials": "AB",
    "batch": 2001,
    "house": "Nilgiri",
    "role": "Sports physiotherapy",
    "location": "India",
    "domain": "Corporate",
    "email": "arsifaheem@gmail.com",
    "phone": "8299016355",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Sports physiotherapy • Batch of 2001 (Nilgiri House)."
  },
  {
    "id": "alumni-486",
    "name": "Saloni Gupta",
    "initials": "SG",
    "batch": 2015,
    "house": "Nilgiri",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "advocateajay77@gmail.com",
    "phone": "950636326",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2015 (Nilgiri House)."
  },
  {
    "id": "alumni-487",
    "name": "Digvijay Mishra",
    "initials": "DM",
    "batch": 2021,
    "house": "Aravali",
    "role": "Student BCom",
    "location": "India",
    "domain": "Corporate",
    "email": "digvijaymishra8765@gmail.com",
    "phone": "8887189971",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student BCom at Kanpur University • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-488",
    "name": "Anupam Kumar Pandey",
    "initials": "AK",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Amethi",
    "domain": "Academia",
    "email": "anupam.pandeyamethi@gmail.com",
    "phone": "919721714603",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-489",
    "name": "Rakesh Kumar Tripathi",
    "initials": "RK",
    "batch": 1996,
    "house": "Shivalik",
    "role": "Asst teacher",
    "location": "Agra",
    "domain": "Academia",
    "email": "tripathi.ansh2005@gmail.com",
    "phone": "7355172613",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Asst teacher at UPMSP • Batch of 1996 (Shivalik House)."
  },
  {
    "id": "alumni-490",
    "name": "Abul Kalam Azad",
    "initials": "AK",
    "batch": 1993,
    "house": "Aravali",
    "role": "Teacher (Shikshamitra)",
    "location": "Jolimirganj",
    "domain": "Technology",
    "email": "kalamaji73@gmail.com",
    "phone": "9455644889",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Teacher (Shikshamitra) at PS. Jolimirganj • Batch of 1993 (Aravali House)."
  },
  {
    "id": "alumni-491",
    "name": "Ghanshyam Prabhakar",
    "initials": "GP",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "Basic teacher",
    "location": "P P.Kamaicha Lambhua Sultanpur Uttar Pradesh",
    "domain": "Academia",
    "email": "ghanshyamprabhakar34@gmail.com",
    "phone": "9450716534",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Basic teacher at Basic education • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-492",
    "name": "Shani Verma",
    "initials": "SV",
    "batch": 2021,
    "house": "Aravali",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "shanivermajnv003@gmail.com",
    "phone": "9651854844",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-493",
    "name": "Dr Ran Bahadur",
    "initials": "DR",
    "batch": 1995,
    "house": "Shivalik",
    "role": "Docter",
    "location": "CHC Shahganj jaunpur up",
    "domain": "Corporate",
    "email": "ranbahadury148@gmail.com",
    "phone": "9670176305",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Docter at Health department • Batch of 1995 (Shivalik House)."
  },
  {
    "id": "alumni-494",
    "name": "Rita Kaushal",
    "initials": "RK",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "House wife",
    "location": "India",
    "domain": "Corporate",
    "email": "shauryavardhan60@gmail.com",
    "phone": "7380603976",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "House wife • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-495",
    "name": "Dr. Pankaj Baranwal",
    "initials": "DP",
    "batch": 2005,
    "house": "Aravali",
    "role": "Eye surgeon ( MS)",
    "location": "Ayodhya",
    "domain": "Corporate",
    "email": "dr.pbeclt@gmail.com",
    "phone": "8299272633",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Eye surgeon ( MS) at Government • Batch of 2005 (Aravali House)."
  },
  {
    "id": "alumni-496",
    "name": "Vipin Singh",
    "initials": "VS",
    "batch": 2021,
    "house": "Aravali",
    "role": "SOCIAL WORKER/ STUDENT",
    "location": "KITHAULI, LAMBHUA, SULTANPUR",
    "domain": "Corporate",
    "email": "rajpootvipinsingh165@gmail.com",
    "phone": "9580721315",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "SOCIAL WORKER/ STUDENT at RAM KISHOR SINGH CHARITABLE TRUST • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-497",
    "name": "Vivek Srivastava",
    "initials": "VS",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Software Engineer",
    "location": "Noida",
    "domain": "Technology",
    "email": "vivek19nov@gmail.com",
    "phone": "8587082528",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Software Engineer at Oracle India • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-498",
    "name": "Gunjan Singh",
    "initials": "GS",
    "batch": 2003,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Ramganj,amethi",
    "domain": "Academia",
    "email": "singhgunjan0772@gmail.com",
    "phone": "9559076945",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic • Batch of 2003 (Nilgiri House)."
  },
  {
    "id": "alumni-499",
    "name": "Raj",
    "initials": "R",
    "batch": 2021,
    "house": "Aravali",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "rajbravo2003@gmail.com",
    "phone": "8707789337",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-500",
    "name": "Vishnu Prajapati",
    "initials": "VP",
    "batch": 2021,
    "house": "Shivalik",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "vishnudeva2003@gmail.com",
    "phone": "8887974930",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2021 (Shivalik House)."
  },
  {
    "id": "alumni-501",
    "name": "Rajmani Tripathi",
    "initials": "RT",
    "batch": 1996,
    "house": "Aravali",
    "role": "ZM",
    "location": "Haryana",
    "domain": "Corporate",
    "email": "rajmanitiwari1979@gmail.com",
    "phone": "9873784429",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "ZM at Satya maicrocapital • Batch of 1996 (Aravali House)."
  },
  {
    "id": "alumni-502",
    "name": "Vivek Tiwari",
    "initials": "VT",
    "batch": 1999,
    "house": "Nilgiri",
    "role": "Assistant Teacher",
    "location": "Sultanpur",
    "domain": "Academia",
    "email": "tiwarivivek41@gmail.com",
    "phone": "9891790261",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Assistant Teacher at Department of Basic Education Uttar Pradesh • Batch of 1999 (Nilgiri House)."
  },
  {
    "id": "alumni-503",
    "name": "Sushila Yadav",
    "initials": "SY",
    "batch": 2016,
    "house": "Shivalik",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "preetirpy@gmail.com",
    "phone": "7318321123",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 2016 (Shivalik House)."
  },
  {
    "id": "alumni-504",
    "name": "Sharad Verma",
    "initials": "SV",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Sales / Head Sales",
    "location": "Delhi",
    "domain": "Corporate",
    "email": "vsharad@gmail.com",
    "phone": "7060500151",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Sales / Head Sales at Tata Steel • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-505",
    "name": "Bholendra Pandey",
    "initials": "BP",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Alumnus",
    "location": "India",
    "domain": "Corporate",
    "email": "bholendra1980@gmail.com",
    "phone": "9451136296",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Alumnus • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-506",
    "name": "Rakesh Kumar Tiwari",
    "initials": "RK",
    "batch": 1995,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Jaisinghpur Sultanpur",
    "domain": "Academia",
    "email": "rakeshkumartiwari182@gmail.com",
    "phone": "9451779460",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic Shiksha Parishad • Batch of 1995 (Udaigiri House)."
  },
  {
    "id": "alumni-507",
    "name": "Anjani Kumar Pandey",
    "initials": "AK",
    "batch": 1996,
    "house": "Nilgiri",
    "role": "PRINCIPAL IN GOVT AIDED SCHOOL",
    "location": "AKHANDNAGAR SULTANPUR",
    "domain": "Civil Services",
    "email": "shreyas25869@gmail.com",
    "phone": "9452681823",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "PRINCIPAL IN GOVT AIDED SCHOOL at L M V VINOBA • Batch of 1996 (Nilgiri House)."
  },
  {
    "id": "alumni-508",
    "name": "Pradip Kumar Singh",
    "initials": "PK",
    "batch": 1994,
    "house": "Aravali",
    "role": "Business",
    "location": "CHAKERI KANPUR",
    "domain": "Corporate",
    "email": "mp180698@gmail.com",
    "phone": "8744920929",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Business at Mamta stationery and gift gallery • Batch of 1994 (Aravali House)."
  },
  {
    "id": "alumni-509",
    "name": "Pramod Kumar Singh",
    "initials": "PK",
    "batch": 1998,
    "house": "Aravali",
    "role": "Software professional",
    "location": "Pune",
    "domain": "Technology",
    "email": "pramodrsingh@gmail.com",
    "phone": "9604812405",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Software professional at Capita india • Batch of 1998 (Aravali House)."
  },
  {
    "id": "alumni-510",
    "name": "Sanjeev Kumar",
    "initials": "SK",
    "batch": 2000,
    "house": "Shivalik",
    "role": "Teacher in Basik education",
    "location": "Sangipur, pratapgarh",
    "domain": "Academia",
    "email": "kumarsanjeevanshi82@gmail.com",
    "phone": "9453698877",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher in Basik education at Basik education • Batch of 2000 (Shivalik House)."
  },
  {
    "id": "alumni-511",
    "name": "Dheerendra Vikram Singh",
    "initials": "DV",
    "batch": 1997,
    "house": "Aravali",
    "role": "District Manager",
    "location": "Sant Kabeer Nagar",
    "domain": "Corporate",
    "email": "managermisbasti@gmail.com",
    "phone": "8299177380",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "District Manager at Skill Development, • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-512",
    "name": "Harsh Singh",
    "initials": "HS",
    "batch": 2021,
    "house": "Aravali",
    "role": "Student",
    "location": "India",
    "domain": "Corporate",
    "email": "harshsinghrajpoot34@gmail.com",
    "phone": "9695867815",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "Student • Batch of 2021 (Aravali House)."
  },
  {
    "id": "alumni-513",
    "name": "Aradhana Dwivedi",
    "initials": "AD",
    "batch": 1998,
    "house": "Udaigiri",
    "role": "Doctor, Lt Col in Indian Army",
    "location": "Army Hospital",
    "domain": "Medicine",
    "email": "aradhanakd@gmail.com",
    "phone": "919612112101",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Doctor, Lt Col in Indian Army at Armed Forces • Batch of 1998 (Udaigiri House)."
  },
  {
    "id": "alumni-514",
    "name": "Ajimol V.k",
    "initials": "AV",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Deputy manager",
    "location": "Kerala",
    "domain": "Corporate",
    "email": "ajimolraj@gmail.com",
    "phone": "8606045699",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Deputy manager at The New India Assurance Co.Ltd • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-515",
    "name": "Mahila N K",
    "initials": "MN",
    "batch": 1993,
    "house": "Nilgiri",
    "role": "Higher secondary school teacher",
    "location": "Kerala",
    "domain": "Academia",
    "email": "mahilaprabhash@gmail.com",
    "phone": "9995332506",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Higher secondary school teacher at Government • Batch of 1993 (Nilgiri House)."
  },
  {
    "id": "alumni-516",
    "name": "Vipin Kumar",
    "initials": "VK",
    "batch": 2010,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Motigarpur",
    "domain": "Academia",
    "email": "vipin9807494647@gmail.com",
    "phone": "9807494647",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Besic department • Batch of 2010 (Shivalik House)."
  },
  {
    "id": "alumni-517",
    "name": "Gyaneshwar Prasad",
    "initials": "GP",
    "batch": 2010,
    "house": "Nilgiri",
    "role": "Asst. Commissioner Industries",
    "location": "Hardoi",
    "domain": "Corporate",
    "email": "gyanesh227@gmail.com",
    "phone": "9497159596",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Asst. Commissioner Industries at Dept of MSME, Govt. Of Uttar Pradesh • Batch of 2010 (Nilgiri House)."
  },
  {
    "id": "alumni-518",
    "name": "Rahul",
    "initials": "R",
    "batch": 2010,
    "house": "Nilgiri",
    "role": "Teacher",
    "location": "Hardoi",
    "domain": "Academia",
    "email": "rahul.abhijeet1@gmail.com",
    "phone": "7905960495",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Teacher at Basic education department • Batch of 2010 (Nilgiri House)."
  },
  {
    "id": "alumni-519",
    "name": "Suja Marypaul",
    "initials": "SM",
    "batch": 1993,
    "house": "Udaigiri",
    "role": "Clinical lab technologist",
    "location": "Calicut",
    "domain": "Technology",
    "email": "sujamarypaul11@gmail.com",
    "phone": "9447811474",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Clinical lab technologist at Govt homeopathic medical college Calicut • Batch of 1993 (Udaigiri House)."
  },
  {
    "id": "alumni-520",
    "name": "Manju Verma",
    "initials": "MV",
    "batch": 2003,
    "house": "Udaigiri",
    "role": "Teacher",
    "location": "Laxmanpur Pratapgarh",
    "domain": "Academia",
    "email": "vermamanju9030@gmail.com",
    "phone": "9628282198",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": "Teacher at Kasturba Gandhi vidyalaya • Batch of 2003 (Udaigiri House)."
  },
  {
    "id": "alumni-521",
    "name": "Ajay Bharti",
    "initials": "AB",
    "batch": 2010,
    "house": "Shivalik",
    "role": "Teacher",
    "location": "Tiloi",
    "domain": "Academia",
    "email": "ajaykuwar2407@gmail.com",
    "phone": "9140105500",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Teacher at Primary school • Batch of 2010 (Shivalik House)."
  },
  {
    "id": "alumni-522",
    "name": "Dr. Sanjay Singh",
    "initials": "DS",
    "batch": 1995,
    "house": "Nilgiri",
    "role": "Deputy Medical Superintendent",
    "location": "S.G.H. Munshiganj, Distt.Amethi",
    "domain": "Medicine",
    "email": "dr.sanjaysinghsgh@gmail.com",
    "phone": "6394401222",
    "badge": "Nilgiri",
    "tag": "Alumnus",
    "bio": "Deputy Medical Superintendent at Sanjay Gandhi Hospital ,Amethi • Batch of 1995 (Nilgiri House)."
  },
  {
    "id": "alumni-523",
    "name": "Prem Prakash Shukla",
    "initials": "PP",
    "batch": 2002,
    "house": "Shivalik",
    "role": "Engineering Manager (Software)",
    "location": "Pune",
    "domain": "Technology",
    "email": "prem.prakash.shukla@gmail.com",
    "phone": "9923903893",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Engineering Manager (Software) at Agiliad Tech Pvt Ltd (Earlier Patni Computers) • Batch of 2002 (Shivalik House)."
  },
  {
    "id": "alumni-524",
    "name": "Santosh Karmakar",
    "initials": "SK",
    "batch": 2022,
    "house": "Udaigiri",
    "role": ".",
    "location": ".",
    "domain": "Corporate",
    "email": "karmakar17.santosh@gmail.com",
    "phone": "9151244055",
    "badge": "Udaigiri",
    "tag": "Alumnus",
    "bio": ". at . • Batch of 2022 (Udaigiri House)."
  },
  {
    "id": "alumni-525",
    "name": "Ayush Singh",
    "initials": "AS",
    "batch": 2014,
    "house": "Shivalik",
    "role": "Up si",
    "location": "Up police",
    "domain": "Corporate",
    "email": "ayushsingaman@gmail.com",
    "phone": "7007959886",
    "badge": "Shivalik",
    "tag": "Alumnus",
    "bio": "Up si • Batch of 2014 (Shivalik House)."
  },
  {
    "id": "alumni-526",
    "name": "Ajay Gautam",
    "initials": "AG",
    "batch": 1997,
    "house": "Aravali",
    "role": "TEACHER(BASIC)",
    "location": "KUDWAR, SULTANPUR",
    "domain": "Academia",
    "email": "akshakya4462@gmail.com",
    "phone": "8009704462",
    "badge": "Aravali",
    "tag": "Alumnus",
    "bio": "TEACHER(BASIC) at Basic • Batch of 1997 (Aravali House)."
  },
  {
    "id": "alumni-527",
    "name": "Sh. Prabhat (PPS)",
    "initials": "PR",
    "batch": 2002,
    "house": "Aravali",
    "role": "Provincial Police Service (PPS) Officer • Dy. SP, U.P. Police",
    "location": "Uttar Pradesh",
    "domain": "Civil Services",
    "email": "",
    "phone": "",
    "badge": "Aravali",
    "tag": "Notable",
    "bio": "Provincial Police Service (PPS) Officer at U.P. Police • Batch of 2002 (Aravali House)."
  }
];

if (typeof window !== 'undefined') {
  window.defaultDirectoryAlumni = defaultDirectoryAlumni;
  window.JNVG_DIRECTORY_SEED = defaultDirectoryAlumni;
}

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
    { id: "sch-2", time: "10:00 AM", color: "amber", title: "Morning Assembly & Prayer (\"हम नवोदय हों\")", desc: "Guru Vandana, lighting of the lamp by Principal Mr. P. K. Singh, collective Navodaya prayer." },
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
      title: "हम नवोदय हों (Acoustic Semi-Classical Fusion)",
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
        defaultData.teachers.forEach(def => {
          const idx = parsed.teachers.findIndex(t => t.id === def.id || (t.name && t.name.toLowerCase() === def.name.toLowerCase()));
          if (idx === -1) {
            parsed.teachers.push(def);
          } else {
            parsed.teachers[idx] = {
              ...parsed.teachers[idx],
              photo: def.photo || parsed.teachers[idx].photo,
              message: def.message || parsed.teachers[idx].message,
              post: def.post || parsed.teachers[idx].post,
              tenure: def.tenure || parsed.teachers[idx].tenure,
              subject: def.subject || parsed.teachers[idx].subject,
              statusLabel: def.statusLabel || parsed.teachers[idx].statusLabel
            };
          }
        });
      }
      if (parsed.teachers) {
        parsed.teachers.sort((a, b) => {
          const getLeadershipRank = (t) => {
            const name = (t.name || '').toLowerCase();
            const p = (t.post || '').toLowerCase();
            const isCur = t.category === 'current' || (t.statusLabel || '').toLowerCase().includes('current');
            // 1. Late Dr. S. P. Singh (Former Principal)
            if (name.includes('s.p. singh') || name.includes('s. p. singh') || (t.isDeceased && p.includes('principal'))) return 1;
            // 2. Late Dr. Preetam Singh (Former PGT Hindi)
            if (name.includes('preetam') || name.includes('pritam') || (t.isDeceased && p.includes('hindi'))) return 2;
            // 3. Current Principal
            if (isCur && p.includes('principal') && !p.includes('vice')) return 3;
            // 4. Current Vice Principal
            if (isCur && p.includes('vice principal')) return 4;
            // 5. Current Faculty Alumni Coordinator
            if (isCur && (p.includes('alumni') || (t.title || '').toLowerCase().includes('alumni') || p.includes('coordinator'))) return 5;
      if (name.includes('rautela') || (!t.isDeceased && p.includes('principal') && !p.includes('vice'))) return 6;
            if (isCur) return 6;
            return 10;
          };
          return getLeadershipRank(a) - getLeadershipRank(b);
        });
      }
      if (!parsed.meetSchedule || !Array.isArray(parsed.meetSchedule) || parsed.meetSchedule.length === 0) {
        parsed.meetSchedule = defaultData.meetSchedule;
      }
      parsed.notableMessages = defaultData.notableMessages;
      if (!parsed.culturalActs || !Array.isArray(parsed.culturalActs)) {
        parsed.culturalActs = defaultData.culturalActs;
      }
      // Ensure only Ashfaque Ahmad is present in directory as sole Super Admin today
      // Preserve modified directory records across reloads while ensuring official registry defaults
      if (parsed.directory && Array.isArray(parsed.directory) && parsed.directory.length > 0) {
        const savedMap = new Map();
        parsed.directory.forEach(d => {
          if (d.email) savedMap.set(d.email.toLowerCase(), d);
          else if (d.name) savedMap.set((d.name + '_' + (d.batch || '')).toLowerCase(), d);
        });
        parsed.directory = defaultDirectoryAlumni.map(def => {
          const saved = (def.email && savedMap.get(def.email.toLowerCase())) || savedMap.get((def.name + '_' + (def.batch || '')).toLowerCase());
          const merged = saved ? { ...def, ...saved } : def;
          if (def.id === 'alumni-111' || def.phone === '9919563333' || (def.email && def.email.toLowerCase() === 'raka.softage@gmail.com')) {
            merged.house = 'Aravali';
            merged.badge = 'Aravali';
            merged.bio = (merged.bio || '').replace(/Nilgiri/gi, 'Aravali');
          }
          if (merged.email === 'ashfaque15tr@gmail.com' || merged.name === 'Ashfaque Ahmad') {
            merged.photo = 'assets/images/ashfaq-ahmed.png';
            merged.avatarImage = 'assets/images/ashfaq-ahmed.png';
          }
          return merged;
        });
        parsed.directory.forEach(d => {
          const exists = defaultDirectoryAlumni.some(def => (def.email && d.email && def.email.toLowerCase() === d.email.toLowerCase()) || (def.name.toLowerCase() === d.name.toLowerCase() && def.batch === d.batch));
          if (!exists && !parsed.directory.some(x => x.id === d.id)) {
            parsed.directory.push(d);
          }
        });
      } else {
        parsed.directory = defaultDirectoryAlumni.slice();
      }
      // Rehydrate persistent community feed posts
      try {
        const pFeed = localStorage.getItem(PERSISTENT_FEED_STORAGE_KEY);
        let list = [];
        if (pFeed) {
          try { list = JSON.parse(pFeed) || []; } catch(e) {}
        }
        if (!Array.isArray(list) || list.length === 0) {
          list = defaultCommunityBroadcasts.slice();
        } else {
          const existingIds = new Set(list.map(p => p.id));
          defaultCommunityBroadcasts.forEach(defPost => {
            if (!existingIds.has(defPost.id)) {
              list.push(defPost);
            }
          });
        }
        // Universal Sanitization & Healing: Ensure content, text, photos and initials are never undefined
        list.forEach(p => {
          if (!p.content && p.text) p.content = p.text;
          if (!p.text && p.content) p.text = p.content;
          if (p.content === 'undefined' || p.text === 'undefined' || !p.content) {
            const def = defaultCommunityBroadcasts.find(d => d.id === p.id);
            if (def) {
              p.content = def.content || def.text;
              p.text = p.content;
              if (def.authorPhoto && !p.authorPhoto) p.authorPhoto = def.authorPhoto;
              if (def.initials && !p.initials) p.initials = def.initials;
            }
          }
          if (p.id === 'feed-official-welcome') {
            p.authorPhoto = 'assets/images/ashfaq-ahmed.png';
            p.initials = 'AA';
            if (!p.content || p.content === 'undefined') {
              p.content = "Welcome to JNVGFamily! The official digital home of JNV Gauriganj Alumni. Connect with batchmates across the globe, mentor young minds, and stay updated on campus reunions and milestones.";
              p.text = p.content;
            }
          } else if (p.id === 'feed-gurujan-lsy') {
            p.authorPhoto = 'assets/images/ls-yadav.jpg';
            p.initials = 'LS';
            p.content = "Navodaya is the confluence of multi-dimensional talents. \nLet's come together and work together to succeed with flying colours by caring and sharing, J N V Stars! ⭐⭐⭐⭐⭐";
            p.text = p.content;
          } else if (p.id === 'feed-gurujan-ay') {
            p.initials = 'AY';
            if (!p.content || p.content === 'undefined') {
              p.content = "कहाँ हो भाई सब? बहुत अच्छे लग रहे हैं आप सब! Love you all! Education is not the filling of a pail, but the lighting of a fire. हॉस्टल में आपका माँ सा ध्यान रखना और अंग्रेजी भाषा व नैतिक मूल्यों को जीवन में उतारना ही मेरा संकल्प रहा। सदा विजयी भव!";
              p.text = p.content;
            }
          } else if (p.id === 'feed-gurujan-rautela') {
            p.initials = 'BR';
            if (!p.content || p.content === 'undefined') {
              p.content = "नवोदय का प्रांगण केवल ज्ञानार्जन का केंद्र नहीं, बल्कि चरित्र, बंधुत्व और राष्ट्र-निर्माण की पावन तपोभूमि है। जेएनवी गौरीगंज के विद्यार्थियों ने हर क्षेत्र में जो कीर्तिमान स्थापित किए हैं, उन पर मुझे गर्व है। हमीं नवोदय हों!";
              p.text = p.content;
            }
          }
        });
        parsed.feedPosts = list;
        try { localStorage.setItem(PERSISTENT_FEED_STORAGE_KEY, JSON.stringify(list)); } catch(fe) {}
      } catch(e) {
        parsed.feedPosts = defaultCommunityBroadcasts.slice();
      }
      if (parsed.teachers && Array.isArray(parsed.teachers)) {
        const lsy = parsed.teachers.find(t => t.id === 'tch-lsy' || (t.name && t.name.includes('L. S. Yadav')));
        if (lsy) {
          lsy.message = "Navodaya is the confluence of multi-dimensional talents. \nLet's come together and work together to succeed with flying colours by caring and sharing, J N V Stars! ⭐⭐⭐⭐⭐";
          if (!lsy.photo) lsy.photo = 'assets/images/ls-yadav.jpg';
          lsy.post = "T.G.T.-English • Editor, Vidyalaya Magazine 'Navonmesh'";
          lsy.title = "T.G.T.-English, Jawahar Navodaya Vidyalaya, Gauriganj • Editor, Vidyalaya Magazine 'Navonmesh'";
          lsy.statusLabel = "Current Faculty (TGT English) • Editor, 'Navonmesh'";
          lsy.specialNote = "Dedicated English educator nurturing communicative excellence and literary expression at JNV Gauriganj since 2021. Chief Editor of Vidyalaya Annual Magazine 'Navonmesh' (नवोन्मेष).";
        }
      }
      if (parsed.directory && Array.isArray(parsed.directory)) {
        const rsy = parsed.directory.find(d => d.name && (d.name.includes('Rama Shankar') || d.name.includes('Rama Sankar')));
        if (rsy) {
          rsy.role = "Governor's Awardee Teacher • Head Teacher";
        }
        const up = parsed.directory.find(d => d.name && d.name.includes('Utkrisht Pandey'));
        if (up) {
          up.batch = 2002;
        }
        const mr = parsed.directory.find(d => d.name && d.name.includes('Manish Rana'));
        if (mr) {
          mr.batch = 2007;
          mr.domain = "Govt / PSU";
          mr.role = "Judicial Magistrate / Civil Judge, U.P. Judiciary";
        }
        const prabhat = parsed.directory.find(d => d.id === 'alumni-527' || (d.name && d.name.includes('Prabhat') && d.role && d.role.includes('PPS')));
        if (!prabhat) {
          parsed.directory.push({
            id: 'alumni-527',
            name: 'Sh. Prabhat (PPS)',
            initials: 'PR',
            batch: 2002,
            house: 'Aravali',
            role: 'Provincial Police Service (PPS) Officer • Dy. SP, U.P. Police',
            location: 'Uttar Pradesh',
            domain: 'Civil Services',
            email: '',
            phone: '',
            badge: 'Aravali',
            tag: 'Notable',
            bio: 'Provincial Police Service (PPS) Officer at U.P. Police • Batch of 2002 (Aravali House).'
          });
        } else {
          prabhat.batch = 2002;
        }
      }
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
    if (typeof localStorage !== 'undefined' && Array.isArray(AppState.feedPosts)) {
      try { localStorage.setItem(PERSISTENT_FEED_STORAGE_KEY, JSON.stringify(AppState.feedPosts)); } catch(fe) {}
    }
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
  if (tabId === 'memories') tabId = 'gallery';
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
      btn.classList.add('active', 'text-white', 'shadow');
      btn.classList.remove('text-slate-300');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active', 'bg-brand-700', 'text-white', 'shadow');
      btn.classList.add('text-slate-300');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Mobile bottom navigation tabs highlight
  document.querySelectorAll('.mobile-nav-tab, [data-mobile-tab]').forEach(btn => {
    const bTab = btn.getAttribute('data-tab') || btn.getAttribute('data-mobile-tab');
    if (bTab === tabId) {
      btn.classList.add('text-amber-400', 'font-bold');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('text-amber-400', 'font-bold');
      btn.classList.add('text-slate-400');
    }
  });

  if (tabId === 'feed') {
    renderFeed();
  } else if (tabId === 'teachers') {
    renderTeachers();
  } else if (tabId === 'notable') {
    renderNotableMessages();
    renderNotableAlumni(currentNotableFilter);
  } else if (tabId === 'admin') {
    renderAdminQueue();
    renderAdminHelpDeskQueue();
    renderAdminSuggestionsList();
    renderRoleGovernanceList();
  }

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

  if (user && (user.status === 'pending' || user.role === 'unverified' || user.role === 'unverified_teacher')) {
    user.status = 'approved';
    user.role = (user.isTeacher || user.profession === 'Faculty') ? 'teacher' : 'member';
    user.roleTitle = (user.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
    if (typeof setCurrentUser === 'function') setCurrentUser(user, true);
  }
  const isPending = user && (user.status === 'pending' || user.role === 'unverified' || user.role === 'unverified_teacher');
  const pendingBanner = document.getElementById('pendingVerificationAlertBanner');
  if (pendingBanner) {
    pendingBanner.classList.add('hidden');
  }

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
  if (isPending) cleanRoleTitle = 'Pending Verification';
  else if (user.role === 'admin') cleanRoleTitle = 'Super Admin';
  else if (user.role === 'host' || user.role === 'batch_admin') cleanRoleTitle = 'Host';
  else if (user.role === 'moderator') cleanRoleTitle = 'Moderator';
  else if (user.role === 'teacher') cleanRoleTitle = 'Revered Gurujan';

  if (roleEl) {
    if (isPending) {
      roleEl.textContent = `Pending Verification • Batch ${user.batch || 'Alumni'}`;
    } else if (user.role === 'teacher') {
      roleEl.textContent = `${user.designation || user.roleTitle || 'Revered Faculty'}`;
    } else {
      roleEl.textContent = `${cleanRoleTitle} • Batch ${user.batch || 'Alumni'}`;
    }
  }

  const isCurAdmin = user.role === 'admin';
  const isCurHost = user.role === 'host' || user.role === 'batch_admin';
  const isCurMod = user.role === 'moderator';
  const isCurTeacher = user.role === 'teacher';

  if (isPending) {
    if (roleBadge) {
      roleBadge.textContent = "Pending Verification";
      roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40";
    }
    if (rbacMessage) {
      rbacMessage.textContent = `Welcome, ${user.name}! Your alumni membership is pending review by the Alumni Verification Committee (Super Admin Ashfaque Ahmad & Batch Admins). Read-only mode active.`;
    }
    if (adminTabNav) adminTabNav.classList.add('hidden');
    if (AppState.activeTab === 'admin') switchTab('home');
  } else if (isCurAdmin) {
    if (roleBadge) { roleBadge.textContent = "Alumnus"; roleBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30"; }
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
function showPendingVerificationModal(actionDesc = 'creating or publishing content') {
  // Open access enabled for all alumni - do not block
  return;
}

function closePendingVerificationModal() {
  const alertModal = document.getElementById('pendingVerificationModal');
  if (alertModal) {
    alertModal.classList.add('hidden');
    alertModal.style.display = 'none';
  }
}
window.showPendingVerificationModal = showPendingVerificationModal;
window.closePendingVerificationModal = closePendingVerificationModal;

function openModal(id) {
  if (id === 'storyModal') {
    const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
    if (!curUser) {
      showToast('🔒 Please sign in to share a memory.');
      window.location.href = 'login.html';
      return;
    }
    if (curUser) { curUser.status = 'approved'; }
  }
  if (id === 'registerModal') {
    if (typeof initModalMatchListeners === 'function') initModalMatchListeners();
  }
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    if (modal.style) {
      modal.style.display = 'flex';
      modal.style.pointerEvents = 'auto';
    }
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    if (modal.style) {
      modal.style.display = 'none';
    }
  }
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
function compressFeedImage(file, callback) {
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
      const MAX_SIZE = 800;
      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.72);
      if (callback) callback(compressed);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewStoryImage(event) {
  const file = event.target.files[0];
  if (file) {
    compressFeedImage(file, function(compressedDataUrl) {
      attachedStoryPhoto = compressedDataUrl;
      const preview = document.getElementById('storyImagePreview');
      const container = document.getElementById('storyImagePreviewContainer');
      if (preview && container) { preview.src = compressedDataUrl; container.classList.remove('hidden'); }
    });
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
  const categoryTagMap = {
    'memory': '🏛️ Old Memories (पुरानी यादें)',
    'gratitude': '🙏 Gratitude & Thanking (आभार)',
    'future': '💡 Future Thoughts & Vision (भविष्य के विचार)',
    'general': '📢 Open Broadcast (खुला विचार)',
    'assembly': '🌅 Morning Assembly (सुबह की प्रार्थना)',
    'hostel': '🍛 Hostel & Mess Life (छात्रावास)',
    'migration': '🚂 Migration Days (प्रवास संस्मरण)',
    'sports': '🏆 Sports & Cultural (खेल एवं कला)',
    'achievement': '⭐ Alumni Achievement (उपलब्धि)'
  };
  const postTag = isTeacher ? '🪔 गुरु शुभाशीष / Faculty Blessing' : (categoryTagMap[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1)));

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
    text: text,
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

  if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastFeedPost === 'function') {
    window.AlumniCloudSync.broadcastFeedPost(newPost);
  }

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
      ? "feed-card bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-5 hover:border-amber-400/60 transition space-y-3 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
      : "feed-card bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-3";
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

    let authorPhoto = post.authorPhoto;
    if (!authorPhoto) {
      if ((post.author || '').toLowerCase().includes('ashfaq')) authorPhoto = 'assets/images/ashfaq-ahmed.png';
      else if ((post.author || '').toLowerCase().includes('l. s. yadav') || (post.author || '').toLowerCase().includes('ls yadav')) authorPhoto = 'assets/images/ls-yadav.jpg';
    }

    let postText = post.content || post.text || post.message || '';
    if (postText === 'undefined') postText = '';
    if (!postText && post.id) {
      const fb = defaultCommunityBroadcasts.find(d => d.id === post.id);
      if (fb) postText = fb.content || fb.text || '';
    }

    article.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          ${authorPhoto 
            ? `<img src="${authorPhoto}" alt="${post.author}" class="w-10 h-10 rounded-full object-cover border ${isTeacherPost ? 'border-amber-400' : 'border-amber-500/40'} shadow-sm flex-shrink-0">` 
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
      <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-hindi">"${postText}"</p>
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
let modalMatchedDirectoryRecord = null;
let modalMatchedTeacherRecord = null;
let currentModalRegisterType = 'alumni';
let modalMatchDebounceTimer = null;

function selectModalRegisterType(type) {
  currentModalRegisterType = type;
  const alumniBtn = document.getElementById('modalRegTypeAlumniBtn');
  const teacherBtn = document.getElementById('modalRegTypeTeacherBtn');
  const nameLabel = document.getElementById('modalRegNameLabel');
  const nameInput = document.getElementById('regName');
  const batchLabel = document.getElementById('modalRegBatchLabel');
  const batchInput = document.getElementById('regBatch');
  const roleLabel = document.getElementById('modalRegRoleLabel');
  const roleInput = document.getElementById('regRole');
  const domainLabel = document.getElementById('modalRegDomainLabel');
  const guruMsgGroup = document.getElementById('modalRegGuruMessageGroup');
  const submitBtnText = document.getElementById('modalRegSubmitBtnText');
  const claimedDirInput = document.getElementById('claimedDirectoryId');
  const claimedTchInput = document.getElementById('claimedTeacherId');

  if (type === 'teacher') {
    if (alumniBtn) alumniBtn.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5";
    if (teacherBtn) teacherBtn.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 text-brand-950 shadow transition flex items-center justify-center gap-1.5";
    if (nameLabel) nameLabel.innerHTML = 'Faculty / Gurujan Full Name <span class="text-amber-400">*</span>';
    if (nameInput) nameInput.placeholder = 'e.g. Dr. S. K. Chaudhary / Sh. L. S. Yadav';
    if (batchLabel) batchLabel.innerHTML = 'Tenure / Service Joining Year <span class="text-amber-400">*</span>';
    if (batchInput) batchInput.placeholder = 'e.g. 1994 or 2021';
    if (roleLabel) roleLabel.innerHTML = 'Subject / Designation / Department <span class="text-amber-400">*</span>';
    if (roleInput) roleInput.placeholder = 'e.g. PGT Chemistry / TGT English';
    if (domainLabel) domainLabel.innerHTML = 'Primary Academic Domain / Department';
    if (guruMsgGroup) guruMsgGroup.classList.remove('hidden');
    if (submitBtnText) submitBtnText.textContent = 'Submit Gurujan Registration';
    if (claimedDirInput) claimedDirInput.value = '';
  } else {
    if (alumniBtn) alumniBtn.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-brand-600 text-white shadow transition flex items-center justify-center gap-1.5";
    if (teacherBtn) teacherBtn.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5";
    if (nameLabel) nameLabel.innerHTML = 'Full Name <span class="text-rose-400">*</span>';
    if (nameInput) nameInput.placeholder = 'e.g. Prabhat Kumar';
    if (batchLabel) batchLabel.innerHTML = 'Passout Batch Year <span class="text-rose-400">*</span>';
    if (batchInput) batchInput.placeholder = 'e.g. 2005 (1990 - 2030)';
    if (roleLabel) roleLabel.innerHTML = 'Current Designation / Profession <span class="text-rose-400">*</span>';
    if (roleInput) roleInput.placeholder = 'e.g. Software Engineer, Doctor, IAS';
    if (domainLabel) domainLabel.innerHTML = 'Professional Domain / Stream';
    if (guruMsgGroup) guruMsgGroup.classList.add('hidden');
    if (submitBtnText) submitBtnText.textContent = 'Submit Alumni Registration';
    if (claimedTchInput) claimedTchInput.value = '';
  }

  checkModalRegistrationMatch();
}

function checkModalRegistrationMatch() {
  clearTimeout(modalMatchDebounceTimer);
  modalMatchDebounceTimer = setTimeout(() => {
    const phone = (document.getElementById('regPhone')?.value || '').trim();
    const email = (document.getElementById('regEmail')?.value || '').trim();
    const name = (document.getElementById('regName')?.value || '').trim();
    const batch = (document.getElementById('regBatch')?.value || '').trim();
    const house = (document.getElementById('regHouse')?.value || '').trim();
    const role = (document.getElementById('regRole')?.value || '').trim();

    if (currentModalRegisterType === 'teacher') {
      if (typeof findTeacherMatch !== 'function') return;
      if (phone.replace(/\D/g, '').length < 10 && !email.includes('@') && name.length < 3) {
        hideModalMatchNotice();
        return;
      }
      const res = findTeacherMatch({ phone, email, name, subject: role, tenure: batch, house });
      if (res.matched && res.record) {
        modalMatchedTeacherRecord = res.record;
        modalMatchedDirectoryRecord = null;
        showModalTeacherMatchNotice(res);
      } else {
        modalMatchedTeacherRecord = null;
        hideModalMatchNotice();
      }
      return;
    }

    if (typeof findDirectoryMatch !== 'function') return;

    if (phone.replace(/\D/g, '').length < 10 && !email.includes('@') && name.length < 3) {
      hideModalMatchNotice();
      return;
    }

    const res = findDirectoryMatch({ phone, email, name, batch, house });
    if (res.matched && res.record) {
      modalMatchedDirectoryRecord = res.record;
      modalMatchedTeacherRecord = null;
      showModalMatchNotice(res);
    } else {
      modalMatchedDirectoryRecord = null;
      hideModalMatchNotice();
    }
  }, 220);
}

function showModalMatchNotice(res) {
  const noticeBox = document.getElementById('modalRegMatchNotice');
  const claimedBox = document.getElementById('modalRegClaimedNotice');
  const claimedEmailEl = document.getElementById('modalClaimedUserEmail');
  const titleEl = document.getElementById('modalRegMatchTitle');
  const badgeEl = document.getElementById('modalRegMatchBadge');
  const descEl = document.getElementById('modalRegMatchDesc');
  const hiddenIdEl = document.getElementById('claimedDirectoryId');
  const hiddenTchIdEl = document.getElementById('claimedTeacherId');
  const submitBtn = document.querySelector('#registerModal button[type="submit"]');

  if (hiddenTchIdEl) hiddenTchIdEl.value = '';

  if (res.isAlreadyClaimed) {
    if (noticeBox) noticeBox.classList.add('hidden');
    if (claimedBox) claimedBox.classList.remove('hidden');
    if (claimedEmailEl) claimedEmailEl.textContent = (res.claimedUser && res.claimedUser.email) ? res.claimedUser.email : 'Registered Member';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  if (claimedBox) claimedBox.classList.add('hidden');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  if (hiddenIdEl && res.record) {
    hiddenIdEl.value = res.record.id || '';
  }

  if (noticeBox && res.record) {
    if (titleEl) titleEl.textContent = `Verified Alumni Record Found: ${res.record.name}`;
    if (badgeEl) badgeEl.textContent = `${res.confidence || 95}% Match (${(res.matchType || '').replace('_', ' ').toUpperCase()})`;
    if (descEl) {
      const houseStr = res.record.house ? `${res.record.house} House` : '';
      const batchStr = res.record.batch ? `Batch ${res.record.batch}` : 'Alumnus';
      const roleStr = res.record.role ? ` • ${res.record.role}` : '';
      descEl.textContent = `We found your official entry in the JNV Gauriganj Directory (${batchStr}, ${houseStr}${roleStr}). We have pre-filled your verified details below. Please review, update any missing or outdated information, and upload your profile photo!`;
    }
    noticeBox.classList.remove('hidden');
  }

  autoPreFillModalFields(res.record);
}

function showModalTeacherMatchNotice(res) {
  const noticeBox = document.getElementById('modalRegMatchNotice');
  const claimedBox = document.getElementById('modalRegClaimedNotice');
  const claimedEmailEl = document.getElementById('modalClaimedUserEmail');
  const titleEl = document.getElementById('modalRegMatchTitle');
  const badgeEl = document.getElementById('modalRegMatchBadge');
  const descEl = document.getElementById('modalRegMatchDesc');
  const hiddenIdEl = document.getElementById('claimedDirectoryId');
  const hiddenTchIdEl = document.getElementById('claimedTeacherId');
  const submitBtn = document.querySelector('#registerModal button[type="submit"]');

  if (hiddenIdEl) hiddenIdEl.value = '';

  if (res.isDeceased) {
    if (claimedBox) claimedBox.classList.add('hidden');
    if (noticeBox) {
      if (titleEl) titleEl.textContent = `Amar Smriti Memorial Record: ${res.record.name}`;
      if (badgeEl) badgeEl.textContent = `Amar Smriti (अमर स्मृति)`;
      if (descEl) {
        descEl.textContent = `This profile is dedicated to the sacred memory of ${res.record.name} (${res.record.post || 'Revered Faculty'}). It is permanently preserved in institutional tribute and cannot be claimed as an individual login account. If you are a faculty member, please enter your own details.`;
      }
      noticeBox.classList.remove('hidden');
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  if (res.isAlreadyClaimed) {
    if (noticeBox) noticeBox.classList.add('hidden');
    if (claimedBox) claimedBox.classList.remove('hidden');
    if (claimedEmailEl) claimedEmailEl.textContent = (res.claimedUser && res.claimedUser.email) ? res.claimedUser.email : 'Registered Gurujan';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  if (claimedBox) claimedBox.classList.add('hidden');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  if (hiddenTchIdEl && res.record) {
    hiddenTchIdEl.value = res.record.id || '';
  }

  if (noticeBox && res.record) {
    if (titleEl) titleEl.textContent = `Verified Gurujan / Faculty Record Found: ${res.record.name}`;
    if (badgeEl) badgeEl.textContent = `${res.confidence || 95}% Match (${(res.matchType || '').replace('_', ' ').toUpperCase()})`;
    if (descEl) {
      const postStr = res.record.post || res.record.subject || 'Faculty Member';
      const tenureStr = res.record.tenure ? ` (${res.record.tenure})` : '';
      descEl.textContent = `Respected Gurujan, we found your esteemed profile in the Gurujan Roster (${postStr}${tenureStr}). We have pre-filled your details below. Please review, update any missing details or contact info, add your blessings message, and upload your profile photo!`;
    }
    noticeBox.classList.remove('hidden');
  }

  autoPreFillModalTeacherFields(res.record);
}

function autoPreFillModalFields(rec) {
  if (!rec) return;
  const nameEl = document.getElementById('regName');
  const batchEl = document.getElementById('regBatch');
  const houseEl = document.getElementById('regHouse');
  const roleEl = document.getElementById('regRole');
  const cityEl = document.getElementById('regCity');
  const phoneEl = document.getElementById('regPhone');
  const emailEl = document.getElementById('regEmail');

  if (nameEl && (!nameEl.value || nameEl.value.trim().length < 3)) nameEl.value = rec.name || '';
  if (batchEl && (!batchEl.value || batchEl.value.trim() === '')) {
    const bNum = parseInt(rec.batch, 10);
    if (bNum && !isNaN(bNum)) batchEl.value = bNum;
  }
  if (houseEl && rec.house) {
    const isUserModified = houseEl.dataset.userModified === 'true' || houseEl.getAttribute('data-user-modified') === 'true';
    if (!isUserModified) {
      const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
      for (let i = 0; i < houseEl.options.length; i++) {
        const optVal = houseEl.options[i].value.toLowerCase();
        if (optVal === nh || optVal.includes(nh) || nh.includes(optVal)) {
          houseEl.selectedIndex = i;
          break;
        }
      }
    }
  }
  if (roleEl && (!roleEl.value || roleEl.value.trim() === '') && rec.role) roleEl.value = rec.role;
  if (cityEl && (!cityEl.value || cityEl.value.trim() === '') && rec.location) cityEl.value = rec.location;
  if (phoneEl && (!phoneEl.value || phoneEl.value.trim() === '') && rec.phone) phoneEl.value = rec.phone;
  if (emailEl && (!emailEl.value || emailEl.value.trim() === '') && rec.email) emailEl.value = rec.email;

  if (rec.photo && !modalUploadedPhoto) {
    modalUploadedPhoto = rec.photo;
    const previewImg = document.getElementById('modalRegPhotoPreview');
    const placeholder = document.getElementById('modalRegPhotoPlaceholder');
    const removeBtn = document.getElementById('modalRegPhotoRemoveBtn');
    if (previewImg) { previewImg.src = rec.photo; previewImg.classList.remove('hidden'); }
    if (placeholder) placeholder.classList.add('hidden');
    if (removeBtn) removeBtn.classList.remove('hidden');
  }
}

function autoPreFillModalTeacherFields(rec) {
  if (!rec) return;
  const nameEl = document.getElementById('regName');
  const batchEl = document.getElementById('regBatch');
  const houseEl = document.getElementById('regHouse');
  const roleEl = document.getElementById('regRole');
  const domainEl = document.getElementById('regDomain');
  const cityEl = document.getElementById('regCity');
  const phoneEl = document.getElementById('regPhone');
  const emailEl = document.getElementById('regEmail');
  const guruMsgEl = document.getElementById('regGuruMessage');

  if (nameEl && (!nameEl.value || nameEl.value.trim().length < 3)) nameEl.value = rec.name || '';
  if (batchEl && (!batchEl.value || batchEl.value.trim() === '')) {
    const tenureYear = (rec.tenure || '').match(/\b(19\d\d|20\d\d)\b/);
    if (tenureYear) batchEl.value = tenureYear[1];
    else if (rec.tenure) batchEl.value = rec.tenure;
  }
  if (roleEl && (!roleEl.value || roleEl.value.trim() === '')) {
    roleEl.value = rec.post || rec.subject || 'Faculty Member';
  }
  if (domainEl && rec.subject) {
    for (let i = 0; i < domainEl.options.length; i++) {
      if (domainEl.options[i].value.toLowerCase().includes('education') || domainEl.options[i].value.toLowerCase().includes('academic')) {
        domainEl.selectedIndex = i;
        break;
      }
    }
  }
  if (houseEl && rec.house) {
    const isUserModified = houseEl.dataset.userModified === 'true' || houseEl.getAttribute('data-user-modified') === 'true';
    if (!isUserModified) {
      const nh = (typeof normalizeHouse === 'function') ? normalizeHouse(rec.house) : rec.house.toLowerCase();
      for (let i = 0; i < houseEl.options.length; i++) {
        const optVal = houseEl.options[i].value.toLowerCase();
        if (optVal === nh || optVal.includes(nh) || nh.includes(optVal)) {
          houseEl.selectedIndex = i;
          break;
        }
      }
    }
  }
  if (cityEl && (!cityEl.value || cityEl.value.trim() === '') && rec.location) cityEl.value = rec.location;
  if (phoneEl && (!phoneEl.value || phoneEl.value.trim() === '') && rec.phone) phoneEl.value = rec.phone;
  if (emailEl && (!emailEl.value || emailEl.value.trim() === '') && rec.email) emailEl.value = rec.email;
  if (guruMsgEl && (!guruMsgEl.value || guruMsgEl.value.trim() === '') && (rec.message || rec.blessingMessage)) {
    guruMsgEl.value = rec.message || rec.blessingMessage;
  }

  if (rec.photo && !modalUploadedPhoto) {
    modalUploadedPhoto = rec.photo;
    const previewImg = document.getElementById('modalRegPhotoPreview');
    const placeholder = document.getElementById('modalRegPhotoPlaceholder');
    const removeBtn = document.getElementById('modalRegPhotoRemoveBtn');
    if (previewImg) { previewImg.src = rec.photo; previewImg.classList.remove('hidden'); }
    if (placeholder) placeholder.classList.add('hidden');
    if (removeBtn) removeBtn.classList.remove('hidden');
  }
}

function hideModalMatchNotice() {
  const noticeBox = document.getElementById('modalRegMatchNotice');
  const claimedBox = document.getElementById('modalRegClaimedNotice');
  const hiddenIdEl = document.getElementById('claimedDirectoryId');
  const hiddenTchIdEl = document.getElementById('claimedTeacherId');
  const submitBtn = document.querySelector('#registerModal button[type="submit"]');

  if (noticeBox) noticeBox.classList.add('hidden');
  if (claimedBox) claimedBox.classList.add('hidden');
  if (hiddenIdEl) hiddenIdEl.value = '';
  if (hiddenTchIdEl) hiddenTchIdEl.value = '';
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

function applyModalMatchedDirectoryData() {
  if (currentModalRegisterType === 'teacher' && modalMatchedTeacherRecord) {
    autoPreFillModalTeacherFields(modalMatchedTeacherRecord);
    showToast(`✓ Pre-filled details from verified Gurujan record (${modalMatchedTeacherRecord.name}). Please review and add photo/blessings.`);
  } else if (modalMatchedDirectoryRecord) {
    autoPreFillModalFields(modalMatchedDirectoryRecord);
    showToast(`✓ Pre-filled details from verified directory record (${modalMatchedDirectoryRecord.name}). Please review and add photo.`);
  }
}

function dismissModalMatchNotice() {
  const noticeBox = document.getElementById('modalRegMatchNotice');
  if (noticeBox) noticeBox.classList.add('hidden');
}

let modalMatchListenersAttached = false;
function initModalMatchListeners() {
  if (modalMatchListenersAttached) return;
  modalMatchListenersAttached = true;
  ['regPhone', 'regEmail', 'regName', 'regBatch', 'regRole'].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener('input', checkModalRegistrationMatch);
      el.addEventListener('change', checkModalRegistrationMatch);
    }
  });
}

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

function openIndexEmailOtp() {
  const email = pendingIndexReg ? pendingIndexReg.email : '';
  const code = pendingIndexReg ? pendingIndexReg.otp : (window._lastSmsOtpDispatch ? window._lastSmsOtpDispatch.otp : '');
  if (email && code) {
    const subject = encodeURIComponent('JNVGFamily 2FA Security Code: ' + code);
    const body = encodeURIComponent('Dear Navodayan,\n\nYour 6-digit Two-Factor Verification Code (2FA) for JNVGFamily (JNV Gauriganj Alumni Platform) is:\n\n' + code + '\n\nValid for 10 minutes. Please enter this code on the verification screen to complete your registration.\n\nWarm regards,\nJNV Gauriganj Alumni Association');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  } else {
    openIndexWhatsAppOtp();
  }
}

function openIndexDeviceSmsOtp() {
  openIndexEmailOtp();
}

function handleRegistrationSubmit(e) {
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

  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
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
  showToast(`🎉 Welcome ${name}! Your registration is complete and your profile is active.`);
  if (typeof renderDirectory === 'function') renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();
  if (typeof renderTeachers === 'function') renderTeachers('all');
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

  const { name, batch, house, phone, email, role, domain, city, password, photo, isTeacher, claimedDirectoryId, claimedTeacherId, guruMessage } = pendingIndexReg;

  let regResult = null;
  if (typeof registerAlumni === 'function') {
    regResult = registerAlumni({
      name,
      batch,
      house,
      phone,
      email,
      profession: role,
      domain,
      city,
      password,
      photo,
      isTeacher: !!isTeacher,
      claimedDirectoryId: claimedDirectoryId || undefined,
      claimedTeacherId: claimedTeacherId || undefined,
      message: guruMessage || undefined
    });
  }

  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  const newReg = {
    id: (regResult && regResult.user && regResult.user.id) || `reg-${Date.now()}`,
    name,
    batch,
    house,
    phone: `+91 ${cleanPhone}`,
    email,
    role: isTeacher ? 'teacher' : role,
    domain: domain || (isTeacher ? 'Education & Academia' : 'General'),
    city,
    photo,
    isTeacher: !!isTeacher,
    claimedDirectoryId: claimedDirectoryId || null,
    claimedTeacherId: claimedTeacherId || null,
    guruMessage: guruMessage || null,
    isClaimedProfile: !!(claimedDirectoryId || claimedTeacherId),
    enrichmentNote: claimedTeacherId 
      ? `Claimed & enriched verified Gurujan entry #${claimedTeacherId}`
      : (claimedDirectoryId ? `Claimed & enriched verified Directory entry #${claimedDirectoryId}` : (isTeacher ? 'New Gurujan / Faculty Registration' : null)),
    date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (2FA Verified)",
    status: "pending"
  };

  if (!AppState.pendingRegistrations) AppState.pendingRegistrations = [];
  const existsInQueue = AppState.pendingRegistrations.some(r => (r.email || '').toLowerCase() === email.toLowerCase());
  if (!existsInQueue) {
    AppState.pendingRegistrations.unshift(newReg);
  }
  saveAppData();
  renderAdminRegistrations();
  updateQueueBadges();

  closeModal('indexOtpModal');
  pendingIndexReg = null;

  // Set active session in read-only pending mode
  const registeredUser = (typeof findUserByIdentifier === 'function') ? findUserByIdentifier(email) : null;
  if (registeredUser) {
    setCurrentUser(registeredUser, true);
    applyUserSession(registeredUser);
  }

  const roleDesc = isTeacher ? 'Gurujan / Faculty' : 'Alumni';
  showToast(`🎉 2FA Verified! ${roleDesc} membership application for ${name} submitted. Forwarded to Super Admin Ashfaque Ahmad for verification.`);

  // WhatsApp Alert Link to Super Admin Ashfaque Ahmad (+91 9972868674)
  const waMsg = isTeacher
    ? `Pranam Ashfaque, I have registered on JNVGFamily as Gurujan / Faculty *${name}* (${role || 'Faculty'}, Phone: +91 ${cleanPhone}, Email: ${email}). Please verify and approve my faculty registration.`
    : `Namaste Ashfaque Bhaiya, I have registered on JNVGFamily as *${name}* (Batch ${batch}, ${house} House, Phone: +91 ${cleanPhone}, Email: ${email}). Please verify and approve my alumni membership request.`;
  const waUrl = '';
  // Manual expedited approval link only - NO auto popups
}

function renderAdminRegistrations() {
  const container = document.getElementById('adminRegistrationsList');
  if (!container) return;

  if (!AppState.pendingRegistrations || AppState.pendingRegistrations.length === 0) {
    container.innerHTML = `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-xs">✓ No pending registrations. All alumni membership requests have been reviewed.</div>`;
    return;
  }

  container.innerHTML = '';
  AppState.pendingRegistrations.forEach((reg, idx) => {
    if (!reg.id) {
      reg.id = 'reg-' + (reg.email ? reg.email.replace(/[^a-z0-9]/gi, '_') : Date.now() + '-' + idx);
    }
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    card.id = reg.id;
    const cleanPhone = (reg.phone || '').replace(/\D/g, '').slice(-10);
    const isTeacher = reg.isTeacher || !!reg.claimedTeacherId || reg.role === 'teacher' || reg.role === 'unverified_teacher';
    const waChatApplicantUrl = '#';
    const roleBadgeHtml = isTeacher
      ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🪔 Gurujan / Faculty</span>`
      : `<span class="text-xs text-amber-400 font-mono">Batch ${reg.batch || 'Alumni'}</span>`;
    const approveBtnText = isTeacher ? 'Approve & Activate in Gurujan Roster' : 'Approve & Activate in Directory';
    const enrichmentBadge = reg.isClaimedProfile
      ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-900/40 text-purple-300 border border-purple-500/30">✨ Verified Claim</span>`
      : '';

    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">⏳ Awaiting Verification</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">✓ 2FA Verified</span>
          ${roleBadgeHtml}
          ${enrichmentBadge}
          <span class="text-sm font-bold text-white">${reg.name}</span>
          <span class="text-[10px] text-slate-400">• ${reg.house || 'Campus'} House</span>
        </div>
        <p class="text-xs text-slate-300"><strong>${isTeacher ? 'Subject / Post:' : 'Profession:'}</strong> ${reg.role || (isTeacher ? 'Faculty' : 'Alumnus')} (${reg.domain || 'General'}) • <strong>Location:</strong> ${reg.city || 'India'}</p>
        ${reg.guruMessage ? `<p class="text-[11px] text-amber-300/90 italic"><strong>Blessing Message:</strong> "${reg.guruMessage}"</p>` : ''}
        <p class="text-[11px] text-slate-400"><strong>Contact:</strong> ${reg.phone} | ${reg.email} • <em>${reg.date || 'Recently'}</em></p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <!-- WhatsApp trigger removed for applicant -->
        <button onclick="approveRegistration('${reg.id}')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          ${approveBtnText}
        </button>
        <button onclick="rejectRegistration('${reg.id}')" class="px-3.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-bold text-xs flex items-center gap-1 transition">Decline</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function approveRegistration(regId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canModerate = curUser && ['admin', 'host', 'batch_admin', 'moderator'].includes(curUser.role);
  if (!canModerate) {
    showToast('🔒 Clearance required: Only Super Admin, Hosts, and Moderators can approve alumni registrations.');
    return;
  }

  if (!AppState.pendingRegistrations || !Array.isArray(AppState.pendingRegistrations)) {
    AppState.pendingRegistrations = [];
    return;
  }

  const index = AppState.pendingRegistrations.findIndex(r => 
    (r.id && String(r.id) === String(regId)) ||
    (r.email && regId && r.email.toLowerCase() === String(regId).toLowerCase()) ||
    (r.name && regId && r.name.toLowerCase() === String(regId).toLowerCase()) ||
    (r.id === regId)
  );

  if (index === -1) {
    console.warn("Registration not found for id:", regId);
    showToast("⚠️ Registration request not found or already approved.");
    renderAdminRegistrations();
    return;
  }

  const reg = AppState.pendingRegistrations[index];
  const isFaculty = reg.isTeacher || !!reg.claimedTeacherId || reg.role === 'teacher' || reg.role === 'unverified_teacher';

  if (isFaculty) {
    if (!AppState.teachers) AppState.teachers = [];
    const cleanTchName = (reg.name || '').toLowerCase().replace(/^(dr\.|prof\.|sh\.|smt\.|mr\.|mrs\.|late\s+(dr\.|sh\.)?)\s+/i, '').replace(/ sir$/i, '').trim();
    let tchIdx = -1;
    if (reg.claimedTeacherId) {
      tchIdx = AppState.teachers.findIndex(t => String(t.id) === String(reg.claimedTeacherId));
    }
    if (tchIdx === -1) {
      tchIdx = AppState.teachers.findIndex(t => {
        const ct = (t.name || '').toLowerCase().replace(/^(dr\.|prof\.|sh\.|smt\.|mr\.|mrs\.|late\s+(dr\.|sh\.)?)\s+/i, '').replace(/ sir$/i, '').trim();
        return ct === cleanTchName;
      });
    }

    if (tchIdx !== -1) {
      const existing = AppState.teachers[tchIdx];
      existing.name = reg.name || existing.name;
      if (reg.role) existing.post = reg.role;
      if (reg.domain) existing.subject = reg.domain;
      if (reg.batch) {
        existing.tenure = String(reg.batch).includes('–') || String(reg.batch).includes('-') ? String(reg.batch) : `${reg.batch} – Present`;
      }
      if (reg.house) existing.house = reg.house;
      if (reg.city) existing.location = reg.city;
      if (reg.phone) existing.phone = reg.phone;
      if (reg.email) existing.email = reg.email;
      if (reg.photo) existing.photo = reg.photo;
      if (reg.guruMessage) existing.message = reg.guruMessage;
      existing.claimed = true;
      existing.claimedBy = reg.email;
      existing.verified = true;
    } else {
      const cleanInitials = (reg.name || '').replace(/^(dr\.|prof\.|sh\.|smt\.|mr\.|mrs\.|late\s+(dr\.|sh\.)?)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase() || "TCH";
      const newTeacherEntry = {
        id: reg.claimedTeacherId || `tch-${Date.now()}`,
        name: reg.name,
        title: `${reg.role || 'Faculty Member'}, Jawahar Navodaya Vidyalaya, Gauriganj`,
        category: "current",
        statusLabel: "Current Faculty",
        post: reg.role || "Faculty Member",
        subject: reg.domain || "Academic Mentorship",
        tenure: reg.batch ? (String(reg.batch).includes('–') || String(reg.batch).includes('-') ? String(reg.batch) : `${reg.batch} – Present`) : "Present",
        house: reg.house || "Campus",
        houseDetail: `${reg.house || 'Campus'} Faculty & Mentorship`,
        location: reg.city || "JNV Gauriganj Campus",
        initials: cleanInitials,
        photo: reg.photo || null,
        message: reg.guruMessage || "पूर्व छात्र सम्मेलन में समस्त विद्यार्थियों का हार्दिक अभिनंदन।",
        specialNote: "Dedicated faculty member registered on JNVGFamily alumni network.",
        claimed: true,
        claimedBy: reg.email,
        verified: true
      };
      AppState.teachers.unshift(newTeacherEntry);
    }
  } else {
    const initials = reg.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newDirectoryEntry = {
      id: reg.claimedDirectoryId || Date.now(),
      name: reg.name,
      initials: initials || "NV",
      batch: reg.batch,
      house: reg.house,
      role: reg.role,
      location: reg.city,
      domain: reg.domain,
      photo: reg.photo || null,
      badge: `${reg.house}`,
      verified: true,
      tag: `Batch of ${reg.batch}`
    };

    if (!AppState.directory) AppState.directory = [];
    if (reg.claimedDirectoryId) {
      const existingIdx = AppState.directory.findIndex(d => String(d.id) === String(reg.claimedDirectoryId));
      if (existingIdx !== -1) {
        AppState.directory[existingIdx].name = reg.name;
        AppState.directory[existingIdx].batch = reg.batch;
        AppState.directory[existingIdx].house = reg.house;
        AppState.directory[existingIdx].role = reg.role;
        AppState.directory[existingIdx].location = reg.city;
        AppState.directory[existingIdx].domain = reg.domain;
        if (reg.photo) AppState.directory[existingIdx].photo = reg.photo;
        AppState.directory[existingIdx].verified = true;
        AppState.directory[existingIdx].claimed = true;
      } else {
        AppState.directory.unshift(newDirectoryEntry);
      }
    } else {
      const existsInDir = AppState.directory.some(d => (d.name || '').toLowerCase() === (reg.name || '').toLowerCase());
      if (!existsInDir) {
        AppState.directory.unshift(newDirectoryEntry);
      }
    }
  }

  AppState.pendingRegistrations.splice(index, 1);
  saveAppData();

  // Broadcast real-time approval to CloudSync network
  try {
    if (typeof AlumniCloudSync !== 'undefined' && AlumniCloudSync.broadcastApproval) {
      AlumniCloudSync.broadcastApproval(reg);
    }
  } catch (err) {
    console.warn("[CloudSync] Approval broadcast error:", err);
  }

  try {
    if (typeof getAllUsers === 'function' && typeof saveAllUsers === 'function') {
      const users = getAllUsers();
      const u = users.find(x => x.id === reg.id || (x.email && x.email.toLowerCase() === (reg.email || '').toLowerCase()));
      if (u) {
        u.status = "approved";
        u.role = isFaculty ? 'teacher' : 'member';
        u.roleTitle = (u.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
        saveAllUsers(users);
      }
      const cur = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
      if (cur && (cur.id === reg.id || (cur.email && cur.email.toLowerCase() === (reg.email || '').toLowerCase()))) {
        cur.status = "approved";
        cur.role = isFaculty ? 'teacher' : (u ? u.role : 'member');
        cur.roleTitle = (cur.role === 'teacher') ? 'Revered Faculty Member' : 'Verified Alumnus';
        setCurrentUser(cur, true);
        applyUserSession(cur);
      }
    }
  } catch(e) { console.warn("User status sync warning:", e); }

  renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();
  renderTeachers('all');
  renderHelpRequests('all');
  refreshInboxBadge();
  renderAdminRegistrations();
  updateQueueBadges();
  const approverRoleLabel = curUser.role === 'admin' ? 'Super Admin' : (curUser.role === 'host' || curUser.role === 'batch_admin' ? 'Host' : 'Moderator');
  showToast(`✓ Registration approved by ${approverRoleLabel} (${curUser.name}). Profile activated.`);
}

function rejectRegistration(regId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const canModerate = curUser && ['admin', 'host', 'batch_admin', 'moderator'].includes(curUser.role);
  if (!canModerate) {
    showToast('🔒 Clearance required: Only Super Admin, Hosts, and Moderators can decline alumni registrations.');
    return;
  }

  const index = AppState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index !== -1) {
    const reg = AppState.pendingRegistrations[index];
    AppState.pendingRegistrations.splice(index, 1);
    saveAppData();
    try {
      if (typeof getAllUsers === 'function' && typeof saveAllUsers === 'function') {
        const users = getAllUsers();
        const u = users.find(x => x.id === reg.id || (x.email && x.email.toLowerCase() === (reg.email || '').toLowerCase()));
        if (u) {
          u.status = "rejected";
          u.roleTitle = "Application Declined";
          saveAllUsers(users);
        }
      }
    } catch(e) {}
    renderAdminRegistrations();
    updateQueueBadges();
    showToast(`Registration for ${reg.name} declined.`);
  }
}

// 13. Directory
let dirCurrentPage = 1;
const DIR_PAGE_SIZE = 24;

function renderDirectory(append = false) {
  const grid = document.getElementById('directoryGrid');
  if (!grid) return;

  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser) {
    grid.innerHTML = `
      <div class="col-span-full p-8 sm:p-12 text-center bg-slate-900 border border-amber-500/30 rounded-3xl space-y-4 shadow-2xl">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
          🔒
        </div>
        <div class="max-w-md mx-auto space-y-1.5">
          <h3 class="text-lg sm:text-xl font-bold font-cinzel text-white">Alumni Directory is Protected</h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            To protect members' privacy and contact security, access to the full Alumni Directory is reserved exclusively for registered and verified Navodaya alumni.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="login.html" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition">
            Sign In with Account →
          </a>
          <button onclick="openModal('registerModal')" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold text-xs transition">
            Register as Alumnus
          </button>
        </div>
      </div>
    `;
    const counterEl = document.getElementById('dirResultsCount');
    if (counterEl) counterEl.textContent = '🔒 Members Only • Sign in to access directory';
    return;
  }

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
    const normH = (h) => {
      if (!h) return '';
      const s = h.toString().trim().toLowerCase();
      if (s.startsWith('arav') || s.startsWith('araw')) return 'aravali';
      if (s.startsWith('nilg') || s.startsWith('neel')) return 'nilgiri';
      if (s.startsWith('udai') || s.startsWith('uday')) return 'udaigiri';
      if (s.startsWith('shiv') || s.startsWith('shiw')) return 'shivalik';
      return s;
    };
    const filtered = (AppState.directory || []).filter(item => {
      const matchQ = !q || (item.name || '').toLowerCase().includes(q.toLowerCase()) || (item.role || '').toLowerCase().includes(q.toLowerCase());
      const matchBatch = (batch === 'all' || item.batch.toString() === batch);
      const matchHouse = (house === 'all' || normH(item.house) === normH(house));
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
    const canDelete = (isCurAdmin || (isCurHost && targetSystemRole !== 'admin' && targetSystemRole !== 'host' && targetSystemRole !== 'batch_admin')) && item.name.toLowerCase() !== 'ashfaque ahmad' && item.name.toLowerCase() !== 'ashfaq ahmed';
    const isSelf = curUser && ((item.name || '').toLowerCase() === (curUser.name || '').toLowerCase() || (item.email && curUser.email && item.email.toLowerCase() === curUser.email.toLowerCase()));
    const editBtn = (isSelf || isCurAdmin) ? `
      <button onclick="openEditProfileModal('${item.name.replace(/'/g, "\\'")}')" class="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition" title="Edit alumnus profile information">
        <span>✏️</span> <span>Edit</span>
      </button>
    ` : '';
    const deleteBtn = canDelete ? `
      <button onclick="deleteAlumniProfile('${item.name.replace(/'/g, "\\'")}')" class="px-2 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40 text-[10px] font-bold flex items-center gap-1 transition" title="Permanently delete alumni profile">
        <span>🗑️</span> <span>Delete</span>
      </button>
    ` : '';

    if (isCurAdmin) {
      roleControlHtml = `
        <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] gap-2 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Role Admin:</span>
            <select onchange="changeUserRole('${item.name.replace(/'/g, "\\'")}', this.value)" class="bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] text-amber-300 font-bold focus:outline-none focus:border-amber-500">
              <option value="member" ${targetSystemRole === 'member' ? 'selected' : ''}>Member</option>
              <option value="moderator" ${targetSystemRole === 'moderator' ? 'selected' : ''}>Moderator</option>
              <option value="host" ${targetSystemRole === 'host' || targetSystemRole === 'batch_admin' ? 'selected' : ''}>Host</option>
              <option value="teacher" ${targetSystemRole === 'teacher' ? 'selected' : ''}>Teacher / Gurujan</option>
            </select>
          </div>
          ${deleteBtn}
        </div>
      `;
    } else if (isCurHost) {
      if (targetSystemRole === 'member') {
        roleControlHtml = `
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-slate-400 font-semibold">Host Delegation:</span>
              <button onclick="changeUserRole('${item.name.replace(/'/g, "\\'")}', 'moderator')" class="px-2 py-0.5 rounded bg-blue-900/50 hover:bg-blue-900/80 text-blue-200 border border-blue-500/30 text-[10px] font-bold transition">
                + Make Moderator
              </button>
            </div>
            ${deleteBtn}
          </div>
        `;
      } else if (targetSystemRole === 'moderator') {
        roleControlHtml = `
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-blue-400 font-semibold">Moderator</span>
              <button onclick="changeUserRole('${item.name.replace(/'/g, "\\'")}', 'member')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-semibold transition">
                Demote to Member
              </button>
            </div>
            ${deleteBtn}
          </div>
        `;
      } else if (canDelete) {
        roleControlHtml = `
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px]">
            ${deleteBtn}
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          ${(item.photo || item.avatarImage) 
            ? `<img src="${item.photo || item.avatarImage}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm flex-shrink-0">` 
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
          ${(isSelf || isCurAdmin) ? `
            <button onclick="openEditProfileModal('${item.name.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1 shadow-sm transition" title="Modify your alumnus profile">
              <span>✏️</span> <span>Edit</span>
            </button>
          ` : ''}
          <button onclick="openChatWithAlumnus('${item.name}')" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition">
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

// Power of Super Admin and Host to permanently delete directory profiles
function deleteAlumniProfile(targetName) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  const isCurAdmin = curUser && curUser.role === 'admin';
  const isCurHost = curUser && (curUser.role === 'host' || curUser.role === 'batch_admin');
  if (!isCurAdmin && !isCurHost) {
    alert("Permission Denied: Only Super Admin and Host Batch Organizers can delete alumni directory profiles.");
    return;
  }
  
  const lowerName = (targetName || '').toLowerCase().trim();
  if (lowerName === 'ashfaque ahmad' || lowerName === 'ashfaq ahmed') {
    alert("Protected Account: The permanent Super Admin profile (Ashfaque Ahmad) cannot be deleted.");
    return;
  }

  const users = (typeof getAllUsers === 'function') ? getAllUsers() : [];
  const targetUser = users.find(u => (u.name || '').toLowerCase() === lowerName);
  if (isCurHost && targetUser && (targetUser.role === 'admin' || targetUser.role === 'host' || targetUser.role === 'batch_admin')) {
    alert("Permission Denied: Host Batch Organizers cannot delete Admin or Host profiles.");
    return;
  }

  if (!confirm(`Are you sure you want to permanently delete the profile of "${targetName}" from the Alumni Directory and registered database? This action is irreversible.`)) {
    return;
  }

  // 1. Remove from AppState.directory
  if (AppState.directory && Array.isArray(AppState.directory)) {
    AppState.directory = AppState.directory.filter(item => (item.name || '').toLowerCase() !== lowerName);
  }

  // 2. Remove from USERS_STORAGE_KEY (registered database)
  if (typeof saveAllUsers === 'function') {
    const updatedUsers = users.filter(u => (u.name || '').toLowerCase() !== lowerName);
    saveAllUsers(updatedUsers);
  }

  // 3. Save AppData
  saveAppData();

  // 4. Rebuild search indexes if available
  if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
    window.AlumniStorageEngine.buildCacheIndexes(AppState.directory);
  }

  // 5. Re-render directory & role governance
  renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();
  if (typeof renderRoleGovernanceList === 'function') renderRoleGovernanceList();

  showToast(`✓ Profile of ${targetName} permanently deleted from directory.`, 'success');
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
      <p class="text-xs text-slate-200 italic leading-relaxed">"${(msg.quote || '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold not-italic text-amber-300">$1</strong>')}"</p>
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

// ========================================================
// NOTABLE ALUMNI HALL OF FAME DIRECTORY & CATEGORIES
// ========================================================
const NOTABLE_ALUMNI_LIST = [
  {
    "id": "notable-ad-1",
    "name": "Alok Dubey, IAS",
    "initials": "AD",
    "batch": "2007",
    "category": "civil",
    "categoryLabel": "Civil Services & Public Policy",
    "house": "Nilgiri",
    "role": "Indian Administrative Service (IAS) Officer",
    "academics": "Public Administration & Governance",
    "intro": "District and state administrative leader executing rural education transformations, public welfare delivery, and governance transparency, embodying Navodaya's pledge 'Pragyanam Brahma'.",
    "badgeColor": "emerald",
    "link": null
  },
  {
    "id": "notable-vt-1",
    "name": "Sh. Vivek Tiwari",
    "initials": "VT",
    "batch": "1987–1994",
    "category": "enterprise",
    "categoryLabel": "Financial Inclusion & Philanthropy",
    "house": "Aravali",
    "role": "MD & CEO, Satya MicroCapital Ltd., Delhi",
    "academics": "Finance & Institutional Economics",
    "intro": "Microfinance visionary empowering over 2.5 million rural women entrepreneurs across India. Major Vidyalaya benefactor donating the 125 KVA silent genset, National cricket trophy, and campus ground filling.",
    "badgeColor": "amber",
    "link": null
  },
  {
    "id": "notable-ak-1",
    "name": "Ashwini Mishra",
    "initials": "AM",
    "batch": "1993 (First Batch)",
    "category": "media",
    "categoryLabel": "Broadcast Journalism",
    "house": "Shivalik",
    "role": "Senior Journalist, Executive Producer & News Anchor, DD News",
    "academics": "Journalism & Broadcast Media",
    "intro": "Senior broadcast journalist, executive producer and prime-time news anchor at DD News (Doordarshan National). 'Measure your success not just by the lives you uplift and the communities you transform: **Be grounded..Be Honest..**'",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-up-1",
    "name": "Sh. Utkrisht Pandey",
    "initials": "UP",
    "batch": "2002",
    "category": "enterprise",
    "categoryLabel": "Agri-Enterprise & Security",
    "house": "Nilgiri",
    "role": "Founder, Rishigram Organics • Retd. Assistant Commandant, SSB",
    "academics": "Former Officer, Sashastra Seema Bal (SSB)",
    "intro": "Decorated former Assistant Commandant (SSB) honored by the Hon'ble Prime Minister at the Independence Day celebrations at the Red Fort (2025) and invited by the Hon'ble Governor of Uttar Pradesh (Raj Bhavan). Utkrisht Pandey is an agrarian pioneer and Founder of Rishigram Organics, promoting sustainable agriculture, commercial sandalwood agroforestry.",
    "badgeColor": "emerald",
    "link": "https://rishigramorganics.com/pages/about-us"
  },
  {
    "id": "notable-vkp-1",
    "name": "Col. Virendra Kumar Pandey",
    "initials": "VP",
    "batch": "1994",
    "category": "defense",
    "categoryLabel": "Armed Forces & Frontline Command",
    "house": "Aravali",
    "role": "Colonel, Indian Army",
    "academics": "National Defence Academy & Indian Military Academy",
    "intro": "Senior officer in the Indian Army (Colonel, Batch of 1994). Dedicated to the frontline defense, strategic military readiness, and sovereignty of the nation.",
    "badgeColor": "amber",
    "phone": "",
    "link": null
  },
  {
    "id": "notable-mr-judge",
    "name": "Sh. Manish Rana",
    "initials": "MR",
    "batch": "2007",
    "category": "civil",
    "categoryLabel": "Judiciary & Constitutional Justice",
    "house": "Udaigiri",
    "role": "Judicial Magistrate / Civil Judge, U.P. Judiciary",
    "academics": "LL.M. (Criminology & Law), Faculty of Law, BHU • JNV Gauriganj (2007)",
    "intro": "Judicial Officer in the Uttar Pradesh Judicial Service (Civil Judge / Judicial Magistrate, High Court of Judicature at Allahabad, Civil Court Bisauli, Budaun). Dedicated to constitutional jurisprudence, dispute resolution, and equitable administration of justice.",
    "badgeColor": "emerald",
    "phone": "8317024401",
    "email": "manishranabhulaw@gmail.com",
    "link": "https://www.facebook.com/manish.rana.9275"
  },
  {
    "id": "notable-ck-1",
    "name": "Sh. Chandan Kumar",
    "initials": "CK",
    "batch": "2004",
    "category": "defense",
    "categoryLabel": "Gallantry & National Defense",
    "house": "Nilgiri",
    "role": "Deputy Commandant • Shaurya Chakra Awardee",
    "academics": "Frontline Tactical Command & National Defense",
    "intro": "Deputy Commandant conferred the Shaurya Chakra by the President of India—the nation's 3rd highest peacetime gallantry award—for conspicuous courage, heroic valor, and exceptional tactical command in frontline combat operations.",
    "badgeColor": "amber",
    "link": null
  },
  {
    "id": "notable-rt-1",
    "name": "Dr. Ratnesh Tiwari",
    "initials": "RT",
    "batch": "1996–2003",
    "category": "enterprise",
    "categoryLabel": "Clean-Tech, Renewable Energy & Social Impact",
    "house": "Nilgiri",
    "role": "CEO, Koshish India • Co-Founder Satyapath Foundation",
    "academics": "Ph.D. Renewable Energy (IIT Delhi)",
    "intro": "Clean-tech pioneer and IIT Delhi doctoral alumnus leading Koshish Sustainable Solutions and Satyapath Foundation. Driving waste-to-energy, bio-CNG, and rural sustainability across India. Generous Vidyalaya benefactor co-donating the permanent 125 KVA silent Genset.",
    "badgeColor": "purple",
    "link": "https://koshishindia.in/founders-thought/"
  },
  {
    "id": "notable-bps-1",
    "name": "Capt. Bhanu Pratap Singh",
    "initials": "BS",
    "batch": "1998",
    "category": "defense",
    "categoryLabel": "Merchant Navy & Maritime Command (UK)",
    "house": "Shivalik",
    "role": "Captain, Maritime & Merchant Marine (United Kingdom)",
    "academics": "Nautical Science & Global Maritime Navigation",
    "intro": "Accomplished Master Mariner and Ship Captain operating across the United Kingdom and international ocean waters. Guiding deep-sea commercial vessels with navigational precision and global maritime leadership.",
    "badgeColor": "blue",
    "phone": "8299535890",
    "link": null
  },
  {
    "id": "notable-vks-1",
    "name": "Sh. Vinod Kumar Singh",
    "initials": "VS",
    "batch": "1997",
    "category": "defense",
    "categoryLabel": "Central Armed Police Forces & Homeland Security",
    "house": "Shivalik",
    "role": "Assistant Commandant, CRPF, Jammu & Kashmir",
    "academics": "Armed Police Tactical Operations & Homeland Security",
    "intro": "Assistant Commandant in the Central Reserve Police Force (CRPF) serving on sensitive security and counter-terror deployments in Jammu & Kashmir. Upholding internal peace and border integrity with indomitable valor.",
    "badgeColor": "amber",
    "phone": "8072528634",
    "link": null
  },
  {
    "id": "notable-prabhat-pps",
    "name": "Sh. Prabhat (PPS Officer)",
    "initials": "PR",
    "batch": "2002",
    "category": "defense",
    "categoryLabel": "State Police Service & Law Enforcement",
    "house": "Aravali",
    "role": "Provincial Police Service (PPS) Officer • Dy. SP / Addl. SP, U.P. Police",
    "academics": "Provincial Police Service (PPS), Govt. of Uttar Pradesh • JNV Gauriganj (2002 Batch)",
    "intro": "Provincial Police Service (PPS) Officer (Batch of 2002) in the Uttar Pradesh Police. Dedicated to state police administrative command, public security, maintenance of law & order, and frontline crime investigation across Uttar Pradesh.",
    "badgeColor": "amber",
    "link": null
  },
  {
    "id": "notable-jm-1",
    "name": "Dr. Jai Krishna Mishra",
    "initials": "JM",
    "batch": "1993 (First Batch)",
    "category": "defense",
    "categoryLabel": "Defense & Strategic Missile Systems",
    "house": "Aravali",
    "role": "Project Director, ASL, DRDO Hyderabad",
    "academics": "B.Tech (KNIT) • M.Tech (IIT Roorkee) • Ph.D. (NIT Warangal)",
    "intro": "Project Director at Advanced Systems Laboratory (ASL), DRDO Hyderabad. Pioneering scientist in solid rocket propulsion, aerospace structures, and national IRBM missile systems. Honored with DRDO Performance Excellence Award and Agni Award for Self Reliance.",
    "badgeColor": "amber",
    "link": null
  },
  {
    "id": "notable-sk-pds",
    "name": "Sh. Sunil Kaushal",
    "initials": "SK",
    "batch": "2000",
    "category": "civil",
    "categoryLabel": "Civil Services & Rural Development",
    "house": "Udaigiri",
    "role": "District Development Officer (D.D.O.) • P.D.S., Govt. of U.P.",
    "academics": "Provincial Development Services (PDS), Uttar Pradesh",
    "intro": "District Development Officer (D.D.O.) in the Provincial Development Services (P.D.S.), Government of Uttar Pradesh. Spearheading grassroots rural transformation, block-level development, and public welfare schemes.",
    "badgeColor": "emerald",
    "phone": "9415607072",
    "link": null
  },
  {
    "id": "notable-sanj-1",
    "name": "Sh. Sanjay",
    "initials": "SJ",
    "batch": "2004",
    "category": "civil",
    "categoryLabel": "State Secretariat Governance",
    "house": "Nilgiri",
    "role": "Section Officer, U.P. Secretariat, Lucknow",
    "academics": "Public Administration, Govt. of Uttar Pradesh",
    "intro": "Section Officer in the Uttar Pradesh Secretariat, Lucknow. Driving state government administrative governance, policy documentation, and statutory executive coordination.",
    "badgeColor": "emerald",
    "phone": "9454414129",
    "link": null
  },
  {
    "id": "notable-shal-1",
    "name": "Mrs. Shalini",
    "initials": "SH",
    "batch": "2006",
    "category": "civil",
    "categoryLabel": "Revenue Administration & Executive Governance",
    "house": "Udaigiri",
    "role": "Naib Tehsildar, Uttar Pradesh Administration",
    "academics": "State Revenue Administration & Law",
    "intro": "Naib Tehsildar in the Uttar Pradesh State Revenue Administration. Adjudicating land and revenue administration, resolving rural disputes, and ensuring citizen-first welfare governance.",
    "badgeColor": "emerald",
    "phone": "957139878",
    "link": null
  },
  {
    "id": "notable-arun-kvs",
    "name": "Sh. Arun",
    "initials": "AR",
    "batch": "1993",
    "category": "civil",
    "categoryLabel": "National School Education Leadership",
    "house": "Aravali",
    "role": "Headmaster (H.M.), Kendriya Vidyalaya Sangathan (KVS)",
    "academics": "Pedagogy & Educational Administration",
    "intro": "Headmaster at Kendriya Vidyalaya Sangathan (KVS). Nurturing scholastic excellence, foundational literacy, and institutional leadership across national schools.",
    "badgeColor": "emerald",
    "phone": "7839456551",
    "link": null
  },
  {
    "id": "notable-as-1",
    "name": "Sh. Anil Saroj",
    "initials": "AS",
    "batch": "1995",
    "category": "civil",
    "categoryLabel": "Civil Services & Governance",
    "house": "Udaigiri",
    "role": "Provincial Civil Services (PCS) Officer, Govt. of Uttar Pradesh",
    "academics": "UP State Civil Services Administration",
    "intro": "Senior administrator in the Uttar Pradesh Provincial Civil Services (PCS). Leading district administration, grassroots citizen welfare delivery, and public policy execution with integrity.",
    "badgeColor": "emerald",
    "link": null
  },
  {
    "id": "notable-ry-1",
    "name": "Sh. Rama Shankar Yadav (Rama Sankar Yadav)",
    "initials": "RY",
    "batch": "1987–1994",
    "category": "civil",
    "categoryLabel": "Governor's Awardee Teacher & Education",
    "house": "Shivalik",
    "role": "Governor's Awardee Teacher • Head Master, Model School Pachehari",
    "academics": "Elementary Education & Innovative Pedagogy",
    "intro": "Distinguished Governor's Awardee Teacher and Head Master at Model School Pachehari. Honored for exemplary leadership, innovative pedagogical models, and rural educational transformation; generous Vidyalaya benefactor donating permanent campus cement benches to PM Shri JNV Gauriganj.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-ns-mbbs",
    "name": "Dr. Neeraj Singh (M.B.B.S.)",
    "initials": "NS",
    "batch": "1994",
    "category": "health",
    "categoryLabel": "Healthcare & Public Medical Services",
    "house": "Aravali",
    "role": "Medical Officer (MBBS / M.B.B.S.), PMHS, Govt. of Uttar Pradesh",
    "academics": "MBBS • Provincial Medical Health Services (PMHS)",
    "intro": "Senior government physician in the Provincial Medical Health Services (PMHS), Government of Uttar Pradesh. Serving rural and district communities with tireless clinical care, emergency medicine, and public health delivery.",
    "badgeColor": "blue",
    "phone": "9415476617",
    "link": null
  },
  {
    "id": "notable-sjs-prof",
    "name": "Dr. Shyam Ji Sonkar",
    "initials": "SS",
    "batch": "1994",
    "category": "health",
    "categoryLabel": "Medical Academia & Clinical Professorship",
    "house": "Shivalik",
    "role": "Professor of Medicine, Prayagraj",
    "academics": "Doctor of Medicine (MD) • Medical Professorship",
    "intro": "Distinguished Professor of Medicine in Prayagraj. Mentoring medical graduates, conducting advanced clinical research, and delivering tertiary healthcare to thousands of patients across North India.",
    "badgeColor": "blue",
    "phone": "8423038071",
    "link": null
  },
  {
    "id": "notable-anurag-ortho",
    "name": "Dr. Anurag (Anureg)",
    "initials": "AN",
    "batch": "2004",
    "category": "health",
    "categoryLabel": "Orthopaedic Surgery & Joint Care",
    "house": "Nilgiri",
    "role": "Orthopaedic Surgeon & Specialist Consultant",
    "academics": "M.S. Orthopaedics • Joint Reconstruction",
    "intro": "Specialist Orthopaedic Surgeon performing complex trauma surgeries, arthroplasty, and bone health management with advanced surgical techniques.",
    "badgeColor": "blue",
    "phone": "7982204947",
    "link": null
  },
  {
    "id": "notable-dr-ahmad",
    "name": "Dr. Ahmad",
    "initials": "DA",
    "batch": "1998",
    "category": "health",
    "categoryLabel": "Healthcare & Clinical Medicine, Sultanpur",
    "house": "Udaigiri",
    "role": "Senior Physician & Medical Consultant, Sultanpur",
    "academics": "Medical Sciences & Clinical Care",
    "intro": "Revered medical doctor and consultant physician in Sultanpur, providing compassionate, accessible healthcare and clinical diagnosis to local communities.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-kp-doc",
    "name": "Dr. Krishna Priya",
    "initials": "KP",
    "batch": "2005",
    "category": "health",
    "categoryLabel": "Specialist Healthcare, New Delhi",
    "house": "Nilgiri",
    "role": "Consultant Physician & Specialist Doctor, New Delhi",
    "academics": "MBBS • Clinical Specialization",
    "intro": "Consultant medical specialist in New Delhi, leading patient treatment protocols and clinical diagnostics in premier healthcare institutions.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-arun-doc",
    "name": "Dr. Arun Kumar",
    "initials": "AK",
    "batch": "2001",
    "category": "health",
    "categoryLabel": "Clinical Medicine & Patient Care",
    "role": "Physician & Medical Consultant",
    "house": "Shivalik",
    "academics": "Medical Practice & Internal Health",
    "intro": "Dedicated medical doctor providing diagnostic accuracy and patient-centered medical treatment with unwavering commitment to healing.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-kkm-doc",
    "name": "Dr. K. K. Mishra",
    "initials": "KM",
    "batch": "1996",
    "category": "health",
    "categoryLabel": "Specialist Healthcare, Delhi",
    "role": "Senior Medical Consultant & Physician, Delhi",
    "house": "Aravali",
    "academics": "Advanced Medical Diagnostics & Therapeutics",
    "intro": "Senior physician and clinical consultant in Delhi with extensive clinical expertise in critical care, internal medicine, and patient rehabilitation.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-st-1",
    "name": "Dr. Shailendra Mohan Tripathi",
    "initials": "ST",
    "batch": "1997",
    "category": "health",
    "categoryLabel": "Healthcare & Neuroscience",
    "house": "Nilgiri",
    "role": "Addl. Professor, Geriatric Mental Health, KGMU & Hon. Clinical Lecturer, Univ. of Aberdeen UK",
    "academics": "MBBS (GSVM) • MD Psychiatry • Ph.D. (Univ. of Aberdeen)",
    "intro": "Leading Indian medical authority on Dementia, Alzheimer's, and Movement Disorders. Principal Investigator of ICMR Alzheimer's research projects with 50+ global peer-reviewed publications.",
    "badgeColor": "blue",
    "link": null
  },
  {
    "id": "notable-shesh-sci",
    "name": "Dr. Shesh Kishan (Sheshi Kishan)",
    "initials": "SK",
    "batch": "2012",
    "category": "tech",
    "categoryLabel": "Chemical Sciences & Advanced Research",
    "house": "Udaigiri",
    "role": "Chemical Scientist & Advanced Research Fellow",
    "academics": "Ph.D. / M.Sc. Chemical Sciences & Material Chemistry",
    "intro": "Chemical Scientist (Batch of 2012) conducting innovative research in applied chemistry, synthetic compounds, and sustainable material science.",
    "badgeColor": "cyan",
    "phone": "8076052724",
    "link": null
  },
  {
    "id": "notable-mm-1",
    "name": "Sh. Manoj Mishra",
    "initials": "MM",
    "batch": "1996 (Host Batch)",
    "category": "tech",
    "categoryLabel": "Space Research & Aerospace",
    "house": "Aravali",
    "role": "Senior Space Scientist, ISRO",
    "academics": "Indian Space Research Organisation (ISRO)",
    "intro": "Senior Space Scientist at ISRO, actively contributing to India's satellite launch vehicle systems, telemetry operations, and prestigious national space exploration missions.",
    "badgeColor": "cyan",
    "link": null
  },
  {
    "id": "notable-jk-1",
    "name": "Sh. Jaikishan",
    "initials": "JK",
    "batch": "1993 (First Batch)",
    "category": "tech",
    "categoryLabel": "Nuclear Science & Research",
    "house": "Udaigiri",
    "role": "Senior Nuclear Research Scientist, BARC",
    "academics": "Bhabha Atomic Research Centre (DAE)",
    "intro": "Senior atomic researcher at Bhabha Atomic Research Centre (BARC, Department of Atomic Energy), researching peaceful atomic energy systems, reactor safety, and applied nuclear technologies.",
    "badgeColor": "purple",
    "link": null
  },
  {
    "id": "notable-als-1",
    "name": "Sh. Alok Singh",
    "initials": "AS",
    "batch": "1995",
    "category": "tech",
    "categoryLabel": "Enterprise Technology & AI Analytics",
    "house": "Aravali",
    "role": "Manager, Infosys • Senior Enterprise Analytics & AI Leader",
    "academics": "Advanced Analytics & Enterprise Architecture",
    "intro": "Manager at Infosys and senior analytics transformation leader driving high-impact data-driven decisions and enterprise architecture across global platforms.",
    "badgeColor": "cyan",
    "link": "https://www.linkedin.com/in/aloksinghanalytics"
  },
  {
    "id": "notable-saurabh-eng",
    "name": "Sh. Saurabh Verma",
    "initials": "SV",
    "batch": "2003",
    "category": "tech",
    "categoryLabel": "Engineering & Technical Architecture",
    "house": "Shivalik",
    "role": "Senior Systems & Technical Solutions Engineer",
    "academics": "B.Tech Computer / Electrical Engineering",
    "intro": "Senior technology engineer designing resilient industrial systems, software frameworks, and automated infrastructure solutions.",
    "badgeColor": "cyan",
    "link": null
  },
  {
    "id": "notable-sk-1",
    "name": "Safeer Khan",
    "initials": "SK",
    "batch": "2010",
    "category": "tech",
    "categoryLabel": "Fintech & Data Engineering",
    "house": "Shivalik",
    "role": "Vice President, Citi (formerly Citibank)",
    "academics": "Finance & Large-Scale Data Systems",
    "intro": "Vice President at Citi, heading institutional financial data systems, automated risk management architectures, and cross-border digital financial services.",
    "badgeColor": "cyan",
    "link": "https://www.linkedin.com/in/safeer-khan"
  },
  {
    "id": "notable-ss-1",
    "name": "Satyendra Singh Satya (@cybr0x)",
    "initials": "SS",
    "batch": "1998",
    "category": "tech",
    "categoryLabel": "Cybersecurity & National Threat Intel",
    "house": "Aravali",
    "role": "Principal Cyber Security Architect & Threat Researcher",
    "academics": "Computer Science & Cryptographic Systems",
    "intro": "Nationally renowned cyber threat intelligence researcher and security architect (@cybr0x). Protecting critical national infrastructure against advanced persistent cyber warfare threats.",
    "badgeColor": "purple",
    "link": "https://x.com/cybr0x"
  },
  {
    "id": "notable-sj-1",
    "name": "Surabhi Jaiswal",
    "initials": "SJ",
    "batch": "2006",
    "category": "tech",
    "categoryLabel": "Enterprise Technology Strategy",
    "house": "Nilgiri",
    "role": "Global Technology & Cloud Architecture Executive",
    "academics": "Enterprise Cloud Systems & Corporate Strategy",
    "intro": "Global technology executive spearheading strategic digital transformations, enterprise cloud adoption, and system architecture across Fortune 500 corporations.",
    "badgeColor": "cyan",
    "link": "https://www.linkedin.com/in/surabhi-jaiswal-b5a0a03a"
  },
  {
    "id": "notable-ss2-1",
    "name": "Shailesh Singh, MIEAust",
    "initials": "SS",
    "batch": "1997",
    "category": "tech",
    "categoryLabel": "Civil Infrastructure & Engineering",
    "house": "Shivalik",
    "role": "Chartered Professional Engineer (MIEAust), Australia",
    "academics": "Engineers Australia (MIEAust)",
    "intro": "Chartered Professional Engineer (MIEAust) and senior infrastructure consultant in Australia. Directing multi-million dollar transportation, civil infrastructure, and sustainable asset management programs.",
    "badgeColor": "blue",
    "link": "https://au.linkedin.com/in/shailesh-s-4327595"
  },
  {
    "id": "notable-mt-1",
    "name": "Manish Tiwari",
    "initials": "MT",
    "batch": "2004",
    "category": "tech",
    "categoryLabel": "Enterprise Software & Cloud Engineering",
    "house": "Nilgiri",
    "role": "Technology Strategist & Engineering Leader",
    "academics": "Computer Engineering & Enterprise Architecture",
    "intro": "Distinguished technology leader and enterprise software engineering strategist with deep expertise in cloud architectures, distributed systems, and large-scale digital platforms.",
    "badgeColor": "blue",
    "link": "https://www.linkedin.com/in/manish-tiwari-37845514"
  },
  {
    "id": "notable-ya-1",
    "name": "Yasir Abdul",
    "initials": "YA",
    "batch": "1995",
    "category": "tech",
    "categoryLabel": "Enterprise Technology & Leadership",
    "house": "Nilgiri",
    "role": "Enterprise Technology Strategist & Engineering Leader",
    "academics": "Enterprise Systems & Digital Engineering",
    "intro": "Distinguished technology and enterprise leader (Batch of 1995). Driving digital solutions, technology architecture, and impactful cross-functional execution across multinational domains.",
    "badgeColor": "cyan",
    "link": "https://www.linkedin.com/in/yasir-abdul-66258828"
  },
  {
    "id": "notable-amit-bob",
    "name": "Sh. Amit Singh",
    "initials": "AS",
    "batch": "2001",
    "category": "enterprise",
    "categoryLabel": "Banking & Institutional Finance",
    "house": "Aravali",
    "role": "Senior Banking Officer, Bank of Baroda",
    "academics": "Banking Operations & Corporate Finance",
    "intro": "Senior banking professional at Bank of Baroda. Managing commercial credit, financial risk, and modern retail banking operations.",
    "badgeColor": "amber",
    "link": null
  },
  {
    "id": "notable-vs-1",
    "name": "Virika Solanki",
    "initials": "VS",
    "batch": "2009",
    "category": "media",
    "categoryLabel": "Arts & Digital Media",
    "house": "Aravali",
    "role": "Creative Artist, Actor & Digital Content Creator",
    "academics": "Media Arts & Creative Production",
    "intro": "Celebrated creative artist, actor, and digital storyteller with an inspiring social media following. Inspiring young Navodayans to pursue cultural arts, acting, and digital media excellence.",
    "badgeColor": "rose",
    "link": "https://www.instagram.com/virika_solanki"
  }
];

let currentNotableFilter = 'all';

function renderNotableAlumni(filter = 'all') {
  currentNotableFilter = filter;
  const container = document.getElementById('notableAlumniContainer');
  if (!container) return;

  const filtered = NOTABLE_ALUMNI_LIST.filter(a => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  // Update filter buttons UI
  document.querySelectorAll('.notable-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-900', 'text-slate-300');
    } else {
      btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.add('bg-slate-900', 'text-slate-300');
    }
  });

  const countBadge = document.getElementById('notableAlumniCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} Distinguished Navodayans`;
  }

  container.innerHTML = '';
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition duration-300 space-y-3.5 shadow-md hover:shadow-xl hover:border-amber-500/50 flex flex-col justify-between";

    const badgeColorClasses = {
      amber: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
      emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
      blue: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30",
      cyan: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30",
      rose: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30",
      purple: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30"
    };

    const bClass = badgeColorClasses[item.badgeColor] || badgeColorClasses.amber;

    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${bClass}">
            ${item.categoryLabel}
          </span>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
            ${item.batch}
          </span>
        </div>

        <div class="flex items-center gap-3.5">
          <div class="w-13 h-13 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-serif font-black text-lg flex-shrink-0">
            ${item.initials}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-cinzel leading-tight break-words">
              ${item.name}
            </h3>
            <p class="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-0.5 leading-snug break-words">
              ${item.role}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug break-words">
              ${item.house} House • ${item.academics}
            </p>
          </div>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ${item.intro}
        </p>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        ${item.link ? `
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
            <span>Explore Work / Profile ↗</span>
          </a>
        ` : `
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hall of Fame
          </span>
        `}
        <button onclick="openNotableRegardsModal('${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
          <span>🤝</span> <span>Send Regards / शुभकामनाएं</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function openNotableMessageModal() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Please sign in as a verified Notable Alumnus or Super Admin to post guidance.");
    openModal('loginModal');
    return;
  }
  const isSuperAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin' || (currentUser.email && currentUser.email.toLowerCase() === 'ashfaque15tr@gmail.com');
  const notableNames = [
    "jai krishna mishra", "utkrisht pandey", "shailendra mohan", "tripathi", "anil saroj", 
    "virika solanki", "safeer khan", "satyendra singh", "cybr0x", "chandan kumar", 
    "ashwini kumar", "manoj mishra", "jaikishan", "surabhi jaiswal", "shailesh singh", 
    "vivek tiwari", "alok dubey", "ratnesh tiwari", "rama sankar yadav", "rama shankar yadav"
  ];
  const isNotable = notableNames.some(n => (currentUser.name || '').toLowerCase().includes(n));
  
  if (!isSuperAdmin && !isNotable) {
    alert("Hall of Fame Key Guidance messages are reserved exclusively for recognized Notable Alumni and Super Administrators. For sharing memories, stories, and photos, please post on our community Memory Wall!");
    switchTab('feed');
    return;
  }
  
  // Pre-fill fields
  const nameField = document.getElementById('notableName');
  const batchField = document.getElementById('notableBatch');
  const roleField = document.getElementById('notableRole');
  if (nameField) nameField.value = currentUser.name || '';
  if (batchField) batchField.value = currentUser.batch || '';
  if (roleField) roleField.value = currentUser.profession || currentUser.roleTitle || '';
  
  openModal('notableMessageModal');
}

// 15. Admin Moderation
function approveQueueItem(id, successMsg) {
  const index = AppState.queueItems.findIndex(i => i.id === id);
  if (index !== -1) {
    const item = AppState.queueItems[index];
    if (item.type === "Memory Story") {
      const newFeedPost = { id: Date.now(), author: item.author.split('(')[0].trim(), initials: "AK", batch: "2011", house: "Aravali", category: item.category || "assembly", tag: "Approved Memory", content: item.text, text: item.text, image: item.image || null, likes: 1, comments: [] };
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

// 15B. Admin Sahayata & Grievance Help Desk Queue
function renderAdminHelpDeskQueue() {
  const container = document.getElementById('adminHelpDeskList');
  if (!container) return;
  const reqs = AppState.helpRequests || [];

  const countBadge = document.getElementById('pendingHelpCountText');
  const unresolved = reqs.filter(r => r.status !== 'resolved');
  if (countBadge) countBadge.textContent = `${unresolved.length} Active Ticket${unresolved.length === 1 ? '' : 's'}`;

  if (reqs.length === 0) {
    container.innerHTML = `<div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs">✓ No grievance or assistance requests in queue.</div>`;
    return;
  }

  container.innerHTML = '';
  reqs.forEach(r => {
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3.5 shadow-sm";
    
    const isResolved = r.status === 'resolved';
    const urgencyBadge = r.urgency === 'urgent' 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600/20 text-red-600 dark:text-red-300 border border-red-500/30 animate-pulse">⚡ Urgent Emergency</span>' 
      : '<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Standard Intake</span>';

    const statusBadge = isResolved
      ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">✓ Case Resolved</span>'
      : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">Tier ${r.currentTier} Active</span>`;

    let notesHtml = '';
    if (r.resolutionNotes && r.resolutionNotes.length > 0) {
      notesHtml = `
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
          <span class="text-[10px] font-bold uppercase text-slate-500 block">Audit Trail / Log:</span>
          ${r.resolutionNotes.map(n => `<div class="text-slate-700 dark:text-slate-300">• <strong>${n.time}:</strong> ${n.note}</div>`).join('')}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">${r.categoryLabel || r.category}</span>
            ${urgencyBadge}
            ${statusBadge}
            <span class="text-[11px] text-slate-400 font-mono font-medium">${r.date}</span>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white font-cinzel">${r.title}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-300">Requester: <strong>${r.requesterName}</strong> • Batch ${r.batch} (${r.house} House)</p>
        </div>
        ${r.targetAmount ? `<div class="text-right flex-shrink-0"><span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">Goal: ₹${r.targetAmount.toLocaleString('en-IN')}</span><span class="text-[10px] text-slate-400">Raised: ₹${(r.raisedAmount || 0).toLocaleString('en-IN')}</span></div>` : ''}
      </div>

      <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${r.description}</p>
      ${notesHtml}

      <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <button onclick="openChatWithAlumnus('${r.requesterName}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition">
            <span>💬 Message Requester</span>
          </button>
          <button onclick="addAdminNoteToHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition">
            <span>📝 Add Action Note</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          ${!isResolved && r.currentTier < 3 ? `
            <button onclick="escalateHelpRequest('${r.id}'); renderAdminHelpDeskQueue();" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition">
              <span>⬆️ Escalate Tier</span>
            </button>
          ` : ''}
          ${!isResolved ? `
            <button onclick="resolveHelpRequest('${r.id}'); renderAdminHelpDeskQueue();" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
              <span>✓ Mark Resolved</span>
            </button>
          ` : '<span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ Closed & Archived</span>'}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function addAdminNoteToHelpRequest(requestId) {
  const note = prompt("Enter administrative action or resolution note for this ticket:");
  if (!note || !note.trim()) return;

  const req = (AppState.helpRequests || []).find(r => r.id === requestId);
  if (!req) return;

  if (!req.resolutionNotes) req.resolutionNotes = [];
  const currentUser = getCurrentUser();
  const adminName = currentUser ? currentUser.name : "Super Admin";
  req.resolutionNotes.push({
    time: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    note: `[Admin Note by ${adminName}]: ${note.trim()}`
  });

  saveAppData();
  renderAdminHelpDeskQueue();
  renderHelpRequests(currentHelpFilter);
  showToast("Administrative note recorded on assistance ticket.");
}

// ========================================================
// 15B. ALUMNI SUGGESTIONS & GRIEVANCES ISSUE TRACKER ENGINE
// ========================================================
const DEFAULT_SUGGESTIONS_ISSUES = [
  {
    id: "sug-demo-1",
    category: "Feature Suggestion",
    name: "Dr. Jai Krishna Mishra",
    batch: "1993",
    contact: "jk.mishra@asl.drdo.in",
    details: "Propose setting up an Annual Science & Space Technology Merit Fellowship at JNV Gauriganj for senior secondary students demonstrating exceptional research aptitude in STEM.",
    date: "14 Nov 2026",
    status: "reviewed"
  },
  {
    id: "sug-demo-2",
    category: "General Grievance / Inundation",
    name: "Utkrisht Pandey",
    batch: "2002",
    contact: "+91 9415098765",
    details: "During rainy season, the internal approach pathway connecting MP Hall to the Dining Mess needs gravel pavers. Alumni fraternity can collectively fund this concrete pavement upgrade.",
    date: "16 Nov 2026",
    status: "pending"
  }
];

function getAdminSuggestionsList() {
  try {
    const raw = localStorage.getItem('JNVG_SUGGESTIONS_ISSUES');
    if (!raw) {
      localStorage.setItem('JNVG_SUGGESTIONS_ISSUES', JSON.stringify(DEFAULT_SUGGESTIONS_ISSUES));
      return DEFAULT_SUGGESTIONS_ISSUES;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_SUGGESTIONS_ISSUES;
  } catch (e) {
    return DEFAULT_SUGGESTIONS_ISSUES;
  }
}

function saveAdminSuggestionsList(list) {
  try {
    localStorage.setItem('JNVG_SUGGESTIONS_ISSUES', JSON.stringify(list));
  } catch(e) {}
}

function renderAdminSuggestionsList() {
  const container = document.getElementById('adminSuggestionsList');
  if (!container) return;
  const list = getAdminSuggestionsList();
  
  const countBadge = document.getElementById('pendingSugCountText');
  const pendingCount = list.filter(s => s.status !== 'resolved' && s.status !== 'reviewed').length;
  if (countBadge) {
    countBadge.textContent = `${list.length} Total (${pendingCount} Pending Review)`;
  }

  if (list.length === 0) {
    container.innerHTML = `<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">✓ No registered feedback or suggestions in queue.</div>`;
    return;
  }

  container.innerHTML = '';
  list.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm";
    
    const isDone = item.status === 'resolved' || item.status === 'reviewed';
    const statusBadge = isDone 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">✓ Reviewed & Addressed</span>'
      : '<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">Action Required</span>';

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">${item.category || 'Portal Feedback'}</span>
            ${statusBadge}
            <span class="text-[11px] text-slate-400 font-mono font-medium">${item.date || 'Recent'}</span>
          </div>
          <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-cinzel">${item.name || 'Anonymous Alumnus'} <span class="text-xs font-normal text-slate-500 font-sans">• Batch of ${item.batch || 'Alumni'}</span></h4>
          ${item.contact ? `<p class="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5">Contact: <strong>${item.contact}</strong></p>` : ''}
        </div>
      </div>

      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        ${item.details || 'No additional details provided.'}
      </div>

      <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div class="flex items-center gap-2">
          ${item.name ? `
            <button onclick="openChatWithAlumnus('${item.name.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition">
              <span>💬 Reply via Chat</span>
            </button>
          ` : ''}
          ${!isDone ? `
            <button onclick="markAdminSuggestionReviewed(${idx})" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
              <span>✓ Mark Addressed</span>
            </button>
          ` : '<span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ Closed</span>'}
        </div>
        <button onclick="deleteAdminSuggestion(${idx})" class="text-xs text-red-500 hover:text-red-700 hover:underline">
          Delete Entry
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function markAdminSuggestionReviewed(idx) {
  const list = getAdminSuggestionsList();
  if (list[idx]) {
    list[idx].status = 'reviewed';
    saveAdminSuggestionsList(list);
    renderAdminSuggestionsList();
    showToast("Feedback marked as reviewed & addressed.");
  }
}

function deleteAdminSuggestion(idx) {
  const list = getAdminSuggestionsList();
  if (confirm("Remove this feedback entry from the admin log?")) {
    list.splice(idx, 1);
    saveAdminSuggestionsList(list);
    renderAdminSuggestionsList();
    showToast("Entry removed.");
  }
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
    const isDeceased = Boolean(t.isDeceased || (t.name && t.name.toLowerCase().includes('late')) || t.category === 'in_memoriam');
    const statusText = ((t.statusLabel || '') + ' ' + (t.post || '') + ' ' + (t.tenure || '')).toLowerCase();
    const isCurrentFaculty = !isDeceased && (t.category === 'current' || statusText.includes('present') || statusText.includes('current faculty') || statusText.includes('current leadership')) && !(statusText.includes('former') || statusText.includes('retired') || statusText.includes('superannuated') || statusText.includes('in memoriam') || statusText.includes('amar smriti'));
    const isFormerFaculty = isDeceased || t.category === 'former' || t.category === 'in_memoriam' || statusText.includes('former') || statusText.includes('retired') || statusText.includes('superannuated') || statusText.includes('transferred') || statusText.includes('amar smriti');

    if (filter === 'leadership' || filter === 'present') {
      matchCat = isCurrentFaculty;
    } else if (filter === 'former') {
      matchCat = isFormerFaculty;
    } else if (filter === 'teaching' || filter === 'academic') {
      matchCat = (t.post && (t.post.includes('PGT') || t.post.includes('TGT') || t.post.toLowerCase().includes('teacher') || t.post.toLowerCase().includes('faculty') || t.subject)) && !(t.category === 'pastoral' || t.category === 'nonteaching' || (t.post && (t.post.toLowerCase().includes('custodian') || t.post.toLowerCase().includes('caretaker') || t.post.toLowerCase().includes('mess'))));
    } else if (filter === 'nonteaching' || filter === 'pastoral') {
      matchCat = (t.category === 'pastoral' || t.category === 'nonteaching' || (t.post && (t.post.includes('PET') || t.post.toLowerCase().includes('warden') || t.post.toLowerCase().includes('custodian') || t.post.toLowerCase().includes('caretaker') || t.post.toLowerCase().includes('mess') || t.post.toLowerCase().includes('matron') || t.post.toLowerCase().includes('non-teaching'))));
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

  // Strict Hierarchy Sorting: 1. Late Dr. S.P. Singh (Principal), 2. Late Dr. Preetam Singh (PGT Hindi), 3. Current Principal, 4. Current Vice Principal, 5. Current Faculty Alumni Coordinator
  filtered.sort((a, b) => {
    const getLeadershipRank = (t) => {
      const name = (t.name || '').toLowerCase();
      const p = (t.post || '').toLowerCase();
      const s = (t.statusLabel || '').toLowerCase();
      const isCur = t.category === 'current' || s.includes('current');
      if (name.includes('s.p. singh') || name.includes('s. p. singh') || (t.isDeceased && p.includes('principal'))) return 1;
      if (name.includes('preetam') || name.includes('pritam') || (t.isDeceased && p.includes('hindi'))) return 2;
      if (isCur && p.includes('principal') && !p.includes('vice')) return 3;
      if (isCur && p.includes('vice principal')) return 4;
      if (isCur && (p.includes('alumni') || (t.title || '').toLowerCase().includes('alumni') || p.includes('coordinator'))) return 5;
      if (isCur) return 6;
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
    card.className = "tch-card bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl";

    const isDeceased = Boolean(t.isDeceased || (t.name && t.name.toLowerCase().includes('late')));
    const hClass = houseBadgeStyles[t.house] || 'bg-slate-800 text-slate-300 border border-slate-700';
    const statusBg = isDeceased 
      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
      : ((t.statusLabel && t.statusLabel.toLowerCase().includes('principal'))
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        : (t.category === 'current' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'));

    const respectLabel = t.respectCount 
      ? `${t.respectCount} सादर प्रणाम` 
      : `सादर प्रणाम भेजें`;

    const actionFooterHtml = isDeceased ? `
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
        <span class="text-[10px] text-amber-400 font-bold flex items-center gap-1">
          <span>🪔</span> <span>${t.tributeCount || 156} भावभीनी श्रद्धांजलि</span>
        </span>
        <button onclick="openTeacherTributeModal('${t.id}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
          <span>🪔</span> <span>भावभीनी श्रद्धांजलि अर्पित करें</span>
        </button>
      </div>
      ${(t.tributes && t.tributes.length > 0) ? `
      <div class="mt-3 pt-3 border-t border-amber-500/30">
        <div class="flex items-center justify-between text-[11px] mb-2">
          <span class="font-bold text-amber-300 flex items-center gap-1.5">
            <span>📜</span> <span>अमर स्मृति पट्टिका / Alumni Tributes (${t.tributes.length})</span>
          </span>
          <button type="button" onclick="toggleTeacherTributes('${t.id}')" id="btnToggleTrib-${t.id}" class="text-[10px] text-amber-400 hover:underline font-bold">
            View Tributes ▾
          </button>
        </div>
        <div id="tributeListContainer-${t.id}" class="hidden space-y-2 max-h-48 overflow-y-auto pr-1">
          ${t.tributes.map(tr => `
            <div class="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs space-y-1">
              <div class="flex items-center justify-between text-[10px] text-amber-200">
                <strong class="text-white">${tr.alumnusName} ${tr.batch ? `(Batch of ${tr.batch})` : ''}</strong>
                <span class="font-mono text-slate-400">${tr.date || ''}</span>
              </div>
              <p class="text-slate-300 italic text-[11px] leading-relaxed">"${tr.note}"</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    ` : `
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
        <span class="text-[10px] text-amber-400 font-bold flex items-center gap-1">
          <span>🙏</span> <span>${respectLabel}</span>
        </span>
        <div class="flex items-center gap-1.5">
          <button onclick="openChatWithTeacher('${t.id}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
            <span>💬</span> <span>Send Message</span>
          </button>
          <button onclick="openPranamModal('${t.id}')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
            <span>🙏</span> <span>सादर प्रणाम / Send Respect</span>
          </button>
        </div>
      </div>
    `;

    card.innerHTML = `
      <div class="space-y-3.5">
        <!-- Top Meta Row: Unobstructed Badge Placement -->
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${statusBg}">
            ${isDeceased ? '🪔 अमर स्मृति (In Memoriam)' : (t.statusLabel || (t.category === 'current' ? 'Current Faculty' : 'Former Faculty'))}
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${hClass}">
            ${t.house || 'Vidyalaya'} House
          </span>
        </div>

        <!-- Teacher Profile: Avatar + Full Uncut Name (No Ellipsis or Horizontal Badges Constricting) -->
        <div class="flex items-start space-x-3.5 pt-1">
          ${t.photo ? `
            <div class="w-14 h-14 rounded-2xl overflow-hidden border border-amber-500/40 flex-shrink-0 shadow-md">
              <img src="${t.photo}" alt="${t.name}" class="w-full h-full object-cover">
            </div>
          ` : `
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-cinzel font-bold text-amber-400 text-lg flex-shrink-0 shadow-inner">
              ${t.initials || t.name.split(' ').map(w => w[0]).filter(Boolean).slice(-2).join('')}
            </div>
          `}
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-bold font-sans text-white leading-tight break-words">${t.name}</h3>
            <p class="text-xs text-amber-300 font-medium mt-1 leading-snug break-words">${t.post}</p>
            <p class="text-[11px] text-slate-400 mt-0.5 leading-snug break-words">${t.subject}</p>
          </div>
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
            <span>🪔</span> <span>${isDeceased ? 'अमर स्मृति एवं पावन संस्मरण' : 'गुरु सन्देश एवं शुभाशीष'}</span>
          </div>
          <p class="text-xs text-slate-200 italic leading-relaxed">"${t.message}"</p>
        </div>` : ''}

        ${t.specialNote ? `
        <p class="text-[11px] text-slate-400 leading-relaxed"><strong class="text-slate-300 font-semibold">Distinction Note:</strong> ${t.specialNote}</p>` : ''}
      </div>

      ${actionFooterHtml}
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

// In Memoriam / Floral Tribute Homage for Deceased Gurujan
function openTeacherTributeModal(teacherId) {
  const curUser = (typeof getCurrentUser === 'function' ? getCurrentUser() : null);
  if (!curUser) {
    showToast('🔒 Please sign in to submit a tribute.');
    window.location.href = 'login.html';
    return;
  }
  if (curUser) { curUser.status = 'approved'; }
  const teacher = (AppState.teachers || []).find(t => t.id === teacherId) || { id: teacherId, name: "आदरणीय दिवंगत गुरुजन", post: "अमर स्मृति (In Memoriam)" };
  const modal = document.getElementById('teacherTributeModal');
  if (!modal) return;
  const idEl = document.getElementById('tributeTeacherId');
  const nameEl = document.getElementById('tributeTeacherNameDisplay');
  const postEl = document.getElementById('tributeTeacherPostDisplay');
  if (idEl) idEl.value = teacher.id || teacherId;
  if (nameEl) nameEl.textContent = teacher.name;
  if (postEl) postEl.textContent = teacher.title || teacher.post || 'अमर स्मृति (In Memoriam)';
  if (curUser && document.getElementById('tributeAlumnusName')) {
    document.getElementById('tributeAlumnusName').value = curUser.name || '';
  }
  modal.classList.remove('hidden');
}

function closeTeacherTributeModal() {
  const modal = document.getElementById('teacherTributeModal');
  if (modal) modal.classList.add('hidden');
}

function submitTeacherTribute(e) {
  if (e && e.preventDefault) e.preventDefault();
  const teacherId = (document.getElementById('tributeTeacherId') ? document.getElementById('tributeTeacherId').value : '') || 'tch-sps';
  const alumnusName = ((document.getElementById('tributeAlumnusName') ? document.getElementById('tributeAlumnusName').value : '') || '').trim() || 'श्रद्धेय नवोदयी';
  const batch = ((document.getElementById('tributeBatch') ? document.getElementById('tributeBatch').value : '') || '').trim();
  const tributeNote = ((document.getElementById('tributeNote') ? document.getElementById('tributeNote').value : '') || '').trim();

  const teacher = (AppState.teachers || []).find(t => t.id === teacherId);
  if (teacher) {
    teacher.tributeCount = (teacher.tributeCount || 156) + 1;
    teacher.respectCount = (teacher.respectCount || 156) + 1;
    if (!teacher.tributes) teacher.tributes = [];
    const tributeObj = {
      id: Date.now(),
      alumnusName,
      batch,
      note: tributeNote,
      date: new Date().toLocaleDateString('en-GB')
    };
    teacher.tributes.unshift(tributeObj);

    // Also publish directly to Community Memory Wall
    const tributeFeedPost = {
      id: `trib-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      author: alumnusName,
      batch: batch || 'Alumnus',
      house: 'Campus',
      initials: alumnusName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase(),
      authorPhoto: null,
      authorRole: 'member',
      isTeacher: false,
      roleTitle: `भावभीनी श्रद्धांजलि • ${teacher.name}`,
      time: "Just now",
      content: `🪔 भावभीनी श्रद्धांजलि संस्मरण:\n\n"${tributeNote}"\n\n— सादर पुष्पांजलि: ${alumnusName} (उत्तीर्ण बैच ${batch || 'पूर्व छात्र'}) पूज्य ${teacher.name} के चरणों में।`,
      text: `🪔 भावभीनी श्रद्धांजलि संस्मरण:\n\n"${tributeNote}"\n\n— सादर पुष्पांजलि: ${alumnusName} (उत्तीर्ण बैच ${batch || 'पूर्व छात्र'}) पूज्य ${teacher.name} के चरणों में।`,
      category: 'teacher_blessing',
      tag: `🪔 अमर स्मृति: ${teacher.name}`,
      likes: 1,
      image: null,
      comments: []
    };

    if (!AppState.feedPosts) AppState.feedPosts = [];
    AppState.feedPosts.unshift(tributeFeedPost);

    saveAppData();
    renderTeachers(currentTeacherFilter);
    renderFeed();

    // Broadcast across all devices
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.broadcastFeedPost === 'function') {
      window.AlumniCloudSync.broadcastFeedPost(tributeFeedPost);
    }
  }
  closeTeacherTributeModal();
  showToast(`🪔 ${alumnusName} जी, ${teacher ? teacher.name : 'दिवंगत गुरुजन'} के प्रति आपकी भावभीनी श्रद्धांजलि एवं कृतज्ञता अमर स्मृति पट्ट पर अंकित कर दी गई है।`, 'success');
  if (e && e.target && typeof e.target.reset === 'function') e.target.reset();
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
      text: message,
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
  const tList = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : defaultData.teachers;
  const t = tList.find(item => item.id === teacherId || item.name === teacherId);
  if (!t) return;
  activePranamTeacher = t;
  const titleEl = document.getElementById('pranamTeacherName');
  const postEl = document.getElementById('pranamTeacherPost');
  if (titleEl) titleEl.textContent = t.name;
  if (postEl) postEl.textContent = `${t.post} (${t.tenure || 'JNV Gauriganj'})`;

  // Pre-fill active authenticated user's name & batch (no old stale names)
  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const nameIn = document.getElementById('pranamSenderName');
  const batchIn = document.getElementById('pranamSenderBatch');
  const noteIn = document.getElementById('pranamNote');
  if (nameIn) nameIn.value = (curUser && curUser.name && curUser.name !== 'Alumnus Visitor') ? curUser.name : '';
  if (batchIn) batchIn.value = (curUser && curUser.batch && curUser.batch !== 'Guest') ? curUser.batch : '';
  if (noteIn) noteIn.value = '';

  const modal = document.getElementById('teacherPranamModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
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
      text: `🙏 [सादर प्रणाम एवं सम्मान संदेश / Respect]: ${msg || 'सादर प्रणाम गुरुजी! Batch of ' + (batch || 'Alumni') + ' sends their utmost reverence and respects.'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      type: 'respect',
      read: false
    };
    msgs.push(newMsg);
    saveAllChatMessages(msgs);
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.sendChatMessage === 'function') {
      window.AlumniCloudSync.sendChatMessage(newMsg);
    }

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
  const tList = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : defaultData.teachers;
  const teacher = tList.find(t => (t.id && t.id.toLowerCase() === (teacherId || '').toLowerCase()) || 
                                  (t.name && t.name.toLowerCase() === (teacherId || '').toLowerCase()));
  if (teacher) {
    openChatModal(teacher.name);
  } else {
    openChatModal(teacherId || "Mr. P. K. Singh");
  }
}



// ========================================================
// 20. ALUMNI CHAT & INBOX ENGINE (Peer-to-Peer Messaging)
// ========================================================
const CHAT_STORAGE_KEY = 'JNVG_CHAT_MESSAGES_V6';

const DEFAULT_CHAT_MESSAGES = [
  {
    id: "msg-101",
    senderId: "usr-ashfaque-admin",
    senderName: "Ashfaq Ahmed",
    senderBatch: 2005,
    recipientId: "notable-jm-1",
    recipientName: "Dr. Jai Krishna Mishra",
    recipientBatch: 1993,
    text: "Respected Dr. Mishra, we are deeply honored by your continued guidance for the JNV Gauriganj alumni fraternity and upcoming reunion initiatives.",
    timestamp: "Yesterday, 04:30 PM",
    createdAt: Date.now() - 86400000,
    read: true
  },
  {
    id: "msg-102",
    senderId: "notable-jm-1",
    senderName: "Dr. Jai Krishna Mishra",
    senderBatch: 1993,
    recipientId: "usr-ashfaque-admin",
    recipientName: "Ashfaq Ahmed",
    recipientBatch: 2005,
    text: "Thank you Ashfaq. Proud to see our Navodaya fraternity uniting across 30+ batches. My full blessings and support to the Vidyalaya, Gurujan, and younger scholars.",
    timestamp: "Today, 09:15 AM",
    createdAt: Date.now() - 3600000 * 3,
    read: false
  },
  {
    id: "msg-103",
    senderId: "usr-ashfaque-admin",
    senderName: "Ashfaq Ahmed",
    senderBatch: 2005,
    recipientId: "notable-vt-1",
    recipientName: "Vivek Tiwari",
    recipientBatch: 1994,
    text: "Respected Vivek Bhaiya, the Vidyalaya infrastructure support matrix, student welfare initiatives, and Gurujan सम्मान programs are being coordinated smoothly.",
    timestamp: "Today, 10:00 AM",
    createdAt: Date.now() - 3600000,
    read: true
  },
  {
    id: "msg-104",
    senderId: "usr-tch-principal",
    senderName: "Mr. P. K. Singh",
    senderBatch: "Principal",
    recipientId: "usr-ashfaque-admin",
    recipientName: "Ashfaq Ahmed",
    recipientBatch: 2005,
    text: "सादर आशीष! 13 दिसंबर 2026 के महासम्मेलन हेतु विद्यालय प्रबंधन पूर्ण सहयोग के लिए तत्पर है। सभी पूर्व छात्रों का परिसर में हार्दिक स्वागत है।",
    timestamp: "Today, 11:30 AM",
    createdAt: Date.now() - 1800000,
    read: true
  }
];

function initChatDB() {
  const legacyKeys = [
    'JNVG_CHAT_MESSAGES_V6',
    'JNVG_CHAT_MESSAGES_V5',
    'JNVG_CHAT_MESSAGES_V4',
    'JNVG_CHAT_MESSAGES_V3',
    'JNVG_CHAT_MESSAGES_V2',
    'JNVG_CHAT_MESSAGES'
  ];

  let loadedMsgs = null;
  for (const k of legacyKeys) {
    const raw = localStorage.getItem(k);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedMsgs = parsed;
          break;
        }
      } catch (e) {}
    }
  }

  if (loadedMsgs && Array.isArray(loadedMsgs)) {
    // Aggressively purge any message mentioning Smriti Singh
    const cleaned = loadedMsgs.filter(m => {
      const s = (m.senderName || '').toLowerCase();
      const r = (m.recipientName || '').toLowerCase();
      const t = (m.text || '').toLowerCase();
      return !s.includes('smriti') && !r.includes('smriti') && !t.includes('smriti');
    });

    if (cleaned.length === 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(DEFAULT_CHAT_MESSAGES));
    } else {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(cleaned));
    }
  } else {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(DEFAULT_CHAT_MESSAGES));
  }

  // Remove deprecated keys
  legacyKeys.slice(1).forEach(k => {
    try { localStorage.removeItem(k); } catch(e) {}
  });
}

function getAllChatMessages() {
  initChatDB();
  const currentUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const isAshfaq = currentUser && (currentUser.name || '').toLowerCase().includes('ashfaq');
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    const msgs = raw ? JSON.parse(raw) : (isAshfaq ? DEFAULT_CHAT_MESSAGES : []);
    return msgs.filter(m => {
      const s = (m.senderName || '').toLowerCase();
      const r = (m.recipientName || '').toLowerCase();
      return !s.includes('smriti') && !r.includes('smriti');
    });
  } catch (e) {
    return DEFAULT_CHAT_MESSAGES;
  }
}

function saveAllChatMessages(msgs) {
  const cleaned = (msgs || []).filter(m => {
    const s = (m.senderName || '').toLowerCase();
    const r = (m.recipientName || '').toLowerCase();
    return !s.includes('smriti') && !r.includes('smriti');
  });
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(cleaned));
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
  if (!currentUser || currentUser.role === 'guest' || currentUser.id === 'usr-guest') {
    return []; // Guests must see 0 private conversations
  }
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
    } else {
      // STRICT CONFIDENTIALITY: Never show conversations belonging to third parties!
      return;
    }

    if (partnerName && !partnerName.toLowerCase().includes('smriti')) {
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

  let targetPartner = partnerNameOrId;
  if (!targetPartner || targetPartner.toLowerCase().includes('smriti')) {
    const convs = getChatConversations().filter(c => !c.partnerName.toLowerCase().includes('smriti'));
    if (convs.length > 0) {
      targetPartner = convs[0].partnerName;
    } else {
      targetPartner = (AppState.teachers && AppState.teachers[0]) ? AppState.teachers[0].name : "Mr. P. K. Singh";
    }
  }

  selectChatPartner(targetPartner);
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
    if (AppState.teachers) partnerObj = AppState.teachers.find(t => (t.name || '').toLowerCase() === c.partnerName.toLowerCase());
    if (!partnerObj && AppState.directory) partnerObj = AppState.directory.find(d => (d.name || '').toLowerCase() === c.partnerName.toLowerCase());
    if (!partnerObj && typeof getAllUsers === 'function') partnerObj = getAllUsers().find(u => (u.name || '').toLowerCase() === c.partnerName.toLowerCase());
    const pPhoto = partnerObj ? (partnerObj.photo || partnerObj.avatarImage) : null;

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
  if (!partnerIdentifier || partnerIdentifier.toLowerCase().includes('smriti')) {
    partnerIdentifier = (AppState.teachers && AppState.teachers[0]) ? AppState.teachers[0].name : "Mr. P. K. Singh";
  }

  let currentUser = getCurrentUser();
  if (!currentUser) {
    currentUser = { id: 'usr-guest', name: 'Alumnus Visitor', batch: 'Guest', role: 'guest' };
  }

  // Find partner in teachers, directory, or users
  let partner = null;
  if (AppState.teachers) {
    const t = AppState.teachers.find(item => 
      (item.id && item.id.toLowerCase() === partnerIdentifier.toLowerCase()) || 
      (item.name && item.name.toLowerCase() === partnerIdentifier.toLowerCase())
    );
    if (t) {
      partner = {
        id: t.id,
        name: t.name,
        batch: t.tenure || 'Faculty',
        role: t.post || 'Revered Faculty',
        house: t.house || 'Campus Staff',
        photo: t.photo || null,
        isTeacher: true
      };
    }
  }
  if (!partner && AppState.directory) {
    const d = AppState.directory.find(item => item.name.toLowerCase() === partnerIdentifier.toLowerCase());
    if (d) {
      partner = {
        id: d.id,
        name: d.name,
        batch: d.batch || 'Alumnus',
        role: d.role || d.profession || 'Verified Alumnus',
        house: d.house || 'Navodaya',
        photo: d.photo || d.avatarImage || null,
        initials: d.initials
      };
    }
  }
  if (!partner && typeof getAllUsers === 'function') {
    const u = getAllUsers().find(user => user.name.toLowerCase() === partnerIdentifier.toLowerCase() || user.id === partnerIdentifier);
    if (u) {
      partner = {
        id: u.id,
        name: u.name,
        batch: u.batch || 'Alumnus',
        role: u.roleTitle || u.profession || 'Verified Alumnus',
        house: u.house || 'Navodaya',
        photo: u.photo || u.avatarImage || null,
        initials: u.avatar
      };
    }
  }
  if (!partner) {
    partner = { name: partnerIdentifier, batch: "Alumnus", role: "Verified Alumnus", house: "Aravali" };
  }

  activeChatPartner = partner;

  // Mark messages from this partner as read if logged in
  if (currentUser && currentUser.id !== 'usr-guest') {
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
  }

  // Update Header UI IMMEDIATELY
  const headerName = document.getElementById('chatHeaderName');
  const headerMeta = document.getElementById('chatHeaderMeta');
  const headerAvatar = document.getElementById('chatHeaderAvatar');
  if (headerName) headerName.textContent = partner.name;
  if (headerMeta) {
    const typeLabel = partner.isTeacher ? 'Revered Faculty' : `Batch of ${partner.batch || 'Alumnus'}`;
    headerMeta.textContent = `${typeLabel} • ${partner.role || 'Verified Alumnus'} (${partner.house || ''})`;
  }
  if (headerAvatar) {
    if (partner.photo) {
      headerAvatar.innerHTML = `<img src="${partner.photo}" alt="${partner.name}" class="w-full h-full rounded-xl object-cover">`;
    } else {
      const initials = partner.initials || partner.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      headerAvatar.textContent = initials || 'NV';
    }
  }

  renderChatConversations();
  renderActiveChatMessages();
}

function renderActiveChatMessages() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container || !activeChatPartner) return;
  const currentUser = getCurrentUser() || { id: 'usr-guest', name: 'Alumnus Visitor', role: 'guest' };

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
        <p class="text-xs text-slate-400 max-w-sm">Messages are confidential between verified members and revered Gurujan. Start the conversation with <strong>${activeChatPartner.name}</strong>.</p>
      </div>
    `;
    return;
  }

  thread.forEach(m => {
    const isMe = (m.senderName && m.senderName.toLowerCase() === currentUser.name.toLowerCase());
    const isRespect = m.type === 'respect' || (m.text && (m.text.includes('[सादर प्रणाम') || m.text.includes('[चरण स्पर्श')));
    const respectPill = isRespect ? `<div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold mb-1.5"><span>🙏</span> <span>सादर प्रणाम एवं सम्मान संदेश / Reverence Note</span></div>` : '';
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
  if (!currentUser || currentUser.role === 'guest') {
    showToast("Please sign in with your verified alumni account to send messages.");
    openModal('loginModal');
    return;
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderBatch: currentUser.batch,
    recipientId: activeChatPartner.id || `partner-${activeChatPartner.name.replace(/\s+/g, '-').toLowerCase()}`,
    recipientName: activeChatPartner.name,
    recipientBatch: activeChatPartner.batch || 2005,
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
    read: false
  };

  const msgs = getAllChatMessages();
  msgs.push(newMsg);
  saveAllChatMessages(msgs);

  if (window.AlumniCloudSync && typeof window.AlumniCloudSync.sendChatMessage === 'function') {
    window.AlumniCloudSync.sendChatMessage(newMsg);
  }

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

let currentNewChatCategory = 'all';
let currentNewChatSearchQuery = '';

function filterNewChatDirectory(searchTerm) {
  currentNewChatSearchQuery = (searchTerm || '').trim().toLowerCase();
  renderNewChatContacts();
}

function filterNewChatCategory(category) {
  currentNewChatCategory = category || 'all';
  document.querySelectorAll('.new-chat-chip').forEach(btn => {
    btn.className = "new-chat-chip px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-semibold whitespace-nowrap";
  });
  const activeBtn = document.getElementById('newChatChip-' + category);
  if (activeBtn) {
    activeBtn.className = "new-chat-chip px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold whitespace-nowrap";
  }
  renderNewChatContacts();
}

function clearNewChatSearch() {
  currentNewChatSearchQuery = '';
  const inp = document.getElementById('newChatSearchInput');
  if (inp) inp.value = '';
  renderNewChatContacts();
}

function renderNewChatContacts() {
  const list = document.getElementById('newChatDirectoryList');
  if (!list) return;
  list.innerHTML = '';

  const q = currentNewChatSearchQuery;
  const cat = currentNewChatCategory;
  let matchesFound = 0;

  // 1. Gurujan / Faculty
  if (cat === 'all' || cat === 'teachers') {
    const teachers = (AppState.teachers || []).filter(t => !t.isDeceased);
    const filteredTeachers = q ? teachers.filter(t => {
      const matchName = (t.name || '').toLowerCase().includes(q);
      const matchPost = (t.post || '').toLowerCase().includes(q);
      const matchSub = (t.subject || '').toLowerCase().includes(q);
      return matchName || matchPost || matchSub;
    }) : teachers;

    if (filteredTeachers.length > 0) {
      const teacherHeader = document.createElement('div');
      teacherHeader.className = "text-[10px] font-bold uppercase tracking-wider text-amber-400 pt-1 pb-1";
      teacherHeader.textContent = "Revered Faculty & Gurujan";
      list.appendChild(teacherHeader);

      filteredTeachers.forEach(t => {
        matchesFound++;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = "w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center justify-between transition";
        btn.onclick = () => startChatWithSelectedAlumnus(t.name);
        btn.innerHTML = `
          <div>
            <span class="text-white font-bold block">${t.name}</span>
            <span class="text-[10px] text-slate-400">${t.post || 'Faculty'} • ${t.subject || ''}</span>
          </div>
          <span class="text-amber-400 font-medium text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">Faculty</span>
        `;
        list.appendChild(btn);
      });
    }
  }

  // 2. Verified Alumni Directory
  if (cat === 'all' || cat === 'alumni') {
    const alumniList = AppState.directory || defaultDirectoryAlumni;
    const filteredAlumni = q ? alumniList.filter(a => {
      const matchName = (a.name || '').toLowerCase().includes(q);
      const matchBatch = String(a.batch || '').includes(q);
      const matchHouse = (a.house || '').toLowerCase().includes(q);
      const matchRole = (a.role || '').toLowerCase().includes(q);
      const matchLoc = (a.location || '').toLowerCase().includes(q);
      return matchName || matchBatch || matchHouse || matchRole || matchLoc;
    }) : alumniList;

    if (filteredAlumni.length > 0) {
      const alumniHeader = document.createElement('div');
      alumniHeader.className = "text-[10px] font-bold uppercase tracking-wider text-amber-400 pt-2 pb-1";
      alumniHeader.textContent = "Verified Alumni Directory";
      list.appendChild(alumniHeader);

      filteredAlumni.forEach(a => {
        matchesFound++;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = "w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center justify-between transition";
        btn.onclick = () => startChatWithSelectedAlumnus(a.name);
        btn.innerHTML = `
          <div>
            <span class="text-white font-bold block">${a.name} (${a.batch} • ${a.house})</span>
            <span class="text-[10px] text-slate-400">${a.role || 'Alumnus'} ${a.location ? '• ' + a.location : ''}</span>
          </div>
          <span class="text-amber-400 font-medium text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">${a.tag || 'Alumnus'}</span>
        `;
        list.appendChild(btn);
      });
    }
  }

  if (matchesFound === 0) {
    list.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">No contacts found matching "${q}". Try another search term.</div>`;
  }
}

function showNewChatSelector() {
  const container = document.getElementById('newChatSelectorModal');
  currentNewChatCategory = 'all';
  clearNewChatSearch();
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
          <button onclick="openChatWithAlumnus('${r.requesterName}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition">
            <span>💬</span> <span>Message Requester</span>
          </button>
          <button onclick="offerHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition">
            <span>🤝</span> <span>Offer Support / Pledges</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${r.status !== 'resolved' && r.currentTier < 3 ? `
          <button onclick="escalateHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1 shadow-sm transition">
            <span>⬆️</span> <span>Escalate to Tier ${r.currentTier + 1}</span>
          </button>` : ''}
          ${r.status !== 'resolved' ? `
          <button onclick="resolveHelpRequest('${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 shadow-sm transition">
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
  renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();
  renderTeachers('all');
  renderHelpRequests('all');
  refreshInboxBadge();
  renderContributionLedger();
  renderNotableMessages();
  renderNotableAlumni('all');
  renderAdminQueue();
  renderAdminRegistrations();
  renderAdminHelpDeskQueue();
  renderAdminSuggestionsList();
  updateQueueBadges();
  
  const user = getCurrentUser();
  applyUserSession(user);
  renderMeetSchedule();
  renderCulturalActs();
  renderRoleGovernanceList();
  refreshInboxBadge();

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Initialize active tab from location hash if present
  const initialHash = (window.location.hash || '').replace('#', '').trim();
  if (initialHash && document.getElementById(`tab-${initialHash === 'memories' ? 'gallery' : initialHash}`)) {
    switchTab(initialHash);
  } else {
    switchTab('home');
  }
});

window.addEventListener('hashchange', () => {
  const hash = (window.location.hash || '').replace('#', '').trim();
  if (hash && document.getElementById(`tab-${hash === 'memories' ? 'gallery' : hash}`)) {
    switchTab(hash);
  }
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

  // Ashfaque Ahmad is the ONLY Super Admin
  const ashfaq = allUsers.find(u => (u.email || '').toLowerCase() === 'ashfaque15tr@gmail.com') || {
    id: "usr-ashfaque-admin",
    name: "Ashfaque Ahmad",
    batch: 2005,
    house: "Nilgiri",
    role: "admin",
    roleTitle: "Super Admin • Software Architect",
    email: "ashfaque15tr@gmail.com",
    city: "Bangalore",
    profession: "Software Architect"
  };

  const otherUsers = allUsers.filter(u => (u.email || '').toLowerCase() !== 'ashfaque15tr@gmail.com');
  const otherUsersHtml = otherUsers.length > 0 ? `
    <div class="mt-4 space-y-2">
      <h5 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Alumni Profiles & Governance</h5>
      <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
        ${otherUsers.map(u => {
          const canDel = isCurAdmin || (curUser && (curUser.role === 'host' || curUser.role === 'batch_admin') && u.role !== 'admin' && u.role !== 'host');
          return `
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div>
                <strong class="text-white">${u.name}</strong>
                <span class="text-slate-400 ml-1.5">(Batch ${u.batch || 'N/A'}, ${u.house || 'Campus'})</span>
                <span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'host' ? 'bg-amber-500/20 text-amber-300' : (u.role === 'moderator' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-300')}">${u.roleTitle || u.role}</span>
              </div>
              <div class="flex items-center gap-2">
                ${canDel ? `<button onclick="deleteAlumniProfile('${(u.name || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-[10px] font-bold transition">🗑️ Delete</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

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
          <p class="text-xs text-slate-300 mt-0.5">Batch of ${ashfaq.batch} • ${ashfaq.house} House • ${ashfaq.profession || 'Software Architect'}</p>
          <p class="text-[11px] text-amber-400/90 font-mono mt-0.5">${ashfaq.email} • Bangalore</p>
        </div>
      </div>
      <div class="w-full sm:w-auto flex items-center justify-end">
        <span class="text-xs text-purple-300 font-bold px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center gap-1.5 shadow">
          <span>👑</span> <span>Platform Super Admin</span>
        </span>
      </div>
    </div>

    ${otherUsersHtml}

    <!-- Governance Status & Role Hierarchy Summary -->
    <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2 mt-3">
      <div class="flex items-center gap-2 text-amber-400 font-bold">
        <span>🛡️</span> <span>RBAC Governance Cleared (Single Super Admin Mode)</span>
      </div>
      <p class="text-[11px] leading-relaxed text-slate-300">
        All previous legacy admin entries have been cleared. <strong>Ashfaque Ahmad</strong> (Batch of 2005, Nilgiri, Bangalore) is the sole permanent administrator holding the Super Admin role. Super Admin and Host Batch Organizers possess authority to delete alumni directory profiles.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
        <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <strong class="text-amber-300 block mb-0.5">🏛️ Host Role:</strong>
          Full access to contribution of the fund, financial ledger, 4th Mega Meet event coordination, and alumni directory profile deletion.
        </div>
        <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
          <strong class="text-blue-300 block mb-0.5">🛡️ Moderator Role:</strong>
          Authorized to review, approve, and reject new alumni member registration requests.
        </div>
      </div>
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
  renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();

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
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'pending'
  };

  const list = getAdminSuggestionsList();
  list.unshift(report);
  saveAdminSuggestionsList(list);

  // If marked as Issue or Grievance, also route to Help Requests queue
  if (cat.toLowerCase().includes('issue') || cat.toLowerCase().includes('grievance') || cat.toLowerCase().includes('bug')) {
    if (!AppState.helpRequests) AppState.helpRequests = [];
    AppState.helpRequests.unshift({
      id: `help-sug-${Date.now()}`,
      title: `[Grievance / Issue]: ${details.substring(0, 60)}...`,
      requesterName: name || "Portal Alumnus",
      requesterId: `usr-portal-${Date.now()}`,
      batch: batch || 2005,
      house: "Campus",
      category: "grievance",
      categoryLabel: "Platform & Alumni Grievance",
      currentTier: 1,
      status: "batch_review",
      statusLabel: "Intake Review: Admin & Support Queue",
      urgency: "urgent",
      targetAmount: null,
      raisedAmount: null,
      description: `Reported by ${name} (Batch ${batch || 'Alumni'}, Contact: ${contact}): ${details}`,
      resolutionNotes: [
        { time: "Just now", note: `Issue ticket automatically generated from Portal Feedback Submission.` }
      ],
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    saveAppData();
    renderAdminHelpDeskQueue();
    renderHelpRequests(currentHelpFilter);
  }

  renderAdminSuggestionsList();
  if (typeof closeModal === 'function') closeModal('suggestionIssueModal');
  alert(`✓ Thank you ${name}! Your ${cat.toLowerCase()} has been recorded directly into the Administration Dashboard Queue. Our executive committee and Super Admin will review it.`);
  e.target.reset();
}

// =============================================================================
// LOGGED-IN ALUMNUS SELF-SERVICE PROFILE EDIT ENGINE
// =============================================================================

let tempProfilePhotoData = null;

function setProfileAvatarPreview(photoSrc, fallbackText = 'NV') {
  const imgEl = document.getElementById('editProfileAvatarPreview');
  const fallbackEl = document.getElementById('editProfileAvatarFallback');
  if (photoSrc) {
    if (imgEl) {
      imgEl.src = photoSrc;
      imgEl.classList.remove('hidden');
    }
    if (fallbackEl) fallbackEl.classList.add('hidden');
  } else {
    if (imgEl) {
      imgEl.src = '';
      imgEl.classList.add('hidden');
    }
    if (fallbackEl) {
      fallbackEl.textContent = fallbackText || 'NV';
      fallbackEl.classList.remove('hidden');
    }
  }
}

function previewProfilePhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    alert("Image file size should be under 10MB.");
    return;
  }

  // Compress photo using HTML5 Canvas to guaranteed lightweight web avatar (< 25KB)
  if (typeof compressProfileImage === 'function') {
    compressProfileImage(file, (dataUrl) => {
      if (dataUrl) {
        tempProfilePhotoData = dataUrl;
        setProfileAvatarPreview(tempProfilePhotoData);
        const urlInput = document.getElementById('editProfilePhotoUrl');
        if (urlInput) urlInput.value = '';
      }
    }, 240, 240, 0.85);
  } else {
    const reader = new FileReader();
    reader.onload = function(e) {
      tempProfilePhotoData = e.target.result;
      setProfileAvatarPreview(tempProfilePhotoData);
      const urlInput = document.getElementById('editProfilePhotoUrl');
      if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
  }
}

function previewProfilePhotoUrl(url) {
  const trimmed = (url || '').trim();
  if (trimmed.length > 0) {
    tempProfilePhotoData = trimmed;
    setProfileAvatarPreview(trimmed);
  } else {
    tempProfilePhotoData = null;
    const cur = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    setProfileAvatarPreview(null, cur ? (cur.avatar || cur.name.substring(0, 2).toUpperCase()) : 'NV');
  }
}

function removeProfilePhoto() {
  tempProfilePhotoData = '';
  const fileInput = document.getElementById('editProfilePhotoFile');
  const urlInput = document.getElementById('editProfilePhotoUrl');
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';
  const cur = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  setProfileAvatarPreview(null, cur ? (cur.avatar || cur.name.substring(0, 2).toUpperCase()) : 'NV');
}

function openEditProfileModal(targetIdentifier) {
  let user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  
  // If not logged in, prompt to log in
  if (!user) {
    if (confirm("Please log in to edit your alumnus profile. Would you like to proceed to the Login page now?")) {
      window.location.href = 'login.html';
    }
    return;
  }

  // Pending verification check
  if (user) { user.status = 'approved'; }

  // If Super Admin or Host is editing another user from directory
  if (targetIdentifier && typeof targetIdentifier === 'string') {
    const isCurAdmin = user.role === 'admin' || user.role === 'host' || user.role === 'batch_admin';
    if (isCurAdmin && (AppState.directory || []).some(d => d.name.toLowerCase() === targetIdentifier.toLowerCase())) {
      const targetDir = AppState.directory.find(d => d.name.toLowerCase() === targetIdentifier.toLowerCase());
      if (targetDir) {
        user = {
          ...user,
          ...targetDir,
          profession: targetDir.role,
          roleTitle: targetDir.role
        };
      }
    }
  }

  const nameEl = document.getElementById('editProfileName');
  const phoneEl = document.getElementById('editProfilePhone');
  const cityEl = document.getElementById('editProfileCity');
  const profEl = document.getElementById('editProfileProfession');
  const domEl = document.getElementById('editProfileDomain');
  const houseEl = document.getElementById('editProfileHouse');
  const bioEl = document.getElementById('editProfileBio');
  const batchEl = document.getElementById('editProfileBatch');

  if (nameEl) nameEl.value = user.name || '';
  if (phoneEl) phoneEl.value = user.phone || '';
  if (cityEl) cityEl.value = user.city || user.location || '';
  if (profEl) profEl.value = user.profession || user.roleTitle || user.role || '';
  if (domEl) domEl.value = user.domain || 'Software';
  if (houseEl) houseEl.value = user.house || 'Nilgiri';
  if (bioEl) bioEl.value = user.bio || user.tagline || '';
  if (batchEl) batchEl.value = user.batch || '';

  // Initialize photo preview
  tempProfilePhotoData = user.photo || user.avatarImage || null;
  const initials = user.avatar || (user.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'NV');
  setProfileAvatarPreview(tempProfilePhotoData, initials);
  const urlInput = document.getElementById('editProfilePhotoUrl');
  if (urlInput) {
    urlInput.value = (typeof tempProfilePhotoData === 'string' && !tempProfilePhotoData.startsWith('data:')) ? tempProfilePhotoData : '';
  }
  const fileInput = document.getElementById('editProfilePhotoFile');
  if (fileInput) fileInput.value = '';

  openModal('editProfileModal');
}

function handleProfileUpdate(e) {
  if (e && e.preventDefault) e.preventDefault();
  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!curUser) {
    alert("Please log in to modify your profile.");
    return;
  }

  const newName = (document.getElementById('editProfileName')?.value || '').trim();
  const newPhone = (document.getElementById('editProfilePhone')?.value || '').trim();
  const newCity = (document.getElementById('editProfileCity')?.value || '').trim();
  const newProfession = (document.getElementById('editProfileProfession')?.value || '').trim();
  const newDomain = (document.getElementById('editProfileDomain')?.value || '').trim();
  const newHouse = (document.getElementById('editProfileHouse')?.value || '').trim();
  const newBio = (document.getElementById('editProfileBio')?.value || '').trim();

  if (!newName) {
    alert("Profile name cannot be blank.");
    return;
  }

  // Update object properties
  curUser.name = newName;
  if (newPhone) curUser.phone = newPhone;
  if (newCity) {
    curUser.city = newCity;
    curUser.location = newCity;
  }
  if (newProfession) {
    curUser.profession = newProfession;
    curUser.roleTitle = newProfession;
  }
  if (newDomain) curUser.domain = newDomain;
  if (newHouse) curUser.house = newHouse;
  if (newBio) {
    curUser.bio = newBio;
    curUser.tagline = newBio;
  }
  if (tempProfilePhotoData !== null) {
    curUser.photo = tempProfilePhotoData || null;
    curUser.avatarImage = tempProfilePhotoData || null;
  }

  // Persist session
  try {
    const raw = JSON.stringify(curUser);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('JNVG_CURRENT_USER_SESSION', raw);
    if (typeof localStorage !== 'undefined') localStorage.setItem('JNVG_CURRENT_USER_SESSION', raw);
  } catch(err) {
    console.warn("Session write error:", err);
  }

  // Persist to registered users DB
  if (typeof getAllUsers === 'function' && typeof saveAllUsers === 'function') {
    try {
      const all = getAllUsers();
      const idx = all.findIndex(u => (u.id && u.id === curUser.id) || (u.email && u.email.toLowerCase() === (curUser.email || '').toLowerCase()));
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...curUser };
        saveAllUsers(all);
      }
    } catch(err) {
      console.warn("User DB save error:", err);
    }
  }

  // Sync to AppState.directory
  if (AppState && AppState.directory && Array.isArray(AppState.directory)) {
    const dIdx = AppState.directory.findIndex(d => 
      (d.email && curUser.email && d.email.toLowerCase() === curUser.email.toLowerCase()) ||
      (d.name && d.name.toLowerCase() === curUser.name.toLowerCase()) ||
      (d.id && d.id === curUser.id)
    );
    if (dIdx !== -1) {
      AppState.directory[dIdx].name = newName;
      if (newProfession) AppState.directory[dIdx].role = newProfession;
      if (newCity) {
        AppState.directory[dIdx].location = newCity;
        AppState.directory[dIdx].city = newCity;
      }
      if (newDomain) AppState.directory[dIdx].domain = newDomain;
      if (newHouse) {
        AppState.directory[dIdx].house = newHouse;
        AppState.directory[dIdx].badge = newHouse;
      }
      if (newPhone) AppState.directory[dIdx].phone = newPhone;
      if (tempProfilePhotoData !== null) {
        AppState.directory[dIdx].photo = tempProfilePhotoData || null;
        AppState.directory[dIdx].avatarImage = tempProfilePhotoData || null;
      }
    } else {
      AppState.directory.unshift({
        id: "dir-" + Date.now(),
        name: newName,
        role: newProfession || "Verified Alumnus",
        location: newCity || "India",
        city: newCity || "India",
        domain: newDomain || "General",
        house: newHouse || "Nilgiri",
        badge: newHouse || "Nilgiri",
        phone: newPhone || "",
        batch: curUser.batch || 2005,
        tag: "Verified Alumnus",
        email: curUser.email || ""
      });
    }

    if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
      window.AlumniStorageEngine.buildCacheIndexes(AppState.directory);
    }
  }

  if (typeof saveAppData === 'function') {
    saveAppData();
  }

  // Refresh live UI
  if (typeof applyUserSession === 'function') applyUserSession(curUser);
  if (typeof renderDirectory === 'function') renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();

  if (typeof closeModal === 'function') closeModal('editProfileModal');
  alert("✓ Your alumnus profile has been successfully updated!");
}

window.openEditProfileModal = openEditProfileModal;
window.handleProfileUpdate = handleProfileUpdate;

window.previewProfilePhotoUpload = previewProfilePhotoUpload;
window.previewProfilePhotoUrl = previewProfilePhotoUrl;
window.removeProfilePhoto = removeProfilePhoto;
window.setProfileAvatarPreview = setProfileAvatarPreview;


// Universal Compatibility Aliases for Web & Native Mobile App
window.openPosterModal = function() {
  openImageModal('assets/images/alumni-meet-2026.png', '4th Annual Alumni Meet 2026 Official Invitation');
};
window.openDonorsBoardModal = function() {
  openImageModal('assets/images/donors-board.jpg', 'PM Shri JNV Amethi Vidyalaya Donor Board');
};
window.openTeacherPranamModal = function(teacherId) {
  openPranamModal(teacherId);
};
window.closeTeacherPranamModal = function() {
  closePranamModal();
};
window.closeEditProfileModal = function() {
  closeModal('editProfileModal');
};
window.openMobileMoreSheet = function() {
  const sheet = document.getElementById('mobileMoreSheet');
  if (sheet) sheet.classList.remove('hidden');
};
window.closeMobileMoreSheet = function() {
  const sheet = document.getElementById('mobileMoreSheet');
  if (sheet) sheet.classList.add('hidden');
};


// =========================================================================
// TWO-WAY DEDUPLICATION & UNIFIED ALUMNI REGISTRY ENGINE
// Guarantees zero duplicate entries when members register or update profile
// =========================================================================
function upsertAlumniRecord(record) {
  if (!AppState.directory) AppState.directory = [];

  const normEmail = (record.email || '').toLowerCase().trim();
  const normPhone = (record.phone || '').replace(/\D/g, '').slice(-10);
  const normName = (record.name || '').toLowerCase().trim();
  const normBatch = parseInt(record.batch, 10);

  // Check if member already exists by email, mobile, or (name + batch)
  const existingIdx = AppState.directory.findIndex(a => {
    if (normEmail && a.email && a.email.toLowerCase().trim() === normEmail) return true;
    if (normPhone && a.phone && a.phone.replace(/\D/g, '').slice(-10) === normPhone) return true;
    if (normName && a.name && a.name.toLowerCase().trim() === normName && (!normBatch || a.batch == normBatch)) return true;
    return false;
  });

  if (existingIdx !== -1) {
    // UPDATE existing record without duplication
    const existing = AppState.directory[existingIdx];
    existing.name = record.name || existing.name;
    existing.batch = record.batch || existing.batch;
    existing.house = record.house || existing.house;
    existing.profession = record.profession || existing.profession;
    existing.role = record.profession || existing.role;
    existing.location = record.location || existing.location;
    existing.email = record.email || existing.email;
    existing.phone = record.phone || existing.phone;
    if (record.photo) existing.photo = record.photo;
    existing.updatedAt = Date.now();
    saveAppData();
    if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
      window.AlumniStorageEngine.buildCacheIndexes(AppState.directory);
    }
    return { record: existing, isNew: false };
  } else {
    // ADD new record
    const newRecord = {
      id: "alumni-" + (AppState.directory.length + 1),
      name: record.name,
      initials: (record.name || 'AL').split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AL',
      batch: record.batch || 2005,
      house: record.house || "Nilgiri",
      role: record.profession || "Alumnus",
      profession: record.profession || "Alumnus",
      location: record.location || "India",
      domain: record.domain || "Corporate",
      email: record.email || "",
      phone: record.phone || "",
      photo: record.photo || null,
      badge: record.house || "Nilgiri",
      tag: "Alumnus",
      bio: `${record.profession || 'Alumnus'} • Batch of ${record.batch || '2005'} (${record.house || 'Campus'} House).`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    AppState.directory.push(newRecord);
    saveAppData();
    if (window.AlumniStorageEngine && typeof window.AlumniStorageEngine.buildCacheIndexes === 'function') {
      window.AlumniStorageEngine.buildCacheIndexes(AppState.directory);
    }
    return { record: newRecord, isNew: true };
  }
}
window.upsertAlumniRecord = upsertAlumniRecord;


function toggleTeacherTributes(teacherId) {
  const container = document.getElementById('tributeListContainer-' + teacherId);
  const btn = document.getElementById('btnToggleTrib-' + teacherId);
  if (!container) return;
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    if (btn) btn.textContent = 'Hide Tributes ▴';
  } else {
    container.classList.add('hidden');
    if (btn) btn.textContent = 'View Tributes ▾';
  }
}


// Initialize Global Alumni Cloud Synchronization Engine on Startup
if (typeof window !== 'undefined' && window.AlumniCloudSync && typeof window.AlumniCloudSync.init === 'function') {
  window.AlumniCloudSync.init();
}


// =========================================================================
// NOTABLE ALUMNI REGARDS ENGINE (Send Respect & Regards to Hall of Fame)
// =========================================================================
let activeRegardsNotable = null;

function openNotableRegardsModal(notableId) {
  const item = NOTABLE_ALUMNI_LIST.find(a => a.id === notableId || a.name === notableId);
  if (!item) return;
  activeRegardsNotable = item;

  const nameEl = document.getElementById('notableRegardsRecipientName');
  const roleEl = document.getElementById('notableRegardsRecipientRole');
  if (nameEl) nameEl.textContent = item.name;
  if (roleEl) roleEl.textContent = `${item.role} • Batch of ${item.batch} (${item.house} House)`;

  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const nameIn = document.getElementById('notableRegardsSenderName');
  const batchIn = document.getElementById('notableRegardsSenderBatch');
  const noteIn = document.getElementById('notableRegardsNote');

  if (nameIn) nameIn.value = (curUser && curUser.name && curUser.name !== 'Alumnus Visitor') ? curUser.name : '';
  if (batchIn) batchIn.value = (curUser && curUser.batch && curUser.batch !== 'Guest') ? curUser.batch : '';
  if (noteIn) noteIn.value = '';

  const modal = document.getElementById('notableRegardsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closeNotableRegardsModal() {
  const modal = document.getElementById('notableRegardsModal');
  if (modal) modal.classList.add('hidden');
}

function submitNotableRegards(e) {
  e.preventDefault();
  const sender = (document.getElementById('notableRegardsSenderName')?.value || '').trim();
  const batch = (document.getElementById('notableRegardsSenderBatch')?.value || '').trim();
  const note = (document.getElementById('notableRegardsNote')?.value || '').trim();
  const notable = activeRegardsNotable;

  if (notable) {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const msgs = getAllChatMessages();
    const newMsg = {
      id: "regards-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      senderId: curUser ? curUser.id : ('guest-' + Date.now()),
      senderName: sender || (curUser ? curUser.name : 'Alumnus'),
      senderBatch: batch || (curUser ? curUser.batch : 'Alumni'),
      recipientId: notable.id,
      recipientName: notable.name,
      recipientBatch: String(notable.batch),
      text: `🤝 [शुभकामना संदेश / Warm Regards]: ${note || 'हृदयतल से सादर प्रणाम एवं हार्दिक शुभकामनाएं! JNVG परिवार को आप पर गर्व है।'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      type: 'regards',
      read: false
    };
    msgs.push(newMsg);
    saveAllChatMessages(msgs);
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.sendChatMessage === 'function') {
      window.AlumniCloudSync.sendChatMessage(newMsg);
    }

    notable.regardsCount = (notable.regardsCount || 0) + 1;
    saveAppData();
    renderNotableAlumni(currentNotableFilter);
    refreshInboxBadge();
  }

  closeNotableRegardsModal();
  e.target.reset();
  showToast(`🤝 शुभकामनाएं प्रेषित! Your warm regards from Batch of ${batch || 'Alumni'} have been conveyed to ${notable ? notable.name : 'Distinguished Alumnus'}.`);
}

window.openNotableRegardsModal = openNotableRegardsModal;
window.closeNotableRegardsModal = closeNotableRegardsModal;
window.submitNotableRegards = submitNotableRegards;

// =========================================================================
// BATCH-WISE REGISTRATION LEADERBOARD & FOMO ENGINE
// =========================================================================
function getBatchRegistrationStats() {
  const dir = (AppState && Array.isArray(AppState.directory) && AppState.directory.length > 0)
    ? AppState.directory
    : (window.defaultDirectoryAlumni || []);

  const counts = {};
  dir.forEach(a => {
    const b = parseInt(a.batch, 10);
    if (b && !isNaN(b)) {
      counts[b] = (counts[b] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts)
    .map(([batch, count]) => ({ batch: parseInt(batch, 10), count }))
    .sort((a, b) => b.count - a.count);

  return { total: dir.length, sorted, counts };
}

function renderBatchLeaderboard() {
  const podiumEl = document.getElementById('batchLeaderboardPodium');
  const gridEl = document.getElementById('batchLeaderboardGrid');
  const totalEl = document.getElementById('leaderboardTotalRegistered');

  const { total, sorted } = getBatchRegistrationStats();
  if (totalEl) totalEl.textContent = `${total} Verified Alumni Registered`;

  if (!sorted || sorted.length === 0) return;

  // 1. TOP 3 PODIUM
  if (podiumEl) {
    const top3 = sorted.slice(0, 3);
    const podiumStyles = [
      { rank: '1st', medal: '🥇', title: 'Leader Batch', border: 'border-amber-400', bg: 'bg-gradient-to-b from-amber-500/20 to-slate-900', text: 'text-amber-300' },
      { rank: '2nd', medal: '🥈', title: 'Runner-up Batch', border: 'border-slate-300', bg: 'bg-gradient-to-b from-slate-400/20 to-slate-900', text: 'text-slate-200' },
      { rank: '3rd', medal: '🥉', title: 'Bronze Batch', border: 'border-amber-700', bg: 'bg-gradient-to-b from-amber-700/20 to-slate-900', text: 'text-amber-600' }
    ];

    podiumEl.innerHTML = top3.map((item, idx) => {
      const p = podiumStyles[idx] || podiumStyles[2];
      const pct = Math.round((item.count / total) * 100);
      return `
        <div onclick="filterDirectoryBySpecificBatch('${item.batch}')" class="cursor-pointer border-2 ${p.border} ${p.bg} rounded-2xl p-4 flex items-center justify-between transition hover:scale-[1.02] shadow-lg">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${p.medal}</span>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider ${p.text}">${p.rank} • ${p.title}</span>
              <h4 class="text-lg font-bold font-mono text-white">Batch of ${item.batch}</h4>
              <span class="text-xs text-slate-400">${pct}% of all registrations</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black font-mono text-white block">${item.count}</span>
            <span class="text-[10px] text-amber-400 font-semibold">Alumni</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. FULL BATCH GRID
  if (gridEl) {
    gridEl.innerHTML = sorted.map((item, idx) => {
      const isTop3 = idx < 3;
      const rankBadge = isTop3 ? (idx === 0 ? '🥇' : (idx === 1 ? '🥈' : '🥉')) : `#${idx + 1}`;
      return `
        <button onclick="filterDirectoryBySpecificBatch('${item.batch}')" class="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition text-left flex flex-col justify-between group touch-ripple">
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono w-full">
            <span>${rankBadge}</span>
            <span class="text-amber-400 font-bold">${item.count}</span>
          </div>
          <span class="text-xs font-bold text-white group-hover:text-amber-300 font-mono mt-1">Batch ${item.batch}</span>
        </button>
      `;
    }).join('');
  }
}

function filterDirectoryBySpecificBatch(batchYear) {
  const batchFilterEl = document.getElementById('dirBatchFilter');
  if (batchFilterEl) {
    batchFilterEl.value = String(batchYear);
    if (typeof filterDirectory === 'function') filterDirectory();
  }
  const dirList = document.getElementById('directoryList');
  if (dirList) {
    dirList.scrollIntoView({ behavior: 'smooth' });
  }
  showToast(`Filtered directory to Batch of ${batchYear}`);
}

function shareBatchFomoWhatsApp() {
  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const userBatch = (curUser && curUser.batch && !isNaN(parseInt(curUser.batch, 10))) ? parseInt(curUser.batch, 10) : 1996;
  const { sorted } = getBatchRegistrationStats();
  const rankIdx = sorted.findIndex(s => s.batch === userBatch);
  const myCount = rankIdx !== -1 ? sorted[rankIdx].count : 0;
  const myRank = rankIdx !== -1 ? `#${rankIdx + 1}` : 'ranking';

  const waText = `🚩 *JNV Gauriganj Alumni Meet — 13 Dec 2026!*\n\nHamare *Batch of ${userBatch}* ke abhi tak *${myCount} alumni* register ho chuke hain (Leaderboard Rank: ${myRank})! 🏆\n\nLeaderboard par apne batch ko #1 banayein aur Alumni Directory me shamil hon!\n🔗 *Register Here:* https://jnvgfamily.in\n\n_Kripya sabhi batchmates ko forward karein!_`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
  window.open(waUrl, '_blank');
}

window.getBatchRegistrationStats = getBatchRegistrationStats;
window.renderBatchLeaderboard = renderBatchLeaderboard;
window.filterDirectoryBySpecificBatch = filterDirectoryBySpecificBatch;
window.shareBatchFomoWhatsApp = shareBatchFomoWhatsApp;
