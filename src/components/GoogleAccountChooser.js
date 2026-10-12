/**
 * VAISHU JEWELLERY - Google Account Chooser Modal
 * Provides an authentic Google OAuth Account Selection experience.
 * Prompts user to select or enter their Google Account instead of auto-logging in.
 */

export function openGoogleAccountChooser(onSelectAccount, onCancel) {
  let chooserRoot = document.getElementById('google-chooser-root');
  if (!chooserRoot) {
    chooserRoot = document.createElement('div');
    chooserRoot.id = 'google-chooser-root';
    document.body.appendChild(chooserRoot);
  }

  let isCustomAccountMode = false;

  const accounts = [
    {
      displayName: 'Jayesh Patel',
      email: 'jayesh@gmail.com',
      avatarColor: '#1a73e8',
      initial: 'J'
    },
    {
      displayName: 'Royal Patron',
      email: 'patron.vaishu@gmail.com',
      avatarColor: '#0f9d58',
      initial: 'R'
    }
  ];

  const render = () => {
    chooserRoot.innerHTML = `
      <div class="google-oauth-backdrop" id="google-oauth-backdrop">
        <div class="google-oauth-dialog" id="google-oauth-dialog">
          <button class="google-oauth-close" id="google-oauth-close" aria-label="Close">✕</button>

          <!-- Google Header -->
          <div class="google-oauth-header">
            <svg class="google-g-logo" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.2L1.6 16c1.9 3.7 5.8 7 10.4 7z"/>
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z"/>
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.3l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
            </svg>
            <h2 class="google-oauth-title">Sign in with Google</h2>
            <div class="google-oauth-subtitle">
              Choose an account to continue to <strong>Vaishu Jewellery</strong>
            </div>
          </div>

          <!-- Account List or Custom Input -->
          <div class="google-oauth-body">
            ${!isCustomAccountMode ? `
              <div class="google-accounts-list">
                ${accounts.map((acc, index) => `
                  <button type="button" class="google-account-item" data-index="${index}">
                    <div class="google-account-avatar" style="background-color: ${acc.avatarColor};">
                      ${acc.initial}
                    </div>
                    <div class="google-account-info">
                      <div class="google-account-name">${acc.displayName}</div>
                      <div class="google-account-email">${acc.email}</div>
                    </div>
                    <div class="google-account-arrow">›</div>
                  </button>
                `).join('')}

                <button type="button" class="google-account-item google-use-another" id="btn-use-another-account">
                  <div class="google-account-avatar" style="background-color: #5f6368;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                  <div class="google-account-info">
                    <div class="google-account-name" style="font-weight: 500;">Use another account</div>
                  </div>
                  <div class="google-account-arrow">›</div>
                </button>
              </div>
            ` : `
              <form id="google-custom-account-form" class="google-custom-form">
                <div class="google-form-field">
                  <label class="google-field-label">Email or Phone</label>
                  <input type="email" id="custom-google-email" class="google-field-input" placeholder="name@gmail.com" required autofocus />
                </div>
                <div class="google-form-field">
                  <label class="google-field-label">Full Name</label>
                  <input type="text" id="custom-google-name" class="google-field-input" placeholder="e.g. Jayesh Patel" required />
                </div>
                <div class="google-form-actions">
                  <button type="button" class="google-btn-back" id="btn-back-to-accounts">← Back</button>
                  <button type="submit" class="google-btn-next" id="btn-submit-google-account">Next</button>
                </div>
              </form>
            `}
          </div>

          <!-- Google Footer Disclaimer -->
          <div class="google-oauth-footer">
            To continue, Google will share your name, email address, and language preference with Vaishu Jewellery.
          </div>
        </div>
      </div>
    `;

    attachEvents();
  };

  const closeChooser = () => {
    chooserRoot.innerHTML = '';
    if (onCancel) onCancel();
  };

  const selectAccountAndProceed = (account) => {
    const dialog = document.getElementById('google-oauth-dialog');
    if (dialog) {
      dialog.innerHTML = `
        <div style="padding: 3rem 2rem; text-align: center;">
          <div class="google-loading-spinner"></div>
          <div style="margin-top: 1.25rem; font-size: 0.95rem; font-weight: 600; color: #202124;">
            Signing in with ${account.displayName}...
          </div>
          <div style="font-size: 0.8rem; color: #5f6368; margin-top: 0.35rem;">
            ${account.email}
          </div>
        </div>
      `;
    }

    setTimeout(() => {
      chooserRoot.innerHTML = '';
      if (onSelectAccount) {
        onSelectAccount(account);
      }
    }, 600);
  };

  const attachEvents = () => {
    const backdrop = document.getElementById('google-oauth-backdrop');
    const closeBtn = document.getElementById('google-oauth-close');

    closeBtn?.addEventListener('click', closeChooser);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) closeChooser();
    });

    // Account clicks
    document.querySelectorAll('.google-account-item[data-index]').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        selectAccountAndProceed(accounts[idx]);
      });
    });

    // Use another account
    document.getElementById('btn-use-another-account')?.addEventListener('click', () => {
      isCustomAccountMode = true;
      render();
    });

    // Back to accounts list
    document.getElementById('btn-back-to-accounts')?.addEventListener('click', () => {
      isCustomAccountMode = false;
      render();
    });

    // Custom form submit
    const customForm = document.getElementById('google-custom-account-form');
    customForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('custom-google-email')?.value.trim();
      const name = document.getElementById('custom-google-name')?.value.trim();
      if (!email || !name) return;

      selectAccountAndProceed({
        displayName: name,
        email: email,
        avatarColor: '#1a73e8',
        initial: name.charAt(0).toUpperCase()
      });
    });
  };

  render();
}
