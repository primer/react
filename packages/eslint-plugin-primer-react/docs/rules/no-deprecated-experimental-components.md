# No deprecated experimental components

## Rule Details

This rule discourages the usage of specific imports from `@primer/react/experimental`.

👎 Examples of **incorrect** code for this rule

```jsx
import {SelectPanel} from '@primer/react/experimental'

function ExampleComponent() {
  return <SelectPanel />
}
```

👍 Examples of **correct** code for this rule:

You can satisfy the rule by either converting to the non-experimental version:

```jsx
import {SelectPanel} from '@primer/react'

function ExampleComponent() {
  return <SelectPanel />
}
```

Or by removing usage of the component.
