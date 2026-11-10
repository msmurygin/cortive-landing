/* Presentation adapter only. Assessment decisions and integer-cent arithmetic stay in their original models. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    root.QuarkTools = factory(root.QuarkToolCopy, new URLSearchParams(location.search).get('lang'), root.QuarkDiscovery);
    root.QuarkTools.preparePage(document);
  }
})(typeof globalThis === 'object' ? globalThis : this, function createLocale(allCopy, requested, engine) {
  'use strict';
  const code = ['bg', 'ro'].includes(requested) ? requested : 'en';
  const active = code !== 'en', data = allCopy[code];
  const t = value => active && Object.hasOwn(data.terms, value) ? data.terms[value] : value;
  const message = (group, key, values = {}) => {
    let text = data?.[group]?.[key] ?? key;
    for (const [name, value] of Object.entries(values)) text = text.replaceAll('{' + name + '}', String(value));
    return text;
  };
  const budgetPrefixes = new Set(['missingScope', 'integerError', 'numberError', 'textError', 'choiceError']);
  const reportPrefixes = new Set(['clarify', 'prepare', 'further', 'investigate', 'suggestedOwner', 'deferredTopics', 'generated']);
  const b = (key, values) => message('budget', key, values) + (budgetPrefixes.has(key) ? ' ' : '');
  const r = key => message('report', key) + (reportPrefixes.has(key) ? ' ' : '');
  const label = key => t(engine.fields.find(f => f.key === key)?.label || key);
  function question(q) {
    if (!active) return q;
    return { ...q, ...data.questions[q.id], area: t(q.area), fields: q.fields.map(f => ({
      ...f, label: t(f.label), choices: f.choices.map(o => ({ ...o, label: t(o.label) }))
    })) };
  }
  function display(key, value) {
    if (!active) return engine.display(key, value);
    const f = engine.fields.find(item => item.key === key);
    if (value === undefined || value === null || value === '' || value === 'unknown'
      || Array.isArray(value) && value.includes('unknown')) return t('Not known / not decided yet');
    // Free-text answers are never translated, interpreted as markup or used as translation keys.
    if (['text', 'number', 'volume'].includes(f.type)) return String(value);
    return (Array.isArray(value) ? value : [value]).map(v => t(f.choices.find(o => o.value === v)?.label || v)).join(', ');
  }
  const actionFields = {
    interfaces: ['interfacePattern', 'interfaceRecovery'], equipment: ['equipmentOwner', 'fallback'],
    rf: ['rf'], clients: ['clientNeeds', 'clientVariance', 'uat'], obligations: ['obligations'],
    qc: ['qc'], production: ['productionFlows', 'productionLink'], returns: ['returns'],
    variants: ['productVariants'], replenishment: ['replenishment'], cold: ['monitoring', 'excursions']
  };
  const tasks = keys => keys.map(key => data.actions[key]).join(' ');
  function finding(item) {
    if (!active) return item;
    const [kind, id] = item.ruleId.split(':');
    const view = { ...item, supportingAnswers: item.supportingAnswers.map(a => ({
      ...a, label: label(a.answerKey), display: display(a.answerKey, a.value)
    })) };
    if (kind === 'fact') {
      const answer = item.supportingAnswers[0];
      return { ...view, title: label(id) + ': ' + display(id, answer.value), explanation: r('reported'), action: r('validateOwner') };
    }
    if (kind === 'unknown' || kind === 'prepare') return { ...view,
      title: r(kind === 'unknown' ? 'clarify' : 'prepare') + label(id),
      explanation: r(kind === 'unknown' ? 'unknownExplanation' : 'prepareExplanation'), action: data.actions[id]
    };
    if (kind === 'hypothesis' || kind === 'deferred') return { ...view,
      title: (kind === 'deferred' ? r('further') : '') + data.questions[id].title,
      explanation: r(kind === 'deferred' ? 'deferredExplanation' : 'hypothesisExplanation'),
      action: (kind === 'deferred' ? data.questions[id].help + ' ' : '') + r('reviewOwner')
    };
    if (kind === 'conflict') return { ...view, title: r(item.ruleId), explanation: r('conflictExplanation'), action: r('conflictAction') };
    if (kind === 'action') {
      const problem = id.startsWith('problem-') ? id.slice('problem-'.length) : null;
      return { ...view,
        title: problem ? r('investigate') + display('challenges', [problem]) : r(item.ruleId),
        explanation: r(problem ? 'problemExplanation' : 'actionExplanation:' + id),
        action: tasks(problem ? [id] : actionFields[id])
      };
    }
    if (kind === 'pilot') return { ...view, title: r(item.ruleId), explanation: r('pilotExplanation'), action: r('pilotAction') };
    throw new Error('Missing localized finding type: ' + item.ruleId);
  }
  function suggestedOwner(item) {
    const has = keys => item.supportingAnswers.some(a => keys.includes(a.answerKey));
    return r(has(['obligations', 'jurisdiction', 'qc', 'monitoring', 'excursions', 'segregation']) ? 'owner:quality'
      : has(['integrations', 'interfacePattern', 'interfaceRecovery', 'integrationOwner', 'automation', 'rf']) ? 'owner:it'
      : has(['materials', 'productionFlows', 'productionLink']) ? 'owner:production' : 'owner:operations');
  }
  function meetingSections(report) {
    if (!active) return engine.meetingSections(report);
    const value = key => display(key, report.answers[key]);
    const sources = item => item.supportingAnswers.map(a => label(a.answerKey)).join(', ');
    const evidence = item => item.supportingAnswers.map(a => label(a.answerKey) + ': ' + display(a.answerKey, a.value)).join('; ');
    const table = (key, headers, rows, notes = [], appendix = false) => ({
      title: r('section:' + key), table: { headers: headers.map(r), rows }, notes, appendix
    });
    const recommendations = report.recommendations.map(finding), risks = recommendations.slice(0, 5);
    const requirementKeys = ['tracking', 'units', 'integrations', 'clientNeeds', 'qc', 'productionFlows', 'productionLink', 'returns', 'replenishment', 'productVariants', 'segregation'];
    const fieldRows = keys => keys.map(key => [label(key), value(key)]);
    return [
      table('profile', ['Topic', 'Your answer'], fieldRows(['primaryIndustry', 'industries', 'models', 'sites', 'users', 'volume', 'volumeUnit', 'currentSystem', 'erp'])),
      table('operations', ['Topic', 'Your answer'], fieldRows(['processes', 'variants', 'ownership', 'environment', 'channel', 'rf', 'automation'])),
      table('requirements', ['Requirement / decision', 'Source'], report.confirmedCharacteristics
        .filter(item => requirementKeys.includes(item.supportingAnswers[0].answerKey)).map(item => [finding(item).title, sources(item)]), [r('requirementsNote')]),
      table('hypotheses', ['Discovery topic', 'Why it was selected'], report.derivedHypotheses.map(item => [finding(item).title, evidence(item)]),
        [r('hypothesesNote'), ...(report.questionPath.deferred.length ? [r('deferredTopics') + report.questionPath.deferred.map(q => data.questions[q.id].title).join('; ')] : [])]),
      table('dimensions', ['Dimension', 'Stated factors', 'Uncertainty'], report.complexityDimensions.map(dimension => [
        r('dimension:' + dimension.id), dimension.factors.map(factor => finding(factor).title).join('; ') || t('Insufficient information'),
        dimension.uncertainty.filter(item => item.reason !== 'Not selected by this path; relevance not established')
          .map(item => label(item.answerKey) + ': ' + r(item.reason === 'Unknown answer' ? 'unknownReason' : 'deferredReason')).join('; ') || r('noUnknowns')
      ]), [r('dimensionsNote')]),
      { ...table('readiness', ['Topic', 'Your answer'], fieldRows([...report.implementationReadiness.keys, 'horizon']), [r('readinessNote')]),
        title: r('section:readiness') + ': ' + t(report.implementationReadiness.level) },
      table('risks', ['Priority / issue', 'Why it matters', 'Source'], risks.map(item => ['P' + item.priority + ' / ' + item.title, item.explanation, sources(item)]),
        recommendations.length > 5 ? [r('moreRisks')] : risks.length ? [] : [r('noRisks')]),
      table('tasks', ['Task / suggested owner', 'What to collect, verify or decide', 'Source'], recommendations.map(item => [
        'P' + item.priority + ' / ' + item.title + '\n' + r('suggestedOwner') + suggestedOwner(item), item.action, sources(item)
      ]), [r('ownerNote')]),
      table('pilots', ['Proposal for validation', 'Initial validation task', 'Source'], report.candidateEvaluationScenarios.map(item => [finding(item).title + ': ' + finding(item).explanation, finding(item).action, sources(item)]), [r('pilotNote')]),
      { title: r('section:next'), items: [...(recommendations.length ? recommendations.slice(0, 3).map(item => item.action) : [r('nextReview')]), r('nextMeeting'), r('privacyNote')] },
      table('appendix', ['Question / source', 'Your answers'], engine.plan(report.answers).active.map(q => [q.id + ' / ' + data.questions[q.id].title,
        engine.visibleFields(q, report.answers).map(f => label(f.key) + ': ' + value(f.key)).join('; ')]), [], true),
      { title: r('section:method'), appendix: true, items: [r('generated') + report.generatedAt + ' | Taxonomy ' + report.taxonomyVersion + ' | Rules ' + report.rulesVersion + ' | JSON schema ' + report.assessmentSchemaVersion,
        r('methodNote'), r('disclaimer'), 'Quark | https://quark.build'] }
    ];
  }
  function scopePlan(plan, inputs) {
    if (!active) return plan;
    const labels = { warehouses: t('Warehouses'), users: t('Users'), integrations: t('Integrations'), 'operational complexity': t('Operational complexity') };
    const complexity = { standard: t('Standard processes'), moderate: t('Several process variants'), complex: t('Complex or site-specific processes'), unknown: b('complexityUnknown') };
    const entries = ['software', 'configuration', 'connections', 'migration', 'devices', 'ownership', 'contingency'];
    return { ...plan,
      summary: Object.entries(plan.scope).map(([key, value]) => labels[key] + ': ' + (value ?? t('Unknown'))).join(' · ') + ' · ' + complexity[inputs.complexity] + '.',
      missingScope: plan.missingScope.map(key => labels[key]),
      checklist: entries.map(key => [b(key + 'Title'), key === 'connections' && plan.scope.integrations === 0 ? b('noConnectionsAction')
        : b(key + 'Action') + (key === 'configuration' ? ' ' + b('process:' + inputs.complexity) : '')])
    };
  }
  function money(cents, currency) {
    const amount = BigInt(cents);
    return new Intl.NumberFormat(code === 'bg' ? 'bg-BG' : 'ro-RO', { style: 'currency', currency })
      .formatToParts(amount / 100n).map(part => part.type === 'fraction' ? String(amount % 100n).padStart(2, '0') : part.value).join('');
  }
  function error(text) {
    if (!active || t(text) !== text) return t(text);
    const fieldName = value => {
      const field = engine?.fields.find(f => f.label === value || f.key === value);
      if (field) return t(field.label);
      const input = typeof document === 'object' ? document.querySelector('[name="' + value.replace(/[^a-zA-Z0-9]/g, '') + '"]') : null;
      return input?.closest('label')?.childNodes[0]?.textContent?.trim() || t(value);
    };
    for (const [pattern, prefix] of [
      [/^Check whole-number count: (.+)$/, 'integerError'], [/^Enter a non-negative number with up to two decimals: (.+)$/, 'numberError'],
      [/^Check the whole-number value for (.+)\. Leave blank if unknown\.$/, 'integerError'],
      [/^Use (?:a short description|up to 120 characters without control characters) for (.+)\.$/, 'textError'],
      [/^Choose (?:a listed value|known options, none, or unknown) for (.+)\.$/, 'choiceError']
    ]) { const match = text.match(pattern); if (match) return b(prefix) + fieldName(match[1]); }
    return b('validationError');
  }
  function translateStatic(node) {
    const doc = node.ownerDocument || node;
    const walker = doc.createTreeWalker(node, 4);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const text of nodes) {
      if (text.parentElement.closest('script,style,svg,[lang="en"],noscript')) continue;
      const trimmed = text.nodeValue.trim();
      if (trimmed && t(trimmed) !== trimmed) text.nodeValue = text.nodeValue.replace(trimmed, t(trimmed));
    }
    for (const element of node.querySelectorAll('[placeholder],[aria-label]')) {
      if (element.closest('[lang="en"]')) continue;
      for (const attr of ['placeholder', 'aria-label']) if (element.hasAttribute(attr)) element.setAttribute(attr, t(element.getAttribute(attr)));
    }
  }
  function preparePage(doc) {
    if (!active) return;
    doc.documentElement.lang = code;
    doc.body.classList.add('q-localized-tool');
    const calculator = doc.getElementById('calculator');
    doc.title = t(calculator ? 'WMS Cost Calculator' : 'WMS Readiness Assessment') + ' | Quark WMS';
    if (calculator) {
      // The interactive tool is localized. The existing sourced editorial guide stays explicitly English.
      const prose = calculator.parentElement, guide = doc.createElement('details');
      guide.id = 'english-cost-guide';
      const summary = doc.createElement('summary'); summary.textContent = b('englishGuide'); guide.append(summary);
      const english = doc.createElement('div'); english.lang = 'en';
      for (const child of [...prose.children]) if (child !== calculator) english.append(child);
      guide.append(english); prose.append(guide);
      const toc = doc.querySelector('.q-toc'); if (toc) toc.remove();
      const hero = doc.querySelector('.q-hero');
      hero.querySelector('h1').textContent = b('heroTitle');
      hero.querySelector('.q-lede').textContent = b('heroText');
      hero.querySelector('.q-mute').textContent = b('heroNote');
      hero.querySelector('.q-btn').textContent = b('startBudget');
      hero.querySelector('.q-tag').textContent = b('noPrefilled');
      hero.querySelector('.q-meta > span').textContent = t('WMS budget planner');
      const grid = doc.querySelector('.q-article'); if (grid) grid.style.display = 'block';
    }
    // Keep local tools and the regional feature overview in the same language.
    for (const anchor of doc.querySelectorAll('a[href]')) {
      if (anchor.closest('[lang="en"]')) continue;
      const href = anchor.getAttribute('href');
      if (/^\/(wms-cost|tools\/wms-readiness-assessment)(#.*)?$/.test(href)) {
        const [route, hash = ''] = href.split('#'); anchor.setAttribute('href', route + '?lang=' + code + (hash ? '#' + hash : ''));
      } else if (href === '/') anchor.setAttribute('href', '/' + code);
      else if (href === '/product' || href.startsWith('/product#')) anchor.setAttribute('href', '/' + code + (href === '/product#workflows' ? '#workflows' : '#features'));
      else if (href === '/solutions/legacy-hardware') anchor.setAttribute('href', href + '/' + code);
      else if (/^\/(pricing|integrations|vision|legal\/)/.test(href) || href.startsWith('https://docs.quark.build')) {
        anchor.setAttribute('hreflang', 'en');
        if (!anchor.closest('header')) {
          const note = doc.createElement('span'); note.textContent = ' (' + b('english') + ')';
          anchor.append(note);
        }
      }
    }
    // Give the field heading its own grid item. Subgrid can then align controls
    // to the tallest heading in each row, regardless of translated text length.
    for (const field of doc.querySelectorAll('.cost-grid > label')) {
      const heading = doc.createElement('span'); heading.className = 'cost-field-label';
      for (const child of [...field.childNodes]) if (child.nodeType === 3) heading.append(child);
      field.prepend(heading);
    }
    translateStatic(doc.body);
    const burger = doc.querySelector('.q-burger'); if (burger) burger.dataset.closeLabel = t('Close');
    // Navigation contains locale only; answers and financial inputs are never placed in a URL.
    const switcher = doc.createElement('nav'); switcher.className = 'q-wrap q-tool-languages'; switcher.setAttribute('aria-label', b('language'));
    for (const lang of ['en', 'bg', 'ro']) {
      const link = doc.createElement('a'); link.textContent = { en: 'English', bg: 'Български', ro: 'Română' }[lang];
      link.href = location.pathname + (lang === 'en' ? '' : '?lang=' + lang); link.lang = lang;
      if (lang === code) link.setAttribute('aria-current', 'page'); switcher.append(link);
    }
    doc.querySelector('main').prepend(switcher);
    const style = doc.createElement('link'); style.rel = 'stylesheet'; style.href = '/assets/i18n/tool-locale.css'; doc.head.append(style);
    let printDetails = [];
    window.addEventListener('beforeprint', () => {
      printDetails = [...doc.querySelectorAll('#report details,#advancedBudget:not([hidden]) details')].map(detail => [detail, detail.open]);
      printDetails.forEach(([detail]) => { detail.open = true; });
    });
    window.addEventListener('afterprint', () => { printDetails.forEach(([detail, open]) => { detail.open = open; }); printDetails = []; });
  }
  return { code, active, t, b, r, question, display, finding, meetingSections, scopePlan, money, error, preparePage };
});
