/* Guided presentation of the existing local RF runtime. No requests or data storage here. */
(function (root) {
  'use strict';
  root.QuarkTry = { create };

  function create(api) {
    const { state: state, Flow, esc } = api;
    let screen = 'choose', questionIndex = 0, technical = false;
    const operations = {
      receiving: ['Receive goods', 'Scan a delivery, identify the product and receive it into stock.', '01'],
      putaway: ['Put away a pallet', 'Move a labelled pallet from the dock to a storage location.', '02'],
      picking: ['Pick an order', 'Find the product, confirm the quantity and complete the pick.', '03'],
    };
    const button = (id, label, secondary = false) => '<button type="button" id="' + id + '" class="qe-btn' + (secondary ? ' is-ghost' : '') + '">' + label + '</button>';
    const heading = (title, text) => '<h2 id="qt-title" tabindex="-1">' + title + '</h2><p class="qt-intro">' + text + '</p>';
    const error = () => state.formErr ? '<p class="qe-err" role="alert">' + esc(state.formErr) + '</p>' : '';
    function focusTitle() {
      api.root.querySelector('#qt-title')?.focus({ preventScroll: true });
      api.root.scrollIntoView?.({ block: 'start', behavior: 'instant' });
    }
    function redraw() { api.render(); focusTitle(); }
    function choose(operation) {
      if (state.setup.task.operation !== operation) {
        api.cancelAI();
        state.setup.task = Flow.emptyTask();
        state.setup.taskManual = {};
        state.setup.ai = null;
        state.setup.rfLocale = null;
        state.setup.rules = [];
        state.setup.aiKnown = {};
        state.dialog = [];
        state.answers = {};
        state.clarification = '';
      }
      Object.assign(state.setup.task, { operation, title: Flow.labels[operation], steps: Flow.defaults(operation, false, false) });
      state.setup.taskManual.operation = true;
      state.stage = 'drop';
      state.phase = 'setup';
      state.formErr = '';
      screen = 'describe';
      questionIndex = 0;
      technical = false;
      state.guideSkipQuestions = false;
      redraw();
    }
    function useExample() {
      api.cancelAI();
      const operation = state.setup.task.operation;
      const task = Flow.emptyTask();
      Object.assign(task, { operation, title: Flow.labels[operation], steps: Flow.defaults(operation, false, false) });
      Object.assign(task.product, { name: 'Olive oil · 500 ml', sku: 'DEMO-OLIVE-500', pack_label: 'Case', pack_quantity: 2, pack_units: 6, serialized: false, lot_controlled: false });
      state.setup.task = task;
      state.setup.taskManual = { operation: true };
      state.setup.src = 'demo';
      state.setup.ai = null;
      state.setup.rfLocale = null;
      state.setup.rules = [];
      // This is deliberately a local sample, not a claim about the uploaded plan.
      Object.assign(state.setup, { aisles: 3, bays: 4, levels: 4 });
      state.formErr = '';
      api.generate();
    }
    function describeHTML() {
      const operation = Flow.labels[state.setup.task.operation];
      return heading('What do you store?', 'Describe the product and how it is packed. A short sentence is enough.') +
        '<p class="qt-context">Your operation: <strong>' + esc(operation) + '</strong></p>' +
        '<label class="qe-lab" for="qe-desc">Your warehouse or product</label><textarea id="qe-desc" class="qe-ta" maxlength="5000" placeholder="For example: receive 3 laptops, each with its own serial number.">' + esc(state.setup.text) + '</textarea>' +
        '<details class="qt-optional"' + (state.setup.plan ? ' open' : '') + '><summary>Add a warehouse plan (optional)</summary><div class="qt-upload"><label class="qe-lab" for="qe-plan">JPEG, PNG or PDF · up to 3 MB</label><input type="file" id="qe-plan" accept="image/jpeg,image/png,application/pdf">' +
        (state.setup.plan ? '<p class="qe-note">Selected: ' + esc(state.setup.plan.name) + '</p>' + button('qe-unplan', 'Remove plan', true) : '') + '</div></details>' + error() +
        '<p class="qe-note">Continue sends your description and any selected plan to Quark AI. Only share material you have permission to use. <a href="/legal/privacy.html">Privacy</a></p>' +
        '<div class="qt-actions"><button type="button" id="qt-analyze" class="qe-btn"' + (!state.setup.text.trim() && !state.setup.plan ? ' disabled' : '') + '>Continue with Quark AI <span aria-hidden="true">→</span></button>' + button('qt-example', 'Use an example instead', true) + '</div>' +
        (state.formErr ? button('qt-manual', 'Configure the example manually', true) + '<p class="qe-note">Start with editable sample values. This does not analyse your description or plan.</p>' : '') +
        '<button type="button" class="qe-link" id="qt-choose">← Change operation</button>';
    }
    function clarifyHTML(questions) {
      questionIndex = Math.min(questionIndex, questions.length - 1);
      const last = questionIndex === questions.length - 1;
      return heading('One quick question', 'Help us make the example fit. It is fine if you do not know the answer.') +
        '<p class="qt-context">Question ' + (questionIndex + 1) + ' of ' + questions.length + '</p><label class="qt-question" for="qe-answer-' + questionIndex + '">' + esc(questions[questionIndex]) + '</label>' +
        '<textarea class="qe-ta" id="qe-answer-' + questionIndex + '" data-question="' + questionIndex + '" maxlength="400" placeholder="Your answer…">' + esc(state.answers?.[questionIndex] || '') + '</textarea>' + error() +
        '<div class="qt-actions">' + button(last ? 'qt-refine' : 'qt-next-question', last ? 'Update my example →' : 'Next question →') + button('qt-unknown', 'I do not know', true) + '</div>' +
        '<div class="qt-actions">' + (questionIndex ? button('qt-previous-question', '← Previous question', true) : '') + button('qt-review', 'Try with sample values', true) + '</div><p class="qe-note">Answers are sent for AI analysis when you update the example. Sample values are for this preview only.</p>';
    }
    function reviewHTML() {
      const task = state.setup.task, p = task.product;
      const adjustOpen = api.root.querySelector('#qt-adjust')?.open;
      return heading('Your example is ready', 'Review the product, then try the task on the RF screen.') +
        (state.setup.ai ? '<p class="qt-context">' + esc(state.setup.ai.summary) + '</p>' : '') +
        '<dl class="qt-review"><div><dt>Operation</dt><dd>' + esc(Flow.labels[task.operation]) + '</dd></div><div><dt>Product</dt><dd>' + esc(p.name || 'Sample product') + '</dd></div><div><dt>Packaging</dt><dd>' + (p.pack_quantity || (p.serialized ? 3 : 24)) + ' ' + esc(p.pack_label || 'Each') + ' × ' + (p.pack_units || 1) + '</dd></div></dl>' +
        '<form id="qe-form" novalidate><details id="qt-adjust" class="qt-optional"' + (state.formErr || adjustOpen ? ' open' : '') + '><summary>Adjust the example (optional)</summary><div class="qt-adjust">' +
        '<div class="qe-nums">' + ['aisles', 'bays', 'levels'].map((key, i) => '<div class="qe-nf"><label for="qe-' + key + '">' + ['Aisles', 'Bays / rack', 'Rack levels'][i] + '</label><input class="qe-num" id="qe-' + key + '" data-k="' + key + '" type="number" min="1" max="' + [12,20,8][i] + '" value="' + state.setup[key] + '"><small>sample layout · adjustable</small></div>').join('') + '</div>' + api.taskParamsHTML() + '</div></details>' + error() +
        '<p class="qe-note">This is a local simulation. Unspecified products, addresses and stock use sample data.</p><div class="qt-actions"><button type="submit" class="qe-btn">Try ' + esc(Flow.labels[task.operation].toLowerCase()) + ' <span aria-hidden="true">→</span></button></div></form>' + button('qt-describe', '← Edit description', true);
    }
    function liveHTML() {
      const completed = state.run.completed;
      return heading(completed ? 'Task complete.' : 'Try it on the RF screen.', completed ? 'You have completed the example. Restart it, try another operation, or send your setup to the Quark team.' : 'Use “Use sample” below each field, or type a value and press Enter. No scanner needed.') +
        '<div class="qt-live"><section class="qt-terminal" aria-label="WebRF preview">' + api.rfHTML() + '</section><aside class="qt-help"><p class="qe-lab">' + esc(Flow.labels[state.definition.operation]) + '</p><h3>' + esc(state.definition.product.name) + '</h3><p>' + state.definition.product.pack_quantity + ' ' + esc(state.definition.product.pack_label) + ' × ' + state.definition.product.pack_units + ' units</p><p class="qe-note">Both interface views use the same accepted scans and progress.</p><div class="qt-actions">' + (completed ? button('qe-cont', 'Send this setup to Quark') : '') + button('qe-reset', 'Restart task', true) + button('qt-choose', 'Try another operation', true) + '</div></aside></div>' +
        '<button type="button" class="qe-link qt-technical-toggle" id="qt-technical" aria-expanded="' + technical + '" aria-controls="qt-technical-panel">' + (technical ? 'Hide' : 'Show') + ' terminal view &amp; technical details</button>' +
        (technical ? '<div id="qt-technical-panel" class="qt-technical"><section aria-label="Terminal UI preview"><h3>Terminal UI · same workflow</h3>' + api.tuiHTML() + '</section><section aria-label="Location schematic"><h3>Sample layout</h3>' + api.faceHTML() + '</section><section aria-label="Event journal"><h3>Accepted events</h3>' + api.logHTML() + '</section><details><summary>Process JSON</summary><pre>' + esc(JSON.stringify(state.definition, null, 2)) + '</pre></details></div>' : '');
    }
    function html() {
      const step = state.phase === 'live' || state.phase === 'preparing' ? 3 : screen === 'choose' ? 1 : 2;
      let body;
      if (state.phase === 'preparing') body = heading('Preparing your example…', 'Connecting the sample workflow to the RF screen.') + '<p class="qe-note" role="status">Almost ready…</p>';
      else if (state.phase === 'live') body = liveHTML();
      else if (screen === 'choose') body = heading('What would you like to try?', 'Choose one warehouse operation. We will guide you through it.') + '<div class="qt-choices">' + Object.entries(operations).map(([key, [title, text, number]]) => '<button type="button" class="qt-choice" data-qt-operation="' + key + '"><span class="qt-number">' + number + '</span><strong>' + title + '</strong><span>' + text + '</span><span class="qt-arrow" aria-hidden="true">↗</span></button>').join('') + '</div><p class="qe-note">No account needed. Start with an example or describe your own warehouse.</p>';
      else if (state.stage === 'analyzing') body = heading('Building your example…', 'Quark AI is reading your description' + (state.setup.plan ? ' and plan.' : '.')) + '<p class="qe-note" role="status">This can take a few moments.</p>' + button('qt-cancel', 'Cancel and go back', true);
      else if (state.stage === 'params') body = !state.guideSkipQuestions && state.setup.ai?.uncertainties?.length ? clarifyHTML(state.setup.ai.uncertainties) : reviewHTML();
      else body = describeHTML();
      return '<div class="qt-shell"' + (state.modal ? ' inert' : '') + '><ol class="qt-progress" aria-label="Your progress">' + ['Choose an operation', 'Describe your warehouse', 'Try the task'].map((name, i) => '<li' + (step === i + 1 ? ' aria-current="step"' : '') + '><span>' + (i + 1) + '</span>' + name + '</li>').join('') + '</ol><div class="qt-content">' + body + '</div></div>' + api.modalHTML();
    }
    function click(target) {
      if (target.dataset.qtOperation) { choose(target.dataset.qtOperation); return true; }
      const id = target.id;
      if (id === 'qt-choose') { api.cancelAI(); api.stopTimers(); state.phase = 'setup'; state.modal = false; screen = 'choose'; redraw(); return true; }
      if (id === 'qt-describe' || id === 'qt-cancel') { api.cancelAI(); state.stage = 'drop'; state.formErr = ''; screen = 'describe'; redraw(); return true; }
      if (id === 'qt-example') { useExample(); return true; }
      if (id === 'qt-manual') {
        api.cancelAI();
        state.formErr = '';
        state.stage = 'params';
        state.setup.src = 'demo';
        state.guideSkipQuestions = true;
        redraw();
        return true;
      }
      if (id === 'qt-analyze') {
        if (!state.setup.text.trim() && !state.setup.plan) return true;
        state.guideSkipQuestions = false; questionIndex = 0;
        return api.analyze(state.setup.plan, { text: state.setup.text + '\nSelected demo operation: ' + state.setup.task.operation + '. Keep this operation; clarify incompatible requirements.' });
      }
      if (id === 'qt-review') { state.guideSkipQuestions = true; redraw(); return true; }
      if (id === 'qt-technical') { technical = !technical; api.render(); return true; }
      if (id === 'qt-previous-question') { questionIndex = Math.max(0, questionIndex - 1); redraw(); return true; }
      if (['qt-next-question', 'qt-refine', 'qt-unknown'].includes(id)) {
        if (id === 'qt-unknown') (state.answers ||= {})[questionIndex] = 'Unknown. Use a clearly labelled sample assumption for this demo.';
        if (!(state.answers?.[questionIndex] || '').trim()) { state.formErr = 'Add an answer, or choose “I do not know”.'; redraw(); return true; }
        state.formErr = '';
        if (questionIndex < state.setup.ai.uncertainties.length - 1) { questionIndex++; redraw(); return true; }
        if (id === 'qt-unknown') { redraw(); return true; }
        questionIndex = 0;
        return api.refine();
      }
      return false;
    }
    return { html, click, focusTitle };
  }
})(typeof window === 'object' ? window : this);
