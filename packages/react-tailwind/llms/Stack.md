# Stack

`Stack` arranges related content along one axis with token-based spacing, alignment, wrapping, and responsive direction.

Import: `import {Stack} from '@primer/react-tailwind/Stack'`

## Props

- `align`: `ResponsiveValue<"baseline" | "center" | "end" | "start" | "stretch">` — Default `'stretch'`.
- `as`: `React.ElementType` — Default `'div'`.
- `direction`: `ResponsiveValue<"horizontal" | "vertical">` — Default `'vertical'`.
- `gap`: `ResponsiveValue<Gap>` — Default `'normal'`.
- `justify`: `ResponsiveValue<"center" | "end" | "space-between" | "space-evenly" | "start">` — Default `'start'`.
- `padding`: `ResponsiveValue<Gap>` — Default `'none'`.
- `paddingBlock`: `ResponsiveValue<Gap>`
- `paddingInline`: `ResponsiveValue<Gap>`
- `wrap`: `ResponsiveValue<"nowrap" | "wrap">` — Default `'nowrap'`.

## Differences from `@primer/react`

- Do not assume omitted `gap` means zero; it keeps the normal spacing default.
