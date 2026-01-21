## Require explicit heading level on `<Heading>` component

The `Heading` component does not require you to use `as` to specify the heading level, as it will default to an `h2` if
one isn't specified. This may lead to inaccessible usage if the default is out of order in the existing heading
hierarchy.

## Rule Details

This rule enforces using `as` on the `<Heading>` component to specify a heading level (`h1`-`h6`). In addition, it
enforces `as` usage to only be used for headings.

👎 Examples of **incorrect** code for this rule

```jsx
import {Heading} from '@primer/react'

function ExampleComponent() {
  return <Heading>Heading without explicit heading level</Heading>
}
```

`as` must only be for headings (`h1`-`h6`)

```jsx
import {Heading} from '@primer/react'

function ExampleComponent() {
  return <Heading as="span">Heading component used as "span"</Heading>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Heading} from '@primer/react'

function ExampleComponent() {
  return <Heading as="h2">Heading level 2</Heading>
}
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the `a11y-explicit-heading` rule will only check for `<Heading>` components imported directly from
  `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`.
