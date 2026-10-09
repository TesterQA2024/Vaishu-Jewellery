/**
 * VAISHU JEWELLERY - Catalog & Collections Page
 */

import { fetchProducts } from '../services/productService';
import { getCategoriesAdmin } from '../services/adminService';
import { renderProductCard, attachProductCardEvents } from '../components/ProductCard';
import { formatINR } from '../utils/formatters';

export async function renderCatalogPage(container, onOpenQuickView, initialCategory = 'all') {
  let activeCategory = initialCategory;
  let activeMetal = 'all';
  let activeSort = 'featured';
  let maxPrice = 1600000;
  let searchQuery = '';

  const render = async () => {
    const [products, categories] = await Promise.all([
      fetchProducts({
        category: activeCategory,
        metal: activeMetal,
        maxPrice: maxPrice,
        searchQuery: searchQuery,
        sortBy: activeSort
      }),
      getCategoriesAdmin()
    ]);

    container.innerHTML = `
      <section style="padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Header & Breadcrumb -->
          <div style="margin-bottom: 2rem;">
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              <a href="#" style="color: var(--gold-bright);">Home</a> / <span>Royal Catalog</span>
            </div>
            <h1 style="font-size: 2.4rem;" class="text-gold-gradient">The Royal Jewellery Vault</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Explore BIS 916 hallmarked pure gold, IGI certified solitaire diamonds, and bridal heirloom ornaments.</p>
          </div>

          <!-- Filter & Search Toolbar -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; align-items: end;">
              <!-- Search Box -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Search Ornaments</label>
                <div style="position: relative;">
                  <input type="text" id="catalog-search" class="form-input" placeholder="Search chokers, rings, kadas..." value="${searchQuery}" />
                  <span style="position: absolute; right: 12px; top: 10px; color: var(--text-muted);">🔍</span>
                </div>
              </div>

              <!-- Category Filter -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Category</label>
                <select class="form-select" id="catalog-category-select">
                  <option value="all" ${activeCategory === 'all' ? 'selected' : ''}>All Categories</option>
                  ${categories.filter(c => c.id !== 'all').map(c => `
                    <option value="${c.id}" ${activeCategory === c.id ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Metal & Purity Filter -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Metal / Purity</label>
                <select class="form-select" id="catalog-metal-select">
                  <option value="all" ${activeMetal === 'all' ? 'selected' : ''}>All Metals & Purity</option>
                  <option value="Gold" ${activeMetal === 'Gold' ? 'selected' : ''}>22K / 24K Pure Gold</option>
                  <option value="Diamond" ${activeMetal === 'Diamond' ? 'selected' : ''}>Certified Diamonds</option>
                  <option value="Platinum" ${activeMetal === 'Platinum' ? 'selected' : ''}>Pt 950 Platinum</option>
                </select>
              </div>

              <!-- Price Slider -->
              <div class="form-group" style="margin: 0;">
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem;">
                  <span>Max Price:</span>
                  <span style="color: var(--gold-bright);">${formatINR(maxPrice)}</span>
                </div>
                <input type="range" id="catalog-price-range" min="50000" max="2000000" step="25000" value="${maxPrice}" style="width: 100%; accent-color: var(--gold-primary);" />
              </div>

              <!-- Sort Order -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Sort By</label>
                <select class="form-select" id="catalog-sort-select">
                  <option value="featured" ${activeSort === 'featured' ? 'selected' : ''}>Featured & Bestselling</option>
                  <option value="price-low" ${activeSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-high" ${activeSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${activeSort === 'rating' ? 'selected' : ''}>Highest Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Product Results Count & Grid -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              Showing <strong style="color: #fff;">${products.length}</strong> handcrafted masterpieces
            </div>
            ${(activeCategory !== 'all' || activeMetal !== 'all' || searchQuery) ? `
              <button id="btn-clear-filters" class="btn btn-ghost" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                ✕ Clear Filters
              </button>
            ` : ''}
          </div>

          ${products.length === 0 ? `
            <div style="text-align: center; padding: 5rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border-gold); border-radius: var(--radius-md);">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No Jewellery Matches Your Filter</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Try adjusting price slider or clearing search parameters.</p>
              <button id="btn-reset-catalog" class="btn btn-gold">Reset All Filters</button>
            </div>
          ` : `
            <div class="product-grid" id="catalog-products-grid">
              ${products.map(p => renderProductCard(p)).join('')}
            </div>
          `}
        </div>
      </section>
    `;

    attachEvents(products);
  };

  const attachEvents = (products) => {
    const grid = document.getElementById('catalog-products-grid');
    if (grid) {
      attachProductCardEvents(grid, products, onOpenQuickView);
    }

    // Search input
    const searchInput = document.getElementById('catalog-search');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Category select
    document.getElementById('catalog-category-select')?.addEventListener('change', (e) => {
      activeCategory = e.target.value;
      render();
    });

    // Metal select
    document.getElementById('catalog-metal-select')?.addEventListener('change', (e) => {
      activeMetal = e.target.value;
      render();
    });

    // Price range slider
    document.getElementById('catalog-price-range')?.addEventListener('input', (e) => {
      maxPrice = Number(e.target.value);
      render();
    });

    // Sort select
    document.getElementById('catalog-sort-select')?.addEventListener('change', (e) => {
      activeSort = e.target.value;
      render();
    });

    // Clear filters
    const clearBtn = document.getElementById('btn-clear-filters') || document.getElementById('btn-reset-catalog');
    clearBtn?.addEventListener('click', () => {
      activeCategory = 'all';
      activeMetal = 'all';
      activeSort = 'featured';
      searchQuery = '';
      maxPrice = 2000000;
      render();
    });
  };

  render();
}
