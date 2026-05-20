/**
 * EDSIM.ORG — Auto-save / Restore (localStorage)
 *
 * Usage: call initStorage('sim-unique-id') on DOMContentLoaded.
 * All textarea and select elements with a [data-save] attribute
 * will be automatically saved and restored.
 *
 * NOTE: Only use in standalone HTML files opened directly in a browser.
 * Do NOT use inside Claude.ai artifacts (localStorage is blocked there).
 */

function initStorage(simId) {
  const key = `edsim__${simId}`;

  function save() {
    const state = {};
    document.querySelectorAll('[data-save]').forEach(el => {
      state[el.dataset.save] = el.value;
    });
    try { localStorage.setItem(key, JSON.stringify(state)); } catch(e) {}
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      document.querySelectorAll('[data-save]').forEach(el => {
        if (saved[el.dataset.save] !== undefined) {
          el.value = saved[el.dataset.save];
        }
      });
    } catch(e) {}
  }

  restore();
  document.addEventListener('input', save);
  document.addEventListener('change', save);
}
