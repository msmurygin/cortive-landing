> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Authentic demonstrations & supporting evidence — PROPOSED / capture BLOCKED

This supersedes “make a better screenshot gallery”. Capture work follows a selected workflow; screenshots are ancillary evidence only. Existing captures were audited, but no WMS session was started or new product media fabricated.

## Capture contract

Owner: WMS/demo owner for build/data/accepted operation; website engineer for recording delivery and accessibility; founder for public claims/assets.

Before recording, attach: operation name and goal; exact build; existing accepted case/configuration; synthetic or approved non-sensitive dataset; visible start and expected end; known limitation; operator UI actually used; customer-facing wording. Reuse existing QA, no new full certification. If relevant fixes/retests remain, that scenario is blocked even if fixes are expected soon.

Use one coherent warehouse, owner, SKU/lot/location identity set per story. Avoid empty datasets, debug consoles, credentials, private names, production order data and irrelevant admin screens. No recorded credentials or tokens in assets/report metadata. Sample data must be recognisable as demonstration data.

## Minimal recording set

1. Prefer a single real stock investigation **after** matching stock/movement evidence is linked. Planned editorial duration roughly 30–60 seconds, not a claim about operation speed.
2. A second bounded accepted operation, e.g. Allocation top-up if its actual operator path is available. Planned 45–90 seconds; no implied warehouse performance benchmark.
3. Configuration before/after only when verified; can be a later replacement/addition, not a reason to build a simulator or re-certify the WMS.

Record the actual supported UI. No invented transitions, compositing that conceals failures, or simulator substituting for product. Start with clear goal, show action, end with readback. Caption any cuts. Record real RF only for an accepted RF scenario; public `/webrf` sample-data prototype is not proof of warehouse execution.

## Delivery

Use ordinary HTML video, controls, no autoplay, preload=none, poster only from that approved recording, responsive width and reserved aspect ratio. Supply captions/transcript, meaningful title, keyboard-accessible playback and textual outcome. Prefer a small MP4 delivery plus optional WebM after compatibility review; size-budget against real output, not a claimed fixed target. Load no third-party player/analytics by default. Full explanation remains crawlable without playing video. Respect reduced motion.

No frames/crops/gallery rebuild is required. Optional stills can annotate one step in the story; retain originals internally and redact before approval. Avoid forcing visitors to read an entire desktop screenshot on a phone.

## Configurability before/after oracle

Same operation + same dataset + identified supported setting. Capture baseline result; show versioned change and supported activation; repeat operation; compare expected result; state who owns validation and restoration. Verify restoration only if actually supported. Link to existing acceptance evidence. Without that, label concept pending and make no customer-facing configuration outcome claim.

ACTION FOR AGENT: select the exact existing supported configuration change, accepted build and traceable before/after evidence. Do not choose an invented field/entity/API. ACTION FOR AGENT: identify the genuine accepted UI for each initial recording. Do not record raw API tests as a warehouse UI without explicit labelling and approval.

## Approval package per recording

Asset/transcript hash, build/evidence reference, start/end assertion, privacy review result, approved caption, relevant capability link, mobile and keyboard playback check. Founder approves the actual recording and claim before publication.
