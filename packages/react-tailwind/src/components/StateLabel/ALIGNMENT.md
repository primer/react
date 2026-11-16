# Alignment

## From: `@primer/react`

Legacy StateLabel includes issue and pull-request state labels plus alert-specific status variants.

## To: `@primer/react-tailwind`

StateLabel is a presentational status label with a stable `status` union for the supported issue, pull-request, alert, archived, unavailable, and generic states. It does not use Base UI and preserves the upstream span semantics, artifact-specific icons, accessible icon labels, status colors, and size treatments.

## Migration notes

- Keep the accessible text explicit rather than depending on color alone.
- Replace the deprecated `variant="small"` prop with `size="small"`.
- Use `className`, not `sx` or styled-system props.
