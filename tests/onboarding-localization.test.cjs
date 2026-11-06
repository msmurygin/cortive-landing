const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
const Locales = require("../assets/workflow-demo/onboarding-locales");
const Catalogs = require("../assets/workflow-demo/onboarding-translations");
const Language = require("../assets/workflow-demo/onboarding-language");
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
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
test("English is the default; explicit query locales are honored and untrusted/unsupported values cannot become UI locales", () => {
  assert.equal(Language.initial(""), "en");
  for (const lang of Language.supported)
    assert.equal(Language.initial("?lang=" + lang), lang);
  for (const query of ["?lang=xx", "?lang=<script>", "?other=el"])
    assert.equal(Language.initial(query), "en");
  assert.equal(Language.initial("?lang=EL"), "el");
});
test("all five additional catalogs cover every source string and preserve interpolation placeholders and sample identifiers", () => {
  const unchanged = new Set([
    "RF",
    "12 EA",
    "6 EA",
    "{count} EA",
    "[SCANNER]",
    "English",
  ]);
  for (const [lang, catalog] of Object.entries(Catalogs)) {
    for (const key of Locales.catalog()) {
      assert.ok(catalog[key]?.trim(), lang + ": " + key);
      for (const token of key.match(/\{[^}]+\}/g) || [])
        assert.ok(catalog[key].includes(token), lang + ": " + token);
      for (const id of key.match(
        /(?:PLT-\d+|RECV-\d+|PUT-\d+|SO-\d+|[AB]-\d+-\d+|MILK-1L|WATER-500)/g,
      ) || [])
        assert.ok(catalog[key].includes(id), lang + ": " + id);
      if (!unchanged.has(key))
        assert.notEqual(catalog[key], key, lang + ": untranslated " + key);
    }
    assert.notEqual(
      Locales.tr("What do you store?", lang),
      "What do you store?",
    );
    assert.equal(Locales.tr("PLT-000184", lang), "PLT-000184");
    assert.ok(
      Locales.tr("Wrong product. Expected MILK-1L.", lang).includes("MILK-1L"),
    );
    assert.ok(
      !Locales.tr("Wrong product. Expected MILK-1L.", lang).includes(
        "Wrong product",
      ),
    );
    assert.ok(
      !Locales.tr(
        "Target location scan: Optional in test variant → Required",
        lang,
      ).includes("Required"),
    );
  }
});
test("a confident Albanian message offers a switch; ambiguous counts, unknown languages and declined suggestions do not", () => {
  assert.equal(
    Language.suggestion(
      { message_language: "sq", language_confidence: "high" },
      "en",
    ),
    "sq",
  );
  assert.equal(
    Language.suggestion(
      { message_language: "sq", language_confidence: "low" },
      "en",
    ),
    null,
  );
  assert.equal(
    Language.suggestion(
      { message_language: "sq", language_confidence: "high" },
      "sq",
    ),
    null,
  );
  assert.equal(
    Language.suggestion(
      { message_language: "unknown", language_confidence: "high" },
      "en",
    ),
    null,
  );
  assert.equal(
    Language.suggestion(
      { message_language: "sq", language_confidence: "high" },
      "en",
      ["sq"],
    ),
    null,
  );
});
test("AI detection fields are strictly validated; the model cannot return a switch action or execute the simulation", () => {
  const answers = Object.fromEntries(Model.questions.map((q) => [q.key, null]));
  const valid = {
    assistant_message: "Would you like to use Albanian?",
    answers,
    profile: emptyProfile(),
    message_language: "sq",
    language_confidence: "high",
  };
  assert.equal(AI.validate(valid).message_language, "sq");
  for (const extra of [
    { message_language: "<script>" },
    { language_confidence: "certain" },
    { switch_ui: true },
    { activate: true },
  ])
    assert.throws(() => AI.validate({ ...valid, ...extra }));
  const input = AI.parseOnboarding({
    headers: { "content-type": "application/json" },
    body: {
      experience: "onboarding",
      stage: "profile",
      facts: {},
      text: "Përshëndetje, kam një magazinë.",
      consent: true,
      preferred_language: "sq",
    },
  });
  assert.equal(input.preferred_language, "sq");
});
test("only one scan action is visible in either device view; error injection remains controlled by the state machine", () => {
  const machine = Model.create();
  machine.useSample();
  machine.beginConfiguration();
  for (let i = 0; i < 6; i++) machine.configureNext();
  machine.submit("PLT-000184");
  for (const view of ["webrf", "terminal"]) {
    let html = Device.render(machine, { esc, shell: RF.shell, view });
    assert.equal((html.match(/data-action="scan"/g) || []).length, 1);
    assert.doesNotMatch(html, /data-action="error"/);
  }
  machine.injectError();
  for (const view of ["webrf", "terminal"]) {
    let html = Device.render(machine, { esc, shell: RF.shell, view });
    assert.equal((html.match(/data-action="scan"/g) || []).length, 0);
    assert.equal((html.match(/data-action="correction"/g) || []).length, 1);
  }
});
test("the UI has no language selector; language acceptance keeps the same warehouse machine rather than resetting progress", () => {
  const js = fs.readFileSync(
    require.resolve("../assets/workflow-demo/onboarding-workspace"),
    "utf8",
  );
  assert.doesNotMatch(
    js,
    /createElement\("select"\)|id="demoLanguage"|data-pref="language"/,
  );
  assert.match(js, /Language\.initial\(location\.search\)/);
  const block = js.slice(
    js.indexOf("function setLanguage"),
    js.indexOf("function cancel"),
  );
  assert.doesNotMatch(block, /Model\.create|machine\.replay|Object\.assign/);
  assert.match(block, /s\.preferences\.language = next/);
  assert.match(block, /history\.replaceState/);
  assert.match(js, /Language\.suggestion/);
});

test("model replies use the same localized action names as the UI even when the model emits English command labels", () => {
  const answers = Object.fromEntries(Model.questions.map((q) => [q.key, null]));
  const raw = {
    assistant_message: "Use Scan, Confirm or Retry.",
    answers,
    profile: emptyProfile(),
    message_language: "sq",
    language_confidence: "high",
  };
  for (const lang of ["el", "bg", "sr", "ro", "sq"]) {
    const result = AI.validate(raw, { preferred_language: lang });
    assert.ok(result.assistant_message.includes(Locales.tr("Scan", lang)));
    assert.ok(!/(?<!\p{L})(Scan|Confirm|Retry)(?!\p{L})/u.test(result.assistant_message));
  }
});
