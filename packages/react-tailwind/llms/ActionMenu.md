# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

## Button props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Content props

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Overlay props

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Item props

- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why.
- `loading`: `boolean` — Default `false`. Shows a spinner and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `selected`: `boolean` — Marks the item as the current choice.
- `variant`: `"danger" | "default"` — Default `'default'`. Use `danger` for a destructive action.

## Description props

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'default'`. Whether the description sits beside the label or on its own line.

## Differences from `@primer/react`

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
