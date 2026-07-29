# Tooltip

`Tooltip` provides supplementary text for a trigger.

Import: `import {Tooltip} from '@primer/react-tailwind/Tooltip'`

## Content props

- `align`: `FloatingAlignment` — Default `'center'`.
- `alignOffset`: `FloatingOffset`
- `portal`: `boolean` — Default `true`.
- `positionerClassName`: `string`
- `side`: `FloatingSide` — Default `'top'`.
- `sideOffset`: `FloatingOffset` — Default `8`.

## Differences from `@primer/react`

- Replace `direction` with physical `side` and use `align` where needed.
