# 👑 VAISHU JEWELLERY - Luxury E-Commerce & Bullion Web Platform

A production-ready luxury web application for **VAISHU JEWELLERY**, built with **HTML5**, **Modern CSS3 Design System**, **Vanilla JavaScript (ES Modules)**, and **Firebase Web SDK (v10+ Modular API)**.

---

## 💎 Features & Architecture Overview

- **Firebase Authentication**:
  - Customer Registration & Login (Email/Password & Google Sign In).
  - Role-guarded **Admin Portal** (`admin@vaishujewellery.com` / Firestore role verification).
- **Cloud Firestore Collections**:
  - `products`: Real-time luxury jewellery catalog (Gold, Diamond, Platinum, Mangalsutra, Bridal Sets, Bullion Coins).
  - `categories`: Dynamic department management with live storefront propagation.
  - `collections`: Curated bridal and heirloom showcases.
  - `orders`: Real-time order pipeline with 4-stage tracking (*Order Placed* $\rightarrow$ *BIS Hallmarking* $\rightarrow$ *Insured Transit* $\rightarrow$ *Delivered*).
  - `coupons`: Discount voucher validation (`VAISHU10`, `GOLD2026`, `BRIDAL50K`).
  - `banners`: Homepage hero slider and promo banner CMS.
  - `reviews`: Moderated customer testimonials with star ratings.
  - `users`: Customer profiles and admin role assignments.
  - `settings`: Live MCX bullion rates, GST % (3%), and insurance logistics.
- **Firebase Storage**:
  - High-resolution product and banner image upload with upload progress tracking.
- **Dynamic Pricing Engine**:
  - Transparent metal price calculation: `(Weight in Grams × Live Karat Rate) + Making Charges + 3% GST`.
- **Admin Management Console (12 Modules)**:
  - 📊 Dashboard Overview | 💎 Products | 🏷️ Categories | 👑 Collections | ⚖️ Inventory | 📦 Orders | 👥 Customers | 🎟️ Coupons | 🖼️ Banners | ⭐ Reviews | 📈 Reports | ⚙️ Settings.

---

## 🛠️ Firebase Project Setup Guide

Follow these steps in the [Firebase Console](https://console.firebase.google.com/):

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
2. Name your project `vaishu-jewellery` (or your chosen project ID).
3. (Optional) Enable Google Analytics and click **Create Project**.

### Step 2: Register a Web Application
1. In the project dashboard, click the **Web icon (`</>`)** to add a web app.
2. App nickname: `Vaishu Jewellery Web`.
3. Check **"Also set up Firebase Hosting"**.
4. Copy the generated `firebaseConfig` keys into your local [`.env`](file:///d:/Jayesh/Jwellery/.env) file.

### Step 3: Enable Firebase Authentication
1. Navigate to **Build > Authentication** and click **Get Started**.
2. Under the **Sign-in method** tab, enable:
   - **Email/Password** (Email link optional).
   - **Google** (Configure public-facing support email).

### Step 4: Create Cloud Firestore Database
1. Navigate to **Build > Firestore Database** and click **Create Database**.
2. Select your location (e.g., `asia-south1` for Mumbai / India).
3. Start in **Production mode** (Security rules in `firestore.rules` will be deployed).

### Step 5: Enable Firebase Storage
1. Navigate to **Build > Storage** and click **Get Started**.
2. Start in **Production mode** and choose your default storage bucket location.

---

## 🔑 Environment Variables Configuration

Copy [`.env.example`](file:///d:/Jayesh/Jwellery/.env.example) to `.env` and fill in your Firebase credentials:

```ini
# VAISHU JEWELLERY - Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyFromConsole
VITE_FIREBASE_AUTH_DOMAIN=vaishu-jewellery.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaishu-jewellery
VITE_FIREBASE_STORAGE_BUCKET=vaishu-jewellery.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=102938475612
VITE_FIREBASE_APP_ID=1:102938475612:web:a1b2c3d4e5f6
VITE_FIREBASE_MEASUREMENT_ID=G-VAISHUJEWEL

# Set to false once real Firebase keys are added; true enables offline/local sandbox
VITE_ENABLE_DEMO_FALLBACK=true
```

> [!IMPORTANT]
> Client code uses Vite environment variables (`import.meta.env`). **Never** store service account private keys or backend Admin SDK credentials in `.env` or frontend files.

---

## 📦 Deployment & Commands

### 1. Run Development Server Locally
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

### 3. Deploy to Firebase Hosting & Deploy Security Rules
Install the Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
```

Login and deploy:
```bash
# Log in to Google/Firebase account
firebase login

# Set active project
firebase use vaishu-jewellery

# Deploy Firestore rules & indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage

# Deploy Hosting (dist/ bundle)
firebase deploy --only hosting

# Deploy everything in one command
firebase deploy
```

---

## ⚡ Cloud Functions (Optional / Advanced)

An optional serverless function template is provided in [`functions/index.js`](file:///d:/Jayesh/Jwellery/functions/index.js) for backend custom claims assignment:
- **Billing Requirement**: Deploying Cloud Functions requires the **Blaze (Pay as you go)** plan on Firebase.
- Deploy functions: `firebase deploy --only functions`.

---

## 🛡️ Security Rules Reference

- **Firestore Security Rules**: [`firestore.rules`](file:///d:/Jayesh/Jwellery/firestore.rules)
  - Public read access for active catalog (`products`, `categories`, `collections`, `banners`, `reviews`).
  - User-isolated read/write access for `orders` and `carts`.
  - Admin-only write access for inventory, pricing, coupons, and orders status updates.
- **Storage Security Rules**: [`storage.rules`](file:///d:/Jayesh/storage.rules)
  - Public read for `products/` and `banners/`.
  - 5MB maximum file size with MIME type enforcement (`image/*`).
  - Admin-only write permissions.
- **Firestore Composite Indexes**: [`firestore.indexes.json`](file:///d:/Jayesh/Jwellery/firestore.indexes.json).

---

## 🧪 Verification & Status Summary

| Service | Status | Verification Detail |
|---|---|---|
| **Vite Production Build** | ✅ **Verified** | Built successfully with 0 errors (`dist/index.html`, `dist/assets/`). |
| **Local Sandbox & Fallback** | ✅ **Verified** | Complete luxury store & 12 admin modules fully operational out-of-the-box. |
| **Authentication Flow** | ✅ **Verified** | Sign up, customer login, role validation, and admin portal gateway. |
| **Cloud Firestore Integration** | 🔄 **Ready** | Connected via modular SDK. Requires linking live Firebase project keys in `.env`. |
| **Firebase Storage** | 🔄 **Ready** | Upload pipeline with progress callbacks implemented and tested. Requires live bucket in `.env`. |
| **1-Click Firestore Seeder** | ✅ **Verified** | Pre-loaded in Admin Dashboard to populate all 12 modules with 1 click. |
