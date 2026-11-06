# NavList

`NavList` is a vertical navigation primitive for settings and page navigation.

Import: `import {NavList} from '@primer/react-tailwind/NavList'`

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

## NavList.List

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render in place of the anchor, such as a router's link component.
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `NavList.Description` child.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why. The item stays reachable.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `NavList.LeadingVisual` child.
- `to`: `string` — Route the item links to, forwarded to the element supplied with `as` for router integration.
- `tooltipText`: `string` — Supplementary text shown in a tooltip when the item is hovered or focused.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `NavList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `NavList.TrailingVisual` child.

## NavList.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## NavList.TrailingAction

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'button'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order. Prevents navigation and removes the link from the keyboard order.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading. Text announced to assistive technology while the link is loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.
- `type`: `string` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## NavList.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## NavList.SubNav

Forwards unrecognized props to Base UI's [`Collapsible.Root`](https://base-ui.com/react/components/collapsible#root), so it also accepts that part's props.

## Differences from `@primer/react`

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- `NavList.Item`'s `leadingVisual` and `trailingVisual` supply the whole part rather than content to be wrapped, so pass `<NavList.LeadingVisual>` rather than a bare icon.
- Pass a router link component to `NavList.Item` with `as`, and its destination with `to`; the ref and `data-component` stay on the rendered link. Wrapping an item in a Next.js-style link that clones `href` and `ref` onto its child also works.
- `NavList.Item` accepts `tooltipText` for supplementary text shown in a tooltip on hover or focus and referenced by `aria-describedby`.
- `NavList.GroupExpand` reveals `items` in `pages` (all at once by default), moves focus to the first revealed item, and hides its button once everything is shown. Pass `renderItem` to render each revealed item yourself; spread the props it receives so the focus target is kept.
- `NavList.Group` renders its heading outside the list and names the list with `aria-labelledby`. A `GroupHeading` child or the `heading` region takes precedence over `title`.
- When the `primer_react_action_list_item_gap` feature flag is on, items are separated by a small gap. Pass `disableItemGap` to opt a list out.
- `NavList.Heading` is recognized even when grouped in a fragment.
- Direct items and sub-navigation parts are automatically grouped into semantic lists; explicit `List` and `Group` children keep their own list boundaries.
- The keyboard focus ring sits flush against the item edge, matching upstream's default focus outline.
- A `NavList.SubNav` opens when one of its items is the current page (marked with `aria-current`), including after navigation moves the current item into it, unless `open` is controlled. While collapsed it marks its trigger as current, and its panel is labelled by the trigger. Detection reads `aria-current` from the items you pass, so a link component that sets `aria-current` internally needs the prop on `NavList.Item` as well.
- Compose extra actions with `NavList.TrailingAction`; it renders as a sibling of the primary link so interactive elements are never nested.
- Keep PageLayout and other application chrome outside NavList.
- Use `render` for Base UI trigger composition and `className` instead of `sx`.
