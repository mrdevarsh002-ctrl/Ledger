#!/bin/bash

# Smart Ledger - Android Build Script
# This script helps you build your Android app step by step

echo "🚀 Smart Ledger - Android Build Helper"
echo "======================================"
echo ""

# Check if Capacitor is initialized
if [ ! -d "android" ]; then
    echo "❌ Android folder not found!"
    echo "Run these commands first:"
    echo "  npm install @capacitor/core @capacitor/cli @capacitor/android"
    echo "  npx cap init 'Smart Ledger' 'com.smartledger.app' --web-dir=dist"
    echo "  npx cap add android"
    exit 1
fi

echo "✅ Android folder found"
echo ""

# Step 1: Build web app
echo "Step 1: Building web app..."
echo "Running: npm run build"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors and try again."
    exit 1
fi

echo "✅ Web app built successfully"
echo ""

# Step 2: Sync to Android
echo "Step 2: Syncing to Android..."
echo "Running: npx cap sync"
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Sync failed! Check the errors above."
    exit 1
fi

echo "✅ Sync completed"
echo ""

# Step 3: Open in Android Studio
echo "Step 3: Opening in Android Studio..."
echo "Running: npx cap open android"
echo ""
echo "⏳ Android Studio will open now..."
echo ""
echo "Next steps in Android Studio:"
echo "1. Wait for Gradle sync to complete"
echo "2. For testing: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "3. For Play Store: Build → Generate Signed Bundle / APK"
echo ""

npx cap open android
