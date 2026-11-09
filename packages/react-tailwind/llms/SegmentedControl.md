# SegmentedControl

`SegmentedControl` is a single-choice Base UI toggle group for related view or mode choices.

Import: `import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`SegmentedControlProps` forwards single-choice ToggleGroup props and adds responsive `fullWidth`, a `default` or `subtle` treatment, responsive `hideLabels` or `dropdown` variants, `small` or `medium` sizing, and an `action` region. `SegmentedControl.Button` accepts `value`, `leadingVisual`, `count`, disabled state, and a state-aware `className`; `IconButton` requires an `aria-label` and `icon`, and accepts a tooltip `description` and `tooltipDirection`. `SegmentedControl.Divider` separates groups of segments, and `SegmentedControl.Action` adds a trailing action.

## Import and composition

```tsx
import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'
;<SegmentedControl aria-label="File view" defaultValue={['preview']}>
  <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
  <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
</SegmentedControl>
```

Compose `Button`, `IconButton`, and `Divider` children in author order. The root owns single selection; use `value`/`onValueChange` for controlled state or `defaultValue` for initial state. Pass one `SegmentedControl.Action` child, or the `action` prop, for a trailing action.

The selected segment's knob slides between segments when the browser supports CSS anchor positioning, and moves without animation when reduced motion is requested.

## Variants

`variant="subtle"` drops the track for a lower-emphasis control, such as one inside a toolbar. Dividers are only drawn in the subtle variant and in the dropdown menu. Pass an object to choose a variant per viewport range.

## Responsive behavior

`hideLabels` shows only each segment's icon, and `dropdown` collapses the control into an ActionMenu whose items mirror the segments, dividers, and action. `fullWidth` also accepts a responsive object.

## Actions

`SegmentedControl.Action` takes a `label`, an `icon`, `onClick`, `disabled`, and `loading`. It renders as an invisible icon button beside the segments and as the last menu item, after a divider, in the dropdown variant. Activating the menu item keeps the menu open.

## Label overflow

Labels stay on one line. When a segment is too narrow, its label truncates with an ellipsis and the full label appears in a tooltip on hover or focus. Prefer enough space to display labels in full; if labels regularly truncate, give the control more space, shorten the labels, or use a different component.

## Accessibility, forms, and validation

Give the group an accessible name. Icon-only choices require their explicit `aria-label`, which their tooltip shows; a `description` is shown in the tooltip instead and exposed as the accessible description. Disabled buttons remain visible but cannot be activated. This is a mode chooser rather than a native field; use a form control only when its selected value must be modeled separately.

## Keyboard, events, and state

Every enabled segment is a Tab stop, and Space or Enter selects the focused segment. Arrow keys, Home, and End do not move focus or change selection, matching Primer React's keyboard contract. `onValueChange` receives the selected value and details. Stable selectors are `SegmentedControl`, `SegmentedControl.Button`, `SegmentedControl.IconButton`, `SegmentedControl.Divider`, `SegmentedControl.Action`, and `SegmentedControl.Dropdown`; buttons expose `data-pressed` and `data-disabled`.

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
- Disabled segments use the native `disabled` attribute only, so they are skipped in the Tab order. Upstream uses `aria-disabled` to keep them focusable; Base UI's grouped toggle emits a redundant `aria-disabled`, which is removed.
- **Keyboard contract — matches Primer React:** every enabled segment is a Tab stop in visual order, Shift+Tab moves back through them, and Enter or Space selects the focused segment. Arrow keys, Home, and End neither move focus nor change selection, as the [Primer accessibility guidance](https://primer.style/product/components/segmented-control/accessibility) requires. The component turns off Base UI's toggle-group roving focus to do this. A consumer `onKeyDown` on the root still receives those keys. Hosts that previously passed `tabIndex={0}` to every enabled segment to restore this order can remove that override. Earlier canary builds used a single roving Tab stop with arrow-key movement; that behavior is withdrawn.
- **Known difference — selection semantics:** the published guidance describes a `<ul>` of `<li>` buttons that convey selection with `aria-current`. The canary renders Base UI's `role="group"` of toggle buttons that convey selection with `aria-pressed`. Both expose a named group and the selected state to assistive technology, but tests that query `aria-current` or list items need updating, and screen-reader announcement parity has not been verified.
