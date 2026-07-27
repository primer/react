# Alignment

## From: `@primer/react`

Legacy NavList supports groups, headings, nested navigation, visuals, selected items, router-link adapters, reload buttons, custom expandable renderers, and product-page-shell examples.

## To: `@primer/react-tailwind`

The stable compound API provides `Heading`, `Group`, `GroupHeading`, `List`, `Item`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`, `Description`, and Base UI-backed `SubNav` parts. NavList composes the package ActionList visual parts, keeps a trailing action outside the primary navigation link, and preserves group, heading, description, visual, inactive, and current-item presentation without framework adapters or product shell ownership.

## Migration notes

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- `NavList.Item`'s `leadingVisual` and `trailingVisual` supply the whole part rather than content to be wrapped, so pass `<NavList.LeadingVisual>` rather than a bare icon.
- Use native `href` anchors; router adapters and reload-button APIs are unsupported.
- `NavList.Heading` is recognized even when grouped in a fragment.
- Compose extra actions with `NavList.TrailingAction`; it renders as a sibling of the primary link so interactive elements are never nested.
- Keep PageLayout and other application chrome outside NavList.
- Use `render` for Base UI trigger composition and `className` instead of `sx`.
