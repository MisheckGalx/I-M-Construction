/* ============================================================
   form.js — Connects to I&M Construction Node.js backend
   Change API_URL to your deployed backend URL when live
============================================================ */
const Form = (() => {

  const API_URL   = 'http://localhost:5000/api/contact';
  const WA_NUMBER = '27614457181';

  const FIELDS = [
    { id: 'firstName', label: 'First Name',      required: true                },
    { id: 'lastName',  label: 'Last Name',        required: true                },
    { id: 'email',     label: 'Email Address',    required: true, type: 'email' },
    { id: 'phone',     label: 'Phone Number',     required: true, type: 'phone' },
    { id: 'service',   label: 'Service Required', required: true                },
    { id: 'message',   label: 'Project Details',  required: true                },
  ];

  const $id  = id => document.getElementById(id);
  const $err = id => document.getElementById(`${id}-error`);
  const $val = id => $id(id)?.value?.trim() || '';
  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isValidPhone = v => v.replace(/\D/g, '').length >= 7;

  function _shake(el) { el.style.animation='none'; void el.offsetWidth; el.style.animation='formShake .42s var(--ease-expo)'; }
  function _setError(id, msg) {
    const el=$id(id), err=$err(id); if(!el) return;
    el.classList.add('field-error'); el.style.borderBottomColor='rgba(239,68,68,.75)';
    if(err){ err.textContent=msg; err.hidden=false; } _shake(el);
  }
  function _clearError(id) {
    const el=$id(id), err=$err(id); if(!el) return;
    el.classList.remove('field-error'); el.style.borderBottomColor='';
    if(err) err.hidden=true;
  }
  function _markValid(id) { const el=$id(id); if(el) el.style.borderBottomColor='rgba(16,185,129,.65)'; }
  function _validateField({ id, label, required, type }) {
    const el=$id(id); if(!el) return true;
    const val=el.value.trim();
    if(required && !val)                        { _setError(id,`${label} is required`); return false; }
    if(type==='email'&&val&&!isValidEmail(val)) { _setError(id,'Enter a valid email address'); return false; }
    if(type==='phone'&&val&&!isValidPhone(val)) { _setError(id,'Enter a valid phone number'); return false; }
    _clearError(id); if(val) _markValid(id); return true;
  }
  function _validateAll() { let ok=true; FIELDS.forEach(f=>{if(!_validateField(f)) ok=false;}); return ok; }
  function _attachLiveValidation() {
    FIELDS.forEach(cfg=>{
      const el=$id(cfg.id); if(!el) return;
      el.addEventListener('blur',()=>_validateField(cfg));
      el.addEventListener('input',()=>{if(el.classList.contains('field-error'))_clearError(cfg.id);});
    });
  }
  function _buildWhatsAppURL() {
    const name=`${$val('firstName')} ${$val('lastName')}`.trim();
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent([`Hi Isiah! I submitted an enquiry on your website.`,``,`*Name:* ${name}`,`*Phone:* ${$val('phone')}`,`*Email:* ${$val('email')}`,`*Service:* ${$id('service')?.value||''}`,`*Details:* ${$val('message')}`].join('\n'))}`;
  }
  function _showSuccess() {
    const wrap=document.querySelector('.contact-form-wrap'); if(!wrap) return;
    const waURL=_buildWhatsAppURL();
    [...wrap.children].forEach(c=>{c.style.transition='opacity .3s';c.style.opacity='0';});
    setTimeout(()=>{
      [...wrap.children].forEach(c=>c.style.display='none');
      const card=document.createElement('div'); card.id='formSuccessCard';
      card.innerHTML=`<div class="form-success-inner"><div class="form-success-icon">✓</div><h3 class="form-success-title">Message Sent!</h3><p class="form-success-text">Thank you! We'll reply within <strong>24 hours</strong>.</p><p class="form-success-sub">Want a faster response? Chat on WhatsApp.</p><a href="${waURL}" target="_blank" rel="noopener" class="form-wa-btn">💬 &nbsp; Continue on WhatsApp</a><button class="form-reset-btn" onclick="Form.reset()">← Send Another Message</button></div>`;
      wrap.appendChild(card);
    },340);
  }
  function _setBtnLoading(btn){btn.dataset.originalText=btn.textContent;btn.innerHTML='<span class="btn-spinner"></span> Sending…';btn.disabled=true;btn.style.opacity='.78';}
  function _setBtnError(btn,msg){btn.innerHTML=`⚠ ${msg}`;btn.disabled=false;btn.style.opacity='1';btn.style.background='rgba(239,68,68,.2)';setTimeout(()=>{btn.innerHTML=btn.dataset.originalText||'Send Message →';btn.style.background='';},4200);}
  function reset() {
    const wrap=document.querySelector('.contact-form-wrap');
    const card=$id('formSuccessCard'); if(card) card.remove();
    if(wrap)[...wrap.children].forEach(c=>{c.style.display='';c.style.opacity='1';});
    FIELDS.forEach(({id})=>{const el=$id(id);if(el){el.value='';el.style.borderBottomColor='';el.classList.remove('field-error');}_clearError(id);});
    const btn=$id('submitBtn');if(btn){btn.innerHTML='Send Message →';btn.disabled=false;btn.style.opacity='1';btn.style.background='';}
  }
  function countChars(textarea){const len=textarea.value.length;const c=$id('charCounter');if(!c)return;c.textContent=`${len} / 1000`;c.classList.toggle('warn',len>900);}
  async function submit(btn) {
    if($id('_honeypot')?.value) return;
    if(!_validateAll()){const fb=document.querySelector('.field-error');if(fb)fb.scrollIntoView({behavior:'smooth',block:'center'});return;}
    _setBtnLoading(btn);
    try {
      const res=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName:$val('firstName'),lastName:$val('lastName'),email:$val('email'),phone:$val('phone'),service:$id('service')?.value,message:$val('message')})});
      const json=await res.json().catch(()=>({}));
      if(res.ok){_showSuccess();}else{_setBtnError(btn,json?.message||'Submission failed. Please try again.');}
    } catch{_setBtnError(btn,'Network error — check your connection.');}
  }
  document.addEventListener('DOMContentLoaded',_attachLiveValidation);
  return {submit,reset,countChars};
})();
