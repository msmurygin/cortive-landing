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
const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "assistant_message",
    "answers",
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
    Object.keys(raw.answers).length !== questions.length
  )
    throw Error("invalid_model_output");
  for (const q of questions)
    if (
      raw.answers[q.key] !== null &&
      !q.choices.some(([v]) => v === raw.answers[q.key])
    )
      throw Error("invalid_model_output");
  return {
    assistant_message: raw.assistant_message
      .trim()
      .replace(/(?<![\p{L}\p{N}_-])(Scan|Confirm|Retry)(?![\p{L}\p{N}_-])/gu, (word) =>
        Copy.tr(
          word === "Retry" ? "Apply correction & retry" : word,
          input.preferred_language || "en",
        ),
      ),
    answers: raw.answers,
    message_language: raw.message_language,
    language_confidence: raw.language_confidence,
  };
}
function inferOnboarding(input, options) {
  return infer(input, {
    ...options,
    responseSchema: schema,
    instructions: readFileSync(
      join(__dirname, "../api/_onboarding-system.md"),
      "utf8",
    ),
    validateOutput: validate,
  });
}
module.exports = { parseOnboarding, inferOnboarding, validate };
