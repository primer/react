# ActionBar

`ActionBar` groups related actions with `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts.

Import: `import {ActionBar} from '@primer/react-tailwind/ActionBar'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {ActionBar} from '@primer/react-tailwind'
;<ActionBar aria-label="Issue actions">
  <ActionBar.Button>Assign</ActionBar.Button>
  <ActionBar.Button>Label</ActionBar.Button>
</ActionBar>
```

Give every icon-only action an accessible name. Arrow keys move between enabled actions; menus must retain their own keyboard dismissal path.

## Overflow

Actions that do not fit move into a "More items" menu at the end of the bar, in the order they appear. A `Group` moves as a whole, and a `Menu` becomes a submenu. Overflowing originals remain in the layout for measurement but are hidden from assistive technology and skipped by keyboard navigation. If a focused action overflows, focus moves to "More items"; when the menu disappears, focus returns to that action if it is available. Focus in an overflow entry or its portaled submenu returns to the corresponding inline action when the toolbar expands. Automatic overflow restoration leaves intentionally moved outside focus unchanged. An open `ActionBar.Menu` or a `SelectPanel` anchored to an `ActionBar.Button` follows "More items" while its trigger overflows.

Only the provided ActionBar action parts register overflow entries. A custom control that does not render one of those parts, including a raw Base UI `Toolbar.Button`, does not gain an entry in "More items"; inside an overflowing `Group`, it is hidden with the group and has no overflow equivalent. `ActionBar.Button` and `ActionBar.IconButton` currently ignore their inherited `render` prop. There is no supported custom overflow composition for a controlled multi-select submenu; `ActionBar.Menu` accepts action, divider, and submenu data rather than arbitrary menu content.

A menu's explicit `returnFocusRef` takes precedence without first focusing its inline action, including across repeated resize cycles. It retains Base UI's explicit return-target contract: a connected target can receive focus even after focus moved outside. Omit `returnFocusRef` when automatic, outside-focus-preserving restoration is intended.

A configured `SelectPanel` can render an `ActionBar.Button` directly through `renderAnchor`, including when the toolbar is too narrow to show the inline action. Overflow keeps the picker anchored to "More items" and restores focus to the visible trigger on dismissal. The composition story includes width and StrictMode controls:

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
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Height and text size of the button. Defaults to the `size` of the `ActionBar`.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## ActionBar.IconButton

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label` (required): `string` — Accessible name, also used as the label when the action overflows.
- `aria-labelledby`: `string`
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, a supplied `aria-label` is repeated visually as a tooltip.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon to render: a component such as an Octicon, or a rendered element. Pass an element when the icon comes from a Server Component.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
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
- `aria-labelledby`: `string`
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, a supplied `aria-label` is repeated visually as a tooltip.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon for the menu trigger: a component such as an Octicon, or a rendered element.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `items` (required): `ActionBarMenuItemProps[]` — Items in the menu.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
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
- `returnFocusRef` maps to the Base UI menu's `finalFocus` and takes precedence over overflow focus restoration without transiently focusing the inline action, including across repeated resize cycles. This preserves Base UI's explicit-target behavior: a connected target can receive focus after focus moved outside. Omit the prop for automatic restoration that preserves outside focus. An open menu or composed SelectPanel follows "More items" when its original trigger overflows.
- When expansion removes "More items", focus in an overflow entry or any of its nested portaled submenus returns to the corresponding visible inline action. Automatic restoration does not redirect intentionally moved outside focus, including when it changes after removal but before queued restoration. No consumer resize handler or keyboard override is needed.
- Icons accept either a component such as an Octicon or a rendered element.
- `sx` and styled-system props are unsupported; use `className` on the appropriate local part.
- The default outer inset uses Primer's 16px size token without the generic `px-4` class, avoiding a known collision with a legacy host utility of the same name. `flush` and consumer padding classes still override it. This does not isolate other utilities from host CSS; see the package's CSS integration guidance.
- Compose a configured `SelectPanel` trigger directly with `renderAnchor={() => <ActionBar.Button>Projects</ActionBar.Button>}`. Part refs remain attached across ordinary renders, and overflow dispatch invokes the latest action handler without repeatedly registering a new handler identity. The narrow composition is covered with React 19 and Base UI 1.8 as well as the package's Base UI 1.6 environment; no external-trigger adapter, custom arrow handler, or dependency patch is required. Overflow activation, selection, resizing with an open picker, and return focus remain package-owned.
- Custom controls that do not render an ActionBar action part do not register an overflow entry, even when wrapped in a Base UI `Toolbar.Button`; an overflowing `Group` hides them without an equivalent in "More items". `ActionBar.Button` and `ActionBar.IconButton` currently ignore their inherited `render` prop. A controlled multi-select submenu needs an alternate overflow composition that the current `Menu` data API does not provide.
