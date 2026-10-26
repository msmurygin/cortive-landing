(() => {
  'use strict';
  const form = document.getElementById('costForm');
  if (!form) return;
  const results = document.getElementById('costResults'), status = document.getElementById('costStatus');
  const scopeResults = document.getElementById('scopeResults'), advanced = document.getElementById('advancedBudget'), submit = document.getElementById('costSubmit');
  const isAdvanced = () => form.elements.mode.value === 'advanced';
  let exportInputs = null;
  function clearResults() { results.hidden = true; scopeResults.hidden = true; exportInputs = null; }
  document.querySelectorAll('[data-budget-pdf]').forEach(button => button.addEventListener('click', () => {
    if (!exportInputs) return;
    try {
      const bytes = window.QuarkCostPdf.create(exportInputs);
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url;
      link.download = 'Quark-WMS-Budget-Checklist-' + exportInputs.mode + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = 'PDF prepared locally. Your inputs were not sent to Quark. Keep the downloaded file private if it contains confidential figures.';
    } catch (e) { status.textContent = 'PDF could not be created. Your on-page results remain available. ' + e.message; }
  }));
  function toggle() {
    const showAdvanced = isAdvanced();
    advanced.hidden = !showAdvanced;
    advanced.disabled = !showAdvanced;
    for (const name of ['warehouses', 'users', 'integrations']) form.elements[name].required = showAdvanced;
    form.elements.complexity.setCustomValidity(showAdvanced && form.elements.complexity.value === 'unknown' ? 'Choose an operational complexity before calculating a budget. No effort multiplier is applied.' : '');
    submit.textContent = showAdvanced ? 'Calculate TCO' : 'Build planning checklist';
    form.querySelectorAll('[data-license]').forEach(group => {
      const show = group.dataset.license === form.elements.licensing.value;
      group.hidden = !show;
      group.querySelectorAll('input').forEach(input => { input.disabled = !show; });
    });
    if (showAdvanced && !advanced.querySelector('details[open]')) document.getElementById('budget-software').open = true;
  }
  form.addEventListener('change', () => { toggle(); clearResults(); status.textContent = isAdvanced() ? 'Budget assumptions changed. Calculate again to update the results.' : 'Scope changed. Build your checklist to update the plan.'; });
  form.addEventListener('input', () => { clearResults(); status.textContent = isAdvanced() ? 'Inputs changed. Calculate to update the results.' : 'Scope changed. Build your checklist to update the plan.'; });
  form.addEventListener('reset', () => { clearResults(); status.textContent = ''; setTimeout(() => { form.querySelectorAll('[data-budget-step]').forEach(step => { step.open = false; }); toggle(); }, 0); });
  function openStep(id) { const step = document.getElementById(id); step.open = true; step.querySelector('summary').focus(); }
  form.querySelectorAll('[data-next-budget]').forEach(button => button.addEventListener('click', () => { openStep(button.dataset.nextBudget); }));
  document.getElementById('openAdvanced').addEventListener('click', () => {
    form.querySelector('input[name="mode"][value="advanced"]').checked = true;
    toggle(); clearResults(); status.textContent = 'Your scope is retained. Add your own cost assumptions, starting with software and licensing.';
    openStep('budget-software');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    toggle(); clearResults();
    const invalid = form.querySelector('input:invalid, select:invalid');
    if (invalid) {
      const step = invalid.closest('[data-budget-step]'); if (step) step.open = true;
      status.textContent = 'A value is missing or invalid. Check the highlighted field; unknown costs cannot be treated as zero.';
      form.reportValidity(); return;
    }
    try {
      if (!isAdvanced()) {
        const plan = window.QuarkCost.scopePlan(Object.fromEntries(new FormData(form)));
        document.getElementById('scopeSummary').textContent = plan.summary;
        const list = document.getElementById('scopeChecklist'); list.replaceChildren();
        for (const [title, action] of plan.checklist) { const li = document.createElement('li'), strong = document.createElement('strong'); strong.textContent = title + ': '; li.append(strong, document.createTextNode(action)); list.append(li); }
        exportInputs = Object.fromEntries(new FormData(form));
        scopeResults.hidden = false;
        status.textContent = 'Planning checklist ready. ' + (plan.missingScope.length ? 'Scope still to confirm: ' + plan.missingScope.join(', ') + '. ' : '') + 'Software fees, delivery effort and other cost assumptions still need to be established. No price or ROI has been estimated.';
        document.getElementById('scopeHeading').focus(); return;
      }
      const r = window.QuarkCost.calculate(Object.fromEntries(new FormData(form)));
      const fmt = n => window.QuarkCost.formatMoney(n, r.currency);
      for (const key of ['initialTotal', 'annualTotal', 'tco3', 'tco5']) document.getElementById(key).textContent = fmt(r[key]);
      const labels = { software: 'Software', implementation: 'Implementation days', siteSetup: 'Warehouse setup', integrations: 'Integrations', migration: 'Migration', training: 'Training', devicesInfrastructure: 'Devices and infrastructure', contingency: 'Initial contingency', support: 'Support / maintenance', operations: 'Other recurring operations' };
      const body = document.getElementById('costBreakdown'); body.replaceChildren();
      for (const phase of ['initial', 'annual']) for (const [key, value] of Object.entries(r[phase])) {
        const tr = document.createElement('tr');
        for (const text of [labels[key], phase === 'initial' ? 'One-off' : 'Each year', fmt(value)]) { const td = document.createElement('td'); td.textContent = text; tr.append(td); }
        body.append(tr);
      }
      exportInputs = Object.fromEntries(new FormData(form));
      results.hidden = false;
      status.textContent = 'Calculated from your inputs. Initial cost ' + fmt(r.initialTotal) + '; annual recurring ' + fmt(r.annualTotal) + '; three-year TCO ' + fmt(r.tco3) + '; five-year TCO ' + fmt(r.tco5) + '. This is not a Quark quotation.';
    } catch (e) { clearResults(); status.textContent = e.message; }
  });
  toggle(); submit.disabled = false;
})();
