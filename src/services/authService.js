/**
 * VAISHU JEWELLERY - Authentication Service
 * Firebase Auth (Modular SDK) with Role-Based Access Control
 * Supports Email/Password, Google Auth, Admin Login & Mock Fallback
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isLiveFirebaseConfigured } from '../config/firebase';

const LOCAL_STORAGE_USER_KEY = 'vaishu_jewellery_current_user';
const ADMIN_EMAIL = 'admin@vaishujewellery.com';

// Mock/Local storage helper when live Firebase is not yet connected
function getLocalMockUser() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalMockUser(user) {
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }
}

/**
 * Register a new customer
 */
export async function registerCustomer(name, email, password, phone = '') {
  if (!auth || !isLiveFirebaseConfigured) {
    // Local demo registration
    const mockUser = {
      uid: 'demo_user_' + Date.now(),
      displayName: name,
      email: email,
      phone: phone,
      role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
    setLocalMockUser(mockUser);
    return mockUser;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Firebase Auth
  await updateProfile(user, { displayName: name });

  // Store user document in Firestore `users/{uid}`
  const userDocRef = doc(db, 'users', user.uid);
  const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer';

  const userProfile = {
    uid: user.uid,
    displayName: name,
    email: email,
    phone: phone,
    role: role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(userDocRef, userProfile, { merge: true });
  return { ...userProfile, uid: user.uid };
}

/**
 * Customer / Admin Login with Email & Password
 */
export async function loginUser(email, password) {
  if (!auth || !isLiveFirebaseConfigured) {
    // Local demo login
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL || email.toLowerCase().includes('admin');
    const mockUser = {
      uid: isAdmin ? 'demo_admin_001' : 'demo_cust_' + Math.floor(Math.random() * 10000),
      displayName: isAdmin ? 'Vaishu Admin' : (email.split('@')[0] || 'Royal Patron'),
      email: email,
      phone: '+91 98765 43210',
      role: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
    setLocalMockUser(mockUser);
    return mockUser;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch Firestore profile to verify role
  let role = 'customer';
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      role = userDoc.data().role || 'customer';
    } else if (user.email === ADMIN_EMAIL) {
      role = 'admin';
    }
  } catch (err) {
    console.warn('Could not fetch Firestore role:', err);
    if (user.email === ADMIN_EMAIL) role = 'admin';
  }

  return {
    uid: user.uid,
    displayName: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL,
    role: role
  };
}

/**
 * Sign in with Google
 */
export async function loginWithGoogle() {
  if (!auth || !isLiveFirebaseConfigured) {
    const mockUser = {
      uid: 'google_user_' + Date.now(),
      displayName: 'Google Royal Patron',
      email: 'patron@example.com',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setLocalMockUser(mockUser);
    return mockUser;
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userDocRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userDocRef);

  let role = 'customer';
  if (existing.exists()) {
    role = existing.data().role || 'customer';
  } else {
    role = user.email === ADMIN_EMAIL ? 'admin' : 'customer';
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: role,
      createdAt: serverTimestamp()
    });
  }

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role: role
  };
}

/**
 * Sign Out
 */
export async function logoutUser() {
  setLocalMockUser(null);
  if (auth && isLiveFirebaseConfigured) {
    await signOut(auth);
  }
}

/**
 * Subscribe to Auth State Changes
 */
export function subscribeToAuth(callback) {
  if (!auth || !isLiveFirebaseConfigured) {
    const local = getLocalMockUser();
    callback(local);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : (user.email === ADMIN_EMAIL ? 'admin' : 'customer');
        const enrichedUser = {
          uid: user.uid,
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL,
          role: role
        };
        callback(enrichedUser);
      } catch {
        callback({
          uid: user.uid,
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: user.email === ADMIN_EMAIL ? 'admin' : 'customer'
        });
      }
    } else {
      callback(null);
    }
  });
}
