# Alignment

## From: `@primer/react`

Legacy SegmentedControl renders a single-choice control in `ul`/`li` wrappers and offers `default` and `subtle` treatments, responsive `hideLabels` and dropdown variants, `SegmentedControl.Divider` and `SegmentedControl.Action` slots, an anchor-positioned sliding knob, single-line labels that truncate with a tooltip, and legacy `aria-disabled` examples.

Ported upstream changes:

- `4266cab4c`: subtle variant, `SegmentedControl.Divider`, and `SegmentedControl.Action`.
- `88feb658c`: animated knob when switching between items.
- `f83d6a935`: subtle hover aligned with invisible buttons.
- `68019e894`, `c4189aa89`, `c9eff9ad3`: constrained label overflow. Labels stay on one line, truncate with an ellipsis, and show the full label in a tooltip.

## To: `@primer/react-tailwind`

The Base UI-backed control renders toggle buttons directly in a group. It preserves controlled and uncontrolled value selection, keyboard behavior, focus treatment, disabled and icon-only buttons, icons, counters, small and medium sizes, responsive full-width behavior, the responsive `subtle` treatment, responsive label hiding, and the responsive ActionMenu fallback. `Button` and `IconButton` replace legacy list wrappers, and `Divider` and `Action` keep the upstream part names. The knob is the group's `::before` anchored to the pressed segment, and its transition is limited to `motion-safe`. Stories mirror upstream content, including the Responsive Tests and the `SegmentedControl.Button` and `SegmentedControl.IconButton` playgrounds.

## Migration notes

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
