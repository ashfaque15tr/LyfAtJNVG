# 📱 How to Test & Install the JNV Alumni Mobile App on Your Phone

This guide gives you **3 easy ways** to export and test the mobile application directly on your physical mobile phone (Android or iPhone).

---

## ⚡ Method 1: Instant Live Testing on Your Phone (Recommended)
You don't need to install any heavy developer tools or software. The included executable server serves the mobile app directly to your phone over your local Wi-Fi.

### Step 1: Launch the Mobile Server
- Double-click **`test_on_mobile.bat`** in `D:\project\JNVAlumini\`.
- A terminal window will open showing:
  - Your phone URL: **`http://192.168.0.6:8080/mobile_app/index.html`**
  - A QR code image (**`scan_with_mobile.png`**) will automatically appear on your computer screen.

### Step 2: Open on Your Phone
- Make sure your mobile phone is connected to the same Wi-Fi network (or laptop hotspot).
- Open your phone's camera and **scan the QR code** on your screen (or type the URL `http://192.168.0.6:8080/mobile_app/index.html` in Chrome or Safari).

### Step 3: Install as a Real App on Your Phone Screen (1-Tap)
- **On Android (Google Chrome):**
  1. Tap the three dots menu (**⋮**) in the top right.
  2. Tap **"Install App"** (or **"Add to Home screen"**).
  3. The **JNV Alumni** app icon with the official crest will be installed on your phone home screen!
  4. Tap the icon: it opens in full-screen native app mode (no browser address bar, bottom navigation bar, touch haptics).
- **On iPhone (Apple Safari):**
  1. Tap the **Share** button (**⎋**) at the bottom.
  2. Tap **"Add to Home Screen"**.
  3. It installs as a native iOS app icon on your iPhone home screen!

---

## 📦 Method 2: Export Package to Phone (`.zip` bundle)
If you want to transfer the offline files directly to your phone:

1. Double-click **`export_mobile_app.bat`**.
2. It generates:
   - **`D:\project\JNVAlumini\JNV_Alumni_Mobile_App_Bundle.zip`**
3. Send this ZIP file to your phone via **WhatsApp**, **Google Drive**, or a USB cable.
4. Extract the ZIP on your phone using your file manager.
5. Tap on **`mobile_app/index.html`** to run it locally on your phone.

---

## 🤖 Method 3: Converting into an Installable Android `.apk` File

An Android `.apk` (Android Application Package) is an executable installer for Android phones. Here is how you can generate one:

### Option A: Using Free Online APK Builder (No coding required)
1. Use a free trusted APK wrapper such as **[WebIntoApp.com](https://www.webintoapp.com/)** or **[AppsGeyser.com](https://appsgeyser.com/)**:
   - Upload the `JNV_Alumni_Mobile_App_Bundle.zip` file.
   - Set **App Name:** `JNV Alumni Gauriganj`
   - Set **Package ID:** `org.jnvalumni.gauriganj`
   - Set **Icon:** `assets/images/nvs-logo.png`
   - Click **"Build APK"**.
   - Download the generated `.apk` file directly to your phone and tap **Install**!

### Option B: Using Microsoft PWABuilder (For Play Store & APK)
1. Host the files or use a free hosting service (such as GitHub Pages or Netlify).
2. Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
3. Enter your URL and click **Build My PWA**.
4. Click **"Android"** > **"Generate Package"**.
5. It outputs an installable `.apk` for testing and an `.aab` for the Google Play Store!

### Option C: Native Android Studio Build (For Developers)
If you install Node.js and Android Studio:
```bash
cd D:\project\JNVAlumini
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "JNV Alumni" org.jnvalumni.gauriganj --web-dir mobile_app
npx cap add android
npx cap open android
# In Android Studio, click: Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## 📂 Summary of Executable Files Created:
| File | What it does |
| :--- | :--- |
| **`test_on_mobile.bat`** | Executable script that starts the local network server, shows your phone link & opens the QR code. |
| **`scan_with_mobile.png`** | QR code you can scan with your phone camera to instantly launch the app. |
| **`export_mobile_app.bat`** | Executable script that packages all mobile files into `JNV_Alumni_Mobile_App_Bundle.zip`. |
| **`run_mobile_app.bat`** | Executable that previews the mobile app in desktop Chrome/Edge in standalone phone dimensions. |
