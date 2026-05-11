/* ============================================================
   counters.js — Animated stat counters on scroll
============================================================ */
const Counters = (() => {
  const statEls = Utils.$$('.stat-num');
  let ran = false;

  function _animate(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 2600;
    const fps    = 60;
    const inc    = target / (dur / (1000 / fps));
    let   val    = 0;

    const tick = setInterval(() => {
      val += inc;
      if (val >= target) {
        val = target;
        clearInterval(tick);
      }
      el.textContent = Math.floor(val) + suffix;
    }, 1000 / fps);
  }

  function _check() {
    if (ran) return;
    const first = statEls[0];
    if (first && first.getBoundingClientRect().top < window.innerHeight) {
      ran = true;
      statEls.forEach(_animate);
    }
  }

  Utils.onScroll(_check);
  // Also try after 2.5 s in case user never scrolls (hero already visible)
  setTimeout(_check, 2500);
})();
