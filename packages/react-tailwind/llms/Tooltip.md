# Tooltip

`Tooltip` provides supplementary text for a trigger.

Import: `import {Tooltip} from '@primer/react-tailwind/Tooltip'`

## Content props

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'top'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `8`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Differences from `@primer/react`

- Replace `direction` with physical `side` and use `align` where needed.
