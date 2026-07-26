# Alignment

## From: `@primer/react`

Legacy Stack is a layout primitive with normal default spacing and responsive direction, alignment, wrapping, spacing, padding, and item growth controls.

## To: `@primer/react-tailwind`

Stack remains a presentational flex layout with `gap`, `direction`, `align`, `wrap`, `justify`, padding options, and `Stack.Item` grow/shrink controls. It preserves the default normal spacing and supported responsive behavior using static Tailwind utilities, including the complete `none` through `spacious` padding scale. It does not use Base UI.

## Migration notes

- Do not assume omitted `gap` means zero; it keeps the normal spacing default.
- Use the documented responsive values rather than dynamically constructed class names.
- Use `Stack.Item` for growth and shrink behavior, not child styled-system props.
- `sx` and styled-system props are unsupported; use `className`.
