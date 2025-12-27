# Smart Ledger - Deployment & APK Generation Guide

## 📱 Option 1: PWA (Progressive Web App) - Recommended for Quick Start

Your app is now PWA-ready! Users can install it directly from their browser.

### Benefits:
- ✅ No app store approval needed
- ✅ Instant updates (no need to download new versions)
- ✅ Works on Android, iOS, and Desktop
- ✅ Smaller size than native apps
- ✅ Offline support included

### How Users Install:
**Android (Chrome):**
1. Visit your website
2. Tap the menu (⋮) → "Add to Home screen" or "Install app"
3. App icon appears on home screen

**iOS (Safari):**
1. Visit your website
2. Tap Share button → "Add to Home Screen"
3. App icon appears on home screen

---

## 🚀 Deploy to Vercel

### Step 1: Prepare Your Code
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
```

### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smart-ledger.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `smart-ledger` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

---

## 📦 Option 2: Generate APK with Capacitor

If you need an actual APK file to distribute or publish to Google Play Store:

### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init "Smart Ledger" "com.smartledger.app" --web-dir=dist
```

### Step 2: Build Your Web App
```bash
npm run build
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Sync Your Web Code
```bash
npx cap sync
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Generate APK
In Android Studio:
1. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. Click "locate" to find your APK file
4. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### For Production APK (Signed):
1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Create a new keystore or use existing
3. Fill in keystore details
4. Choose "release" build variant
5. Your signed APK will be ready for distribution

---

## 🔧 Additional Capacitor Configuration

### Configure Capacitor (capacitor.config.json)
After running `npx cap init`, edit the generated `capacitor.config.json`:

```json
{
  "appId": "com.smartledger.app",
  "appName": "Smart Ledger",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#ffffff"
  }
}
```

### Update Android Permissions
Edit `android/app/src/main/AndroidManifest.xml` to add necessary permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 📱 App Icons

You need to create app icons before building:

### For PWA:
Create these files in `/public`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

### For Android APK:
After adding Android platform, replace icons in:
- `android/app/src/main/res/mipmap-*` folders

### Quick Icon Generation:
Use online tools like:
- [realfavicongenerator.net](https://realfavicongenerator.net/)
- [favicon.io](https://favicon.io/)

---

## 🔄 Update Your App

### For PWA:
1. Make changes to your code
2. Push to GitHub
3. Vercel auto-deploys
4. Users get updates automatically on next visit

### For APK:
1. Make changes
2. `npm run build`
3. `npx cap sync`
4. `npx cap open android`
5. Build new APK
6. Distribute new APK to users

---

## 📊 Comparison

| Feature | PWA | APK (Capacitor) |
|---------|-----|-----------------|
| Installation | Browser only | APK file or Play Store |
| Updates | Automatic | Manual install |
| App Store | Not needed | Can publish to Play Store |
| Development | Easier | More complex |
| Native Features | Limited | Full access |
| File Size | Smaller | Larger |
| Offline Support | Yes | Yes |

---

## 🎯 Recommended Approach

**For Most Users: Start with PWA**
- Deploy on Vercel (free)
- Share the URL with users
- They install via browser
- You get instant updates

**Generate APK Later If Needed:**
- If users prefer APK files
- If you want to publish to Play Store
- If you need advanced native features

---

## 🆘 Troubleshooting

### Vercel Deployment Issues:
- Make sure environment variables are added
- Check build logs for errors
- Verify `package.json` has correct build script

### Capacitor Build Issues:
- Make sure Android Studio is installed
- Install Java JDK 11 or higher
- Set ANDROID_HOME environment variable
- Run `npx cap doctor` to check setup

### PWA Not Installing:
- Must be served over HTTPS (Vercel does this automatically)
- Check browser console for errors
- Verify manifest.json is accessible

---

## 📞 Support

If you encounter issues:
1. Check the build logs
2. Verify all environment variables
3. Test locally first: `npm run dev`
4. Check Supabase connection

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] App icons created (192px and 512px)
- [ ] Code pushed to GitHub
- [ ] Supabase project is live (not paused)
- [ ] Build succeeds locally: `npm run build`

---

Good luck with your deployment! 🚀
