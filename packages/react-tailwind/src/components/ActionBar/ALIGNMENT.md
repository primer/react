# Alignment

## From: `@primer/react`

Legacy ActionBar is a compound toolbar with button, icon-button, group, divider, and menu parts. Its examples also rely on legacy ActionMenu, Dialog, Textarea, Avatar, and responsive `overflowIcon` behavior that can turn actions into an automatic overflow menu.

## To: `@primer/react-tailwind`

ActionBar keeps the local `Button`, `IconButton`, `Group`, `Divider`, and `Menu` composition. Its menu uses Base UI for menu behavior; consumers provide the explicit menu trigger and `items`. It retains toolbar sizing, flush layout, and gaps, but has no automatic responsive overflow API. Other product controls remain normal child composition rather than ActionBar features.

## Migration notes

- Replace `overflowIcon` with an explicit `ActionBar.Menu`; preserve the action order and focus behavior in consumer code.
- Use local component children instead of legacy cross-component props.
- Automatic overflow is intentionally deferred until its public and focus-management contract is defined.
- `sx` and styled-system props are unsupported; use `className` on the appropriate local part.
