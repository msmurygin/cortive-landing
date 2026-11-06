const { test } = require("node:test"),
  a = require("node:assert/strict");
const Model = require("../assets/workflow-demo/onboarding-machine");
const Device = require("../assets/workflow-demo/onboarding-device");
const RF = require("../assets/workflow-demo/rf-device");
const AI = require("../lib/onboarding-ai");
const emptyProfile = () => ({
  product_name: null,
  lot_policy: {
    enabled: null,
    code: null,
    lot_creation: null,
    attributes: [],
  },
  capture_lpn: null,
  receive_whole_pallets: null,
  receiving_location: null,
  receiving_location_scan: null,
});
const esc = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function configured(over = {}) {
  const m = Model.create();
  m.useSample();
  m.setFacts(over);
  a.equal(m.beginConfiguration(), true);
  for (let i = 0; i < 6; i++) m.configureNext();
  return m;
}
function pass(m) {
  let guard = 0;
  while (!m.state.stage.endsWith("_review")) {
    if (++guard > 100) throw Error("stuck");
    const v = m.screen(),
      key = m.state.stage === "putaway" ? "destination" : "product";
    if (v.key === key && !m.state.faults[m.state.stage]) {
      m.injectError();
      a.ok(m.state.correction);
      m.applyCorrection();
    } else
      m.submit(
        v.kind === "unit"
          ? m.state.facts.goods === "expiry"
            ? "MILK-1L"
            : "SOAP-500"
          : v.expected || "",
      );
  }
}
test("onboarding is one gated scenario; incomplete profiles and skipped stages cannot pass", () => {
  const m = Model.create();
  a.equal(m.question().key, "goods");
  a.equal(m.beginConfiguration(), false);
  a.equal(m.approve(), false);
  a.equal(m.next(), false);
  a.equal(m.submit("48"), false);
  a.equal(m.answer("goods", "made-up"), false);
  a.equal(m.state.passed.length, 0);
});
test("the complete distribution journey preserves the received LPN and validates exactly three sample processes", () => {
  const m = configured();
  pass(m);
  a.equal(m.state.stage, "receiving_review");
  a.equal(m.state.stock.dock, 48);
  a.equal(m.state.expiry, "2027-12-31");
  m.next();
  a.equal(m.screen().operation, "putaway");
  pass(m);
  a.deepEqual(m.state.stock, { dock: 0, stored: 48, picked: 0 });
  m.next();
  pass(m);
  a.deepEqual(m.state.passed, ["receiving", "putaway", "picking"]);
  a.equal(m.state.line, 1);
  a.deepEqual(m.state.stock, { dock: 0, stored: 36, picked: 18 });
  m.next();
  a.equal(m.state.stage, "customize");
  m.preference("large", true);
  m.next();
  a.equal(m.state.stage, "permissions");
  m.next();
  a.equal(m.state.stage, "result");
  a.equal(m.approve(), true);
  a.equal(m.state.stage, "approved");
  a.equal(m.state.production_activated, undefined);
  a.equal(m.state.passed.length, 3);
});
test("wrong destination blocks all progress until the proposed correction is applied and a correct scan is accepted", () => {
  const m = configured();
  pass(m);
  m.next();
  m.submit("PLT-000184");
  const index = m.state.step;
  m.injectError();
  a.match(m.state.error, /A-01-02/);
  a.equal(m.state.step, index);
  a.equal(m.submit("A-01-02"), false);
  a.equal(m.state.stock.stored, 0);
  m.applyCorrection();
  a.equal(m.state.config.targetScan, "Required");
  a.equal(m.state.config.allowLocationOverride, false);
  m.submit("A-01-02");
  m.submit("");
  a.equal(m.state.stock.stored, 48);
  a.equal(m.state.changes.filter((c) => c.process === "putaway").length, 1);
});
test("a correct barcode cannot skip the controlled error test or fabricate a passed process", () => {
  const m = configured();
  m.submit("PLT-000184");
  a.equal(m.submit("MILK-1L"), false);
  a.equal(m.screen().key, "product");
  a.equal(m.state.passed.length, 0);
  m.injectError();
  m.applyCorrection();
  a.equal(m.submit("MILK-1L"), true);
});
test("ordinary goods never acquire expiry capture; invalid quantity/date do not advance the sample", () => {
  const ordinary = configured({ goods: "ordinary" });
  pass(ordinary);
  a.equal(ordinary.state.expiry, "");
  a.equal(ordinary.state.facts.goods, "ordinary");
  const m = configured();
  m.submit("PLT-000184");
  m.injectError();
  m.applyCorrection();
  m.submit("MILK-1L");
  a.equal(m.submit("49"), false);
  a.equal(m.screen().key, "quantity");
  m.submit("48");
  for (const date of ["yesterday", "2020-01-01", "2027-02-31"])
    a.equal(m.submit(date), false);
  a.equal(m.screen().key, "expiry");
  a.equal(m.submit("2027-12-31"), true);
});
test("per-unit receipt requires all 48 scans and never accepts an unknown item as a unit", () => {
  const m = configured({ goods: "ordinary", quantity: "scan_each" });
  m.submit("PLT-000184");
  m.injectError();
  m.applyCorrection();
  m.submit("SOAP-500");
  a.equal(m.submit("BAD"), false);
  a.equal(m.state.unitsScanned, 0);
  for (let i = 0; i < 47; i++) m.submit("SOAP-500");
  a.equal(m.screen().kind, "unit");
  m.submit("SOAP-500");
  a.equal(m.screen().kind, "confirm");
  m.submit("");
  a.equal(m.state.stock.dock, 48);
});
test("customization is immediate in both views and the simulated role has only assigned processes", () => {
  const m = configured();
  pass(m);
  m.next();
  pass(m);
  m.next();
  pass(m);
  m.next();
  let h = Device.render(m, { esc, shell: RF.shell });
  a.doesNotMatch(h, /on-large/);
  m.preference("large", true);
  m.preference("image", true);
  m.preference("language", "el");
  h = Device.render(m, { esc, shell: RF.shell });
  a.match(h, /on-large/);
  a.match(h, /Sample carton/);
  m.next();
  for (const view of ["webrf", "terminal"]) {
    h = Device.render(m, { esc, shell: RF.shell, view });
    a.match(h, /Μενού χειριστή/);
    if (view === "webrf")
      a.equal((h.match(/Assigned process/g) || []).length, 3);
    else {
      a.match(h, /Terminal session/);
      a.match(h, /\[3\] Picking/);
      a.doesNotMatch(h, /wd-tile/);
    }
    a.doesNotMatch(h, /data-op="(?:admin|packing|counting)"/);
  }
  a.equal(m.preference("large", false), false);
});
test("replay resets stock, faults and passes while retaining confirmed warehouse facts", () => {
  const m = configured();
  pass(m);
  m.replay();
  a.equal(m.state.stage, "configuration");
  a.equal(m.state.facts.goods, "expiry");
  a.deepEqual(m.state.stock, { dock: 0, stored: 0, picked: 0 });
  a.deepEqual(m.state.passed, []);
  a.deepEqual(m.state.changes, []);
});
test("AI extraction validates facts and cannot inject execution instructions or extra state", async () => {
  const body = {
    experience: "onboarding",
    stage: "profile",
    facts: { goods: "ordinary" },
    text: "Cases, manual quantity and single orders.",
    consent: true,
  };
  const input = AI.parseOnboarding({
    headers: { "content-type": "application/json" },
    body,
  });
  a.match(input.text, /confirmed_facts/);
  a.match(input.text, /confirmed_process_profile/);
  a.throws(() =>
    AI.parseOnboarding({
      headers: { "content-type": "application/json" },
      body: { ...body, stage: "activate-production" },
    }),
  );
  a.throws(() =>
    AI.parseOnboarding({
      headers: { "content-type": "application/json" },
      body: { ...body, facts: { goods: "hack" } },
    }),
  );
  const answers = Object.fromEntries(Model.questions.map((q) => [q.key, null]));
  a.throws(() =>
    AI.validate({
      assistant_message: "x",
      answers,
      profile: emptyProfile(),
      execute: "deploy",
    }),
  );
  a.throws(() =>
    AI.validate({
      assistant_message: "x",
      answers: { ...answers, goods: "arbitrary" },
      profile: emptyProfile(),
    }),
  );
  let sent;
  await AI.inferOnboarding(input, {
    key: "TEST-ONLY",
    model: "TEST",
    fetchImpl: async (url, opts) => {
      sent = JSON.parse(opts.body);
      return {
        ok: true,
        text: async () =>
          JSON.stringify(
            url.endsWith("count_tokens")
              ? { input_tokens: 100 }
              : {
                  stop_reason: "end_turn",
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        assistant_message: "How are quantities confirmed?",
                        answers,
                        profile: emptyProfile(),
                        message_language: "en",
                        language_confidence: "high",
                      }),
                    },
                  ],
                },
          ),
      };
    },
  });
  a.equal(sent.output_config.format.schema.additionalProperties, false);
  a.doesNotMatch(
    JSON.stringify(sent.output_config.format.schema),
    /execute|activate/,
  );
  a.match(JSON.stringify(sent.output_config.format.schema), /lot_policy/);
  a.doesNotMatch(
    JSON.stringify(sent.output_config.format.schema),
    /capture_item_attributes_at_receiving|item_attributes/,
  );
});

test("apparel receiving keeps product attributes, whole-pallet LPN capture and automatic STAGE", () => {
  const answers = Object.fromEntries(Model.questions.map((q) => [q.key, null]));
  answers.goods = "ordinary";
  const result = AI.validate({
    assistant_message:
      "Принял: женские майки, атрибуты Цвет и Размер, приёмка целыми паллетами с вводом LPN в STAGE. Ячейку STAGE при приёмке сканировать не нужно.",
    answers,
    profile: {
      product_name: "Майки женские",
      lot_policy: {
        enabled: true,
        code: "APPAREL",
        lot_creation: "Existing",
        attributes: [
          {
            code: "COLOR",
            label: "Цвет",
            show: true,
            required: true,
            show_on_pick: false,
            physical_verification: "NotVerifiable",
            override_allowed: false,
          },
          {
            code: "SIZE",
            label: "Размер",
            show: true,
            required: true,
            show_on_pick: false,
            physical_verification: "NotVerifiable",
            override_allowed: false,
          },
        ],
      },
      capture_lpn: true,
      receive_whole_pallets: true,
      receiving_location: "STAGE",
      receiving_location_scan: "not_required",
    },
    message_language: "ru",
    language_confidence: "high",
  });
  a.equal(result.answers.containers, "pallet_case_each");
  const m = Model.create();
  m.setFacts(result.answers);
  m.setProfile(result.profile);
  a.equal(m.state.facts.goods, "ordinary");
  a.equal(m.state.profile.product_name, "Майки женские");
  a.equal(m.state.profile.lot_policy.enabled, true);
  a.equal(m.state.profile.lot_policy.code, "APPAREL");
  a.deepEqual(
    m.state.profile.lot_policy.attributes.map((attribute) => attribute.code),
    ["COLOR", "SIZE"],
  );
  a.equal(m.state.profile.receiving_location, "STAGE");
  a.equal(m.state.profile.receiving_location_scan, "not_required");
  for (const q of Model.questions)
    if (!m.state.facts[q.key]) m.answer(q.key, q.choices[0][0]);
  m.beginConfiguration();
  for (let i = 0; i < 6; i++) m.configureNext();
  const html = Device.render(m, { esc, shell: RF.shell });
  a.match(html, /Майки женские/);
  a.match(html, /Цвет · Размер/);
  a.match(html, /STAGE/);
  a.match(html, /Receiving location scan/);
  a.match(html, /Not required/);
  a.doesNotMatch(html, /MILK-1L|SOAP-500/);
  a.equal(m.submit("PLT-000184"), true);
  m.injectError();
  m.applyCorrection();
  a.equal(m.submit("ITEM-DEMO-001"), true);
  a.equal(m.screen().attribute_code, "COLOR");
  a.equal(m.screen().label, "Цвет");
  a.equal(m.submit("Красный"), true);
  a.equal(m.screen().attribute_code, "SIZE");
  a.equal(m.screen().label, "Размер");
  a.equal(m.submit("M"), true);
  a.deepEqual(m.state.capturedAttributes, { COLOR: "Красный", SIZE: "M" });
});

test("scan feedback is pinned outside the scrolling content and values appear only after accepted scans", () => {
  const m = configured();
  let html = Device.render(m, { esc, shell: RF.shell });
  a.match(html, /Awaiting scan/);
  a.equal(m.submit("PLT-000184"), true);
  a.equal(m.state.accepted[0].value, "PLT-000184");
  a.equal(m.state.feedback.kind, "accepted");
  html = Device.render(m, { esc, shell: RF.shell });
  a.ok(html.indexOf("on-feedback") < html.indexOf('class="wd-body"'));
  a.match(html, /Scan accepted/);
  m.injectError();
  a.equal(m.state.feedback.kind, "error");
  for (const view of ["webrf", "terminal"]) {
    html = Device.render(m, { esc, shell: RF.shell, view });
    a.ok(html.indexOf("on-feedback") < html.indexOf('class="wd-body"'));
    a.match(html, /Unknown product barcode/);
  }
  m.applyCorrection();
  a.equal(m.state.feedback.kind, "updated");
  m.submit("MILK-1L");
  a.equal(m.state.feedback.value, "MILK-1L");
});
test("terminal mode renders an actual text session at discovery, customization, permissions and final results", () => {
  const m = configured();
  for (const stage of [
    "profile",
    "configuration",
    "receiving_review",
    "customize",
    "permissions",
    "result",
    "approved",
  ]) {
    m.state.stage = stage;
    const html = Device.render(m, { esc, shell: RF.shell, view: "terminal" });
    a.match(html, /aria-label="Terminal session"/);
    a.doesNotMatch(html, /class="wd-menu|class="wd-tile|class="wd-field/);
    if (["permissions", "result", "approved"].includes(stage))
      a.match(html, /\[3\] Picking/);
  }
});
test("guided copy has one English/Russian presentation language and does not translate business identifiers", () => {
  const L = require("../assets/workflow-demo/onboarding-locales");
  const m = configured();
  pass(m);
  m.next();
  pass(m);
  m.next();
  pass(m);
  m.next();
  m.next();
  m.next();
  for (const message of m.state.messages.filter((x) => x.role === "assistant"))
    a.notEqual(L.tr(message.text, "ru"), message.text, message.text);
  for (const event of m.state.events)
    a.notEqual(L.tr(event.title, "ru"), event.title, event.title);
  a.equal(L.tr("PLT-000184", "ru"), "PLT-000184");
  a.equal(L.tr("Receiving RECV-10042", "ru"), "Приёмка RECV-10042");
  a.equal(L.tr("Scan accepted", "ru"), "Сканирование принято");
  a.equal(L.tr("Scan accepted", "en"), "Scan accepted");
});
