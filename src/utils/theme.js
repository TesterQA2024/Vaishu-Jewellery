/**
 * VAISHU JEWELLERY - Theme Manager (Light / Dark Mode)
 */

import { showToast } from '../components/Toast';

const THEME_KEY = 'vaishu_theme_mode';

export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  return 'dark'; // Default to luxury royal obsidian dark mode
}

export function applyTheme(mode, notify = false) {
  const currentMode = mode === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentMode);
  document.documentElement.style.colorScheme = currentMode;
  
  try {
    localStorage.setItem(THEME_KEY, currentMode);
  } catch (e) {}

  // Update theme toggle buttons across navbar and admin topbar
  updateThemeToggleButtons(currentMode);

  if (notify) {
    if (currentMode === 'light') {
      showToast('☀️ Switched to Royal Ivory Light Theme', 'info');
    } else {
      showToast('🌙 Switched to Royal Obsidian Dark Theme', 'info');
    }
  }

  // Dispatch global theme change event
  window.dispatchEvent(new CustomEvent('vaishu-theme-changed', { detail: { theme: currentMode } }));
  return currentMode;
}

export function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  return applyTheme(next, true);
}

export function updateThemeToggleButtons(mode) {
  const isLight = mode === 'light';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('title', isLight ? 'Switch to Dark Mode (Obsidian)' : 'Switch to Light Mode (Royal Ivory)');
    btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    const iconEl = btn.querySelector('.theme-icon');
    if (iconEl) {
      iconEl.innerHTML = isLight ? '🌙' : '☀️';
    }
    const textEl = btn.querySelector('.theme-text');
    if (textEl) {
      textEl.textContent = isLight ? 'Dark' : 'Light';
    }
  });
}

// Automatically initialize theme on import
export function initTheme() {
  const theme = getStoredTheme();
  applyTheme(theme, false);
}
