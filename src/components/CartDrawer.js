/**
 * VAISHU JEWELLERY - Luxury Cart Drawer Component
 * Keeps drawer persistent and open during item removal and quantity updates.
 */

import { formatINR } from '../utils/formatters';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  calculateCartTotals
} from '../services/cartService';
import { showToast } from './Toast';

let activeCoupon = '';
let drawerController = null;

export function openCartDrawer(highlightId = null) {
  if (drawerController) {
    drawerController.open(highlightId);
  }
}

export function closeCartDrawer() {
  if (drawerController) {
    drawerController.close();
  }
}

export function renderCartDrawer() {
  let drawerRoot = document.getElementById('drawer-root');
  if (!drawerRoot) {
    drawerRoot = document.createElement('div');
    drawerRoot.id = 'drawer-root';
    document.body.appendChild(drawerRoot);
  }

  // Create persistent drawer DOM structure ONCE if it doesn't already exist
  if (!document.getElementById('cart-drawer-backdrop')) {
    drawerRoot.innerHTML = `
      <div class="drawer-backdrop" id="cart-drawer-backdrop">
        <div class="cart-drawer" id="cart-drawer-panel">
          <!-- Header -->
          <div class="drawer-header">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.3rem;">🛍️</span>
              <h3 style="font-size: 1.18rem; margin: 0; font-family: var(--font-serif);" id="drawer-header-title">Royal Shopping Bag</h3>
            </div>
            <button class="modal-close-btn" style="position: static;" id="close-drawer-btn" title="Close Shopping Bag">✕</button>
          </div>

          <!-- Insured Shipping Notice -->
          <div class="drawer-transit-banner">
            <span>🛡️</span>
            <span>Complimentary <strong>100% Insured Armoured Transit</strong> on all gold orders</span>
          </div>

          <!-- Scrollable Body for Items -->
          <div class="drawer-body" id="drawer-body-container"></div>

          <!-- Persistent Footer -->
          <div class="drawer-footer" id="drawer-footer-container"></div>
        </div>
      </div>
    `;

    // Backdrop click to close
    const backdrop = document.getElementById('cart-drawer-backdrop');
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeCartDrawer();
      }
    });

    // Close button
    document.getElementById('close-drawer-btn')?.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  const backdrop = document.getElementById('cart-drawer-backdrop');
  const bodyContainer = document.getElementById('drawer-body-container');
  const footerContainer = document.getElementById('drawer-footer-container');
  const headerTitle = document.getElementById('drawer-header-title');

  // Updates only the inner contents without resetting the backdrop or closing the drawer!
  const updateDrawerContent = (highlightId = null) => {
    const cart = getCart();
    const totals = calculateCartTotals(activeCoupon);

    // Update Header Count
    if (headerTitle) {
      headerTitle.textContent = `Royal Shopping Bag (${totals.itemCount})`;
    }

    // Render Body Items
    if (bodyContainer) {
      if (cart.length === 0) {
        bodyContainer.innerHTML = `
          <div class="drawer-empty-state">
            <div style="font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));">💎</div>
            <h4 style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 0.5rem; font-family: var(--font-serif);">Your Bag is Empty</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;">
              Explore our royal collections of 22K heritage bridal, solitaires & sovereign gold coins.
            </p>
            <a href="#shop" class="btn btn-gold" id="drawer-explore-btn" style="padding: 0.75rem 1.75rem;">Discover Collections</a>
          </div>
        `;
        document.getElementById('drawer-explore-btn')?.addEventListener('click', () => {
          closeCartDrawer();
        });
      } else {
        bodyContainer.innerHTML = cart.map(item => {
          const isHighlighted = highlightId && item.id === highlightId;
          return `
            <div class="cart-item-row ${isHighlighted ? 'cart-item-highlight' : ''}" data-row-id="${item.id}" data-row-size="${item.selectedSize}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=300&q=80'" />
              
              <div class="cart-item-info">
                <div class="cart-item-top-row">
                  <h5 class="cart-item-name" title="${item.name}">${item.name}</h5>
                  <button class="btn-remove-item" data-remove-id="${item.id}" data-size="${item.selectedSize}" title="Remove item from bag">
                    ✕
                  </button>
                </div>

                <div class="cart-item-meta">
                  ${item.karat || '22K Pure'} • ${item.selectedSize || 'Standard'}
                </div>

                <div class="cart-item-bottom-row">
                  <div class="cart-item-price">
                    ${formatINR(item.price * item.quantity)}
                  </div>

                  <!-- Quantity Control Pill -->
                  <div class="cart-qty-pill">
                    <button class="btn-qty-minus" data-id="${item.id}" data-size="${item.selectedSize}" title="Decrease quantity">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="btn-qty-plus" data-id="${item.id}" data-size="${item.selectedSize}" title="Increase quantity">+</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Footer
    if (footerContainer) {
      if (cart.length === 0) {
        footerContainer.innerHTML = '';
        footerContainer.style.display = 'none';
      } else {
        footerContainer.style.display = 'block';
        footerContainer.innerHTML = `
          <!-- Coupon Apply Section -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem;">
            <input type="text" id="drawer-coupon-input" placeholder="Coupon (e.g. VAISHU10)" value="${activeCoupon}" class="form-input" style="padding: 0.55rem 0.75rem; font-size: 0.85rem; text-transform: uppercase;" />
            <button class="btn btn-outline-gold" id="btn-apply-coupon" style="padding: 0.55rem 0.95rem; font-size: 0.82rem; white-space: nowrap;">Apply</button>
          </div>

          ${totals.couponInfo ? `
            <div class="coupon-success-tag">
              <span>✓ ${totals.couponInfo.label} applied</span>
              <button id="btn-remove-coupon" class="btn-coupon-remove">Remove</button>
            </div>
          ` : ''}

          <!-- Pricing summary lines -->
          <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Subtotal:</span>
              <span style="color: var(--text-main); font-weight: 500;">${formatINR(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #34d399;">
                <span>Voucher Savings:</span>
                <span>-${formatINR(totals.discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Govt GST (3%):</span>
              <span style="color: var(--text-main); font-weight: 500;">${formatINR(totals.gst)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Insured Armoured Transit:</span>
              <span style="color: #34d399; font-weight: 600;">FREE</span>
            </div>
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; color: var(--gold-bright);">
              <span>Grand Total:</span>
              <span style="font-family: var(--font-serif);">${formatINR(totals.grandTotal)}</span>
            </div>
          </div>

          <!-- Checkout CTA -->
          <a href="#checkout" class="btn btn-gold" id="drawer-checkout-btn" style="width: 100%; padding: 0.9rem; font-size: 1rem; text-align: center; justify-content: center;">
            <span>Proceed to Secure Checkout 🔒</span>
          </a>
        `;

        document.getElementById('drawer-checkout-btn')?.addEventListener('click', () => {
          closeCartDrawer();
        });

        // Coupon events
        const couponInput = document.getElementById('drawer-coupon-input');
        const applyBtn = document.getElementById('btn-apply-coupon');
        const removeCouponBtn = document.getElementById('btn-remove-coupon');

        applyBtn?.addEventListener('click', () => {
          const code = couponInput?.value.trim().toUpperCase();
          if (!code) return;
          activeCoupon = code;
          const t = calculateCartTotals(activeCoupon);
          if (t.couponInfo) {
            showToast(`Voucher code "${code}" applied successfully!`, 'success');
          } else {
            showToast(`Invalid coupon code. Try "VAISHU10" or "GOLD2026".`, 'warning');
          }
          updateDrawerContent();
        });

        removeCouponBtn?.addEventListener('click', () => {
          activeCoupon = '';
          updateDrawerContent();
        });
      }
    }

    // Attach item action events: Plus, Minus, Remove (with smooth animations)
    attachItemActionEvents();
  };

  const attachItemActionEvents = () => {
    // Quantity Plus
    bodyContainer?.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.selectedSize === size);
        if (item) {
          updateCartQuantity(id, size, item.quantity + 1);
          updateDrawerContent();
        }
      });
    });

    // Quantity Minus
    bodyContainer?.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.selectedSize === size);
        if (item) {
          if (item.quantity > 1) {
            updateCartQuantity(id, size, item.quantity - 1);
            updateDrawerContent();
          } else {
            // If reducing 1 -> 0, trigger smooth exit animation!
            const row = btn.closest('.cart-item-row');
            if (row) {
              row.classList.add('item-row-exiting');
              setTimeout(() => {
                removeFromCart(id, size);
                updateDrawerContent();
              }, 260);
            } else {
              removeFromCart(id, size);
              updateDrawerContent();
            }
          }
        }
      });
    });

    // Remove Item with smooth slide-out animation (Drawer stays 100% open!)
    bodyContainer?.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-id');
        const size = btn.getAttribute('data-size');
        const row = btn.closest('.cart-item-row');

        if (row) {
          row.classList.add('item-row-exiting');
          setTimeout(() => {
            removeFromCart(id, size);
            // Re-render contents in place; drawer backdrop remains .open!
            updateDrawerContent();
          }, 260);
        } else {
          removeFromCart(id, size);
          updateDrawerContent();
        }
      });
    });
  };

  // Initial populate
  updateDrawerContent();

  drawerController = {
    open: (highlightId = null) => {
      updateDrawerContent(highlightId);
      backdrop?.classList.add('open');
      // If highlighted, smoothly scroll that item into view
      if (highlightId && bodyContainer) {
        setTimeout(() => {
          const highlightedEl = bodyContainer.querySelector(`[data-row-id="${highlightId}"]`);
          highlightedEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    },
    close: () => {
      backdrop?.classList.remove('open');
    }
  };

  return drawerController;
}
