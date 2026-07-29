# ActionBar

`ActionBar` groups related actions with `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts.

Import: `import {ActionBar} from '@primer/react-tailwind/ActionBar'`

## Props

- `flush`: `boolean` — Default `false`. Removes the bar's outer padding so it aligns with surrounding content.
- `gap`: `"condensed" | "none"` — Default `'condensed'`. Spacing between items.
- `size`: `ControlSize` — Default `'medium'`. Size of the bar's controls.

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
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## IconButton props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label`: `string` — Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon`: `React.ElementType` — Default `KebabHorizontalIcon`. Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.

## Menu props

- `aria-label`: `string` — Accessible name for the overflow menu trigger.
- `icon`: `React.ElementType` — Default `KebabHorizontalIcon`. Icon rendered on the overflow menu's trigger.
- `items`: `ActionBarMenuItem[]` — Items shown in the overflow menu.

## Differences from `@primer/react`

- Replace `overflowIcon` with an explicit `ActionBar.Menu`; preserve the action order and focus behavior in consumer code.
