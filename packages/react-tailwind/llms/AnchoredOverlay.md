# AnchoredOverlay

`AnchoredOverlay` positions a dismissible overlay relative to a trigger.

Import: `import {AnchoredOverlay} from '@primer/react-tailwind/AnchoredOverlay'`

## Content props

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Differences from `@primer/react`

- Replace legacy `outside-*` placement names with `side` and `align`.
