/**
 * VAISHU JEWELLERY - Heritage & Purity Assurance Page
 */

export function renderAboutPage(container) {
  container.innerHTML = `
    <section style="padding: 3rem 0 6rem;">
      <div class="container" style="max-width: 960px;">
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <div class="hero-badge">The Legacy of Excellence</div>
          <h1 style="font-size: 2.8rem; margin-bottom: 1rem;" class="text-gold-gradient">
            Three Decades of Royal Trust
          </h1>
          <p style="color: var(--text-muted); font-size: 1.05rem;">
            Founded with an uncompromising devotion to pure gold, master hand-craftsmanship, and absolute pricing transparency.
          </p>
        </div>

        <!-- 4 Pillars Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
          <div class="admin-card">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🏅</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--gold-bright);">BIS 916 with HUID</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              Every gold piece carries the government Bureau of Indian Standards 6-digit alphanumeric Hallmark Unique Identification (HUID) laser engraved on the metal.
            </p>
          </div>

          <div class="admin-card">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">💎</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--gold-bright);">IGI Solitaire Certification</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              Natural diamonds graded by International Gemological Institute, verifying Color, Clarity, Cut, and Carat weight with zero ambiguity.
            </p>
          </div>

          <div class="admin-card">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🛡️</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--gold-bright);">Zero-Risk Transit</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              All online purchases are transported in armed, GPS-monitored secure couriers with 100% full value comprehensive transit insurance.
            </p>
          </div>

          <div class="admin-card">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🔄</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--gold-bright);">100% Lifetime Buyback</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              Exchange or liquidate your gold jewelry anytime at 100% of the prevailing bullion market gold weight value without deductions.
            </p>
          </div>
        </div>

        <!-- Hallmark Verification Guide -->
        <div class="admin-card" style="border-color: var(--border-gold); padding: 2.5rem; margin-bottom: 3rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem;" class="text-gold-gradient">How to Verify Your Vaishu Jewellery Hallmark</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
            You can verify the genuineness of any hallmarked piece in 3 simple steps:
          </p>
          <ol style="margin-left: 1.5rem; color: #fff; font-size: 0.92rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <li>Look for the triangular <strong>BIS Logo</strong> stamped on the inner shank or back of the jewelry.</li>
            <li>Locate the <strong>Purity Stamp</strong>: 22K (916), 24K (999), or 18K (750).</li>
            <li>Open the official <strong>BIS CARE mobile application</strong> (Govt. of India), select "Verify HUID", and enter the 6-character code inscribed on your jewelry or invoice.</li>
          </ol>
        </div>
      </div>
    </section>
  `;
}
