/* ============================================================
   why.css
============================================================ */
#why {
  background: var(--navy);
  position: relative;
  overflow: hidden;
}
#why::before {
  content: '';
  position: absolute;
  bottom: -200px; right: -200px;
  width: 700px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30,64,175,.07), transparent 68%);
  pointer-events: none;
}

.why-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 52px;
}
.why-subtitle {
  max-width: 380px;
  color: rgba(255,255,255,.42);
  font-size: .93rem;
  line-height: 1.85;
  font-weight: 300;
}

/* ── GRID ── */
.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

/* ── CARD ── */
.why-card {
  padding: 40px 32px;
  background: rgba(255,255,255,.025);
  border: 1px solid rgba(30,64,175,.1);
  position: relative;
  overflow: hidden;
  transition: all var(--trans-med);
}
.why-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--royal), var(--royal-light));
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform .45s var(--ease-expo);
}
.why-card:hover::before { transform: scaleY(1); }
.why-card:hover {
  background: rgba(30,64,175,.07);
  border-color: rgba(30,64,175,.24);
  transform: translateX(5px);
}

.why-num {
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 3.6rem;
  color: rgba(30,64,175,.1);
  line-height: 1;
  letter-spacing: -.04em;
  margin-bottom: 10px;
  transition: color var(--trans-med);
}
.why-card:hover .why-num { color: rgba(30,64,175,.22); }
.why-icon { font-size: 1.7rem; margin-bottom: 14px; }
.why-card-title {
  font-family: var(--font-ui);
  font-weight: 800;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--white);
  margin-bottom: 10px;
}
.why-card-desc {
  color: rgba(255,255,255,.42);
  font-size: .84rem;
  line-height: 1.85;
}
