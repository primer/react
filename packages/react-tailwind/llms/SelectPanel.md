# SelectPanel

`SelectPanel` is a data-driven, filterable picker built with Base UI Combobox and Primer's Popover and Dialog primitives.

Import: `import {SelectPanel} from '@primer/react-tailwind/SelectPanel'`

## SelectPanelOverlay props

- `alignOffset`: `PopoverPositionerProps['alignOffset']`
- `className`: `string`
- `collisionBoundary`: `PopoverPositionerProps['collisionBoundary']`
- `collisionPadding`: `PopoverPositionerProps['collisionPadding']`
- `height`: `PanelHeight`
- `maxHeight`: `Exclude<PanelHeight, 'auto' | 'initial' | 'fit-content'>`
- `portal`: `boolean` — Default `true`.
- `positionerClassName`: `string`
- `side`: `PopoverPositionerProps['side']` — Default `'bottom'`.
- `sideOffset`: `PopoverPositionerProps['sideOffset']` — Default `4`.
- `style`: `React.CSSProperties`
- `width`: `PanelWidth`

## SelectPanelAnchor props

- `children`: `React.ReactNode`
- `id`: `string`

## SelectPanelActionList props

- `className`: `string`

## SelectPanelMessage props

- `className`: `string`

## SelectPanelSecondaryActionLink props

- `children`: `React.ReactNode`
- `href`: `string`

## Differences from `@primer/react`

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details, and `disableFullscreenOnNarrow` stays opt-out where `FilteredActionList` uses the opt-in `fullScreenOnNarrow`. Both keep upstream's contract.

