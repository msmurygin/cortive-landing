# Handoff to Claude Designer

## Ownership and approved baseline

Founder approval covers the current website's **functional baseline**, subject to the corrections now implemented. It is not final visual approval. Claude Designer owns subsequent visual direction. Do not start another architecture redesign, invent a new section tree, reopen product discovery or expand Assessment/WMS work.

## Fixed functional constraints

- `/product` is the central product presentation. Inbound, inventory, outbound, execution, platform and workflow examples live on this one page.
- No standalone Screens / Product Experience navigation or public page. `/screens.html` permanently redirects to `/product`. Retain aliases `#topology`, `#inventory`, `#movements`, `#studio`, `#stock`, `#allocation`, `#configuration`, `#inbound` for relevant old links.
- Keep current Quark identity: full existing wordmark, cream/ink/teal/purple, existing type families/fallbacks. Shared build-time header/footer are defined once; mobile menu and keyboard behaviour work.
- Preserve `/wms-cost` content, Quick Scope, Advanced Budget, USD/GBP/EUR and transparent formulas. Preserve the original Vision manifesto and legal main content.
- Contact fields/provider/consent/handler are the production baseline, with no automatic assessment or budget attachment. New analytics remains absent/OFF; existing approved aggregate funnel is preserved. Review preview disables all submission.
- Assessment RC is independent and unchanged. Do not place a public Assessment link until that separate release is approved.
- Public copy discloses early product maturity once, scopes evaluation to the available build and makes AI future-only. Internal QA IDs, certification repetition and recording-production notes do not belong in public prose.
- No simulated WMS, invented screenshots, AI APIs, new backend or framework.

## Relevant files / preview

`scripts/build-site-redesign.cjs` generates isolated preview/release variants. `drafts/site-redesign/site.css` and `site.js` retain the approved layout/components and navigation behaviour. New public workflow content is generated within `/product`; public review/style-guide pages are not emitted. Browser review: http://127.0.0.1:4196/product .

`node scripts/build-site-redesign.cjs` builds a disabled/noindex review; `node scripts/build-site-redesign.cjs --release` produces an indexable unpublished candidate with original contact functionality. Runtime output is ignored by Vercel in the source worktree; it does not deploy automatically.

The release manifest enumerates the exact 12 runtime changes against production baseline 2a628cb. Source-builder/documentation diffs are separate from the runtime release patch. Review safeguards must never be copied into production as release settings.

## Internal assets and evidence

The existing capability matrix and [recording briefs](INTERNAL-RECORDING-STORYBOARDS.md) remain internal. They distinguish implementation from accepted scenario evidence. Real recordings and verified configuration before/after examples can be added only with the relevant product evidence and founder approval. No recording or feature claim was fabricated to fill a layout. Their absence does not block this text-and-diagram functional baseline, because it promises no playable demonstration.

Existing Vision/legal accessibility observations and any objective functional defects should be distinguished from new visual preferences in the final evidence report. This handoff does not assert a complete WCAG audit or real-user usability result.

## Stop / release boundary

Next action is designer visual review, then founder approval of the exact final release diff. Do not independently merge, deploy, change production, activate tracking or continue a new design sprint. The prior Product Experience separation and A/B/C estimates are historical, superseded planning, not a request for further implementation.
