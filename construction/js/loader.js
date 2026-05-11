/* ============================================================
   loader.js — Animated page loader + split-text hero trigger
============================================================ */
const Loader = (() => {
  const el   = Utils.$('#loader');
  const fill = Utils.$('#loaderFill');

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      _done();
    }
    fill.style.width = pct + '%';
  }, 72);

  function _done() {
    setTimeout(() => {
      Utils.addClass(el, 'hidden');
      // Kick off hero split-text after loader exits
      if (typeof Hero !== 'undefined') Hero.initChars();
    }, 360);
  }
})();
