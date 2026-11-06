# IconButton

`IconButton` is a button whose only content is an icon. `aria-label` is required, because the control has no visible text.

Import: `import {IconButton} from '@primer/react-tailwind/IconButton'`

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label` (required): `string` — Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'IconButton'`. Overrides the marker used to identify this element in tests and styling.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, the tooltip repeats `aria-label` visually.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon to render: a component such as an Octicon, or a rendered element. Pass an element when the icon comes from a Server Component.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "icon"` — Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Supply an accessible name with `aria-label`; it is always kept on the button, so the label tooltip is visual only.
