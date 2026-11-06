# Alignment

## From: `@primer/react`

The selected legacy source is experimental UnderlinePanels, a compound tab/panel presentation with `List`, `Tab`, and `Panel` parts and Primer-specific responsive layout styling.

## To: `@primer/react-tailwind`

Stable UnderlinePanels promotes that compound API under the base name and composes Base UI tabs for selection, roving focus, tab-to-panel relationships, and controlled/uncontrolled state. `Tab` supports `leadingVisual` and decorative `counter` content. Tailwind classes implement the selected responsive layout without legacy styled-system behavior. Base UI exposes only the active `tabpanel` at a time.

## Migration notes

- Use `value`/`defaultValue` with `onChange({value})` for tab selection, matching upstream. `onChange` fires only for user-initiated selection of a different tab; Base UI's `onValueChange(value, eventDetails)` remains available when you need the event details or want to cancel a change.
- **Parity — activation mode:** `activationMode="manual"` keeps upstream's behavior: Arrow, Home, and End keys move focus without selecting, and Enter, Space, or click commits the selection.
- **Intentional difference — explicit composition:** tabs live in `UnderlinePanels.List` and every tab and panel needs an explicit `value`; positional pairing and `aria-selected`/`onSelect` tab props are not supported.
- **Intentional difference — unmatched value:** a `value` that matches no tab leaves no tab selected instead of clamping to the first tab with a development warning. An uncontrolled `defaultValue` that matches no tab falls back to the first enabled tab without calling `onChange`.
- **Overlay composition:** `UnderlinePanels` can render inside `AnchoredOverlay.Content`; the overlay does not add a competing focus zone, so the tab list keeps exactly one tabbable tab.
- Do not treat counters as the tab's accessible name.
- Query the active panel only; inactive panels need not remain mounted.
- Icons remain visible while the tab list scrolls horizontally at constrained widths, matching the current upstream rendering even though its historical story name describes hiding icons.
- Use `render` for behavior composition and `className`, not `sx` or styled-system props.
