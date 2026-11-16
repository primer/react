# Alignment

## From: `@primer/react`

The selected legacy source is experimental UnderlinePanels, a compound tab/panel presentation with `List`, `Tab`, and `Panel` parts and Primer-specific responsive layout styling.

## To: `@primer/react-tailwind`

Stable UnderlinePanels promotes that compound API under the base name and composes Base UI tabs for selection, roving focus, tab-to-panel relationships, and controlled/uncontrolled state. `Tab` supports `leadingVisual` and decorative `counter` content. Tailwind classes implement the selected responsive layout without legacy styled-system behavior. Base UI exposes only the active `tabpanel` at a time.

## Migration notes

- Use `value`/`defaultValue` with `onChange({value})` for tab selection, matching upstream. `onChange` fires only for user-initiated selection of a different tab; Base UI's `onValueChange(value, eventDetails)` remains available when you need the event details or want to cancel a change.
- **Parity — activation mode:** `activationMode="manual"` keeps upstream's behavior: Arrow, Home, and End keys move focus without selecting, and Enter, Space, or click commits the selection.
- **Intentional difference — explicit composition:** tabs live in `UnderlinePanels.List` and every tab and panel needs an explicit `value`; positional pairing and `aria-selected`/`onSelect` tab props are not supported.
- **Class placement:** the root's `className` styles the whole tab-and-panel composition, and `List className`, `style`, DOM props, and ref target the Base UI tablist. Move legacy outer-wrapper padding/border classes to `List wrapperClassName`. Use `wrapperClassName="px-0 pt-0 shadow-none"` to remove the default wrapper padding and inset-shadow bottom border; conflicting default utilities are removed, so host `.px-4` overrides do not affect that wrapper.
- **Host utility collision:** the default 16px inset uses the package-owned `primer:px-4` class, which legacy host `.px-4 !important` (24px) rules do not match. A caller-supplied unprefixed `px-4` is still subject to host CSS, so use `wrapperClassName="px-[16px]"` or `px-[24px]` to select an inset explicitly. The prefixed stylesheet's emission and cascade alongside host CSS are not yet verified.
- **Intentional difference — unmatched value:** a `value` that matches no tab leaves no tab selected instead of clamping to the first tab with a development warning. An uncontrolled `defaultValue` that matches no tab falls back to the first enabled tab without calling `onChange`.
- **Overlay composition:** `UnderlinePanels` can render inside `AnchoredOverlay.Content`; the overlay does not add a competing focus zone, so the tab list keeps exactly one tabbable tab.
- **Legacy-overlay integration:** consumer tracing with Base UI 1.8 found that an independent legacy focus trap can focus the first tab before its composite index is registered, leaving the highlighted index at `-1` despite an intact tab registry. The consumer reports resolving this in its compatibility overlay by waiting for a layout-driven readiness commit before enabling the existing trap and initial focus, without removing trapping or adding an arrow-key fallback or dependency patch. This fix belongs to that adapter, not the package-owned Popover; mixed-overlay coverage remains consumer-owned.
- Do not treat counters as the tab's accessible name.
- Query the active panel only; inactive panels need not remain mounted.
- Icons remain visible while the tab list scrolls horizontally at constrained widths, matching the current upstream rendering even though its historical story name describes hiding icons.
- Use `render` for behavior composition and `className`, not `sx` or styled-system props.
