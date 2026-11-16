# Alignment

## From: `@primer/react`

LabelGroup measures children, decides which labels are visible, and provides automatic overflow expansion styling and controls.

## To: `@primer/react-tailwind`

LabelGroup is a config component for the established compact-label overflow pattern. It preserves the upstream `visibleChildCount`, `overflowStyle`, default list semantics, numeric truncation, auto measurement, inline disclosure, and overlay disclosure API. It composes the package’s `Button`, `IconButton`, and Base UI-powered `AnchoredOverlay` rather than reproducing their behavior or styles.

## Migration notes

- `visibleChildCount="auto"` uses `ResizeObserver` rather than the legacy `IntersectionObserver`. This produces deterministic counts on resize and avoids relying on clipping intersection behavior.
- The overlay uses the modern anchored dialog primitive, so positioning and focus restoration are supplied by Base UI rather than legacy `AnchoredOverlay` APIs.
- The default root is `ul`, matching upstream. Use `as` for non-list roots.
- Interactive-token fixture pixels are owned by the shared `Token` implementation; the remaining 3.16% visual-matrix difference is localized to that component’s current token styling rather than LabelGroup geometry or overflow behavior.
- `sx` and styled-system props are unsupported; use `className`.
