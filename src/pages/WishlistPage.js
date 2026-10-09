/**
 * VAISHU JEWELLERY - Wishlist Page
 */

import { getWishlist, addToCart, toggleWishlist } from '../services/cartService';
import { formatINR } from '../utils/formatters';
import { showToast } from '../components/Toast';

export function renderWishlistPage(container) {
  const list = getWishlist();

  container.innerHTML = `
    <section style="padding: 3rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="margin-bottom: 2.5rem;">
          <h1 style="font-size: 2.2rem;" class="text-gold-gradient">My Royal Wishlist & Saved Pieces</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Curated ornaments reserved in your personal vault.</p>
        </div>

        ${list.length === 0 ? `
          <div style="text-align: center; padding: 5rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border-gold); border-radius: var(--radius-md);">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">💖</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Your Wishlist is Empty</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Save your favorite necklaces, rings, and gold coins here to review anytime.</p>
            <a href="#shop" class="btn btn-gold">Explore Collections</a>
          </div>
        ` : `
          <div class="product-grid">
            ${list.map(item => `
              <div class="product-card" data-id="${item.id}">
                <div class="product-img-wrapper">
                  <img src="${item.image}" alt="${item.name}" />
                  <div class="product-badges">
                    <span class="badge-tag badge-karat">${item.karat}</span>
                  </div>
                </div>
                <div class="product-card-body">
                  <h3 class="product-card-title">${item.name}</h3>
                  <div class="product-price-row">
                    <div class="product-price">${formatINR(item.price)}</div>
                  </div>
                  <div class="product-card-actions">
                    <button class="btn btn-gold btn-wish-to-cart" data-id="${item.id}">Move to Bag</button>
                    <button class="btn btn-ghost btn-remove-wish" data-id="${item.id}" title="Remove">✕</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </section>
  `;

  // Move to bag
  container.querySelectorAll('.btn-wish-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = list.find(i => i.id === id);
      if (item) {
        addToCart(item, 1);
        toggleWishlist(item);
        showToast(`Moved "${item.name}" to shopping bag!`, 'success');
        renderWishlistPage(container);
      }
    });
  });

  // Remove from wishlist
  container.querySelectorAll('.btn-remove-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = list.find(i => i.id === id);
      if (item) {
        toggleWishlist(item);
        showToast('Removed from wishlist.', 'info');
        renderWishlistPage(container);
      }
    });
  });
}
