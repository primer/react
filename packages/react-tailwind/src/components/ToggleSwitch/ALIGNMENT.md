# Alignment

## From: `@primer/react`

Legacy ToggleSwitch includes loading status labels and custom on/off label APIs in addition to checked, disabled, controlled, keyboard, focus, and form behavior.

## To: `@primer/react-tailwind`

ToggleSwitch is a Base UI-backed form control with supported size, checked state, disabled state, keyboard/focus behavior, and form association. It follows the normalized `checked`, `defaultChecked`, and `onCheckedChange` state contract. Loading and status-label presentation are not part of the stable public API.

## Migration notes

- Use the checked-state contract; do not mirror Base UI state in a second React state source.
- Compose loading text or status announcements beside the switch with normal markup or LiveRegion.
- Use a visible associated label or an accessible name.
- `sx` and styled-system props are unsupported; use `className`.
