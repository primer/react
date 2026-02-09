# Disallow unnecessary use of `Box` and `Text` components (no-unnecessary-components)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can
automatically fix some of the problems reported by this rule.

## Rule details

The [`Box`](https://primer.style/components/box) and [`Text`](https://primer.style/components/text)
Primer React components are utilities that exist solely to provide access to `sx` or styled-system
props.

If these props are not being used, plain HTML element provide better performance, simpler code,
and improved linting support.

This rule is auto-fixable in nearly all cases. Autofixing respects the presence of an `as` prop.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-unnecessary-components: "error" */
import {Box, Text} from '@primer/react'

<Box>Content</Box>
<Box style={{padding: '16px'}} className="danger-box">Content</Box>
<Box as="section">Content</Box>

<Text>Content</Text>
<Text style={{fontSize: '24px'}} className="large-text">Content</Text>
<Text as="p">Content</Text>
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-system-props: "error" */
import {Box, Text} from '@primer/react'

// Prefer plain HTML elements (autofixable)
<div>Content</div>
<div style={{padding: '16px'}} className="danger-box">Content</div>
<section>Content</section>

<span>Content</span>
<span style={{fontSize: '24px'}} className="large-text">Content</span>
<p>Content</p>

// sx props are allowed
<Box sx={{p: 2}}>Content</Box>
<Text sx={{mt: 2}} as="p">Content</Text>

// styled-system props are allowed
<Box p={2}>Content</Box>
<Text mt={2} as="p">Content</Text>
```

```jsx
/* eslint primer-react/no-system-props: ["error", {skipImportCheck: false}] */
import {Box, Text} from '@primer/brand'

// Other components with the same name are allowed
<Box>Content</Box>
<Text>Content</Text>
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the rule will only check for incorrect uses of `Box` and `Text` components that are are imported from `@primer/react`. You can disable this behavior (checking all components with these names regardless of import source) by setting `skipImportCheck` to `true`.
