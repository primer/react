# Alignment

## From: `@primer/react`

Legacy `Popover` is primarily a presentational `Popover` plus `Popover.Content` surface with `caret`, `relative`, `open`, width/height, overflow, and manual `onClickOutside`/ignored-ref options. Consumers commonly pair it with manual visibility and portal handling. The legacy CSS module and styled-system props provide placement and appearance, but the component does not expose a modern compound trigger/content lifecycle.

## To: `@primer/react-tailwind`

Tailwind `Popover` is a Base UI compound primitive. It exports named parts including `Trigger`, `Button`, `Popup`, `Content`, `Positioner`, `Portal`, `Arrow`, `Backdrop`, `Title`, `Description`, `Close`, and `Viewport`. Base UI owns controlled state, trigger semantics, focus, dismissal, portal behavior, and positioning; Tailwind classes and Primer tokens own presentation. This is a substantial replacement rather than a DOM-compatible upgrade of the old surface.

`Content` keeps upstream's `width` and `height` on the overlay token scale (defaulting to `small` and `fit-content`). It shares the floating-content props of Tooltip, AnchoredOverlay, ActionMenu, and Autocomplete: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Recompose legacy anchor/content markup with the compound parts.
- Remove manual outside-click and portal plumbing when the new parts provide it. Set `portal={false}` to render content inside its parent rather than at the end of the document.
- Replace `caret` with `Popover.Arrow`, which follows the content's `side` and `align`.
- `relative` is unsupported because the positioner always places content against its anchor. Use `className` for overflow; there is no `overflow` prop.
- Remove legacy placement/style props, `sx`, and styled-system props.
