/**
 * VAISHU JEWELLERY - Product & Bullion Service
 * Cloud Firestore Integration for Realtime Catalog, Inventory & Dynamic Pricing
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { INITIAL_PRODUCTS, LIVE_RATES, CATEGORIES } from './seedData';

const LOCAL_PRODUCTS_KEY = 'vaishu_jewellery_products_v1';
const LOCAL_RATES_KEY = 'vaishu_jewellery_live_rates_v1';

// Cache / Local storage helper
function getLocalProducts() {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      // Auto-migrate any stale broken images
      let changed = false;
      list.forEach(p => {
        if (p.image && p.image.includes('1611591475102')) {
          p.image = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80';
          if (p.gallery) {
            p.gallery = [
              'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80',
              'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80'
            ];
          }
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
      }
      return list;
    }
  } catch (e) {}
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

export function getStoredLiveRates() {
  try {
    const raw = localStorage.getItem(LOCAL_RATES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return LIVE_RATES;
}

export function updateStoredLiveRates(rates) {
  localStorage.setItem(LOCAL_RATES_KEY, JSON.stringify(rates));
}

/**
 * Fetch all products or query by filters
 */
export async function fetchProducts({
  category = 'all',
  metal = 'all',
  karat = 'all',
  searchQuery = '',
  minPrice = 0,
  maxPrice = 2000000,
  sortBy = 'featured'
} = {}) {
  let products = [];

  if (db && isLiveFirebaseConfigured) {
    try {
      const colRef = collection(db, 'products');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Fallback to initial products if Firestore is empty
        products = getLocalProducts();
      }
    } catch (err) {
      console.warn('Firestore fetch products failed, using local catalog:', err);
      products = getLocalProducts();
    }
  } else {
    products = getLocalProducts();
  }

  // Client-side filtering & search
  return products.filter(item => {
    // Category match
    if (category !== 'all' && item.category !== category) return false;
    
    // Metal / Karat match
    if (metal !== 'all' && item.metal !== metal) return false;
    if (karat !== 'all' && !item.karat?.toLowerCase().includes(karat.toLowerCase())) return false;

    // Price range
    if (item.price < minPrice || item.price > maxPrice) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchKarat = item.karat?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTags && !matchKarat) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1;
    // default: featured & bestsellers first
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(productId) {
  if (db && isLiveFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn('Firestore fetch single product failed:', err);
    }
  }
  const products = getLocalProducts();
  return products.find(p => p.id === productId) || null;
}

/**
 * Admin: Add New Product
 */
export async function createProduct(productData) {
  const newProduct = {
    ...productData,
    inStock: true,
    rating: 5.0,
    reviewsCount: 0,
    createdAt: new Date().toISOString()
  };

  if (db && isLiveFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...newProduct };
    } catch (err) {
      console.warn('Firestore create product error, saving locally:', err);
    }
  }

  const products = getLocalProducts();
  const id = 'VJ-PROD-' + Date.now().toString().slice(-6);
  const created = { id, ...newProduct };
  products.unshift(created);
  saveLocalProducts(products);
  return created;
}

/**
 * Admin: Update Product
 */
export async function updateProduct(productId, updatedFields) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updatedFields,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore update product error:', err);
    }
  }

  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields };
    saveLocalProducts(products);
    return products[index];
  }
  return null;
}

/**
 * Admin: Delete Product
 */
export async function deleteProduct(productId) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete error:', err);
    }
  }

  let products = getLocalProducts();
  products = products.filter(p => p.id !== productId);
  saveLocalProducts(products);
  return true;
}

/**
 * Admin Tool: Seed initial products into Firestore
 */
export async function seedFirestoreDatabase() {
  if (!db || !isLiveFirebaseConfigured) {
    saveLocalProducts(INITIAL_PRODUCTS);
    return { success: true, count: INITIAL_PRODUCTS.length, mode: 'local' };
  }

  let seededCount = 0;
  for (const item of INITIAL_PRODUCTS) {
    try {
      await setDoc(doc(db, 'products', item.id), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      seededCount++;
    } catch (err) {
      console.error('Error seeding item:', item.id, err);
    }
  }

  return { success: true, count: seededCount, mode: 'firestore' };
}

/**
 * Live Metal Price Calculator
 * Formula: (Weight * Karat Rate) + Making Charge (percentage) + 3% GST
 */
export function calculateItemBreakdown(weightGrams, karatType, makingPercent = 10, stoneCharges = 0) {
  const rates = getStoredLiveRates();
  let baseRatePerGram = rates.gold22k;

  if (karatType.includes('24K')) baseRatePerGram = rates.gold24k;
  else if (karatType.includes('18K')) baseRatePerGram = rates.gold18k;
  else if (karatType.includes('Pt') || karatType.includes('Platinum')) baseRatePerGram = rates.platinum;
  else if (karatType.includes('Silver')) baseRatePerGram = rates.silver;

  const rawMetalPrice = Math.round(weightGrams * baseRatePerGram);
  const makingCharges = Math.round(rawMetalPrice * (makingPercent / 100));
  const subtotalBeforeTax = rawMetalPrice + makingCharges + Number(stoneCharges || 0);
  const gst = Math.round(subtotalBeforeTax * 0.03);
  const total = subtotalBeforeTax + gst;

  return {
    baseRatePerGram,
    rawMetalPrice,
    makingCharges,
    stoneCharges: Number(stoneCharges || 0),
    subtotalBeforeTax,
    gst,
    total
  };
}
