# Alignment

## From: `@primer/react`

Legacy `ProgressBar` accepts `progress` as a number or string and uses `barSize` and `bg` for sizing and color. It renders the progress fill through a CSS-module implementation, with legacy token/styled-system props available for customization. The component historically tolerated several input shapes and leaves value interpretation largely to the consumer.

## To: `@primer/react-tailwind`

Tailwind `ProgressBar` uses numeric `progress`, clamps it to 0–100, and exposes semantic `size` and `variant` props for its Tailwind/Primer-token styling. `fillColor` supplies a custom CSS color or variable. It rejects combining `progress` with children, keeping the fill value unambiguous. Track geometry, segment spacing, and the reduced-motion-aware shimmer match the current Primer implementation. The result remains a presentational native progress surface; no Base UI behavior is involved. Legacy CSS modules, `barSize`, `bg`, and styled-system customization are not retained as aliases.

## Migration notes

- Rename `barSize` to `size`; the middle size is `medium` rather than upstream's `default`. Map a semantic `bg` such as `danger.emphasis` to `variant="danger"`, or use `fillColor` for a custom color such as `var(--my-progress-color)`.
- Convert string percentages to finite numbers before passing `progress` and keep values in the supported numeric range. Do not spread the legacy `bg` or `barSize` props onto the track.
- The single-segment shorthand forwards accessible value and name attributes to its progressbar. Pass an explicit `aria-valuenow` or `aria-valuetext` to either the shorthand or an item when its announced value intentionally differs from the visual width.
- Root value attributes apply only to the single segment, not to grouped items. When conditional children contain only empty values, a single 0% fallback segment receives the root's accessible value and name.
- Do not pass children alongside `progress`; remove `sx` and styled-system props.
