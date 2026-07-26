# Alignment

## From: `@primer/react`

`SkeletonText` renders one or more text-shaped loading lines. Legacy `lines` controls the count, `inline` changes the layout treatment, and `size` selects typography dimensions. The CSS-module implementation applies the skeleton color and animation, while legacy shared props permit styled-system customization. Older input handling did not normalize every non-integer or non-positive line count consistently.

## To: `@primer/react-tailwind`

Tailwind keeps `lines`, `inline`, and `size`, but normalizes multiline counts with `Math.max(1, Math.floor(lines))`. Multiple lines are rendered inside a multiline container and the final line is intentionally shortened to resemble natural text. Tailwind utilities and Primer skeleton tokens replace the CSS module; this remains presentational and is not Base UI-backed. The component uses React 19-compatible native composition.

## Migration notes

- Expect at least one line; fractional counts are floored.
- Recheck snapshots or selectors that depended on one element per line or legacy CSS classes.
- Remove `sx` and styled-system props.
