/**
 * VAISHU JEWELLERY - Cart & Wishlist Service
 * Handles customer shopping cart, wishlist, coupon codes, and pricing summaries.
 */

const CART_KEY = 'vaishu_cart_items_v1';
const WISHLIST_KEY = 'vaishu_wishlist_items_v1';

// Coupon database
export const COUPONS = {
  'VAISHU10': { discountPercent: 10, label: '10% Royal Welcome Discount', maxDiscount: 25000 },
  'GOLD2026': { flatDiscount: 5000, label: '₹5,000 Akshaya Gold Voucher', minOrder: 50000 },
  'BRIDAL50K': { flatDiscount: 50000, label: '₹50,000 Grand Wedding Suite Rebate', minOrder: 500000 }
};

// Event listeners for reactive UI
const listeners = new Set();
export function subscribeToCart(callback) {
  listeners.add(callback);
  callback(getCart());
  return () => listeners.delete(callback);
}

function notifyListeners() {
  const current = getCart();
  listeners.forEach(cb => cb(current));
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyListeners();
}

export function addToCart(product, quantity = 1, size = 'Standard', customNote = '') {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === product.id && item.selectedSize === size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      karat: product.karat,
      weightGrams: product.weightGrams,
      selectedSize: size,
      customNote: customNote,
      quantity: quantity
    });
  }

  saveCart(cart);
}

export function updateCartQuantity(productId, size, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(item => !(item.id === productId && item.selectedSize === size));
  } else {
    const item = cart.find(item => item.id === productId && item.selectedSize === size);
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.selectedSize === size));
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function calculateCartTotals(appliedCouponCode = '') {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free insured express shipping over ₹10,000
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 500;
  
  let discount = 0;
  let couponInfo = null;

  if (appliedCouponCode && COUPONS[appliedCouponCode.toUpperCase()]) {
    const coupon = COUPONS[appliedCouponCode.toUpperCase()];
    if (!coupon.minOrder || subtotal >= coupon.minOrder) {
      if (coupon.discountPercent) {
        discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount || Infinity);
      } else if (coupon.flatDiscount) {
        discount = coupon.flatDiscount;
      }
      couponInfo = { code: appliedCouponCode.toUpperCase(), ...coupon, amount: discount };
    }
  }

  // 3% GST included or added
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = Math.round(taxableAmount * 0.03);
  const grandTotal = taxableAmount + gst + shipping;

  return {
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
    subtotal,
    discount,
    couponInfo,
    shipping,
    gst,
    grandTotal
  };
}

// Wishlist methods
export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(product) {
  let list = getWishlist();
  const index = list.findIndex(p => p.id === product.id);
  let isAdded = false;

  if (index > -1) {
    list.splice(index, 1);
    isAdded = false;
  } else {
    list.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      karat: product.karat,
      inStock: product.inStock
    });
    isAdded = true;
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return { isAdded, list };
}

export function isInWishlist(productId) {
  const list = getWishlist();
  return list.some(item => item.id === productId);
}
