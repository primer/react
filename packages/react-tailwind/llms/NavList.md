# NavList

`NavList` is a vertical navigation primitive for settings and page navigation.

Import: `import {NavList} from '@primer/react-tailwind/NavList'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `NavList.Heading` child.

## Heading props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Heading element to render, so the level fits the surrounding document outline independently of its size.
- `size`: `"display" | "large" | "medium" | "small" | null` — Default `'small'`.
- `visuallyHidden`: `boolean` — Hides the heading visually while keeping it available to assistive technology.

## Group props

- `hideDivider`: `boolean` — Default `false`. Removes the divider drawn above the group.
- `title`: `React.ReactNode` — Heading text for the group.

## Item props

- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `NavList.Item.Description` child.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why. The item stays reachable.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `NavList.Item.LeadingVisual` child.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `NavList.Item.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `NavList.Item.TrailingVisual` child.

## TrailingAction props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order. Prevents navigation and removes the link from the keyboard order.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label`: `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading. Text announced to assistive technology while the link is loading.
- `size`: `ControlSize` — Default `'small'`. Height and text size of the button. Height and text size of the link.
- `style`: `React.CSSProperties`

## Description props

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Whether the description sits beside the label or on its own line.

## Differences from `@primer/react`

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
