# Alignment

## From: `@primer/react`

Legacy Flash supplies standard variants, full-width presentation, and examples with an upstream dismissible composition.

## To: `@primer/react-tailwind`

Flash is a presentational status container with `variant`, `full`, simple `as`, and normal children. It preserves standard visual variants and full-width layout but has no dismiss callback, close part, or Base UI behavior. Dismissal is deliberately external state and a locally composed button rather than an invented Flash API.

## Migration notes

- Put a named close button and its state outside or inside Flash as ordinary composition.
- Do not migrate an assumed `onDismiss` prop; it is unsupported for Flash.
- Use `as` only for simple presentational root replacement.
- Replace `sx` and styled-system props with `className`.
