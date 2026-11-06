// Bounded conversational adapter. The model cannot advance the simulation or execute actions.
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { parseRequest, infer, InputError } = require("./engine-ai");
const {
  questions,
  stages,
} = require("../assets/workflow-demo/onboarding-machine");
const { supported } = require("../assets/workflow-demo/onboarding-language");
const properties = Object.fromEntries(
  questions.map((q) => [
    q.key,
    {
      anyOf: [
        { type: "string", enum: q.choices.map(([v]) => v) },
        { type: "null" },
      ],
    },
  ]),
);
const Copy = require("../assets/workflow-demo/onboarding-locales");
const lotAttributeProperties = {
  code: { type: "string" },
  label: { type: "string" },
  show: { type: "boolean" },
  required: { type: "boolean" },
  show_on_pick: { type: "boolean" },
  physical_verification: {
    type: "string",
    enum: ["NotVerifiable", "Visual", "Barcode", "VisualOrBarcode"],
  },
  override_allowed: { type: "boolean" },
};
const profileProperties = {
  product_name: { anyOf: [{ type: "string" }, { type: "null" }] },
  lot_policy: {
    type: "object",
    additionalProperties: false,
    required: ["enabled", "code", "lot_creation", "attributes"],
    properties: {
      enabled: { anyOf: [{ type: "boolean" }, { type: "null" }] },
      code: { anyOf: [{ type: "string" }, { type: "null" }] },
      lot_creation: {
        anyOf: [
          {
            type: "string",
            enum: ["Existing", "PerReceipt", "PerReceiveEvent"],
          },
          { type: "null" },
        ],
      },
      attributes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: Object.keys(lotAttributeProperties),
          properties: lotAttributeProperties,
        },
      },
    },
  },
  capture_lpn: { anyOf: [{ type: "boolean" }, { type: "null" }] },
  receive_whole_pallets: {
    anyOf: [{ type: "boolean" }, { type: "null" }],
  },
  receiving_location: { anyOf: [{ type: "string" }, { type: "null" }] },
  receiving_location_scan: {
    anyOf: [
      { type: "string", enum: ["required", "optional", "not_required"] },
      { type: "null" },
    ],
  },
};
const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "assistant_message",
    "answers",
    "profile",
    "message_language",
    "language_confidence",
  ],
  properties: {
    assistant_message: { type: "string" },
    message_language: { type: "string", enum: [...supported, "unknown"] },
    language_confidence: { type: "string", enum: ["high", "low"] },
    answers: {
      type: "object",
      additionalProperties: false,
      required: questions.map((q) => q.key),
      properties,
    },
    profile: {
      type: "object",
      additionalProperties: false,
      required: Object.keys(profileProperties),
      properties: profileProperties,
    },
  },
};
function parseOnboarding(req) {
  let b = req.body;
  if (Buffer.isBuffer(b)) b = b.toString("utf8");
  if (typeof b === "string") {
    if (Buffer.byteLength(b) > 4250000)
      throw new InputError(413, "Use a smaller message.");
    try {
      b = JSON.parse(b);
    } catch {
      throw new InputError(400, "Check the request.");
    }
  }
  if (!b || b.experience !== "onboarding")
    throw new InputError(400, "Check the experience.");
  if (!stages.includes(b.stage))
    throw new InputError(400, "Check the demo stage.");
  const facts = {};
  for (const q of questions) {
    if (b.facts?.[q.key] != null) {
      if (!q.choices.some(([v]) => v === b.facts[q.key]))
        throw new InputError(400, "Check warehouse facts.");
      facts[q.key] = b.facts[q.key];
    }
  }
  const profile = {
    lot_policy: {
      enabled: null,
      code: null,
      lot_creation: null,
      attributes: [],
    },
  };
  for (const key of Object.keys(profileProperties).filter(
    (key) => key !== "lot_policy",
  )) {
    const value = b.profile?.[key];
    if (value == null) continue;
    if (["string", "boolean"].includes(typeof value)) {
      profile[key] = typeof value === "string" ? value.slice(0, 160) : value;
    } else throw new InputError(400, "Check process profile.");
  }
  const lotPolicy = b.profile?.lot_policy;
  if (lotPolicy && typeof lotPolicy === "object" && !Array.isArray(lotPolicy)) {
    profile.lot_policy.enabled = [true, false].includes(lotPolicy.enabled)
      ? lotPolicy.enabled
      : null;
    profile.lot_policy.code =
      typeof lotPolicy.code === "string" ? lotPolicy.code.slice(0, 20) : null;
    profile.lot_policy.lot_creation = [
      "Existing",
      "PerReceipt",
      "PerReceiveEvent",
    ].includes(lotPolicy.lot_creation)
      ? lotPolicy.lot_creation
      : null;
    if (!Array.isArray(lotPolicy.attributes))
      throw new InputError(400, "Check process profile.");
    profile.lot_policy.attributes = lotPolicy.attributes.slice(0, 8).map((a) => ({
      code: String(a.code || "").slice(0, 20),
      label: String(a.label || "").slice(0, 40),
      show: !!a.show,
      required: !!a.required,
      show_on_pick: !!a.show_on_pick,
      physical_verification: [
        "NotVerifiable",
        "Visual",
        "Barcode",
        "VisualOrBarcode",
      ].includes(a.physical_verification)
        ? a.physical_verification
        : "NotVerifiable",
      override_allowed: !!a.override_allowed,
    }));
  }
  const input = parseRequest({
    headers: req.headers,
    body: {
      consent: b.consent,
      text: b.text,
      file: b.file,
      mode: "layout",
      preferred_language: b.preferred_language,
    },
  });
  return {
    ...input,
    text: JSON.stringify({
      visitor_message: input.text,
      demo_stage: b.stage,
      confirmed_facts: facts,
      confirmed_process_profile: profile,
    }),
  };
}
function validate(raw, input = {}) {
  if (
    !raw ||
    Object.keys(raw).some(
      (k) =>
        ![
          "assistant_message",
          "answers",
          "profile",
          "message_language",
          "language_confidence",
        ].includes(k),
    ) ||
    ![...supported, "unknown"].includes(raw.message_language) ||
    !["high", "low"].includes(raw.language_confidence) ||
    typeof raw.assistant_message !== "string" ||
    !raw.assistant_message.trim() ||
    raw.assistant_message.length > 1000 ||
    !raw.answers ||
    Array.isArray(raw.answers) ||
    Object.keys(raw.answers).length !== questions.length ||
    !raw.profile ||
    Array.isArray(raw.profile) ||
    Object.keys(raw.profile).length !== Object.keys(profileProperties).length
  )
    throw Error("invalid_model_output");
  for (const q of questions)
    if (
      raw.answers[q.key] !== null &&
      !q.choices.some(([v]) => v === raw.answers[q.key])
    )
      throw Error("invalid_model_output");
  const p = raw.profile;
  if (
    (p.product_name !== null &&
      (typeof p.product_name !== "string" || p.product_name.length > 160)) ||
    !p.lot_policy ||
    Array.isArray(p.lot_policy) ||
    ![null, true, false].includes(p.lot_policy.enabled) ||
    (p.lot_policy.code !== null &&
      (typeof p.lot_policy.code !== "string" || p.lot_policy.code.length > 20)) ||
    ![null, "Existing", "PerReceipt", "PerReceiveEvent"].includes(
      p.lot_policy.lot_creation,
    ) ||
    !Array.isArray(p.lot_policy.attributes) ||
    p.lot_policy.attributes.length > 8 ||
    p.lot_policy.attributes.some(
      (a) =>
        !a ||
        Object.keys(a).length !== Object.keys(lotAttributeProperties).length ||
        typeof a.code !== "string" ||
        !a.code.trim() ||
        a.code.length > 20 ||
        typeof a.label !== "string" ||
        a.label.length > 40 ||
        typeof a.show !== "boolean" ||
        typeof a.required !== "boolean" ||
        typeof a.show_on_pick !== "boolean" ||
        !["NotVerifiable", "Visual", "Barcode", "VisualOrBarcode"].includes(
          a.physical_verification,
        ) ||
        typeof a.override_allowed !== "boolean",
    ) ||
    ![null, true, false].includes(p.capture_lpn) ||
    ![null, true, false].includes(p.receive_whole_pallets) ||
    (p.receiving_location !== null &&
      (typeof p.receiving_location !== "string" ||
        p.receiving_location.length > 160)) ||
    ![null, "required", "optional", "not_required"].includes(
      p.receiving_location_scan,
    )
  )
    throw Error("invalid_model_output");
  const normalizedAnswers = { ...raw.answers };
  if (p.receive_whole_pallets === true && normalizedAnswers.containers === null)
    normalizedAnswers.containers = "pallet_case_each";
  return {
    assistant_message: raw.assistant_message
      .trim()
      .replace(/(?<![\p{L}\p{N}_-])(Scan|Confirm|Retry)(?![\p{L}\p{N}_-])/gu, (word) =>
        Copy.tr(
          word === "Retry" ? "Apply correction & retry" : word,
          input.preferred_language || "en",
        ),
      ),
    answers: normalizedAnswers,
    profile: {
      ...p,
      product_name: p.product_name?.trim() || null,
      lot_policy: {
        ...p.lot_policy,
        code: p.lot_policy.code?.trim() || null,
        attributes: p.lot_policy.attributes.map((a) => ({
          ...a,
          code: a.code.trim().toUpperCase(),
          label: a.label.trim() || a.code.trim().toUpperCase(),
        })),
      },
      receiving_location: p.receiving_location?.trim() || null,
    },
    message_language: raw.message_language,
    language_confidence: raw.language_confidence,
  };
}
function inferOnboarding(input, options) {
  const instructions = [
    readFileSync(join(__dirname, "../api/_onboarding-system.md"), "utf8"),
    readFileSync(join(__dirname, "../api/_onboarding-knowledge.md"), "utf8"),
  ].join("\n\n---\n\n");
  return infer(input, {
    ...options,
    responseSchema: schema,
    instructions,
    validateOutput: validate,
  });
}
module.exports = { parseOnboarding, inferOnboarding, validate };
