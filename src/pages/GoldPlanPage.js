/**
 * VAISHU JEWELLERY - Swarna Nidhi Monthly Purchase Plan Page
 * Route: #gold-plan
 * 
 * Concept: 11 Months Installment by User + 1 Month FREE EMI Bonus from Vaishu Jewellery.
 * Redeemable exclusively towards BIS 916 hallmarked jewellery from our shop/catalog.
 * STRICT LEGAL DISCLAIMER: No cash refund, not a financial investment.
 */

import {
  getUserPlans,
  enrollInPlan,
  payNextInstallment,
  redeemPlanVoucher,
  calculatePlanEstimate
} from '../services/purchasePlanService';
import { formatINR } from '../utils/formatters';

export async function renderGoldPlanPage(container, currentUser, onOpenAuthModal) {
  let selectedAmount = 5000;
  let selectedDuration = 11;
  let userPlans = currentUser ? await getUserPlans(currentUser.uid) : [];

  const render = async () => {
    const estimate = calculatePlanEstimate(selectedAmount, selectedDuration);

    container.innerHTML = `
      <section class="gold-plan-page-section" style="padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Page Header & Royal Banner -->
          <div style="text-align: center; max-width: 800px; margin: 0 auto 2.5rem;">
            <div class="hero-badge" style="margin-bottom: 0.75rem;">
              <span>👑</span>
              <span>VAISHU SWARNA NIDHI 11+1</span>
            </div>
            <h1 class="text-gold-gradient" style="font-size: 2.6rem; margin-bottom: 0.75rem; line-height: 1.2;">
              Monthly Jewellery Purchase Plan
            </h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Pay your monthly installment for <strong>11 months</strong>, and <strong>Vaishu Jewellery will pay the 12th Month EMI 100% FREE</strong> as a royal celebration bonus! On maturity, buy your dream BIS 916 hallmarked gold & diamond jewellery.
            </p>
          </div>

          <!-- CRITICAL MANDATORY STATUTORY DISCLAIMER (Legal Compliance) -->
          <div class="plan-legal-disclaimer-box" id="plan-legal-notice">
            <div class="disclaimer-header">
              <span style="font-size: 1.5rem;">⚠️</span>
              <div>
                <h4 style="font-size: 1.05rem; color: #ffb703; margin: 0 0 2px 0; font-weight: 800;">
                  महत्वपूर्ण वैधानिक नियम एवं सूचना (Mandatory Statutory Terms & Disclaimer)
                </h4>
                <div style="font-size: 0.8rem; color: #d4af37;">कृपया योजना शुरू करने से पहले इन आवश्यक नियमों को ध्यानपूर्वक पढ़ें:</div>
              </div>
            </div>
            <div class="disclaimer-rules-grid">
              <div class="disclaimer-rule-item">
                <span class="rule-icon">🛑</span>
                <div>
                  <strong>यह कोई वित्तीय निवेश (Financial Investment) नहीं है:</strong>
                  <p>यह योजना कोई बैंक फिक्स्ड डिपॉजिट, आरडी, शेयर या ब्याज देने वाली निवेश स्कीम नहीं है।</p>
                </div>
              </div>
              <div class="disclaimer-rule-item">
                <span class="rule-icon">🚫</span>
                <div>
                  <strong>कोई नकद वापसी (No Cash Refund / Cash Payout) नहीं मिलेगी:</strong>
                  <p>इस योजना में किसी भी परिस्थिति में नकद पैसे (Cash Withdrawal) या ब्याज वापस नहीं दिया जाएगा।</p>
                </div>
              </div>
              <div class="disclaimer-rule-item">
                <span class="rule-icon">💎</span>
                <div>
                  <strong>केवल ज्वेलरी खरीद (Strictly for Jewellery Purchase):</strong>
                  <p>जमा की गई संपूर्ण राशि और 1 महीने की फ्री EMI का उपयोग केवल Vaishu Jewellery की दुकान अथवा ऑनलाइन स्टोर से BIS 916 हॉलमार्क ज्वेलरी खरीदने के लिए ही होगा।</p>
                </div>
              </div>
              <div class="disclaimer-rule-item">
                <span class="rule-icon">📜</span>
                <div>
                  <strong>सरकारी व BIS नियमों के 100% अनुरूप:</strong>
                  <p>यह योजना Ministry of Corporate Affairs एवं Indian Jewellery Advance Purchase Guidelines के सभी नियमों का पूर्ण पालन करती है।</p>
                </div>
              </div>
            </div>
          </div>

          <!-- USER ACTIVE PLANS (If User is logged in and has enrolled plans) -->
          ${currentUser && userPlans.length > 0 ? `
            <div class="active-plans-container" style="margin-bottom: 3.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
                <h2 style="font-size: 1.5rem; color: #fff; margin: 0;">
                  👑 My Active Jewellery Purchase Plans (${userPlans.length})
                </h2>
                <button type="button" class="btn btn-gold btn-sm" id="btn-scroll-to-enroll">
                  + Start Another Plan
                </button>
              </div>

              <div class="plans-cards-grid">
                ${userPlans.map(plan => {
                  const percent = Math.min(100, Math.round((plan.installmentsPaid / plan.durationMonths) * 100));
                  const isMatured = plan.status === 'MATURED';
                  const isRedeemed = plan.status === 'REDEEMED';
                  const paidSoFar = plan.installmentsPaid * plan.monthlyAmount;

                  return `
                    <div class="user-plan-card ${isMatured ? 'plan-matured-glow' : ''}">
                      <div class="plan-card-header">
                        <div>
                          <span class="badge-tag" style="background: rgba(212, 175, 55, 0.2); color: var(--gold-bright); font-weight: 700;">
                            PLAN #${plan.planId}
                          </span>
                          <h3 style="font-size: 1.25rem; color: #fff; margin: 0.35rem 0 0 0;">
                            ${formatINR(plan.monthlyAmount)} / Month (${plan.durationMonths}+1 Scheme)
                          </h3>
                        </div>
                        <div class="plan-status-pill ${plan.status.toLowerCase()}">
                          ${isMatured ? '🎉 MATURED (BONUS UNLOCKED)' : isRedeemed ? '✓ REDEEMED IN SHOP' : '● ACTIVE'}
                        </div>
                      </div>

                      <!-- Progress Bar -->
                      <div class="plan-progress-wrapper">
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.4rem;">
                          <span style="color: var(--text-muted);">Installment Progress:</span>
                          <span style="color: var(--gold-bright); font-weight: 700;">
                            ${plan.installmentsPaid} of ${plan.durationMonths} Paid (${percent}%)
                          </span>
                        </div>
                        <div class="plan-progress-track">
                          <div class="plan-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                      </div>

                      <!-- Financial Breakdown Summary -->
                      <div class="plan-financial-grid">
                        <div class="plan-fin-item">
                          <span class="plan-fin-label">Your Deposited So Far:</span>
                          <span class="plan-fin-val">${formatINR(paidSoFar)}</span>
                        </div>
                        <div class="plan-fin-item">
                          <span class="plan-fin-label">Vaishu Free 1-Mo Bonus:</span>
                          <span class="plan-fin-val" style="color: #34d399;">+${formatINR(plan.bonusContribution)} (Free)</span>
                        </div>
                        <div class="plan-fin-item">
                          <span class="plan-fin-label">Total Jewellery Voucher:</span>
                          <span class="plan-fin-val" style="color: var(--gold-bright); font-size: 1.15rem;">${formatINR(plan.totalMaturityValue)}</span>
                        </div>
                        <div class="plan-fin-item">
                          <span class="plan-fin-label">Next Installment Due:</span>
                          <span class="plan-fin-val" style="font-size: 0.85rem;">
                            ${isMatured || isRedeemed ? 'Completed ✓' : new Date(plan.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <!-- Action Button -->
                      <div class="plan-card-actions">
                        ${!isMatured && !isRedeemed ? `
                          <button type="button" class="btn btn-gold btn-pay-installment" data-plan-id="${plan.id}" style="flex: 1; padding: 0.75rem;">
                            <span>Pay Installment #${plan.installmentsPaid + 1} (${formatINR(plan.monthlyAmount)})</span>
                            <span>→</span>
                          </button>
                        ` : ''}

                        ${isMatured ? `
                          <div class="matured-voucher-box">
                            <div style="font-size: 0.82rem; color: #34d399; font-weight: 700; margin-bottom: 0.25rem;">
                              🎁 1-Month Free Bonus ₹${plan.bonusContribution} Successfully Added!
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                              <div>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">Redemption Voucher Code:</span>
                                <div class="voucher-code-display">${plan.voucherCode}</div>
                              </div>
                              <a href="#shop" class="btn btn-gold btn-sm btn-redeem-shop" data-plan-id="${plan.id}">
                                🛍️ Shop Jewellery in Vault
                              </a>
                            </div>
                          </div>
                        ` : ''}

                        ${isRedeemed ? `
                          <div style="padding: 0.75rem; background: rgba(52, 211, 153, 0.1); border: 1px solid #34d399; border-radius: 8px; text-align: center; color: #34d399; font-size: 0.85rem; font-weight: 700;">
                            ✓ Successfully redeemed on ${new Date(plan.redeemedAt || plan.createdAt).toLocaleDateString('en-IN')}. Thank you for patronizing Vaishu Jewellery!
                          </div>
                        ` : ''}
                      </div>

                      <!-- Installment Receipts Ledger Toggle -->
                      <details class="plan-receipts-details">
                        <summary style="font-size: 0.8rem; color: var(--gold-bright); cursor: pointer; padding: 0.5rem 0;">
                          📄 View Payment Receipts Ledger (${plan.installments.length} Paid)
                        </summary>
                        <div class="receipts-list">
                          ${plan.installments.map(ins => `
                            <div class="receipt-row">
                              <div>
                                <strong>Installment #${ins.installmentNo}</strong> (${ins.paymentMethod || 'UPI'})
                                <div style="font-size: 0.72rem; color: var(--text-muted);">${ins.receiptNo} • ${new Date(ins.paidAt).toLocaleDateString('en-IN')}</div>
                              </div>
                              <div style="font-weight: 700; color: #fff;">${formatINR(ins.amount)}</div>
                            </div>
                          `).join('')}
                        </div>
                      </details>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- INTERACTIVE CALCULATOR & ENROLLMENT SIMULATOR -->
          <div class="plan-calculator-wrapper" id="plan-enroll-section">
            <div class="plan-calc-grid">
              <!-- Left Column: Interactive Inputs -->
              <div class="plan-calc-left">
                <div style="margin-bottom: 1.5rem;">
                  <span class="ticker-badge" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">SIMULATOR</span>
                  <h3 style="font-size: 1.5rem; color: #fff; margin: 0.4rem 0 0.2rem 0;">
                    Customize Your Monthly Jewellery Plan
                  </h3>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">
                    Select how much you wish to set aside each month for your future heirloom ornament.
                  </p>
                </div>

                <!-- Monthly Amount Selection -->
                <div style="margin-bottom: 1.5rem;">
                  <label class="form-label" style="display: flex; justify-content: space-between;">
                    <span>1. Choose Monthly Installment (EMI)</span>
                    <strong style="color: var(--gold-bright); font-size: 1.1rem;" id="lbl-display-amount">${formatINR(selectedAmount)}/mo</strong>
                  </label>

                  <div class="amount-preset-pills">
                    <button type="button" class="amount-pill ${selectedAmount === 2000 ? 'active' : ''}" data-amt="2000">₹2,000</button>
                    <button type="button" class="amount-pill ${selectedAmount === 3000 ? 'active' : ''}" data-amt="3000">₹3,000</button>
                    <button type="button" class="amount-pill ${selectedAmount === 5000 ? 'active' : ''}" data-amt="5000">₹5,000</button>
                    <button type="button" class="amount-pill ${selectedAmount === 10000 ? 'active' : ''}" data-amt="10000">₹10,000</button>
                    <button type="button" class="amount-pill ${selectedAmount === 25000 ? 'active' : ''}" data-amt="25000">₹25,000</button>
                    <button type="button" class="amount-pill ${selectedAmount === 50000 ? 'active' : ''}" data-amt="50000">₹50,000</button>
                  </div>

                  <div style="margin-top: 0.85rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 0.82rem; color: var(--text-muted);">Custom Amount (₹):</span>
                      <input type="number" id="input-custom-amount" class="form-input" style="width: 140px; padding: 0.45rem 0.75rem;" value="${selectedAmount}" min="1000" max="500000" step="1000" />
                    </div>
                  </div>
                </div>

                <!-- Duration Selection -->
                <div style="margin-bottom: 1.75rem;">
                  <label class="form-label">2. Select Plan Duration</label>
                  <div class="duration-cards-row">
                    <div class="duration-card ${selectedDuration === 11 ? 'active' : ''}" data-duration="11">
                      <div class="duration-card-badge">RECOMMENDED</div>
                      <div class="duration-card-title">11 Months Plan</div>
                      <div class="duration-card-bonus">🎁 1 Month EMI 100% FREE</div>
                      <div class="duration-card-sub">You pay 11 months, Vaishu Jewellery pays the 12th month.</div>
                    </div>

                    <div class="duration-card ${selectedDuration === 6 ? 'active' : ''}" data-duration="6">
                      <div class="duration-card-badge">SHORT TERM</div>
                      <div class="duration-card-title">6 Months Plan</div>
                      <div class="duration-card-bonus">🎁 50% of 1 Month FREE</div>
                      <div class="duration-card-sub">You pay 6 months, Vaishu Jewellery pays 50% of 1 month EMI.</div>
                    </div>
                  </div>
                </div>

                <!-- Instant Enrollment Form -->
                <div class="enrollment-form-container">
                  <h4 style="font-size: 1rem; color: #fff; margin-bottom: 0.75rem;">
                    ${currentUser ? 'Confirm Patron Details & Start Plan' : 'Sign In Required to Enroll'}
                  </h4>

                  ${currentUser ? `
                    <form id="form-enroll-plan">
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                        <div>
                          <label class="form-label" style="font-size: 0.75rem;">Your Name</label>
                          <input type="text" class="form-input" value="${currentUser.displayName || 'Patron'}" readonly />
                        </div>
                        <div>
                          <label class="form-label" style="font-size: 0.75rem;">Registered Email</label>
                          <input type="email" class="form-input" value="${currentUser.email || ''}" readonly />
                        </div>
                      </div>

                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                        <div>
                          <label class="form-label" style="font-size: 0.75rem;">Nominee Full Name (Optional)</label>
                          <input type="text" id="nominee-name" class="form-input" placeholder="e.g. Smt. Sunita Sharma" />
                        </div>
                        <div>
                          <label class="form-label" style="font-size: 0.75rem;">Nominee Relationship</label>
                          <select id="nominee-relation" class="form-select">
                            <option value="Spouse">Spouse</option>
                            <option value="Mother">Mother</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Son">Son</option>
                            <option value="Sister">Sister</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <!-- Mandatory Legal Checkbox -->
                      <div class="plan-legal-consent-box">
                        <label class="plan-legal-consent-label">
                          <input type="checkbox" id="chk-plan-legal" required style="margin-top: 3px; accent-color: var(--gold-primary); flex-shrink: 0;" />
                          <span>
                            <strong>मैं पुष्टि करता/करती हूँ:</strong> मुझे स्पष्ट है कि यह कोई वित्तीय निवेश (Financial Investment) या बैंक डिपॉजिट नहीं है, और इस योजना में कोई नकद वापसी (Cash Refund/Cash Payout) नहीं होगी। कुल परिपक्वता राशि (Maturity Amount + 1 Month Free Bonus) केवल Vaishu Jewellery से BIS 916 हॉलमार्क ज्वेलरी खरीदने के लिए उपयोग की जाएगी।
                          </span>
                        </label>
                      </div>

                      <button type="submit" class="btn btn-gold btn-block" style="padding: 0.95rem; font-size: 1rem;">
                        <span>Pay 1st Month Installment (${formatINR(selectedAmount)}) & Activate Plan</span>
                        <span>👑</span>
                      </button>
                    </form>
                  ` : `
                    <div style="text-align: center; padding: 2rem 1.5rem; background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-gold); border-radius: 12px;">
                      <div style="font-size: 2rem; margin-bottom: 0.5rem;">👑</div>
                      <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.4rem;">Sign In to Your Patron Account</h4>
                      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;">
                        To enroll in the 11+1 Monthly Jewellery Plan and track your monthly installments, please sign in or register your account.
                      </p>
                      <button type="button" class="btn btn-gold" id="btn-login-to-enroll">
                        <span>Sign In / Register to Enroll</span>
                        <span>→</span>
                      </button>
                    </div>
                  `}
                </div>
              </div>

              <!-- Right Column: Visual Return Certificate -->
              <div class="plan-calc-right">
                <div class="plan-benefit-certificate">
                  <div class="cert-watermark">VAISHU</div>
                  <div class="cert-header">
                    <span style="font-size: 1.6rem;">📜</span>
                    <div>
                      <div style="font-size: 0.72rem; letter-spacing: 0.12em; color: var(--gold-bright); text-transform: uppercase;">
                        BENEFIT GUARANTEE PASSBOOK
                      </div>
                      <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">
                        ${selectedDuration}+1 Royal Jewellery Benefit
                      </div>
                    </div>
                  </div>

                  <div class="cert-body">
                    <div class="cert-row">
                      <span class="cert-lbl">Monthly Installment (EMI)</span>
                      <span class="cert-val">${formatINR(selectedAmount)} / month</span>
                    </div>

                    <div class="cert-row">
                      <span class="cert-lbl">Your Total Contribution (${selectedDuration} Months)</span>
                      <span class="cert-val">${formatINR(estimate.userContribution)}</span>
                    </div>

                    <div class="cert-row cert-row-bonus">
                      <span class="cert-lbl">
                        Vaishu Jewellery 1-Month Free Bonus
                        <div style="font-size: 0.7rem; color: #34d399;">100% Sponsored Gift from House of Vaishu</div>
                      </span>
                      <span class="cert-val" style="color: #34d399; font-size: 1.2rem;">+${formatINR(estimate.bonusAmount)} FREE</span>
                    </div>

                    <div class="cert-divider"></div>

                    <div class="cert-row cert-row-grand">
                      <span class="cert-lbl">
                        TOTAL JEWELLERY PURCHASE VOUCHER
                        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 400;">Redeemable for certified BIS 916 gold / diamond ornaments</div>
                      </span>
                      <span class="cert-val text-gold-gradient" style="font-size: 1.85rem; font-family: var(--font-serif);">
                        ${formatINR(estimate.totalMaturityValue)}
                      </span>
                    </div>
                  </div>

                  <!-- Visual Comparison Tag -->
                  <div class="cert-footer-banner">
                    <span style="font-size: 1.2rem;">✨</span>
                    <span style="font-size: 0.8rem; color: #fff;">
                      You save <strong>${formatINR(estimate.userContribution)}</strong>, but you buy jewellery worth <strong>${formatINR(estimate.totalMaturityValue)}</strong>!
                    </span>
                  </div>

                  <div style="margin-top: 1.25rem; font-size: 0.72rem; color: var(--text-muted); text-align: center; line-height: 1.4;">
                    * Certified BIS 916 hallmark ornaments. Zero hidden deduction at redemption.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HOW IT WORKS (4 Simple Steps) -->
          <div style="margin-top: 4.5rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <span class="ticker-badge" style="font-size: 0.72rem;">SIMPLE 4-STEP JOURNEY</span>
              <h2 style="font-size: 2rem; color: #fff; margin: 0.5rem 0 0 0;">How Swarna Nidhi Works</h2>
            </div>

            <div class="plan-steps-grid">
              <div class="plan-step-card">
                <div class="plan-step-num">01</div>
                <div class="plan-step-icon">📱</div>
                <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.35rem;">Enroll Online in 60s</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted);">
                  Choose your monthly installment from ₹2,000 to ₹50,000 and pay the first month installment securely via UPI or Card.
                </p>
              </div>

              <div class="plan-step-card">
                <div class="plan-step-num">02</div>
                <div class="plan-step-icon">🗓️</div>
                <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.35rem;">Pay 11 Easy Monthly EMIs</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted);">
                  Pay each month on your schedule with automated digital receipts, SMS/email updates, and progress tracking in your dashboard.
                </p>
              </div>

              <div class="plan-step-card">
                <div class="plan-step-num">03</div>
                <div class="plan-step-icon">🎁</div>
                <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.35rem;">12th Month EMI 100% Free</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted);">
                  Upon timely completion of 11 months, Vaishu Jewellery credits the 12th Month installment completely free of cost!
                </p>
              </div>

              <div class="plan-step-card">
                <div class="plan-step-num">04</div>
                <div class="plan-step-icon">👑</div>
                <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.35rem;">Redeem for Royal Jewellery</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted);">
                  Take home your favorite BIS 916 hallmarked necklace, solitaire ring, or bridal set from our showroom or website.
                </p>
              </div>
            </div>
          </div>

          <!-- FREQUENTLY ASKED QUESTIONS (FAQ) -->
          <div style="margin-top: 4.5rem; max-width: 820px; margin-left: auto; margin-right: auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <h2 style="font-size: 1.8rem; color: #fff; margin: 0 0 0.5rem 0;">Frequently Asked Questions</h2>
              <p style="color: var(--text-muted); font-size: 0.88rem;">Everything you need to know about our Monthly Jewellery Purchase Plan</p>
            </div>

            <div class="plan-faq-list">
              <details class="faq-item">
                <summary class="faq-question">
                  <span>क्या मुझे योजना पूरी होने पर नकद पैसे (Cash Refund) मिल सकते हैं?</span>
                  <span class="faq-arrow">▼</span>
                </summary>
                <div class="faq-answer">
                  <strong>बिल्कुल नहीं।</strong> सरकारी एवं BIS नियमों के अनुसार यह कोई वित्तीय निवेश (Financial Investment) या बैंक डिपॉजिट नहीं है। जमा की गई राशि और 1 महीने की फ्री EMI का उपयोग केवल और केवल Vaishu Jewellery से BIS 916 हॉलमार्क ज्वेलरी खरीदने के लिए ही किया जा सकता है।
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">
                  <span>1 महीने की फ्री EMI कब और कैसे मिलती है?</span>
                  <span class="faq-arrow">▼</span>
                </summary>
                <div class="faq-answer">
                  जब आप लगातार 11 महीने की EMI सफलतापूर्वक पूरी कर लेते हैं, तब 12वें महीने की EMI (जैसे ₹5,000) Vaishu Jewellery की तरफ से आपके पासबुक में 100% फ्री बोनस के रूप में ऑटोमैटिकली क्रेडिट कर दी जाती है।
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">
                  <span>मैं मैच्योरिटी पर कौन-सी ज्वेलरी खरीद सकता/सकती हूँ?</span>
                  <span class="faq-arrow">▼</span>
                </summary>
                <div class="faq-answer">
                  आप हमारे संपूर्ण कैटलॉग में से कोई भी BIS 916 हॉलमार्क गोल्ड ज्वेलरी, IGI सर्टिफाइड डायमंड ज्वेलरी, प्लैटिनम अथवा शुद्ध चांदी के बर्तन/सिक्के खरीद सकते हैं।
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">
                  <span>क्या मैं हर महीने ऑनलाइन पेमेंट (UPI / Netbanking) कर सकता हूँ?</span>
                  <span class="faq-arrow">▼</span>
                </summary>
                <div class="faq-answer">
                  हाँ, आप अपने मोबाइल या लैपटॉप से कभी भी Google Pay, PhonePe, Paytm, Debit Card, Credit Card अथवा Netbanking के माध्यम से अपनी EMI जमा कर सकते हैं और तुरंत रसीद (Receipt) डाउनलोड कर सकते हैं।
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
    `;

    attachEvents();
  };

  const attachEvents = () => {
    // Amount Preset Pills
    container.querySelectorAll('.amount-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAmount = parseInt(btn.getAttribute('data-amt'), 10) || 5000;
        const customInput = container.querySelector('#input-custom-amount');
        if (customInput) customInput.value = selectedAmount;
        render();
      });
    });

    // Custom Amount Input
    const customAmtInput = container.querySelector('#input-custom-amount');
    customAmtInput?.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val >= 1000) {
        selectedAmount = val;
        render();
      }
    });

    // Duration Cards
    container.querySelectorAll('.duration-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedDuration = parseInt(card.getAttribute('data-duration'), 10) || 11;
        render();
      });
    });

    // Scroll to enroll button
    container.querySelector('#btn-scroll-to-enroll')?.addEventListener('click', () => {
      container.querySelector('#plan-enroll-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Login to enroll button
    container.querySelector('#btn-login-to-enroll')?.addEventListener('click', () => {
      onOpenAuthModal?.('login');
    });

    // Submit Plan Enrollment
    const enrollForm = container.querySelector('#form-enroll-plan');
    enrollForm?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const legalChecked = container.querySelector('#chk-plan-legal')?.checked;
      if (!legalChecked) {
        alert('Please acknowledge that this is strictly a jewellery purchase scheme and not a financial investment.');
        return;
      }

      const nomineeName = container.querySelector('#nominee-name')?.value || '';
      const nomineeRelation = container.querySelector('#nominee-relation')?.value || 'Family';

      try {
        const newPlan = await enrollInPlan({
          user: currentUser,
          monthlyAmount: selectedAmount,
          durationMonths: selectedDuration,
          nomineeName,
          nomineeRelation,
          paymentMethod: 'UPI / Netbanking'
        });

        alert(`🎉 Congratulations! Your Swarna Nidhi Plan #${newPlan.planId} has been successfully activated!\n\n• Monthly EMI: ${formatINR(newPlan.monthlyAmount)}\n• Duration: ${newPlan.durationMonths} Months\n• 1-Month Free Bonus: ${formatINR(newPlan.bonusContribution)}\n• 1st Month Installment: Paid ✓\n\nYour official receipt has been issued.`);

        userPlans = await getUserPlans(currentUser.uid);
        render();
        window.scrollTo({ top: 150, behavior: 'smooth' });
      } catch (err) {
        alert('Error creating plan: ' + err.message);
      }
    });

    // Pay Next Installment Buttons
    container.querySelectorAll('.btn-pay-installment').forEach(btn => {
      btn.addEventListener('click', async () => {
        const planId = btn.getAttribute('data-plan-id');
        btn.disabled = true;
        btn.innerHTML = '<span>Processing Payment...</span>';

        try {
          const updatedPlan = await payNextInstallment(planId, 'UPI / Online');
          if (updatedPlan.status === 'MATURED') {
            alert(`🎉 CELEBRATIONS! ALL INSTALLMENTS COMPLETED!\n\nVaishu Jewellery has credited your 1-Month Free Bonus of ${formatINR(updatedPlan.bonusContribution)}!\n\nYour Total Maturity Voucher of ${formatINR(updatedPlan.totalMaturityValue)} is now ready to redeem in our jewellery vault.\nVoucher Code: ${updatedPlan.voucherCode}`);
          } else {
            alert(`✓ Installment #${updatedPlan.installmentsPaid} of ${formatINR(updatedPlan.monthlyAmount)} successfully paid!\nReceipt generated.`);
          }

          userPlans = await getUserPlans(currentUser.uid);
          render();
        } catch (err) {
          alert('Payment error: ' + err.message);
          btn.disabled = false;
        }
      });
    });

    // Redeem Button
    container.querySelectorAll('.btn-redeem-shop').forEach(btn => {
      btn.addEventListener('click', async () => {
        const planId = btn.getAttribute('data-plan-id');
        try {
          await redeemPlanVoucher(planId);
        } catch (err) {
          console.warn('Redeem warning:', err);
        }
      });
    });
  };

  await render();
}
