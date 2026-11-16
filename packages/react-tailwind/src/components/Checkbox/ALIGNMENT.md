# Alignment

## From: `@primer/react`

Legacy Checkbox is a styled native form control, frequently wrapped by FormControl, with checked, indeterminate, disabled, controlled, keyboard, and form-associated behavior.

## To: `@primer/react-tailwind`

Checkbox preserves native label and form semantics while Base UI provides the checkbox behavior and callback details. It supports controlled and uncontrolled checked state through `checked`, `defaultChecked`, and `onCheckedChange`, plus the documented indeterminate and disabled states. It composes with local FormControl rather than inheriting styled-system layout behavior.

## Migration notes

- Keep a native label or FormControl label associated with each checkbox.
- Migrate controlled state to `checked`/`defaultChecked`/`onCheckedChange`; do not duplicate Base UI state.
- The forwarded ref targets the focusable Base UI checkbox; `inputRef` targets its separate hidden form input. Custom focus traversal must ignore `aria-hidden` elements.
- `onCheckedChange` exposes a native event, not the legacy React `onChange` event. To stop React change propagation, intercept `onChange` on a wrapper around the checkbox.
- Use standard form events where native submission behavior is needed.
- Use `className`, not `sx` or styled-system props.
