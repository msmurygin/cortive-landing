/* Money is integer cents. No market rates, network calls or hidden multipliers. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.QuarkCost = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  function decimal(value, name, max) {
    const s = String(value ?? '');
    if (!/^\d+(\.\d{1,2})?$/.test(s) || Number(s) > max) throw new Error('Enter a non-negative number with up to two decimals: ' + name);
    const [whole, part = ''] = s.split('.');
    return Number(whole) * 100 + Number(part.padEnd(2, '0'));
  }
  function money(x, key) { return decimal(x[key], key, 1000000000); }
  function count(x, key, minimum = 0) {
    const s = String(x[key] ?? '');
    if (!/^\d+$/.test(s) || Number(s) < minimum || Number(s) > 10000) throw new Error('Check whole-number count: ' + key);
    return Number(s);
  }
  function calculate(x) {
    if (!['USD', 'GBP', 'EUR'].includes(x.currency) || !['subscription', 'perpetual'].includes(x.licensing)) throw new Error('Choose currency and licensing model.');
    if (!['standard', 'moderate', 'complex'].includes(x.complexity) || !['internal', 'partner', 'mixed'].includes(x.approach)) throw new Error('Choose explicit scope assumptions.');
    const warehouses = count(x, 'warehouses', 1), users = count(x, 'users', 1), integrations = count(x, 'integrations');
    const days = count(x, 'days');
    const initial = {
      software: x.licensing === 'perpetual' ? money(x, 'licenseBase') + users * money(x, 'licenseUser') : 0,
      implementation: days * money(x, 'dayRate'),
      siteSetup: warehouses * money(x, 'siteSetup'),
      integrations: integrations * money(x, 'integrationCost'),
      migration: money(x, 'migration'),
      training: money(x, 'training'),
      devicesInfrastructure: warehouses * money(x, 'devices'),
    };
    const contingency = decimal(x.contingency, 'contingency percentage', 100);
    const subtotal = Object.values(initial).reduce((a, b) => a + b, 0);
    if (!Number.isSafeInteger(subtotal)) throw new Error('The total is too large to calculate safely.');
    // Integer multiplication can exceed Number precision even when the result fits.
    initial.contingency = Number((BigInt(subtotal) * BigInt(contingency) + 5000n) / 10000n);
    const annual = {
      software: x.licensing === 'subscription' ? 12 * (money(x, 'monthlyBase') + users * money(x, 'monthlyUser')) : 0,
      support: money(x, 'annualSupport'),
      operations: money(x, 'annualOther'),
    };
    const initialTotal = Object.values(initial).reduce((a, b) => a + b, 0);
    const annualTotal = Object.values(annual).reduce((a, b) => a + b, 0);
    const tco3 = initialTotal + 3 * annualTotal, tco5 = initialTotal + 5 * annualTotal;
    if (![...Object.values(initial), ...Object.values(annual), initialTotal, annualTotal, tco3, tco5].every(Number.isSafeInteger)) throw new Error('The total is too large to calculate safely.');
    return { currency: x.currency, initial, annual, initialTotal, annualTotal, tco3, tco5 };
  }
  function formatMoney(cents, currency) {
    if (!Number.isSafeInteger(cents) || cents < 0 || !['USD', 'GBP', 'EUR'].includes(currency)) throw new Error('Invalid money amount.');
    const amount = BigInt(cents);
    const formatter = new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', { style: 'currency', currency });
    // Dividing a large Number by 100 can lose a cent before formatting.
    return formatter.formatToParts(amount / 100n).map(part => part.type === 'fraction' ? String(amount % 100n).padStart(2, '0') : part.value).join('');
  }
  function scopePlan(x) {
    const scope = {};
    for (const key of ['warehouses', 'users', 'integrations']) scope[key] = String(x[key] ?? '').trim() === '' ? null : count(x, key, key === 'integrations' ? 0 : 1);
    const complexity = { standard: 'Standard processes', moderate: 'Several process variants', complex: 'Complex or site-specific processes', unknown: 'Operational complexity not yet defined' };
    if (!Object.hasOwn(complexity, x.complexity)) throw new Error('Choose an operational complexity.');
    const missingScope = Object.keys(scope).filter(key => scope[key] === null);
    if (x.complexity === 'unknown') missingScope.push('operational complexity');
    const sites = scope.warehouses === null ? 'Confirm the number of warehouses' : scope.warehouses > 1 ? 'Map differences between your ' + scope.warehouses + ' warehouses' : 'Document the setup for your warehouse';
    const users = scope.users === null ? 'Confirm user counts and roles' : 'Check charging and access roles for ' + scope.users + ' planned user' + (scope.users === 1 ? '' : 's');
    const connections = scope.integrations === null ? 'Identify the systems that need a connection and their owners.' : scope.integrations === 0 ? 'Confirm that no connections are needed; check ERP, carriers and automation before treating integration costs as zero.' : 'List all ' + scope.integrations + ' planned connections, their owners, data flows and failure handling.';
    const process = x.complexity === 'complex' ? 'Map site-specific rules and exceptions; ask what needs supported configuration or custom code.' : x.complexity === 'moderate' ? 'List each process variant and ask how it will be configured and tested.' : x.complexity === 'unknown' ? 'Walk through receiving, storage, picking, replenishment and exceptions to define the process scope.' : 'Validate the standard receiving, storage and picking flows and record any exceptions.';
    return {
      scope, missingScope,
      summary: 'Warehouses: ' + (scope.warehouses ?? 'unknown') + ' · Users: ' + (scope.users ?? 'unknown') + ' · Integrations: ' + (scope.integrations ?? 'unknown') + ' · ' + complexity[x.complexity] + '.',
      checklist: [
        ['Software fees: missing cost assumptions', users + '; obtain subscription or perpetual licence terms, included modules and annual fees.'],
        ['Configuration and delivery effort: missing cost assumptions', sites + '. ' + process + ' Ask for scoped person-days, rates, setup responsibilities, testing and cutover costs. No effort is inferred from your scope.'],
        ['Connections: missing cost assumptions', connections + ' Establish one-off build/test costs and recurring charges, including any bundled costs.'],
        ['Migration and transition: missing cost assumptions', 'Assess master-data cleanup, opening balances, reconciliation, operator training and transition coverage; identify owners and obtain costs.'],
        ['Devices and infrastructure: missing cost assumptions', 'Inventory scanners, printers, labels, wireless coverage and hosting by warehouse; obtain purchase, replacement and operating costs.'],
        ['Long-term ownership: missing cost assumptions', 'Confirm annual support, maintenance, upgrade regression testing and internal administration; avoid counting bundled services twice.'],
        ['Contingency and exclusions: missing cost assumptions', 'Record unresolved scope and choose your own contingency rationale. Assess tax/VAT, inflation, growth and financing separately; no default allowance or ROI is supplied.'],
      ],
    };
  }
  return { calculate, formatMoney, scopePlan };
});
