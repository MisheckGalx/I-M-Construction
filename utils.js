/* ============================================================
   responsive.css — Mobile-First Breakpoints
============================================================ */

/* ── 1200px ── */
@media (max-width: 1200px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid   { grid-template-columns: 1fr 1fr; gap: 36px; }
  .why-grid      { grid-template-columns: repeat(2, 1fr); }
}

/* ── 1024px ── */
@media (max-width: 1024px) {
  .about-grid    { grid-template-columns: 1fr; gap: 48px; }
  .about-photos  { height: 380px; max-width: 520px; margin: 0 auto; }
  .contact-grid  { grid-template-columns: 1fr; gap: 40px; }
  .process-steps { grid-template-columns: repeat(2, 1fr); gap: 32px; }
  .process-steps::before { display: none; }
  .hero-counter  { display: none; }
}

/* ── 900px ── */
@media (max-width: 900px) {
  :root { --section-pad: 80px; }

  .hero-stats { grid-template-columns: repeat(2, 1fr); }
  .projects-masonry { columns: 2; }
  .t-card { flex: 0 0 calc(50% - 10px); }
  .why-grid { grid-template-columns: 1fr; }
  .why-title-row { flex-direction: column; }
}

/* ── 768px ── */
@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
  .about-features { grid-template-columns: 1fr; }
  .contact-form-wrap { padding: 28px; }
  .form-row { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .projects-header { flex-direction: column; align-items: flex-start; }
  .services-intro { flex-direction: column; }
}

/* ── 680px — MOBILE ── */
@media (max-width: 680px) {
  :root { --section-pad: 64px; --side-pad: 6%; }

  /* Nav */
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }

  /* Hero */
  .hero-stats { display: none; }
  .hero-sub br { display: none; }

  /* Projects */
  .projects-masonry { columns: 1; }
  .filter-row { gap: 4px; }

  /* Testimonials */
  .t-card { flex: 0 0 100%; }

  /* Process */
  .process-steps { grid-template-columns: 1fr; }

  /* Contact */
  .contact-form-wrap { padding: 22px; }

  /* Footer */
  .footer-bottom { flex-direction: column; text-align: center; }
}

/* ── 400px ── */
@media (max-width: 400px) {
  .hero-btns { flex-direction: column; }
  .btn-primary, .btn-ghost { text-align: center; justify-content: center; }
  .about-photos { height: 300px; }
}
