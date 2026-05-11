/* ============================================================
   interactions.js — Cursor, magnetic buttons, 3D tilt, parallax
============================================================ */
const Interactions = (() => {

  /* ── CUSTOM CURSOR ── */
  const cur  = document.createElement('div');
  const ring = document.createElement('div');
  cur.id  = 'customCursor';
  ring.id = 'cursorRing';
  Object.assign(cur.style,  { position:'fixed',width:'8px',height:'8px',background:'var(--royal-light)',borderRadius:'50%',pointerEvents:'none',zIndex:'99999',transform:'translate(-50%,-50%)',transition:'width .18s,height .18s,background .18s' });
  Object.assign(ring.style, { position:'fixed',width:'34px',height:'34px',border:'1.5px solid rgba(59,130,246,.5)',borderRadius:'50%',pointerEvents:'none',zIndex:'99998',transform:'translate(-50%,-50%)' });
  document.body.appendChild(cur);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });
  (function rafRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(rafRing);
  })();

  // Enlarge on interactive elements
  const hoverSel = 'a, button, .service-card, .project-item, .why-card, .t-card, .filter-btn, .hero-ind, .t-arrow, .c-detail, .stat-item';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '5px';
      cur.style.height = '5px';
      ring.style.width  = '52px';
      ring.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '8px';
      cur.style.height = '8px';
      ring.style.width  = '34px';
      ring.style.height = '34px';
    });
  });

  /* ── MAGNETIC BUTTONS ── */
  Utils.$$('.btn-primary, .btn-ghost, .nav-cta, .btn-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── 3D TILT — SERVICE CARDS ── */
  Utils.$$('.service-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange     = 'transform';
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 14;
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 14;
      card.style.transform = `translateY(-6px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── ABOUT PHOTOS PARALLAX ON SCROLL ── */
  const aboutPhotos = Utils.$$('.ab-photo img');
  Utils.onScroll(() => {
    const section = Utils.$('#about');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const pct = 1 - (rect.bottom / (window.innerHeight + rect.height));
    aboutPhotos.forEach((img, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      img.style.transform = `translateY(${pct * dir * 20}px)`;
    });
  });

})();
