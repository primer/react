# Alignment

## From: `@primer/react`

`Label` renders compact metadata with a `variant`, `small` or `large` size, and a polymorphic `as` prop.

## To: `@primer/react-tailwind`

Tailwind retains the same variants, sizes, and `as` prop, using utility classes rather than the legacy size and variant data attributes.

## Migration notes

- Existing `variant`, `size`, and `as` usage can be retained; element-specific props and refs follow the element selected by `as`.
- Use `FormControl.Label` to label a form field.
- Replace `sx`, styled-system props, and selectors targeting `data-size` or `data-variant`.
