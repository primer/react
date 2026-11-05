# Stack

`Stack` arranges related content along one axis with token-based spacing, alignment, wrapping, and responsive direction.

Import: `import {Stack} from '@primer/react-tailwind/Stack'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `align`: `ResponsiveValue<"baseline" | "center" | "end" | "start" | "stretch">` — Default `'stretch'`. Alignment of children across the stack's direction.
- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `direction`: `ResponsiveValue<"horizontal" | "vertical">` — Default `'vertical'`. Whether children are laid out in a row or a column.
- `gap`: `ResponsiveValue<Gap>` — Default `'normal'`. Spacing between children. Accepts a responsive object to vary it per viewport.
- `justify`: `ResponsiveValue<"center" | "end" | "space-between" | "space-evenly" | "start">` — Default `'start'`. Distribution of children along the stack's direction.
- `padding`: `ResponsiveValue<Gap>` — Default `'none'`. Inner spacing on all sides.
- `paddingBlock`: `ResponsiveValue<Gap>` — Inner spacing at the top and bottom, overriding `padding`.
- `paddingInline`: `ResponsiveValue<Gap>` — Inner spacing at the start and end, overriding `padding`.
- `wrap`: `ResponsiveValue<"nowrap" | "wrap">` — Default `'nowrap'`. Whether children may wrap onto another line.

## Stack.Item

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `grow`: `ResponsiveValue<boolean>` — Default `false`. Lets the item take up any remaining space.
- `shrink`: `ResponsiveValue<boolean>` — Default `true`. Lets the item shrink below its content size when space is tight.

## Differences from `@primer/react`

- Do not assume omitted `gap` means zero; it keeps the normal spacing default.
