/**
 * VAISHU JEWELLERY - Customer Orders & Live Tracking View
 */

import { getCustomerOrders } from '../services/orderService';
import { formatINR, formatDate } from '../utils/formatters';
import { showToast } from '../components/Toast';

export async function renderOrdersPage(container, currentUser, onOpenAuthModal) {
  const userId = currentUser?.uid || 'guest_user';
  const userEmail = currentUser?.email || '';

  const orders = await getCustomerOrders(userId, userEmail);

  container.innerHTML = `
    <section style="padding: 3rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="margin-bottom: 2.5rem;">
          <h1 style="font-size: 2.2rem;" class="text-gold-gradient">My Royal Orders & Vault Deliveries</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Real-time tracking of your BIS hallmarked jewellery and insured shipments.</p>
        </div>

        ${orders.length === 0 ? `
          <div style="text-align: center; padding: 5rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border-gold); border-radius: var(--radius-md);">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">📦</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No Orders Found</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">You haven't placed any orders yet. Explore our handcrafted jewellery collections.</p>
            <a href="#shop" class="btn btn-gold">Explore Collections</a>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            ${orders.map(order => `
              <div class="admin-card" style="border-color: var(--border-gold);">
                <!-- Order Top Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <div style="font-size: 0.8rem; color: var(--gold-dark); font-weight: 700;">ORDER REFERENCE</div>
                    <div style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: #fff;">${order.orderId}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Placed on ${formatDate(order.createdAt)}</div>
                  </div>

                  <div>
                    <span class="badge-tag" style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold-primary); color: var(--gold-bright); font-size: 0.82rem; padding: 0.35rem 0.85rem;">
                      ${order.status}
                    </span>
                  </div>
                </div>

                <!-- Live Tracking Pipeline Stepper -->
                <div style="margin-bottom: 2rem; background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--gold-bright); margin-bottom: 1rem;">
                    🛡️ ARMOURED TRANSIT STATUS • TRACKING ID: ${order.trackingNumber}
                  </div>
                  
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center; position: relative;">
                    <!-- Step 1 -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--gold-gradient); color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">✓</div>
                      <div style="font-size: 0.78rem; font-weight: 600; color: #fff;">Order Placed</div>
                    </div>

                    <!-- Step 2 -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${['Under Crafting & Hallmarking', 'Insured Transit', 'Delivered'].includes(order.status) ? 'var(--gold-gradient)' : 'var(--bg-surface-elevated)'}; color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">${['Under Crafting & Hallmarking', 'Insured Transit', 'Delivered'].includes(order.status) ? '✓' : '2'}</div>
                      <div style="font-size: 0.78rem; font-weight: 600; color: #fff;">BIS Hallmarking</div>
                    </div>

                    <!-- Step 3 -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${['Insured Transit', 'Delivered'].includes(order.status) ? 'var(--gold-gradient)' : 'var(--bg-surface-elevated)'}; color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">${['Insured Transit', 'Delivered'].includes(order.status) ? '✓' : '3'}</div>
                      <div style="font-size: 0.78rem; font-weight: 600; color: #fff;">Insured Transit</div>
                    </div>

                    <!-- Step 4 -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${order.status === 'Delivered' ? 'var(--gold-gradient)' : 'var(--bg-surface-elevated)'}; color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">${order.status === 'Delivered' ? '✓' : '4'}</div>
                      <div style="font-size: 0.78rem; font-weight: 600; color: #fff;">Handover & OTP</div>
                    </div>
                  </div>
                </div>

                <!-- Items list & details -->
                <div class="order-details-grid">
                  <div>
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Items in Shipment</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                      ${order.items.map(item => `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
                          <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;" />
                            <div>
                              <div style="font-weight: 600; font-size: 0.9rem; color: #fff;">${item.name}</div>
                              <div style="font-size: 0.75rem; color: var(--gold-dark);">${item.karat} • Size: ${item.selectedSize} × ${item.quantity}</div>
                            </div>
                          </div>
                          <div style="font-weight: 700; color: var(--gold-bright); font-size: 0.95rem;">
                            ${formatINR(item.price * item.quantity)}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Shipping & Billing snapshot -->
                  <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.82rem; display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="font-weight: 700; color: var(--gold-bright); margin-bottom: 0.25rem;">DESTINATION & INSURANCE</div>
                    <div><strong>Recipient:</strong> ${order.customerName} (${order.customerPhone})</div>
                    <div><strong>Address:</strong> ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</div>
                    <div><strong>Insurance Policy:</strong> ${order.insurancePolicyNumber}</div>
                    <div style="border-top: 1px solid var(--border-subtle); margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: 700; color: #fff; font-size: 0.95rem;">
                      <span>Total Paid:</span>
                      <span style="color: var(--gold-bright); font-family: var(--font-serif);">${formatINR(order.payment.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </section>
  `;
}
