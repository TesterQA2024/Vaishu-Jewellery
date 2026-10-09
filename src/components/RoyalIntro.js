/**
 * VAISHU JEWELLERY - Royal Grand Welcome & Countdown Experience
 * Phase 1: 5 to 1 Countdown Timer with glowing rings
 * Phase 2: 5-Second Grand Celebration & Brand Reveal with Confetti
 * Phase 3: Seamless Transition to Main Storefront
 */

import confetti from 'canvas-confetti';

export function playRoyalIntro(onComplete) {
  // Remove existing overlay if present
  const existing = document.getElementById('royal-intro-overlay');
  if (existing) existing.remove();

  const intro = document.createElement('div');
  intro.id = 'royal-intro-overlay';
  intro.className = 'royal-intro-backdrop';

  intro.innerHTML = `
    <div class="royal-intro-container">
      <button class="btn-skip-intro" id="btn-skip-intro" title="Skip to Storefront">
        <span>Skip to Store →</span>
      </button>

      <!-- PHASE 1: COUNTDOWN SCREEN (5 to 1) -->
      <div id="intro-phase-countdown" class="intro-phase active">
        <div class="intro-vault-emblem">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F5D77F" stroke-width="2">
            <path d="M6 3h12l4 6-10 12L2 9z"/>
            <path d="M11 3 8 9l4 12 4-12-3-6"/>
            <path d="M2 9h20"/>
          </svg>
        </div>

        <div class="intro-brand-subhead">VAISHU JEWELLERY</div>
        <div class="intro-opening-label">Opening Royal Vault In...</div>

        <div class="intro-timer-circle">
          <div class="intro-timer-ring"></div>
          <div class="intro-timer-number pulse-num" id="intro-countdown-num">5</div>
        </div>

        <p class="intro-purity-tagline">✄ 22K Solid Gold • Certified Diamond Solitaires • BIS 916 Hallmark ✄</p>
      </div>

      <!-- PHASE 2: GRAND CELEBRATION REVEAL (5s) -->
      <div id="intro-phase-celebrate" class="intro-phase">
        <div class="celebration-crown">👑</div>
        <h1 class="celebration-brand-name text-gold-gradient">VAISHU JEWELLERY</h1>
        <div class="celebration-tagline">The Imperial Palace of Royal Indian Heritage & Solitaire Radiance</div>

        <div class="celebration-card">
          <div class="celebration-badge">✨ WELCOME TO ROYAL LUXURY ✨</div>
          <p class="celebration-desc">
            Handcrafted with 35+ Years of Royal Mastery. Certified BIS 916 Purity, Insured Doorstep Transit, and Lifetime Buyback Guarantee.
          </p>
          <div class="celebration-loader-bar">
            <div class="celebration-loader-progress" id="intro-progress-bar"></div>
          </div>
          <div class="celebration-timer-text">Entering Grand Storefront in <span id="celebrate-seconds-left">5</span>s...</div>
        </div>

        <button class="btn btn-gold" id="btn-enter-store-now" style="padding: 0.85rem 2.25rem; font-size: 1.05rem; margin-top: 1.5rem; box-shadow: var(--gold-glow);">
          <span>Explore Royal Vault Now →</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(intro);

  const phaseCountdown = document.getElementById('intro-phase-countdown');
  const phaseCelebrate = document.getElementById('intro-phase-celebrate');
  const countdownNumEl = document.getElementById('intro-countdown-num');
  const progressBarEl = document.getElementById('intro-progress-bar');
  const celebrateSecEl = document.getElementById('celebrate-seconds-left');

  let isDismissed = false;

  const dismissIntro = () => {
    if (isDismissed) return;
    isDismissed = true;
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.remove();
      if (onComplete) onComplete();
    }, 600);
  };

  document.getElementById('btn-skip-intro')?.addEventListener('click', dismissIntro);
  document.getElementById('btn-enter-store-now')?.addEventListener('click', dismissIntro);

  const fireCelebrationConfetti = () => {
    try {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      function fire(particleRatio, opts) {
        confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
      }
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#D4AF37', '#FFD700', '#F3E5AB'] });
      fire(0.2, { spread: 60, colors: ['#F5D77F', '#ffffff', '#AA771C'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#D4AF37', '#FDF6C7', '#10B981'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#D4AF37', '#FFD700'] });
      fire(0.1, { spread: 120, startVelocity: 45, colors: ['#D4AF37', '#ffffff'] });
    } catch (e) {}
  };

  let count = 5;
  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      if (countdownNumEl) {
        countdownNumEl.textContent = count;
        countdownNumEl.classList.remove('pulse-num');
        void countdownNumEl.offsetWidth;
        countdownNumEl.classList.add('pulse-num');
      }
    } else {
      clearInterval(countInterval);
      if (isDismissed) return;

      if (phaseCountdown) phaseCountdown.classList.remove('active');
      if (phaseCelebrate) phaseCelebrate.classList.add('active');

      fireCelebrationConfetti();
      setTimeout(fireCelebrationConfetti, 1200);
      setTimeout(fireCelebrationConfetti, 2500);

      let celebrateSec = 5;
      if (progressBarEl) progressBarEl.style.width = '100%';

      const celebrateInterval = setInterval(() => {
        celebrateSec--;
        if (celebrateSecEl) celebrateSecEl.textContent = celebrateSec;
        if (celebrateSec <= 0) {
          clearInterval(celebrateInterval);
          dismissIntro();
        }
      }, 1000);
    }
  }, 1000);
}
