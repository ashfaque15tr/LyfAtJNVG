# Google Play Store & Apple App Store Deployment Guide
**Jawahar Navodaya Vidyalaya Alumni Association Mobile App**  
**Package / Bundle ID:** `org.jnvalumni.gauriganj`  
**App Name:** JNV Gauriganj Alumni

---

## 📱 Cross-Platform Architecture Overview

The mobile application is located in `D:\project\JNVAlumini\mobile_app\` and configured using **Capacitor 5 / 6**, the official enterprise hybrid bridge used to deploy web-first mobile apps directly to both the **Google Play Store** and **Apple App Store** with 100% native performance.

```
D:\project\JNVAlumini\
├── login.html                   # Enterprise Authentication Gateway (Sign In / Register)
├── index.html                   # Desktop Web Portal (Widescreen, Enterprise Admin Ledger)
├── mobile_app/                  # Dedicated Native Mobile Channel
│   ├── index.html               # Mobile App UI (Bottom Nav, Touch FAB, Native Drawers)
│   ├── capacitor.config.json    # Store package IDs, splash screens, push notification config
│   ├── android/
│   │   └── AndroidManifest.xml  # Target SDK 34, camera & storage permissions, deep links
│   └── ios/
│       └── Info.plist           # iOS 16+ App Store Privacy manifests & usage strings
├── run_desktop_portal.bat       # Windows Launcher for Desktop Portal
└── run_mobile_app.bat           # Windows Launcher for Dedicated Mobile App
```

---

## 🤖 1. Publishing to Google Play Store (Android)

### Prerequisites:
- A [Google Play Console Developer Account](https://play.google.com/console) ($25 one-time fee).
- Android Studio installed on your computer.

### Step-by-Step Build & Publish Process:

#### Step 1: Initialize Android Native Project
From your terminal inside `D:\project\JNVAlumini\mobile_app`:
```bash
# Install Capacitor CLI if needed
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize and sync the Android container
npx cap add android
npx cap sync android
```

#### Step 2: Generate Release Signing Keystore
Run keytool to generate your release cryptographic signature:
```bash
keytool -genkey -v -keystore jnv-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias jnvgauriganj
```

#### Step 3: Configure Signing in Android Studio
1. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
2. Navigate to **Build > Generate Signed Bundle / APK**.
3. Choose **Android App Bundle (.aab)** (mandatory for Google Play Store).
4. Select `jnv-release-key.jks`, enter your password, and click **Release**.
5. The generated file will be located at:
   `android/app/release/app-release.aab`

#### Step 4: Submit to Google Play Console
1. Go to **Google Play Console > Create App**.
2. Name: `JNV Gauriganj Alumni`.
3. Category: `Education` / `Social`.
4. Upload `app-release.aab` into the **Production** or **Internal Testing** track.
5. Complete the **Data Safety Form** (Alumni registration and contribution details).
6. Provide demo credentials for Google review:
   - Email: `member@jnvalumni.org`
   - Password: `password123`
7. Click **Review & Rollout to Production**.

---

## 🍏 2. Publishing to Apple App Store (iOS)

### Prerequisites:
- An [Apple Developer Program Account](https://developer.apple.com) ($99/year).
- macOS with Xcode installed.

### Step-by-Step Build & Publish Process:

#### Step 1: Initialize iOS Native Project
From your terminal inside `D:\project\JNVAlumini\mobile_app`:
```bash
# Install iOS platform
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
```

#### Step 2: Open in Xcode
```bash
npx cap open ios
```

#### Step 3: Configure Signing & Capabilities
1. In Xcode, select the **App** target.
2. Under the **Signing & Capabilities** tab:
   - Check **Automatically manage signing**.
   - Select your registered **Apple Team**.
   - Bundle Identifier is pre-set to: `org.jnvalumni.gauriganj`.
3. The privacy strings in `Info.plist` (Camera, Photo Library) are already pre-configured for App Store review compliance.

#### Step 4: Archive and Upload to TestFlight / App Store Connect
1. Select target device: **Any iOS Device (arm64)**.
2. Go to menu: **Product > Archive**.
3. In the Xcode Organizer window, select the archive and click **Distribute App**.
4. Select **App Store Connect > Upload**.
5. Once uploaded, open [App Store Connect](https://appstoreconnect.apple.com):
   - Under **TestFlight**, invite host batch organizers and executive committee members for instant beta testing.
   - Under **App Store**, upload 6.7" (iPhone 15/16 Pro Max) and 5.5" screenshots.
   - Enter demo credentials for Apple Review Team (`member@jnvalumni.org` / `password123`).
   - Click **Submit for Review**.

---

## 🧪 Local Testing & Verification
- **Desktop Portal Launcher**: Double-click `run_desktop_portal.bat`
- **Mobile App Launcher**: Double-click `run_mobile_app.bat`
