# LiveRegion

`LiveRegion` announces asynchronous changes without moving focus.

Import: `import {LiveRegion} from '@primer/react-tailwind/LiveRegion'`

## Announce props

- `announceOnShow`: `boolean` — Default `true`.
- `as`: `React.ElementType` — Default `'div'`.
- `data-component`: `string` — Default `'Announce'`.
- `delayMs`: `number`
- `hidden`: `boolean` — Default `false`.
- `politeness`: `Politeness` — Default `'polite'`.

## Differences from `@primer/react`

- Select `AriaStatus` for polite status updates and `AriaAlert` for urgent messages; do not duplicate the text in multiple regions.

