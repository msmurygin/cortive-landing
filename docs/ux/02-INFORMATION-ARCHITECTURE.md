> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Information architecture — PROPOSED

## Main journey

Home → **Product Overview** → relevant **Product Experience** scenario → Discuss your warehouse.

Product Overview is the central product page, not a secondary resource beneath a demonstration gallery. Experience is linked from capability explanations and returns visitors to their context in the overview.

| Route | Role | First-release handling |
|---|---|---|
| `/` | What Quark is, main scope, evaluation route | Home proposal; commercial copy approval required. |
| `/product` | Central Product Overview | One new substantive page; five anchored groups: inbound, inventory, outbound, execution, platform. |
| `/screens.html` | Product Experience | Retain canonical and URL equity; replace concept/content, rename visible navigation. No new `/experience` duplicate. |
| `/wms-cost` | Budget planning and ownership questions | Existing article and calculator unchanged; contextual links. |
| `/tools/wms-readiness-assessment` | Preparation tool | Separate protected candidate; public cross-link only after its independent release approval. |
| `/vision` | Long-term manifesto and AI direction | Existing canonical and manifesto content retained. |
| `/#contact` | Existing discussion form | Same approved form, provider and privacy. No automatic assessment/budget attachment. |
| `/legal/privacy.html`, `/legal/terms.html`, `/thanks.html` | Legal / confirmation | Keep routes, content and indexing semantics. Shared shell proposal only. |

Desktop navigation: Product Overview / Product Experience / Resources / Vision / Discuss your warehouse. Resources contains Cost and, only when released, Assessment. Mobile menu exposes the same destinations.

No first-release Solutions tree, fifteen thin feature pages, new blog cluster, simulator route or duplicate `/warehouse-management-system` page. Industry-fit and connector claims need actual acceptance evidence.

## Legacy anchor preservation

Keep `/#product`, `/#evaluation` and `/#contact` meaningful. At `/screens.html`, retain `#topology` as the module-map location, `#inventory` and `#movements` as stock investigation, `#studio` as the configuration scenario. New descriptive scenario anchors may coexist. Existing incoming fragments should not silently stop working.

## SEO release boundaries

Keep existing canonicals and meaningful metadata. New Product Overview gets a single self-canonical `/product`; title focuses product capability evaluation, not WMS pricing. Preserve valid SoftwareApplication data on home and existing cost BreadcrumbList. Do not invent offers, ratings, clients or availability in schema. Sitemap additions require page release approval. Review pages remain noindex and do not become sitemap entries. A protected/local preview’s noindex configuration must never be copied onto approved public routes.
