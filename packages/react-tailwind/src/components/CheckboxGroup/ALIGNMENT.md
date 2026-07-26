# Alignment

## From: `@primer/react`

Legacy CheckboxGroup supplies `Label`, `Caption`, and `Validation` slots around related Checkbox controls, along with legacy layout styling.

## To: `@primer/react-tailwind`

CheckboxGroup keeps `Label`, `Caption`, and `Validation` compound parts around its Base UI-backed group primitive. It provides the group relationship and validation presentation while individual local Checkbox controls retain their native form association and checked state. The stable public surface uses normal children and local classes rather than legacy slot extraction or styled-system props.

## Migration notes

- Use `Label`, `Caption`, and `Validation` parts for group metadata; set `visuallyHidden` only when another visible label exists.
- Control each child checkbox with its documented checked-state contract.
- Keep validation messages associated with the group in consumer markup.
- `sx` and styled-system props are unsupported; use `className`.
