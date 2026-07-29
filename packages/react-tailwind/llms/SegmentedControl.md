# SegmentedControl

`SegmentedControl` is a single-choice Base UI toggle group for related view or mode choices.

Import: `import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'`

## Props

- `className`: `string | ((state: ToggleGroupState) => string | undefined)`
- `fullWidth`: `ResponsiveValue<boolean>`
- `size`: `SegmentedControlSize` — Default `'medium'`.
- `variant`: `"default" | Partial<Record<"narrow" | "regular" | "wide", SegmentedControlVariant>>` — Default `'default'`.

## Button props

- `children`: `React.ReactElement[]`
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number`
- `leadingVisual`: `React.ReactNode`
- `value`: `string`

## IconButton props

- `aria-label`: `string` — Defines a string value that labels the current element.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number`
- `icon`: `React.ElementType`
- `value`: `string`

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.
