(() => {
  'use strict';
  const legacySections = new Set(['#manifesto', '#architecture', '#problem', '#how', '#audience', '#family', '#who']);
  if (location.pathname === '/' && legacySections.has(location.hash)) { location.replace('/vision' + location.hash); return; }
  if (location.hash === '#waitlist') location.replace('/#contact');
  const form = document.getElementById('leadForm');
  if (!form || form.dataset.quarkBound === 'true') return;
  form.dataset.quarkBound = 'true';
  const status = document.getElementById('leadStatus'), button = form.querySelector('button[type="submit"]');
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (sending || !form.reportValidity()) return;
    sending = true; const original = button.textContent;
    button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
    const attempt_id = globalThis.crypto?.randomUUID?.(), meter = window.QuarkMeasurement;
    const measurement = meter?.metadata() || undefined;
    meter?.track('demo_form_submit', { attempt_id });
    let backendAnswered = false;
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, attempt_id, measurement }) });
      backendAnswered = true;
      if (!response.ok) throw new Error('backend');
      const payload = await response.json().catch(() => null);
      if (payload?.ok !== true || payload.delivery_status !== 'provider_accepted') { meter?.track('demo_form_error', { attempt_id, reason: 'response' }); throw new Error('response'); }
      form.reset(); status.textContent = 'Thank you — your enquiry has been received.'; button.textContent = 'Enquiry sent ✓';
      // The server records provider acceptance once; no browser success event.
    } catch {
      if (!backendAnswered) meter?.track('demo_form_error', { attempt_id, reason: 'network' });
      status.textContent = 'Your enquiry could not be confirmed. Please retry or email hello@quark.build.';
      button.disabled = false; button.textContent = original; sending = false;
    }
  });
})();
