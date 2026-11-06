# ActionList

`ActionList` is a semantic action, menu, or listbox list composed from explicit child parts.

Import: `import {ActionList} from '@primer/react-tailwind/ActionList'`

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `disableFocusZone`: `boolean` — Default `false`. Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
- `disableItemGap`: `boolean` — Default `false`. Disable the gap between items when this list is rendered in a `NavList`.
- `heading`: `React.ReactNode`
- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Default `false`. Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`. Density and inset treatment of the list.

## ActionList.Root

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `disableFocusZone`: `boolean` — Default `false`. Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
- `disableItemGap`: `boolean` — Default `false`. Disable the gap between items when this list is rendered in a `NavList`.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.Heading` child.
- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Default `false`. Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`. Density and inset treatment of the list.

## ActionList.Item

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `active`: `boolean` — Highlights the item as the current one, without marking it selected.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `disabled`: `boolean` — Prevents activation. In a list the item also leaves the keyboard order; in a menu or listbox it stays focusable and is marked `aria-disabled`, so keyboard users can still discover it.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why. Unlike `disabled`, the item stays reachable.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated by click or keyboard.
- `selected`: `boolean` — Marks the item selected, reported through the role's selection attribute.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`. Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'default'`. Use `danger` for a destructive action.

## ActionList.LinkItem

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `active`: `boolean` — Highlights the link as the current one.
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `inactiveText`: `React.ReactNode` — Marks the link temporarily unavailable and explains why. The link renders as text until it is available.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`. Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'default'`. Use `danger` for a destructive navigation.

## ActionList.Group

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.GroupHeading` child.
- `selectionVariant`: `false | SelectionVariant` — Overrides the list's selection behaviour for this group. `false` renders the group's items without selection.
- `title`: `React.ReactNode` — Heading text for the group, as an alternative to supplying a heading child.

## ActionList.GroupHeading

Renders a [`<h3>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h3#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'h3'`. Heading element to render, so the group heading fits the surrounding document outline.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.GroupHeading.TrailingAction` child.
- `variant`: `"filled" | "subtle"` — Default `'subtle'`. Use `filled` to give the heading a background and separate it from the items above.

## ActionList.Divider

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## ActionList.Heading

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'h2'`. Heading element to render, so the list heading fits the surrounding document outline.
- `size`: `"large" | "medium" | "small"` — Title size of the heading. Omit it to keep the default large heading font size.
- `visuallyHidden`: `boolean` — Default `false`. Hides the heading visually while it still names the list for assistive technology.

## ActionList.TrailingAction

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
- `label`: `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading. Text announced to assistive technology while the link is loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.

## Differences from `@primer/react`

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList` and `ActionList.Group` accept `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
