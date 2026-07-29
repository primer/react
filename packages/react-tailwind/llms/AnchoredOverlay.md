# AnchoredOverlay

`AnchoredOverlay` positions a dismissible overlay relative to a trigger.

Import: `import {AnchoredOverlay} from '@primer/react-tailwind/AnchoredOverlay'`

## Content props

- `align`: `FloatingAlignment` — Default `'start'`.
- `alignOffset`: `FloatingOffset`
- `portal`: `boolean` — Default `true`.
- `positionerClassName`: `string`
- `side`: `FloatingSide` — Default `'bottom'`.
- `sideOffset`: `FloatingOffset` — Default `4`.

## Differences from `@primer/react`

- Replace legacy `outside-*` placement names with `side` and `align`.
