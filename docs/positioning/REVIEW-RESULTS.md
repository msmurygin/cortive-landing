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

The immutable Vercel preview is https://project-ogj6r-pc5pp4nq4-quark-build.vercel.app/ . Its deployed preview commit is `9fe5c607f751636d0bfeed59928bd17f284b9201`; the content-only commit is `fe75ad96114c0bb0877db2a1c889b15263960edb`. Authentication was independently checked without cookie or redirect following on seven routes: each returned HTTP 302 to `vercel.com/sso-api`, not content. An already authorised browser loaded the five content pages and completed the Assessment including local PDF/JSON generation. See PREVIEW-PROTECTION.json and browser-checks.json. Non-indexing alone is not considered protection. The review deployment adds a separate preview-only commit: a build guard rejects production, X-Robots-Tag prevents indexing and caching is disabled. These review-only deployment files must not be included in a production content release.

After approval, release the original content commit and both Product copy follow-ups (the redundant introduction removal and optional serial-number clarification) to main through the normal process. Alternatively, transfer only the reviewed runtime content paths from the final review tree, excluding preview-only deployment configuration. Do not merge the preview guard. Verify Home, Product, Vision, Cost, Assessment and the unchanged form endpoints, canonical metadata, sitemap, robots and mobile navigation. Roll back a failed content release by reverting its content commit normally, without force-pushing or discarding unrelated changes.

Founder decisions: approve the prepared wording, including the factual website Terms/Privacy introductory correction; then give an explicit production release instruction. Individual advanced-capability verification is required only before expanding those claims, not as another core-WMS certification gate.

## Limits

Responsive viewport emulation is not physical iOS/Android device testing. This work does not certify the WMS, every configuration variant, device, integration or regulated deployment. Existing QA facts retain their original status. No production performance or commercial-outcome claim is introduced. The target duration of the Assessment remains an unmeasured UX target.

Existing non-blocking test observation: a checkbox click made by automation before deferred Assessment scripts finished loading did not enable Start until the checkbox was toggled again after load. The UI source is byte-identical to production. This content candidate does not change questionnaire behavior; a future narrow UI fix can synchronise the initial button state with consent after script loading. This is independent of the WMS core and of the copy approval.

## Founder copy review follow-ups

- Removed the redundant sentence about office users and warehouse operators without replacement.
- Clarified serial-number tracking as optional in both the Inventory introduction and its capability list, following founder correction. Lot and serial identities are no longer presented as an unconditional combined tracking requirement.
- These are copy-only changes; no feature implementation, UI, metadata, forms, analytics or production settings changed.

- Further founder wording review: serial-number tracking is described as also supported; Outbound heading is “From order to shipment.” Wave planning is included in the Outbound introduction, capability map and operations list. Bounded read-only inspection of wave RPC/domain commands supports grouping, eligibility preview and release. No WMS tests or certification were launched.

## Founder operator/contact correction

- Replaced the location label “Sofia, Bulgaria” with the founder-requested “EU entity” across all eight public page footers and both legal operator/controller paragraphs. The named operator/controller remains Maxim Smurygin; no company registration or legal identity was invented.
- Legal main-content contact links, including the Privacy rights contact, now use `max@quark.build`. General enquiries and footer links retain `hello@quark.build`. Form submission destinations, data processing, retention, analytics and consent behavior are unchanged.
- Governing law, jurisdiction and supervisory-authority clauses remain unchanged; the location-label correction does not establish a different legal jurisdiction. Historical audit/source documents retain their original observations.
