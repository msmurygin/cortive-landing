# Guided warehouse trial

`/try` is the direct entry point. Visitors choose receiving, putaway or picking, then describe their product or start a local sample. A plan is optional. Only the active step is available; AI clarification questions appear one at a time and answers stay available when navigating back. Refinement sends the collected answers in one explicit request.

The homepage contains a compact link instead of mounting the full runtime. “Try Quark” is available in desktop and mobile navigation. The default task view shows one WebRF screen. Terminal UI, layout, JSON and events are optional details that share the same runtime state. A completed task does not open a contact popup automatically; the visitor chooses whether to send their setup.

`engine-try.js` owns the guided presentation. `engine-demo.js` retains the validated process, AI and enquiry orchestration. The original two-panel renderer remains a fallback for existing integration tests. The new `/try` page is initially `noindex,follow` and is excluded from the sitemap while this release is reviewed. Existing landing-page SEO, data engines, enquiry fields and analytics are preserved. No dependencies are added.

## Shared process runtime

`engine-flow.js` validates a bounded process definition and runs its listed primitives. Both WebRF and terminal previews render the same definition and accepted state. Model responses cannot execute code or call a WMS API.

The definition separates operation, product/SKU, packaging, packages, base units per package, LPN and destination aisle. Eight representative process templates are supported: receiving, putaway, receiving with putaway, picking, counting, replenishment, packing and loading. This is a single-product/LPN demonstration, not a live warehouse workspace.

- Direct putaway starts with an existing sample LPN, never a receipt. Its contents and existing serials move together.
- Receiving two cases of six serial-controlled units requires twelve distinct serial scans. Enter accepts each scan; duplicate scans do not increase the count. The receipt cannot close early. Captured serials retain SKU, LPN, receipt, lot, expiry and location context where supplied.
- Accepted events update both renderers. Invalid scans preserve progress and show an error. An accepted scan clears the entry while retaining focus; a rejected entry is selected for replacement.
- Quantity, document and location data that the visitor did not supply use labelled sample values. The rack elevation and deterministic occupied/free cells are representative, not a reconstruction of arbitrary floor-plan geometry or real stock.
- Storage rules are proposals for review; they are not connected to live warehouse policies.

## AI and clarification

Explicit analysis sends the selected description or JPEG/PNG/PDF to a server endpoint using the configured AI provider. Selecting a file alone does not transmit it. Public UI uses Quark AI branding; credentials remain server-side.

Structured output includes layout facts, unknowns, questions and RF process JSON. Unknown vertical levels are not inferred from a floor plan. Questions have individual answer fields inside a scrollable region, plus an optional general reply. Refinement retains the original selected file, description, current process and prior summary. Manually edited fields remain under visitor control. Cancelled or superseded requests cannot overwrite newer input. Provider failures show a retry/manual path, never fabricated success.

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
