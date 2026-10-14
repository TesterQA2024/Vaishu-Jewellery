/**
 * VAISHU JEWELLERY - Luxury Royal Footer Component
 * Featuring 4 Pillars of Royal Assurance, Heritage Story, Wealth Portals, and VIP Club
 */

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="footer">
      <div class="container">
        <!-- 4 Pillars of Royal Assurance -->
        <div class="footer-assurance-strip">
          <div class="assurance-card">
            <div class="assurance-icon-box">🏅</div>
            <div class="assurance-content">
              <h5 class="assurance-title">BIS 916 Hallmarked</h5>
              <p class="assurance-desc">100% Govt Certified Pure 22K Gold with Unique Laser HUID Identifier.</p>
            </div>
          </div>

          <div class="assurance-card">
            <div class="assurance-icon-box">💎</div>
            <div class="assurance-content">
              <h5 class="assurance-title">IGI & GIA Certified</h5>
              <p class="assurance-desc">Natural Conflict-Free Diamonds with Individual Certificate of Authenticity.</p>
            </div>
          </div>

          <div class="assurance-card">
            <div class="assurance-icon-box">🛡️</div>
            <div class="assurance-content">
              <h5 class="assurance-title">Insured Armoured Transit</h5>
              <p class="assurance-desc">Complimentary 100% Insured Delivery via Brink’s Vault Logistics across India.</p>
            </div>
          </div>

          <div class="assurance-card">
            <div class="assurance-icon-box">🔄</div>
            <div class="assurance-content">
              <h5 class="assurance-title">100% Lifetime Exchange</h5>
              <p class="assurance-desc">Guaranteed Transparent Value & Instant Liquidity at Prevailing Live MCX Rates.</p>
            </div>
          </div>
        </div>

        <!-- Main Footer Navigation & Heritage Grid -->
        <div class="footer-grid">
          <!-- Brand & Heritage Column -->
          <div class="footer-col-brand">
            <a href="#" class="brand-logo" style="margin-bottom: 1.15rem; text-decoration: none;">
              <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Curating timeless Indian heritage, heirloom bridal suites, and pure 24K bullion for over three decades. Trusted by over 50,000 royal families across India & worldwide.
            </p>

            <!-- BIS Government Hallmark License Pill -->
            <div class="bis-license-badge">
              <span>✓</span>
              <span>BIS Lic. <strong>BIS/HM/916/MH/2026/0994</strong></span>
            </div>

            <!-- Social Media VIP Connections -->
            <div class="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener" class="footer-social-btn" title="Follow on Instagram" aria-label="Instagram">
                <span>📸</span>
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener" class="footer-social-btn" title="WhatsApp Concierge" aria-label="WhatsApp">
                <span>💬</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener" class="footer-social-btn" title="Facebook" aria-label="Facebook">
                <span>📘</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener" class="footer-social-btn" title="YouTube Showcase" aria-label="YouTube">
                <span>▶️</span>
              </a>
            </div>
          </div>

          <!-- Column 2: Royal Collections -->
          <div>
            <h4 class="footer-col-title">
              <span>👑</span>
              <span>Royal Collections</span>
            </h4>
            <ul class="footer-links">
              <li><a href="#shop" class="footer-link">Heritage Bridal Suites</a></li>
              <li><a href="#shop" class="footer-link">Solitaire Diamond Rings</a></li>
              <li><a href="#shop" class="footer-link">Antique Temple Kadas</a></li>
              <li><a href="#shop" class="footer-link">Sacred Diamond Mangalsutra</a></li>
              <li><a href="#shop" class="footer-link">24K Sovereign Gold Coins</a></li>
              <li><a href="#bridal" class="footer-link">The Maharani Bridal Lounge</a></li>
            </ul>
          </div>

          <!-- Column 3: Wealth Portals & Client Concierge -->
          <div>
            <h4 class="footer-col-title">
              <span>🏛️</span>
              <span>Client Concierge</span>
            </h4>
            <ul class="footer-links">
              <li><a href="#digital-gold" class="footer-link footer-link-highlight-emerald">🪙 24K Digital Gold Vault</a></li>
              <li><a href="#gold-plan" class="footer-link footer-link-highlight-gold">✨ Swarna Nidhi Plan (11+1)</a></li>
              <li><a href="#rates" class="footer-link">📈 Live MCX Bullion Calculator</a></li>
              <li><a href="#orders" class="footer-link">📦 Track Armoured Order</a></li>
              <li><a href="#wishlist" class="footer-link">💖 Saved Royal Wishlist</a></li>
              <li><a href="#about" class="footer-link">🏅 BIS Purity Verification</a></li>
              <li><a href="#about" class="footer-link">🔄 Lifetime Exchange Terms</a></li>
            </ul>
          </div>

          <!-- Column 4: Royal Privilege Club & Helplines -->
          <div>
            <div class="footer-vip-badge">
              VIP PRIVILEGE ACCESS
            </div>
            <h4 class="footer-col-title" style="margin-bottom: 0.6rem;">Join the Royal Club</h4>
            <p style="color: var(--text-muted); font-size: 0.84rem; line-height: 1.5; margin-bottom: 1rem;">
              Receive confidential vault previews, Akshaya Tritiya priority booking & daily MCX bullion forecasts.
            </p>

            <form id="footer-newsletter-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <input type="email" id="footer-news-email" placeholder="Your royal email address" class="form-input" required style="font-size: 0.85rem; padding: 0.6rem 0.85rem;">
              <button type="submit" class="btn btn-gold" style="padding: 0 1.15rem; font-size: 0.85rem; white-space: nowrap;">Join ✨</button>
            </form>

            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1rem; font-size: 0.82rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
              <div style="display: flex; align-items: center; gap: 0.45rem;">
                <span class="ticker-pulse-dot" style="background: #00e676;"></span>
                <span style="color: var(--text-main); font-weight: 600;">Vault Concierge:</span>
                <strong style="color: var(--gold-bright);">+91 (022) 8900-VAISHU</strong>
              </div>
              <div style="font-size: 0.78rem;">
                ✉️ <strong style="color: var(--text-main);">vip@vaishujewellery.com</strong>
              </div>
              <div style="font-size: 0.75rem; color: var(--gold-dark); margin-top: 2px;">
                📍 Vaishu Tower, Heritage Boulevard, Mumbai
              </div>
            </div>
          </div>
        </div>

        <!-- Security, Certifications & Payment Methods Bar -->
        <div class="footer-security-bar">
          <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
            <div class="security-badge-ssl">
              <span>🔒</span>
              <span>256-Bit Bank-Grade SSL Secured</span>
            </div>
            <span style="color: var(--border-subtle);">|</span>
            <div class="security-badge-rbi">
              <span>🛡️</span>
              <span>RBI & BIS Certified Bullion Merchant</span>
            </div>
          </div>

          <!-- Accepted Payment Methods -->
          <div class="payment-icons-row">
            <span class="payment-pill">RuPay</span>
            <span class="payment-pill">UPI / PhonePe</span>
            <span class="payment-pill">Google Pay</span>
            <span class="payment-pill">Visa</span>
            <span class="payment-pill">MasterCard</span>
            <span class="payment-pill">NetBanking</span>
            <span class="payment-pill">0% EMI</span>
          </div>
        </div>

        <!-- Bottom Copyright & Statutory Legal Bar -->
        <div class="footer-bottom">
          <div>
            © ${currentYear} <strong>VAISHU JEWELLERY LIMITED</strong>. Handcrafted with Royal Pride in India. All Rights Reserved.
          </div>
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <a href="#privacy" class="footer-link">Privacy Policy</a>
            <a href="#terms" class="footer-link">Terms of Vault</a>
            <a href="#hallmark" class="footer-link">BIS Hallmark Verification</a>
            <a href="#about" class="footer-link">Anti-Money Laundering (AML) Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
