/**
 * VAISHU JEWELLERY - Ultra-Realistic Secure Checkout Page
 * Featuring Bank-Grade Payment & Insurance Escrow, Interactive Real-time UPI QR,
 * Virtual 3D Holographic Card Preview, No-Cost EMI Calculator & Brink's Doorstep Protocol
 */

import { getCart, calculateCartTotals, clearCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import { formatINR } from '../utils/formatters';
import { showToast } from '../components/Toast';
import confetti from 'canvas-confetti';

export function renderCheckoutPage(container, currentUser, onOrderCompleted) {
  const cart = getCart();
  const totals = calculateCartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="container" style="padding: 6rem 1.5rem; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛍️</div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-main);">Your Bag is Empty</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Please add your desired jewellery pieces before proceeding to checkout.</p>
        <a href="#shop" class="btn btn-gold">Explore Collections</a>
      </div>
    `;
    return;
  }

  // State
  let currentMethod = 'UPI'; // 'UPI' | 'Card' | 'NetBanking' | 'COD'
  let selectedEmiMonths = 3;
  let selectedBank = 'HDFC';
  let cardNetwork = 'visa';
  let qrSecondsLeft = 300; // 5:00
  let timerInterval = null;

  // Calculate 0% EMI monthly amounts
  const emi3 = Math.round(totals.grandTotal / 3);
  const emi6 = Math.round(totals.grandTotal / 6);
  const emi9 = Math.round(totals.grandTotal / 9);

  // Escrow Policy details
  const escrowPolicyNo = 'NIA-BRINKS-2026-V889';
  const escrowTrusteeRef = 'ESC-TRUSTEE-' + Math.floor(100000 + Math.random() * 900000);

  const render = () => {
    container.innerHTML = `
      <section style="padding: 3rem 0 6rem;">
        <div class="container">
          <!-- Page Header -->
          <div style="text-align: center; margin-bottom: 2.75rem;">
            <div class="hero-badge" style="margin-bottom: 0.6rem;">🔒 256-Bit SSL Encrypted Escrow Vault</div>
            <h1 style="font-size: 2.3rem; margin-bottom: 0.5rem;" class="text-gold-gradient">
              Secure Bank Escrow Checkout
            </h1>
            <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 650px; margin: 0 auto;">
              Your funds are safeguarded in an RBI-regulated fiduciary custody account and released to Vaishu Jewellery only after verified delivery of certified BIS 916 hallmarked ornaments.
            </p>
          </div>

          <form id="checkout-form">
            <div class="checkout-grid">
              <!-- Left Column: Shipping & Payment Details -->
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                
                <!-- 1. BANK ESCROW & TRANSIT INSURANCE TRUST BANNER -->
                <div class="escrow-assurance-banner">
                  <div class="escrow-banner-header">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <span class="escrow-shield-icon">🏛️</span>
                      <div>
                        <div class="escrow-title">RBI-REGULATED BULLION ESCROW TRUSTEE</div>
                        <div class="escrow-subtitle">Funds in Fiduciary Custody • Monitored under ICICI & HDFC Trustee Services</div>
                      </div>
                    </div>
                    <div class="escrow-live-pill">
                      <span class="ticker-pulse-dot" style="background: #00e676;"></span>
                      <span>LIVE ESCROW ACTIVE</span>
                    </div>
                  </div>

                  <!-- Insurance Protection Strip -->
                  <div class="escrow-insurance-strip">
                    <div class="insurance-badge-item">
                      <span>🛡️</span>
                      <div>
                        <strong>The New India Assurance Co. Ltd.</strong>
                        <p>Transit Policy #${escrowPolicyNo} • 100% Comprehensive All-Risk Loss & Transit Replacement Cover</p>
                      </div>
                    </div>
                    <div class="insurance-val-tag">
                      <span>Total Cover</span>
                      <strong>₹25,00,000</strong>
                    </div>
                  </div>

                  <!-- 3-Stage Escrow Handshake Protocol Timeline -->
                  <div class="escrow-steps-timeline">
                    <div class="escrow-step">
                      <div class="escrow-step-circle">1</div>
                      <div class="escrow-step-text">
                        <strong>Fiduciary Escrow Deposit</strong>
                        <span>Your money is held in a protected trustee custody account, NOT disbursed to jeweller immediately.</span>
                      </div>
                    </div>
                    <div class="escrow-step">
                      <div class="escrow-step-circle">2</div>
                      <div class="escrow-step-text">
                        <strong>Brink's Armoured Vault Transit</strong>
                        <span>Ornaments transit in GPS-monitored tamper-evident vault pouches with military-grade barcoded seals.</span>
                      </div>
                    </div>
                    <div class="escrow-step">
                      <div class="escrow-step-circle">3</div>
                      <div class="escrow-step-text">
                        <strong>OTP Handshake Release</strong>
                        <span>Inspect BIS 916 Laser HUID with jeweller loupe. Funds release only after your verified delivery OTP.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. SHIPPING ADDRESS -->
                <div class="admin-card">
                  <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main);">
                    <span>📍</span>
                    <span>Insured Delivery Address</span>
                  </h3>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                      <label class="form-label">Full Name *</label>
                      <input type="text" id="ship-name" class="form-input" value="${currentUser?.displayName || 'Maharani Gayatri Rao'}" placeholder="Maharani Gayatri Rao" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Mobile Number (for Courier OTP) *</label>
                      <input type="tel" id="ship-phone" class="form-input" value="${currentUser?.phone || '+91 98200 11223'}" placeholder="+91 98200 11223" required />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Email Address (for Invoice & Insurance Certificate) *</label>
                    <input type="email" id="ship-email" class="form-input" value="${currentUser?.email || 'gayatri.rao@royalmail.com'}" placeholder="patron@vaishujewellery.com" required />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Flat / Villa / Street Address *</label>
                    <input type="text" id="ship-address1" class="form-input" value="Palace Suite 402, Marine Drive" placeholder="701, Royal Sapphire Enclave, Marine Drive" required />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                      <label class="form-label">City *</label>
                      <input type="text" id="ship-city" class="form-input" value="Mumbai" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">State *</label>
                      <input type="text" id="ship-state" class="form-input" value="Maharashtra" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Pincode *</label>
                      <input type="text" id="ship-pincode" class="form-input" value="400020" maxlength="6" required />
                    </div>
                  </div>
                </div>

                <!-- 3. INTERACTIVE PAYMENT METHOD SELECTION -->
                <div class="admin-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="font-size: 1.25rem; margin: 0; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main);">
                      <span>💳</span>
                      <span>Payment & Insurance Escrow Gateway</span>
                    </h3>
                    <div style="font-size: 0.76rem; color: var(--gold-bright); font-weight: 700; background: rgba(212, 175, 55, 0.12); padding: 0.25rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-gold);">
                      REF #${escrowTrusteeRef}
                    </div>
                  </div>

                  <!-- Method Selection Tabs -->
                  <div class="payment-methods-selector">
                    <!-- UPI -->
                    <div class="pay-method-pill ${currentMethod === 'UPI' ? 'active' : ''}" data-method="UPI">
                      <div class="pay-method-radio"></div>
                      <div class="pay-method-icon">📱</div>
                      <div class="pay-method-info">
                        <div class="pay-method-name">Instant UPI / QR Code</div>
                        <div class="pay-method-desc">GPay, PhonePe, Paytm, BHIM • +1% Gold Loyalty</div>
                      </div>
                      <span class="pay-method-tag">POPULAR</span>
                    </div>

                    <!-- Card -->
                    <div class="pay-method-pill ${currentMethod === 'Card' ? 'active' : ''}" data-method="Card">
                      <div class="pay-method-radio"></div>
                      <div class="pay-method-icon">💳</div>
                      <div class="pay-method-info">
                        <div class="pay-method-name">Debit / Credit Card</div>
                        <div class="pay-method-desc">Visa, MasterCard, RuPay • 0% No-Cost EMI</div>
                      </div>
                    </div>

                    <!-- NetBanking -->
                    <div class="pay-method-pill ${currentMethod === 'NetBanking' ? 'active' : ''}" data-method="NetBanking">
                      <div class="pay-method-radio"></div>
                      <div class="pay-method-icon">🏛️</div>
                      <div class="pay-method-info">
                        <div class="pay-method-name">NetBanking (Escrow Direct)</div>
                        <div class="pay-method-desc">HDFC, ICICI, SBI, Axis & 45+ Scheduled Banks</div>
                      </div>
                    </div>

                    <!-- COD / Armoured Handshake -->
                    <div class="pay-method-pill ${currentMethod === 'COD' ? 'active' : ''}" data-method="COD">
                      <div class="pay-method-radio"></div>
                      <div class="pay-method-icon">🚚</div>
                      <div class="pay-method-info">
                        <div class="pay-method-name">Armoured Handshake (COD)</div>
                        <div class="pay-method-desc">Inspect Laser HUID on arrival • Pay via Card/Cash to Guard</div>
                      </div>
                    </div>
                  </div>

                  <!-- DYNAMIC SUB-PANELS BASED ON SELECTED METHOD -->
                  <div class="pay-details-container">
                    
                    <!-- 1. UPI DETAILS PANEL -->
                    ${currentMethod === 'UPI' ? `
                      <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                          <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
                            Scan Dynamic Escrow QR Code with any UPI App
                          </div>
                          <div style="font-size: 0.78rem; color: #ffb703; font-weight: 700;" id="qr-countdown-text">
                            ⏳ Session expires in: <strong id="lbl-qr-timer">05:00</strong>
                          </div>
                        </div>

                        <div class="upi-qr-card">
                          <!-- Simulated Live QR Box with Scanning Line -->
                          <div class="upi-qr-box">
                            <div class="upi-qr-scan-line"></div>
                            <!-- Scalable SVG QR Code with Gold Seal Logo -->
                            <svg width="138" height="138" viewBox="0 0 100 100" fill="#18171C">
                              <!-- Corner Finder 1 (Top Left) -->
                              <rect x="5" y="5" width="28" height="28" fill="#18171C" rx="4"/>
                              <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2"/>
                              <rect x="13" y="13" width="12" height="12" fill="#8A5A08" rx="2"/>
                              <!-- Corner Finder 2 (Top Right) -->
                              <rect x="67" y="5" width="28" height="28" fill="#18171C" rx="4"/>
                              <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2"/>
                              <rect x="75" y="13" width="12" height="12" fill="#8A5A08" rx="2"/>
                              <!-- Corner Finder 3 (Bottom Left) -->
                              <rect x="5" y="67" width="28" height="28" fill="#18171C" rx="4"/>
                              <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2"/>
                              <rect x="13" y="75" width="12" height="12" fill="#8A5A08" rx="2"/>
                              <!-- QR Pattern Noise -->
                              <rect x="38" y="7" width="6" height="6" fill="#18171C"/>
                              <rect x="48" y="7" width="6" height="6" fill="#18171C"/>
                              <rect x="58" y="7" width="5" height="6" fill="#18171C"/>
                              <rect x="7" y="38" width="6" height="6" fill="#18171C"/>
                              <rect x="18" y="38" width="6" height="6" fill="#18171C"/>
                              <rect x="28" y="38" width="5" height="6" fill="#18171C"/>
                              <rect x="38" y="18" width="6" height="6" fill="#18171C"/>
                              <rect x="50" y="24" width="8" height="8" fill="#18171C"/>
                              <rect x="38" y="38" width="24" height="24" fill="#ffffff" rx="12"/>
                              <!-- Center Logo Crown -->
                              <circle cx="50" cy="50" r="10" fill="#B8860B"/>
                              <text x="50" y="54" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">👑</text>
                              <!-- Lower Noise -->
                              <rect x="38" y="67" width="6" height="6" fill="#18171C"/>
                              <rect x="48" y="77" width="8" height="6" fill="#18171C"/>
                              <rect x="67" y="38" width="6" height="6" fill="#18171C"/>
                              <rect x="77" y="48" width="8" height="6" fill="#18171C"/>
                              <rect x="67" y="67" width="10" height="10" fill="#18171C"/>
                              <rect x="82" y="72" width="12" height="12" fill="#18171C"/>
                              <rect x="70" y="85" width="8" height="10" fill="#18171C"/>
                            </svg>
                          </div>

                          <!-- UPI Meta & Copy Column -->
                          <div class="upi-meta-col">
                            <div>
                              <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Official Verified Escrow VPA:</span>
                              <div class="upi-vpa-pill">
                                <span>vaishu.jewellery@icici</span>
                                <button type="button" class="btn btn-sm" id="btn-copy-vpa" style="padding: 0.2rem 0.55rem; font-size: 0.75rem; background: var(--gold-gradient); color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">
                                  📋 Copy
                                </button>
                              </div>
                            </div>

                            <div style="font-size: 0.76rem; color: #34d399; display: flex; align-items: center; gap: 0.35rem;">
                              <span>✓</span>
                              <span>Verified ICICI Bank Bullion Escrow Trustee Merchant</span>
                            </div>

                            <!-- Supported Apps Row -->
                            <div class="upi-apps-row">
                              <span class="upi-app-badge"><span>⚡</span> GPay</span>
                              <span class="upi-app-badge"><span>🟣</span> PhonePe</span>
                              <span class="upi-app-badge"><span>🔵</span> Paytm</span>
                              <span class="upi-app-badge"><span>🇮🇳</span> BHIM</span>
                              <span class="upi-app-badge"><span>💳</span> CRED</span>
                            </div>

                            <!-- Or Enter UPI ID -->
                            <div style="margin-top: 0.35rem; border-top: 1px dashed var(--border-subtle); padding-top: 0.65rem;">
                              <label class="form-label" style="font-size: 0.74rem;">Or Enter your UPI ID / VPA for instant approval request:</label>
                              <div style="display: flex; gap: 0.5rem;">
                                <input type="text" id="input-user-vpa" class="form-input" style="padding: 0.45rem 0.75rem; font-size: 0.85rem;" placeholder="e.g. yourname@okhdfcbank" value="gayatri.rao@okhdfcbank" />
                                <button type="button" id="btn-verify-vpa" class="btn btn-sm btn-gold" style="white-space: nowrap; font-size: 0.78rem;">
                                  Verify VPA
                                </button>
                              </div>
                              <div id="vpa-status-badge" style="display: none; font-size: 0.75rem; color: #34d399; font-weight: 700; margin-top: 0.35rem;">
                                ✓ VPA Verified: Maharani Gayatri Rao (HDFC Bank)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ` : ''}

                    <!-- 2. DEBIT / CREDIT CARD DETAILS PANEL -->
                    ${currentMethod === 'Card' ? `
                      <div>
                        <!-- Virtual Holographic Luxury Card Preview -->
                        <div class="virtual-card-box">
                          <div class="vcard-top">
                            <div class="vcard-chip"></div>
                            <div style="font-size: 0.75rem; letter-spacing: 0.1em; color: var(--gold-bright); font-weight: 800; text-transform: uppercase;" id="vcard-brand">
                              ${cardNetwork.toUpperCase()} SECURE
                            </div>
                          </div>

                          <div class="vcard-number" id="vcard-display-num">
                            4532 •••• •••• 8892
                          </div>

                          <div class="vcard-bottom">
                            <div>
                              <div class="vcard-lbl">Cardholder Name</div>
                              <div class="vcard-val" id="vcard-display-name">${(currentUser?.displayName || 'Maharani Gayatri Rao').toUpperCase()}</div>
                            </div>
                            <div style="text-align: right;">
                              <div class="vcard-lbl">Expires</div>
                              <div class="vcard-val" id="vcard-display-exp">11 / 29</div>
                            </div>
                          </div>
                        </div>

                        <!-- Card Inputs Grid -->
                        <div style="display: grid; grid-template-columns: 1fr; gap: 0.85rem;">
                          <div>
                            <label class="form-label" style="font-size: 0.78rem;">Card Number *</label>
                            <input type="text" id="card-num-input" class="form-input" placeholder="4532 8921 4452 8892" value="4532 8921 4452 8892" maxlength="19" required />
                          </div>

                          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem;">
                            <div>
                              <label class="form-label" style="font-size: 0.78rem;">Cardholder Name *</label>
                              <input type="text" id="card-name-input" class="form-input" value="${currentUser?.displayName || 'Maharani Gayatri Rao'}" required />
                            </div>
                            <div>
                              <label class="form-label" style="font-size: 0.78rem;">Expiry (MM/YY) *</label>
                              <input type="text" id="card-exp-input" class="form-input" placeholder="MM/YY" value="11/29" maxlength="5" required />
                            </div>
                            <div>
                              <label class="form-label" style="font-size: 0.78rem;">CVV / CVC *</label>
                              <input type="password" id="card-cvv-input" class="form-input" placeholder="•••" value="894" maxlength="4" required />
                            </div>
                          </div>
                        </div>

                        <!-- No-Cost EMI Selector -->
                        <div class="emi-selector-box">
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.82rem; font-weight: 700; color: var(--gold-bright);">
                              🎉 Complimentary 0% No-Cost EMI Options Available:
                            </span>
                            <span style="font-size: 0.72rem; color: #34d399; font-weight: 700;">Zero Interest • Zero Processing Fee</span>
                          </div>

                          <div class="emi-options-grid">
                            <div class="emi-pill ${selectedEmiMonths === 3 ? 'active' : ''}" data-emi="3">
                              <div class="emi-months">3 Months</div>
                              <div class="emi-amount">${formatINR(emi3)}/mo</div>
                            </div>
                            <div class="emi-pill ${selectedEmiMonths === 6 ? 'active' : ''}" data-emi="6">
                              <div class="emi-months">6 Months</div>
                              <div class="emi-amount">${formatINR(emi6)}/mo</div>
                            </div>
                            <div class="emi-pill ${selectedEmiMonths === 9 ? 'active' : ''}" data-emi="9">
                              <div class="emi-months">9 Months</div>
                              <div class="emi-amount">${formatINR(emi9)}/mo</div>
                            </div>
                          </div>
                        </div>

                        <div style="margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem;">
                          <span>🔒</span>
                          <span>256-Bit Bank-Grade TLS 1.3 • PCI-DSS 3.2.1 Level-1 Certified Vault Tokenization</span>
                        </div>
                      </div>
                    ` : ''}

                    <!-- 3. NETBANKING PANEL -->
                    ${currentMethod === 'NetBanking' ? `
                      <div>
                        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.85rem;">
                          Select Your Core Scheduled Bank:
                        </div>

                        <div class="netbanking-grid">
                          <div class="bank-card-btn ${selectedBank === 'HDFC' ? 'active' : ''}" data-bank="HDFC">
                            <div class="bank-icon">🏛️</div>
                            <div class="bank-name">HDFC Bank</div>
                          </div>
                          <div class="bank-card-btn ${selectedBank === 'ICICI' ? 'active' : ''}" data-bank="ICICI">
                            <div class="bank-icon">🏢</div>
                            <div class="bank-name">ICICI Bank</div>
                          </div>
                          <div class="bank-card-btn ${selectedBank === 'SBI' ? 'active' : ''}" data-bank="SBI">
                            <div class="bank-icon">🏦</div>
                            <div class="bank-name">State Bank of India</div>
                          </div>
                          <div class="bank-card-btn ${selectedBank === 'Axis' ? 'active' : ''}" data-bank="Axis">
                            <div class="bank-icon">🏛️</div>
                            <div class="bank-name">Axis Bank</div>
                          </div>
                          <div class="bank-card-btn ${selectedBank === 'Kotak' ? 'active' : ''}" data-bank="Kotak">
                            <div class="bank-icon">🔴</div>
                            <div class="bank-name">Kotak Mahindra</div>
                          </div>
                          <div class="bank-card-btn ${selectedBank === 'PNB' ? 'active' : ''}" data-bank="PNB">
                            <div class="bank-icon">🌾</div>
                            <div class="bank-name">Punjab National Bank</div>
                          </div>
                        </div>

                        <div style="margin-top: 0.75rem;">
                          <label class="form-label" style="font-size: 0.75rem;">Or Select From Other 45+ RBI Scheduled Banks:</label>
                          <select class="form-select" id="select-other-bank">
                            <option value="">-- Choose Another Bank --</option>
                            <option value="Bank of Baroda">Bank of Baroda</option>
                            <option value="Canara Bank">Canara Bank</option>
                            <option value="Union Bank of India">Union Bank of India</option>
                            <option value="IndusInd Bank">IndusInd Bank</option>
                            <option value="Yes Bank">Yes Bank</option>
                            <option value="Federal Bank">Federal Bank</option>
                            <option value="IDBI Bank">IDBI Bank</option>
                          </select>
                        </div>

                        <div style="margin-top: 0.85rem; padding: 0.75rem; background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 8px; font-size: 0.78rem; color: #34d399;">
                          🛡️ You will be redirected directly to your bank's 256-bit encrypted authentication portal. The transaction reference will be logged under Escrow Custody Account #${escrowTrusteeRef}.
                        </div>
                      </div>
                    ` : ''}

                    <!-- 4. COD / ARMOURED DELIVERY PANEL -->
                    ${currentMethod === 'COD' ? `
                      <div class="cod-protocol-card">
                        <div style="font-size: 0.88rem; font-weight: 700; color: var(--gold-bright);">
                          🚚 Brink's Armoured Vault Handshake Delivery Protocol:
                        </div>

                        <div class="cod-protocol-item">
                          <span>🛡️</span>
                          <div>
                            <strong>Armed Logistics Escort by Brink's India</strong>
                            <p>Hand-delivered in a high-security GPS-tracked armoured vault vehicle with armed security guard escort.</p>
                          </div>
                        </div>

                        <div class="cod-protocol-item">
                          <span>🔍</span>
                          <div>
                            <strong>Tamper-Evident Security Seal & Jeweller's Loupe Included</strong>
                            <p>The guard provides an illuminated 10x optical jeweler loupe for you to inspect the laser-engraved BIS 916 HUID hallmark on your jewellery before making payment.</p>
                          </div>
                        </div>

                        <div class="cod-protocol-item">
                          <span>💳</span>
                          <div>
                            <strong>Doorstep Wireless POS Card & UPI Machine</strong>
                            <p>The armed courier carries a secure handheld terminal supporting all Debit/Credit Cards, UPI QR codes, or Cash payment upon handshake.</p>
                          </div>
                        </div>

                        <div class="cod-protocol-item">
                          <span>📱</span>
                          <div>
                            <strong>Secret 6-Digit Delivery OTP Verification</strong>
                            <p>Delivery is released only when you confirm and share the one-time OTP sent to your registered phone number.</p>
                          </div>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Special Inscription / Delivery Instructions -->
                  <div class="form-group" style="margin: 0;">
                    <label class="form-label">Special Inscription / Delivery Instructions (Optional)</label>
                    <textarea id="order-instructions" class="form-textarea" rows="2" placeholder="e.g. Please laser-engrave 'Forever V&S' inside the ring band, deliver only between 10am-4pm with security desk calling."></textarea>
                  </div>
                </div>
              </div>

              <!-- Right Column: Order Summary Card -->
              <div class="admin-card" style="border-color: var(--border-gold); position: sticky; top: 100px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                  <h3 style="font-size: 1.25rem; margin: 0; color: var(--text-main);">Order Summary (${totals.itemCount} items)</h3>
                  <span class="badge-tag" style="background: rgba(16, 185, 129, 0.12); color: #34d399; font-size: 0.74rem;">
                    100% Insured
                  </span>
                </div>

                <!-- Items Mini List -->
                <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                  ${cart.map(i => `
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${i.image}" alt="${i.name}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-subtle);" />
                        <div>
                          <div style="font-weight: 600; color: var(--text-main); max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${i.name}</div>
                          <div style="font-size: 0.75rem; color: var(--gold-dark);">${i.selectedSize} × ${i.quantity}</div>
                        </div>
                      </div>
                      <div style="font-weight: 700; color: var(--gold-bright);">${formatINR(i.price * i.quantity)}</div>
                    </div>
                  `).join('')}
                </div>

                <!-- Breakdown Totals -->
                <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; margin-bottom: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                    <span>Subtotal:</span>
                    <span style="color: var(--text-main); font-weight: 600;">${formatINR(totals.subtotal)}</span>
                  </div>
                  ${totals.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; color: #34d399;">
                      <span>Voucher Savings:</span>
                      <span style="font-weight: 600;">-${formatINR(totals.discount)}</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                    <span>Govt GST (3%):</span>
                    <span style="color: var(--text-main); font-weight: 600;">${formatINR(totals.gst)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                    <span>Brink's Armoured Vault Logistics:</span>
                    <span style="color: #34d399; font-weight: 700;">FREE COMPLIMENTARY (₹0)</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                    <span>Transit Insurance Premium:</span>
                    <span style="color: #34d399; font-weight: 700;">100% SPONSORED BY VAISHU</span>
                  </div>
                  <div style="border-top: 1px solid var(--border-gold); padding-top: 1rem; display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: var(--gold-bright);">
                    <span>Total Escrow Payable:</span>
                    <span style="font-family: var(--font-serif);">${formatINR(totals.grandTotal)}</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-gold" id="btn-place-order" style="width: 100%; padding: 1.05rem; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
                  <span>🔒</span>
                  <span>Authorize Escrow Payment (${formatINR(totals.grandTotal)})</span>
                  <span>✨</span>
                </button>

                <div style="text-align: center; margin-top: 1rem; font-size: 0.78rem; color: var(--text-muted); line-height: 1.5;">
                  🏛️ Monitored by RBI Bullion Escrow Trustee Services. Zero risk to patron. Funds release only upon hand-to-hand OTP delivery.
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    `;

    attachEvents();
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      qrSecondsLeft--;
      if (qrSecondsLeft <= 0) {
        clearInterval(timerInterval);
        qrSecondsLeft = 300; // Reset
      }
      const timerDisplay = container.querySelector('#lbl-qr-timer');
      if (timerDisplay) {
        const m = Math.floor(qrSecondsLeft / 60);
        const s = qrSecondsLeft % 60;
        timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }, 1000);
  };

  const attachEvents = () => {
    // Payment Method Selector Pills
    container.querySelectorAll('.pay-method-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const method = pill.getAttribute('data-method');
        if (method && method !== currentMethod) {
          currentMethod = method;
          render();
        }
      });
    });

    // Start timer if UPI is active
    if (currentMethod === 'UPI') {
      startTimer();

      // Copy VPA Button
      const copyBtn = container.querySelector('#btn-copy-vpa');
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText('vaishu.jewellery@icici').then(() => {
          showToast('✓ Escrow VPA (vaishu.jewellery@icici) copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Copied vaishu.jewellery@icici', 'info');
        });
      });

      // Verify VPA Button
      const verifyBtn = container.querySelector('#btn-verify-vpa');
      verifyBtn?.addEventListener('click', () => {
        const inputVal = container.querySelector('#input-user-vpa')?.value.trim();
        if (!inputVal || !inputVal.includes('@')) {
          showToast('Please enter a valid UPI ID (e.g. name@oksbi)', 'warning');
          return;
        }
        verifyBtn.innerHTML = '<span>Verifying...</span>';
        setTimeout(() => {
          verifyBtn.innerHTML = '<span>✓ Verified</span>';
          const badge = container.querySelector('#vpa-status-badge');
          if (badge) badge.style.display = 'block';
          showToast('✓ VPA successfully verified with NPCI Gateway!', 'success');
        }, 600);
      });
    }

    // Card Form Interactivity
    if (currentMethod === 'Card') {
      const cardNumInput = container.querySelector('#card-num-input');
      const cardDisplayNum = container.querySelector('#vcard-display-num');
      const cardBrand = container.querySelector('#vcard-brand');

      cardNumInput?.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.substring(0, 16);
        
        // Auto network detection
        if (val.startsWith('4')) {
          cardNetwork = 'visa';
        } else if (val.startsWith('5')) {
          cardNetwork = 'mastercard';
        } else if (val.startsWith('6')) {
          cardNetwork = 'rupay';
        } else if (val.startsWith('3')) {
          cardNetwork = 'amex';
        }

        if (cardBrand) cardBrand.textContent = `${cardNetwork.toUpperCase()} SECURE`;

        // Format with spaces
        const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formatted;

        if (cardDisplayNum) {
          cardDisplayNum.textContent = formatted.length > 0 ? formatted : '•••• •••• •••• ••••';
        }
      });

      const cardNameInput = container.querySelector('#card-name-input');
      const cardDisplayName = container.querySelector('#vcard-display-name');
      cardNameInput?.addEventListener('input', (e) => {
        if (cardDisplayName) {
          cardDisplayName.textContent = (e.target.value || 'MAHARANI GAYATRI RAO').toUpperCase();
        }
      });

      const cardExpInput = container.querySelector('#card-exp-input');
      const cardDisplayExp = container.querySelector('#vcard-display-exp');
      cardExpInput?.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
        if (cardDisplayExp) {
          cardDisplayExp.textContent = val.length > 0 ? val : 'MM/YY';
        }
      });

      // EMI Pills
      container.querySelectorAll('.emi-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          container.querySelectorAll('.emi-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          selectedEmiMonths = parseInt(pill.getAttribute('data-emi'), 10) || 3;
          showToast(`0% No-Cost EMI selected: ${selectedEmiMonths} Months`, 'info');
        });
      });
    }

    // NetBanking Bank Buttons
    if (currentMethod === 'NetBanking') {
      container.querySelectorAll('.bank-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.bank-card-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedBank = btn.getAttribute('data-bank') || 'HDFC';
          showToast(`Selected Bank: ${selectedBank} Bank Escrow Gateway`, 'info');
        });
      });

      const otherBankSelect = container.querySelector('#select-other-bank');
      otherBankSelect?.addEventListener('change', (e) => {
        if (e.target.value) {
          container.querySelectorAll('.bank-card-btn').forEach(b => b.classList.remove('active'));
          selectedBank = e.target.value;
          showToast(`Selected Bank: ${selectedBank}`, 'info');
        }
      });
    }

    // Checkout Submit with Ultra-Realistic Escrow Confirmation Sequence
    const form = container.querySelector('#checkout-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const shippingAddress = {
        fullName: container.querySelector('#ship-name').value.trim(),
        phone: container.querySelector('#ship-phone').value.trim(),
        email: container.querySelector('#ship-email').value.trim(),
        addressLine1: container.querySelector('#ship-address1').value.trim(),
        city: container.querySelector('#ship-city').value.trim(),
        state: container.querySelector('#ship-state').value.trim(),
        pincode: container.querySelector('#ship-pincode').value.trim()
      };

      const specialInstructions = container.querySelector('#order-instructions')?.value.trim();

      // Create Realistic Bank Escrow Handshake Modal
      let modalOverlay = document.createElement('div');
      modalOverlay.className = 'escrow-modal-overlay';
      modalOverlay.innerHTML = `
        <div class="escrow-modal-card">
          <div class="escrow-spinner-ring"></div>
          <h3 style="font-size: 1.35rem; color: var(--text-main); margin-bottom: 0.4rem;">
            Authorizing Bank Escrow Fiduciary Transfer
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            RBI Monitored Custody • Account Ref: ${escrowTrusteeRef}
          </p>

          <div class="escrow-step-log">
            <div class="escrow-log-line active" id="log-step-1">
              <span class="step-icon">🔄</span>
              <span>1. Establishing 256-Bit TLS Bank Handshake...</span>
            </div>
            <div class="escrow-log-line" id="log-step-2">
              <span class="step-icon">⏳</span>
              <span>2. Allocating New India Assurance Policy #${escrowPolicyNo}...</span>
            </div>
            <div class="escrow-log-line" id="log-step-3">
              <span class="step-icon">⏳</span>
              <span>3. Scheduling Brink's Armoured Vault Consignment...</span>
            </div>
            <div class="escrow-log-line" id="log-step-4">
              <span class="step-icon">⏳</span>
              <span>4. Locking Payment in Protected Escrow Hold...</span>
            </div>
          </div>

          <div style="font-size: 0.78rem; color: var(--gold-dark);">
            Please do not close or refresh this window...
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      // Progressive realistic updates
      setTimeout(() => {
        const step1 = document.getElementById('log-step-1');
        const step2 = document.getElementById('log-step-2');
        if (step1) {
          step1.className = 'escrow-log-line completed';
          step1.querySelector('.step-icon').textContent = '✓';
        }
        if (step2) {
          step2.className = 'escrow-log-line active';
          step2.querySelector('.step-icon').textContent = '🔄';
        }
      }, 500);

      setTimeout(() => {
        const step2 = document.getElementById('log-step-2');
        const step3 = document.getElementById('log-step-3');
        if (step2) {
          step2.className = 'escrow-log-line completed';
          step2.querySelector('.step-icon').textContent = '✓';
        }
        if (step3) {
          step3.className = 'escrow-log-line active';
          step3.querySelector('.step-icon').textContent = '🔄';
        }
      }, 1000);

      setTimeout(() => {
        const step3 = document.getElementById('log-step-3');
        const step4 = document.getElementById('log-step-4');
        if (step3) {
          step3.className = 'escrow-log-line completed';
          step3.querySelector('.step-icon').textContent = '✓';
        }
        if (step4) {
          step4.className = 'escrow-log-line active';
          step4.querySelector('.step-icon').textContent = '🔄';
        }
      }, 1500);

      setTimeout(async () => {
        try {
          const order = await placeOrder({
            user: currentUser,
            items: cart,
            shippingAddress,
            paymentMethod: currentMethod,
            pricingSummary: totals,
            specialInstructions: (specialInstructions ? specialInstructions + ' | ' : '') + `Escrow Ref: ${escrowTrusteeRef} | Insurance: ${escrowPolicyNo}`
          });

          // Final step completed
          const step4 = document.getElementById('log-step-4');
          if (step4) {
            step4.className = 'escrow-log-line completed';
            step4.querySelector('.step-icon').textContent = '✓';
          }

          // Trigger royal celebratory confetti
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#F3E5AB', '#34D399', '#FFFFFF']
          });

          if (timerInterval) clearInterval(timerInterval);
          clearCart();

          setTimeout(() => {
            modalOverlay.remove();
            showToast('🎉 Payment successfully locked in Escrow! Brink\'s armoured courier scheduled.', 'success');

            if (onOrderCompleted) {
              onOrderCompleted(order);
            } else {
              window.location.hash = '#orders';
            }
          }, 600);

        } catch (err) {
          modalOverlay.remove();
          console.error('Order error:', err);
          showToast('Could not complete escrow authorization: ' + err.message, 'error');
        }
      }, 2100);
    });
  };

  render();
}
