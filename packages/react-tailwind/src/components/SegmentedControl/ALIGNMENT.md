# Alignment

## From: `@primer/react`

Legacy SegmentedControl renders a single-choice control in `ul`/`li` wrappers and offers responsive `hideLabels`, dropdown variants, and legacy `aria-disabled` examples.

## To: `@primer/react-tailwind`

The stable Base UI-backed control renders toggle buttons directly in a group. It preserves controlled/uncontrolled value selection, keyboard behavior, focus treatment, disabled buttons, icon-only buttons, icons, counters, small/medium sizes, responsive full-width behavior, responsive label hiding, and the responsive ActionMenu fallback. `Button` and `IconButton` parts provide the stable composition rather than legacy list wrappers.

## Migration notes

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.
- Responsive `hideLabels` and `dropdown` variants retain the Primer viewport-range API while composing the package ActionMenu for dropdown behavior.
- Use real `disabled` controls instead of a legacy `aria-disabled` presentation example.
- `sx` and styled-system props are unsupported.
