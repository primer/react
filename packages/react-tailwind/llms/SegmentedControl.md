# SegmentedControl

`SegmentedControl` is a single-choice Base UI toggle group for related view or mode choices.

Import: `import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'`

## Props

- `className`: `ToggleGroup.Props<Value>['className']`
- `fullWidth`: `ResponsiveValue<boolean>`
- `size`: `SegmentedControlSize` — Default `'medium'`.
- `variant`: `'default' | ResponsiveSegmentedControlVariant` — Default `'default'`.

## SegmentedControlButton props

- `children`: `React.ReactNode`
- `className`: `Toggle.Props<Value>['className']`
- `count`: `number | string`
- `leadingVisual`: `React.ReactNode`
- `value`: `Value`

## SegmentedControlIconButton props

- `aria-label`: `string`
- `icon`: `React.ElementType`

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.

