# ⚡ Quick APK Build Guide - Smart Ledger

## TL;DR - Fast Track to APK (90 minutes)

### Prerequisites Check ✅

Before starting, you need:
- [ ] Node.js installed
- [ ] 2-3 hours of free time
- [ ] Stable internet connection

---

## 🚀 Phase 1: Install Software (60 mins)

### Step 1: Install Java JDK 17 (15 mins)
1. Go to: **https://adoptium.net/**
2. Download **Temurin 17 (LTS)**
3. Install with default settings
4. Open **new terminal** and verify: `java -version`

### Step 2: Install Android Studio (45 mins)
1. Go to: **https://developer.android.com/studio**
2. Download and install
3. Open Android Studio
4. Follow setup wizard:
   - Install Android SDK
   - Install Android SDK Platform-Tools
   - Install Android 33
5. Note the SDK path shown during setup

---

## 🔧 Phase 2: Setup Project (15 mins)

Open terminal in your project folder:

### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Initialize
```bash
npx cap init "Smart Ledger" "com.smartledger.app" --web-dir=dist
```

### Step 3: Build
```bash
npm run build
```

### Step 4: Add Android
```bash
npx cap add android
```

### Step 5: Sync
```bash
npx cap sync
```

---

## 📱 Phase 3: Create Icons (15 mins)

### Quick Icon Creation:
1. Go to: **https://favicon.io/favicon-generator/**
2. Settings:
   - Text: **SL**
   - Background: **Circle**
   - Font: **Roboto Bold**
   - Background Color: **Black (#000000)**
   - Text Color: **White (#FFFFFF)**
3. Click **Download**
4. You'll get a ZIP file

---

## 🎨 Phase 4: Add Icons to Android (5 mins)

### Step 1: Open in Android Studio
```bash
npx cap open android
```

Wait for Gradle sync (takes 5-10 minutes first time)

### Step 2: Add Icon
1. In Android Studio, expand folders on left
2. Find and right-click: **app** → **res**
3. Select: **New** → **Image Asset**
4. Choose: **Launcher Icons**
5. Click browse and select your 512x512 icon
6. Background color: **#000000** (black)
7. Click **Next** → **Finish**

---

## 🔐 Phase 5: Create Keystore (5 mins)

### In Android Studio:
1. Menu: **Build** → **Generate Signed Bundle / APK**
2. Select: **Android App Bundle** (for Play Store) or **APK** (for sharing)
3. Click **Next**
4. Click **Create new...** (keystore)
5. Fill form:
   ```
   Path: C:\Users\YourName\smartledger.jks (or ~/smartledger.jks on Mac)
   Password: YourStrongPassword123
   Alias: smartledger
   Alias Password: YourStrongPassword123
   Validity: 25 years
   
   Certificate:
   Name: Your Name
   Organization: Your Company
   City: Your City
   State: Your State
   Country: IN (or your country code)
   ```
6. Click **OK**

**⚠️ CRITICAL: Backup the .jks file! Save passwords in password manager!**

---

## 🎯 Phase 6: Build APK (10 mins)

### Continue in the dialog:
1. Select your new keystore file
2. Enter the passwords you just created
3. Build variant: **release**
4. Signature versions: **Check both V1 and V2**
5. Click **Finish**

**Wait 5-10 minutes for build to complete**

### Your APK will be at:
```
android/app/release/app-release.apk
```

Or if you built AAB:
```
android/app/release/app-release.aab
```

---

## 📤 What to Do with Files

### APK File (.apk)
- ✅ Can share directly with users
- ✅ Users can install immediately
- ✅ Good for testing
- ❌ Cannot upload to Play Store

### AAB File (.aab)
- ✅ Required for Play Store
- ✅ Smaller download size for users
- ✅ Google optimizes for different devices
- ❌ Cannot install directly

**Recommendation:** Build both!
- AAB for Play Store submission
- APK for direct sharing and testing

---

## 🧪 Testing Your APK

### Method 1: Android Emulator (in Android Studio)
1. In Android Studio, click **Run** dropdown
2. Select **Create Device**
3. Choose a phone (e.g., Pixel 5)
4. Download system image (Android 12 or 13)
5. Create emulator
6. Drag your APK file onto the emulator

### Method 2: Real Android Phone (Recommended)
1. Enable Developer Options on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect phone to computer via USB
4. Transfer APK to phone
5. Open APK on phone and install
6. You may need to allow "Install from Unknown Sources"

---

## 🏪 Next: Publishing to Play Store

### What You Need:
1. ✅ Your AAB file (app-release.aab)
2. ✅ App icon 512x512 px
3. ✅ Feature graphic 1024x500 px
4. ✅ At least 2 screenshots
5. ✅ App description
6. ✅ Privacy policy URL
7. ✅ $25 for developer account

### Steps:
1. Create account: **https://play.google.com/console**
2. Pay $25 one-time fee
3. Create new app
4. Upload AAB file
5. Fill in all required information
6. Submit for review

**Review time: 1-7 days**

See **PLAYSTORE_PUBLISHING_GUIDE.md** for detailed steps!

---

## 🆘 Common Issues

### "JAVA_HOME not found"
```bash
# Windows (restart terminal after this)
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"

# Mac
export JAVA_HOME=$(/usr/libexec/java_home)
```

### "Android SDK not found"
1. Open Android Studio
2. Go to: File → Settings → Android SDK
3. Note the path shown
4. Set environment variable:
```bash
# Windows
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"

# Mac
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
npx cap sync
npx cap open android
# Try building again
```

### "Build successful but APK not found"
Look in these locations:
```
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
android/app/release/app-release.apk
android/app/release/app-release.aab
```

### App crashes on launch
1. Open Android Studio
2. Run app in debug mode
3. Check **Logcat** (bottom panel) for errors
4. Common issues:
   - Missing internet permission in AndroidManifest.xml
   - Wrong Supabase URL/keys
   - Build cache issue (try clean build)

---

## ✅ Success Checklist

**You're done when you have:**
- [ ] app-release.apk file (for sharing)
- [ ] app-release.aab file (for Play Store)
- [ ] APK tested on real device or emulator
- [ ] App launches without crashing
- [ ] Login/signup works
- [ ] Transactions can be added
- [ ] All features working

---

## 📊 Command Cheat Sheet

```bash
# Setup (one-time)
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Smart Ledger" "com.smartledger.app" --web-dir=dist
npx cap add android

# Every time you make changes
npm run build
npx cap sync
npx cap open android

# Debugging
npx cap doctor          # Check setup
npx cap sync --verbose  # Detailed sync
cd android && ./gradlew clean  # Clean build

# Check versions
node --version
java -version
npx cap --version
```

---

## 🎯 Time Estimates

| Task | First Time | After Setup |
|------|-----------|-------------|
| Install Java & Android Studio | 60 min | - |
| Setup Capacitor | 15 min | - |
| Create icons | 15 min | 5 min |
| Build APK | 10 min | 5 min |
| Test on device | 10 min | 5 min |
| **Total** | **~110 min** | **~15 min** |

---

## 🎉 You're Ready!

After following these steps, you'll have:
- ✅ Installable APK file
- ✅ Play Store ready AAB file
- ✅ Signed with your keystore
- ✅ Ready to share or publish

**Next Steps:**
1. Test APK on multiple devices
2. Gather feedback from testers
3. Fix any bugs
4. Create Play Store account ($25)
5. Upload AAB and publish!

Good luck! 🚀
