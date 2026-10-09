/**
 * VAISHU JEWELLERY - Navbar Component with Responsive Mobile Drawer
 */

import { getStoredLiveRates } from '../services/productService';
import { subscribeToCart } from '../services/cartService';
import { getWishlist } from '../services/cartService';
import { logoutUser } from '../services/authService';
import { toggleTheme, getStoredTheme } from '../utils/theme';
import { showToast } from './Toast';

export function renderNavbar(currentUser, onOpenAuthModal, onOpenCartDrawer, onNavigate) {
  const rates = getStoredLiveRates();
  const wishlistCount = getWishlist().length;
  const currentTheme = getStoredTheme();
  const isLight = currentTheme === 'light';

  const html = `
    <!-- Live Gold Rates Bullion Ticker -->
    <div class="ticker-bar">
      <div class="container ticker-content">
        <div class="ticker-items">
          <div class="ticker-item">
            <span class="ticker-badge">MCX LIVE</span>
            <span>24K Gold: <strong>₹${rates.gold24k}/g</strong></span>
          </div>
          <div class="ticker-item">
            <span>22K (916 BIS): <strong>₹${rates.gold22k}/g</strong></span>
          </div>
          <div class="ticker-item">
            <span>18K Diamond: <strong>₹${rates.gold18k}/g</strong></span>
          </div>
          <div class="ticker-item">
            <span>Silver 999: <strong>₹${rates.silver}/g</strong></span>
          </div>
        </div>
        <div class="ticker-extras">
          <span>🛡️ 100% BIS Hallmarked</span>
          <span class="ticker-divider">|</span>
          <a href="#admin" class="ticker-admin-link">👑 Admin Portal</a>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <nav class="navbar" id="main-navbar">
      <div class="container navbar-inner">
        <!-- Brand Logo -->
        <a href="#" class="brand-logo">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3h12l4 6-10 12L2 9z"/>
              <path d="M11 3 8 9l4 12 4-12-3-6"/>
              <path d="M2 9h20"/>
            </svg>
          </div>
          <div class="brand-text-block">
            <div class="brand-name">VAISHU</div>
            <div class="brand-tagline">ROYAL JEWELLERY</div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links">
          <li><a href="#" class="nav-link" data-route="home">Home</a></li>
          <li><a href="#shop" class="nav-link" data-route="shop">Collections</a></li>
          <li><a href="#bridal" class="nav-link" data-route="bridal">Bridal Lounge</a></li>
          <li><a href="#rates" class="nav-link" data-route="rates">Gold Calculator</a></li>
          <li><a href="#orders" class="nav-link" data-route="orders">Track Order</a></li>
          <li><a href="#about" class="nav-link" data-route="about">Heritage</a></li>
        </ul>

        <!-- Action Icons & Account -->
        <div class="nav-actions">
          <!-- Light / Dark Theme Switcher Button -->
          <button class="theme-toggle-btn" id="nav-theme-toggle-btn" title="${isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}" aria-label="Toggle Light Dark Theme">
            <span class="theme-icon">${isLight ? '🌙' : '☀️'}</span>
            <span class="theme-text">${isLight ? 'Dark' : 'Light'}</span>
          </button>

          <!-- Search trigger -->
          <a href="#shop" class="btn-icon" title="Search Collections" id="nav-search-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>

          <!-- Wishlist -->
          <a href="#wishlist" class="btn-icon" title="Wishlist" id="nav-wishlist-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span class="badge-count" id="wishlist-badge" style="${wishlistCount > 0 ? '' : 'display:none;'}">${wishlistCount}</span>
          </a>

          <!-- Cart Drawer Button -->
          <button class="btn-icon" title="Shopping Bag" id="nav-cart-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="badge-count" id="cart-badge">0</span>
          </button>

          <!-- User Account / Login Button -->
          ${currentUser ? `
            <div style="position: relative;" id="user-dropdown-container">
              <button class="btn btn-outline-gold user-pill-btn" id="user-menu-btn">
                <span>👑 ${currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Patron'}</span>
                <span style="font-size: 0.65rem;">▼</span>
              </button>
              <div id="user-dropdown-menu" class="user-dropdown-menu">
                <div style="padding: 0.6rem 1rem; border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                  Signed in as<br><strong style="color: var(--gold-bright); word-break: break-all;">${currentUser.email}</strong>
                  ${currentUser.role === 'admin' ? '<br><span class="badge-karat" style="font-size:0.65rem; padding:0.1rem 0.4rem; display:inline-block; margin-top:4px;">ADMIN</span>' : ''}
                </div>
                <a href="#orders" class="dropdown-item">📦 My Orders</a>
                <a href="#wishlist" class="dropdown-item">💖 My Wishlist</a>
                ${currentUser.role === 'admin' ? '<a href="#admin" class="dropdown-item" style="color: var(--gold-bright); font-weight:700;">⚙️ Admin Dashboard</a>' : ''}
                <button id="nav-logout-btn" class="dropdown-item" style="width: 100%; text-align: left; background: none; border: none; color: #ff6b6b; cursor: pointer; border-top: 1px solid var(--border-subtle);">🚪 Sign Out</button>
              </div>
            </div>
          ` : `
            <button class="btn btn-gold nav-signin-btn" id="nav-login-btn">
              <span>Sign In</span>
            </button>
          `}

          <!-- Mobile Hamburger Toggle Button -->
          <button class="btn-icon nav-hamburger-btn" id="mobile-nav-toggle" title="Menu" aria-label="Open Navigation Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Drawer -->
    <div class="mobile-nav-drawer-backdrop" id="mobile-nav-backdrop">
      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <div class="mobile-drawer-header">
          <div class="brand-logo" style="gap: 0.5rem;">
            <div class="brand-icon" style="width: 32px; height: 32px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 3h12l4 6-10 12L2 9z"/>
                <path d="M11 3 8 9l4 12 4-12-3-6"/>
                <path d="M2 9h20"/>
              </svg>
            </div>
            <div>
              <div class="brand-name" style="font-size: 1.15rem;">VAISHU</div>
              <div class="brand-tagline" style="font-size: 0.55rem;">ROYAL JEWELLERY</div>
            </div>
          </div>
          <button class="btn-action" id="mobile-nav-close" style="width: 34px; height: 34px;">✕</button>
        </div>

        <div class="mobile-drawer-body">
          <ul class="mobile-nav-list">
            <li><a href="#" class="mobile-nav-link" data-close>🏠 Home</a></li>
            <li><a href="#shop" class="mobile-nav-link" data-close>💎 Royal Collections</a></li>
            <li><a href="#bridal" class="mobile-nav-link" data-close>👑 Maharani Bridal Lounge</a></li>
            <li><a href="#rates" class="mobile-nav-link" data-close>📈 Live Gold Calculator</a></li>
            <li><a href="#orders" class="mobile-nav-link" data-close>📦 Track Vault Orders</a></li>
            <li><a href="#wishlist" class="mobile-nav-link" data-close>💖 Saved Wishlist</a></li>
            <li><a href="#about" class="mobile-nav-link" data-close>🏅 Heritage & BIS Hallmark</a></li>
            <li><a href="#admin" class="mobile-nav-link" style="color: var(--gold-bright); font-weight: 700;" data-close>⚙️ Admin Management Portal</a></li>
          </ul>

          <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
            ${currentUser ? `
              <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-gold); margin-bottom: 1rem;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Signed in as:</div>
                <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${currentUser.displayName || currentUser.email}</div>
                <button id="mobile-drawer-signout" class="btn btn-ghost" style="width: 100%; margin-top: 0.75rem; font-size: 0.8rem; color: #ff6b6b; padding: 0.4rem;">
                  🚪 Sign Out
                </button>
              </div>
            ` : `
              <button class="btn btn-gold" id="mobile-drawer-login" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem;">
                <span>✨ Sign In / Register</span>
              </button>
            `}

            <!-- Gold Rate Snapshot -->
            <div style="background: var(--bg-surface-elevated); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--gold-bright); text-align: center; border: 1px dashed var(--border-gold);">
              <span>MCX 22K Gold: <strong>₹${rates.gold22k}/g</strong> | 24K: <strong>₹${rates.gold24k}/g</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

export function attachNavbarEvents(onOpenAuthModal, onOpenCartDrawer) {
  // Theme toggle trigger
  const themeBtn = document.getElementById('nav-theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Cart button trigger
  const cartBtn = document.getElementById('nav-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', onOpenCartDrawer);
  }

  // Login button trigger
  const loginBtn = document.getElementById('nav-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', onOpenAuthModal);
  }

  // Mobile drawer open/close
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileLoginBtn = document.getElementById('mobile-drawer-login');
  const mobileSignoutBtn = document.getElementById('mobile-drawer-signout');

  const closeMobileNav = () => {
    mobileBackdrop?.classList.remove('open');
  };

  mobileToggle?.addEventListener('click', () => {
    mobileBackdrop?.classList.add('open');
  });

  mobileClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', (e) => {
    if (e.target === mobileBackdrop) closeMobileNav();
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  mobileLoginBtn?.addEventListener('click', () => {
    closeMobileNav();
    onOpenAuthModal();
  });

  mobileSignoutBtn?.addEventListener('click', async () => {
    await logoutUser();
    showToast('Signed out successfully.', 'info');
    window.location.reload();
  });

  // User Dropdown toggle
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (userMenuBtn && userDropdownMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = userDropdownMenu.style.display === 'block';
      userDropdownMenu.style.display = isOpen ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      userDropdownMenu.style.display = 'none';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logoutUser();
      showToast('You have been signed out successfully.', 'info');
      window.location.reload();
    });
  }

  // Update Cart Badge reactively
  subscribeToCart((items) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = items.reduce((sum, i) => sum + i.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}
