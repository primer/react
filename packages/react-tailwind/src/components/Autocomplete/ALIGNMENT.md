# Alignment

## From: `@primer/react`

Legacy Autocomplete combines TextInput, token input, overlay, and menu APIs, including product-oriented dialog and token integrations.

## To: `@primer/react-tailwind`

The stable compound API provides `Root`, `Input`, `Content`, and `Item`. Base UI owns combobox ARIA, keyboard interaction, focus, filtering behavior, and portal positioning. `Root` follows the normalized controlled/uncontrolled value convention, while `mode="both"` supports the documented multi-value/free-form scenario. `Content` always composes with its portal and positioner, so an overlay remains valid even inside another overlay. It shares the floating-content props of Popover, Tooltip, AnchoredOverlay, and ActionMenu: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Move legacy token, dialog, and TextInput integrations to composition with their local components.
- Use the documented value/default-value callback contract rather than legacy overlay state props.
- Set `portal={false}` on `Content` to render the list in place rather than at the end of the document; it still composes its positioner.
- `sx` and styled-system props are unsupported.
- `Input.render` replaces the default `TextInput`, including with a local `Textarea`. TextInput decoration props are only applied to the default element. The outer input event/ref types remain Base UI's input types; a textarea's native handlers and ref belong on the render element.
- `useFilter` and `useFilteredItems` preserve Base UI's public behavior hooks. Trigger parsing, caret measurement, Tab acceptance, and text insertion remain consumer concerns rather than new Autocomplete state.
