// Micro-interactions, View Transition progressive enhancement, and accessible collapsible sections
(function(){
  'use strict';

  // Respect users who prefer reduced motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function navigateWithTransition(href){
    if (reduced || !document.startViewTransition) {
      window.location.href = href;
      return;
    }
    document.startViewTransition(() => {
      window.location.href = href;
    });
  }

  // View transition for relative .btn links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    const isRelative = href.startsWith('./') || href.startsWith('../') || href.startsWith('/') || href.startsWith('#');
    if (isRelative && a.classList.contains('btn')){
      e.preventDefault();
      navigateWithTransition(href);
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Load saved theme or check system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Toggle light mode');
    } else {
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', isDark ? 'Toggle light mode' : 'Toggle dark mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Keyboard shortcut to focus artifacts (g then a)
  let seq = '';
  window.addEventListener('keydown', (e) => {
    seq = (seq + e.key).slice(-2);
    if (seq === 'ga') {
      const first = document.querySelector('#artifacts .read-toggle');
      if (first) first.focus();
    }
  });

  // Collapsible card body toggles
  function initCollapsibleCards(){
    const toggles = document.querySelectorAll('.read-toggle');
    toggles.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        const card = btn.closest('.card');
        if (!card) return;
        const bodyId = btn.getAttribute('aria-controls');
        const body = document.getElementById(bodyId);
        if (!body) return;

        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          // collapse
          btn.setAttribute('aria-expanded','false');
          card.classList.remove('expanded');
          body.hidden = true;
          btn.textContent = 'Read more';
          // keep focus on toggle
          btn.focus();
        } else {
          // expand
          btn.setAttribute('aria-expanded','true');
          card.classList.add('expanded');
          body.hidden = false;
          btn.textContent = 'Read less';
          // announce and move focus into content for screen readers
          const firstFocusable = body.querySelector('a, button, input, [tabindex]');
          if (firstFocusable) {
            const scrollY = window.scrollY;
            firstFocusable.focus();
            window.scrollTo(0, scrollY);
          }
        }
      });

      // Make toggle keyboard accessible (Enter/Space already triggers click)
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          // collapse on escape when expanded
          if (btn.getAttribute('aria-expanded') === 'true') {
            btn.click();
          }
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initCollapsibleCards);
  } else {
    initCollapsibleCards();
  }

})();