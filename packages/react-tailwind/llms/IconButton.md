# IconButton

`IconButton` is a button whose only content is an icon. `aria-label` is required, because the control has no visible text.

Import: `import {IconButton} from '@primer/react-tailwind/IconButton'`

## Props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label`: `string` — Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'IconButton'`. Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Supply an accessible name with `aria-label`; use native `title` only as supplemental text.
