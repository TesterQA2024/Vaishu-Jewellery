/**
 * VAISHU JEWELLERY - Quick View & Spec Modal Component
 */

import { formatINR } from '../utils/formatters';
import { calculateItemBreakdown } from '../services/productService';
import { addToCart } from '../services/cartService';
import { showToast } from './Toast';

export function openQuickViewModal(product) {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  const breakdown = calculateItemBreakdown(
    product.weightGrams || 10,
    product.karat || '22K',
    product.makingChargePercent || 10
  );

  modalRoot.innerHTML = `
    <div class="modal-backdrop open" id="quick-view-backdrop">
      <div class="modal-dialog">
        <button class="modal-close-btn" id="modal-close-x">✕</button>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; padding: 2rem 1.5rem;">
          <!-- Product Image -->
          <div>
            <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-gold); background: #181820; aspect-ratio: 1;">
              <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center; font-size: 0.8rem; color: var(--gold-bright);">
              <span>🏅 ${product.purityCertificate || 'BIS 916 Hallmarked with HUID'}</span>
            </div>
          </div>

          <!-- Product Details & Transparency Breakdown -->
          <div style="display: flex; flex-direction: column;">
            <div style="color: var(--gold-dark); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">
              ${product.category} • ${product.karat}
            </div>
            <h2 style="font-size: 1.45rem; margin: 0.5rem 0 1rem; line-height: 1.3;">${product.name}</h2>
            
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
              ${product.description}
            </p>

            <!-- Price Breakdown Transparency Box -->
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.5rem; color: var(--text-muted);">
                <span>Net Gold (${product.weightGrams || 'N/A'}g @ ₹${breakdown.baseRatePerGram}/g):</span>
                <span style="color: #fff; font-weight: 600;">${formatINR(breakdown.rawMetalPrice)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.5rem; color: var(--text-muted);">
                <span>Artisan Making Charges (${product.makingChargePercent || 10}%):</span>
                <span style="color: #fff; font-weight: 600;">${formatINR(breakdown.makingCharges)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.75rem; color: var(--text-muted);">
                <span>Govt GST (3%):</span>
                <span style="color: #fff; font-weight: 600;">${formatINR(breakdown.gst)}</span>
              </div>
              <div style="border-top: 1px dashed var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-weight: 700; color: var(--gold-bright);">Calculated Pure Price:</span>
                <span style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 800; color: var(--gold-bright);">
                  ${formatINR(product.price)}
                </span>
              </div>
            </div>

            <!-- Size Selector if Applicable -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label">Select Size / Length</label>
              <select class="form-select" id="quick-view-size">
                <option value="Standard Size (Complimentary Alteration)">Standard Size (Complimentary Alteration)</option>
                <option value="Size 2.4 / Ring US 6">Size 2.4 / Ring US 6</option>
                <option value="Size 2.6 / Ring US 7">Size 2.6 / Ring US 7</option>
                <option value="Size 2.8 / Ring US 8">Size 2.8 / Ring US 8</option>
                <option value="Custom Size (Royal Vault Specialist will call)">Custom Size (Royal Vault Specialist will call)</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: auto;">
              <button class="btn btn-gold" id="quick-view-add-btn" style="flex: 1; padding: 0.85rem;">
                <span>✨ Add to Royal Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Close Events
  const backdrop = document.getElementById('quick-view-backdrop');
  const closeBtn = document.getElementById('modal-close-x');
  const close = () => {
    modalRoot.innerHTML = '';
  };

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Attach Add to Cart
  document.getElementById('quick-view-add-btn')?.addEventListener('click', () => {
    const size = document.getElementById('quick-view-size')?.value || 'Standard';
    addToCart(product, 1, size);
    showToast(`Added "${product.name}" (${size}) to your bag!`, 'success');
    close();
  });
}
