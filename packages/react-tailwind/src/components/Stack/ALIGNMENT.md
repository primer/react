# Alignment

## From: `@primer/react`

Legacy Stack is a layout primitive with normal default spacing and responsive direction, alignment, wrapping, spacing, padding, and item growth controls.

## To: `@primer/react-tailwind`

Stack remains a presentational flex layout with `gap`, `direction`, `align`, `wrap`, `justify`, padding options, and `Stack.Item` grow/shrink controls. It preserves the default normal spacing and supported responsive behavior using static Tailwind utilities, including the complete `none` through `spacious` padding scale. It does not use Base UI.

## Migration notes

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
