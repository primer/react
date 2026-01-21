## Rule Details

This rule enforces to use interactive elements as tooltip triggers. Interactive elements can be Primer `Button`,
`IconButton` and `Link` components or native elements like `button`, `a` with an `href` attribute, `select`, `textarea`,
`summary` and `input` (that is not a `hidden` type).

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/a11y-tooltip-interactive-trigger: "error" */
import {Tooltip} from '@primer/react'

const App = () => (
  <Tooltip text="Tooltip text">
    <div>Tooltip trigger</div>
  </Tooltip>
)
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/a11y-tooltip-interactive-trigger: "error" */
import {Tooltip, Button} from '@primer/react'

const App = () => (
  <Tooltip text="Supplementary text" type="description">
    <Button
      onClick={() => {
        /* do something */
      }}
    >
      Save
    </Button>
  </Tooltip>
)
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the `a11y-tooltip-interactive-trigger` rule will only check for interactive elements in components that
  are imported from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`. This is used
  for internal linting in the [primer/react](https://github.com/prime/react) repository.
