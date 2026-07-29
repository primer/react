# Dialog

`Dialog` provides a modal surface with composable trigger and content parts.

Import: `import {Dialog} from '@primer/react-tailwind/Dialog'`

## Content props

- `backdrop`: `boolean` — Replaces the default backdrop element.
- `backdropClassName`: `string` — Classes applied to the backdrop.
- `portal`: `boolean` — Default `true`. Where the dialog is rendered in the DOM. Set `false` to keep it in place.
- `viewportClassName`: `string` — Classes applied to the element that positions the dialog within the viewport.

## CloseButton props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label`: `string` — Accessible name for the close button.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `size`: `ControlSize` — Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Migrate custom structure to the Tailwind compound parts.
