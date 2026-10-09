/**
 * VAISHU JEWELLERY - Luxury Admin Management Dashboard
 * Full-featured management suite with 12 modules:
 * 1. Dashboard  2. Products    3. Categories   4. Collections
 * 5. Inventory  6. Orders      7. Customers    8. Coupons
 * 9. Banners    10. Reviews    11. Reports     12. Settings
 */

import {
  getDashboardOverview,
  getProductsAdmin,
  addProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getCategoriesAdmin,
  addCategoryAdmin,
  deleteCategoryAdmin,
  getCollectionsAdmin,
  addCollectionAdmin,
  deleteCollectionAdmin,
  updateStockQuantity,
  getOrdersAdmin,
  updateOrderStatusAdmin,
  getCustomersAdmin,
  getCouponsAdmin,
  addCouponAdmin,
  deleteCouponAdmin,
  getBannersAdmin,
  addBannerAdmin,
  deleteBannerAdmin,
  getReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin,
  getSalesReportData,
  getStoreSettingsAdmin,
  updateStoreSettingsAdmin,
  getHomepageCMS,
  updateHomepageCMS,
  resetHomepageCMS,
  seedAllFirestoreCollections
} from '../services/adminService';
import { uploadImage } from '../services/storageService';
import { getStoredLiveRates, updateStoredLiveRates } from '../services/productService';
import { formatINR, formatDate } from '../utils/formatters';
import { toggleTheme, getStoredTheme } from '../utils/theme';
import { showToast } from '../components/Toast';

let activeModule = 'dashboard';
let isSidebarOpenMobile = false;

export async function renderAdminPage(container, currentUser, onOpenAuthModal) {
  // Authentication & Role Protection
  if (!currentUser || currentUser.role !== 'admin') {
    renderAdminLoginGateway(container, onOpenAuthModal);
    return;
  }

  // Render Full Admin Portal Layout
  container.innerHTML = `
    <div class="admin-layout" id="admin-root-layout">
      <!-- Sidebar Navigation -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <a href="#" class="brand-logo" style="gap: 0.5rem;">
            <div class="brand-icon" style="width: 34px; height: 34px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 3h12l4 6-10 12L2 9z"/>
                <path d="M11 3 8 9l4 12 4-12-3-6"/>
                <path d="M2 9h20"/>
              </svg>
            </div>
            <div>
              <div class="brand-name" style="font-size: 1.15rem;">VAISHU</div>
              <div class="brand-tagline" style="font-size: 0.55rem;">ADMIN CONSOLE</div>
            </div>
          </a>
          <button class="btn-action" id="sidebar-close-mobile" style="display: none;">✕</button>
        </div>

        <!-- 12 Navigation Modules -->
        <nav class="admin-nav">
          <button class="admin-nav-item ${activeModule === 'dashboard' ? 'active' : ''}" data-mod="dashboard">
            <span class="admin-nav-icon">📊</span>
            <span style="flex-grow: 1;">Dashboard</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'products' ? 'active' : ''}" data-mod="products">
            <span class="admin-nav-icon">💎</span>
            <span style="flex-grow: 1;">Products</span>
            <span class="admin-nav-badge" id="badge-products-count">...</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'categories' ? 'active' : ''}" data-mod="categories">
            <span class="admin-nav-icon">🏷️</span>
            <span style="flex-grow: 1;">Categories</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'collections' ? 'active' : ''}" data-mod="collections">
            <span class="admin-nav-icon">👑</span>
            <span style="flex-grow: 1;">Collections</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'inventory' ? 'active' : ''}" data-mod="inventory">
            <span class="admin-nav-icon">⚖️</span>
            <span style="flex-grow: 1;">Inventory</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'orders' ? 'active' : ''}" data-mod="orders">
            <span class="admin-nav-icon">📦</span>
            <span style="flex-grow: 1;">Orders</span>
            <span class="admin-nav-badge" id="badge-orders-count">...</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'customers' ? 'active' : ''}" data-mod="customers">
            <span class="admin-nav-icon">👥</span>
            <span style="flex-grow: 1;">Customers</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'coupons' ? 'active' : ''}" data-mod="coupons">
            <span class="admin-nav-icon">🎟️</span>
            <span style="flex-grow: 1;">Coupons</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'banners' ? 'active' : ''}" data-mod="banners">
            <span class="admin-nav-icon">🖼️</span>
            <span style="flex-grow: 1;">Banners</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'reviews' ? 'active' : ''}" data-mod="reviews">
            <span class="admin-nav-icon">⭐</span>
            <span style="flex-grow: 1;">Reviews</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'reports' ? 'active' : ''}" data-mod="reports">
            <span class="admin-nav-icon">📈</span>
            <span style="flex-grow: 1;">Reports</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'cms' ? 'active' : ''}" data-mod="cms">
            <span class="admin-nav-icon">🎨</span>
            <span style="flex-grow: 1;">Homepage CMS</span>
            <span class="admin-nav-badge" style="background: var(--gold-dark); color: #fff;">LIVE</span>
          </button>

          <button class="admin-nav-item ${activeModule === 'settings' ? 'active' : ''}" data-mod="settings">
            <span class="admin-nav-icon">⚙️</span>
            <span style="flex-grow: 1;">Settings</span>
          </button>
        </nav>

        <div class="admin-sidebar-footer">
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            Logged in as:<br><strong style="color: var(--gold-bright);">${currentUser.email}</strong>
          </div>
          <button id="admin-signout-btn" class="btn btn-ghost" style="width: 100%; padding: 0.4rem; font-size: 0.8rem; color: #ff6b6b;">
            Sign Out Admin
          </button>
        </div>
      </aside>

      <!-- Main Content Stage -->
      <div class="admin-main">
        <!-- Top Toolbar -->
        <header class="admin-topbar">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="btn-action" id="mobile-sidebar-toggle" style="display: none;">☰</button>
            <div style="font-weight: 700; font-size: 1.15rem; color: #fff;" id="admin-module-title">
              Dashboard Overview
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- Light / Dark Theme Switcher Button -->
            <button class="theme-toggle-btn" id="admin-theme-toggle-btn" title="${getStoredTheme() === 'light' ? 'Switch to Dark Mode (Obsidian)' : 'Switch to Light Mode (Royal Ivory)'}" aria-label="Toggle Light Dark Theme">
              <span class="theme-icon">${getStoredTheme() === 'light' ? '🌙' : '☀️'}</span>
              <span class="theme-text" style="font-size: 0.78rem;">${getStoredTheme() === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            <!-- Live Bullion Pill -->
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid var(--gold-primary); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.8rem; color: var(--gold-bright); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
              <span>22K Gold: ₹${getStoredLiveRates().gold22k}/g</span>
            </div>

            <!-- 1-Click Firestore Database Seeder -->
            <button class="btn btn-outline-gold" id="btn-top-seed" style="padding: 0.45rem 1rem; font-size: 0.82rem;" title="Populate all Firestore collections">
              <span>⚡ Seed Firestore</span>
            </button>

            <!-- Storefront Preview -->
            <a href="#" class="btn btn-ghost" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;">
              <span>Storefront ↗</span>
            </a>
          </div>
        </header>

        <!-- Dynamic Module Stage -->
        <div class="admin-view-container" id="admin-view-stage">
          <div style="text-align: center; padding: 4rem;">
            <div style="font-size: 2rem;">⏳</div>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">Loading data from Cloud Firestore...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Modal Root for Create / Edit Popups -->
    <div id="admin-modal-root"></div>
  `;

  attachLayoutEvents(container, currentUser, onOpenAuthModal);
  loadActiveModuleView();
}

// -------------------------------------------------------------
// Module 1: Dashboard Overview
// -------------------------------------------------------------
async function renderDashboardView(stage) {
  const stats = await getDashboardOverview();

  stage.innerHTML = `
    <!-- Top KPI Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <div class="admin-metric-card">
        <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Escrow Revenue</div>
        <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: var(--gold-bright); margin-top: 0.25rem;">
          ${formatINR(stats.totalRevenue)}
        </div>
        <div style="font-size: 0.75rem; color: #34d399; margin-top: 0.35rem;">
          ↑ Live from Cloud Firestore orders
        </div>
      </div>

      <div class="admin-metric-card">
        <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Customer Orders</div>
        <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">
          ${stats.totalOrdersCount}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
          Avg. Value: <strong style="color: var(--gold-bright);">${formatINR(stats.avgOrderValue)}</strong>
        </div>
      </div>

      <div class="admin-metric-card">
        <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Vault Gold In Stock</div>
        <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: var(--gold-bright); margin-top: 0.25rem;">
          ${stats.totalGoldGramsInVault}g
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
          Solitaires: <strong style="color: #60a5fa;">${stats.totalDiamondCarats} ct</strong>
        </div>
      </div>

      <div class="admin-metric-card">
        <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Active Patrons & VIPs</div>
        <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">
          ${stats.activeCustomersCount}
        </div>
        <div style="font-size: 0.75rem; color: ${stats.lowStockCount > 0 ? '#fbbf24' : '#34d399'}; margin-top: 0.35rem;">
          ${stats.lowStockCount > 0 ? `⚠️ ${stats.lowStockCount} items low in stock` : '✓ Healthy inventory'}
        </div>
      </div>
    </div>

    <!-- Quick Shortcuts & Recent Orders Grid -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      
      <!-- Recent Orders Table -->
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <div>
            <h3 style="font-size: 1.15rem; color: #fff; margin: 0;">Recent Vault Orders</h3>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Real-time orders pipeline</div>
          </div>
          <button class="btn btn-outline-gold" id="btn-jump-orders" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
            View All Orders (${stats.totalOrdersCount}) →
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Patron</th>
                <th>Amount</th>
                <th>Transit Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${stats.recentOrders.length === 0 ? `
                <tr><td colspan="5" style="text-align:center; padding: 2rem;">No orders found.</td></tr>
              ` : stats.recentOrders.map(o => `
                <tr>
                  <td>
                    <strong style="font-family: var(--font-serif); color: #fff;">${o.orderId}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(o.createdAt)}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${o.customerName}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${o.customerPhone || o.customerEmail}</div>
                  </td>
                  <td>
                    <strong style="font-family: var(--font-serif); color: var(--gold-bright);">${formatINR(o.payment?.grandTotal || 0)}</strong>
                  </td>
                  <td>
                    <span class="status-pill ${o.status === 'Delivered' ? 'success' : (o.status === 'Insured Transit' ? 'info' : 'warning')}">
                      ${o.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-quick-order" data-id="${o.orderId}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                      Manage
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Action Panel & Live Rates Widget -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="admin-card" style="border-color: var(--border-gold);">
          <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">⚡ Quick Operations</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-gold" id="btn-quick-add-prod" style="width: 100%; justify-content: flex-start; padding: 0.75rem 1rem;">
              <span>💎 Add New Jewellery Piece</span>
            </button>
            <button class="btn btn-outline-gold" id="btn-quick-new-coupon" style="width: 100%; justify-content: flex-start; padding: 0.75rem 1rem;">
              <span>🎟️ Create Discount Voucher</span>
            </button>
            <button class="btn btn-ghost" id="btn-quick-new-banner" style="width: 100%; justify-content: flex-start; padding: 0.75rem 1rem;">
              <span>🖼️ Upload Homepage Banner</span>
            </button>
          </div>
        </div>

        <div class="admin-card">
          <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem;">🛡️ Firebase Security Guard</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
            All Firestore writes and Storage uploads are protected via <code style="color: var(--gold-bright);">firestore.rules</code> with role verification.
          </p>
          <div style="font-size: 0.8rem; color: #34d399;">
            ✓ Rules Deployed & Enforced
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach Dashboard events
  document.getElementById('btn-jump-orders')?.addEventListener('click', () => switchModule('orders'));
  document.getElementById('btn-quick-add-prod')?.addEventListener('click', () => openAddProductModal());
  document.getElementById('btn-quick-new-coupon')?.addEventListener('click', () => openAddCouponModal());
  document.getElementById('btn-quick-new-banner')?.addEventListener('click', () => openAddBannerModal());
}

// -------------------------------------------------------------
// Module 2: Products Management
// -------------------------------------------------------------
async function renderProductsView(stage) {
  const products = await getProductsAdmin();

  stage.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Vault Jewellery Catalog (${products.length})</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Manage product purity, weight, pricing, and stock</div>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <input type="text" id="filter-prod-search" class="form-input" placeholder="Search title or SKU..." style="width: 220px; padding: 0.45rem 0.85rem; font-size: 0.85rem;" />
          <button class="btn btn-gold" id="btn-add-product-modal" style="padding: 0.5rem 1.15rem; font-size: 0.85rem;">
            <span>+ Add Jewellery</span>
          </button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Piece & Image</th>
              <th>SKU / Category</th>
              <th>Purity & Weight</th>
              <th>Price (INR)</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="products-table-body">
            ${products.map(p => `
              <tr data-product-id="${p.id}">
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${p.image}" alt="${p.name}" style="width: 46px; height: 46px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-gold);" />
                    <div>
                      <div style="font-weight: 600; color: #fff; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.name}">
                        ${p.name}
                      </div>
                      <div style="font-size: 0.75rem; color: var(--gold-dark);">${p.tags?.join(', ') || 'Fine Jewellery'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="font-family: monospace; font-size: 0.8rem; color: #9E9EA8;">${p.sku || p.id}</div>
                  <div style="font-size: 0.82rem; color: #fff;">${p.category}</div>
                </td>
                <td>
                  <div style="color: var(--gold-bright); font-weight: 600;">${p.karat}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${p.weightGrams ? p.weightGrams + 'g' : (p.diamondCarat || 'N/A')}</div>
                </td>
                <td>
                  <strong style="font-family: var(--font-serif); color: var(--gold-bright); font-size: 1rem;">${formatINR(p.price)}</strong>
                  ${p.originalPrice ? `<div style="font-size: 0.75rem; text-decoration: line-through; color: var(--text-muted);">${formatINR(p.originalPrice)}</div>` : ''}
                </td>
                <td>
                  <span class="status-pill ${(p.stockCount || 0) <= 2 ? 'danger' : 'success'}">
                    ${p.stockCount || 0} units
                  </span>
                </td>
                <td>
                  <span class="status-pill ${p.inStock ? 'success' : 'danger'}">
                    ${p.inStock ? 'In Vault' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn-action btn-edit-prod" data-id="${p.id}" title="Edit Specifications">✏️</button>
                    <button class="btn-action delete btn-del-prod" data-id="${p.id}" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Product events
  document.getElementById('btn-add-product-modal')?.addEventListener('click', () => openAddProductModal());

  stage.querySelectorAll('.btn-edit-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod) openEditProductModal(prod);
    });
  });

  stage.querySelectorAll('.btn-del-prod').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to permanently delete this jewellery piece?')) {
        await deleteProductAdmin(id);
        showToast('Piece deleted from catalog.', 'info');
        renderProductsView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 3: Categories Management
// -------------------------------------------------------------
async function renderCategoriesView(stage) {
  const categories = await getCategoriesAdmin();

  stage.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Store Categories (${categories.length})</h3>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Slug / Identifier</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(c => `
              <tr>
                <td>
                  <strong style="color: #fff; font-size: 0.95rem;">${c.name}</strong>
                </td>
                <td><code style="color: var(--gold-bright);">${c.slug || c.id}</code></td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${c.description || 'Fine Jewellery Category'}</td>
                <td><span class="status-pill success">Active</span></td>
                <td>
                  <button class="btn-action delete btn-del-cat" data-id="${c.id}" title="Delete Category">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Add Category Card -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">+ Add New Category</h3>
        <form id="form-add-category">
          <div class="form-group">
            <label class="form-label">Category Name *</label>
            <input type="text" id="new-cat-name" class="form-input" placeholder="e.g. Royal Pendants" required />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="new-cat-desc" class="form-textarea" rows="2" placeholder="Brief description of this category"></textarea>
          </div>
          <button type="submit" class="btn btn-gold" style="width: 100%;">Create Category</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-add-category')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new-cat-name').value.trim();
    const description = document.getElementById('new-cat-desc').value.trim();
    await addCategoryAdmin({ name, description, slug: name.toLowerCase().replace(/\s+/g, '-') });
    showToast(`Category "${name}" created in Firestore!`, 'success');
    renderCategoriesView(stage);
  });

  stage.querySelectorAll('.btn-del-cat').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this category?')) {
        await deleteCategoryAdmin(id);
        showToast('Category removed.', 'info');
        renderCategoriesView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 4: Collections Management
// -------------------------------------------------------------
async function renderCollectionsView(stage) {
  const collections = await getCollectionsAdmin();

  stage.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Curated Collections (${collections.length})</h3>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; padding: 1.5rem;">
          ${collections.map(col => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-gold); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column;">
              <div style="height: 120px; overflow: hidden; position: relative;">
                <img src="${col.banner || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}" alt="${col.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                <span class="status-pill gold" style="position: absolute; top: 8px; right: 8px;">Active</span>
              </div>
              <div style="padding: 1rem; display: flex; flex-direction: column; flex-grow: 1;">
                <h4 style="font-size: 1rem; color: #fff; margin-bottom: 0.35rem;">${col.name}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; flex-grow: 1;">${col.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
                  <span style="font-size: 0.75rem; color: var(--gold-bright);">${col.itemCount || 0} Pieces</span>
                  <button class="btn-action delete btn-del-col" data-id="${col.id}" title="Delete Collection">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Add Collection Card -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">+ Add New Collection</h3>
        <form id="form-add-collection">
          <div class="form-group">
            <label class="form-label">Collection Title *</label>
            <input type="text" id="new-col-name" class="form-input" placeholder="e.g. Navratna Festive 2026" required />
          </div>
          <div class="form-group">
            <label class="form-label">Hero Banner Image URL</label>
            <input type="url" id="new-col-banner" class="form-input" placeholder="https://images.unsplash.com/..." />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="new-col-desc" class="form-textarea" rows="2" placeholder="Theme and background of this collection"></textarea>
          </div>
          <button type="submit" class="btn btn-gold" style="width: 100%;">Publish Collection</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-add-collection')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new-col-name').value.trim();
    const banner = document.getElementById('new-col-banner').value.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
    const description = document.getElementById('new-col-desc').value.trim();
    await addCollectionAdmin({ name, banner, description });
    showToast(`Collection "${name}" created!`, 'success');
    renderCollectionsView(stage);
  });

  stage.querySelectorAll('.btn-del-col').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this collection?')) {
        await deleteCollectionAdmin(id);
        showToast('Collection deleted.', 'info');
        renderCollectionsView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 5: Inventory & Vault Stock
// -------------------------------------------------------------
async function renderInventoryView(stage) {
  const products = await getProductsAdmin();

  stage.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Vault Inventory & Stock Tracker</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Adjust stock units and monitor precious metal allocation</div>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Jewellery Piece</th>
              <th>SKU / Karat</th>
              <th>Metal Weight</th>
              <th>Current Stock</th>
              <th>Stock Status</th>
              <th>Adjust Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;" />
                    <strong style="color: #fff; font-size: 0.9rem;">${p.name}</strong>
                  </div>
                </td>
                <td>
                  <div style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${p.sku || p.id}</div>
                  <div style="font-size: 0.8rem; color: var(--gold-bright);">${p.karat}</div>
                </td>
                <td>
                  <span>${p.weightGrams ? p.weightGrams + 'g' : (p.diamondCarat || 'N/A')}</span>
                </td>
                <td>
                  <strong style="font-size: 1.1rem; color: #fff;" id="stock-val-${p.id}">${p.stockCount || 0}</strong>
                </td>
                <td>
                  <span class="status-pill ${(p.stockCount || 0) <= 2 ? 'danger' : 'success'}">
                    ${(p.stockCount || 0) <= 2 ? '⚠️ Low Stock' : '✓ In Vault'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <button class="btn btn-ghost btn-stock-dec" data-id="${p.id}" data-current="${p.stockCount || 0}" style="padding: 0.2rem 0.6rem;">-1</button>
                    <button class="btn btn-gold btn-stock-inc" data-id="${p.id}" data-current="${p.stockCount || 0}" style="padding: 0.2rem 0.6rem;">+1</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  stage.querySelectorAll('.btn-stock-inc').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const current = parseInt(btn.getAttribute('data-current')) || 0;
      await updateStockQuantity(id, current + 1);
      showToast('Stock quantity updated.', 'success');
      renderInventoryView(stage);
    });
  });

  stage.querySelectorAll('.btn-stock-dec').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const current = parseInt(btn.getAttribute('data-current')) || 0;
      if (current > 0) {
        await updateStockQuantity(id, current - 1);
        showToast('Stock quantity updated.', 'info');
        renderInventoryView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 6: Orders Management
// -------------------------------------------------------------
async function renderOrdersView(stage) {
  const orders = await getOrdersAdmin();

  stage.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Escrow Orders Pipeline (${orders.length})</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Real-time dispatch, transit insurance, and hallmark tracking</div>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID / Date</th>
              <th>Customer Details</th>
              <th>Pieces</th>
              <th>Total (Escrow)</th>
              <th>Transit Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>
                  <strong style="font-family: var(--font-serif); color: #fff;">${o.orderId}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(o.createdAt)}</div>
                </td>
                <td>
                  <div style="font-weight: 600; color: #fff;">${o.customerName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${o.customerPhone || o.customerEmail}</div>
                </td>
                <td>
                  <span style="font-size: 0.85rem;">${o.items?.length || 1} items</span>
                </td>
                <td>
                  <strong style="font-family: var(--font-serif); color: var(--gold-bright); font-size: 1rem;">
                    ${formatINR(o.payment?.grandTotal || 0)}
                  </strong>
                </td>
                <td>
                  <select class="form-select order-status-updater" data-id="${o.orderId}" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: auto;">
                    <option value="Order Placed" ${o.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
                    <option value="Under Crafting & Hallmarking" ${o.status === 'Under Crafting & Hallmarking' ? 'selected' : ''}>Under Crafting & Hallmarking</option>
                    <option value="Insured Transit" ${o.status === 'Insured Transit' ? 'selected' : ''}>Insured Armoured Transit</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered to Patron</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-outline-gold btn-view-invoice" data-id="${o.orderId}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                    View Invoice
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  stage.querySelectorAll('.order-status-updater').forEach(sel => {
    sel.addEventListener('change', async () => {
      const orderId = sel.getAttribute('data-id');
      const newStatus = sel.value;
      await updateOrderStatusAdmin(orderId, newStatus);
      showToast(`Order #${orderId} status changed to "${newStatus}"!`, 'success');
    });
  });

  stage.querySelectorAll('.btn-view-invoice').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      const order = orders.find(o => o.orderId === orderId || o.id === orderId);
      if (order) openInvoiceModal(order);
    });
  });
}

// -------------------------------------------------------------
// Module 7: Customers & Patrons
// -------------------------------------------------------------
async function renderCustomersView(stage) {
  const customers = await getCustomersAdmin();

  stage.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Royal Patrons & VIP Directory (${customers.length})</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Customer loyalty tiers and lifetime purchases</div>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Patron Name</th>
              <th>Email & Contact</th>
              <th>City / State</th>
              <th>Loyalty Tier</th>
              <th>Total Orders</th>
              <th>Lifetime Spend</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td>
                  <strong style="color: #fff; font-size: 0.95rem;">👑 ${c.displayName || 'Patron'}</strong>
                </td>
                <td>
                  <div style="color: var(--text-main); font-size: 0.85rem;">${c.email}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.phone || '+91 98765 43210'}</div>
                </td>
                <td>
                  <span>${c.city || 'Mumbai'}, ${c.state || 'India'}</span>
                </td>
                <td>
                  <span class="status-pill gold">${c.tier || 'Royal Patron'}</span>
                </td>
                <td>
                  <strong style="color: #fff;">${c.totalOrders || 1}</strong>
                </td>
                <td>
                  <strong style="font-family: var(--font-serif); color: var(--gold-bright);">${formatINR(c.totalSpend || 250000)}</strong>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Module 8: Coupons & Vouchers
// -------------------------------------------------------------
async function renderCouponsView(stage) {
  const coupons = await getCouponsAdmin();

  stage.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Discount Vouchers (${coupons.length})</h3>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Voucher Code</th>
              <th>Discount Value</th>
              <th>Min Order</th>
              <th>Usages</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${coupons.map(c => `
              <tr>
                <td>
                  <span style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--gold-bright); background: rgba(212, 175, 55, 0.1); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: 1px dashed var(--gold-primary);">
                    ${c.code}
                  </span>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${c.description}</div>
                </td>
                <td>
                  <strong>${c.discountPercent ? `${c.discountPercent}% OFF` : formatINR(c.flatDiscount)}</strong>
                </td>
                <td>${formatINR(c.minOrderValue || 0)}</td>
                <td>${c.usageCount || 0} / ${c.usageLimit || '∞'}</td>
                <td>
                  <button class="btn-action delete btn-del-cpn" data-id="${c.id}" title="Delete Coupon">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Add Coupon Form -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">+ Create New Voucher</h3>
        <form id="form-add-coupon">
          <div class="form-group">
            <label class="form-label">Voucher Code *</label>
            <input type="text" id="new-cpn-code" class="form-input" placeholder="e.g. DIWALI15" style="text-transform: uppercase;" required />
          </div>
          <div class="form-group">
            <label class="form-label">Discount Type *</label>
            <select class="form-select" id="new-cpn-type">
              <option value="percentage">Percentage Discount (%)</option>
              <option value="flat">Flat Cash Discount (INR)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Discount Value *</label>
            <input type="number" id="new-cpn-value" class="form-input" placeholder="10 or 5000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Min. Order Value (INR)</label>
            <input type="number" id="new-cpn-min" class="form-input" value="50000" />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" id="new-cpn-desc" class="form-input" placeholder="e.g. 10% Festive Discount" />
          </div>
          <button type="submit" class="btn btn-gold" style="width: 100%;">Create Voucher</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-add-coupon')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('new-cpn-code').value.trim().toUpperCase();
    const type = document.getElementById('new-cpn-type').value;
    const val = parseFloat(document.getElementById('new-cpn-value').value) || 10;
    const minOrder = parseFloat(document.getElementById('new-cpn-min').value) || 0;
    const desc = document.getElementById('new-cpn-desc').value.trim();

    await addCouponAdmin({
      code,
      type,
      discountPercent: type === 'percentage' ? val : null,
      flatDiscount: type === 'flat' ? val : null,
      minOrderValue: minOrder,
      description: desc || `${val} Discount`
    });

    showToast(`Voucher "${code}" added to Firestore!`, 'success');
    renderCouponsView(stage);
  });

  stage.querySelectorAll('.btn-del-cpn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this voucher?')) {
        await deleteCouponAdmin(id);
        showToast('Voucher removed.', 'info');
        renderCouponsView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 9: Banners & Promotions
// -------------------------------------------------------------
async function renderBannersView(stage) {
  const banners = await getBannersAdmin();

  stage.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Store Banners (${banners.length})</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem;">
          ${banners.map(b => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; display: flex; gap: 1rem; align-items: center; padding: 1rem;">
              <img src="${b.image}" alt="${b.title}" style="width: 140px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-gold);" />
              <div style="flex-grow: 1;">
                <h4 style="font-size: 1rem; color: #fff; margin-bottom: 0.25rem;">${b.title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">${b.subtitle || ''}</p>
                <span class="status-pill gold">${b.position}</span>
              </div>
              <button class="btn-action delete btn-del-ban" data-id="${b.id}" title="Delete Banner">🗑️</button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Add Banner Form -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">+ Upload New Banner</h3>
        <form id="form-add-banner">
          <div class="form-group">
            <label class="form-label">Banner Title *</label>
            <input type="text" id="new-ban-title" class="form-input" placeholder="e.g. Royal Wedding Collection 2026" required />
          </div>
          <div class="form-group">
            <label class="form-label">Subtitle</label>
            <input type="text" id="new-ban-sub" class="form-input" placeholder="e.g. BIS 916 Hallmark Assurance" />
          </div>
          <div class="form-group">
            <label class="form-label">Image File (Firebase Storage)</label>
            <input type="file" id="new-ban-file" accept="image/*" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">OR Image URL</label>
            <input type="url" id="new-ban-url" class="form-input" placeholder="https://images.unsplash.com/..." />
          </div>
          <button type="submit" class="btn btn-gold" id="btn-submit-banner" style="width: 100%;">Publish Banner</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-add-banner')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-banner');
    const title = document.getElementById('new-ban-title').value.trim();
    const subtitle = document.getElementById('new-ban-sub').value.trim();
    const fileInput = document.getElementById('new-ban-file');
    const urlInput = document.getElementById('new-ban-url');

    let imageUrl = urlInput.value.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80';

    if (fileInput.files && fileInput.files[0]) {
      btn.innerHTML = '<span>Uploading to Firebase Storage...</span>';
      btn.disabled = true;
      try {
        imageUrl = await uploadImage(fileInput.files[0], 'banners');
      } catch (err) {
        showToast('Storage note: ' + err.message, 'warning');
      }
    }

    await addBannerAdmin({ title, subtitle, image: imageUrl, position: 'hero' });
    showToast('Banner uploaded and saved in Firestore!', 'success');
    renderBannersView(stage);
  });

  stage.querySelectorAll('.btn-del-ban').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this banner?')) {
        await deleteBannerAdmin(id);
        showToast('Banner removed.', 'info');
        renderBannersView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 10: Reviews & Testimonials
// -------------------------------------------------------------
async function renderReviewsView(stage) {
  const reviews = await getReviewsAdmin();

  stage.innerHTML = `
    <div class="admin-table-container">
      <div class="admin-table-toolbar">
        <div>
          <h3 style="font-size: 1.25rem; color: #fff; margin: 0;">Customer Reviews & Testimonials (${reviews.length})</h3>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Moderate customer feedback and featured reviews</div>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Patron & Rating</th>
              <th>Jewellery Piece</th>
              <th>Review Title & Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${reviews.map(r => `
              <tr>
                <td>
                  <strong style="color: #fff;">${r.userName}</strong>
                  <div style="color: #f59e0b; font-size: 0.9rem;">${'★'.repeat(r.rating || 5)}</div>
                </td>
                <td>
                  <span style="color: var(--gold-bright); font-size: 0.85rem;">${r.productName || r.productId}</span>
                </td>
                <td style="max-width: 320px;">
                  <div style="font-weight: 600; color: #fff; font-size: 0.85rem;">"${r.title}"</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${r.comment}</div>
                </td>
                <td>
                  <span class="status-pill ${r.status === 'approved' ? 'success' : 'warning'}">
                    ${r.status || 'approved'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn-action btn-toggle-review" data-id="${r.id}" data-status="${r.status === 'approved' ? 'pending' : 'approved'}" title="Toggle Approval">
                      ${r.status === 'approved' ? '⏸️' : '✓'}
                    </button>
                    <button class="btn-action delete btn-del-rev" data-id="${r.id}" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  stage.querySelectorAll('.btn-toggle-review').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const nextStatus = btn.getAttribute('data-status');
      await updateReviewStatusAdmin(id, nextStatus);
      showToast(`Review marked as ${nextStatus}.`, 'info');
      renderReviewsView(stage);
    });
  });

  stage.querySelectorAll('.btn-del-rev').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete review?')) {
        await deleteReviewAdmin(id);
        showToast('Review removed.', 'info');
        renderReviewsView(stage);
      }
    });
  });
}

// -------------------------------------------------------------
// Module 11: Reports & Analytics
// -------------------------------------------------------------
async function renderReportsView(stage) {
  const report = await getSalesReportData();

  stage.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <!-- Key Figures -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
        <div class="admin-metric-card">
          <div style="font-size: 0.8rem; color: var(--text-muted);">TOTAL REVENUE REALIZED</div>
          <div style="font-family: var(--font-serif); font-size: 2rem; font-weight: 800; color: var(--gold-bright); margin-top: 0.25rem;">
            ${formatINR(report.totalSales)}
          </div>
        </div>

        <div class="admin-metric-card">
          <div style="font-size: 0.8rem; color: var(--text-muted);">PROJECTED MONTHLY REVENUE</div>
          <div style="font-family: var(--font-serif); font-size: 2rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">
            ${formatINR(report.projectedMonthlyRevenue)}
          </div>
        </div>

        <div class="admin-metric-card">
          <div style="font-size: 0.8rem; color: var(--text-muted);">VAULT INVENTORY TURNOVER</div>
          <div style="font-family: var(--font-serif); font-size: 2rem; font-weight: 800; color: #34d399; margin-top: 0.25rem;">
            ${report.inventoryTurnoverRate}
          </div>
        </div>
      </div>

      <!-- Metal Purity Sales Distribution Card -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Revenue Breakdown by Precious Metal Class</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-gold);">
            <div style="font-size: 0.8rem; color: var(--gold-dark); font-weight: 700;">22K BIS 916 GOLD</div>
            <div style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--gold-bright); margin: 0.35rem 0;">
              ${formatINR(report.metalBreakdown.Gold22K)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Chokers, Bridal Sets, Kadas</div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: #60a5fa; font-weight: 700;">18K SOLITAIRE DIAMONDS</div>
            <div style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff; margin: 0.35rem 0;">
              ${formatINR(report.metalBreakdown.Diamond18K)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Rings, Mangalsutra, Bands</div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: #fbbf24; font-weight: 700;">24K PURE GOLD BULLION</div>
            <div style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff; margin: 0.35rem 0;">
              ${formatINR(report.metalBreakdown.Bullion24K)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Minted Coins & Bars</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Module 12: Settings & Bullion Rates
// -------------------------------------------------------------
async function renderSettingsView(stage) {
  const settings = await getStoreSettingsAdmin();
  const rates = getStoredLiveRates();

  stage.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
      <!-- Store Settings -->
      <div class="admin-card" style="border-color: var(--border-gold);">
        <h3 style="font-size: 1.25rem; margin-bottom: 1.5rem;">👑 Store Configuration</h3>
        <form id="form-settings-store">
          <div class="form-group">
            <label class="form-label">Store Legal Name</label>
            <input type="text" id="set-store-name" class="form-input" value="${settings.storeName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Support VIP Helpline</label>
            <input type="text" id="set-store-phone" class="form-input" value="${settings.supportPhone}" required />
          </div>
          <div class="form-group">
            <label class="form-label">BIS Hallmark License #</label>
            <input type="text" id="set-bis-no" class="form-input" value="${settings.bisLicenseNumber}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Armoured Transit Carrier</label>
            <input type="text" id="set-carrier" class="form-input" value="${settings.transitCarrier}" required />
          </div>
          <button type="submit" class="btn btn-gold">Save Store Settings</button>
        </form>
      </div>

      <!-- Live Bullion Rates Manager -->
      <div class="admin-card">
        <h3 style="font-size: 1.25rem; margin-bottom: 1.5rem;">📈 MCX Bullion Live Rates (INR / gram)</h3>
        <form id="form-settings-rates">
          <div class="form-group">
            <label class="form-label">24K Pure Gold (₹/g)</label>
            <input type="number" id="set-rate-24" class="form-input" value="${rates.gold24k}" required />
          </div>
          <div class="form-group">
            <label class="form-label">22K Hallmark 916 (₹/g)</label>
            <input type="number" id="set-rate-22" class="form-input" value="${rates.gold22k}" required />
          </div>
          <div class="form-group">
            <label class="form-label">18K Gold (₹/g)</label>
            <input type="number" id="set-rate-18" class="form-input" value="${rates.gold18k}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Silver 999 (₹/g)</label>
            <input type="number" id="set-rate-sil" class="form-input" value="${rates.silver}" step="0.5" required />
          </div>
          <button type="submit" class="btn btn-gold">Update Live Rates</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-settings-store')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      storeName: document.getElementById('set-store-name').value.trim(),
      supportPhone: document.getElementById('set-store-phone').value.trim(),
      bisLicenseNumber: document.getElementById('set-bis-no').value.trim(),
      transitCarrier: document.getElementById('set-carrier').value.trim()
    };
    await updateStoreSettingsAdmin(updated);
    showToast('Store settings saved in Cloud Firestore!', 'success');
  });

  document.getElementById('form-settings-rates')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRates = {
      ...rates,
      gold24k: parseFloat(document.getElementById('set-rate-24').value) || 7850,
      gold22k: parseFloat(document.getElementById('set-rate-22').value) || 7200,
      gold18k: parseFloat(document.getElementById('set-rate-18').value) || 5890,
      silver: parseFloat(document.getElementById('set-rate-sil').value) || 94.5
    };
    updateStoredLiveRates(newRates);
    showToast('Bullion rates updated across storefront!', 'success');
  });
}

// -------------------------------------------------------------
// Switcher for All 12 Modules
// -------------------------------------------------------------
function switchModule(modName) {
  activeModule = modName;
  
  // Update sidebar active classes
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    if (btn.getAttribute('data-mod') === modName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update topbar title
  const titleMap = {
    dashboard: 'Dashboard Overview',
    products: 'Products & Masterpieces Catalog',
    categories: 'Categories & Departments',
    collections: 'Curated Royal Collections',
    inventory: 'Vault Inventory & Stock Tracking',
    orders: 'Customer Orders & Escrow Dispatch',
    customers: 'Patrons & VIP Client Directory',
    coupons: 'Promotional Vouchers & Rebates',
    banners: 'Homepage Banners & Hero Showcase',
    reviews: 'Patron Reviews & Testimonials',
    reports: 'Sales Reports & Financial Analytics',
    cms: '🎨 Dynamic Homepage CMS & Section Customizer',
    settings: 'Bullion Rates & Store Configuration'
  };

  const titleEl = document.getElementById('admin-module-title');
  if (titleEl) titleEl.textContent = titleMap[modName] || 'Admin Portal';

  loadActiveModuleView();
}

async function loadActiveModuleView() {
  const stage = document.getElementById('admin-view-stage');
  if (!stage) return;

  switch (activeModule) {
    case 'dashboard': await renderDashboardView(stage); break;
    case 'products': await renderProductsView(stage); break;
    case 'categories': await renderCategoriesView(stage); break;
    case 'collections': await renderCollectionsView(stage); break;
    case 'inventory': await renderInventoryView(stage); break;
    case 'orders': await renderOrdersView(stage); break;
    case 'customers': await renderCustomersView(stage); break;
    case 'coupons': await renderCouponsView(stage); break;
    case 'banners': await renderBannersView(stage); break;
    case 'reviews': await renderReviewsView(stage); break;
    case 'reports': await renderReportsView(stage); break;
    case 'cms': await renderCMSView(stage); break;
    case 'settings': await renderSettingsView(stage); break;
    default: await renderDashboardView(stage);
  }
}

// -------------------------------------------------------------
// Module 13: Dynamic Homepage CMS & Section Customizer
// -------------------------------------------------------------
async function renderCMSView(stage) {
  stage.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div style="font-size: 2rem;">⏳</div>
      <p style="color: var(--text-muted); margin-top: 0.5rem;">Loading Homepage CMS from Cloud Firestore...</p>
    </div>
  `;

  const [cms, allProducts, allCategories] = await Promise.all([
    getHomepageCMS(),
    getProductsAdmin(),
    getCategoriesAdmin()
  ]);

  const hero = cms.hero || {};
  const trust = cms.trustPillars || {};
  const catsSec = cms.categoriesSection || {};
  const bestSec = cms.bestsellersSection || {};
  const calcSec = cms.goldCalculatorSection || {};
  const bridalSec = cms.bridalSpotlightSection || {};

  stage.innerHTML = `
    <div style="max-width: 1100px; margin: 0 auto;">
      <!-- CMS Header Action Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; background: var(--bg-surface); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-gold);">
        <div>
          <h2 style="font-size: 1.4rem; margin: 0 0 0.25rem 0;" class="text-gold-gradient">Dynamic Homepage Content Management</h2>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
            Customize hero banners, typography, CTAs, reorder sections (1-6), and publish or hide sections in real-time via Cloud Firestore & Firebase Storage.
          </p>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button type="button" class="btn btn-ghost" id="btn-cms-reset" style="font-size: 0.85rem; padding: 0.6rem 1rem;">
            🔄 Reset Defaults
          </button>
          <button type="button" class="btn btn-gold" id="btn-cms-save-top" style="font-size: 0.9rem; padding: 0.65rem 1.4rem;">
            💾 Save & Publish Homepage
          </button>
        </div>
      </div>

      <form id="form-homepage-cms">
        <!-- 1. HERO SHOWCASE SECTION -->
        <div class="admin-card" style="margin-bottom: 2rem; border-color: var(--border-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">👑</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">1. Hero Showcase & Masterpiece Banner</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Main header showcase, typography, primary and secondary CTAs</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-hero-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${hero.order ?? 1}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-hero-enabled" ${hero.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <!-- Desktop Banner Upload -->
            <div>
              <label class="form-label">🖥️ Desktop Hero Banner Image</label>
              <div style="margin-bottom: 0.75rem; position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); height: 160px; background: #000;">
                <img id="preview-hero-desktop" src="${hero.desktopImage || ''}" alt="Desktop Banner Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80'" />
              </div>
              <input type="file" id="cms-hero-desktop-file" accept="image/*" class="form-input" style="padding: 0.4rem; font-size: 0.8rem; margin-bottom: 0.5rem;" />
              <input type="url" id="cms-hero-desktop-url" class="form-input" placeholder="Or paste Desktop Banner Image URL" value="${hero.desktopImage || ''}" />
              <div id="prog-hero-desktop" style="font-size: 0.75rem; color: var(--gold-bright); margin-top: 0.25rem; display: none;">Uploading...</div>
            </div>

            <!-- Mobile Banner Upload -->
            <div>
              <label class="form-label">📱 Mobile Hero Banner Image</label>
              <div style="margin-bottom: 0.75rem; position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); height: 160px; background: #000;">
                <img id="preview-hero-mobile" src="${hero.mobileImage || ''}" alt="Mobile Banner Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'" />
              </div>
              <input type="file" id="cms-hero-mobile-file" accept="image/*" class="form-input" style="padding: 0.4rem; font-size: 0.8rem; margin-bottom: 0.5rem;" />
              <input type="url" id="cms-hero-mobile-url" class="form-input" placeholder="Or paste Mobile Banner Image URL" value="${hero.mobileImage || ''}" />
              <div id="prog-hero-mobile" style="font-size: 0.75rem; color: var(--gold-bright); margin-top: 0.25rem; display: none;">Uploading...</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Hero Badge Tagline</label>
              <input type="text" id="cms-hero-badge" class="form-input" value="${hero.badgeText || ''}" placeholder="e.g. The Royal Heirloom Collection 2026" />
            </div>
            <div class="form-group">
              <label class="form-label">Hero Main Headline</label>
              <input type="text" id="cms-hero-heading" class="form-input" value="${hero.heading || ''}" placeholder="e.g. Crafted in Pure 22K Gold & Solitaire Radiance" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Hero Subheading / Descriptive Narrative</label>
            <textarea id="cms-hero-subheading" class="form-textarea" rows="2" placeholder="Experience the pinnacle of royal heritage craftsmanship...">${hero.subheading || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Primary CTA Text</label>
              <input type="text" id="cms-hero-cta1-text" class="form-input" value="${hero.cta1Text || 'Explore Grand Vault'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Primary CTA Link</label>
              <input type="text" id="cms-hero-cta1-link" class="form-input" value="${hero.cta1Link || '#shop'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Secondary CTA Text</label>
              <input type="text" id="cms-hero-cta2-text" class="form-input" value="${hero.cta2Text || 'Bridal Lounge'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Secondary CTA Link</label>
              <input type="text" id="cms-hero-cta2-link" class="form-input" value="${hero.cta2Link || '#bridal'}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Floating Card Title</label>
              <input type="text" id="cms-hero-float-title" class="form-input" value="${hero.floatingCardTitle || 'Imperial Mayur Collection'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Floating Card Subtitle</label>
              <input type="text" id="cms-hero-float-sub" class="form-input" value="${hero.floatingCardSubtitle || 'Handcrafted in 22K Solid Gold'}" />
            </div>
          </div>
        </div>

        <!-- 2. TRUST & PURITY PILLARS SECTION -->
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🏅</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">2. Purity & Trust Assurance Pillars</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Four assurance pillars: BIS Hallmark, Certified Diamonds, Armoured Transit, Lifetime Buyback</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-trust-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${trust.order ?? 2}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-trust-enabled" ${trust.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label class="form-label">Pillar 1 Title (BIS Hallmark)</label>
                <input type="text" id="cms-pillar1-title" class="form-input" value="${trust.pillar1Title || ''}" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Pillar 1 Description</label>
                <textarea id="cms-pillar1-desc" class="form-textarea" rows="2">${trust.pillar1Desc || ''}</textarea>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label class="form-label">Pillar 2 Title (IGI Diamonds)</label>
                <input type="text" id="cms-pillar2-title" class="form-input" value="${trust.pillar2Title || ''}" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Pillar 2 Description</label>
                <textarea id="cms-pillar2-desc" class="form-textarea" rows="2">${trust.pillar2Desc || ''}</textarea>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label class="form-label">Pillar 3 Title (Insured Transit)</label>
                <input type="text" id="cms-pillar3-title" class="form-input" value="${trust.pillar3Title || ''}" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Pillar 3 Description</label>
                <textarea id="cms-pillar3-desc" class="form-textarea" rows="2">${trust.pillar3Desc || ''}</textarea>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label class="form-label">Pillar 4 Title (Lifetime Buyback)</label>
                <input type="text" id="cms-pillar4-title" class="form-input" value="${trust.pillar4Title || ''}" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Pillar 4 Description</label>
                <textarea id="cms-pillar4-desc" class="form-textarea" rows="2">${trust.pillar4Desc || ''}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. FEATURED CATEGORIES SECTION -->
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🏷️</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">3. Curated Royal Suites (Categories)</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Select which categories appear on the homepage grid</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-cat-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${catsSec.order ?? 3}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-cat-enabled" ${catsSec.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label">Category Badge Text</label>
              <input type="text" id="cms-cat-badge" class="form-input" value="${catsSec.badgeText || 'Explore by Category'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Category Section Heading</label>
              <input type="text" id="cms-cat-heading" class="form-input" value="${catsSec.heading || 'Curated Royal Suites'}" />
            </div>
            <div class="form-group">
              <label class="form-label">"View All" Link Label</label>
              <input type="text" id="cms-cat-viewall" class="form-input" value="${catsSec.viewAllLinkText || 'View All Categories →'}" />
            </div>
          </div>

          <div>
            <label class="form-label" style="margin-bottom: 0.75rem;">Select Featured Categories to Display:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);" id="cms-category-selector-grid">
              ${allCategories.map(cat => {
                const isSelected = (catsSec.featuredCategoryIds || []).includes(cat.name) || (catsSec.featuredCategoryIds || []).includes(cat.id);
                return `
                  <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.88rem; background: var(--bg-main); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid ${isSelected ? 'var(--border-gold)' : 'var(--border-subtle)'};">
                    <input type="checkbox" class="cms-cat-check" value="${cat.name}" ${isSelected ? 'checked' : ''} style="accent-color: var(--gold-bright);" />
                    <span>${cat.name}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 4. CROWN JEWELS & BESTSELLERS SECTION -->
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">💎</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">4. Crown Jewels & Bestsellers</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Pick hand-curated pieces from the catalog for the showcase</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-best-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${bestSec.order ?? 4}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-best-enabled" ${bestSec.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 120px; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label">Badge Tag</label>
              <input type="text" id="cms-best-badge" class="form-input" value="${bestSec.badgeText || 'Timeless Icons'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Section Heading</label>
              <input type="text" id="cms-best-heading" class="form-input" value="${bestSec.heading || 'Crown Jewels & Bestsellers'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Max Items</label>
              <input type="number" id="cms-best-max" class="form-input" value="${bestSec.maxItems || 4}" min="1" max="12" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Section Subheading Narrative</label>
            <input type="text" id="cms-best-sub" class="form-input" value="${bestSec.subheading || 'Our most coveted signature designs, cherished by royal patrons worldwide.'}" />
          </div>

          <div>
            <label class="form-label" style="margin-bottom: 0.75rem;">Select Featured Products for Showcase:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; max-height: 280px; overflow-y: auto; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);" id="cms-product-selector-grid">
              ${allProducts.map(prod => {
                const isSelected = (bestSec.featuredProductIds || []).includes(prod.id);
                return `
                  <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.82rem; background: var(--bg-main); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid ${isSelected ? 'var(--border-gold)' : 'var(--border-subtle)'};">
                    <input type="checkbox" class="cms-prod-check" value="${prod.id}" ${isSelected ? 'checked' : ''} style="accent-color: var(--gold-bright);" />
                    <img src="${prod.image}" alt="" style="width: 38px; height: 38px; object-fit: cover; border-radius: 4px;" />
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <div style="font-weight: 600; color: #fff;">${prod.name}</div>
                      <div style="color: var(--gold-bright);">${formatINR(prod.price)} • ${prod.category}</div>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 5. LIVE GOLD ESTIMATOR CALCULATOR -->
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">⚖️</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">5. Live Bullion & Jewellery Price Estimator Widget</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Real-time bullion price calculation transparency tool</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-calc-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${calcSec.order ?? 5}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-calc-enabled" ${calcSec.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Badge Tag</label>
              <input type="text" id="cms-calc-badge" class="form-input" value="${calcSec.badgeText || 'TRANSPARENCY GUARANTEE'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Section Heading</label>
              <input type="text" id="cms-calc-heading" class="form-input" value="${calcSec.heading || 'Live Gold & Jewellery Price Estimator'}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Section Subheading</label>
            <input type="text" id="cms-calc-sub" class="form-input" value="${calcSec.subheading || 'Calculate exact price based on today\'s official bullion rate, gold weight & making charges with 0% hidden fees.'}" />
          </div>
        </div>

        <!-- 6. MAHARANI BRIDAL SUITE SPOTLIGHT -->
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">👰</span>
              <div>
                <h3 style="font-size: 1.2rem; margin: 0;">6. Maharani Bridal Lounge Spotlight</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Royal wedding couture spotlight, imagery, concierge appointment CTA</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.8rem; color: var(--text-muted);">Order Position:</label>
                <input type="number" id="cms-bridal-order" class="form-input" style="width: 70px; padding: 0.35rem 0.5rem;" value="${bridalSec.order ?? 6}" min="1" max="10" />
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <input type="checkbox" id="cms-bridal-enabled" ${bridalSec.enabled !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-bright);" />
                <span>Publish Section</span>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.25rem;">
            <div>
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label">Bridal Badge Tag</label>
                <input type="text" id="cms-bridal-badge" class="form-input" value="${bridalSec.badgeText || 'Maharani Bridal Suite'}" />
              </div>
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label">Bridal Main Heading</label>
                <input type="text" id="cms-bridal-heading" class="form-input" value="${bridalSec.heading || 'Bespoke Wedding Jewellery for the Royal Indian Bride'}" />
              </div>
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label">Bridal Subheading Narrative</label>
                <textarea id="cms-bridal-sub" class="form-textarea" rows="3">${bridalSec.subheading || 'Crafted over 300 artisan hours with uncut syndicate polki, Burmese rubies, and Colombian emeralds set in solid 22K hallmarked gold.'}</textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group">
                  <label class="form-label">CTA Button Label</label>
                  <input type="text" id="cms-bridal-cta-text" class="form-input" value="${bridalSec.ctaText || 'Book a Bridal Concierge Appointment'}" />
                </div>
                <div class="form-group">
                  <label class="form-label">CTA Link</label>
                  <input type="text" id="cms-bridal-cta-link" class="form-input" value="${bridalSec.ctaLink || '#bridal'}" />
                </div>
              </div>
            </div>

            <div>
              <label class="form-label">Spotlight Artwork Image</label>
              <div style="margin-bottom: 0.75rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); height: 180px; background: #000;">
                <img id="preview-bridal-img" src="${bridalSec.image || ''}" alt="Bridal Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'" />
              </div>
              <input type="file" id="cms-bridal-file" accept="image/*" class="form-input" style="padding: 0.4rem; font-size: 0.8rem; margin-bottom: 0.5rem;" />
              <input type="url" id="cms-bridal-url" class="form-input" placeholder="Or paste Bridal Image URL" value="${bridalSec.image || ''}" />
              <div id="prog-bridal" style="font-size: 0.75rem; color: var(--gold-bright); margin-top: 0.25rem; display: none;">Uploading...</div>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div style="display: flex; gap: 1rem; justify-content: flex-end; padding: 1rem 0;">
          <button type="submit" class="btn btn-gold" id="btn-cms-submit" style="padding: 0.85rem 2.5rem; font-size: 1.05rem;">
            <span>💾 Save & Publish Homepage Changes</span>
          </button>
        </div>
      </form>
    </div>
  `;

  // Live image preview & file upload handlers
  const setupImageUploader = (fileInputId, urlInputId, previewImgId, progId) => {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const previewImg = document.getElementById(previewImgId);
    const prog = document.getElementById(progId);

    urlInput?.addEventListener('input', () => {
      if (previewImg && urlInput.value.trim()) {
        previewImg.src = urlInput.value.trim();
      }
    });

    fileInput?.addEventListener('change', async () => {
      if (!fileInput.files || !fileInput.files[0]) return;
      const file = fileInput.files[0];

      // Instant local preview
      const localUrl = URL.createObjectURL(file);
      if (previewImg) previewImg.src = localUrl;

      if (prog) {
        prog.style.display = 'block';
        prog.textContent = 'Uploading image to Firebase Storage (0%)...';
      }

      try {
        const uploadedUrl = await uploadImage(file, 'banners', (pct) => {
          if (prog) prog.textContent = `Uploading image to Firebase Storage (${pct}%)...`;
        });
        if (urlInput) urlInput.value = uploadedUrl;
        if (previewImg) previewImg.src = uploadedUrl;
        if (prog) {
          prog.textContent = '✓ Uploaded successfully!';
          prog.style.color = '#34d399';
        }
      } catch (err) {
        if (prog) {
          prog.textContent = `Upload failed: ${err.message}`;
          prog.style.color = '#ff6b6b';
        }
      }
    });
  };

  setupImageUploader('cms-hero-desktop-file', 'cms-hero-desktop-url', 'preview-hero-desktop', 'prog-hero-desktop');
  setupImageUploader('cms-hero-mobile-file', 'cms-hero-mobile-url', 'preview-hero-mobile', 'prog-hero-mobile');
  setupImageUploader('cms-bridal-file', 'cms-bridal-url', 'preview-bridal-img', 'prog-bridal');

  // Handle Form Submission
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const submitBtn = document.getElementById('btn-cms-submit');
    const topBtn = document.getElementById('btn-cms-save-top');
    if (submitBtn) { submitBtn.innerHTML = '<span>Saving to Cloud Firestore...</span>'; submitBtn.disabled = true; }
    if (topBtn) { topBtn.innerHTML = '<span>Saving...</span>'; topBtn.disabled = true; }

    try {
      // Gather selected categories
      const selectedCats = [];
      document.querySelectorAll('.cms-cat-check:checked').forEach(chk => {
        selectedCats.push(chk.value);
      });

      // Gather selected products
      const selectedProds = [];
      document.querySelectorAll('.cms-prod-check:checked').forEach(chk => {
        selectedProds.push(chk.value);
      });

      const updatedCMS = {
        hero: {
          enabled: document.getElementById('cms-hero-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-hero-order')?.value) || 1,
          badgeText: document.getElementById('cms-hero-badge')?.value.trim() || 'The Royal Heirloom Collection 2026',
          heading: document.getElementById('cms-hero-heading')?.value.trim() || 'Crafted in Pure 22K Gold & Solitaire Radiance',
          subheading: document.getElementById('cms-hero-subheading')?.value.trim() || '',
          cta1Text: document.getElementById('cms-hero-cta1-text')?.value.trim() || 'Explore Grand Vault',
          cta1Link: document.getElementById('cms-hero-cta1-link')?.value.trim() || '#shop',
          cta2Text: document.getElementById('cms-hero-cta2-text')?.value.trim() || 'Bridal Lounge',
          cta2Link: document.getElementById('cms-hero-cta2-link')?.value.trim() || '#bridal',
          desktopImage: document.getElementById('cms-hero-desktop-url')?.value.trim() || hero.desktopImage || '',
          mobileImage: document.getElementById('cms-hero-mobile-url')?.value.trim() || hero.mobileImage || '',
          floatingCardTitle: document.getElementById('cms-hero-float-title')?.value.trim() || 'Imperial Mayur Collection',
          floatingCardSubtitle: document.getElementById('cms-hero-float-sub')?.value.trim() || 'Handcrafted in 22K Solid Gold'
        },
        trustPillars: {
          enabled: document.getElementById('cms-trust-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-trust-order')?.value) || 2,
          pillar1Title: document.getElementById('cms-pillar1-title')?.value.trim() || '',
          pillar1Desc: document.getElementById('cms-pillar1-desc')?.value.trim() || '',
          pillar2Title: document.getElementById('cms-pillar2-title')?.value.trim() || '',
          pillar2Desc: document.getElementById('cms-pillar2-desc')?.value.trim() || '',
          pillar3Title: document.getElementById('cms-pillar3-title')?.value.trim() || '',
          pillar3Desc: document.getElementById('cms-pillar3-desc')?.value.trim() || '',
          pillar4Title: document.getElementById('cms-pillar4-title')?.value.trim() || '',
          pillar4Desc: document.getElementById('cms-pillar4-desc')?.value.trim() || ''
        },
        categoriesSection: {
          enabled: document.getElementById('cms-cat-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-cat-order')?.value) || 3,
          badgeText: document.getElementById('cms-cat-badge')?.value.trim() || 'Explore by Category',
          heading: document.getElementById('cms-cat-heading')?.value.trim() || 'Curated Royal Suites',
          viewAllLinkText: document.getElementById('cms-cat-viewall')?.value.trim() || 'View All Categories →',
          featuredCategoryIds: selectedCats
        },
        bestsellersSection: {
          enabled: document.getElementById('cms-best-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-best-order')?.value) || 4,
          badgeText: document.getElementById('cms-best-badge')?.value.trim() || 'Timeless Icons',
          heading: document.getElementById('cms-best-heading')?.value.trim() || 'Crown Jewels & Bestsellers',
          subheading: document.getElementById('cms-best-sub')?.value.trim() || '',
          maxItems: parseInt(document.getElementById('cms-best-max')?.value) || 4,
          featuredProductIds: selectedProds
        },
        goldCalculatorSection: {
          enabled: document.getElementById('cms-calc-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-calc-order')?.value) || 5,
          badgeText: document.getElementById('cms-calc-badge')?.value.trim() || 'TRANSPARENCY GUARANTEE',
          heading: document.getElementById('cms-calc-heading')?.value.trim() || 'Live Gold & Jewellery Price Estimator',
          subheading: document.getElementById('cms-calc-sub')?.value.trim() || ''
        },
        bridalSpotlightSection: {
          enabled: document.getElementById('cms-bridal-enabled')?.checked ?? true,
          order: parseInt(document.getElementById('cms-bridal-order')?.value) || 6,
          badgeText: document.getElementById('cms-bridal-badge')?.value.trim() || 'Maharani Bridal Suite',
          heading: document.getElementById('cms-bridal-heading')?.value.trim() || 'Bespoke Wedding Jewellery for the Royal Indian Bride',
          subheading: document.getElementById('cms-bridal-sub')?.value.trim() || '',
          ctaText: document.getElementById('cms-bridal-cta-text')?.value.trim() || 'Book a Bridal Concierge Appointment',
          ctaLink: document.getElementById('cms-bridal-cta-link')?.value.trim() || '#bridal',
          image: document.getElementById('cms-bridal-url')?.value.trim() || bridalSec.image || ''
        }
      };

      await updateHomepageCMS(updatedCMS);
      showToast('Homepage CMS published successfully to Cloud Firestore! ✨', 'success');
    } catch (err) {
      console.error('CMS Save error:', err);
      showToast('Error saving CMS: ' + err.message, 'danger');
    } finally {
      if (submitBtn) { submitBtn.innerHTML = '<span>💾 Save & Publish Homepage Changes</span>'; submitBtn.disabled = false; }
      if (topBtn) { topBtn.innerHTML = '<span>💾 Save & Publish Homepage</span>'; topBtn.disabled = false; }
    }
  };

  document.getElementById('form-homepage-cms')?.addEventListener('submit', handleSave);
  document.getElementById('btn-cms-save-top')?.addEventListener('click', handleSave);

  // Reset to default CMS
  document.getElementById('btn-cms-reset')?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all homepage sections and banners to royal default settings?')) {
      await resetHomepageCMS();
      showToast('Homepage CMS restored to default settings!', 'info');
      await renderCMSView(stage);
    }
  });
}

// -------------------------------------------------------------
// Modals: Add / Edit Product, Invoice Viewer
// -------------------------------------------------------------
function openAddProductModal() {
  const modalRoot = document.getElementById('admin-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="admin-modal-backdrop" id="admin-modal-overlay">
      <div class="admin-modal-dialog">
        <button class="modal-close-btn" id="admin-modal-x">✕</button>
        <h3 style="font-size: 1.4rem; margin-bottom: 1.5rem;" class="text-gold-gradient">+ Add New Masterpiece to Vault</h3>

        <form id="form-modal-add-product">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Jewellery Title *</label>
              <input type="text" id="m-prod-name" class="form-input" placeholder="e.g. Royal Nizam Diamond Necklace" required />
            </div>
            <div class="form-group">
              <label class="form-label">SKU Code *</label>
              <input type="text" id="m-prod-sku" class="form-input" placeholder="VJ-GLD-NC-009" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="m-prod-cat" required>
                <option value="Necklaces">Necklaces</option>
                <option value="Bridal Sets">Bridal Sets</option>
                <option value="Rings">Rings</option>
                <option value="Bangles">Bangles</option>
                <option value="Earrings">Earrings</option>
                <option value="Mangalsutra">Mangalsutra</option>
                <option value="Coins & Bullion">Coins & Bullion</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Metal / Karat *</label>
              <select class="form-select" id="m-prod-karat" required>
                <option value="22K (916 BIS)">22K Gold (916 BIS)</option>
                <option value="24K (999 Pure)">24K Pure Gold</option>
                <option value="18K Rose Gold">18K Rose Gold & Diamond</option>
                <option value="18K Yellow Gold">18K Yellow Gold</option>
                <option value="Pt 950 Pure Platinum">Pt 950 Platinum</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Gold Weight (Grams) *</label>
              <input type="number" id="m-prod-weight" class="form-input" placeholder="28.5" step="0.1" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Making Charges (%) *</label>
              <input type="number" id="m-prod-making" class="form-input" value="12" step="0.5" required />
            </div>
            <div class="form-group">
              <label class="form-label">Selling Price (INR) *</label>
              <input type="number" id="m-prod-price" class="form-input" placeholder="245000" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Product Image (Firebase Storage Upload)</label>
            <input type="file" id="m-prod-file" accept="image/*" class="form-input" />
            <input type="url" id="m-prod-url" class="form-input" placeholder="Or paste image URL" style="margin-top: 0.5rem;" />
          </div>

          <div class="form-group">
            <label class="form-label">Artisan Craftsmanship Description</label>
            <textarea id="m-prod-desc" class="form-textarea" rows="2" placeholder="Handcrafted with temple filigree artwork..."></textarea>
          </div>

          <button type="submit" class="btn btn-gold" id="btn-submit-m-prod" style="width: 100%; padding: 0.85rem;">
            Publish Piece to Cloud Firestore 💎
          </button>
        </form>
      </div>
    </div>
  `;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('admin-modal-x')?.addEventListener('click', close);
  document.getElementById('admin-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-overlay') close();
  });

  document.getElementById('form-modal-add-product')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-m-prod');
    const fileInput = document.getElementById('m-prod-file');
    const urlInput = document.getElementById('m-prod-url');

    let imageUrl = urlInput.value.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80';

    if (fileInput.files && fileInput.files[0]) {
      btn.innerHTML = '<span>Uploading to Firebase Storage...</span>';
      btn.disabled = true;
      try {
        imageUrl = await uploadImage(fileInput.files[0], 'products');
      } catch (err) {
        showToast('Storage upload: ' + err.message, 'warning');
      }
    }

    const prodData = {
      name: document.getElementById('m-prod-name').value.trim(),
      sku: document.getElementById('m-prod-sku').value.trim(),
      category: document.getElementById('m-prod-cat').value,
      metal: 'Gold',
      karat: document.getElementById('m-prod-karat').value,
      weightGrams: parseFloat(document.getElementById('m-prod-weight').value) || 10,
      makingChargePercent: parseFloat(document.getElementById('m-prod-making').value) || 10,
      price: parseFloat(document.getElementById('m-prod-price').value) || 100000,
      image: imageUrl,
      description: document.getElementById('m-prod-desc').value.trim(),
      stockCount: 5,
      inStock: true,
      tags: ['New Arrival', 'Artisan Handcrafted']
    };

    await addProductAdmin(prodData);
    showToast(`Piece "${prodData.name}" published to Firestore!`, 'success');
    close();
    loadActiveModuleView();
  });
}

function openEditProductModal(product) {
  const modalRoot = document.getElementById('admin-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="admin-modal-backdrop" id="admin-modal-overlay">
      <div class="admin-modal-dialog">
        <button class="modal-close-btn" id="admin-modal-x">✕</button>
        <h3 style="font-size: 1.4rem; margin-bottom: 1.5rem;" class="text-gold-gradient">✏️ Edit Jewellery Specifications</h3>

        <form id="form-modal-edit-product">
          <div class="form-group">
            <label class="form-label">Jewellery Title *</label>
            <input type="text" id="e-prod-name" class="form-input" value="${product.name}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Selling Price (INR) *</label>
              <input type="number" id="e-prod-price" class="form-input" value="${product.price}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Stock Units *</label>
              <input type="number" id="e-prod-stock" class="form-input" value="${product.stockCount || 1}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="e-prod-desc" class="form-textarea" rows="2">${product.description || ''}</textarea>
          </div>

          <button type="submit" class="btn btn-gold" style="width: 100%;">Save Modifications</button>
        </form>
      </div>
    </div>
  `;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('admin-modal-x')?.addEventListener('click', close);
  document.getElementById('admin-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-overlay') close();
  });

  document.getElementById('form-modal-edit-product')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      name: document.getElementById('e-prod-name').value.trim(),
      price: parseFloat(document.getElementById('e-prod-price').value) || product.price,
      stockCount: parseInt(document.getElementById('e-prod-stock').value) || 0,
      description: document.getElementById('e-prod-desc').value.trim()
    };
    await updateProductAdmin(product.id, updated);
    showToast('Specifications saved in Cloud Firestore!', 'success');
    close();
    loadActiveModuleView();
  });
}

function openInvoiceModal(order) {
  const modalRoot = document.getElementById('admin-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="admin-modal-backdrop" id="admin-modal-overlay">
      <div class="admin-modal-dialog" style="max-width: 650px;">
        <button class="modal-close-btn" id="admin-modal-x">✕</button>

        <div style="border-bottom: 2px solid var(--border-gold); padding-bottom: 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="brand-name" style="font-size: 1.5rem;">VAISHU JEWELLERY</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">BIS Hallmark Assaying # BIS/HM/916/MH/2026</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--gold-bright);">${order.orderId}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(order.createdAt)}</div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem; font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <strong>Recipient:</strong><br>
            ${order.customerName}<br>
            ${order.customerPhone}<br>
            ${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}
          </div>
          <div>
            <strong>Transit Security:</strong><br>
            Carrier: Brink's Armoured Vault<br>
            Tracking: ${order.trackingNumber}<br>
            Policy: ${order.insurancePolicyNumber}
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          ${order.items?.map(i => `
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-bottom: 1px solid var(--border-subtle); padding: 0.5rem 0;">
              <div>
                <strong>${i.name}</strong> (${i.karat})<br>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Qty: ${i.quantity}</span>
              </div>
              <strong style="color: var(--gold-bright);">${formatINR(i.price * i.quantity)}</strong>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; color: #fff; border-top: 1px solid var(--border-gold); padding-top: 1rem;">
          <span>Grand Total Paid:</span>
          <span style="color: var(--gold-bright); font-family: var(--font-serif);">${formatINR(order.payment?.grandTotal || 0)}</span>
        </div>

        <button class="btn btn-gold" onclick="window.print()" style="width: 100%; margin-top: 1.5rem;">
          🖨️ Print Royal Tax Invoice
        </button>
      </div>
    </div>
  `;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('admin-modal-x')?.addEventListener('click', close);
  document.getElementById('admin-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-overlay') close();
  });
}

function openAddCouponModal() {
  switchModule('coupons');
}

function openAddBannerModal() {
  switchModule('banners');
}

// -------------------------------------------------------------
// Layout Events & Admin Login Gateway
// -------------------------------------------------------------
function attachLayoutEvents(container, currentUser, onOpenAuthModal) {
  // Navigation Module buttons
  container.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = btn.getAttribute('data-mod');
      switchModule(mod);
    });
  });

  // Theme toggle trigger
  document.getElementById('admin-theme-toggle-btn')?.addEventListener('click', () => {
    toggleTheme();
  });

  // Top 1-Click Firestore Seeder
  document.getElementById('btn-top-seed')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-top-seed');
    if (btn) btn.innerHTML = '<span>Seeding All Collections...</span>';
    const res = await seedAllFirestoreCollections();
    showToast(`Seeded ${res.count} records across all 12 modules into ${res.mode === 'firestore' ? 'Cloud Firestore' : 'Vault'}!`, 'success');
    setTimeout(() => {
      if (btn) btn.innerHTML = '<span>⚡ Seed Firestore</span>';
      loadActiveModuleView();
    }, 600);
  });

  // Mobile sidebar toggle
  document.getElementById('mobile-sidebar-toggle')?.addEventListener('click', () => {
    const sb = document.getElementById('admin-sidebar');
    sb?.classList.toggle('open');
  });

  document.getElementById('sidebar-close-mobile')?.addEventListener('click', () => {
    const sb = document.getElementById('admin-sidebar');
    sb?.classList.remove('open');
  });

  // Admin Sign Out
  document.getElementById('admin-signout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('vaishu_jewellery_current_user');
    showToast('Signed out of admin console.', 'info');
    window.location.hash = '#';
    window.location.reload();
  });
}

function renderAdminLoginGateway(container, onOpenAuthModal) {
  container.innerHTML = `
    <div class="container" style="padding: 6rem 1.5rem; text-align: center; max-width: 540px;">
      <div style="width: 56px; height: 56px; background: var(--gold-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #000; box-shadow: var(--gold-glow);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 3h12l4 6-10 12L2 9z"/>
          <path d="M11 3 8 9l4 12 4-12-3-6"/>
          <path d="M2 9h20"/>
        </svg>
      </div>
      <h2 style="font-size: 2.2rem; margin-bottom: 0.75rem;" class="text-gold-gradient">Vaishu Vault Administration</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem;">
        Protected administrator portal for managing Cloud Firestore catalog, orders, bullion rates, and financial reports.
      </p>

      <button class="btn btn-gold" id="btn-admin-gate-login" style="padding: 0.9rem 2.25rem; font-size: 1.05rem;">
        <span>🔒 Sign In as Store Admin</span>
      </button>
    </div>
  `;

  document.getElementById('btn-admin-gate-login')?.addEventListener('click', () => {
    if (onOpenAuthModal) onOpenAuthModal('admin');
  });
}
