/**
 * VAISHU JEWELLERY - Secure Checkout Page
 */

import { getCart, calculateCartTotals, clearCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import { formatINR } from '../utils/formatters';
import { showToast } from '../components/Toast';
import confetti from 'canvas-confetti';

export function renderCheckoutPage(container, currentUser, onOrderCompleted) {
  const cart = getCart();
  const totals = calculateCartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="container" style="padding: 6rem 1.5rem; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛍️</div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">Your Bag is Empty</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Please add your desired jewellery pieces before proceeding to checkout.</p>
        <a href="#shop" class="btn btn-gold">Explore Collections</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <section style="padding: 3rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 3rem;">
          <div class="hero-badge">🔒 256-Bit SSL Encrypted Escrow</div>
          <h1 style="font-size: 2.3rem;" class="text-gold-gradient">Secure Vault Checkout</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">BIS 916 certified ornaments delivered via insured armoured courier</p>
        </div>

        <form id="checkout-form">
          <div class="checkout-grid">
            <!-- Left Column: Shipping & Payment Details -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
              <!-- Shipping Address Box -->
              <div class="admin-card">
                <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>📍</span>
                  <span>Insured Delivery Address</span>
                </h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="ship-name" class="form-input" value="${currentUser?.displayName || ''}" placeholder="Maharani Gayatri" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Mobile Number (for Courier OTP) *</label>
                    <input type="tel" id="ship-phone" class="form-input" value="${currentUser?.phone || '+91 98765 43210'}" placeholder="+91 98765 43210" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address (for Invoice & Insurance Certificate) *</label>
                  <input type="email" id="ship-email" class="form-input" value="${currentUser?.email || ''}" placeholder="patron@vaishujewellery.com" required />
                </div>

                <div class="form-group">
                  <label class="form-label">Flat / Villa / Street Address *</label>
                  <input type="text" id="ship-address1" class="form-input" placeholder="701, Royal Sapphire Enclave, Marine Drive" required />
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label">City *</label>
                    <input type="text" id="ship-city" class="form-input" value="Mumbai" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">State *</label>
                    <input type="text" id="ship-state" class="form-input" value="Maharashtra" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Pincode *</label>
                    <input type="text" id="ship-pincode" class="form-input" value="400020" maxlength="6" required />
                  </div>
                </div>
              </div>

              <!-- Payment Method Selection -->
              <div class="admin-card">
                <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>💳</span>
                  <span>Payment & Insurance Escrow</span>
                </h3>

                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
                  <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-main); border: 1px solid var(--border-gold); border-radius: var(--radius-md); cursor: pointer;">
                    <input type="radio" name="paymentMethod" value="UPI" checked style="accent-color: var(--gold-primary);" />
                    <div>
                      <strong style="color: #fff;">Instant UPI / QR Code (GPay, PhonePe, Paytm)</strong>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">Instant verification with 1% additional gold loyalty coin</div>
                    </div>
                  </label>

                  <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer;">
                    <input type="radio" name="paymentMethod" value="Card" style="accent-color: var(--gold-primary);" />
                    <div>
                      <strong style="color: #fff;">Credit / Debit Card (Visa, Mastercard, Amex)</strong>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">Complimentary 3, 6 & 9 Months Zero-Cost EMI available</div>
                    </div>
                  </label>

                  <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer;">
                    <input type="radio" name="paymentMethod" value="COD" style="accent-color: var(--gold-primary);" />
                    <div>
                      <strong style="color: #fff;">Cash on Delivery with Security Guard Verification</strong>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">Pay upon OTP handshake and assay certificate inspection</div>
                    </div>
                  </label>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Special Inscription / Delivery Instructions</label>
                  <textarea id="order-instructions" class="form-textarea" rows="2" placeholder="e.g. Please laser-engrave 'Forever' inside the ring, deliver only between 10am-4pm."></textarea>
                </div>
              </div>
            </div>

            <!-- Right Column: Order Summary Card -->
            <div class="admin-card" style="border-color: var(--border-gold); position: sticky; top: 100px;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Order Summary (${totals.itemCount} items)</h3>

              <!-- Items mini list -->
              <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                ${cart.map(i => `
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <img src="${i.image}" alt="${i.name}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;" />
                      <div>
                        <div style="font-weight: 600; color: #fff; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${i.name}</div>
                        <div style="font-size: 0.75rem; color: var(--gold-dark);">${i.selectedSize} × ${i.quantity}</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; color: var(--gold-bright);">${formatINR(i.price * i.quantity)}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Breakdown totals -->
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; margin-bottom: 1.5rem;">
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
                  <span>Armoured Express Shipping:</span>
                  <span style="color: #34d399; font-weight: 600;">FREE (₹0)</span>
                </div>
                <div style="border-top: 1px solid var(--border-gold); padding-top: 1rem; display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: var(--gold-bright);">
                  <span>Total Payable:</span>
                  <span style="font-family: var(--font-serif);">${formatINR(totals.grandTotal)}</span>
                </div>
              </div>

              <button type="submit" class="btn btn-gold" id="btn-place-order" style="width: 100%; padding: 1rem; font-size: 1.05rem;">
                <span>Confirm & Place Order ✨</span>
              </button>

              <div style="text-align: center; margin-top: 1rem; font-size: 0.78rem; color: var(--text-muted);">
                🛡️ Backed by Vaishu 100% Purity & Buyback Guarantee
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  `;

  // Attach Checkout Submit Event
  const form = document.getElementById('checkout-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-place-order');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Order with Cloud Firestore...</span>';
    }

    const shippingAddress = {
      fullName: document.getElementById('ship-name').value.trim(),
      phone: document.getElementById('ship-phone').value.trim(),
      email: document.getElementById('ship-email').value.trim(),
      addressLine1: document.getElementById('ship-address1').value.trim(),
      city: document.getElementById('ship-city').value.trim(),
      state: document.getElementById('ship-state').value.trim(),
      pincode: document.getElementById('ship-pincode').value.trim()
    };

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';
    const specialInstructions = document.getElementById('order-instructions')?.value.trim();

    try {
      const order = await placeOrder({
        user: currentUser,
        items: cart,
        shippingAddress,
        paymentMethod,
        pricingSummary: totals,
        specialInstructions
      });

      // Trigger royal celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#FFFFFF']
      });

      clearCart();
      showToast('Order successfully placed! Your jewellery is in craftsmanship.', 'success');

      if (onOrderCompleted) {
        onOrderCompleted(order);
      } else {
        window.location.hash = '#orders';
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast('Could not complete order: ' + err.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Confirm & Place Order ✨</span>';
      }
    }
  });
}
