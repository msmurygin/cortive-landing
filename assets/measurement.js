/* Optional first-party measurement. No cookies or visitor IDs. Explicit opt-in for tab storage. */
(() => {
  'use strict';
  if (window.QuarkMeasurement) return;
  const allowed = new Set(['/', '/vision', '/screens.html', '/wms-cost', '/features/inventory-management']);
  const page = allowed.has(location.pathname) ? location.pathname : null;
  const TTL = 30 * 60 * 1000, choiceKey = 'qk-measurement-choice', contextKey = 'qk-measurement-context';
  let enabled = false, consent = false, context = null, settings, notice, pageSent = false;
  const blocked = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const read = key => { try { return sessionStorage.getItem(key); } catch { return null; } };
  const store = (key, value) => { try { sessionStorage.setItem(key, value); return true; } catch { return false; } };
  const remove = key => { try { sessionStorage.removeItem(key); } catch {} };
  function inbound() {
    const p = new URLSearchParams(location.search);
    let source = 'direct', medium = 'none';
    if (p.has('utm_source') || p.has('utm_medium')) {
      source = ['google', 'bing', 'linkedin', 'newsletter'].includes(p.get('utm_source')) ? p.get('utm_source') : 'other';
      medium = ['organic', 'cpc', 'email', 'social', 'referral'].includes(p.get('utm_medium')) ? p.get('utm_medium') : 'other';
    } else if (p.has('gclid')) { source = 'google'; medium = 'cpc'; }
    else if (document.referrer) {
      try { const u = new URL(document.referrer); if (u.origin !== location.origin) {
        source = /(^|\.)google\.[a-z.]+$/.test(u.hostname) ? 'google' : /(^|\.)bing\.com$/.test(u.hostname) ? 'bing' : 'other';
        medium = source === 'other' ? 'referral' : 'organic';
      } } catch {}
    }
    return { source, medium, landing: page, expires: Date.now() + TTL };
  }
  function metadata() {
    return enabled && consent && !blocked() && context && context.expires > Date.now() ? { consent: true, source: context.source, medium: context.medium, landing: context.landing, page, context_scope: context.scope } : null;
  }
  function track(event, fields = {}) {
    const measurement = metadata(); if (!measurement || typeof globalThis.crypto?.randomUUID !== 'function') return;
    fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', body: JSON.stringify({ event, event_id: crypto.randomUUID(), ...fields, measurement }), keepalive: true }).catch(() => {});
  }
  function activate() {
    let saved = null;
    try { saved = JSON.parse(read(contextKey)); } catch {}
    const valid = saved && saved.expires > Date.now() && allowed.has(saved.landing) && ['direct','google','bing','linkedin','newsletter','other'].includes(saved.source) && ['none','organic','cpc','email','social','referral','other'].includes(saved.medium);
    context = valid ? saved : inbound(); context.expires = Date.now() + TTL;
    context.scope = store(contextKey, JSON.stringify(context)) ? 'tab' : 'page';
    if (!pageSent) { pageSent = true; track('page_view', { is_entry: !valid }); }
  }
  function setConsent(value) {
    consent = value === true && enabled && !blocked();
    store(choiceKey, consent ? 'yes' : 'no');
    if (consent) activate(); else { remove(contextKey); context = null; }
    if (notice) notice.hidden = true;
  }
  function controls() {
    const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = '/assets/measurement.css'; document.head.append(style);
    notice = document.createElement('section'); notice.className = 'measurement-notice'; notice.setAttribute('aria-label', 'Optional measurement');
    const p = document.createElement('p'); p.textContent = 'Allow optional measurement? We use coarse source and page information to understand warehouse enquiries. With your permission, we use a 30-minute attribution window in this tab. No cookies or visitor IDs.';
    const actions = document.createElement('div');
    for (const [label, value] of [['Allow measurement', true], ['Decline', false]]) { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', () => setConsent(value)); actions.append(b); }
    const privacy = document.createElement('a'); privacy.href = '/legal/privacy.html'; privacy.textContent = 'Privacy'; actions.append(privacy);
    notice.append(p, actions); document.body.append(notice);
    settings = document.createElement('button'); settings.type = 'button'; settings.textContent = 'Measurement settings'; settings.className = 'measurement-settings'; settings.addEventListener('click', () => { notice.hidden = false; notice.querySelector('button').focus(); });
    (document.querySelector('footer') || document.body).append(settings);
    const choice = read(choiceKey); notice.hidden = choice === 'yes' || choice === 'no';
    if (choice === 'yes') { consent = true; activate(); }
  }
  window.QuarkMeasurement = { metadata, track, setConsent, ready: Promise.resolve() };
  window.QuarkMeasurement.ready = (async () => {
    if (!page || blocked()) return;
    try {
      const response = await fetch('/api/measurement-config', { credentials: 'omit', cache: 'no-store' });
      if (!response.ok) return;
      const c = await response.json(); enabled = c.enabled === true && ['production', 'test'].includes(c.environment);
      if (enabled && !blocked()) controls();
    } catch { /* Measurement must never block page or form use. */ }
  })();
  document.addEventListener('click', event => {
    const a = event.target.closest && event.target.closest('a'); if (!a) return;
    const cta = a.dataset.cta;
    let contact = false; try { const u = new URL(a.href, location.href); contact = u.origin === location.origin && u.pathname === '/' && u.hash === '#contact'; } catch {}
    if (cta || contact || a.href === 'mailto:hello@quark.build') track('demo_cta_click', { placement: ['nav','hero','email','form','cost','inventory'].includes(cta) ? cta : 'other' });
  });
})();
