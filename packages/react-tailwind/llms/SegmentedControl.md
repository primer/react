# SegmentedControl

`SegmentedControl` is a single-choice Base UI toggle group for related view or mode choices.

Import: `import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'`

Forwards unrecognized props to Base UI's [`ToggleGroup`](https://base-ui.com/react/components/toggle-group#api-reference), so it also accepts that part's props.

## Props

- `action`: `React.ReactNode` — Supplies the action region. Takes precedence over a matching `SegmentedControl.Action` child.
- `className`: `string | ((state: ToggleGroupState) => string | undefined)`
- `fullWidth`: `ResponsiveValue<boolean>` — Stretches the control to fill its container, sharing the width between segments.
- `size`: `SegmentedControlSize` — Default `'medium'`. Height and text size of the segments.
- `variant`: `"default" | "subtle" | Partial<Record<ViewportRange, SegmentedControlVariant>>` — Default `'default'`. Visual treatment of the control. `subtle` drops the track for a lower-emphasis control. Pass an object to adapt per viewport range, for example collapsing into a menu or hiding labels on narrow viewports.

## SegmentedControl.Button

Forwards unrecognized props to Base UI's [`Toggle`](https://base-ui.com/react/components/toggle#api-reference), so it also accepts that part's props.

- `children`: `React.ReactElement[]` — Visible label. It stays on one line and truncates with a tooltip when the segment is too narrow.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `leadingVisual`: `IconSource` — Icon shown before the segment's label: a component such as an Octicon, or a rendered element.
- `value`: `string` — Value this segment selects, matched against the control's value.

## SegmentedControl.IconButton

Forwards unrecognized props to Base UI's [`Toggle`](https://base-ui.com/react/components/toggle#api-reference), so it also accepts that part's props.

- `aria-label`: `string` — Accessible name for the segment, since the icon alone conveys nothing. Shown in the tooltip by default.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `description`: `string` — Supplementary text shown in the tooltip instead of the label and exposed as the accessible description.
- `icon`: `IconSource` — Icon to render: a component such as an Octicon, or a rendered element.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the segment.
- `value`: `string` — Value this segment selects, matched against the control's value.

## SegmentedControl.Divider

- `className`: `string` — Additional classes for the divider.
- `style`: `React.CSSProperties` — Inline styles for the divider.

## SegmentedControl.Action

- `disabled`: `boolean` — Prevents the action from being activated.
- `icon`: `React.ElementType` — Icon component for the action.
- `label`: `string` — Accessible name of the action, shown in its tooltip and as the menu item text in the dropdown variant.
- `loading`: `boolean` — Shows a spinner and suppresses activation.
- `onClick`: `(() => void)` — Called when the action is activated.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.
