# Alignment

## From: `@primer/react`

Legacy `ProgressBar` accepts `progress` as a number or string and uses `barSize` and `bg` for sizing and color. It renders the progress fill through a CSS-module implementation, with legacy token/styled-system props available for customization. The component historically tolerated several input shapes and leaves value interpretation largely to the consumer.

## To: `@primer/react-tailwind`

Tailwind `ProgressBar` uses numeric `progress`, clamps it to 0–100, and exposes semantic `size` and `variant` props for its Tailwind/Primer-token styling. It rejects combining `progress` with children, keeping the fill value unambiguous. Track geometry, segment spacing, and the reduced-motion-aware shimmer match the current Primer implementation. The result remains a presentational native progress surface; no Base UI behavior is involved. Legacy CSS modules, `barSize`, `bg`, and styled-system customization are not retained as aliases.

## Migration notes

- Rename `barSize` to `size` and `bg` to `variant`.
- Convert string percentages to numbers and keep values in the supported numeric range.
- Do not pass children alongside `progress`; remove `sx` and styled-system props.
