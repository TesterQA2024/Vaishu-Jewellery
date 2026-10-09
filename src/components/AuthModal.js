/**
 * VAISHU JEWELLERY - Authentication Modal Component
 * Supports Customer Sign In, Sign Up, Google Auth, and Admin Login
 */

import {
  loginUser,
  registerCustomer,
  loginWithGoogle
} from '../services/authService';
import { showToast } from './Toast';

export function openAuthModal(defaultTab = 'login', onAuthSuccess) {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  let currentTab = defaultTab; // 'login' | 'register' | 'admin'

  const render = () => {
    modalRoot.innerHTML = `
      <div class="modal-backdrop open" id="auth-modal-backdrop">
        <div class="modal-dialog" style="max-width: 480px;">
          <button class="modal-close-btn" id="auth-modal-close-btn">✕</button>

          <div style="padding: 2.5rem 2rem;">
            <!-- Modal Header -->
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 48px; height: 48px; background: var(--gold-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #000; box-shadow: var(--gold-glow);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 3h12l4 6-10 12L2 9z"/>
                  <path d="M11 3 8 9l4 12 4-12-3-6"/>
                  <path d="M2 9h20"/>
                </svg>
              </div>
              <h2 style="font-size: 1.5rem; margin-bottom: 0.35rem;" class="text-gold-gradient">
                ${currentTab === 'admin' ? 'Admin Portal Access' : 'Vaishu Royal Patronage'}
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                ${currentTab === 'admin' ? 'Secure authentication for inventory and orders management' : 'Sign in to access your curated vault, orders and bespoke discounts'}
              </p>
            </div>

            <!-- Tab Switcher -->
            <div style="display: flex; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 4px; margin-bottom: 1.5rem;">
              <button class="tab-btn ${currentTab === 'login' ? 'active-tab' : ''}" id="tab-login" style="flex: 1; padding: 0.5rem; border: none; background: ${currentTab === 'login' ? 'var(--bg-surface-elevated)' : 'transparent'}; color: ${currentTab === 'login' ? 'var(--gold-bright)' : 'var(--text-muted)'}; font-weight: 600; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem;">
                Sign In
              </button>
              <button class="tab-btn ${currentTab === 'register' ? 'active-tab' : ''}" id="tab-register" style="flex: 1; padding: 0.5rem; border: none; background: ${currentTab === 'register' ? 'var(--bg-surface-elevated)' : 'transparent'}; color: ${currentTab === 'register' ? 'var(--gold-bright)' : 'var(--text-muted)'}; font-weight: 600; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem;">
                New Account
              </button>
              <button class="tab-btn ${currentTab === 'admin' ? 'active-tab' : ''}" id="tab-admin" style="flex: 1; padding: 0.5rem; border: none; background: ${currentTab === 'admin' ? 'var(--bg-surface-elevated)' : 'transparent'}; color: ${currentTab === 'admin' ? 'var(--gold-bright)' : 'var(--text-muted)'}; font-weight: 600; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem;">
                Admin
              </button>
            </div>

            <!-- Form Content -->
            <form id="auth-form">
              ${currentTab === 'register' ? `
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" id="auth-name" class="form-input" placeholder="e.g. Maharani Gayatri Devi" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" id="auth-phone" class="form-input" placeholder="+91 98765 43210" />
                </div>
              ` : ''}

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="auth-email" class="form-input" 
                       value="${currentTab === 'admin' ? 'admin@vaishujewellery.com' : ''}"
                       placeholder="${currentTab === 'admin' ? 'admin@vaishujewellery.com' : 'patron@example.com'}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="auth-password" class="form-input" 
                       value="${currentTab === 'admin' ? 'vaishuAdmin2026!' : ''}"
                       placeholder="••••••••" required />
              </div>

              <button type="submit" class="btn btn-gold" id="auth-submit-btn" style="width: 100%; padding: 0.8rem; margin-top: 0.5rem;">
                <span>${currentTab === 'register' ? '👑 Create Royal Account' : (currentTab === 'admin' ? '🔒 Enter Admin Portal' : '✨ Sign In to Vault')}</span>
              </button>
            </form>

            ${currentTab !== 'admin' ? `
              <div style="margin: 1.5rem 0; text-align: center; position: relative;">
                <div style="border-top: 1px solid var(--border-subtle);"></div>
                <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bg-surface); padding: 0 10px; font-size: 0.75rem; color: var(--text-muted);">OR</span>
              </div>

              <button type="button" class="btn btn-ghost" id="google-auth-btn" style="width: 100%; display: flex; gap: 0.5rem; justify-content: center; align-items: center; padding: 0.75rem;">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.3l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.2L1.6 16c1.9 3.7 5.8 7 10.4 7z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
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

    const close = () => {
      modalRoot.innerHTML = '';
    };

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    // Tab buttons
    document.getElementById('tab-login')?.addEventListener('click', () => {
      currentTab = 'login';
      render();
    });
    document.getElementById('tab-register')?.addEventListener('click', () => {
      currentTab = 'register';
      render();
    });
    document.getElementById('tab-admin')?.addEventListener('click', () => {
      currentTab = 'admin';
      render();
    });

    // Form submit
    const form = document.getElementById('auth-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email')?.value.trim();
      const password = document.getElementById('auth-password')?.value;

      try {
        let user;
        if (currentTab === 'register') {
          const name = document.getElementById('auth-name')?.value.trim();
          const phone = document.getElementById('auth-phone')?.value.trim();
          user = await registerCustomer(name, email, password, phone);
          showToast(`Welcome to Vaishu Jewellery, ${user.displayName}!`, 'success');
        } else {
          user = await loginUser(email, password);
          if (currentTab === 'admin' && user.role !== 'admin') {
            showToast('Access Denied: You do not have Admin privileges.', 'error');
            return;
          }
          showToast(`Signed in successfully as ${user.displayName || user.email}!`, 'success');
        }

        close();
        if (onAuthSuccess) onAuthSuccess(user);
        if (currentTab === 'admin' || user.role === 'admin') {
          window.location.hash = '#admin';
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error('Auth error:', err);
        showToast(err.message || 'Authentication failed. Please check credentials.', 'error');
      }
    });

    // Google Sign In
    document.getElementById('google-auth-btn')?.addEventListener('click', async () => {
      try {
        const user = await loginWithGoogle();
        showToast(`Welcome ${user.displayName}!`, 'success');
        close();
        if (onAuthSuccess) onAuthSuccess(user);
        window.location.reload();
      } catch (err) {
        showToast(err.message || 'Google sign-in error', 'error');
      }
    });
  };

  render();
}
