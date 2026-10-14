/**
 * VAISHU JEWELLERY - Product Card Component
 */

import { formatINR } from '../utils/formatters';
import { isInWishlist, toggleWishlist, addToCart } from '../services/cartService';
import { showToast } from './Toast';
import { triggerAddToCartVisuals } from '../utils/cartAnimation';

export function renderProductCard(product) {
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-img-wrapper">
        <a href="#product/${product.id}" class="product-img-link" style="display: block; width: 100%; height: 100%;">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80'" />
        </a>
        
        <!-- Badges -->
        <div class="product-badges">
          ${product.karat ? `<span class="badge-tag badge-karat">${product.karat}</span>` : ''}
          ${product.isBestseller ? `<span class="badge-tag badge-bestseller">★ BESTSELLER</span>` : ''}
          ${discountPercent > 0 ? `<span class="badge-tag" style="background:#e11d48; color:#fff;">${discountPercent}% OFF</span>` : ''}
        </div>

        <!-- Wishlist Button -->
        <button class="wishlist-btn-corner ${isWishlisted ? 'active' : ''}" 
                data-wishlist-id="${product.id}" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#e11d48' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div class="product-card-body">
        <div class="product-card-category">${product.category}</div>
        <h3 class="product-card-title" title="${product.name}">
          <a href="#product/${product.id}" style="color: inherit; text-decoration: none;">${product.name}</a>
        </h3>

        <div class="product-card-meta">
          <span>⚖️ ${product.weightGrams ? product.weightGrams + 'g' : (product.diamondCarat || 'Pure')}</span>
          <span>•</span>
          <span style="color: #f59e0b;">★ ${product.rating || 5.0} (${product.reviewsCount || 12})</span>
        </div>

        <div class="product-price-row">
          <div class="product-price">${formatINR(product.price)}</div>
          ${product.originalPrice ? `<div class="product-original-price">${formatINR(product.originalPrice)}</div>` : ''}
        </div>

        <div class="product-card-actions">
          <button class="btn btn-gold btn-add-cart" data-add-id="${product.id}">
            <span>Add to Bag</span>
          </button>
          <button class="btn btn-ghost btn-quick-view" data-quick-id="${product.id}" title="Quick Spec View">
            <span>👁️</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function attachProductCardEvents(container, products, onOpenQuickView) {
  // Card click navigates to Product Details Page
  container.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Avoid intercepting clicks on buttons or links
      if (e.target.closest('button') || e.target.closest('a')) return;
      const id = card.getAttribute('data-product-id');
      if (id) {
        window.location.hash = `#product/${id}`;
      }
    });
  });

  // Add to Bag clicks
  container.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-add-id');
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart(product, 1);
        const card = btn.closest('.product-card');
        const img = card?.querySelector('.product-img-wrapper img');
        triggerAddToCartVisuals({
          button: btn,
          product: product,
          imageElement: img
        });
      }
    });
  });

  // Quick View clicks
  container.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-quick-id');
      const product = products.find(p => p.id === id);
      if (product && onOpenQuickView) {
        onOpenQuickView(product);
      }
    });
  });

  // Wishlist clicks
  container.querySelectorAll('.wishlist-btn-corner').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-wishlist-id');
      const product = products.find(p => p.id === id);
      if (product) {
        const { isAdded } = toggleWishlist(product);
        if (isAdded) {
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', '#e11d48');
          showToast(`Added to Wishlist!`, 'success');
        } else {
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
          showToast(`Removed from Wishlist`, 'info');
        }
        
        // Update wishlist badge in nav
        const badge = document.getElementById('wishlist-badge');
        if (badge) {
          const count = document.querySelectorAll('.wishlist-btn-corner.active').length;
          badge.textContent = count;
          badge.style.display = count > 0 ? 'flex' : 'none';
        }
      }
    });
  });
}
