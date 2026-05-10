/* ============================================================
   form.js — Contact form validation + submit feedback
============================================================ */
const Form = (() => {
  function _validate() {
    const fields = {
      firstName: Utils.$('#firstName'),
      email:     Utils.$('#email'),
      phone:     Utils.$('#phone'),
      service:   Utils.$('#service'),
      message:   Utils.$('#message'),
    };

    let valid = true;

    Object.entries(fields).forEach(([key, el]) => {
      if (!el) return;
      const empty = !el.value.trim();
      const emailBad = key === 'email' && el.value && !/\S+@\S+\.\S+/.test(el.value);
      const bad = empty || emailBad;
      el.style.borderColor = bad ? 'rgba(239,68,68,.7)' : '';
      if (bad) valid = false;
    });

    return valid;
  }

  function submit(btn) {
    if (!_validate()) {
      btn.textContent = 'Please fill all required fields';
      btn.style.background = 'rgba(239,68,68,.3)';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
      }, 2200);
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled    = true;
    btn.style.opacity = '.75';

    // Simulate async submit (replace with fetch() to real endpoint)
    setTimeout(() => {
      btn.textContent  = '✓ Message Sent — We\'ll be in touch soon!';
      btn.disabled     = false;
      btn.style.opacity = '1';
      btn.classList.add('success');

      // Reset form fields
      Utils.$$('.form-group input, .form-group textarea, .form-group select')
        .forEach(el => { el.value = ''; el.style.borderColor = ''; });
    }, 1500);
  }

  return { submit };
})();
