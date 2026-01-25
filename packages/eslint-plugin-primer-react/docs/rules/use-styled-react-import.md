# use-styled-react-import

💼 This rule is _disabled_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce importing components that use `sx` prop from `@primer/styled-react` instead of `@primer/react`, and vice versa.

## Rule Details

This rule detects when certain Primer React components are used with the `sx` prop and ensures they are imported from the temporary `@primer/styled-react` package instead of `@primer/react`. When the same components are used without the `sx` prop, it ensures they are imported from `@primer/react` instead of `@primer/styled-react`.

When a component is used with the `sx` prop anywhere in the file, the entire component import is moved to `@primer/styled-react`, simplifying the import structure.

It also moves certain types and utilities to the styled-react package.

### Components that should be imported from `@primer/styled-react` when used with `sx`:

- ActionList
- ActionMenu
- Box
- Breadcrumbs
- Button
- Flash
- FormControl
- Heading
- IconButton
- Label
- Link
- LinkButton
- PageLayout
- Text
- TextInput
- Truncate
- Octicon
- Dialog

### Types and utilities that should always be imported from `@primer/styled-react`:

- `BoxProps` (type)
- `SxProp` (type)
- `BetterSystemStyleObject` (type)
- `sx` (utility)

## Examples

### ❌ Incorrect

```jsx
import {Button, Link} from '@primer/react'

const Component = () => <Button sx={{color: 'red'}}>Click me</Button>
```

```jsx
import {Box} from '@primer/react'

const Component = () => <Box sx={{padding: 2}}>Content</Box>
```

```jsx
import {sx} from '@primer/react'
```

```jsx
import {Button} from '@primer/styled-react'

const Component = () => <Button>Click me</Button>
```

```jsx
import {Button} from '@primer/react'

const Component1 = () => <Button>Click me</Button>
const Component2 = () => <Button sx={{color: 'red'}}>Styled me</Button>
```

### ✅ Correct

```jsx
import {Link} from '@primer/react'
import {Button} from '@primer/styled-react'

const Component = () => <Button sx={{color: 'red'}}>Click me</Button>
```

```jsx
import {Box} from '@primer/styled-react'

const Component = () => <Box sx={{padding: 2}}>Content</Box>
```

```jsx
import {sx} from '@primer/styled-react'
```

```jsx
// Components without sx prop can stay in @primer/react
import {Button} from '@primer/react'

const Component = () => <Button>Click me</Button>
```

```jsx
// Components imported from styled-react but used without sx prop should be moved back
import {Button} from '@primer/react'

const Component = () => <Button>Click me</Button>
```

```jsx
// When a component is used with sx prop anywhere, import from styled-react
import {Button} from '@primer/styled-react'

const Component1 = () => <Button>Click me</Button>
const Component2 = () => <Button sx={{color: 'red'}}>Styled me</Button>
```

## Options

This rule accepts an optional configuration object with the following properties:

- `styledComponents` (array of strings): Components that should be imported from `@primer/styled-react` when used with `sx` prop. Defaults to the list shown above.
- `styledTypes` (array of strings): Types that should always be imported from `@primer/styled-react`. Defaults to `['BoxProps', 'SxProp', 'BetterSystemStyleObject']`.
- `styledUtilities` (array of strings): Utilities that should always be imported from `@primer/styled-react`. Defaults to `['sx']`.

### Example Configuration

```json
{
  "rules": {
    "@primer/primer-react/use-styled-react-import": [
      "error",
      {
        "styledComponents": ["Button", "Box", "CustomComponent"],
        "styledTypes": ["BoxProps", "CustomProps"],
        "styledUtilities": ["sx", "customSx"]
      }
    ]
  }
}
```

### Configuration Examples

#### ❌ Incorrect with custom configuration

```jsx
// With styledComponents: ["CustomButton"]
import {CustomButton} from '@primer/react'

const Component = () => <CustomButton sx={{color: 'red'}}>Click me</CustomButton>
```

#### ✅ Correct with custom configuration

```jsx
// With styledComponents: ["CustomButton"]
import {CustomButton} from '@primer/styled-react'

const Component = () => <CustomButton sx={{color: 'red'}}>Click me</CustomButton>
```

```jsx
// Box is not in custom styledComponents list, so it can be used with sx from @primer/react
import {Box} from '@primer/react'

const Component = () => <Box sx={{color: 'red'}}>Content</Box>
```

## When Not To Use It

This rule is specifically for migrating components that use the `sx` prop to the temporary `@primer/styled-react` package. If you're not using the `sx` prop or not participating in this migration, you can disable this rule.
