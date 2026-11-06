# Alignment

## From: `@primer/react`

Legacy LinkButton supports link variants, trailing actions, and polymorphic router-link replacement through `as`.

## To: `@primer/react-tailwind`

LinkButton composes the shared Button presentation onto a native anchor or a consumer-provided Base UI `render` element while retaining link semantics and navigation behavior. It supports the shared Button variants, sizes, visuals, trailing actions, counters, loading state, and layout props without duplicating those layers.

## Migration notes

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.
- `href` remains optional for loading placeholders and custom render elements.
- Use a real Button for actions that do not navigate.
- Replace `sx` and styled-system props with `className`.
