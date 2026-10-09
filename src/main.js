/**
 * VAISHU JEWELLERY - Main Application Entry & Hash Router
 */

import './styles/index.css';
import { initTheme } from './utils/theme';
import { subscribeToAuth } from './services/authService';
import { renderNavbar, attachNavbarEvents } from './components/Navbar';
import { renderFooter } from './components/Footer';
import { renderCartDrawer } from './components/CartDrawer';
import { openQuickViewModal } from './components/QuickViewModal';
import { openAuthModal } from './components/AuthModal';
import { playRoyalIntro } from './components/RoyalIntro';

// Pages
import { renderHomePage } from './pages/HomePage';
import { renderCatalogPage } from './pages/CatalogPage';
import { renderBridalPage } from './pages/BridalPage';
import { renderCheckoutPage } from './pages/CheckoutPage';
import { renderOrdersPage } from './pages/OrdersPage';
import { renderWishlistPage } from './pages/WishlistPage';
import { renderAdminPage } from './pages/AdminPage';
import { renderAboutPage } from './pages/AboutPage';

let currentUser = null;
let cartDrawerController = null;

// Initialize app structure
function initApp() {
  initTheme();
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = `
    <header id="header-container"></header>
    <main id="main-content" style="min-height: 80vh;"></main>
    <div id="footer-container"></div>
    <div id="modal-root"></div>
    <div id="drawer-root"></div>
  `;

  // Mount Cart Drawer
  cartDrawerController = renderCartDrawer();

  // Listen to Firebase Auth state
  subscribeToAuth((user) => {
    currentUser = user;
    updateNavbar();
    handleRoute();
  });

  // Hash change routing
  window.addEventListener('hashchange', handleRoute);
  
  updateNavbar();
  renderFooterView();
  handleRoute();

  // Launch Royal Grand Welcome & Countdown Experience
  playRoyalIntro();
}

function updateNavbar() {
  const header = document.getElementById('header-container');
  if (!header) return;

  header.innerHTML = renderNavbar(
    currentUser,
    (tab) => openAuthModal(tab, (user) => { currentUser = user; updateNavbar(); handleRoute(); }),
    () => cartDrawerController?.open(),
    (route) => { window.location.hash = route; }
  );

  attachNavbarEvents(
    (tab) => openAuthModal(tab, (user) => { currentUser = user; updateNavbar(); handleRoute(); }),
    () => cartDrawerController?.open()
  );

  // Mark active nav link
  const currentHash = window.location.hash || '#';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentHash || (currentHash === '' && href === '#')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderFooterView() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }
}

async function handleRoute() {
  const hash = window.location.hash.toLowerCase() || '';
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');

  if (hash === '#admin' && currentUser?.role === 'admin') {
    if (headerContainer) headerContainer.style.display = 'none';
    if (footerContainer) footerContainer.style.display = 'none';
  } else {
    if (headerContainer) headerContainer.style.display = 'block';
    if (footerContainer) footerContainer.style.display = 'block';
  }

  if (hash === '' || hash === '#') {
    await renderHomePage(mainContent, openQuickViewModal);
  } else if (hash.startsWith('#shop')) {
    await renderCatalogPage(mainContent, openQuickViewModal, 'all');
  } else if (hash === '#bridal') {
    await renderBridalPage(mainContent, openQuickViewModal);
  } else if (hash === '#rates') {
    await renderHomePage(mainContent, openQuickViewModal);
    setTimeout(() => {
      document.getElementById('gold-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  } else if (hash === '#checkout') {
    renderCheckoutPage(mainContent, currentUser, () => {
      window.location.hash = '#orders';
    });
  } else if (hash === '#orders') {
    await renderOrdersPage(mainContent, currentUser, (tab) => openAuthModal(tab));
  } else if (hash === '#wishlist') {
    renderWishlistPage(mainContent);
  } else if (hash === '#admin') {
    await renderAdminPage(mainContent, currentUser, (tab) => openAuthModal(tab, (u) => { currentUser = u; handleRoute(); }));
  } else if (hash === '#about' || hash === '#hallmark' || hash === '#privacy' || hash === '#terms') {
    renderAboutPage(mainContent);
  } else {
    await renderHomePage(mainContent, openQuickViewModal);
  }
}

// Start application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
