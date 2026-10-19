# Release checklist — explicit approval gate

19 October 2026. No box below authorizes a merge/deployment. Existing Sprint 1/2 audit, GSC, Lighthouse and mock evidence are reused; this is a bounded release check.

## Completed for review

- [x] Confirm production commit 24914b0b2729e2b5b4f661a2db3569a6741a227d / successful Production deployment 7160016913; current home/Vision/robots/sitemap match main. Cost/inventory still 404.
- [x] Reuse existing branch and draft PR #3, starting from 426ef5c; no unrelated .DS_Store changes staged.
- [x] Preserve actual public homepage, primary CTA, Vision, production privacy/routes/sitemap; prepare link/route/privacy changes in **excluded local compositions only**.
- [x] Separate RC-A minimum, RC-A measurement extension and RC-B with exact manifests. No cost→unpublished inventory link; independent RC-B also omits unpublished cost link.
- [x] Cost math, blank/zero, USD/GBP/EUR, licensing, overflow, whole counts, annual scope and rounding tested. Existing exact integer math and precision regressions retained.
- [x] A1 APPROVED: Quick Scope checklist, progressive Advanced Budget, USD/GBP/EUR, TCO/assumptions, sourced section, CTA, footer and contrast. A2 NOT approved. PDF checklist queued as non-blocking follow-up, excluded from this release.
- [x] Exact local minimum commit `8b974f89796da5424e2a0d0e6f8d5746c0f6f5c4`, parent production `24914b0…`, eight files only. No remote/push/merge/deployment. Manifest/patch/bundle prepared. Footer placement corrected; header/main proven unchanged. See [final production release plan](RELEASE-CANDIDATE.md#final-minimal-rc-a-production-release-plan--a2-gate).
- [x] One labelled real provider test returns 200; founder confirmed receipt in Inbox on 19 October 2026. Redacted evidence distinguishes provider acceptance, owner-confirmed receipt and the still-unexecuted deployed-browser end-to-end test. No repeat submission or production analytics event was generated.
- [x] Optional analytics disabled by default; local RC previews reject forms, send no events and set HTTP noindex. Current Vercel Hobby one-hour runtime window explicitly rejected as complete weekly storage.
- [x] Full-scope claims matrix preserves intended MVP and historical QA provenance. No new certification, WMS mutations or production claims.

## Validation record

30 automated tests pass (rerun on 19 October): all previous arithmetic/form/measurement/composition/protection coverage retained, plus EUR equivalence and Quick Scope unknown/zero/validation coverage. Protected-preview tests verify blocked production/development builds, no upstream requests from disabled enquiry/event endpoints, measurement OFF, noindex and independent page composition. `scripts/validate.py` and `git diff --check` pass. No configured linter or framework build exists. SEO head is byte-identical to the prior draft; TCO formulas differ only in allowing EUR. The updated Vercel RC-A preview is Ready and was checked independently in an authenticated browser; [current evidence](evidence/sprint-2/quick-scope-preview.json) records actual anonymous authentication redirects and unchanged production, not just local expectations.

Composition tests confirm page isolation, four-URL sitemap, self-canonical/indexable candidate HTML, intended route/redirects, asset presence and unchanged Vision/robots/gallery. Local HTTP smoke checks cover each candidate route, redirects, noindex response header, disabled config and absent other commercial route. Browser/mobile QA checks calculator, focus, reset/model changes and layout. Full checks/results are [recorded alongside this gate](evidence/release-candidate/validation.json).

Reuse [Sprint 2 Lighthouse](evidence/sprint-2/lighthouse-summary.json): cost mobile 99/100/100/66; inventory 100/100/100/66. Draft SEO score is reduced by intentional noindex. These are lab checks, not live production or field Core Web Vitals. The small composition change does not justify repeating the full SEO audit. GSC readiness is in [existing status](SEARCH-CONSOLE-STATUS.md); no new indexing success is claimed.

## Blockers — owner and minimum action

| Blocker | Owner | Minimum action | Blocks |
|---|---|---|---|
| P0 RC-A preview — COMPLETE | Agent | Protected preview updated for the requested UX/EUR revision; anonymous Authentication redirects, disabled form/events and noindex reverified in [release candidate](RELEASE-CANDIDATE.md). RC-B not deployed. | No production authorization implied |
| A2 release authorization — sole remaining minimum RC-A gate | Founder | A1 already approved. Authorize the frozen eight-file commit, new analytics OFF, baseline form/privacy/events retained, explicit checks and failure rollback. RC-B and PDF excluded. | RC-A minimum production release |
| Privacy operating policy / remaining provider safeguards | Founder/controller, then agent | Approve controller identity and retention/deletion. Agent verifies provider contracts/transfer/deletion controls and finalizes policy; Formspree archive ON, 30-day archive access and Gmail routing are already checked. | Measurement extension; not WMS work |
| Weekly collection incomplete | Founder chooses destination; agent verifies configuration | Approve a durable data destination/retention; verify continuous collection, dedup/outage coverage and access limits before activation. | Measurement extension only |
| Inventory relevant QA / defect retests incomplete | WMS engineering/QA owner | Link selected-build applicable existing proof; D003 implementation fix is already merged in PR #1314, so provide the matching required retest for affected receiving scope rather than reimplementing it. | RC-B only |
| Inventory wording/screenshots approval | Founder, after QA | Approve cleared matrix and existing gallery-link/no-new-image approach or specific redacted images. | RC-B only |

## Subsequent release procedure — NOT executed

1. A1 is recorded. Await explicit A2 for the frozen candidate and failure rollback; confirm main/domain baseline again before any push because another task could release in parallel.
2. Use prepared local release commit `8b974f89796da5424e2a0d0e6f8d5746c0f6f5c4` / eight-file [manifest](evidence/release-candidate/rc-a-approved-a1-manifest.json). **Do not merge PR #3 or the preview snapshot branch.** Minimum RC-A retains baseline API/main/lead scripts/privacy and legacy events; it publishes only cost, contrast, footer link, routes and sitemap. A dedicated clean release PR may be pushed/merged only after A2. Reconcile intervening main changes without overwriting them; re-approve changed runtime content if necessary. Do not copy manifests, patch/bundle or tooling into public output.
3. Rebuild from the release commit; compare file hashes with approved artifact, rerun tests/static checks and clean file-list review. If RC-A and RC-B are later combined, union the approved sitemap and links; never overwrite an already released page's entry with an older independent snapshot.
4. Review protected deployment: clean canonical path and duplicate-path redirects; absolute HTTPS canonical; valid BreadcrumbList matching visible breadcrumb; rendered HTML includes meaningful content without JavaScript; public robots allows approved page; sitemap only approved canonical URLs; legal/WebRF noindex remains. Confirm homepage main/CTA/Vision unchanged except approved footer resource link.
5. Verify mobile 390×844 and desktop, keyboard labels/focus, active/inactive licensing fields, zero/blank/negative/decimal/count limits, model-change/reset invalidation and TCO. Confirm enquiry form against intended deployment; reuse this labelled provider test and owner receipt, do not silently send additional test leads. If a separate deployed-path smoke submission is needed, obtain explicit authorization for another test first.
6. **Explicit release step only after approval:** merge/promote that release commit through the existing GitHub→Vercel workflow. No Vercel setting change or production flag was made during this task. Confirm successful deployment matches approved release SHA, then public status/redirect/canonical/sitemap and excluded drafts. Keep tracking OFF for minimum RC-A.
7. Measurement extension needs independent privacy/storage approval and final policy, plus separately authorized activation/deployment. Set QUARK_MEASUREMENT_ENABLED=1 for **production only** in an approved new deployment, verify opt-in/decline/withdraw/DNT/GPC, no pre-consent optional requests and redacted allowlisted payloads. Never set local-test flag in Vercel. Monitor a complete interval before publishing conversion rates.

## Rollback

Record the actual previous successful deployment ID immediately before releasing (currently 7160016913 at 24914b0). After an approved release incident, founder/release owner authorizes promotion of that retained deployment, or reverts only the specific release commit via GitHub and deploys the revert. Verify availability of the retained Vercel deployment before relying on it. Reversion removes only newly released route/link/sitemap entries; preserve Vision and unrelated main changes.

Environment-variable edits affect **new deployments**, not a running one: [Vercel environment-variable guidance](https://vercel.com/docs/environment-variables). To stop activated measurement, deploy approved disabled configuration or promote a known disabled deployment; do not promise an immediate flag-only shutdown. Preserve redacted incident evidence and apply approved deletion rules to exported events.

**STOP: A1 APPROVED; only A2 is pending for the minimum RC-A. No push, merge or deployment was performed in this preparation.**
