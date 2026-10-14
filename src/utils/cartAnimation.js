/**
 * VAISHU JEWELLERY - Cart Add & Flying Animation Utility
 * Delivers luxury visual feedback, audio chime, and seamless cart interaction.
 */

import { openCartDrawer } from '../components/CartDrawer';

// High-fidelity Royal Gold Chime using Web Audio API
export function playRoyalChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Harmonic bell chime: Dual frequencies (E6: 1318.5Hz, B6: 1975.5Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.51, now);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1975.53, now);

    // Soft celestial decay
    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch {
    // Non-blocking fallback for restricted browser audio
  }
}

// Locate the most appropriate visible cart button (Desktop nav or Mobile bottom bar)
export function getActiveCartButton() {
  const desktopBtn = document.getElementById('nav-cart-btn');
  const mobileBtn = document.getElementById('bottom-nav-cart-btn');

  // If on mobile screen or mobile bottom nav is visible
  if (window.innerWidth <= 768 && mobileBtn && mobileBtn.offsetParent !== null) {
    const rect = mobileBtn.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return mobileBtn;
  }

  if (desktopBtn && desktopBtn.offsetParent !== null) {
    const rect = desktopBtn.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return desktopBtn;
  }

  return desktopBtn || mobileBtn;
}

// Trigger fly-to-cart particle flight and icon shockwave
export function animateFlyToCart(sourceElement, imageUrl, onFinish) {
  const targetBtn = getActiveCartButton();

  // If no visible target, complete immediately
  if (!targetBtn || !sourceElement) {
    if (onFinish) onFinish();
    return;
  }

  const startRect = sourceElement.getBoundingClientRect();
  const targetRect = targetBtn.getBoundingClientRect();

  // Coordinates
  const startX = startRect.left + startRect.width / 2 - 32;
  const startY = startRect.top + startRect.height / 2 - 32;
  const targetX = targetRect.left + targetRect.width / 2 - 32;
  const targetY = targetRect.top + targetRect.height / 2 - 32;

  // Create flying ghost jewel element
  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  flyer.style.position = 'fixed';
  flyer.style.left = `${startX}px`;
  flyer.style.top = `${startY}px`;
  flyer.style.pointerEvents = 'none';
  flyer.style.zIndex = '999999';

  flyer.innerHTML = `
    <div class="flying-cart-glow"></div>
    <img src="${imageUrl || 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=300&q=80'}" alt="Jewel" class="flying-cart-img" />
    <span class="flying-cart-sparkle">✨</span>
  `;

  document.body.appendChild(flyer);

  // Parabolic trajectory with arc
  const deltaX = targetX - startX;
  const deltaY = targetY - startY;
  const midX = deltaX * 0.45;
  const midY = Math.min(deltaY * 0.35 - 50, -60); // Arc upward

  const keyframes = [
    {
      transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
      opacity: 1
    },
    {
      transform: `translate(${midX}px, ${midY}px) scale(0.85) rotate(160deg)`,
      opacity: 0.95,
      offset: 0.4
    },
    {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2) rotate(360deg)`,
      opacity: 0.15,
      offset: 0.95
    },
    {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(0.05) rotate(420deg)`,
      opacity: 0
    }
  ];

  const animation = flyer.animate(keyframes, {
    duration: 620,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards'
  });

  animation.onfinish = () => {
    flyer.remove();

    // Trigger royal impact effects on cart icon
    triggerCartImpact(targetBtn);
    playRoyalChime();

    if (onFinish) onFinish();
  };
}

// Bouncing and shockwave effects on the cart icon
export function triggerCartImpact(cartBtn) {
  if (!cartBtn) return;

  // Add bounce class
  cartBtn.classList.remove('cart-bounce');
  void cartBtn.offsetWidth; // Reflow
  cartBtn.classList.add('cart-bounce');

  // Badge pop
  const badge = cartBtn.querySelector('.badge-count, .bottom-nav-badge');
  if (badge) {
    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
  }

  // Create golden ripple ring
  const ripple = document.createElement('span');
  ripple.className = 'cart-golden-ripple';
  cartBtn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);

  setTimeout(() => {
    cartBtn.classList.remove('cart-bounce');
    if (badge) badge.classList.remove('badge-pop');
  }, 600);
}

// Comprehensive trigger for any "Add to Bag" interaction
export function triggerAddToCartVisuals({ button, product, imageElement }) {
  // Source element for flight (prefer image, fallback to button)
  const sourceEl = imageElement || button;

  // Transform button feedback
  if (button) {
    button.disabled = true;
    const originalHtml = button.innerHTML;
    button.classList.add('btn-added-active');
    button.innerHTML = `
      <span class="btn-added-content">
        <svg class="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Added to Bag ✨</span>
      </span>
    `;

    setTimeout(() => {
      button.classList.remove('btn-added-active');
      button.innerHTML = originalHtml;
      button.disabled = false;
    }, 1600);
  }

  // Trigger flight animation, and upon landing open the Royal Cart Drawer!
  animateFlyToCart(sourceEl, product?.image, () => {
    openCartDrawer(product?.id);
  });
}
