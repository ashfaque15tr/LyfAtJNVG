# JNVGFamily • Jawahar Navodaya Vidyalaya Alumni Association Platform
**Official Platform for JNV Gauriganj (Amethi / Sultanpur) • [jnvgfamily.in](https://jnvgfamily.in)**  
**Mobile App (Google Play Store & Apple App Store):** `JNVGFamily` (`org.jnvalumni.gauriganj`)

Motto: **।। प्रज्ञानं ब्रह्म ।।** • *"हमी नवोदय हो"* (Hami Navodaya Ho)  
Established: **1986** (Pioneer 1st Batch Admitted 1986, Passed out 1993) • Vidyalaya (School Code: 74003)

---

## 🏛️ Authentic 4 House System & Color Coding (NVS Standard Mapping)

In honour of the heritage of Jawahar Navodaya Vidyalaya, Gauriganj:

| Current House Name | Historical / Old Name | Authentic House Color | Theme & Accents |
| :--- | :--- | :--- | :--- |
| **Arawali (अरावली)** | **Ashok House (अशोक)** | **Red** | Crimson / Red (`#dc2626`) |
| **Shivalik (शिवालिक)** | **Raman & Shivaji House (रमन और शिवाजी)** | **Blue** | Royal Blue (`#2563eb`) |
| **Udaigiri (उदयगिरि)** | **Subhash House (सुभाष)** | **Yellow** | Golden Yellow (`#ca8a04` / `#eab308`) |
| **Nilgiri (नीलगिरि)** | **Tagore House (टैगोर)** | **Green** | Forest Green (`#16a34a`) |

> **Heritage Milestone:** In the founding years, there were previously **Sarojini House** and **Priyadarshini House** for girls, which were subsequently unified into Arawali, Nilgiri, Shivalik, and Udaigiri for complete fraternity and unity.

---

## 🚀 Two Distinct Independent Channels

The platform is engineered as two independent channels, each tailored for its specific audience:

```
D:\project\JNVAlumini\
├── login.html                   # Real Authentication Gateway (Sign In / Registration)
├── index.html                   # Desktop Web Portal (Widescreen, Enterprise Admin Ledger)
├── mobile_app/                  # Dedicated Native Mobile Channel
│   ├── index.html               # Mobile App UI (Bottom Nav, Touch FAB, Native Drawers)
│   ├── capacitor.config.json    # Store package IDs, splash screens, push notification config
│   ├── android/
│   │   └── AndroidManifest.xml  # Target SDK 34, camera & storage permissions, deep links
│   └── ios/
│       └── Info.plist           # iOS 16+ App Store Privacy manifests & usage strings
├── STORE_DEPLOYMENT_GUIDE.md    # Step-by-Step Google Play & Apple App Store Guide
├── run_desktop_portal.bat       # 1-Click Launcher for Desktop Web Portal
├── run_mobile_app.bat           # 1-Click Launcher for Native Mobile App Channel
└── run_app.bat                  # Interactive Launcher Menu
```

---

## 🔐 1. Real Authentication & Role-Based Access Control (RBAC)

The site features a real authentication gateway (`login.html`) and session engine (`assets/js/auth.js`):

### Two-Factor Authentication (2FA) & Account Security:
1. **🛡️ Two-Factor Authentication (2FA) with OTP Verification**:
   - New alumni registrations trigger automatic 6-digit cryptographic OTP dispatch via simulated SMS & email.
   - Includes real-time 10-minute expiry countdown timer and 1-click **"⚡ Auto-Fill Code"** convenience button for zero-friction local testing.
   - Unverified accounts cannot proceed to pending approval queues until 2FA OTP is verified.
2. **🔑 Password Reconfirmation**:
   - Both Registration and Password Reset require **Create Password** and **Confirm Password** fields with real-time equality match validation (`pass === confirmPass`) and minimum 6-character length security check.
3. **🔄 Forgot Password Mechanism**:
   - Registered members who forget their password can reset it directly from the login gateway:
     - **Step 1:** Enter registered Email or Phone. Account existence is verified in the alumni database.
     - **Step 2:** Secure 2FA OTP code is dispatched. User enters the 6-digit OTP, sets the new password, and reconfirms it.
     - **Step 3:** Password is encrypted and updated directly in the local alumni database, immediately pre-filling credentials for instant sign-in.

### Available User Roles & 1-Click Demo Accounts:
1. **👑 Super Admin (`admin@jnvalumni.org` / `password123`)**:
   - Dr. Amitabh Singh (Batch 1998, Shivalik, Senior Neurosurgeon).
   - Full system controls: Membership application approvals, audited financial ledger for all batches, content moderation queue.
2. **🏛️ Host Batch 1996 Admin (`batch1996@jnvalumni.org` / `password123`)**:
   - Smriti Singh (Batch 1996, Aravali, General Secretary).
   - Dedicated batch tools: Host Batch appeal controls, Batch 1996 contribution audit, attendee management.
3. **🛡️ Content Moderator (`moderator@jnvalumni.org` / `password123`)**:
   - Priya Mishra (Batch 2014, Aravali, Staff Cloud Architect).
   - Semi-admin controls: Approve/reject memory wall stories, photo submissions, and cultural performance acts.
4. **🎓 Verified Alumni Member (`member@jnvalumni.org` / `password123`)**:
   - Ramesh Yadav (Batch 2008, Shivalik, Senior Software Engineer).
   - Member access: RSVP for 13 Dec 2026 Mega Meet, Alumni Welfare Fund with UTR verification & official receipt, searchable directory.
5. **📝 New Member Registration (`login.html` > Register)**:
   - Prospective members register with Name, Batch, House, Contact, Profession, City, Password, and Confirm Password.
   - Verified via 2FA OTP, then placed in `Pending Verification` until approved by Batch Admin & Super Admin. Once approved, their login is activated and their profile is published to the Alumni Directory.

---

## 💻 2. Channel A: Desktop Web Portal

- Launch via: **`run_desktop_portal.bat`**
- Designed for desktop monitors and laptop screens with full widescreen layout.
- Features:
  - Header profile display with real name, batch, house, and **Sign Out** button.
  - Complete uncropped panoramic campus building photo with 4 house flags.
  - 4th Annual Mega Meet 2026 countdown & RSVP synchronization.
  - **Alumni Welfare Fund**: Mandatory payment verification (requires UTR number and payment confirmation checkbox before receipt generation).
  - **Batch-wise Contribution Ledger**: Audited transparent table showing who contributed, batch totals, and instant receipt viewing.
  - **Alumni Directory**: Dynamic directory rendered live with instant search and batch/domain filtering.
  - **Guru Vandana**: Tribute to Dr. S. K. Chaudhary Sir, Legendary Varshney Sir (PET Sir), and Sh. Mahendra Singh Rawat.
  - **Photo Gallery & Lightbox Viewer**.

---

## 📱 3. Channel B: Dedicated Native Mobile App

- Launch via: **`run_mobile_app.bat`** (opens in phone dimensions `400x860`).
- Located in: `D:\project\JNVAlumini\mobile_app\`.
- Designed strictly with **Native Mobile UX**:
  - Fixed **Bottom Navigation Bar** (`Home`, `Meet '26`, `Fund`, `Stories`, `Directory`).
  - Mobile safe area inset management for iPhone notches and Android system bars.
  - Quick touch tiers for instant UPI payments (`jnvalumni.gauriganj@sbi`).
  - Mobile photo attachment for community memory sharing.
  - User profile drawer with fast account switching.

### 🛍️ Google Play Store & Apple App Store Readiness
- Built with **Capacitor 5/6** cross-platform container.
- Package / Bundle Identifier: **`org.jnvalumni.gauriganj`**.
- Configured with `capacitor.config.json`, `android/AndroidManifest.xml` (Target SDK 34), and `ios/Info.plist` (App Store privacy strings).
- Complete compilation and store submission instructions are detailed in [`STORE_DEPLOYMENT_GUIDE.md`](file:///D:/project/JNVAlumini/STORE_DEPLOYMENT_GUIDE.md).

---

## 🚀 How to Launch Locally

You can launch either or both channels with zero configuration:
- Double-click **`run_app.bat`** for the interactive launcher menu.
- Double-click **`run_desktop_portal.bat`** to start directly in the Desktop Web Portal.
- Double-click **`run_mobile_app.bat`** to start directly in the Native Mobile App Channel.
