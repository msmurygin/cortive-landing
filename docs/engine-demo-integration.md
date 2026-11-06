# Conversational warehouse trial

The current `/try` experience is the guided three-process onboarding demonstration documented in [onboarding-simulation.md](onboarding-simulation.md). The earlier free-form single-task modules below remain available as implementation references and are not loaded on `/try`.

`/try` is a local-review workspace: setup chat, WebRF/Terminal preview and an activity panel.
The chat/activity layout comes from the approved workflow mockup. The handheld body, physical
keyboard, tile menu and indigo/teal screen treatment follow `WebRF Prototype.html` and its `app.jsx`.
A forklift-size view is available. On phones, Chat / RF / Activity are separate tabs; drafts and RF
progress survive switching. Device names and shapes are illustrative, not hardware certification.

The first greeting and later replies come from the real AI endpoint, `/api/engine-chat`. The
assistant collects warehouse context in conversation and returns a validated process proposal.
The visitor explicitly chooses **Try this task** to apply it. Later chat proposals do not mutate
an active RF task until explicitly started. The logs show requests, validated proposals and
accepted/rejected RF actions; they do not show model reasoning or simulated backend timings.

The homepage remains a compact entry link. `/try` stays `noindex,follow`, outside the sitemap.
This iteration is local-only pending owner review; do not push or deploy it automatically.
Existing contact and Assessment data engines, analytics and legal page bodies are unchanged.
No runtime dependencies are added.

## Modules and local launch

- `assets/workflow-demo/workspace.js`: DOM, chat controls, plan attachments and responsive panels.
- `assets/workflow-demo/session.js`: conversation lifecycle, cancellation guards and shared RF state.
- `assets/workflow-demo/rf-device.js`: two visual renderers over the existing `engine-flow.js` runtime.
- `assets/workflow-demo/enquiry.js`: explicit consented contact form and a strict payload whitelist.
- `lib/engine-chat.js`: bounded history, conversational output schema and shared process validation.
- `api/_chat-system.md`: conversation instructions, alongside the existing Photon process prompt.

Start with Node 24 or later:

```sh
node scripts/dev-workflow.cjs --credentials-file /absolute/private/quark-ai.env
```

The default address is `http://127.0.0.1:4173/try`. The private environment file contains
`ANTHROPIC_API_KEY` and optionally `ANTHROPIC_MODEL`; keep it outside Git and never put values in
browser code. The server is bound to loopback, serves only allowed assets, blocks dotfiles/source
folders and returns JSON for API errors. The default port also matches the existing enquiry
endpoint's development-origin allowlist. `/api/health` reports only whether a key is configured.

## Shared process runtime

`engine-flow.js` validates a bounded process definition and runs its listed primitives. Both WebRF and terminal previews render the same definition and accepted state. Model responses cannot execute code or call a WMS API.

The definition separates operation, product/SKU, packaging, packages, base units per package, LPN and destination aisle. Eight representative process templates are supported: receiving, putaway, receiving with putaway, picking, counting, replenishment, packing and loading. This is a single-product/LPN demonstration, not a live warehouse workspace.

- Direct putaway starts with an existing sample LPN, never a receipt. Its contents and existing serials move together.
- Receiving two cases of six serial-controlled units requires twelve distinct serial scans. Enter accepts each scan; duplicate scans do not increase the count. The receipt cannot close early. Captured serials retain SKU, LPN, receipt, lot, expiry and location context where supplied.
- Accepted events update both renderers. Invalid scans preserve progress and show an error. An accepted scan clears the entry while retaining focus; a rejected entry is selected for replacement.
- Quantity, document and location data that the visitor did not supply use labelled sample values. The rack elevation and deterministic occupied/free cells are representative, not a reconstruction of arbitrary floor-plan geometry or real stock.
- Storage rules are proposals for review; they are not connected to live warehouse policies.

## AI and clarification

The greeting sends no warehouse file. Each explicit visitor message sends bounded conversation
context plus the selected plan, if any. Choosing a file alone does not send it. JPEG/PNG/PDF files
are limited to 3 MiB and validated by signature. An active plan is shown in the composer; removing
it stops including its bytes in subsequent requests. Earlier conversation/extracted metadata stays
in this browser session. No browser persistence or new analytics is used.

The model must return plain text, suggested replies and the existing strict metadata contract.
The server validates process semantics before the result reaches either renderer. Unknown pallet
counts remain unknown, independently of the capacity per pallet. Serial capture stays one per base
unit. A ready card requires a selected operation, product, UOM, conversion and quantity. Layout
assumptions are labelled sample values. Cancel/reset guards reject late replies. Cancellation
stops waiting in the browser; an already started provider request may finish within its server
bound. There are no automatic paid retries. Provider failures retain conversation and offer retry
or an explicitly labelled local sample; that sample never pretends to be an AI analysis.

## Setup enquiries

After completion, a visitor can explicitly send their email, company and selected setup through `/api/engine-enquiry` to the existing Formspree form. Consent is required. The payload contains the warehouse dimensions, process, product, packaging and tracking flag. It excludes the uploaded plan, raw conversation, individual serials and Assessment answers. No SaaS account or workspace is created. Success is shown only after the endpoint acknowledges provider acceptance. Preview subjects are labelled `[Preview test]`.

## Server environment and limits

Set `ANTHROPIC_API_KEY` in Vercel Preview. Never export it into browser assets or Git. Optional `ANTHROPIC_MODEL` defaults to `claude-haiku-5-5`.

Production analysis and enquiries remain disabled unless `ENGINE_AI_PUBLIC_ENABLED=true` is separately enabled with owner approval. Branch work and successful Preview tests do not authorize a production merge or deployment.

- One JPEG/PNG/PDF up to 3 MiB, with type/signature/base64 validation. Request bound: 4,250,000 bytes, below Vercel's 4.5 MB function-body limit.
- Initial description: 5,000 UI characters. Clarification request including question context: 12,000 server characters. Rule request: 1,000 characters.
- Token-count preflight: at most 12,000 input tokens; output at most 4,000 tokens. No automatic paid retries. Truncated/refused output never reaches the RF runtime; Preview shows a fixed diagnostic category without logging model output. Failed initial analysis retains the description and offers editable manual sample values.
- Provider timeout 40 s, browser 45 s, analysis function 60 s. Enquiry provider 10 s, browser 15 s, function 20 s.
- Best-effort warm-instance throttles: Preview 20 AI calls / 5 min per IP hash; other environments 6. Two concurrent analyses per instance. Enquiries: 3 / 10 min. These are not durable cross-instance spending/abuse controls.
- Public release still needs an approved privacy/data-processing notice and durable provider/edge cost controls. Existing Vercel authentication stays enabled for Preview.
- No request bodies, uploads, email addresses, model responses or keys are logged here. Provider data handling still applies; no zero-retention claim is made.

## Verification

Run `node --test tests/*.test.cjs` using Node 22 or later. Tests cover input/output contracts, consent/origin gates, file bounds, nullable schemas, unsafe/inconsistent workflows, package conversion, duplicate/early-close handling, intact LPN movement, all supported templates, synchronized renderers, cancellation, retained-plan clarification, enquiry payloads and existing site regressions.

Keep dated live-browser evidence and private QA notes outside the repository. Mocked contracts do not prove live AI or email delivery; report provider acknowledgement separately from observed inbox delivery. Viewport emulation does not establish physical iOS Safari/Android Chrome compatibility.

## Official references checked 2026-11-03

- https://docs.quark.build/docs/reference/inbound/capturing-serial-numbers/
- https://docs.quark.build/docs/operator/receiving-against-asn/
- https://docs.quark.build/docs/operator/putaway/
- https://docs.quark.build/docs/admin/owners-sku-uom-pack-hierarchy/
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://platform.claude.com/docs/en/build-with-claude/vision
- https://platform.claude.com/docs/en/build-with-claude/pdf-support
- https://platform.claude.com/docs/en/build-with-claude/token-counting
- https://vercel.com/docs/functions/limitations
