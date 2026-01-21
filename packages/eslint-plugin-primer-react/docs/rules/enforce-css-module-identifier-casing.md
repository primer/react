# Enforce CSS Module Identifier Casing (enforce-css-module-identifier-casing)

CSS Modules should expose class names written in PascalCase.

## Rule details

This rule disallows the use of any CSS Module property that does not match the desired casing.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/enforce-css-module-identifier-casing: "error" */
import {Button} from '@primer/react'
import classes from './some.module.css'

<Button className={classes.button} />
<Button className={classes['button']} />
<Button className={clsx(classes.button)} />

let ButtonClass = "button"
<Button className={clsx(classes[ButtonClass])} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/enforce-css-module-identifier-casing: "error" */
import {Button} from '@primer/react'
import classes from './some.module.css'
;<Button className={classes.Button} />
```

## Options

- `casing` (default: `'pascal'`)

  By default, the `enforce-css-module-identifier-casing` rule will check for identifiers matching PascalCase.
  Changing this to `'camel'` will instead enforce camelCasing rules. Changing this to `'kebab'` will instead
  enforce kebab-casing rules.
