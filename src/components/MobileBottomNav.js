/**
 * VAISHU JEWELLERY - Luxury Native Mobile Bottom Navigation Bar
 * App-style persistent navigation for mobile devices
 */

import { subscribeToCart } from '../services/cartService';

export function renderMobileBottomNav(onOpenCartDrawer) {
  let navContainer = document.getElementById('mobile-bottom-nav');
  if (!navContainer) {
    navContainer = document.createElement('nav');
    navContainer.id = 'mobile-bottom-nav';
    navContainer.className = 'mobile-bottom-nav';
    document.body.appendChild(navContainer);
  }

  const currentHash = window.location.hash.toLowerCase() || '#';

  navContainer.innerHTML = `
    <div class="mobile-bottom-nav-inner">
      <a href="#" class="bottom-nav-item ${currentHash === '' || currentHash === '#' ? 'active' : ''}" data-nav="home">
        <div class="bottom-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span class="bottom-nav-label">Home</span>
      </a>

      <a href="#shop" class="bottom-nav-item ${currentHash.startsWith('#shop') ? 'active' : ''}" data-nav="shop">
        <div class="bottom-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="6 2 18 2 22 8 12 22 2 8 6 2"></polygon>
            <line x1="2" y1="8" x2="22" y2="8"></line>
            <line x1="12" y1="22" x2="8" y2="8"></line>
            <line x1="12" y1="22" x2="16" y2="8"></line>
          </svg>
        </div>
        <span class="bottom-nav-label">Jewellery</span>
      </a>

      <a href="#bridal" class="bottom-nav-item ${currentHash === '#bridal' ? 'active' : ''}" data-nav="bridal">
        <div class="bottom-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 3h12l4 6-10 12L2 9z"/>
            <path d="M11 3 8 9l4 12 4-12-3-6"/>
            <path d="M2 9h20"/>
          </svg>
        </div>
        <span class="bottom-nav-label">Bridal</span>
      </a>

      <a href="#rates" class="bottom-nav-item ${currentHash === '#rates' ? 'active' : ''}" data-nav="rates">
        <div class="bottom-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="8" y1="10" x2="16" y2="10"></line>
            <line x1="8" y1="14" x2="12" y2="14"></line>
            <line x1="14" y1="14" x2="16" y2="14"></line>
            <line x1="8" y1="18" x2="16" y2="18"></line>
          </svg>
        </div>
        <span class="bottom-nav-label">Calc</span>
      </a>

      <button class="bottom-nav-item bottom-nav-cart" id="bottom-nav-cart-btn" aria-label="Cart">
        <div class="bottom-nav-icon" style="position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="bottom-nav-badge" id="bottom-cart-badge" style="display: none;">0</span>
        </div>
        <span class="bottom-nav-label">Bag</span>
      </button>
    </div>
  `;

  // Attach Cart Drawer click event
  const bottomCartBtn = document.getElementById('bottom-nav-cart-btn');
  if (bottomCartBtn && onOpenCartDrawer) {
    bottomCartBtn.onclick = (e) => {
      e.preventDefault();
      onOpenCartDrawer();
    };
  }

  // Subscribe to live cart count
  subscribeToCart((items) => {
    const badge = document.getElementById('bottom-cart-badge');
    if (badge) {
      const count = items.reduce((sum, i) => sum + i.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });

  // Handle route change active state
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.toLowerCase() || '';
    if (hash === '#admin') {
      navContainer.style.display = 'none';
    } else {
      navContainer.style.display = 'block';
    }

    document.querySelectorAll('.bottom-nav-item').forEach((item) => {
      const navTarget = item.getAttribute('data-nav');
      if (
        (navTarget === 'home' && (hash === '' || hash === '#')) ||
        (navTarget === 'shop' && hash.startsWith('#shop')) ||
        (navTarget === 'bridal' && hash === '#bridal') ||
        (navTarget === 'rates' && hash === '#rates')
      ) {
        item.classList.add('active');
      } else if (navTarget) {
        item.classList.remove('active');
      }
    });
  });

  if (currentHash === '#admin') {
    navContainer.style.display = 'none';
  } else {
    navContainer.style.display = 'block';
  }
}
