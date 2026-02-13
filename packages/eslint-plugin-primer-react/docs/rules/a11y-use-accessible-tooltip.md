# Recommends to use the new accessible tooltip instead of the deprecated one.

## Rule details

This rule suggests switching to the new accessible tooltip from @primer/react instead of the deprecated version. Deprecated props like wrap, noDelay, and align should also be removed.

Note that the new tooltip is intended for interactive elements only, such as buttons and links, whereas the deprecated tooltip could be applied to any element, though it lacks screen reader accessibility. As a result, the autofix for this rule will only work if the deprecated tooltip is on an interactive element. If it is applied to a non-interactive element, please consult your design team for [an alternative approach](https://primer.style/guides/accessibility/tooltip-alternatives).

👎 Examples of **incorrect** code for this rule:

```jsx
import {Tooltip} from '@primer/react/deprecated'

const App = () => (
  <Tooltip aria-label="This change cannot be undone" direction="w" wrap={true} noDelay={true} align="left">
    <Button onClick={onClick}>Delete</Button>
  </Tooltip>
)
```

👍 Examples of **correct** code for this rule:

```jsx
import {Tooltip} from '@primer/react'

const App = () => (
  <Tooltip text="This change cannot be undone" direction="w">
    <Button onClick={onClick}>Delete</Button>
  </Tooltip>
)
```

## Icon buttons and tooltips

Even though the below code is perfectly valid, since icon buttons now come with tooltips by default, it is not required to explicitly use the Tooltip component on icon buttons.

```jsx
import {IconButton, Tooltip} from '@primer/react'

function ExampleComponent() {
  return (
    <Tooltip text="Search" direction="e">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  )
}
```
