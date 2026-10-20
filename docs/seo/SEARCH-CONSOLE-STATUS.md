# Search Console status — Sprint 2

**19 October 2026 · Europe/Sofia. VERIFIED:** existing domain property sc-domain:quark.build, verified owner. **DONE:** existing sitemap resubmitted. **PENDING:** new processing, discovery and indexing. No production code or new pages published.

## Evidence and changes

| Check | Actual observation | Status / implication |
|---|---|---|
| Property | Existing authenticated domain property; verified ownership shown | VERIFIED; no new property, password or verification token needed |
| Production HTML | Home, Vision and gallery return 200 with one intended self-canonical and index,follow | VERIFIED by fresh HTTP responses; unchanged from Sprint 1 baseline |
| robots.txt | 200, Allow /, points to the existing sitemap | VERIFIED |
| Sitemap XML | 200; exactly home, /screens.html and /vision | VERIFIED; unpublished drafts deliberately excluded |
| Sitemap submission | Google confirmation “File sitemap submitted”; submitted date now 19 October | DONE; same sitemap, no duplicate resource |
| Sitemap processing | UI still reports last processed 15 July, Success, 1 discovered page | VERIFIED historical processing state; resubmission does not establish a fresh read or 3 discovered pages |
| Vision indexed inspection | Unknown to Google, not indexed; no indexed crawl/canonical data | VERIFIED; not declared indexed |
| Vision live test | 19 October 00:11: URL available to Google; page can be indexed | VERIFIED eligibility, not indexing or canonical selection |
| WebRF | 200 with meta and HTTP noindex | VERIFIED; prototype remains excluded from sitemap |
| Duplicate entry URLs | /index.html → / and /vision.html → /vision, 308 | VERIFIED; no duplicate canonical tag observed on inspected indexable HTML |
| New pages | /wms-cost and /features/inventory-management return 404 in production | VERIFIED expected unpublished state; not broken production links |

Evidence: [fresh production responses](evidence/sprint-2/production-check.json), [GSC observations and action record](evidence/sprint-2/gsc-status.json). Account identity, credentials and opaque inspection tokens are omitted.

## Performance provenance

Read again on 19 October: Web report still covers **17 July–16 October 2026**, displaying 7 clicks, 507 impressions, 1.4% CTR and average position 20. It agrees with the dated [Sprint 1 observations](evidence/gsc-observations.json). These are historical readings, not post-redesign growth, market search volumes or a target-keyword rank.

The indexing report is still updated **12 October**: 2 indexed, 6 excluded (noindex 2, redirect 1, alternate canonical 1, crawled/not indexed 2). Its freshness does not support a post-redesign index conclusion. Sprint 1 already recorded the legacy www examples; no new crawl defect is inferred from these totals. Field CWV remains unavailable in the last checked report; no fresh field pass/fail is asserted.

## Next actions

1. After Google processes the resubmitted file, record its actual read date and discovered count. Inspect home/gallery/Vision again if evidence changes; avoid repeated submissions while waiting.
2. An indexing request for the already-public Vision is optional after the live-test pass; none was submitted in this sprint. No request was made for either unpublished draft.
3. After an explicit commercial-page release, add only the approved URL(s) to sitemap and live internal linking; then inspect actual public rendering, canonical and indexability. Sitemap discovery still does not mean indexing.
4. Keep GSC’s Pacific-Time dates explicit when comparing with Europe/Sofia analytics. Report only complete periods and separate USA/UK, brand ambiguity and qualified enquiries as defined in [conversion tracking](CONVERSION-TRACKING.md).

No extra founder access is required for GSC. The next discovery result depends on Google processing, not a new source-code fix.
