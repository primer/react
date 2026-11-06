# Alignment

## From: `@primer/react`

Legacy Avatar renders an image with numeric or responsive sizes and a `square` option.

## To: `@primer/react-tailwind`

Avatar retains numeric and responsive `size` values and `square`. It also accepts named sizes and a `shape` prop.

## Migration notes

- Existing numeric or `{narrow, regular, wide}` sizes and `square` usage can be retained.
- Use `className` instead of `sx` or styled-system props.
