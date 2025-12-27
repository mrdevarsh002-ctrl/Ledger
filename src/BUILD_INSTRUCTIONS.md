# 🔨 Build Instructions for Smart Ledger

## Quick Reference Guide

### 🌐 Deploy as PWA (Web App) - 5 Minutes

**Step 1:** Create app icons
- Make `icon-192.png` and `icon-512.png`
- Place in `/public` folder
- Tools: [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net)

**Step 2:** Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/smart-ledger.git
git push -u origin main
```

**Step 3:** Deploy on Vercel
1. Sign in at [vercel.com](https://vercel.com) with GitHub
2. Import your repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

**Users install by:** Visiting your URL → Browser menu → "Add to Home screen"

---

### 📱 Build APK (Android App) - 20 Minutes

**Prerequisites:**
- Install [Android Studio](https://developer.android.com/studio)
- Install [Java JDK 11+](https://adoptium.net)

**Step 1:** Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

**Step 2:** Initialize
```bash
npx cap init "Smart Ledger" "com.smartledger.app" --web-dir=dist
```

**Step 3:** Build web app
```bash
npm run build
```

**Step 4:** Add Android platform
```bash
npx cap add android
```

**Step 5:** Sync files
```bash
npx cap sync
```

**Step 6:** Open in Android Studio
```bash
npx cap open android
```

**Step 7:** Build APK
- In Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

**For production (signed APK):**
- **Build** → **Generate Signed Bundle / APK**
- Create keystore (save it safely!)
- Choose "release" variant

---

## 🔄 After Making Changes

### PWA (Automatic):
```bash
git commit -am "Update"
git push
```
✨ Vercel auto-deploys, users get updates automatically!

### APK (Manual):
```bash
npm run build
npx cap sync
npx cap open android
```
Then rebuild APK in Android Studio

---

## 📊 Distribution Comparison

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **PWA** | Quick launch, easy updates | Instant updates, no APK needed, cross-platform | Requires browser install |
| **APK** | Direct distribution, offline mode | Native feel, offline-first | Manual updates required |
| **Play Store** | Professional deployment | Official distribution, trusted | $25 fee, approval process |

---

## 🎯 Recommended Path

1. **Start:** Deploy as PWA on Vercel (5 min)
2. **Test:** Share URL with a few users
3. **Iterate:** Make improvements based on feedback
4. **Scale:** Build APK if users request it
5. **Publish:** Submit to Play Store when ready

---

## 📱 App Icon Requirements

### For PWA:
- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

### For Android APK:
After running `npx cap add android`, replace icons in:
- `android/app/src/main/res/mipmap-mdpi/` (48x48)
- `android/app/src/main/res/mipmap-hdpi/` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192x192)

**Quick tip:** Use Android Studio's **Image Asset Studio**:
- Right-click `res` folder → New → Image Asset
- Choose icon type: Launcher Icons
- Upload your 512x512 icon
- Auto-generates all sizes!

---

## 🆘 Common Errors

### ❌ `Module not found: capacitor/core`
```bash
npm install @capacitor/core @capacitor/cli
```

### ❌ `Android SDK not found`
- Install Android Studio
- Open Android Studio → SDK Manager
- Install Android SDK Platform 33+

### ❌ `JAVA_HOME not set`
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-11"

# Mac/Linux
export JAVA_HOME=$(/usr/libexec/java_home)
```

### ❌ `Gradle build failed`
```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

### ❌ White screen after deployment
- Check environment variables on Vercel
- Check browser console for errors
- Verify Supabase is not paused

---

## ✅ Pre-Launch Checklist

**Before deployment:**
- [ ] Test all features locally
- [ ] Create app icons (192px, 512px)
- [ ] Test on mobile device
- [ ] Verify Supabase connection
- [ ] Test signup/login flow
- [ ] Verify transactions work
- [ ] Check dark mode works
- [ ] Test all language options

**For Vercel:**
- [ ] Environment variables added
- [ ] Build succeeds: `npm run build`
- [ ] Test deployed version

**For APK:**
- [ ] Android Studio installed
- [ ] Java JDK installed
- [ ] App icons replaced
- [ ] Test APK on real device
- [ ] Check app permissions

---

## 📞 Getting Help

**Check these first:**
1. Run `npm run build` locally - does it work?
2. Check browser console for errors (F12)
3. Verify environment variables
4. Check Supabase connection

**Capacitor specific:**
```bash
npx cap doctor
```

**Still stuck?**
- Check build logs
- Verify all dependencies installed
- Try clean build: `rm -rf node_modules && npm install`

---

## 🚀 Production Tips

1. **Environment Variables:** Never commit your Supabase keys
2. **Performance:** PWA is faster than APK for most use cases
3. **Updates:** PWA = instant, APK = manual download
4. **Distribution:** PWA is easier, APK for Play Store
5. **Testing:** Always test on real devices before launching

---

## 📈 Next Steps After Launch

1. **Monitor:** Check Vercel logs for errors
2. **Feedback:** Collect user feedback
3. **Iterate:** Fix bugs, add features
4. **Scale:** Consider Play Store if user base grows
5. **Monetize:** Add premium features if needed

---

**You're ready to launch!** 🎉

Choose your deployment method and follow the steps above. Good luck!
