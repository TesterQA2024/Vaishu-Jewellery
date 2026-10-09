/**
 * VAISHU JEWELLERY - Bridal Lounge Page
 */

import { fetchProducts } from '../services/productService';
import { renderProductCard, attachProductCardEvents } from '../components/ProductCard';
import { showToast } from '../components/Toast';

export async function renderBridalPage(container, onOpenQuickView) {
  const products = await fetchProducts({ maxPrice: 5000000 });
  const bridalItems = products.filter(p => p.category === 'Bridal Sets' || p.category === 'Necklaces' || p.tags?.includes('Bridal'));

  container.innerHTML = `
    <section style="padding: 3rem 0 6rem;">
      <div class="container">
        <!-- Hero Header -->
        <div style="text-align: center; max-width: 800px; margin: 0 auto 3.5rem;">
          <div class="hero-badge">The Maharani Suite</div>
          <h1 style="font-size: 2.8rem; margin-bottom: 1rem;" class="text-gold-gradient">
            Royal Bridal & Heirloom Lounge
          </h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            A bespoke private sanctuary for the discerning Indian bride. Each piece is custom-commissioned in 22K Solid Gold, Syndicate Uncut Polki, and certified fine gemstones.
          </p>
        </div>

        <!-- Bridal Consultation Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 2.5rem; margin-bottom: 4rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; align-items: center;">
          <div>
            <div style="color: var(--gold-dark); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Private Vault Appointment</div>
            <h3 style="font-size: 1.6rem; margin: 0.5rem 0 1rem;">Book a 1-on-1 Virtual or In-Store Bridal Stylist</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
              Receive tailored matching with your bridal lehenga colors, custom carat weight adjustments, and private bullion lock-in pricing.
            </p>
            <form id="bridal-concierge-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <input type="text" id="bridal-client-name" class="form-input" placeholder="Bride's Full Name" required />
              <div style="display: flex; gap: 0.75rem;">
                <input type="tel" id="bridal-client-phone" class="form-input" placeholder="WhatsApp / Phone" required />
                <input type="date" id="bridal-wedding-date" class="form-input" required />
              </div>
              <button type="submit" class="btn btn-gold" style="padding: 0.85rem;">Reserve Private Styling Slot ✨</button>
            </form>
          </div>

          <div style="border-radius: var(--radius-md); overflow: hidden; height: 320px; border: 1px solid var(--border-gold);">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80" alt="Vaishu Bridal Experience" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>

        <!-- Curated Bridal Sets Grid -->
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">The Bridal Masterpieces</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Complete 7-piece sets, royal chokers, and handcrafted antique temple ornaments.</p>
        </div>

        <div class="product-grid" id="bridal-products-grid">
          ${bridalItems.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
  `;

  const grid = document.getElementById('bridal-products-grid');
  if (grid) {
    attachProductCardEvents(grid, bridalItems, onOpenQuickView);
  }

  document.getElementById('bridal-concierge-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bridal-client-name').value;
    showToast(`Thank you, ${name}! A dedicated Vaishu Bridal Specialist will connect with you on WhatsApp within 1 hour.`, 'success');
  });
}
