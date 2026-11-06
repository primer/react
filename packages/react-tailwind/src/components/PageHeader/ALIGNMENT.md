# Alignment

## From: `@primer/react`

Legacy PageHeader has title, context, action, description, parent-link, and navigation slots and appears in application pages with product-specific controls.

## To: `@primer/react-tailwind`

The stable compound surface includes `ParentLink`, `TitleArea`, `Title`, `Actions`, `Description`, and `Navigation`, with root border control and documented hidden states. It remains presentational and uses explicit static narrow, regular, and wide utility maps for responsive title typography and visibility. It does not use Base UI or adopt data-specific page controls.

## Migration notes

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.
- Use each part's `hidden` option for supported responsive or conditional presentation.
- Preserve heading hierarchy when replacing Title's simple `as` element.
- `sx` and styled-system props are unsupported; use `className`.
