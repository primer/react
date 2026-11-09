# Alignment

## From: `@primer/react`

Legacy `Text` is a polymorphic typography component with `as`, `size`, `weight`, and `whiteSpace` options. Its CSS-module implementation uses `data-size`, `data-weight`, and `data-white-space` attributes, while shared styled-system props provide additional styling. Its whitespace API accepts kebab-case values such as `pre-wrap` and `pre-line`.

## To: `@primer/react-tailwind`

Tailwind `Text` keeps `as`, `size`, `weight`, and the kebab-case `whiteSpace` values while using Tailwind classes plus Primer tokens for explicit typography variants. When typography variants are omitted, values inherit from the surrounding content like the original implementation. Its default element remains `span`. Styling no longer depends on legacy CSS-module/data-attribute behavior. It remains a native presentational element, not a Base UI primitive, and omits styled-system customization.

## Migration notes

- Preserve core typography props and semantic `as` usage.
- Native props, event targets, and refs follow the selected `as` element. Keep real labels and table headers rather than replacing them with spans or casting their props: `as="label"` supports `htmlFor` and `HTMLLabelElement` refs/events; `as="th"` supports `scope`, `colSpan`, and `HTMLTableCellElement` refs/events. Both the root and `Text` subpath exports support this contract. Default Text remains a span and inherits typography when variants are omitted.

  ```tsx
  import React from 'react'
  import {Text, type TextProps} from '@primer/react-tailwind/Text'

  const labelRef = React.createRef<HTMLLabelElement>()
  const headerProps: TextProps<'th'> = {
    as: 'th',
    scope: 'col',
    ref: React.createRef<HTMLTableCellElement>(),
  }
  ;<Text as="label" htmlFor="phase-name" ref={labelRef}>
    Phase name
  </Text>
  ;<input id="phase-name" />
  ;<table>
    <thead>
      <tr>
        <Text {...headerProps} weight="semibold">
          Metric
        </Text>
      </tr>
    </thead>
  </table>
  ```

  Use `TextProps<'label'>`/`TextProps<'th'>` for extracted native props; the unparameterized type describes the default span. Non-default type arguments require a matching `as`. Custom components retain their required props and declared ref type and must forward the class name, DOM props, children, and ref to their intended root. Text supplies typography, not additional form behavior or ARIA semantics.

- Keep the original whitespace values, including `pre-wrap` and `pre-line`.
- Union-valued intrinsic `as` is supported, including a variable typed as `keyof React.JSX.IntrinsicElements` with `className`. Keep the consumer's chosen semantic tag rather than replacing it with a fixed span. Narrow the tag when an attribute or event target depends on a particular native element.
- Remove `sx`, styled-system props, and CSS-module selectors.
