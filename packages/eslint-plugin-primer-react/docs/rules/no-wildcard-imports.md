# No Wildcard Imports

## Rule Details

This rule enforces that no wildcard imports are used from `@primer/react`.

👎 Examples of **incorrect** code for this rule

```jsx
import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'

function ExampleComponent() {
  return <Dialog>{/* ... */}</Dialog>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Dialog} from '@primer/react/experimental'

function ExampleComponent() {
  return <Dialog>{/* ... */}</Dialog>
}
```
