/* ============================================================
   hero.js — Slideshow, split-text title, particles, parallax
============================================================ */
const Hero = (() => {
  /* ── SPLIT TEXT ── */
  const LINES = [
    { id: 'titleLine1', text: 'Building Your',   baseDelay: 0.5  },
    { id: 'titleLine2', text: 'Dreams.',          baseDelay: 0.5 + 14 * 0.036 + 0.1 },
  ];

  function initChars() {
    LINES.forEach(({ id, text, baseDelay }) => {
      const el = Utils.$(` #${id}`);
      if (!el) return;
      el.innerHTML = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'hero-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = (baseDelay + i * 0.036) + 's';
        el.appendChild(span);
      });
    });
  }

  /* ── SLIDESHOW ── */
  const slides    = Utils.$$('.hero-slide');
  const inds      = Utils.$$('.hero-ind');
  const progress  = Utils.$('#heroProgress');
  const counterEl = Utils.$('#heroCounterNum');
  const labels    = ['Construction Site', 'Paving Project', 'Renovation Work', 'Plumbing Install'];
  let current = 0;
  let timer;

  function goSlide(idx) {
    slides[current].classList.remove('active');
    inds[current].classList.remove('active');
    current = ((idx % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    inds[current].classList.add('active');
    if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
    _resetProgress();
  }

  function _resetProgress() {
    if (!progress) return;
    progress.classList.remove('running');
    progress.style.width = '0';
    void progress.offsetWidth; // force reflow
    progress.classList.add('running');
    progress.style.width = '100%';
  }

  function _startTimer() {
    timer = setInterval(() => goSlide(current + 1), 7000);
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { clearInterval(timer); goSlide(current + 1); _startTimer(); }
    if (e.key === 'ArrowLeft')  { clearInterval(timer); goSlide(current - 1); _startTimer(); }
  });

  /* ── PARTICLES ── */
  const canvas = Utils.$('#particleCanvas');
  let ctx, pts = [];

  function _initParticles() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    _resize();
    window.addEventListener('resize', Utils.debounce(_resize, 200), { passive: true });
    pts = Array.from({ length: 100 }, _mkPt);
    _animPt();
  }

  function _resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function _mkPt() {
    return {
      x: Math.random() * (canvas?.width  || window.innerWidth),
      y: (canvas?.height || window.innerHeight) + 10,
      size:  Math.random() * 1.7 + 0.3,
      vx:    (Math.random() - 0.5) * 0.5,
      vy:    -(Math.random() * 0.9 + 0.25),
      op:    Math.random() * 0.55 + 0.08,
      life:  0,
      max:   Math.random() * 260 + 100,
      tw:    Math.random() * Math.PI * 2,
    };
  }

  function _animPt() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life++; p.tw += 0.04;
      if (p.life > p.max || p.y < -10) pts[i] = _mkPt();
      const r = p.life / p.max;
      const f = r < 0.1 ? r / 0.1 : r > 0.82 ? (1 - r) / 0.18 : 1;
      const a = Math.max(0, p.op * f * (0.75 + 0.25 * Math.sin(p.tw)));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(_animPt);
  }

  /* ── PARALLAX ── */
  Utils.onScroll(() => {
    const y = window.scrollY;
    slides.forEach(s => { s.style.transform = `translateY(${y * 0.24}px)`; });
  });

  /* ── INIT ── */
  goSlide(0);
  _startTimer();
  _initParticles();

  return { goSlide, initChars };
})();
