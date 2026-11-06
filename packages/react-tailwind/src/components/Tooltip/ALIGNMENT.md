# Alignment

## From: `@primer/react`

Legacy Tooltip uses compass `direction` and older overlay positioning conventions; TooltipV2 adds `type` and `keybindingHint`.

## To: `@primer/react-tailwind`

Stable Tooltip promotes the Tooltip V2 interaction model under the base name. Its `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, and `Content` compose Base UI for focus, hover behavior, dismissal, portals, ARIA, and physical placement. `side` uses `top`, `right`, `bottom`, or `left`; controlled and uncontrolled open state follow Base UI conventions. `type` (`description` or `label`), `keybindingHint`, `delay` (`short`, `medium`, `long`) and `id` match TooltipV2. A description tooltip describes its trigger through `aria-describedby`; a label tooltip names it through `aria-labelledby` unless the trigger already has an `aria-label`, which it keeps, and its keybinding hint joins the description. Content stays mounted while closed so those references always resolve. Placement defaults to TooltipV2's `s`: below, centered, 4px from the trigger. Popups portal into the nearest `BaseStyles` so they inherit its theme and typography. `Content` shares the floating-content props of Popover, AnchoredOverlay, ActionMenu, and Autocomplete: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Move `text` into `Tooltip.Content`, and wrap the child in `Tooltip.Trigger render={...}` instead of nesting it in `Tooltip`.
- Replace `direction` with `side` and `align`: `n` is `top`, `s` is `bottom`, `e` is `right` and `w` is `left`, all `center`. `ne` and `se` use `start`; `nw` and `sw` use `end`.
- Pass `aria-describedby`, `aria-labelledby`, and the trigger's `id` to `Tooltip.Trigger`. TooltipV2 merges them from the child, but Base UI lets the rendered element's props replace the trigger's, and the trigger tracks its open state by its `id`.
- `Tooltip.Provider` sets a delay for a group of tooltips. Base UI's `disabled` root never opens, and stops naming or describing its trigger.
- An `IconButton` rendered by `Tooltip.Trigger` skips its own tooltip, as it does inside a TooltipV2.
- Keyboard focus opens the tooltip immediately; TooltipV2 shows it only for `:focus-visible`.
- Tooltip content is hidden from the accessibility tree and referenced by its trigger; description content does not use `role="tooltip"`.
- `sx` and styled-system props are unsupported.
