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

  // 5. Live Gold Price Estimator (Authentic Luxury Calculator Device)
  if (calcSec.enabled !== false) {
    sections.push({
      id: 'calculator',
      order: calcSec.order ?? 5,
      html: `
        <section id="gold-calculator-section" style="padding: 4rem 0 5rem; background: radial-gradient(circle at center, rgba(212, 175, 55, 0.09) 0%, var(--bg-main) 75%); border-top: 1px solid var(--border-gold); border-bottom: 1px solid var(--border-gold);">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 2.5rem;">
              <span class="ticker-badge" style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">${calcSec.badgeText || 'TRANSPARENCY GUARANTEE'}</span>
              <h2 style="font-size: 2.2rem; margin: 0.6rem 0 0.5rem 0;" class="text-gold-gradient">${calcSec.heading || 'Live Gold & Jewellery Price Estimator'}</h2>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">${calcSec.subheading || 'Calculate exact price based on today\'s official bullion rate, gold weight & making charges with 0% hidden fees.'}</p>
            </div>

            <!-- Authentic Luxury Calculator Chassis -->
            <div class="luxury-calc-device" id="vaishu-calc-device">
              <!-- Top Device Brand & Solar Bar -->
              <div class="calc-device-header">
                <div class="calc-brand-stamp">
                  <span>👑</span>
                  <span>VAISHU ROYALE CALC-916</span>
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

              <!-- High-Resolution Digital Glowing LCD Screen -->
              <div class="calc-lcd-screen">
                <div class="calc-equation-line">
                  <span id="calc-display-equation">25.0g × ₹${liveRates.gold22k}/g (22K) + 12% Making + 3% GST</span>
                  <span style="font-size: 0.72rem; color: #34d399; font-weight: 700;">● LIVE RATE</span>
                </div>

                <div class="calc-grand-display">
                  <div class="calc-grand-label">Grand Total (Net Bullion + Making + 3% GST)</div>
                  <div class="calc-grand-value" id="calc-result-price">--</div>
                </div>

                <div class="calc-breakdown-chips">
                  <div class="calc-chip">
                    <div class="calc-chip-label">Raw Metal Cost</div>
                    <div class="calc-chip-val" id="chip-metal-cost">₹0</div>
                  </div>
                  <div class="calc-chip">
                    <div class="calc-chip-label">Making Charges</div>
                    <div class="calc-chip-val" id="chip-making-cost">₹0</div>
                  </div>
                  <div class="calc-chip">
                    <div class="calc-chip-label">3% Govt GST</div>
                    <div class="calc-chip-val" id="chip-gst-cost">₹0</div>
                  </div>
                  <div class="calc-chip">
                    <div class="calc-chip-label">Live Bullion Rate</div>
                    <div class="calc-chip-val" id="chip-rate-cost">₹${liveRates.gold22k}/g</div>
                  </div>
                </div>
              </div>

              <!-- Calculator Keypad Controls -->
              <div class="calc-keypad-grid">
                <!-- Left Panel: Purity & Weight Controls -->
                <div>
                  <!-- 1. Metal Purity Keys -->
                  <div class="calc-section-label">
                    <span>💎</span> 1. Select Precious Metal & Karat
                  </div>
                  <div class="calc-purity-buttons" id="calc-purity-btn-group">
                    <button type="button" class="calc-btn-purity active" data-karat="22K (916 BIS)" data-rate="${liveRates.gold22k}">
                      <span>22K Gold (916)</span>
                      <span class="sub-rate">₹${liveRates.gold22k}/g</span>
                    </button>
                    <button type="button" class="calc-btn-purity" data-karat="24K (999 Pure)" data-rate="${liveRates.gold24k}">
                      <span>24K Pure Gold</span>
                      <span class="sub-rate">₹${liveRates.gold24k}/g</span>
                    </button>
                    <button type="button" class="calc-btn-purity" data-karat="18K (750 BIS)" data-rate="${liveRates.gold18k}">
                      <span>18K Diamond</span>
                      <span class="sub-rate">₹${liveRates.gold18k}/g</span>
                    </button>
                    <button type="button" class="calc-btn-purity" data-karat="Platinum Pt950" data-rate="${liveRates.platinum}">
                      <span>Pt 950 Platinum</span>
                      <span class="sub-rate">₹${liveRates.platinum}/g</span>
                    </button>
                    <button type="button" class="calc-btn-purity" data-karat="Silver 999" data-rate="${liveRates.silver}">
                      <span>Silver 999</span>
                      <span class="sub-rate">₹${liveRates.silver}/g</span>
                    </button>
                  </div>

                  <!-- 2. Weight in Grams Stepper & Presets -->
                  <div class="calc-weight-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <div class="calc-section-label" style="margin: 0;">
                        <span>⚖️</span> Gold Weight (Grams)
                      </div>
                      <span style="font-size: 0.75rem; color: var(--text-muted);" id="lbl-target-input">Target: Weight</span>
                    </div>

                    <div class="calc-stepper-row">
                      <button type="button" class="calc-step-btn" id="btn-weight-minus">−</button>
                      <input type="number" class="calc-number-input" id="calc-weight" value="25" min="0.1" max="1000" step="0.5" />
                      <button type="button" class="calc-step-btn" id="btn-weight-plus">+</button>
                    </div>

                    <div class="calc-preset-strip">
                      <button type="button" class="calc-btn-preset" data-add-weight="1">+1g</button>
                      <button type="button" class="calc-btn-preset" data-add-weight="5">+5g</button>
                      <button type="button" class="calc-btn-preset" data-add-weight="10">+10g</button>
                      <button type="button" class="calc-btn-preset" data-add-weight="25">+25g</button>
                      <button type="button" class="calc-btn-preset" data-add-weight="50">+50g</button>
                      <button type="button" class="calc-btn-preset" data-set-weight="100">100g (Bar)</button>
                      <button type="button" class="calc-btn-preset" style="color: #ff6b6b;" id="btn-calc-ac">AC</button>
                    </div>
                  </div>

                  <!-- 3. Making Charges Presets -->
                  <div>
                    <div class="calc-section-label">
                      <span>⚙️</span> Making Charges (%)
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                      <input type="number" class="form-input" id="calc-making" value="12" min="2" max="35" step="0.5" style="width: 90px; text-align: center; font-weight: 700;" />
                      <div class="calc-preset-strip" style="flex: 1;">
                        <button type="button" class="calc-btn-preset" data-set-making="6">6% (Coins)</button>
                        <button type="button" class="calc-btn-preset" data-set-making="10">10% (Chains)</button>
                        <button type="button" class="calc-btn-preset" data-set-making="14">14% (Bridal)</button>
                        <button type="button" class="calc-btn-preset" data-set-making="18">18% (Temple)</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Panel: Physical Calculator Numpad & Quick Actions -->
                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div class="calc-section-label">
                      <span>🔢</span> Interactive Keypad Entry
                    </div>

                    <div class="calc-numpad-container">
                      <button type="button" class="calc-key key-fn" data-numpad="C">C</button>
                      <button type="button" class="calc-key key-fn" data-numpad="BACK">⌫</button>
                      <button type="button" class="calc-key key-fn" id="btn-toggle-input-mode">SWITCH ⇄</button>
                      <button type="button" class="calc-key key-action" id="btn-calc-compute">=</button>

                      <button type="button" class="calc-key" data-numpad="7">7</button>
                      <button type="button" class="calc-key" data-numpad="8">8</button>
                      <button type="button" class="calc-key" data-numpad="9">9</button>
                      <button type="button" class="calc-key key-fn" data-numpad="HALF">.5</button>

                      <button type="button" class="calc-key" data-numpad="4">4</button>
                      <button type="button" class="calc-key" data-numpad="5">5</button>
                      <button type="button" class="calc-key" data-numpad="6">6</button>
                      <button type="button" class="calc-key key-fn" data-numpad="DOUBLE">00</button>

                      <button type="button" class="calc-key" data-numpad="1">1</button>
                      <button type="button" class="calc-key" data-numpad="2">2</button>
                      <button type="button" class="calc-key" data-numpad="3">3</button>
                      <button type="button" class="calc-key key-action" style="font-size: 0.9rem;" id="btn-calc-quote">📋 QUOTE</button>

                      <button type="button" class="calc-key" data-numpad="0" style="grid-column: span 2;">0</button>
                      <button type="button" class="calc-key" data-numpad=".">.</button>
                      <button type="button" class="calc-key key-action" style="font-size: 0.9rem;" onclick="window.location.hash='#shop'">🛍️ SHOP</button>
                    </div>
                  </div>

                  <!-- Bottom Quick Quote Link -->
                  <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem;">
                    <a href="#shop" class="btn btn-gold" style="flex: 1; padding: 0.8rem; text-align: center; justify-content: center;">
                      <span>Browse Matching Jewellery in Vault →</span>
                    </a>
                  </div>
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

  // =============================================================
  // Interactive Luxury Calculator Logic & Event Attachments
  // =============================================================
  const calcWeight = document.getElementById('calc-weight');
  const calcMaking = document.getElementById('calc-making');
  const calcResultPrice = document.getElementById('calc-result-price');
  const calcDisplayEquation = document.getElementById('calc-display-equation');
  const chipMetalCost = document.getElementById('chip-metal-cost');
  const chipMakingCost = document.getElementById('chip-making-cost');
  const chipGstCost = document.getElementById('chip-gst-cost');
  const chipRateCost = document.getElementById('chip-rate-cost');
  const purityButtons = document.querySelectorAll('.calc-btn-purity');
  const lblTargetInput = document.getElementById('lbl-target-input');

  let currentKarat = '22K (916 BIS)';
  let activeInputTarget = 'weight'; // 'weight' | 'making'

  if (calcWeight && calcMaking && calcResultPrice) {
    const updateCalculator = () => {
      const weight = parseFloat(calcWeight.value) || 0;
      const making = parseFloat(calcMaking.value) || 0;
      const breakdown = calculateItemBreakdown(weight, currentKarat, making);

      calcResultPrice.textContent = formatINR(breakdown.total);
      if (chipMetalCost) chipMetalCost.textContent = formatINR(breakdown.rawMetalPrice);
      if (chipMakingCost) chipMakingCost.textContent = formatINR(breakdown.makingCharges);
      if (chipGstCost) chipGstCost.textContent = formatINR(breakdown.gst);
      if (chipRateCost) chipRateCost.textContent = `₹${breakdown.baseRatePerGram}/g`;

      if (calcDisplayEquation) {
        calcDisplayEquation.textContent = `${weight.toFixed(1)}g × ₹${breakdown.baseRatePerGram}/g (${currentKarat.split(' ')[0]}) + ${making}% Making + 3% GST`;
      }
    };

    // Purity Button Selection
    purityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        purityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentKarat = btn.getAttribute('data-karat') || '22K (916 BIS)';
        updateCalculator();
      });
    });

    // Steppers - / +
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

    // Weight Add Presets (+1g, +5g, etc.)
    document.querySelectorAll('[data-add-weight]').forEach(btn => {
      btn.addEventListener('click', () => {
        const add = parseFloat(btn.getAttribute('data-add-weight')) || 0;
        let w = parseFloat(calcWeight.value) || 0;
        calcWeight.value = (w + add).toFixed(1);
        updateCalculator();
      });
    });

    // Weight Set Presets (100g)
    document.querySelectorAll('[data-set-weight]').forEach(btn => {
      btn.addEventListener('click', () => {
        calcWeight.value = btn.getAttribute('data-set-weight');
        updateCalculator();
      });
    });

    // Making Presets
    document.querySelectorAll('[data-set-making]').forEach(btn => {
      btn.addEventListener('click', () => {
        calcMaking.value = btn.getAttribute('data-set-making');
        updateCalculator();
      });
    });

    // AC (All Clear)
    document.getElementById('btn-calc-ac')?.addEventListener('click', () => {
      calcWeight.value = '0';
      updateCalculator();
    });

    // Input Mode Switch
    document.getElementById('btn-toggle-input-mode')?.addEventListener('click', () => {
      activeInputTarget = activeInputTarget === 'weight' ? 'making' : 'weight';
      if (lblTargetInput) {
        lblTargetInput.textContent = `Target: ${activeInputTarget === 'weight' ? 'Weight (Grams)' : 'Making (%)'}`;
      }
      const targetEl = activeInputTarget === 'weight' ? calcWeight : calcMaking;
      targetEl?.focus();
    });

    // Focus tracking
    calcWeight.addEventListener('focus', () => {
      activeInputTarget = 'weight';
      if (lblTargetInput) lblTargetInput.textContent = 'Target: Weight (Grams)';
    });

    calcMaking.addEventListener('focus', () => {
      activeInputTarget = 'making';
      if (lblTargetInput) lblTargetInput.textContent = 'Target: Making (%)';
    });

    // Interactive Keypad Direct Numbers
    document.querySelectorAll('[data-numpad]').forEach(keyBtn => {
      keyBtn.addEventListener('click', () => {
        const char = keyBtn.getAttribute('data-numpad');
        const targetEl = activeInputTarget === 'weight' ? calcWeight : calcMaking;
        if (!targetEl) return;

        let val = targetEl.value;

        if (char === 'C') {
          targetEl.value = '0';
        } else if (char === 'BACK') {
          targetEl.value = val.length > 1 ? val.slice(0, -1) : '0';
        } else if (char === 'HALF') {
          let num = parseFloat(val) || 0;
          targetEl.value = (Math.floor(num) + 0.5).toString();
        } else if (char === 'DOUBLE') {
          targetEl.value = val === '0' ? '0' : val + '00';
        } else if (char === '.') {
          if (!val.includes('.')) targetEl.value = val + '.';
        } else {
          // Number 0-9
          if (val === '0') {
            targetEl.value = char;
          } else {
            targetEl.value = val + char;
          }
        }
        updateCalculator();
      });
    });

    document.getElementById('btn-calc-compute')?.addEventListener('click', updateCalculator);

    // Copy Quote Action
    document.getElementById('btn-calc-quote')?.addEventListener('click', () => {
      const weight = parseFloat(calcWeight.value) || 0;
      const making = parseFloat(calcMaking.value) || 0;
      const breakdown = calculateItemBreakdown(weight, currentKarat, making);
      const quoteText = `👑 VAISHU JEWELLERY - Official Bullion Estimate Quote\n• Metal: ${currentKarat} @ ₹${breakdown.baseRatePerGram}/g\n• Weight: ${weight} grams\n• Metal Cost: ${formatINR(breakdown.rawMetalPrice)}\n• Making Charge (${making}%): ${formatINR(breakdown.makingCharges)}\n• 3% GST: ${formatINR(breakdown.gst)}\n------------------------\nESTIMATED GRAND TOTAL: ${formatINR(breakdown.total)}\n(Certified BIS 916 Hallmark / IGI Diamonds)`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(quoteText).then(() => {
          alert('✓ Official Jewellery Estimate Quote copied to clipboard!\n\n' + quoteText);
        });
      } else {
        alert(quoteText);
      }
    });

    calcWeight.addEventListener('input', updateCalculator);
    calcMaking.addEventListener('input', updateCalculator);
    updateCalculator();
  }
}
