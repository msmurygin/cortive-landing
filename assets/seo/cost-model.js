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
    if (!['USD', 'GBP'].includes(x.currency) || !['subscription', 'perpetual'].includes(x.licensing)) throw new Error('Choose currency and licensing model.');
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
    if (!Number.isSafeInteger(cents) || cents < 0 || !['USD', 'GBP'].includes(currency)) throw new Error('Invalid money amount.');
    const amount = BigInt(cents);
    const formatter = new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', { style: 'currency', currency });
    // Dividing a large Number by 100 can lose a cent before formatting.
    return formatter.formatToParts(amount / 100n).map(part => part.type === 'fraction' ? String(amount % 100n).padStart(2, '0') : part.value).join('');
  }
  return { calculate, formatMoney };
});
