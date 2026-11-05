# Alignment

## From: `@primer/react`

Legacy Tooltip uses compass `direction` and older overlay positioning conventions; TooltipV2 adds `type` and `keybindingHint`.

## To: `@primer/react-tailwind`

Stable Tooltip promotes the Tooltip V2 interaction model under the base name. Its `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, and `Content` compose Base UI for focus, hover behavior, dismissal, portals, ARIA, and physical placement. `side` uses `top`, `right`, `bottom`, or `left`; controlled and uncontrolled open state follow Base UI conventions. `type` (`description` or `label`) and `keybindingHint` match TooltipV2; description tooltips and hint text stay mounted so trigger descriptions resolve while closed. Popups portal into the nearest `BaseStyles` so they inherit its theme and typography. `Content` shares the floating-content props of Popover, AnchoredOverlay, ActionMenu, and Autocomplete: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Replace `direction` with physical `side` and use `align` where needed.
- `type="label"` is visual only: keep the accessible name on the trigger (for example `aria-label`).
- Use `render` to add tooltip behavior to an existing trigger without nested interactive elements.
- `sx` and styled-system props are unsupported.
