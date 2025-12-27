# 🚀 Launch Website & Build APK - Complete Guide

## Your Current Status ✅

- ✅ App fully developed with all features
- ✅ PWA support configured
- ✅ Icons created and uploaded
- ✅ Supabase authentication setup
- ✅ Ready to launch!

---

## 📍 PART 1: LAUNCH WEBSITE (15 minutes)

### Step 1: Push Code to Git (5 mins)

Open your terminal in the project folder and run:

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for production - PWA and APK support added"

# Create a new repository on GitHub
# Go to: https://github.com/new
# Name it: smart-ledger
# Don't initialize with README
# Copy the repository URL

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/smart-ledger.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (10 mins)

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to **https://vercel.com**
2. Sign in (or sign up with GitHub)
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository: `smart-ledger`
5. Configure project:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
6. **Environment Variables** (IMPORTANT):
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: VITE_SUPABASE_URL
     Value: [Your Supabase Project URL]
     
     Name: VITE_SUPABASE_ANON_KEY
     Value: [Your Supabase Anon Key]
     ```
7. Click **"Deploy"**
8. Wait 2-3 minutes for deployment

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: smart-ledger
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase Anon Key when prompted

# Deploy to production
vercel --prod
```

### Step 3: Get Your Live URL

After deployment completes, you'll get a URL like:
```
https://smart-ledger.vercel.app
```

**Test your live website:**
1. Visit the URL
2. Try signing up / logging in
3. Add a transaction
4. Check if PWA install prompt appears
5. Test on mobile device

---

## 📱 PART 2: BUILD APK (90-120 minutes first time)

### Prerequisites Check

Before starting, verify you have:
- [ ] Node.js installed (`node --version`)
- [ ] Project code ready
- [ ] 2-3 hours for first-time setup
- [ ] Windows/Mac/Linux computer

---

### Phase 1: Install Required Software (60 mins)

#### A. Install Java JDK 17 (15 mins)

1. **Download:**
   - Go to: **https://adoptium.net/temurin/releases/**
   - Select: **Version 17 (LTS)**
   - Download for your OS

2. **Install:**
   - Windows: Run installer with default settings
   - Mac: Open .pkg file and install
   - Linux: Follow installer instructions

3. **Verify:**
   ```bash
   java -version
   ```
   Should show: `openjdk version "17.x.x"`

4. **Set JAVA_HOME:**

   **Windows (Command Prompt as Admin):**
   ```cmd
   setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
   setx PATH "%PATH%;%JAVA_HOME%\bin"
   ```

   **Mac (Terminal):**
   ```bash
   echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
   source ~/.zshrc
   ```

   **Linux (Terminal):**
   ```bash
   echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
   source ~/.bashrc
   ```

   **Close and reopen terminal after this!**

#### B. Install Android Studio (45 mins)

1. **Download:**
   - Go to: **https://developer.android.com/studio**
   - Download for your OS (2-3 GB file)

2. **Install:**
   - Run installer
   - Choose "Standard" installation
   - Install all recommended components:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

3. **Complete Setup Wizard:**
   - Follow the wizard
   - Wait for component downloads (10-15 mins)
   - Note the **Android SDK location** shown

4. **Set ANDROID_HOME:**

   **Windows (Command Prompt as Admin):**
   ```cmd
   setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
   setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
   ```

   **Mac (Terminal):**
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
   source ~/.zshrc
   ```

   **Linux (Terminal):**
   ```bash
   echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
   source ~/.bashrc
   ```

5. **Install SDK Components:**
   - Open Android Studio
   - Click **More Actions** → **SDK Manager**
   - **SDK Platforms tab:**
     - ✅ Check **Android 13.0 (Tiramisu) API 33**
     - ✅ Check **Android 12.0 (S) API 31**
   - **SDK Tools tab:**
     - ✅ Android SDK Build-Tools
     - ✅ Android SDK Command-line Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
   - Click **Apply** and wait for installation

6. **Verify Setup:**
   ```bash
   # Close and reopen terminal first!
   java -version          # Should show Java 17
   echo $ANDROID_HOME     # Should show SDK path (Mac/Linux)
   echo %ANDROID_HOME%    # Should show SDK path (Windows)
   ```

---

### Phase 2: Setup Capacitor (15 mins)

Open terminal in your project folder:

#### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### Step 2: Initialize Capacitor
```bash
npx cap init "Smart Ledger" "com.smartledger.app" --web-dir=dist
```

**IMPORTANT:** The app ID `com.smartledger.app` must be unique. If you plan to publish to Play Store and this ID is taken, use:
- `com.yourname.smartledger`
- `com.yourcompany.smartledger`

#### Step 3: Update capacitor.config.ts

The file should already exist. Verify it looks like this:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartledger.app',
  appName: 'Smart Ledger',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
```

#### Step 4: Build Web App
```bash
npm run build
```

Wait for build to complete (1-2 minutes).

#### Step 5: Add Android Platform
```bash
npx cap add android
```

This creates an `android` folder with your Android project (takes 1-2 minutes).

#### Step 6: Copy Environment Variables

Create `.env.production` file in your project root:

```env
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

**Replace with your actual Supabase credentials!**

#### Step 7: Rebuild and Sync
```bash
npm run build
npx cap sync
```

This copies your web app to the Android project.

---

### Phase 3: Configure Android App (5 mins)

#### Update AndroidManifest.xml

**File location:** `android/app/src/main/AndroidManifest.xml`

Add internet permissions inside `<manifest>` tag (after the first line):

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**Full example:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <!-- Rest of the file... -->
    </application>
</manifest>
```

---

### Phase 4: Add App Icons (10 mins)

#### Step 1: Open Android Studio
```bash
npx cap open android
```

Wait for Android Studio to open and Gradle sync to complete (5-10 minutes first time).

#### Step 2: Generate Icons

1. In Android Studio, expand **app** → **src** → **main** → **res**
2. Right-click on **res** folder
3. Select **New** → **Image Asset**
4. Configure:
   - **Icon Type:** Launcher Icons (Adaptive and Legacy)
   - **Name:** ic_launcher
   - **Foreground Layer:**
     - Source: **Image**
     - Path: Browse and select your **icon-512.png** file
     - Trim: **Yes**
     - Resize: **75%**
   - **Background Layer:**
     - Source: **Color**
     - Color: **#3B82F6** (your blue color)
5. Click **Next**
6. Click **Finish**

Android Studio will automatically generate all required icon sizes!

---

### Phase 5: Create Keystore (5 mins - ONE TIME ONLY)

**⚠️ CRITICAL: This keystore is required for ALL future updates. Back it up safely!**

#### In Android Studio:

1. Menu: **Build** → **Generate Signed Bundle / APK**
2. Select: **Android App Bundle** (for Play Store) or **APK** (for direct sharing)
3. Click **Next**
4. Click **Create new...** (under Key store path)
5. Fill the form:

   ```
   Key store path: C:\Users\YourName\smartledger-keystore.jks
                   (or ~/smartledger-keystore.jks on Mac/Linux)
   
   Password: [Create a strong password - SAVE THIS!]
   Confirm Password: [Same password]
   
   Alias: smartledger-key
   Password: [Same or different - SAVE THIS!]
   Confirm: [Same password]
   
   Validity (years): 25
   
   Certificate:
   First and Last Name: Your Full Name
   Organizational Unit: (optional)
   Organization: Your Company Name
   City or Locality: Your City
   State or Province: Your State
   Country Code (XX): IN (or your country)
   ```

6. Click **OK**

**⚠️ BACKUP YOUR KEYSTORE NOW!**
- Copy the `.jks` file to cloud storage (Google Drive, Dropbox)
- Save passwords in a password manager
- Email yourself the passwords
- **Losing this means you can NEVER update your app on Play Store!**

---

### Phase 6: Build Signed APK/AAB (10 mins)

#### Continue from keystore creation:

1. **Key store path:** Select your newly created `.jks` file
2. **Key store password:** Enter the password you created
3. **Key alias:** smartledger-key
4. **Key password:** Enter the password
5. **Remember passwords:** Check this box for convenience
6. Click **Next**
7. **Destination folder:** Note where files will be saved
8. **Build Variants:** Select **release**
9. **Signature Versions:** Check **V1 and V2**
10. Click **Finish**

**Wait for build to complete** (5-10 minutes).

#### Your files will be at:

**For Play Store (AAB):**
```
android/app/release/app-release.aab
```

**For Direct Sharing (APK):**
```
android/app/release/app-release.apk
```

---

## 🎉 Success! You Now Have:

### 1. Live Website
- ✅ Deployed on Vercel
- ✅ PWA installable
- ✅ URL: https://your-app.vercel.app

### 2. APK File
- ✅ Installable on any Android device
- ✅ Can share via WhatsApp, email, etc.
- ✅ Good for testing and beta users

### 3. AAB File
- ✅ Ready for Google Play Store
- ✅ Optimized for different devices
- ✅ Required for Play Store submission

---

## 🧪 Testing Your APK

### Test on Android Device:

1. **Copy APK to your phone:**
   - USB cable: Copy `app-release.apk` to phone
   - Or email it to yourself
   - Or upload to Google Drive and download on phone

2. **Install APK:**
   - Open the APK file on your phone
   - Tap "Install"
   - You may need to enable "Install from Unknown Sources" in Settings
   - Allow installation
   - App will appear on home screen with your blue icon!

3. **Test the app:**
   - Open Smart Ledger
   - Sign up / log in
   - Add transactions
   - Test all features
   - Check if data syncs with website

### Test on Android Emulator:

1. In Android Studio, click device dropdown (top toolbar)
2. Click **Device Manager**
3. Click **Create Device**
4. Select **Pixel 5** or any phone
5. Download system image (Android 12 or 13)
6. Create emulator
7. Start emulator
8. Drag your `app-release.apk` onto the emulator window
9. App will install automatically

---

## 📤 Share Your APK

### Direct Distribution:

**Share via WhatsApp:**
- Send `app-release.apk` file
- Users install directly

**Share via Google Drive:**
1. Upload `app-release.apk` to Drive
2. Share link with "Anyone with link can view"
3. Users download and install

**Share via Website:**
- Upload APK to your website
- Add download button
- Users click to download

### Example Download Page:

```html
<a href="/app-release.apk" download>
  Download Smart Ledger APK
</a>
```

---

## 🏪 Publish to Google Play Store

### Quick Overview:

1. **Create Developer Account:**
   - Go to: https://play.google.com/console
   - Pay $25 one-time fee
   - Complete profile

2. **Prepare Assets:**
   - App icon: 512×512 ✅ (you have this)
   - Feature graphic: 1024×500 (create in Canva)
   - Screenshots: At least 2 (take from phone)
   - Description: Write app details
   - Privacy policy: Generate free online

3. **Create App:**
   - Click "Create app"
   - Fill in details
   - Upload AAB file
   - Complete store listing
   - Submit for review

4. **Wait for Approval:**
   - Usually 1-7 days
   - You'll receive email when approved
   - App goes live on Play Store!

**For detailed Play Store instructions, see:**
- `PLAYSTORE_PUBLISHING_GUIDE.md` (complete guide)
- `QUICK_APK_GUIDE.md` (quick reference)

---

## 🔄 Making Updates

### Update Your Website:
```bash
git add .
git commit -m "Update: [describe changes]"
git push
```
Vercel auto-deploys in 2-3 minutes.

### Update Your APK:

1. Make code changes
2. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode 2      // Increment by 1
   versionName "1.0.1"
   ```
3. Build and sync:
   ```bash
   npm run build
   npx cap sync
   ```
4. Generate new signed APK/AAB in Android Studio
5. Distribute new version

---

## ❗ Common Issues & Solutions

### "SDK not found"
```bash
# Set ANDROID_HOME (see Phase 1)
# Close and reopen terminal
# Verify: echo $ANDROID_HOME
```

### "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
npx cap sync
npx cap open android
```

### "Module not found"
```bash
npm install
npm run build
npx cap sync
```

### "Keystore password incorrect"
- Make sure you're entering the correct password
- Try the alias password if key password fails
- If lost, create new keystore (but can't update existing app)

### "App crashes on launch"
- Check Supabase credentials in `.env.production`
- Verify internet permissions in AndroidManifest.xml
- Check Android Studio Logcat for errors

---

## 📋 Final Checklist

### Website Launch:
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] Website loads correctly
- [ ] Authentication works
- [ ] Transactions can be added
- [ ] PWA install works

### APK Build:
- [ ] Java JDK 17 installed
- [ ] Android Studio installed
- [ ] Capacitor configured
- [ ] Icons added to Android project
- [ ] Keystore created and backed up
- [ ] APK built successfully
- [ ] APK tested on device
- [ ] All features working

---

## 🎯 Quick Commands Reference

```bash
# Website Deploy
git add .
git commit -m "message"
git push
vercel --prod

# APK Build
npm run build
npx cap sync
npx cap open android

# Check Setup
java -version
echo $ANDROID_HOME
npx cap doctor

# Clean Build
cd android
./gradlew clean
cd ..
npx cap sync
```

---

## 🎊 Congratulations!

You now have:
1. ✅ **Live Website** - Users can access from any browser
2. ✅ **PWA** - Users can install from website
3. ✅ **APK** - Users can install on Android devices
4. ✅ **AAB** - Ready for Play Store submission

**Your Smart Ledger app is ready to launch!** 🚀

Share it with your target users (contractors) and start getting feedback!

---

## 📞 Need Help?

**If you get stuck:**
1. Check error messages carefully
2. Google the specific error
3. Check Stack Overflow
4. Review the detailed guides in your project
5. Verify all environment variables are correct

**Your app is production-ready!** Time to launch and help contractors manage their ledgers! 💼📱✨
