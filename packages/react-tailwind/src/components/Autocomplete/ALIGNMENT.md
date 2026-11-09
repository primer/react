# Alignment

## From: `@primer/react`

Legacy Autocomplete combines TextInput, token input, overlay, and menu APIs, including product-oriented dialog and token integrations.

## To: `@primer/react-tailwind`

The stable compound API provides `Root`, `Input`, `Content`, and `Item`. Base UI owns combobox ARIA, keyboard interaction, focus, filtering behavior, and portal positioning. `Root` follows the normalized controlled/uncontrolled value convention, while `mode="both"` supports the documented multi-value/free-form scenario. `Content` always composes with its portal and positioner, so an overlay remains valid even inside another overlay. It shares the floating-content props of Popover, Tooltip, AnchoredOverlay, and ActionMenu: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Move legacy token, dialog, and TextInput integrations to composition with their local components.
- Use the documented value/default-value callback contract rather than legacy overlay state props.
- Set `portal={false}` on `Content` to render the list in place rather than at the end of the document; it still composes its positioner.
- Base UI's popup can hide sibling dialog controls from the accessibility tree while suggestions are open, even when `modal={false}` or `portal={false}`. A popup composition that retains their exposure and equivalent keyboard behavior remains unverified.
- Base UI supplies the input's `aria-autocomplete`, `aria-controls`, and active-descendant relationships. An `Item` rendered as an anchor is still exposed as an option, not a link; native link gestures and the accessibility of input-owned link results are not guaranteed by this composition. Applications with stricter policies or link-result requirements need a separately reviewed interaction pattern.
- `sx` and styled-system props are unsupported.
