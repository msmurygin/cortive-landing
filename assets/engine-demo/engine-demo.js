/* Quark — one metadata engine, two interfaces. Single shared state; WebRF and TUI are pure renders of it. Workflow runs locally; optional Quark AI analysis uses the same-origin server endpoint. */
(function () {
  const root = document.getElementById('qe-root');
  const Flow = window.QuarkEngineFlow;
  if (!root || !Flow) return;
  const $ = (s, r) => (r || root).querySelector(s);
  const esc = (s) =>
    String(s == null ? '' : s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  let guide = null;
  const TYPES = ['E-commerce', 'Distribution', '3PL', 'Manufacturing'];
  const LIM = { aisles: [1, 12], bays: [1, 20], levels: [1, 8] };
  const TASK = {
    doc: 'PO-DEMO-1042',
    lpn: 'DEMO-LPN-001',
    item: 'BOTTLE-500',
    itemName: 'Bottle 500 ml',
    qty: 24,
    target: 'A-01-02-L1',
  };
  const WRONG = 'B-02-01-L3';
  const EXAMPLE = 'An e-commerce warehouse with 3 aisles, 4 bays per rack and 4 levels.';
  let pendingFile = null,
    aiController = null,
    aiSerial = 0;
  const state = {
    phase: 'setup',
    stage: 'drop',
    an: null,
    dragOver: false,
    setup: {
      task: Flow.emptyTask(),
      taskManual: {},
      ai: null,
      aiKnown: {},
      type: 'E-commerce',
      aisles: 3,
      bays: 4,
      levels: 4,
      text: '',
      plan: null,
      src: null,
      manual: {},
      fromText: {},
    },
    prog: 0,
    step: 'receive',
    draft: '',
    mismatch: null,
    dock: 0,
    onhand: 0,
    log: [],
    modalShown: false,
    modal: false,
    sent: false,
    sending: false,
    sendErr: '',
    sync: null,
    face: { aisle: 'A', side: '02' },
    formErr: '',
  };
  const pad = (n) => String(n).padStart(2, '0');
  const clamp = (k, v) => {
    v = parseInt(v, 10);
    if (isNaN(v)) return null;
    return Math.max(LIM[k][0], Math.min(LIM[k][1], v));
  };
  const locCount = () => state.setup.aisles * 2 * state.setup.bays * state.setup.levels;
  const aisleL = (i) => String.fromCharCode(65 + i);
  const lastLoc = () =>
    aisleL(state.setup.aisles - 1) + '-' + pad(state.setup.bays) + '-02-L' + state.setup.levels;
  function locExists(c) {
    const m = /^([A-Z])-(\d{2})-(0[12])-L(\d)$/.exec(c);
    if (!m) return false;
    return (
      m[1].charCodeAt(0) - 65 < state.setup.aisles &&
      +m[2] >= 1 &&
      +m[2] <= state.setup.bays &&
      +m[4] >= 1 &&
      +m[4] <= state.setup.levels
    );
  }
  const now = () => {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  };
  function log(k, m, cls) {
    state.log.push({ t: now(), k, m, cls });
    if (state.log.length > 7) state.log = state.log.slice(-7);
  }
  /* ---------- one metadata process, two renderers ---------- */
  const SRC = { web: 'WebRF', tui: 'TUI', map: 'Schematic' };
  function synced(from) {
    log('WEBRF PREVIEW', 'State updated' + (from === 'web' ? '' : ' · from ' + SRC[from]));
    log('TUI PREVIEW', 'State updated' + (from === 'tui' ? '' : ' · from ' + SRC[from]));
    state.sync = { from, at: Date.now() };
  }
  function syncProcess() {
    if (!state.definition || !state.run) return;
    const d = state.definition,
      r = state.run,
      v = Flow.view(d, r),
      target = v.code === 'scan_source' ? d.source : d.destination;
    Object.assign(TASK, {
      doc: d.document,
      lpn: d.lpn,
      item: d.product.sku,
      itemName: d.product.name,
      qty: d.total_units,
      target,
    });
    state.step = r.completed
      ? 'done'
      : ['scan_source', 'scan_destination'].includes(v.code)
        ? 'scan'
        : 'workflow';
    state.onhand = r.stored;
    state.dock = r.dock;
    if (/^[A-L]-/.test(target) && ['scan_source', 'scan_destination'].includes(v.code)) {
      state.face = { aisle: target[0], side: target.split('-')[2] };
    }
  }
  function mergeTask(task) {
    if (!task) return;
    const st = state.setup,
      old = st.task || Flow.emptyTask(),
      next = JSON.parse(JSON.stringify(task));
    for (const key of Object.keys(st.taskManual || {})) {
      if (key.startsWith('product.')) next.product[key.slice(8)] = old.product[key.slice(8)];
      else next[key] = old[key];
    }
    if (
      st.taskManual.operation ||
      st.taskManual['product.serialized'] ||
      st.taskManual['product.lot_controlled']
    )
      next.steps = Flow.defaults(
        next.operation || 'receiving_and_putaway',
        next.product.serialized,
        next.product.lot_controlled,
      );
    st.task = next;
  }
  const act = {
    submit(from, value) {
      if (state.phase !== 'live') return;
      const before = Flow.view(state.definition, state.run),
        entered = value == null ? state.draft : value;
      state.run = Flow.submit(state.definition, state.run, entered);
      state.draft = state.run.error ? String(entered || '') : '';
      state.mismatch =
        state.run.error && ['scan_source', 'scan_destination'].includes(before.code)
          ? { code: String(entered || '').toUpperCase(), why: state.run.error }
          : null;
      for (const message of state.run.events)
        log(before.control === 'serial' ? 'SERIAL' : 'WORKFLOW', message, 'ok');
      if (state.run.error) log('CHECK', state.run.error, 'er');
      syncProcess();
      synced(from);
      render();
      if (guide && state.run.completed) guide.focusTitle();
      const scan = $('#' + (from === 'tui' ? 'qe-tuiscan' : 'qe-rfscan'));
      if (scan && state.run.error) {
        scan.focus({ preventScroll: true });
        scan.select();
      }
      if (state.run.completed && !state.modalShown && !guide) {
        state.modalShown = true;
        leadTimer = setTimeout(() => {
          if (state.phase === 'live' && state.run?.completed) {
            state.modal = true;
            render();
          }
        }, 900);
      }
    },
    demo(from) {
      return act.submit(from, Flow.expected(state.definition, state.run));
    },
    scan(value, from) {
      return act.submit(from, value);
    },
    back(from) {
      state.draft = '';
      state.mismatch = null;
      if (state.run) state.run.error = null;
      log('WORKFLOW', 'Entry cleared · accepted scans and progress kept');
      synced(from);
      render();
    },
  };
  let prepT = [],
    leadTimer;
  function generate() {
    clearTimeout(leadTimer);
    state.mailSerial = (state.mailSerial || 0) + 1;
    const st = state.setup;
    ['aisles', 'bays', 'levels'].forEach((k) => {
      st[k] = clamp(k, st[k]) || LIM[k][0];
    });
    try {
      state.definition = Flow.resolve(st.task || Flow.emptyTask(), st);
      state.run = Flow.create(state.definition);
    } catch (e) {
      state.formErr = e.message;
      state.stage = 'params';
      state.phase = 'setup';
      return render();
    }
    Object.assign(state, {
      phase: 'preparing',
      prog: 0,
      draft: '',
      mismatch: null,
      log: [],
      modalShown: false,
      modal: false,
      sent: false,
      sending: false,
      sendErr: '',
      sync: null,
      face: {
        aisle: state.definition.destination[0],
        side: state.definition.destination.split('-')[2],
      },
    });
    syncProcess();
    if (guide) {
      state.phase = 'live';
      log('WORKFLOW', 'Local sample ready', 'ok');
      render();
      guide.focusTitle();
      return;
    }
    const seq = [
      ['INPUT', 'Preview parameters accepted · ' + st.type],
      [
        'LAYOUT',
        st.aisles + ' aisles × 2 rack faces × ' + st.bays + ' bays × ' + st.levels + ' levels',
      ],
      ['METADATA', state.definition.title + ' · ' + state.definition.steps.length + ' RF screens'],
      [
        'PRODUCT',
        state.definition.product.name +
          ' · ' +
          state.definition.product.pack_quantity +
          ' ' +
          state.definition.product.pack_label +
          ' × ' +
          state.definition.product.pack_units +
          ' = ' +
          state.definition.total_units +
          ' units',
      ],
      ['WEBRF PREVIEW', 'Process JSON attached'],
      ['TUI PREVIEW', 'Same process JSON attached'],
      ['READY', 'Ready · ' + Flow.labels[state.definition.operation]],
    ];
    prepT.forEach(clearTimeout);
    prepT = [];
    render();
    seq.forEach((x, i) =>
      prepT.push(
        setTimeout(
          () => {
            log(x[0], x[1], i === seq.length - 1 ? 'ok' : '');
            state.prog = Math.round(((i + 1) / seq.length) * 100);
            if (i === seq.length - 1) state.phase = 'live';
            render();
          },
          260 * (i + 1),
        ),
      ),
    );
  }
  /* ---------- renders ---------- */
  const DEMO_PLAN = { name: 'demo-ecommerce-schematic.svg', demo: true };
  function demoPlanSVG(k) {
    const boxes = [
      { x: 14, y: 124, w: 212, h: 30, l: 'DOCK AREA', lx: 224, ly: 151, a: 'end' },
      { x: 20, y: 8, w: 200, h: 34, l: 'BLOCK A', lx: 210, ly: 27, a: 'end' },
      { x: 20, y: 46, w: 200, h: 34, l: 'BLOCK B', lx: 210, ly: 65, a: 'end' },
      { x: 20, y: 84, w: 200, h: 34, l: 'BLOCK C', lx: 210, ly: 103, a: 'end' },
      { x: 36, y: 9, w: 176, h: 12, l: '4 BAYS / ROW', lx: 38, ly: 27, a: 'start' },
    ];
    let g = '';
    for (let i = 0; i < 3; i++) {
      const y = 10 + i * 38;
      ['', ' '].forEach((_, r) => {
        const yy = y + r * 20;
        g += '<rect x="36" y="' + yy + '" width="176" height="10" class="r"/>';
        for (let b = 1; b < 4; b++)
          g +=
            '<line x1="' +
            (36 + b * 44) +
            '" x2="' +
            (36 + b * 44) +
            '" y1="' +
            yy +
            '" y2="' +
            (yy + 10) +
            '" class="r"/>';
      });
      g += '<text x="24" y="' + (y + 18) + '" class="t">' + 'ABC'[i] + '</text>';
    }
    g += '<rect x="18" y="128" width="204" height="22" class="d"/>';
    for (let i = 0; i < 6; i++)
      g += '<rect x="' + (28 + i * 32) + '" y="150" width="20" height="4" class="dd"/>';
    g += '<text x="120" y="142" class="t" text-anchor="middle">DOCK</text>';
    const bb = boxes
      .slice(0, k)
      .map(
        (b, i) =>
          '<g class="bb' +
          (i === k - 1 ? ' is-new' : '') +
          '"><rect x="' +
          b.x +
          '" y="' +
          b.y +
          '" width="' +
          b.w +
          '" height="' +
          b.h +
          '"/><text x="' +
          b.lx +
          '" y="' +
          b.ly +
          '" text-anchor="' +
          b.a +
          '">' +
          b.l +
          '</text></g>',
      )
      .join('');
    return (
      '<svg viewBox="0 0 240 160" class="qe-plan-svg" aria-label="Demo e-commerce warehouse schematic">' +
      g +
      bb +
      '</svg>'
    );
  }
  function previewHTML() {
    const p = state.setup.plan,
      k = state.an ? state.an.k : 5;
    if (!p || p.demo) return demoPlanSVG(k);
    if (p.url) return '<img src="' + p.url + '" alt="Uploaded plan ' + esc(p.name) + '">';
    return (
      '<div class="qe-pdf"><span>PDF</span><b>' +
      esc(p.name) +
      '</b><small>' +
      Math.max(1, Math.round(p.size / 1024)) +
      ' KB</small></div>'
    );
  }
  function hasReplies() {
    return Boolean(
      (state.clarification || '').trim() ||
      Object.values(state.answers || {}).some((v) => v.trim()),
    );
  }
  function questionsHTML(ai) {
    const questions = Array.isArray(ai.uncertainties) ? ai.uncertainties : [];
    return (
      '<div class="qe-ai-result"><div class="qe-conversation" role="region" aria-label="AI questions and your answers" tabindex="0"><p>' +
      esc(ai.summary) +
      '</p>' +
      ((state.dialog || []).length
        ? '<details class="qe-history"><summary>Previous answers · ' +
          state.dialog.length +
          ' rounds</summary>' +
          state.dialog
            .map(
              (r) =>
                '<div>' +
                r.replies
                  .map((x) => '<p><b>' + esc(x.question) + '</b><br>' + esc(x.answer) + '</p>')
                  .join('') +
                (r.additional_information ? '<p>' + esc(r.additional_information) + '</p>' : '') +
                '</div>',
            )
            .join('') +
          '</details>'
        : '') +
      (questions.length
        ? '<ol class="qe-questions">' +
          questions
            .map(
              (q, i) =>
                '<li><label class="qe-question" for="qe-answer-' +
                i +
                '">' +
                esc(q) +
                '</label><textarea class="qe-ta qe-answer" id="qe-answer-' +
                i +
                '" data-question="' +
                i +
                '" maxlength="400" placeholder="Your answer, or say this is unknown…">' +
                esc((state.answers || {})[i] || '') +
                '</textarea></li>',
            )
            .join('') +
          '</ol>'
        : '') +
      '<label class="qe-lab" for="qe-answer" style="margin-top:16px">' +
      (questions.length ? 'Anything else? (optional)' : 'Refine this setup') +
      '</label><textarea class="qe-ta" id="qe-answer" maxlength="2000" placeholder="You can reply in any language or choose assumptions for this demo.">' +
      esc(state.clarification || '') +
      '</textarea></div><button type="button" class="qe-btn is-wide" id="qe-refine"' +
      (hasReplies() ? '' : ' disabled') +
      '>Update setup with Quark AI →</button><p class="qe-note" style="margin-top:8px">Your answers and the selected plan are sent for AI analysis. You do not need to choose the file again.</p></div>'
    );
  }
  function taskParamsHTML() {
    const st = state.setup,
      t = st.task || Flow.emptyTask(),
      p = t.product,
      op = t.operation || 'receiving_and_putaway';
    const input = (id, label, value, type = 'text', max = 80) =>
      '<div><label class="qe-lab" for="' +
      id +
      '">' +
      label +
      '</label><input class="qe-task-input" id="' +
      id +
      '" type="' +
      type +
      '" value="' +
      esc(value) +
      '"' +
      (type === 'number' ? ' min="1" max="1000" inputmode="numeric"' : ' maxlength="' + max + '"') +
      '></div>';
    let definition;
    try {
      definition = Flow.resolve(t, st);
    } catch (e) {
      definition = null;
    }
    return (
      '<div class="qe-task-params"><div><label class="qe-lab" for="qe-operation">RF process</label><select class="qe-task-input" id="qe-operation">' +
      Flow.operations
        .map(
          (x) =>
            '<option value="' +
            x +
            '"' +
            (op === x ? ' selected' : '') +
            '>' +
            Flow.labels[x] +
            '</option>',
        )
        .join('') +
      '</select></div>' +
      input('qe-product', 'Product', p.name || 'Sample product') +
      input(
        'qe-sku',
        'Product barcode / SKU',
        p.sku || definition?.product.sku || 'DEMO-SAMPLE-PRODUCT',
        'text',
        40,
      ) +
      input('qe-pack-label', 'Packaging / UOM', p.pack_label || 'Each', 'text', 40) +
      '<div class="qe-pack-grid">' +
      input('qe-pack-qty', 'Packages', p.pack_quantity || (p.serialized ? 3 : 24), 'number') +
      input('qe-pack-units', 'Units per package', p.pack_units || 1, 'number') +
      '</div>' +
      '<label class="qe-consent"><input id="qe-serialized" type="checkbox"' +
      (p.serialized ? ' checked' : '') +
      '><span>Serial-controlled · one serial per base unit</span></label><label class="qe-consent"><input id="qe-lot-controlled" type="checkbox"' +
      (p.lot_controlled ? ' checked' : '') +
      '><span>Capture a lot / batch</span></label>' +
      input('qe-lpn', 'LPN / container', t.lpn || 'DEMO-LPN-001', 'text', 40) +
      '<div><label class="qe-lab" for="qe-target-aisle">Destination aisle</label><select class="qe-task-input" id="qe-target-aisle">' +
      (t.destination_aisle && t.destination_aisle.charCodeAt(0) - 65 >= st.aisles
        ? '<option value="" selected>Choose an aisle</option>'
        : '') +
      Array.from({ length: st.aisles }, (_, i) => String.fromCharCode(65 + i))
        .map(
          (a) =>
            '<option value="' +
            a +
            '"' +
            ((t.destination_aisle || 'A') === a ? ' selected' : '') +
            '>' +
            a +
            '</option>',
        )
        .join('') +
      '</select></div>' +
      '<p class="qe-note">Check product and packaging before starting. Missing values use sample data; sample availability is independent of your real stock.</p>' +
      (definition
        ? '<details class="qe-definition"><summary>RF process definition · ' +
          definition.steps.length +
          ' screens</summary><ol>' +
          definition.steps.map((c) => '<li>' + esc(Flow.catalogue[c].label) + '</li>').join('') +
          '</ol><pre>' +
          esc(
            JSON.stringify(
              {
                operation: definition.operation,
                product: definition.product,
                lpn: definition.lpn,
                steps: definition.steps,
              },
              null,
              2,
            ),
          ) +
          '</pre></details>'
        : '') +
      '</div>'
    );
  }
  function paramsHTML() {
    const st = state.setup,
      src = st.src;
    const nf = (k, l) =>
      '<div class="qe-nf"><label for="qe-' +
      k +
      '">' +
      l +
      '</label><input class="qe-num" id="qe-' +
      k +
      '" data-k="' +
      k +
      '" type="number" inputmode="numeric" min="' +
      LIM[k][0] +
      '" max="' +
      LIM[k][1] +
      '" value="' +
      st[k] +
      '"><small class="' +
      (st.fromText[k] ? 'is-desc' : '') +
      '">' +
      (st.manual[k]
        ? 'set manually'
        : src === 'ai' && !st.aiKnown[k]
          ? st.ai?.defaulted_layout?.includes(k)
            ? 'demo default · check'
            : 'not found · check'
          : st.fromText[k]
            ? src === 'ai'
              ? 'from AI'
              : src === 'demo'
                ? k === 'levels'
                  ? 'default · check'
                  : 'from plan'
                : 'from description'
            : LIM[k][0] + '–' + LIM[k][1]) +
      '</small></div>';
    const badge =
      src === 'ai'
        ? '<span class="qe-badge is-ai"><i aria-hidden="true"></i>Quark AI suggestions · review</span>'
        : src === 'demo'
          ? '<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>'
          : src === 'file'
            ? '<span class="qe-badge is-warn">Plan attached · review parameters</span>'
            : src === 'text'
              ? '<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>'
              : '<span class="qe-badge is-plain">Manual parameters</span>';
    return (
      '<form class="qe-setup' +
      (state.unfold ? ' is-unfold' : '') +
      '" id="qe-form" novalidate aria-label="Warehouse parameters"><div class="qe-row" style="margin:0">' +
      badge +
      '<button type="button" class="qe-link" id="qe-restart">Start over</button></div>' +
      (st.plan
        ? '<div class="qe-thumb"><div class="qe-thumb-i">' +
          previewHTML() +
          '</div><div><b>' +
          esc(st.plan.name) +
          '</b><small>' +
          (st.plan.demo
            ? 'Demo schematic · levels are not shown on a floor plan'
            : 'Reviewed with Quark AI · check the suggested values') +
          '</small></div></div>'
        : '') +
      (src === 'text' || st.text
        ? '<div><label class="qe-lab" for="qe-desc">Description</label><textarea class="qe-ta" id="qe-desc" maxlength="5000" style="min-height:72px">' +
          esc(st.text) +
          '</textarea><div class="qe-row"><span class="qe-parsed" id="qe-parsed">' +
          (state.descriptionChanged
            ? 'Description changed. Analyse again to update suggestions.'
            : 'Edit the description and ask Quark AI to review it.') +
          '</span><button type="button" class="qe-link" id="qe-desc-go"' +
          (st.text.trim() ? '' : ' disabled') +
          '>Analyse again with Quark AI →</button></div></div>'
        : '') +
      '<div><span class="qe-lab" id="qe-type-l">Warehouse type</span><div class="qe-seg" role="group" aria-labelledby="qe-type-l">' +
      TYPES.map(
        (t) =>
          '<button type="button" data-type="' +
          t +
          '" aria-pressed="' +
          (st.type === t) +
          '">' +
          t +
          '</button>',
      ).join('') +
      '</div></div>' +
      '<div class="qe-nums">' +
      nf('aisles', 'Aisles') +
      nf('bays', 'Bays / rack') +
      nf('levels', 'Rack levels') +
      '</div>' +
      (st.ai ? questionsHTML(st.ai) : '') +
      taskParamsHTML() +
      '<p class="qe-note">Check the values and change any of them by hand. A value you edit stays as you set it.</p>' +
      '<div class="qe-ask"><label class="qe-lab" for="qe-ask">Ask Quark AI about a preview rule</label><div class="qe-askrow"><span aria-hidden="true">&gt;_</span><input id="qe-ask" value="' +
      esc(state.ruleText || '') +
      '" maxlength="1000" placeholder="e.g. Reserve Level 4 for heavy LPNs" autocomplete="off"><button type="button" id="qe-ask-go"' +
      (state.ruleBusy ? ' disabled' : '') +
      '>' +
      (state.ruleBusy ? 'Thinking…' : 'Ask Quark AI') +
      '</button></div>' +
      (st.rules && st.rules.length
        ? '<ul class="qe-rules">' +
          st.rules
            .map(
              (r, i) =>
                '<li><span class="qe-mono">' +
                esc(r.code) +
                '</span>' +
                esc(r.text) +
                '<button type="button" class="qe-x2" data-rule="' +
                i +
                '" aria-label="Remove rule">×</button></li>',
            )
            .join('') +
          '</ul>'
        : '') +
      (state.ruleErr ? '<p class="qe-err" role="alert">' + esc(state.ruleErr) + '</p>' : '') +
      '<p class="qe-note">This rule and the preview parameters are sent to Quark AI for interpretation.</p></div>' +
      (state.formErr ? '<p class="qe-err">' + esc(state.formErr) + '</p>' : '') +
      '<div><button class="qe-btn is-wide" type="submit"' +
      (state.phase === 'preparing' || state.ruleBusy ? ' disabled' : '') +
      '><span>' +
      (state.phase === 'preparing' ? 'Preparing…' : 'Instantiate dual-render preview') +
      '</span><span aria-hidden="true">→</span></button><p class="qe-note" style="margin-top:8px"><span class="qe-mono">' +
      locCount() +
      '</span> location addresses · no sign-up needed</p></div></form>'
    );
  }
  function dropHTML() {
    return (
      '<div class="qe-setup" aria-label="Describe your warehouse"><div class="qe-row" style="margin:0"><span class="qe-lab" style="margin:0">Describe your warehouse</span><span class="qe-ai-tag"><i aria-hidden="true"></i>Quark AI layout analysis</span></div>' +
      '<div class="qe-drop' +
      (state.dragOver ? ' is-over' : '') +
      '" id="qe-drop"><input type="file" id="qe-plan" aria-label="Choose a warehouse plan for local preview" accept="image/jpeg,image/png,application/pdf"><div class="qe-drop-ic" aria-hidden="true"><i></i></div><b>[ DROP WAREHOUSE PLAN HERE ]</b><span>JPEG · PNG · PDF · up to 3 MB</span><label for="qe-plan" class="qe-btn is-ghost"><span>[ BROWSE FILES ]</span></label></div><p class="qe-note qe-ai-sub">Choose Analyze with Quark AI to send your plan or description to our AI service. Only share material you have permission to use. The warehouse preview stays a simulation.</p>' +
      (state.setup.plan && !state.setup.plan.demo
        ? '<p class="qe-note">Selected: ' +
          esc(state.setup.plan.name) +
          '</p><button type="button" class="qe-btn is-wide" id="qe-analyze-file">Analyze plan with Quark AI →</button>'
        : '') +
      (state.formErr
        ? '<p class="qe-err" role="alert" style="margin:0">' + esc(state.formErr) + '</p>'
        : '') +
      '<div class="qe-demo-cta"><button type="button" class="qe-btn is-wide" id="qe-demo" aria-describedby="qe-demo-d"><span>[ ANALYZE SAMPLE WITH QUARK AI ]</span><span aria-hidden="true">→</span></button><small id="qe-demo-d">Uses our sample warehouse description; no file is uploaded.</small></div>' +
      '<div class="qe-or"><span>or</span></div>' +
      '<div><label class="qe-sr" for="qe-desc">Warehouse description</label><textarea class="qe-ta" id="qe-desc" maxlength="5000" placeholder="Or type a manual description instead… e.g. ' +
      esc(EXAMPLE) +
      '">' +
      esc(state.setup.text) +
      '</textarea><div class="qe-row"><span class="qe-parsed" id="qe-parsed">Quark AI will suggest parameters from your description</span><button type="button" class="qe-link" id="qe-desc-go"' +
      (state.setup.text.trim() ? '' : ' disabled') +
      '>Analyze description with Quark AI →</button></div></div>' +
      '<button type="button" class="qe-link" id="qe-manual">Set parameters manually</button></div>'
    );
  }
  function analyzingHTML() {
    return (
      '<div class="qe-setup" aria-busy="true" aria-label="Quark AI analysis"><span class="qe-ai-tag is-live"><i aria-hidden="true"></i>Quark AI · analysing</span><div class="qe-scanbox"><div class="qe-scanimg">' +
      previewHTML() +
      '</div><i class="qe-sweep" aria-hidden="true"></i></div><p class="qe-note" role="status">Sending your input for analysis. Waiting for Quark AI’s suggestions…</p><button type="button" class="qe-link" id="qe-manual">Cancel and set parameters manually</button></div>'
    );
  }
  function setupHTML() {
    return state.stage === 'analyzing'
      ? analyzingHTML()
      : state.stage === 'params'
        ? paramsHTML()
        : dropHTML();
  }
  let anT = [];
  function cancelAI() {
    aiSerial++;
    if (aiController) aiController.abort();
    aiController = null;
    state.ruleBusy = false;
  }
  async function requestAI(body) {
    aiController = new AbortController();
    const controller = aiController,
      timer = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch('/api/engine-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, consent: true, preferred_language: browserLanguage() }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || 'Quark AI could not analyse this input.');
      return data.result;
    } finally {
      clearTimeout(timer);
      if (aiController === controller) aiController = null;
    }
  }
  function readPlan(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('Could not read this file.'));
      reader.readAsDataURL(file);
    });
  }
  // Analyze the selected plan and retain context across clarification rounds.
  async function analyze(plan, options = {}) {
    cancelAI();
    const serial = aiSerial;
    state.formErr = '';
    state.ruleErr = '';
    if (state.setup.plan && state.setup.plan.url && state.setup.plan !== plan)
      URL.revokeObjectURL(state.setup.plan.url);
    state.setup.plan = plan;
    state.stage = 'analyzing';
    render();
    try {
      const body = {
        mode: 'layout',
        text:
          options.text ??
          (plan && plan.demo
            ? EXAMPLE + (state.setup.text ? '\n' + state.setup.text : '')
            : state.setup.text),
      };
      if (plan && !plan.demo) {
        if (!pendingFile) throw new Error('Choose your plan again.');
        body.file = {
          type:
            pendingFile.type ||
            (/\.pdf$/i.test(pendingFile.name)
              ? 'application/pdf'
              : /\.png$/i.test(pendingFile.name)
                ? 'image/png'
                : 'image/jpeg'),
          data: await readPlan(pendingFile),
        };
      }
      if (state.setup.ai)
        body.setup = {
          type: state.setup.type,
          aisles: state.setup.aisles,
          bays: state.setup.bays,
          levels: state.setup.levels,
          task: state.setup.task,
          previous_summary: state.setup.ai.summary,
          confirmed: Object.keys(state.setup.aiKnown || {}).filter((k) => state.setup.aiKnown[k]),
        };
      if (serial !== aiSerial) return;
      const result = await requestAI(body);
      if (serial !== aiSerial) return;
      const st = state.setup;
      st.ai = result;
      st.rfLocale = result;
      mergeTask(result.task);
      st.aiKnown = {};
      st.fromText = {};
      ['type', 'aisles', 'bays', 'levels'].forEach((k) => {
        if (result[k] != null && !st.manual[k]) {
          st[k] = result[k];
          st.fromText[k] = true;
          st.aiKnown[k] = !(result.defaulted_layout || []).includes(k);
        }
      });
      st.rules = result.rules.map((r) => ({
        code: r.level ? 'L' + r.level + ' → ' + r.category : 'RULE',
        text: r.text,
        lv: r.level,
        cls: r.category,
      }));
      st.src = 'ai';
      if (options.round) state.dialog = [...(state.dialog || []), options.round].slice(-3);
      state.clarification = '';
      state.answers = {};
      state.descriptionChanged = false;
      state.stage = 'params';
      state.unfold = true;
      render();
      if (guide) guide.focusTitle();
      else { const f = $('#qe-aisles'); f && f.focus({ preventScroll: true }); }
    } catch (e) {
      if (serial !== aiSerial) return;
      state.stage = options.refine ? 'params' : 'drop';
      state.formErr =
        e.name === 'AbortError'
          ? 'Quark AI analysis timed out. Retry or set parameters manually.'
          : e.message;
      render();
    }
  }
  async function askRule() {
    const input = $('#qe-ask');
    if (!input || !input.value.trim()) return input && input.focus();
    if (state.ruleBusy) return;
    const text = input.value.trim();
    cancelAI();
    const serial = aiSerial;
    state.ruleBusy = true;
    state.ruleErr = '';
    state.ruleText = text;
    render();
    try {
      const st = state.setup,
        result = await requestAI({
          mode: 'rule',
          text,
          setup: {
            type: st.type,
            aisles: st.aisles,
            bays: st.bays,
            levels: st.levels,
            task: st.task,
          },
        });
      if (serial !== aiSerial) return;
      if (!result.rules.length && (result.rule_only || !result.task?.operation))
        throw new Error(
          result.uncertainties[0] || 'Add more detail about the rule you want to try.',
        );
      if (!result.rule_only && result.task?.operation) {
        mergeTask(result.task);
        st.rfLocale = result;
      }
      st.rules = (st.rules || [])
        .concat(
          result.rules.map((r) => ({
            code: r.level ? 'L' + r.level + ' → ' + r.category : 'RULE',
            text: r.text,
            lv: r.level,
            cls: r.category,
          })),
        )
        .slice(-8);
      state.ruleText = '';
    } catch (e) {
      if (serial !== aiSerial) return;
      state.ruleErr =
        e.name === 'AbortError' ? 'Quark AI request timed out. Please retry.' : e.message;
    } finally {
      if (serial === aiSerial) {
        state.ruleBusy = false;
        render();
      }
    }
  }
  // Both terminal views read the same workflow state.
  function summaryHTML() {
    const st = state.setup,
      d = state.definition;
    return (
      '<div class="qe-sum"><dl><div><dt>Type</dt><dd>' +
      esc(st.type) +
      '</dd></div><div><dt>Layout</dt><dd>' +
      st.aisles +
      ' × ' +
      st.bays +
      ' × ' +
      st.levels +
      '</dd></div><div><dt>Process</dt><dd>' +
      esc(Flow.labels[d.operation]) +
      '</dd></div><div><dt>Product</dt><dd>' +
      esc(d.product.name) +
      '</dd></div><div><dt>Packaging</dt><dd>' +
      d.product.pack_quantity +
      ' ' +
      esc(d.product.pack_label) +
      ' × ' +
      d.product.pack_units +
      '</dd></div><div><dt>Tracking</dt><dd>' +
      (d.product.serialized ? 'Serial per unit' : 'Standard') +
      '</dd></div></dl><div class="qe-sum-act">' +
      (state.run.completed
        ? '<button type="button" class="qe-link" id="qe-cont">Continue with this setup →</button>'
        : '') +
      '<button type="button" class="qe-link" id="qe-reset">Restart task</button><button type="button" class="qe-link" id="qe-edit">Edit setup</button></div></div>'
    );
  }
  const terminalTranslations = {
    'no task': { ro: 'fără sarcină', bg: 'няма задача', el: 'χωρίς εργασία' },
    'No task assigned': {
      ro: 'Nicio sarcină alocată',
      bg: 'Няма възложена задача',
      el: 'Δεν έχει ανατεθεί εργασία',
    },
    'Attaching RF process…': {
      ro: 'Se încarcă procesul RF…',
      bg: 'Зареждане на RF процес…',
      el: 'Φόρτωση διαδικασίας RF…',
    },
    'Analyse your request or set up a warehouse to generate a process.': {
      ro: 'Analizează cererea sau configurează un depozit pentru a crea un proces.',
      bg: 'Анализирай заявката или настрой склад, за да създадеш процес.',
      el: 'Ανάλυσε το αίτημα ή ρύθμισε μια αποθήκη για να δημιουργήσεις διαδικασία.',
    },
    'WAITING FOR SETUP': {
      ro: 'AȘTEAPTĂ CONFIGURAREA',
      bg: 'ИЗЧАКВА НАСТРОЙКА',
      el: 'ΑΝΑΜΟΝΗ ΡΥΘΜΙΣΗΣ',
    },
    'ATTACHING RF PROCESS...': {
      ro: 'SE ÎNCARCĂ PROCESUL RF...',
      bg: 'ЗАРЕЖДАНЕ НА RF ПРОЦЕС...',
      el: 'ΦΟΡΤΩΣΗ ΔΙΑΔΙΚΑΣΙΑΣ RF...',
    },

    Receiving: { ro: 'Recepție', bg: 'Приемане', el: 'Παραλαβή' },
    Putaway: { ro: 'Depozitare', bg: 'Местене', el: 'Τοποθέτηση' },
    'Receiving + putaway': {
      ro: 'Recepție + depozitare',
      bg: 'Приемане + местене',
      el: 'Παραλαβή + τοποθέτηση',
    },
    Picking: { ro: 'Colectare', bg: 'Комплектоване', el: 'Συλλογή' },
    'Inventory count': { ro: 'Inventariere', bg: 'Инвентаризация', el: 'Απογραφή' },
    Replenishment: { ro: 'Reaprovizionare', bg: 'Попълване', el: 'Αναπλήρωση' },
    Packing: { ro: 'Ambalare', bg: 'Опаковане', el: 'Συσκευασία' },
    Loading: { ro: 'Încărcare', bg: 'Товарене', el: 'Φόρτωση' },
    'Scan receipt / ASN': {
      ro: 'Scanează recepția / ASN',
      bg: 'Сканирай приемане / ASN',
      el: 'Σάρωση παραλαβής / ASN',
    },
    'Scan product barcode': {
      ro: 'Scanează codul produsului',
      bg: 'Сканирай кода на продукта',
      el: 'Σάρωση κωδικού προϊόντος',
    },
    'Scan LPN': { ro: 'Scanează LPN', bg: 'Сканирай LPN', el: 'Σάρωση LPN' },
    'Enter lot number': {
      ro: 'Introdu numărul lotului',
      bg: 'Въведи номер на партида',
      el: 'Εισαγωγή αριθμού παρτίδας',
    },
    'Enter expiry date': {
      ro: 'Introdu data expirării',
      bg: 'Въведи срок на годност',
      el: 'Εισαγωγή ημερομηνίας λήξης',
    },
    'Receive quantity': {
      ro: 'Cantitate recepționată',
      bg: 'Прието количество',
      el: 'Ποσότητα παραλαβής',
    },
    'Scan serial number': {
      ro: 'Scanează seria',
      bg: 'Сканирай сериен номер',
      el: 'Σάρωση σειριακού αριθμού',
    },
    'Verify serial number': {
      ro: 'Verifică seria',
      bg: 'Провери серийния номер',
      el: 'Έλεγχος σειριακού αριθμού',
    },
    'Close receipt': {
      ro: 'Închide recepția',
      bg: 'Приключи приемането',
      el: 'Κλείσιμο παραλαβής',
    },
    'Scan source location': {
      ro: 'Scanează locația sursă',
      bg: 'Сканирай изходна локация',
      el: 'Σάρωση θέσης προέλευσης',
    },
    'Scan destination location': {
      ro: 'Scanează destinația',
      bg: 'Сканирай целева локация',
      el: 'Σάρωση θέσης προορισμού',
    },
    'Confirm LPN placement': {
      ro: 'Confirmă plasarea LPN',
      bg: 'Потвърди местене на LPN',
      el: 'Επιβεβαίωση τοποθέτησης LPN',
    },
    'Enter quantity': {
      ro: 'Introdu cantitatea',
      bg: 'Въведи количество',
      el: 'Εισαγωγή ποσότητας',
    },
    'Confirm count': {
      ro: 'Confirmă inventarul',
      bg: 'Потвърди броенето',
      el: 'Επιβεβαίωση απογραφής',
    },
    'Confirm pick': {
      ro: 'Confirmă culesul',
      bg: 'Потвърди комплектацията',
      el: 'Επιβεβαίωση συλλογής',
    },
    'Confirm replenishment': {
      ro: 'Confirmă reaprovizionarea',
      bg: 'Потвърди попълването',
      el: 'Επιβεβαίωση αναπλήρωσης',
    },
    'Confirm packing': {
      ro: 'Confirmă ambalarea',
      bg: 'Потвърди опаковането',
      el: 'Επιβεβαίωση συσκευασίας',
    },
    'Confirm loading': {
      ro: 'Confirmă încărcarea',
      bg: 'Потвърди товаренето',
      el: 'Επιβεβαίωση φόρτωσης',
    },
    Product: { ro: 'Produs', bg: 'Продукт', el: 'Προϊόν' },
    Packaging: { ro: 'Ambalaj', bg: 'Опаковка', el: 'Συσκευασία' },
    'Base units': { ro: 'Unități de bază', bg: 'Базови единици', el: 'Βασικές μονάδες' },
    'At dock / stored': {
      ro: 'La rampă / depozitat',
      bg: 'На рампа / складирани',
      el: 'Στη ράμπα / σε αποθήκευση',
    },
    'Task completed': {
      ro: 'Sarcină finalizată',
      bg: 'Задачата е завършена',
      el: 'Η εργασία ολοκληρώθηκε',
    },
    units: { ro: 'unități', bg: 'единици', el: 'μονάδες' },
    'serials preserved': {
      ro: 'serii păstrate',
      bg: 'запазени серийни номера',
      el: 'διατηρήθηκαν σειριακοί αριθμοί',
    },
    'serial numbers verified': {
      ro: 'serii verificate',
      bg: 'проверени серийни номера',
      el: 'ελεγμένοι σειριακοί αριθμοί',
    },
    'serial numbers captured': {
      ro: 'serii înregistrate',
      bg: 'записани серийни номера',
      el: 'καταχωρισμένοι σειριακοί αριθμοί',
    },
    'Scan serial, then Enter': {
      ro: 'Scanează seria și apasă Enter',
      bg: 'Сканирай номера и натисни Enter',
      el: 'Σάρωσε τον σειριακό αριθμό και πάτησε Enter',
    },
    'Scan or type, then Enter': {
      ro: 'Scanează sau tastează, apoi Enter',
      bg: 'Сканирай или въведи, после Enter',
      el: 'Σάρωσε ή πληκτρολόγησε και πάτησε Enter',
    },
    'Simulate next serial': {
      ro: 'Simulează seria următoare',
      bg: 'Симулирай следващ номер',
      el: 'Προσομοίωση επόμενου αριθμού',
    },
    'Use sample': { ro: 'Folosește exemplul', bg: 'Използвай пример', el: 'Χρήση παραδείγματος' },
    'Scan location': { ro: 'Scanează locația', bg: 'Сканирай локация', el: 'Σάρωση θέσης' },
    ITEM: { ro: 'PRODUS', bg: 'ПРОДУКТ', el: 'ΠΡΟΪΟΝ' },
    PACK: { ro: 'AMBALAJ', bg: 'ОПАКОВКА', el: 'ΣΥΣΚ.' },
    UNITS: { ro: 'UNITĂȚI', bg: 'ЕДИНИЦИ', el: 'ΜΟΝΑΔΕΣ' },
    SERIALS: { ro: 'SERII', bg: 'СЕРИЙНИ №', el: 'ΣΕΙΡΙΑΚΟΙ' },
    DOCK: { ro: 'RAMPĂ', bg: 'РАМПА', el: 'ΡΑΜΠΑ' },
    STORED: { ro: 'STOCAT', bg: 'СКЛАД', el: 'ΑΠΟΘΗΚΗ' },
    TO: { ro: 'LA', bg: 'КЪМ', el: 'ΠΡΟΣ' },
    COMPLETED: { ro: 'FINALIZAT', bg: 'ЗАВЪРШЕНО', el: 'ΟΛΟΚΛΗΡΩΘΗΚΕ' },
    CONFIRM: { ro: 'CONFIRMĂ', bg: 'ПОТВЪРДИ', el: 'ΕΠΙΒΕΒΑΙΩΣΗ' },
  };
  function browserLanguage() {
    if (typeof navigator === 'undefined') return undefined;
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
    return (
      preferences
        .map((locale) => locale?.toLowerCase().split('-')[0])
        .find((language) => Object.hasOwn(Flow.rfCommands, language)) ?? 'en'
    );
  }

  function terminalLanguage() {
    const analysis = state.setup.rfLocale;
    if (analysis?.detected_language) return analysis.detected_language;
    if (analysis?.detected_region === 'RO-BUCHAREST-WEST') return 'ro';
    if (analysis?.detected_region === 'BG-PLOVDIV-TRAKIA') return 'bg';
    return browserLanguage() ?? 'en';
  }

  function terminalText(label) {
    return terminalTranslations[label]?.[terminalLanguage()] ?? label;
  }

  function processView() {
    return Flow.view(state.definition, state.run);
  }
  // The localized command describes the final action of the analyzed operation.
  function confirmationLabel(fallback) {
    const analyzedTask = state.setup.rfLocale?.task;
    const { operation, steps } = state.definition;
    if (state.run.index !== steps.length - 1) return fallback;
    if (analyzedTask?.operation === operation && analyzedTask.localized_commands?.primary_btn) {
      return analyzedTask.localized_commands.primary_btn;
    }
    const language = terminalLanguage();
    const commands = Flow.rfCommands[language];
    return language === 'en' || !commands ? fallback : (commands[operation] ?? commands.fallback);
  }

  function rfHTML() {
    if (state.phase !== 'live')
      return (
        '<div class="qe-rf qe-dev"><div class="qe-rf-bar">WebRF<span>' +
        esc(terminalText('no task')) +
        '</span></div><div class="qe-wait"><b>' +
        esc(
          terminalText(state.phase === 'preparing' ? 'Attaching RF process…' : 'No task assigned'),
        ) +
        '</b>' +
        esc(terminalText('Analyse your request or set up a warehouse to generate a process.')) +
        '</div></div>'
      );
    const d = state.definition,
      r = state.run,
      v = processView(),
      p = d.product,
      serial = v.control === 'serial',
      captured = v.code === 'verify_serials' ? r.verified : r.serials.map((x) => x.value);
    const context =
      '<dl class="qe-rf-dl"><dt>' +
      esc(terminalText('Product')) +
      '</dt><dd>' +
      esc(p.name) +
      '</dd><dt>SKU</dt><dd>' +
      esc(p.sku) +
      '</dd><dt>LPN</dt><dd>' +
      esc(d.lpn) +
      '</dd><dt>' +
      esc(terminalText('Packaging')) +
      '</dt><dd>' +
      p.pack_quantity +
      ' ' +
      esc(p.pack_label) +
      ' × ' +
      p.pack_units +
      '</dd><dt>' +
      esc(terminalText('Base units')) +
      '</dt><dd>' +
      d.total_units +
      '</dd><dt>' +
      esc(terminalText('At dock / stored')) +
      '</dt><dd>' +
      r.dock +
      ' / ' +
      r.stored +
      '</dd></dl>';
    let body = '';
    if (r.completed)
      body =
        '<div class="qe-done"><b>' +
        esc(terminalText('Task completed')) +
        '</b><span class="qe-note">' +
        esc(terminalText(Flow.labels[d.operation])) +
        ' · ' +
        esc(p.name) +
        ' · ' +
        d.total_units +
        ' ' +
        esc(terminalText('units')) +
        (r.serials.length
          ? ' · ' + r.serials.length + ' ' + esc(terminalText('serials preserved'))
          : '') +
        '</span></div>';
    else {
      if (r.error) body += '<div class="qe-alert" role="alert">' + esc(r.error) + '</div>';
      if (serial)
        body +=
          '<div class="qe-serial-count" role="status"><b>' +
          captured.length +
          ' / ' +
          d.total_units +
          '</b><span>' +
          esc(
            terminalText(
              v.code === 'verify_serials' ? 'serial numbers verified' : 'serial numbers captured',
            ),
          ) +
          '</span></div>' +
          (captured.length
            ? '<ol class="qe-serial-list">' +
              captured
                .slice(-3)
                .map((x) => '<li>' + esc(x) + '</li>')
                .join('') +
              '</ol>'
            : '');
      const enterLabel = Flow.rfCommands[terminalLanguage()]?.enter ?? 'Enter';
      if (v.control === 'confirm')
        body +=
          '<div class="qe-rf-act"><button class="qe-btn is-wide" type="button" data-a="flow-confirm"><span>' +
          esc(confirmationLabel(terminalText(v.label))) +
          '</span><span aria-hidden="true">→</span></button></div>';
      else
        body +=
          '<div class="qe-rf-act"><label class="qe-lab" for="qe-rfscan">' +
          esc(terminalText(v.label)) +
          (v.control === 'number' ? ' (' + esc(p.pack_label) + ')' : '') +
          '</label><div class="qe-scanrow"><input class="qe-scan" id="qe-rfscan" data-scan="web" value="' +
          esc(state.draft) +
          '" maxlength="64"' +
          (v.control === 'number' ? ' inputmode="numeric"' : '') +
          ' placeholder="' +
          esc(
            terminalText(
              serial
                ? 'Scan serial, then Enter'
                : v.control === 'date'
                  ? 'YYYY-MM-DD'
                  : 'Scan or type, then Enter',
            ),
          ) +
          '" autocomplete="off" spellcheck="false"><button type="button" data-a="flow-submit">' +
          esc(enterLabel) +
          '</button></div><div class="qe-sims"><button class="qe-link" type="button" data-a="flow-demo">' +
          (serial
            ? esc(terminalText('Simulate next serial'))
            : esc(terminalText('Use sample')) + ' · ' + esc(Flow.expected(d, r))) +
          '</button></div></div>';
    }
    return (
      '<div class="qe-rf qe-dev"><div class="qe-rf-bar">' +
      esc(terminalText(Flow.labels[d.operation])) +
      '<span>' +
      Math.min(r.index + 1, d.steps.length) +
      ' / ' +
      d.steps.length +
      '</span></div><div class="qe-rf-steps" aria-hidden="true">' +
      d.steps.map((_, i) => '<i class="' + (i < r.index ? 'on' : '') + '"></i>').join('') +
      '</div><div class="qe-rf-b"><h4 class="qe-rf-title">' +
      esc(terminalText(v.label)) +
      '</h4>' +
      context +
      (state.step === 'scan'
        ? '<div class="qe-rf-loc"><small>' +
          esc(terminalText('Scan location')) +
          '</small><b>' +
          esc(Flow.expected(d, r)) +
          '</b></div>'
        : '') +
      body +
      '</div></div>'
    );
  }
  const W = 32,
    ln = (t, c) => ({ t: String(t).slice(0, W).padEnd(W, ' '), c }),
    rule = () => ln('-'.repeat(W), 'dim');
  function tuiLines() {
    const L = [ln('QUARK WMS / TERMINAL PREVIEW'), rule()];
    if (state.phase !== 'live') {
      L.push(
        ln(
          ' ' +
            terminalText(
              state.phase === 'preparing' ? 'ATTACHING RF PROCESS...' : 'WAITING FOR SETUP',
            ),
        ),
      );
      while (L.length < 14) L.push(ln(''));
      L.push(rule(), ln(' [ESC] CLEAR', 'dim'));
      return L;
    }
    const d = state.definition,
      r = state.run,
      v = processView(),
      count = v.code === 'verify_serials' ? r.verified.length : r.serials.length;
    L.push(
      ln(
        ' ' +
          terminalText(Flow.labels[d.operation]).toUpperCase() +
          ' ' +
          Math.min(r.index + 1, d.steps.length) +
          '/' +
          d.steps.length,
      ),
      ln(
        (terminalText('ITEM') === 'ITEM' ? ' ITEM : ' : ' ' + terminalText('ITEM') + ': ') +
          d.product.name,
      ),
      ln(' SKU  : ' + d.product.sku),
      ln(
        (terminalText('PACK') === 'PACK' ? ' PACK : ' : ' ' + terminalText('PACK') + ': ') +
          d.product.pack_quantity +
          ' ' +
          d.product.pack_label +
          ' x ' +
          d.product.pack_units,
      ),
      ln(
        (terminalText('UNITS') === 'UNITS' ? ' UNITS: ' : ' ' + terminalText('UNITS') + ': ') +
          d.total_units,
      ),
      ln(' LPN  : ' + d.lpn),
    );
    if (v.control === 'serial')
      L.push(ln(' ' + terminalText('SERIALS') + ': ' + count + ' / ' + d.total_units));
    else
      L.push(
        ln(
          ' ' +
            terminalText('DOCK') +
            ': ' +
            r.dock +
            ' ' +
            terminalText('STORED') +
            ': ' +
            r.stored,
        ),
      );
    L.push(rule(), ln(' ' + terminalText(v.label).toUpperCase(), r.completed ? 'hi' : ''));
    if (r.error) L.push(ln('! ' + r.error, 'er'));
    else if (state.step === 'scan')
      L.push(ln(' ' + terminalText('TO') + ': ' + Flow.expected(d, r), 'hi'));
    else L.push(ln(''));
    if (r.completed) {
      L.push(ln(' *** ' + terminalText('COMPLETED') + ' ***', 'hi'));
    } else if (v.control === 'confirm') {
      const command = confirmationLabel(terminalText('CONFIRM')).toUpperCase();
      const action = ' [ENTER] ' + command;
      if (action.length <= W) L.push(ln(action));
      else L.push(ln(' [ENTER]'), ln(' ' + command));
    } else {
      L.push({ input: true });
    }
    while (L.length < 14) L.push(ln(''));
    L.push(
      rule(),
      ln(
        v.code === 'close_receipt'
          ? ' [F8] CLOSE   [ESC] CLEAR'
          : ' [F2] ENTER [F3] DEMO [ESC] CLEAR',
        'dim',
      ),
    );
    return L;
  }
  function tuiHTML() {
    const body = tuiLines()
      .map((l) =>
        l.input
          ? '<span class="l">&gt; <input id="qe-tuiscan" data-scan="tui" value="' +
            esc(state.draft) +
            '" maxlength="64" size="25" autocomplete="off" spellcheck="false" aria-label="Terminal scan input"><span class="bl">_</span></span>'
          : '<span class="l' + (l.c ? ' ' + l.c : '') + '">' + esc(l.t) + '</span>',
      )
      .join('\n');
    const live = state.phase === 'live',
      v = live ? processView() : null,
      closed = v?.code === 'close_receipt';
    return (
      '<div class="qe-tuiwrap qe-dev"><div class="qe-tuitop"><span>HANDHELD · 240×320 CLASS</span><span>' +
      (live ? 'ONLINE' : 'IDLE') +
      '</span></div><pre class="qe-tui" id="qe-tui" tabindex="0" role="application" aria-label="Terminal preview. Enter or F2 submits; F3 uses a sample; F8 closes a completed receipt capture."><code>' +
      body +
      '</code></pre><div class="qe-keys"><button type="button" data-k="' +
      (closed ? 'F8' : 'F2') +
      '"' +
      (live && !state.run.completed ? '' : ' disabled') +
      '><b>' +
      (closed ? 'F8' : 'F2') +
      '</b> ' +
      (closed ? 'CLOSE' : 'ENTER') +
      '</button><button type="button" data-k="F3"' +
      (live && !state.run.completed && v.control !== 'confirm' ? '' : ' disabled') +
      '><b>F3</b> DEMO</button><button type="button" data-k="ESC"' +
      (live ? '' : ' disabled') +
      '><b>ESC</b> CLEAR</button></div><div class="qe-tuihint">The same process definition and accepted scans drive both interfaces.<br>Device compatibility is verified separately.</div></div>'
    );
  }
  function occ(code) {
    return Flow.occupied(code);
  }
  function faceHTML() {
    if (state.phase !== 'live')
      return '<div class="qe-face"><div class="qe-bp-empty"><span>NO LAYOUT LOADED</span><small>Rack elevation appears after generation.</small></div></div>';
    const st = state.setup,
      f = state.face,
      scan = state.step === 'scan',
      fresh = state.sync && Date.now() - state.sync.at < 1000;
    const lv = [];
    for (let l = st.levels; l >= 1; l--) lv.push(l);
    const bays = [];
    for (let b = 1; b <= st.bays; b++) {
      const cells = lv
        .map((l) => {
          const code = f.aisle + '-' + pad(b) + '-' + f.side + '-L' + l,
            t = code === TASK.target,
            x = state.mismatch && state.mismatch.code === code,
            o = !t && occ(code);
          const cls =
            'qe-loc' +
            (t ? (state.step === 'done' ? ' is-done' + (fresh ? ' is-anim' : '') : ' is-t') : '') +
            (o ? ' is-o' : '') +
            (x ? ' is-x' : '');
          const lab = t
            ? state.step === 'done'
              ? '<b>LOCKED</b><i>' + TASK.qty + ' U · ' + esc(TASK.lpn) + '</i>'
              : '<b>TARGET</b><i>' + code + '</i>'
            : x
              ? '<b>MISMATCH</b><i>' + code + '</i>'
              : o
                ? '<i class="qe-lpn">LPN</i><em>' + code + '</em>'
                : '<em>' + code + '</em>';
          return (
            '<button type="button" class="' +
            cls +
            '" data-loc="' +
            code +
            '" ' +
            (scan
              ? 'aria-label="Simulate scan ' + code + (o ? ' (occupied)' : '') + '"'
              : 'tabindex="-1" aria-label="' +
                code +
                (o ? ' occupied' : t ? ' target' : '') +
                '"') +
            '>' +
            lab +
            (t && scan ? '<span class="qe-tip">[ CLICK TO SIMULATE SCAN ]</span>' : '') +
            '</button>'
          );
        })
        .join('');
      bays.push(
        '<div class="qe-bay"><div class="qe-dim"><span>BAY ' +
          pad(b) +
          '</span></div><div class="qe-bay-c">' +
          cells +
          '</div></div>' +
          (b < st.bays ? '<div class="qe-up" aria-hidden="true"></div>' : ''),
      );
    }
    return (
      '<div class="qe-face">' +
      '<div class="qe-bp-top"><div class="qe-tg"><span>AISLE</span><div role="group" aria-label="Aisle">' +
      Array.from(
        { length: st.aisles },
        (_, i) =>
          '<button type="button" data-aisle="' +
          aisleL(i) +
          '" aria-pressed="' +
          (f.aisle === aisleL(i)) +
          '">' +
          aisleL(i) +
          '</button>',
      ).join('') +
      '</div></div><div class="qe-tg"><span>FACE</span><div role="group" aria-label="Rack face">' +
      ['01', '02']
        .map(
          (s) =>
            '<button type="button" data-side="' +
            s +
            '" aria-pressed="' +
            (f.side === s) +
            '">' +
            s +
            '</button>',
        )
        .join('') +
      '</div></div>' +
      '<dl class="qe-spec"><div><dt>SCALE</dt><dd>NTS</dd></div><div><dt>PROJ</dt><dd>FRONT ELEVATION</dd></div><div><dt>SRC</dt><dd>QUARK METADATA</dd></div></dl></div>' +
      '<div class="qe-bp' +
      (scan ? ' is-scan' : '') +
      '"><div class="qe-bp-title"><span>RACK ' +
      f.aisle +
      '-' +
      f.side +
      '</span><span>' +
      st.bays +
      ' BAYS × ' +
      st.levels +
      ' LEVELS · ' +
      (scan
        ? 'SIMULATE SCAN: CLICK A LOCATION'
        : state.step === 'done'
          ? 'TASK COMPLETE'
          : 'VIEW ONLY') +
      '</span></div>' +
      '<div class="qe-rack-sc"><div class="qe-rack" style="--lv:' +
      st.levels +
      '"><div class="qe-lvls"><div class="qe-dim"></div>' +
      lv.map((l) => '<span>L' + l + '</span>').join('') +
      '</div><div class="qe-up is-end" aria-hidden="true"></div>' +
      bays.join('') +
      '<div class="qe-up is-end" aria-hidden="true"></div></div><div class="qe-floor" aria-hidden="true"></div></div></div>' +
      '<ul class="qe-leg"><li class="e">Empty</li><li class="o">Occupied</li><li class="t">Target</li><li class="d">Confirmed</li><li class="x">Mismatch</li></ul></div>'
    );
  }
  function logHTML() {
    if (!state.log.length)
      return '<ol class="qe-log"><li><time>--:--:--</time><span class="qe-mute">No events yet</span></li></ol>';
    return (
      '<ol class="qe-log" aria-live="polite">' +
      state.log
        .map(
          (e) =>
            '<li class="' +
            (e.cls || '') +
            '"><time>' +
            e.t +
            '</time><span><span class="k">[' +
            esc(e.k) +
            ']</span> ' +
            esc(e.m) +
            '</span></li>',
        )
        .join('') +
      '</ol>'
    );
  }
  // Serialize only the setup fields needed for the contact request.
  function enquirySetup() {
    const st = state.setup,
      t = state.definition || st.task || {},
      p = t.product || {};
    return {
      warehouse: { type: st.type, aisles: st.aisles, bays: st.bays, levels: st.levels },
      process: {
        operation: t.operation || 'receiving_and_putaway',
        product: p.name || t.item_name || TASK.itemName,
        pack_label: p.pack_label || 'Each',
        pack_units: p.pack_units || 1,
        pack_quantity: p.pack_quantity || TASK.qty,
        serialized: Boolean(p.serialized),
      },
    };
  }
  function modalHTML() {
    if (!state.modal) return '';
    const st = state.setup;
    return (
      '<div class="qe-ov" id="qe-ov"><div class="qe-modal" role="dialog" aria-modal="true" aria-labelledby="qe-mh"><button type="button" class="qe-x" id="qe-mx" aria-label="Close and return to demo">×</button><h3 id="qe-mh">Continue with your warehouse setup</h3><p>Send this setup to the Quark team. We will follow up with you about your warehouse.</p>' +
      '<div class="qe-msum"><span><b>' +
      esc(st.type) +
      '</b></span><span><b>' +
      st.aisles +
      '×' +
      st.bays +
      '×' +
      st.levels +
      '</b> layout</span><span><b>' +
      locCount() +
      '</b> addresses</span><span>' +
      esc(enquirySetup().process.operation.replaceAll('_', ' ')) +
      '</span></div>' +
      (state.sent
        ? '<p class="qe-note" style="margin-top:20px" role="status">Your setup request was sent to Quark. We will follow up at ' +
          esc(state.em) +
          '.</p><div class="qe-mf"><button type="button" class="qe-btn is-ghost" id="qe-mback"><span>Back to demo</span></button></div>'
        : '<form class="qe-mf" id="qe-mform" novalidate><div><label class="qe-lab" for="qe-em">Work email</label><input id="qe-em" type="email" autocomplete="email" maxlength="254" value="' +
          esc(state.em || '') +
          '"' +
          (state.emErr ? ' aria-invalid="true" aria-describedby="qe-eme"' : '') +
          '>' +
          (state.emErr ? '<span class="qe-err" id="qe-eme">' + esc(state.emErr) + '</span>' : '') +
          '</div><div><label class="qe-lab" for="qe-co">Company</label><input id="qe-co" autocomplete="organization" maxlength="160" value="' +
          esc(state.co || '') +
          '"' +
          (state.coErr ? ' aria-invalid="true"' : '') +
          '>' +
          (state.coErr ? '<span class="qe-err">' + esc(state.coErr) + '</span>' : '') +
          '</div><div class="qe-sr" aria-hidden="true"><label>Website<input id="qe-website" tabindex="-1" autocomplete="off"></label></div><label class="qe-consent"><input id="qe-consent" type="checkbox"' +
          (state.consent ? ' checked' : '') +
          '><span>Send my contact details and this demo setup to Quark for follow-up. <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy policy</a></span></label>' +
          (state.sendErr ? '<p class="qe-err" role="alert">' + esc(state.sendErr) + '</p>' : '') +
          '<button class="qe-btn is-wide" type="submit"' +
          (state.sending ? ' disabled' : '') +
          '><span>' +
          (state.sending ? 'Sending…' : 'Send my setup to Quark') +
          '</span><span aria-hidden="true">→</span></button></form>') +
      '</div></div>'
    );
  }
  async function sendEnquiry() {
    if (state.sending) return;
    state.emErr = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((state.em || '').trim())
      ? ''
      : 'Enter a valid work email.';
    state.coErr = (state.co || '').trim() ? '' : 'Enter your company name.';
    state.sendErr = state.consent
      ? ''
      : 'Please agree to send your contact details and this setup.';
    if (state.emErr || state.coErr || state.sendErr) {
      render();
      const f = $('[aria-invalid="true"]') || $('#qe-consent');
      f && f.focus();
      return;
    }
    state.sending = true;
    state.sendErr = '';
    const mailSerial = (state.mailSerial = (state.mailSerial || 0) + 1);
    render();
    try {
      const response = await fetch('/api/engine-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.em.trim(),
          company: state.co.trim(),
          consent: 'yes',
          website: state.website || '',
          ...enquirySetup(),
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.error || 'Could not send. Please retry.');
      if (mailSerial === state.mailSerial) state.sent = true;
    } catch (e) {
      if (mailSerial === state.mailSerial)
        state.sendErr =
          e.name === 'TimeoutError' ? 'The request timed out. Please retry.' : e.message;
    } finally {
      if (mailSerial === state.mailSerial) {
        state.sending = false;
        render();
        const f = state.sent ? $('#qe-mback') : $('#qe-em');
        f && f.focus();
      }
    }
  }
  /* ---------- mount ---------- */
  let lastModal = false,
    opener = null;
  function render() {
    const ae = document.activeElement,
      aid =
        ae && root.contains(ae)
          ? ae.id ||
            (ae.dataset && (ae.dataset.a || ae.dataset.k || ae.dataset.type || ae.dataset.loc))
          : null,
      sel = ae && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null;
    const live = state.phase === 'live',
      sf = state.sync && Date.now() - state.sync.at < 1000 ? state.sync.from : null;
    const region = state.setup.rfLocale?.detected_region;
    const regionTag = region ? '<span class="qe-ai-node">[AI:' + esc(region) + ']</span>' : '';
    root.innerHTML = guide ? guide.html() :
      '<div class="qe-box' +
      (live ? ' is-live' : '') +
      '"' +
      (state.modal ? ' inert' : '') +
      '>' +
      (live ? summaryHTML() : setupHTML()) +
      '<div class="qe-stage"><section class="qe-pane' +
      (sf && sf !== 'web' ? ' is-sync' : '') +
      '" aria-label="WebRF preview"><div class="qe-ph"><b>WebRF Studio · preview</b>' +
      regionTag +
      '<span class="qe-sync">updated from ' +
      (sf ? SRC[sf] : '') +
      '</span></div><div class="qe-pb">' +
      rfHTML() +
      '</div></section>' +
      '<section class="qe-pane' +
      (sf && sf !== 'tui' ? ' is-sync' : '') +
      '" aria-label="Terminal UI preview"><div class="qe-ph"><b>Terminal UI · preview</b>' +
      regionTag +
      '<span class="qe-lep">ℓ Lepton · planned</span><span class="qe-sync">updated from ' +
      (sf ? SRC[sf] : '') +
      '</span></div><div class="qe-pb" style="background:transparent">' +
      tuiHTML() +
      '</div></section>' +
      '<section class="qe-pane" aria-label="Location schematic"><div class="qe-ph"><b>Layout</b><span>' +
      (live ? locCount() + ' addresses' : '—') +
      '</span></div>' +
      faceHTML() +
      '</section>' +
      '<section class="qe-pane" aria-label="Event journal"><div class="qe-ph"><b>Event journal</b><span>shared · local preview</span></div>' +
      (state.phase === 'preparing'
        ? '<div class="qe-prog" style="margin-top:12px"><i style="width:' +
          state.prog +
          '%"></i></div>'
        : '') +
      logHTML() +
      '</section></div><div class="qe-foot"><span class="qe-foot-a"><i aria-hidden="true"></i>AI HARNESS · PHOTON</span><span class="qe-mute">Future AI Onboarding &amp; Support</span><a href="https://quark.build/vision" target="_blank" rel="noopener">MANIFESTO ↗</a></div></div>' +
      modalHTML();
    if (aid) {
      const el =
        document.getElementById(aid) ||
        root.querySelector(
          '[data-a="' +
            aid +
            '"],[data-k="' +
            aid +
            '"],[data-type="' +
            aid +
            '"],[data-loc="' +
            aid +
            '"]',
        );
      if (el && !state.modal) {
        el.focus({ preventScroll: true });
        if (sel && el.setSelectionRange)
          try {
            el.setSelectionRange(sel[0], sel[1]);
          } catch (e) {}
      }
    }
    if (state.modal && !lastModal) {
      opener = aid;
      const f = $('#qe-em') || $('#qe-mback');
      f && f.focus();
    }
    if (!state.modal && lastModal) {
      const c = $('#qe-cont') || $('#qe-reset');
      c && c.focus({ preventScroll: true });
    }
    lastModal = state.modal;
    state.unfold = false;
    if (sf)
      setTimeout(() => {
        root.querySelectorAll('.is-sync').forEach((n) => n.classList.remove('is-sync'));
      }, 1000);
  }
  function tuiKey(k) {
    if (state.phase !== 'live') return;
    if (k === 'F2') return act.submit('tui');
    if (k === 'F3') return act.demo('tui');
    if (k === 'F8' && processView().code === 'close_receipt') return act.submit('tui');
    if (k === 'ESC') return act.back('tui');
  }
  function refineSetup() {
      const questions = state.setup.ai?.uncertainties || [];
      const replies = questions
        .map((q, i) => ({ question: q, answer: (state.answers?.[i] || '').trim() }))
        .filter((x) => x.answer);
      const answer = (state.clarification || '').trim();
      if (!answer && !replies.length) return;
      const text =
        (state.setup.text || '') +
        '\nClarification round:\nQuestions: ' +
        questions.join(' | ') +
        '\nUser answers: ' +
        JSON.stringify({ replies, additional_information: answer });
      if (text.length > 12000) {
        state.formErr = 'Please shorten this answer before sending.';
        return render();
      }
      return analyze(state.setup.plan, {
        refine: true,
        text,
        round: { replies, additional_information: answer },
      });
  }
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (guide) { const handled = guide.click(t); if (handled !== false) return handled; }
    if (t.id === 'qe-demo') return analyze(DEMO_PLAN);
    if (t.id === 'qe-analyze-file') return analyze(state.setup.plan);
    if (t.id === 'qe-ask-go') return askRule();
    if (t.id === 'qe-refine') return refineSetup();
    if (t.dataset.rule != null) {
      state.setup.rules.splice(+t.dataset.rule, 1);
      return render();
    }
    if (t.id === 'qe-desc-go') return analyze(state.setup.plan);
    if (t.id === 'qe-manual') {
      cancelAI();
      state.formErr = '';
      state.setup.ai = null;
      state.setup.src = 'manual';
      state.setup.plan = null;
      state.setup.fromText = {};
      state.stage = 'params';
      state.unfold = true;
      return render();
    }
    if (t.id === 'qe-restart') {
      cancelAI();
      pendingFile = null;
      state.setup.ai = null;
      state.setup.rfLocale = null;
      state.setup.aiKnown = {};
      state.setup.rules = [];
      state.dialog = [];
      state.answers = {};
      state.clarification = '';
      state.log = [];
      state.definition = null;
      state.run = null;
      state.setup.task = Flow.emptyTask();
      state.setup.taskManual = {};
      anT.forEach(clearTimeout);
      if (state.setup.plan && state.setup.plan.url) URL.revokeObjectURL(state.setup.plan.url);
      Object.assign(state.setup, { plan: null, src: null, manual: {}, fromText: {}, text: '' });
      state.stage = 'drop';
      state.formErr = '';
      return render();
    }
    if (t.dataset.type) {
      state.setup.type = t.dataset.type;
      state.setup.manual.type = true;
      state.setup.fromText.type = false;
      return render();
    }
    if (t.id === 'qe-unplan') {
      pendingFile = null;
      if (state.setup.plan && state.setup.plan.url) URL.revokeObjectURL(state.setup.plan.url);
      state.setup.plan = null;
      return render();
    }
    if (t.id === 'qe-edit') {
      cancelAI();
      clearTimeout(leadTimer);
      prepT.forEach(clearTimeout);
      state.phase = 'setup';
      state.stage = 'params';
      state.unfold = true;
      state.modal = false;
      return render();
    }
    if (t.id === 'qe-reset') {
      clearTimeout(leadTimer);
      state.run = Flow.create(state.definition);
      state.draft = '';
      state.mismatch = null;
      state.modal = false;
      syncProcess();
      log('WORKFLOW', 'RF process restarted');
      synced('web');
      return render();
    }
    if (t.id === 'qe-cont') {
      state.modal = true;
      state.sent = false;
      return render();
    }
    if (t.id === 'qe-mx' || t.id === 'qe-mback') {
      state.modal = false;
      return render();
    }
    const a = t.dataset.a;
    if (a === 'flow-submit' || a === 'flow-confirm') return act.submit('web');
    if (a === 'flow-demo') return act.demo('web');
    if (t.dataset.k) return tuiKey(t.dataset.k);
    if (t.dataset.aisle) {
      state.face.aisle = t.dataset.aisle;
      return render();
    }
    if (t.dataset.side) {
      state.face.side = t.dataset.side;
      return render();
    }
    if (t.dataset.loc && state.step === 'scan') return act.scan(t.dataset.loc, 'map', true);
  });
  root.addEventListener('click', (e) => {
    if (e.target.id === 'qe-ov') {
      state.modal = false;
      render();
    }
    const tui = e.target.closest('#qe-tui');
    if (tui && e.target.tagName !== 'INPUT') {
      const i = $('#qe-tuiscan');
      (i || tui).focus();
    }
  });
  root.addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'qe-desc') {
      state.setup.text = t.value;
      state.descriptionChanged = true;
      const guidedContinue = $('#qt-analyze');
      if (guidedContinue) guidedContinue.disabled = !t.value.trim() && !state.setup.plan;
      const g = $('#qe-desc-go');
      if (g) g.disabled = !t.value.trim();
      const p = $('#qe-parsed');
      if (p)
        p.textContent =
          state.stage === 'params'
            ? 'Description changed. Analyse again to update suggestions.'
            : 'Quark AI will suggest parameters from your description';
      return;
    }
    if (t.dataset.k && t.classList.contains('qe-num')) {
      const v = clamp(t.dataset.k, t.value);
      if (v != null) {
        state.setup[t.dataset.k] = v;
        state.setup.manual[t.dataset.k] = true;
        state.setup.fromText[t.dataset.k] = false;
        t.nextElementSibling.textContent = 'set manually';
        t.nextElementSibling.className = '';
        const n = root.querySelector('.qe-setup .qe-note .qe-mono');
        if (n) n.textContent = locCount();
      }
      return;
    }
    if (t.dataset.scan) {
      state.draft = t.value.slice(0, 64);
      const other = $(t.dataset.scan === 'web' ? '#qe-tuiscan' : '#qe-rfscan');
      if (other) other.value = state.draft;
      return;
    }
    const productFields = {
      'qe-product': 'name',
      'qe-sku': 'sku',
      'qe-pack-label': 'pack_label',
      'qe-pack-qty': 'pack_quantity',
      'qe-pack-units': 'pack_units',
    };
    if (productFields[t.id]) {
      const key = productFields[t.id];
      state.setup.task.product[key] =
        key.startsWith('pack_') && key !== 'pack_label'
          ? t.value === ''
            ? null
            : Number(t.value)
          : t.value;
      state.setup.taskManual['product.' + key] = true;
    }
    if (t.id === 'qe-lpn') {
      state.setup.task.lpn = t.value;
      state.setup.taskManual.lpn = true;
    }
    if (t.id === 'qe-answer') state.clarification = t.value;
    if (t.dataset.question != null) {
      state.answers = state.answers || {};
      state.answers[t.dataset.question] = t.value;
    }
    if (t.id === 'qe-answer' || t.dataset.question != null) {
      const b = $('#qe-refine');
      if (b) b.disabled = !hasReplies();
    }
    if (t.id === 'qe-ask') state.ruleText = t.value;
    if (t.id === 'qe-em') state.em = t.value;
    if (t.id === 'qe-co') state.co = t.value;
    if (t.id === 'qe-website') state.website = t.value;
  });
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.classList.contains('qe-num')) {
      t.value = state.setup[t.dataset.k];
      if (t.dataset.k === 'aisles') return render();
    }
    if (
      ['qe-product', 'qe-sku', 'qe-pack-label', 'qe-pack-qty', 'qe-pack-units', 'qe-lpn'].includes(
        t.id,
      )
    )
      return render();
    if (t.id === 'qe-consent') state.consent = t.checked;
    if (t.id === 'qe-operation') {
      state.setup.task.operation = t.value;
      state.setup.task.title = Flow.labels[t.value];
      state.setup.task.steps = Flow.defaults(
        t.value,
        state.setup.task.product.serialized,
        state.setup.task.product.lot_controlled,
      );
      state.setup.taskManual.operation = true;
      return render();
    }
    if (t.id === 'qe-serialized' || t.id === 'qe-lot-controlled') {
      const key = t.id === 'qe-serialized' ? 'serialized' : 'lot_controlled';
      state.setup.task.product[key] = t.checked;
      state.setup.taskManual['product.' + key] = true;
      state.setup.task.operation = state.setup.task.operation || 'receiving_and_putaway';
      state.setup.task.steps = Flow.defaults(
        state.setup.task.operation,
        state.setup.task.product.serialized,
        state.setup.task.product.lot_controlled,
      );
      return render();
    }
    if (t.id === 'qe-target-aisle') {
      state.setup.task.destination_aisle = t.value;
      state.setup.taskManual.destination_aisle = true;
    }

    if (t.id === 'qe-plan' && t.files[0]) takeFile(t.files[0]);
  });
  function takeFile(f) {
    if (!/\.(jpe?g|png|pdf)$/i.test(f.name)) {
      state.formErr = 'Use a JPEG, PNG or PDF file.';
      return render();
    }
    if (f.size > 3 * 1024 * 1024) {
      state.formErr = 'Use a file smaller than 3 MB.';
      return render();
    }
    cancelAI();
    if (state.setup.plan && state.setup.plan.url) URL.revokeObjectURL(state.setup.plan.url);
    pendingFile = f;
    state.setup.plan = {
      name: f.name,
      size: f.size,
      url: /^image\//.test(f.type) ? URL.createObjectURL(f) : null,
    };
    state.formErr = '';
    render();
  }
  root.addEventListener('dragover', (e) => {
    const d = e.target.closest && e.target.closest('#qe-drop');
    if (!d) return;
    e.preventDefault();
    if (!state.dragOver) {
      state.dragOver = true;
      d.classList.add('is-over');
    }
  });
  root.addEventListener('dragleave', (e) => {
    const d = e.target.closest && e.target.closest('#qe-drop');
    if (d && !d.contains(e.relatedTarget)) {
      state.dragOver = false;
      d.classList.remove('is-over');
    }
  });
  root.addEventListener('drop', (e) => {
    const d = e.target.closest && e.target.closest('#qe-drop');
    if (!d) return;
    e.preventDefault();
    state.dragOver = false;
    const f = e.dataTransfer.files[0];
    if (f) takeFile(f);
  });
  root.addEventListener('keydown', (e) => {
    const t = e.target;
    if (state.modal && e.key === 'Escape') {
      state.modal = false;
      return render();
    }
    if (state.modal && e.key === 'Tab') {
      const f = [...root.querySelectorAll('.qe-modal button,.qe-modal input,.qe-modal a')].filter(
        (el) => !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null,
      );
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
      return;
    }
    if (t.id === 'qe-ask' && e.key === 'Enter') {
      e.preventDefault();
      const b = $('#qe-ask-go');
      b && b.click();
      return;
    }
    if (t.dataset && t.dataset.scan && e.key === 'Enter') {
      e.preventDefault();
      return act.submit(t.dataset.scan === 'web' ? 'web' : 'tui', t.value);
    }
    if (t.closest && t.closest('#qe-tui')) {
      if (e.key === 'F2') {
        e.preventDefault();
        tuiKey('F2');
      } else if (e.key === 'F3') {
        e.preventDefault();
        tuiKey('F3');
      } else if (e.key === 'F8') {
        e.preventDefault();
        tuiKey('F8');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        tuiKey('ESC');
      } else if (e.key === 'Enter' && t.id === 'qe-tui') {
        e.preventDefault();
        tuiKey('F2');
      }
    }
  });
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'qe-form') {
      if (!locCount()) {
        state.formErr = 'Set aisles, bays and levels.';
        return render();
      }
      state.formErr = '';
      return generate();
    }
    if (e.target.id === 'qe-mform') return sendEnquiry();
  });
  if (root.dataset?.experience === 'guided' && window.QuarkTry) {
    guide = window.QuarkTry.create({ root, state, Flow, esc, render, generate, analyze, cancelAI,
      refine: refineSetup, rfHTML, tuiHTML, faceHTML, logHTML, taskParamsHTML, modalHTML,
      stopTimers() { clearTimeout(leadTimer); prepT.forEach(clearTimeout); } });
  }
  render();
  window.QuarkEngineDemo = { state, act, generate };
})();
