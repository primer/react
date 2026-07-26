# Alignment

## From: `@primer/react`

Legacy NavList supports groups, headings, nested navigation, visuals, selected items, router-link adapters, reload buttons, custom expandable renderers, and product-page-shell examples.

## To: `@primer/react-tailwind`

The stable compound API provides `Heading`, `Group`, `GroupHeading`, `List`, `Item`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`, `Description`, and Base UI-backed `SubNav` parts. NavList composes the package ActionList visual parts, keeps a trailing action outside the primary navigation link, and preserves group, heading, description, visual, inactive, and current-item presentation without framework adapters or product shell ownership.

## Migration notes

- Use native `href` anchors; router adapters and reload-button APIs are unsupported.
- Compose extra actions with `NavList.TrailingAction`; it renders as a sibling of the primary link so interactive elements are never nested.
- Keep PageLayout and other application chrome outside NavList.
- Use `render` for Base UI trigger composition and `className` instead of `sx`.
