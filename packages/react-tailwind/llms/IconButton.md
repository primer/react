# IconButton

`IconButton` is a button whose only content is an icon. It requires an accessible name from either `aria-label` or `aria-labelledby`, because the control has no visible text.

Import: `import {IconButton} from '@primer/react-tailwind/IconButton'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {IconButton} from '@primer/react-tailwind/IconButton'
;<IconButton aria-label="Add item" icon={PlusIcon} />
```

## Composition

`IconButton` composes the local `Button` API and owns its icon visual. Use `IconLinkButton` instead when the icon navigates to a URL.

## Accessibility

Provide `aria-label` or reference existing label text with `aria-labelledby`; the icon itself is decorative. When only `aria-labelledby` is provided, supply `description` for a description tooltip or use an enclosing label Tooltip for visible tooltip text. See the [ActionMenu composition](./ActionMenu.md) for a tooltip-labelled menu trigger.

For loading, `IconButton` shares Button's status and external-announcer contract. Set `loadingAnnouncement=""` when the host announces the loading state; the tooltip description remains available.

By default, icon controls are at least 28 CSS pixels square, even with a reduced root font size. Custom size utilities replace this default; ensure the resulting pointer target is adequately sized or spaced.

When both naming props are supplied, `aria-labelledby` provides the accessible name and `aria-label` provides the default label tooltip when there is no `description`. Include the tooltip text in the referenced name so speech-input users can activate the control by its visible label.

Use `tooltipDirection` and surrounding spacing to keep the visual tooltip from covering nearby controls. Placement can flip when space is limited; see [Tooltip placement](./Tooltip.md#placement-and-delay).

## Data attributes

The root is identified as `data-component="IconButton"`. When it has a tooltip, its `data-tooltip-trigger` token identifies the visual popup as described in [Tooltip](./Tooltip.md#finding-the-visual-popup); it does not indicate whether that popup is visible.

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label`: `string`
- `aria-labelledby`: `string`
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'IconButton'`. Overrides the marker used to identify this element in tests and styling.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, a supplied `aria-label` is repeated visually as a tooltip.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `icon` (required): `IconSource` — Icon to render: a component such as an Octicon, or a rendered element. Pass an element when the icon comes from a Server Component.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "icon"` — Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Supply an accessible name with `aria-label` or `aria-labelledby`. An `aria-label` supplies the visual label tooltip; an external label can instead be paired with `description` or an enclosing Tooltip.
- With the default tooltip, `keybindingHint` is an accessible description, not part of the button's accessible name. Legacy 38.44.0 TooltipV2 could name the button from tooltip text plus its hidden shortcut hint. Migrate exact-name queries and assertions to the supplied name, and check the shortcut separately as a description; do not append it to the label just to preserve a test. The host issue-creation fullscreen control reports name "Open issue creation in fullscreen" and macOS description "(command shift enter)" with working activation. That host evidence does not establish manual screen-reader announcement parity.
- Migrate navigation to `IconLinkButton`, not an IconButton with a legacy `as: 'a'` hidden in a spread or wrapper. Inspect computed prop factories and legacy `Partial<ButtonProps>`/IconButton prop aliases as well as JSX attributes; TypeScript can accept stale spread keys without preserving anchor semantics. Keep IconButton for actions, and retain the link's accessible name, destination, target, modified-click behavior, and anchor-root ref semantics on navigation branches. The Button alignment guide covers detection and branch-specific prop/ref migration.
- **Unsupported link substitute:** `IconButton render={<a href="..." />} nativeButton={false} role="link"` still composes Base UI button activation; changing the element and role does not make it equivalent to IconLinkButton. In the host's installed `95baea6` package with React 19.2 and Base UI 1.8, a focused Chromium reproduction dispatched a click on Space keyup, unlike a native link. The host reports that IconLinkButton restores native Space/Enter behavior. This evidence is limited to Chromium, not cross-browser or assistive-technology parity; do not add a key-handler workaround to treat the button composition as a navigation contract.
- The default tooltip is skipped when `unsafeDisableTooltip` is set, when neither a label nor a description is available, or inside an external Tooltip, and stays closed while disabled or while an attached popup is expanded.
- Compose `ActionMenu.Trigger render={<IconButton … />}` to use it as a menu anchor.
- An enabled, mounted Tooltip provides a reference target in server-rendered HTML even when its visual popup is portaled. Use an independent label if the tooltip can be disabled or removed, and follow Tooltip's server-rendering guidance for custom content.
- `notificationIndicator` accepts `button` or `icon`; the dot is visual only, so include the activity in `aria-label` or a description.
- Pass a rendered element such as `icon={<HeartIcon />}` when the icon comes from a Server Component.
- Icon controls have a 28 CSS pixel default size floor, which can increase their dimensions with a smaller root font. Consumer sizing utilities can override it.
- Use `className`, not `sx` or styled-system props.
- When `aria-labelledby` is passed, the redundant `aria-label` is dropped from the button; `aria-label` still provides the default tooltip text.
