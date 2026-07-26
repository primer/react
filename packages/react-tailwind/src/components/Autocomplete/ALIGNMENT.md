# Alignment

## From: `@primer/react`

Legacy Autocomplete combines TextInput, token input, overlay, and menu APIs, including product-oriented dialog and token integrations.

## To: `@primer/react-tailwind`

The stable compound API provides `Root`, `Input`, `Content`, and `Item`. Base UI owns combobox ARIA, keyboard interaction, focus, filtering behavior, and portal positioning. `Root` follows the normalized controlled/uncontrolled value convention, while `mode="both"` supports the documented multi-value/free-form scenario. `Content` always composes with its portal and positioner, so an overlay remains valid even inside another overlay.

## Migration notes

- Move legacy token, dialog, and TextInput integrations to composition with their local components.
- Use the documented value/default-value callback contract rather than legacy overlay state props.
- Do not render `Content` outside its portal/positioner composition.
- `sx` and styled-system props are unsupported.
