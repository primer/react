# Button

`Button` triggers an action in the current view. Use `LinkButton` when the control navigates to a URL, and `IconButton` when the control has no visible label.

Import: `import {Button, ButtonBase} from '@primer/react-tailwind/Button'`

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'Button'`. Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## ButtonBase

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `data-component`: `string` — Default `'ButtonBase'`. Overrides the marker used to identify this element in tests and styling.

## Differences from `@primer/react`

- Prefer LinkButton for navigation; the `link` Button variant remains available for semantic button actions rendered as inline links.
- Pass counters through `count`, trailing disclosure icons through `trailingAction`, and keyboard shortcuts through a composed `KeybindingHint` in `trailingVisual`.
- Use `inactive` for the interactive visually-disabled state and add an accessible description when the reason is not otherwise evident.
- Use `render`, not `as`, when composing a Base UI trigger or other existing element. Set `nativeButton={false}` when the rendered element is not a `<button>`.
- `notificationIndicator` accepts `button` or `leadingVisual`; the dot is visual only, so include the activity in the accessible name or description.
- The `link` variant underlines only the label on hover when visuals are present, matching upstream `data-no-visuals` behavior.
- Replace `sx` and styled-system props with `className`.
