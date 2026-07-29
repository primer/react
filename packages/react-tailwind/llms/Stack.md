# Stack

`Stack` arranges related content along one axis with token-based spacing, alignment, wrapping, and responsive direction.

Import: `import {Stack} from '@primer/react-tailwind/Stack'`

## Props

- `align`: `ResponsiveValue<'stretch' | 'start' | 'center' | 'end' | 'baseline'>` — Default `'stretch'`.
- `direction`: `ResponsiveValue<'horizontal' | 'vertical'>` — Default `'vertical'`.
- `gap`: `ResponsiveValue<Gap>` — Default `'normal'`.
- `justify`: `ResponsiveValue<'start' | 'center' | 'end' | 'space-between' | 'space-evenly'>` — Default `'start'`.
- `padding`: `ResponsiveValue<Gap>` — Default `'none'`.
- `paddingBlock`: `ResponsiveValue<Gap>`
- `paddingInline`: `ResponsiveValue<Gap>`
- `wrap`: `ResponsiveValue<'wrap' | 'nowrap'>` — Default `'nowrap'`.

## StackItem props

- `grow`: `ResponsiveValue<boolean>` — Default `false`.
- `shrink`: `ResponsiveValue<boolean>` — Default `true`.

## Differences from `@primer/react`

- Do not assume omitted `gap` means zero; it keeps the normal spacing default.

