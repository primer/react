# Alignment

## From: `@primer/react`

Legacy AnchoredOverlay provides a wrapper anchor and overlay with Primer placement names, outside-placement options, CSS-anchor fallbacks, and named portal-root configuration.

## To: `@primer/react-tailwind`

The stable `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, and `Content` composition delegates anchoring, collision-aware positioning, focus, and dismissal to Base UI Popover. It supports controlled `open`, uncontrolled `defaultOpen`, and `onOpenChange`. `side` is physical (`top`, `right`, `bottom`, `left`) and `align` is `start`, `center`, or `end`; DOM props and refs belong to their matching public part.

## Migration notes

- Replace legacy `outside-*` placement names with `side` and `align`.
- Use `render` to compose a trigger with an existing element; do not use a polymorphic `as` compatibility layer.
- The former CSS-anchor fallback and named portal-root options are unsupported.
- Use `className`, not `sx` or styled-system props.
