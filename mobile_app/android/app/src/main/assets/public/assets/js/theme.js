/**
 * JNVGFamily Theme Engine
 * Seamless Dual-Theme System:
 * - 'sky': Light Sky Blue Theme (airy, elegant, crisp white surfaces, deep navy typography)
 * - 'dark': Classic Dark Navy Blue Theme (midnight navy background, illuminated gold accents)
 */

(function() {
  const THEME_STORAGE_KEY = 'JNVG_THEME';

  function getSavedTheme() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'dark' || saved === 'sky') return saved;
      }
    } catch (e) {
      console.warn("Theme storage read warning:", e);
    }
    return 'sky'; // Default to Light Sky Blue theme
  }

  function applyTheme(theme) {
    const targetTheme = (theme === 'dark') ? 'dark' : 'sky';
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (targetTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    if (document.body) {
      if (targetTheme === 'dark') {
        document.body.classList.add('theme-dark', 'dark');
        document.body.classList.remove('theme-sky', 'light');
      } else {
        document.body.classList.add('theme-sky', 'light');
        document.body.classList.remove('theme-dark', 'dark');
      }
    }

    updateThemeButtons(targetTheme);
  }

  function updateThemeButtons(theme) {
    const isDark = (theme === 'dark');
    const buttons = document.querySelectorAll('#themeToggleBtn, .theme-toggle-trigger');
    buttons.forEach(btn => {
      const icon = btn.querySelector('#themeToggleIcon, .theme-icon');
      const label = btn.querySelector('#themeToggleLabel, .theme-label');
      if (icon) icon.textContent = isDark ? '🌙' : '☀️';
      if (label) label.textContent = isDark ? 'Dark Theme' : 'Light Theme';
      btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    });
  }

  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const next = (current === 'dark') ? 'sky' : 'dark';
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch (e) {}
    applyTheme(next);
  };

  window.applyTheme = applyTheme;
  window.getCurrentTheme = getSavedTheme;

  // Execute immediately to prevent FOUC (Flash of Unstyled Content)
  const initial = getSavedTheme();
  document.documentElement.setAttribute('data-theme', initial);

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        applyTheme(initial);
      });
    } else {
      applyTheme(initial);
    }
  }
})();
