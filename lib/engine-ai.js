const { readFileSync } = require('node:fs');
const { join } = require('node:path');
// Model output describes a preview process; it cannot run code or call a WMS.
const Flow = require('../assets/engine-demo/engine-flow');
const MAX_FILE_BYTES = 3 * 1024 * 1024,
  MAX_BODY_BYTES = 4_250_000;
const TYPES = ['E-commerce', 'Distribution', '3PL', 'Manufacturing'];
const LIMITS = { aisles: [1, 12], bays: [1, 20], levels: [1, 8] };
const DEMO_LAYOUT = { aisles: 3, bays: 4, levels: 4 };
const REGION_COMMANDS = {
  'GLOBAL-EMEA': { fallback: 'CONFIRM' },
  'RO-BUCHAREST-WEST': {
    receiving: 'CONFIRMĂ PRIMIREA',
    putaway: 'PLASARE LPN',
    receiving_and_putaway: 'PLASARE LPN',
    picking: 'CONFIRMĂ CULESUL',
    fallback: 'CONFIRMĂ',
  },
  'BG-PLOVDIV-TRAKIA': {
    receiving: 'ПОТВЪРДИ ПРИЕМАНЕ',
    putaway: 'ПОТВЪРДИ МЕСТЕНЕ',
    receiving_and_putaway: 'ПОТВЪРДИ МЕСТЕНЕ',
    fallback: 'ПОТВЪРДИ ЗАПИС',
  },
};
const REGIONS = Object.keys(REGION_COMMANDS);
const CATEGORIES = ['HEAVY/OVERSIZE', 'FAST MOVERS', 'HAZMAT', 'RETURNS', 'COLD', 'GENERAL'];
const nullableInteger = (description) => ({ type: ['integer', 'null'], description });
const nullableText = (description) => ({ type: ['string', 'null'], description });
const taskSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'operation',
    'title',
    'document',
    'lpn',
    'destination_aisle',
    'product',
    'steps',
    'localized_commands',
  ],
  properties: {
    localized_commands: {
      type: 'object',
      additionalProperties: false,
      required: ['primary_btn'],
      properties: {
        primary_btn: {
          type: 'string',
          enum: [...new Set(Object.values(REGION_COMMANDS).flatMap(Object.values))],
        },
      },
    },
    operation: {
      anyOf: [{ type: 'string', enum: Flow.operations }, { type: 'null' }],
      description: 'Requested RF operation, or null when no task has been requested.',
    },
    title: nullableText(
      'Short English task title, at most 90 characters. Null if no task requested.',
    ),
    document: nullableText(
      'Receipt or ASN identifier explicitly supplied by the user, at most 40 characters; otherwise null.',
    ),
    lpn: nullableText('Explicit LPN/container identifier, at most 40 characters; otherwise null.'),
    destination_aisle: nullableText(
      'Requested aisle letter A to L. Ordinal second aisle means B; third means C. Null if not specified.',
    ),
    product: {
      type: 'object',
      additionalProperties: false,
      required: [
        'name',
        'sku',
        'pack_label',
        'pack_units',
        'pack_quantity',
        'serialized',
        'lot_controlled',
      ],
      properties: {
        name: nullableText(
          'Requested product name in plain English, at most 80 characters; null if unknown. Do not invent a real SKU.',
        ),
        sku: nullableText(
          'Product code or barcode supplied by the user, at most 40 characters; otherwise null.',
        ),
        pack_label: nullableText(
          'Selected packaging/UOM label, e.g. Each, Case, Pallet; at most 40 characters. Null if unknown.',
        ),
        pack_units: nullableInteger(
          'Base units per selected package, integer 1 to 1000; null if unknown. Two cases of six units means 6.',
        ),
        pack_quantity: nullableInteger(
          'Number of selected packages, integer 1 to 1000; null if unknown. Two cases of six means 2.',
        ),
        serialized: {
          type: 'boolean',
          description:
            'True when the user requests serial-controlled goods. One serial per base unit, never per pallet or case.',
        },
        lot_controlled: {
          type: 'boolean',
          description: 'True only when lot/batch capture is requested.',
        },
      },
    },
    steps: {
      type: 'array',
      items: { type: 'string', enum: Object.keys(Flow.catalogue) },
      description:
        'Ordered RF step codes, no duplicates, at most 18. Empty when operation is null.',
    },
  },
};
const schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'type',
    'aisles',
    'bays',
    'levels',
    'summary',
    'uncertainties',
    'rules',
    'task',
    'detected_region',
    'rule_only',
    'defaulted_layout',
  ],
  properties: {
    type: { anyOf: [{ type: 'string', enum: TYPES }, { type: 'null' }] },
    aisles: {
      type: 'integer',
      description: 'Aisle count 1 to 12; use 3 when unverified or out of range.',
    },
    bays: {
      type: 'integer',
      description: 'Bays per rack face 1 to 20; use 4 when unverified or out of range.',
    },
    levels: {
      type: 'integer',
      description: 'Vertical levels 1 to 8; use 4 when unverified or out of range.',
    },
    defaulted_layout: {
      type: 'array',
      items: { type: 'string', enum: Object.keys(DEMO_LAYOUT) },
      description: 'List only the dimensions that used demo defaults.',
    },
    detected_region: { type: 'string', enum: REGIONS },
    rule_only: {
      type: 'boolean',
      description:
        'True when the request supplies rules without explicitly requesting a new or changed RF task.',
    },
    summary: {
      type: 'string',
      description:
        'Plain English summary, at most 400 characters. Separate observed facts from user-approved demo assumptions.',
    },
    uncertainties: {
      type: 'array',
      items: { type: 'string' },
      description:
        'At most 5 concise questions, each at most 180 characters. Ask only for missing facts that affect this preview. Users can answer inline in any language.',
    },
    rules: {
      type: 'array',
      description:
        'At most 4 requested storage-rule proposals. A task request belongs in task, not only in rules.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['level', 'category', 'text'],
        properties: {
          level: nullableInteger('Requested level, or null.'),
          category: { type: 'string', enum: CATEGORIES },
          text: { type: 'string', description: 'At most 180 characters.' },
        },
      },
    },
    task: taskSchema,
  },
};
// Load the server-only instructions once for each function instance.
const system = readFileSync(join(__dirname, '../api/_photon-system.md'), 'utf8').trim();
class InputError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
function text(value, max) {
  if (typeof value !== 'string' || value.length > max)
    throw new InputError(400, 'Check the description length.');
  return value.trim();
}
function parseRequest(req) {
  if ((req.headers['content-type'] || '').split(';')[0] !== 'application/json')
    throw new InputError(415, 'Use a JSON request.');
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES)
    throw new InputError(413, 'Use a file smaller than 3 MB.');
  let body = req.body;
  try {
    if (Buffer.isBuffer(body)) body = body.toString('utf8');
    if (typeof body === 'string') {
      if (Buffer.byteLength(body) > MAX_BODY_BYTES)
        throw new InputError(413, 'Use a file smaller than 3 MB.');
      body = JSON.parse(body);
    }
  } catch (e) {
    if (e instanceof InputError) throw e;
    throw new InputError(400, 'Check the request.');
  }
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    Buffer.byteLength(JSON.stringify(body)) > MAX_BODY_BYTES
  )
    throw new InputError(400, 'Check the request.');
  if (body.mode !== 'layout' && body.mode !== 'rule')
    throw new InputError(400, 'Choose layout analysis or a rule.');
  if (body.consent !== true)
    throw new InputError(400, 'Confirm that this input may be sent for AI analysis.');
  const description = text(body.text ?? '', body.mode === 'rule' ? 1000 : 12000);
  const out = { mode: body.mode, text: description };
  if (body.mode === 'rule' && !description)
    throw new InputError(400, 'Describe the request first.');
  if (body.mode === 'rule' || body.setup != null) {
    const p = body.setup;
    if (!p || !TYPES.includes(p.type)) throw new InputError(400, 'Check warehouse parameters.');
    out.setup = { type: p.type };
    for (const k of Object.keys(LIMITS)) {
      if (!Number.isInteger(p[k]) || p[k] < LIMITS[k][0] || p[k] > LIMITS[k][1])
        throw new InputError(400, 'Check warehouse parameters.');
      out.setup[k] = p[k];
    }
    if (p.task) {
      try {
        Flow.validateTask(p.task, out.setup);
      } catch {
        throw new InputError(400, 'Check the current RF process.');
      }
      out.setup.task = p.task;
    }
    if (p.previous_summary != null) out.setup.previous_summary = text(p.previous_summary, 400);
    if (p.confirmed != null) {
      if (
        !Array.isArray(p.confirmed) ||
        p.confirmed.length > 4 ||
        p.confirmed.some((k) => !['type', 'aisles', 'bays', 'levels'].includes(k))
      )
        throw new InputError(400, 'Check confirmed layout fields.');
      out.setup.confirmed = p.confirmed.slice();
    }
  }
  if (body.file != null) {
    if (body.mode !== 'layout') throw new InputError(400, 'Files belong to layout analysis.');
    const f = body.file;
    if (
      !f ||
      typeof f !== 'object' ||
      !['image/jpeg', 'image/png', 'application/pdf'].includes(f.type) ||
      typeof f.data !== 'string' ||
      f.data.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 ||
      !f.data ||
      f.data.length % 4 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(f.data)
    )
      throw new InputError(400, 'Choose a JPEG, PNG or PDF smaller than 3 MB.');
    const bytes = Buffer.from(f.data, 'base64');
    if (bytes.length > MAX_FILE_BYTES || bytes.toString('base64') !== f.data)
      throw new InputError(413, 'Use a file smaller than 3 MB.');
    const valid =
      f.type === 'image/jpeg'
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : f.type === 'image/png'
          ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : bytes.subarray(0, 5).toString() === '%PDF-';
    if (!valid) throw new InputError(400, 'File contents do not match its type.');
    out.file = { type: f.type, data: f.data };
  }
  if (!description && !out.file)
    throw new InputError(400, 'Add a description or a warehouse plan.');
  return out;
}
// Validate and normalize the provider response before it reaches the browser.
function bounded(value, max) {
  if (typeof value !== 'string' || value.length > max) throw new Error('invalid_model_output');
  return value.trim();
}
function validateResult(modelOutput, input) {
  if (
    !modelOutput ||
    typeof modelOutput !== 'object' ||
    Array.isArray(modelOutput) ||
    Object.keys(modelOutput).some((k) => !Object.hasOwn(schema.properties, k))
  )
    throw new Error('invalid_model_output');
  if (modelOutput.type !== null && !TYPES.includes(modelOutput.type))
    throw new Error('invalid_model_output');
  const region = modelOutput.detected_region ?? 'GLOBAL-EMEA';
  if (
    !REGIONS.includes(region) ||
    (modelOutput.rule_only != null && typeof modelOutput.rule_only !== 'boolean')
  )
    throw new Error('invalid_model_output');
  const ruleOnly = input.mode === 'rule' && modelOutput.rule_only !== false;
  const defaulted = modelOutput.defaulted_layout ?? [];
  if (!Array.isArray(defaulted) || defaulted.some((k) => !Object.hasOwn(DEMO_LAYOUT, k)))
    throw new Error('invalid_model_output');
  const result = {
    type: modelOutput.type,
    detected_region: region,
    rule_only: ruleOnly,
    defaulted_layout: [],
  };
  for (const [key, fallback] of Object.entries(DEMO_LAYOUT)) {
    const value = modelOutput[key];
    if (value != null && (!Number.isInteger(value) || value < 1))
      throw new Error('invalid_model_output');
    const useDefault = defaulted.includes(key) || value == null || value > LIMITS[key][1];
    result[key] = useDefault ? fallback : value;
    if (useDefault) result.defaulted_layout.push(key);
  }
  // Rule-only replies keep the prior task. New tasks can use a smaller demo quantity.
  let task = ruleOnly ? (input.setup.task ?? Flow.emptyTask()) : modelOutput.task;
  let product = task?.product;
  const packageCount = product?.pack_quantity ?? (product?.serialized ? 3 : 24);
  const unitsPerPackage = product?.pack_units ?? 1;
  const scaled =
    !ruleOnly &&
    Number.isSafeInteger(packageCount) &&
    Number.isSafeInteger(unitsPerPackage) &&
    packageCount > 0 &&
    unitsPerPackage > 0 &&
    (packageCount > 1000 ||
      unitsPerPackage > 1000 ||
      packageCount * unitsPerPackage > (product?.serialized ? 100 : 10000));
  if (scaled) {
    product = { ...product, pack_label: 'Each', pack_units: 1, pack_quantity: 24 };
    task = { ...task, product: product };
  }
  if (
    input.mode !== 'rule' &&
    result.defaulted_layout.includes('aisles') &&
    /^[D-L]$/.test(task?.destination_aisle ?? '')
  ) {
    task = { ...task, destination_aisle: null };
  }
  Flow.validateTask(task, input.mode === 'rule' ? input.setup : result);
  result.task = {
    operation: task.operation,
    title: task.title,
    document: task.document,
    lpn: task.lpn,
    destination_aisle: task.destination_aisle,
    product: {
      name: product.name,
      sku: product.sku,
      pack_label: product.pack_label,
      pack_units: product.pack_units,
      pack_quantity: product.pack_quantity,
      serialized: product.serialized,
      lot_controlled: product.lot_controlled,
    },
    steps: task.steps.slice(),
  };
  // Choose the label from the regional matrix instead of trusting arbitrary model text.
  const commands = REGION_COMMANDS[region];
  result.task.localized_commands = { primary_btn: commands[task.operation] ?? commands.fallback };
  if (ruleOnly && input.setup.task) {
    const currentCommand = input.setup.task.localized_commands?.primary_btn;
    const knownCommand =
      taskSchema.properties.localized_commands.properties.primary_btn.enum.includes(currentCommand);
    if (knownCommand) result.task.localized_commands = { primary_btn: currentCommand };
    else delete result.task.localized_commands;
  }
  result.summary = bounded(modelOutput.summary, 400);
  if (scaled)
    result.summary = 'Demo quantity: 24 individual units. ' + result.summary.slice(0, 363);
  if (
    !Array.isArray(modelOutput.uncertainties) ||
    modelOutput.uncertainties.length > 5 ||
    !Array.isArray(modelOutput.rules) ||
    modelOutput.rules.length > 4
  )
    throw new Error('invalid_model_output');
  result.uncertainties = modelOutput.uncertainties.map((v) => bounded(v, 180));
  result.rules = modelOutput.rules.map((v) => {
    if (
      !v ||
      !CATEGORIES.includes(v.category) ||
      (v.level !== null &&
        (!Number.isInteger(v.level) ||
          v.level < 1 ||
          v.level > (input.mode === 'rule' ? input.setup.levels : result.levels)))
    )
      throw new Error('invalid_model_output');
    return { level: v.level, category: v.category, text: bounded(v.text, 180) };
  });
  return result;
}
// Build the model request and enforce the token budget.
function payload(input, model) {
  const content = [];
  if (input.file)
    content.push({
      type: input.file.type === 'application/pdf' ? 'document' : 'image',
      source: { type: 'base64', media_type: input.file.type, data: input.file.data },
    });
  content.push({
    type: 'text',
    text: JSON.stringify({
      task:
        input.mode === 'rule'
          ? 'Update the preview process or a requested rule'
          : 'Analyse the warehouse and generate the requested RF process',
      description: input.text,
      ...(input.setup ? { current_preview: input.setup } : {}),
    }),
  });
  return { model, system, messages: [{ role: 'user', content }] };
}
async function infer(input, { key, model, fetchImpl = fetch }) {
  const base = payload(input, model),
    signal = AbortSignal.timeout(40000);
  const call = async (suffix, data) => {
    const response = await fetchImpl('https://api.anthropic.com/v1/messages' + suffix, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(data),
      signal,
    });
    if (!response.ok) {
      const message =
        response.status === 429
          ? 'AI analysis is busy. Please retry shortly.'
          : response.status === 404
            ? 'AI analysis is temporarily unavailable. Use manual parameters.'
            : [401, 403].includes(response.status)
              ? 'The AI service connection needs attention. Please use manual parameters.'
              : response.status === 400
                ? 'The AI service could not analyse this input. Try a simpler description or a smaller plan.'
                : 'AI analysis could not process this input. Try again later or use manual parameters.';
      let category = 'provider_' + response.status;
      if (response.status === 400 && typeof response.text === 'function') {
        try {
          const raw = await response.text();
          if (raw.length < 20000) {
            const detail = JSON.parse(raw)?.error?.message || '';
            category = /credit|balance|billing/i.test(detail)
              ? 'api_credits'
              : /version/i.test(detail)
                ? 'api_version'
                : /model/i.test(detail)
                  ? 'model_configuration'
                  : /schema|output_config|output_format/i.test(detail)
                    ? 'output_schema'
                    : 'input_format';
          }
        } catch {}
      }
      const error = new InputError(response.status === 429 ? 429 : 502, message);
      error.reason = category;
      throw error;
    }
    const raw = await response.text();
    if (raw.length > 40000) throw new Error('invalid_model_output');
    return JSON.parse(raw);
  };
  // Estimate input size first; large/multi-page documents do not proceed to generation.
  const count = await call('/count_tokens', base);
  if (!Number.isSafeInteger(count.input_tokens) || count.input_tokens < 1)
    throw new Error('invalid_token_count');
  if (count.input_tokens > 12000)
    throw new InputError(
      413,
      'This plan is too detailed for the preview. Send one smaller section or describe the layout.',
    );
  const reply = await call('', {
    ...base,
    max_tokens: 2400,
    output_config: { format: { type: 'json_schema', schema } },
  });
  if (
    reply.stop_reason !== 'end_turn' ||
    !Array.isArray(reply.content) ||
    reply.content.some((b) => b.type === 'refusal')
  )
    throw new Error('incomplete_model_output');
  const raw = reply.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  return validateResult(JSON.parse(raw), input);
}
module.exports = {
  parseRequest,
  validateResult,
  infer,
  InputError,
  MAX_BODY_BYTES,
  MAX_FILE_BYTES,
};
