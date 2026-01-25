# No Deprecated Entrypoints

## Rule Details

This rule enforces the usage of non-deprecated entrypoints from `@primer/react`.

👎 Examples of **incorrect** code for this rule

```jsx
import {DataTable} from '@primer/react/drafts'

function ExampleComponent() {
  return <DataTable>{/* ... */}</DataTable>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {ExampleComponent} from '@primer/react/experimental'

function ExampleComponent() {
  return <DataTable>{/* ... */}</DataTable>
}
```
