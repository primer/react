---
componentId: underline_nav
title: UnderlineNav (legacy)
status: Deprecated
---

import data from '../../src/deprecated/UnderlineNav.docs.json'

Use the UnderlineNav component to style navigation with a minimal underlined selected state, typically used for navigation placed at the top of the page.

## Deprecation

Use [the new version of UnderlineNav](/UnderlineNav) with design updated and accessibility improvements.

**Before**

```jsx
<UnderlineNav aria-label="Main">
  <UnderlineNav.Link href="#home" selected>
    Home
  </UnderlineNav.Link>
  <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
  <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
</UnderlineNav>
```

**After**

```jsx
<UnderlineNav aria-label="Repository">
  <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
  <UnderlineNav.Item>Issues</UnderlineNav.Item>
  <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
</UnderlineNav>
```

Or continue using the deprecated API:

```js
import UnderlineNav from '@primer/react/deprecated'
```

To use UnderlineNav with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
`as={NavLink}` and omit the `selected` prop.
This ensures that the NavLink gets `activeClassName='selected'`

**Attention:** Make sure to properly label your `UnderlineNav` with an `aria-label` to provide context about the type of navigation contained in `UnderlineNav`.

## Default example

```jsx live deprecated
<UnderlineNav aria-label="Main">
  <UnderlineNav.Link href="#home" selected>
    Home
  </UnderlineNav.Link>
  <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
  <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
</UnderlineNav>
```

## Component props

<ComponentProps data={data} />
