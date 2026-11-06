# Alignment

## From: `@primer/react`

Select is a native `<select>` component with `option` and `optgroup` children, a placeholder option, control sizes, block layout, validation presentation, and browser-owned select behavior.

## To: `@primer/react-tailwind`

Select uses the same native-select contract. `Select.Option` and `Select.OptGroup` are convenience wrappers for native elements that add Primer-owned `data-component` identifiers. Native children work identically. The visible wrapper owns Primer layout and state styling; the ref and all regular DOM attributes apply to the nested native `<select>`.

## Migration notes

- Replace `Select.Trigger`, `Value`, `Portal`, `Positioner`, `Popup`, `List`, `Item`, `Group`, and `GroupLabel` with `Select`, native options, and optgroups.
- Replace Base UI `onValueChange` with native `onChange`; read `event.currentTarget.value`, or `selectedOptions` for `multiple`.
- Use native `value`/`defaultValue`, `name`, `disabled`, `required`, and accessible-name attributes.
- `block`, `size`, `validationStatus`, and `placeholder` match the Primer Select API, which omits `contrast`. `multiple` remains available through the native select element and ignores the single-select-only `placeholder`.
- `sx`, styled-system props, Base UI popup/open props, and custom render props are unsupported. Use `className` on the visible wrapper and native DOM props on the select.
