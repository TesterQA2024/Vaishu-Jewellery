/**
 * VAISHU JEWELLERY - Order Management Service
 * Cloud Firestore Integration for Orders, Live Tracking & Invoicing
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';

const LOCAL_ORDERS_KEY = 'vaishu_orders_history_v1';

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Place a new jewellery order
 */
export async function placeOrder({
  user,
  items,
  shippingAddress,
  paymentMethod,
  pricingSummary,
  specialInstructions = ''
}) {
  const orderId = 'VJ-ORD-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  const trackingNumber = 'VJ-SECURE-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const orderData = {
    orderId,
    trackingNumber,
    userId: user?.uid || 'guest_' + Date.now(),
    customerName: shippingAddress.fullName,
    customerEmail: shippingAddress.email || user?.email || '',
    customerPhone: shippingAddress.phone,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize || 'Standard',
      image: item.image,
      karat: item.karat
    })),
    shippingAddress: {
      fullName: shippingAddress.fullName,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2 || '',
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      phone: shippingAddress.phone
    },
    payment: {
      method: paymentMethod, // 'UPI' | 'Card' | 'NetBanking' | 'COD'
      status: paymentMethod === 'COD' ? 'Pending on Delivery' : 'Paid & Secured in Escrow',
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      subtotal: pricingSummary.subtotal,
      discount: pricingSummary.discount || 0,
      gst: pricingSummary.gst,
      shipping: pricingSummary.shipping,
      grandTotal: pricingSummary.grandTotal
    },
    status: 'Order Placed', // 'Order Placed' | 'Under Crafting & Hallmarking' | 'Insured Transit' | 'Delivered'
    insurancePolicyNumber: 'NEW-INDIA-ASSUR-' + Math.floor(1000000 + Math.random() * 9000000),
    specialInstructions,
    createdAt: new Date().toISOString()
  };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'orders', orderId), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update product inventory in Firestore
      for (const item of items) {
        try {
          const prodRef = doc(db, 'products', item.id);
          const pSnap = await getDoc(prodRef);
          if (pSnap.exists()) {
            const currentStock = pSnap.data().stockCount || 1;
            const newStock = Math.max(0, currentStock - (item.quantity || 1));
            await updateDoc(prodRef, {
              stockCount: newStock,
              inStock: newStock > 0
            });
          }
        } catch (e) {
          console.warn('Inventory decrement error for product:', item.id, e);
        }
      }

      return orderData;
    } catch (err) {
      console.warn('Firestore order placement error, fallback to local:', err);
    }
  }

  // Local fallback: update local product stock
  try {
    const rawProds = localStorage.getItem('vaishu_jewellery_products_v1');
    if (rawProds) {
      const prods = JSON.parse(rawProds);
      items.forEach(cartItem => {
        const p = prods.find(x => x.id === cartItem.id);
        if (p) {
          p.stockCount = Math.max(0, (p.stockCount || 1) - (cartItem.quantity || 1));
          p.inStock = p.stockCount > 0;
        }
      });
      localStorage.setItem('vaishu_jewellery_products_v1', JSON.stringify(prods));
    }
  } catch (e) {}

  const local = getLocalOrders();
  local.unshift(orderData);
  saveLocalOrders(local);
  return orderData;
}

/**
 * Fetch orders for a specific customer
 */
export async function getCustomerOrders(userId, userEmail) {
  if (db && isLiveFirebaseConfigured) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Firestore fetch customer orders error:', err);
    }
  }

  const local = getLocalOrders();
  return local.filter(o => o.userId === userId || (userEmail && o.customerEmail === userEmail));
}

/**
 * Admin: Fetch all orders
 */
export async function getAllOrdersAdmin() {
  if (db && isLiveFirebaseConfigured) {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Firestore admin fetch orders error:', err);
    }
  }

  return getLocalOrders();
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore order update error:', err);
    }
  }

  const local = getLocalOrders();
  const order = local.find(o => o.orderId === orderId || o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveLocalOrders(local);
  }
  return true;
}
