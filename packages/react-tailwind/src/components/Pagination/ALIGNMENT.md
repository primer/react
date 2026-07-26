# Alignment

## From: `@primer/react`

`Pagination` renders a navigation list of page links with previous/next controls and selected-page state. Its public API includes page-count/current page state, `showPages`, margin/surrounding counts, `hrefBuilder`, and the `renderPage` escape hatch receiving legacy `PageProps`. CSS modules and styled-system props supply the presentation. It is a presentational navigation component; page state and data fetching remain the consumer's responsibility.

## To: `@primer/react-tailwind`

Tailwind preserves the `Pagination` API and `renderPage` composition while using native links, Tailwind utilities, and Primer semantic tokens. Its `renderPage` callback receives `PageProps` with the new `pageType` (`previous`, `next`, `page`, or `ellipsis`) field. Selected, disabled, previous, and next states remain visual/semantic states owned by the rendered controls. No Base UI primitive is involved, and CSS-module/styled-system styling is not retained.

## Migration notes

- Existing page-state and link composition can generally be retained.
- Update custom `renderPage` code from legacy page metadata to `pageType`.
- Keep data fetching and current-page state outside the component.
- Remove `sx`, styled-system props, and selectors tied to legacy classes.
