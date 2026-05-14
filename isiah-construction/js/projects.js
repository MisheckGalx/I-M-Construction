/* ============================================================
   projects.js — Filter + Lightbox
============================================================ */
const Projects = (() => {
  /* ── FILTER ── */
  const filterBtns = Utils.$$('.filter-btn');
  const items      = Utils.$$('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── LIGHTBOX ── */
  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button class="lb-btn prev" aria-label="Previous image">&#8249;</button>
    <img class="lb-img" id="lbImg" src="" alt="" />
    <button class="lb-btn next" aria-label="Next image">&#8250;</button>
    <button class="lb-close" aria-label="Close lightbox">&#x2715;</button>
    <div class="lb-caption" id="lbCaption"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = Utils.$('#lbImg');
  const lbCaption = Utils.$('#lbCaption');
  let lbIdx = 0;

  function _openLb(i) {
    lbIdx = i;
    const item  = items[i];
    const img   = Utils.$('img', item);
    const title = Utils.$('.project-title', item)?.textContent || '';
    const tag   = Utils.$('.project-tag',   item)?.textContent || '';
    lbImg.src   = img.src;
    lbImg.alt   = img.alt;
    lbCaption.textContent = `${title}  ·  ${tag}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function _closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function _lbNext() { _openLb((lbIdx + 1) % items.length); }
  function _lbPrev() { _openLb((lbIdx - 1 + items.length) % items.length); }

  // Open on click
  items.forEach((item, i) => {
    item.addEventListener('click', () => _openLb(i));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => { if (e.key === 'Enter') _openLb(i); });
  });

  Utils.$('.lb-close', lb).addEventListener('click', _closeLb);
  Utils.$('.lb-btn.next', lb).addEventListener('click', _lbNext);
  Utils.$('.lb-btn.prev', lb).addEventListener('click', _lbPrev);
  lb.addEventListener('click', e => { if (e.target === lb) _closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     _closeLb();
    if (e.key === 'ArrowRight') _lbNext();
    if (e.key === 'ArrowLeft')  _lbPrev();
  });
})();
