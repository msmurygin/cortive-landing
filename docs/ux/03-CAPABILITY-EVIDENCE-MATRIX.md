# Product capability & evidence matrix — AUDITED / CONDITIONAL

WMS source read at `29b8610cff4a45459120f3b3296d898e0fe9ec2b`. Existing certification only, no fresh certification. Evidence fields have separate build pins; a handler/service or UI screenshot is not operational acceptance.

VERIFIED = exact supplied representation or bounded accepted behaviour, not blanket module availability. CONDITIONAL = implementation exists but relevant acceptance/retest/demo link is incomplete. UNSUPPORTED = no sufficient evidence for the precise claim. FUTURE = long-term Vision.

| Capability | Implemented | QA verified | Demo available | Safe to advertise |
|---|---|---|---|---|
| Receiving | Yes — receipt commands and receive services | Historical Web Receive 2EA PASS; ASN EA/CS four-case retest PASS on c2c4b4f67. Package A remains 3 PASS / 1 FAIL / 8 BLOCKED. Blind no-ASN fix source exists; applicable release retest not established. | Historical real Web/WebRF evidence; no approved current marketing capture | CONDITIONAL — describe implemented MVP scope and bounded historical checks; no blanket receiving-ready claim |
| Putaway | Yes — policy selection/reservation and location-suggestion pipeline | No applicable current end-to-end placement acceptance located in the reused certification record | Capture pending; a 3D topology view does not prove putaway execution | CONDITIONAL — MVP scope; do not imply every destination/exception policy is verified |
| Inventory visibility and stock movements | Yes — balance inquiry, movement and transaction surfaces | Representation supported by supplied captures and source; complete movement/permissions acceptance not established here | Supplied balance and transaction captures available; live demonstration/recapture approval pending | VERIFIED for the exact visible screen contents; CONDITIONAL for operational availability/enforcement |
| Holds, lots, serials and containers | Yes — identity representation and hold/serial/container operations | Scope-dependent enforcement, nested containers and lot/serial policy coverage remain conditional | Balances show these contexts; not a certified hold/serial/container workflow demo | VERIFIED as visible representation; CONDITIONAL as a complete workflow claim |
| Inventory counting and adjustments | Yes — count observation/acceptance and adjustment posting | Existing source evidence; selected-build variance/recount/approval/posting acceptance not established | No approved customer-facing capture located | CONDITIONAL — include in intended MVP scope; do not claim all counting policies are release-ready |
| Allocation | Yes — allocation planning/reservation/release services | Scoped TOPUP-01 normal API 3/10/7 PASS at product d105fce52; retained RF and Release-to-Created scoped PASS referenced. Allocation explicitly NOT Certified. Pre-push suites PASS do not certify live workflows. | Real bounded QA evidence exists; current public demo/capture not approved | CONDITIONAL — describe the exact scoped example only after build/asset review; no universal strategy/throughput promise |
| Picking | Yes — workstation review/complete/finalize and picking services | No complete applicable pick-and-handoff acceptance established by this website review; allocation/RF evidence is not automatically picking PASS | Current marketing demo/capture pending | CONDITIONAL — implemented MVP scope, selected path to confirm |
| Packing and sorting | Packing: yes — station queue, carton and source-completion operations. Sorting as a distinct demonstrable workflow: not established. | Selected-build packing acceptance not established; no sorting readiness inferred from packing/staging | Capture pending; no fabricated packing/sorting interface | CONDITIONAL for packing; UNSUPPORTED as a distinct available sorting claim until evidence is found |
| Shipping and loading | Yes — dispatch/load planning and load lifecycle/shipping service paths | No applicable complete loading/goods-issue acceptance established here | Current controlled journey/capture pending | CONDITIONAL — no carrier compatibility or complete receive-to-ship claim |
| Replenishment | Yes — planning, take-next and completion command paths | No applicable current replenishment acceptance located in reused records | Capture pending | CONDITIONAL — no automatic replenishment or throughput guarantee |
| RF terminal workflows | Yes — real Go terminal/WebRF bridge; separate React RF surface also exists | Historical bounded Receiving WebRF checks and retained Allocation RF checks; not every device/workflow or interface parity | Real QA evidence exists. The public /webrf and its validation-error image are a sample-data interface prototype, not backend proof. | CONDITIONAL for chosen real journey; VERIFIED only that the public prototype is a prototype |
| Task Management | Yes — claim, lease heartbeat, progress and release surfaces | Do not infer every task source, permission or warehouse handoff from task handlers or Allocation evidence | Chosen task lifecycle demonstration pending | CONDITIONAL — exact lifecycle and operator boundaries must be confirmed |
| Metadata Studio and configuration | Yes — Studio lifecycle/export/import/entity-wizard services and versioned RF metadata | Supplied UI views and source; full change/activation/upgrade/RBAC acceptance not established | Existing version-history/template captures, not a verified no-code change demo | VERIFIED as supplied interface/source existence; CONDITIONAL for a supported configuration-change promise |
| Reporting | Yes — report definitions/templates and data-generation service path | Template/library presence does not certify report outputs, jurisdiction or statutory compliance | Supplied report-library capture; output demonstration pending | VERIFIED for a report-library view only; CONDITIONAL for any specific operational output |
| Integrations | Integration event/delivery observation surfaces exist; particular connector implementations and availability not established by this review | No named ERP/carrier/automation connector acceptance supplied | No approved connector demo | Describe interface requirements as an evaluation topic; no prebuilt connector logos or seamless-integration promise |
| AI Harness / AI Onboarding / AI Support | Future Vision; current availability not established | Not a production capability in this brief | No implemented-product demo claimed | FUTURE — long-term Vision only, explicitly labelled |

## Source and follow-up index

### Receiving

ACTION FOR AGENT: link the selected demo build/configuration to the existing receipt acceptance evidence and the applicable blind no-ASN retest.

- `crates/services/app-server/src/web/rpcs/receipt_commands_rpc.rs`
- `crates/libs/wms-inbound/src/service/receipt/receive/receive_blind.rs`
- `docs/mvp-certification/receiving/execution/gate-b-report.md`
- `docs/mvp-certification/receiving/execution/RCV-D-002-retest.md`
- `docs/mvp-certification/receiving/execution/CT04-blind-receiving.md`

### Putaway

ACTION FOR AGENT: reuse the existing putaway placement/reservation/exception evidence for the selected build and identify a repeatable demo journey.

- `crates/services/app-server/src/web/rpcs/putaway_rpc.rs`
- `crates/libs/wms-inventory/src/putaway/policy.rs`
- `crates/libs/wms-inventory/src/putaway/reserve.rs`

### Inventory visibility and stock movements

ACTION FOR AGENT: confirm the selected build balance inquiry and a matching movement readback against existing QA; approve a coherent guided workflow recording. Stills are supporting evidence only.

- `crates/libs/wms-inventory/src/service/inventory_inquiry.rs`
- `crates/services/app-server/src/web/rpcs/move_command_rpc.rs`
- `crates/services/app-server/src/web/rpcs/transaction_log_rpc.rs`

### Holds, lots, serials and containers

ACTION FOR AGENT: match relevant hold create/release/enforcement, lot/serial capture and container boundaries to the existing selected-build acceptance record.

- `crates/services/app-server/src/web/rpcs/hold_rpc.rs`
- `crates/libs/wms-inventory/src/service/hold.rs`
- `crates/services/app-server/src/web/rpcs/serial_commands_rpc.rs`
- `crates/services/app-server/src/web/rpcs/container_commands_rpc.rs`

### Inventory counting and adjustments

ACTION FOR AGENT: attach existing count/recount, variance and adjustment approval/posting acceptance evidence; select one normal and one exception demo case.

- `crates/libs/wms-inventory/src/service/inventory_count/observe.rs`
- `crates/libs/wms-inventory/src/service/inventory_count/accept.rs`
- `crates/libs/wms-inventory/src/service/inventory_adjustment/post.rs`

### Allocation

ACTION FOR AGENT: bind the chosen allocation walkthrough to retained scenario/build/policy evidence; do not rerun certification for website work.

- `crates/libs/wms-outbound/src/allocation/mod.rs`
- `crates/libs/wms-outbound/src/allocation/reserve.rs`
- `docs/mvp-certification/allocation/handoff/topup-20261019-24/report.md`
- `docs/mvp-certification/allocation/handoff/release-task-20261019-21/report.md`
- `docs/mvp-certification/allocation/handoff/prepush-validation-20261019-27/report.md`

### Picking

ACTION FOR AGENT: link existing selected-build picking completion/short/hold/handoff acceptance and an approved operator journey.

- `crates/services/app-server/src/web/rpcs/pick_commands_rpc.rs`
- `crates/libs/wms-outbound/src/picking/placement/short.rs`
- `crates/libs/wms-outbound/src/picking/placement/placed.rs`

### Packing and sorting

ACTION FOR AGENT: verify packing acceptance and whether a distinct sorting workflow exists against implementation and MVP acceptance evidence; retain intended scope without claiming availability.

- `crates/services/app-server/src/web/rpcs/packing_rpc.rs`
- `crates/libs/wms-outbound/src/packing/commands/carton_close.rs`
- `crates/libs/wms-outbound/src/packing/commands/source_complete.rs`
- `crates/services/app-server/src/web/rpcs/staging_rpc.rs`

### Shipping and loading

ACTION FOR AGENT: attach existing loading, exception/recovery and goods-issue evidence for the selected demo build; confirm the exact boundary shown to a buyer.

- `crates/services/app-server/src/web/rpcs/dispatch_rpc.rs`
- `crates/services/app-server/src/web/rpcs/loading_rpc.rs`
- `crates/libs/wms-outbound/src/service/load/confirm_unit.rs`
- `crates/libs/wms-outbound/src/service/load/ship.rs`

### Replenishment

ACTION FOR AGENT: reuse existing replenishment planning/completion/shortage acceptance and confirm a demonstrable pick-location scenario.

- `crates/services/app-server/src/web/rpcs/replenishment_rpc.rs`
- `crates/libs/wms-inventory/src/domain/replenishment/task_manager.rs`

### RF terminal workflows

ACTION FOR AGENT: select the real RF implementation/device/build and existing accepted operator path; replace prototype imagery with an approved real capture.

- `clients/rf-go/internal/app/web.go`
- `clients/rf-go/internal/loader/http_loader.go`
- `docs/mvp-certification/architecture/ui-rf-map.md`
- `docs/mvp-certification/receiving/execution/RCV-D-002-retest.md`

### Task Management

ACTION FOR AGENT: link existing task claim/progress/completion/lease and handoff acceptance for the chosen scenario.

- `crates/services/app-server/src/web/rpcs/task_commands_rpc.rs`
- `crates/libs/wms-tasks/src/domain/task/aggregate.rs`
- `docs/mvp-certification/architecture/backend-map.md`

### Metadata Studio and configuration

ACTION FOR AGENT: choose one existing supported configuration change with before/after, version/activation and acceptance evidence; distinguish configuration from extensions.

- `crates/services/web-ui-server/src/services/studio/module_lifecycle.rs`
- `crates/services/web-ui-server/src/services/studio/entity_wizard.rs`
- `crates/services/app-server/src/web/rpcs/metadata_rpc.rs`
- `crates/services/web-ui-server/src/meta/snapshot.rs`

### Reporting

ACTION FOR AGENT: select an actual report output and existing dataset/render acceptance; remove any unsupported statutory applicability claim.

- `crates/services/app-server/src/web/rpcs/report_definition_rpc.rs`
- `crates/services/app-server/src/web/rpcs/report_template_rpc.rs`

### Integrations

ACTION FOR AGENT: verify each proposed named connector against implementation, ownership/recovery and existing acceptance evidence before advertising it.

- `crates/services/app-server/src/web/rpcs/contexts/integration.rs`
- `crates/services/app-server/src/web/rpcs/integration_event_rpc.rs`
- `crates/services/app-server/src/web/rpcs/integration_event_delivery_rpc.rs`

### AI Harness / AI Onboarding / AI Support

No AI implementation in this website task. Keep the manifesto intact and future-labelled.


## Important bounded records

- Receiving master tracker: Package A 3 PASS / 1 FAIL / 8 BLOCKED. Historical Web Receive 2EA and the ASN EA/CS four-case hard-0% oracle are bounded PASS records. Blind no-ASN fix source exists; applicable release retest is not established here. Do not turn an old failing record into an assertion that current runtime still fails, or a merged fix into a verified completed retest.
- Allocation TOPUP-01: scoped normal API PASS at product d105fce52, retained RF and Release-to-Created references. The record explicitly says Allocation NOT Certified. Reused pre-push results (125 contract, 556 app-server, 877 core, 9 ignored) are historical evidence, not tests executed for this website task and not live warehouse certification.
- Configuration: Studio and lifecycle services exist. No approved operational before/after scenario is established by a template/version-history screenshot.
- No feature is silently removed from intended MVP scope because certification is incomplete. Publication readiness and demonstration readiness are separate columns.
