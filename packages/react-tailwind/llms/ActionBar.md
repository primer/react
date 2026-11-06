# ActionBar

`ActionBar` groups related actions with `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts.

Import: `import {ActionBar} from '@primer/react-tailwind/ActionBar'`

Forwards unrecognized props to Base UI's [`Toolbar.Root`](https://base-ui.com/react/components/toolbar#root), so it also accepts that part's props.

## Props

- `flush`: `boolean` — Default `false`. Removes the bar's outer padding so it aligns with surrounding content.
- `gap`: `"condensed" | "none"` — Default `'condensed'`. Spacing between items.
- `size`: `ControlSize` — Default `'medium'`. Size of the bar's controls.

## ActionBar.Button

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Height and text size of the button. Defaults to the `size` of the `ActionBar`.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## ActionBar.IconButton

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label` (required): `string` — Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, the tooltip repeats `aria-label` visually.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon to render: a component such as an Octicon, or a rendered element. Pass an element when the icon comes from a Server Component.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "icon"` — Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Height of the button. Defaults to the `size` of the `ActionBar`.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.

## ActionBar.Group

Forwards unrecognized props to Base UI's [`Toolbar.Group`](https://base-ui.com/react/components/toolbar#group), so it also accepts that part's props.

## ActionBar.Divider

Forwards unrecognized props to Base UI's [`Toolbar.Separator`](https://base-ui.com/react/components/toolbar#separator), so it also accepts that part's props.

## ActionBar.Menu

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label` (required): `string` — Accessible name for the menu trigger, also used as its label when the menu overflows.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, the tooltip repeats `aria-label` visually.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon for the menu trigger: a component such as an Octicon, or a rendered element.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `items` (required): `ActionBarMenuItemProps[]` — Items in the menu.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "icon"` — Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the activity in the accessible name or description.
- `overflowIcon`: `IconSource` — Icon shown beside the menu's label in the "More items" menu, or `'none'` to omit it. Defaults to `icon`.
- `returnFocusRef`: `RefObject<HTMLElement | null>` — Element that receives focus when the menu closes. Defaults to the trigger.
- `size`: `ControlSize` — Height of the button. Defaults to the `size` of the `ActionBar`.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.

## Differences from `@primer/react`

- `ActionBar.Menu` requires `icon`, matching upstream. Use `overflowIcon` to change, or `'none'` to hide, the icon shown in the "More items" menu.
- `returnFocusRef` maps to the Base UI menu's `finalFocus` and takes precedence over overflow focus restoration. An open menu or composed SelectPanel follows "More items" when its original trigger overflows.
- Icons accept either a component such as an Octicon or a rendered element.
- `sx` and styled-system props are unsupported; use `className` on the appropriate local part.
