# Alignment

## From: `@primer/react`

The selected legacy source is experimental UnderlinePanels, a compound tab/panel presentation with `List`, `Tab`, and `Panel` parts and Primer-specific responsive layout styling.

## To: `@primer/react-tailwind`

Stable UnderlinePanels promotes that compound API under the base name and composes Base UI tabs for selection, roving focus, tab-to-panel relationships, and controlled/uncontrolled state. `Tab` supports `leadingVisual` and decorative `counter` content. Tailwind classes implement the selected responsive layout without legacy styled-system behavior. Base UI exposes only the active `tabpanel` at a time.

## Migration notes

- Use the documented value/default-value callback contract for tab selection.
- Do not treat counters as the tab's accessible name.
- Query the active panel only; inactive panels need not remain mounted.
- Icons remain visible while the tab list scrolls horizontally at constrained widths, matching the current upstream rendering even though its historical story name describes hiding icons.
- Use `render` for behavior composition and `className`, not `sx` or styled-system props.
