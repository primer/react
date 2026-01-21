# Disallow use of styled-system props (no-system-props)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can
automatically fix some of the problems reported by this rule.

[Styled-system](https://styled-system.com/table) props are deprecated in Primer components (excluding utility
components).

## Rule details

This rule disallows the use of any styled-system prop on Primer components, as the `sx` prop is now the prefered way to
apply additional styling.

\*The two non-deprecated utility components (`Box` and `Text`) are allowed to use system props.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-system-props: "error" */
import {Button} from '@primer/react'

<Button width={200} />
<Button width={200} sx={{height: 300}} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-system-props: "error" */
import {Box, Button, ProgressBar} from '@primer/react'
import {Avatar} from 'some-other-library'
// Non-system props are allowed
<Button someOtherProp="foo" />
// If you need to override styles, use the `sx` prop instead of system props
<Button sx={{mr: 2}} />
// Some component prop names overlap with styled-system prop names.
// These props are still allowed
<ProgressBar bg="success.emphasis" />
// Utility components like Box and Text still accept system props
<Box mr={2} />
// System props passed to non-Primer components are allowed
<Avatar mr={2} />
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the `no-system-props` rule will only check for styled system props used in functions and components that
  are imported from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`. This is
  useful for linting custom components that pass styled system props down to Primer React components.

- `includeUtilityComponents` (default: `false`)

  By default, `Box` and `Text` are excluded because styled system props are not deprecated in our utility components. If
  you prefer to avoid styled system props there as well for consistency, you can set `includeUtilityComponents` to
  `true`.

  ```js
  /* eslint primer-react/no-system-props: ["warn", {"includeUtilityComponents": true}] */
  import {Box} from '@primer/react'

  function App() {
    // Enabling `includeUtilityComponents` will find system prop usage on utility components like this:
    return <Box width={200} />
  }
  ```
