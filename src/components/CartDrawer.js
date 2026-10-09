/**
 * VAISHU JEWELLERY - Cart Drawer Component
 */

import { formatINR } from '../utils/formatters';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  calculateCartTotals,
  subscribeToCart
} from '../services/cartService';
import { showToast } from './Toast';

let activeCoupon = '';

export function renderCartDrawer() {
  let drawerRoot = document.getElementById('drawer-root');
  if (!drawerRoot) {
    drawerRoot = document.createElement('div');
    drawerRoot.id = 'drawer-root';
    document.body.appendChild(drawerRoot);
  }

  const updateDrawerContent = () => {
    const cart = getCart();
    const totals = calculateCartTotals(activeCoupon);

    drawerRoot.innerHTML = `
      <div class="drawer-backdrop" id="cart-drawer-backdrop">
        <div class="cart-drawer">
          <!-- Header -->
          <div class="drawer-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.2rem;">🛍️</span>
              <h3 style="font-size: 1.15rem; margin: 0;">Royal Shopping Bag (${totals.itemCount})</h3>
            </div>
            <button class="modal-close-btn" style="position: static;" id="close-drawer-btn">✕</button>
          </div>

          <!-- Insured Shipping Progress Bar -->
          <div style="background: rgba(212, 175, 55, 0.08); padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🛡️</span>
            <span>Complimentary <strong>100% Insured Armoured Transit</strong> on all gold orders</span>
          </div>

          <!-- Body / Items List -->
          <div class="drawer-body">
            ${cart.length === 0 ? `
              <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">💎</div>
                <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem;">Your Bag is Empty</h4>
                <p style="font-size: 0.85rem; margin-bottom: 1.5rem;">Explore our royal collection of heritage bridal, diamond solitaires & gold bullion.</p>
                <a href="#shop" class="btn btn-gold" id="drawer-explore-btn">Discover Collections</a>
              </div>
            ` : cart.map(item => `
              <div style="display: flex; gap: 1rem; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <img src="${item.image}" alt="${item.name}" style="width: 75px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-gold);" />
                
                <div style="flex-grow: 1; display: flex; flex-direction: column;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                    <h5 style="font-size: 0.9rem; line-height: 1.25; margin: 0; color: #fff;">${item.name}</h5>
                    <button class="btn-remove-item" data-remove-id="${item.id}" data-size="${item.selectedSize}" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 0.8rem;" title="Remove">✕</button>
                  </div>

                  <div style="font-size: 0.75rem; color: var(--gold-dark); margin: 0.25rem 0;">
                    ${item.karat} • ${item.selectedSize}
                  </div>

                  <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-family: var(--font-serif); font-weight: 700; color: var(--gold-bright); font-size: 1rem;">
                      ${formatINR(item.price * item.quantity)}
                    </div>

                    <!-- Quantity Control -->
                    <div style="display: flex; align-items: center; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                      <button class="btn-qty-minus" data-id="${item.id}" data-size="${item.selectedSize}" style="background: none; border: none; color: #fff; width: 26px; height: 26px; cursor: pointer;">-</button>
                      <span style="font-size: 0.85rem; font-weight: 600; width: 24px; text-align: center;">${item.quantity}</span>
                      <button class="btn-qty-plus" data-id="${item.id}" data-size="${item.selectedSize}" style="background: none; border: none; color: #fff; width: 26px; height: 26px; cursor: pointer;">+</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Footer Summary -->
          ${cart.length > 0 ? `
            <div class="drawer-footer">
              <!-- Coupon Apply Section -->
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <input type="text" id="drawer-coupon-input" placeholder="Coupon (e.g. VAISHU10)" value="${activeCoupon}" class="form-input" style="padding: 0.5rem 0.75rem; font-size: 0.85rem; text-transform: uppercase;" />
                <button class="btn btn-outline-gold" id="btn-apply-coupon" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; white-space: nowrap;">Apply</button>
              </div>

              ${totals.couponInfo ? `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--emerald-accent); padding: 0.4rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.78rem; color: #34d399; margin-bottom: 1rem; display: flex; justify-content: space-between;">
                  <span>✓ ${totals.couponInfo.label} applied</span>
                  <button id="btn-remove-coupon" style="background:none; border:none; color:#ff6b6b; cursor:pointer; font-weight:700;">Remove</button>
                </div>
              ` : ''}

              <!-- Pricing summary lines -->
              <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Subtotal:</span>
                  <span style="color: #fff;">${formatINR(totals.subtotal)}</span>
                </div>
                ${totals.discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; color: #34d399;">
                    <span>Voucher Savings:</span>
                    <span>-${formatINR(totals.discount)}</span>
                  </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Govt GST (3%):</span>
                  <span style="color: #fff;">${formatINR(totals.gst)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Insured Armoured Transit:</span>
                  <span style="color: #34d399; font-weight: 600;">FREE</span>
                </div>
                <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: var(--gold-bright);">
                  <span>Grand Total:</span>
                  <span style="font-family: var(--font-serif);">${formatINR(totals.grandTotal)}</span>
                </div>
              </div>

              <!-- Checkout CTA -->
              <a href="#checkout" class="btn btn-gold" id="drawer-checkout-btn" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
                <span>Proceed to Secure Checkout 🔒</span>
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    attachDrawerEvents();
  };

  const attachDrawerEvents = () => {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const closeBtn = document.getElementById('close-drawer-btn');
    const exploreBtn = document.getElementById('drawer-explore-btn');
    const checkoutBtn = document.getElementById('drawer-checkout-btn');

    const close = () => {
      backdrop?.classList.remove('open');
    };

    closeBtn?.addEventListener('click', close);
    exploreBtn?.addEventListener('click', close);
    checkoutBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    // Quantity Plus/Minus
    drawerRoot.querySelectorAll('.btn-qty-plus').forEach(btn => {
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

    drawerRoot.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.selectedSize === size);
        if (item) {
          updateCartQuantity(id, size, item.quantity - 1);
          updateDrawerContent();
        }
      });
    });

    // Remove item
    drawerRoot.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-id');
        const size = btn.getAttribute('data-size');
        removeFromCart(id, size);
        showToast('Item removed from shopping bag.', 'info');
        updateDrawerContent();
      });
    });

    // Coupon Apply
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
        showToast(`Invalid or ineligible coupon code. Try "VAISHU10" or "GOLD2026".`, 'warning');
      }
      updateDrawerContent();
    });

    removeCouponBtn?.addEventListener('click', () => {
      activeCoupon = '';
      showToast('Coupon removed.', 'info');
      updateDrawerContent();
    });
  };

  updateDrawerContent();

  return {
    open: () => {
      updateDrawerContent();
      const backdrop = document.getElementById('cart-drawer-backdrop');
      backdrop?.classList.add('open');
    },
    close: () => {
      const backdrop = document.getElementById('cart-drawer-backdrop');
      backdrop?.classList.remove('open');
    }
  };
}
