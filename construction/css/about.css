/* ============================================================
   about.css
============================================================ */
#about {
  background: var(--navy);
  position: relative;
  overflow: hidden;
}
#about::before {
  content: '';
  position: absolute;
  top: -120px; left: -120px;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30,64,175,.06), transparent 70%);
  pointer-events: none;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

/* ── PHOTO COLLAGE ── */
.about-photos {
  position: relative;
  height: 580px;
}
.ab-photo { position: absolute; overflow: hidden; }
.ab-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s var(--ease-expo); }
.ab-photo:hover img { transform: scale(1.05); }

.ab-photo-main {
  left: 0; top: 0;
  width: 62%; height: 68%;
  border: 1px solid rgba(30,64,175,.2);
}
.ab-photo-secondary {
  right: 0; bottom: 0;
  width: 55%; height: 56%;
  border: 1px solid rgba(30,64,175,.2);
  box-shadow: -6px -6px 0 var(--royal);
}
.ab-photo-third {
  left: 0; bottom: 0;
  width: 34%; height: 30%;
  border: 1px solid rgba(30,64,175,.2);
}

.about-badge {
  position: absolute;
  right: 0; top: 40px;
  z-index: 3;
  background: var(--royal);
  color: var(--white);
  padding: 20px 22px;
  text-align: center;
  font-family: var(--font-ui);
}
.about-badge strong { display: block; font-size: 2.6rem; font-weight: 900; line-height: 1; }
.about-badge span {
  font-size: .6rem;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255,255,255,.65);
}

/* ── TEXT COLUMN ── */
.about-text-col { color: var(--white); }
.about-heading { color: var(--white); }
.about-heading em { color: var(--royal-light); font-style: normal; }
.about-desc {
  color: rgba(255,255,255,.5);
  line-height: 1.95;
  font-size: .94rem;
  font-weight: 300;
  margin-bottom: 36px;
}

/* ── FEATURE CHIPS ── */
.about-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}
.about-feat {
  padding: 18px 16px;
  background: rgba(30,64,175,.06);
  border: 1px solid rgba(30,64,175,.14);
  transition: all var(--trans-med);
}
.about-feat:hover {
  border-color: rgba(59,130,246,.3);
  background: rgba(30,64,175,.1);
  transform: translateY(-2px);
}
.about-feat-icon { font-size: 1.3rem; margin-bottom: 8px; }
.about-feat-title {
  font-family: var(--font-ui);
  font-weight: 800;
  font-size: .92rem;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--white);
  margin-bottom: 4px;
}
.about-feat-desc { font-size: .78rem; color: rgba(255,255,255,.42); line-height: 1.6; }
