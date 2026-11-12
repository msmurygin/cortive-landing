/* Consent-first Google Analytics loader and anonymous product events. */
(() => {
  'use strict';
  const containerId = 'GTM-KG82DN24';
  const storageKey = 'quark-analytics-consent';
  const supported = new Set(['en', 'bg', 'ro', 'el', 'sr']);
  const language = supported.has(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const copy = {
    en: { title: 'Optional analytics', text: 'Help us understand which Quark pages and tools are useful. Google Analytics loads only if you accept. Form contents are never sent to Analytics.', accept: 'Accept analytics', decline: 'Decline', privacy: 'Privacy policy' },
    bg: { title: 'Незадължителна аналитика', text: 'Помогнете ни да разберем кои страници и инструменти на Quark са полезни. Google Analytics се зарежда само ако приемете. Съдържанието на формите не се изпраща.', accept: 'Приемам аналитиката', decline: 'Отказвам', privacy: 'Поверителност' },
    ro: { title: 'Analiză opțională', text: 'Ajutați-ne să înțelegem ce pagini și instrumente Quark sunt utile. Google Analytics se încarcă numai dacă acceptați. Conținutul formularelor nu este trimis.', accept: 'Accept analiza', decline: 'Refuz', privacy: 'Confidențialitate' },
    el: { title: 'Προαιρετικά αναλυτικά στοιχεία', text: 'Βοηθήστε μας να καταλάβουμε ποιες σελίδες και εργαλεία του Quark είναι χρήσιμα. Το Google Analytics φορτώνεται μόνο αν αποδεχθείτε. Το περιεχόμενο των φορμών δεν αποστέλλεται.', accept: 'Αποδοχή αναλυτικών', decline: 'Απόρριψη', privacy: 'Απόρρητο' },
    sr: { title: 'Opciona analitika', text: 'Pomozite nam da razumemo koje Quark stranice i alati su korisni. Google Analytics se učitava samo ako prihvatite. Sadržaj obrazaca se ne šalje.', accept: 'Prihvatam analitiku', decline: 'Odbijam', privacy: 'Privatnost' }
  }[language];
  let consent = null;
  try { consent = localStorage.getItem(storageKey); } catch { /* Storage may be unavailable. */ }
  const privacySignal = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  if (privacySignal) consent = 'denied';

  function layer() { window.dataLayer = window.dataLayer || []; return window.dataLayer; }
  function track(name, parameters = {}) {
    if (consent === 'granted') layer().push({ event: name, ...parameters });
  }
  function load() {
    if (document.querySelector('script[data-quark-gtm]')) return;
    const country = { bg: 'BG', ro: 'RO', el: 'GR', sr: 'RS', en: 'GLOBAL' }[language];
    layer().push({ page_language: language, country_code: country });
    layer().push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(containerId);
    script.dataset.quarkGtm = containerId;
    document.head.append(script);
  }
  function setConsent(value) {
    if (privacySignal) value = 'denied';
    consent = value;
    try { localStorage.setItem(storageKey, value); } catch { /* Continue for this page view. */ }
    document.getElementById('q-analytics-consent')?.remove();
    if (value === 'granted') { load(); track('analytics_consent_granted'); }
  }
  function showConsent() {
    if (privacySignal) return;
    document.getElementById('q-analytics-consent')?.remove();
    const banner = document.createElement('aside');
    banner.id = 'q-analytics-consent';
    banner.setAttribute('aria-labelledby', 'q-analytics-title');
    banner.innerHTML = '<div><strong id="q-analytics-title"></strong><p></p></div><div class="q-analytics-actions"><button type="button" data-consent="granted"></button><button type="button" data-consent="denied"></button><a href="/legal/privacy.html"></a></div>';
    banner.querySelector('strong').textContent = copy.title;
    banner.querySelector('p').textContent = copy.text;
    const buttons = banner.querySelectorAll('button');
    buttons[0].textContent = copy.accept;
    buttons[1].textContent = copy.decline;
    banner.querySelector('a').textContent = copy.privacy;
    banner.addEventListener('click', event => {
      const value = event.target.closest('[data-consent]')?.dataset.consent;
      if (value) setConsent(value);
    });
    document.body.append(banner);
    buttons[0].focus({ preventScroll: true });
  }

  window.QuarkAnalytics = { track, showConsent, consent: () => consent };
  document.addEventListener('DOMContentLoaded', () => {
    if (consent === 'granted') load();
    else if (consent !== 'denied') showConsent();
    document.addEventListener('click', event => {
      const control = event.target.closest('a,button');
      if (!control) return;
      if (control.matches('[data-analytics-consent-reset]')) { event.preventDefault(); showConsent(); }
      else if (control.matches('a[href^="mailto:"]')) track('contact_click', { contact_method: 'email' });
      else if (control.matches('[data-cta]')) track('demo_request_click', { placement: control.dataset.cta || 'unknown' });
      else if (control.matches('[data-budget-pdf]')) track('tool_export', { tool_name: 'wms_cost', file_type: 'pdf' });
      else if (['pdfReport', 'jsonReport', 'printReport'].includes(control.id)) track('tool_export', { tool_name: 'wms_readiness_assessment', file_type: control.id.replace('Report', '') });
    });
    document.addEventListener('submit', event => {
      if (event.target.id === 'costForm') setTimeout(() => {
        const advanced = event.target.elements.mode?.value === 'advanced';
        const visible = advanced ? !document.getElementById('costResults')?.hidden : !document.getElementById('scopeResults')?.hidden;
        if (visible) track('tool_complete', { tool_name: 'wms_cost', mode: advanced ? 'advanced' : 'scope' });
      });
      if (event.target.id === 'assessmentForm') setTimeout(() => {
        if (!document.getElementById('resultsPanel')?.hidden) track('tool_complete', { tool_name: 'wms_readiness_assessment' });
      });
    });
    const leadStatus = document.getElementById('leadStatus');
    if (leadStatus) {
      let recorded = false;
      new MutationObserver(() => {
        if (!recorded && leadStatus.textContent.includes('enquiry has been received')) {
          recorded = true;
          track('generate_lead', { form_name: 'warehouse_enquiry' });
        }
      }).observe(leadStatus, { childList: true, subtree: true, characterData: true });
    }
  });
})();
