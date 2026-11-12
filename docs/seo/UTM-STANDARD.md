# Quark campaign URL standard

Use lowercase values with underscores. Never put email addresses, company names,
warehouse details, assessment answers or other personal data in UTM parameters.

## Required parameters

- `utm_source`: the platform or publication, for example `linkedin`, `reddit`,
  `youtube`, `logistika_btp`.
- `utm_medium`: one of `organic_social`, `referral`, `email`, `video`.
- `utm_campaign`: a durable initiative name, for example `cee_early_access`,
  `3pl_billing`, `wms_cost_guide`.
- `utm_content`: optional placement or creative identifier, for example
  `company_profile`, `founder_post`, `billing_post_01`.

## LinkedIn

Company profile website:

`https://quark.build/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=cee_early_access&utm_content=company_profile`

Product link in a post:

`https://quark.build/product?utm_source=linkedin&utm_medium=organic_social&utm_campaign=product_workflows&utm_content=company_post`

3PL billing post:

`https://quark.build/#billing?utm_source=linkedin&utm_medium=organic_social&utm_campaign=3pl_billing&utm_content=company_post`

## Editorial and community links

Use the publication or community as the source and the actual placement as the
content value. Examples:

`https://quark.build/wms-cost?utm_source=example_publication&utm_medium=referral&utm_campaign=wms_cost_guide&utm_content=editorial_article`

`https://quark.build/product?utm_source=reddit&utm_medium=organic_social&utm_campaign=warehouse_community&utm_content=technical_comment`

Do not add UTMs to internal links between Quark pages. Google Analytics already
attributes those visits within the same session.
