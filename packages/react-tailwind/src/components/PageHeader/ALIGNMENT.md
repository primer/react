# Alignment

## From: `@primer/react`

Legacy PageHeader has title, context, action, description, parent-link, and navigation slots and appears in application pages with product-specific controls.

## To: `@primer/react-tailwind`

The stable compound surface includes `ParentLink`, `TitleArea`, `Title`, `Actions`, `Description`, and `Navigation`, with root border control and documented hidden states. It remains presentational and uses explicit static narrow, regular, and wide utility maps for responsive title typography and visibility. It does not use Base UI or adopt data-specific page controls.

## Migration notes

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.
- Use each part's `hidden` option for supported responsive or conditional presentation.
- Preserve heading hierarchy when replacing Title's simple `as` element.
- `ParentLink` renders a native anchor by default; use `href` when hard navigation is intentional. For router navigation, pass the router component as `as` with its required destination and options. Props, event targets, and refs are inferred from that component, which must forward them to its interactive element.
- **Selector migration:** part identifiers use the `PageHeader.` namespace. For example, replace legacy `[data-component="PH_Actions"]` with `[data-component="PageHeader.Actions"]` and `[data-component="TitleArea"]` with `[data-component="PageHeader.TitleArea"]`. Other legacy `PH_` part identifiers likewise use their `PageHeader.<part>` names. Alternatively, put an application-owned `className` on the public part. Recheck narrow layouts after migrating host selectors; an unmatched action-width override can make a header overflow.
- `sx` and styled-system props are unsupported; use `className`.
