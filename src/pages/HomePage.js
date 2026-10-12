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
                  <span>✦</span>
                  <span>${hero.badgeText || 'HAUTE JOAILLERIE • ROYAL HERITAGE'}</span>
                </div>
                <h1 class="hero-title">
                  ${hero.heading || 'Pure <span class="text-gold-gradient">22K Gold & Solitaire</span> Radiance'}
                </h1>
                <p class="hero-desc">
                  ${hero.subheading || 'Handcrafted temple chokers, certified diamond solitaires, and BIS 916 hallmarked masterworks.'}
                </p>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                  <a href="${hero.cta1Link || '#shop'}" class="btn btn-gold" style="padding: 0.95rem 2.2rem; font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 700;">
                    <span>${hero.cta1Text || 'Explore Vault'}</span>
                    <span>→</span>
                  </a>
                  <a href="${hero.cta2Link || '#bridal'}" class="btn btn-outline-gold" style="padding: 0.95rem 2rem; font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase;">
                    <span>${hero.cta2Text || 'Bridal Lounge'}</span>
                  </a>
                </div>

                <!-- Minimalist Luxury Trust Badges -->
                <div class="hero-stats">
                  <div>
                    <div class="hero-stat-value">BIS 916</div>
                    <div class="hero-stat-label">100% Hallmarked</div>
                  </div>
                  <div>
                    <div class="hero-stat-value">35+ Yrs</div>
                    <div class="hero-stat-label">Royal Heritage</div>
                  </div>
                  <div>
                    <div class="hero-stat-value">IGI / SGL</div>
                    <div class="hero-stat-label">Certified Solitaires</div>
                  </div>
                  <div>
                    <div class="hero-stat-value">₹0 Free</div>
                    <div class="hero-stat-label">Insured Transit</div>
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
                    <div style="font-size: 1.5rem;">👑</div>
                    <div>
                      <div style="font-size: 0.85rem; font-weight: 700; color: #fff; letter-spacing: 0.04em;">${hero.floatingCardTitle || 'Imperial Mayur Collection'}</div>
                      <div style="font-size: 0.72rem; color: var(--gold-bright);">${hero.floatingCardSubtitle || 'Handcrafted in 22K Solid Gold'}</div>
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

  // 2. Trust & Purity Pillars (Minimalist Luxury Aesthetic)
  if (trust.enabled !== false) {
    sections.push({
      id: 'trust',
      order: trust.order ?? 2,
      html: `
        <section class="trust-pillars-section">
          <div class="container">
            <div class="luxury-trust-grid">
              <div class="trust-pill-card">
                <div class="trust-icon-wrap">🏅</div>
                <div class="trust-info">
                  <h4 class="trust-title">${trust.pillar1Title || 'BIS 916 Hallmarked'}</h4>
                  <p class="trust-desc">${trust.pillar1Desc || 'Govt. Assayed with HUID Laser Inscription'}</p>
                </div>
              </div>
              <div class="trust-pill-card">
                <div class="trust-icon-wrap">💎</div>
                <div class="trust-info">
                  <h4 class="trust-title">${trust.pillar2Title || 'IGI Certified Solitaires'}</h4>
                  <p class="trust-desc">${trust.pillar2Desc || 'Conflict-Free Natural Diamonds of Supreme Clarity'}</p>
                </div>
              </div>
              <div class="trust-pill-card">
                <div class="trust-icon-wrap">🛡️</div>
                <div class="trust-info">
                  <h4 class="trust-title">${trust.pillar3Title || '100% Insured Transit'}</h4>
                  <p class="trust-desc">${trust.pillar3Desc || 'Tamper-Proof Sealed Armoured Doorstep Delivery'}</p>
                </div>
              </div>
              <div class="trust-pill-card">
                <div class="trust-icon-wrap">🔄</div>
                <div class="trust-info">
                  <h4 class="trust-title">${trust.pillar4Title || 'Lifetime Buyback'}</h4>
                  <p class="trust-desc">${trust.pillar4Desc || '100% Prevailing Bullion Exchange Value Always'}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Swarna Nidhi 11+1 Promo Strip -->
          <div class="swarna-nidhi-ribbon">
            <div class="container swarna-ribbon-inner">
              <div class="swarna-ribbon-text">
                <span class="ribbon-crown">👑</span>
                <div>
                  <strong class="ribbon-headline">Vaishu Swarna Nidhi (11+1 Monthly Plan)</strong>
                  <span class="ribbon-subline">— Pay 11 Months, Get 1 Month EMI 100% Gifted By Us!</span>
                </div>
              </div>
              <a href="#gold-plan" class="btn btn-gold btn-sm ribbon-btn">
                <span>Calculate & Enroll →</span>
              </a>
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
        <section class="categories-section" id="categories-section">
          <div class="container">
            <div class="categories-header-row">
              <div>
                <div class="section-kicker">
                  ${catsSec.badgeText || 'Explore by Category'}
                </div>
                <h2 class="section-title-sm">${catsSec.heading || 'Curated Royal Suites'}</h2>
              </div>
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div class="category-scroll-arrows">
                  <button type="button" class="cat-arrow-btn" id="btn-cat-scroll-left" title="Scroll Left" aria-label="Scroll Categories Left">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button type="button" class="cat-arrow-btn" id="btn-cat-scroll-right" title="Scroll Right" aria-label="Scroll Categories Right">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
                <a href="#shop" class="view-all-cats-link" id="home-view-all-cats">
                  ${catsSec.viewAllLinkText || 'View All Categories →'}
                </a>
              </div>
            </div>

            <div class="category-pill-grid" id="home-category-pills">
              <button type="button" class="category-pill active" data-category="all">
                <span>✨ All Suites</span>
              </button>
              ${featuredCategories.map(cat => {
                const iconMap = {
                  'Necklaces': '📿',
                  'Bridal Sets': '👑',
                  'Rings': '💍',
                  'Bangles': '🟡',
                  'Earrings': '✨',
                  'Mangalsutra': '💖',
                  'Coins & Bullion': '🪙'
                };
                const icon = iconMap[cat.id] || iconMap[cat.name] || '💎';
                return `
                  <button type="button" class="category-pill" data-category="${cat.id}" data-category-name="${cat.name}">
                    <span>${icon} ${cat.name}</span>
                  </button>
                `;
              }).join('')}
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
        <section class="bestsellers-section" id="bestsellers-section">
          <div class="container">
            <div class="bestsellers-header-block">
              <div class="hero-badge bestsellers-badge">${bestSec.badgeText || 'Timeless Icons'}</div>
              <h2 class="bestsellers-title">${bestSec.heading || 'Crown Jewels & Bestsellers'}</h2>
              <p class="bestsellers-subhead">
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

  // 5. Live Gold Price Estimator (Authentic Luxury Calculator Device)
  if (calcSec.enabled !== false) {
    sections.push({
      id: 'calculator',
      order: calcSec.order ?? 5,
      html: `
        <section id="gold-calculator-section" style="padding: 3.5rem 0 4.5rem; background: radial-gradient(circle at center, rgba(212, 175, 55, 0.09) 0%, var(--bg-main) 75%); border-top: 1px solid var(--border-gold); border-bottom: 1px solid var(--border-gold);">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 2rem;">
              <span class="ticker-badge" style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">${calcSec.badgeText || 'TRANSPARENCY GUARANTEE'}</span>
              <h2 style="font-size: 2.2rem; margin: 0.6rem 0 0.5rem 0;" class="text-gold-gradient">${calcSec.heading || 'Live Gold & Jewellery Price Estimator'}</h2>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">${calcSec.subheading || 'Calculate exact price based on today\'s official bullion rate, gold weight & making charges with 0% hidden fees.'}</p>
            </div>

            <!-- Authentic Luxury Calculator Chassis with Step Navigation -->
            <div class="luxury-calc-device" id="vaishu-calc-device">
              <!-- Top Device Brand & Solar Bar -->
              <div class="calc-device-header">
                <div class="calc-brand-stamp">
                  <span>👑</span>
                  <span>VAISHU ROYALE ESTIMATOR</span>
                </div>
                <div class="calc-solar-strip">
                  <div class="calc-solar-cells">
                    <span class="calc-solar-cell"></span>
                    <span class="calc-solar-cell"></span>
                    <span class="calc-solar-cell"></span>
                    <span class="calc-solar-cell"></span>
                    <span class="calc-solar-cell"></span>
                    <span class="calc-solar-cell"></span>
                  </div>
                  <span>LIVE MCX BULLION FEED</span>
                </div>
              </div>

              <!-- Step Progress Navigation Tabs (Step 1, 2, 3, 4) -->
              <div class="calc-steps-nav" id="calc-steps-nav">
                <button type="button" class="calc-step-tab active" data-step="1" id="calc-tab-1">
                  <span class="calc-step-badge">1</span>
                  <span class="calc-step-title">Metal & Purity</span>
                </button>
                <div class="calc-step-connector" id="calc-conn-1"></div>
                <button type="button" class="calc-step-tab" data-step="2" id="calc-tab-2">
                  <span class="calc-step-badge">2</span>
                  <span class="calc-step-title">Gold Weight</span>
                </button>
                <div class="calc-step-connector" id="calc-conn-2"></div>
                <button type="button" class="calc-step-tab" data-step="3" id="calc-tab-3">
                  <span class="calc-step-badge">3</span>
                  <span class="calc-step-title">Making (%)</span>
                </button>
                <div class="calc-step-connector" id="calc-conn-3"></div>
                <button type="button" class="calc-step-tab" data-step="4" id="calc-tab-4">
                  <span class="calc-step-badge">4</span>
                  <span class="calc-step-title">Final Estimate</span>
                </button>
              </div>

              <!-- Realtime Mini Status Bar (Visible during steps 1, 2, 3) -->
              <div class="calc-mini-live-bar" id="calc-mini-live-bar">
                <div class="mini-live-left">
                  <span class="mini-pulse-dot">●</span>
                  <span class="mini-tag" id="mini-live-karat">22K Gold (916)</span>
                  <span class="mini-sep">•</span>
                  <span class="mini-tag" id="mini-live-weight">25.0g</span>
                  <span class="mini-sep">•</span>
                  <span class="mini-tag" id="mini-live-making">12% Making</span>
                </div>
                <div class="mini-live-right">
                  <span class="mini-label">Live Estimate:</span>
                  <span class="mini-price" id="mini-live-total-val">--</span>
                  <button type="button" class="mini-view-btn" id="btn-quick-view-quote">Review Quote →</button>
                </div>
              </div>

              <!-- STEP 1: SELECT PRECIOUS METAL & KARAT PURITY -->
              <div class="calc-step-pane active" id="calc-step-pane-1" data-pane="1">
                <div class="calc-pane-heading">
                  <div class="calc-pane-badge">STEP 1 OF 4</div>
                  <h3 class="calc-pane-title">Select Precious Metal & Karat Purity</h3>
                  <p class="calc-pane-desc">Choose certified BIS 916 hallmarked gold, investment pure bullion, or platinum according to today's live MCX bullion rates.</p>
                </div>

                <div class="calc-purity-cards-grid" id="calc-purity-btn-group">
                  <!-- 22K (916 BIS) -->
                  <div class="metal-purity-card active" data-karat="22K (916 BIS)" data-rate="${liveRates.gold22k}">
                    <div class="metal-card-top">
                      <span class="metal-symbol">🏅</span>
                      <span class="metal-karat-tag">POPULAR</span>
                    </div>
                    <div class="metal-name">22K Gold (916 BIS)</div>
                    <div class="metal-rate-display">₹${liveRates.gold22k}<span>/g</span></div>
                    <div class="metal-subtext">91.6% Pure • Bridal & Heirlooms</div>
                    <div class="metal-select-indicator">✓ Selected</div>
                  </div>

                  <!-- 24K (999 Pure) -->
                  <div class="metal-purity-card" data-karat="24K (999 Pure)" data-rate="${liveRates.gold24k}">
                    <div class="metal-card-top">
                      <span class="metal-symbol">✨</span>
                      <span class="metal-karat-tag">BULLION</span>
                    </div>
                    <div class="metal-name">24K Pure Gold (999)</div>
                    <div class="metal-rate-display">₹${liveRates.gold24k}<span>/g</span></div>
                    <div class="metal-subtext">99.9% Pure • Coins & Bars</div>
                    <div class="metal-select-indicator">Select</div>
                  </div>

                  <!-- 18K (750 BIS) -->
                  <div class="metal-purity-card" data-karat="18K (750 BIS)" data-rate="${liveRates.gold18k}">
                    <div class="metal-card-top">
                      <span class="metal-symbol">💎</span>
                      <span class="metal-karat-tag">SOLITAIRE</span>
                    </div>
                    <div class="metal-name">18K Gold (750 BIS)</div>
                    <div class="metal-rate-display">₹${liveRates.gold18k}<span>/g</span></div>
                    <div class="metal-subtext">75% Pure • Diamond Jewellery</div>
                    <div class="metal-select-indicator">Select</div>
                  </div>

                  <!-- Platinum Pt950 -->
                  <div class="metal-purity-card" data-karat="Platinum Pt950" data-rate="${liveRates.platinum}">
                    <div class="metal-card-top">
                      <span class="metal-symbol">🛡️</span>
                      <span class="metal-karat-tag">PLATINUM</span>
                    </div>
                    <div class="metal-name">Platinum Pt 950</div>
                    <div class="metal-rate-display">₹${liveRates.platinum}<span>/g</span></div>
                    <div class="metal-subtext">95% Pure • Rings & Bands</div>
                    <div class="metal-select-indicator">Select</div>
                  </div>

                  <!-- Silver 999 -->
                  <div class="metal-purity-card" data-karat="Silver 999" data-rate="${liveRates.silver}">
                    <div class="metal-card-top">
                      <span class="metal-symbol">🪙</span>
                      <span class="metal-karat-tag">SILVER</span>
                    </div>
                    <div class="metal-name">Silver 999 Pure</div>
                    <div class="metal-rate-display">₹${liveRates.silver}<span>/g</span></div>
                    <div class="metal-subtext">99.9% Pure • Utensils & Coins</div>
                    <div class="metal-select-indicator">Select</div>
                  </div>
                </div>

                <div class="calc-pane-nav">
                  <div class="step-summary-chip" id="step1-selected-summary">
                    Selected: <strong>22K Gold (916 BIS)</strong> @ ₹${liveRates.gold22k}/g
                  </div>
                  <button type="button" class="btn btn-gold btn-step-nav" id="btn-step1-next">
                    <span>Proceed to Step 2: Weight</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <!-- STEP 2: ENTER WEIGHT IN GRAMS -->
              <div class="calc-step-pane" id="calc-step-pane-2" data-pane="2" style="display: none;">
                <div class="calc-pane-heading">
                  <div class="calc-pane-badge">STEP 2 OF 4</div>
                  <h3 class="calc-pane-title">Enter Jewellery Weight (in Grams)</h3>
                  <p class="calc-pane-desc">Adjust the exact ornament weight using steppers, manual entry, or quick heirloom weight presets.</p>
                </div>

                <div class="calc-weight-panel-v2">
                  <div class="calc-stepper-row-v2">
                    <button type="button" class="calc-step-btn-v2" id="btn-weight-minus" aria-label="Decrease weight">−</button>
                    <div class="calc-input-wrapper">
                      <input type="number" class="calc-number-input-v2" id="calc-weight" value="25" min="0.1" max="1000" step="0.5" />
                      <span class="calc-input-unit">GRAMS</span>
                    </div>
                    <button type="button" class="calc-step-btn-v2" id="btn-weight-plus" aria-label="Increase weight">+</button>
                  </div>

                  <!-- Quick Add Increment Presets -->
                  <div class="calc-preset-group">
                    <span class="calc-preset-label">Quick Add Grams:</span>
                    <div class="calc-preset-strip">
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="1">+1g</button>
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="5">+5g</button>
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="8">+8g (1 Pavan)</button>
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="10">+10g (1 Tola)</button>
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="25">+25g</button>
                      <button type="button" class="calc-btn-preset-v2" data-add-weight="50">+50g</button>
                      <button type="button" class="calc-btn-preset-v2" data-set-weight="100">100g Bar</button>
                      <button type="button" class="calc-btn-preset-v2 btn-reset-wt" id="btn-calc-ac">Reset (0g)</button>
                    </div>
                  </div>

                  <!-- Typical Jewellery Category Weight Guidelines -->
                  <div class="calc-guide-group">
                    <span class="calc-preset-label">Typical Heirloom Weights (Click to pick):</span>
                    <div class="ornament-guide-chips">
                      <button type="button" class="ornament-chip" data-set-weight="4">
                        <span>💍 Solitaire Ring</span>
                        <strong>~4g</strong>
                      </button>
                      <button type="button" class="ornament-chip" data-set-weight="12">
                        <span>✨ Drops / Jhumkas</span>
                        <strong>~12g</strong>
                      </button>
                      <button type="button" class="ornament-chip" data-set-weight="18">
                        <span>📿 Classic Chain</span>
                        <strong>~18g</strong>
                      </button>
                      <button type="button" class="ornament-chip" data-set-weight="35">
                        <span>🟡 Antique Kadas (Pair)</span>
                        <strong>~35g</strong>
                      </button>
                      <button type="button" class="ornament-chip" data-set-weight="85">
                        <span>👑 Grand Bridal Haar</span>
                        <strong>~85g</strong>
                      </button>
                    </div>
                  </div>

                  <!-- Live Step 2 Preview -->
                  <div class="step-live-stat-box">
                    <div>
                      <div class="step-stat-label">Net Raw Bullion Metal Value</div>
                      <div class="step-stat-sub">Gold Weight × Prevailing Live Karat Rate</div>
                    </div>
                    <div class="step-stat-value text-gold-gradient" id="step2-metal-preview">₹0</div>
                  </div>
                </div>

                <div class="calc-pane-nav">
                  <button type="button" class="btn btn-outline-gold btn-step-nav" id="btn-step2-prev">
                    <span>← Back to Step 1</span>
                  </button>
                  <button type="button" class="btn btn-gold btn-step-nav" id="btn-step2-next">
                    <span>Proceed to Step 3: Making (%)</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <!-- STEP 3: MAKING CHARGES & ARTISAN CRAFTSMANSHIP -->
              <div class="calc-step-pane" id="calc-step-pane-3" data-pane="3" style="display: none;">
                <div class="calc-pane-heading">
                  <div class="calc-pane-badge">STEP 3 OF 4</div>
                  <h3 class="calc-pane-title">Select Making Charges (Craftsmanship %)</h3>
                  <p class="calc-pane-desc">Making charges cover handcrafted goldsmith artisan labor, hallmarking, and intricate stone setting with 100% transparency.</p>
                </div>

                <div class="calc-making-cards-grid">
                  <div class="making-preset-card" data-set-making="6">
                    <div class="making-card-rate">6%</div>
                    <div class="making-card-title">Coins & Bullion</div>
                    <div class="making-card-desc">Machine-minted 24K pure bars</div>
                  </div>

                  <div class="making-preset-card" data-set-making="10">
                    <div class="making-card-rate">10%</div>
                    <div class="making-card-title">Chains & Daily Wear</div>
                    <div class="making-card-desc">Minimalist sleek daily jewellery</div>
                  </div>

                  <div class="making-preset-card active" data-set-making="12">
                    <div class="making-card-rate">12%</div>
                    <div class="making-card-title">Rings & Pendants</div>
                    <div class="making-card-desc">Hand-finished solitaire settings</div>
                  </div>

                  <div class="making-preset-card" data-set-making="14">
                    <div class="making-card-rate">14%</div>
                    <div class="making-card-title">Bridal Suites</div>
                    <div class="making-card-desc">Multi-strand wedding chokers</div>
                  </div>

                  <div class="making-preset-card" data-set-making="18">
                    <div class="making-card-rate">18%</div>
                    <div class="making-card-title">Antique & Temple</div>
                    <div class="making-card-desc">Master artisan heritage Nakshi</div>
                  </div>
                </div>

                <!-- Custom Making Charge Input / Slider -->
                <div class="custom-making-control-box">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                    <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Custom Making Percentage:</span>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <input type="number" class="calc-making-input" id="calc-making" value="12" min="2" max="35" step="0.5" />
                      <span style="font-weight: 700; color: var(--gold-bright);">%</span>
                    </div>
                  </div>
                  <input type="range" class="calc-making-slider" id="calc-making-range" min="2" max="30" step="0.5" value="12" />
                  <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">
                    <span>2% (Min Bullion)</span>
                    <span>12% (Standard)</span>
                    <span>30% (Heritage Masterpiece)</span>
                  </div>
                </div>

                <!-- Step 3 Live Stat -->
                <div class="step-live-stat-box">
                  <div>
                    <div class="step-stat-label">Calculated Making / Artisan Labor Cost</div>
                    <div class="step-stat-sub">Percentage of net raw metal value</div>
                  </div>
                  <div class="step-stat-value text-gold-gradient" id="step3-making-preview">₹0</div>
                </div>

                <div class="calc-pane-nav">
                  <button type="button" class="btn btn-outline-gold btn-step-nav" id="btn-step3-prev">
                    <span>← Back to Step 2</span>
                  </button>
                  <button type="button" class="btn btn-gold btn-step-nav" id="btn-step3-next">
                    <span>Calculate Final Quote (Step 4) →</span>
                  </button>
                </div>
              </div>

              <!-- STEP 4: FINAL ESTIMATE & OFFICIAL INVOICE BREAKDOWN -->
              <div class="calc-step-pane" id="calc-step-pane-4" data-pane="4" style="display: none;">
                <div class="calc-pane-heading">
                  <div class="calc-pane-badge calc-step4-highlight-badge">
                    <span class="step-badge-star">✦</span> VAISHU ROYALE ESTIMATOR • STEP 4 OF 4
                  </div>
                  <h3 class="calc-pane-title calc-step4-title">Official Bullion Estimate & Transparent Bill</h3>
                  <p class="calc-pane-desc calc-step4-desc">
                    <span class="bis-norm-seal">⚖️ BIS & MCA NORMS</span> Detailed itemized pricing calculation as per Bureau of Indian Standards (BIS) & Ministry of Consumer Affairs norms.
                  </p>
                </div>

                <!-- High-Resolution Digital Glowing LCD Screen with High-Contrast Luxury Highlights -->
                <div class="calc-lcd-screen calc-lcd-screen-featured">
                  <div class="calc-lcd-glow-accent"></div>
                  
                  <!-- Highlighted Equation & Live Rate Bar -->
                  <div class="calc-equation-bar">
                    <div class="calc-equation-chip">
                      <span class="calc-equation-icon">📐</span>
                      <span id="calc-display-equation" class="calc-equation-formula">25.0g × ₹${liveRates.gold22k}/g (22K) + 12% Making + 3% GST</span>
                    </div>
                    <div class="calc-live-bis-badge">
                      <span class="live-bis-beacon"></span>
                      <span class="live-bis-text">● LIVE BIS RATE</span>
                    </div>
                  </div>

                  <!-- Highlighted Grand Total Box -->
                  <div class="calc-grand-display calc-grand-display-prominent">
                    <div class="calc-grand-text-group">
                      <div class="calc-grand-label-highlighted">
                        <span class="calc-crown-marker">👑</span>
                        <span class="calc-grand-label-text">Grand Total (Net Metal + Making + 3% GST)</span>
                      </div>
                      <div class="calc-hallmark-insurance-pill">
                        <span class="pill-shield-icon">🛡️</span>
                        <span class="pill-text-content">BIS 916 Hallmark & Transit Insurance Included</span>
                        <span class="pill-sparkle">✦</span>
                      </div>
                    </div>
                    <div class="calc-grand-price-box">
                      <div class="calc-grand-value" id="calc-result-price">₹0</div>
                      <div class="calc-grand-guarantee-tag">Official Guaranteed Net Payable</div>
                    </div>
                  </div>

                  <!-- Itemized Breakdown Chips with Enhanced Glow -->
                  <div class="calc-breakdown-chips">
                    <div class="calc-chip calc-chip-enhanced">
                      <div class="calc-chip-label">1. Raw Metal Cost</div>
                      <div class="calc-chip-val" id="chip-metal-cost">₹0</div>
                    </div>
                    <div class="calc-chip calc-chip-enhanced">
                      <div class="calc-chip-label">2. Making Charges</div>
                      <div class="calc-chip-val" id="chip-making-cost">₹0</div>
                    </div>
                    <div class="calc-chip calc-chip-enhanced">
                      <div class="calc-chip-label">3. 3% Govt GST</div>
                      <div class="calc-chip-val" id="chip-gst-cost">₹0</div>
                    </div>
                    <div class="calc-chip calc-chip-enhanced">
                      <div class="calc-chip-label">4. Official Rate</div>
                      <div class="calc-chip-val" id="chip-rate-cost">₹${liveRates.gold22k}/g</div>
                    </div>
                  </div>
                </div>

                <!-- Transparent Summary Table -->
                <div class="calc-bill-table">
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Precious Metal & Purity</span>
                    <span class="bill-cell-val" id="bill-metal-val">22K Gold (916 BIS)</span>
                  </div>
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Gross Weight</span>
                    <span class="bill-cell-val" id="bill-weight-val">25.0 Grams</span>
                  </div>
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Live Bullion Rate per Gram</span>
                    <span class="bill-cell-val" id="bill-rate-val">₹${liveRates.gold22k}/g</span>
                  </div>
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Net Raw Metal Cost</span>
                    <span class="bill-cell-val" id="bill-metal-cost-val">₹0</span>
                  </div>
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Craftsmanship Making Charges (<span id="bill-making-pct">12%</span>)</span>
                    <span class="bill-cell-val" id="bill-making-cost-val">₹0</span>
                  </div>
                  <div class="bill-row">
                    <span class="bill-cell-lbl">Statutory 3% GST (Central + State)</span>
                    <span class="bill-cell-val" id="bill-gst-val">₹0</span>
                  </div>
                  <div class="bill-row bill-row-total">
                    <span class="bill-cell-lbl" style="font-weight: 800; color: var(--text-main);">ESTIMATED NET PAYABLE</span>
                    <span class="bill-cell-val" id="bill-total-val" style="font-weight: 800; color: var(--gold-bright); font-size: 1.15rem;">₹0</span>
                  </div>
                </div>

                <!-- Quick Actions Grid -->
                <div class="calc-final-actions">
                  <button type="button" class="btn btn-outline-gold" id="btn-calc-quote" style="flex: 1; padding: 0.85rem;">
                    <span>📋 Copy Official Quote</span>
                  </button>
                  <a href="#shop" class="btn btn-gold" style="flex: 1.2; padding: 0.85rem; text-align: center; justify-content: center;">
                    <span>🛍️ Browse Matching Jewellery in Vault →</span>
                  </a>
                </div>

                <div class="calc-pane-nav" style="margin-top: 1.25rem;">
                  <button type="button" class="btn btn-outline-gold btn-step-nav" id="btn-step4-prev">
                    <span>← Modify Making Charges</span>
                  </button>
                  <button type="button" class="btn-text-link" id="btn-calc-restart" style="color: var(--gold-bright); font-size: 0.85rem; cursor: pointer; background: none; border: none; text-decoration: underline;">
                    🔄 Start New Calculation (Step 1)
                  </button>
                </div>
              </div>
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
        <section id="bridal-section" class="bridal-section">
          <div class="container">
            <div class="bridal-showcase-card">
              <div class="bridal-showcase-content">
                <div class="hero-badge bridal-badge">
                  <span class="bridal-sparkle">✦</span>
                  <span>${bridalSec.badgeText || 'Maharani Bridal Suite'}</span>
                </div>
                <h2 class="bridal-showcase-title">
                  ${bridalSec.heading || 'Bespoke Wedding Jewellery for the Royal Indian Bride'}
                </h2>
                <p class="bridal-showcase-desc">
                  ${bridalSec.subheading || 'Crafted over 300 artisan hours with uncut syndicate polki, Burmese rubies, and Colombian emeralds set in solid 22K hallmarked gold.'}
                </p>
                <div class="bridal-cta-wrap">
                  <a href="${bridalSec.ctaLink || '#bridal'}" class="btn btn-gold bridal-cta-btn">
                    <span>${bridalSec.ctaText || 'Book a Bridal Concierge Appointment'}</span>
                    <span class="bridal-arrow">→</span>
                  </a>
                </div>
              </div>
              <div class="bridal-image-wrap">
                <img src="${bridalImg}" alt="Vaishu Bridal Set" class="bridal-showcase-img" />
                <div class="bridal-floating-tag">
                  <span class="bridal-tag-icon">👑</span>
                  <div>
                    <div class="bridal-tag-title">Imperial Couture Suite</div>
                    <div class="bridal-tag-sub">BIS 916 & Syndicate Polki</div>
                  </div>
                </div>
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

  // Category Pill Filter Interactions (Stay on Homepage & filter showcase dynamically)
  const categoryPills = document.querySelectorAll('#home-category-pills .category-pill');
  let hasDragged = false;

  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      if (hasDragged) {
        hasDragged = false;
        return;
      }
      
      // Update active pill styling
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCatId = pill.getAttribute('data-category');
      const selectedCatName = pill.getAttribute('data-category-name');

      let filteredList = [];
      if (selectedCatId === 'all') {
        filteredList = bestsellers;
      } else {
        filteredList = allProducts.filter(p => 
          p.category === selectedCatName || 
          p.category === selectedCatId || 
          (p.categoryId && p.categoryId === selectedCatId)
        );
        // Fallback fuzzy search if strict match is empty
        if (filteredList.length === 0) {
          filteredList = allProducts.filter(p => 
            p.category?.toLowerCase().includes(selectedCatName?.toLowerCase() || '') ||
            p.name?.toLowerCase().includes(selectedCatName?.toLowerCase() || '')
          );
        }
      }

      if (bestsellersGrid) {
        if (filteredList.length > 0) {
          bestsellersGrid.innerHTML = filteredList.map(p => renderProductCard(p)).join('');
          attachProductCardEvents(bestsellersGrid, allProducts, onOpenQuickView);
        } else {
          bestsellersGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border-gold); border-radius: var(--radius-md);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">💎</div>
              <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.5rem;">Ornaments in ${selectedCatName || 'Category'}</h4>
              <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">Browse all our exclusive hand-crafted pieces in this suite.</p>
              <a href="#shop" class="btn btn-gold" style="display: inline-flex;">View in Royal Catalog →</a>
            </div>
          `;
        }
      }
    });
  });

  // View All Categories Link -> Navigates to full Catalog page and scrolls to top
  const viewAllLink = document.getElementById('home-view-all-cats');
  viewAllLink?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Category Scroll Buttons (Smooth Horizontal Navigation)
  const categoryPillsGrid = document.getElementById('home-category-pills');
  const btnScrollLeft = document.getElementById('btn-cat-scroll-left');
  const btnScrollRight = document.getElementById('btn-cat-scroll-right');

  btnScrollLeft?.addEventListener('click', () => {
    categoryPillsGrid?.scrollBy({ left: -260, behavior: 'smooth' });
  });

  btnScrollRight?.addEventListener('click', () => {
    categoryPillsGrid?.scrollBy({ left: 260, behavior: 'smooth' });
  });

  // Mouse Wheel Horizontal Scroll & Drag-to-Scroll on Desktop/Laptop
  if (categoryPillsGrid) {
    categoryPillsGrid.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) === 0 && Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        categoryPillsGrid.scrollLeft += e.deltaY * 0.8;
      }
    }, { passive: false });

    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;

    categoryPillsGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      categoryPillsGrid.classList.add('dragging');
      startX = e.pageX - categoryPillsGrid.offsetLeft;
      scrollLeftPos = categoryPillsGrid.scrollLeft;
    });

    categoryPillsGrid.addEventListener('mouseleave', () => {
      isDown = false;
      categoryPillsGrid.classList.remove('dragging');
    });

    categoryPillsGrid.addEventListener('mouseup', () => {
      isDown = false;
      categoryPillsGrid.classList.remove('dragging');
    });

    categoryPillsGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - categoryPillsGrid.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) {
        hasDragged = true;
      }
      categoryPillsGrid.scrollLeft = scrollLeftPos - walk;
    });
  }

  // =============================================================
  // Interactive Luxury Step-by-Step Calculator Logic
  // =============================================================
  const calcWeight = document.getElementById('calc-weight');
  const calcMaking = document.getElementById('calc-making');
  const calcMakingRange = document.getElementById('calc-making-range');
  const calcResultPrice = document.getElementById('calc-result-price');
  const calcDisplayEquation = document.getElementById('calc-display-equation');
  const chipMetalCost = document.getElementById('chip-metal-cost');
  const chipMakingCost = document.getElementById('chip-making-cost');
  const chipGstCost = document.getElementById('chip-gst-cost');
  const chipRateCost = document.getElementById('chip-rate-cost');
  const calcMiniLiveBar = document.getElementById('calc-mini-live-bar');

  // Step Tabs and Panes
  const stepTabs = document.querySelectorAll('.calc-step-tab');
  const stepPanes = document.querySelectorAll('.calc-step-pane');
  const metalCards = document.querySelectorAll('.metal-purity-card');
  const makingCards = document.querySelectorAll('.making-preset-card');

  let currentKarat = '22K (916 BIS)';
  let activeStep = 1;

  if (calcWeight && calcMaking) {
    const updateCalculator = () => {
      const weight = parseFloat(calcWeight.value) || 0;
      const making = parseFloat(calcMaking.value) || 0;
      const breakdown = calculateItemBreakdown(weight, currentKarat, making);

      // 1. LCD Screen & Grand Value
      if (calcResultPrice) calcResultPrice.textContent = formatINR(breakdown.total);
      if (chipMetalCost) chipMetalCost.textContent = formatINR(breakdown.rawMetalPrice);
      if (chipMakingCost) chipMakingCost.textContent = formatINR(breakdown.makingCharges);
      if (chipGstCost) chipGstCost.textContent = formatINR(breakdown.gst);
      if (chipRateCost) chipRateCost.textContent = `₹${breakdown.baseRatePerGram}/g`;

      if (calcDisplayEquation) {
        calcDisplayEquation.textContent = `${weight.toFixed(1)}g × ₹${breakdown.baseRatePerGram}/g (${currentKarat.split(' ')[0]}) + ${making}% Making + 3% GST`;
      }

      // 2. Mini Live Status Bar (Steps 1, 2, 3)
      const miniTotalVal = document.getElementById('mini-live-total-val');
      const miniKarat = document.getElementById('mini-live-karat');
      const miniWeight = document.getElementById('mini-live-weight');
      const miniMaking = document.getElementById('mini-live-making');
      if (miniTotalVal) miniTotalVal.textContent = formatINR(breakdown.total);
      if (miniKarat) miniKarat.textContent = currentKarat;
      if (miniWeight) miniWeight.textContent = `${weight.toFixed(1)}g`;
      if (miniMaking) miniMaking.textContent = `${making}% Making`;

      // 3. Step 1 Summary Chip
      const step1Summary = document.getElementById('step1-selected-summary');
      if (step1Summary) {
        step1Summary.innerHTML = `Selected: <strong>${currentKarat}</strong> @ ₹${breakdown.baseRatePerGram}/g`;
      }

      // 4. Step 2 Live Metal Value Preview
      const step2MetalPreview = document.getElementById('step2-metal-preview');
      if (step2MetalPreview) {
        step2MetalPreview.textContent = formatINR(breakdown.rawMetalPrice);
      }

      // 5. Step 3 Live Making Charges Preview
      const step3MakingPreview = document.getElementById('step3-making-preview');
      if (step3MakingPreview) {
        step3MakingPreview.textContent = formatINR(breakdown.makingCharges);
      }

      // 6. Step 4 Itemized Bill Table
      const billMetal = document.getElementById('bill-metal-val');
      const billWeight = document.getElementById('bill-weight-val');
      const billRate = document.getElementById('bill-rate-val');
      const billMetalCost = document.getElementById('bill-metal-cost-val');
      const billMakingPct = document.getElementById('bill-making-pct');
      const billMakingCost = document.getElementById('bill-making-cost-val');
      const billGst = document.getElementById('bill-gst-val');
      const billTotal = document.getElementById('bill-total-val');

      if (billMetal) billMetal.textContent = currentKarat;
      if (billWeight) billWeight.textContent = `${weight.toFixed(1)} Grams`;
      if (billRate) billRate.textContent = `₹${breakdown.baseRatePerGram}/g`;
      if (billMetalCost) billMetalCost.textContent = formatINR(breakdown.rawMetalPrice);
      if (billMakingPct) billMakingPct.textContent = `${making}%`;
      if (billMakingCost) billMakingCost.textContent = formatINR(breakdown.makingCharges);
      if (billGst) billGst.textContent = formatINR(breakdown.gst);
      if (billTotal) billTotal.textContent = formatINR(breakdown.total);
    };

    // Step Navigation Function
    const goToStep = (stepNum) => {
      activeStep = Math.max(1, Math.min(4, stepNum));

      // Update Tab Headers
      stepTabs.forEach(tab => {
        const tabStep = parseInt(tab.getAttribute('data-step'), 10);
        const badge = tab.querySelector('.calc-step-badge');
        tab.classList.remove('active', 'completed');

        if (tabStep === activeStep) {
          tab.classList.add('active');
          if (badge) badge.textContent = tabStep;
        } else if (tabStep < activeStep) {
          tab.classList.add('completed');
          if (badge) badge.textContent = '✓';
        } else {
          if (badge) badge.textContent = tabStep;
        }
      });

      // Update Step Connectors
      for (let i = 1; i <= 3; i++) {
        const conn = document.getElementById(`calc-conn-${i}`);
        if (conn) {
          if (activeStep > i) {
            conn.classList.add('completed');
          } else {
            conn.classList.remove('completed');
          }
        }
      }

      // Toggle Panes
      stepPanes.forEach(pane => {
        const paneStep = parseInt(pane.getAttribute('data-pane'), 10);
        if (paneStep === activeStep) {
          pane.style.display = 'block';
          pane.classList.add('active');
        } else {
          pane.style.display = 'none';
          pane.classList.remove('active');
        }
      });

      // Hide Mini Live Bar on Step 4 (Since Step 4 already has full grand LCD)
      if (calcMiniLiveBar) {
        calcMiniLiveBar.style.display = activeStep === 4 ? 'none' : 'flex';
      }

      // Smooth scroll if needed
      const device = document.getElementById('vaishu-calc-device');
      if (device && window.innerWidth < 768) {
        const rect = device.getBoundingClientRect();
        if (rect.top < 0 || rect.top > 300) {
          device.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    // Tab Header Clicks
    stepTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stepNum = parseInt(tab.getAttribute('data-step'), 10);
        if (!isNaN(stepNum)) goToStep(stepNum);
      });
    });

    // Step 1 Navigation Buttons
    document.getElementById('btn-step1-next')?.addEventListener('click', () => goToStep(2));

    // Step 2 Navigation Buttons
    document.getElementById('btn-step2-prev')?.addEventListener('click', () => goToStep(1));
    document.getElementById('btn-step2-next')?.addEventListener('click', () => goToStep(3));

    // Step 3 Navigation Buttons
    document.getElementById('btn-step3-prev')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btn-step3-next')?.addEventListener('click', () => goToStep(4));

    // Step 4 Navigation Buttons
    document.getElementById('btn-step4-prev')?.addEventListener('click', () => goToStep(3));
    document.getElementById('btn-calc-restart')?.addEventListener('click', () => {
      calcWeight.value = '25';
      calcMaking.value = '12';
      if (calcMakingRange) calcMakingRange.value = '12';
      goToStep(1);
      updateCalculator();
    });
    document.getElementById('btn-quick-view-quote')?.addEventListener('click', () => goToStep(4));

    // Step 1 Metal Card Selection
    metalCards.forEach(card => {
      card.addEventListener('click', () => {
        metalCards.forEach(c => {
          c.classList.remove('active');
          const ind = c.querySelector('.metal-select-indicator');
          if (ind) ind.textContent = 'Select';
        });

        card.classList.add('active');
        const selInd = card.querySelector('.metal-select-indicator');
        if (selInd) selInd.textContent = '✓ Selected';

        currentKarat = card.getAttribute('data-karat') || '22K (916 BIS)';
        updateCalculator();
      });
    });

    // Step 2 Weight Steppers
    document.getElementById('btn-weight-minus')?.addEventListener('click', () => {
      let w = parseFloat(calcWeight.value) || 0;
      if (w > 0.5) {
        calcWeight.value = (w - 0.5).toFixed(1);
        updateCalculator();
      }
    });

    document.getElementById('btn-weight-plus')?.addEventListener('click', () => {
      let w = parseFloat(calcWeight.value) || 0;
      calcWeight.value = (w + 0.5).toFixed(1);
      updateCalculator();
    });

    // Step 2 Quick Add Presets
    document.querySelectorAll('[data-add-weight]').forEach(btn => {
      btn.addEventListener('click', () => {
        const add = parseFloat(btn.getAttribute('data-add-weight')) || 0;
        let w = parseFloat(calcWeight.value) || 0;
        calcWeight.value = (w + add).toFixed(1);
        updateCalculator();
      });
    });

    // Step 2 Quick Set Presets & Ornament Guide Chips
    document.querySelectorAll('[data-set-weight]').forEach(btn => {
      btn.addEventListener('click', () => {
        calcWeight.value = btn.getAttribute('data-set-weight');
        updateCalculator();
      });
    });

    // Step 2 Reset Weight
    document.getElementById('btn-calc-ac')?.addEventListener('click', () => {
      calcWeight.value = '0';
      updateCalculator();
    });

    // Step 3 Making Preset Cards
    makingCards.forEach(card => {
      card.addEventListener('click', () => {
        makingCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const val = card.getAttribute('data-set-making') || '12';
        calcMaking.value = val;
        if (calcMakingRange) calcMakingRange.value = val;
        updateCalculator();
      });
    });

    // Step 3 Making Range Slider & Number Input Sync
    calcMakingRange?.addEventListener('input', (e) => {
      calcMaking.value = e.target.value;
      makingCards.forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-set-making') === e.target.value);
      });
      updateCalculator();
    });

    calcMaking?.addEventListener('input', (e) => {
      if (calcMakingRange) calcMakingRange.value = e.target.value;
      makingCards.forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-set-making') === e.target.value);
      });
      updateCalculator();
    });

    // Step 4 Copy Quote Action
    document.getElementById('btn-calc-quote')?.addEventListener('click', () => {
      const weight = parseFloat(calcWeight.value) || 0;
      const making = parseFloat(calcMaking.value) || 0;
      const breakdown = calculateItemBreakdown(weight, currentKarat, making);
      const quoteText = `👑 VAISHU JEWELLERY - Official Bullion Estimate Quote\n• Metal: ${currentKarat} @ ₹${breakdown.baseRatePerGram}/g\n• Weight: ${weight} grams\n• Metal Cost: ${formatINR(breakdown.rawMetalPrice)}\n• Making Charge (${making}%): ${formatINR(breakdown.makingCharges)}\n• 3% GST: ${formatINR(breakdown.gst)}\n------------------------\nESTIMATED GRAND TOTAL: ${formatINR(breakdown.total)}\n(Certified BIS 916 Hallmark / IGI Diamonds)\nDate: ${new Date().toLocaleDateString('en-IN')}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(quoteText).then(() => {
          alert('✓ Official Jewellery Estimate Quote copied to clipboard!\n\n' + quoteText);
        });
      } else {
        alert(quoteText);
      }
    });

    calcWeight.addEventListener('input', updateCalculator);

    // Initial Calculation
    updateCalculator();
  }
}
