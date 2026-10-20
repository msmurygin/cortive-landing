> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Validation and release safety — VERIFIED locally / publication BLOCKED

## What was checked

- Current deployed website, desktop 1280×900 and mobile 390×844: nine destinations including the separate protected Assessment candidate; 18 before screenshots plus HTTP/metadata evidence. No new form test or user data submission.
- Local proposals for Home, Product Overview, Product Experience, Vision, Cost, Privacy, Terms and Thanks: 16 desktop/mobile observations and screenshots. Additional 320px and 900px checks on Home/Product/Experience/Cost.
- Shared full logo/header/footer present on all eight local proposal pages. Mobile navigation opens with Enter; Escape closes and restores summary focus; Product Overview link and section jump work. CTA navigates to the local contact section; there is no active enquiry form.
- Quick Scope produces its planning checklist; Advanced Budget opens and EUR selects correctly. Automated cost arithmetic tests pass unchanged.
- Local preservation test compares the Cost article/main, cost-model.js and cost-ui.js, legal main content, Vision manifesto body, cost JSON-LD, home JSON-LD and baseline sitemap. Source hash comparison covers all 27 previously snapshotted files, including Assessment/runtime/tests; zero changed.
- Legacy home and Screens fragments resolve. All internal hrefs/fragments in the ten local review pages resolve, including assets with version query strings.
- Build passes. Existing site suite: **87/87 PASS** (82 existing + 5 proposal packaging/preservation/link/SEO safety tests). Existing deterministic rules, schema, PDF and questionnaire tests remain unchanged. New JavaScript syntax checks pass. No configured lint command/package.json exists; no lint success is invented.
- No gallery/image-frame/lightbox, simulated WMS state or fake recording player in new Home/Product/Experience. No AI functionality, named connector, ROI or throughput promise added. Recordings are storyboards, explicitly pending.
- Review output uses noindex,nofollow,noarchive, Disallow-all, no-store, blocked connect/form actions and disabled enquiry/event endpoints. Production build guard refuses VERCEL_ENV=production. Server binds only 127.0.0.1; non-GET/HEAD requests are refused.

## Lighthouse lab results

Lighthouse 13.5.0; fresh headless Chrome, default mobile or desktop preset; same loopback serving and review indexing constraints. One run per listed variant, not field Core Web Vitals or a statistically stable performance benchmark.

| Page / mode | Performance | Accessibility | Best practices |
|---|---:|---:|---:|
| Deployed-baseline copy / mobile | 92 | 100 | 100 |
| Proposed Home / mobile | 100 | 100 | 100 |
| Proposed Product Overview / mobile | 100 | 100 | 100 |
| Proposed Product Experience / mobile | 100 | 100 | 100 |
| Deployed-baseline copy / desktop | 100 | 100 | 100 |
| Proposed Home / desktop | 100 | 100 | 100 |

Review SEO score is intentionally suppressed by noindex/Disallow-all (baseline lab copy 61, new review 58); it is not a production SEO score and not a release-ready SEO comparison. Canonical/HTML/metadata/fragment checks are separate. Re-test the eventual approved production candidate with intended indexing configuration before release. Actual video payload/performance remains unmeasured until authentic assets exist.

The first local accessibility run found a low-contrast contact paragraph; corrected the local token and repeated affected audits to 100. A legacy Vision grid min-content width was constrained in the proposed shell; manifesto text remains unchanged. Neither fix was published.

## Evidence

The delivery archive contains `evidence/live-audit.json`, `browser-audit.json`, `proposal-browser.json`, `interaction-checks.json`, `source-evidence.json`, `preservation-check.json`, `production-after.json`, Lighthouse JSON and test output. Before/after page screenshots are in `screenshots/`. These are website-review evidence, not customer-facing product gallery assets.

## Remaining gates and owners

| Gate | Owner | Minimal action |
|---|---|---|
| Commercial copy, maturity labels and shared navigation | Founder | Approve the actual Overview/Experience/Home proposals and Phase A scope. |
| Authentic operation recordings | WMS/demo owner, then founder | Select one or two existing accepted paths/builds, record approved sample data and approve captions/assets. No full certification. |
| Configuration before/after | WMS/demo owner | Identify one already-supported change and its relevant activation/acceptance evidence, or defer that demonstration. |
| Device/assistive and buyer comprehension evidence | Website engineer / selected warehouse evaluator | Test final real-media candidate on target devices and a short comprehension pass; current local browser checks are not user research or a full WCAG audit. |
| Public Assessment link | Founder | Independent Assessment release approval; otherwise omit from public Resources. |
| Production phase release | Founder, then website engineer | Approve exact phase diff, approved claims/media and release action. No current publication permission. |

## Deployment instructions after approval

1. Confirm current main/deployment, snapshot its exact commit/config and ensure earlier Assessment work is not mixed into the phase. Current reviewed public baseline is 2a628cbfa41cbd28a1959dc6818865342e017362; refresh it if main changes.
2. Build a new minimal production candidate from that approved baseline. **Do not deploy review-dist/site-redesign or merge the private output.** Its noindex/API stubs, review routes, disabled contact and production build guard are review safeguards, not public changes.
3. Phase A should contain approved shared shell/assets only. Phase B adds Product Overview and approved Experience content/media; retain `/screens.html`, meaningful old fragments and existing canonicals. Add canonical `/product`, .html/trailing-slash redirects and sitemap entry only when approved. Do not add review pages or unreleased Assessment to sitemap.
4. Preserve exact approved cost runtime/form provider/API/privacy/analytics settings. New analytics stays OFF. Keep legal/thanks intentional noindex; keep public core indexability. Preserve manifesto content and valid existing structured data.
5. Run build, existing suite, targeted keyboard/mobile/video/SEO/link checks and matched Lighthouse. Prepare a Vercel Authentication protected, noindex preview if separately requested/authorized; verify unauthenticated requests are actually challenged. Do not confuse unlisted URLs with protection.
6. Founder approves the exact release commit/diff/assets and authorizes merge/deployment. Verify production URLs, canonical/robots/sitemap/JSON-LD, menu/logo, existing Cost, contact success/error behaviour without unlabelled test leads. Confirm Assessment route remains in its separately approved state.

## Rollback

Before release, record previous known-good production deployment ID/URL and Git commit. If a critical check fails (indexing, public content leak, broken cost/contact/navigation), promote the recorded previous deployment using the existing authorized Vercel workflow or revert the exact approved phase commit through GitHub and verify the rebuild. Do not reset unrelated Assessment/SEO history, delete data or weaken Authentication. Recheck home/Vision/Cost/contact/robots/sitemap. Report failure and restored baseline. This document records a plan; no deploy or rollback was executed for this design proposal.

## Local review / reproducibility

From the website repository:

```sh
node scripts/build-site-redesign.cjs
node scripts/preview-site-redesign.cjs
node --test tests/site-redesign.test.cjs
```

Open http://127.0.0.1:4196/review . The builder reads pinned production Git objects; QUARK_SITE_REPO and QUARK_DESIGN_OUT can select an explicit local repository and isolated output. It does not upload, merge or deploy. The source-only patch is reviewable independently of earlier dirty files; archive manifests enumerate only this task's additions.
