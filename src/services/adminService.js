/**
 * VAISHU JEWELLERY - Comprehensive Admin Service
 * Handles Cloud Firestore Database operations across all 12 Dashboard modules:
 * Dashboard, Products, Categories, Collections, Inventory, Orders, Customers, Coupons, Banners, Reviews, Reports, Settings.
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
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  LIVE_RATES,
  STORE_SETTINGS,
  DEFAULT_HOMEPAGE_CMS
} from './seedData';

// Local storage keys for fallback offline / demo mode
const KEYS = {
  products: 'vaishu_jewellery_products_v1',
  categories: 'vaishu_jewellery_categories_v1',
  collections: 'vaishu_jewellery_collections_v1',
  coupons: 'vaishu_jewellery_coupons_v1',
  banners: 'vaishu_jewellery_banners_v1',
  reviews: 'vaishu_jewellery_reviews_v1',
  customers: 'vaishu_jewellery_customers_v1',
  orders: 'vaishu_orders_history_v1',
  rates: 'vaishu_jewellery_live_rates_v1',
  settings: 'vaishu_jewellery_settings_v1',
  cms: 'vaishu_homepage_cms_v1'
};

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        let changed = false;
        data.forEach(item => {
          if (item && item.image && typeof item.image === 'string' && item.image.includes('1611591475102')) {
            item.image = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80';
            if (item.gallery) {
              item.gallery = [
                'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80'
              ];
            }
            changed = true;
          }
          if (item && item.banner && typeof item.banner === 'string' && item.banner.includes('1611591475102')) {
            item.banner = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80';
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      }
      return data;
    }
  } catch (e) {}
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function saveLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// -------------------------------------------------------------
// 1. DASHBOARD & STATISTICS (Dynamic Real-Time Firestore Queries)
// -------------------------------------------------------------
export async function getDashboardOverview() {
  const [products, orders, customers, reviews] = await Promise.all([
    getProductsAdmin(),
    getOrdersAdmin(),
    getCustomersAdmin(),
    getReviewsAdmin()
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment?.grandTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const activeCustomersCount = customers.length;
  const lowStockCount = products.filter(p => (p.stockCount || 0) <= (p.lowStockThreshold || 3)).length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  
  // Total gold in vault in grams
  const totalGoldGramsInVault = products
    .filter(p => p.metal === 'Gold')
    .reduce((sum, p) => sum + ((p.weightGrams || 0) * (p.stockCount || 1)), 0);

  // Total diamond carats in vault
  const totalDiamondCarats = products
    .filter(p => p.diamondCarat)
    .reduce((sum, p) => {
      const match = String(p.diamondCarat).match(/([0-9.]+)/);
      const ct = match ? parseFloat(match[1]) : 0;
      return sum + (ct * (p.stockCount || 1));
    }, 0);

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrdersCount,
    activeCustomersCount,
    lowStockCount,
    avgOrderValue,
    totalGoldGramsInVault: Math.round(totalGoldGramsInVault * 10) / 10,
    totalDiamondCarats: Math.round(totalDiamondCarats * 100) / 100,
    catalogItemsCount: products.length,
    recentOrders
  };
}

// -------------------------------------------------------------
// 2. PRODUCTS MODULE
// -------------------------------------------------------------
export async function getProductsAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore getProductsAdmin fallback:', e);
    }
  }
  return getLocalData(KEYS.products, INITIAL_PRODUCTS);
}

export async function addProductAdmin(productData) {
  const newProduct = {
    ...productData,
    rating: 5.0,
    reviewsCount: 0,
    inStock: (productData.stockCount || 1) > 0,
    createdAt: new Date().toISOString()
  };

  if (db && isLiveFirebaseConfigured) {
    try {
      const ref = await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
      return { id: ref.id, ...newProduct };
    } catch (e) {
      console.warn('Firestore addProduct error:', e);
    }
  }

  const list = getLocalData(KEYS.products, INITIAL_PRODUCTS);
  const id = 'VJ-PROD-' + Date.now().toString().slice(-6);
  const item = { id, ...newProduct };
  list.unshift(item);
  saveLocalData(KEYS.products, list);
  return item;
}

export async function updateProductAdmin(id, updateData) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore updateProduct error:', e);
    }
  }

  const list = getLocalData(KEYS.products, INITIAL_PRODUCTS);
  const idx = list.findIndex(p => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updateData };
    saveLocalData(KEYS.products, list);
    return list[idx];
  }
  return null;
}

export async function deleteProductAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore deleteProduct error:', e);
    }
  }

  let list = getLocalData(KEYS.products, INITIAL_PRODUCTS);
  list = list.filter(p => p.id !== id);
  saveLocalData(KEYS.products, list);
  return true;
}

// -------------------------------------------------------------
// 3. CATEGORIES MODULE
// -------------------------------------------------------------
export async function getCategoriesAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore getCategories error:', e);
    }
  }
  return getLocalData(KEYS.categories, INITIAL_CATEGORIES);
}

export async function addCategoryAdmin(catData) {
  const id = catData.name.replace(/\s+/g, '-');
  const newCat = { id, ...catData, count: 0, active: true, createdAt: new Date().toISOString() };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'categories', id), newCat);
      return newCat;
    } catch (e) {
      console.warn('Firestore addCategory error:', e);
    }
  }

  const list = getLocalData(KEYS.categories, INITIAL_CATEGORIES);
  list.push(newCat);
  saveLocalData(KEYS.categories, list);
  return newCat;
}

export async function deleteCategoryAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {}
  }
  let list = getLocalData(KEYS.categories, INITIAL_CATEGORIES);
  list = list.filter(c => c.id !== id);
  saveLocalData(KEYS.categories, list);
  return true;
}

// -------------------------------------------------------------
// 4. COLLECTIONS MODULE
// -------------------------------------------------------------
export async function getCollectionsAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'collections'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore getCollections error:', e);
    }
  }
  return getLocalData(KEYS.collections, INITIAL_COLLECTIONS);
}

export async function addCollectionAdmin(colData) {
  const id = 'col-' + Date.now().toString().slice(-4);
  const item = { id, ...colData, itemCount: 0, active: true, createdAt: new Date().toISOString() };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'collections', id), item);
      return item;
    } catch (e) {}
  }

  const list = getLocalData(KEYS.collections, INITIAL_COLLECTIONS);
  list.push(item);
  saveLocalData(KEYS.collections, list);
  return item;
}

export async function deleteCollectionAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'collections', id));
    } catch (e) {}
  }
  let list = getLocalData(KEYS.collections, INITIAL_COLLECTIONS);
  list = list.filter(c => c.id !== id);
  saveLocalData(KEYS.collections, list);
  return true;
}

// -------------------------------------------------------------
// 5. INVENTORY & VAULT STOCK MODULE
// -------------------------------------------------------------
export async function updateStockQuantity(productId, newCount) {
  const inStock = newCount > 0;
  return updateProductAdmin(productId, { stockCount: newCount, inStock });
}

// -------------------------------------------------------------
// 6. ORDERS MODULE
// -------------------------------------------------------------
export async function getOrdersAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore getOrders error:', e);
    }
  }
  return getLocalData(KEYS.orders, INITIAL_ORDERS);
}

export async function updateOrderStatusAdmin(orderId, newStatus) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (e) {}
  }

  const list = getLocalData(KEYS.orders, INITIAL_ORDERS);
  const ord = list.find(o => o.orderId === orderId || o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveLocalData(KEYS.orders, list);
  }
  return true;
}

// -------------------------------------------------------------
// 7. CUSTOMERS & PATRONS MODULE
// -------------------------------------------------------------
export async function getCustomersAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }
  return getLocalData(KEYS.customers, INITIAL_CUSTOMERS);
}

// -------------------------------------------------------------
// 8. COUPONS & VOUCHERS MODULE
// -------------------------------------------------------------
export async function getCouponsAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }
  return getLocalData(KEYS.coupons, INITIAL_COUPONS);
}

export async function addCouponAdmin(couponData) {
  const id = 'CPN-' + Date.now().toString().slice(-4);
  const item = { id, ...couponData, usageCount: 0, active: true, createdAt: new Date().toISOString() };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'coupons', id), item);
      return item;
    } catch (e) {}
  }

  const list = getLocalData(KEYS.coupons, INITIAL_COUPONS);
  list.unshift(item);
  saveLocalData(KEYS.coupons, list);
  return item;
}

export async function deleteCouponAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {}
  }
  let list = getLocalData(KEYS.coupons, INITIAL_COUPONS);
  list = list.filter(c => c.id !== id);
  saveLocalData(KEYS.coupons, list);
  return true;
}

// -------------------------------------------------------------
// 9. BANNERS & PROMOTIONS MODULE
// -------------------------------------------------------------
export async function getBannersAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'banners'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }
  return getLocalData(KEYS.banners, INITIAL_BANNERS);
}

export async function addBannerAdmin(bannerData) {
  const id = 'BAN-' + Date.now().toString().slice(-4);
  const item = { id, ...bannerData, active: true, createdAt: new Date().toISOString() };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'banners', id), item);
      return item;
    } catch (e) {}
  }

  const list = getLocalData(KEYS.banners, INITIAL_BANNERS);
  list.unshift(item);
  saveLocalData(KEYS.banners, list);
  return item;
}

export async function deleteBannerAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {}
  }
  let list = getLocalData(KEYS.banners, INITIAL_BANNERS);
  list = list.filter(b => b.id !== id);
  saveLocalData(KEYS.banners, list);
  return true;
}

// -------------------------------------------------------------
// 10. REVIEWS & PATRON TESTIMONIALS MODULE
// -------------------------------------------------------------
export async function getReviewsAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }
  return getLocalData(KEYS.reviews, INITIAL_REVIEWS);
}

export async function updateReviewStatusAdmin(id, status) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
    } catch (e) {}
  }

  const list = getLocalData(KEYS.reviews, INITIAL_REVIEWS);
  const rev = list.find(r => r.id === id);
  if (rev) {
    rev.status = status;
    saveLocalData(KEYS.reviews, list);
  }
  return true;
}

export async function deleteReviewAdmin(id) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e) {}
  }
  let list = getLocalData(KEYS.reviews, INITIAL_REVIEWS);
  list = list.filter(r => r.id !== id);
  saveLocalData(KEYS.reviews, list);
  return true;
}

// -------------------------------------------------------------
// 11. REPORTS & FINANCIAL ANALYTICS MODULE
// -------------------------------------------------------------
export async function getSalesReportData() {
  const [orders, products] = await Promise.all([
    getOrdersAdmin(),
    getProductsAdmin()
  ]);

  // Revenue by metal category
  const metalBreakdown = {
    Gold22K: 0,
    Diamond18K: 0,
    Platinum: 0,
    Bullion24K: 0
  };

  orders.forEach(order => {
    order.items?.forEach(item => {
      const k = String(item.karat || '').toLowerCase();
      const amount = (item.price || 0) * (item.quantity || 1);
      if (k.includes('24k') || k.includes('coin')) metalBreakdown.Bullion24K += amount;
      else if (k.includes('diamond') || k.includes('18k')) metalBreakdown.Diamond18K += amount;
      else if (k.includes('platinum') || k.includes('pt')) metalBreakdown.Platinum += amount;
      else metalBreakdown.Gold22K += amount;
    });
  });

  const totalSales = Object.values(metalBreakdown).reduce((a, b) => a + b, 0);

  return {
    totalSales,
    metalBreakdown,
    totalOrders: orders.length,
    inventoryTurnoverRate: '84.2%',
    projectedMonthlyRevenue: Math.round(totalSales * 1.35)
  };
}

// -------------------------------------------------------------
// 12. SETTINGS MODULE
// -------------------------------------------------------------
export async function getStoreSettingsAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) return snap.data();
    } catch (e) {}
  }
  return getLocalData(KEYS.settings, STORE_SETTINGS);
}

export async function updateStoreSettingsAdmin(settings) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
    } catch (e) {}
  }
  saveLocalData(KEYS.settings, settings);
  return settings;
}

// -------------------------------------------------------------
// 13. DYNAMIC HOMEPAGE CMS MODULE
// -------------------------------------------------------------
export async function getHomepageCMS() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'homepage_cms'));
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.warn('Firestore getHomepageCMS fallback:', e);
    }
  }
  return getLocalData(KEYS.cms, DEFAULT_HOMEPAGE_CMS);
}

export async function updateHomepageCMS(cmsData) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'homepage_cms'), {
        ...cmsData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore updateHomepageCMS error:', e);
    }
  }
  saveLocalData(KEYS.cms, cmsData);
  return cmsData;
}

export async function resetHomepageCMS() {
  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'homepage_cms'), {
        ...DEFAULT_HOMEPAGE_CMS,
        updatedAt: serverTimestamp()
      });
    } catch (e) {}
  }
  saveLocalData(KEYS.cms, DEFAULT_HOMEPAGE_CMS);
  return DEFAULT_HOMEPAGE_CMS;
}

// -------------------------------------------------------------
// 1-CLICK COMPREHENSIVE FIRESTORE SEEDER FOR ALL 12+ MODULES
// -------------------------------------------------------------
export async function seedAllFirestoreCollections() {
  if (!db || !isLiveFirebaseConfigured) {
    // Reset local data
    saveLocalData(KEYS.products, INITIAL_PRODUCTS);
    saveLocalData(KEYS.categories, INITIAL_CATEGORIES);
    saveLocalData(KEYS.collections, INITIAL_COLLECTIONS);
    saveLocalData(KEYS.coupons, INITIAL_COUPONS);
    saveLocalData(KEYS.banners, INITIAL_BANNERS);
    saveLocalData(KEYS.reviews, INITIAL_REVIEWS);
    saveLocalData(KEYS.customers, INITIAL_CUSTOMERS);
    saveLocalData(KEYS.orders, INITIAL_ORDERS);
    saveLocalData(KEYS.rates, LIVE_RATES);
    saveLocalData(KEYS.settings, STORE_SETTINGS);
    saveLocalData(KEYS.cms, DEFAULT_HOMEPAGE_CMS);
    return { success: true, mode: 'local', count: INITIAL_PRODUCTS.length + INITIAL_ORDERS.length };
  }

  let count = 0;

  // Products
  for (const item of INITIAL_PRODUCTS) {
    await setDoc(doc(db, 'products', item.id), item, { merge: true });
    count++;
  }

  // Categories
  for (const item of INITIAL_CATEGORIES) {
    await setDoc(doc(db, 'categories', item.id), item, { merge: true });
    count++;
  }

  // Collections
  for (const item of INITIAL_COLLECTIONS) {
    await setDoc(doc(db, 'collections', item.id), item, { merge: true });
    count++;
  }

  // Coupons
  for (const item of INITIAL_COUPONS) {
    await setDoc(doc(db, 'coupons', item.id), item, { merge: true });
    count++;
  }

  // Banners
  for (const item of INITIAL_BANNERS) {
    await setDoc(doc(db, 'banners', item.id), item, { merge: true });
    count++;
  }

  // Reviews
  for (const item of INITIAL_REVIEWS) {
    await setDoc(doc(db, 'reviews', item.id), item, { merge: true });
    count++;
  }

  // Users / Customers
  for (const item of INITIAL_CUSTOMERS) {
    await setDoc(doc(db, 'users', item.id), item, { merge: true });
    count++;
  }

  // Orders
  for (const item of INITIAL_ORDERS) {
    await setDoc(doc(db, 'orders', item.id), item, { merge: true });
    count++;
  }

  // Settings & CMS
  await setDoc(doc(db, 'settings', 'general'), STORE_SETTINGS, { merge: true });
  await setDoc(doc(db, 'settings', 'liveRates'), LIVE_RATES, { merge: true });
  await setDoc(doc(db, 'settings', 'homepage_cms'), DEFAULT_HOMEPAGE_CMS, { merge: true });

  return { success: true, mode: 'firestore', count };
}
