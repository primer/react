# Text

`Text` applies Primer typography to inline or block text. Use `Heading` for section headings so that structure is conveyed semantically.

Import: `import {Text} from '@primer/react-tailwind/Text'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Text} from '@primer/react-tailwind/Text'
;<Text weight="semibold">octocat</Text>
```

## API notes

`size` accepts `small`, `medium`, or `large`. Typography inherits from the surrounding content when its props are omitted.

## Composition

Use `as` to retain the semantic element required by the surrounding content.

Props, event targets, and refs follow the chosen root: `as="label"` accepts `htmlFor`, and `as="th"` accepts `scope` and table-cell attributes. Extracted prop types use the same element, such as `TextProps<'label'>` or `TextProps<'th'>`. Custom components preserve their required props and declared ref type and must forward the typography class name, DOM props, children, and ref.

## Accessibility

Choose semantic text elements through `as`; typography should not replace document structure.

## Data attributes

The rendered element has `data-component="Text"`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `As` — Default `'span'`. Element to render. Its props, events, and ref follow the selected element. Element or component to render.
- `className`: `string`
- `size`: `TextSize` — Size from the Primer type scale.
- `weight`: `"light" | "medium" | "normal" | "semibold"` — Font weight.
- `whiteSpace`: `"normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap"` — How whitespace and line breaks in the content are treated.

## Differences from `@primer/react`

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
