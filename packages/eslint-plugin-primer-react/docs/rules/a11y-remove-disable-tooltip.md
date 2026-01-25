## Rule Details

This rule enforces to remove the `unsafeDisableTooltip` from `IconButton` component so that they have a tooltip by default. `unsafeDisableTooltip` prop is created for an incremental migration and should be removed once all icon buttons have a tooltip.

👎 Examples of **incorrect** code for this rule:

```jsx
import {IconButton} from '@primer/react'

const App = () => (
  <IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip />
  // OR
  <IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip={true} />
  // OR
  <IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip={false} /> // This is incorrect because it should be removed
)
```

👍 Examples of **correct** code for this rule:

```jsx
import {IconButton} from '@primer/react'

const App = () => <IconButton icon={SearchIcon} aria-label="Search" />
```
