# Alignment

## From: `@primer/react`

Legacy NavList supports groups, headings, nested navigation, visuals, selected items, router-link adapters, reload buttons, custom expandable renderers, and product-page-shell examples.

## To: `@primer/react-tailwind`

The stable compound API provides `Heading`, `Group`, `GroupHeading`, `GroupExpand`, `List`, `Item`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`, `Description`, and Base UI-backed `SubNav` parts. NavList composes the package ActionList visual parts, keeps a trailing action outside the primary navigation link, and preserves group, heading, description, visual, inactive, and current-item presentation without product shell ownership.

## Migration notes

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- `NavList.Item`'s `leadingVisual` and `trailingVisual` supply the whole part rather than content to be wrapped, so pass `<NavList.LeadingVisual>` rather than a bare icon.
- Pass a router link component to `NavList.Item` with `as`, and its destination with `to`; the ref and `data-component` stay on the rendered link. Wrapping an item in a Next.js-style link that clones `href` and `ref` onto its child also works.
- `NavList.Item` accepts `tooltipText` for supplementary text shown in a tooltip on hover or focus and referenced by `aria-describedby`.
- `NavList.GroupExpand` reveals `items` in `pages` (all at once by default), moves focus to the first revealed item, and hides its button once everything is shown. Pass `renderItem` to render each revealed item yourself; spread the props it receives so the focus target is kept.
- `NavList.Group` renders its heading outside the list and names the list with `aria-labelledby`. A `GroupHeading` child or the `heading` region takes precedence over `title`.
- When the `primer_react_action_list_item_gap` feature flag is on, items are separated by a small gap. Pass `disableItemGap` to opt a list out.
- `NavList.Heading` is recognized even when grouped in a fragment.
- The keyboard focus ring sits flush against the item edge, matching upstream's default focus outline.
- A `NavList.SubNav` opens when one of its items is the current page (marked with `aria-current`), including after navigation moves the current item into it, unless `open` is controlled. While collapsed it marks its trigger as current, and its panel is labelled by the trigger. Detection reads `aria-current` from the items you pass, so a link component that sets `aria-current` internally needs the prop on `NavList.Item` as well.
- Compose extra actions with `NavList.TrailingAction`; it renders as a sibling of the primary link so interactive elements are never nested.
- Keep PageLayout and other application chrome outside NavList.
- Use `render` for Base UI trigger composition and `className` instead of `sx`.
