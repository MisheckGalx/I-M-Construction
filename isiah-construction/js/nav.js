/* ============================================================
   nav.js — Sticky nav, mobile menu, active link
============================================================ */
const Nav = (() => {
  const navbar = Utils.$('#navbar');
  const menu   = Utils.$('#mobileMenu');
  const hamb   = Utils.$('#hamburger');
  let isOpen   = false;

  // Scroll glass effect
  Utils.onScroll(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active nav link on scroll
  const sections = Utils.$$('section[id]');
  Utils.onScroll(() => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      const link   = Utils.$(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });

  function toggle() {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);
    hamb.classList.toggle('open', isOpen);
    hamb.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function close() {
    isOpen = false;
    Utils.removeClass(menu, 'open');
    Utils.removeClass(hamb, 'open');
    hamb.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  return { toggle, close };
})();
