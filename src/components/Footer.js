/**
 * VAISHU JEWELLERY - Footer Component
 */

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand & Heritage -->
          <div>
            <div class="brand-logo" style="margin-bottom: 1rem;">
              <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 3h12l4 6-10 12L2 9z"/>
                  <path d="M11 3 8 9l4 12 4-12-3-6"/>
                  <path d="M2 9h20"/>
                </svg>
              </div>
              <div>
                <div class="brand-name">VAISHU</div>
                <div class="brand-tagline">ROYAL JEWELLERY</div>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">
              Preserving Indian heritage craftsmanship for over three decades. Every piece is crafted in BIS 916 Hallmarked Gold, IGI Certified Solitaires, and covered by 100% Lifetime Buyback & Insurance.
            </p>
            <div style="display: flex; gap: 0.85rem; font-size: 0.8rem; color: var(--gold-bright);">
              <span>🏅 BIS 916</span>
              <span>•</span>
              <span>💎 IGI Certified</span>
              <span>•</span>
              <span>🛡️ Free Transit Insurance</span>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div>
            <h4 class="footer-col-title">Our Collections</h4>
            <ul class="footer-links">
              <li><a href="#shop" class="footer-link">Heritage Bridal Chokers</a></li>
              <li><a href="#shop" class="footer-link">Solitaire Diamond Rings</a></li>
              <li><a href="#shop" class="footer-link">Antique Temple Jewellery</a></li>
              <li><a href="#shop" class="footer-link">Sacred Diamond Mangalsutra</a></li>
              <li><a href="#shop" class="footer-link">Pure 24K Gold Coins</a></li>
            </ul>
          </div>

          <!-- Customer Care -->
          <div>
            <h4 class="footer-col-title">Client Concierge</h4>
            <ul class="footer-links">
              <li><a href="#orders" class="footer-link">Track Insured Order</a></li>
              <li><a href="#rates" class="footer-link">Live Gold Calculator</a></li>
              <li><a href="#about" class="footer-link">Purity & Hallmarking Guide</a></li>
              <li><a href="#about" class="footer-link">Lifetime Exchange Policy</a></li>
              <li><a href="#admin" class="footer-link" style="color: var(--gold-bright);">Admin Portal</a></li>
            </ul>
          </div>

          <!-- Newsletter & Helpline -->
          <div>
            <h4 class="footer-col-title">Royal Privilege Club</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
              Subscribe to receive exclusive access to high-jewellery private auctions & daily bullion market forecasts.
            </p>
            <form id="newsletter-form" style="display: flex; gap: 0.5rem;" onsubmit="event.preventDefault(); alert('Thank you for subscribing to Vaishu Privilege Club!');">
              <input type="email" placeholder="Your royal email address" class="form-input" required style="font-size: 0.85rem;">
              <button type="submit" class="btn btn-gold" style="padding: 0 1rem; white-space: nowrap;">Join</button>
            </form>
            <div style="margin-top: 1.25rem; font-size: 0.82rem; color: var(--text-muted);">
              📞 Royal Concierge: <strong>+91 (022) 8900-VAISHU</strong><br>
              ✉️ Email: <strong>vip@vaishujewellery.com</strong>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © ${new Date().getFullYear()} VAISHU JEWELLERY LIMITED. All Rights Reserved. Fully Encrypted & Protected.
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <a href="#privacy" class="footer-link">Privacy Policy</a>
            <a href="#terms" class="footer-link">Terms of Service</a>
            <a href="#hallmark" class="footer-link">BIS Hallmark Verification</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
