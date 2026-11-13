# Alignment

## From: `@primer/react`

`SkeletonText` renders one or more text-shaped loading lines. Legacy `lines` controls the count, `maxWidth` constrains the width, and `size` selects typography dimensions. The CSS-module implementation applies the skeleton color and animation. Older input handling did not normalize every non-integer or non-positive line count consistently.

## To: `@primer/react-tailwind`

Tailwind keeps `lines`, `maxWidth`, and `size`, but normalizes multiline counts with `Math.max(1, Math.floor(lines))`. Multiple lines are rendered inside a multiline container and the final line is intentionally shortened to resemble natural text. Tailwind utilities and Primer skeleton tokens replace the CSS module; this remains presentational and is not Base UI-backed. The component uses React 19-compatible native composition.

## Migration notes

- Expect at least one line; fractional counts are floored.
- Each bar's height follows the selected size's font-size token, while its vertical margins follow that size's line-height token. Single and multiline skeletons use the same sizing rule; they are not fixed-height 16px bars. At the default 16px root scale, `bodyMedium` bars are 14px and `bodySmall` bars are 12px. Typography token or root-font overrides can change those values.
- Legacy Primer CSS can redefine typography tokens depending on stylesheet order. Compare loading and loaded content under the same actual host tokens/order rather than forcing a pixel height or weakening a layout-shift threshold. The height correction does not isolate unrelated host CSS. `className` and `style` still target the public root; in multiline mode that root is the wrapper, not an individual bar.
- Recheck snapshots or selectors that depended on one element per line or legacy CSS classes.
- Remove `sx` and styled-system props.
