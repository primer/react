# Alignment

## From: `@primer/react`

Legacy ToggleSwitch renders a wrapper with on/off status text, a loading spinner with a delayed loading announcement, and a `button` with `aria-pressed`. It exposes `onChange(checked)`, `buttonType`, `statusLabelPosition`, `buttonLabelOn`, `buttonLabelOff`, `loading`, `loadingLabel`, and `loadingLabelDelay`.

## To: `@primer/react-tailwind`

ToggleSwitch keeps the Primer status label, `statusLabelPosition`, custom on/off labels, size, and loading props (`loading`, `loadingLabel`, `loadingLabelDelay`). The control itself is a Base UI `Switch.Root` with `role="switch"`, a hidden form input, and the normalized `checked`, `defaultChecked`, and `onCheckedChange` state contract. Loading maps to Base UI `readOnly`, so the switch stays focusable but does not toggle. The status label is derived from Base UI's `data-checked` state with CSS, so there is no second React state source.

## Migration notes

- Replace `onChange(checked)` with `onCheckedChange(checked, details)`.
- `ref`, `className`, and rest props target the switch control, not the outer status-label wrapper.
- `buttonType` is omitted; the switch submits through its hidden input and `name`/`value`.
- Use a visible associated label or an accessible name.
- `sx` and styled-system props are unsupported; use `className`.
