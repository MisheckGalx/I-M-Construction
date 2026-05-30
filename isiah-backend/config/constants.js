/* ============================================================
   config/constants.js — App-wide constants
============================================================ */
module.exports = {

  /* ── SERVICES ── */
  SERVICES: [
    'Building & Renovation',
    'Plumbing Services',
    'Tree Felling',
    'Paving Services',
    'Paving Brick Sales',
    'Paving Installation',
    'Other / Not Listed',
  ],

  /* ── ENQUIRY STATUS ── */
  STATUS: {
    NEW:        'new',
    CONTACTED:  'contacted',
    QUOTED:     'quoted',
    ACCEPTED:   'accepted',
    DECLINED:   'declined',
    COMPLETED:  'completed',
  },

  /* ── RATE LIMITS ── */
  RATE_LIMIT: {
    CONTACT_WINDOW_MS:  15 * 60 * 1000,   // 15 minutes
    CONTACT_MAX:        5,                  // max 5 form submissions per window
    API_WINDOW_MS:      15 * 60 * 1000,
    API_MAX:            100,
  },

  /* ── PAGINATION ── */
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,

  /* ── COMPANY ── */
  COMPANY: {
    name:    'I&M Construction Company',
    trading: 'Isiah Construction',
    email:   'im@imconstruction.co.za',
    phone:   '061 445 7181',
    wa:      '+27614457181',
    address: 'Gauteng, South Africa',
    website: 'https://isaiahmconstruction.co.za',
  },
};
