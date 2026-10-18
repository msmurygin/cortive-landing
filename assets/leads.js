/* Aggregate enquiry funnel. No cookies, visitor identifiers or email in analytics. */
(() => {
  // Preserve inbound links to the former manifesto sections (fragments never reach Vercel).
  const legacySections = new Set(['#manifesto', '#architecture', '#problem', '#how', '#audience', '#family', '#who']);
  if (location.pathname === '/' && legacySections.has(location.hash)) {
    location.replace('/vision' + location.hash);
    return;
  }
  if (location.hash === '#waitlist') location.replace('/#contact');
  const form = document.getElementById('leadForm');
  if (!form) return;
  const status = document.getElementById('leadStatus');
  const button = form.querySelector('button[type="submit"]');
  const params = new URLSearchParams(location.search);
  const sources = ['google', 'bing', 'linkedin', 'newsletter'];
  const mediums = ['organic', 'cpc', 'email', 'social', 'referral'];
  let source = params.has('utm_source') ? (sources.includes(params.get('utm_source')) ? params.get('utm_source') : 'other') : 'direct';
  let medium = params.has('utm_medium') ? (mediums.includes(params.get('utm_medium')) ? params.get('utm_medium') : 'other') : 'none';
  if (!params.has('utm_source') && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) {
        source = /(^|\.)google\.[a-z.]+$/.test(host) ? 'google' : /(^|\.)bing\.com$/.test(host) ? 'bing' : 'other';
        medium = ['google', 'bing'].includes(source) ? 'organic' : 'referral';
      }
    } catch { /* No raw referrer is sent. */ }
  }
  function track(event, placement) {
    // Optional UI events respect DNT/GPC. Submission outcomes are operational records.
    if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
    fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, placement, source, medium }), keepalive: true }).catch(() => {});
  }
  document.querySelectorAll('[data-cta]').forEach(link => link.addEventListener('click', () => track('cta_click', link.dataset.cta)));
  let started = false;
  form.addEventListener('focusin', () => {
    if (!started) { started = true; track('lead_start', 'form'); }
  });
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, source, medium }) });
      if (!response.ok) throw new Error('send');
      form.reset();
      status.textContent = 'Thank you — your enquiry has been received.';
      button.textContent = 'Enquiry sent ✓';
      // Prevent accidental duplicate submissions after confirmed acceptance.
    } catch {
      status.textContent = 'Your enquiry was not sent. Please retry or email hello@quark.build.';
      button.disabled = false;
      button.textContent = original;
      sending = false;
    }
  });
})();
