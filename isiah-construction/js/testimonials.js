/* ============================================================
   testimonials.js — Carousel with dots, arrows, auto-play
============================================================ */
const Testimonials = (() => {
  const carousel = Utils.$('#tCarousel');
  const dotsWrap = Utils.$('#tDots');
  if (!carousel) return {};

  const cards  = Utils.$$('.t-card', carousel);
  let idx      = 0;
  let autoPlay;

  function _visible() {
    return window.innerWidth < 680 ? 1 : window.innerWidth < 900 ? 2 : 3;
  }
  function _pages() { return Math.ceil(cards.length / _visible()); }

  function _buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < _pages(); i++) {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === idx ? ' active' : '');
      d.setAttribute('aria-label', `Testimonial page ${i + 1}`);
      d.setAttribute('role', 'tab');
      d.addEventListener('click', () => { idx = i; _update(); _buildDots(); });
      dotsWrap.appendChild(d);
    }
  }

  function _update() {
    if (!cards.length) return;
    const cardW = cards[0].offsetWidth + 20;
    const v     = _visible();
    carousel.style.transform = `translateX(-${idx * v * cardW}px)`;
    Utils.$$('.t-dot', dotsWrap).forEach((d, i) =>
      d.classList.toggle('active', i === idx));
  }

  function next() {
    idx = idx >= _pages() - 1 ? 0 : idx + 1;
    _update(); _buildDots();
  }
  function prev() {
    idx = idx <= 0 ? _pages() - 1 : idx - 1;
    _update(); _buildDots();
  }

  function _startAuto() {
    autoPlay = setInterval(() => {
      if (document.visibilityState === 'visible') next();
    }, 5500);
  }

  // Touch swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  window.addEventListener('resize', Utils.debounce(() => {
    idx = 0; _buildDots(); _update();
  }, 200), { passive: true });

  _buildDots();
  _startAuto();

  return { next, prev };
})();
