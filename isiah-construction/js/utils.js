/* ============================================================
   utils.js — Shared helpers used by all modules
============================================================ */
const Utils = {
  /** Query selector shorthand */
  $: (sel, ctx = document) => ctx.querySelector(sel),
  $$: (sel, ctx = document) => [...ctx.querySelectorAll(sel)],

  /** Add/remove class safely */
  addClass:    (el, cls) => el && el.classList.add(cls),
  removeClass: (el, cls) => el && el.classList.remove(cls),
  toggleClass: (el, cls) => el && el.classList.toggle(cls),
  hasClass:    (el, cls) => el && el.classList.contains(cls),

  /** Passive scroll listener */
  onScroll: (fn) => window.addEventListener('scroll', fn, { passive: true }),

  /** Debounce */
  debounce(fn, ms = 150) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  },

  /** Clamp */
  clamp: (val, min, max) => Math.min(Math.max(val, min), max),
};
