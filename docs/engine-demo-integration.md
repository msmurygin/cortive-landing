# Home engine demo and Claude analysis

The homepage embeds the supplied designer widget after the existing hero and before the four-question navigation. Existing hero copy, CTA, inventory illustration, SEO metadata, verification tags and contact form are preserved.

## Runtime

- WebRF, terminal UI, receiving, mismatch and putaway are one browser-local simulation.
- Layout descriptions, JPEG/PNG plans and PDFs can be submitted explicitly to Claude via `POST /api/engine-analyze`.
- Selecting a file alone does not transmit it. The analysis button explains that the selected input goes to Anthropic.
- The same server endpoint interprets requests for preview rules. No model output is executed as code or sent to a WMS API.
- Claude returns structured JSON. Server validation bounds each count and all text. Unknown dimensions remain null; the UI asks for confirmation instead of calling defaults detected values.
- The SaaS continuation form is still a UI preview. It does not submit contacts or create accounts. The owner-requested Prototype sentence beneath the form was removed.

## Server environment

Set `ANTHROPIC_API_KEY` in the Vercel project **Preview** environment. A Production-only variable is not available in Preview deployments. Never put this variable in browser JavaScript or commit a local environment file.

Optional: `ANTHROPIC_MODEL`, default `claude-haiku-5-5`. The model identifier can be changed without modifying the widget.

Production analysis is disabled unless `ENGINE_AI_PUBLIC_ENABLED=true` is separately enabled with owner approval. A model connection is not an approval to merge or release this branch.

## Bounds and errors

- One JPEG/PNG/PDF per analysis, at most 3 MiB. Base64 and request metadata fit below the Vercel Functions 4.5 MB body limit.
- Up to 5,000 description characters or 1,000 rule characters.
- Token-count preflight; requests estimated over 12,000 input tokens do not proceed to generation. Output capped at 1,600 tokens.
- 40-second provider timeout, 45-second browser timeout, 60-second function duration. No automatic paid retries.
- Best-effort throttle: six analyses per five minutes per IP hash and two concurrent requests per warm instance. This is **not** a durable, cross-instance abuse or spending limit.
- Production release requires edge-level limits/provider budget settings and review of the new data-processing notice before enabling the public endpoint. Preview stays behind existing Vercel authentication.
- No request bodies, images, emails, model responses or keys are logged by this implementation. Anthropic's own data handling applies to submitted input; do not promise zero retention.
- Invalid output, refusals, provider errors and unconfigured credentials display a retry/manual path. They never trigger fake successful analysis.

## Validation

Run `node --test tests/*.test.cjs`.

Automated checks include provider request contract, input consent, signatures and limits, nullable fields, refusal/truncation handling, origin checks, missing credentials, production gate, throttling, client cancellation, synchronized workflow and stock conservation, plus the existing site regression suite.

A successful mocked request is a contract test, not proof of a live Claude response. Before release, verify with the configured Preview key: description, image, PDF, rule, user edits, invalid scan, completion, cancellation and mobile layout. Use a synthetic plan, not customer data.

## Sources checked 2026-11-03

- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://platform.claude.com/docs/en/build-with-claude/vision
- https://platform.claude.com/docs/en/build-with-claude/pdf-support
- https://platform.claude.com/docs/en/build-with-claude/token-counting
- https://platform.claude.com/docs/en/models/overview
- https://vercel.com/docs/functions/limitations
