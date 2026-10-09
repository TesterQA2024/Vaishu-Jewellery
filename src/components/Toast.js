/**
 * VAISHU JEWELLERY - Toast Notification Component
 */

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'info', duration = 3500) {
  ensureContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✨',
    error: '⚠️',
    warning: '🔔',
    info: '💎'
  };

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${iconMap[type] || '💎'}</span>
    <div style="font-size: 0.88rem; font-weight: 500;">${message}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
