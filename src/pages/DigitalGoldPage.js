/**
 * VAISHU JEWELLERY - Digital Gold (24K 999 Pure) Page
 * Route: #digital-gold
 * Supports 24K Pure Gold Buy, Sell, Redeem (Physical Coins/Store Voucher) & Passbook
 */

import {
  getDigitalGoldVault,
  getDigitalGoldRates,
  calculateBuyQuote,
  calculateSellQuote,
  buyDigitalGold,
  sellDigitalGold,
  redeemDigitalGold
} from '../services/digitalGoldService';
import { formatINR } from '../utils/formatters';

export function renderDigitalGoldPage(container, currentUser, onOpenAuthModal) {
  let activeTab = 'buy'; // 'buy' | 'sell' | 'redeem' | 'passbook'
  let buyMode = 'inr'; // 'inr' | 'grams'
  let buyInputVal = 1000;
  let sellInputGrams = 0.5;
  let redeemInputGrams = 0.5;
  let redeemType = 'STORE_VOUCHER'; // 'STORE_VOUCHER' | 'PHYSICAL_COIN'

  const render = () => {
    const rates = getDigitalGoldRates();
    const vault = getDigitalGoldVault(currentUser?.uid);
    const vaultValueInr = Math.round(vault.grams * rates.buyRatePerGram);

    // Current Buy Quote
    const buyQuote = calculateBuyQuote({
      amountInr: buyMode === 'inr' ? buyInputVal : 0,
      grams: buyMode === 'grams' ? buyInputVal : 0,
      mode: buyMode
    });

    // Current Sell Quote
    const sellQuote = calculateSellQuote({
      grams: sellInputGrams
    });

    container.innerHTML = `
      <section class="digital-gold-page">
        <div class="container">
          <!-- Page Header -->
          <div class="dg-hero-header">
            <div class="hero-badge dg-royal-badge">
              <span>✦</span>
              <span>24K 999.9 SOVEREIGN BULLION</span>
              <span>✦</span>
            </div>
            <h1 class="dg-hero-title text-gold-gradient">
              Vaishu Sovereign Digital Gold
            </h1>
            <p class="dg-hero-sub">
              Accumulate 24K 999 pure gold starting from ₹100 • 100% Insured Bank Security Vaults • Live Liquidity
            </p>
          </div>

          <!-- Royal Sovereign Vault Card (Black & Gold Metal Aesthetic) -->
          <div class="dg-sovereign-card">
            <div class="dg-sovereign-bg-glow"></div>
            <div class="dg-sovereign-content">
              <div class="dg-card-top-bar">
                <div class="dg-card-brand">
                  <span class="dg-crown">👑</span>
                  <span class="dg-brand-title">VAISHU IMPERIAL VAULT</span>
                </div>
                <div class="dg-card-chip">
                  <span class="dg-chip-icon">🔲</span>
                  <span class="dg-chip-purity">AU 999.9 PURE</span>
                </div>
              </div>

              <div class="dg-card-main-stat">
                <div class="dg-stat-left">
                  <span class="dg-stat-label">Accumulated 24K Gold Balance</span>
                  <div class="dg-stat-grams">
                    ${vault.grams.toFixed(4)} <span class="dg-unit">Grams</span>
                  </div>
                  <div class="dg-stat-val">
                    Current Market Valuation: <strong>${formatINR(vaultValueInr)}</strong>
                  </div>
                </div>

                <div class="dg-stat-right">
                  <div class="dg-live-rate-chip buy">
                    <div class="dg-chip-header">
                      <span class="rate-dot live">●</span>
                      <span>MCX 24K BUY</span>
                    </div>
                    <div class="dg-chip-price">₹${rates.buyRatePerGram}<small>/g</small></div>
                    <span class="dg-chip-note">+3% Statutory GST</span>
                  </div>

                  <div class="dg-live-rate-chip sell">
                    <div class="dg-chip-header">
                      <span class="rate-dot">●</span>
                      <span>MCX 24K SELL</span>
                    </div>
                    <div class="dg-chip-price">₹${rates.sellRatePerGram}<small>/g</small></div>
                    <span class="dg-chip-note">Direct Bank Payout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Interactive Card with Tabs -->
          <div class="dg-main-action-card">
            <!-- Navigation Tabs -->
            <div class="dg-tabs-nav">
              <button type="button" class="dg-tab-btn ${activeTab === 'buy' ? 'active' : ''}" data-tab="buy">
                <span>🛒 Buy 24K Gold</span>
              </button>
              <button type="button" class="dg-tab-btn ${activeTab === 'sell' ? 'active' : ''}" data-tab="sell">
                <span>💰 Sell to Bank</span>
              </button>
              <button type="button" class="dg-tab-btn ${activeTab === 'redeem' ? 'active' : ''}" data-tab="redeem">
                <span>👑 Redeem (Coin / Voucher)</span>
              </button>
              <button type="button" class="dg-tab-btn ${activeTab === 'passbook' ? 'active' : ''}" data-tab="passbook">
                <span>📄 Passbook (${vault.transactions.length})</span>
              </button>
            </div>

            <!-- TAB 1: BUY DIGITAL GOLD -->
            ${activeTab === 'buy' ? `
              <div class="dg-tab-content">
                <div class="dg-pane-head">
                  <h3 class="dg-pane-title">Buy 24K 999 Pure Gold</h3>
                  <p class="dg-pane-sub">Instant vault credit at live bullion rates with 100% free insured bank custody.</p>
                </div>

                <!-- Currency Mode Switcher -->
                <div class="dg-mode-switcher">
                  <button type="button" class="dg-mode-btn ${buyMode === 'inr' ? 'active' : ''}" data-buy-mode="inr">
                    Pay in Rupees (₹)
                  </button>
                  <button type="button" class="dg-mode-btn ${buyMode === 'grams' ? 'active' : ''}" data-buy-mode="grams">
                    Buy in Grams (g)
                  </button>
                </div>

                <!-- Input Row -->
                <div class="dg-input-box">
                  <label class="form-label" style="font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase;">
                    ${buyMode === 'inr' ? 'Amount to Invest (Min ₹100)' : 'Gold Quantity (Min 0.01g)'}
                  </label>
                  <div class="dg-input-row">
                    <span class="dg-prefix">${buyMode === 'inr' ? '₹' : '⚖️'}</span>
                    <input type="number" id="input-buy-val" class="dg-number-input" value="${buyInputVal}" min="${buyMode === 'inr' ? '100' : '0.01'}" step="${buyMode === 'inr' ? '50' : '0.05'}" />
                    <span class="dg-suffix">${buyMode === 'inr' ? 'INR' : 'GRAMS'}</span>
                  </div>

                  <!-- Quick Preset Pills -->
                  ${buyMode === 'inr' ? `
                    <div class="dg-quick-pills">
                      <button type="button" class="dg-pill-btn" data-set-buy="100">₹100</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="500">₹500</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="1000">₹1,000</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="2500">₹2,500</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="5000">₹5,000</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="10000">₹10,000</button>
                    </div>
                  ` : `
                    <div class="dg-quick-pills">
                      <button type="button" class="dg-pill-btn" data-set-buy="0.1">0.1g</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="0.5">0.5g</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="1.0">1.0g</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="5.0">5.0g</button>
                      <button type="button" class="dg-pill-btn" data-set-buy="10.0">10g (Tola)</button>
                    </div>
                  `}
                </div>

                <!-- Transparent Invoice Breakdown -->
                <div class="dg-quote-receipt-card">
                  <div class="dg-receipt-row">
                    <span>24K Pure Gold Credited:</span>
                    <strong style="color: var(--gold-bright); font-size: 1.15rem;">+${buyQuote.goldGrams.toFixed(4)} Grams</strong>
                  </div>
                  <div class="dg-receipt-row">
                    <span>Bullion Metal Value:</span>
                    <span>${formatINR(buyQuote.metalCost)}</span>
                  </div>
                  <div class="dg-receipt-row">
                    <span>Statutory 3% GST:</span>
                    <span>${formatINR(buyQuote.gstAmount)}</span>
                  </div>
                  <div class="dg-receipt-row dg-receipt-total">
                    <span>TOTAL PAYABLE AMOUNT:</span>
                    <strong class="dg-total-val">${formatINR(buyQuote.totalAmount)}</strong>
                  </div>
                </div>

                <!-- CTA Action -->
                <div style="margin-top: 1.5rem;">
                  ${currentUser ? `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-submit-buy">
                      <span>Pay ${formatINR(buyQuote.totalAmount)} & Credit ${buyQuote.goldGrams.toFixed(4)}g to Vault</span>
                      <span>→</span>
                    </button>
                  ` : `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-login-for-dg">
                      <span>Sign In to Buy Digital Gold</span>
                      <span>→</span>
                    </button>
                  `}
                </div>
              </div>
            ` : ''}

            <!-- TAB 2: SELL DIGITAL GOLD -->
            ${activeTab === 'sell' ? `
              <div class="dg-tab-content">
                <div class="dg-pane-head">
                  <h3 class="dg-pane-title">Sell 24K Gold to Bank</h3>
                  <p class="dg-pane-sub">Direct instant payout to your verified Bank Account or UPI ID.</p>
                </div>

                <!-- Balance Notice -->
                <div class="dg-balance-strip">
                  <span style="font-size: 0.82rem; color: var(--text-muted);">Available Vault Balance:</span>
                  <strong style="color: var(--gold-bright); font-size: 0.95rem;">${vault.grams.toFixed(4)} Grams (≈ ${formatINR(Math.round(vault.grams * rates.sellRatePerGram))})</strong>
                </div>

                <div class="dg-input-box">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="form-label" style="font-size: 0.8rem; margin: 0; text-transform: uppercase;">Grams to Sell</label>
                    <button type="button" class="btn-text-link" id="btn-sell-all" style="font-size: 0.75rem; color: var(--gold-bright); background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: 600;">
                      Sell Max (${vault.grams.toFixed(4)}g)
                    </button>
                  </div>
                  <div class="dg-input-row">
                    <span class="dg-prefix">⚖️</span>
                    <input type="number" id="input-sell-grams" class="dg-number-input" value="${sellInputGrams}" min="0.01" max="${vault.grams}" step="0.05" />
                    <span class="dg-suffix">GRAMS</span>
                  </div>
                </div>

                <!-- Sell Payout Quote -->
                <div class="dg-quote-receipt-card">
                  <div class="dg-receipt-row">
                    <span>Gold to Deduct from Vault:</span>
                    <strong style="color: #ff6b6b;">−${sellQuote.grams.toFixed(4)} Grams</strong>
                  </div>
                  <div class="dg-receipt-row">
                    <span>Live Selling Rate:</span>
                    <span>₹${sellQuote.ratePerGram}/g</span>
                  </div>
                  <div class="dg-receipt-row dg-receipt-total">
                    <span>INSTANT PAYOUT AMOUNT:</span>
                    <strong style="color: #34d399; font-size: 1.25rem;">${formatINR(sellQuote.payoutAmount)}</strong>
                  </div>
                </div>

                <!-- Payout Destination Form -->
                <div class="dg-payout-box">
                  <h4 style="font-size: 0.88rem; color: #fff; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">Payout Destination</h4>
                  <div style="margin-bottom: 0.75rem;">
                    <label class="form-label" style="font-size: 0.75rem;">UPI ID (Fastest Credit)</label>
                    <input type="text" id="payout-upi" class="form-input" placeholder="e.g. mobile@okhdfcbank" />
                  </div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin: 0.4rem 0;">— OR BANK ACCOUNT —</div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
                    <div>
                      <label class="form-label" style="font-size: 0.75rem;">Account Number</label>
                      <input type="text" id="payout-acc" class="form-input" placeholder="e.g. 50100234567890" />
                    </div>
                    <div>
                      <label class="form-label" style="font-size: 0.75rem;">IFSC Code</label>
                      <input type="text" id="payout-ifsc" class="form-input" placeholder="e.g. HDFC0001234" />
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div style="margin-top: 1.5rem;">
                  ${currentUser ? `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-submit-sell" ${vault.grams < sellQuote.grams || sellQuote.grams <= 0 ? 'disabled' : ''}>
                      <span>Sell ${sellQuote.grams.toFixed(4)}g & Transfer ${formatINR(sellQuote.payoutAmount)}</span>
                      <span>→</span>
                    </button>
                  ` : `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-login-for-dg">
                      <span>Sign In to Sell Digital Gold</span>
                      <span>→</span>
                    </button>
                  `}
                </div>
              </div>
            ` : ''}

            <!-- TAB 3: REDEEM DIGITAL GOLD -->
            ${activeTab === 'redeem' ? `
              <div class="dg-tab-content">
                <div class="dg-pane-head">
                  <h3 class="dg-pane-title">Redeem for Physical Jewellery</h3>
                  <p class="dg-pane-sub">Convert accumulated grams into instant store vouchers or minted 24K gold coins.</p>
                </div>

                <!-- Balance Notice -->
                <div class="dg-balance-strip">
                  <span style="font-size: 0.82rem; color: var(--text-muted);">Available in Vault:</span>
                  <strong style="color: var(--gold-bright); font-size: 0.95rem;">${vault.grams.toFixed(4)} Grams (Min 0.5g to redeem)</strong>
                </div>

                <!-- Option Selection Cards -->
                <div class="dg-redeem-options-grid">
                  <div class="dg-redeem-type-card ${redeemType === 'STORE_VOUCHER' ? 'active' : ''}" data-redeem-type="STORE_VOUCHER">
                    <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">🛍️</div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Store Jewellery Voucher</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Instant discount voucher code for online or boutique checkout.</div>
                  </div>

                  <div class="dg-redeem-type-card ${redeemType === 'PHYSICAL_COIN' ? 'active' : ''}" data-redeem-type="PHYSICAL_COIN">
                    <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">🪙</div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">24K Minted Gold Coin</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Doorstep delivery in tamper-proof assay-certified CertiCard pack.</div>
                  </div>
                </div>

                <!-- Grams to Redeem Input -->
                <div class="dg-input-box">
                  <label class="form-label" style="font-size: 0.8rem; text-transform: uppercase;">Grams to Redeem (Min 0.5g)</label>
                  <div class="dg-input-row">
                    <span class="dg-prefix">⚖️</span>
                    <input type="number" id="input-redeem-grams" class="dg-number-input" value="${redeemInputGrams}" min="0.5" max="${vault.grams}" step="0.5" />
                    <span class="dg-suffix">GRAMS</span>
                  </div>
                </div>

                <div class="dg-quote-receipt-card">
                  <div class="dg-receipt-row">
                    <span>Gold to Deduct:</span>
                    <strong style="color: var(--gold-bright);">${redeemInputGrams} Grams</strong>
                  </div>
                  <div class="dg-receipt-row">
                    <span>Equivalent Jewellery Value:</span>
                    <strong style="color: #34d399; font-size: 1.15rem;">${formatINR(Math.round(redeemInputGrams * rates.buyRatePerGram))}</strong>
                  </div>
                </div>

                ${redeemType === 'PHYSICAL_COIN' ? `
                  <div class="dg-payout-box" style="margin-top: 1rem;">
                    <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 0.5rem; text-transform: uppercase;">Doorstep Delivery Address</h4>
                    <input type="text" id="redeem-address" class="form-input" placeholder="Complete Street Address, City, State & PIN code" />
                  </div>
                ` : ''}

                <!-- Action Button -->
                <div style="margin-top: 1.5rem;">
                  ${currentUser ? `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-submit-redeem" ${vault.grams < redeemInputGrams || vault.grams < 0.5 ? 'disabled' : ''}>
                      <span>Redeem ${redeemInputGrams}g (${formatINR(Math.round(redeemInputGrams * rates.buyRatePerGram))})</span>
                      <span>👑</span>
                    </button>
                  ` : `
                    <button type="button" class="btn btn-gold btn-block dg-cta-btn" id="btn-login-for-dg">
                      <span>Sign In to Redeem</span>
                      <span>→</span>
                    </button>
                  `}
                </div>
              </div>
            ` : ''}

            <!-- TAB 4: PASSBOOK / TRANSACTION LEDGER -->
            ${activeTab === 'passbook' ? `
              <div class="dg-tab-content">
                <div class="dg-pane-head">
                  <h3 class="dg-pane-title">Vault Passbook & Audit Trail</h3>
                  <p class="dg-pane-sub">Itemized ledger of all your 24K gold purchases, sales, and redemptions.</p>
                </div>

                ${vault.transactions && vault.transactions.length > 0 ? `
                  <div class="dg-tx-list">
                    ${vault.transactions.map(tx => {
                      const isBuy = tx.type === 'BUY';
                      const isSell = tx.type === 'SELL';

                      return `
                        <div class="dg-tx-row">
                          <div class="dg-tx-icon-col ${tx.type.toLowerCase()}">
                            ${isBuy ? '📥' : isSell ? '📤' : '👑'}
                          </div>
                          <div class="dg-tx-info-col">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2px;">
                              <span class="dg-tx-type-tag ${tx.type.toLowerCase()}">${tx.type}</span>
                              <strong style="color: #fff; font-size: 0.9rem;">${tx.title}</strong>
                            </div>
                            <div style="font-size: 0.74rem; color: var(--text-muted);">
                              ${new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Ref: ${tx.txId}
                            </div>
                            ${tx.voucherCode ? `
                              <div style="font-size: 0.78rem; color: #34d399; font-weight: 700; margin-top: 4px;">
                                Voucher Code: <span style="background: rgba(0,0,0,0.6); border: 1px solid var(--border-gold); padding: 2px 8px; border-radius: 4px; font-family: monospace; letter-spacing: 0.05em;">${tx.voucherCode}</span>
                              </div>
                            ` : ''}
                          </div>
                          <div class="dg-tx-amount-col">
                            <div style="font-size: 1.1rem; font-weight: 800; color: ${isBuy ? '#34d399' : isSell ? '#ff6b6b' : 'var(--gold-bright)'};">
                              ${isBuy ? '+' : '−'}${tx.grams.toFixed(4)}g
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">
                              ${tx.amountInr ? formatINR(tx.amountInr) : tx.payoutAmount ? formatINR(tx.payoutAmount) : formatINR(tx.equivalentValueInr || 0)}
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : `
                  <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📜</div>
                    <h4 style="color: #fff; margin-bottom: 0.35rem;">No Transactions Recorded</h4>
                    <p style="font-size: 0.85rem;">Every purchase, sale, or redemption will appear in this audited ledger.</p>
                  </div>
                `}
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    `;

    attachEvents();
  };

  const attachEvents = () => {
    // Tab switching
    container.querySelectorAll('.dg-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Buy mode switching (inr vs grams)
    container.querySelectorAll('.dg-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        buyMode = btn.getAttribute('data-buy-mode');
        buyInputVal = buyMode === 'inr' ? 1000 : 0.5;
        render();
      });
    });

    // Buy input value change
    const buyInput = container.querySelector('#input-buy-val');
    buyInput?.addEventListener('input', (e) => {
      buyInputVal = parseFloat(e.target.value) || 0;
      // Re-render quote dynamically
      render();
    });

    // Buy quick pills
    container.querySelectorAll('.dg-pill-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        buyInputVal = parseFloat(pill.getAttribute('data-set-buy')) || 1000;
        render();
      });
    });

    // Sell input grams change
    const sellInput = container.querySelector('#input-sell-grams');
    sellInput?.addEventListener('input', (e) => {
      sellInputGrams = parseFloat(e.target.value) || 0;
      render();
    });

    // Sell all button
    container.querySelector('#btn-sell-all')?.addEventListener('click', () => {
      const vault = getDigitalGoldVault(currentUser?.uid);
      sellInputGrams = vault.grams;
      render();
    });

    // Redeem type switching
    container.querySelectorAll('.dg-redeem-type-card').forEach(card => {
      card.addEventListener('click', () => {
        redeemType = card.getAttribute('data-redeem-type');
        render();
      });
    });

    // Redeem grams input change
    const redeemInput = container.querySelector('#input-redeem-grams');
    redeemInput?.addEventListener('input', (e) => {
      redeemInputGrams = parseFloat(e.target.value) || 0;
      render();
    });

    // Sign in redirect
    container.querySelectorAll('#btn-login-for-dg').forEach(btn => {
      btn.addEventListener('click', () => {
        onOpenAuthModal?.('login');
      });
    });

    // 1. Submit Buy Digital Gold
    container.querySelector('#btn-submit-buy')?.addEventListener('click', () => {
      try {
        const result = buyDigitalGold({
          user: currentUser,
          amountInr: buyMode === 'inr' ? buyInputVal : 0,
          grams: buyMode === 'grams' ? buyInputVal : 0,
          mode: buyMode,
          paymentMethod: 'UPI'
        });

        alert(`🎉 SUCCESS! 24K DIGITAL GOLD CREDITED!\n\n• Gold Added: +${result.transaction.grams.toFixed(4)} Grams\n• Amount Paid: ${formatINR(result.transaction.amountInr)}\n• Invoice: ${result.transaction.invoiceNumber}\n\nYour gold is securely stored in Vaishu Jewellery's insured bullion vault.`);
        activeTab = 'passbook';
        render();
      } catch (err) {
        alert('Purchase failed: ' + err.message);
      }
    });

    // 2. Submit Sell Digital Gold
    container.querySelector('#btn-submit-sell')?.addEventListener('click', () => {
      const upiId = container.querySelector('#payout-upi')?.value?.trim();
      const acc = container.querySelector('#payout-acc')?.value?.trim();
      const ifsc = container.querySelector('#payout-ifsc')?.value?.trim();

      try {
        const result = sellDigitalGold({
          user: currentUser,
          grams: sellInputGrams,
          payoutDetails: { upiId, accountNumber: acc, ifsc }
        });

        alert(`✓ SUCCESS! 24K GOLD SOLD!\n\n• Gold Sold: −${result.transaction.grams.toFixed(4)} Grams\n• Payout Amount: ${formatINR(result.transaction.payoutAmount)}\n• Destination: ${result.transaction.payoutDetails}\n• Reference: ${result.transaction.referenceNo}\n\nAmount has been initiated for transfer.`);
        activeTab = 'passbook';
        render();
      } catch (err) {
        alert('Sell failed: ' + err.message);
      }
    });

    // 3. Submit Redeem Digital Gold
    container.querySelector('#btn-submit-redeem')?.addEventListener('click', () => {
      const address = container.querySelector('#redeem-address')?.value?.trim();

      if (redeemType === 'PHYSICAL_COIN' && !address) {
        alert('Please enter your complete delivery shipping address.');
        return;
      }

      try {
        const result = redeemDigitalGold({
          user: currentUser,
          grams: redeemInputGrams,
          redemptionType: redeemType,
          deliveryAddress: address
        });

        if (redeemType === 'STORE_VOUCHER') {
          alert(`🎉 REDEEMED TO STORE VOUCHER!\n\n• Gold Converted: −${result.transaction.grams.toFixed(4)} Grams\n• Voucher Value: ${formatINR(result.valueInr)}\n• Voucher Code: ${result.voucherCode}\n\nYou can now use this voucher code at checkout to purchase jewellery!`);
        } else {
          alert(`🎉 24K GOLD COIN DISPATCH INITIATED!\n\n• Weight: ${result.transaction.grams.toFixed(4)} Grams 24K Pure Coin\n• Shipping Address: ${address}\n• Fully Insured Doorstep Delivery initiated.`);
        }

        activeTab = 'passbook';
        render();
      } catch (err) {
        alert('Redeem failed: ' + err.message);
      }
    });
  };

  render();
}
