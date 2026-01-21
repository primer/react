# Use Deprecated from Deprecated

## Rule Details

This rule enforces the usage of deprecated imports from `@primer/react/deprecated`.

👎 Examples of **incorrect** code for this rule

```jsx
import {Dialog} from '@primer/react'

function ExampleComponent() {
  return <Dialog>{/* ... */}</Dialog>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Dialog} from '@primer/react/deprecated'

function ExampleComponent() {
  return <Dialog>{/* ... */}</Dialog>
}
```
