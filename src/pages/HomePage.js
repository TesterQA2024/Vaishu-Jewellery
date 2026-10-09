/**
 * VAISHU JEWELLERY - Dynamic Homepage View
 * Fully powered by Cloud Firestore CMS & Firebase Storage Assets
 */

import { fetchProducts, calculateItemBreakdown, getStoredLiveRates } from '../services/productService';
import { getCategoriesAdmin, getHomepageCMS } from '../services/adminService';
import { renderProductCard, attachProductCardEvents } from '../components/ProductCard';
import { formatINR } from '../utils/formatters';

export async function renderHomePage(container, onOpenQuickView) {
  const [allProducts, allCategories, cms] = await Promise.all([
    fetchProducts({ sortBy: 'featured' }),
    getCategoriesAdmin(),
    getHomepageCMS()
  ]);

  const liveRates = getStoredLiveRates();
  const hero = cms.hero || {};
  const trust = cms.trustPillars || {};
  const catsSec = cms.categoriesSection || {};
  const bestSec = cms.bestsellersSection || {};
  const calcSec = cms.goldCalculatorSection || {};
  const bridalSec = cms.bridalSpotlightSection || {};

  // Filter Featured Categories
  const featuredCategories = (catsSec.featuredCategoryIds && catsSec.featuredCategoryIds.length > 0)
    ? allCategories.filter(c => catsSec.featuredCategoryIds.includes(c.name) || catsSec.featuredCategoryIds.includes(c.id))
    : allCategories;

  // Filter Featured Products / Bestsellers
  let bestsellers = [];
  if (bestSec.featuredProductIds && bestSec.featuredProductIds.length > 0) {
    bestsellers = allProducts.filter(p => bestSec.featuredProductIds.includes(p.id));
  }
  if (bestsellers.length === 0) {
    bestsellers = allProducts.filter(p => p.isBestseller || p.featured).slice(0, bestSec.maxItems || 4);
  } else {
    bestsellers = bestsellers.slice(0, bestSec.maxItems || 4);
  }

  // Section Builders
  const sections = [];

  // 1. Hero Showcase
  if (hero.enabled !== false) {
    const desktopImg = hero.desktopImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80';
    const mobileImg = hero.mobileImage || desktopImg;

    sections.push({
      id: 'hero',
      order: hero.order ?? 1,
      html: `
        <section class="hero-section" id="hero-section">
          <div class="container">
            <div class="hero-grid">
              <div>
                <div class="hero-badge">
                  <span>✨</span>
                  <span>${hero.badgeText || 'The Royal Heirloom Collection 2026'}</span>
                </div>
                <h1 class="hero-title">
                  ${hero.heading || 'Crafted in Pure <span class="text-gold-gradient">22K Gold & Solitaire</span> Radiance'}
                </h1>
                <p class="hero-desc">
                  ${hero.subheading || 'Experience the pinnacle of royal heritage craftsmanship. Handcrafted temple chokers, certified diamond solitaires, and BIS 916 hallmarked masterpieces designed for timeless royalty.'}
                </p>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <a href="${hero.cta1Link || '#shop'}" class="btn btn-gold" style="padding: 0.85rem 1.85rem; font-size: 1rem;">
                    <span>${hero.cta1Text || 'Explore Grand Vault'}</span>
                    <span>→</span>
                  </a>
                  <a href="${hero.cta2Link || '#bridal'}" class="btn btn-outline-gold" style="padding: 0.85rem 1.85rem; font-size: 1rem;">
                    <span>${hero.cta2Text || 'Bridal Lounge'}</span>
                  </a>
                </div>

                <!-- Live Trust Stats -->
                <div class="hero-stats">
                  <div>
                    <div class="hero-stat-value">100%</div>
                    <div class="hero-stat-label">BIS 916 Hallmarked</div>
                  </div>
                  <div>
                    <div class="hero-stat-value">35+</div>
                    <div class="hero-stat-label">Years of Mastery</div>
                  </div>
                  <div>
                    <div class="hero-stat-value">₹0</div>
                    <div class="hero-stat-label">Insured Delivery</div>
                  </div>
                </div>
              </div>

              <!-- Hero Image Showcase with Responsive Picture & Badge -->
              <div>
                <div class="hero-image-card">
                  <picture>
                    <source media="(max-width: 640px)" srcset="${mobileImg}" />
                    <img src="${desktopImg}" alt="${hero.heading || 'Royal Vaishu Jewellery'}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </picture>
                  <div class="hero-floating-seal">
                    <div style="font-size: 1.6rem;">👑</div>
                    <div>
                      <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">${hero.floatingCardTitle || 'Imperial Mayur Collection'}</div>
                      <div style="font-size: 0.75rem; color: var(--gold-bright);">${hero.floatingCardSubtitle || 'Handcrafted in 22K Solid Gold'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    });
  }

  // 2. Trust & Purity Pillars
  if (trust.enabled !== false) {
    sections.push({
      id: 'trust',
      order: trust.order ?? 2,
      html: `
        <section class="trust-pillars-section" style="background: var(--bg-surface); border-top: 1px solid var(--border-gold); border-bottom: 1px solid var(--border-gold); padding: 2.25rem 0;">
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; text-align: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="font-size: 2rem;">🏅</div>
                <h4 style="font-size: 1.05rem; color: #fff;">${trust.pillar1Title || 'BIS 916 Hallmark with HUID'}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 260px;">${trust.pillar1Desc || 'Every gram of gold is certified and authenticated by Government of India testing assays.'}</p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="font-size: 2rem;">💎</div>
                <h4 style="font-size: 1.05rem; color: #fff;">${trust.pillar2Title || 'IGI & SGL Certified Diamonds'}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 260px;">${trust.pillar2Desc || 'Conflict-free, laser-inscribed natural diamonds with supreme cut, clarity and color.'}</p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="font-size: 2rem;">🛡️</div>
                <h4 style="font-size: 1.05rem; color: #fff;">${trust.pillar3Title || '100% Insured Armoured Transit'}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 260px;">${trust.pillar3Desc || 'Doorstep delivery in tamper-evident sealed security vaults with comprehensive transit insurance.'}</p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="font-size: 2rem;">🔄</div>
                <h4 style="font-size: 1.05rem; color: #fff;">${trust.pillar4Title || 'Guaranteed Lifetime Buyback'}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 260px;">${trust.pillar4Desc || 'Transparent exchange & buyback at prevailing bullion market rates anytime.'}</p>
              </div>
            </div>
          </div>
        </section>
      `
    });
  }

  // 3. Categories Section
  if (catsSec.enabled !== false) {
    sections.push({
      id: 'categories',
      order: catsSec.order ?? 3,
      html: `
        <section class="categories-section" style="padding: 4rem 0;">
          <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
              <div>
                <div style="color: var(--gold-dark); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
                  ${catsSec.badgeText || 'Explore by Category'}
                </div>
                <h2 style="font-size: 2rem;">${catsSec.heading || 'Curated Royal Suites'}</h2>
              </div>
              <a href="#shop" style="color: var(--gold-bright); font-weight: 600; font-size: 0.9rem;">
                ${catsSec.viewAllLinkText || 'View All Categories →'}
              </a>
            </div>

            <div class="category-pill-grid">
              ${featuredCategories.map(cat => `
                <a href="#shop" class="category-pill" data-category="${cat.id}">
                  <span>${cat.name}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </section>
      `
    });
  }

  // 4. Bestsellers Section
  if (bestSec.enabled !== false) {
    sections.push({
      id: 'bestsellers',
      order: bestSec.order ?? 4,
      html: `
        <section class="bestsellers-section" style="padding: 2rem 0 5rem;">
          <div class="container">
            <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem;">
              <div class="hero-badge" style="margin-bottom: 0.75rem;">${bestSec.badgeText || 'Timeless Icons'}</div>
              <h2 style="font-size: 2.2rem; margin-bottom: 0.75rem;">${bestSec.heading || 'Crown Jewels & Bestsellers'}</h2>
              <p style="color: var(--text-muted); font-size: 0.95rem;">
                ${bestSec.subheading || 'Our most coveted signature designs, cherished by royal patrons worldwide.'}
              </p>
            </div>

            <div class="product-grid" id="bestsellers-grid">
              ${bestsellers.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </section>
      `
    });
  }

  // 5. Live Gold Price Estimator
  if (calcSec.enabled !== false) {
    sections.push({
      id: 'calculator',
      order: calcSec.order ?? 5,
      html: `
        <section id="gold-calculator-section" style="background: radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, var(--bg-surface) 70%); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); margin: 2rem auto; max-width: 1200px; padding: 3.5rem 2rem;">
          <div style="max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <span class="ticker-badge" style="font-size: 0.75rem; padding: 0.2rem 0.6rem;">${calcSec.badgeText || 'TRANSPARENCY GUARANTEE'}</span>
              <h2 style="font-size: 2rem; margin: 0.5rem 0;">${calcSec.heading || 'Live Gold & Jewellery Price Estimator'}</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">${calcSec.subheading || 'Calculate exact price based on today\'s official bullion rate, gold weight & making charges with 0% hidden fees.'}</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; background: var(--bg-main); padding: 2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 2rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Metal Purity</label>
                <select class="form-select" id="calc-karat">
                  <option value="22K (916 BIS)">22K Gold (91.6% Pure) - ₹${liveRates.gold22k}/g</option>
                  <option value="24K (999 Pure)">24K Gold (99.9% Pure) - ₹${liveRates.gold24k}/g</option>
                  <option value="18K (750 BIS)">18K Gold (75% Pure) - ₹${liveRates.gold18k}/g</option>
                  <option value="Platinum Pt950">Platinum Pt 950 - ₹${liveRates.platinum}/g</option>
                  <option value="Silver 999">Silver 999 - ₹${liveRates.silver}/g</option>
                </select>
              </div>

              <div class="form-group" style="margin: 0;">
                <label class="form-label">Gold Weight (in Grams)</label>
                <input type="number" class="form-input" id="calc-weight" value="25" min="1" max="1000" step="0.5" />
              </div>

              <div class="form-group" style="margin: 0;">
                <label class="form-label">Making Charge (%)</label>
                <input type="number" class="form-input" id="calc-making" value="10" min="3" max="30" step="0.5" />
              </div>
            </div>

            <!-- Calculated Outcome -->
            <div id="calc-output" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Estimated Value (Metal + Making + 3% GST)</div>
                <div id="calc-result-price" style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 900; color: var(--gold-bright);">
                  --
                </div>
              </div>
              <a href="#shop" class="btn btn-gold" style="padding: 0.75rem 1.5rem;">Browse Matching Jewellery →</a>
            </div>
          </div>
        </section>
      `
    });
  }

  // 6. Bridal Spotlight
  if (bridalSec.enabled !== false) {
    const bridalImg = bridalSec.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80';
    sections.push({
      id: 'bridal',
      order: bridalSec.order ?? 6,
      html: `
        <section id="bridal-section" style="padding: 5rem 0;">
          <div class="container">
            <div style="background: linear-gradient(135deg, #181510 0%, #121217 100%); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); overflow: hidden; display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));">
              <div style="padding: 4rem 3rem; display: flex; flex-direction: column; justify-content: center;">
                <div class="hero-badge" style="margin-bottom: 1rem;">${bridalSec.badgeText || 'Maharani Bridal Suite'}</div>
                <h2 style="font-size: 2.3rem; margin-bottom: 1rem; line-height: 1.2;">
                  ${bridalSec.heading || 'Bespoke Wedding Jewellery for the Royal Indian Bride'}
                </h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem;">
                  ${bridalSec.subheading || 'Crafted over 300 artisan hours with uncut syndicate polki, Burmese rubies, and Colombian emeralds set in solid 22K hallmarked gold.'}
                </p>
                <div>
                  <a href="${bridalSec.ctaLink || '#bridal'}" class="btn btn-gold" style="padding: 0.85rem 1.75rem;">
                    <span>${bridalSec.ctaText || 'Book a Bridal Concierge Appointment'}</span>
                  </a>
                </div>
              </div>
              <div style="position: relative; min-height: 380px;">
                <img src="${bridalImg}" alt="Vaishu Bridal Set" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
        </section>
      `
    });
  }

  // Sort sections dynamically by order
  sections.sort((a, b) => a.order - b.order);

  // Render all active sections in defined order
  container.innerHTML = sections.map(s => s.html).join('');

  // Attach card events if bestsellers grid is rendered
  const bestsellersGrid = document.getElementById('bestsellers-grid');
  if (bestsellersGrid) {
    attachProductCardEvents(bestsellersGrid, allProducts, onOpenQuickView);
  }

  // Calculator Logic if calculator section is rendered
  const calcKarat = document.getElementById('calc-karat');
  const calcWeight = document.getElementById('calc-weight');
  const calcMaking = document.getElementById('calc-making');
  const calcResultPrice = document.getElementById('calc-result-price');

  if (calcKarat && calcWeight && calcMaking && calcResultPrice) {
    const updateCalculator = () => {
      const weight = parseFloat(calcWeight.value) || 0;
      const karat = calcKarat.value;
      const making = parseFloat(calcMaking.value) || 0;
      const breakdown = calculateItemBreakdown(weight, karat, making);
      calcResultPrice.textContent = formatINR(breakdown.total);
    };

    calcKarat.addEventListener('change', updateCalculator);
    calcWeight.addEventListener('input', updateCalculator);
    calcMaking.addEventListener('input', updateCalculator);
    updateCalculator();
  }
}
