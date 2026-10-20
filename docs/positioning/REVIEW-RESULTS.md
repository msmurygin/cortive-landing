# Positioning alignment: review candidate

Status: content candidate prepared for founder approval. Production publication is not authorised.

## Scope and provenance

- Published baseline: `b30604f52c06ebc83960273717329d23ff623b92` (pictures/diagrams release included).
- Eleven existing uncommitted input files were preserved in an isolated checkout. The shared working copy was not overwritten or committed.
- WMS implementation premise: direct founder confirmation that standard core operations are implemented. Detailed wording is supported by the bounded source evidence in `SOURCE-EVIDENCE.json` and existing certification artifacts. No WMS certification, build, service, DB or data change was started.
- The central message is a standard WMS core on a configurable platform. Customer implementations adapt that core; not every requirement is necessarily configuration-only.

## Changes to review

[Before/after wording](BEFORE-AFTER.md), [product messaging matrix](MESSAGING-MATRIX.md), [resolved contradictions](RESOLVED-CONTRADICTIONS.md).

Home, Product, capability map, Vision, Assessment/report disclaimers, Cost, demo enquiry introduction and the factual website Terms/Privacy introductions now use consistent maturity language. The Vision keeps AI Harness, AI Onboarding, AI Support and autonomous setup in the future. Unsupported delivery-speed, savings, ROI, performance and universal certification claims are removed or explicitly separated from the current offering.

## Preservation checks

Eight page head/metadata blocks are byte-identical to baseline. Core CSS, branding assets, diagrams/illustration scripts, navigation URLs, API handlers, analytics code, cost model/UI, Assessment UI and stylesheet, robots, sitemap and production deployment configuration are unchanged. The enquiry form and cost form are byte-identical, including consent, fields and input limits. Existing IDs and internal fragments remain valid.

The Privacy introduction describes the existing product and website accurately. Collection, recipients, legal bases, retention, deletion, controller and consent behavior were not changed. Website Terms now distinguish the current software from website use and a separate customer agreement; other legal clauses are retained.

## Regression results

- Static content/safety validation: 435 checks; 284 local references, including assets and fragments.
- Responsive browser: all eight pages at widths 320, 390 and 768 px, 24 views without horizontal overflow. Desktop and mobile screenshots accompany the wording diff.
- Assessment/model/PDF/isolated-preview suite: 48 passed. Two old disclaimer-wording assertions were updated to the new customer-preparation wording; their evidence, privacy, rule and PDF checks remain in place. Initial unchanged-text run was 46/48; both differences were the deliberately replaced disclaimer sentences, not scoring failures.
- Eight golden/unknown profiles compared against the production model: answers, classifications, question paths, findings, recommendations and schema are unchanged after accounting for the documented copy-only disclaimer/scenario qualification and punctuation changes.
- Five customer PDF examples generated using the existing renderer. Executive summary/top actions remain on page one and complexity/readiness on page two. All 33 pages were rendered and visually reviewed. Text origins remain within margins. PDF checks are in pdf-checks.json; full renders are retained with the local release evidence.
- JavaScript syntax and diff whitespace checks pass. This is a static website with no package/build script; the Vercel preview build is the deployment build check.

No real lead submission was sent. Local preview POST requests are refused. Privacy/consent and no-answer-network boundaries are unchanged. No new analytics events or services.

## Protected preview and release gate

The immutable Vercel preview URL and independent unauthenticated Authentication check will be recorded in the PR/final handoff. Non-indexing alone is not considered protection. The review deployment adds a separate preview-only commit: a build guard rejects production, X-Robots-Tag prevents indexing and caching is disabled. These review-only deployment files must not be included in a production content release.

After approval, release only the content commit to main through the normal process. Do not merge the preview guard. Verify Home, Product, Vision, Cost, Assessment and the unchanged form endpoints, canonical metadata, sitemap, robots and mobile navigation. Roll back a failed content release by reverting its content commit normally, without force-pushing or discarding unrelated changes.

Founder decisions: approve the prepared wording, including the factual website Terms/Privacy introductory correction; then give an explicit production release instruction. Individual advanced-capability verification is required only before expanding those claims, not as another core-WMS certification gate.

## Limits

Responsive viewport emulation is not physical iOS/Android device testing. This work does not certify the WMS, every configuration variant, device, integration or regulated deployment. Existing QA facts retain their original status. No production performance or commercial-outcome claim is introduced. The target duration of the Assessment remains an unmeasured UX target.
