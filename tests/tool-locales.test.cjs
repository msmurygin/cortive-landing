const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');
const engine = require('../assessment-assets/discovery-model.js');
const cost = require('../assets/seo/cost-model.js');
const createLocale = require('../assets/i18n/tool-locale.js');
const copy = require('../assets/i18n/tool-copy.js');
const fixed = { consent: true, generatedAt: '2026-11-05T12:00:00Z' };
const scenarios = [
  {},
  { industries: ['ecommerce'], primaryIndustry: 'ecommerce', models: ['own'], tracking: ['serial'], returns: 'yes', productVariants: 'yes', processes: ['receiving','putaway','picking'], challenges: ['accuracy','visibility'] },
  { industries: ['manufacturing','fmcg','pharmaceutical'], primaryIndustry: 'manufacturing', models: ['3pl','manufacturing-supply'], sites: 4, ownership: 'multiple', tracking: ['lot','expiry'], environment: ['cool'], integrations: ['erp','automation'], automation: ['conveyor'], rf: 'yes', clientNeeds: ['isolation','billing'], productionFlows: ['issue','returns'], obligations: 'stated', obligationNotes: 'Test описание Ș', qc: 'yes', replenishment: 'yes' },
  { industries: ['retail'], primaryIndustry: 'unknown', models: ['3pl','hybrid'], ownership: 'single', owners: 3, tracking: ['quantity','serial'], erp: 'no', integrations: ['erp'], challenges: ['errors','productivity','delays','manual','scale'] },
  { industries: ['other'], primaryIndustry: 'other', otherIndustry: 'Other', models: ['hybrid'], otherModel: '<img src=x onerror=alert(1)> Șț склад', requirements: 'missing', owner: 'missing', horizon: 'exploring' },
  { industries: ['distribution'], primaryIndustry: 'distribution', models: ['own'], integrations: ['none'], masterData: 'ready', requirements: 'ready', owner: 'ready', budget: 'ready', stakeholders: 'ready', uat: 'ready', horizon: 'soon' }
];

test('BG/RO presentation covers all questions, conditional fields and option values without changing predicates or model keys', () => {
  for (const code of ['bg','ro']) {
    const locale = createLocale(copy, code, engine);
    for (const q of engine.questions) {
      const view = locale.question(q);
      assert.notEqual(view.title, q.title);
      assert.notEqual(view.help, q.help);
      assert.notEqual(view.area, q.area);
      assert.deepEqual(view.fields.map(f => [f.key, f.type, f.when, f.choices.map(o => o.value)]), q.fields.map(f => [f.key, f.type, f.when, f.choices.map(o => o.value)]));
      for (const f of view.fields) {
        assert.ok(f.label && copy[code].terms[q.fields.find(x => x.key === f.key).label]);
        assert.ok(copy[code].actions[f.key]);
        for (const option of f.choices) assert.ok(option.label);
      }
    }
  }
});

test('native reports retain every answer and finding; raw answers, readiness and JSON remain unchanged, including user text and markup', () => {
  for (const raw of scenarios) for (const code of ['bg','ro']) {
    const locale = createLocale(copy, code, engine), report = engine.assess(raw, fixed), snapshot = JSON.stringify(report);
    const sections = locale.meetingSections(report);
    assert.equal(sections.length, 12);
    assert.equal(sections.find(s => s.title === copy[code].report['section:tasks']).table.rows.length, report.recommendations.length);
    for (const item of [...report.findings, ...report.candidateEvaluationScenarios]) {
      const view = locale.finding(item);
      assert.ok(view.title && view.action && view.explanation, item.ruleId);
      assert.notEqual(view.title, item.ruleId);
      assert.deepEqual(view.supportingAnswers.map(a => [a.answerKey,a.value]), item.supportingAnswers.map(a => [a.answerKey,a.value]));
      assert.equal(view.ruleId, item.ruleId);
    }
    for (const [key,value] of Object.entries(report.answers)) {
      const field = engine.fields.find(f => f.key === key);
      if (field.type === 'text' && value) {
        assert.equal(locale.display(key, value), value);
        assert.ok(JSON.stringify(sections).includes(value), key);
      }
    }
    assert.equal(JSON.stringify(report), snapshot);
    assert.deepEqual(engine.assess(raw, fixed), report);
  }
});

test('budget translations keep unknown counts distinct from zero, seven checklist groups and cent-exact currency formatting', () => {
  for (const code of ['bg','ro']) {
    const locale = createLocale(copy, code, engine);
    for (const integrations of ['', '0', '2']) {
      const inputs = { warehouses:'', users:'12', integrations, complexity:'unknown' }, raw = cost.scopePlan(inputs);
      const snapshot = JSON.stringify(raw), view = locale.scopePlan(raw, inputs);
      assert.deepEqual(view.scope, raw.scope);
      assert.equal(view.checklist.length, 7);
      assert.equal(view.missingScope.length, raw.missingScope.length);
      assert.ok(view.summary.includes(copy[code].terms.Unknown));
      assert.equal(JSON.stringify(raw), snapshot);
      if (integrations === '0') assert.equal(view.checklist[2][1], copy[code].budget.noConnectionsAction);
    }
    for (const currency of ['EUR','GBP','USD']) {
      for (const cents of [0,1,101,123456,Number.MAX_SAFE_INTEGER]) {
        const formatted = locale.money(cents, currency);
        const fraction = String(BigInt(cents) % 100n).padStart(2,'0');
        assert.ok(formatted.includes(',' + fraction), formatted);
      }
    }
  }
});

test('English and unsupported locale requests use the original presentation with no automatic browser-language switch', () => {
  for (const requested of [undefined,'en','el','BG','<script>']) {
    const locale = createLocale(copy, requested, engine), report = engine.assess({},fixed);
    assert.equal(locale.code,'en'); assert.equal(locale.active,false);
    assert.equal(locale.question(engine.questions[0]),engine.questions[0]);
    assert.deepEqual(locale.meetingSections(report),engine.meetingSections(report));
    assert.equal(locale.t('Next'),'Next');
  }
});

test('localization introduces no collection, third-party service or changed decision engine; build copy is deterministic', () => {
  for (const file of ['assets/seo/cost-model.js','assessment-assets/assessment-model.js','assessment-assets/discovery-model.js','assessment-assets/assessment-summary.js','assessment-assets/assessment-pdf.js','assets/seo/cost-pdf.js','api/lead.js','assets/leads.js','legal/privacy.html']) {
    assert.equal(require('./try-preservation.cjs')(file,fs.readFileSync(file,'utf8')),cp.execFileSync('git',['show','20f901d:'+file],{encoding:'utf8'}),file);
  }
  const source = fs.readFileSync('assets/i18n/tool-locale.js','utf8');
  assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|\.innerHTML\s*=/);
  const before=fs.readFileSync('assets/i18n/tool-copy.js','utf8');cp.execFileSync('node',['scripts/tool-locales.cjs']);
  assert.equal(fs.readFileSync('assets/i18n/tool-copy.js','utf8'),before);
});
