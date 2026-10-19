# Data handling — approval required

19 October 2026. **New production measurement remains OFF.** No GA4/Plausible account exists. No new service, paid plan, drain, schedule or credentials were created. Current production's existing contact form continues independently.

## One real delivery test

[Redacted test record](evidence/release-candidate/form-delivery.json): exactly one real Formspree POST at **2026-10-19 05:37:02 UTC**, marker **QUARK-RC-TEST d80e4680-6a89-42a0-9d9e-7aa37f4623c3**. The current RC `api/lead.js` was invoked locally with real upstream fetch; only the outgoing subject was prefixed for clear test identification. Formspree returned **HTTP 200**, handler returned `ok:true, delivery_status:provider_accepted`. This is not a deployed-browser end-to-end test. Optional analytics was disabled, and test operational events were kept locally rather than inserted into production reporting.

**Final inbox receipt: CONFIRMED BY OWNER.** On 19 October 2026 the founder replied to the question naming the exact test subject: “Письмо получено во входящих” (received in Inbox). This independently closes the receipt gate for the single labelled test; it is owner attestation, not direct agent inspection of the mailbox or evidence of every future delivery. The exact receipt time was not provided. Formspree account settings and mailbox provider still require separate confirmation; receipt does not establish their retention or transfer safeguards. No retry is needed. No enquiry content, recipient address or credentials are stored here. This test was not opted into analytics and must not be inserted as a consented production funnel success or represented as a deployed-browser end-to-end test.

## Data map — actual implementation and account unknowns

| Data | Destination / storage | Purpose / boundary |
|---|---|---|
| Email, optional industry, explicit contact consent | HTTPS `/api/lead` → existing Formspree form → Formspree stored submission and configured notification mailbox | Reply to the enquiry. RC extension additionally sends random submission reference and subject for matching. No marketing subscription. Actual recipient route/mailbox provider and account retention need owner confirmation. |
| Random submission ID, operational event, timestamp, coarse allowlisted source/medium, generic error reason | `quark_leads` runtime logs in Vercel; local labelled test evidence stores only reference/status | Necessary delivery diagnostics; existing operational stage `lead_success` means provider acceptance, never inbox receipt. No email/industry/body/IP/full URL in application log payloads. |
| Optional page/event/time, coarse source/medium, allowlisted initial/current path, tab/page context, placement, attempt/event/submission references, delivery/error enum | Browser → first-party `/api/events` or accepted server event → `quark_funnel` Vercel runtime logs, only if activated and opted in | Entries/page views/CTA/attempts/provider acceptance. Whitelist drops raw query, referrer, free text, email, calculator values. References can be linked to an enquiry: treat as pseudonymous data, not guaranteed anonymous. No permanent visitor identifier. |
| Measurement choice; coarse attribution after opt-in | Same-tab sessionStorage; attribution expires 30 minutes after last measured navigation; preference survives only the tab session | Decline/withdraw stops optional events and clears attribution. DNT/GPC suppress measurement. Session expiry is not server-data deletion. |
| `qk-theme` | Browser localStorage | Existing display preference. No visitor identifier. |
| Calculator financial inputs/results | Browser memory only | No network transmission, storage, event payload or inclusion in enquiries. |
| IP/device/browser/request URL/timestamps | Vercel hosting/security infrastructure; font provider receives connection data when loaded | Separate from application event allowlists. Do not claim hosting is PII-free or that provider logs have all been inspected. |
| Inbox attestation | Owner-controlled offline record, only reference/verification time/result | Never copy enquiry content into SEO reports. Offline confirmation tool only accepts matching eligible acceptance records, not arbitrary browser assertions. |

## Retention and deletion — proposed operating decisions, not existing configuration

| Dataset | Proposed policy | Owner / required action |
|---|---|---|
| Enquiries | Delete controlled Formspree, mailbox and export copies within **12 months after last substantive contact**, earlier on a valid request; documented legal exceptions only. Monthly review. | Founder/controller approves, confirms provider settings and performs monthly purge. No deletion job is currently configured. |
| This test | Delete provider and mailbox copies within **7 days** after verification; keep only redacted reference/status in evidence. | Founder after confirmation. Agent must obtain action-time confirmation before irreversible deletion. |
| Optional event export / future store | Raw pseudonymous events at most **30 days**, aggregate counts without submission/event IDs at most **13 months**. No uncontrolled exports. | Founder approves destination/roles; agent configures TTL/export coverage only after authorization. These periods are **not implemented in a new store**. |
| Vercel runtime logs | Account is **Hobby**, observed in project Logs UI; only last hour available. | Provider expiry, not a site deletion job. Provider security logs/backups have separately unverified periods; do not substitute runtime expiry for all data. |
| Deletion request | Receive at existing privacy contact; verify request proportionately; locate email in Formspree/mailbox and reference in controlled exports, remove eligible copies, record only date/systems/outcome; escalate provider backups/legal exceptions, tell requester limits. | Founder/controller; respond within applicable statutory period, normally one month under GDPR. Agent can assist without exporting PII. |

## Consent and privacy review

Use separate, affirmative optional-measurement consent; contact checkbox covers answering the enquiry only. No preselected analytics or enquiry gate. Retain equally reachable Allow/Decline and footer withdrawal. Do not infer that “no cookies” means no consent obligations: session storage and linkable references matter. The proposed opt-in is a conservative design choice across EU/UK visitors, not a declaration that every analytics exemption is unavailable. See [ICO consent guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/).

[Proposed privacy HTML](../../drafts/legal/privacy.html) is explicitly review-only. It removes the inherited unverified “typically 30 days” assertion and unsupported blanket transfer-safeguard assertion, and discloses the actual one-hour runtime window, optional processing and proposed deletion policy. **ACTION FOR AGENT:** after founder identifies the real notification email provider and confirms controller identity/contact, verify processor locations, contracts/transfer mechanism and provider retention/deletion controls; then replace all approval placeholders with accurate publishable wording and obtain approval of the exact final policy. Do not publish a policy containing unresolved approval notes. No legal-compliance certification is claimed.

The minimum RC-A does not activate these changes and retains production's existing privacy/API. Any known legacy-policy verification gap remains documented, not silently declared fixed. RC-A measurement extension cannot ship before the policy gate closes.

## Weekly reporting: current logs are insufficient

Observed authenticated project UI: `quark-build Hobby`; Last hour available, Last 12 hours/day require Pro, Last week requires Observability Plus. No durable export/drain is configured in this repository or verified in the account. [Vercel runtime documentation](https://vercel.com/docs/logs/runtime) confirms Hobby runtime retention is one hour. Thus the current Vercel-only design cannot establish seven-day completeness. Do not approve analytics activation on the basis that the reporting script can parse a mock file.

A future approved durable collection path must cover a continuous seven-day interval, monitor dropped/duplicate events and outages, separate test/preview, enforce retention, and reconcile provider acceptance to inbox confirmations without PII in reports. The existing script is reusable; no new dashboard or infrastructure is built in this approval task. Consent/ad blockers/tab context still mean funnel counts are a measured subset, never all visitors or qualified leads. Use GSC weekly organic landing clicks/impressions independently; do not join them into a fabricated full conversion denominator.

Primary provider references checked 19 October: [Formspree privacy/retention](https://formspree.io/legal/privacy-policy/), [submission exports](https://help.formspree.io/articles/form-and-project-settings/exporting-submissions/), [over-limit submission behaviour](https://help.formspree.io/articles/form-and-project-settings/over-limit-submissions). They do not prove this account's notification recipient or settings.
