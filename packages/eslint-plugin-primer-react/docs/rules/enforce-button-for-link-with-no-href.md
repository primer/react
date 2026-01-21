# Enforce Button for Link with No href (enforce-button-for-link-with-no-href)

Primer's `Link` component enables users to navigate between pages. Rendering it without an `href` makes the element behave like a button without the correct semantics, which negatively impacts accessibility. Use the `Button` component to trigger an action, or ensure the `Link` has a valid `href`.

## Rule details

This rule reports any `Link` from `@primer/react` that does not include an `href` prop.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/enforce-button-for-link-with-no-href: "error" */
import {Link} from '@primer/react'
;<Link onClick={handleClick}>Save changes</Link>
```

```jsx
/* eslint primer-react/enforce-button-for-link-with-no-href: "error" */
import {Link} from '@primer/react'
;<Link className="text-right">Learn more</Link>
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/enforce-button-for-link-with-no-href: "error" */
import {Link} from '@primer/react'
;<Link href="https://primer.style/react">Read the docs</Link>
```

```jsx
/* eslint primer-react/enforce-button-for-link-with-no-href: "error" */
import {Button, Link} from '@primer/react'

<Button onClick={handleClick}>Save changes</Button>
<Link href={issueUrl}>View issue</Link>
```

## Options

This rule has no options.
