(() => {
  'use strict';
  const form = document.getElementById('costForm');
  if (!form) return;
  const results = document.getElementById('costResults'), status = document.getElementById('costStatus');
  function toggle() {
    form.querySelectorAll('[data-license]').forEach(group => {
      const show = group.dataset.license === form.elements.licensing.value;
      group.hidden = !show;
      group.querySelectorAll('input').forEach(input => { input.disabled = !show; });
    });
  }
  form.elements.licensing.addEventListener('change', () => { toggle(); results.hidden = true; status.textContent = 'Model changed. Calculate again to update the results.'; });
  form.addEventListener('input', () => { results.hidden = true; status.textContent = 'Inputs changed. Calculate to update the results.'; });
  form.addEventListener('reset', () => { results.hidden = true; status.textContent = ''; setTimeout(toggle, 0); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const r = window.QuarkCost.calculate(Object.fromEntries(new FormData(form)));
      const fmt = n => new Intl.NumberFormat(r.currency === 'GBP' ? 'en-GB' : 'en-US', { style: 'currency', currency: r.currency }).format(n / 100);
      for (const key of ['initialTotal', 'annualTotal', 'tco3', 'tco5']) document.getElementById(key).textContent = fmt(r[key]);
      const labels = { software: 'Software', implementation: 'Implementation days', siteSetup: 'Warehouse setup', integrations: 'Integrations', migration: 'Migration', training: 'Training', devicesInfrastructure: 'Devices and infrastructure', contingency: 'Initial contingency', support: 'Support / maintenance', operations: 'Other recurring operations' };
      const body = document.getElementById('costBreakdown'); body.replaceChildren();
      for (const phase of ['initial', 'annual']) for (const [key, value] of Object.entries(r[phase])) {
        const tr = document.createElement('tr');
        for (const text of [labels[key], phase === 'initial' ? 'One-off' : 'Each year', fmt(value)]) { const td = document.createElement('td'); td.textContent = text; tr.append(td); }
        body.append(tr);
      }
      results.hidden = false;
      status.textContent = 'Calculated from your inputs. Initial cost ' + fmt(r.initialTotal) + '; annual recurring ' + fmt(r.annualTotal) + '; three-year TCO ' + fmt(r.tco3) + '; five-year TCO ' + fmt(r.tco5) + '. This is not a Quark quotation.';
    } catch (e) { results.hidden = true; status.textContent = e.message; }
  });
  toggle();
})();
