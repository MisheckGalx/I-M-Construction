/* ============================================================
   reveal.js — IntersectionObserver scroll reveals
============================================================ */
const Reveal = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  // Observe all reveal elements
  Utils.$$('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => obs.observe(el));

  // Auto-stagger children of key grids
  const STAGGER_PARENTS = [
    '.services-grid',
    '.why-grid',
    '.about-features',
    '.process-steps',
  ];
  STAGGER_PARENTS.forEach(sel => {
    const parent = Utils.$(sel);
    if (!parent) return;
    [...parent.children].forEach((child, i) => {
      if (!child.classList.contains('reveal')) child.classList.add('reveal');
      child.classList.add(`delay-${Math.min(i + 1, 6)}`);
      obs.observe(child);
    });
  });
})();
