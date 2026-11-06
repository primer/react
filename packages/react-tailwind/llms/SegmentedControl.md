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

- `children`: `React.ReactNode` — Visible label. It stays on one line and truncates with a tooltip when the segment is too narrow.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `leadingVisual`: `IconSource` — Icon shown before the segment's label: a component such as an Octicon, or a rendered element.
- `value` (required): `string` — Value this segment selects, matched against the control's value.

## SegmentedControl.IconButton

Forwards unrecognized props to Base UI's [`Toggle`](https://base-ui.com/react/components/toggle#api-reference), so it also accepts that part's props.

- `aria-label` (required): `string` — Accessible name for the segment, since the icon alone conveys nothing. Shown in the tooltip by default.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `description`: `string` — Supplementary text shown in the tooltip instead of the label and exposed as the accessible description.
- `icon` (required): `IconSource` — Icon to render: a component such as an Octicon, or a rendered element.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the segment.
- `value` (required): `string` — Value this segment selects, matched against the control's value.

## SegmentedControl.Divider

- `className`: `string` — Additional classes for the divider.
- `style`: `React.CSSProperties` — Inline styles for the divider.

## SegmentedControl.Action

- `disabled`: `boolean` — Prevents the action from being activated.
- `icon` (required): `React.ElementType` — Icon component for the action.
- `label` (required): `string` — Accessible name of the action, shown in its tooltip and as the menu item text in the dropdown variant.
- `loading`: `boolean` — Shows a spinner and suppresses activation.
- `onClick`: `(() => void)` — Called when the action is activated.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.
- Children may be grouped in fragments; only `SegmentedControl.Button`, `IconButton`, `Divider`, and `Action` children are rendered.
- Responsive `hideLabels` and `dropdown` variants retain the Primer viewport-range API while composing the package ActionMenu for dropdown behavior.
- Use real `disabled` controls instead of a legacy `aria-disabled` presentation example.
- `leadingVisual` and `IconButton` `icon` accept a component or a rendered element.
- Pass the trailing action as a `SegmentedControl.Action` child or through the `action` region prop. In the dropdown variant it becomes the last menu item, keeps the menu open when activated, and its stable selector is `ActionMenu.Item`.
- `IconButton` shows `aria-label` in a label tooltip, or `description` in a description tooltip, placed with `tooltipDirection`. It also keeps the package's `count` prop.
- The truncation tooltip is a label tooltip that only enables while the label is truncated; upstream uses a description tooltip.
- A responsive `variant` object without a `wide` value uses `default` for wide viewports; upstream inherits the `regular` value for `hideLabels` and `dropdown`.
- Upstream's `Dev` stories (constrained controls and a changing label) are not ported.
- `sx` and styled-system props are unsupported.
- Disabled segments use the native `disabled` attribute only. Upstream uses `aria-disabled` to keep them focusable; Base UI's toggle group skips disabled items during roving focus, so the redundant `aria-disabled` it emits is removed.
