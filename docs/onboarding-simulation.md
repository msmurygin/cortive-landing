# Guided mobile onboarding demo

The `/try` page is a marketing simulation, not a warehouse provisioning system. Its default General Distribution profile includes an explicitly selected expiry-dated milk line, pallets/cases/units, mandatory barcode checks, directed putaway, single-order picking and a packing check. Ordinary goods skip expiry capture. Serial or wave requirements are recorded, but this distribution sample does not claim to validate those workflows.

## States and transitions

State and transition rules live in `assets/workflow-demo/onboarding-machine.js`. The device renderer is `onboarding-device.js`; browser orchestration is `onboarding-workspace.js`. None of the state transitions depend on model-generated code or arbitrary model actions.

| State | Visitor action | Next state or effect |
| --- | --- | --- |
| `profile` | Confirm facts with choices, free AI reply or General Distribution sample | Facts remain visible; all seven categories must be known |
| `profile` | Prepare mobile processes | `configuration` |
| `configuration` | Five local preparation checks | `receiving` |
| `receiving` | Scan pallet, test unknown barcode, apply recovery control, rescan product, confirm 48 EA, optionally capture expiry, confirm receipt | `receiving_review`; 48 EA at dock |
| `receiving_review` | Review Before/After and continue | `putaway` |
| `putaway` | Scan LPN, test wrong bin, require target scan, scan A-01-02, confirm | `putaway_review`; intact 48 EA LPN stored |
| `putaway_review` | Review Before/After and continue | `picking` |
| `picking` | Scan source, test wrong SKU, require product verification, scan product, confirm quantity, complete both lines | `picking_review`; 12 EA of first SKU and 6 EA of second SKU picked; sample order sent to Packing |
| `picking_review` | Continue | `customize` |
| `customize` | Change device preferences | Immediate presentation change; no stock movement |
| `customize` | Continue | `permissions` |
| `permissions` | Inspect the three-process operator menu, then continue | `result` |
| `result` | Review configuration | Read-only local dialog |
| `result` | Approve onboarding result | `approved`; local acknowledgement only |
| `result` / `approved` | Leave work email | Existing consented enquiry dialog; no automatic send |
| `result` / `approved` | Replay | Reset stock, errors and passes; preserve confirmed facts; prepare again |

A wrong scan cannot advance a step or change stock. Controlled error tests are labelled as such. A proposed correction must be applied before retry. The deliberately incomplete candidate policies are test variants, not deployed customer settings. There is no uncontrolled bypass or production activation action. FEFO is explained as expiry-based stock selection, not as evidence that a storage location is suitable.

## Data and AI boundaries

`/api/engine-chat` accepts `experience: onboarding` and routes to the bounded adapter in `lib/onboarding-ai.js`. The model returns a short conversational reply, seven nullable enum answers, a bounded detected language and a high/low language confidence. It cannot return process execution commands. Facts extracted during discovery are validated against the same enum choices as the UI. The controlled demonstration remains available when AI is unavailable.

The prompt lives in `api/_onboarding-system.md`. Only messages explicitly sent by the visitor, confirmed profile values and an optionally attached JPEG/PNG/PDF are transmitted to the AI endpoint. Button answers and RF scans do not trigger model calls. Uploaded files are optional context; no claim is made that a plan generated this guided sample topology. Reset/cancellation ignores late replies. No browser storage or new analytics is added.

The final email CTA reuses the existing enquiry endpoint and contact-consent dialog. It sends contact details and the sample warehouse/product setup under the existing whitelist. It does not send the chat, attached plans, Assessment responses or serial values. Opening the dialog is not submission, and approval of the demo does not send an enquiry.

## Language and scan feedback

The guided interface supports English, Russian, Greek, Bulgarian, Serbian, Romanian and Albanian presentation. English is the default regardless of the browser language. A supported `?lang=` parameter explicitly selects the initial locale for regional links. There is no language dropdown. The model detects a clear natural-language message and offers a switch when its language differs from the interface. Accepting that offer changes the guide, model reply language and both terminal views together without resetting facts, stock, scans or progress. Ambiguous short answers and barcodes do not trigger a switch; declining keeps the current interface language. Identifiers and visitor input remain untouched. Earlier AI responses in another selected language are replaced by a prompt to ask again, rather than mixing translated and untranslated assistant copy.

Accepted scans are recorded separately from expected sample values. Actual scanned fields remain “Awaiting scan” until accepted. A pinned feedback panel above the scroll area shows the accepted code, a blocked scan, or an applied correction. The Retry action remains in the fixed device footer. Terminal mode renders text screens at every stage, including discovery, customization, permissions and results.

## Future API seam

Replace the sample action adapter in the browser controller with authenticated task calls while retaining typed actions and validation. Keep writes, real permission checks, real inventory, activation and durable configuration storage outside this marketing state machine. `submit`, `applyCorrection`, `next` and the conversational adapter are separate seams; renderer components do not make warehouse requests.

## Verification

`node --test tests/*.test.cjs` covers the full three-process journey, rejected scans, blocked transitions, quantity and expiry checks, unit-by-unit capture, shared WebRF/Terminal state, limited menu, replay, safe AI extraction and the unchanged enquiry whitelist. Local browser QA must separately check controls, responsive layout, AI service responses and the final form without sending test mail unless authorized.
