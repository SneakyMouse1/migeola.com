const SCROLL_STORAGE_KEY = 'migeola_scroll_pos';

export function initNavigation() {
  // Save scroll position when clicking language switcher
  document.querySelectorAll('.lang-switch-btn').forEach((btn) => {
    btn.onclick = () => {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, window.scrollY.toString());
    };
  });

  // Mobile menu auto-close on navigation
  const menuToggle = document.getElementById('menu-toggle');
  document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.onclick = () => {
      if (menuToggle) {
        menuToggle.checked = false;
      }
    };
  });
}

export function restoreScrollPosition() {
  const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
  if (saved !== null) {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    const targetY = parseInt(saved, 10);
    window.scrollTo({ top: targetY, behavior: 'instant' });

    // Ensure position after Astro swaps layout paint
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
    });
  }
}
