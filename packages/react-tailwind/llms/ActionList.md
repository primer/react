# ActionList

`ActionList` is a semantic action, menu, or listbox list composed from explicit child parts.

Import: `import {ActionList} from '@primer/react-tailwind/ActionList'`

## Props

- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Default `false`. Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`. Density and inset treatment of the list.

## Root props

- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Default `false`. Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`. Density and inset treatment of the list.

## Item props

- `active`: `boolean` — Highlights the item as the current one, without marking it selected.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Item.Description` child.
- `disabled`: `boolean` — Prevents activation and removes the item from the keyboard order.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why. Unlike `disabled`, the item stays reachable.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.Item.LeadingVisual` child.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated by click or keyboard.
- `selected`: `boolean` — Marks the item selected, reported through the role's selection attribute.
- `size`: `"large" | "medium"` — Default `'medium'`. Row height. Use `large` for a more comfortable touch target.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.Item.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.Item.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'inset'`. Use `danger` for a destructive action.

## LinkItem props

- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.LinkItem.Description` child.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LinkItem.LeadingVisual` child.
- `selected`: `boolean` — Marks the link as the current one.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.LinkItem.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.LinkItem.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'inset'`. Use `danger` for a destructive navigation.

## Group props

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.Group.Heading` child.
- `selectionVariant`: `SelectionVariant` — Overrides the list's selection behaviour for this group.
- `title`: `React.ReactNode` — Heading text for the group, as an alternative to supplying a heading child.

## GroupHeading props

- `as`: `React.ElementType` — Default `'h3'`. Heading element to render, so the group heading fits the surrounding document outline.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.GroupHeading.TrailingAction` child.
- `variant`: `"filled" | "subtle"` — Default `'inset'`. Use `filled` to give the heading a background and separate it from the items above.

## Description props

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inset'`. Whether the description sits beside the label or on its own line.

## Heading props

- `as`: `React.ElementType` — Default `'h3'`. Heading element to render, so the list heading fits the surrounding document outline.
- `size`: `"medium" | "small"` — Default `'medium'`. Visual size of the heading.

## TrailingAction props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'h3'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order. Prevents navigation and removes the link from the keyboard order.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label`: `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading. Text announced to assistive technology while the link is loading.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button. Height and text size of the link.
- `style`: `React.CSSProperties`

## Differences from `@primer/react`

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList.Group` accepts `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
