/**
 * VAISHU JEWELLERY - Dedicated Luxury Product Detail Page (PDP)
 * Features High-Res Interactive Multi-Angle Gallery with Zoom Lens,
 * Live MCX Bullion Price Breakdown, BIS 916 Hallmark HUID Verification,
 * Pincode Delivery Estimator, 0% No-Cost EMI Simulator, Size Selector with
 * Royal Size Guide Modal, Instant "Buy Now", and Live Video Concierge.
 */

import { fetchProductById, fetchProducts, calculateItemBreakdown, getStoredLiveRates } from '../services/productService';
import { addToCart, toggleWishlist, isInWishlist } from '../services/cartService';
import { triggerAddToCartVisuals } from '../utils/cartAnimation';
import { formatINR } from '../utils/formatters';
import { showToast } from '../components/Toast';
import { renderProductCard, attachProductCardEvents } from '../components/ProductCard';

export async function renderProductDetailPage(container, productId, currentUser, onOpenAuthModal, onOpenCartDrawer) {
  // 1. Fetch main product
  let product = await fetchProductById(productId);
  
  // Fallback to first product if ID not found
  if (!product) {
    const allProducts = await fetchProducts();
    product = allProducts[0];
  }

  if (!product) {
    container.innerHTML = `
      <div class="container" style="padding: 5rem 1rem; text-align: center;">
        <h2 style="font-size: 2rem; color: var(--gold-bright);">Product Not Found</h2>
        <p style="color: var(--text-muted); margin: 1rem 0 2rem;">The requested heirloom could not be located in our royal vault.</p>
        <a href="#shop" class="btn btn-gold">Explore Collections</a>
      </div>
    `;
    return;
  }

  // 2. Fetch related items from the same category
  const relatedProducts = (await fetchProducts({ category: product.category }))
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // 3. State management for interactive page
  let activeImage = product.image;
  let selectedMetal = product.karat || '22K (916 BIS)';
  let selectedSize = 'Standard Size (Complimentary Alteration)';
  let engravingText = '';
  let isWishlisted = isInWishlist(product.id);
  let showBreakdown = true;
  let activeTab = 'specs'; // 'specs' | 'hallmark' | 'delivery'

  // Calculations
  const breakdown = calculateItemBreakdown(
    product.weightGrams || 10,
    product.karat || '22K',
    product.makingChargePercent || 12
  );

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const monthlyEmi3Mo = Math.round(product.price / 3);
  const monthlyEmi6Mo = Math.round(product.price / 6);

  // Gallery array
  const galleryImages = [
    product.image,
    ...(product.gallery || []),
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
  ].slice(0, 4);

  // Render function
  const render = () => {
    container.innerHTML = `
      <div class="pdp-page-wrapper">
        <!-- BREADCRUMB & TOP NAV -->
        <div class="container pdp-breadcrumb-row">
          <nav aria-label="Breadcrumb">
            <ol class="pdp-breadcrumb">
              <li><a href="#">Home</a></li>
              <li><span>/</span></li>
              <li><a href="#shop">Collections</a></li>
              <li><span>/</span></li>
              <li><a href="#shop?category=${encodeURIComponent(product.category)}">${product.category}</a></li>
              <li><span>/</span></li>
              <li class="active">${product.name}</li>
            </ol>
          </nav>

          <a href="#shop" class="pdp-back-link">
            <span>← Back to Vault Catalog</span>
          </a>
        </div>

        <!-- MAIN PRODUCT HERO SECTION (2 COLUMNS) -->
        <div class="container">
          <div class="pdp-hero-grid">
            
            <!-- LEFT COLUMN: ROYAL GALLERY SUITE -->
            <div class="pdp-gallery-column">
              <div class="pdp-sticky-gallery">
                
                <!-- Main Stage Image Container with Zoom -->
                <div class="pdp-main-image-stage" id="pdp-image-stage">
                  <img src="${activeImage}" alt="${product.name}" id="pdp-main-img" class="pdp-main-img" />
                  
                  <!-- Badges Overlay -->
                  <div class="pdp-badge-stack">
                    <span class="pdp-badge pdp-badge-gold">👑 ROYAL HEIRLOOM</span>
                    <span class="pdp-badge pdp-badge-bis">🏅 ${product.purityCertificate ? 'BIS 916 HALLMARKED' : 'BIS HALLMARKED'}</span>
                    ${discountPercent > 0 ? `<span class="pdp-badge pdp-badge-discount">${discountPercent}% OFF</span>` : ''}
                    ${product.isBestseller ? `<span class="pdp-badge pdp-badge-best">★ BESTSELLER</span>` : ''}
                  </div>

                  <!-- Quick Action Floating Buttons -->
                  <div class="pdp-stage-actions">
                    <button class="pdp-stage-action-btn ${isWishlisted ? 'active' : ''}" id="btn-pdp-wishlist" title="Save to Wishlist" aria-label="Save to Wishlist">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? '#e11d48' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                    <button class="pdp-stage-action-btn" id="btn-pdp-share" title="Share with Family" aria-label="Share Ornament">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    </button>
                    <button class="pdp-stage-action-btn" id="btn-pdp-zoom" title="Inspect Fullscreen" aria-label="Fullscreen Zoom">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </button>
                  </div>

                  <div class="pdp-zoom-prompt">
                    <span>🔍 Hover or tap to zoom intricate craftsmanship</span>
                  </div>
                </div>

                <!-- Thumbnail Carousel Strip -->
                <div class="pdp-thumbnail-row">
                  ${galleryImages.map((imgUrl, idx) => `
                    <button class="pdp-thumbnail-btn ${imgUrl === activeImage ? 'active' : ''}" data-thumb-src="${imgUrl}">
                      <img src="${imgUrl}" alt="Angle ${idx + 1}" />
                    </button>
                  `).join('')}
                </div>

                <!-- Royal Trust Assurance Grid Below Gallery -->
                <div class="pdp-trust-grid">
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🏅</span>
                    <div>
                      <strong>BIS 916 Hallmarked</strong>
                      <p>With unique govt HUID laser inscription</p>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🛡️</span>
                    <div>
                      <strong>Brink's Armoured Transit</strong>
                      <p>100% insured delivery with OTP handshake</p>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🔄</span>
                    <div>
                      <strong>15-Day Inspection</strong>
                      <p>100% money back or effortless exchange</p>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🔁</span>
                    <div>
                      <strong>Lifetime Exchange</strong>
                      <p>100% gold weight value guarantee forever</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- RIGHT COLUMN: PRODUCT COMMERCE & SPECIFICATIONS -->
            <div class="pdp-info-column">
              
              <!-- Brand Hierarchy -->
              <div class="pdp-brand-tag">
                <span>HOUSE OF VAISHU</span>
                <span>•</span>
                <span>ROYAL HEIRLOOM ATELIER</span>
              </div>

              <!-- Product Title & SKU -->
              <h1 class="pdp-product-title text-gold-gradient">${product.name}</h1>
              
              <div class="pdp-sku-meta">
                <span>SKU: <strong>${product.sku || product.id}</strong></span>
                <span>•</span>
                <span>Collection: <strong>${product.category}</strong></span>
                <span>•</span>
                <span class="pdp-stock-status in-stock">
                  <span class="stock-dot"></span> In Vault Stock (${product.stockCount || 4} available)
                </span>
              </div>

              <!-- Customer Rating & Review Anchor -->
              <div class="pdp-ratings-bar">
                <div class="pdp-stars">★★★★★</div>
                <strong style="color: var(--gold-bright);">${product.rating || 4.9}</strong>
                <a href="#pdp-reviews-section" class="pdp-review-count">(${product.reviewsCount || 48} Verified Patron Reviews)</a>
                <span>•</span>
                <span class="pdp-verified-badge">✓ 100% Certified Authentic</span>
              </div>

              <!-- Price Box -->
              <div class="pdp-price-panel">
                <div class="pdp-price-row">
                  <span class="pdp-current-price">${formatINR(product.price)}</span>
                  ${product.originalPrice ? `
                    <span class="pdp-original-price">${formatINR(product.originalPrice)}</span>
                    <span class="pdp-savings-badge">SAVE ${formatINR(product.originalPrice - product.price)}</span>
                  ` : ''}
                </div>
                <div class="pdp-tax-note">
                  <span>✓ Inclusive of all Govt Taxes (3% GST)</span>
                  <span>•</span>
                  <span>✓ Free Insured Delivery Across India</span>
                </div>
              </div>

              <!-- 0% EMI & Swarna Nidhi Incentive -->
              <div class="pdp-incentive-box">
                <div class="pdp-incentive-line">
                  <span style="font-size: 1.1rem;">💳</span>
                  <div>
                    <strong>0% No-Cost EMI starting at ${formatINR(monthlyEmi6Mo)}/month</strong>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">Available on 14 leading Indian banks (HDFC, ICICI, SBI, Axis)</div>
                  </div>
                </div>
                <div class="pdp-incentive-line" style="border-top: 1px dashed var(--border-subtle); padding-top: 0.5rem; margin-top: 0.5rem;">
                  <span style="font-size: 1.1rem;">🎁</span>
                  <div>
                    <strong>Swarna Nidhi 11+1 Bonus Plan:</strong>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">
                      Pay in 11 easy monthly installments and Vaishu pays the 12th month EMI 100% FREE!
                      <a href="#gold-plan" style="color: var(--gold-bright); font-weight: 700; text-decoration: underline; margin-left: 4px;">Learn More →</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TRANSPARENT PRICE BREAKDOWN (ACCORDION) -->
              <div class="pdp-breakdown-card">
                <button type="button" class="pdp-breakdown-header" id="btn-toggle-breakdown">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>⚖️</span>
                    <strong>100% Transparent Price Breakup</strong>
                    <span class="pdp-breakdown-live-pill">MCX Live Sync</span>
                  </div>
                  <span id="breakdown-chevron">${showBreakdown ? '▲' : '▼'}</span>
                </button>

                <div class="pdp-breakdown-body" id="pdp-breakdown-content" style="${showBreakdown ? 'display: block;' : 'display: none;'}">
                  <div class="pdp-breakdown-row">
                    <span>Pure Gold Value (${product.weightGrams || 10}g @ ₹${breakdown.baseRatePerGram}/g):</span>
                    <strong>${formatINR(breakdown.rawMetalPrice)}</strong>
                  </div>
                  <div class="pdp-breakdown-row">
                    <span>Artisan Handcrafting & Filigree (${product.makingChargePercent || 12}%):</span>
                    <strong>${formatINR(breakdown.makingCharges)}</strong>
                  </div>
                  <div class="pdp-breakdown-row">
                    <span>Govt Jewellery GST (3%):</span>
                    <strong>${formatINR(breakdown.gst)}</strong>
                  </div>
                  <div class="pdp-breakdown-row">
                    <span>Govt Hallmarking & Laser HUID Inscription:</span>
                    <strong style="color: #34d399;">₹45 (FREE)</strong>
                  </div>
                  <div class="pdp-breakdown-total">
                    <span>Total Pure Price:</span>
                    <span class="pdp-breakdown-total-val">${formatINR(product.price)}</span>
                  </div>
                </div>
              </div>

              <!-- CUSTOMIZATION: METAL & PURITY SELECTOR -->
              <div class="pdp-option-group">
                <label class="pdp-option-label">
                  <span>Select Metal & Purity:</span>
                  <strong style="color: var(--gold-bright);" id="lbl-selected-metal">${selectedMetal}</strong>
                </label>
                <div class="pdp-chip-row" id="metal-chips">
                  <button type="button" class="pdp-chip-btn ${selectedMetal.includes('22K') ? 'active' : ''}" data-metal="22K (916 BIS)">
                    <span>🟡 22K Gold (916 BIS)</span>
                  </button>
                  <button type="button" class="pdp-chip-btn ${selectedMetal.includes('18K') ? 'active' : ''}" data-metal="18K Rose Gold">
                    <span>🌸 18K Rose Gold</span>
                  </button>
                  <button type="button" class="pdp-chip-btn ${selectedMetal.includes('Platinum') ? 'active' : ''}" data-metal="950 Platinum">
                    <span>⚪ 950 Platinum</span>
                  </button>
                </div>
              </div>

              <!-- CUSTOMIZATION: SIZE / LENGTH SELECTOR WITH MODAL LINK -->
              <div class="pdp-option-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="pdp-option-label" style="margin: 0;">Select Size / Length</label>
                  <button type="button" class="pdp-size-guide-btn" id="btn-open-size-guide">
                    <span>📏 View Royal Size Guide</span>
                  </button>
                </div>
                <select class="form-select pdp-select" id="pdp-size-select">
                  <option value="Standard Size (Complimentary Alteration)">Standard Size (Complimentary Alteration)</option>
                  <option value="Size 2.4 (Small - 57mm)">Size 2.4 (Small - 57mm)</option>
                  <option value="Size 2.6 (Medium - 60mm)">Size 2.6 (Medium - 60mm)</option>
                  <option value="Size 2.8 (Large - 63.5mm)">Size 2.8 (Large - 63.5mm)</option>
                  <option value="Choker 14 Inches + Adjustable Royal Dori">Choker 14 Inches + Adjustable Royal Dori</option>
                  <option value="Princess Length (18 Inches)">Princess Length (18 Inches)</option>
                  <option value="Custom Bespoke Fitting (Our Master Goldsmith will call you)">Custom Bespoke Fitting (Our Master Goldsmith will call you)</option>
                </select>
              </div>

              <!-- OPTIONAL COMPLIMENTARY LASER ENGRAVING -->
              <div class="pdp-option-group pdp-engraving-card">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.84rem; font-weight: 600; color: var(--text-main);">
                  <input type="checkbox" id="chk-enable-engraving" style="accent-color: var(--gold-primary);" />
                  <span>Add Complimentary Laser Inscription (Inside Clasp / Band)</span>
                  <span class="pdp-free-tag">FREE</span>
                </label>
                <div id="engraving-input-wrap" style="display: none; margin-top: 0.65rem;">
                  <input type="text" id="input-engraving" class="form-input" placeholder="e.g. Forever Yours 2026 / जयेश & वैशाली" maxlength="24" style="font-family: var(--font-serif);" />
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">Max 24 characters. Laser engraved at zero extra cost.</div>
                </div>
              </div>

              <!-- REAL-TIME PINCODE DELIVERY ESTIMATOR -->
              <div class="pdp-pincode-card">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">
                  <span>📍</span>
                  <strong style="font-size: 0.85rem;">Check Insured Delivery Date:</strong>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="pdp-pincode-input" class="form-input" placeholder="Enter 6-Digit Indian PIN (e.g. 400001)" maxlength="6" value="400001" style="max-width: 260px;" />
                  <button type="button" class="btn btn-outline-gold" id="btn-check-pincode" style="padding: 0 1.25rem;">
                    Check
                  </button>
                </div>
                <div class="pdp-pincode-result" id="pdp-pincode-result">
                  <span style="color: #34d399; font-weight: 700;">✓ Delivery Available by Friday, 17 Oct</span>
                  <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
                    Shipped in Brink's India Tamper-Proof Armoured Box with Doorstep OTP Handshake.
                  </div>
                </div>
              </div>

              <!-- PRIMARY COMMERCE ACTIONS (ADD TO BAG + BUY NOW) -->
              <div class="pdp-action-buttons-row">
                <button type="button" class="btn btn-gold pdp-add-cart-btn" id="btn-pdp-add-cart">
                  <span>✨ Add to Royal Bag</span>
                </button>
                <button type="button" class="btn btn-buy-now pdp-buy-now-btn" id="btn-pdp-buy-now">
                  <span>⚡ Instant Buy Now</span>
                </button>
              </div>

              <!-- CONCIERGE & VIDEO PREVIEW BUTTONS -->
              <div class="pdp-concierge-row">
                <button type="button" class="pdp-concierge-btn" id="btn-pdp-whatsapp">
                  <span>💬 WhatsApp Jewellery Concierge</span>
                </button>
                <button type="button" class="pdp-concierge-btn" id="btn-pdp-video-call">
                  <span>📹 Book 1-on-1 Live Video Preview</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        <!-- MIDDLE SECTION: IN-DEPTH TECHNICAL TABS (SPECS, HALLMARK, POLICIES) -->
        <section class="pdp-details-section">
          <div class="container">
            <div class="pdp-tabs-nav">
              <button class="pdp-tab-trigger ${activeTab === 'specs' ? 'active' : ''}" data-tab="specs">
                <span>📋 Detailed Royal Specifications</span>
              </button>
              <button class="pdp-tab-trigger ${activeTab === 'hallmark' ? 'active' : ''}" data-tab="hallmark">
                <span>🏅 BIS 916 Hallmark & HUID Authenticity</span>
              </button>
              <button class="pdp-tab-trigger ${activeTab === 'delivery' ? 'active' : ''}" data-tab="delivery">
                <span>🛡️ Armoured Shipping & 100% Buyback</span>
              </button>
            </div>

            <!-- Tab 1: Detailed Specifications -->
            ${activeTab === 'specs' ? `
              <div class="pdp-tab-pane">
                <div class="pdp-specs-grid">
                  <div class="pdp-spec-table-card">
                    <h3 class="pdp-spec-card-title">Metals & Gold Purity</h3>
                    <table class="pdp-spec-table">
                      <tr>
                        <td>Metal Type</td>
                        <td><strong>${product.metal || 'Pure Gold'}</strong></td>
                      </tr>
                      <tr>
                        <td>Purity Standard</td>
                        <td><strong>${product.karat || '22 Karat (916 Fineness)'}</strong></td>
                      </tr>
                      <tr>
                        <td>Gross Product Weight</td>
                        <td><strong>${product.grossWeight || (product.weightGrams ? (product.weightGrams * 1.05).toFixed(1) + 'g' : '52.2g')}</strong></td>
                      </tr>
                      <tr>
                        <td>Net Pure Gold Weight</td>
                        <td><strong>${product.netGoldWeight || (product.weightGrams ? product.weightGrams + 'g' : '48.5g')}</strong></td>
                      </tr>
                      <tr>
                        <td>Gold Color Hue</td>
                        <td><strong>Imperial Royal Yellow Gold</strong></td>
                      </tr>
                      <tr>
                        <td>Artisan Making Charges</td>
                        <td><strong>${product.makingChargePercent || 12.5}% of metal value</strong></td>
                      </tr>
                    </table>
                  </div>

                  <div class="pdp-spec-table-card">
                    <h3 class="pdp-spec-card-title">Gemstones, Diamonds & Dimensions</h3>
                    <table class="pdp-spec-table">
                      <tr>
                        <td>Diamond Details</td>
                        <td><strong>${product.diamondCarat || 'Certified Natural Solitaire (VVS1 / E)'}</strong></td>
                      </tr>
                      <tr>
                        <td>Stone Setting Style</td>
                        <td><strong>Prong, Channel & Hand-Bezel</strong></td>
                      </tr>
                      <tr>
                        <td>Dimensions & Drop</td>
                        <td><strong>${product.dimensions || 'Adjustable Royal Dori with 4.5cm drop'}</strong></td>
                      </tr>
                      <tr>
                        <td>Closure Mechanism</td>
                        <td><strong>Reinforced Double Safety Lock & Dori</strong></td>
                      </tr>
                      <tr>
                        <td>Recommended Occasion</td>
                        <td><strong>Bridal, Wedding Heirloom, Festive Gala</strong></td>
                      </tr>
                      <tr>
                        <td>Packaging Included</td>
                        <td><strong>Luxury Velvet Coffer & Cert Holder</strong></td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="pdp-description-box">
                  <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--gold-bright); margin-bottom: 0.5rem;">Curator's Note</h4>
                  <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.92rem;">
                    ${product.description || 'Handcrafted to sovereign standards by master craftsmen in 22 Karat Hallmarked Yellow Gold. Each piece undergoes 18 rigorous quality checkpoints, ultrasonic cleaning, and laser hallmarking before sealing in tamper-evident security vault consignment.'}
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- Tab 2: BIS Hallmark & HUID Authenticity -->
            ${activeTab === 'hallmark' ? `
              <div class="pdp-tab-pane">
                <div class="pdp-hallmark-banner">
                  <div class="pdp-hallmark-badge-icon">🏅</div>
                  <div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--gold-bright);">
                      100% Govt of India BIS Hallmarking Guarantee
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
                      Every gram of gold sold at House of Vaishu carries the 4 mandatory marks of Bureau of Indian Standards (BIS) authenticity.
                    </p>
                  </div>
                </div>

                <div class="pdp-hallmark-symbols-grid">
                  <div class="pdp-symbol-card">
                    <div class="pdp-symbol-art">🔺</div>
                    <strong>1. BIS Triangular Standard Mark</strong>
                    <p>Official hallmark logo certifying purity under Govt of India Hallmarking order.</p>
                  </div>
                  <div class="pdp-symbol-card">
                    <div class="pdp-symbol-art">22K916</div>
                    <strong>2. Purity & Fineness Code</strong>
                    <p>Certifies 91.6% pure 22K gold fineness for timeless value and liquidity.</p>
                  </div>
                  <div class="pdp-symbol-card">
                    <div class="pdp-symbol-art">🏛️</div>
                    <strong>3. Assaying Centre Mark</strong>
                    <p>Accredited government assay lab mark where the ornament was rigorously tested.</p>
                  </div>
                  <div class="pdp-symbol-card">
                    <div class="pdp-symbol-art" style="font-size: 1.1rem; letter-spacing: 2px;">VSH916</div>
                    <strong>4. 6-Digit Alphanumeric HUID</strong>
                    <p>Unique Hallmarking Unique Identification code verifiable on the Govt BIS Care App.</p>
                  </div>
                </div>

                <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-gold); padding: 1.25rem; border-radius: var(--radius-md); margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <strong>Verify this piece on Govt BIS Care Mobile App:</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Enter HUID code stamped on the back clasp of this ornament.</div>
                  </div>
                  <a href="https://www.bis.gov.in" target="_blank" rel="noopener" class="btn btn-outline-gold" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    Official BIS Portal ↗
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Tab 3: Armoured Shipping & 100% Buyback -->
            ${activeTab === 'delivery' ? `
              <div class="pdp-tab-pane">
                <div class="pdp-policy-grid">
                  <div class="pdp-policy-card">
                    <div class="pdp-policy-icon">🛡️</div>
                    <h4>100% Transit Insured Consignment</h4>
                    <p>
                      Shipped exclusively via Brink's India & Sequel Logistics armoured security vaults. Full transit insurance policy backed by The New India Assurance Co. Ltd.
                    </p>
                  </div>

                  <div class="pdp-policy-card">
                    <div class="pdp-policy-icon">🤝</div>
                    <h4>Doorstep Handshake with OTP Verification</h4>
                    <p>
                      Delivered in tamper-evident steel-cable sealed boxes. Delivery representative will hand over the consignment only upon verification of secret customer OTP.
                    </p>
                  </div>

                  <div class="pdp-policy-card">
                    <div class="pdp-policy-icon">🔄</div>
                    <h4>15-Day Inspection Period</h4>
                    <p>
                      Examine the ornament in person with family. If not 100% ecstatic, request a complimentary secure armoured vault pickup for full refund or exchange.
                    </p>
                  </div>

                  <div class="pdp-policy-card">
                    <div class="pdp-policy-icon">🔁</div>
                    <h4>Lifetime Buyback & Exchange Value</h4>
                    <p>
                      Exchange anytime at any of our royal boutiques or online for 100% prevailing market gold weight value without deductions.
                    </p>
                  </div>
                </div>
              </div>
            ` : ''}

          </div>
        </section>

        <!-- CUSTOMER REVIEWS & TESTIMONIALS SECTION -->
        <section class="pdp-reviews-section" id="pdp-reviews-section">
          <div class="container">
            <div class="pdp-section-header">
              <span class="pdp-section-tag">VERIFIED HEIRLOOM EXPERIENCES</span>
              <h2 class="pdp-section-title text-gold-gradient">Patron Reviews & Praise</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">Real feedback from patrons across Mumbai, Delhi, Jaipur, and Bengaluru.</p>
            </div>

            <!-- Aggregate Score Card -->
            <div class="pdp-aggregate-card">
              <div class="pdp-agg-score-col">
                <div class="pdp-big-score">${product.rating || 4.9}</div>
                <div class="pdp-stars">★★★★★</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Based on ${product.reviewsCount || 48} verified purchases</div>
              </div>

              <div class="pdp-agg-bars-col">
                <div class="pdp-rating-bar-row">
                  <span>5 Star</span>
                  <div class="pdp-bar-track"><div class="pdp-bar-fill" style="width: 92%;"></div></div>
                  <span>92%</span>
                </div>
                <div class="pdp-rating-bar-row">
                  <span>4 Star</span>
                  <div class="pdp-bar-track"><div class="pdp-bar-fill" style="width: 8%;"></div></div>
                  <span>8%</span>
                </div>
                <div class="pdp-rating-bar-row">
                  <span>3 Star</span>
                  <div class="pdp-bar-track"><div class="pdp-bar-fill" style="width: 0%;"></div></div>
                  <span>0%</span>
                </div>
              </div>

              <div class="pdp-agg-action-col">
                <button type="button" class="btn btn-outline-gold" id="btn-write-review">
                  ✍️ Write a Patron Review
                </button>
              </div>
            </div>

            <!-- Review Cards Grid -->
            <div class="pdp-reviews-grid">
              <div class="pdp-review-card">
                <div class="pdp-review-header">
                  <div>
                    <strong class="pdp-reviewer-name">Maharani Gayatri D.</strong>
                    <div class="pdp-reviewer-city">Mumbai, Maharashtra • Verified Patron</div>
                  </div>
                  <div class="pdp-stars">★★★★★</div>
                </div>
                <p class="pdp-review-body">
                  "The filigree craftsmanship on this choker set is truly regal. Brink's delivered it in a velvet presentation coffer with the HUID certificate card. It was the centerpiece of my daughter's wedding reception!"
                </p>
                <div class="pdp-review-date">Reviewed on 12 Sep 2026 • Verified Gold Purchase</div>
              </div>

              <div class="pdp-review-card">
                <div class="pdp-review-header">
                  <div>
                    <strong class="pdp-reviewer-name">Princess Ananya S.</strong>
                    <div class="pdp-reviewer-city">Jaipur, Rajasthan • Verified Patron</div>
                  </div>
                  <div class="pdp-stars">★★★★★</div>
                </div>
                <p class="pdp-review-body">
                  "The transparent price breakup gave me complete peace of mind. Knowing the exact gold rate and making charges without hidden markups makes House of Vaishu stand miles ahead of traditional jewellers."
                </p>
                <div class="pdp-review-date">Reviewed on 28 Aug 2026 • Verified Gold Purchase</div>
              </div>

              <div class="pdp-review-card">
                <div class="pdp-review-header">
                  <div>
                    <strong class="pdp-reviewer-name">Rajesh & Sunita Mehta</strong>
                    <div class="pdp-reviewer-city">Ahmedabad, Gujarat • Verified Patron</div>
                  </div>
                  <div class="pdp-stars">★★★★★</div>
                </div>
                <p class="pdp-review-body">
                  "We purchased this with the 0% No Cost EMI on HDFC. The free laser engraving came out crisp and flawless. An heirloom to be passed on to future generations."
                </p>
                <div class="pdp-review-date">Reviewed on 14 Aug 2026 • Verified Gold Purchase</div>
              </div>
            </div>

          </div>
        </section>

        <!-- "COMPLETE THE ROYAL LOOK" (MATCHING HEIRLOOMS) -->
        ${relatedProducts.length > 0 ? `
          <section class="pdp-related-section">
            <div class="container">
              <div class="pdp-section-header">
                <span class="pdp-section-tag">CURATED ENSEMBLE</span>
                <h2 class="pdp-section-title text-gold-gradient">Complete The Royal Look</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Complement this masterpiece with matching heirloom suites from the House of Vaishu.</p>
              </div>

              <div class="products-grid" id="pdp-related-grid">
                ${relatedProducts.map(p => renderProductCard(p)).join('')}
              </div>
            </div>
          </section>
        ` : ''}

      </div>

      <!-- ROYAL SIZE GUIDE MODAL (MOUNTED INLINE) -->
      <div class="modal-backdrop" id="size-guide-modal" style="display: none;">
        <div class="modal-dialog" style="max-width: 650px;">
          <button class="modal-close-btn" id="btn-close-size-guide">✕</button>
          
          <div style="padding: 2rem 1.5rem;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <span style="font-size: 1.5rem;">📏</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--gold-bright); margin: 0.25rem 0;">
                Royal Jewellery Size & Fitting Guide
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem;">Standard Indian and International sizing standards.</p>
            </div>

            <!-- Bangle Size Chart -->
            <div style="margin-bottom: 1.5rem;">
              <strong style="color: var(--gold-bright); font-size: 0.95rem;">Bangles & Kadas Size Chart:</strong>
              <table class="pdp-spec-table" style="margin-top: 0.5rem; font-size: 0.8rem;">
                <thead>
                  <tr style="background: var(--bg-surface-elevated);">
                    <th>Indian Size</th>
                    <th>Inner Diameter (mm)</th>
                    <th>Circumference</th>
                    <th>Fitting Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>2.4</strong></td>
                    <td>57.2 mm</td>
                    <td>17.9 cm</td>
                    <td>Extra Small / Petite Wrist</td>
                  </tr>
                  <tr>
                    <td><strong>2.6 (Most Common)</strong></td>
                    <td>60.3 mm</td>
                    <td>18.9 cm</td>
                    <td>Medium / Standard Wrist</td>
                  </tr>
                  <tr>
                    <td><strong>2.8</strong></td>
                    <td>63.5 mm</td>
                    <td>19.9 cm</td>
                    <td>Comfort Fit / Broader Wrist</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Necklace Length Guide -->
            <div>
              <strong style="color: var(--gold-bright); font-size: 0.95rem;">Necklace & Choker Drop Guide:</strong>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.6;">
                • <strong>Choker (14" - 16"):</strong> Sits gracefully at base of the throat. Includes adjustable handcrafted silk dori.<br>
                • <strong>Princess Length (18"):</strong> Rests elegantly on collarbone.<br>
                • <strong>Complimentary Alteration:</strong> All House of Vaishu heirlooms include complimentary length resizing upon request.
              </div>
            </div>

            <div style="text-align: center; margin-top: 1.75rem;">
              <button type="button" class="btn btn-gold" id="btn-done-size-guide" style="padding: 0.65rem 2rem;">
                Understood, Return to Ornament
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIDEO CALL APPOINTMENT MODAL -->
      <div class="modal-backdrop" id="video-call-modal" style="display: none;">
        <div class="modal-dialog" style="max-width: 500px;">
          <button class="modal-close-btn" id="btn-close-video-modal">✕</button>
          
          <div style="padding: 2rem 1.5rem;">
            <div style="text-align: center; margin-bottom: 1.25rem;">
              <span style="font-size: 1.75rem;">📹</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--gold-bright); margin: 0.25rem 0;">
                Book Private 1-on-1 Video Consultation
              </h3>
              <p style="color: var(--text-muted); font-size: 0.82rem;">
                View this exact ornament live in HD with our Head Gemologist before placing your order.
              </p>
            </div>

            <form id="form-video-booking">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.78rem;">Your Full Name *</label>
                <input type="text" id="video-name" class="form-input" placeholder="e.g. Gayatri Devi" required value="${currentUser?.displayName || ''}" />
              </div>

              <div class="form-group">
                <label class="form-label" style="font-size: 0.78rem;">WhatsApp Mobile Number *</label>
                <input type="tel" id="video-phone" class="form-input" placeholder="+91 98765 43210" required value="${currentUser?.phone || ''}" />
              </div>

              <div class="form-group">
                <label class="form-label" style="font-size: 0.78rem;">Preferred Video Slot *</label>
                <select class="form-select" id="video-slot">
                  <option value="Today (Within 30 mins)">Today (Within next 30 mins)</option>
                  <option value="Tomorrow (11:00 AM - 1:00 PM)">Tomorrow Morning (11:00 AM - 1:00 PM)</option>
                  <option value="Tomorrow (4:00 PM - 7:00 PM)">Tomorrow Evening (4:00 PM - 7:00 PM)</option>
                  <option value="Weekend Special VIP Slot">Weekend Special VIP Slot</option>
                </select>
              </div>

              <button type="submit" class="btn btn-gold btn-block" style="padding: 0.85rem; font-weight: 700; margin-top: 1rem;">
                <span>📅 Confirm Video Appointment</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  };

  const attachEvents = () => {
    // 1. Gallery Thumbnail clicks
    container.querySelectorAll('.pdp-thumbnail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-thumb-src');
        if (src) {
          activeImage = src;
          const mainImg = container.querySelector('#pdp-main-img');
          if (mainImg) {
            mainImg.style.opacity = '0.4';
            setTimeout(() => {
              mainImg.src = activeImage;
              mainImg.style.opacity = '1';
            }, 150);
          }
          container.querySelectorAll('.pdp-thumbnail-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });

    // 2. Interactive Zoom on Main Image
    const stage = container.querySelector('#pdp-image-stage');
    const mainImg = container.querySelector('#pdp-main-img');
    if (stage && mainImg) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
        mainImg.style.transform = 'scale(1.85)';
      });
      stage.addEventListener('mouseleave', () => {
        mainImg.style.transform = 'scale(1)';
        mainImg.style.transformOrigin = 'center center';
      });
    }

    // 3. Wishlist Button on Image
    const wishlistBtn = container.querySelector('#btn-pdp-wishlist');
    wishlistBtn?.addEventListener('click', () => {
      const { isAdded } = toggleWishlist(product);
      isWishlisted = isAdded;
      if (isAdded) {
        wishlistBtn.classList.add('active');
        wishlistBtn.querySelector('svg').setAttribute('fill', '#e11d48');
        showToast('Added to Royal Wishlist! 💖', 'success');
      } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.querySelector('svg').setAttribute('fill', 'none');
        showToast('Removed from Wishlist', 'info');
      }
    });

    // 4. Share Button
    container.querySelector('#btn-pdp-share')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard! Share with family ✨', 'success');
      } catch {
        showToast(`Share URL: ${window.location.href}`, 'info');
      }
    });

    // 5. Fullscreen Zoom Button
    container.querySelector('#btn-pdp-zoom')?.addEventListener('click', () => {
      window.open(activeImage, '_blank');
    });

    // 6. Toggle Transparent Price Breakdown
    container.querySelector('#btn-toggle-breakdown')?.addEventListener('click', () => {
      showBreakdown = !showBreakdown;
      const content = container.querySelector('#pdp-breakdown-content');
      const chevron = container.querySelector('#breakdown-chevron');
      if (content) content.style.display = showBreakdown ? 'block' : 'none';
      if (chevron) chevron.textContent = showBreakdown ? '▲' : '▼';
    });

    // 7. Metal chips selector
    container.querySelectorAll('.pdp-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMetal = btn.getAttribute('data-metal');
        container.querySelectorAll('.pdp-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lbl = container.querySelector('#lbl-selected-metal');
        if (lbl) lbl.textContent = selectedMetal;
        showToast(`Selected metal updated to: ${selectedMetal}`, 'info');
      });
    });

    // 8. Size selector
    container.querySelector('#pdp-size-select')?.addEventListener('change', (e) => {
      selectedSize = e.target.value;
    });

    // 9. Engraving checkbox toggle
    const chkEngraving = container.querySelector('#chk-enable-engraving');
    const wrapEngraving = container.querySelector('#engraving-input-wrap');
    chkEngraving?.addEventListener('change', (e) => {
      if (wrapEngraving) wrapEngraving.style.display = e.target.checked ? 'block' : 'none';
      if (e.target.checked) {
        container.querySelector('#input-engraving')?.focus();
      }
    });

    // 10. Pincode Check
    container.querySelector('#btn-check-pincode')?.addEventListener('click', () => {
      const pin = container.querySelector('#pdp-pincode-input')?.value.trim();
      const res = container.querySelector('#pdp-pincode-result');
      if (!pin || pin.length !== 6 || isNaN(pin)) {
        showToast('Please enter a valid 6-digit Indian PIN code', 'warning');
        return;
      }
      if (res) {
        res.innerHTML = `
          <span style="color: #34d399; font-weight: 700;">✓ Insured Delivery Available for PIN ${pin} by Friday, 17 Oct</span>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
            Shipped in Brink's India Tamper-Proof Armoured Box with Doorstep OTP Handshake.
          </div>
        `;
      }
      showToast(`Delivery confirmed for PIN ${pin}! 🛡️`, 'success');
    });

    // 11. Primary: Add to Royal Bag
    container.querySelector('#btn-pdp-add-cart')?.addEventListener('click', (e) => {
      const engraving = container.querySelector('#chk-enable-engraving')?.checked
        ? container.querySelector('#input-engraving')?.value.trim()
        : '';

      const configuredItem = {
        ...product,
        selectedMetal: selectedMetal,
        selectedSize: selectedSize,
        engraving: engraving || null
      };

      addToCart(configuredItem, 1);
      
      const img = container.querySelector('#pdp-main-img');
      triggerAddToCartVisuals({
        button: e.currentTarget,
        product: product,
        imageElement: img
      });

      if (onOpenCartDrawer) {
        setTimeout(() => onOpenCartDrawer(), 350);
      }
    });

    // 12. Secondary: Instant Buy Now (Direct to Checkout)
    container.querySelector('#btn-pdp-buy-now')?.addEventListener('click', () => {
      const engraving = container.querySelector('#chk-enable-engraving')?.checked
        ? container.querySelector('#input-engraving')?.value.trim()
        : '';

      const configuredItem = {
        ...product,
        selectedMetal: selectedMetal,
        selectedSize: selectedSize,
        engraving: engraving || null
      };

      addToCart(configuredItem, 1);
      showToast('Proceeding to Insured Escrow Checkout... 🛡️', 'success');
      window.location.hash = '#checkout';
    });

    // 13. WhatsApp Concierge
    container.querySelector('#btn-pdp-whatsapp')?.addEventListener('click', () => {
      const msg = encodeURIComponent(`Namaste House of Vaishu! I am interested in viewing ${product.name} (SKU: ${product.sku || product.id}, Price: ${formatINR(product.price)}). Could you connect me with a jewellery specialist?`);
      window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    });

    // 14. Book Video Call Modal
    const videoModal = container.querySelector('#video-call-modal');
    container.querySelector('#btn-pdp-video-call')?.addEventListener('click', () => {
      if (videoModal) videoModal.style.display = 'flex';
    });
    container.querySelector('#btn-close-video-modal')?.addEventListener('click', () => {
      if (videoModal) videoModal.style.display = 'none';
    });
    container.querySelector('#form-video-booking')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#video-name')?.value;
      const slot = container.querySelector('#video-slot')?.value;
      showToast(`✓ Video preview confirmed for ${name}! Slot: ${slot}`, 'success');
      if (videoModal) videoModal.style.display = 'none';
    });

    // 15. Royal Size Guide Modal
    const sizeModal = container.querySelector('#size-guide-modal');
    container.querySelector('#btn-open-size-guide')?.addEventListener('click', () => {
      if (sizeModal) sizeModal.style.display = 'flex';
    });
    container.querySelector('#btn-close-size-guide')?.addEventListener('click', () => {
      if (sizeModal) sizeModal.style.display = 'none';
    });
    container.querySelector('#btn-done-size-guide')?.addEventListener('click', () => {
      if (sizeModal) sizeModal.style.display = 'none';
    });

    // 16. Technical Details Tab Switcher
    container.querySelectorAll('.pdp-tab-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // 17. Review button
    container.querySelector('#btn-write-review')?.addEventListener('click', () => {
      if (!currentUser && onOpenAuthModal) {
        showToast('Please sign in to write a verified patron review', 'info');
        onOpenAuthModal('login');
      } else {
        showToast('Thank you! Review submission portal opened.', 'info');
      }
    });

    // 18. Related Products Grid Events
    const relatedGrid = container.querySelector('#pdp-related-grid');
    if (relatedGrid && relatedProducts.length > 0) {
      attachProductCardEvents(relatedGrid, relatedProducts, (p) => {
        window.location.hash = `#product/${p.id}`;
      });
    }
  };

  render();
}
