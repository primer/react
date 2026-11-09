# Stack

`Stack` arranges related content along one axis with token-based spacing, alignment, wrapping, and responsive direction.

Import: `import {Stack} from '@primer/react-tailwind/Stack'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Stack} from '@primer/react-tailwind/Stack'
;<Stack direction="vertical" gap="normal">
  <Stack.Item>Repository settings</Stack.Item>
</Stack>
```

`Stack.Item` is also exported as `StackItem`.

`as` selects the native or custom root and its props, events, and ref. For example, `as="form"` accepts form attributes and gives `onSubmit` and `onChange` an `HTMLFormElement` target, including `FormData(event.currentTarget)`. Use `StackProps<'form'>` or `StackItemProps<'form'>` for extracted form props. Custom components must forward the layout class name, DOM props, children, and ref; their required props and declared ref type are preserved.

Use responsive values for `direction`, `gap`, and alignment without changing the DOM order. `Stack` adds no semantics; use appropriate landmarks, headings, and lists for its children.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `align`: `ResponsiveValue<"baseline" | "center" | "end" | "start" | "stretch">` — Default `'stretch'`. Alignment of children across the stack's direction.
- `as`: `As` — Default `'div'`. Element to render. Its props, events, and ref follow the selected element. Element or component to render.
- `className`: `string`
- `direction`: `ResponsiveValue<"horizontal" | "vertical">` — Default `'vertical'`. Whether children are laid out in a row or a column.
- `gap`: `ResponsiveValue<Gap>` — Default `'normal'`. Spacing between children. Accepts a responsive object to vary it per viewport.
- `justify`: `ResponsiveValue<"center" | "end" | "space-between" | "space-evenly" | "start">` — Default `'start'`. Distribution of children along the stack's direction.
- `padding`: `ResponsiveValue<Gap>` — Default `'none'`. Inner spacing on all sides.
- `paddingBlock`: `ResponsiveValue<Gap>` — Inner spacing at the top and bottom, overriding `padding`.
- `paddingInline`: `ResponsiveValue<Gap>` — Inner spacing at the start and end, overriding `padding`.
- `wrap`: `ResponsiveValue<"nowrap" | "wrap">` — Default `'nowrap'`. Whether children may wrap onto another line.

## Stack.Item

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `As` — Default `'div'`. Element to render. Its props, events, and ref follow the selected element. Element or component to render.
- `className`: `string`
- `grow`: `ResponsiveValue<boolean>` — Lets the item take up any remaining space.
- `shrink`: `ResponsiveValue<boolean>` — Lets the item shrink below its content size when space is tight.

## Differences from `@primer/react`

- Do not assume omitted `gap` means zero; it keeps the normal spacing default.
- Use the documented responsive values rather than dynamically constructed class names.
- Use `Stack.Item` for growth and shrink behavior, not child styled-system props.
- Keep `as="form"` on form layouts. `Stack`, `Stack.Item`, and the standalone `StackItem` forward the selected native element's props, events, and ref without adding a wrapper. Form-specific attributes (`action`, `method`, `encType`, and `acceptCharset`), React 19 function actions, `onSubmit`/`onChange` targets, and refs are typed for `HTMLFormElement`, so existing `FormData(event.currentTarget)` handlers require no casts or adapter. Default stacks render a `div` with a div ref; anchor layouts retain link props and anchor refs.

  ```tsx
  import React from 'react'
  import {Stack, type StackProps} from '@primer/react-tailwind/Stack'

  const ref = React.createRef<HTMLFormElement>()
  const props: StackProps<'form'> = {
    as: 'form',
    action: '/keys',
    method: 'post',
    ref,
    onSubmit(event) {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      saveKey(data)
    },
  }
  ;<Stack {...props} gap="normal">
    {formContents}
  </Stack>
  ```

  Use `StackProps<'form'>` or `StackItemProps<'form'>` for extracted form props instead of the default div prop type. A non-default type parameter requires a matching `as` value. For custom `as` components, required props and ref support follow that component's declaration; it must forward the class name, DOM props, children, and ref to its intended root. Stack owns layout only and does not add labeling, validation, submission handling, or focus management.

- `sx` and styled-system props are unsupported; use `className`.
- Intrinsic tag unions can be passed through `as` with layout props and `className`; narrow the tag when props or event targets require a particular native element.
