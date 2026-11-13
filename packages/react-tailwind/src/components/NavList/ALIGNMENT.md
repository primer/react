# Alignment

## From: `@primer/react`

Legacy NavList supports groups, headings, nested navigation, visuals, selected items, router-link adapters, reload buttons, custom expandable renderers, and product-page-shell examples.

## To: `@primer/react-tailwind`

The stable compound API provides `Heading`, `Group`, `GroupHeading`, `GroupExpand`, `List`, `Divider`, `Item`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`, `Description`, and Base UI-backed `SubNav` parts. NavList composes the package ActionList visual parts, keeps a trailing action outside the primary navigation link, and preserves group, heading, description, visual, inactive, and current-item presentation without product shell ownership.

## Migration notes

- `NavList` and `NavList.Group` accept `heading`, `NavList.GroupHeading` accepts `trailingAction`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it. A heading wrapper must forward the supplied `id` to `NavList.GroupHeading`.
- Move a wrapped `NavList.TrailingAction` into `NavList.Item`'s `trailingAction` prop. A wrapped action placed directly in `children` is not recognized as a part and can otherwise render inside the navigation link.
- `NavList.Item`'s `leadingVisual` and `trailingVisual` supply the whole part rather than content to be wrapped, so pass `<NavList.LeadingVisual>` rather than a bare icon.
- Pass a router link component to `NavList.Item` with `as`, its required destination such as `to`, and any router options. Custom component props, event targets, and refs are inferred from the selected component; it must forward props and the ref to the rendered link. For intentional hard navigation, use a native item with `href`. Wrapping an item in a Next.js-style link that clones `href` and `ref` onto its child also works.
- An item rendered as a native button shares the package's button reset, so browser-default borders, backgrounds, and typography do not shift its layout. Its native `type` is preserved: use `type="button"` for actions that should not submit a surrounding form.
- `NavList.Item` accepts `tooltipText` for supplementary text shown in a tooltip on hover or focus and referenced by `aria-describedby`.
- Leading visual text can contribute to the link name when no explicit name or `Description` is present; it is not automatically moved to `aria-describedby` as a legacy adapter may expect. An associated `Description` makes the generated name reference the primary label and trailing visual instead. For a status that should be described rather than named, mark its visual decorative and provide separate text through `aria-describedby` or `NavList.Description`. Check the resulting accessible name and description in the consuming experience.
- Items with `inactiveText` or `aria-disabled` retain a focusable link but suppress click and auxiliary-click activation; `inactiveText` supplies an accessible description. Browser context-menu navigation remains available because the destination is retained.
- `NavList.Item` associates its `Description` parts as accessible descriptions rather than including them in the link name. Explicit names and additional `aria-describedby` references, including tooltip text, are preserved.
- Long labels, descriptions, and trailing text wrap within the available navigation width; inline descriptions may move below the label. Custom fixed-size or non-wrapping content must provide its own responsive layout.
- `NavList.GroupExpand` reveals `items` in `pages` (all at once by default), moves focus to the first revealed item, and hides its button once everything is shown. Pass `renderItem` to render each revealed item yourself; spread the props it receives so the focus target is kept.
- `NavList.Group` renders its heading outside the list and names the list with `aria-labelledby`. A `GroupHeading` child or the `heading` region takes precedence over `title`. Use `GroupHeading as` to choose a level; the default is one below `NavList.Heading`, or `h3` without a navigation heading. A heading trailing action is rendered beside the heading and does not become part of the list name.
- When the `primer_react_action_list_item_gap` feature flag is on, items are separated by a small gap. Pass `disableItemGap` to opt a list out.
- `NavList.Heading` is recognized even when grouped in a fragment.
- Direct items and sub-navigation parts are automatically grouped into semantic lists; explicit `List` and `Group` children keep their own list boundaries. A wrapper can return `NavList.Group` directly or in a fragment, including beside `NavList.Divider`, without adding its own `li`. Use `hideDivider` on a group preceded by an explicit divider.
- The keyboard focus ring sits flush against the item edge, matching upstream's default focus outline.
- A `NavList.SubNav` opens when one of its items is the current page (marked with `aria-current`), including after navigation moves the current item into it, unless `open` is controlled. While collapsed it marks its trigger as current, and its panel is labelled by the trigger. Detection reads `aria-current` from the items you pass, so a link component that sets `aria-current` internally needs the prop on `NavList.Item` as well.
- Compose extra actions with `NavList.TrailingAction`; it renders as a sibling of the primary link so interactive elements are never nested.
- Keep PageLayout and other application chrome outside NavList.
- Use `render` for Base UI trigger composition and `className` instead of `sx`.

- **Breaking composition — expandable navigation:** legacy `NavList.Item` recognizes a nested `NavList.SubNav` and owns its expansion state. Before:

  ```tsx
  import {NavList} from '@primer/react'
  ;<NavList aria-label="Repository settings">
    <NavList.Item defaultOpen>
      Security
      <NavList.SubNav>
        <NavList.Item href="/settings/security">Overview</NavList.Item>
        <NavList.Item href="/settings/dependabot">Dependabot</NavList.Item>
      </NavList.SubNav>
    </NavList.Item>
  </NavList>
  ```

  After: replace the parent item with a `NavList.SubNav` root. Move its label into `Trigger`, its child destinations into `Panel`, and `defaultOpen` onto the root:

  ```tsx
  import {NavList} from '@primer/react-tailwind/NavList'
  ;<NavList aria-label="Repository settings">
    <NavList.SubNav defaultOpen>
      <NavList.SubNav.Trigger>Security</NavList.SubNav.Trigger>
      <NavList.SubNav.Panel>
        <NavList.Item href="/settings/security">Overview</NavList.Item>
        <NavList.Item href="/settings/dependabot">Dependabot</NavList.Item>
      </NavList.SubNav.Panel>
    </NavList.SubNav>
  </NavList>
  ```

  For controlled expansion, put `open` and `onOpenChange` on `NavList.SubNav`, not on `Item` or `Trigger`. Keep `aria-current="page"` on the current destination item. The trigger is a disclosure button, not a navigation link: do not nest the new `SubNav` inside an `Item`, wrap the trigger in an `Item`, or place a link inside the trigger. The root already renders its own `li`, and the panel renders the nested `ul`; the same composition works as a child of `NavList.List`.
