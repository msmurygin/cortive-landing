# Conversion tracking — Sprint 2

**19 October 2026. DONE:** review implementation and automated/mock verification. **PROPOSED:** production activation. **BLOCKED:** actual provider/inbox receipt and durable reporting retention have not been verified. No GA4/Plausible account exists according to the founder; no account, purchase or third-party analytics script was created.

## Implemented path and event meanings

Shared assets/main.js loads assets/measurement.js without changing home/Vision HTML. The config endpoint defaults to disabled. Only the canonical production host with an explicit environment flag is eligible; normal Vercel previews are excluded. The local review server uses a separate test environment and mocks every provider call.

| Event | Producer / trigger | Meaning |
|---|---|---|
| page_view | Browser, once per document after optional opt-in | Viewed allowlisted page; is_entry distinguishes a new measured tab entry from a continuation |
| demo_cta_click | One delegated browser handler | Contact CTA/email link clicked; not a conversion |
| demo_form_submit | Browser, once per valid send attempt | Send attempted, not provider acceptance; no automatic fetch retry |
| demo_form_accepted | Backend, only after successful Formspree HTTP response | Provider accepted the request; **inbox unverified** |
| demo_form_error | Backend for validation/provider refusal; browser for network/unusable response | Failed or unconfirmed attempt, with a generic reason only |
| demo_form_success | Offline owner-confirmation tool, after matching an actual received message to backend acceptance | Inbox confirmed by owner; never emitted by the browser or inferred from a 200/thank-you URL |

The extra accepted stage is deliberate: the requested “success = accepted and delivered” cannot honestly be inferred from the existing provider response. A controlled delivery test and owner evidence remain required. [Formspree AJAX documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax) describes submission handling; it is not proof of inbox receipt.

Existing quark_leads operational records remain separate from the new quark_funnel schema. The report filters namespace/schema-stage and never adds both as two conversions. Formspree receives the existing contact fields and a random submission reference (also in the subject), so the owner can reconcile a message without copying its email/content into analytics.

## Attribution and privacy

- No cookies, fingerprint, persistent visitor ID, raw referrer, full URL, free text, contact data or calculator values in analytics. Browser connection data still reaches the first-party host; hosting logs have their own retention.
- Optional events and attribution require an explicit Allow measurement choice; Decline has equal prominence. The footer offers withdrawal. DNT/GPC suppress optional collection. The contact form works independently.
- Session storage remembers the tab’s choice. Only after opt-in does it hold source/medium and an allowlisted initial path with a 30-minute attribution expiry. No random session/visitor ID is created. This is **not storage-free**; privacy/consent copy must be reviewed before activation.
- Same-tab navigation preserves the initial landing and coarse source. Unknown paths/source strings become other. Queries and referrer paths are discarded. A Google-labelled UTM is attribution input, not proof of a real Google click; the browser QA uses synthetic UTMs.
- When storage is unavailable, context is current-page only. After expiry, attribution is not sent until a new page initializes context. Separate tabs, blocked scripts, refused consent and browser-restored tabs limit coverage. Do not call the denominator all visitors, unique people or GSC clicks.
- [Draft privacy update](../../drafts/legal/privacy.html) is local-only. Production privacy is unchanged; publishing approved disclosure and confirming host-log retention are release dependencies.

## Duplicates and limitations

One measurement initializer, one CTA listener and one form binding prevent duplicate handlers. The form is disabled during sending and after confirmed acceptance. The client does not emit accepted/delivered outcomes. Events have random event IDs; form stages share an attempt ID. Delivery confirmations match a backend submission reference. Reporting deduplicates by stage/event or attempt ID.

Network timing can put a server record before the client-submit record; join by attempt ID rather than timestamp order. Client events are best effort and can be blocked. Reporting deduplication is **not distributed provider-send idempotency**. A manual retry after a lost response can still produce a second provider submission; no exactly-once delivery guarantee is claimed. No database or undocumented Formspree idempotency feature was invented.

## Verification and reporting

Local preview: node scripts/preview.cjs. Every Formspree call is mocked; it cannot prove external receipt. Browser QA checked a synthetic Google-tagged /wms-cost entry, opt-in, CTA, home form and backend acceptance while retaining the original landing. Calculator inputs were absent from event payloads. Automated tests cover provider errors, invalid form data, forbidden client success, consent/preview/DNT exclusions, PII normalization, cross-page attribution and offline delivery confirmation.

For an authorized Vercel log export, run node scripts/funnel-report.cjs export.ndjson production. It accepts raw event lines or JSON records with a message field; other export shapes need an explicit conversion. Test environment is excluded by default. The output groups source/medium/initial landing and shows entry views, page views, CTA clicks, submit attempts, provider acceptance, errors and inbox confirmations. It is an export workflow, **not a configured hosted dashboard**.

To confirm delivery, the owner checks a real labelled test in both the Formspree submissions view and the inbox, then records only submission_id, inbox_verified:true and verified_at in a local JSON array. Run node scripts/confirm-delivery.cjs backend.ndjson owner-confirmations.json to produce verified-delivery records, then include these with the backend export when reporting. The tool refuses missing attestation or unmatched acceptance, strips extra fields and deduplicates confirmations. A JSON fixture saying true is not actual delivery evidence: all current confirmation tests are synthetic.

Weekly: consistent completed period; record export boundaries/timezones and log completeness; show organic-associated accepted / measured consented entry views with both numbers; show inbox-confirmed and human-qualified counts separately. Missing denominator/retention is N/A, not zero. Small samples do not support percentage-growth or ROI claims. GSC country/query reports remain separate; no identity join is attempted.

## Required release steps

1. Founder approves the optional-measurement controls/disclosure and an explicit code release. No external analytics credentials are required for this first-party implementation.
2. Confirm Vercel retention/export completeness; if it cannot support weekly reporting, choose a durable sink or analytics service as a separate approved step. Do not activate a dashboard claim from transient logs.
3. Include the approved privacy update and reviewed technical commit in an explicitly approved production deployment, with QUARK_MEASUREMENT_ENABLED=1 scoped to **production** only. The flag is not a secret. Vercel environment changes apply only to new deployments, so activation and later flag removal require an approved deployment; they are not an instant switch on an existing deployment. See [Vercel environment-variable behavior](https://vercel.com/docs/environment-variables). Never set the local-test flag on Vercel.
4. Send one owner-controlled, labelled test after release; confirm provider and inbox independently, record the reference, then check the appropriate stages once. No real submission was sent by this sprint.
5. Rollback measurement by removing the flag and making an approved deployment, or rolling back to a reviewed disabled deployment. A code rollback is separate; no production release has happened here.
