/**
 * VAISHU JEWELLERY - Luxury Royal Authentication Modal
 * State-of-the-Art Split-Screen Auth with Email/Password, Mobile Phone OTP,
 * Password Strength Meter, Show/Hide Password Eye, and Google OAuth
 */

import {
  loginUser,
  registerCustomer,
  loginWithGoogle,
  loginWithPhoneOtp,
  resetPassword
} from '../services/authService';
import { openGoogleAccountChooser } from './GoogleAccountChooser';
import { showToast } from './Toast';

export function openAuthModal(defaultTab = 'login', onAuthSuccess) {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  // Active Tab: 'login' | 'register' | 'phone' | 'forgot'
  let currentTab = ['register', 'phone', 'forgot'].includes(defaultTab) ? defaultTab : 'login';
  let showPassword = false;
  let otpSent = false;
  let otpSecondsLeft = 30;
  let otpTimerInterval = null;

  const close = () => {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    document.removeEventListener('keydown', handleKeyDown);
    modalRoot.innerHTML = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', handleKeyDown);

  const render = () => {
    modalRoot.innerHTML = `
      <div class="modal-backdrop open" id="auth-modal-backdrop">
        <div class="modal-dialog auth-split-dialog" id="auth-modal-dialog">
          
          <!-- LEFT COLUMN: ROYAL SHOWCASE & PATRON PRIVILEGES -->
          <div class="auth-hero-panel">
            <div class="auth-hero-watermark">VAISHU</div>
            
            <div>
              <div class="auth-brand-badge">
                <span>👑</span>
                <span>ROYAL PATRON PRIVILEGE CLUB</span>
              </div>

              <h2 class="auth-hero-title text-gold-gradient">
                House of Vaishu
              </h2>

              <p class="auth-hero-desc">
                Step inside our private vault of timeless heirloom treasures, certified 24K bullion, and handcrafted bridal suites.
              </p>

              <!-- Privileges Checklist -->
              <div class="auth-perks-list">
                <div class="auth-perk-item">
                  <div class="auth-perk-icon">🎁</div>
                  <div>
                    <strong>₹1,000 Shagun Welcome Voucher</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Automatically unlocked on your first jewellery order</div>
                  </div>
                </div>

                <div class="auth-perk-item">
                  <div class="auth-perk-icon">🛡️</div>
                  <div>
                    <strong>100% Insured Armoured Transit</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Real-time GPS tracking with Brink's India security vault</div>
                  </div>
                </div>

                <div class="auth-perk-item">
                  <div class="auth-perk-icon">👑</div>
                  <div>
                    <strong>Akshaya Tritiya Priority Booking</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Confidential vault previews with 0% making charges</div>
                  </div>
                </div>

                <div class="auth-perk-item">
                  <div class="auth-perk-icon">📈</div>
                  <div>
                    <strong>Live MCX Bullion Rate Alerts</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Instant market notifications for gold & silver investments</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Compliance Seal -->
            <div class="auth-hero-footer">
              <span style="font-size: 1.25rem;">🏅</span>
              <div>
                <strong>BIS 916 Hallmarked & IGI Certified</strong>
                <div style="font-size: 0.7rem;">Govt Lic. BIS/HM/916/MH/2026/0994</div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: INTERACTIVE AUTH FORM -->
          <div class="auth-form-panel">
            <button class="modal-close-btn" id="auth-modal-close-btn" aria-label="Close">✕</button>

            <!-- Panel Header -->
            <div class="auth-panel-header">
              <h3 class="auth-panel-title">
                ${currentTab === 'register' 
                  ? 'Create Your Patron Account' 
                  : currentTab === 'phone'
                  ? 'Mobile OTP Sign In'
                  : currentTab === 'forgot'
                  ? 'Reset Your Password'
                  : 'Welcome Back, Patron'}
              </h3>
              <p class="auth-panel-subtitle">
                ${currentTab === 'register'
                  ? 'Join over 50,000 royal families and receive exclusive Shagun benefits'
                  : currentTab === 'phone'
                  ? 'Enter your Indian mobile number to receive a secure one-time passcode'
                  : currentTab === 'forgot'
                  ? 'Enter your registered email and we will send a password reset link'
                  : 'Access your orders, saved royal wishlist, and Swarna Nidhi passbook'}
              </p>
            </div>

            <!-- 3-Way Tab Switcher (Visible on login, register, phone) -->
            ${currentTab !== 'forgot' ? `
              <div class="auth-tabs-row">
                <button type="button" class="auth-tab-btn ${currentTab === 'login' ? 'active' : ''}" data-tab="login">
                  <span>✨</span>
                  <span>Sign In</span>
                </button>
                <button type="button" class="auth-tab-btn ${currentTab === 'register' ? 'active' : ''}" data-tab="register">
                  <span>👑</span>
                  <span>New Patron</span>
                </button>
                <button type="button" class="auth-tab-btn ${currentTab === 'phone' ? 'active' : ''}" data-tab="phone">
                  <span>📱</span>
                  <span>Mobile OTP</span>
                </button>
              </div>
            ` : ''}

            <!-- 1. SIGN IN TAB (EMAIL + PASSWORD) -->
            ${currentTab === 'login' ? `
              <!-- Quick Demo Access Pills -->
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem;">
                <button type="button" class="btn btn-ghost" id="quick-fill-patron" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.72rem; border: 1px dashed var(--gold-primary); color: var(--gold-bright); border-radius: 4px;">
                  ⚡ Demo Patron
                </button>
                <button type="button" class="btn btn-ghost" id="quick-fill-admin" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.72rem; border: 1px dashed var(--border-subtle); color: var(--text-muted); border-radius: 4px;">
                  ⚡ Demo Admin
                </button>
              </div>

              <form id="form-login">
                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input type="email" id="login-email" class="form-input" placeholder="name@royalmail.com" value="patron@gmail.com" required autocomplete="email" />
                </div>

                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <label class="form-label" style="margin: 0;">Password *</label>
                    <button type="button" id="btn-goto-forgot" style="background: none; border: none; font-size: 0.76rem; color: var(--gold-bright); cursor: pointer; padding: 0;">
                      Forgot Password?
                    </button>
                  </div>
                  <div class="pwd-input-group">
                    <input type="${showPassword ? 'text' : 'password'}" id="login-password" class="form-input" placeholder="••••••••" value="RoyalPatron2026!" required autocomplete="current-password" style="padding-right: 40px;" />
                    <button type="button" class="pwd-toggle-btn" id="btn-toggle-pwd" title="Show / Hide Password" aria-label="Toggle password visibility">
                      ${showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: var(--text-muted); cursor: pointer;">
                    <input type="checkbox" id="chk-remember-me" checked style="accent-color: var(--gold-primary);" />
                    <span>Remember my patron session</span>
                  </label>
                </div>

                <button type="submit" class="btn btn-gold btn-block" id="btn-submit-login" style="padding: 0.85rem; font-weight: 700;">
                  <span>✨ Sign In to Vault</span>
                </button>
              </form>
            ` : ''}

            <!-- 2. REGISTER TAB (CREATE ACCOUNT) -->
            ${currentTab === 'register' ? `
              <form id="form-register">
                <!-- Welcome Shagun Voucher Pill -->
                <div class="shagun-welcome-tag">
                  <span>🎁</span>
                  <span>₹1,000 Shagun voucher code (VAISHU1000) will be added to your profile!</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <label class="form-label" style="font-size: 0.75rem;">Full Name *</label>
                    <input type="text" id="reg-name" class="form-input" placeholder="e.g. Gayatri Devi" required autocomplete="name" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.75rem;">Mobile Number *</label>
                    <input type="tel" id="reg-phone" class="form-input" placeholder="+91 98765 43210" required autocomplete="tel" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-size: 0.75rem;">Registered Email Address *</label>
                  <input type="email" id="reg-email" class="form-input" placeholder="patron@example.com" required autocomplete="email" />
                </div>

                <div class="form-group" style="margin-bottom: 0.5rem;">
                  <label class="form-label" style="font-size: 0.75rem;">Create Master Vault Password *</label>
                  <div class="pwd-input-group">
                    <input type="${showPassword ? 'text' : 'password'}" id="reg-password" class="form-input" placeholder="At least 6 characters" required autocomplete="new-password" style="padding-right: 40px;" />
                    <button type="button" class="pwd-toggle-btn" id="btn-toggle-pwd" title="Show / Hide Password" aria-label="Toggle password visibility">
                      ${showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                  
                  <!-- Real-time Password Strength Meter -->
                  <div class="pwd-strength-container" id="pwd-strength-box" style="display: none;">
                    <div class="pwd-strength-bar">
                      <div class="pwd-strength-segment" id="pwd-seg-1"></div>
                      <div class="pwd-strength-segment" id="pwd-seg-2"></div>
                      <div class="pwd-strength-segment" id="pwd-seg-3"></div>
                      <div class="pwd-strength-segment" id="pwd-seg-4"></div>
                    </div>
                    <div class="pwd-strength-label">
                      <span>Password Strength:</span>
                      <strong id="pwd-strength-text" style="color: var(--text-muted);">Too Short</strong>
                    </div>
                  </div>
                </div>

                <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; margin: 0.85rem 0 1.25rem 0;">
                  By creating an account, you agree to Vaishu Jewellery's 
                  <a href="#terms" style="color: var(--gold-bright); text-decoration: none;">Terms of Vault</a> & 
                  <a href="#privacy" style="color: var(--gold-bright); text-decoration: none;">Privacy Policy</a>.
                </div>

                <button type="submit" class="btn btn-gold btn-block" id="btn-submit-reg" style="padding: 0.85rem; font-weight: 700;">
                  <span>👑 Create Customer Profile & Claim ₹1,000</span>
                </button>
              </form>
            ` : ''}

            <!-- 3. MOBILE OTP TAB (PHONE SIGN IN) -->
            ${currentTab === 'phone' ? `
              <form id="form-phone-otp">
                <div class="form-group">
                  <label class="form-label">Indian Mobile Number</label>
                  <div style="display: flex; gap: 0.5rem;">
                    <div style="padding: 0.6rem 0.85rem; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 0.35rem; color: var(--text-main);">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input type="tel" id="otp-phone-input" class="form-input" placeholder="98200 11223" value="98200 11223" maxlength="10" required ${otpSent ? 'readonly' : ''} />
                  </div>
                </div>

                ${!otpSent ? `
                  <button type="button" class="btn btn-gold btn-block" id="btn-request-otp" style="padding: 0.85rem; font-weight: 700; margin-top: 1rem;">
                    <span>📲 Request 4-Digit Security OTP</span>
                  </button>
                ` : `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                      <span style="font-size: 0.78rem; color: #34d399; font-weight: 700;">✓ OTP Sent to Mobile</span>
                      <span style="font-size: 0.74rem; color: var(--gold-bright);" id="lbl-otp-resend">
                        Resend in <strong id="lbl-otp-timer">30s</strong>
                      </span>
                    </div>

                    <!-- 4-Digit OTP Boxes -->
                    <div class="otp-inputs-row">
                      <input type="text" class="otp-box" maxlength="1" value="8" data-idx="0" />
                      <input type="text" class="otp-box" maxlength="1" value="8" data-idx="1" />
                      <input type="text" class="otp-box" maxlength="1" value="9" data-idx="2" />
                      <input type="text" class="otp-box" maxlength="1" value="2" data-idx="3" />
                    </div>

                    <div style="text-align: center; margin-bottom: 1.25rem;">
                      <span style="font-size: 0.72rem; color: var(--text-muted); background: rgba(212, 175, 55, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px dashed var(--border-gold);">
                        Demo Secret OTP: <strong>8892</strong>
                      </span>
                    </div>

                    <button type="submit" class="btn btn-gold btn-block" id="btn-submit-otp" style="padding: 0.85rem; font-weight: 700;">
                      <span>🤝 Verify OTP & Enter Vault</span>
                    </button>
                  </div>
                `}
              </form>
            ` : ''}

            <!-- 4. FORGOT PASSWORD TAB -->
            ${currentTab === 'forgot' ? `
              <form id="form-forgot">
                <div class="form-group" style="margin-bottom: 1.5rem;">
                  <label class="form-label">Registered Email Address</label>
                  <input type="email" id="forgot-email" class="form-input" placeholder="your.email@example.com" required />
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                    We will send a high-security one-time password reset link to this address.
                  </div>
                </div>

                <button type="submit" class="btn btn-gold btn-block" style="padding: 0.85rem; font-weight: 700; margin-bottom: 1rem;">
                  <span>✉️ Send Password Reset Instructions</span>
                </button>

                <button type="button" class="btn btn-ghost btn-block" id="btn-back-to-login" style="padding: 0.65rem; font-size: 0.85rem;">
                  ← Back to Sign In
                </button>
              </form>
            ` : ''}

            <!-- OR DIVIDER -->
            ${currentTab !== 'forgot' ? `
              <div style="margin: 1.25rem 0; text-align: center; position: relative;">
                <div style="border-top: 1px solid var(--border-subtle);"></div>
                <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bg-surface); padding: 0 10px; font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.05em;">
                  OR CONTINUE WITH
                </span>
              </div>

              <!-- Google OAuth Button -->
              <button type="button" class="btn btn-ghost" id="google-auth-btn" style="width: 100%; display: flex; gap: 0.65rem; justify-content: center; align-items: center; padding: 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-weight: 600; font-size: 0.88rem; cursor: pointer;">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.3l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.2L1.6 16c1.9 3.7 5.8 7 10.4 7z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div style="text-align: center; margin-top: 1rem;">
                <button type="button" id="btn-continue-guest" style="background: none; border: none; font-size: 0.76rem; color: var(--text-muted); cursor: pointer; text-decoration: underline;">
                  Browse as Guest Patron
                </button>
              </div>
            ` : ''}

          </div>
        </div>
      </div>
    `;

    attachEvents();
  };

  const attachEvents = () => {
    const backdrop = document.getElementById('auth-modal-backdrop');
    const closeBtn = document.getElementById('auth-modal-close-btn');

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    // Guest explore
    document.getElementById('btn-continue-guest')?.addEventListener('click', close);

    // Tab Switcher Buttons (Using modalRoot, not undefined container)
    modalRoot.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Quick fill demo buttons
    document.getElementById('quick-fill-patron')?.addEventListener('click', () => {
      const emailInput = document.getElementById('login-email');
      const pwdInput = document.getElementById('login-password');
      if (emailInput) emailInput.value = 'patron@gmail.com';
      if (pwdInput) pwdInput.value = 'RoyalPatron2026!';
      showToast('Patron credentials populated ✨', 'info');
    });

    document.getElementById('quick-fill-admin')?.addEventListener('click', () => {
      const emailInput = document.getElementById('login-email');
      const pwdInput = document.getElementById('login-password');
      if (emailInput) emailInput.value = 'admin@vaishujewellery.com';
      if (pwdInput) pwdInput.value = 'AdminVault2026!';
      showToast('Admin credentials populated 🛡️', 'info');
    });

    // Go to forgot password
    document.getElementById('btn-goto-forgot')?.addEventListener('click', () => {
      currentTab = 'forgot';
      render();
    });

    // Back to login from forgot
    document.getElementById('btn-back-to-login')?.addEventListener('click', () => {
      currentTab = 'login';
      render();
    });

    // Password Eye Toggle
    document.getElementById('btn-toggle-pwd')?.addEventListener('click', () => {
      showPassword = !showPassword;
      const pwdInput = document.getElementById('login-password') || document.getElementById('reg-password');
      if (pwdInput) {
        pwdInput.type = showPassword ? 'text' : 'password';
        const eyeBtn = document.getElementById('btn-toggle-pwd');
        if (eyeBtn) eyeBtn.textContent = showPassword ? '👁️‍🗨️' : '👁️';
      }
    });

    // Password Strength Meter for Registration
    const regPwdInput = document.getElementById('reg-password');
    regPwdInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      const box = document.getElementById('pwd-strength-box');
      if (!val) {
        if (box) box.style.display = 'none';
        return;
      }
      if (box) box.style.display = 'block';

      let score = 0;
      if (val.length >= 6) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const seg1 = document.getElementById('pwd-seg-1');
      const seg2 = document.getElementById('pwd-seg-2');
      const seg3 = document.getElementById('pwd-seg-3');
      const seg4 = document.getElementById('pwd-seg-4');
      const lbl = document.getElementById('pwd-strength-text');

      const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
      const text = ['Weak', 'Moderate', 'Strong', 'Royal Strong 👑'];

      [seg1, seg2, seg3, seg4].forEach((seg, idx) => {
        if (seg) seg.style.backgroundColor = idx < score ? colors[score - 1] : 'transparent';
      });

      if (lbl) {
        lbl.textContent = text[score - 1] || 'Weak';
        lbl.style.color = colors[score - 1] || '#ef4444';
      }
    });

    // Form: Email Login
    document.getElementById('form-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      if (!email || !password) {
        showToast('Please enter your email and password.', 'warning');
        return;
      }

      const btnSubmit = document.getElementById('btn-submit-login');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>⏳ Signing In...</span>';
      }

      try {
        const user = await loginUser(email, password);
        showToast(`✨ Welcome back, ${user.displayName || user.email}!`, 'success');
        close();
        if (onAuthSuccess) onAuthSuccess(user);
      } catch (err) {
        showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<span>✨ Sign In to Vault</span>';
        }
      }
    });

    // Form: Registration
    document.getElementById('form-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value.trim();
      const phone = document.getElementById('reg-phone')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const password = document.getElementById('reg-password')?.value;

      if (!name || !email || !password) {
        showToast('Please fill all required registration fields.', 'warning');
        return;
      }

      const btnSubmit = document.getElementById('btn-submit-reg');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>⏳ Creating Patron Profile...</span>';
      }

      try {
        const user = await registerCustomer(name, email, password, phone);
        showToast(`🎉 Welcome to the Royal Vault, ${user.displayName}! ₹1,000 Shagun voucher unlocked.`, 'success');
        close();
        if (onAuthSuccess) onAuthSuccess(user);
      } catch (err) {
        showToast(err.message || 'Registration error. Please check your details.', 'error');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<span>👑 Create Customer Profile & Claim ₹1,000</span>';
        }
      }
    });

    // Request Phone OTP
    document.getElementById('btn-request-otp')?.addEventListener('click', () => {
      const phoneVal = document.getElementById('otp-phone-input')?.value.trim();
      if (!phoneVal || phoneVal.replace(/\D/g, '').length < 10) {
        showToast('Please enter a valid 10-digit mobile number', 'warning');
        return;
      }

      otpSent = true;
      otpSecondsLeft = 30;
      render();

      showToast(`📲 4-Digit OTP sent to +91 ${phoneVal} (Demo OTP: 8892)`, 'success');

      if (otpTimerInterval) clearInterval(otpTimerInterval);
      otpTimerInterval = setInterval(() => {
        otpSecondsLeft--;
        const timerLbl = document.getElementById('lbl-otp-timer');
        if (timerLbl) timerLbl.textContent = `${otpSecondsLeft}s`;
        if (otpSecondsLeft <= 0) {
          clearInterval(otpTimerInterval);
          const resendBox = document.getElementById('lbl-otp-resend');
          if (resendBox) resendBox.innerHTML = '<a href="#" id="btn-resend-link" style="color: var(--gold-bright); font-weight: bold; text-decoration: none;">Resend OTP</a>';
          document.getElementById('btn-resend-link')?.addEventListener('click', (ev) => {
            ev.preventDefault();
            otpSecondsLeft = 30;
            render();
            showToast('New OTP dispatched (Demo: 8892)', 'info');
          });
        }
      }, 1000);
    });

    // Auto-advance OTP box typing (using modalRoot)
    const otpBoxes = modalRoot.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        }
      });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
          otpBoxes[idx - 1].focus();
        }
      });
    });

    // Form: Verify Phone OTP
    document.getElementById('form-phone-otp')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('otp-phone-input')?.value.trim() || '98200 11223';
      const enteredOtp = Array.from(modalRoot.querySelectorAll('.otp-box')).map(b => b.value).join('');

      if (enteredOtp.length < 4) {
        showToast('Please enter the complete 4-digit OTP', 'warning');
        return;
      }

      const btnSubmit = document.getElementById('btn-submit-otp');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>⏳ Verifying OTP...</span>';
      }

      try {
        const user = await loginWithPhoneOtp(phone);
        showToast(`✓ Phone OTP verified! Welcome, ${user.displayName}!`, 'success');
        close();
        if (onAuthSuccess) onAuthSuccess(user);
      } catch (err) {
        showToast('Invalid OTP. Please try again.', 'error');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<span>🤝 Verify OTP & Enter Vault</span>';
        }
      }
    });

    // Form: Forgot Password
    document.getElementById('form-forgot')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email')?.value.trim();
      try {
        await resetPassword(email);
        showToast(`✓ Password reset instructions dispatched to ${email}!`, 'success');
        currentTab = 'login';
        render();
      } catch (err) {
        showToast(err.message || 'Could not send reset instructions', 'error');
      }
    });

    // Google Sign In
    document.getElementById('google-auth-btn')?.addEventListener('click', () => {
      openGoogleAccountChooser(async (chosenAccount) => {
        try {
          const user = await loginWithGoogle(chosenAccount);
          showToast(`Welcome, ${user.displayName || 'Patron'}!`, 'success');
          close();
          if (onAuthSuccess) onAuthSuccess(user);
        } catch (err) {
          showToast(err.message || 'Google sign-in error', 'error');
        }
      });
    });
  };

  render();
}
