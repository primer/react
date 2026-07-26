# Alignment

## From: `@primer/react`

Legacy Tooltip uses direction, type, and keybinding-hint presentation props and older overlay positioning conventions.

## To: `@primer/react-tailwind`

Stable Tooltip promotes the Tooltip V2 interaction model under the base name. Its `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, and `Content` compose Base UI for focus, hover behavior, dismissal, portals, ARIA, and physical placement. `side` uses `top`, `right`, `bottom`, or `left`; controlled and uncontrolled open state follow Base UI conventions.

## Migration notes

- Replace `direction` with physical `side` and use `align` where needed.
- Compose keybinding content inside Tooltip rather than passing a legacy presentation prop.
- Use `render` to add tooltip behavior to an existing trigger without nested interactive elements.
- `type`, `sx`, and styled-system props are unsupported.
