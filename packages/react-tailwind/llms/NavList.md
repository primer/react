# NavList

`NavList` is a vertical navigation primitive for settings and page navigation.

Import: `import {NavList} from '@primer/react-tailwind/NavList'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {NavList} from '@primer/react-tailwind/NavList'
;<NavList aria-label="Repository settings">
  <NavList.List>
    <NavList.Item href="/settings/general" aria-current="page">
      General
    </NavList.Item>
  </NavList.List>
</NavList>
```

Use `NavList.SubNav.Trigger` and `NavList.SubNav.Panel` for expandable sections. Compose item metadata with `LeadingVisual`, `TrailingVisual`, and `Description`; use `TrailingAction` for a secondary interactive action that must remain outside the primary link. Give the navigation an accessible name, or include `NavList.Heading` to name it automatically, and preserve `aria-current` on the current destination.

Legacy `<NavList.Item defaultOpen><NavList.SubNav>…</NavList.SubNav></NavList.Item>` is a breaking composition change: replace the parent item with `NavList.SubNav defaultOpen`, move its label into `NavList.SubNav.Trigger`, and move its destinations into `NavList.SubNav.Panel`. The before/after migration example shows the complete replacement. The trigger is a disclosure button, not another navigation item or link.

An item's `Description` is exposed as an accessible description. When present, it causes the component to generate a name from the primary label and trailing visual. Explicit `aria-label` and `aria-labelledby` names and additional `aria-describedby` references are preserved. Pass a wrapped description through the `description` region.

Long labels and trailing text wrap within the available navigation width; inline descriptions can move below the label. Custom fixed-size or non-wrapping content must provide its own responsive layout.

`LeadingVisual` is not automatically hidden from assistive technology. Without an explicit name or an associated `Description`, text inside it can become part of the link's name; an associated `Description` causes the generated name to reference the primary label and trailing visual instead. For status that belongs in the description, hide the decorative visual from assistive technology and reference separate status text with `aria-describedby`, or use a `Description`. Verify the resulting name and description in the target experience.

Use `NavList.GroupHeading as="h2"` (or another appropriate heading level) to fit a group into the page outline. By default, a group heading is one level below `NavList.Heading`, or `h3` when there is no navigation heading. Add `NavList.GroupHeading.TrailingAction` for an action beside, rather than inside, the heading. Use `NavList.Divider` to separate entries or groups; pass `hideDivider` to a following group when providing the divider yourself.

For a custom heading wrapper, pass it through the group's `heading` prop and forward the supplied `id` to `NavList.GroupHeading` so the group list remains named. A group wrapper may return `NavList.Group` directly or in a fragment, including alongside a divider; do not add another `li` around the group.

Pass a router link component with `as` and its required destination and options, such as `to`, `preload`, or `reloadDocument`. Props and refs follow the selected component, which must forward them to its interactive element. For intentional hard navigation, use a native item with `href`. Use `tooltipText` for supplementary text shown in a tooltip on hover or focus. `NavList.GroupExpand` reveals more `items` behind a "Show more" button, optionally across `pages`, and focuses the first revealed item; pass `renderItem` to render each item yourself. When the `primer_react_action_list_item_gap` feature flag is on, items are separated by a small gap; pass `disableItemGap` to opt out.

For a typed wrapper, use `NavListItemProps<typeof RouterLink>` to include the router's props. Unparameterized `NavListItemProps` and `React.ComponentProps<typeof NavList.Item>` retain the legacy anchor-shaped props and broadly typed `as`.

For an action rather than navigation, `NavList.Item as="button"` renders a native button. Pass `type="button"` for an action that must not submit a surrounding form; without a type, native button submission behavior applies.

Items marked with `inactiveText` or `aria-disabled` remain focusable but suppress click and auxiliary-click activation. `inactiveText` is also exposed as a description. These items retain their destination, so browser context-menu navigation remains available.

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `disableItemGap`: `boolean` — Default `false`. Disable the gap between items when the item gap feature is enabled.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `NavList.Heading` child.

## NavList.Heading

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Heading element to render, so the level fits the surrounding document outline independently of its size.
- `size`: `"display" | "large" | "medium" | "small" | null` — Default `'small'`.
- `visuallyHidden`: `boolean` — Hides the heading visually while keeping it available to assistive technology.

## NavList.Group

Renders a [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `NavList.GroupHeading` child.
- `hideDivider`: `boolean` — Default `false`. Removes the divider drawn above the group.
- `title`: `React.ReactNode` — Heading text for the group. A `NavList.GroupHeading` child takes precedence.

## NavList.GroupExpand

- `items` (required): `NavListGroupExpandItem[]` — Items revealed by the button.
- `label`: `string` — Default `'Show more'`. Text of the button that reveals more items.
- `pages`: `number` — Default `0`. Number of reveals needed to show every item. `0` reveals them all at once.
- `renderItem`: `((item: NavListGroupExpandItem) => React.ReactNode)` — Default `item => <NavList.Item {...item}>{item.text}</NavList.Item>`. Renders a revealed item, in place of the default `NavList.Item`. Spread the item's props to keep focus management.

## NavList.GroupHeading

Renders a [`<h3>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h3#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `HeadingLevel` — Heading element to render, so the level fits the surrounding document outline.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `NavList.GroupHeading.TrailingAction` child.

## NavList.GroupHeading.TrailingAction

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'button'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon` (required): `(React.ElementType | undefined) & React.ElementType` — Icon component to render. Icon rendered inside the heading's trailing action.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.
- `type`: `string` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## NavList.List

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.Divider

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `As` — Default `'a'`. Element or component supplied by the wrapper.
- `className`: `string`
- `description`: `React.ReactNode`
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why. The item stays reachable.
- `leadingVisual`: `React.ReactNode`
- `ref`: `Ref<HTMLAnchorElement>`
- `to`: `string`
- `tooltipText`: `string` — Supplementary text shown in a tooltip when the item is hovered or focused.
- `trailingAction`: `React.ReactNode`
- `trailingVisual`: `React.ReactNode`

## NavList.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.TrailingAction

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'button'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.
- `type`: `string` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## NavList.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## NavList.SubNav

Forwards unrecognized props to Base UI's [`Collapsible.Root`](https://base-ui.com/react/components/collapsible#root), so it also accepts that part's props.

## NavList.SubNav.Trigger

Forwards unrecognized props to Base UI's [`Collapsible.Trigger`](https://base-ui.com/react/components/collapsible#trigger), so it also accepts that part's props.

## NavList.SubNav.Panel

Forwards unrecognized props to Base UI's [`Collapsible.Panel`](https://base-ui.com/react/components/collapsible#panel), so it also accepts that part's props.

## Differences from `@primer/react`

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
