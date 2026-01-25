# Enforce CSS Module Default Import (enforce-css-module-default-import)

CSS Modules should import only the default import. Avoid named imports which can often conflict with other variables (including the function name of the React component) when importing css modules.

Additionally, for consistency among the codebase the default import should be consistently named. This rule allows enforcing the name of the default import, which by default expects it to be named either `classes` or be suffixed `Classes`.

## Rule details

This rule disallows the use of any CSS Module property that does not match the desired casing.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/enforce-css-module-default-import: "error" */
import {Button} from '@primer/react'
import {Button as ButtonClass} from './some.module.css' // oops! Conflict!
```

```jsx
/* eslint primer-react/enforce-css-module-default-import: ["error",{enforceName:"^classes$"}] */
import {Button} from '@primer/react'
import classnames from './some.module.css' // This default import should match /^classes$/
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/enforce-css-module-default-import: "error" */
import {Button} from '@primer/react'
import classes from './some.module.css'
```

```jsx
/* eslint primer-react/enforce-css-module-default-import: ["error",{enforceName:"^classes$"}] */
import {Button} from '@primer/react'
import classes from './some.module.css'
```

```jsx
/* eslint primer-react/enforce-css-module-default-import: ["error",{enforceName:"(^classes$|Classes$)"}] */
import {Button} from '@primer/react'
import classes from './some.module.css'
import sharedClasses from './shared.module.css'
import utilClasses from './util.module.css'
```

## Options

- `enforceName` (default: `.*`)

  By default, the `enforce-css-module-default-import` rule will allow any name for the default export,
  however in the _recommended_ ruleset this is set to `(^classes$|Classes$)` meaning that the default
  export name must either be exactly `classes` or end in `Classes`, for example `sharedClasses`.
