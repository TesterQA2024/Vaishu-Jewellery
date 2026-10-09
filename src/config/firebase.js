/**
 * VAISHU JEWELLERY - Centralized Firebase Configuration
 * Latest Firebase Web SDK (v10+ Modular API)
 *
 * Securely imports environment variables and exports initialized
 * Firebase App, Auth, Firestore, and Storage instances.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Public Firebase Configuration
// Environment variables are loaded through Vite's import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyVaishuJewelleryMockKeyDemo123456',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vaishu-jewellery.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vaishu-jewellery',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vaishu-jewellery.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '102938475612',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:102938475612:web:a1b2c3d4e5f6',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-VAISHUJEWEL'
};

// Check if user provided real credentials
export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('MockKeyDemo') &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'vaishu-jewellery'
);

// Initialize Firebase safely
let app;
let auth;
let db;
let storage;
let googleProvider;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  
  console.log('✨ [Vaishu Jewellery] Firebase initialized successfully.');
} catch (error) {
  console.warn('⚠️ [Vaishu Jewellery] Firebase initialization notice:', error.message);
}

export { app, auth, db, storage, googleProvider, firebaseConfig };
