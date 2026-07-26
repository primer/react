# Alignment

## From: `@primer/react`

Legacy Avatar is an image/avatar primitive with numeric and responsive breakpoint-object sizes, shape options, and styled-system customization.

## To: `@primer/react-tailwind`

Avatar remains a presentational image primitive with numeric `size`, `shape`, and `square` support, DOM image semantics, and local Tailwind styling. A numeric size renders at the requested dimensions. It does not use Base UI and does not add an alternate behavior layer.

## Migration notes

- Replace responsive size objects with responsive `className` utilities on the Avatar or its layout wrapper.
- Keep alt text and image fallback handling in consumer composition as in the current API.
- `sx` and styled-system props are unsupported.
- The responsive object mapping is intentionally not retained because the stable API accepts a numeric `size`.
