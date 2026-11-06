// Conversational presentation around the existing validated RF metadata contract.
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const {
  parseRequest,
  validateResult,
  infer,
  InputError,
  schema,
  MAX_BODY_BYTES,
} = require("./engine-ai");
const instructions =
  readFileSync(join(__dirname, "../api/_photon-system.md"), "utf8") +
  "\n" +
  readFileSync(join(__dirname, "../api/_chat-system.md"), "utf8");
const responseSchema = {
  ...schema,
  required: [...schema.required, "assistant_message", "quick_replies", "ready"],
  properties: {
    ...schema.properties,
    assistant_message: {
      type: "string",
      description:
        "Friendly plain-text message, at most 1200 characters, in the language the user writes. One necessary question at a time. No Markdown or HTML.",
    },
    quick_replies: {
      type: "array",
      description:
        "At most 4 optional short suggested answers to the current question. Not instructions or actions.",
      items: { type: "string" },
    },
    ready: {
      type: "boolean",
      description:
        "True only after the user selected an operation and confirmed product, handling UOM, conversion and quantity. Unknown layout may use explicitly labelled sample values.",
    },
  },
};
function parseChat(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    if (Buffer.byteLength(body) > MAX_BODY_BYTES)
      throw new InputError(413, "Use a smaller plan.");
    try {
      body = JSON.parse(body);
    } catch {
      throw new InputError(400, "Check the request.");
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new InputError(400, "Check the request.");
  const turns = body.conversation ?? [];
  if (
    !Array.isArray(turns) ||
    turns.length > 16 ||
    turns.some(
      (t) =>
        !t ||
        !["user", "assistant"].includes(t.role) ||
        typeof t.text !== "string" ||
        t.text.length > 3000,
    ) ||
    turns.reduce((n, t) => n + t.text.length, 0) > 18000
  )
    throw new InputError(
      400,
      "The conversation is too long. Start a new example.",
    );
  if (body.greeting != null && typeof body.greeting !== "boolean")
    throw new InputError(400, "Check the request.");
  if (body.greeting && (body.file || turns.length))
    throw new InputError(
      400,
      "A greeting cannot include a file or conversation.",
    );
  const input = parseRequest({
    headers: req.headers,
    body: {
      ...body,
      mode: "layout",
      text: body.greeting
        ? "Greet the visitor and ask the first setup question."
        : body.text,
    },
  });
  return {
    ...input,
    conversation: turns.map((t) => ({ role: t.role, text: t.text })),
    greeting: !!body.greeting,
  };
}
function validateChat(raw, input) {
  if (!raw || typeof raw !== "object") throw new Error("invalid_model_output");
  const { assistant_message, quick_replies, ready, ...metadata } = raw;
  if (
    typeof assistant_message !== "string" ||
    !assistant_message.trim() ||
    assistant_message.length > 1200 ||
    !Array.isArray(quick_replies) ||
    quick_replies.length > 4 ||
    quick_replies.some(
      (s) => typeof s !== "string" || !s.trim() || s.length > 180,
    ) ||
    typeof ready !== "boolean"
  )
    throw new Error("invalid_model_output");
  const result = validateResult(metadata, input),
    p = result.task.product;
  const complete =
    !!result.task.operation &&
    !!p.name &&
    !!p.pack_label &&
    p.pack_quantity !== null &&
    p.pack_units !== null;
  return {
    ...result,
    assistant_message: assistant_message.trim(),
    quick_replies: quick_replies.slice(),
    ready: !input.greeting && ready && complete && !result.uncertainties.length,
  };
}
function inferChat(input, options) {
  return infer(input, {
    ...options,
    responseSchema,
    instructions,
    validateOutput: validateChat,
  });
}
module.exports = { parseChat, inferChat, validateChat };
