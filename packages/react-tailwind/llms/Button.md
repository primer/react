# Button

`Button` triggers an action in the current view. Use `LinkButton` when the control navigates to a URL, and `IconButton` when the control has no visible label.

Import: `import {Button} from '@primer/react-tailwind/Button'`

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'ButtonBase'`. Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Prefer LinkButton for navigation; the `link` Button variant remains available for semantic button actions rendered as inline links.
