/* Pure onboarding state machine. No DOM, network, timers or warehouse writes.
 * Adapters can replace sample scans and the assistant without changing transitions.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkOnboarding = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  const questions = [
    {
      key: "goods",
      text: "What do you store?",
      choices: [
        ["ordinary", "Ordinary goods"],
        ["expiry", "Goods with expiry dates"],
        ["serial", "Serial-controlled goods"],
      ],
    },
    {
      key: "containers",
      text: "How are goods handled?",
      choices: [
        ["pallet_case_each", "Pallets, cases and units"],
        ["case_each", "Cases and units"],
      ],
    },
    {
      key: "barcodes",
      text: "Do operators scan product barcodes during receiving?",
      choices: [
        ["required", "Yes, product scan is required"],
        ["optional", "Not consistently yet"],
      ],
    },
    {
      key: "quantity",
      text: "How is quantity confirmed?",
      choices: [
        ["manual", "Enter the quantity"],
        ["scan_each", "Scan each unit"],
      ],
    },
    {
      key: "location",
      text: "Who chooses the putaway location?",
      choices: [
        ["directed", "The WMS suggests a location"],
        ["operator", "The operator chooses"],
      ],
    },
    {
      key: "picking",
      text: "How do operators pick orders?",
      choices: [
        ["single_order", "One order at a time"],
        ["wave", "In waves"],
      ],
    },
    {
      key: "packing",
      text: "Do you check the product before packing is completed?",
      choices: [
        ["check", "Yes, product check required"],
        ["no_check", "Not currently"],
      ],
    },
  ];
  const defaults = {
    goods: "expiry",
    containers: "pallet_case_each",
    barcodes: "required",
    quantity: "manual",
    location: "directed",
    picking: "single_order",
    packing: "check",
  };
  const stages = [
    "profile",
    "configuration",
    "receiving",
    "receiving_review",
    "putaway",
    "putaway_review",
    "picking",
    "picking_review",
    "customize",
    "permissions",
    "result",
    "approved",
  ];
  const progress = [
    "Warehouse model confirmed",
    "Operator permissions configured",
    "Receiving example prepared",
    "Putaway example prepared",
    "Picking example prepared",
  ];
  const titles = {
    receiving: "Receiving",
    putaway: "Putaway",
    picking: "Picking",
  };
  const reviewChanges = {
    receiving: {
      label: "Unknown product barcode",
      before: "No recovery rule",
      after: "Block and offer retry",
      why: "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.",
    },
    putaway: {
      label: "Target location scan",
      before: "Optional in test variant",
      after: "Required",
      why: "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.",
    },
    picking: {
      label: "Product check before pick completion",
      before: "Optional in test variant",
      after: "Required",
      why: "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.",
    },
  };
  function create() {
    const state = {
      stage: "profile",
      facts: {},
      profile: {
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
      },
      messages: [],
      events: [],
      configIndex: 0,
      step: 0,
      error: "",
      accepted: [],
      feedback: null,
      feedbackSequence: 0,
      correction: null,
      changes: [],
      passed: [],
      line: 0,
      unitsScanned: 0,
      receiptQuantity: 0,
      expiry: "",
      capturedAttributes: {},
      stock: { dock: 0, stored: 0, picked: 0 },
      faults: {},
      testedErrors: {},
      config: {
        role: "Warehouse Operator",
        processes: ["Receiving", "Putaway", "Picking"],
        unknownBarcode: "No recovery rule",
        targetScan: "Optional in test variant",
        productCheck: "Optional in test variant",
        allowLocationOverride: false,
      },
      preferences: {
        large: false,
        simple: false,
        image: false,
        sound: false,
        codes: false,
        reasons: true,
        quantity: true,
        language: "en",
      },
      approved: false,
    };
    const say = (text, role = "assistant") =>
      state.messages.push({ text, role });
    const event = (title, detail = "", tone = "done") =>
      state.events.push({ title, detail, tone });
    const question = () => questions.find((q) => !state.facts[q.key]);
    function intro() {
      say(
        "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.",
      );
      event(
        "Guided demo started",
        "Sample data · no live warehouse connection",
      );
    }
    intro();
    function setFacts(values) {
      if (state.stage !== "profile") return false;
      for (const q of questions) {
        if (q.choices.some(([v]) => v === values[q.key]))
          state.facts[q.key] = values[q.key];
      }
      return true;
    }
    function setProfile(values) {
      if (state.stage !== "profile" || !values) return false;
      for (const key of [
        "product_name",
        "capture_lpn",
        "receive_whole_pallets",
        "receiving_location",
        "receiving_location_scan",
      ])
        if (values[key] !== null && values[key] !== undefined)
          state.profile[key] = values[key];
      if (values.lot_policy && typeof values.lot_policy === "object")
        state.profile.lot_policy = {
          enabled: values.lot_policy.enabled,
          code: values.lot_policy.code,
          lot_creation: values.lot_policy.lot_creation,
          attributes: Array.isArray(values.lot_policy.attributes)
            ? values.lot_policy.attributes.map((attribute) => ({ ...attribute }))
            : [],
        };
      return true;
    }
    function productCode() {
      if (state.profile.product_name) return "ITEM-DEMO-001";
      return state.facts.goods === "expiry" ? "MILK-1L" : "SOAP-500";
    }
    function answer(key, value) {
      if (state.stage !== "profile") return false;
      const q = questions.find((x) => x.key === key);
      if (!q || !q.choices.some(([v]) => v === value)) return false;
      state.facts[key] = value;
      say(q.choices.find(([v]) => v === value)[1], "user");
      state.messages[state.messages.length - 1].guided = true;
      event(
        "Warehouse fact confirmed",
        q.text + " " + q.choices.find(([v]) => v === value)[1],
      );
      return true;
    }
    function useSample() {
      if (state.stage !== "profile") return false;
      setFacts(defaults);
      state.profile = {
        product_name: null,
        lot_policy: {
          enabled: false,
          code: null,
          lot_creation: null,
          attributes: [],
        },
        capture_lpn: true,
        receive_whole_pallets: true,
        receiving_location: "STAGE",
        receiving_location_scan: "not_required",
      };
      say(
        "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.",
        "user",
      );
      state.messages[state.messages.length - 1].guided = true;
      event(
        "Sample warehouse selected",
        "Includes an expiry-dated milk line. No serial numbers.",
      );
      return true;
    }
    function beginConfiguration() {
      if (state.stage !== "profile" || question()) return false;
      state.stage = "configuration";
      say(
        "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.",
      );
      if (state.facts.picking === "wave")
        say(
          "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.",
        );
      if (state.facts.goods === "serial")
        say(
          "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.",
        );
      event(
        "Configuration started",
        "Existing process templates; no new business logic generated",
      );
      return true;
    }
    function configureNext() {
      if (state.stage !== "configuration") return false;
      if (state.configIndex < progress.length) {
        event(progress[state.configIndex]);
        state.configIndex++;
        return true;
      }
      start("receiving");
      return true;
    }
    function start(process) {
      state.stage = process;
      state.step = 0;
      state.error = "";
      state.feedback = null;
      state.correction = null;
      state.unitsScanned = 0;
      const texts = {
        receiving:
          "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.",
        putaway:
          "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.",
        picking:
          "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.",
      };
      say(texts[process]);
      event(
        titles[process] + " simulation started",
        "Use Scan, Confirm and Retry yourself",
      );
    }
    function screen() {
      const op = state.stage;
      if (!["receiving", "putaway", "picking"].includes(op)) return null;
      let steps;
      if (op === "receiving") {
        steps = [
          {
            key: "pallet",
            label: "Scan pallet",
            expected: "PLT-000184",
            kind: "scan",
          },
          {
            key: "product",
            label: "Scan product",
            expected: productCode(),
            kind: "scan",
          },
          ...(state.profile.lot_policy.enabled
            ? state.profile.lot_policy.attributes
                .filter((attribute) => attribute.show)
                .map((attribute, index) => ({
                  key: "lot_attribute_" + index,
                  label: attribute.label || attribute.code,
                  attribute_code: attribute.code,
                  required: attribute.required,
                  kind: "lot_attribute",
                }))
            : []),
          {
            key: "quantity",
            label:
              state.facts.quantity === "scan_each"
                ? "Scan each unit"
                : "Confirm expected quantity",
            expected: "48",
            kind: state.facts.quantity === "scan_each" ? "unit" : "number",
          },
        ];
        if (state.facts.goods === "expiry")
          steps.push({
            key: "expiry",
            label: "Enter expiry date",
            kind: "date",
            expected: sampleExpiry(),
          });
        steps.push({
          key: "finish",
          label: "Complete receipt",
          kind: "confirm",
        });
      } else if (op === "putaway")
        steps = [
          {
            key: "pallet",
            label: "Scan pallet",
            expected: "PLT-000184",
            kind: "scan",
          },
          {
            key: "destination",
            label: "Scan suggested location",
            expected: "A-01-02",
            kind: "scan",
          },
          { key: "finish", label: "Confirm putaway", kind: "confirm" },
        ];
      else {
        const lines = [
            {
              source: "A-01-02",
              sku: productCode(),
              quantity: 12,
            },
            { source: "B-03-01", sku: "WATER-500", quantity: 6 },
          ],
          line = lines[state.line];
        steps = [
          {
            key: "source",
            label: "Scan source location",
            expected: line.source,
            kind: "scan",
          },
          {
            key: "product",
            label: "Scan product",
            expected: line.sku,
            kind: "scan",
          },
          {
            key: "quantity",
            label: "Confirm pick quantity",
            expected: String(line.quantity),
            kind: "number",
          },
          { key: "finish", label: "Confirm pick line", kind: "confirm" },
        ];
      }
      return {
        ...steps[state.step],
        index: state.step,
        total: steps.length,
        operation: op,
        line: state.line,
      };
    }
    function fail(message, process, corrective) {
      state.error = message;
      state.feedback = {
        kind: "error",
        label: "Scan blocked",
        value: message,
        sequence: ++state.feedbackSequence,
      };
      state.testedErrors[process] = true;
      event("Scan blocked", message, "error");
      if (corrective) {
        state.correction = reviewChanges[process];
        say(state.correction.why);
        event(
          "Configuration correction proposed",
          state.correction.label,
          "waiting",
        );
      }
      return false;
    }
    function sampleExpiry() {
      return "2027-12-31";
    }
    function submit(value) {
      const v = screen();
      if (!v || state.correction) return false;
      const op = state.stage;
      state.error = "";
      const raw = String(value ?? "").trim();
      const errorKey = op === "putaway" ? "destination" : "product";
      if (v.key === errorKey && !state.faults[op] && raw === v.expected)
        return fail(
          "First run the controlled error test, then apply the correction and retry.",
          op,
          false,
        );
      if (v.kind === "scan" || v.kind === "unit") {
        const expected =
          v.kind === "unit"
            ? productCode()
            : v.expected;
        if (raw !== expected)
          return fail(
            v.key === "destination"
              ? "Wrong location. Expected A-01-02."
              : v.key === "source"
                ? "Wrong source location. Expected " + v.expected + "."
                : v.key === "pallet"
                  ? "Wrong pallet. Expected PLT-000184."
                  : op === "receiving"
                    ? "Unknown product barcode. Please retry."
                    : "Wrong product. Expected " + expected + ".",
            op,
            v.key === errorKey && !state.faults[op],
          );
        if (v.kind === "unit") {
          state.unitsScanned++;
          state.feedback = {
            kind: "accepted",
            label: "Scan accepted",
            value: raw + " · " + state.unitsScanned + "/48",
            sequence: ++state.feedbackSequence,
          };
          event("Unit accepted", state.unitsScanned + " / 48");
          if (state.unitsScanned < 48) return true;
          state.receiptQuantity = 48;
        }
      }
      if (v.kind === "number") {
        if (!/^\d+$/.test(raw) || Number(raw) !== Number(v.expected))
          return fail(
            "Quantity mismatch. Expected " + v.expected + " EA.",
            op,
            false,
          );
        if (op === "receiving") state.receiptQuantity = Number(raw);
      }
      if (v.kind === "lot_attribute") {
        if (!raw && v.required)
          return fail("Attribute value is required.", op, false);
        if (raw) state.capturedAttributes[v.attribute_code] = raw;
      }
      if (v.kind === "date") {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(raw) ||
          !Number.isFinite(Date.parse(raw + "T00:00:00Z")) ||
          new Date(raw + "T00:00:00Z").toISOString().slice(0, 10) !== raw ||
          Date.parse(raw + "T00:00:00Z") <= Date.now()
        )
          return fail("Enter a valid future expiry date.", op, false);
        state.expiry = raw;
        say(
          "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.",
        );
      }
      if (v.kind === "confirm") {
        if (!state.testedErrors[op])
          return fail(
            "Run the highlighted error test before finishing this demo process.",
            op,
            false,
          );
        state.feedback = {
          kind: "accepted",
          label: "Confirmed",
          value: v.label,
          sequence: ++state.feedbackSequence,
        };
        if (op === "picking" && state.line === 0) {
          state.stock.picked += 12;
          state.line = 1;
          state.step = 0;
          say(
            "First line verified. Continue to B-03-01 for 6 EA of WATER-500.",
          );
          event("First order line completed", "12 EA picked");
          return true;
        }
        if (op === "receiving") state.stock.dock = 48;
        if (op === "putaway") {
          state.stock.dock = 0;
          state.stock.stored = 48;
        }
        if (op === "picking") {
          state.stock.picked += 6;
          state.stock.stored -= 12;
        }
        state.passed.push(op);
        state.stage = op + "_review";
        state.error = "";
        event(
          titles[op] + " sample passed",
          op === "picking"
            ? "2 lines · 18 EA · sent to Packing"
            : op === "putaway"
              ? "48 EA stored at A-01-02"
              : "48 EA received",
        );
        say(
          op === "receiving"
            ? "Receipt complete. The unknown barcode test now has a clear block-and-retry rule."
            : op === "putaway"
              ? "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution."
              : "Picking complete. Both lines were checked and the sample order is now waiting for Packing.",
        );
        return true;
      }
      state.accepted.push({
        operation: op,
        key: v.key,
        value: raw,
        line: state.line,
      });
      state.feedback = {
        kind: "accepted",
        label: "Scan accepted",
        value: raw || v.label,
        sequence: ++state.feedbackSequence,
      };
      event("Operator action accepted", v.label + (raw ? " · " + raw : ""));
      state.step++;
      return true;
    }
    function injectError() {
      const v = screen();
      if (
        !v ||
        !["product", "destination"].includes(v.key) ||
        state.faults[state.stage]
      )
        return false;
      return submit(v.key === "destination" ? "A-02-04" : "UNKNOWN-999");
    }
    function applyCorrection() {
      if (!state.correction) return false;
      const op = state.stage,
        change = state.correction;
      state.changes.push({ ...change, process: op });
      if (op === "receiving") state.config.unknownBarcode = change.after;
      if (op === "putaway") state.config.targetScan = change.after;
      if (op === "picking") state.config.productCheck = change.after;
      state.faults[op] = true;
      state.feedback = {
        kind: "updated",
        label: "Configuration updated",
        value: "Retry the expected barcode",
        sequence: ++state.feedbackSequence,
      };
      state.correction = null;
      state.error = "";
      event(
        "Correction applied",
        change.label + ": " + change.before + " → " + change.after,
      );
      say(
        "Correction applied to this demo configuration. Retry the scan with the expected barcode.",
      );
      return true;
    }
    function next() {
      if (state.stage === "receiving_review") return start("putaway");
      if (state.stage === "putaway_review") return start("picking");
      if (state.stage === "picking_review") {
        state.stage = "customize";
        say(
          "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.",
        );
        return true;
      }
      if (state.stage === "customize") {
        state.stage = "permissions";
        event("Handheld layout customized");
        say(
          "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.",
        );
        return true;
      }
      if (state.stage === "permissions") {
        state.stage = "result";
        event(
          "Operator permissions checked",
          "Only three assigned processes visible",
        );
        say(
          "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.",
        );
        return true;
      }
      return false;
    }
    function preference(key, value) {
      if (state.stage !== "customize" || !Object.hasOwn(state.preferences, key))
        return false;
      if (key === "language") {
        if (
          !["en", "ro", "bg", "el", "sr", "sq", "pl", "cs", "ru"].includes(
            value,
          )
        )
          return false;
      } else if (typeof value !== "boolean") return false;
      state.preferences[key] = value;
      event("Handheld preference changed", key + ": " + value);
      return true;
    }
    function approve() {
      if (state.stage !== "result" || state.passed.length !== 3) return false;
      state.approved = true;
      state.stage = "approved";
      event("Demo result acknowledged", "No activation or production write");
      say(
        "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.",
      );
      return true;
    }
    function replay() {
      const facts = { ...state.facts };
      const profile = {
        ...state.profile,
        lot_policy: {
          ...state.profile.lot_policy,
          attributes: state.profile.lot_policy.attributes.map((attribute) => ({
            ...attribute,
          })),
        },
      };
      Object.assign(state, create().state);
      state.facts = facts;
      state.profile = profile;
      state.messages = [];
      say(
        "Replaying the same confirmed sample warehouse. No new answers are needed.",
      );
      beginConfiguration();
    }
    return {
      state,
      question,
      setFacts,
      setProfile,
      answer,
      useSample,
      beginConfiguration,
      configureNext,
      screen,
      submit,
      injectError,
      applyCorrection,
      next,
      preference,
      approve,
      replay,
      say,
      event,
    };
  }
  return { create, questions, defaults, stages, progress, reviewChanges };
});
